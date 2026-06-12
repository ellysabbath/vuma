import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const EventRegister = () => {
  const navigate = useNavigate();
  
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  
  const [formData, setFormData] = useState({
    event: '',
    full_name: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    dietary_needs: '',
    special_accommodation: '',
    hear_about: '',
    agree_terms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = 'https://vuma.pythonanywhere.com';

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    window.scrollTo(0, 0);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/`);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      const eventsList = data.results || data || [];
      setEvents(eventsList);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

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
    if (!formData.event.trim()) newErrors.event = 'Please select an event';
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.agree_terms) newErrors.agree_terms = 'You must agree to the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  setIsSubmitting(true);
  
  try {
    const response = await fetch(`${API_BASE_URL}/event/api/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      const registrationId = data.registration?.id || data.id;
      
      navigate(`/events/register/confirmation/${registrationId}`, {
        state: {
          eventName: formData.event,
          registrationData: data.registration || data
        }
      });
    } else {
      // Handle the unique constraint error specifically
      let errorMsg = '';
      
      if (data.error) {
        // Check for email field error (unique constraint)
        if (data.error.email && Array.isArray(data.error.email)) {
          errorMsg = data.error.email[0];
        } 
        // Check for non_field_errors
        else if (data.error.non_field_errors && Array.isArray(data.error.non_field_errors)) {
          errorMsg = data.error.non_field_errors[0];
        }
        // Handle other object errors
        else if (typeof data.error === 'object') {
          const firstKey = Object.keys(data.error)[0];
          if (firstKey && data.error[firstKey]) {
            errorMsg = Array.isArray(data.error[firstKey]) ? data.error[firstKey][0] : data.error[firstKey];
          } else {
            errorMsg = 'Registration failed. Please try again.';
          }
        } 
        // Handle string error
        else if (typeof data.error === 'string') {
          errorMsg = data.error;
        }
        else {
          errorMsg = 'Registration failed. Please try again.';
        }
      } else {
        errorMsg = 'Registration failed. Please try again.';
      }
      
      // Show alert with the error message
      alert(errorMsg);
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Network error. Please check your connection and try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white', padding: '3rem 1.5rem', textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 data-aos="fade-up" style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '0.5rem' }}>
            <i className="fas fa-handshake"></i> Event Registration
          </h1>
          <p data-aos="fade-up" data-aos-delay="200">Please fill out the form below to register for an event</p>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 1rem' }}>
        <div data-aos="fade-up" style={{ background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <form onSubmit={handleSubmit}>
            {/* Event Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>Event Information</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Select Event <span style={{ color: '#d32f2f' }}>*</span>
                </label>
                {loadingEvents ? (
                  <div style={{ padding: '0.8rem', background: '#f1f5f9', borderRadius: '12px' }}>
                    Loading events...
                  </div>
                ) : (
                  <select
                    name="event"
                    value={formData.event}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: errors.event ? '2px solid #d32f2f' : '1px solid #ddd',
                      fontSize: '1rem',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">-- Select an event --</option>
                    {events.map(event => (
                      <option key={event.id} value={event.title}>
                        {event.title} - {formatDate(event.date)} | {event.location}
                      </option>
                    ))}
                  </select>
                )}
                {errors.event && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.event}</p>}
              </div>
            </div>

            {/* Personal Information */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>Personal Information</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Full Name <span style={{ color: '#d32f2f' }}>*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: errors.full_name ? '2px solid #d32f2f' : '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                />
                {errors.full_name && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.full_name}</p>}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
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
              <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>Additional Information</h3>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Organization/Institution</label>
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Position/Role</label>
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Dietary Needs</label>
                <textarea
                  name="dietary_needs"
                  value={formData.dietary_needs}
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Special Accommodations</label>
                <textarea
                  name="special_accommodation"
                  value={formData.special_accommodation}
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>How did you hear about us?</label>
                <select
                  name="hear_about"
                  value={formData.hear_about}
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
                  name="agree_terms"
                  checked={formData.agree_terms}
                  onChange={handleChange}
                  style={{ marginTop: '0.2rem', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                  I agree to the Terms of Service and Privacy Policy <span style={{ color: '#d32f2f' }}>*</span>
                </span>
              </label>
              {errors.agree_terms && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.agree_terms}</p>}
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
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-arrow-left"></i> Back
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
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
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        input:focus, textarea:focus, select:focus {
          border-color: #F9C74F !important;
          outline: none;
          box-shadow: 0 0 0 2px rgba(249,199,79,0.1);
        }
      `}</style>
    </div>
  );
};

export default EventRegister;