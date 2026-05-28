import React, { useState, useEffect, useRef } from 'react';
import { projects } from '../data/projects';

const InnovationShowcase = () => {
  const [filter, setFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoading, setIsLoading] = useState(false);

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
          <ProjectCard key={idx} project={project} index={idx} />
        ))}
      </div>

      {/* Load More Button - Same style as Hero component */}
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
            onTouchStart={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
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

      {/* Show all message when no more items */}
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

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .masonry-grid {
            gap: 0.75rem !important;
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
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .btn-load-more {
            -webkit-tap-highlight-color: transparent;
          }
          
          .btn-load-more:active {
            transform: scale(0.98);
          }
        }
      `}</style>
    </div>
  );
};

const ProjectCard = ({ project, index }) => {
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
        
        <a
          href="#"
          style={{
            display: 'inline-block',
            marginTop: '12px',
            color: '#F9C74F',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#0B3B2F'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#F9C74F'}
        >
          Learn More →
        </a>
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