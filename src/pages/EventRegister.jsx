import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import logo from '../assets/vuma.png';

const EventRegister = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const eventName = location.state?.eventName || 'this event';
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    dietaryNeeds: '',
    specialAccommodation: '',
    hearAbout: '',
    agreeTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`🎉 Registration successful for ${eventName}!\n\nWe have sent confirmation to ${formData.email}`);
      navigate('/events');
    }, 1500);
  };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white',
        padding: '3rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 data-aos="fade-up" style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '0.5rem' }}>
            <i className="fas fa-handshake" style={{ marginRight: '0.5rem' }}></i>
            Register for {eventName}
          </h1>
          <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(0.85rem, 3vw, 1rem)', opacity: 0.9 }}>
            Secure your spot and be part of this transformative experience
          </p>
        </div>
      </div>

      {/* Registration Form */}
      <div style={{ maxWidth: '700px', width: '100%', margin: '0 auto', padding: '3rem 1rem' }}>
        <div data-aos="fade-up" style={{
          background: 'white',
          borderRadius: '24px',
          padding: 'clamp(1.5rem, 5vw, 2rem)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.2rem' }}>
                <i className="fas fa-user" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                Personal Information
              </h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>
                  Full Name <span style={{ color: '#d32f2f' }}>*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: errors.fullName ? '2px solid #d32f2f' : '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                />
                {errors.fullName && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.fullName}</p>}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>
                  Email Address <span style={{ color: '#d32f2f' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: errors.email ? '2px solid #d32f2f' : '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                />
                {errors.email && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.email}</p>}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>
                  Phone Number <span style={{ color: '#d32f2f' }}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: errors.phone ? '2px solid #d32f2f' : '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                />
                {errors.phone && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.phone}</p>}
              </div>
            </div>

            {/* Additional Information */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.2rem' }}>
                <i className="fas fa-building" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                Additional Information
              </h3>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>Organization/Institution</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Your organization (optional)"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>Position/Role</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Your position (optional)"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>Dietary Needs</label>
                <textarea
                  name="dietaryNeeds"
                  value={formData.dietaryNeeds}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Any dietary restrictions or preferences"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>Special Accommodations</label>
                <textarea
                  name="specialAccommodation"
                  value={formData.specialAccommodation}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Any special accommodations needed"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>How did you hear about us?</label>
                <select
                  name="hearAbout"
                  value={formData.hearAbout}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select an option</option>
                  <option>Social Media</option>
                  <option>Friend/Family</option>
                  <option>Email Newsletter</option>
                  <option>Website</option>
                  <option>Event</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  style={{ marginTop: '0.2rem', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                  I agree to the Terms of Service and Privacy Policy <span style={{ color: '#d32f2f' }}>*</span>
                </span>
              </label>
              {errors.agreeTerms && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.agreeTerms}</p>}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => navigate('/events')}
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
                <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  flex: 2,
                  background: isSubmitting ? '#0B3B2F' : '#F9C74F',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '50px',
                  color: isSubmitting ? 'white' : '#0B3B2F',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(249,199,79,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Registering...
                  </>
                ) : (
                  <>
                    <i className="fas fa-handshake"></i>
                    Complete Registration
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        input:focus, textarea:focus, select:focus {
          border-color: #F9C74F !important;
          outline: none;
          box-shadow: 0 0 0 2px rgba(249,199,79,0.1);
        }
        
        @media (max-width: 480px) {
          input, textarea, select, button {
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EventRegister;