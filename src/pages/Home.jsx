// import React from 'react';
// import Hero from '../components/Hero';
// import ImpactCounters from '../components/ImpactCounters';
// import StatsComponent from '../components/StatsComponent';
// import InnovationShowcase from '../components/InnovationShowcase';
// import EventCountdown from '../components/EventCountdown';
// import Timeline from '../components/Timeline';
// import Testimonials from '../components/Testimonials';
// import Forms from '../components/Forms';
// import Blog from '../components/Blog';
// import Leadership from '../components/Leadership';
// import Pro from '../components/programs';

// const Home = ({ onLoginClick }) => {
//   return (
//     <>
//       <Hero onLoginClick={onLoginClick} />
//       <ImpactCounters />
//       <StatsComponent />
//       <InnovationShowcase />
//       {/* <EventCountdown /> */}
//       <div id="events">
//         {/* <Timeline /> */}
//       </div>
//       <Testimonials />
//       <div id="volunteer">
//         <Forms />
//         <Pro /> {/* Add this line to include the Programs component */}
//       </div>
//       <div id="news">
//         {/* <Blog /> */}
//       </div>
//       <Leadership />
//     </>
//   );
// };

// export default Home;




import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import ImpactCounters from '../components/ImpactCounters';
import StatsComponent from '../components/StatsComponent';
import InnovationShowcase from '../components/InnovationShowcase';
import Testimonials from '../components/Testimonials';
import Forms from '../components/Forms';
import Leadership from '../components/Leadership';
import Pro from '../components/programs';

const Home = ({ onLoginClick }) => {
  // ✅ Organization Schema for Rich Results
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VUMA Tanzania",
    "url": "https://vumatanzania.or.tz",
    "logo": "https://vumatanzania.or.tz/vuma.png",
    "description": "VUMA Tanzania empowers youth through innovation and climate action in Tanzania.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TZ"
    },
    "sameAs": [
      "https://facebook.com/vumatanzania",
      "https://twitter.com/vumatanzania",
      "https://instagram.com/vumatanzania"
    ]
  };

  // ✅ Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://vumatanzania.or.tz",
    "name": "VUMA Tanzania",
    "description": "Empowering Tanzanian youth through innovation and climate action",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://vumatanzania.or.tz/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      {/* ============================================ */}
      {/* SEO META TAGS */}
      {/* ============================================ */}
      <Helmet>
        {/* Primary Meta Tags */}
        <title>VUMA Tanzania | Youth Innovation & Climate Action Platform</title>
        <meta 
          name="description" 
          content="VUMA Tanzania empowers youth through innovation and climate action. Join our platform to connect, learn, and make a difference in Tanzania's sustainable future." 
        />
        <meta 
          name="keywords" 
          content="VUMA Tanzania, youth innovation, climate action, Tanzania youth, sustainability, innovation platform, climate change, youth empowerment" 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://vumatanzania.or.tz/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vumatanzania.or.tz/" />
        <meta property="og:title" content="VUMA Tanzania | Youth Innovation & Climate Action" />
        <meta 
          property="og:description" 
          content="Empowering Tanzanian youth through innovation and climate action. Join the movement for a sustainable future." 
        />
        <meta property="og:image" content="https://vumatanzania.or.tz/vuma.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="VUMA Tanzania" />
        <meta property="og:locale" content="en_TZ" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://vumatanzania.or.tz/" />
        <meta name="twitter:title" content="VUMA Tanzania | Youth Innovation & Climate Action" />
        <meta 
          name="twitter:description" 
          content="Empowering Tanzanian youth through innovation and climate action. Join the movement for a sustainable future." 
        />
        <meta name="twitter:image" content="https://vumatanzania.or.tz/vuma.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
      </Helmet>

      {/* ============================================ */}
      {/* PAGE CONTENT */}
      {/* ============================================ */}
      <main>
        {/* Hero Section - Main Banner */}
        <Hero onLoginClick={onLoginClick} />

        {/* Impact Counters - Key Statistics */}
        <ImpactCounters />

        {/* Stats Component - Detailed Metrics */}
        <StatsComponent />

        {/* Innovation Showcase - Featured Projects */}
        <InnovationShowcase />

        {/* Events Section - Coming Soon */}
        <section id="events" aria-label="Upcoming Events">
          {/* Event content will be added here */}
        </section>

        {/* Testimonials - What People Say */}
        <Testimonials />

        {/* Volunteer Section - Join Us */}
        <section id="volunteer" aria-label="Volunteer Opportunities">
          <Forms />
          <Pro /> {/* Programs Component */}
        </section>

        {/* News Section - Latest Updates */}
        <section id="news" aria-label="Latest News">
          {/* Blog content will be added here */}
        </section>

        {/* Leadership - Our Team */}
        <Leadership />
      </main>
    </>
  );
};

export default Home;