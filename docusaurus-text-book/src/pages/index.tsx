import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const HomepageHeader = () => {
  const {siteConfig} = useDocusaurusContext();
  const heroImageUrl = 'https://images.unsplash.com/photo-1555255707-c07966088b7b'; // Abstract robotics image

  return (
    <header 
      className={clsx('hero hero--primary', styles.heroBanner, 'hero-banner')} 
      style={{backgroundImage: `url(${heroImageUrl})`}}
    >
      <div className="hero-banner__content">
        <h1 className="hero-banner__title">{siteConfig.title}</h1>
        <p className="hero-banner__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Start Reading
          </Link>
        </div>
      </div>
    </header>
  );
};

const FeatureCard = ({title, description}) => (
    <div className="col col--4 feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
);

const HomepageFeatures = () => {
  const features = [
    {
      title: 'What This Book Teaches',
      description: 'Learn the fundamental principles of building intelligent robotic systems from the ground up, combining modern AI with physical hardware and simulation.'
    },
    {
      title: 'Who This Book Is For',
      description: 'Aimed at developers, students, and researchers interested in the intersection of AI, robotics, and simulation. A background in Python is recommended.'
    },
    {
      title: 'Technologies Covered',
      description: 'Explore a full stack for Physical AI, including ROS 2, Python, URDF, Gazebo for physics, NVIDIA Isaac Sim for photorealism, and Large Language Models for cognitive tasks.'
    }
  ];

  return (
    <section className="homepage-cards">
      <div className="container">
        <div className="row card-container">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </section>
  );
};


export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Home`}
      description="An Interactive Textbook for Building the Next Generation of intelligent Robots.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}