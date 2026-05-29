import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Forms = () => {
  const navigate = useNavigate();
  const [isVolunteerHovered, setIsVolunteerHovered] = useState(false);
  const [isPartnershipHovered, setIsPartnershipHovered] = useState(false);

  const handleVolunteerClick = () => {
    navigate('/signup');
  };

  const handlePartnershipClick = () => {
    navigate('/contact');
  };

  return (
    <div className="forms-grid" id="volunteer" data-aos="flip-up" style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'linear-gradient(135deg, #f9fbf7 0%, #f0f5ee 100%)'
    }}>
      {/* Volunteer Card */}
      <div className="form-card volunteer-card" id="volunteer-card" style={{ 
        background: 'white', 
        borderRadius: 32, 
        padding: '2rem', 
        width: '100%', 
        maxWidth: 400,
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s ease, boxShadow 0.3s ease',
        textAlign: 'center',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
      }}
      onClick={handleVolunteerClick}>
        
        {/* Icon Container */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(249,199,79,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <i className="fas fa-hands-helping" style={{ fontSize: '2.5rem', color: '#F9C74F' }}></i>
        </div>
        
        <h3 style={{
          fontSize: '1.3rem',
          marginBottom: '0.5rem',
          color: '#0B3B2F',
          fontWeight: 700
        }}>
          Become a Volunteer
        </h3>
        
        <p style={{
          fontSize: '0.85rem',
          color: '#666',
          lineHeight: '1.5',
          marginBottom: '1rem'
        }}>
          Join our team of passionate volunteers and make a real difference in your community.
        </p>
        
        {/* Benefits List */}
        <div style={{
          textAlign: 'left',
          marginBottom: '1.5rem',
          padding: '0 0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-check-circle" style={{ color: '#F9C74F', fontSize: '0.8rem' }}></i>
            <span style={{ fontSize: '0.8rem', color: '#555' }}>Make meaningful impact</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-check-circle" style={{ color: '#F9C74F', fontSize: '0.8rem' }}></i>
            <span style={{ fontSize: '0.8rem', color: '#555' }}>Build leadership skills</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-check-circle" style={{ color: '#F9C74F', fontSize: '0.8rem' }}></i>
            <span style={{ fontSize: '0.8rem', color: '#555' }}>Network with change-makers</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-check-circle" style={{ color: '#F9C74F', fontSize: '0.8rem' }}></i>
            <span style={{ fontSize: '0.8rem', color: '#555' }}>Receive training & certification</span>
          </div>
        </div>
        
        {/* Eye Icon + Text Link */}
        <div
          onMouseEnter={() => setIsVolunteerHovered(true)}
          onMouseLeave={() => setIsVolunteerHovered(false)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            padding: '0.5rem 0',
            transition: 'all 0.3s ease'
          }}
        >
          <i 
            className="fas fa-eye" 
            style={{
              fontSize: '0.9rem',
              color: '#F9C74F',
              transition: 'transform 0.3s ease',
              transform: isVolunteerHovered ? 'scale(1.1)' : 'scale(1)'
            }}
          ></i>
          <span style={{
            color: '#0B3B2F',
            fontWeight: 600,
            fontSize: '0.85rem',
            transition: 'color 0.3s ease'
          }}>
            Learn More
          </span>
        </div>
      </div>

      {/* Partnership Card */}
      <div className="form-card partnership-card" id="partnership-card" style={{ 
        background: 'white', 
        borderRadius: 32, 
        padding: '2rem', 
        width: '100%', 
        maxWidth: 400,
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s ease, boxShadow 0.3s ease',
        textAlign: 'center',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
      }}
      onClick={handlePartnershipClick}>
        
        {/* Icon Container */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(249,199,79,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <i className="fas fa-handshake" style={{ fontSize: '2.5rem', color: '#F9C74F' }}></i>
        </div>
        
        <h3 style={{
          fontSize: '1.3rem',
          marginBottom: '0.5rem',
          color: '#0B3B2F',
          fontWeight: 700
        }}>
          Become a Partner
        </h3>
        
        <p style={{
          fontSize: '0.85rem',
          color: '#666',
          lineHeight: '1.5',
          marginBottom: '1rem'
        }}>
          Collaborate with us to create sustainable change and empower youth across Tanzania.
        </p>
        
        {/* Benefits List */}
        <div style={{
          textAlign: 'left',
          marginBottom: '1.5rem',
          padding: '0 0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-check-circle" style={{ color: '#F9C74F', fontSize: '0.8rem' }}></i>
            <span style={{ fontSize: '0.8rem', color: '#555' }}>Corporate social responsibility</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-check-circle" style={{ color: '#F9C74F', fontSize: '0.8rem' }}></i>
            <span style={{ fontSize: '0.8rem', color: '#555' }}>Community impact visibility</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-check-circle" style={{ color: '#F9C74F', fontSize: '0.8rem' }}></i>
            <span style={{ fontSize: '0.8rem', color: '#555' }}>Youth empowerment initiatives</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-check-circle" style={{ color: '#F9C74F', fontSize: '0.8rem' }}></i>
            <span style={{ fontSize: '0.8rem', color: '#555' }}>Sustainable development goals</span>
          </div>
        </div>
        
        {/* Eye Icon + Text Link */}
        <div
          onMouseEnter={() => setIsPartnershipHovered(true)}
          onMouseLeave={() => setIsPartnershipHovered(false)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            padding: '0.5rem 0',
            transition: 'all 0.3s ease'
          }}
        >
          <i 
            className="fas fa-eye" 
            style={{
              fontSize: '0.9rem',
              color: '#F9C74F',
              transition: 'transform 0.3s ease',
              transform: isPartnershipHovered ? 'scale(1.1)' : 'scale(1)'
            }}
          ></i>
          <span style={{
            color: '#0B3B2F',
            fontWeight: 600,
            fontSize: '0.85rem',
            transition: 'color 0.3s ease'
          }}>
            Learn More
          </span>
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
        
        /* Volunteer card specific styles */
        #volunteer-card {
          border-left: 4px solid #F9C74F;
        }
        
        /* Partnership card specific styles */
        #partnership-card {
          border-right: 4px solid #F9C74F;
        }
        
        @media (max-width: 768px) {
          .forms-grid {
            gap: 1rem !important;
            padding: 1rem 0.75rem !important;
          }
          
          .form-card {
            padding: 1.5rem !important;
          }
          
          .form-card h3 {
            font-size: 1.2rem !important;
          }
          
          .form-card p {
            font-size: 0.8rem !important;
          }
          
          .form-card .fa-check-circle {
            font-size: 0.7rem !important;
          }
          
          .form-card span {
            font-size: 0.75rem !important;
          }
          
          .form-card .fa-hands-helping,
          .form-card .fa-handshake {
            font-size: 2rem !important;
          }
          
          .form-card > div:first-child {
            width: 60px !important;
            height: 60px !important;
          }
        }
        
        @media (max-width: 480px) {
          .form-card {
            max-width: 100% !important;
            padding: 1.2rem !important;
          }
          
          .form-card h3 {
            font-size: 1.1rem !important;
          }
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .form-card {
            -webkit-tap-highlight-color: transparent;
          }
          
          .form-card:active {
            transform: scale(0.98) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Forms;