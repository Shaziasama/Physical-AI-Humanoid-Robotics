---
sidebar_position: 1
---

# Module 1: The Robotic Nervous System (ROS 2)

Welcome to the foundational module of our journey into Physical AI and Humanoid Robotics. Before we can make a robot see, think, or act, we must first build its nervous system. In modern robotics, this nervous system is the **Robot Operating System (ROS)**, specifically its second iteration, **ROS 2**.

Think of ROS 2 as the digital backbone that allows different parts of a robot's software and hardware to communicate seamlessly. It’s the framework that enables a sensor in the hand to send data to a planning algorithm in the "brain," which in turn commands a motor in the leg. Without it, we'd be writing bespoke, monolithic code for every robot—a slow, brittle, and unscalable process.

In this module, we will dissect the three fundamental concepts of ROS 2 communication: **Nodes**, **Topics**, and **Services**.

---

## 1. ROS 2 Nodes: The Brain Cells

A ROS 2 system is a distributed network of processes called **Nodes**. Each node is a small, independent program responsible for a single, well-defined task. This modularity is the cornerstone of ROS 2's power and flexibility.

- **A camera node** might be responsible for capturing images.
- **An image processing node** might subscribe to those images to detect objects.
- **A navigation node** might use object data to plan a path.
- **A motor control node** might execute the path by commanding the robot's wheels or legs.

This separation of concerns makes the system easier to debug, test, and reuse. If you want to upgrade your camera, you only need to change the camera node; the rest of the system remains untouched.

### Visualizing the Node Graph

Imagine these nodes as individual brain cells connected in a network. This is often called the "computation graph."

```text
                  ┌───────────────────┐
                  │ /camera_driver    │ (Node)
                  └─────────┬─────────┘
                            │
                            │ (Image Data)
                            ▼
┌───────────────────┐     ┌───────────────────┐
│ /object_detector  │ ◀───▶ │ /path_planner   │ (Nodes)
└─────────┬─────────┘     └─────────┬─────────┘
          │                         │
          │ (Object Locations)      │ (Motor Commands)
          ▼                         ▼
┌───────────────────┐     ┌───────────────────┐
│ /user_interface   │     │ /motor_controller │ (Nodes)
└───────────────────┘     └───────────────────┘
```

### Creating a Simple ROS 2 Node (Python)

Let's create our first node using `rclpy`, the official ROS 2 Python client library. This node will simply print a message to the console.

```python title="my_first_node.py"
import rclpy
from rclpy.node import Node

class MyFirstNode(Node):
    """
    A simple ROS 2 node that prints a log message.
    """
    def __init__(self):
        # Call the constructor of the parent class (Node)
        super().__init__('my_first_node')
        # Log a message to the ROS 2 logging system
        self.get_logger().info('Hello, ROS 2 World!')

def main(args=None):
    # Initialize the rclpy library
    rclpy.init(args=args)

    # Create an instance of our node
    my_node = MyFirstNode()

    # The spin function keeps the node alive and responsive to ROS events.
    # In this case, it just keeps our node from exiting immediately.
    rclpy.spin(my_node)

    # Cleanly destroy the node and shutdown rclpy
    my_node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

To run this, you would save it as a Python file, source your ROS 2 environment, and run it with `python3 my_first_node.py`. The node `my_first_node` will start and print its greeting.

---

## 2. ROS 2 Topics: The Data Streams

Nodes are useful, but they need to exchange data. The most common way to do this in ROS 2 is through **Topics**.

A Topic is a named bus—a channel for continuous, one-way data streams. Nodes can **publish** (send) data to a topic or **subscribe** (receive) data from it. This creates a powerful, decoupled **Publish-Subscribe (Pub/Sub)** communication model.

- **Many-to-Many:** Multiple nodes can publish to the same topic, and multiple nodes can subscribe to it.
- **Decoupled:** The publisher doesn't know or care who is subscribing. The subscriber doesn't know who is publishing. They only need to agree on the topic name and the **message type**.
- **Asynchronous:** Publishers send data whenever they have it. Subscribers process it whenever they receive it.

### Message Types

Every topic has a strictly defined data structure, called a **message type**. These are defined in `.msg` files. ROS 2 provides a rich set of standard messages (`std_msgs`, `sensor_msgs`, `geometry_msgs`), and you can easily define your own.

For example, `std_msgs/msg/String` is a simple message type containing a single `data` field of type string. A `sensor_msgs/msg/Imu` message is much more complex, containing fields for orientation, angular velocity, and linear acceleration.

### Example: A Publisher and Subscriber

Let's expand our example. We'll create a `talker` node that publishes string messages to a `/chatter` topic, and a `listener` node that subscribes to it.

```python title="talker_node.py"
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class TalkerNode(Node):
    def __init__(self):
        super().__init__('talker_node')
        # Create a publisher on the '/chatter' topic with message type String
        self.publisher_ = self.create_publisher(String, 'chatter', 10)
        # Create a timer that calls the timer_callback function every 0.5 seconds
        self.timer = self.create_timer(0.5, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = f'Hello from talker: {self.i}'
        # Publish the message
        self.publisher_.publish(msg)
        # Log the published message
        self.get_logger().info(f'Publishing: "{msg.data}"')
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    talker_node = TalkerNode()
    rclpy.spin(talker_node)
    talker_node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

```python title="listener_node.py"
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class ListenerNode(Node):
    def __init__(self):
        super().__init__('listener_node')
        # Create a subscription to the '/chatter' topic
        self.subscription = self.create_subscription(
            String,
            'chatter',
            self.listener_callback,
            10) # 10 is the QoS history depth

    def listener_callback(self, msg):
        # This function is called every time a message is received
        self.get_logger().info(f'I heard: "{msg.data}"')

def main(args=None):
    rclpy.init(args=args)
    listener_node = ListenerNode()
    rclpy.spin(listener_node)
    listener_node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

If you run both nodes in separate terminals, you'll see the talker publishing messages and the listener receiving them, demonstrating the core Pub/Sub pattern.

---

## 3. ROS 2 Services: The Request-Response Mechanism

While Topics are great for continuous data streams, sometimes you need a synchronous, request-response interaction. For this, ROS 2 provides **Services**.

A Service is defined by a pair of messages: a **request** and a **response**.

- A **Service Client** node sends a request message.
- A **Service Server** node receives the request, performs some work, and sends back a response message.

This is a two-way, synchronous communication pattern. The client sends a request and *waits* until it receives a response from the server.

### Use Cases for Services

- **Triggering an action:** A client could request a robotic arm to move to a specific named position (e.g., "home" or "stow").
- **Querying state:** A client could ask a node for its current configuration or status.
- **Performing a calculation:** A client could send two numbers to a service that returns their sum.

### Example: An "Add Two Ints" Service

Let's create a service that adds two integers. First, we need a service definition file.

```srv title="AddTwoInts.srv"
# Request
int64 a
int64 b
---
# Response
int64 sum
```

Now, we can implement the server and client nodes.

```python title="add_two_ints_server.py"
import rclpy
from rclpy.node import Node
# We need to import our custom service type
from example_interfaces.srv import AddTwoInts

class AddTwoIntsServer(Node):
    def __init__(self):
        super().__init__('add_two_ints_server')
        # Create the service server
        self.srv = self.create_service(AddTwoInts, 'add_two_ints', self.add_two_ints_callback)

    def add_two_ints_callback(self, request, response):
        # The request and response objects are created for us
        response.sum = request.a + request.b
        self.get_logger().info(f'Incoming request: a={request.a}, b={request.b}. Returning sum={response.sum}')
        # Return the response
        return response

def main(args=None):
    rclpy.init(args=args)
    server_node = AddTwoIntsServer()
    rclpy.spin(server_node)
    server_node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

```python title="add_two_ints_client.py"
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts

class AddTwoIntsClient(Node):
    def __init__(self):
        super().__init__('add_two_ints_client')
        # Create the service client
        self.client = self.create_client(AddTwoInts, 'add_two_ints')
        # Wait for the service to be available
        while not self.client.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Service not available, waiting again...')
        # Create a request object
        self.req = AddTwoInts.Request()

    def send_request(self, a, b):
        self.req.a = a
        self.req.b = b
        # Call the service asynchronously
        self.future = self.client.call_async(self.req)
        # We can add a callback to be executed when the future is complete
        self.future.add_done_callback(self.response_callback)

    def response_callback(self, future):
        try:
            response = future.result()
            self.get_logger().info(f'Result of add_two_ints: {self.req.a} + {self.req.b} = {response.sum}')
        except Exception as e:
            self.get_logger().error(f'Service call failed: {e}')

def main(args=None):
    rclpy.init(args=args)
    client_node = AddTwoIntsClient()
    client_node.send_request(5, 10)

    # Spin until the future is complete
    while rclpy.ok() and not client_node.future.done():
        rclpy.spin_once(client_node)

    client_node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

When you run the server and then the client, the client will send the numbers 5 and 10 to the server, which will compute the sum and send it back. The client will then log the result.

---

## Summary Table

| Concept  | Communication Pattern | Analogy                 | Key Characteristics                                | When to Use                                             |
|----------|-----------------------|-------------------------|----------------------------------------------------|---------------------------------------------------------|
| **Node** | -                     | Brain Cell / Microservice | Independent, reusable, single-purpose process        | For encapsulating any piece of robotic functionality.   |
| **Topic**| Publish-Subscribe     | Radio Broadcast / Stream  | One-way, asynchronous, many-to-many, decoupled     | For continuous data streams (sensor data, state updates). |
| **Service**| Request-Response      | Function Call / API     | Two-way, synchronous, one-to-one (typically)       | For triggering actions or querying state on demand.     |

By mastering these three concepts, you have unlocked the fundamental building blocks of any ROS 2 application. You can now create complex robotic behaviors by composing simple, independent nodes that communicate through well-defined topics and services. In the next section, we will explore how to structure these nodes as "Python Agents" to create more intelligent systems.
