import React, { useEffect, useRef, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Volunteers = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  const nameRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVolunteer = () => {
    setIsLoading(true);
    const name = nameRef.current?.value || 'volunteer';
    setTimeout(() => {
      alert(`Thank you ${name}! We will contact you.`);
      setIsLoading(false);
    }, 500);
  };

  const opportunities = [
    { title: 'Community Outreach', description: 'Help spread awareness and engage with local communities', icon: 'fas fa-users' },
    { title: 'Event Coordination', description: 'Assist in planning and executing events', icon: 'fas fa-calendar-alt' },
    { title: 'Digital Media', description: 'Help manage social media and create content', icon: 'fas fa-camera' },
    { title: 'Environmental Projects', description: 'Participate in tree planting and conservation', icon: 'fas fa-leaf' }
  ];

  return (
    <div style={{ paddingTop: '70px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h1 data-aos="fade-up" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>
          Become a Volunteer
        </h1>
        <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>
          Make a difference in your community
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {opportunities.map((opp, idx) => (
            <div key={idx} data-aos="zoom-in" data-aos-delay={idx * 100} style={{
              background: 'white',
              borderRadius: '20px',
              padding: '1.5rem',
              textAlign: 'center',
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
            }}>
              <i className={opp.icon} style={{ fontSize: '2rem', color: '#F9C74F' }}></i>
              <h3 style={{ margin: '1rem 0', color: '#0B3B2F' }}>{opp.title}</h3>
              <p style={{ color: '#666' }}>{opp.description}</p>
            </div>
          ))}
        </div>

        <div data-aos="fade-up" style={{
          background: 'white',
          borderRadius: '24px',
          padding: '2rem',
          maxWidth: '600px',
          margin: '0 auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ textAlign: 'center', color: '#0B3B2F', marginBottom: '1rem' }}>Volunteer Registration</h2>
          <input ref={nameRef} type="text" placeholder="Full Name" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '50px', border: '1px solid #ddd' }} />
          <input type="email" placeholder="Email Address" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '50px', border: '1px solid #ddd' }} />
          <input type="tel" placeholder="Phone Number" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '50px', border: '1px solid #ddd' }} />
          <select style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '50px', border: '1px solid #ddd' }}>
            <option>Select Area of Interest</option>
            <option>Community Outreach</option>
            <option>Event Coordination</option>
            <option>Digital Media</option>
            <option>Environmental Projects</option>
          </select>
          <button onClick={handleVolunteer} disabled={isLoading} style={{
            background: '#F9C74F',
            border: 'none',
            padding: '0.8rem',
            borderRadius: '50px',
            fontWeight: 700,
            cursor: 'pointer',
            width: '100%'
          }}>
            {isLoading ? 'Processing...' : 'Register Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Volunteers;