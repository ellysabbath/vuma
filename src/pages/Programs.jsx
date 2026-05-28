import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { projects } from '../data/projects';

const Programs = () => {
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewMoreHovered, setIsViewMoreHovered] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  const displayedProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 3, projects.length));
      setIsLoading(false);
    }, 500);
  };

  const programs = [
    { id: 1, title: 'Innovation Leadership', icon: 'fas fa-lightbulb', color: '#F9C74F', description: 'Develop leadership skills to drive innovation in your community.', features: ['Leadership Training', 'Mentorship Program', 'Networking Events'] },
    { id: 2, title: 'Environmental Innovation', icon: 'fas fa-leaf', color: '#2b7a5c', description: 'Create sustainable solutions for environmental challenges.', features: ['Green Projects', 'Climate Action', 'Sustainability Workshops'] },
    { id: 3, title: 'Mentorship Program', icon: 'fas fa-handshake', color: '#F9C74F', description: 'Connect with experienced mentors to guide your journey.', features: ['One-on-One Mentoring', 'Career Guidance', 'Skill Development'] }
  ];

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {programs.map((program, idx) => (
            <div key={program.id} data-aos="fade-up" data-aos-delay={idx * 100} style={{
              background: 'white',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ background: `linear-gradient(135deg, ${program.color}, ${program.color}dd)`, padding: '2rem', textAlign: 'center' }}>
                <i className={program.icon} style={{ fontSize: '3rem', color: 'white' }}></i>
                <h3 style={{ color: 'white', marginTop: '1rem' }}>{program.title}</h3>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <p style={{ color: '#666', marginBottom: '1rem' }}>{program.description}</p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {program.features.map((feature, i) => (
                    <li key={i} style={{ padding: '0.5rem 0', color: '#555', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-check-circle" style={{ color: '#F9C74F', fontSize: '0.8rem' }}></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button style={{
                  marginTop: '1rem',
                  background: '#F9C74F',
                  border: 'none',
                  padding: '0.7rem 1.5rem',
                  borderRadius: '50px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%'
                }}>
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Projects Section */}
      <div style={{ background: '#f9fbf7', padding: '4rem 2rem' }}>
        <h2 data-aos="fade-up" style={{ textAlign: 'center', marginBottom: '2rem', color: '#0B3B2F' }}>Featured Projects</h2>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {displayedProjects.map((project, idx) => (
              <div key={idx} data-aos="zoom-in" data-aos-delay={idx * 100} style={{ 
                background: 'white', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <img src={project.img} alt={project.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '1rem' }}>
                  <h4 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>{project.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#666' }}>{project.description}</p>
                  <span style={{
                    display: 'inline-block',
                    marginTop: '0.8rem',
                    fontSize: '0.7rem',
                    background: 'rgba(249,199,79,0.1)',
                    color: '#F9C74F',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px'
                  }}>
                    {project.cat === 'leadership' ? 'Leadership' : 'Environment'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button - Same style as Hero button */}
          {hasMore && (
            <div style={{
              textAlign: 'center',
              marginTop: '1rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center'
              }}>
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
                    width: 'auto',
                    minWidth: '180px',
                    color: isLoading ? 'white' : '#1a3a2a',
                    opacity: isLoading ? 0.7 : 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.8rem'
                  }}
                >
                  <span>
                    {isLoading ? 'Loading...' : 'View More Projects'}
                  </span>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {isLoading ? (
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                      }} />
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
            </div>
          )}

          {/* Show all message when no more items */}
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

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounceArrow {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5px);
          }
        }
        
        @media (max-width: 768px) {
          .btn-view-more {
            min-width: 160px !important;
            padding: 0.7rem 1.5rem !important;
          }
          
          .btn-view-more span {
            font-size: 0.85rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .btn-view-more {
            min-width: 140px !important;
            padding: 0.6rem 1.2rem !important;
          }
          
          .btn-view-more span {
            font-size: 0.8rem !important;
          }
          
          .fa-arrow-right {
            font-size: 0.8rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Programs;