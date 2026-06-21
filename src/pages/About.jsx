import React, { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    youth: 0,
    projects: 0,
    partners: 0
  });
  const [statsData, setStatsData] = useState([
    { 
      id: 'youth', 
      label: 'Youth Reached', 
      value: 0, 
      suffix: '+', 
      icon: 'fas fa-users', 
      color: '#0B3B2F' 
    },
    { 
      id: 'projects', 
      label: 'Projects Completed', 
      value: 0, 
      suffix: '+', 
      icon: 'fas fa-project-diagram', 
      color: '#0B3B2F' 
    },
    { 
      id: 'partners', 
      label: 'Community Partners', 
      value: 0, 
      suffix: '+', 
      icon: 'fas fa-handshake', 
      color: '#0B3B2F' 
    }
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

  // Fetch stats from API - Same method as StatsComponent
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const newStatsData = [
          { 
            id: 'youth', 
            label: 'Youth Reached', 
            value: data.data.youth_empowered || 0, 
            suffix: '+', 
            icon: 'fas fa-users', 
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
            youth: 0,
            projects: 0,
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
        { id: 'youth', label: 'Youth Reached', value: 10000, suffix: '+', icon: 'fas fa-users', color: '#0B3B2F' },
        { id: 'projects', label: 'Projects Completed', value: 50, suffix: '+', icon: 'fas fa-project-diagram', color: '#0B3B2F' },
        { id: 'partners', label: 'Community Partners', value: 20, suffix: '+', icon: 'fas fa-handshake', color: '#0B3B2F' }
      ];
      setStatsData(defaultStats);
      targetValuesRef.current = defaultStats;
    }
  };

  // Auto-fetch every 1 second - Same as StatsComponent
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
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

  // Intersection Observer for section visibility - Same as StatsComponent
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
                youth: 0,
                projects: 0,
                partners: 0
              });
              setTimeout(() => {
                startCounters(currentData);
              }, 100);
            }
          } else {
            setIsVisible(false);
            statsVisibleRef.current = false;
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

  // Smooth animation using requestAnimationFrame - Same as StatsComponent
  const startCounters = (data) => {
    // Don't start if already animating
    if (isAnimatingRef.current) return;
    
    const duration = 2500; // 2.5 seconds
    const startTime = performance.now();
    const startValues = {
      youth: 0,
      projects: 0,
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

  return (
    <div style={{ paddingTop: '70px' }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .stat-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: default;
        }
        .stat-card:hover {
          transform: translateY(-10px);
          background: rgba(255,255,255,1) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
          border: 1px solid rgba(249,199,79,0.3) !important;
        }
        .stat-card:hover .icon-wrapper {
          transform: scale(1.1);
          background: rgba(249,199,79,0.25) !important;
        }
        .stat-card .icon-wrapper {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .count-number {
          transition: all 0.1s ease;
        }
        .stat-card .underline {
          transition: width 0.3s ease;
        }
        .stat-card:hover .underline {
          width: 80px !important;
        }
      `}</style>

      {/* Hero Section - Thin */}
      <div ref={sectionRef} style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white',
        padding: '1.5rem 2rem',
        textAlign: 'center'
      }}>
        <h1 data-aos="fade-up" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '0.3rem', fontWeight: 700 }}>
          About VUMA Tanzania
        </h1>
        <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', maxWidth: '700px', margin: '0 auto', opacity: 0.9 }}>
          Empowering youth through innovation, leadership, and environmental conservation
        </p>
      </div>

      {/* Mission & Vision with Impact */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div data-aos="fade-right" style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-bullseye" style={{ fontSize: '2rem', color: '#F9C74F', marginBottom: '0.8rem' }}></i>
            <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1.2rem' }}>Our Mission</h3>
            <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.9rem' }}>
              To empower Tanzanian youth with innovative skills, leadership capabilities, and environmental awareness to create sustainable community solutions.
            </p>
          </div>

          <div data-aos="fade-up" style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-eye" style={{ fontSize: '2rem', color: '#F9C74F', marginBottom: '0.8rem' }}></i>
            <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1.2rem' }}>Our Vision</h3>
            <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.9rem' }}>
              A generation of empowered youth leading Tanzania towards sustainable development and climate resilience.
            </p>
          </div>

          {/* Our Impact Card - Now using same data structure as StatsComponent */}
          <div data-aos="fade-left" style={{ 
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px', 
            padding: '1.5rem', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            border: '1px solid rgba(11,59,47,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(11,59,47,0.1)',
              padding: '0.2rem 0.8rem',
              borderRadius: '50px',
              marginBottom: '0.8rem',
              alignSelf: 'flex-start'
            }}>
              <span style={{ color: '#0B3B2F', fontWeight: 600, fontSize: '0.7rem' }}>
                <i className="fas fa-chart-line" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                OUR IMPACT
              </span>
            </div>
            
            <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 700 }}>
              Making a Difference
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'center' }}>
              {statsData.map((stat, idx) => (
                <div
                  key={stat.id}
                  className="stat-card"
                  style={{
                    padding: '0.8rem 1rem',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    border: '1px solid rgba(11,59,47,0.1)',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                    transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${idx * 0.1}s`
                  }}
                >
                  <div className="icon-wrapper" style={{
                    width: '50px',
                    height: '50px',
                    background: 'rgba(11,59,47,0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <i className={stat.icon} style={{ fontSize: '1.2rem', color: '#0B3B2F' }}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="count-number" style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 800, 
                      color: '#0B3B2F',
                      fontFamily: 'monospace',
                      letterSpacing: '1px'
                    }}>
                      {formatNumber(counters[stat.id] || 0)}{stat.suffix}
                    </div>
                    <div style={{ 
                      color: '#555', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      letterSpacing: '0.3px'
                    }}>
                      {stat.label}
                    </div>
                    <div className="underline" style={{
                      width: '40px',
                      height: '3px',
                      background: '#F9C74F',
                      marginTop: '0.4rem',
                      borderRadius: '2px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div style={{ background: '#f9fbf7', padding: '3rem 2rem' }}>
        <h2 data-aos="fade-up" style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 4vw, 2rem)', color: '#0B3B2F', marginBottom: '1.5rem' }}>
          Our Core Values
        </h2>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: 'fas fa-lightbulb', title: 'Innovation', desc: 'Creative solutions to complex challenges' },
            { icon: 'fas fa-users', title: 'Collaboration', desc: 'Working together for greater impact' },
            { icon: 'fas fa-leaf', title: 'Sustainability', desc: 'Long-term environmental responsibility' },
            { icon: 'fas fa-hand-holding-heart', title: 'Integrity', desc: 'Honest and transparent operations' }
          ].map((value, idx) => (
            <div key={idx} data-aos="zoom-in" data-aos-delay={idx * 100} style={{ background: 'white', borderRadius: '20px', padding: '1.2rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
              <i className={value.icon} style={{ fontSize: '1.8rem', color: '#F9C74F', marginBottom: '0.5rem' }}></i>
              <h4 style={{ color: '#0B3B2F', marginBottom: '0.3rem', fontSize: '1rem' }}>{value.title}</h4>
              <p style={{ color: '#666', fontSize: '0.8rem' }}>{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;