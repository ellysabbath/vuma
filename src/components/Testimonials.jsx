import React, { useState, useEffect, useRef } from 'react';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const sectionRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const autoScrollRef = useRef(null);

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  // Fetch testimonials from API
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/testimonials/`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      // Handle both array response and object-wrapped response
      const testimonialsArray = Array.isArray(data) ? data : (data.data || data.results || []);
      setTestimonials(testimonialsArray);
      setError(null);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError('Failed to load testimonials. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
    if (isPlaying && testimonials.length > 0) {
      autoScrollRef.current = setInterval(() => {
        next();
      }, 4000);
    }
    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [currentIndex, isPlaying, testimonials.length]);

  const next = () => {
    if (isAnimating || testimonials.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prev = () => {
    if (isAnimating || testimonials.length === 0) return;
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

  // Get initials for avatar
  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  // Get random color for avatar based on name
  const getAvatarColor = (name) => {
    const colors = [
      '#0B3B2F', '#F9C74F', '#2b7a5c', '#2196F3', '#9C27B0', 
      '#FF9800', '#4caf50', '#d32f2f', '#00BCD4', '#795548'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // Create doubled array for seamless infinite scroll
  const infiniteTestimonials = testimonials.length > 0 ? [...testimonials, ...testimonials] : [];

  if (loading) {
    return (
      <div ref={sectionRef} style={{
        padding: '3rem 1rem',
        background: 'linear-gradient(135deg, #f9fbf7 0%, #f0f5ee 100%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
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
          <p style={{ color: '#666' }}>Loading testimonials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div ref={sectionRef} style={{
        padding: '3rem 1rem',
        background: 'linear-gradient(135deg, #f9fbf7 0%, #f0f5ee 100%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#d32f2f', marginBottom: '1rem' }}></i>
          <p style={{ color: '#666' }}>{error}</p>
          <button 
            onClick={fetchTestimonials}
            style={{
              marginTop: '1rem',
              background: '#0B3B2F',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-sync-alt"></i> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div ref={sectionRef} style={{
        padding: '3rem 1rem',
        background: 'linear-gradient(135deg, #f9fbf7 0%, #f0f5ee 100%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-comment-dots" style={{ fontSize: '3rem', color: '#F9C74F', marginBottom: '1rem' }}></i>
          <p style={{ color: '#666' }}>No testimonials yet. Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} style={{
      padding: '3rem 1rem',
      background: 'linear-gradient(135deg, #f9fbf7 0%, #f0f5ee 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(15px, -15px); }
          50% { transform: translate(-10px, 20px); }
          75% { transform: translate(10px, -10px); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 10px 25px rgba(11,59,47,0.2); transform: scale(1); }
          50% { box-shadow: 0 15px 35px rgba(249,199,79,0.4); transform: scale(1.05); }
        }
        
        @keyframes starPop {
          0% { opacity: 0; transform: scale(0); }
          80% { transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes textReveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -10px) rotate(5deg); }
          50% { transform: translate(-5px, 15px) rotate(-3deg); }
          75% { transform: translate(5px, -5px) rotate(2deg); }
        }
        
        @keyframes borderGlow {
          0%, 100% { border-color: #F9C74F; }
          50% { border-color: #0B3B2F; }
        }
        
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .shimmer-text {
          background: linear-gradient(90deg, #0B3B2F 25%, #F9C74F 50%, #0B3B2F 75%);
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

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
      
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            background: `rgba(249,199,79,${Math.random() * 0.1 + 0.05})`,
            borderRadius: '50%',
            pointerEvents: 'none',
            animation: `floatParticle ${Math.random() * 10 + 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}

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
          marginBottom: '0.8rem',
          animation: isVisible ? 'bounceIn 0.6s ease' : 'none'
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
            minHeight: '400px'
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
                
                {/* Quote Icon Right */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  opacity: 0.1,
                  fontSize: '4rem',
                  color: '#0B3B2F',
                  transform: 'rotate(180deg)'
                }}>
                  <i className="fas fa-quote-right"></i>
                </div>
                
                {/* Avatar with Initials - No Image */}
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
                    background: `linear-gradient(135deg, ${getAvatarColor(testimonial.author)}, ${getAvatarColor(testimonial.author)}aa)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    boxShadow: '0 10px 25px rgba(11,59,47,0.2)',
                    animation: 'pulseGlow 2s ease-in-out infinite',
                    position: 'relative',
                    border: '3px solid #F9C74F'
                  }}>
                    <span style={{
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      color: 'white',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                    }}>
                      {getInitials(testimonial.author)}
                    </span>
                  </div>
                  
                  {/* Rating Stars with animation */}
                  <div style={{
                    display: 'flex',
                    gap: '0.3rem',
                    marginBottom: '0.5rem'
                  }}>
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <i key={i} className="fas fa-star" style={{ 
                        color: '#F9C74F', 
                        fontSize: '0.9rem',
                        animation: `starPop 0.3s ease ${i * 0.1}s both`
                      }}></i>
                    ))}
                  </div>
                </div>

                {/* Testimonial Text with fade-in animation */}
                <p style={{
                  fontSize: 'clamp(0.9rem, 4vw, 1rem)',
                  lineHeight: '1.6',
                  color: '#444',
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  fontStyle: 'italic',
                  position: 'relative',
                  zIndex: 1,
                  animation: 'textReveal 0.6s ease'
                }}>
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div style={{ textAlign: 'center', opacity: 0, animation: 'slideUp 0.5s ease 0.2s forwards' }}>
                  <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '0.2rem',
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #0B3B2F, #2b7a5c)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}>
                    {testimonial.author}
                  </h4>
                  {testimonial.role && (
                    <p style={{
                      fontSize: '0.8rem',
                      color: '#F9C74F',
                      fontWeight: 600,
                      marginBottom: '0.3rem'
                    }}>
                      <i className="fas fa-briefcase" style={{ marginRight: '0.3rem', fontSize: '0.7rem' }}></i>
                      {testimonial.role}
                    </p>
                  )}
                  {testimonial.date && (
                    <p style={{
                      fontSize: '0.7rem',
                      color: '#999'
                    }}>
                      <i className="fas fa-calendar-alt" style={{ marginRight: '0.3rem' }}></i>
                      {testimonial.date}
                    </p>
                  )}
                </div>

                {/* Decorative Line at Bottom */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #F9C74F, #0B3B2F, #F9C74F, transparent)',
                  borderRadius: '2px'
                }} />
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
              width: isPlaying && testimonials.length > 0 ? '100%' : '0%',
              height: '100%',
              background: 'linear-gradient(90deg, #F9C74F, #f6b83e)',
              borderRadius: '2px',
              transition: isPlaying ? 'width 4s linear' : 'none'
            }}
          />
        </div>
      </div>

      {/* Stats Bar - Static or can be fetched from API */}
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
        textAlign: 'center',
        animation: isVisible ? 'slideUp 0.6s ease 0.4s both' : 'none'
      }}>
        <div style={{ 
          transform: 'scale(1)', 
          transition: 'transform 0.3s ease', 
          cursor: 'default' 
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 800, 
            color: '#F9C74F'
          }}>{testimonials.length}+</div>
          <div style={{ fontSize: '0.7rem', color: '#666' }}>Happy Clients</div>
        </div>
        <div style={{ 
          transform: 'scale(1)', 
          transition: 'transform 0.3s ease', 
          cursor: 'default' 
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 800, 
            color: '#F9C74F'
          }}>
            {Math.round(testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length * 10) / 10}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#666' }}>Average Rating</div>
        </div>
        <div style={{ 
          transform: 'scale(1)', 
          transition: 'transform 0.3s ease', 
          cursor: 'default' 
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F9C74F' }}>
            {new Date().getFullYear()}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#666' }}>Active Year</div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;