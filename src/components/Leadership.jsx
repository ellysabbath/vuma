import React, { useState, useEffect, useRef } from 'react';
import { leaders } from '../data';

const Leadership = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [animatedCards, setAnimatedCards] = useState([]);
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const cardRefs = useRef([]);
  
  // Counter states
  const [counters, setCounters] = useState({
    experience: 0,
    projects: 0,
    youth: 0,
    partners: 0
  });

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

  // Animation for individual cards as they scroll into view
  useEffect(() => {
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
  }, []);

  // Separate observer for stats section with counter animation
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

  // Extended leaders data with more details
  const leadersWithDetails = leaders.map((leader, idx) => ({
    ...leader,
    id: idx,
    bio: `${leader.role} at VUMA Tanzania with over ${Math.floor(Math.random() * 15) + 5} years of experience in youth development and environmental advocacy.`,
    achievements: [
      'Led multiple successful youth programs',
      'Recognized for community impact',
      'Passionate about sustainable development'
    ]
  }));

  return (
    <>
      {/* Leadership Section */}
      <div ref={sectionRef} style={{
        padding: '4rem 1rem',
        background: 'linear-gradient(135deg, #f9fbf7 0%, #f0f5ee 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
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
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(249,199,79,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          animation: 'pulse 6s ease-in-out infinite'
        }} />

        {/* Section Header with Animation */}
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
            animation: isVisible ? 'fadeInUp 0.6s ease' : 'none'
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
            color: 'transparent',
            animation: isVisible ? 'fadeInUp 0.6s ease 0.1s' : 'none'
          }}>
            Our Leadership
          </h2>
          <p style={{
            fontSize: 'clamp(0.9rem, 4vw, 1rem)',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto',
            animation: isVisible ? 'fadeInUp 0.6s ease 0.2s' : 'none'
          }}>
            Dedicated professionals driving youth innovation and climate action in Tanzania
          </p>
        </div>

        {/* Leaders Grid with Scroll Animations */}
        <div className="leaders" style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          {leadersWithDetails.map((leader, idx) => (
            <div 
              key={idx}
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
            >
              {/* Shine Effect */}
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

              {/* Profile Image Container with Animation */}
              <div style={{
                position: 'relative',
                display: 'inline-block',
                marginBottom: '1.5rem',
                animation: animatedCards.includes(idx.toString()) ? 'zoomIn 0.6s ease' : 'none'
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
                  animation: animatedCards.includes(idx.toString()) ? 'pulse 2s ease-in-out infinite' : 'none'
                }} />
                <img 
                  src={leader.img} 
                  alt={leader.name}
                  style={{
                    width: '130px',
                    height: '130px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '4px solid white',
                    position: 'relative',
                    zIndex: 1,
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  className="profile-image"
                />
                
                {/* Social Icons Overlay on Hover */}
                <div style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  background: '#F9C74F',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(360deg)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}>
                  <i className="fas fa-share-alt" style={{ color: '#0B3B2F', fontSize: '0.9rem' }}></i>
                </div>
              </div>

              {/* Name and Title with Stagger Animation */}
              <div style={{
                animation: animatedCards.includes(idx.toString()) ? 'fadeInUp 0.6s ease' : 'none',
                animationDelay: `${idx * 0.1 + 0.1}s`
              }}>
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

              {/* Bio with Animation */}
              <p style={{
                fontSize: '0.85rem',
                color: '#666',
                lineHeight: '1.5',
                marginBottom: '1.2rem',
                padding: '0 0.5rem',
                animation: animatedCards.includes(idx.toString()) ? 'fadeInUp 0.6s ease' : 'none',
                animationDelay: `${idx * 0.1 + 0.2}s`
              }}>
                {leader.bio}
              </p>

              {/* Achievements */}
              <div style={{
                background: '#f8f9fa',
                borderRadius: '16px',
                padding: '0.8rem',
                marginBottom: '1.2rem',
                animation: animatedCards.includes(idx.toString()) ? 'fadeInUp 0.6s ease' : 'none',
                animationDelay: `${idx * 0.1 + 0.3}s`
              }}>
                {leader.achievements.map((achievement, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: i < leader.achievements.length - 1 ? '0.5rem' : 0,
                    fontSize: '0.75rem',
                    color: '#555'
                  }}>
                    <i className="fas fa-check-circle" style={{ color: '#F9C74F', fontSize: '0.7rem' }}></i>
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1.2rem',
                marginTop: '0.5rem',
                animation: animatedCards.includes(idx.toString()) ? 'fadeInUp 0.6s ease' : 'none',
                animationDelay: `${idx * 0.1 + 0.4}s`
              }}>
                <a 
                  href={leader.linkedin} 
                  style={{ 
                    color: '#0B3B2F',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#f0f0f0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0077b5';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-5px) rotate(360deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                    e.currentTarget.style.color = '#0B3B2F';
                    e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
                  }}
                >
                  <i className="fab fa-linkedin-in" style={{ fontSize: '1rem' }}></i>
                </a>
                <a 
                  href={leader.twitter} 
                  style={{ 
                    color: '#0B3B2F',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#f0f0f0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1da1f2';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-5px) rotate(360deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                    e.currentTarget.style.color = '#0B3B2F';
                    e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
                  }}
                >
                  <i className="fab fa-twitter" style={{ fontSize: '1rem' }}></i>
                </a>
                <a 
                  href="#" 
                  style={{ 
                    color: '#0B3B2F',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#f0f0f0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e4405f';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-5px) rotate(360deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                    e.currentTarget.style.color = '#0B3B2F';
                    e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
                  }}
                >
                  <i className="fab fa-instagram" style={{ fontSize: '1rem' }}></i>
                </a>
                <a 
                  href="#" 
                  style={{ 
                    color: '#0B3B2F',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#f0f0f0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0B3B2F';
                    e.currentTarget.style.color = '#F9C74F';
                    e.currentTarget.style.transform = 'translateY(-5px) rotate(360deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                    e.currentTarget.style.color = '#0B3B2F';
                    e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
                  }}
                >
                  <i className="fas fa-envelope" style={{ fontSize: '1rem' }}></i>
                </a>
              </div>

              {/* View Profile Button */}
              <button
                style={{
                  marginTop: '1.5rem',
                  background: 'transparent',
                  border: '2px solid #F9C74F',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '50px',
                  color: '#0B3B2F',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  animation: animatedCards.includes(idx.toString()) ? 'fadeInUp 0.6s ease' : 'none',
                  animationDelay: `${idx * 0.1 + 0.5}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F9C74F';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(249,199,79,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => alert(`View ${leader.name}'s full profile`)}
              >
                View Full Profile
                <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem', fontSize: '0.7rem', transition: 'transform 0.3s ease' }}
                   onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section with Scroll Animation */}
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
        {/* Animated Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(11,59,47,0.03) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: 'float 12s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-50%',
          left: '-20%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(249,199,79,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: 'float 10s ease-in-out infinite reverse'
        }} />

        {/* Stats Items with Stagger Animation */}
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
              fontFamily: 'monospace',
              animation: statsVisible ? 'countUp 0.5s ease' : 'none'
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

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(10px, -15px);
          }
          50% {
            transform: translate(-10px, 20px);
          }
          75% {
            transform: translate(15px, -10px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
        
        @keyframes countUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .leader-card:hover .shine-effect {
          left: 100%;
        }
        
        .leader-card:hover .profile-image {
          transform: scale(1.05) rotate(5deg);
        }
        
        @media (max-width: 768px) {
          .leader-card {
            width: 100% !important;
            max-width: 350px !important;
            margin: 0 auto;
          }
          
          .leaders {
            gap: 1.5rem !important;
          }
        }
        
        @media (min-width: 1200px) {
          .leader-card {
            width: 320px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Leadership;