---
sidebar_position: 2
---

# Module 2: Python Agents and ROS

In the previous module, we learned about the fundamental building blocks of ROS 2: Nodes, Topics, and Services. Now, we'll elevate our approach by thinking about nodes not just as simple programs, but as intelligent **Agents**.

An "Agent" in the context of AI is an entity that perceives its environment through sensors and acts upon that environment through actuators. This paradigm fits perfectly with ROS 2. A ROS 2 node can be designed as an agent that:
- **Perceives:** Subscribes to topics (e.g., `/camera/image_raw`, `/imu/data`) to sense the world.
- **Decides:** Processes the perceived data, applies logic or an AI model, and makes a decision.
- **Acts:** Publishes messages to command topics (e.g., `/cmd_vel`, `/arm_controller/joint_trajectory`) or calls services to effect change.

This agent-based design promotes a higher level of abstraction and is key to bridging the gap between low-level robot control and high-level AI decision-making.

---

## 1. The Agent Mindset in ROS 2

Let's re-imagine a simple robotics task: making a robot move forward until it detects an obstacle.

**Traditional ROS Node Approach:**
- A `laser_scanner` node publishes `/scan` data.
- An `obstacle_avoider` node subscribes to `/scan`. If an obstacle is too close, it publishes a `Twist` message with zero velocity to `/cmd_vel`.
- A `robot_driver` node subscribes to `/cmd_vel` and translates `Twist` messages into motor commands.

**Python Agent Approach:**
We can encapsulate this logic into a single, more intelligent `PatrolAgent` node.

```python
class PatrolAgent(Node):
    def __init__(self):
        super().__init__('patrol_agent')
        # Perception: Subscribe to laser scan data
        self.perception_sub = self.create_subscription(
            LaserScan,
            '/scan',
            self.perception_callback,
            10)
        
        # Action: Publish velocity commands
        self.action_pub = self.create_publisher(Twist, '/cmd_vel', 10)

        # Internal State & Decision Making
        self.obstacle_detected = False
        self.decision_timer = self.create_timer(0.1, self.decision_loop)

    def perception_callback(self, msg):
        # Process sensor data to update internal state
        min_distance = min(msg.ranges)
        if min_distance < 0.5: # Obstacle threshold of 50cm
            self.obstacle_detected = True
            self.get_logger().warn('Obstacle DETECTED!')
        else:
            self.obstacle_detected = False

    def decision_loop(self):
        # The core "brain" of the agent
        cmd = Twist()
        if self.obstacle_detected:
            # Decision: Stop
            cmd.linear.x = 0.0
            cmd.angular.z = 0.0
            self.get_logger().info('Action: STOPPING')
        else:
            # Decision: Move forward
            cmd.linear.x = 0.2 # Move forward at 0.2 m/s
            cmd.angular.z = 0.0
            self.get_logger().info('Action: MOVING FORWARD')
        
        # Act: Execute the decision
        self.action_pub.publish(cmd)
```

In this structure:
- `perception_callback` is the **Perception** function. It updates the agent's internal belief about the world.
- `decision_loop` is the **Decision** function. It runs periodically, checks the agent's state, and decides on an action.
- `self.action_pub.publish(cmd)` is the **Action**.

This agent-based pattern is incredibly scalable. The `decision_loop` can be replaced with a complex neural network, a connection to a large language model, or a sophisticated planning algorithm without changing the basic structure.

---

## 2. Connecting Agents to ROS 2 Controllers

Most real robots don't directly accept `/cmd_vel`. Instead, they use a standardized framework called `ros2_control`. This framework provides a structured way to manage and communicate with robot hardware.

**Key Concepts of `ros2_control`:**
- **Controller Manager:** A central ROS 2 node that loads, starts, and stops different controllers.
- **Controllers:** Specialized nodes that implement a specific control strategy (e.g., `joint_trajectory_controller`, `diff_drive_controller`).
- **Hardware Interfaces:** Abstract layers that `ros2_control` uses to communicate with the actual robot hardware (e.g., sending joint angles, reading encoder values).

Our Python agent doesn't need to know about the low-level hardware details. It just needs to publish to the topic that the appropriate controller is listening to.

### Example: Controlling a Robotic Arm

Let's say we have a 6-DOF robotic arm controlled by a `joint_trajectory_controller`. This controller typically exposes a topic like `/arm_controller/joint_trajectory` which accepts messages of type `trajectory_msgs/msg/JointTrajectory`.

Our agent's job is to decide on a goal position and publish it as a valid trajectory message.

```text
┌────────────────────┐
│   MyPlanningAgent  │
└─────────┬──────────┘
          │ (publishes JointTrajectory message)
          │
          ▼
┌──────────────────────────────────────────┐
│ /arm_controller/joint_trajectory (Topic) │
└──────────────────┬───────────────────────┘
                   │ (subscribed by the controller)
                   │
                   ▼
┌──────────────────────────────────────────┐
│ `ros2_control` JointTrajectoryController │
└──────────────────┬───────────────────────┘
                   │ (sends low-level commands)
                   │
                   ▼
┌──────────────────────────────────────────┐
│         Robot Hardware Interface         │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│              Physical Robot Arm          │
└──────────────────────────────────────────┘
```

Here's how our `PlanningAgent` might look:

```python
import rclpy
from rclpy.node import Node
from trajectory_msgs.msg import JointTrajectory, JointTrajectoryPoint
from builtin_interfaces.msg import Duration

class PlanningAgent(Node):
    def __init__(self):
        super().__init__('planning_agent')
        # Action: Publisher for the arm controller
        self.arm_publisher = self.create_publisher(
            JointTrajectory,
            '/arm_controller/joint_trajectory',
            10)
        
        self.get_logger().info('Planning Agent is ready. Sending goal in 2 seconds...')
        # For demonstration, we send a command after a short delay
        self.create_timer(2.0, self.send_goal_command)

    def send_goal_command(self):
        # This is our "decision" - move the arm to a predefined position.
        # In a real agent, this would come from a complex planner.

        trajectory_msg = JointTrajectory()
        trajectory_msg.joint_names = [
            'joint_1', 'joint_2', 'joint_3',
            'joint_4', 'joint_5', 'joint_6'
        ]

        # Create a trajectory point
        point = JointTrajectoryPoint()
        point.positions = [0.5, -0.5, 0.5, -0.5, 0.5, 0.0] # Target joint angles in radians
        point.time_from_start = Duration(sec=4, nanosec=0) # Reach this point in 4 seconds

        trajectory_msg.points.append(point)

        self.get_logger().info('Action: Publishing arm goal trajectory.')
        self.arm_publisher.publish(trajectory_msg)

        # In a real app, we might want to shut down after sending one command.
        # For this example, we'll just let it run.
        # To make it a one-shot, you could cancel the timer and shutdown.

def main(args=None):
    rclpy.init(args=args)
    agent = PlanningAgent()
    rclpy.spin(agent)
    agent.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Key Takeaways for Agents and Controllers:
1.  **High-Level Commands:** The agent's responsibility is to generate *high-level goals* (e.g., "move hand to this XYZ position", "drive this path").
2.  **Controller's Responsibility:** The `ros2_control` controller's job is to take that high-level goal and compute the low-level commands (e.g., motor voltages, PID loops) required to achieve it safely and smoothly.
3.  **The Interface is the Topic:** The communication contract between your agent and the robot's controllers is simply a ROS 2 Topic (or Service/Action). As long as your agent sends correctly formatted messages, it can control the robot.

This separation is critical for building robust and portable robotic systems. You can develop and test your AI agent in a simulation with a simulated controller, and then deploy the *exact same agent code* to a physical robot that uses the `ros2_control` framework. The agent doesn't change, only the underlying controller implementation does.

In the next section, we will define the physical structure of our robot itself using the Unified Robot Description Format (URDF). This description is what allows tools like `ros2_control` and simulators to understand the robot's physical properties.
