import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminImpacts = () => {
  const navigate = useNavigate();
  const [impacts, setImpacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [counters, setCounters] = useState({
    youth_reached: 0,
    trees_planted: 0,
    ideas_generated: 0,
    volunteers: 0
  });
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchImpacts();
  }, []);

  // Intersection Observer for counting animation - triggers every time
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
            const impact = impacts[0];
            if (impact) {
              animateCounters({
                youth_reached: impact.youth_reached_target || 0,
                trees_planted: impact.trees_planted_target || 0,
                ideas_generated: impact.ideas_generated_target || 0,
                volunteers: impact.volunteers_target || 0
              });
            }
          } else {
            // Reset counters when out of view
            setStatsVisible(false);
            setCounters({
              youth_reached: 0,
              trees_planted: 0,
              ideas_generated: 0,
              volunteers: 0
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [impacts]);

  const animateCounters = (targets) => {
    const duration = 2000;
    const steps = 60;
    const increment = {
      youth_reached: targets.youth_reached / steps,
      trees_planted: targets.trees_planted / steps,
      ideas_generated: targets.ideas_generated / steps,
      volunteers: targets.volunteers / steps
    };

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCounters({
          youth_reached: targets.youth_reached,
          trees_planted: targets.trees_planted,
          ideas_generated: targets.ideas_generated,
          volunteers: targets.volunteers
        });
        clearInterval(interval);
      } else {
        setCounters({
          youth_reached: Math.floor(increment.youth_reached * currentStep),
          trees_planted: Math.floor(increment.trees_planted * currentStep),
          ideas_generated: Math.floor(increment.ideas_generated * currentStep),
          volunteers: Math.floor(increment.volunteers * currentStep)
        });
      }
    }, duration / steps);
  };

  // Fetch all impacts
  const fetchImpacts = async () => {
    setIsRefreshing(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/impacts/`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      let impactData = [];
      if (Array.isArray(data)) {
        impactData = data;
      } else if (data.results) {
        impactData = data.results;
      } else if (data.data) {
        impactData = data.data;
      }

      setImpacts(impactData);
    } catch (error) {
      console.error('Error fetching impacts:', error);
      setError('Network error. Check if server is running.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Helper to get a single impact record
  const getImpactRecord = () => {
    return impacts.length > 0 ? impacts[0] : null;
  };

  if (loading) {
    return (
      <div style={{ 
        paddingTop: '70px', 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f5f7f3 0%, #e8ece6 100%)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto',
            borderRadius: '50%',
            border: '4px solid #e8ece6',
            borderTop: '4px solid #0B3B2F',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '0.75rem', color: '#4a5a4a', fontWeight: 400 }}>Loading impact data...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        paddingTop: '70px', 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f5f7f3 0%, #e8ece6 100%)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          textAlign: 'center', 
          maxWidth: '400px', 
          padding: '3rem 2rem', 
          background: 'white', 
          borderRadius: '28px', 
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)' 
        }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: '#fce4e4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '2.5rem', color: '#d32f2f' }}></i>
          </div>
          <h3 style={{ marginTop: '1rem', color: '#0B3B2F' }}>Connection Error</h3>
          <p style={{ marginTop: '0.5rem', color: '#6a7a6a', fontSize: '0.95rem' }}>{error}</p>
          <button 
            onClick={fetchImpacts} 
            disabled={isRefreshing}
            style={{ 
              marginTop: '1.5rem', 
              background: '#0B3B2F', 
              border: 'none', 
              padding: '0.6rem 2rem', 
              borderRadius: '40px', 
              cursor: isRefreshing ? 'not-allowed' : 'pointer', 
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'white',
              opacity: isRefreshing ? 0.6 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {isRefreshing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-redo"></i>}
            {isRefreshing ? ' Retrying...' : ' Try Again'}
          </button>
        </div>
      </div>
    );
  }

  const impact = getImpactRecord();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7f3 0%, #e8ece6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
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
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.95); }
        }
        .count-number {
          transition: all 0.1s ease;
        }
      `}</style>

      {/* Animated Stats Section - Counts every time it comes into view */}
      <div ref={statsRef} style={{
        padding: '3rem 2rem',
        background: 'linear-gradient(135deg, #FFFFFF, #f9fbf7)',
        borderRadius: '40px',
        maxWidth: '1100px',
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: '2rem',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        border: '1px solid rgba(255,255,255,0.8)'
      }}>
        {impact ? [
          { 
            id: 'youth_reached', 
            icon: 'fas fa-users', 
            label: impact.youth_reached_label || 'Youth Reached', 
            value: counters.youth_reached, 
            suffix: impact.youth_reached_suffix || '+' 
          },
          { 
            id: 'trees_planted', 
            icon: 'fas fa-tree', 
            label: impact.trees_planted_label || 'Trees Planted', 
            value: counters.trees_planted, 
            suffix: impact.trees_planted_suffix || '+' 
          },
          { 
            id: 'ideas_generated', 
            icon: 'fas fa-lightbulb', 
            label: impact.ideas_generated_label || 'Ideas Generated', 
            value: counters.ideas_generated, 
            suffix: impact.ideas_generated_suffix || '+' 
          },
          { 
            id: 'volunteers', 
            icon: 'fas fa-handshake', 
            label: impact.volunteers_label || 'Active Volunteers', 
            value: counters.volunteers, 
            suffix: impact.volunteers_suffix || '+' 
          }
        ].map((stat, idx) => (
          <div 
            key={stat.id}
            className="stat-card"
            style={{ 
              flex: '1 1 180px',
              minWidth: '150px',
              padding: '1.5rem',
              borderRadius: '24px',
              opacity: statsVisible ? 1 : 0,
              transform: statsVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)',
              transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${idx * 0.1}s`
            }}
          >
            <div className="icon-wrapper" style={{
              width: '56px',
              height: '56px',
              background: 'rgba(249,199,79,0.15)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.8rem'
            }}>
              <i className={stat.icon} style={{ fontSize: '1.4rem', color: '#F9C74F' }}></i>
            </div>
            <div className="count-number" style={{ 
              fontSize: 'clamp(2rem, 5vw, 2.8rem)', 
              fontWeight: 800, 
              color: '#0B3B2F',
              fontFamily: 'monospace',
              letterSpacing: '-0.02em'
            }}>
              {stat.value.toLocaleString()}{stat.suffix}
            </div>
            <div style={{ 
              color: '#6a7a6a', 
              fontSize: '0.85rem', 
              fontWeight: 500,
              letterSpacing: '0.3px',
              textTransform: 'uppercase'
            }}>
              {stat.label}
            </div>
          </div>
        )) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            width: '100%'
          }}>
            <p style={{ color: '#8a9a8a', fontSize: '0.95rem' }}>No impact data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminImpacts;