---
sidebar_position: 2
---

# Module 2: Human-Robot Interaction in Simulation

A humanoid robot, by its very nature, is designed to operate in human-centric environments. This means it must be able to perceive, understand, and safely interact with people. Developing and testing these capabilities on a physical robot is dangerous and impractical. The digital twin is therefore an essential tool for **Human-Robot Interaction (HRI)** research and development.

Simulating HRI involves more than just the robot; it requires us to model the human as well. We need to simulate their presence, movements, and intentions to create a rich environment for our robot to learn from.

---

## 1. Modeling Humans in the Simulation

There are several levels of fidelity when it comes to simulating humans in Gazebo or Unity.

### Level 1: Static Obstacles

The simplest approach is to treat humans as static or dynamic obstacles. You can place simple shapes (cylinders, boxes) or full 3D models of people in the environment.
- **Use Case:** Basic safety and navigation testing. Can the robot navigate a crowded room without collision?
- **Implementation:** In Gazebo, you can add `<actor>` tags to your world's SDF file or use services to spawn simple models during runtime.

```xml title="Gazebo World SDF with a static human"
<sdf version='1.7'>
  <world name='default'>
    <!-- ... other world elements like lighting and physics ... -->

    <!-- Add a simple, non-moving human model -->
    <include>
      <uri>model://person_standing</uri>
      <name>person_1</name>
      <pose>2.0 3.0 0 0 0 1.57</pose>
    </include>
  </world>
</sdf>
```

### Level 2: Scripted Actors

A more dynamic approach is to use **Actors**. An actor in Gazebo is a special type of model that can follow a predefined script or trajectory. It's not a full physical entity (it can pass through objects), but it provides a sense of life and movement to the scene.

- **Use Case:** Testing the robot's ability to track moving entities, predict paths, and react to dynamic changes in the environment.
- **Implementation:** The `<actor>` tag in an SDF file can contain a `<script>` section defining a trajectory.

```xml title="Gazebo World SDF with a scripted actor"
<actor name="walking_person">
  <skin>
    <filename>model://actor/meshes/SKIN.dae</filename>
    <scale>1.0</scale>
  </skin>
  <animation name="walking">
    <filename>model://actor/meshes/ANIMATION.dae</filename>
    <scale>1.0</scale>
    <interpolate_x>true</interpolate_x>
  </animation>
  <script>
    <loop>true</loop>
    <delay_start>0.0</delay_start>
    <auto_start>true</auto_start>
    <trajectory id="0" type="walking">
      <waypoint>
        <time>0</time>
        <pose>0 5 1.25 0 0 0</pose>
      </waypoint>
      <waypoint>
        <time>8</time>
        <pose>10 5 1.25 0 0 0</pose>
      </waypoint>
      <waypoint>
        <time>10</time>
        <pose>10 5 1.25 0 0 -1.57</pose>
      </waypoint>
      <!-- ... more waypoints ... -->
    </trajectory>
  </script>
</actor>
```
This creates a "ghost-like" person who will walk along a predefined path, forcing the robot to react to their presence.

### Level 3: Interactive, Controlled Avatars

The highest level of fidelity involves a human user directly controlling an avatar in the simulation. This allows for unscripted, reactive, and truly interactive testing.

- **Use Case:** User studies, testing social navigation, and developing collaborative tasks.
- **Implementation:** This often involves using external devices like a keyboard, joystick, or even a VR headset to control the avatar.
  - A ROS 2 node can be written to read input from a joystick (`/joy` topic) and publish velocity commands to the human avatar model in Gazebo.
  - In Unity, this is much more straightforward, as the engine has native support for a wide range of input devices that can be mapped to an avatar's movements. This is a key area where Unity's game engine heritage provides a significant advantage.

---

## 2. Simulating Social Cues and Interactions

HRI is not just about avoiding collisions. It's about understanding social conventions and signals. Our digital twin should allow us to model these interactions.

### Gaze and Attention

A robot needs to know what a person is looking at. In simulation, we can explicitly get this information.
- A human avatar model can have a "gaze" frame attached to its head.
- The simulator can publish the pose of this frame to a ROS 2 topic (e.g., `/hri/human_1/gaze_pose`).
- The robot's AI agent can subscribe to this topic to infer the human's focus of attention. This is invaluable for tasks like "pick up the object you are looking at."

### Gestures and Poses

Recognizing human poses and gestures is a key HRI capability.
- In Unity or Gazebo, human avatars can be animated to perform specific gestures (waving, pointing).
- The joint states of the simulated human can be published to a ROS 2 topic.
- A "gesture recognition" node on the robot can subscribe to these joint states and classify them into discrete gestures (e.g., `std_msgs/String` message with data: "wave").
- This provides perfect, noise-free "ground truth" data for training the robot's perception system. The robot can learn to associate the visual appearance of a person waving in its camera feed with the "wave" gesture label it's receiving from the simulation.

### Proximity and Social Norms (Proxemics)

Humans have well-defined social zones (intimate, personal, social, public). A robot must learn to respect these.
- In the digital twin, we can define these zones as concentric circles or spheres around the human avatar.
- We can then program the robot's navigation system (e.g., Nav2, which we will see in Module 3) to assign different costs to traversing these zones.
- The costmap can be configured to heavily penalize entering a human's "personal space," leading to more socially acceptable navigation behaviors.

```text
      ┌──────────────────────────────────┐
      │          Public Zone             │
      │   ┌──────────────────────────┐   │
      │   │       Social Zone        │   │
      │   │    ┌─────────────────┐   │   │
      │   │    │  Personal Zone  │   │   │
      │   │    │   ┌───────────┐ │   │   │
      │   │    │   │ Intimate  │ │   │   │
      │   │    │   │   Zone    │ │   │   │
      │   │    │   └───────────┘ │   │   │
      │   │    └─────────────────┘   │   │
      │   └──────────────────────────┘   │
      └──────────────────────────────────┘
```

By explicitly modeling these HRI concepts in our digital twin, we create a rich, controlled, and repeatable environment. We can test our robot's social intelligence in a way that would be impossible in the real world, paving the way for humanoids that are not just functional, but safe, intuitive, and pleasant to be around. In the next section, we'll equip our simulated robot with the sensors it needs to perceive both its environment and the humans within it.
