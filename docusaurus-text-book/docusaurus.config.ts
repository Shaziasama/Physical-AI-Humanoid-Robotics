import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'An Interactive Textbook for Building the Next Generation of intelligent Robots.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-site.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'your-github-org', // Usually your GitHub org/user name.
  projectName: 'docusaurus-text-book', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Physical AI & Humanoid Robotics',
      items: [
        {
          to: '/',
          label: 'Home',
          position: 'left',
        },
        {
          to: '/docs/intro',
          label: 'Chapters',
          position: 'left',
        },
        {
          label: 'About',
          to: '/about', // You will need to create an 'about.md' file in src/pages
          position: 'left',
        },
        {
          href: 'https://github.com/Shaziasama',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [], // We are removing the default footer links
      copyright: `Copyright © ${new Date().getFullYear()} Shazia Zohaib. All rights reserved. <br/> Physical AI & Humanoid Robotics: An Interactive Textbook.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;