import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Volunteers = () => {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isJoinHovered, setIsJoinHovered] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://vuma.pythonanywhere.com/api/volunteers/');
      const data = await response.json();
      if (data.success) {
        setVolunteers(data.data);
      } else {
        setError('Failed to load volunteers');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = async (volunteer) => {
    setSelectedVolunteer(volunteer);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVolunteer(null);
    document.body.style.overflow = 'unset';
  };

  const handleJoinClick = () => {
    navigate('/signup');
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading volunteers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#d32f2f' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>{error}</p>
          <button onClick={fetchVolunteers} style={{ marginTop: '1rem', background: '#F9C74F', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
          Our Amazing Volunteers
        </h1>
        <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>
          Meet the dedicated individuals making a difference in communities across Tanzania
        </p>
      </div>

      {/* Volunteers Gallery */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        {volunteers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <i className="fas fa-users" style={{ fontSize: '3rem', color: '#999' }}></i>
            <p style={{ marginTop: '1rem', color: '#666' }}>No volunteers found.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {volunteers.map((volunteer, idx) => (
              <div key={volunteer.id} data-aos="zoom-in" data-aos-delay={idx * 100} style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => openModal(volunteer)}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  margin: '1.5rem auto 0',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid #F9C74F'
                }}>
                  <img 
                    src={volunteer.image} 
                    alt={volunteer.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.3rem' }}>{volunteer.name}</h3>
                  <p style={{ color: '#F9C74F', fontWeight: 600, marginBottom: '0.5rem' }}>{volunteer.role}</p>
                  <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                    <i className="fas fa-map-marker-alt" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                    {volunteer.location}
                  </p>
                  <p style={{ color: '#666', fontSize: '0.8rem' }}>
                    <i className="fas fa-clock" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                    {volunteer.hours_contributed}+ hours
                  </p>
                  <div style={{ 
                    marginTop: '0.8rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.5rem', 
                    color: '#F9C74F', 
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}>
                    <i className="fas fa-eye"></i>
                    <span>View Profile</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Join Volunteer Team - Arrow Forward Icon */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '2rem',
          animation: 'slideInUp 0.6s ease'
        }}>
          <div
            onClick={handleJoinClick}
            onMouseEnter={() => setIsJoinHovered(true)}
            onMouseLeave={() => setIsJoinHovered(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.8rem',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderRadius: '50px',
              transition: 'all 0.3s ease',
              background: 'transparent'
            }}
          >
            <span style={{
              color: '#0B3B2F',
              fontWeight: 600,
              fontSize: 'clamp(0.9rem, 4vw, 1rem)',
              transition: 'color 0.3s ease'
            }}>
              Join Our Volunteer Team
            </span>
            <i 
              className="fas fa-arrow-right" 
              style={{
                fontSize: '1.2rem',
                color: '#F9C74F',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isJoinHovered ? 'translateX(8px)' : 'translateX(0)',
                animation: isJoinHovered ? 'none' : 'bounceArrow 1.5s ease-in-out infinite'
              }}
            ></i>
          </div>
        </div>
      </div>

      {/* Volunteer Profile Modal */}
      {showModal && selectedVolunteer && (
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
                zIndex: 10,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Profile Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
              padding: '2rem',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid #F9C74F',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}>
                <img 
                  src={selectedVolunteer.image} 
                  alt={selectedVolunteer.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h2 style={{ color: 'white', marginTop: '1rem', marginBottom: '0.3rem' }}>{selectedVolunteer.name}</h2>
              <p style={{ color: '#F9C74F', fontWeight: 600 }}>{selectedVolunteer.role}</p>
            </div>

            {/* Profile Body */}
            <div style={{ padding: '1.5rem' }}>
              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F9C74F' }}>{selectedVolunteer.hours_contributed}+</div>
                  <div style={{ fontSize: '0.7rem', color: '#666' }}>Hours</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F9C74F' }}>{selectedVolunteer.projects_participated}</div>
                  <div style={{ fontSize: '0.7rem', color: '#666' }}>Projects</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F9C74F' }}>{selectedVolunteer.join_date.split(' ')[1]}</div>
                  <div style={{ fontSize: '0.7rem', color: '#666' }}>Member</div>
                </div>
              </div>

              {/* Bio */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1rem' }}>
                  <i className="fas fa-user-circle" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  About
                </h3>
                <p style={{ color: '#555', lineHeight: '1.6', fontSize: '0.9rem' }}>{selectedVolunteer.bio}</p>
              </div>

              {/* Location */}
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1rem' }}>
                  <i className="fas fa-map-marker-alt" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  Location
                </h3>
                <p style={{ color: '#555', fontSize: '0.9rem' }}>{selectedVolunteer.location}</p>
              </div>

              {/* Achievements */}
              {selectedVolunteer.achievements && selectedVolunteer.achievements.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1rem' }}>
                    <i className="fas fa-trophy" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                    Achievements
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {selectedVolunteer.achievements.map((achievement, i) => (
                      <li key={i} style={{ padding: '0.3rem 0', color: '#555', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                        <i className="fas fa-medal" style={{ color: '#F9C74F', fontSize: '0.7rem' }}></i>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Social Links */}
              {selectedVolunteer.social && Object.keys(selectedVolunteer.social).length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1rem' }}>
                    <i className="fas fa-share-alt" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                    Connect
                  </h3>
                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    {selectedVolunteer.social.twitter && (
                      <a href={`https://twitter.com/${selectedVolunteer.social.twitter}`} target="_blank" rel="noopener noreferrer" style={{
                        background: '#1da1f2',
                        border: 'none',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <i className="fab fa-twitter"></i>
                      </a>
                    )}
                    {selectedVolunteer.social.linkedin && (
                      <a href={`https://linkedin.com/in/${selectedVolunteer.social.linkedin}`} target="_blank" rel="noopener noreferrer" style={{
                        background: '#0077b5',
                        border: 'none',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    )}
                    {selectedVolunteer.social.instagram && (
                      <a href={`https://instagram.com/${selectedVolunteer.social.instagram}`} target="_blank" rel="noopener noreferrer" style={{
                        background: '#e4405f',
                        border: 'none',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <i className="fab fa-instagram"></i>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={closeModal}
                style={{
                  width: '100%',
                  background: '#F9C74F',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '50px',
                  color: '#0B3B2F',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginTop: '1rem'
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
                Close
              </button>
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
        
        @keyframes bounceArrow {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5px);
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
          border-radius: 3px;
        }
        
        @media (max-width: 768px) {
          .modal-content {
            max-height: 90vh;
          }
        }
        
        @media (max-width: 480px) {
          .modal-content {
            border-radius: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Volunteers;