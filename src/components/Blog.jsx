import React, { useState, useEffect, useRef } from 'react';
import { blogPosts } from '../data';

const Blog = () => {
  const [visibleCount, setVisibleCount] = useState(3); // Show first 3 blog posts initially
  const [isLoading, setIsLoading] = useState(false);
  const [isViewMoreHovered, setIsViewMoreHovered] = useState(false);

  const displayedPosts = blogPosts.slice(0, visibleCount);
  const hasMore = visibleCount < blogPosts.length;

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 2, blogPosts.length));
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      <h2 className="section-title" style={{
        textAlign: 'center',
        fontSize: 'clamp(1.5rem, 5vw, 2rem)',
        fontWeight: 800,
        margin: '2rem 0 1rem',
        background: 'linear-gradient(135deg, #0B3B2F, #2b7a5c)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        animation: 'fadeInDown 0.8s ease',
        padding: '0 1rem'
      }}>
        News & Stories
      </h2>
      
      <div className="blog-grid" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1.5rem',
        padding: '1rem'
      }}>
        {displayedPosts.map((post, idx) => (
          <BlogCard key={idx} post={post} index={idx} />
        ))}
      </div>

      {/* View More Button - Same style as Hero and Forms */}
      {hasMore && (
        <div style={{
          textAlign: 'center',
          marginTop: '2.5rem',
          marginBottom: '2rem',
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <button 
              className="btn-view-more"
              onClick={loadMore}
              disabled={isLoading}
              onMouseEnter={() => setIsViewMoreHovered(true)}
              onMouseLeave={() => setIsViewMoreHovered(false)}
              style={{
                background: isLoading ? '#0B3B2F' : '#F9C74F',
                border: 'none',
                padding: '0.7rem 1.5rem',
                borderRadius: '60px',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontSize: 'clamp(0.8rem, 3.5vw, 1rem)',
                width: '50%',
                minWidth: '160px',
                color: isLoading ? 'white' : '#1a3a2a',
                opacity: isLoading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.8rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <span style={{
                transition: 'transform 0.3s ease'
              }}>
                {isLoading ? 'Loading...' : 'View More Stories'}
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
      {!hasMore && blogPosts.length > 3 && (
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          marginBottom: '2rem',
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
          You've seen all {blogPosts.length} amazing stories!
        </div>
      )}

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }
        
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
            min-width: 140px !important;
            padding: 0.6rem 1.2rem !important;
          }
          
          .btn-view-more span {
            font-size: 0.85rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .btn-view-more {
            min-width: 120px !important;
            padding: 0.5rem 1rem !important;
          }
          
          .btn-view-more span {
            font-size: 0.75rem !important;
          }
          
          .fa-arrow-right {
            font-size: 0.7rem !important;
          }
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .btn-view-more {
            -webkit-tap-highlight-color: transparent;
          }
          
          .btn-view-more:active {
            transform: scale(0.98) !important;
          }
          
          .fa-arrow-right {
            animation: bounceArrow 1.5s ease-in-out infinite !important;
          }
        }
      `}</style>
    </>
  );
};

// Separate component for blog card with scroll animation
const BlogCard = ({ post, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);

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

  // Preload image
  useEffect(() => {
    const img = new Image();
    img.src = post.img;
    img.onload = () => setImageLoaded(true);
  }, [post.img]);

  // Different animation styles based on index
  const getAnimationStyle = () => {
    if (!isVisible) {
      const animations = ['fadeInUp', 'zoomIn', 'slideInLeft', 'slideInRight'];
      const animationIndex = index % animations.length;
      switch (animations[animationIndex]) {
        case 'fadeInUp':
          return { animation: 'fadeInUp 0.6s ease forwards' };
        case 'zoomIn':
          return { animation: 'zoomIn 0.6s ease forwards' };
        case 'slideInLeft':
          return { animation: 'slideInLeft 0.6s ease forwards' };
        case 'slideInRight':
          return { animation: 'slideInRight 0.6s ease forwards' };
        default:
          return { animation: 'fadeInUp 0.6s ease forwards' };
      }
    }
    return { animation: 'none' };
  };

  return (
    <div
      ref={cardRef}
      className="blog-card"
      style={{
        width: '280px',
        background: 'white',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 12px 25px rgba(0,0,0,0.05)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
        ...getAnimationStyle()
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
      {/* Image Container with Zoom Effect */}
      <div
        style={{
          height: '180px',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#f0f0f0'
        }}
      >
        {/* Skeleton Loader */}
        {!imageLoaded && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite'
            }}
          />
        )}
        
        <img
          src={post.img}
          alt={post.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'scale(1)',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease, transform 0.5s ease'
          }}
          className="blog-image"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Date Badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(11, 59, 47, 0.9)',
            color: '#F9C74F',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            backdropFilter: 'blur(4px)',
            zIndex: 1,
            transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
            transition: `transform 0.4s ease ${index * 0.1 + 0.2}s`
          }}
        >
          <i className="fas fa-calendar-alt" style={{ marginRight: '4px', fontSize: '0.6rem' }}></i>
          {post.date.split(' ')[0]}
        </div>
        
        {/* Category Tag */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: '#F9C74F',
            color: '#0B3B2F',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.65rem',
            fontWeight: 'bold',
            zIndex: 1,
            transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
            transition: `transform 0.4s ease ${index * 0.1 + 0.3}s`
          }}
        >
          <i className="fas fa-newspaper" style={{ marginRight: '4px' }}></i>
          LATEST NEWS
        </div>
      </div>
      
      {/* Content Section */}
      <div
        style={{
          padding: '1.2rem',
          background: 'white',
          position: 'relative'
        }}
      >
        {/* Meta Information */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            marginBottom: '0.8rem',
            fontSize: '0.7rem',
            color: '#666',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <i className="far fa-calendar" style={{ color: '#F9C74F' }}></i>
            {post.date}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <i className="far fa-clock" style={{ color: '#F9C74F' }}></i>
            {post.readTime}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <i className="far fa-eye" style={{ color: '#F9C74F' }}></i>
            {Math.floor(Math.random() * 500) + 100} views
          </span>
        </div>
        
        {/* Title */}
        <h4
          style={{
            marginTop: '0',
            marginBottom: '0.8rem',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#0B3B2F',
            lineHeight: '1.4',
            transition: 'color 0.3s ease'
          }}
          className="blog-title"
        >
          {post.title}
        </h4>
        
        {/* Excerpt (simulated) */}
        <p
          style={{
            fontSize: '0.8rem',
            color: '#666',
            lineHeight: '1.5',
            marginBottom: '1rem'
          }}
        >
          Discover how VUMA Tanzania is making a difference in youth innovation and climate action...
        </p>
        
        {/* Read More Link */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #f0f0f0',
            paddingTop: '0.8rem'
          }}
        >
          <a
            href="#"
            style={{
              color: '#0B3B2F',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease'
            }}
            className="read-more-link"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#F9C74F';
              e.currentTarget.style.gap = '10px';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#0B3B2F';
              e.currentTarget.style.gap = '6px';
            }}
          >
            Read More
            <i className="fas fa-arrow-right" style={{ fontSize: '0.7rem', transition: 'transform 0.3s ease' }}></i>
          </a>
          
          {/* Share Icon */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem'
            }}
          >
            <i
              className="fab fa-facebook"
              style={{
                color: '#666',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1877f2'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
              onClick={() => alert('Share on Facebook')}
            ></i>
            <i
              className="fab fa-twitter"
              style={{
                color: '#666',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1da1f2'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
              onClick={() => alert('Share on Twitter')}
            ></i>
            <i
              className="fab fa-linkedin"
              style={{
                color: '#666',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0077b5'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
              onClick={() => alert('Share on LinkedIn')}
            ></i>
          </div>
        </div>
      </div>
      
      <style>{`
        .blog-card {
          position: relative;
          overflow: hidden;
        }
        
        .blog-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(249,199,79,0.1), transparent);
          transition: left 0.5s ease;
          z-index: 1;
          pointer-events: none;
        }
        
        .blog-card:hover::before {
          left: 100%;
        }
        
        .blog-image {
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .blog-card:hover .blog-image {
          transform: scale(1.1);
        }
        
        .blog-title:hover {
          color: #F9C74F !important;
        }
        
        .read-more-link i {
          transition: transform 0.3s ease;
        }
        
        .read-more-link:hover i {
          transform: translateX(4px);
        }
        
        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .blog-card {
            width: calc(50% - 0.75rem) !important;
            min-width: 160px;
          }
          
          .blog-card:hover {
            transform: translateY(-4px) !important;
          }
          
          .blog-card div:first-child {
            height: 150px !important;
          }
          
          .blog-card h4 {
            font-size: 0.9rem !important;
            margin-bottom: 0.5rem !important;
          }
          
          .blog-card p {
            font-size: 0.7rem !important;
            margin-bottom: 0.8rem !important;
          }
          
          .blog-card .read-more-link {
            font-size: 0.75rem !important;
          }
          
          .blog-card .meta-info {
            font-size: 0.6rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .blog-card {
            width: 100% !important;
            max-width: 320px;
            margin: 0 auto;
          }
          
          .blog-card div:first-child {
            height: 200px !important;
          }
          
          .blog-card h4 {
            font-size: 1rem !important;
          }
          
          .blog-card p {
            fontSize: 0.8rem !important;
          }
          
          /* Improve touch targets on mobile */
          .read-more-link,
          .share-icon {
            padding: 4px 8px;
          }
        }
        
        /* Tablet optimization */
        @media (min-width: 769px) and (max-width: 1024px) {
          .blog-card {
            width: calc(33.33% - 1rem) !important;
          }
        }
        
        /* Reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .blog-card,
          .blog-image,
          .read-more-link i,
          .blog-card::before {
            transition: none !important;
            animation: none !important;
          }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .blog-card {
            background: #1a1a1a;
          }
          
          .blog-card h4 {
            color: #e0e0e0;
          }
          
          .blog-card p {
            color: #b0b0b0;
          }
          
          .blog-card .meta-info {
            color: #888;
          }
        }
      `}</style>
    </div>
  );
};

export default Blog;