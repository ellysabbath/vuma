import React, { useState, useEffect } from 'react';
import eventdImg from '../assets/eventd.jpg'; // Import the image

const Hero = ({ onLoginClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Preload image
    const img = new Image();
    img.src = eventdImg;
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      height: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'white',
      background: `linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,40,30,0.75)), url(${eventdImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundAttachment: 'scroll', // Changed from 'fixed' for better mobile performance
      transition: 'all 0.3s ease',
      padding: '80px 1rem 60px' // Added padding for mobile
    }}>
      {/* Animated Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        background: 'radial-gradient(circle at 20% 40%, rgba(0,0,0,0.4), rgba(0,20,10,0.6))',
        animation: 'pulse 4s ease-in-out infinite'
      }}></div>
      
      {/* Loading Skeleton */}
      {!imageLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0a3b2e, #0c4d3a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(249,199,79,0.3)',
            borderTop: '3px solid #F9C74F',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}
      
      <div className="hero-content" data-aos="fade-up" data-aos-duration="1000" style={{ 
        maxWidth: '90%',
        width: '100%',
        padding: '1rem', 
        zIndex: 2,
        opacity: imageLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease',
        position: 'relative'
      }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 6vw, 3.2rem)',
          fontWeight: 800,
          marginBottom: '0.8rem',
          background: 'linear-gradient(135deg, #FFF9E6, #F9C74F)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          animation: 'slideInUp 0.8s ease',
          lineHeight: '1.2'
        }}>
          Empowering Youth. Igniting Innovation. Protecting Our Planet.
        </h1>
        <p style={{ 
          fontSize: 'clamp(0.9rem, 4vw, 1.2rem)', 
          marginBottom: '1.5rem',
          animation: 'slideInUp 0.8s ease 0.2s',
          opacity: 0.95,
          padding: '0 0.5rem'
        }}>
          Turning sustainable student ideas into community-scale solutions.
        </p>
        <div style={{
          animation: 'slideInUp 0.8s ease 0.4s',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: '0.8rem',
          flexWrap: 'wrap',
          padding: '0 0.5rem'
        }}>
          <button 
            className="btn-cta"
            onClick={() => document.getElementById('volunteer')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: '#F9C74F',
              border: 'none',
              padding: '0.7rem 1.5rem',
              borderRadius: '60px',
              fontWeight: 700,
              margin: '0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: 'clamp(0.8rem, 3.5vw, 1rem)',
              flex: '0 1 auto',
              minWidth: '140px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 5px 20px rgba(249,199,79,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Join Movement →
          </button>
          <button 
            className="btn-cta btn-outline-light"
            onClick={onLoginClick}
            style={{
              background: 'transparent',
              border: '2px solid #F9C74F',
              padding: '0.7rem 1.5rem',
              borderRadius: '60px',
              fontWeight: 700,
              margin: '0',
              cursor: 'pointer',
              color: 'white',
              transition: 'all 0.3s ease',
              fontSize: 'clamp(0.8rem, 3.5vw, 1rem)',
              flex: '0 1 auto',
              minWidth: '140px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <i className="fas fa-sign-in-alt"></i> Login
          </button>
        </div>
      </div>

      {/* Scroll Indicator - Hide on very small screens */}
      <div style={{
        position: 'absolute',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        animation: 'bounce 2s infinite',
        cursor: 'pointer',
        display: 'block',
        '@media (max-width: 480px)': {
          display: 'none'
        }
      }}
      onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
        <div style={{
          width: '26px',
          height: '42px',
          border: '2px solid white',
          borderRadius: '15px',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '3px',
            height: '8px',
            background: '#F9C74F',
            borderRadius: '2px',
            animation: 'scrollDown 1.5s infinite'
          }} />
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
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
        
        @keyframes bounce {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(10px);
          }
        }
        
        @keyframes scrollDown {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
        }
        
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .hero-content {
            max-width: 95% !important;
          }
          
          .hero-content h1 {
            font-size: 1.6rem !important;
            margin-bottom: 0.6rem !important;
          }
          
          .hero-content p {
            font-size: 0.85rem !important;
            margin-bottom: 1.2rem !important;
          }
          
          .btn-cta, .btn-outline-light {
            padding: 0.6rem 1.2rem !important;
            font-size: 0.85rem !important;
            min-width: 130px !important;
          }
        }
        
        @media (max-width: 480px) {
          .hero-content h1 {
            font-size: 1.3rem !important;
          }
          
          .hero-content p {
            font-size: 0.75rem !important;
          }
          
          .btn-cta, .btn-outline-light {
            padding: 0.5rem 1rem !important;
            font-size: 0.8rem !important;
            min-width: 120px !important;
          }
          
          .hero-content {
            padding: 0.5rem !important;
          }
          
          .scroll-indicator {
            display: none !important;
          }
        }
        
        /* Landscape mode on mobile */
        @media (max-width: 768px) and (orientation: landscape) {
          .hero-container {
            min-height: auto;
            padding: 60px 1rem 40px;
          }
          
          .hero-content h1 {
            font-size: 1.4rem !important;
          }
          
          .hero-content p {
            font-size: 0.8rem !important;
          }
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .btn-cta, .btn-outline-light {
            -webkit-tap-highlight-color: transparent;
          }
          
          .btn-cta:active, .btn-outline-light:active {
            transform: scale(0.98) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;