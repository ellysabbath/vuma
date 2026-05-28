import React, { useRef, useState } from 'react';

const Forms = () => {
  const nameRef = useRef(null);
  const [isVolunteerLoading, setIsVolunteerLoading] = useState(false);
  const [isPartnershipLoading, setIsPartnershipLoading] = useState(false);
  const [isVolunteerHovered, setIsVolunteerHovered] = useState(false);
  const [isPartnershipHovered, setIsPartnershipHovered] = useState(false);

  const handleVolunteer = () => {
    setIsVolunteerLoading(true);
    const name = nameRef.current?.value || 'volunteer';
    setTimeout(() => {
      alert(`Thank you ${name}! We will contact you.`);
      setIsVolunteerLoading(false);
    }, 500);
  };

  const handlePartnership = () => {
    setIsPartnershipLoading(true);
    setTimeout(() => {
      alert('Partnership request sent! VUMA team will respond.');
      setIsPartnershipLoading(false);
    }, 500);
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
      {/* Volunteer Registration Card */}
      <div className="form-card volunteer-card" id="volunteer-card" style={{ 
        background: 'white', 
        borderRadius: 32, 
        padding: '1.5rem', 
        width: '100%', 
        maxWidth: 400,
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s ease, boxShadow 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
      }}>
        <h3 style={{
          fontSize: '1.3rem',
          marginBottom: '1rem',
          color: '#0B3B2F',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <i className="fas fa-hands-helping" style={{ color: '#F9C74F' }}></i>
          Volunteer Registration
        </h3>
        
        <input 
          type="text" 
          ref={nameRef} 
          placeholder="Full Name" 
          className="volunteer-input"
          id="volunteer-name"
          style={{ 
            width: '100%', 
            padding: '0.8rem', 
            margin: '0.5rem 0', 
            borderRadius: 50, 
            border: '1px solid #ddd',
            transition: 'all 0.3s ease',
            fontSize: '0.9rem'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#F9C74F';
            e.currentTarget.style.outline = 'none';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,199,79,0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#ddd';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        
        <select 
          className="volunteer-select"
          id="volunteer-area"
          style={{ 
          width: '100%', 
          padding: '0.8rem', 
          margin: '0.5rem 0', 
          borderRadius: 50, 
          border: '1px solid #ddd',
          transition: 'all 0.3s ease',
          fontSize: '0.9rem',
          backgroundColor: 'white'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#F9C74F';
          e.currentTarget.style.outline = 'none';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#ddd';
        }}>
          <option>Leadership & Advocacy</option>
          <option>Environment & Conservation</option>
        </select>
        
        <select 
          className="volunteer-select"
          id="volunteer-track"
          style={{ 
          width: '100%', 
          padding: '0.8rem', 
          margin: '0.5rem 0', 
          borderRadius: 50, 
          border: '1px solid #ddd',
          transition: 'all 0.3s ease',
          fontSize: '0.9rem',
          backgroundColor: 'white'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#F9C74F';
          e.currentTarget.style.outline = 'none';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#ddd';
        }}>
          <option>Innovation Leadership</option>
          <option>Environmental Innovation</option>
        </select>
        
        <input 
          type="text" 
          placeholder="Location" 
          className="volunteer-input"
          id="volunteer-location"
          style={{ 
            width: '100%', 
            padding: '0.8rem', 
            margin: '0.5rem 0', 
            borderRadius: 50, 
            border: '1px solid #ddd',
            transition: 'all 0.3s ease',
            fontSize: '0.9rem'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#F9C74F';
            e.currentTarget.style.outline = 'none';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,199,79,0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#ddd';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        
        {/* Volunteer Button with unique ID */}
        <button 
          id="volunteer-register-btn"
          className="form-btn volunteer-btn"
          onClick={handleVolunteer}
          disabled={isVolunteerLoading}
          onMouseEnter={() => setIsVolunteerHovered(true)}
          onMouseLeave={() => setIsVolunteerHovered(false)}
          style={{
            background: isVolunteerLoading ? '#0B3B2F' : '#F9C74F',
            border: 'none',
            padding: '0.7rem 1.5rem',
            borderRadius: '60px',
            fontWeight: 700,
            marginTop: '0.5rem',
            cursor: isVolunteerLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            fontSize: 'clamp(0.8rem, 3.5vw, 1rem)',
            width: '100%',
            color: isVolunteerLoading ? 'white' : '#1a3a2a',
            opacity: isVolunteerLoading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <span className="volunteer-btn-text" style={{
            transition: 'transform 0.3s ease'
          }}>
            {isVolunteerLoading ? 'Processing...' : 'Register Now'}
          </span>
          <div className="volunteer-btn-icon" style={{
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {isVolunteerLoading ? (
              <div className="volunteer-spinner" style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
            ) : (
              <i className="fas fa-arrow-right volunteer-arrow" style={{
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isVolunteerHovered ? 'translateX(8px)' : 'translateX(0)',
                animation: isVolunteerHovered ? 'none' : 'bounceArrow 1.5s ease-in-out infinite'
              }}></i>
            )}
          </div>
        </button>
      </div>

      {/* Partnership Inquiry Card */}
      <div className="form-card partnership-card" id="partnership-card" style={{ 
        background: 'white', 
        borderRadius: 32, 
        padding: '1.5rem', 
        width: '100%', 
        maxWidth: 400,
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s ease, boxShadow 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
      }}>
        <h3 style={{
          fontSize: '1.3rem',
          marginBottom: '1rem',
          color: '#0B3B2F',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <i className="fas fa-handshake" style={{ color: '#F9C74F' }}></i>
          Partnership Inquiry
        </h3>
        
        <input 
          type="text" 
          placeholder="Organization Name" 
          className="partnership-input"
          id="partnership-org"
          style={{ 
            width: '100%', 
            padding: '0.8rem', 
            margin: '0.5rem 0', 
            borderRadius: 50, 
            border: '1px solid #ddd',
            transition: 'all 0.3s ease',
            fontSize: '0.9rem'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#F9C74F';
            e.currentTarget.style.outline = 'none';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,199,79,0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#ddd';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        
        <input 
          type="text" 
          placeholder="Contact Person" 
          className="partnership-input"
          id="partnership-contact"
          style={{ 
            width: '100%', 
            padding: '0.8rem', 
            margin: '0.5rem 0', 
            borderRadius: 50, 
            border: '1px solid #ddd',
            transition: 'all 0.3s ease',
            fontSize: '0.9rem'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#F9C74F';
            e.currentTarget.style.outline = 'none';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,199,79,0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#ddd';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        
        <select 
          className="partnership-select"
          id="partnership-type"
          style={{ 
          width: '100%', 
          padding: '0.8rem', 
          margin: '0.5rem 0', 
          borderRadius: 50, 
          border: '1px solid #ddd',
          transition: 'all 0.3s ease',
          fontSize: '0.9rem',
          backgroundColor: 'white'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#F9C74F';
          e.currentTarget.style.outline = 'none';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#ddd';
        }}>
          <option>Funding Partner</option>
          <option>Technical Partner</option>
          <option>Media Partner</option>
        </select>
        
        <textarea 
          rows="3" 
          placeholder="Message" 
          className="partnership-textarea"
          id="partnership-message"
          style={{ 
            width: '100%', 
            padding: '0.8rem', 
            margin: '0.5rem 0', 
            borderRadius: 20, 
            border: '1px solid #ddd',
            transition: 'all 0.3s ease',
            fontSize: '0.9rem',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#F9C74F';
            e.currentTarget.style.outline = 'none';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,199,79,0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#ddd';
            e.currentTarget.style.boxShadow = 'none';
          }}
        ></textarea>
        
        {/* Partnership Button with unique ID */}
        <button 
          id="partnership-send-btn"
          className="form-btn partnership-btn"
          onClick={handlePartnership}
          disabled={isPartnershipLoading}
          onMouseEnter={() => setIsPartnershipHovered(true)}
          onMouseLeave={() => setIsPartnershipHovered(false)}
          style={{
            background: isPartnershipLoading ? '#0B3B2F' : '#F9C74F',
            border: 'none',
            padding: '0.7rem 1.5rem',
            borderRadius: '60px',
            fontWeight: 700,
            marginTop: '0.5rem',
            cursor: isPartnershipLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            fontSize: 'clamp(0.8rem, 3.5vw, 1rem)',
            width: '100%',
            color: isPartnershipLoading ? 'white' : '#1a3a2a',
            opacity: isPartnershipLoading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <span className="partnership-btn-text" style={{
            transition: 'transform 0.3s ease'
          }}>
            {isPartnershipLoading ? 'Sending...' : 'Send Inquiry'}
          </span>
          <div className="partnership-btn-icon" style={{
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {isPartnershipLoading ? (
              <div className="partnership-spinner" style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
            ) : (
              <i className="fas fa-arrow-right partnership-arrow" style={{
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isPartnershipHovered ? 'translateX(8px)' : 'translateX(0)',
                animation: isPartnershipHovered ? 'none' : 'bounceArrow 1.5s ease-in-out infinite'
              }}></i>
            )}
          </div>
        </button>
      </div>

      {/* CSS Animations with specific class selectors */}
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
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        /* Volunteer Button Specific Styles */
        #volunteer-register-btn {
          background: linear-gradient(135deg, #F9C74F, #f6b83e);
          box-shadow: 0 4px 15px rgba(249,199,79,0.2);
        }
        
        #volunteer-register-btn:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: 0 6px 20px rgba(249,199,79,0.3);
        }
        
        /* Partnership Button Specific Styles */
        #partnership-send-btn {
          background: linear-gradient(135deg, #F9C74F, #f6b83e);
          box-shadow: 0 4px 15px rgba(249,199,79,0.2);
        }
        
        #partnership-send-btn:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: 0 6px 20px rgba(249,199,79,0.3);
        }
        
        /* Disabled button styles */
        #volunteer-register-btn:disabled,
        #partnership-send-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        /* Volunteer card specific styles */
        #volunteer-card {
          border-left: 4px solid #F9C74F;
        }
        
        /* Partnership card specific styles */
        #partnership-card {
          border-right: 4px solid #F9C74F;
        }
        
        /* Input focus styles */
        #volunteer-name:focus,
        #volunteer-location:focus,
        #partnership-org:focus,
        #partnership-contact:focus,
        #partnership-message:focus {
          border-color: #F9C74F !important;
          box-shadow: 0 0 0 3px rgba(249,199,79,0.1) !important;
        }
        
        /* Select focus styles */
        #volunteer-area:focus,
        #volunteer-track:focus,
        #partnership-type:focus {
          border-color: #F9C74F !important;
          outline: none;
        }
        
        @media (max-width: 768px) {
          .forms-grid {
            gap: 1rem !important;
            padding: 1rem 0.75rem !important;
          }
          
          .form-card {
            padding: 1.2rem !important;
          }
          
          .form-card h3 {
            font-size: 1.1rem !important;
          }
          
          input, select, textarea {
            padding: 0.7rem !important;
            font-size: 0.85rem !important;
          }
          
          #volunteer-register-btn,
          #partnership-send-btn {
            padding: 0.6rem 1.2rem !important;
            gap: 0.6rem !important;
          }
          
          #volunteer-register-btn span,
          #partnership-send-btn span {
            font-size: 0.85rem !important;
          }
          
          .fa-arrow-right {
            font-size: 0.85rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .form-card {
            max-width: 100% !important;
          }
          
          #volunteer-register-btn,
          #partnership-send-btn {
            padding: 0.5rem 1rem !important;
          }
          
          #volunteer-register-btn span,
          #partnership-send-btn span {
            font-size: 0.8rem !important;
          }
          
          .fa-arrow-right {
            font-size: 0.75rem !important;
          }
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          #volunteer-register-btn,
          #partnership-send-btn {
            -webkit-tap-highlight-color: transparent;
          }
          
          #volunteer-register-btn:active,
          #partnership-send-btn:active {
            transform: scale(0.98) !important;
          }
          
          .fa-arrow-right {
            animation: bounceArrow 1.5s ease-in-out infinite !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Forms;