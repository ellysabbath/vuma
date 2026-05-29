import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';

const InnovationShowcase = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.cat === filter);
  
  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 4, filteredProjects.length));
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    setVisibleCount(8);
  }, [filter]);

  const openModal = (project) => {
    setSelectedProject(project);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  };

  const handleGetInvolved = (projectTitle) => {
    closeModal();
    navigate('/events/register', { state: { eventName: projectTitle } });
  };

  // Extended project details
  const getProjectDetails = (project) => {
    const details = {
      "Solar-Powered Water Pump": {
        fullDescription: "This innovative solar-powered water pump provides clean water to rural communities without access to electricity. The system uses renewable solar energy to pump water from underground sources, reducing dependence on fossil fuels and manual labor. The project has already benefited over 500 households and aims to expand to 10 more villages by the end of 2026.",
        impact: "500+ households, 1000+ people, 50,000 liters of water daily",
        timeline: "January 2025 - December 2026",
        partners: ["UNDP", "Ministry of Water", "Local Communities"],
        sdg: ["SDG 6: Clean Water", "SDG 7: Affordable Energy", "SDG 13: Climate Action"]
      },
      "Youth Leadership Academy": {
        fullDescription: "The Youth Leadership Academy is a 6-month intensive program designed to equip young Tanzanians with essential leadership skills. Participants engage in workshops, mentorship sessions, and community projects. Graduates become certified youth leaders who drive change in their communities.",
        impact: "200+ graduates, 50+ community projects initiated",
        timeline: "Annual program (March - August)",
        partners: ["Ministry of Youth", "UNDP", "Local NGOs"],
        sdg: ["SDG 4: Quality Education", "SDG 8: Decent Work", "SDG 17: Partnerships"]
      },
      "Plastic Upcycling Hub": {
        fullDescription: "This initiative collects plastic waste from communities and transforms it into valuable products such as building materials, furniture, and art. The hub also provides training to youth on recycling techniques and entrepreneurship, creating green jobs and reducing environmental pollution.",
        impact: "10 tons of plastic recycled, 50+ youth employed",
        timeline: "Ongoing since March 2025",
        partners: ["UNEP", "WWF", "Local Government"],
        sdg: ["SDG 12: Responsible Consumption", "SDG 13: Climate Action", "SDG 8: Decent Work"]
      },
      "Policy Innovators Fellowship": {
        fullDescription: "This fellowship program trains young policy advocates to influence environmental and social policies in Tanzania. Fellows receive training in policy analysis, advocacy strategies, and stakeholder engagement. They work on real policy issues and present recommendations to government bodies.",
        impact: "30 fellows trained, 3 policy briefs submitted",
        timeline: "September 2025 - February 2026",
        partners: ["Policy Forum", "UNDP", "Government Agencies"],
        sdg: ["SDG 16: Peace & Justice", "SDG 13: Climate Action", "SDG 17: Partnerships"]
      },
      "Urban Vertical Farming": {
        fullDescription: "This innovative project brings agriculture to urban spaces through vertical farming techniques. Using hydroponic systems, we grow fresh vegetables in limited spaces, providing food security and reducing transportation emissions. The project also offers training to urban youth on sustainable farming.",
        impact: "20 vertical farms established, 1000+ kg of produce monthly",
        timeline: "January 2025 - Ongoing",
        partners: ["FAO", "Ministry of Agriculture", "Local Universities"],
        sdg: ["SDG 2: Zero Hunger", "SDG 11: Sustainable Cities", "SDG 12: Consumption"]
      },
      "Climate Tech Bootcamp": {
        fullDescription: "The Climate Tech Bootcamp is an intensive 8-week program that trains youth in technology solutions for climate challenges. Participants learn coding, data analysis, and hardware development to create innovative climate solutions. The program includes mentorship from industry experts and a demo day with potential investors.",
        impact: "100+ graduates, 20+ climate tech prototypes developed",
        timeline: "Quarterly program",
        partners: ["Tech Hubs", "UNDP", "Private Sector"],
        sdg: ["SDG 9: Innovation", "SDG 13: Climate Action", "SDG 4: Education"]
      }
    };

    return details[project.title] || {
      fullDescription: `${project.title} is an innovative initiative that addresses critical challenges in ${project.cat === 'leadership' ? 'leadership development' : 'environmental sustainability'}. This project demonstrates VUMA Tanzania's commitment to empowering youth and creating positive change. Through this initiative, we are building capacity, fostering innovation, and creating lasting impact in communities across Tanzania.`,
      impact: "Ongoing impact assessment",
      timeline: "Current project",
      partners: ["VUMA Tanzania", "Community Partners", "Youth Leaders"],
      sdg: ["SDG 4: Quality Education", "SDG 13: Climate Action", "SDG 17: Partnerships"]
    };
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2 
        className="section-title"
        style={{
          textAlign: 'center',
          fontSize: 'clamp(1.5rem, 5vw, 2rem)',
          fontWeight: 800,
          margin: '2rem 0 1rem',
          background: 'linear-gradient(135deg, #0B3B2F, #2b7a5c)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          padding: '0 1rem'
        }}
      >
        Innovation Showcase
      </h2>
      
      <div className="filter-buttons" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.6rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        padding: '0 0.5rem'
      }}>
        {['all', 'leadership', 'environment'].map(cat => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
            style={{
              background: filter === cat ? '#0B3B2F' : '#eef2f0',
              border: 'none',
              padding: 'clamp(0.4rem, 3vw, 0.5rem) clamp(0.8rem, 4vw, 1.2rem)',
              borderRadius: '40px',
              fontWeight: 600,
              cursor: 'pointer',
              color: filter === cat ? 'white' : '#1e2f2c',
              transition: 'all 0.3s ease',
              transform: filter === cat ? 'scale(1.05)' : 'scale(1)',
              fontSize: 'clamp(0.75rem, 3.5vw, 0.9rem)',
              whiteSpace: 'nowrap'
            }}
          >
            {cat === 'all' ? `All (${projects.length})` : cat === 'leadership' ? `Leadership (${projects.filter(p => p.cat === 'leadership').length})` : `Environmental (${projects.filter(p => p.cat === 'environment').length})`}
          </button>
        ))}
      </div>
      
      <div className="masonry-grid" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'center',
        padding: '0 0.75rem'
      }}>
        {displayedProjects.map((project, idx) => (
          <ProjectCard 
            key={idx} 
            project={project} 
            index={idx} 
            onCardClick={() => openModal(project)}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div style={{
          textAlign: 'center',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          padding: '0 1rem'
        }}>
          <button 
            className="btn-load-more"
            onClick={loadMore}
            disabled={isLoading}
            style={{
              background: 'transparent',
              border: '2px solid #F9C74F',
              padding: 'clamp(0.7rem, 4vw, 0.9rem) clamp(1.5rem, 6vw, 2.5rem)',
              borderRadius: '60px',
              fontWeight: 700,
              margin: '0',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontSize: 'clamp(0.85rem, 4vw, 1rem)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              color: '#0B3B2F',
              backgroundColor: 'transparent',
              opacity: isLoading ? 0.7 : 1,
              minWidth: '200px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)';
                const arrow = e.currentTarget.querySelector('.load-more-arrow');
                if (arrow) arrow.style.transform = 'translateX(5px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = 'transparent';
              const arrow = e.currentTarget.querySelector('.load-more-arrow');
              if (arrow) arrow.style.transform = 'translateX(0)';
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(11,59,47,0.3)',
                  borderTop: '2px solid #0B3B2F',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>More Stories</span>
                <i className="fas fa-arrow-right load-more-arrow" style={{
                  transition: 'transform 0.3s ease',
                  fontSize: 'clamp(0.8rem, 3.5vw, 0.9rem)'
                }}></i>
              </>
            )}
          </button>
        </div>
      )}

      {/* Show all message */}
      {!hasMore && filteredProjects.length > 8 && (
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          marginBottom: '1rem',
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
          You've seen all {filteredProjects.length} amazing projects!
        </div>
      )}

      {/* Project Details Modal */}
      {showModal && selectedProject && (
        <div className="modal-overlay" onClick={closeModal} style={{
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
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
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
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Modal Header with Image */}
            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
              <img 
                src={selectedProject.img} 
                alt={selectedProject.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))' }} />
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', zIndex: 10 }}>
                <span style={{
                  display: 'inline-block',
                  background: selectedProject.cat === 'leadership' ? '#F9C74F' : '#2b7a5c',
                  color: selectedProject.cat === 'leadership' ? '#0B3B2F' : 'white',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem'
                }}>
                  {selectedProject.cat === 'leadership' ? 'LEADERSHIP' : 'ENVIRONMENT'}
                </span>
                <h2 style={{ color: 'white', margin: 0, fontSize: 'clamp(1.3rem, 5vw, 1.8rem)' }}>{selectedProject.title}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 'clamp(1.5rem, 5vw, 2rem)' }}>
              {/* Description */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem' }}>
                  <i className="fas fa-info-circle" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  Project Overview
                </h3>
                <p style={{ color: '#555', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  {getProjectDetails(selectedProject).fullDescription}
                </p>
              </div>

              {/* Impact & Timeline */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
                background: '#f9fbf7',
                padding: '1rem',
                borderRadius: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.3rem' }}>
                    <i className="fas fa-chart-line" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                    Impact
                  </div>
                  <div style={{ fontWeight: 600, color: '#0B3B2F', fontSize: '0.85rem' }}>
                    {getProjectDetails(selectedProject).impact}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.3rem' }}>
                    <i className="fas fa-clock" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                    Timeline
                  </div>
                  <div style={{ fontWeight: 600, color: '#0B3B2F', fontSize: '0.85rem' }}>
                    {getProjectDetails(selectedProject).timeline}
                  </div>
                </div>
              </div>

              {/* Partners */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem' }}>
                  <i className="fas fa-handshake" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  Partners & Collaborators
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                  {getProjectDetails(selectedProject).partners.map((partner, i) => (
                    <span key={i} style={{
                      background: '#f9fbf7',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      color: '#0B3B2F'
                    }}>
                      {partner}
                    </span>
                  ))}
                </div>
              </div>

              {/* SDG Goals */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem' }}>
                  <i className="fas fa-globe" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  Sustainable Development Goals
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {getProjectDetails(selectedProject).sdg.map((goal, i) => (
                    <span key={i} style={{
                      background: 'rgba(249,199,79,0.1)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      color: '#F9C74F'
                    }}>
                      {goal}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: '2px solid #ddd',
                    padding: '0.8rem',
                    borderRadius: '50px',
                    color: '#666',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#d32f2f';
                    e.currentTarget.style.color = '#d32f2f';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.color = '#666';
                  }}
                >
                  <i className="fas fa-times" style={{ marginRight: '0.5rem' }}></i>
                  Close
                </button>
                <button
                  onClick={() => handleGetInvolved(selectedProject.title)}
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
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(249,199,79,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <i className="fas fa-handshake"></i>
                  Get Involved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modal-content::-webkit-scrollbar {
          width: 6px;
        }
        
        .modal-content::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .modal-content::-webkit-scrollbar-thumb {
          background: #F9C74F;
          border-radius: 3px;
        }
        
        @media (max-width: 768px) {
          .masonry-grid {
            gap: 0.75rem !important;
          }
          
          .modal-content {
            max-height: 90vh;
          }
          
          .modal-content > div:first-child {
            height: 180px;
          }
        }
        
        @media (max-width: 480px) {
          .filter-buttons {
            gap: 0.4rem !important;
          }
          
          .filter-btn {
            padding: 0.35rem 0.7rem !important;
            font-size: 0.7rem !important;
          }
          
          .btn-load-more {
            min-width: 160px !important;
            padding: 0.6rem 1.2rem !important;
            font-size: 0.85rem !important;
          }
          
          .modal-content {
            border-radius: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

const ProjectCard = ({ project, index, onCardClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animationType, setAnimationType] = useState('slideUp');
  const cardRef = useRef(null);

  useEffect(() => {
    const animations = ['slideUp', 'fadeIn', 'zoomIn', 'slideLeft', 'slideRight'];
    const randomAnim = animations[Math.floor(Math.random() * animations.length)];
    setAnimationType(randomAnim);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
          }
        });
      },
      {
        threshold: window.innerWidth < 768 ? 0.1 : 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [hasAnimated]);

  const getAnimationStyles = () => {
    if (!isVisible) {
      switch (animationType) {
        case 'slideUp':
          return { opacity: 0, transform: 'translateY(50px)' };
        case 'fadeIn':
          return { opacity: 0 };
        case 'zoomIn':
          return { opacity: 0, transform: 'scale(0.8)' };
        case 'slideLeft':
          return { opacity: 0, transform: 'translateX(-50px)' };
        case 'slideRight':
          return { opacity: 0, transform: 'translateX(50px)' };
        default:
          return { opacity: 0, transform: 'translateY(50px)' };
      }
    }
    return { opacity: 1, transform: 'translateX(0) translateY(0) scale(1)' };
  };

  return (
    <div
      ref={cardRef}
      className="project-card"
      style={{
        ...getAnimationStyles(),
        transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1)`,
        transitionDelay: `${index * 0.1}s`,
        width: '280px',
        background: 'white',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 12px 25px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        if (isVisible) {
          e.currentTarget.style.transform = 'translateY(0)';
        }
        e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.05)';
      }}
      onClick={() => onCardClick(project)}
    >
      <div style={{
        height: '200px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <img
          src={project.img}
          alt={project.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: isVisible ? 'scale(1)' : 'scale(1.15)'
          }}
          className="project-image"
          loading="lazy"
        />
        
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(11, 59, 47, 0.9)',
            color: '#F9C74F',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            backdropFilter: 'blur(4px)',
            zIndex: 1
          }}
        >
          {project.cat === 'leadership' ? 'LEADERSHIP' : 'ENVIRONMENT'}
        </div>
      </div>
      
      <div className="project-content" style={{ padding: '1rem' }}>
        <span
          style={{
            color: '#F9C74F',
            fontWeight: 'bold',
            display: 'inline-block',
            fontSize: '0.85rem'
          }}
        >
          {project.cat === 'leadership' ? '🌟 Innovation Leadership' : '🌿 Environmental Innovation'}
        </span>
        <h4
          style={{
            marginTop: '8px',
            fontSize: '1.1rem',
            color: '#0B3B2F'
          }}
        >
          {project.title}
        </h4>
        <p
          style={{
            fontSize: '0.85rem',
            color: '#666',
            marginTop: '8px',
            lineHeight: '1.4'
          }}
        >
          {project.description}
        </p>
        
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '12px',
            color: '#F9C74F',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-eye"></i>
          <span>View Details</span>
        </div>
      </div>

      <style>{`
        .project-image {
          transition: transform 0.5s ease;
        }
        
        .project-card:hover .project-image {
          transform: scale(1.1);
        }
        
        @media (max-width: 768px) {
          .project-card {
            width: calc(50% - 0.75rem) !important;
            min-width: 150px;
            transition: all 0.4s ease !important;
          }
          
          .project-card:hover {
            transform: translateY(-4px) !important;
          }
          
          .project-content h4 {
            font-size: 0.9rem;
          }
          
          .project-content p {
            font-size: 0.7rem;
          }
          
          .project-content span {
            font-size: 0.65rem;
          }
          
          .project-content {
            padding: 0.8rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .project-card {
            width: 100% !important;
            max-width: 300px;
            margin: 0 auto;
          }
          
          .project-card > div:first-child {
            height: 180px;
          }
        }
        
        @media (prefers-reduced-motion: no-preference) {
          .project-card {
            will-change: transform, opacity;
          }
        }
      `}</style>
    </div>
  );
};

export default InnovationShowcase;