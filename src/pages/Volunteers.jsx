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

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
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
      console.error('Error fetching volunteers:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (volunteer) => {
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

  const getImageSrc = (volunteer) => {
    if (volunteer.image_base64) {
      if (volunteer.image_base64.startsWith('data:image')) {
        return volunteer.image_base64;
      }
      return `data:image/jpeg;base64,${volunteer.image_base64}`;
    }
    const name = volunteer.name || 'Volunteer';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=0B3B2F&color=fff&size=200&bold=true`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', margin: '0 auto', border: '3px solid rgba(11,59,47,0.1)', borderTopColor: '#0B3B2F', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>Loading volunteers...</p>
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
          <button onClick={fetchVolunteers} style={{ marginTop: '1rem', background: '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '30px', cursor: 'pointer', fontSize: '0.813rem' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
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
                <i className="fas fa-hands-helping" style={{ color: '#F9C74F' }}></i>
                Volunteers
              </h1>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                {volunteers.length} dedicated volunteer{volunteers.length !== 1 ? 's' : ''} making a difference
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleJoinClick}
                style={{
                  background: '#0B3B2F',
                  color: 'white',
                  border: 'none',
                  padding: '0.4rem 1rem',
                  borderRadius: '30px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1a5c48'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#0B3B2F'}
              >
                <i className="fas fa-user-plus"></i>
                Join Team
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.75rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F9C74F' }}>{volunteers.length}</div>
              <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Volunteers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F9C74F' }}>
                {volunteers.reduce((sum, v) => sum + (v.hours_contributed || 0), 0)}+
              </div>
              <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Hours</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F9C74F' }}>
                {volunteers.reduce((sum, v) => sum + (v.projects_participated || 0), 0)}
              </div>
              <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* Volunteers Grid - Borderless Cards */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {volunteers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-users" style={{ fontSize: '3rem', color: '#cbd5e1' }}></i>
            <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.875rem' }}>No volunteers found.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {volunteers.map((volunteer, idx) => (
              <div 
                key={volunteer.id} 
                data-aos="fade-up" 
                data-aos-delay={idx * 50}
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 30px -12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                }}
                onClick={() => openModal(volunteer)}
              >
                {/* Profile Image */}
                <div style={{ 
                  padding: '2rem 1.5rem 1rem',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #fafbfc 0%, #ffffff 100%)'
                }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    margin: '0 auto',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
                  }}>
                    <img 
                      src={getImageSrc(volunteer)} 
                      alt={volunteer.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        const name = volunteer.name || 'Volunteer';
                        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=0B3B2F&color=fff&size=200&bold=true`;
                      }}
                    />
                  </div>
                  
                  {/* Verified Badge */}
                  <div style={{
                    display: 'inline-block',
                    marginTop: '0.5rem',
                    background: 'rgba(249,199,79,0.15)',
                    borderRadius: '20px',
                    padding: '0.2rem 0.6rem',
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    color: '#F9C74F'
                  }}>
                    <i className="fas fa-check-circle" style={{ marginRight: '0.2rem', fontSize: '0.55rem' }}></i>
                    Verified Volunteer
                  </div>
                </div>
                
                {/* Content - All Details */}
                <div style={{ padding: '0 1.5rem 1.5rem' }}>
                  <h3 style={{ 
                    color: '#0B3B2F', 
                    marginBottom: '0.3rem', 
                    fontSize: '1.1rem', 
                    fontWeight: 700,
                    textAlign: 'center'
                  }}>
                    {volunteer.name}
                  </h3>
                  <p style={{ 
                    color: '#F9C74F', 
                    fontWeight: 600, 
                    fontSize: '0.7rem',
                    marginBottom: '1rem',
                    textAlign: 'center',
                    letterSpacing: '0.3px'
                  }}>
                    {volunteer.role}
                  </p>
                  
                  {/* Details Grid */}
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '0.75rem'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <i className="fas fa-map-marker-alt" style={{ color: '#F9C74F', fontSize: '0.7rem', marginBottom: '0.2rem', display: 'block' }}></i>
                      <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Location</span>
                      <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#0B3B2F', marginTop: '0.2rem' }}>
                        {volunteer.location}
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <i className="fas fa-clock" style={{ color: '#F9C74F', fontSize: '0.7rem', marginBottom: '0.2rem', display: 'block' }}></i>
                      <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Hours</span>
                      <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#0B3B2F', marginTop: '0.2rem' }}>
                        {volunteer.hours_contributed}+ hours
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <i className="fas fa-project-diagram" style={{ color: '#F9C74F', fontSize: '0.7rem', marginBottom: '0.2rem', display: 'block' }}></i>
                      <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Projects</span>
                      <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#0B3B2F', marginTop: '0.2rem' }}>
                        {volunteer.projects_participated} projects
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <i className="fas fa-calendar-alt" style={{ color: '#F9C74F', fontSize: '0.7rem', marginBottom: '0.2rem', display: 'block' }}></i>
                      <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Member Since</span>
                      <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#0B3B2F', marginTop: '0.2rem' }}>
                        {volunteer.join_date ? new Date(volunteer.join_date).getFullYear() : '2024'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Bio Preview */}
                  {volunteer.bio && (
                    <p style={{ 
                      fontSize: '0.7rem', 
                      color: '#64748b', 
                      lineHeight: '1.4',
                      marginBottom: '1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textAlign: 'center'
                    }}>
                      {volunteer.bio.length > 100 ? volunteer.bio.substring(0, 100) + '...' : volunteer.bio}
                    </p>
                  )}
                  
                  {/* Achievements Preview */}
                  {volunteer.achievements && volunteer.achievements.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', justifyContent: 'center' }}>
                        {volunteer.achievements.slice(0, 2).map((achievement, i) => (
                          <span key={i} style={{
                            background: '#fef3c7',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '12px',
                            fontSize: '0.55rem',
                            fontWeight: 500,
                            color: '#0B3B2F'
                          }}>
                            <i className="fas fa-medal" style={{ marginRight: '0.2rem', fontSize: '0.5rem' }}></i>
                            {achievement.length > 30 ? achievement.substring(0, 30) + '...' : achievement}
                          </span>
                        ))}
                        {volunteer.achievements.length > 2 && (
                          <span style={{
                            background: '#e2e8f0',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '12px',
                            fontSize: '0.55rem',
                            fontWeight: 500,
                            color: '#64748b'
                          }}>
                            +{volunteer.achievements.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* View Profile Link */}
                  <div style={{ 
                    textAlign: 'center',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid #f1f5f9',
                    color: '#F9C74F',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem'
                  }}>
                    <span>View Full Profile</span>
                    <i className="fas fa-arrow-right" style={{ fontSize: '0.6rem', transition: 'transform 0.2s' }}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
          padding: '20px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '24px',
            maxWidth: '550px',
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

            {/* Profile Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <div style={{
                width: '110px',
                height: '110px',
                margin: '0 auto',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid #F9C74F',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}>
                <img 
                  src={getImageSrc(selectedVolunteer)} 
                  alt={selectedVolunteer.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    const name = selectedVolunteer.name || 'Volunteer';
                    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=0B3B2F&color=fff&size=200&bold=true`;
                  }}
                />
              </div>
              <h2 style={{ color: 'white', marginTop: '0.75rem', marginBottom: '0.2rem', fontSize: '1.25rem', fontWeight: 700 }}>
                {selectedVolunteer.name}
              </h2>
              <p style={{ color: '#F9C74F', fontWeight: 600, fontSize: '0.7rem' }}>
                {selectedVolunteer.role}
              </p>
            </div>

            {/* Profile Body */}
            <div style={{ padding: '1.25rem' }}>
              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F9C74F' }}>{selectedVolunteer.hours_contributed}+</div>
                  <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Hours</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F9C74F' }}>{selectedVolunteer.projects_participated}</div>
                  <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Projects</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F9C74F' }}>
                    {selectedVolunteer.join_date ? new Date(selectedVolunteer.join_date).getFullYear() : '2024'}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Joined</div>
                </div>
              </div>

              {/* Location */}
              {selectedVolunteer.location && (
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#F9C74F', fontSize: '0.7rem' }}></i>
                    Location
                  </h3>
                  <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '10px', fontSize: '0.75rem', color: '#0B3B2F' }}>
                    <i className="fas fa-location-dot" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                    {selectedVolunteer.location}
                  </div>
                </div>
              )}

              {/* Bio */}
              {selectedVolunteer.bio && (
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <i className="fas fa-user-circle" style={{ color: '#F9C74F', fontSize: '0.7rem' }}></i>
                    About
                  </h3>
                  <p style={{ color: '#475569', lineHeight: '1.5', fontSize: '0.75rem' }}>
                    {selectedVolunteer.bio}
                  </p>
                </div>
              )}

              {/* Join Date */}
              {selectedVolunteer.join_date && (
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <i className="fas fa-calendar-check" style={{ color: '#F9C74F', fontSize: '0.7rem' }}></i>
                    Joined Date
                  </h3>
                  <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '10px', fontSize: '0.75rem', color: '#0B3B2F' }}>
                    {formatDate(selectedVolunteer.join_date)}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {selectedVolunteer.achievements && selectedVolunteer.achievements.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <i className="fas fa-trophy" style={{ color: '#F9C74F', fontSize: '0.7rem' }}></i>
                    Achievements
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {selectedVolunteer.achievements.map((achievement, i) => (
                      <span key={i} style={{
                        background: '#fef3c7',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        color: '#0B3B2F'
                      }}>
                        <i className="fas fa-medal" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                        {achievement}
                      </span>
                    ))}
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
                  padding: '0.6rem',
                  borderRadius: '40px',
                  color: '#0B3B2F',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginTop: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(249,199,79,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <i className="fas fa-times" style={{ marginRight: '0.3rem' }}></i>
                Close
              </button>
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
          background: #f1f5f9;
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
      `}</style>
    </div>
  );
};

export default Volunteers;