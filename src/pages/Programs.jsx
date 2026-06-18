import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Programs = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const programsRes = await fetch(`${API_BASE_URL}/prog/`);
      
      let programsData = [];
      if (programsRes.ok) {
        const data = await programsRes.json();
        if (Array.isArray(data)) {
          programsData = data;
        } else if (data.results) {
          programsData = data.results;
        } else if (data.data) {
          programsData = data.data;
        } else {
          programsData = [];
        }
      } else {
        console.error('Programs API error:', programsRes.status);
        setError(`API Error: ${programsRes.status}`);
      }

      // Fetch activities for each program
      const programsWithActivities = await Promise.all(
        programsData.map(async (program) => {
          try {
            const activitiesRes = await fetch(`${API_BASE_URL}/activity/by_program/?program_id=${program.id}`);
            if (activitiesRes.ok) {
              const activitiesData = await activitiesRes.json();
              // Fetch explanations for each activity
              const activitiesWithExplanations = await Promise.all(
                (Array.isArray(activitiesData) ? activitiesData : []).map(async (activity) => {
                  try {
                    const explanationsRes = await fetch(`${API_BASE_URL}/explanation/by_activity/?activity_id=${activity.id}`);
                    if (explanationsRes.ok) {
                      const explanationsData = await explanationsRes.json();
                      return { ...activity, explanations: Array.isArray(explanationsData) ? explanationsData : [] };
                    }
                  } catch (err) {
                    console.error(`Error fetching explanations for activity ${activity.id}:`, err);
                  }
                  return { ...activity, explanations: [] };
                })
              );
              return { ...program, activities: activitiesWithExplanations };
            }
          } catch (err) {
            console.error(`Error fetching activities for program ${program.id}:`, err);
          }
          return { ...program, activities: [] };
        })
      );

      setPrograms(programsWithActivities);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Network error. Please check again later.');
    } finally {
      setLoading(false);
    }
  };

  const openProgramModal = (program) => {
    setSelectedProgram(program);
    setShowProgramModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProgramModal = () => {
    setShowProgramModal(false);
    setSelectedProgram(null);
    document.body.style.overflow = 'unset';
  };

  const openActivityModal = (activity) => {
    setSelectedActivity(activity);
    setShowActivityModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeActivityModal = () => {
    setShowActivityModal(false);
    setSelectedActivity(null);
    document.body.style.overflow = 'unset';
  };

  const getCategoryName = (category) => {
    const categories = {
      'youth_leadership': 'Youth Leadership',
      'environmental_resilience': 'Environmental Resilience and Adaptation',
      'youth_opportunity': 'Youth and Opportunity'
    };
    return categories[category] || category || 'Program';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'youth_leadership': '#F9C74F',
      'environmental_resilience': '#2b7a5c',
      'youth_opportunity': '#FF9800'
    };
    return colors[category] || '#0B3B2F';
  };

  const getCategoryGradient = (category) => {
    const gradients = {
      'youth_leadership': 'linear-gradient(135deg, #F9C74F, #f6b83e)',
      'environmental_resilience': 'linear-gradient(135deg, #2b7a5c, #1a5c48)',
      'youth_opportunity': 'linear-gradient(135deg, #FF9800, #f57c00)'
    };
    return gradients[category] || 'linear-gradient(135deg, #0B3B2F, #1a5c48)';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'youth_leadership': 'fas fa-user-graduate',
      'environmental_resilience': 'fas fa-leaf',
      'youth_opportunity': 'fas fa-briefcase'
    };
    return icons[category] || 'fas fa-chalkboard-user';
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      'youth_leadership': '🎓',
      'environmental_resilience': '🌿',
      'youth_opportunity': '💼'
    };
    return emojis[category] || '📚';
  };

  const getExplanationTypeIcon = (type) => {
    const icons = {
      'overview': 'fas fa-info-circle',
      'benefits': 'fas fa-gift',
      'process': 'fas fa-cogs',
      'requirements': 'fas fa-clipboard-list',
      'impact': 'fas fa-chart-line',
      'testimonial': 'fas fa-quote-left',
      'other': 'fas fa-file-alt'
    };
    return icons[type] || 'fas fa-file-alt';
  };

  const getExplanationTypeColor = (type) => {
    const colors = {
      'overview': '#2196F3',
      'benefits': '#4caf50',
      'process': '#FF9800',
      'requirements': '#9C27B0',
      'impact': '#d32f2f',
      'testimonial': '#F9C74F',
      'other': '#795548'
    };
    return colors[type] || '#666';
  };

  const getExplanationTypeLabel = (type) => {
    const labels = {
      'overview': 'Overview',
      'benefits': 'Benefits',
      'process': 'Process',
      'requirements': 'Requirements',
      'impact': 'Impact',
      'testimonial': 'Testimonial',
      'other': 'Other'
    };
    return labels[type] || type || 'Information';
  };

  const getActivityIcon = (activity) => {
    return activity.icon || 'fas fa-tasks';
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: 'linear-gradient(135deg, #f9fbf7 0%, #f0f5ee 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading programs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#d32f2f' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>{error}</p>
          <button onClick={fetchData} style={{ marginTop: '1rem', background: '#F9C74F', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
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
          from { opacity: 0; transform: translateY(50px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(249,199,79,0.2); }
          50% { box-shadow: 0 0 40px rgba(249,199,79,0.4); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .modal-content::-webkit-scrollbar { width: 6px; }
        .modal-content::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
        .modal-content::-webkit-scrollbar-thumb { background: #F9C74F; border-radius: 3px; }
        
        .program-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .program-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.15) !important;
        }
        
        .activity-item {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .activity-item:hover {
          background: rgba(249, 199, 79, 0.1);
          transform: translateX(8px);
          border-color: #F9C74F !important;
        }
        
        .explanation-item {
          transition: all 0.3s ease;
        }
        .explanation-item:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        
        .pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        
        @media (max-width: 768px) {
          .programs-container {
            padding: 1rem !important;
          }
        }
      `}</style>

      {/* Very Thin Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F 0%, #1a5c48 50%, #2b7a5c 100%)',
        color: 'white',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(249,199,79,0.08) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-40%',
          left: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(249,199,79,0.05) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div data-aos="fade-up" style={{ marginBottom: '0.3rem' }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(249,199,79,0.2)',
              padding: '0.2rem 1rem',
              borderRadius: '50px',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#F9C74F'
            }}>
              <i className="fas fa-chalkboard-user" style={{ marginRight: '0.3rem' }}></i>
              Our Programs
            </span>
          </div>
          <h1 data-aos="fade-up" data-aos-delay="100" style={{ 
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
            marginBottom: '0.3rem',
            fontWeight: 700,
            letterSpacing: '-0.02em'
          }}>
            Empowering Communities
          </h1>
          <p data-aos="fade-up" data-aos-delay="200" style={{ 
            fontSize: 'clamp(0.85rem, 2vw, 1rem)', 
            maxWidth: '700px', 
            margin: '0 auto',
            opacity: 0.9
          }}>
            Discover our transformative programs developing youth leadership, 
            environmental resilience, and career opportunities across Tanzania
          </p>
        </div>
      </div>

      {/* Programs List Section */}
      <div className="programs-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2rem' }}>
        
        {programs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <i className="fas fa-chalkboard-user" style={{ fontSize: '4rem', color: '#ddd' }}></i>
            <p style={{ marginTop: '1rem', color: '#666', fontSize: '1.1rem' }}>No programs available at the moment.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {programs.map((program, idx) => (
              <div 
                key={program.id} 
                data-aos="fade-up" 
                data-aos-delay={idx * 100}
                className="program-card"
                style={{
                  background: 'white',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}
              >
                {/* Thin Program Header */}
                <div 
                  style={{
                    background: getCategoryGradient(program.category),
                    padding: '0.8rem 1.5rem',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => openProgramModal(program)}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    pointerEvents: 'none'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '-30px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.03)',
                    pointerEvents: 'none'
                  }} />
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255,255,255,0.2)'
                    }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <i className={program.icon || getCategoryIcon(program.category)} style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}></i>
                        <h2 style={{ color: 'white', margin: 0, fontSize: 'clamp(1rem, 3vw, 1.3rem)', fontWeight: 600 }}>
                          {program.name}
                        </h2>
                      </div>
                      <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.1rem', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '0.6rem',
                          background: 'rgba(255,255,255,0.15)',
                          color: 'white',
                          padding: '0.1rem 0.6rem',
                          borderRadius: '15px'
                        }}>
                          {getCategoryName(program.category)}
                        </span>
                        <span style={{
                          fontSize: '0.6rem',
                          background: 'rgba(255,255,255,0.15)',
                          color: 'white',
                          padding: '0.1rem 0.6rem',
                          borderRadius: '15px'
                        }}>
                          <i className="fas fa-tasks" style={{ marginRight: '0.2rem' }}></i>
                          {program.activities?.length || 0} Activities
                        </span>
                      </div>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>
                  
                  {program.description && (
                    <p style={{ 
                      color: 'rgba(255,255,255,0.85)', 
                      marginTop: '0.3rem', 
                      marginBottom: 0, 
                      fontSize: '0.8rem',
                      position: 'relative',
                      zIndex: 1,
                      paddingLeft: '3rem'
                    }}>
                      {program.description}
                    </p>
                  )}
                </div>

                {/* Activities Section */}
                <div style={{ padding: '1.2rem 1.5rem 1.5rem' }}>
                  <h3 style={{ 
                    color: '#0B3B2F', 
                    marginBottom: '0.8rem', 
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      width: '3px',
                      height: '16px',
                      background: getCategoryColor(program.category),
                      borderRadius: '2px'
                    }}></span>
                    Activities
                    <span style={{
                      fontSize: '0.6rem',
                      background: '#f0f0f0',
                      padding: '0.1rem 0.5rem',
                      borderRadius: '10px',
                      color: '#666'
                    }}>
                      {program.activities?.length || 0}
                    </span>
                  </h3>
                  
                  {program.activities && program.activities.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {program.activities.map((activity, actIdx) => (
                        <div 
                          key={activity.id} 
                          className="activity-item"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '0.6rem 1rem',
                            borderRadius: '10px',
                            background: '#f9fbf7',
                            border: `1px solid ${getCategoryColor(program.category)}20`,
                            transition: 'all 0.3s ease'
                          }}
                          onClick={() => openActivityModal(activity)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: `${getCategoryColor(program.category)}15`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <i className={getActivityIcon(activity)} style={{ fontSize: '0.7rem', color: getCategoryColor(program.category) }}></i>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.3rem' }}>
                                <strong style={{ color: '#0B3B2F', fontSize: '0.85rem' }}>
                                  {actIdx + 1}. {activity.name}
                                </strong>
                                <span style={{
                                  fontSize: '0.55rem',
                                  background: `${getCategoryColor(program.category)}15`,
                                  color: getCategoryColor(program.category),
                                  padding: '0.1rem 0.5rem',
                                  borderRadius: '15px',
                                  fontWeight: 500
                                }}>
                                  {activity.explanations?.length || 0} details
                                </span>
                              </div>
                              {activity.description && (
                                <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.1rem', marginBottom: 0 }}>
                                  {activity.description}
                                </p>
                              )}
                              {activity.duration && (
                                <p style={{ fontSize: '0.6rem', color: '#999', marginTop: '0.1rem', marginBottom: 0 }}>
                                  <i className="fas fa-clock" style={{ marginRight: '0.2rem' }}></i>
                                  {activity.duration}
                                </p>
                              )}
                            </div>
                            <div style={{ color: '#ccc', fontSize: '0.6rem' }}>
                              <i className="fas fa-chevron-right"></i>
                            </div>
                          </div>
                          
                          {/* All Explanations Visible */}
                          {activity.explanations && activity.explanations.length > 0 && (
                            <div style={{ 
                              marginTop: '0.5rem', 
                              paddingTop: '0.5rem', 
                              borderTop: '1px dashed rgba(0,0,0,0.06)',
                              paddingLeft: '2.5rem'
                            }}>
                              <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '0.4rem'
                              }}>
                                {activity.explanations.map((exp, expIdx) => (
                                  <div key={expIdx} style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '0.4rem',
                                    padding: '0.3rem 0.6rem',
                                    background: `${getExplanationTypeColor(exp.explanation_type)}06`,
                                    borderRadius: '6px',
                                    borderLeft: `3px solid ${getExplanationTypeColor(exp.explanation_type)}`
                                  }}>
                                    <i className={getExplanationTypeIcon(exp.explanation_type)} style={{ 
                                      color: getExplanationTypeColor(exp.explanation_type),
                                      fontSize: '0.6rem',
                                      marginTop: '0.1rem'
                                    }}></i>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                                        <strong style={{ fontSize: '0.7rem', color: '#0B3B2F' }}>
                                          {exp.title}
                                        </strong>
                                        <span style={{
                                          fontSize: '0.5rem',
                                          background: `${getExplanationTypeColor(exp.explanation_type)}15`,
                                          color: getExplanationTypeColor(exp.explanation_type),
                                          padding: '0.05rem 0.4rem',
                                          borderRadius: '10px'
                                        }}>
                                          {getExplanationTypeLabel(exp.explanation_type)}
                                        </span>
                                      </div>
                                      <p style={{ 
                                        fontSize: '0.7rem', 
                                        color: '#555', 
                                        margin: '0.1rem 0 0 0',
                                        lineHeight: '1.4',
                                        whiteSpace: 'pre-wrap'
                                      }}>
                                        {exp.content}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#999', fontStyle: 'italic', padding: '0.5rem', textAlign: 'center', fontSize: '0.8rem' }}>
                      No activities added yet.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Program Modal */}
      {showProgramModal && selectedProgram && (
        <div className="modal-overlay" onClick={closeProgramModal} style={{
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
            maxWidth: '700px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            position: 'relative',
            animation: 'slideInUp 0.3s ease'
          }}>
            <div style={{ 
              background: getCategoryGradient(selectedProgram.category),
              padding: '1.5rem',
              textAlign: 'center',
              position: 'relative'
            }}>
              <button onClick={closeProgramModal} style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                color: 'white',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <i className="fas fa-times"></i>
              </button>
              
              <div style={{
                width: '60px',
                height: '60px',
                margin: '0 auto',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid rgba(255,255,255,0.3)',
                fontSize: '2rem',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}>
                {getCategoryEmoji(selectedProgram.category)}
              </div>
              
              <h2 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '0.3rem', fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>
                {selectedProgram.name}
              </h2>
              
              <span style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                padding: '0.2rem 0.8rem',
                borderRadius: '30px',
                fontSize: '0.7rem'
              }}>
                {getCategoryName(selectedProgram.category)}
              </span>
            </div>
            
            <div style={{ padding: 'clamp(1rem, 4vw, 1.5rem)' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-info-circle" style={{ color: '#F9C74F' }}></i>
                  About This Program
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.9rem' }}>
                  {selectedProgram.description || 'No description available'}
                </p>
              </div>
              
              <div>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-tasks" style={{ color: '#F9C74F' }}></i>
                  Activities ({selectedProgram.activities?.length || 0})
                </h3>
                
                {selectedProgram.activities && selectedProgram.activities.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {selectedProgram.activities.map((activity, idx) => (
                      <div 
                        key={activity.id}
                        style={{
                          border: `1px solid ${getCategoryColor(selectedProgram.category)}30`,
                          borderRadius: '14px',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease'
                        }}
                        className="activity-item"
                        onClick={() => {
                          closeProgramModal();
                          openActivityModal(activity);
                        }}
                      >
                        <div style={{
                          padding: '0.8rem 1rem',
                          background: `${getCategoryColor(selectedProgram.category)}08`,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '0.3rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: getCategoryColor(selectedProgram.category),
                              color: 'white',
                              fontSize: '0.6rem',
                              fontWeight: 700
                            }}>
                              {idx + 1}
                            </span>
                            <strong style={{ color: '#0B3B2F', fontSize: '0.85rem' }}>{activity.name}</strong>
                          </div>
                          <span style={{
                            fontSize: '0.6rem',
                            background: '#F9C74F20',
                            color: '#F9C74F',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '15px',
                            fontWeight: 500
                          }}>
                            {activity.explanations?.length || 0} explanations
                          </span>
                        </div>
                        
                        {activity.description && (
                          <div style={{ padding: '0.3rem 1rem', background: 'white' }}>
                            <p style={{ fontSize: '0.75rem', color: '#666', margin: '0.2rem 0' }}>
                              {activity.description}
                            </p>
                          </div>
                        )}
                        
                        {activity.explanations && activity.explanations.length > 0 && (
                          <div style={{ padding: '0.3rem 1rem', background: '#f9fbf7', borderTop: '1px solid #f0f0f0' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                              {activity.explanations.map((exp, expIdx) => (
                                <div key={expIdx} style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '0.3rem',
                                  padding: '0.2rem 0.5rem',
                                  background: 'white',
                                  borderRadius: '6px',
                                  borderLeft: `3px solid ${getExplanationTypeColor(exp.explanation_type)}`
                                }}>
                                  <i className={getExplanationTypeIcon(exp.explanation_type)} style={{ 
                                    color: getExplanationTypeColor(exp.explanation_type),
                                    fontSize: '0.6rem',
                                    marginTop: '0.1rem'
                                  }}></i>
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', flexWrap: 'wrap' }}>
                                      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#0B3B2F' }}>
                                        {exp.title}
                                      </span>
                                      <span style={{
                                        fontSize: '0.5rem',
                                        background: `${getExplanationTypeColor(exp.explanation_type)}15`,
                                        color: getExplanationTypeColor(exp.explanation_type),
                                        padding: '0.05rem 0.3rem',
                                        borderRadius: '8px'
                                      }}>
                                        {getExplanationTypeLabel(exp.explanation_type)}
                                      </span>
                                    </div>
                                    <p style={{ fontSize: '0.65rem', color: '#555', margin: '0.1rem 0 0 0', lineHeight: '1.3' }}>
                                      {exp.content.length > 60 ? exp.content.substring(0, 60) + '...' : exp.content}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#999', fontStyle: 'italic', padding: '0.5rem', textAlign: 'center', fontSize: '0.8rem' }}>
                    No activities available.
                  </p>
                )}
              </div>
              
              <button 
                onClick={closeProgramModal} 
                style={{ 
                  width: '100%', 
                  background: 'linear-gradient(135deg, #F9C74F, #f6b83e)',
                  border: 'none', 
                  padding: '0.6rem', 
                  borderRadius: '50px', 
                  color: '#0B3B2F', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  marginTop: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(249,199,79,0.3)',
                  fontSize: '0.85rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(249,199,79,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(249,199,79,0.3)';
                }}
              >
                <i className="fas fa-times" style={{ marginRight: '0.3rem' }}></i>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Modal with Full Explanations */}
      {showActivityModal && selectedActivity && (
        <div className="modal-overlay" onClick={closeActivityModal} style={{
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
            maxWidth: '650px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            position: 'relative',
            animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={closeActivityModal} style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              color: 'white',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <i className="fas fa-times"></i>
            </button>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
              padding: '1.5rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-30%',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'rgba(249,199,79,0.05)'
              }} />
              <div style={{
                width: '60px',
                height: '60px',
                margin: '0 auto',
                borderRadius: '50%',
                background: '#F9C74F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1
              }}>
                <i className={selectedActivity.icon || 'fas fa-tasks'} style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '0.2rem', fontSize: 'clamp(1.2rem, 4vw, 1.3rem)', position: 'relative', zIndex: 1 }}>
                {selectedActivity.name}
              </h2>
              {selectedActivity.duration && (
                <p style={{ color: '#F9C74F', marginBottom: 0, fontSize: '0.75rem', position: 'relative', zIndex: 1 }}>
                  <i className="fas fa-clock"></i> {selectedActivity.duration}
                </p>
              )}
            </div>
            
            <div style={{ padding: 'clamp(1rem, 4vw, 1.5rem)' }}>
              {selectedActivity.description && (
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.3rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-align-left" style={{ color: '#F9C74F' }}></i>
                    Description
                  </h3>
                  <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.85rem' }}>{selectedActivity.description}</p>
                </div>
              )}
              
              {(selectedActivity.target_audience || selectedActivity.max_participants) && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: selectedActivity.target_audience && selectedActivity.max_participants ? '1fr 1fr' : '1fr',
                  gap: '0.6rem',
                  marginBottom: '1rem'
                }}>
                  {selectedActivity.target_audience && (
                    <div style={{ padding: '0.5rem', background: '#f9fbf7', borderRadius: '10px' }}>
                      <strong style={{ color: '#0B3B2F', fontSize: '0.7rem' }}><i className="fas fa-users"></i> Target Audience</strong>
                      <p style={{ marginTop: '0.1rem', color: '#666', fontSize: '0.75rem', marginBottom: 0 }}>{selectedActivity.target_audience}</p>
                    </div>
                  )}
                  {selectedActivity.max_participants && (
                    <div style={{ padding: '0.5rem', background: '#f9fbf7', borderRadius: '10px' }}>
                      <strong style={{ color: '#0B3B2F', fontSize: '0.7rem' }}><i className="fas fa-user-friends"></i> Max Participants</strong>
                      <p style={{ marginTop: '0.1rem', color: '#666', fontSize: '0.75rem', marginBottom: 0 }}>{selectedActivity.max_participants}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Full Explanations */}
              {selectedActivity.explanations && selectedActivity.explanations.length > 0 ? (
                <div>
                  <h3 style={{ 
                    color: '#0B3B2F', 
                    marginBottom: '0.6rem', 
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <i className="fas fa-info-circle" style={{ color: '#F9C74F' }}></i>
                    Detailed Explanations
                    <span style={{
                      fontSize: '0.6rem',
                      background: '#f0f0f0',
                      padding: '0.05rem 0.5rem',
                      borderRadius: '10px',
                      color: '#666'
                    }}>
                      {selectedActivity.explanations.length}
                    </span>
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {selectedActivity.explanations.map((explanation, idx) => (
                      <div 
                        key={explanation.id || idx}
                        className="explanation-item"
                        style={{
                          border: `1px solid ${getExplanationTypeColor(explanation.explanation_type)}30`,
                          borderRadius: '14px',
                          overflow: 'hidden',
                          background: 'white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                        }}
                      >
                        <div style={{
                          padding: '0.6rem 1rem',
                          background: `${getExplanationTypeColor(explanation.explanation_type)}08`,
                          borderBottom: `2px solid ${getExplanationTypeColor(explanation.explanation_type)}30`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: getExplanationTypeColor(explanation.explanation_type),
                            color: 'white',
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            flexShrink: 0
                          }}>
                            {idx + 1}
                          </span>
                          <i className={getExplanationTypeIcon(explanation.explanation_type)} style={{ 
                            color: getExplanationTypeColor(explanation.explanation_type),
                            fontSize: '0.8rem'
                          }}></i>
                          <strong style={{ color: '#0B3B2F', fontSize: '0.85rem', flex: 1 }}>
                            {explanation.title}
                          </strong>
                          <span style={{
                            fontSize: '0.55rem',
                            background: `${getExplanationTypeColor(explanation.explanation_type)}15`,
                            color: getExplanationTypeColor(explanation.explanation_type),
                            padding: '0.1rem 0.6rem',
                            borderRadius: '15px',
                            fontWeight: 500
                          }}>
                            {getExplanationTypeLabel(explanation.explanation_type)}
                          </span>
                        </div>
                        
                        <div style={{ padding: '0.8rem 1rem' }}>
                          <p style={{ 
                            color: '#444', 
                            lineHeight: '1.7', 
                            margin: 0, 
                            whiteSpace: 'pre-wrap', 
                            fontSize: '0.85rem'
                          }}>
                            {explanation.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f9fbf7', borderRadius: '14px' }}>
                  <i className="fas fa-file-alt" style={{ fontSize: '1.5rem', color: '#ccc' }}></i>
                  <p style={{ marginTop: '0.3rem', color: '#999', fontSize: '0.8rem' }}>No detailed explanations available yet.</p>
                </div>
              )}
              
              <button 
                onClick={closeActivityModal} 
                style={{ 
                  width: '100%', 
                  background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
                  border: 'none', 
                  padding: '0.6rem', 
                  borderRadius: '50px', 
                  color: 'white', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  marginTop: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(11,59,47,0.3)',
                  fontSize: '0.85rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(11,59,47,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(11,59,47,0.3)';
                }}
              >
                <i className="fas fa-times" style={{ marginRight: '0.3rem' }}></i>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;