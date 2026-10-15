import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import eventdImg from '../assets/eventd.jpg';

// ==================== HERO SKELETON ====================
const HeroSkeleton = () => {
  const titleLines = [1];
  const paragraphLines = [1, 2, 3];
  const listItems = [1, 2, 3, 4, 5, 6];
  const buttons = [1, 2, 3];

  return (
    <div
      className="hero-content"
      style={{
        maxWidth: '90%',
        width: '100%',
        padding: '1rem',
        zIndex: 2,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Title */}
      {titleLines.map((i) => (
        <div
          key={`title-${i}`}
          className="skeleton-block"
          style={{
            height: 'clamp(1.5rem, 6vw, 3.2rem)',
            width: 'min(90%, 720px)',
            borderRadius: '12px',
            marginBottom: '0.8rem',
            animation: 'skeletonFadeIn 0.5s ease both'
          }}
        />
      ))}

      {/* Subtitle */}
      <div
        className="skeleton-block"
        style={{
          height: 'clamp(0.9rem, 4vw, 1.2rem)',
          width: 'min(80%, 560px)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          animation: 'skeletonFadeIn 0.5s ease 0.05s both'
        }}
      />

      {/* Paragraph */}
      <div style={{ width: 'min(85%, 640px)', marginBottom: '2rem' }}>
        {paragraphLines.map((i) => (
          <div
            key={`p-${i}`}
            className="skeleton-block"
            style={{
              height: 'clamp(0.7rem, 3vw, 0.9rem)',
              width: i === paragraphLines.length ? '60%' : '100%',
              borderRadius: '6px',
              marginBottom: '0.5rem',
              animation: `skeletonFadeIn 0.5s ease ${0.1 + i * 0.05}s both`
            }}
          />
        ))}
      </div>

      {/* Heading 1 */}
      <div
        className="skeleton-block"
        style={{
          height: 'clamp(1.2rem, 5vw, 2rem)',
          width: 'min(50%, 320px)',
          borderRadius: '10px',
          marginBottom: '1rem',
          animation: 'skeletonFadeIn 0.5s ease 0.3s both'
        }}
      />

      {/* Paragraph */}
      <div style={{ width: 'min(85%, 640px)', marginBottom: '2rem' }}>
        {paragraphLines.map((i) => (
          <div
            key={`p2-${i}`}
            className="skeleton-block"
            style={{
              height: 'clamp(0.7rem, 3vw, 0.9rem)',
              width: i === paragraphLines.length ? '50%' : '100%',
              borderRadius: '6px',
              marginBottom: '0.5rem',
              animation: `skeletonFadeIn 0.5s ease ${0.35 + i * 0.05}s both`
            }}
          />
        ))}
      </div>

      {/* Heading 2 */}
      <div
        className="skeleton-block"
        style={{
          height: 'clamp(1.2rem, 5vw, 2rem)',
          width: 'min(50%, 320px)',
          borderRadius: '10px',
          marginBottom: '1.2rem',
          animation: 'skeletonFadeIn 0.5s ease 0.5s both'
        }}
      />

      {/* List items */}
      <div
        style={{
          width: 'min(90%, 600px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          marginBottom: '2rem'
        }}
      >
        {listItems.map((i) => (
          <div
            key={`li-${i}`}
            className="skeleton-block"
            style={{
              height: 'clamp(2rem, 6vw, 2.5rem)',
              width: '100%',
              borderRadius: '12px',
              animation: `skeletonFadeIn 0.5s ease ${0.55 + i * 0.05}s both`
            }}
          />
        ))}
      </div>

      {/* Buttons */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: '0.8rem',
          flexWrap: 'wrap',
          padding: '0 0.5rem'
        }}
      >
        {buttons.map((i) => (
          <div
            key={`btn-${i}`}
            className="skeleton-block"
            style={{
              height: 'clamp(2.2rem, 6vw, 2.8rem)',
              width: 'clamp(120px, 30vw, 160px)',
              borderRadius: '60px',
              animation: `skeletonFadeIn 0.5s ease ${0.85 + i * 0.08}s both`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes skeletonFadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes skeletonShimmer {
          0% { background-position: -500px 0; }
          100% { background-position: 500px 0; }
        }
        .skeleton-block {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.06) 0%,
            rgba(255,255,255,0.14) 20%,
            rgba(255,255,255,0.22) 40%,
            rgba(255,255,255,0.14) 60%,
            rgba(255,255,255,0.06) 100%
          );
          background-size: 1000px 100%;
          animation: skeletonShimmer 1.6s infinite linear;
          backdrop-filter: blur(2px);
        }
      `}</style>
    </div>
  );
};
// ==================== END HERO SKELETON ====================


const Hero = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = eventdImg;
    img.onload = () => setImageLoaded(true);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleShareStory = () => {
    navigate('/say-about-us');
  };

  const handleJoinMovement = () => {
    navigate('/volunteers');
  };

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

      {/* ==================== SKELETON LOADING ==================== */}
      {!imageLoaded && <HeroSkeleton />}
      {/* ==================== END SKELETON ==================== */}

      <div
        className="hero-content"
        data-aos="fade-up"
        data-aos-duration="1000"
        style={{
          maxWidth: '90%',
          width: '100%',
          padding: '1rem',
          zIndex: 2,
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
          position: 'relative',
          pointerEvents: imageLoaded ? 'auto' : 'none'
        }}
      >
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
          VUMA Tanzania is a youth-led non-profit organization dedicated
          to empowering young people and communities through leadership, innovation, environmental action
          and sustainable community development across Tanzania. Registered in the United Republic of
          Tanzania as Non-profit Organization
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
            onClick={handleJoinMovement}
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
              minWidth: '140px',
              color: '#0B3B2F'
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
            className="btn-cta"
            onClick={handleShareStory}
            style={{
              background: 'transparent',
              border: '2px solid #F9C74F',
              padding: '0.7rem 1.5rem',
              borderRadius: '60px',
              fontWeight: 700,
              margin: '0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: 'clamp(0.8rem, 3.5vw, 1rem)',
              flex: '0 1 auto',
              minWidth: '140px',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.2)';
              e.currentTarget.style.borderColor = '#F9C74F';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <i className="fas fa-star" style={{ marginRight: '0.5rem' }}></i>
            Share Your Story
          </button>

          <button
            className="btn-cta btn-outline-light"
            onClick={handleLoginClick}
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
            <i className="fas fa-sign-in-alt" style={{ marginRight: '0.5rem' }}></i>
            Login
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
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
        }
      `}</style>
    </div>
  );
};

export default Hero;