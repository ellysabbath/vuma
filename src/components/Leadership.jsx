import React, { useState, useEffect, useRef } from 'react';

const Leadership = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [animatedCards, setAnimatedCards] = useState([]);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const cardRefs = useRef([]);
  
  const [counters, setCounters] = useState({
    experience: 0,
    projects: 0,
    youth: 0,
    partners: 0
  });

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  // Fetch leaders from API
  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/leaders/`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      const leadersArray = Array.isArray(data) ? data : (data.data || data.results || []);
      
      // Add additional fields for the UI
      const leadersWithDetails = leadersArray.map((leader, idx) => ({
        ...leader,
        bio: leader.bio || `${leader.role} at VUMA Tanzania with experience in youth development and environmental advocacy.`,
        fullBio: leader.full_bio || `${leader.name} is a dedicated professional with extensive experience in youth empowerment and sustainable development. As ${leader.role}, they have led numerous initiatives that have positively impacted communities across Tanzania.`,
        achievements: [
          'Led multiple successful youth programs',
          'Recognized for community impact',
          'Passionate about sustainable development'
        ]
      }));
      
      setLeaders(leadersWithDetails);
      setError(null);
    } catch (error) {
      console.error('Error fetching leaders:', error);
      setError('Failed to load leadership team. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (leaders.length > 0) {
      const cardObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = entry.target.dataset.index;
              setAnimatedCards(prev => [...prev, index]);
            }
          });
        },
        { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
      );

      cardRefs.current.forEach((card) => {
        if (card) cardObserver.observe(card);
      });

      return () => {
        cardRefs.current.forEach((card) => {
          if (card) cardObserver.unobserve(card);
        });
      };
    }
  }, [leaders]);

  useEffect(() => {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsVisible) {
            setStatsVisible(true);
            startCounters();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      statsObserver.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        statsObserver.unobserve(statsRef.current);
      }
    };
  }, [statsVisible]);

  const startCounters = () => {
    const duration = 2000;
    const stepTime = 20;
    
    const statsData = [
      { id: 'experience', target: 10 },
      { id: 'projects', target: 50 },
      { id: 'youth', target: 1000 },
      { id: 'partners', target: 20 }
    ];
    
    statsData.forEach((stat) => {
      let currentValue = 0;
      const increment = stat.target / (duration / stepTime);
      
      const interval = setInterval(() => {
        currentValue += increment;
        if (currentValue >= stat.target) {
          setCounters(prev => ({ ...prev, [stat.id]: stat.target }));
          clearInterval(interval);
        } else {
          setCounters(prev => ({ ...prev, [stat.id]: Math.floor(currentValue) }));
        }
      }, stepTime);
    });
  };

  const openModal = (leader) => {
    setSelectedLeader(leader);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLeader(null);
    document.body.style.overflow = 'unset';
  };

  // Helper functions for avatars
  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      '#0B3B2F', '#F9C74F', '#2b7a5c', '#2196F3', '#9C27B0', 
      '#FF9800', '#4caf50', '#d32f2f', '#00BCD4', '#795548'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) {
    return (
      <div style={{
        padding: '4rem 1rem',
        background: 'linear-gradient(135deg, #f9fbf7 0%, #f0f5ee 100%)',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '3px solid #F9C74F',
            borderTopColor: '#0B3B2F',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#666' }}>Loading leadership team...</p>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '4rem 1rem',
        background: 'linear-gradient(135deg, #f9fbf7 0%, #f0f5ee 100%)',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#d32f2f', marginBottom: '1rem' }}></i>
          <p style={{ color: '#666' }}>{error}</p>
          <button 
            onClick={fetchLeaders}
            style={{
              marginTop: '1rem',
              background: '#0B3B2F',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-sync-alt"></i> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (leaders.length === 0) {
    return (
      <div style={{
        padding: '4rem 1rem',
        background: 'linear-gradient(135deg, #f9fbf7 0%, #f0f5ee 100%)',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-users-slash" style={{ fontSize: '3rem', color: '#F9C74F', marginBottom: '1rem' }}></i>
          <p style={{ color: '#666' }}>No leadership team members found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Leadership Section */}
      <div ref={sectionRef} style={{
        padding: '4rem 1rem',
        background: 'linear-gradient(135deg, #f9fbf7 0%, #f0f5ee 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(10px, -15px); }
            50% { transform: translate(-10px, 20px); }
            75% { transform: translate(15px, -10px); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 10px 25px rgba(11,59,47,0.2); transform: scale(1); }
            50% { box-shadow: 0 15px 35px rgba(249,199,79,0.4); transform: scale(1.05); }
          }
          @keyframes bounceIn {
            0% { opacity: 0; transform: scale(0.3); }
            50% { opacity: 1; transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); }
          }
          
          .leader-card:hover .shine-effect {
            left: 100%;
          }
          
          .leader-card:hover .profile-image {
            transform: scale(1.05) rotate(5deg);
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
            .leader-card {
              width: 100% !important;
              max-width: 350px !important;
              margin: 0 auto;
            }
            .leaders { gap: 1.5rem !important; }
            .modal-content { max-height: 90vh; }
          }
          
          @media (min-width: 1200px) {
            .leader-card { width: 320px !important; }
          }
        `}</style>

        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(249,199,79,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(11,59,47,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: 'float 10s ease-in-out infinite reverse'
        }} />

        {/* Section Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(249,199,79,0.2)',
            padding: '0.3rem 1rem',
            borderRadius: '50px',
            marginBottom: '1rem',
            animation: isVisible ? 'bounceIn 0.6s ease' : 'none'
          }}>
            <span style={{ color: '#0B3B2F', fontWeight: 600, fontSize: '0.85rem' }}>
              <i className="fas fa-users" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
              MEET THE TEAM
            </span>
          </div>
          <h2 className="section-title" style={{
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
            fontWeight: 800,
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #0B3B2F, #2b7a5c)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}>
            Our Leadership
          </h2>
          <p style={{
            fontSize: 'clamp(0.9rem, 4vw, 1rem)',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Dedicated professionals driving youth innovation and climate action in Tanzania
          </p>
        </div>

        {/* Leaders Grid */}
        <div className="leaders" style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          {leaders.map((leader, idx) => (
            <div 
              key={leader.id || idx}
              ref={el => cardRefs.current[idx] = el}
              data-index={idx}
              className="leader-card"
              style={{
                background: 'white',
                textAlign: 'center',
                padding: '2rem 1.5rem',
                borderRadius: '32px',
                width: 'clamp(280px, 30vw, 320px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                opacity: animatedCards.includes(idx.toString()) ? 1 : 0,
                transform: animatedCards.includes(idx.toString()) ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.95)',
                transitionDelay: `${idx * 0.1}s`,
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                if (animatedCards.includes(idx.toString())) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
              }}
              onClick={() => openModal(leader)}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                transition: 'left 0.5s ease',
                pointerEvents: 'none'
              }}
              className="shine-effect" />

              {/* Avatar with Initials - No Image */}
              <div style={{
                position: 'relative',
                display: 'inline-block',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-5px',
                  left: '-5px',
                  right: '-5px',
                  bottom: '-5px',
                  background: 'linear-gradient(135deg, #F9C74F, #f6b83e)',
                  borderRadius: '50%',
                  zIndex: 0,
                  animation: 'pulse 2s ease-in-out infinite'
                }} />
                <div style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${getAvatarColor(leader.name)}, ${getAvatarColor(leader.name)}cc)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1,
                  border: '4px solid white',
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: 'pulseGlow 2s ease-in-out infinite'
                }}
                className="profile-image">
                  <span style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {getInitials(leader.name)}
                  </span>
                </div>
              </div>

              <div>
                <h3 style={{
                  fontSize: '1.3rem',
                  color: '#0B3B2F',
                  marginBottom: '0.3rem',
                  fontWeight: 700
                }}>
                  {leader.name}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#F9C74F',
                  marginBottom: '0.8rem',
                  fontWeight: 600
                }}>
                  {leader.role}
                </p>
              </div>

              <p style={{
                fontSize: '0.85rem',
                color: '#666',
                lineHeight: '1.5',
                marginBottom: '1rem',
                padding: '0 0.5rem'
              }}>
                {leader.bio && leader.bio.length > 100 ? leader.bio.substring(0, 100) + '...' : leader.bio}
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '50px',
                background: 'rgba(249,199,79,0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F9C74F';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(249,199,79,0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}>
                <i className="fas fa-eye" style={{ color: '#F9C74F', fontSize: '0.8rem' }}></i>
                <span style={{ color: '#0B3B2F', fontSize: '0.75rem', fontWeight: 600 }}>View Full Profile</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div ref={statsRef} style={{
        margin: '2rem auto',
        padding: '3rem 2rem',
        background: 'transparent',
        borderRadius: '32px',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        gap: '2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {[
          { id: 'experience', icon: 'fas fa-calendar-alt', label: 'Years Combined Experience', value: counters.experience, suffix: '+' },
          { id: 'projects', icon: 'fas fa-project-diagram', label: 'Projects Completed', value: counters.projects, suffix: '+' },
          { id: 'youth', icon: 'fas fa-users', label: 'Youth Empowered', value: counters.youth.toLocaleString(), suffix: '+' },
          { id: 'partners', icon: 'fas fa-handshake', label: 'Community Partners', value: counters.partners, suffix: '+' }
        ].map((stat, idx) => (
          <div 
            key={stat.id}
            style={{ 
              flex: 1, 
              minWidth: '150px',
              padding: '1.5rem',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '20px',
              cursor: 'pointer',
              opacity: statsVisible ? 1 : 0,
              transform: statsVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)',
              transitionDelay: `${idx * 0.15}s`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.background = 'rgba(11,59,47,0.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <div style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              fontWeight: 800, 
              color: '#0B3B2F',
              fontFamily: 'monospace'
            }}>
              {stat.value}{stat.suffix}
            </div>
            <div style={{ color: '#555', fontSize: '0.85rem', fontWeight: 500, marginTop: '0.5rem' }}>
              <i className={stat.icon} style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
              {stat.label}
            </div>
            <div style={{
              width: '40px',
              height: '2px',
              background: '#F9C74F',
              margin: '0.75rem auto 0',
              borderRadius: '1px',
              transition: 'width 0.4s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.width = '80px'}
            onMouseLeave={(e) => e.currentTarget.style.width = '40px'} />
          </div>
        ))}
      </div>

      {/* Leader Profile Modal */}
      {showModal && selectedLeader && (
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
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <i className="fas fa-times"></i>
            </button>

            <div style={{
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
              padding: '2rem',
              textAlign: 'center'
            }}>
              {/* Avatar in Modal */}
              <div style={{
                width: '100px',
                height: '100px',
                margin: '0 auto',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${getAvatarColor(selectedLeader.name)}, ${getAvatarColor(selectedLeader.name)}cc)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '4px solid #F9C74F'
              }}>
                <span style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {getInitials(selectedLeader.name)}
                </span>
              </div>
              <h2 style={{ color: 'white', marginTop: '1rem', marginBottom: '0.3rem' }}>{selectedLeader.name}</h2>
              <p style={{ color: '#F9C74F', fontWeight: 600 }}>{selectedLeader.role}</p>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {selectedLeader.bio && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>
                    <i className="fas fa-user-circle" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                    Biography
                  </h3>
                  <p style={{ color: '#555', lineHeight: '1.6' }}>{selectedLeader.fullBio || selectedLeader.bio}</p>
                </div>
              )}

              {selectedLeader.linkedin && (
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>
                    <i className="fab fa-linkedin" style={{ marginRight: '0.5rem', color: '#0077B5' }}></i>
                    Connect
                  </h3>
                  <a 
                    href={selectedLeader.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      color: '#0077B5',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <i className="fab fa-linkedin"></i> LinkedIn Profile
                  </a>
                </div>
              )}

              {selectedLeader.twitter && (
                <div style={{ marginBottom: '1rem' }}>
                  <a 
                    href={selectedLeader.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      color: '#1DA1F2',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <i className="fab fa-twitter"></i> Twitter Profile
                  </a>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: '2px solid #ddd',
                    padding: '0.7rem',
                    borderRadius: '50px',
                    color: '#666',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#F9C74F';
                    e.currentTarget.style.color = '#0B3B2F';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.color = '#666';
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Leadership;