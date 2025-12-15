---
sidebar_position: 3
---

# Module 3: Virtual Sensors (LiDAR, Cameras, IMU)

An agent can only be as good as its perception. To operate in the world, a robot needs to sense its environment. In our digital twin, we must equip our simulated robot with a suite of virtual sensors that mimic their real-world counterparts.

Gazebo, through its plugin system, provides excellent support for simulating a wide variety of common robotic sensors. When you add a sensor plugin to your robot's URDF/SDF model, Gazebo will:
1.  **Generate physically-plausible sensor data** based on the state of the virtual world.
2.  **Simulate noise and limitations** of the real sensor.
3.  **Publish the data** to a ROS 2 topic via the `ros_gz_bridge`.

This allows your perception stack to be developed and tested on realistic data, long before it's connected to physical hardware. Let's explore how to add three of the most critical sensors for a humanoid robot.

---

## 1. IMU (Inertial Measurement Unit)

An IMU is the robot's organ of balance. It measures orientation, angular velocity, and linear acceleration. It's absolutely critical for stabilization, estimating the robot's state, and detecting falls.

A Gazebo IMU plugin (`ignition-gazebo-imu-sensor-system`) simulates this by tapping into the physics engine's ground truth state for the link it's attached to. It then adds configurable Gaussian noise to the readings to make them more realistic.

**Adding an IMU to a URDF/Xacro file:**

You first define a link for the IMU, often a small box, and attach it to the robot's torso with a fixed joint. Then, you add the plugin within a `<gazebo>` tag for that link.

```xml title="imu_snippet.xacro"
<joint name="torso_to_imu_joint" type="fixed">
  <parent link="torso_link"/>
  <child link="imu_link"/>
  <origin xyz="0 0 0.1" rpy="0 0 0"/>
</joint>

<link name="imu_link"/>

<gazebo reference="imu_link">
  <sensor name="imu_sensor" type="imu">
    <always_on>true</always_on>
    <update_rate>100</update_rate> <!-- 100 Hz update rate -->
    <visualize>true</visualize>
    <topic>/imu/data</topic> <!-- The Gazebo topic to publish to -->
    <ignition_frame_id>imu_link</ignition_frame_id>
    
    <!-- Noise parameters to make the simulation more realistic -->
    <imu>
      <angular_velocity>
        <x>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>2e-4</stddev>
          </noise>
        </x>
        <!-- ... noise for y and z axes ... -->
      </angular_velocity>
      <linear_acceleration>
        <x>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>1.7e-2</stddev>
          </noise>
        </x>
        <!-- ... noise for y and z axes ... -->
      </linear_acceleration>
    </imu>
  </sensor>
</gazebo>
```
The `ros_gz_bridge` will then be configured to forward messages from the Gazebo topic `/imu/data` to the ROS 2 topic `/imu/data`, where they will be available as `sensor_msgs/msg/Imu` messages for your state estimation nodes.

---

## 2. LiDAR (Light Detection and Ranging)

A LiDAR scanner is one of the most common sensors for navigation and obstacle avoidance. It works by sending out laser beams and measuring the time it takes for them to reflect off objects, giving a precise distance measurement for each beam.

The Gazebo GPU LiDAR plugin (`ignition-gazebo-gpu-lidar-system`) is highly efficient. It uses the GPU's rendering pipeline to perform raycasting, allowing it to simulate LiDARs with hundreds of thousands of points per second in real-time.

**Adding a 2D LiDAR to a URDF/Xacro file:**
```xml
<joint name="base_to_lidar_joint" type="fixed">
  <parent link="base_link"/>
  <child link="lidar_link"/>
  <origin xyz="0.2 0 0.25" rpy="0 0 0"/>
</joint>

<link name="lidar_link"/>

<gazebo reference="lidar_link">
  <sensor name="gpu_lidar" type="gpu_lidar">
    <topic>/laser_scan</topic>
    <update_rate>10</update_rate>
    <ray>
      <scan>
        <horizontal>
          <samples>360</samples> <!-- 360 points per revolution -->
          <resolution>1</resolution>
          <min_angle>-3.14159</min_angle>
          <max_angle>3.14159</max_angle>
        </horizontal>
      </scan>
      <range>
        <min>0.1</min> <!-- Minimum range -->
        <max>12.0</max> <!-- Maximum range -->
        <resolution>0.01</resolution>
      </range>
      <noise>
        <type>gaussian</type>
        <mean>0.0</mean>
        <stddev>0.01</stddev>
      </noise>
    </ray>
    <visualize>true</visualize>
  </sensor>
</gazebo>
```
This configuration defines a 2D LiDAR that spins and collects 360 distance measurements 10 times per second. The bridge will forward this data to the ROS 2 topic `/laser_scan` as `sensor_msgs/msg/LaserScan` messages, which are the standard input for 2D mapping and navigation algorithms. For a 3D LiDAR, you would also define the `vertical` scan properties.

---

## 3. Depth Camera

A depth camera (like an Intel RealSense or Microsoft Kinect) is a powerful sensor that provides a per-pixel distance measurement, resulting in a "depth image" or a "point cloud". This is immensely useful for 3D perception, object recognition, and manipulation.

The Gazebo camera plugin (`ignition-gazebo-camera-system`) can be configured to act as a depth camera. Like the LiDAR plugin, it uses the GPU's depth buffer to efficiently calculate distances.

**Adding a Depth Camera to a URDF/Xacro file:**
```xml
<joint name="torso_to_camera_joint" type="fixed">
  <parent link="torso_link"/>
  <child link="camera_link"/>
  <origin xyz="0.2 0 0.4" rpy="0 0 0"/>
</joint>

<link name="camera_link"/>

<gazebo reference="camera_link">
  <sensor name="depth_camera" type="camera">
    <camera>
      <horizontal_fov>1.047</horizontal_fov> <!-- ~60 degrees FOV -->
      <image>
        <width>640</width>
        <height>480</height>
      </image>
      <clip>
        <near>0.1</near>
        <far>10.0</far>
      </clip>
      <!-- Add noise to the depth data -->
      <noise>
        <type>gaussian</type>
        <mean>0.0</mean>
        <stddev>0.007</stddev>
      </noise>
    </camera>
    <update_rate>30</update_rate>
    <visualize>true</visualize>
    <!-- Configure multiple outputs for the camera -->
    <topic>/depth_camera/image</topic> <!-- The RGB image -->
    <depth_camera>
      <topic>/depth_camera/depth_image</topic> <!-- The Depth image -->
    </depth_camera>
    <point_cloud>
      <topic>/depth_camera/points</topic> <!-- The Point Cloud -->
    </point_cloud>
  </sensor>
</gazebo>
```
This one `<sensor>` block is incredibly powerful. It configures a single virtual camera to output three synchronized streams of data:
1.  A standard RGB image (`sensor_msgs/msg/Image`) on the `/depth_camera/image` topic.
2.  A depth image (`sensor_msgs/msg/Image`) on the `/depth_camera/depth_image` topic, where each pixel's value represents its distance from the camera.
3.  A full 3D point cloud (`sensor_msgs/msg/PointCloud2`) on the `/depth_camera/points` topic, which is a collection of XYZ points representing the scene's geometry.

By adding these virtual sensors to our digital twin, we create a complete, self-contained testbed for developing a humanoid's perception system. We can develop algorithms for state estimation, mapping, obstacle avoidance, and object recognition using the high-fidelity, labeled data from the simulator, dramatically accelerating the development cycle. In the next module, we'll take this a step further by leveraging the power of NVIDIA Isaac Sim for even more advanced simulation capabilities.
