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

  const getCategoryNumber = (category) => {
    const numbers = {
      'youth_leadership': '1',
      'environmental_resilience': '2',
      'youth_opportunity': '3'
    };
    return numbers[category] || '•';
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

  const getCategoryIcon = (category) => {
    const icons = {
      'youth_leadership': 'fas fa-user-graduate',
      'environmental_resilience': 'fas fa-leaf',
      'youth_opportunity': 'fas fa-briefcase'
    };
    return icons[category] || 'fas fa-chalkboard-user';
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

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        
        .modal-content::-webkit-scrollbar { width: 6px; }
        .modal-content::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
        .modal-content::-webkit-scrollbar-thumb { background: #F9C74F; border-radius: 3px; }
        
        .program-card {
          transition: all 0.3s ease;
        }
        .program-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .activity-item {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .activity-item:hover {
          background: rgba(249, 199, 79, 0.1);
          transform: translateX(5px);
        }
        
        @media (max-width: 768px) {
          .programs-container {
            padding: 1rem !important;
          }
        }
      `}</style>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h1 data-aos="fade-up" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>
          Our Programs
        </h1>
        <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', maxWidth: '800px', margin: '0 auto' }}>
          Discover impactful programs developing youth leadership, environmental resilience, and career opportunities
        </p>
      </div>

      {/* Programs List Section - Display in requested format */}
      <div className="programs-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        
        {programs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <i className="fas fa-chalkboard-user" style={{ fontSize: '3rem', color: '#999' }}></i>
            <p style={{ marginTop: '1rem', color: '#666' }}>No programs available at the moment.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {programs.map((program, idx) => (
              <div 
                key={program.id} 
                data-aos="fade-up" 
                data-aos-delay={idx * 100}
                style={{
                  background: 'white',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                }}
              >
                {/* Program Header */}
                <div 
                  style={{
                    background: `linear-gradient(135deg, ${program.color || getCategoryColor(program.category)}, ${program.color || getCategoryColor(program.category)}dd)`,
                    padding: '1.5rem 2rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => openProgramModal(program)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: '#F9C74F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className={program.icon || getCategoryIcon(program.category)} style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
                    </div>
                    <h2 style={{ color: 'white', margin: 0, fontSize: 'clamp(1.3rem, 4vw, 1.8rem)' }}>
                      {getCategoryNumber(program.category)}. {program.name}
                    </h2>
                  </div>
                  {program.description && (
                    <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: '0.8rem', marginBottom: 0, fontSize: '0.9rem' }}>
                      {program.description}
                    </p>
                  )}
                </div>

                {/* Activities Section */}
                <div style={{ padding: '1.5rem 2rem' }}>
                  <h3 style={{ 
                    color: '#0B3B2F', 
                    marginBottom: '1rem', 
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <i className="fas fa-tasks" style={{ color: getCategoryColor(program.category) }}></i>
                    Activities
                  </h3>
                  
                  {program.activities && program.activities.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {program.activities.map((activity, actIdx) => (
                        <div 
                          key={activity.id} 
                          className="activity-item"
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.8rem',
                            padding: '0.8rem 1rem',
                            borderRadius: '12px',
                            background: '#f9fbf7',
                            borderLeft: `3px solid ${getCategoryColor(program.category)}`
                          }}
                          onClick={() => openActivityModal(activity)}
                        >
                          <div style={{ minWidth: '24px' }}>
                            <i className="fas fa-circle" style={{ fontSize: '0.5rem', color: getCategoryColor(program.category), marginTop: '0.5rem' }}></i>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <strong style={{ color: '#0B3B2F', fontSize: '1rem' }}>{activity.name}</strong>
                              <span style={{
                                fontSize: '0.65rem',
                                background: `${getCategoryColor(program.category)}15`,
                                color: getCategoryColor(program.category),
                                padding: '0.2rem 0.6rem',
                                borderRadius: '20px'
                              }}>
                                {activity.explanations?.length || 0} explanations
                              </span>
                            </div>
                            {activity.description && (
                              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.3rem', marginBottom: 0 }}>
                                {activity.description.length > 100 ? activity.description.substring(0, 100) + '...' : activity.description}
                              </p>
                            )}
                            {activity.duration && (
                              <p style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.3rem', marginBottom: 0 }}>
                                <i className="fas fa-clock"></i> {activity.duration}
                              </p>
                            )}
                          </div>
                          <div style={{ minWidth: '30px', textAlign: 'right' }}>
                            <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem', color: '#ccc' }}></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#999', fontStyle: 'italic', padding: '1rem', textAlign: 'center' }}>
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
              background: `linear-gradient(135deg, ${selectedProgram.color || getCategoryColor(selectedProgram.category)}, ${selectedProgram.color || getCategoryColor(selectedProgram.category)}dd)`,
              padding: '2rem',
              textAlign: 'center',
              position: 'relative'
            }}>
              <button onClick={closeProgramModal} style={{
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
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <i className="fas fa-times"></i>
              </button>
              
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto',
                borderRadius: '50%',
                background: '#F9C74F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '4px solid white'
              }}>
                <i className={selectedProgram.icon || getCategoryIcon(selectedProgram.category)} style={{ fontSize: '2.5rem', color: '#0B3B2F' }}></i>
              </div>
              
              <h2 style={{ color: 'white', marginTop: '1rem', marginBottom: '0.5rem', fontSize: 'clamp(1.2rem, 5vw, 1.8rem)' }}>
                {getCategoryNumber(selectedProgram.category)}. {selectedProgram.name}
              </h2>
              
              <span style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                padding: '0.3rem 1rem',
                borderRadius: '30px',
                fontSize: '0.8rem'
              }}>
                {getCategoryName(selectedProgram.category)}
              </span>
            </div>
            
            <div style={{ padding: 'clamp(1.2rem, 5vw, 1.8rem)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-info-circle" style={{ color: '#F9C74F' }}></i>
                  About This Program
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  {selectedProgram.description || 'No description available'}
                </p>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-tasks" style={{ color: '#F9C74F' }}></i>
                  Activities ({selectedProgram.activities?.length || 0})
                </h3>
                
                {selectedProgram.activities && selectedProgram.activities.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedProgram.activities.map((activity, idx) => (
                      <div 
                        key={activity.id}
                        style={{
                          border: `1px solid ${getCategoryColor(selectedProgram.category)}30`,
                          borderRadius: '16px',
                          overflow: 'hidden'
                        }}
                      >
                        <div 
                          style={{
                            padding: '1rem',
                            background: `${getCategoryColor(selectedProgram.category)}10`,
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            closeProgramModal();
                            openActivityModal(activity);
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <strong style={{ color: '#0B3B2F', fontSize: '1rem' }}>
                              <i className="fas fa-angle-right" style={{ color: getCategoryColor(selectedProgram.category), marginRight: '0.5rem' }}></i>
                              {activity.name}
                            </strong>
                            <span style={{
                              fontSize: '0.65rem',
                              background: '#F9C74F20',
                              color: '#F9C74F',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '20px'
                            }}>
                              Click for details
                            </span>
                          </div>
                          {activity.description && (
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem', marginBottom: 0 }}>
                              {activity.description.substring(0, 120)}...
                            </p>
                          )}
                        </div>
                        
                        {/* Preview of explanations */}
                        {activity.explanations && activity.explanations.length > 0 && (
                          <div style={{ padding: '0.8rem 1rem', background: 'white' }}>
                            <p style={{ fontSize: '0.7rem', color: '#999', marginBottom: '0.3rem' }}>
                              <i className="fas fa-comment-dots"></i> Quick preview:
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {activity.explanations.slice(0, 2).map((exp, expIdx) => (
                                <span key={expIdx} style={{
                                  fontSize: '0.7rem',
                                  background: '#f0f0f0',
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: '15px',
                                  color: '#666'
                                }}>
                                  <i className={getExplanationTypeIcon(exp.explanation_type)} style={{ marginRight: '0.3rem', fontSize: '0.6rem' }}></i>
                                  {exp.title}
                                </span>
                              ))}
                              {activity.explanations.length > 2 && (
                                <span style={{ fontSize: '0.7rem', color: '#999' }}>
                                  +{activity.explanations.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#999', fontStyle: 'italic' }}>No activities available.</p>
                )}
              </div>
              
              <button 
                onClick={closeProgramModal} 
                style={{ 
                  width: '100%', 
                  background: '#F9C74F', 
                  border: 'none', 
                  padding: '0.8rem', 
                  borderRadius: '50px', 
                  color: '#0B3B2F', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8b500';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F9C74F';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Modal with Explanations */}
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
              zIndex: 10
            }}>
              <i className="fas fa-times"></i>
            </button>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                margin: '0 auto',
                borderRadius: '50%',
                background: '#F9C74F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className={selectedActivity.icon || 'fas fa-tasks'} style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '1rem', marginBottom: '0.5rem', fontSize: 'clamp(1.2rem, 5vw, 1.5rem)' }}>
                {selectedActivity.name}
              </h2>
              {selectedActivity.duration && (
                <p style={{ color: '#F9C74F', marginBottom: 0, fontSize: '0.85rem' }}>
                  <i className="fas fa-clock"></i> {selectedActivity.duration}
                </p>
              )}
            </div>
            
            <div style={{ padding: 'clamp(1.2rem, 5vw, 1.8rem)' }}>
              {selectedActivity.description && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1rem' }}>Description</h3>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>{selectedActivity.description}</p>
                </div>
              )}
              
              {selectedActivity.target_audience && (
                <div style={{ marginBottom: '1rem', padding: '0.8rem', background: '#f9fbf7', borderRadius: '12px' }}>
                  <strong style={{ color: '#0B3B2F' }}><i className="fas fa-users"></i> Target Audience:</strong>
                  <span style={{ marginLeft: '0.5rem', color: '#666' }}>{selectedActivity.target_audience}</span>
                </div>
              )}
              
              {selectedActivity.max_participants && (
                <div style={{ marginBottom: '1.5rem', padding: '0.8rem', background: '#f9fbf7', borderRadius: '12px' }}>
                  <strong style={{ color: '#0B3B2F' }}><i className="fas fa-user-friends"></i> Max Participants:</strong>
                  <span style={{ marginLeft: '0.5rem', color: '#666' }}>{selectedActivity.max_participants}</span>
                </div>
              )}
              
              {/* Explanations Section */}
              {selectedActivity.explanations && selectedActivity.explanations.length > 0 ? (
                <div>
                  <h3 style={{ 
                    color: '#0B3B2F', 
                    marginBottom: '1rem', 
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <i className="fas fa-info-circle" style={{ color: '#F9C74F' }}></i>
                    Detailed Explanations
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedActivity.explanations.map((explanation, idx) => (
                      <div 
                        key={explanation.id || idx}
                        style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '16px',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{
                          padding: '1rem',
                          background: '#f9fbf7',
                          borderBottom: '2px solid #F9C74F'
                        }}>
                          <h4 style={{ 
                            color: '#0B3B2F', 
                            marginBottom: '0.3rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <i className={getExplanationTypeIcon(explanation.explanation_type)} style={{ color: '#F9C74F' }}></i>
                            {explanation.title}
                          </h4>
                          {explanation.explanation_type && (
                            <span style={{
                              fontSize: '0.65rem',
                              background: `${getCategoryColor(selectedActivity.program?.category)}15`,
                              color: getCategoryColor(selectedActivity.program?.category),
                              padding: '0.2rem 0.6rem',
                              borderRadius: '20px'
                            }}>
                              {explanation.explanation_type.charAt(0).toUpperCase() + explanation.explanation_type.slice(1)}
                            </span>
                          )}
                        </div>
                        <div style={{ padding: '1rem' }}>
                          <p style={{ color: '#666', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
                            {explanation.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', background: '#f9fbf7', borderRadius: '16px' }}>
                  <i className="fas fa-file-alt" style={{ fontSize: '2rem', color: '#ccc' }}></i>
                  <p style={{ marginTop: '0.5rem', color: '#999' }}>No detailed explanations available yet.</p>
                </div>
              )}
              
              <button 
                onClick={closeActivityModal} 
                style={{ 
                  width: '100%', 
                  background: '#F9C74F', 
                  border: 'none', 
                  padding: '0.8rem', 
                  borderRadius: '50px', 
                  color: '#0B3B2F', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  marginTop: '1.5rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8b500';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F9C74F';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
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