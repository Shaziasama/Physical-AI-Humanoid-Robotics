import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Manually define the sidebar for the textbook
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Chapter 1: The Robotic Nervous System',
      items: [
        'chapter1/ros2-introduction',
        'chapter1/python-agents-and-ros',
        'chapter1/describing-your-robot-urdf',
      ],
    },
    {
      type: 'category',
      label: 'Chapter 2: The Digital Twin',
      items: [
        'chapter2/physics-simulation',
        'chapter2/human-robot-interaction',
        'chapter2/sensors',
      ],
    },
    {
      type: 'category',
      label: 'Chapter 3: The AI-Robot Brain',
      items: [
        'chapter3/photorealistic-simulation',
        'chapter3/synthetic-data',
        'chapter3/isaac-ros-vslam',
        'chapter3/nav2-planning',
      ],
    },
    {
      type: 'category',
      label: 'Chapter 4: Vision-Language-Action',
      items: [
        'chapter4/voice-to-action',
        'chapter4/llm-cognitive-planning',
        'chapter4/capstone-autonomous-humanoid',
      ],
    },
  ],
};

export default sidebars;
