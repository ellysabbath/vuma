import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { timelineEvents } from '../data';

const Events = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  const upcomingEvents = [
    { id: 1, title: 'Youth Leadership Bootcamp', date: 'May 30, 2026', type: 'Online', image: 'https://via.placeholder.com/400x200', description: 'Join us for an intensive leadership training session designed to empower young leaders.' },
    { id: 2, title: 'Tree Planting Drive', date: 'June 5, 2026', type: 'In-Person', image: 'https://via.placeholder.com/400x200', description: 'Be part of World Environment Day celebrations with our community tree planting event.' },
    { id: 3, title: 'Climate Policy Webinar', date: 'June 12, 2026', type: 'Webinar', image: 'https://via.placeholder.com/400x200', description: 'Learn from climate policy experts and engage in meaningful discussions.' },
    { id: 4, title: 'Innovation Summit', date: 'June 15-17, 2026', type: 'Hybrid', image: 'https://via.placeholder.com/400x200', description: 'Annual summit bringing together innovators and change-makers.' }
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
          Upcoming Events
        </h1>
        <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>
          Join us in making a difference
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        {upcomingEvents.map((event, idx) => (
          <div key={event.id} data-aos="fade-up" data-aos-delay={idx * 100} style={{
            display: 'flex',
            flexWrap: 'wrap',
            background: 'white',
            borderRadius: '20px',
            overflow: 'hidden',
            marginBottom: '2rem',
            boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
          }}>
            <div style={{ flex: 1, minWidth: '250px', padding: '1.5rem' }}>
              <span style={{
                background: event.type === 'Online' ? '#0B3B2F' : event.type === 'Webinar' ? '#F9C74F' : '#2b7a5c',
                color: 'white',
                padding: '0.2rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.7rem',
                display: 'inline-block',
                marginBottom: '1rem'
              }}>
                {event.type}
              </span>
              <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>{event.title}</h3>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                <i className="fas fa-calendar-alt" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                {event.date}
              </p>
              <p style={{ color: '#777', marginBottom: '1rem' }}>{event.description}</p>
              <button style={{
                background: '#F9C74F',
                border: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: '50px',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                Register Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;