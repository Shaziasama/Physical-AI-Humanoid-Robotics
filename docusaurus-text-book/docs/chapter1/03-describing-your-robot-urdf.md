---
sidebar_position: 3
---

# Module 3: Describing Your Robot (URDF)

So far, we have built a nervous system (ROS 2) and a brain (Python Agents). But for any of this to be meaningful, ROS needs to understand the physical structure of the robot it's controlling. What does the robot look like? Where are its joints? How do they move?

The standard for answering these questions in the ROS ecosystem is the **Unified Robot Description Format (URDF)**.

**URDF is an XML-based format used to describe all the physical elements of a robot.** This includes:
- The size, shape, and appearance of each body part (**links**).
- The location and motion of the joints that connect them (**joints**).
- The kinematic and dynamic properties of the robot (e.g., mass, inertia).

A complete URDF file is a digital blueprint of your robot. This blueprint is not just for visualization; it is a critical component used by many core robotics tools:
- **State Publishers:** The `robot_state_publisher` node uses the URDF to calculate the 3D position of every part of the robot based on its joint angles (`tf2` transforms).
- **Simulators:** Simulators like Gazebo use the URDF to create a physically accurate model of your robot in a virtual world.
- **Planners:** Motion planners like MoveIt 2 use the URDF to perform collision checking and plan valid trajectories.

---

## 1. The Core Components of URDF: Links and Joints

A URDF model is essentially a tree of **links** connected by **joints**.

### Links `<link>`

A link represents a rigid part of the robot. It has three key sub-elements:
1.  **`<visual>`:** Defines the appearance of the link (how it looks). This includes its geometry (e.g., box, cylinder, sphere, or a 3D mesh file like `.stl` or `.dae`), material (color), and origin (position and orientation relative to the link's frame).
2.  **`<collision>`:** Defines the collision geometry of the link (its physical shape for collision detection). This is often a simpler shape than the visual mesh to speed up physics calculations.
3.  **`<inertial>`:** Defines the dynamic properties of the link, including its mass, center of mass (`origin`), and moment of inertia tensor (`inertia`). These are crucial for accurate physics simulation.

**Example of a simple link (a robot's torso):**
```xml
<link name="torso_link">
  <visual>
    <origin xyz="0 0 0.5" rpy="0 0 0" />
    <geometry>
      <box size="0.4 0.3 1.0" />
    </geometry>
    <material name="blue">
      <color rgba="0.0 0.0 0.8 1.0" />
    </material>
  </visual>
  <collision>
    <origin xyz="0 0 0.5" rpy="0 0 0" />
    <geometry>
      <box size="0.4 0.3 1.0" />
    </geometry>
  </collision>
  <inertial>
    <origin xyz="0 0 0.5" rpy="0 0 0" />
    <mass value="15" /> <!-- Mass in kilograms -->
    <inertia ixx="1.0" ixy="0.0" ixz="0.0"
             iyy="1.0" iyz="0.0" izz="1.0" />
  </inertial>
</link>
```

### Joints `<joint>`

A joint connects two links together and defines how they can move relative to each other. Every joint has a **parent** link and a **child** link, forming the kinematic tree structure.

**Key attributes and elements of a joint:**
- **`name`**: The unique name of the joint (e.g., `left_shoulder_pitch_joint`).
- **`type`**: The most important attribute, defining the joint's degrees of freedom.
  - `revolute`: A hinge joint that rotates around a single axis (e.g., an elbow).
  - `continuous`: A revolute joint with no angle limits (e.g., a wheel).
  - `prismatic`: A sliding joint that moves along an axis (e.g., a gripper rail).
  - `fixed`: A rigid connection with no movement. Used to connect multiple static parts.
  - `floating`: Allows motion in all 6 degrees of freedom.
  - `planar`: Allows motion in a 2D plane.
- **`<parent link="..." />`**: The name of the parent link.
- **`<child link="..." />`**: The name of the child link.
- **`<origin xyz="..." rpy="..." />`**: The pose of the joint's frame (and thus the child link's frame) relative to the parent link's frame. This defines *where* the joint is located.
- **`<axis xyz="..." />`**: The axis of rotation (for revolute joints) or translation (for prismatic joints).
- **`<limit lower="..." upper="..." effort="..." velocity="..." />`**: (For revolute and prismatic joints) Defines the joint's limits of motion, maximum force/torque, and maximum speed.

**Example of a revolute joint (a shoulder):**
```xml
<joint name="left_shoulder_pitch_joint" type="revolute">
  <parent link="torso_link" />
  <child link="left_upper_arm_link" />
  <origin xyz="0 0.2 0.8" rpy="0 0 0" />
  <axis xyz="0 1 0" />
  <limit lower="-1.57" upper="1.57" effort="100" velocity="1.5" />
</joint>
```
This XML snippet defines a joint named `left_shoulder_pitch_joint` that connects the `torso_link` to the `left_upper_arm_link`. It's a revolute joint that rotates around the Y-axis and has motion limits of +/- 90 degrees.

---

## 2. Building a Humanoid URDF

A humanoid robot is simply a complex tree of links and joints. The structure typically looks like this:
- A `base_link` or `pelvis` link serves as the root.
- The `torso` connects to the `pelvis`.
- Two leg chains branch off from the `pelvis`.
- Two arm chains and a head chain branch off from the `torso`.

### The Kinematic Tree

The `parent`-`child` relationships in the URDF define a directed graph that must be a tree. There can be no closed loops.

```text
                  (world) --<fixed>-- (base_link / pelvis)
                                            |
                       ┌────────────────────┴────────────────────┐
                       |                                        |
                 (left_hip_joint)                         (right_hip_joint)
                       |                                        |
                 (left_thigh_link)                        (right_thigh_link)
                       |                                        |
                       ...                                      ...
```

### Full Humanoid Example Snippet

Putting it all together, a simple humanoid URDF would start like this. Note the use of a `world` link and a `fixed` joint to attach the robot to the world frame.

```xml title="simple_humanoid.urdf"
<?xml version="1.0"?>
<robot name="simple_humanoid">

  <!-- A fixed link to represent the world frame -->
  <link name="world" />

  <!-- Base Link (Pelvis) -->
  <link name="pelvis_link">
    <visual>
      <geometry><box size="0.3 0.3 0.1"/></geometry>
    </visual>
    <collision>
      <geometry><box size="0.3 0.3 0.1"/></geometry>
    </collision>
    <inertial>
      <mass value="5"/>
      <inertia ixx="0.1" ixy="0" ixz="0" iyy="0.1" iyz="0" izz="0.1"/>
    </inertial>
  </link>

  <joint name="base_to_world_joint" type="fixed">
    <parent link="world"/>
    <child link="pelvis_link"/>
    <origin xyz="0 0 0.8" rpy="0 0 0"/> <!-- Position the robot 0.8m above the ground -->
  </joint>

  <!-- Torso -->
  <link name="torso_link">
    <visual>
      <geometry><box size="0.4 0.3 0.6"/></geometry>
      <origin xyz="0 0 0.3"/>
    </visual>
    <collision>
      <geometry><box size="0.4 0.3 0.6"/></geometry>
      <origin xyz="0 0 0.3"/>
    </collision>
    <inertial>
      <mass value="15"/>
      <inertia ixx="1.0" ixy="0" ixz="0" iyy="1.0" iyz="0" izz="1.0"/>
      <origin xyz="0 0 0.3"/>
    </inertial>
  </link>
  
  <joint name="pelvis_to_torso_joint" type="revolute">
    <parent link="pelvis_link"/>
    <child link="torso_link"/>
    <origin xyz="0 0 0.05" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-0.785" upper="0.785" effort="100" velocity="1.0"/>
  </joint>

  <!-- ... and so on for every other link and joint in the arms, legs, and head ... -->

</robot>
```

---

## 3. Beyond URDF: Xacro and SDF

While URDF is powerful, it can become incredibly verbose for complex robots. Writing out every link and joint for a 30-joint humanoid would be tedious and error-prone. To solve this, we use **Xacro (XML Macros)**.

**Xacro** is a macro language that allows you to create more compact and programmable URDF files. With Xacro, you can:
- Define constants (`<xacro:property name="PI" value="3.14159"/>`).
- Perform mathematical calculations (`<origin xyz="0 ${wheel_radius/2} 0" />`).
- Create reusable macros for entire chains (`<xacro:macro name="create_leg" params="prefix parent"> ... </xacro:macro>`).

A Xacro file is pre-processed to generate a final URDF file. You will almost always work with `.xacro` files for any non-trivial robot.

**SDF (Simulation Description Format)** is another alternative, used natively by the Gazebo simulator. SDF is a superset of URDF and can describe not only the robot but the entire simulation world, including lighting, physics properties, and other objects. While ROS tools can often convert a URDF to a temporary SDF for simulation, complex simulations often require a hand-written SDF file.

For our purposes, we will primarily focus on URDF and Xacro, as they are the lingua franca for robot description within the ROS ecosystem. Having a correct and detailed URDF is the first and most critical step to bringing your robot to life, both in simulation and in the physical world.
