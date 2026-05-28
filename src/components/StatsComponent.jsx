import React, { useState, useEffect, useRef } from 'react';

const StatsComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    experience: 0,
    projects: 0,
    youth: 0,
    partners: 0
  });
  
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  const statsData = [
    { id: 'experience', label: 'Years Combined Experience', value: 10, suffix: '+', icon: 'fas fa-calendar-alt', color: '#0B3B2F' },
    { id: 'projects', label: 'Projects Completed', value: 50, suffix: '+', icon: 'fas fa-project-diagram', color: '#0B3B2F' },
    { id: 'youth', label: 'Youth Empowered', value: 1000, suffix: '+', icon: 'fas fa-users', color: '#0B3B2F' },
    { id: 'partners', label: 'Community Partners', value: 20, suffix: '+', icon: 'fas fa-handshake', color: '#0B3B2F' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            setIsVisible(true);
            hasAnimated.current = true;
            startCounters();
          }
        });
      },
      { threshold: 0.3 }
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

  const startCounters = () => {
    const duration = 2500;
    const stepTime = 20;
    
    statsData.forEach((stat) => {
      const targetValue = stat.value;
      let currentValue = 0;
      const increment = targetValue / (duration / stepTime);
      
      const interval = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
          setCounters(prev => ({ ...prev, [stat.id]: targetValue }));
          clearInterval(interval);
        } else {
          setCounters(prev => ({ ...prev, [stat.id]: Math.floor(currentValue) }));
        }
      }, stepTime);
    });
  };

  // Format number with commas for thousands
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <div ref={sectionRef} style={{
      padding: '4rem 1.5rem',
      background: 'transparent', // Transparent background
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Light Decorative Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
              background: 'rgba(11,59,47,0.03)',
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 5}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Subtle Decorative Circles */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(11,59,47,0.03) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-50%',
        left: '-20%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(249,199,79,0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      {/* Section Header - Dark Text */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        position: 'relative',
        zIndex: 1,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.6s ease'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(11,59,47,0.1)',
          padding: '0.3rem 1rem',
          borderRadius: '50px',
          marginBottom: '1rem'
        }}>
          <span style={{ color: '#0B3B2F', fontWeight: 600, fontSize: '0.85rem' }}>
            <i className="fas fa-chart-line" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
            OUR IMPACT IN NUMBERS
          </span>
        </div>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
          fontWeight: 800,
          marginBottom: '0.5rem',
          color: '#0B3B2F'
        }}>
          Making a Difference
        </h2>
        <p style={{
          fontSize: 'clamp(0.9rem, 4vw, 1rem)',
          color: '#555',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Together we're creating lasting change in communities across Tanzania
        </p>
      </div>

      {/* Stats Grid - Light Theme Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {statsData.map((stat, idx) => (
          <div
            key={stat.id}
            style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
              transitionDelay: `${idx * 0.1}s`,
              border: '1px solid rgba(11,59,47,0.1)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.background = 'rgba(255,255,255,1)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
              e.currentTarget.style.border = '1px solid rgba(249,199,79,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
              e.currentTarget.style.border = '1px solid rgba(11,59,47,0.1)';
            }}
          >
            {/* Icon Container - Light Theme */}
            <div style={{
              width: '70px',
              height: '70px',
              background: 'rgba(11,59,47,0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <i className={stat.icon} style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
            </div>

            {/* Counter Number - Dark Color */}
            <div style={{
              fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
              fontWeight: 800,
              color: '#0B3B2F',
              marginBottom: '0.5rem',
              fontFamily: 'monospace',
              letterSpacing: '2px'
            }}>
              {formatNumber(counters[stat.id])}{stat.suffix}
            </div>

            {/* Label - Dark Gray */}
            <div style={{
              fontSize: 'clamp(0.85rem, 3vw, 1rem)',
              color: '#555',
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              {stat.label}
            </div>

            {/* Decorative line - Gold color */}
            <div style={{
              width: '50px',
              height: '3px',
              background: '#F9C74F',
              margin: '1rem auto 0',
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.width = '80px'}
            onMouseLeave={(e) => e.currentTarget.style.width = '50px'} />
          </div>
        ))}
      </div>

      {/* Call to Action Button - Light Theme */}
      <div style={{
        textAlign: 'center',
        marginTop: '3rem',
        position: 'relative',
        zIndex: 1,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.6s ease 0.4s'
      }}>
        <button
          onClick={() => alert('Join us in making a difference!')}
          style={{
            background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '50px',
            color: 'white',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #1a5c48, #0B3B2F)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #0B3B2F, #1a5c48)';
          }}
        >
          <i className="fas fa-chart-simple"></i>
          View Our Annual Report
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(10px) translateX(-10px);
          }
          75% {
            transform: translateY(-10px) translateX(20px);
          }
        }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StatsComponent;