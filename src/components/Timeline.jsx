import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Timeline = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [isRegisterHovered, setIsRegisterHovered] = useState(false);
  const [isViewHovered, setIsViewHovered] = useState(false);
  const sectionRef = useRef(null);

  const events = [
    { 
      id: 1,
      icon: "fas fa-chalkboard-user", 
      date: "May 30, 2026", 
      title: "Youth Leadership Bootcamp",
      subtitle: "Online Workshop",
      description: "Join us for an intensive leadership training session designed to empower young leaders with essential skills.",
      time: "10:00 AM - 4:00 PM EAT",
      location: "Virtual (Zoom)",
      color: "#F9C74F"
    },
    { 
      id: 2,
      icon: "fas fa-leaf", 
      date: "June 5, 2026", 
      title: "World Environment Day",
      subtitle: "Tree Planting Drive",
      description: "Be part of the global movement! Plant trees and help restore our environment.",
      time: "8:00 AM - 2:00 PM EAT",
      location: "Multiple locations across Tanzania",
      color: "#F9C74F"
    },
    { 
      id: 3,
      icon: "fas fa-microphone-alt", 
      date: "June 12, 2026", 
      title: "Climate Policy Webinar",
      subtitle: "Expert Panel Discussion",
      description: "Learn from climate policy experts and engage in meaningful discussions about climate action.",
      time: "2:00 PM - 5:00 PM EAT",
      location: "Virtual (Zoom & YouTube)",
      color: "#F9C74F"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleRegister = (eventTitle) => {
    navigate('/events/register', { state: { eventName: eventTitle } });
  };

  const handleViewAllEvents = () => {
    navigate('/events');
  };

  return (
    <div ref={sectionRef} style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      {/* Decorative Background */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(249,199,79,0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Section Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        position: 'relative',
        zIndex: 1,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(249,199,79,0.15)',
          padding: '0.3rem 1rem',
          borderRadius: '50px',
          marginBottom: '0.8rem'
        }}>
          <span style={{ color: '#F9C74F', fontWeight: 600, fontSize: '0.75rem' }}>
            <i className="fas fa-calendar-alt" style={{ marginRight: '0.5rem' }}></i>
            MARK YOUR CALENDAR
          </span>
        </div>
        <h3 className="section-title" style={{
          fontSize: 'clamp(1.4rem, 5vw, 1.8rem)',
          fontWeight: 800,
          margin: 0,
          background: 'linear-gradient(135deg, #0B3B2F, #2b7a5c)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        }}>
          Upcoming Events
        </h3>
        <p style={{
          fontSize: '0.85rem',
          color: '#666',
          marginTop: '0.5rem'
        }}>
          Don't miss out on these exciting opportunities
        </p>
      </div>

      {/* Timeline Events */}
      <div style={{
        position: 'relative',
        zIndex: 1
      }}>
        {/* Vertical Line - Hidden on mobile */}
        <div style={{
          position: 'absolute',
          left: '30px',
          top: '40px',
          bottom: '40px',
          width: '2px',
          background: 'linear-gradient(180deg, #F9C74F 0%, #0B3B2F 100%)',
          display: 'none',
          '@media (min-width: 768px)': { display: 'block' }
        }} />

        {events.map((event, idx) => (
          <div
            key={event.id}
            style={{
              position: 'relative',
              marginBottom: '1.5rem',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
              transition: `all 0.5s ease ${idx * 0.15}s`
            }}
          >
            {/* Timeline Event Card */}
            <div
              className="timeline-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: activeEvent === event.id ? '2px solid #F9C74F' : '1px solid rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
              }}
              onClick={() => setActiveEvent(activeEvent === event.id ? null : event.id)}
            >
              {/* Event Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.2rem',
                background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
              }}>
                {/* Icon Circle */}
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${event.color}, ${event.color}dd)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 10px rgba(249,199,79,0.3)'
                }}>
                  <i className={event.icon} style={{ fontSize: '1.3rem', color: '#0B3B2F' }}></i>
                </div>

                {/* Event Info */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    marginBottom: '0.3rem'
                  }}>
                    <span style={{
                      background: '#F9C74F',
                      color: '#0B3B2F',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '20px',
                      fontSize: '0.65rem',
                      fontWeight: 600
                    }}>
                      {event.subtitle}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      color: '#888'
                    }}>
                      <i className="fas fa-clock" style={{ marginRight: '0.3rem', fontSize: '0.6rem' }}></i>
                      {event.time.split(' - ')[0]}
                    </span>
                  </div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    margin: 0,
                    color: '#0B3B2F'
                  }}>
                    {event.title}
                  </h4>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '0.3rem',
                    fontSize: '0.7rem',
                    color: '#888'
                  }}>
                    <i className="fas fa-calendar-alt" style={{ fontSize: '0.6rem' }}></i>
                    <span>{event.date}</span>
                    <span>•</span>
                    <i className="fas fa-map-marker-alt" style={{ fontSize: '0.6rem' }}></i>
                    <span>{event.location.split('(')[0]}</span>
                  </div>
                </div>

                {/* Expand Icon */}
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: activeEvent === event.id ? '#F9C74F' : 'rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  flexShrink: 0
                }}>
                  <i className={`fas fa-chevron-${activeEvent === event.id ? 'up' : 'down'}`} style={{
                    fontSize: '0.8rem',
                    color: activeEvent === event.id ? '#0B3B2F' : '#888'
                  }}></i>
                </div>
              </div>

              {/* Expanded Content */}
              {activeEvent === event.id && (
                <div style={{
                  padding: '1rem 1.2rem',
                  background: '#fafafa',
                  borderTop: '1px solid rgba(0,0,0,0.05)',
                  animation: 'slideDown 0.3s ease'
                }}>
                  <p style={{
                    fontSize: '0.8rem',
                    color: '#666',
                    lineHeight: '1.6',
                    marginBottom: '0.8rem'
                  }}>
                    {event.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.7rem',
                      color: '#666'
                    }}>
                      <i className="fas fa-clock" style={{ color: '#F9C74F', width: '20px' }}></i>
                      <span>{event.time}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.7rem',
                      color: '#666'
                    }}>
                      <i className="fas fa-map-marker-alt" style={{ color: '#F9C74F', width: '20px' }}></i>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  {/* Register link with text and forward arrow */}
                  <div
                    onClick={() => handleRegister(event.title)}
                    onMouseEnter={() => setIsRegisterHovered(true)}
                    onMouseLeave={() => setIsRegisterHovered(false)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      padding: '0.5rem 0',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span style={{
                      color: '#0B3B2F',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      transition: 'color 0.3s ease'
                    }}>
                      Register Now
                    </span>
                    <i 
                      className="fas fa-arrow-right" 
                      style={{
                        fontSize: '0.8rem',
                        color: '#F9C74F',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isRegisterHovered ? 'translateX(8px)' : 'translateX(0)',
                        animation: isRegisterHovered ? 'none' : 'bounceArrow 1.5s ease-in-out infinite'
                      }}
                    ></i>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View All Events - Eye icon link */}
      <div style={{
        textAlign: 'center',
        marginTop: '2rem',
        position: 'relative',
        zIndex: 1,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease 0.45s'
      }}>
        <div
          onClick={handleViewAllEvents}
          onMouseEnter={() => setIsViewHovered(true)}
          onMouseLeave={() => setIsViewHovered(false)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            padding: '0.5rem 1rem',
            borderRadius: '50px',
            transition: 'all 0.3s ease'
          }}
        >
          <i 
            className="fas fa-eye" 
            style={{
              fontSize: '1rem',
              color: '#F9C74F',
              transition: 'transform 0.3s ease',
              transform: isViewHovered ? 'scale(1.1)' : 'scale(1)'
            }}
          ></i>
          <span style={{
            color: '#0B3B2F',
            fontWeight: 600,
            fontSize: '0.85rem',
            transition: 'color 0.3s ease'
          }}>
            View All Events
          </span>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounceArrow {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5px);
          }
        }
        
        @media (max-width: 768px) {
          .timeline-card {
            margin: 0 0.5rem;
          }
          
          .timeline-card > div:first-child {
            padding: 0.8rem !important;
          }
          
          .timeline-card h4 {
            font-size: 0.85rem !important;
          }
          
          .timeline-card .fa-calendar-alt,
          .timeline-card .fa-map-marker-alt {
            font-size: 0.55rem !important;
          }
          
          .register-link span {
            font-size: 0.75rem !important;
          }
        }
        
        @media (min-width: 769px) {
          .timeline-card {
            margin-left: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Timeline;