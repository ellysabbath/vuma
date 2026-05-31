import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const EventRegister = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Custom alert states
  const [customAlert, setCustomAlert] = useState({
    show: false,
    type: 'success',
    title: '',
    message: '',
    onConfirm: null
  });

  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    organization: '',
    position: '',
    city: '',
    howDidYouHear: '',
    specialRequests: '',
    agreeToTerms: false
  });

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const showAlert = (type, title, message, onConfirm = null) => {
    setCustomAlert({
      show: true,
      type,
      title,
      message,
      onConfirm
    });
  };

  const closeAlert = () => {
    setCustomAlert({
      show: false,
      type: 'success',
      title: '',
      message: '',
      onConfirm: null
    });
    if (customAlert.onConfirm) {
      customAlert.onConfirm();
    }
  };

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.137.83:8000/api/events/${id}/`);
      const data = await response.json();
      if (data.success) {
        setEvent(data.data);
      } else {
        setError('Event not found');
        showAlert('error', 'Error!', 'Event not found');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
      showAlert('error', 'Network Error', 'Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      showAlert('error', 'Validation Error', 'Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      showAlert('error', 'Validation Error', 'Please enter your email address');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showAlert('error', 'Validation Error', 'Please enter a valid email address');
      return false;
    }
    if (!formData.phone.trim()) {
      showAlert('error', 'Validation Error', 'Please enter your phone number');
      return false;
    }
    if (!formData.age) {
      showAlert('error', 'Validation Error', 'Please select your age range');
      return false;
    }
    if (!formData.gender) {
      showAlert('error', 'Validation Error', 'Please select your gender');
      return false;
    }
    if (!formData.agreeToTerms) {
      showAlert('error', 'Validation Error', 'Please agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await fetch(`http://192.168.137.83:8000/api/events/${id}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: id,
          ...formData
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        showAlert('success', 'Registration Successful!', 
          `You have successfully registered for ${event.title}. A confirmation email has been sent to ${formData.email}.`,
          () => {
            navigate('/events');
          }
        );
      } else {
        showAlert('error', 'Registration Failed', data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      showAlert('error', 'Network Error', 'Failed to register. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getEventImage = (eventData) => {
    if (eventData && eventData.image_base64) {
      if (eventData.image_base64.startsWith('data:image')) {
        return eventData.image_base64;
      }
      return `data:image/jpeg;base64,${eventData.image_base64}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#d32f2f' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>{error || 'Event not found'}</p>
          <button 
            onClick={() => navigate('/events')} 
            style={{ 
              marginTop: '1rem', 
              background: '#F9C74F', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '20px', 
              cursor: 'pointer',
              color: '#0B3B2F',
              fontWeight: 600
            }}
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (event.registered >= event.capacity) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
          <i className="fas fa-times-circle" style={{ fontSize: '4rem', color: '#d32f2f' }}></i>
          <h2 style={{ color: '#0B3B2F', marginTop: '1rem' }}>Event Fully Booked</h2>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Unfortunately, {event.title} has reached its maximum capacity of {event.capacity} participants.
          </p>
          <button 
            onClick={() => navigate('/events')} 
            style={{ 
              marginTop: '1.5rem', 
              background: '#F9C74F', 
              border: 'none', 
              padding: '0.8rem 1.5rem', 
              borderRadius: '50px', 
              cursor: 'pointer',
              color: '#0B3B2F',
              fontWeight: 600
            }}
          >
            View Other Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      {/* Custom Alert Modal */}
      {customAlert.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '450px',
            width: '90%',
            padding: '2rem',
            textAlign: 'center',
            animation: 'slideInUp 0.3s ease',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              {customAlert.type === 'success' && (
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: '#4caf50',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <i className="fas fa-check" style={{ fontSize: '2rem', color: 'white' }}></i>
                </div>
              )}
              {customAlert.type === 'error' && (
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: '#d32f2f',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <i className="fas fa-times" style={{ fontSize: '2rem', color: 'white' }}></i>
                </div>
              )}
            </div>
            
            <h3 style={{
              color: customAlert.type === 'error' ? '#d32f2f' : '#0B3B2F',
              marginBottom: '0.5rem',
              fontSize: '1.5rem'
            }}>
              {customAlert.title}
            </h3>
            
            <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
              {customAlert.message}
            </p>
            
            <button
              onClick={closeAlert}
              style={{
                padding: '0.6rem 2rem',
                background: customAlert.type === 'error' ? '#d32f2f' : '#0B3B2F',
                border: 'none',
                borderRadius: '50px',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {customAlert.type === 'error' ? 'Try Again' : 'Continue'}
            </button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          overflow: 'hidden',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {getEventImage(event) && (
              <div style={{ flex: '0 0 200px', minWidth: '200px' }}>
                <img 
                  src={getEventImage(event)} 
                  alt={event.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
            <div style={{ flex: 1, padding: '1.5rem' }}>
              <span style={{
                background: '#F9C74F',
                color: '#0B3B2F',
                padding: '0.2rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.7rem',
                display: 'inline-block',
                marginBottom: '0.8rem',
                fontWeight: 600
              }}>
                {event.type}
              </span>
              <h1 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                {event.title}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <i className="fas fa-calendar-alt" style={{ color: '#F9C74F', marginRight: '0.5rem' }}></i>
                  <span style={{ color: '#666' }}>{event.date}</span>
                </div>
                <div>
                  <i className="fas fa-clock" style={{ color: '#F9C74F', marginRight: '0.5rem' }}></i>
                  <span style={{ color: '#666' }}>{event.time}</span>
                </div>
                <div>
                  <i className="fas fa-map-marker-alt" style={{ color: '#F9C74F', marginRight: '0.5rem' }}></i>
                  <span style={{ color: '#666' }}>{event.location}</span>
                </div>
                <div>
                  <i className="fas fa-users" style={{ color: '#F9C74F', marginRight: '0.5rem' }}></i>
                  <span style={{ color: '#666' }}>{event.registered}/{event.capacity} spots available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ color: '#0B3B2F', marginBottom: '1.5rem', fontSize: '1.3rem' }}>
            <i className="fas fa-user-plus" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
            Registration Form
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {/* Full Name */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0B3B2F', fontWeight: 600 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0B3B2F', fontWeight: 600 }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0B3B2F', fontWeight: 600 }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+255 XXX XXX XXX"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                />
              </div>

              {/* Age Range */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0B3B2F', fontWeight: 600 }}>
                  Age Range *
                </label>
                <select
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select age range</option>
                  <option value="18-24">18 - 24 years</option>
                  <option value="25-34">25 - 34 years</option>
                  <option value="35-44">35 - 44 years</option>
                  <option value="45+">45+ years</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0B3B2F', fontWeight: 600 }}>
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              {/* Organization */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0B3B2F', fontWeight: 600 }}>
                  Organization/Company
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="Your organization (optional)"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              {/* Position */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0B3B2F', fontWeight: 600 }}>
                  Position/Title
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Your position (optional)"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              {/* City */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0B3B2F', fontWeight: 600 }}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Your city"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              {/* How did you hear */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0B3B2F', fontWeight: 600 }}>
                  How did you hear about this event? *
                </label>
                <select
                  name="howDidYouHear"
                  value={formData.howDidYouHear}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select an option</option>
                  <option value="social-media">Social Media</option>
                  <option value="email">Email Newsletter</option>
                  <option value="friend">Friend/Colleague</option>
                  <option value="website">VUMA Website</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Special Requests */}
            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0B3B2F', fontWeight: 600 }}>
                Special Requests or Questions
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows="3"
                placeholder="Any special accommodations, dietary restrictions, or questions you'd like us to know about?"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid #ddd',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Terms and Conditions */}
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f9fbf7', borderRadius: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  style={{ marginTop: '0.2rem', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.4' }}>
                  I agree to the <span style={{ color: '#F9C74F', cursor: 'pointer' }}>Terms and Conditions</span> and confirm that the information provided is accurate. I understand that VUMA Tanzania may contact me regarding this event and future opportunities.
                </span>
              </label>
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => navigate('/events')}
                style={{
                  padding: '0.8rem 1.5rem',
                  background: 'transparent',
                  border: '2px solid #ddd',
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
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '0.8rem 2rem',
                  background: submitting ? '#ccc' : '#F9C74F',
                  border: 'none',
                  borderRadius: '50px',
                  color: '#0B3B2F',
                  fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(249,199,79,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {submitting ? (
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

        {/* Event Info Note */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(249,199,79,0.1)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>
            <i className="fas fa-envelope" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
            A confirmation email will be sent to your provided email address upon successful registration.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
        
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #F9C74F;
          box-shadow: 0 0 0 3px rgba(249,199,79,0.1);
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EventRegister;