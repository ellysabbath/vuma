import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { timelineEvents } from '../data';

const Events = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  const upcomingEvents = [
    { 
      id: 1, 
      title: 'Youth Leadership Bootcamp', 
      date: 'May 30, 2026', 
      type: 'Online', 
      time: '10:00 AM - 4:00 PM EAT',
      location: 'Zoom (Virtual)',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop', 
      description: 'Join us for an intensive leadership training session designed to empower young leaders with essential skills.',
      fullDescription: 'This comprehensive bootcamp covers leadership fundamentals, team management, effective communication, and project planning. Participants will engage in interactive workshops, case studies, and group activities.',
      speakers: ['Dr. Sarah Mbeki', 'James Omondi', 'Grace Kimathi'],
      capacity: 100,
      registered: 67
    },
    { 
      id: 2, 
      title: 'Tree Planting Drive', 
      date: 'June 5, 2026', 
      type: 'In-Person', 
      time: '8:00 AM - 2:00 PM EAT',
      location: 'Various locations across Tanzania',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop', 
      description: 'Be part of World Environment Day celebrations with our community tree planting event.',
      fullDescription: 'Join us as we plant 5,000 trees across multiple locations in Tanzania. This event includes tree planting demonstrations, environmental education, and community engagement activities.',
      speakers: ['Environmental Experts', 'Community Leaders'],
      capacity: 500,
      registered: 312
    },
    { 
      id: 3, 
      title: 'Climate Policy Webinar', 
      date: 'June 12, 2026', 
      type: 'Webinar', 
      time: '2:00 PM - 5:00 PM EAT',
      location: 'Virtual (Zoom & YouTube)',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop', 
      description: 'Learn from climate policy experts and engage in meaningful discussions.',
      fullDescription: 'This webinar features leading climate policy experts discussing Tanzania\'s climate action plan, youth involvement in policy-making, and opportunities for community engagement.',
      speakers: ['Dr. Esther M.', 'Policy Expert', 'UN Representative'],
      capacity: 300,
      registered: 189
    },
    { 
      id: 4, 
      title: 'Innovation Summit', 
      date: 'June 15-17, 2026', 
      type: 'Hybrid', 
      time: '9:00 AM - 6:00 PM EAT',
      location: 'Dar es Salaam & Virtual',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=400&fit=crop', 
      description: 'Annual summit bringing together innovators and change-makers.',
      fullDescription: 'The Innovation Summit brings together young innovators, entrepreneurs, and change-makers to share ideas, showcase projects, and build partnerships for sustainable development.',
      speakers: ['Industry Leaders', 'Innovators', 'Investors'],
      capacity: 1000,
      registered: 523
    }
  ];

  const openModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    document.body.style.overflow = 'unset';
  };

  const handleRegister = (eventTitle) => {
    navigate('/events/register', { state: { eventName: eventTitle } });
  };

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
          Upcoming Events
        </h1>
        <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>
          Join us in making a difference
        </p>
      </div>

      {/* Events List */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        {upcomingEvents.map((event, idx) => (
          <div key={event.id} data-aos="fade-up" data-aos-delay={idx * 100} style={{
            display: 'flex',
            flexWrap: 'wrap',
            background: 'white',
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          onClick={() => openModal(event)}>
            
            {/* Event Image */}
            <div style={{ flex: '0 0 200px', minWidth: '200px' }}>
              <img 
                src={event.image} 
                alt={event.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            
            {/* Event Details */}
            <div style={{ flex: 1, padding: '1.5rem' }}>
              <span style={{
                background: event.type === 'Online' ? '#0B3B2F' : event.type === 'Webinar' ? '#F9C74F' : event.type === 'Hybrid' ? '#2b7a5c' : '#F9C74F',
                color: event.type === 'Webinar' ? '#0B3B2F' : 'white',
                padding: '0.2rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.7rem',
                display: 'inline-block',
                marginBottom: '0.8rem',
                fontWeight: 600
              }}>
                {event.type}
              </span>
              <h3 style={{ color: '#0B3B2F', marginBottom: '0.3rem', fontSize: '1.3rem' }}>{event.title}</h3>
              <p style={{ color: '#666', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                <i className="fas fa-calendar-alt" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                {event.date}
              </p>
              <p style={{ color: '#666', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                <i className="fas fa-clock" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                {event.time}
              </p>
              <p style={{ color: '#666', marginBottom: '0.8rem', fontSize: '0.85rem' }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                {event.location}
              </p>
              <p style={{ color: '#777', marginBottom: '1rem', lineHeight: '1.5' }}>{event.description}</p>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#F9C74F'
                }}>
                  <i className="fas fa-eye"></i>
                  Click to view details
                </span>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#2b7a5c'
                }}>
                  <i className="fas fa-users"></i>
                  {event.registered}/{event.capacity} registered
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Details Modal */}
      {showModal && selectedEvent && (
        <div className="modal-overlay" onClick={closeModal} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '28px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            position: 'relative',
            animation: 'slideInUp 0.3s ease'
          }}>
            {/* Modal Header with Image */}
            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
              <img 
                src={selectedEvent.image} 
                alt={selectedEvent.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))' }} />
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(0,0,0,0.5)',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
              >
                <i className="fas fa-times"></i>
              </button>
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', zIndex: 10 }}>
                <span style={{
                  display: 'inline-block',
                  background: selectedEvent.type === 'Online' ? '#0B3B2F' : selectedEvent.type === 'Webinar' ? '#F9C74F' : '#2b7a5c',
                  color: selectedEvent.type === 'Webinar' ? '#0B3B2F' : 'white',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem'
                }}>
                  {selectedEvent.type}
                </span>
                <h2 style={{ color: 'white', margin: 0, fontSize: 'clamp(1.3rem, 5vw, 1.8rem)' }}>{selectedEvent.title}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 'clamp(1.5rem, 5vw, 2rem)' }}>
              {/* Event Details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
                background: '#f9fbf7',
                padding: '1rem',
                borderRadius: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.3rem' }}>
                    <i className="fas fa-calendar-alt" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                    Date
                  </div>
                  <div style={{ fontWeight: 600, color: '#0B3B2F' }}>{selectedEvent.date}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.3rem' }}>
                    <i className="fas fa-clock" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                    Time
                  </div>
                  <div style={{ fontWeight: 600, color: '#0B3B2F' }}>{selectedEvent.time}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.3rem' }}>
                    <i className="fas fa-map-marker-alt" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                    Location
                  </div>
                  <div style={{ fontWeight: 600, color: '#0B3B2F' }}>{selectedEvent.location}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.3rem' }}>
                    <i className="fas fa-users" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                    Capacity
                  </div>
                  <div style={{ fontWeight: 600, color: '#0B3B2F' }}>{selectedEvent.registered}/{selectedEvent.capacity} spots filled</div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem' }}>
                  <i className="fas fa-info-circle" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  About This Event
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>{selectedEvent.fullDescription}</p>
              </div>

              {/* Speakers */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem' }}>
                  <i className="fas fa-microphone-alt" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  Speakers & Facilitators
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                  {selectedEvent.speakers.map((speaker, i) => (
                    <span key={i} style={{
                      background: '#f9fbf7',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      color: '#0B3B2F'
                    }}>
                      {speaker}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: '2px solid #ddd',
                    padding: '0.8rem',
                    borderRadius: '50px',
                    color: '#666',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#d32f2f';
                    e.currentTarget.style.color = '#d32f2f';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.color = '#666';
                  }}
                >
                  <i className="fas fa-times" style={{ marginRight: '0.5rem' }}></i>
                  Close
                </button>
                <button
                  onClick={() => handleRegister(selectedEvent.title)}
                  style={{
                    flex: 2,
                    background: '#F9C74F',
                    border: 'none',
                    padding: '0.8rem',
                    borderRadius: '50px',
                    color: '#0B3B2F',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(249,199,79,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <i className="fas fa-handshake"></i>
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modal-content::-webkit-scrollbar {
          width: 6px;
        }
        
        .modal-content::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .modal-content::-webkit-scrollbar-thumb {
          background: #F9C74F;
          borderRadius: 3px;
        }
        
        @media (max-width: 768px) {
          .modal-content {
            max-height: 90vh;
          }
          
          .modal-content > div:first-child {
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
};

export default Events;