---
sidebar_position: 4
---

# Module 4: Nav2 Planning for Humanoids

We've given our robot a digital twin, a powerful vision system, and a VSLAM algorithm to tell it where it is. Now, we need to give it a "brain" for navigation. How does it get from point A to point B safely and efficiently?

In the ROS 2 ecosystem, the premier solution for autonomous navigation is the **Navigation2 stack**, commonly known as **Nav2**. It's a highly modular, feature-rich framework that provides everything a robot needs to navigate an environment, from global path planning to local obstacle avoidance.

While Nav2 was originally designed for wheeled mobile robots, its flexible architecture allows it to be adapted for more complex robots, including humanoids.

---

## 1. The Nav2 Architecture

Nav2 is not a single node, but a collection of specialized servers, lifecycle managers, and plugins that work in concert.

**High-Level Diagram:**
```text
            ┌─────────────────────┐
            │   Behavior Tree     │ (High-level logic, e.g., "GoToPose")
            └─────────┬───────────┘
                      │
     ┌────────────────┴──────────────────┐
     │                │                  │
     ▼                ▼                  ▼
┌─────────┐      ┌──────────┐      ┌───────────┐
│ Planner │      │ Controller │      │ Recovery  │ (Servers)
└────┬────┘      └─────┬────┘      └─────┬─────┘
     │ (Global Path)   │ (Local Cmds)    │ (Recovery Behaviors)
     │                 │                 │
     └─────────┐       │       ┌─────────┘
               │       │       │
               ▼       ▼       ▼
            ┌─────────────────────┐
            │       Costmaps        │ (Global and Local)
            └──────────┬──────────┘
                       │
┌──────────────────────┴───────────────────────┐
│ Sensor Data (/scan, /imu) & Pose Data (/tf)   │
└─────────────────────────────────────────────┘
```

**Core Components:**
- **BT Navigator:** The entry point. It takes a high-level goal (e.g., a target pose) and uses a Behavior Tree to orchestrate the entire navigation process.
- **Planner Server:** Responsible for finding a long-range, global path from the robot's current position to the goal. It operates on a **Global Costmap**. Common planners include A* and SMAC Planner.
- **Controller Server:** Responsible for executing the global plan. It looks at a small window of the path and generates immediate, short-term velocity commands to follow it while avoiding local obstacles. It operates on a **Local Costmap**. Common controllers include DWB and TEB.
- **Recovery Server:** If the robot gets stuck, this server is triggered to execute recovery behaviors, like clearing the costmap, spinning in place, or backing up.
- **Costmaps (Global & Local):** These are the key data structures that Nav2 uses for planning. A costmap is a 2D grid that represents the "cost" of traversing any cell in the environment.
  - **Static Layer:** Built from the initial map provided by SLAM.
  - **Obstacle Layer:** Dynamically updated with real-time sensor data (e.g., from LiDAR) to represent moving and new obstacles.
  - **Inflation Layer:** "Pads" the obstacles with a decaying cost function, ensuring the robot keeps a safe distance from walls and objects.

---

## 2. Adapting Nav2 for Humanoids

Nav2 "out of the box" is tuned for robots that move like a car—a differential drive or omnidirectional base that can be commanded with a `geometry_msgs/Twist` message (`/cmd_vel`). A humanoid is different:
- **It's a legged system:** It can't be commanded with simple linear and angular velocities. It needs footsteps or trajectories.
- **It has a high center of gravity:** It must consider stability and dynamics.
- **It has a non-circular footprint:** The collision shape changes depending on leg and arm positions.

To use Nav2 with a humanoid, we must customize key parts of the stack, primarily the **Controller Server**.

### The Custom Humanoid Controller

Instead of using a standard DWB or TEB controller, we need to write or use a specialized **humanoid controller plugin**. This plugin still receives the global path from the Planner Server, but its output is not a `/cmd_vel` message.

**The job of a humanoid controller is to:**
1.  Receive the global path (a sequence of poses).
2.  Look at the next few points on the path.
3.  **Generate a sequence of valid footsteps** that will follow that path. This is the core "footstep planning" problem.
4.  Publish these footsteps to a specialized topic (e.g., `/humanoid_controller/footsteps`).
5.  A separate node (the robot's "walking pattern generator") subscribes to these footsteps and computes the full-body joint trajectories required to execute them while maintaining balance.

**Conceptual Flow:**
```text
┌────────────────┐      ┌─────────────────────────┐      ┌───────────────────────────┐
│ Nav2 Planner   │───▶│ Custom Humanoid       │───▶│ Walking Pattern Generator   │
│   Server       │    │   Controller Plugin   │    │      (ROS 2 Node)         │
├────────────────┤    ├─────────────────────────┤    ├───────────────────────────┤
│ - Generates    │    │ - Receives global path  │    │ - Receives footstep plan  │
│   global path  │    │ - Generates footstep    │    │ - Computes joint         │
│   (poses)      │    │   plan (e.g., XYZ, yaw) │    │   trajectories for legs,  │
│                │    │ - Publishes to          │    │   arms, and torso to      │
└────────────────┘    │   /humanoid_controller/ │    │   maintain balance (ZMP)  │
                      │   footsteps             │    │ - Publishes to            │
                      └─────────────────────────┘    │   /joint_trajectory_      │
                                                     │   controller              │
                                                     └───────────────────────────┘
```
This decouples the high-level path planning (Nav2) from the low-level problem of bipedal locomotion. Nav2 is still responsible for the "where to go" decision, while the specialized humanoid nodes handle the "how to walk there" problem.

---

## 3. Configuration and Launch

Configuring Nav2 involves creating a YAML file that specifies all the plugins, their parameters, and the costmap settings. For a humanoid, your `nav2_params.yaml` file would point to your custom controller.

**Example `nav2_params.yaml` snippet:**
```yaml
controller_server:
  ros__parameters:
    # ... other parameters
    controller_plugins: ["humanoid_controller"]
    
    humanoid_controller:
      plugin: "humanoid_nav2_controller/HumanoidController" # Your custom plugin
      # Parameters specific to your footstep planner
      footstep_topic: "/humanoid_controller/footsteps"
      max_step_height: 0.1
      max_step_reach: 0.25
      # ... etc.

bt_navigator:
  ros__parameters:
    # ...
    # The behavior tree XML file that defines the navigation logic
    bt_xml_filename: "navigate_to_pose_w_replanning_and_recovery.xml" 
```

You would then create a main launch file that starts all the Nav2 servers, loads the parameters, and also launches your VSLAM system (like Isaac ROS VSLAM). The VSLAM node provides the `map` -> `odom` -> `base_link` transform tree that Nav2 requires to function.

With this complete stack, you can finally give your robot a high-level goal in a tool like Rviz2 ("Go to this point in the kitchen"), and the entire system will work together to:
1.  **Localize** the robot in the map (VSLAM).
2.  **Plan** a global path around furniture (Planner Server).
3.  **Generate footsteps** to follow the path (Humanoid Controller).
4.  **Compute joint angles** to execute the footsteps (Walking Pattern Generator).
5.  **Monitor** for unexpected obstacles and dynamically replan (Controller Server + Costmaps).

This represents the pinnacle of autonomous navigation, integrating perception, localization, and planning into a cohesive and intelligent system.
