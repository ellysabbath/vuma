import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([
    { id: 1, title: 'Youth Leadership Bootcamp', date: '2026-05-30', attendees: 45, status: 'Upcoming' },
    { id: 2, title: 'Tree Planting Drive', date: '2026-06-05', attendees: 120, status: 'Upcoming' },
    { id: 3, title: 'Climate Policy Webinar', date: '2026-06-12', attendees: 89, status: 'Upcoming' },
  ]);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '2rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => navigate('/admin')}></i>
            <h1 style={{ fontSize: '1.8rem' }}>Events Management</h1>
          </div>
          <p>Organize and manage all events and activities</p>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          {events.map(event => (
            <div key={event.id} style={{ padding: '1rem', borderBottom: '1px solid #f0f0f0' }}>
              <h4>{event.title}</h4>
              <p style={{ fontSize: '0.8rem', color: '#888' }}>{event.date} • {event.attendees} attendees</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;