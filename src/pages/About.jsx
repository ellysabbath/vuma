import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h1 data-aos="fade-up" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>
          About VUMA Tanzania
        </h1>
        <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', maxWidth: '800px', margin: '0 auto', opacity: 0.9 }}>
          Empowering youth through innovation, leadership, and environmental conservation
        </p>
      </div>

      {/* Mission & Vision */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div data-aos="fade-right" style={{ background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-bullseye" style={{ fontSize: '2.5rem', color: '#F9C74F', marginBottom: '1rem' }}></i>
            <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>Our Mission</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              To empower Tanzanian youth with innovative skills, leadership capabilities, and environmental awareness to create sustainable community solutions.
            </p>
          </div>
          <div data-aos="fade-up" style={{ background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-eye" style={{ fontSize: '2.5rem', color: '#F9C74F', marginBottom: '1rem' }}></i>
            <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>Our Vision</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              A generation of empowered youth leading Tanzania towards sustainable development and climate resilience.
            </p>
          </div>
          <div data-aos="fade-left" style={{ background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-chart-line" style={{ fontSize: '2.5rem', color: '#F9C74F', marginBottom: '1rem' }}></i>
            <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>Our Impact</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Over 10,000+ youth reached, 50+ projects completed, and 20+ community partnerships established since 2020.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div style={{ background: '#f9fbf7', padding: '4rem 2rem' }}>
        <h2 data-aos="fade-up" style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.2rem)', color: '#0B3B2F', marginBottom: '2rem' }}>
          Our Core Values
        </h2>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: 'fas fa-lightbulb', title: 'Innovation', desc: 'Creative solutions to complex challenges' },
            { icon: 'fas fa-users', title: 'Collaboration', desc: 'Working together for greater impact' },
            { icon: 'fas fa-leaf', title: 'Sustainability', desc: 'Long-term environmental responsibility' },
            { icon: 'fas fa-hand-holding-heart', title: 'Integrity', desc: 'Honest and transparent operations' }
          ].map((value, idx) => (
            <div key={idx} data-aos="zoom-in" data-aos-delay={idx * 100} style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
              <i className={value.icon} style={{ fontSize: '2rem', color: '#F9C74F', marginBottom: '1rem' }}></i>
              <h4 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>{value.title}</h4>
              <p style={{ color: '#666', fontSize: '0.85rem' }}>{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;