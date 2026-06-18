import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const StatsComponent = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    experience: 0,
    projects: 0,
    youth: 0,
    partners: 0
  });
  const [statsData, setStatsData] = useState([
    { id: 'experience', label: 'Years Combined Experience', value: 0, suffix: '+', icon: 'fas fa-calendar-alt', color: '#0B3B2F' },
    { id: 'projects', label: 'Projects Completed', value: 0, suffix: '+', icon: 'fas fa-project-diagram', color: '#0B3B2F' },
    { id: 'youth', label: 'Youth Empowered', value: 0, suffix: '+', icon: 'fas fa-users', color: '#0B3B2F' },
    { id: 'partners', label: 'Community Partners', value: 0, suffix: '+', icon: 'fas fa-handshake', color: '#0B3B2F' }
  ]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);
  const fetchIntervalRef = useRef(null);
  const statsVisibleRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const targetValuesRef = useRef(null);
  const animationFrameRef = useRef(null);
  const animationStartTimeRef = useRef(null);

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/leaders';

  // Fetch stats from API
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const newStatsData = [
          { 
            id: 'experience', 
            label: 'Years Combined Experience', 
            value: data.data.years_experience || 0, 
            suffix: '+', 
            icon: 'fas fa-calendar-alt', 
            color: '#0B3B2F' 
          },
          { 
            id: 'projects', 
            label: 'Projects Completed', 
            value: data.data.projects_completed || 0, 
            suffix: '+', 
            icon: 'fas fa-project-diagram', 
            color: '#0B3B2F' 
          },
          { 
            id: 'youth', 
            label: 'Youth Empowered', 
            value: data.data.youth_empowered || 0, 
            suffix: '+', 
            icon: 'fas fa-users', 
            color: '#0B3B2F' 
          },
          { 
            id: 'partners', 
            label: 'Community Partners', 
            value: data.data.community_partners || 0, 
            suffix: '+', 
            icon: 'fas fa-handshake', 
            color: '#0B3B2F' 
          }
        ];
        
        setStatsData(newStatsData);
        targetValuesRef.current = newStatsData;
        
        // If stats are visible and not currently animating, restart counters with new values
        if (statsVisibleRef.current && !isAnimatingRef.current) {
          // Reset counters to 0 before starting new animation
          setCounters({
            experience: 0,
            projects: 0,
            youth: 0,
            partners: 0
          });
          // Start counters with new values after a small delay
          setTimeout(() => {
            startCounters(newStatsData);
          }, 100);
        }
        
        if (isFirstLoad) {
          setIsFirstLoad(false);
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Use default values if API fails
      const defaultStats = [
        { id: 'experience', label: 'Years Combined Experience', value: 15, suffix: '+', icon: 'fas fa-calendar-alt', color: '#0B3B2F' },
        { id: 'projects', label: 'Projects Completed', value: 4, suffix: '+', icon: 'fas fa-project-diagram', color: '#0B3B2F' },
        { id: 'youth', label: 'Youth Empowered', value: 50000, suffix: '+', icon: 'fas fa-users', color: '#0B3B2F' },
        { id: 'partners', label: 'Community Partners', value: 25, suffix: '+', icon: 'fas fa-handshake', color: '#0B3B2F' }
      ];
      setStatsData(defaultStats);
      targetValuesRef.current = defaultStats;
    }
  };

  // Auto-fetch every 1 second
  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Set up interval for auto-fetch every 1 second
    fetchIntervalRef.current = setInterval(() => {
      fetchStats();
    }, 1000);

    // Cleanup interval on unmount
    return () => {
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Intersection Observer for section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            statsVisibleRef.current = true;
            if (!hasAnimated.current) {
              hasAnimated.current = true;
              startCounters(statsData);
            } else if (!isAnimatingRef.current) {
              // Restart counters with current data when coming back into view
              const currentData = targetValuesRef.current || statsData;
              setCounters({
                experience: 0,
                projects: 0,
                youth: 0,
                partners: 0
              });
              setTimeout(() => {
                startCounters(currentData);
              }, 100);
            }
          } else {
            setIsVisible(false);
            statsVisibleRef.current = false;
            // Only reset counters if they haven't reached their target yet
            if (isAnimatingRef.current) {
              // If still animating, let it complete
              // Don't reset to 0
            } else {
              // Keep the final values, don't reset to 0
              // Just mark as not visible
            }
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
  }, [statsData]);

  // Smooth animation using requestAnimationFrame
  const startCounters = (data) => {
    // Don't start if already animating
    if (isAnimatingRef.current) return;
    
    const duration = 2500; // 2.5 seconds
    const startTime = performance.now();
    const startValues = {
      experience: 0,
      projects: 0,
      youth: 0,
      partners: 0
    };
    
    // Get target values from data
    const targets = {};
    data.forEach(stat => {
      targets[stat.id] = stat.value;
    });
    
    targetValuesRef.current = data;
    isAnimatingRef.current = true;
    
    // Cancel any existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic function for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      
      // Calculate current values
      const currentValues = {};
      Object.keys(targets).forEach(key => {
        const target = targets[key];
        const start = startValues[key] || 0;
        currentValues[key] = Math.round(start + (target - start) * eased);
      });
      
      setCounters(currentValues);
      
      if (progress < 1) {
        // Continue animation
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete - set final values
        setCounters(targets);
        isAnimatingRef.current = false;
        animationFrameRef.current = null;
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const handleViewReport = () => {
    navigate('/reports');
  };

  return (
    <div ref={sectionRef} style={{
      padding: '4rem 1.5rem',
      background: 'transparent',
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

      {/* Section Header */}
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

      {/* Stats Grid */}
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

            <div style={{
              fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
              fontWeight: 800,
              color: '#0B3B2F',
              marginBottom: '0.5rem',
              fontFamily: 'monospace',
              letterSpacing: '2px'
            }}>
              {formatNumber(counters[stat.id] || 0)}{stat.suffix}
            </div>

            <div style={{
              fontSize: 'clamp(0.85rem, 3vw, 1rem)',
              color: '#555',
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              {stat.label}
            </div>

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

      {/* Call to Action Button - View Annual Report */}
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
          onClick={handleViewReport}
          style={{
            background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
            border: 'none',
            padding: '0.9rem 2.5rem',
            borderRadius: '50px',
            color: 'white',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(11,59,47,0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(11,59,47,0.4)';
            const arrow = e.currentTarget.querySelector('.arrow-icon');
            if (arrow) {
              arrow.style.transform = 'translateX(6px)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(11,59,47,0.3)';
            const arrow = e.currentTarget.querySelector('.arrow-icon');
            if (arrow) {
              arrow.style.transform = 'translateX(0)';
            }
          }}
        >
          <i className="fas fa-file-alt" style={{ fontSize: '1rem' }}></i>
          <span>View Annual Report</span>
          <i 
            className="fas fa-arrow-right arrow-icon" 
            style={{ 
              fontSize: '0.9rem', 
              transition: 'transform 0.3s ease',
              display: 'inline-block'
            }}
          ></i>
        </button>
      </div>

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
          
          button {
            padding: 0.7rem 1.5rem !important;
            font-size: 0.85rem !important;
          }
        }
        
        @media (max-width: 480px) {
          button {
            padding: 0.6rem 1.2rem !important;
            font-size: 0.8rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StatsComponent;