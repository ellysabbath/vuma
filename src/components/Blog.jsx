import React, { useState, useEffect, useRef } from 'react';
import { blogPosts } from '../data';

const Blog = () => {
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewMoreHovered, setIsViewMoreHovered] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const displayedPosts = blogPosts.slice(0, visibleCount);
  const hasMore = visibleCount < blogPosts.length;

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 2, blogPosts.length));
      setIsLoading(false);
    }, 500);
  };

  const openModal = (post) => {
    setSelectedPost(post);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
    document.body.style.overflow = 'unset';
  };

  // Full content for each blog post
  const getFullContent = (title) => {
    const contents = {
      "VUMA Launches Green Innovation Fund": "The VUMA Green Innovation Fund is a groundbreaking initiative designed to support young innovators and entrepreneurs who are developing sustainable solutions to environmental challenges. The fund provides seed funding, mentorship, and technical support to selected projects that demonstrate potential for significant environmental impact. Successful applicants will receive up to $10,000 in funding, access to a network of industry experts, and comprehensive business development training. The fund focuses on areas such as renewable energy, waste management, sustainable agriculture, and water conservation. Applications are open until June 30, 2026. This initiative is made possible through partnerships with UNDP, UNEP, and various private sector partners who share our commitment to nurturing green innovation among Tanzanian youth.",
      
      "Leadership Summit 2026 Recap": "The VUMA Leadership Summit 2026 brought together over 500 young leaders from across Tanzania for three days of intensive training, networking, and inspiration. Held at the Julius Nyerere International Convention Centre in Dar es Salaam, the summit featured keynote speeches from prominent leaders, interactive workshops on essential leadership skills, and panel discussions on pressing national issues. Highlights included a fireside chat with the Minister of Youth, a pitch competition where 10 young entrepreneurs presented their innovative ideas, and a commitment ceremony where participants pledged to take action in their communities. The summit concluded with the announcement of the VUMA Fellowship Program, which will provide ongoing support to 50 exceptional young leaders.",
      
      "Partnering with UNDP for Climate Action": "VUMA Tanzania is proud to announce a strategic partnership with the United Nations Development Programme (UNDP) to accelerate climate action across Tanzania. This collaboration will focus on three key areas: youth-led climate initiatives, policy advocacy, and community-based adaptation projects. Through this partnership, VUMA will receive technical support and funding to expand its climate action programs, reaching an additional 10,000 young people over the next two years. Joint activities will include climate literacy workshops, tree planting campaigns, renewable energy projects, and advocacy for stronger climate policies."
    };
    return contents[title] || `${title} is an important initiative by VUMA Tanzania. This article provides detailed insights into our work and impact. Discover how we are making a difference in youth innovation and climate action across Tanzania.`;
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
          <BlogCard key={idx} post={post} index={idx} onCardClick={() => openModal(post)} />
        ))}
      </div>

      {/* View More Button - Loads more cards */}
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

      {/* Blog Post Modal */}
      {showModal && selectedPost && (
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
                src={selectedPost.img} 
                alt={selectedPost.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))' }} />
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', zIndex: 10 }}>
                <span style={{
                  display: 'inline-block',
                  background: '#F9C74F',
                  color: '#0B3B2F',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem'
                }}>
                  LATEST STORY
                </span>
                <h2 style={{ color: 'white', margin: 0, fontSize: 'clamp(1.3rem, 5vw, 1.8rem)' }}>{selectedPost.title}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 'clamp(1.5rem, 5vw, 2rem)' }}>
              {/* Meta Information */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                  <i className="far fa-calendar-alt" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                  {selectedPost.date}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                  <i className="far fa-clock" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                  {selectedPost.readTime}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                  <i className="far fa-eye" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                  {Math.floor(Math.random() * 500) + 100} views
                </span>
              </div>

              {/* Full Content */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem' }}>
                  <i className="fas fa-info-circle" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  Full Story
                </h3>
                <p style={{ color: '#555', lineHeight: '1.8', fontSize: '0.95rem' }}>
                  {getFullContent(selectedPost.title)}
                </p>
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
                  onClick={() => alert(`Subscribe to our newsletter for more updates!`)}
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
                  <i className="fas fa-envelope"></i>
                  Subscribe for Updates
                </button>
              </div>
            </div>
          </div>
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
          .btn-view-more {
            min-width: 140px !important;
            padding: 0.6rem 1.2rem !important;
          }
          
          .btn-view-more span {
            font-size: 0.85rem !important;
          }
          
          .modal-content {
            max-height: 90vh;
          }
          
          .modal-content > div:first-child {
            height: 180px;
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
          
          .modal-content {
            border-radius: 20px !important;
          }
        }
      `}</style>
    </>
  );
};

// Blog Card Component
const BlogCard = ({ post, index, onCardClick }) => {
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

  useEffect(() => {
    const img = new Image();
    img.src = post.img;
    img.onload = () => setImageLoaded(true);
  }, [post.img]);

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
      onClick={() => onCardClick(post)}
    >
      <div style={{
        height: '180px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f0f0f0'
      }}>
        {!imageLoaded && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} />
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
            opacity: imageLoaded ? 1 : 0
          }}
          className="blog-image"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        
        <div style={{
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
        }}>
          <i className="fas fa-calendar-alt" style={{ marginRight: '4px', fontSize: '0.6rem' }}></i>
          {post.date.split(' ')[0]}
        </div>
        
        <div style={{
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
        }}>
          <i className="fas fa-newspaper" style={{ marginRight: '4px' }}></i>
          LATEST NEWS
        </div>
      </div>
      
      <div style={{ padding: '1.2rem', background: 'white', position: 'relative' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          marginBottom: '0.8rem',
          fontSize: '0.7rem',
          color: '#666',
          flexWrap: 'wrap'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <i className="far fa-calendar" style={{ color: '#F9C74F' }}></i>
            {post.date}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <i className="far fa-clock" style={{ color: '#F9C74F' }}></i>
            {post.readTime}
          </span>
        </div>
        
        <h4 style={{
          marginTop: '0',
          marginBottom: '0.8rem',
          fontSize: '1.1rem',
          fontWeight: 700,
          color: '#0B3B2F',
          lineHeight: '1.4',
          transition: 'color 0.3s ease'
        }}
        className="blog-title">
          {post.title}
        </h4>
        
        <p style={{
          fontSize: '0.8rem',
          color: '#666',
          lineHeight: '1.5',
          marginBottom: '1rem'
        }}>
          Discover how VUMA Tanzania is making a difference in youth innovation and climate action...
        </p>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #f0f0f0',
          paddingTop: '0.8rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#F9C74F',
            fontSize: '0.8rem',
            fontWeight: 600
          }}>
            <i className="fas fa-eye"></i>
            <span>Click to read full story</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
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
          }
          
          .blog-card p {
            font-size: 0.7rem !important;
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
        }
      `}</style>
    </div>
  );
};

export default Blog;