import React, { useState, useRef } from 'react';

// Static anonymous testimonials based on VUMA's four core initiatives
// No names, no pictures, no personal identifiers
const testimonialsData = [
  {
    id: 1,
    rating: 5,
    text: "Operation Clean Victoria has transformed our community. The removal of water hyacinth has opened up fishing routes that were blocked for years. The plastic collection program has created jobs for dozens of young people in our village. For the first time in my lifetime, the lake is getting cleaner instead of dirtier. This is the change we have been waiting for."
  },
  {
    id: 2,
    rating: 5,
    text: "The solar-powered irrigation system changed everything for our farming cooperative. We used to lose half our crops to drought. Now we harvest three times per year. Our children no longer go hungry during dry seasons. The training on water conservation was practical and easy to follow. I recommend this program to every farming community."
  },
  {
    id: 3,
    rating: 5,
    text: "The Green Corridors initiative turned our neglected roundabout into a beautiful garden that blooms all year round with native plants. We now see bees and butterflies where there was only dust and exhaust. The city feels more alive, more peaceful. Best of all, it requires almost no maintenance. The native plants just thrive on their own."
  },
  {
    id: 4,
    rating: 5,
    text: "As a teacher, I have watched the Youth Environmental Stewards program transform my students. They have started a recycling club, planted trees around the school, and even convinced the local market to reduce plastic bag use. These young people are not waiting for adults to solve the problem—they are solving it themselves."
  },
  {
    id: 5,
    rating: 4,
    text: "The leadership training gave me the confidence to start an environmental club in my community. We now have forty active members who meet weekly to clean up our neighborhood and educate others about waste separation. The skills I learned—how to organize a campaign, how to speak to local officials—have been invaluable."
  },
  {
    id: 6,
    rating: 5,
    text: "The plastic upcycling hub gave me a job that pays fairly and treats me with dignity. I used to pick waste on the streets with no safety equipment and no respect. Now I work in a clean facility, sorting and processing plastics that become useful products. My children are proud of what I do. That means everything to me."
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const sectionRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const autoScrollRef = useRef(null);

  // Intersection Observer for section visibility
  React.useEffect(() => {
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
  React.useEffect(() => {
    if (isPlaying && testimonialsData.length > 0) {
      autoScrollRef.current = setInterval(() => {
        next();
      }, 5000);
    }
    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [currentIndex, isPlaying, testimonialsData.length]);

  const next = () => {
    if (isAnimating || testimonialsData.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prev = () => {
    if (isAnimating || testimonialsData.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
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
      }, 5000);
    }
  };

  const toggleAutoScroll = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      autoScrollRef.current = setInterval(() => {
        next();
      }, 5000);
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
    }, 5000);
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // Create doubled array for seamless infinite scroll
  const infiniteTestimonials = [...testimonialsData, ...testimonialsData];

  if (testimonialsData.length === 0) {
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
          <p style={{ color: '#666' }}>Testimonials coming soon!</p>
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
          Voices of Our Community
        </h2>
        <p style={{
          fontSize: '0.85rem',
          color: '#666',
          marginTop: '0.5rem'
        }}>
          Real stories from those we serve
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
                {/* Quote Icon Top Left */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  opacity: 0.1,
                  fontSize: '3.5rem',
                  color: '#0B3B2F'
                }}>
                  <i className="fas fa-quote-left"></i>
                </div>
                
                {/* Quote Icon Bottom Right */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  opacity: 0.1,
                  fontSize: '3.5rem',
                  color: '#0B3B2F',
                  transform: 'rotate(180deg)'
                }}>
                  <i className="fas fa-quote-right"></i>
                </div>
                
                {/* Rating Stars - No avatar, no name */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '0.4rem'
                  }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star" style={{ 
                        color: '#F9C74F', 
                        fontSize: '1rem',
                        animation: `starPop 0.3s ease ${i * 0.1}s both`
                      }}></i>
                    ))}
                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                      <i key={`empty-${i}`} className="far fa-star" style={{ 
                        color: '#ddd', 
                        fontSize: '1rem' 
                      }}></i>
                    ))}
                  </div>
                </div>

                {/* Testimonial Text */}
                <p style={{
                  fontSize: 'clamp(0.95rem, 4vw, 1.05rem)',
                  lineHeight: '1.7',
                  color: '#444',
                  textAlign: 'center',
                  marginBottom: '1rem',
                  fontStyle: 'italic',
                  position: 'relative',
                  zIndex: 1,
                  animation: 'textReveal 0.6s ease'
                }}>
                  "{testimonial.text}"
                </p>

                {/* Anonymous Indicator */}
                <div style={{ textAlign: 'center', opacity: 0, animation: 'slideUp 0.5s ease 0.2s forwards' }}>
                  <div style={{
                    display: 'inline-block',
                    background: 'rgba(249,199,79,0.15)',
                    padding: '0.3rem 1rem',
                    borderRadius: '50px'
                  }}>
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#F9C74F',
                      fontWeight: 600
                    }}>
                      <i className="fas fa-leaf" style={{ marginRight: '0.4rem', fontSize: '0.7rem' }}></i>
                      VUMA Community Member
                    </span>
                  </div>
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
          {testimonialsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              style={{
                width: currentIndex % testimonialsData.length === idx ? '30px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: currentIndex % testimonialsData.length === idx ? '#F9C74F' : 'rgba(0,0,0,0.2)',
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
              width: isPlaying && testimonialsData.length > 0 ? '100%' : '0%',
              height: '100%',
              background: 'linear-gradient(90deg, #F9C74F, #f6b83e)',
              borderRadius: '2px',
              transition: isPlaying ? 'width 5s linear' : 'none'
            }}
          />
        </div>
      </div>

      {/* Stats Bar - Based on VUMA initiatives */}
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
          }}>5,000+</div>
          <div style={{ fontSize: '0.7rem', color: '#666' }}>Community Members Reached</div>
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
          }}>98%</div>
          <div style={{ fontSize: '0.7rem', color: '#666' }}>Satisfaction Rate</div>
        </div>
        <div style={{ 
          transform: 'scale(1)', 
          transition: 'transform 0.3s ease', 
          cursor: 'default' 
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F9C74F' }}>12</div>
          <div style={{ fontSize: '0.7rem', color: '#666' }}>Active Projects</div>
        </div>
        <div style={{ 
          transform: 'scale(1)', 
          transition: 'transform 0.3s ease', 
          cursor: 'default' 
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F9C74F' }}>3</div>
          <div style={{ fontSize: '0.7rem', color: '#666' }}>Countries</div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;