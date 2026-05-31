import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Timeline = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [isRegisterHovered, setIsRegisterHovered] = useState(false);
  const [isViewHovered, setIsViewHovered] = useState(false);
  const sectionRef = useRef(null);
  
  // Custom alert states
  const [customAlert, setCustomAlert] = useState({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  useEffect(() => {
    fetchEvents();
    
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

  const showAlert = (type, title, message) => {
    setCustomAlert({
      show: true,
      type,
      title,
      message
    });
    if (type === 'success') {
      setTimeout(() => {
        closeAlert();
      }, 2000);
    }
  };

  const closeAlert = () => {
    setCustomAlert({
      show: false,
      type: 'success',
      title: '',
      message: ''
    });
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.137.83:8000/api/events/');
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      } else {
        setError('Failed to load events');
        showAlert('error', 'Error!', 'Failed to load events');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
      showAlert('error', 'Network Error', 'Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type) => {
    switch(type) {
      case 'Online':
        return 'fas fa-laptop';
      case 'In-Person':
        return 'fas fa-users';
      case 'Webinar':
        return 'fas fa-chalkboard-user';
      case 'Hybrid':
        return 'fas fa-people-arrows';
      default:
        return 'fas fa-calendar-alt';
    }
  };

  const getEventSubtitle = (type) => {
    switch(type) {
      case 'Online':
        return 'Online Event';
      case 'In-Person':
        return 'In-Person Event';
      case 'Webinar':
        return 'Webinar';
      case 'Hybrid':
        return 'Hybrid Event';
      default:
        return 'Upcoming Event';
    }
  };

  const handleRegister = (eventTitle, eventId) => {
    navigate(`/events/register/${eventId}`, { state: { eventName: eventTitle, eventId: eventId } });
  };

  const handleViewAllEvents = () => {
    navigate('/events');
  };

  if (loading) {
    return (
      <div ref={sectionRef} style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
            <p style={{ marginTop: '1rem', color: '#666' }}>Loading upcoming events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div ref={sectionRef} style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#d32f2f' }}></i>
            <p style={{ marginTop: '1rem', color: '#666' }}>{error}</p>
            <button 
              onClick={fetchEvents} 
              style={{ 
                marginTop: '1rem', 
                background: '#F9C74F', 
                border: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: '20px', 
                cursor: 'pointer',
                color: '#0B3B2F',
                fontWeight: 600
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show only upcoming events (you can filter by date if needed)
  const upcomingEvents = events.filter(event => event.registered < event.capacity).slice(0, 3);

  if (upcomingEvents.length === 0) {
    return (
      <div ref={sectionRef} style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '3rem'
        }}>
          <i className="fas fa-calendar-check" style={{ fontSize: '3rem', color: '#F9C74F' }}></i>
          <h3 style={{ color: '#0B3B2F', marginTop: '1rem' }}>No Upcoming Events</h3>
          <p style={{ color: '#666' }}>Check back soon for exciting events!</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      {/* Custom Alert Modal */}
      {customAlert.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '400px',
            width: '90%',
            padding: '2rem',
            textAlign: 'center',
            animation: 'slideInUp 0.3s ease',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              {customAlert.type === 'success' && (
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: '#4caf50',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <i className="fas fa-check" style={{ fontSize: '2rem', color: 'white' }}></i>
                </div>
              )}
              {customAlert.type === 'error' && (
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: '#d32f2f',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <i className="fas fa-times" style={{ fontSize: '2rem', color: 'white' }}></i>
                </div>
              )}
            </div>
            
            <h3 style={{
              color: customAlert.type === 'error' ? '#d32f2f' : '#0B3B2F',
              marginBottom: '0.5rem',
              fontSize: '1.5rem'
            }}>
              {customAlert.title}
            </h3>
            
            <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              {customAlert.message}
            </p>
            
            {customAlert.type === 'error' && (
              <button
                onClick={closeAlert}
                style={{
                  padding: '0.6rem 2rem',
                  background: '#d32f2f',
                  border: 'none',
                  borderRadius: '50px',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                OK
              </button>
            )}
          </div>
        </div>
      )}

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

        {upcomingEvents.map((event, idx) => (
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
                  background: 'linear-gradient(135deg, #F9C74F, #F9C74Fdd)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 10px rgba(249,199,79,0.3)'
                }}>
                  <i className={getEventIcon(event.type)} style={{ fontSize: '1.3rem', color: '#0B3B2F' }}></i>
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
                      {getEventSubtitle(event.type)}
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
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.7rem',
                      color: '#666'
                    }}>
                      <i className="fas fa-users" style={{ color: '#F9C74F', width: '20px' }}></i>
                      <span>{event.registered}/{event.capacity} spots filled</span>
                    </div>
                  </div>
                  
                  {/* Register link with text and forward arrow */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRegister(event.title, event.id);
                    }}
                    onMouseEnter={() => setIsRegisterHovered(true)}
                    onMouseLeave={() => setIsRegisterHovered(false)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: event.registered >= event.capacity ? 'not-allowed' : 'pointer',
                      padding: '0.5rem 0',
                      transition: 'all 0.3s ease',
                      opacity: event.registered >= event.capacity ? 0.5 : 1
                    }}
                  >
                    <span style={{
                      color: '#0B3B2F',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      transition: 'color 0.3s ease'
                    }}>
                      {event.registered >= event.capacity ? 'Fully Booked' : 'Register Now'}
                    </span>
                    {event.registered < event.capacity && (
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
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View All Events - Eye icon link */}
      {events.length > 3 && (
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
      )}

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