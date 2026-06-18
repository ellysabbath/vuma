import React, { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    youth_reached: 0,
    projects_completed: 0,
    community_partners: 0
  });
  const [impactData, setImpactData] = useState({
    youth_reached: 0,
    youth_label: 'Youth Reached',
    youth_suffix: '+',
    projects_completed: 0,
    projects_label: 'Projects Completed',
    projects_suffix: '+',
    community_partners: 0,
    partners_label: 'Community Partners',
    partners_suffix: '+'
  });
  
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);
  const fetchIntervalRef = useRef(null);
  const statsVisibleRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const targetValuesRef = useRef(null);
  const animationFrameRef = useRef(null);

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  // Fetch impact data from API - Updated to use /impacts/ endpoint
  const fetchImpactData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      
      let impactData = [];
      if (Array.isArray(data)) {
        impactData = data;
      } else if (data.results) {
        impactData = data.results;
      } else if (data.data) {
        impactData = data.data;
      }

      if (impactData.length > 0) {
        const impact = impactData[0];
        const newImpactData = {
          youth_reached: impact.youth_reached_target || 0,
          youth_label: impact.youth_reached_label || 'Youth Reached',
          youth_suffix: impact.youth_reached_suffix || '+',
          projects_completed: impact.projects_completed_target || 0,
          projects_label: impact.projects_completed_label || 'Projects Completed',
          projects_suffix: impact.projects_completed_suffix || '+',
          community_partners: impact.community_partners_target || 0,
          partners_label: impact.community_partners_label || 'Community Partners',
          partners_suffix: impact.community_partners_suffix || '+'
        };
        
        setImpactData(newImpactData);
        targetValuesRef.current = newImpactData;
        
        // If stats are visible and not currently animating, restart counters with new values
        if (statsVisibleRef.current && !isAnimatingRef.current) {
          setCounters({
            youth_reached: 0,
            projects_completed: 0,
            community_partners: 0
          });
          setTimeout(() => {
            startCounters(newImpactData);
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error fetching impact data:', error);
      // Use default values if API fails
      const defaultData = {
        youth_reached: 10000,
        youth_label: 'Youth Reached',
        youth_suffix: '+',
        projects_completed: 50,
        projects_label: 'Projects Completed',
        projects_suffix: '+',
        community_partners: 20,
        partners_label: 'Community Partners',
        partners_suffix: '+'
      };
      setImpactData(defaultData);
      targetValuesRef.current = defaultData;
    }
  };

  // Auto-fetch every 1 second
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchImpactData();

    // Set up interval for auto-fetch every 1 second
    fetchIntervalRef.current = setInterval(() => {
      fetchImpactData();
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
              startCounters(impactData);
            } else if (!isAnimatingRef.current) {
              // Restart counters with current data when coming back into view
              const currentData = targetValuesRef.current || impactData;
              setCounters({
                youth_reached: 0,
                projects_completed: 0,
                community_partners: 0
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
  }, [impactData]);

  // Smooth animation using requestAnimationFrame
  const startCounters = (data) => {
    if (isAnimatingRef.current) return;
    
    const duration = 2500;
    const startTime = performance.now();
    const startValues = {
      youth_reached: 0,
      projects_completed: 0,
      community_partners: 0
    };
    
    const targets = {
      youth_reached: data.youth_reached || 0,
      projects_completed: data.projects_completed || 0,
      community_partners: data.community_partners || 0
    };
    
    targetValuesRef.current = data;
    isAnimatingRef.current = true;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const currentValues = {
        youth_reached: Math.round(targets.youth_reached * eased),
        projects_completed: Math.round(targets.projects_completed * eased),
        community_partners: Math.round(targets.community_partners * eased)
      };
      
      setCounters(currentValues);
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
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
          transform: translateY(-5px) scale(1.02);
          background: rgba(11,59,47,0.02);
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

          {/* Our Impact Card - Fetches only integers from API */}
          <div data-aos="fade-left" style={{ 
            background: 'white', 
            borderRadius: '24px', 
            padding: '1.5rem', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <i className="fas fa-chart-line" style={{ fontSize: '2rem', color: '#F9C74F', marginBottom: '0.8rem' }}></i>
            <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1.2rem' }}>Our Impact</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1, justifyContent: 'center' }}>
              {/* Youth Reached */}
              <div className="stat-card" style={{
                padding: '0.8rem',
                borderRadius: '12px',
                background: '#f9fbf7',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s`
              }}>
                <div className="icon-wrapper" style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(249,199,79,0.15)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="fas fa-users" style={{ fontSize: '1rem', color: '#F9C74F' }}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="count-number" style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: 800, 
                    color: '#0B3B2F',
                    fontFamily: 'monospace'
                  }}>
                    {formatNumber(counters.youth_reached || 0)}{impactData.youth_suffix || '+'}
                  </div>
                  <div style={{ 
                    color: '#6a7a6a', 
                    fontSize: '0.7rem', 
                    fontWeight: 500,
                    letterSpacing: '0.3px'
                  }}>
                    {impactData.youth_label || 'Youth Reached'}
                  </div>
                </div>
              </div>

              {/* Projects Completed */}
              <div className="stat-card" style={{
                padding: '0.8rem',
                borderRadius: '12px',
                background: '#f9fbf7',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s`
              }}>
                <div className="icon-wrapper" style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(249,199,79,0.15)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="fas fa-project-diagram" style={{ fontSize: '1rem', color: '#F9C74F' }}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="count-number" style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: 800, 
                    color: '#0B3B2F',
                    fontFamily: 'monospace'
                  }}>
                    {formatNumber(counters.projects_completed || 0)}{impactData.projects_suffix || '+'}
                  </div>
                  <div style={{ 
                    color: '#6a7a6a', 
                    fontSize: '0.7rem', 
                    fontWeight: 500,
                    letterSpacing: '0.3px'
                  }}>
                    {impactData.projects_label || 'Projects Completed'}
                  </div>
                </div>
              </div>

              {/* Community Partners */}
              <div className="stat-card" style={{
                padding: '0.8rem',
                borderRadius: '12px',
                background: '#f9fbf7',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s`
              }}>
                <div className="icon-wrapper" style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(249,199,79,0.15)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="fas fa-handshake" style={{ fontSize: '1rem', color: '#F9C74F' }}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="count-number" style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: 800, 
                    color: '#0B3B2F',
                    fontFamily: 'monospace'
                  }}>
                    {formatNumber(counters.community_partners || 0)}{impactData.partners_suffix || '+'}
                  </div>
                  <div style={{ 
                    color: '#6a7a6a', 
                    fontSize: '0.7rem', 
                    fontWeight: 500,
                    letterSpacing: '0.3px'
                  }}>
                    {impactData.partners_label || 'Community Partners'}
                  </div>
                </div>
              </div>
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