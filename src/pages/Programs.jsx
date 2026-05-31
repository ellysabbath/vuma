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

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [programsRes, projectsRes] = await Promise.all([
        fetch('http://192.168.137.83:8000/api/programs/'),
        fetch('http://192.168.137.83:8000/api/programs/projects/')
      ]);
      
      const programsData = await programsRes.json();
      const projectsData = await projectsRes.json();
      
      if (programsData.success) setPrograms(programsData.data);
      if (projectsData.success) setProjects(projectsData.data);
    } catch (error) {
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

  const handleApplyNow = (programTitle) => {
    navigate('/programs/apply', { state: { programName: programTitle } });
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading programs...</p>
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
          Discover opportunities to grow, learn, and make a difference
        </p>
      </div>

      {/* Programs Cards */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {programs.map((program, idx) => (
            <div key={program.id} data-aos="fade-up" data-aos-delay={idx * 100} style={{
              background: 'white',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer',
              maxWidth: '320px',
              margin: '0 auto'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            onClick={() => openProgramModal(program)}>
              <div style={{ background: `linear-gradient(135deg, ${program.color}, ${program.color}dd)`, padding: '1.5rem', textAlign: 'center' }}>
                <i className={program.icon} style={{ fontSize: '2.5rem', color: 'white' }}></i>
                <h3 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.2rem' }}>{program.title}</h3>
              </div>
              <div style={{ padding: '1.2rem' }}>
                <p style={{ color: '#666', marginBottom: '0.8rem', fontSize: '0.85rem' }}>{program.description}</p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {program.features && program.features.slice(0, 2).map((feature, i) => (
                    <li key={i} style={{ padding: '0.3rem 0', color: '#555', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                      <i className="fas fa-check-circle" style={{ color: '#F9C74F', fontSize: '0.7rem' }}></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div style={{
                  marginTop: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  color: '#F9C74F',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  <i className="fas fa-eye" style={{ fontSize: '0.9rem' }}></i>
                  <span>Click to view details</span>
                </div>
              </div>
            </div>
          ))}
        </div>
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
            maxWidth: '650px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            position: 'relative',
            animation: 'slideInUp 0.3s ease'
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${selectedProgram.color}, ${selectedProgram.color}dd)`,
              padding: 'clamp(1.5rem, 5vw, 2rem)',
              textAlign: 'center',
              position: 'relative'
            }}>
              <button
                onClick={closeProgramModal}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
              <i className={selectedProgram.icon} style={{ fontSize: 'clamp(2.5rem, 6vw, 3rem)', color: 'white' }}></i>
              <h2 style={{ color: 'white', marginTop: '1rem', fontSize: 'clamp(1.3rem, 5vw, 1.8rem)' }}>{selectedProgram.title}</h2>
            </div>

            <div style={{ padding: 'clamp(1.5rem, 5vw, 2rem)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>
                  <i className="fas fa-info-circle" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  About This Program
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6', fontSize: 'clamp(0.85rem, 3.5vw, 1rem)' }}>{selectedProgram.full_description}</p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
                background: '#f9fbf7',
                padding: 'clamp(0.8rem, 3vw, 1rem)',
                borderRadius: '16px'
              }}>
                <div>
                  <div style={{ fontSize: 'clamp(0.7rem, 3vw, 0.8rem)', color: '#888', marginBottom: '0.3rem' }}>
                    <i className="fas fa-clock" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                    Duration
                  </div>
                  <div style={{ fontWeight: 600, color: '#0B3B2F', fontSize: 'clamp(0.85rem, 3.5vw, 0.9rem)' }}>{selectedProgram.duration}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'clamp(0.7rem, 3vw, 0.8rem)', color: '#888', marginBottom: '0.3rem' }}>
                    <i className="fas fa-user-check" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                    Eligibility
                  </div>
                  <div style={{ fontWeight: 600, color: '#0B3B2F', fontSize: 'clamp(0.85rem, 3.5vw, 0.9rem)' }}>{selectedProgram.eligibility}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'clamp(0.7rem, 3vw, 0.8rem)', color: '#888', marginBottom: '0.3rem' }}>
                    <i className="fas fa-certificate" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                    Certification
                  </div>
                  <div style={{ fontWeight: 600, color: '#0B3B2F', fontSize: 'clamp(0.85rem, 3.5vw, 0.9rem)' }}>{selectedProgram.certification}</div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>
                  <i className="fas fa-chart-line" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  Key Outcomes
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {selectedProgram.outcomes && selectedProgram.outcomes.map((outcome, i) => (
                    <li key={i} style={{ padding: '0.5rem 0', color: '#555', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'clamp(0.85rem, 3.5vw, 0.9rem)' }}>
                      <i className="fas fa-check-circle" style={{ color: '#F9C74F', fontSize: '0.8rem' }}></i>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>
                  <i className="fas fa-list-check" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  Program Features
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {selectedProgram.features && selectedProgram.features.map((feature, i) => (
                    <li key={i} style={{ padding: '0.5rem 0', color: '#555', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'clamp(0.85rem, 3.5vw, 0.9rem)' }}>
                      <i className="fas fa-star" style={{ color: '#F9C74F', fontSize: '0.8rem' }}></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexDirection: 'row', flexWrap: 'wrap' }}>
                <button
                  onClick={closeProgramModal}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: '2px solid #ddd',
                    padding: '0.8rem',
                    borderRadius: '50px',
                    color: '#666',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: 'clamp(0.85rem, 3.5vw, 0.9rem)'
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => handleApplyNow(selectedProgram.title)}
                  style={{
                    flex: 2,
                    background: '#F9C74F',
                    border: 'none',
                    padding: '0.8rem',
                    borderRadius: '50px',
                    color: '#0B3B2F',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: 'clamp(0.85rem, 3.5vw, 0.9rem)'
                  }}
                >
                  <i className="fas fa-paper-plane"></i>
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Projects Section */}
      <div style={{ background: '#f9fbf7', padding: '4rem 2rem' }}>
        <h2 data-aos="fade-up" style={{ textAlign: 'center', marginBottom: '2rem', color: '#0B3B2F' }}>Featured Projects</h2>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <i className="fas fa-project-diagram" style={{ fontSize: '3rem', color: '#999' }}></i>
              <p style={{ marginTop: '1rem', color: '#666' }}>No projects available at the moment.</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {displayedProjects.map((project, idx) => (
                <div key={project.id} data-aos="zoom-in" data-aos-delay={idx * 100} style={{ 
                  background: 'white', 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer',
                  maxWidth: '320px',
                  margin: '0 auto'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                onClick={() => openProjectModal(project)}>
                  {project.image_base64 ? (
                    <img src={project.image_base64} alt={project.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '180px', background: 'linear-gradient(135deg, #F9C74F, #f8b500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-image" style={{ fontSize: '3rem', color: 'white' }}></i>
                    </div>
                  )}
                  <div style={{ padding: '1rem' }}>
                    <h4 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1rem' }}>{project.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#666' }}>{project.description.substring(0, 60)}...</p>
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
                        background: 'rgba(249,199,79,0.1)',
                        color: '#F9C74F',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px'
                      }}>
                        {project.category === 'leadership' ? 'Leadership' : project.category === 'environment' ? 'Environment' : project.category}
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
          )}

          {/* View More Button */}
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button 
                onClick={loadMore}
                disabled={isLoading}
                onMouseEnter={() => setIsViewMoreHovered(true)}
                onMouseLeave={() => setIsViewMoreHovered(false)}
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
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
              }}>
                <i className="fas fa-times"></i>
              </button>
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', zIndex: 10 }}>
                <span style={{
                  display: 'inline-block', background: selectedProject.category === 'leadership' ? '#F9C74F' : '#2b7a5c',
                  color: selectedProject.category === 'leadership' ? '#0B3B2F' : 'white', padding: '0.2rem 0.6rem',
                  borderRadius: '20px', fontSize: '0.65rem', fontWeight: 600, marginBottom: '0.5rem'
                }}>
                  {selectedProject.category === 'leadership' ? 'LEADERSHIP' : selectedProject.category.toUpperCase()}
                </span>
                <h2 style={{ color: 'white', margin: 0, fontSize: 'clamp(1.2rem, 5vw, 1.5rem)' }}>{selectedProject.title}</h2>
              </div>
            </div>
            <div style={{ padding: 'clamp(1.2rem, 5vw, 1.5rem)' }}>
              <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem', fontSize: 'clamp(0.85rem, 3.5vw, 0.95rem)' }}>{selectedProject.description}</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button onClick={closeProjectModal} style={{ flex: 1, background: 'transparent', border: '2px solid #ddd', padding: '0.7rem', borderRadius: '50px', color: '#666', fontWeight: 600, cursor: 'pointer' }}>Close</button>
                <button onClick={() => alert(`Learn more about ${selectedProject.title}`)} style={{ flex: 2, background: '#F9C74F', border: 'none', padding: '0.7rem', borderRadius: '50px', color: '#0B3B2F', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-info-circle"></i> Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes bounceArrow { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(5px); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        
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
    </div>
  );
};

export default Programs;