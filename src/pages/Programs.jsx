import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Programs = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewMoreHovered, setIsViewMoreHovered] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch missions (projects) from your API
      const missionsRes = await fetch(`${API_BASE_URL}/missions/`);
      
      let missionsData = [];
      if (missionsRes.ok) {
        const data = await missionsRes.json();
        // Handle response format: { count, results } or direct array
        if (data.results) {
          missionsData = data.results;
        } else if (Array.isArray(data)) {
          missionsData = data;
        } else if (data.data) {
          missionsData = data.data;
        } else if (data.success && data.data) {
          missionsData = data.data;
        } else {
          missionsData = [];
        }
      } else {
        console.error('Missions API error:', missionsRes.status);
      }

      setProjects(missionsData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const displayedProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 3, projects.length));
      setIsLoading(false);
    }, 500);
  };

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    setShowProjectModal(false);
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
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
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
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
    <div style={{ paddingTop: '70px' }}>
      <style>{`
        @keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }
        @keyframes bounceArrow { 
          0%, 100% { transform: translateX(0); } 
          50% { transform: translateX(5px); } 
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
        
        @media (max-width: 768px) {
          .btn-view-more { min-width: 160px !important; padding: 0.7rem 1.5rem !important; }
          .btn-view-more span { font-size: 0.85rem !important; }
          .modal-content { max-height: 90vh !important; }
        }
        @media (max-width: 480px) {
          .btn-view-more { min-width: 140px !important; padding: 0.6rem 1.2rem !important; }
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
          Our Projects
        </h1>
        <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', maxWidth: '800px', margin: '0 auto' }}>
          Discover impactful projects making a difference in our communities
        </p>
      </div>

      {/* Featured Projects Section */}
      <div style={{ background: '#f9fbf7', padding: '4rem 2rem' }}>
        <h2 data-aos="fade-up" style={{ textAlign: 'center', marginBottom: '2rem', color: '#0B3B2F', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>Featured Projects</h2>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <i className="fas fa-project-diagram" style={{ fontSize: '3rem', color: '#999' }}></i>
              <p style={{ marginTop: '1rem', color: '#666' }}>No projects available at the moment.</p>
            </div>
          ) : (
            <>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                {displayedProjects.map((project, idx) => (
                  <div key={project.id || idx} data-aos="zoom-in" data-aos-delay={idx * 100} style={{ 
                    background: 'white', 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer',
                    maxWidth: '320px',
                    margin: '0 auto'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
                  }}
                  onClick={() => openProjectModal(project)}>
                    {project.image_base64 ? (
                      <img src={project.image_base64} alt={project.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '180px', background: 'linear-gradient(135deg, #F9C74F, #f8b500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-image" style={{ fontSize: '3rem', color: 'white' }}></i>
                      </div>
                    )}
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>{project.title}</h4>
                      <p style={{ fontSize: '0.75rem', color: '#666', lineHeight: '1.5' }}>{project.description?.substring(0, 60)}...</p>
                      <div style={{
                        marginTop: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}>
                        <span style={{
                          fontSize: '0.65rem',
                          background: project.category === 'leadership' ? 'rgba(33,150,243,0.1)' : 'rgba(76,175,80,0.1)',
                          color: project.category === 'leadership' ? '#2196F3' : '#4caf50',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '20px',
                          fontWeight: 600
                        }}>
                          {project.category === 'leadership' ? 'Leadership' : project.category === 'environment' ? 'Environment' : project.category || 'Project'}
                        </span>
                        <span style={{
                          fontSize: '0.65rem',
                          color: '#F9C74F',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <i className="fas fa-eye"></i>
                          View Details
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View More Button */}
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button 
                    onClick={loadMore}
                    disabled={isLoading}
                    onMouseEnter={() => setIsViewMoreHovered(true)}
                    onMouseLeave={() => setIsViewMoreHovered(false)}
                    className="btn-view-more"
                    style={{
                      background: isLoading ? '#0B3B2F' : '#F9C74F',
                      border: 'none',
                      padding: '0.8rem 2rem',
                      borderRadius: '60px',
                      fontWeight: 700,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: 'clamp(0.85rem, 4vw, 1rem)',
                      minWidth: '180px',
                      color: isLoading ? 'white' : '#1a3a2a',
                      opacity: isLoading ? 0.7 : 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.8rem'
                    }}
                  >
                    <span>{isLoading ? 'Loading...' : 'View More Projects'}</span>
                    <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {isLoading ? (
                        <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      ) : (
                        <i className="fas fa-arrow-right" style={{
                          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: isViewMoreHovered ? 'translateX(8px)' : 'translateX(0)',
                          animation: isViewMoreHovered ? 'none' : 'bounceArrow 1.5s ease-in-out infinite'
                        }}></i>
                      )}
                    </div>
                  </button>
                </div>
              )}

              {!hasMore && projects.length > 3 && (
                <div style={{
                  textAlign: 'center',
                  marginTop: '2rem',
                  padding: '0.8rem 1rem',
                  color: '#666',
                  fontSize: 'clamp(0.8rem, 3.5vw, 0.9rem)',
                  background: 'rgba(249,199,79,0.1)',
                  borderRadius: '60px',
                  maxWidth: '300px',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}>
                  <i className="fas fa-check-circle" style={{ color: '#F9C74F', marginRight: '0.5rem' }}></i>
                  You've seen all {projects.length} amazing projects!
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Project Modal */}
      {showProjectModal && selectedProject && (
        <div className="modal-overlay" onClick={closeProjectModal} style={{
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
            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
              {selectedProject.image_base64 ? (
                <img src={selectedProject.image_base64} alt={selectedProject.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #F9C74F, #f8b500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-image" style={{ fontSize: '4rem', color: 'white' }}></i>
                </div>
              )}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))' }} />
              <button onClick={closeProjectModal} style={{
                position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.5)', border: 'none',
                width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '1.2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <i className="fas fa-times"></i>
              </button>
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', zIndex: 10 }}>
                <span style={{
                  display: 'inline-block', 
                  background: selectedProject.category === 'leadership' ? '#F9C74F' : '#2b7a5c',
                  color: selectedProject.category === 'leadership' ? '#0B3B2F' : 'white', 
                  padding: '0.2rem 0.6rem',
                  borderRadius: '20px', 
                  fontSize: '0.65rem', 
                  fontWeight: 600, 
                  marginBottom: '0.5rem'
                }}>
                  {selectedProject.category === 'leadership' ? 'LEADERSHIP' : selectedProject.category?.toUpperCase() || 'PROJECT'}
                </span>
                <h2 style={{ color: 'white', margin: 0, fontSize: 'clamp(1.2rem, 5vw, 1.5rem)' }}>{selectedProject.title}</h2>
              </div>
            </div>
            <div style={{ padding: 'clamp(1.2rem, 5vw, 1.5rem)' }}>
              <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem', fontSize: 'clamp(0.85rem, 3.5vw, 0.95rem)' }}>
                {selectedProject.description}
              </p>
              
              {selectedProject.category && (
                <div style={{
                  marginBottom: '1rem',
                  padding: '0.8rem',
                  background: '#f9fbf7',
                  borderRadius: '12px'
                }}>
                  <strong style={{ color: '#0B3B2F' }}>Category:</strong>
                  <span style={{ marginLeft: '0.5rem', color: '#666' }}>
                    {selectedProject.category === 'leadership' ? 'Leadership Development' : 'Environmental Impact'}
                  </span>
                </div>
              )}
              
              {selectedProject.order !== undefined && (
                <div style={{
                  marginBottom: '1rem',
                  padding: '0.8rem',
                  background: '#f9fbf7',
                  borderRadius: '12px'
                }}>
                  <strong style={{ color: '#0B3B2F' }}>Priority Order:</strong>
                  <span style={{ marginLeft: '0.5rem', color: '#666' }}>{selectedProject.order}</span>
                </div>
              )}
              
              {selectedProject.created_at && (
                <div style={{
                  marginBottom: '1rem',
                  padding: '0.8rem',
                  background: '#f9fbf7',
                  borderRadius: '12px'
                }}>
                  <strong style={{ color: '#0B3B2F' }}>Created:</strong>
                  <span style={{ marginLeft: '0.5rem', color: '#666' }}>
                    {new Date(selectedProject.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button 
                  onClick={closeProjectModal} 
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
                <button 
                  onClick={() => window.location.href = '/contact'} 
                  style={{ 
                    flex: 2, 
                    background: '#F9C74F', 
                    border: 'none', 
                    padding: '0.7rem', 
                    borderRadius: '50px', 
                    color: '#0B3B2F', 
                    fontWeight: 600, 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.5rem',
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
                  <i className="fas fa-envelope"></i> Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;