import React from 'react';
import Hero from '../components/Hero';
import ImpactCounters from '../components/ImpactCounters';
import StatsComponent from '../components/StatsComponent';
import InnovationShowcase from '../components/InnovationShowcase';
import EventCountdown from '../components/EventCountdown';
import Timeline from '../components/Timeline';
import Testimonials from '../components/Testimonials';
import Forms from '../components/Forms';
import Blog from '../components/Blog';
import Leadership from '../components/Leadership';

const Home = ({ onLoginClick }) => {
  return (
    <>
      <Hero onLoginClick={onLoginClick} />
      <ImpactCounters />
      <StatsComponent />
      <InnovationShowcase />
      <EventCountdown />
      <div id="events">
        <Timeline />
      </div>
      <Testimonials />
      <div id="volunteer">
        <Forms />
      </div>
      <div id="news">
        <Blog />
      </div>
      <Leadership />
    </>
  );
};

export default Home;