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
      backgroundAttachment: 'scroll',
      transition: 'all 0.3s ease',
      padding: '80px 1rem 60px'
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
          Vijana. Uongozi. Ubunifu. Mazingira
        </h1>
        
        <p style={{ 
          fontSize: 'clamp(0.9rem, 4vw, 1.2rem)', 
          marginBottom: '1.5rem',
          animation: 'slideInUp 0.8s ease 0.2s',
          opacity: 0.95,
          padding: '0 0.5rem'
        }}>
          Empowering Youth, Strengthening Communities, Creating Sustainable Impact
        </p>
        
        <p style={{
          fontSize: 'clamp(0.8rem, 3.5vw, 1rem)',
          marginBottom: '2rem',
          animation: 'slideInUp 0.8s ease 0.3s',
          opacity: 0.9,
          padding: '0 0.5rem',
          lineHeight: '1.6'
        }}>
          VUMA Tanzania is a youth-led non-governmental organization dedicated
          to empowering young people and communities through leadership, innovation, environmental action
          and sustainable community development across Tanzania. Registered in the United Republic of
          Tanzania as Non-Governmental Organization
          <strong style={{ color: '#F9C74F', display: 'inline-block' }}> (Reg. No. 00NGO/R/9522)</strong>.
        </p>

        <h2 style={{
          fontSize: 'clamp(1.2rem, 5vw, 2rem)',
          fontWeight: 700,
          marginBottom: '1rem',
          animation: 'slideInUp 0.8s ease 0.4s',
          color: '#F9C74F'
        }}>
          Why We Exist?
        </h2>
        
        <p style={{
          fontSize: 'clamp(0.9rem, 4vw, 1.2rem)',
          marginBottom: '2rem',
          animation: 'slideInUp 0.8s ease 0.4s',
          opacity: 0.9,
          padding: '0 0.5rem',
          lineHeight: '1.6'
        }}>
          VUMA Tanzania was established to create opportunities for young people
          to lead positive change in their communities through education, innovation, volunteerism and social impact initiatives.
          We believe in the power of youth to drive sustainable development and build a better future for Tanzania.
        </p>

        <h2 style={{
          fontSize: 'clamp(1.2rem, 5vw, 2rem)',
          fontWeight: 700,
          marginBottom: '1rem',
          animation: 'slideInUp 0.8s ease 0.5s',
          color: '#F9C74F'
        }}>
          Who We Support?
        </h2>
        
        <p style={{
          fontSize: 'clamp(0.9rem, 4vw, 1.2rem)',
          marginBottom: '1rem',
          animation: 'slideInUp 0.8s ease 0.5s',
          opacity: 0.9,
          fontWeight: 600
        }}>
          We work with:
        </p>
        
        {/* Styled List */}
        <div style={{
          textAlign: 'left',
          maxWidth: '600px',
          margin: '0 auto 2rem auto',
          animation: 'slideInUp 0.8s ease 0.5s'
        }}>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {[
              'Young People and youth groups',
              'Local communities',
              'Women and children',
              'Community innovators and volunteers',
              'Educational institutions and youth organizations',
              'Environmental and social impact initiatives Across Tanzania'
            ].map((item, index) => (
              <li key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(5px)',
                transition: 'transform 0.3s ease, background 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(8px)';
                e.currentTarget.style.background = 'rgba(249,199,79,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}>
                <i className="fas fa-check-circle" style={{
                  color: '#F9C74F',
                  fontSize: '1rem',
                  minWidth: '20px'
                }}></i>
                <span style={{
                  fontSize: 'clamp(0.8rem, 3.5vw, 0.9rem)',
                  lineHeight: '1.4'
                }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div style={{
          animation: 'slideInUp 0.8s ease 0.6s',
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
          
          ul li {
            margin-bottom: 8px !important;
            padding: 6px 10px !important;
          }
          
          ul li span {
            font-size: 0.75rem !important;
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
          
          ul li {
            padding: 5px 8px !important;
          }
          
          ul li i {
            font-size: 0.8rem !important;
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