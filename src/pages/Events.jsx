import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/events/`);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      if (data.results && Array.isArray(data.results)) {
        setEvents(data.results);
      } else if (Array.isArray(data)) {
        setEvents(data);
      } else if (data.success && Array.isArray(data.data)) {
        setEvents(data.data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

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

  const showCircledAlert = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  // MODIFIED: Navigate to registration page WITHOUT ID
  const handleRegisterClick = () => {
    if (selectedEvent.registered >= selectedEvent.capacity) {
      showCircledAlert('This event is fully booked!', 'error');
      return;
    }
    
    closeModal();
    // Navigate to registration page - no ID in URL
    navigate('/events/register');
  };

  const getTypeStyle = (type) => {
    const styles = {
      'Online': { background: '#3b82f6', color: 'white' },
      'In-Person': { background: '#10b981', color: 'white' },
      'Webinar': { background: '#8b5cf6', color: 'white' },
      'Hybrid': { background: '#f59e0b', color: 'white' },
      'Workshop': { background: '#ef4444', color: 'white' },
      'Conference': { background: '#0B3B2F', color: 'white' }
    };
    return styles[type] || styles['Online'];
  };

  const getEventImage = (event) => {
    if (event.image_base64) {
      if (event.image_base64.startsWith('data:image')) {
        return event.image_base64;
      }
      return `data:image/jpeg;base64,${event.image_base64}`;
    }
    return `https://placehold.co/600x400/0B3B2F/white?text=${encodeURIComponent(event.title || 'Event')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (registered, capacity) => {
    if (registered >= capacity) return { color: '#ef4444', text: 'Fully Booked' };
    if (registered >= capacity * 0.8) return { color: '#f59e0b', text: 'Almost Full' };
    return { color: '#10b981', text: 'Available' };
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', margin: '0 auto', border: '3px solid rgba(11,59,47,0.1)', borderTopColor: '#0B3B2F', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', background: 'white', padding: '2rem', borderRadius: '16px', maxWidth: '400px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#ef4444' }}></i>
          <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.875rem' }}>{error}</p>
          <button onClick={fetchEvents} style={{ marginTop: '1rem', background: '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '30px', cursor: 'pointer', fontSize: '0.813rem' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', background: '#f8fafc' }}>
      {/* Circled Alert Modal */}
      {showAlert && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
          animation: 'fadeInScale 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            minWidth: '280px'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: alertType === 'success' ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              animation: 'scaleIn 0.5s ease'
            }}>
              <i className={`fas ${alertType === 'success' ? 'fa-check' : 'fa-times'}`} style={{ fontSize: '2rem', color: 'white' }}></i>
            </div>
            <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>
              {alertType === 'success' ? 'Success!' : 'Error!'}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{alertMessage}</p>
          </div>
        </div>
      )}

      {/* Thin Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 2rem',
        position: 'sticky',
        top: '70px',
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0B3B2F', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-calendar-alt" style={{ color: '#F9C74F' }}></i>
                Events
              </h1>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                {events.length} event{events.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: '#64748b' }}>
                <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
                <span>Available</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: '#64748b' }}>
                <i className="fas fa-exclamation-triangle" style={{ color: '#f59e0b' }}></i>
                <span>Almost Full</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: '#64748b' }}>
                <i className="fas fa-times-circle" style={{ color: '#ef4444' }}></i>
                <span>Full</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-calendar-times" style={{ fontSize: '3rem', color: '#cbd5e1' }}></i>
            <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.875rem' }}>No events available at the moment.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {events.map((event, idx) => {
              const status = getStatusColor(event.registered || 0, event.capacity || 100);
              return (
                <div 
                  key={event.id} 
                  data-aos="fade-up" 
                  data-aos-delay={idx * 50} 
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: '1px solid #e2e8f0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#F9C74F';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                  onClick={() => openModal(event)}
                >
                  {/* Event Image - Small thumbnail */}
                  <div style={{ flex: '0 0 100px', minWidth: '100px', background: '#f1f5f9' }}>
                    <img 
                      src={getEventImage(event)} 
                      alt={event.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '100px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/100x100/0B3B2F/white?text=${encodeURIComponent(event.title?.charAt(0) || 'E')}`;
                      }}
                    />
                  </div>
                  
                  {/* Event Details - Compact */}
                  <div style={{ flex: 1, padding: '1rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{
                          background: getTypeStyle(event.type).background,
                          color: getTypeStyle(event.type).color,
                          padding: '0.15rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.6rem',
                          fontWeight: 600,
                          display: 'inline-block'
                        }}>
                          {event.type || 'Event'}
                        </span>
                        <span style={{
                          fontSize: '0.6rem',
                          color: status.color,
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}>
                          <i className={`fas ${status.text === 'Available' ? 'fa-check-circle' : status.text === 'Almost Full' ? 'fa-exclamation-triangle' : 'fa-times-circle'}`}></i>
                          {status.text}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <i className="fas fa-users" style={{ color: '#F9C74F' }}></i>
                        {event.registered || 0}/{event.capacity || 100}
                      </div>
                    </div>
                    
                    <h3 style={{ color: '#0B3B2F', marginBottom: '0.25rem', fontSize: '0.95rem', fontWeight: 700 }}>
                      {event.title}
                    </h3>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <p style={{ color: '#64748b', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <i className="fas fa-calendar-alt" style={{ color: '#F9C74F', fontSize: '0.6rem' }}></i>
                        {formatDate(event.date)}
                      </p>
                      {event.time && (
                        <p style={{ color: '#64748b', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <i className="fas fa-clock" style={{ color: '#F9C74F', fontSize: '0.6rem' }}></i>
                          {event.time}
                        </p>
                      )}
                      <p style={{ color: '#64748b', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <i className="fas fa-map-marker-alt" style={{ color: '#F9C74F', fontSize: '0.6rem' }}></i>
                        {event.location || 'TBA'}
                      </p>
                    </div>
                    
                    <p style={{ color: '#475569', fontSize: '0.7rem', lineHeight: '1.4', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {event.description ? event.description.substring(0, 80) + (event.description.length > 80 ? '...' : '') : 'No description available'}
                    </p>
                    
                    <div style={{ fontSize: '0.65rem', color: '#F9C74F', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <i className="fas fa-eye"></i>
                      Click for details
                      <i className="fas fa-chevron-right" style={{ fontSize: '0.5rem' }}></i>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
          padding: '20px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '24px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            position: 'relative',
            animation: 'slideInUp 0.3s ease'
          }}>
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                color: 'white',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Modal Image */}
            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
              <img 
                src={getEventImage(selectedEvent)} 
                alt={selectedEvent.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/600x300/0B3B2F/white?text=${encodeURIComponent(selectedEvent.title || 'Event')}`;
                }}
              />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))' }} />
              
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', zIndex: 10 }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <span style={{
                    display: 'inline-block',
                    background: getTypeStyle(selectedEvent.type).background,
                    color: 'white',
                    padding: '0.2rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.65rem',
                    fontWeight: 600
                  }}>
                    {selectedEvent.type || 'Event'}
                  </span>
                  <span style={{
                    display: 'inline-block',
                    background: selectedEvent.registered >= selectedEvent.capacity ? '#ef4444' : '#10b981',
                    color: 'white',
                    padding: '0.2rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.65rem',
                    fontWeight: 600
                  }}>
                    {selectedEvent.registered >= selectedEvent.capacity ? 'Fully Booked' : `${selectedEvent.capacity - selectedEvent.registered} spots left`}
                  </span>
                </div>
                <h2 style={{ color: 'white', margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>
                  {selectedEvent.title}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.25rem' }}>
              {/* Event Info Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                marginBottom: '1.25rem',
                background: '#f8fafc',
                padding: '0.75rem',
                borderRadius: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <i className="fas fa-calendar-alt" style={{ color: '#F9C74F', fontSize: '0.6rem' }}></i>
                    Date
                  </div>
                  <div style={{ fontWeight: 600, color: '#0B3B2F', fontSize: '0.8rem' }}>{formatDate(selectedEvent.date)}</div>
                </div>
                {selectedEvent.time && (
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <i className="fas fa-clock" style={{ color: '#F9C74F', fontSize: '0.6rem' }}></i>
                      Time
                    </div>
                    <div style={{ fontWeight: 600, color: '#0B3B2F', fontSize: '0.8rem' }}>{selectedEvent.time}</div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#F9C74F', fontSize: '0.6rem' }}></i>
                    Location
                  </div>
                  <div style={{ fontWeight: 600, color: '#0B3B2F', fontSize: '0.8rem' }}>{selectedEvent.location || 'TBA'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <i className="fas fa-users" style={{ color: '#F9C74F', fontSize: '0.6rem' }}></i>
                    Capacity
                  </div>
                  <div style={{ fontWeight: 600, color: '#0B3B2F', fontSize: '0.8rem' }}>
                    {selectedEvent.registered || 0}/{selectedEvent.capacity || 100} registered
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-info-circle" style={{ color: '#F9C74F', fontSize: '0.75rem' }}></i>
                  About This Event
                </h3>
                <p style={{ color: '#475569', lineHeight: '1.5', fontSize: '0.8rem' }}>
                  {selectedEvent.full_description || selectedEvent.description || 'No description available'}
                </p>
              </div>

              {/* Speakers */}
              {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-microphone-alt" style={{ color: '#F9C74F', fontSize: '0.75rem' }}></i>
                    Speakers
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedEvent.speakers.map((speaker, i) => (
                      <span key={i} style={{
                        background: '#f1f5f9',
                        color: '#0B3B2F',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 500
                      }}>
                        <i className="fas fa-user" style={{ marginRight: '0.3rem', fontSize: '0.6rem' }}></i>
                        {speaker}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    background: '#f1f5f9',
                    border: 'none',
                    padding: '0.6rem',
                    borderRadius: '40px',
                    color: '#64748b',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
                >
                  <i className="fas fa-times" style={{ marginRight: '0.4rem' }}></i>
                  Close
                </button>
                <button
                  onClick={handleRegisterClick}
                  disabled={selectedEvent.registered >= selectedEvent.capacity}
                  style={{
                    flex: 2,
                    background: selectedEvent.registered >= selectedEvent.capacity ? '#cbd5e1' : '#F9C74F',
                    border: 'none',
                    padding: '0.6rem',
                    borderRadius: '40px',
                    color: selectedEvent.registered >= selectedEvent.capacity ? '#64748b' : '#0B3B2F',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    cursor: selectedEvent.registered >= selectedEvent.capacity ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  {selectedEvent.registered >= selectedEvent.capacity ? (
                    <>
                      <i className="fas fa-times-circle"></i>
                      Fully Booked
                    </>
                  ) : (
                    <>
                      <i className="fas fa-handshake"></i>
                      Register Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modal-content::-webkit-scrollbar {
          width: 5px;
        }
        .modal-content::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .modal-content::-webkit-scrollbar-thumb {
          background: #F9C74F;
          border-radius: 3px;
        }
        
        @media (max-width: 768px) {
          .modal-content {
            max-height: 90vh;
          }
          .modal-content > div:first-child {
            height: 160px;
          }
        }
      `}</style>
    </div>
  );
};

export default Events;