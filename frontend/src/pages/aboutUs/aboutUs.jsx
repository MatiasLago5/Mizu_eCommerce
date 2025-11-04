import React from 'react';
import './aboutUsStyles.css';
import HeroParallax from './aboutUsComponents/heroParallax';
import HistorySection from './aboutUsComponents/HistorySection';
import MissionVisionParallax from './aboutUsComponents/MissionVisionParallax';
import MissionVision from './aboutUsComponents/MissionVision';
import ValuesParallax from './aboutUsComponents/ValuesParallax';
import Values from './aboutUsComponents/Values';
import ContactParallax from './aboutUsComponents/ContactParallax';

function AboutUs() {
  return (
    <div className="about-page">
      <HeroParallax />
      <HistorySection />
      <MissionVisionParallax />
      <MissionVision />
      <ValuesParallax />
      <Values />
      <ContactParallax />
    </div>
  );
}

export default AboutUs;