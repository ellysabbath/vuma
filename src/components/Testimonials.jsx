import React, { useState, useEffect, useRef } from 'react';

const Testimonials = () => {
  const testimonials = [
    { 
      id: 1,
      text: "VUMA turned my green startup idea into a funded project. Most impactful youth hub in Tanzania.",
      author: "Neema J.",
      role: "Innovator",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 5,
      date: "March 2026"
    },
    { 
      id: 2,
      text: "The leadership workshops gave me tools to mobilize 100+ students for climate action.",
      author: "David M.",
      role: "Volunteer Leader",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      date: "February 2026"
    },
    { 
      id: 3,
      text: "Partnering with VUMA aligns with the Vice President's Office goal of youth empowerment.",
      author: "Government Rep.",
      role: "Ministry of Youth",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 5,
      date: "January 2026"
    },
    { 
      id: 4,
      text: "The skills I gained from VUMA's programs helped me start my own environmental initiative.",
      author: "Sarah K.",
      role: "Youth Leader",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      rating: 5,
      date: "December 2025"
    },
    { 
      id: 5,
      text: "VUMA is transforming youth engagement in climate action across Tanzania.",
      author: "John M.",
      role: "Climate Activist",
      image: "https://randomuser.me/api/portraits/men/68.jpg",
      rating: 5,
      date: "November 2025"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const sectionRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const autoScrollRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Auto-scroll from right to left
  useEffect(() => {
    if (isPlaying) {
      autoScrollRef.current = setInterval(() => {
        next();
      }, 4000);
    }
    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [currentIndex, isPlaying]);

  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
    // Reset auto-scroll timer
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = setInterval(() => {
        next();
      }, 4000);
    }
  };

  const toggleAutoScroll = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      autoScrollRef.current = setInterval(() => {
        next();
      }, 4000);
    } else {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    }
  };

  // Touch events for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
    setTouchStart(null);
  };

  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    setIsPlaying(false);
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsPlaying(true);
    autoScrollRef.current = setInterval(() => {
      next();
    }, 4000);
  };

  // Create doubled array for seamless infinite scroll
  const infiniteTestimonials = [...testimonials, ...testimonials];

  return (
    <div ref={sectionRef} style={{
      padding: '3rem 1rem',
      background: 'linear-gradient(135deg, #f9fbf7 0%, #f0f5ee 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(249,199,79,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        animation: 'float 12s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-10%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(11,59,47,0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        animation: 'float 10s ease-in-out infinite reverse'
      }} />

      {/* Section Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.6s ease'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(249,199,79,0.15)',
          padding: '0.3rem 1rem',
          borderRadius: '50px',
          marginBottom: '0.8rem'
        }}>
          <span style={{ color: '#F9C74F', fontWeight: 600, fontSize: '0.75rem' }}>
            <i className="fas fa-star" style={{ marginRight: '0.5rem' }}></i>
            TESTIMONIALS
          </span>
        </div>
        <h2 className="section-title" style={{
          fontSize: 'clamp(1.6rem, 5vw, 2rem)',
          fontWeight: 800,
          margin: 0,
          background: 'linear-gradient(135deg, #0B3B2F, #2b7a5c)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        }}>
          What Our Community Says
        </h2>
        <p style={{
          fontSize: '0.85rem',
          color: '#666',
          marginTop: '0.5rem'
        }}>
          Real stories from real change-makers
        </p>
      </div>

      {/* Testimonial Carousel */}
      <div 
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
          padding: '0 2rem'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Auto-scroll Indicator */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 10
        }}>
          <span style={{ fontSize: '0.7rem', color: '#666' }}>
            {isPlaying ? 'Auto-scrolling' : 'Paused'}
          </span>
          <button
            onClick={toggleAutoScroll}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              border: '1px solid rgba(0,0,0,0.1)',
              background: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`} style={{ fontSize: '0.7rem', color: '#0B3B2F' }}></i>
          </button>
        </div>

        {/* Main Card Container */}
        <div
          style={{
            background: 'white',
            borderRadius: '32px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            position: 'relative',
            minHeight: '380px'
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Animated Content - Right to Left */}
          <div
            style={{
              display: 'flex',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: `translateX(-${currentIndex * 100}%)`
            }}
          >
            {infiniteTestimonials.map((testimonial, idx) => (
              <div
                key={`${testimonial.id}-${idx}`}
                style={{
                  minWidth: '100%',
                  padding: '2rem',
                  position: 'relative'
                }}
              >
                {/* Quote Icon */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  opacity: 0.1,
                  fontSize: '4rem',
                  color: '#0B3B2F'
                }}>
                  <i className="fas fa-quote-left"></i>
                </div>
                
                {/* Profile Image and Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid #F9C74F',
                    marginBottom: '1rem',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                  }}>
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  
                  {/* Rating Stars */}
                  <div style={{
                    display: 'flex',
                    gap: '0.2rem',
                    marginBottom: '0.5rem'
                  }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star" style={{ color: '#F9C74F', fontSize: '0.8rem' }}></i>
                    ))}
                  </div>
                </div>

                {/* Testimonial Text */}
                <p style={{
                  fontSize: 'clamp(0.9rem, 4vw, 1rem)',
                  lineHeight: '1.6',
                  color: '#444',
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  fontStyle: 'italic',
                  position: 'relative',
                  zIndex: 1
                }}>
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#0B3B2F',
                    marginBottom: '0.2rem'
                  }}>
                    {testimonial.author}
                  </h4>
                  <p style={{
                    fontSize: '0.8rem',
                    color: '#F9C74F',
                    fontWeight: 600,
                    marginBottom: '0.3rem'
                  }}>
                    {testimonial.role}
                  </p>
                  <p style={{
                    fontSize: '0.7rem',
                    color: '#999'
                  }}>
                    <i className="fas fa-calendar-alt" style={{ marginRight: '0.3rem' }}></i>
                    {testimonial.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prev}
          style={{
            position: 'absolute',
            top: '50%',
            left: '-10px',
            transform: 'translateY(-50%)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'white',
            border: '1px solid rgba(0,0,0,0.1)',
            color: '#0B3B2F',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
            zIndex: 2
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#F9C74F';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <button
          onClick={next}
          style={{
            position: 'absolute',
            top: '50%',
            right: '-10px',
            transform: 'translateY(-50%)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'white',
            border: '1px solid rgba(0,0,0,0.1)',
            color: '#0B3B2F',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
            zIndex: 2
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#F9C74F';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <i className="fas fa-chevron-right"></i>
        </button>

        {/* Dots Indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '1.5rem'
        }}>
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              style={{
                width: currentIndex % testimonials.length === idx ? '30px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: currentIndex % testimonials.length === idx ? '#F9C74F' : 'rgba(0,0,0,0.2)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Auto-scroll Progress Bar */}
        <div style={{
          width: '100%',
          height: '3px',
          background: 'rgba(0,0,0,0.05)',
          borderRadius: '2px',
          marginTop: '1rem',
          overflow: 'hidden'
        }}>
          <div
            style={{
              width: isPlaying ? '100%' : '0%',
              height: '100%',
              background: 'linear-gradient(90deg, #F9C74F, #f6b83e)',
              borderRadius: '2px',
              transition: isPlaying ? 'width 4s linear' : 'none'
            }}
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{
        maxWidth: '800px',
        margin: '2rem auto 0',
        padding: '1rem',
        background: 'rgba(255,255,255,0.8)',
        borderRadius: '20px',
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: '1rem',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F9C74F' }}>100+</div>
          <div style={{ fontSize: '0.7rem', color: '#666' }}>Happy Participants</div>
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F9C74F' }}>50+</div>
          <div style={{ fontSize: '0.7rem', color: '#666' }}>Success Stories</div>
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F9C74F' }}>4.9</div>
          <div style={{ fontSize: '0.7rem', color: '#666' }}>Average Rating</div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(15px, -15px);
          }
          50% {
            transform: translate(-10px, 20px);
          }
          75% {
            transform: translate(10px, -10px);
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
        
        @keyframes progressBar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        
        @media (max-width: 768px) {
          .testimonial-section {
            padding: 2rem 0.5rem;
          }
          
          .carousel-container {
            padding: 0 0.5rem;
          }
          
          button {
            width: 35px !important;
            height: 35px !important;
          }
          
          button:first-of-type {
            left: -5px !important;
          }
          
          button:last-of-type {
            right: -5px !important;
          }
        }
        
        @media (max-width: 480px) {
          .testimonial-card {
            padding: 1rem !important;
          }
          
          .stats-bar {
            margin-top: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Testimonials;