import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const What = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state - MATCHING AdminTestimonials EXACTLY
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    rating: 5,
    text: '',
    is_active: true,
    order: 0
  });
  
  const [errors, setErrors] = useState({});

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your full name';
    if (!formData.text.trim()) newErrors.text = 'Please share your testimonial';
    if (formData.text.length < 10) newErrors.text = 'Please write at least 10 characters';
    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = 'Rating must be between 1 and 5';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Send EXACTLY what AdminTestimonials sends
      const response = await fetch(`${API_BASE_URL}/test/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          rating: formData.rating,
          text: formData.text,
          is_active: true,
          order: 0
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitSuccess(true);
        showSuccessMessage('Thank you! Your testimonial has been submitted successfully!');
        setFormData({
          name: '',
          role: '',
          rating: 5,
          text: '',
          is_active: true,
          order: 0
        });
        window.scrollTo(0, 0);
      } else {
        let errorMsg = 'Failed to submit testimonial. Please try again.';
        if (data.error) {
          if (typeof data.error === 'object') {
            errorMsg = Object.values(data.error).flat()[0];
          } else if (typeof data.error === 'string') {
            errorMsg = data.error;
          }
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.detail) {
          errorMsg = data.detail;
        }
        alert(errorMsg);
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStarIcon = (starValue) => {
    const filled = starValue <= formData.rating;
    const isHovered = starValue <= hoverRating;
    
    if (isHovered && hoverRating > 0) {
      return <i className="fas fa-star" style={{ color: '#fbbf24', transform: 'scale(1.1)', transition: 'all 0.2s' }}></i>;
    }
    if (filled) {
      return <i className="fas fa-star" style={{ color: '#F9C74F' }}></i>;
    }
    return <i className="far fa-star" style={{ color: '#d1d5db' }}></i>;
  };

  if (submitSuccess) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
        {showSuccess && (
          <div style={{
            position: 'fixed', top: '20px', right: '20px', zIndex: 9999, animation: 'slideInRight 0.3s ease'
          }}>
            <div style={{
              background: 'white', borderRadius: '12px', padding: '0.75rem 1rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderLeft: '4px solid #10b981'
            }}>
              <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '1.25rem' }}></i>
              <span style={{ fontSize: '0.875rem', color: '#0B3B2F', fontWeight: 500 }}>{successMessage}</span>
            </div>
          </div>
        )}

        <div style={{
          background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
          color: 'white',
          padding: '3rem 1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div data-aos="fade-up" style={{
              width: '80px',
              height: '80px',
              background: '#10b981',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <i className="fas fa-check" style={{ fontSize: '2.5rem', color: 'white' }}></i>
            </div>
            <h1 data-aos="fade-up" style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '0.5rem' }}>
              Thank You for Your Feedback!
            </h1>
            <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(0.85rem, 3vw, 1rem)', opacity: 0.9 }}>
              Your testimonial has been submitted successfully. It will be reviewed and published soon.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 1rem' }}>
          <div data-aos="fade-up" style={{
            background: 'white',
            borderRadius: '24px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <i className="fas fa-star" style={{ fontSize: '3rem', color: '#F9C74F', marginBottom: '1rem' }}></i>
            <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>What happens next?</h3>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>
              Our team will review your testimonial. Once approved, it will appear on our website.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/')} style={{
                background: '#F9C74F',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '40px',
                color: '#0B3B2F',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                <i className="fas fa-home"></i> Return Home
              </button>
              <button onClick={() => {
                setSubmitSuccess(false);
                window.scrollTo(0, 0);
              }} style={{
                background: 'transparent',
                border: '2px solid #0B3B2F',
                padding: '0.75rem 1.5rem',
                borderRadius: '40px',
                color: '#0B3B2F',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                <i className="fas fa-plus"></i> Submit Another
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      {/* Success Toast */}
      {showSuccess && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999, animation: 'slideInRight 0.3s ease'
        }}>
          <div style={{
            background: 'white', borderRadius: '12px', padding: '0.75rem 1rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderLeft: '4px solid #10b981'
          }}>
            <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '1.25rem' }}></i>
            <span style={{ fontSize: '0.875rem', color: '#0B3B2F', fontWeight: 500 }}>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white',
        padding: '3rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 data-aos="fade-up" style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '0.5rem' }}>
            <i className="fas fa-star" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
            Share Your Experience
          </h1>
          <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(0.85rem, 3vw, 1rem)', opacity: 0.9 }}>
            Your feedback helps us grow and serve our community better
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div style={{ maxWidth: '700px', width: '100%', margin: '0 auto', padding: '3rem 1rem' }}>
        <div data-aos="fade-up" style={{
          background: 'white',
          borderRadius: '24px',
          padding: 'clamp(1.5rem, 5vw, 2rem)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>
                Your Full Name <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., John Doe"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  border: errors.name ? '2px solid #d32f2f' : '1px solid #ddd',
                  fontSize: '1rem'
                }}
              />
              {errors.name && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.name}</p>}
            </div>

            {/* Role/Title */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>
                Your Role/Title <span style={{ fontSize: '0.7rem', fontWeight: 'normal', color: '#999' }}>(Optional)</span>
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="e.g., Community Leader, Volunteer, Program Participant"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  border: '1px solid #ddd',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* Rating */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>
                Your Rating <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '2rem',
                      padding: 0,
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {getStarIcon(star)}
                  </button>
                ))}
                <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                  ({formData.rating} out of 5)
                </span>
              </div>
              {errors.rating && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.rating}</p>}
            </div>

            {/* Testimonial Text */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>
                Your Testimonial <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                rows="6"
                placeholder="Share your experience with VUMA... What impact has our work had on you or your community?"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  border: errors.text ? '2px solid #d32f2f' : '1px solid #ddd',
                  fontSize: '1rem',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              {errors.text && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.text}</p>}
              <p style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.3rem' }}>
                <i className="fas fa-info-circle"></i> Minimum 10 characters
              </p>
            </div>

            {/* Preview Section */}
            {formData.text && formData.text.length > 10 && (
              <div style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-eye"></i> Preview
                </h4>
                <div style={{
                  padding: '0.5rem',
                  background: 'white',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.5rem' }}>
                    {[...Array(formData.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star" style={{ color: '#F9C74F', fontSize: '0.7rem' }}></i>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#475569', fontStyle: 'italic', margin: 0 }}>
                    "{formData.text.substring(0, 150)}{formData.text.length > 150 ? '...' : ''}"
                  </p>
                  <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem', marginBottom: 0 }}>
                    — {formData.name || 'Your Name'}
                    {formData.role && `, ${formData.role}`}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => navigate('/')}
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
                <i className="fas fa-times"></i> Cancel
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
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Share Your Story
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Info Banner */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1rem 3rem' }}>
        <div style={{
          background: 'rgba(249,199,79,0.1)',
          borderRadius: '16px',
          padding: '1rem',
          textAlign: 'center',
          border: '1px solid rgba(249,199,79,0.3)'
        }}>
          <i className="fas fa-heart" style={{ color: '#F9C74F', marginRight: '0.5rem' }}></i>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Your testimonial will be reviewed by our team. We appreciate you taking the time to share your experience!
          </span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        textarea:focus, input:focus {
          outline: none;
          border-color: #F9C74F !important;
          box-shadow: 0 0 0 2px rgba(249,199,79,0.1);
        }
      `}</style>
    </div>
  );
};

export default What;