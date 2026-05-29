import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Contact = () => {
  const navigate = useNavigate();
  const [isSubmitHovered, setIsSubmitHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Message sent! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h1 data-aos="fade-up" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>
          Contact Us
        </h1>
        <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>
          We'd love to hear from you
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          {/* Contact Info Section */}
          <div data-aos="fade-right">
            <h2 style={{ color: '#0B3B2F', marginBottom: '1.5rem' }}>Get in Touch</h2>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <i className="fas fa-map-marker-alt" style={{ color: '#F9C74F', fontSize: '1.2rem' }}></i>
              <span>Dar es Salaam, Tanzania</span>
            </div>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <i className="fas fa-phone" style={{ color: '#F9C74F', fontSize: '1.2rem' }}></i>
              <span>+255 123 456 789</span>
            </div>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <i className="fas fa-envelope" style={{ color: '#F9C74F', fontSize: '1.2rem' }}></i>
              <span>info@vuma.or.tz</span>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>Follow Us</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="#" style={{ background: '#0B3B2F', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}
                   onMouseEnter={(e) => { e.currentTarget.style.background = '#F9C74F'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.background = '#0B3B2F'; e.currentTarget.style.transform = 'scale(1)'; }}>
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" style={{ background: '#0B3B2F', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}
                   onMouseEnter={(e) => { e.currentTarget.style.background = '#F9C74F'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.background = '#0B3B2F'; e.currentTarget.style.transform = 'scale(1)'; }}>
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" style={{ background: '#0B3B2F', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}
                   onMouseEnter={(e) => { e.currentTarget.style.background = '#F9C74F'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.background = '#0B3B2F'; e.currentTarget.style.transform = 'scale(1)'; }}>
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" style={{ background: '#0B3B2F', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}
                   onMouseEnter={(e) => { e.currentTarget.style.background = '#F9C74F'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.background = '#0B3B2F'; e.currentTarget.style.transform = 'scale(1)'; }}>
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form with Icon Submit */}
          <div data-aos="fade-left">
            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '50px',
                    border: errors.name ? '2px solid #d32f2f' : '1px solid #ddd',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                />
                {errors.name && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.name}</p>}
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '50px',
                    border: errors.email ? '2px solid #d32f2f' : '1px solid #ddd',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                />
                {errors.email && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.email}</p>}
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '50px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Your Message"
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '20px',
                    border: errors.message ? '2px solid #d32f2f' : '1px solid #ddd',
                    fontSize: '1rem',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                />
                {errors.message && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.message}</p>}
              </div>
              
              {/* Submit with Icon instead of Button */}
              <div
                onClick={handleSubmit}
                onMouseEnter={() => setIsSubmitHovered(true)}
                onMouseLeave={() => setIsSubmitHovered(false)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '50px',
                  transition: 'all 0.3s ease',
                  background: isSubmitting ? '#0B3B2F' : 'transparent',
                  border: '2px solid #F9C74F',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    <span style={{ color: 'white', fontWeight: 600 }}>Sending...</span>
                  </>
                ) : (
                  <>
                    <i 
                      className="fas fa-paper-plane" 
                      style={{
                        fontSize: '1rem',
                        color: '#F9C74F',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isSubmitHovered ? 'translateX(5px) translateY(-3px)' : 'translateX(0) translateY(0)'
                      }}
                    ></i>
                    <span style={{
                      color: '#0B3B2F',
                      fontWeight: 600,
                      transition: 'color 0.3s ease'
                    }}>
                      Send Message
                    </span>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input:focus, textarea:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(249,199,79,0.1);
        }
        
        @media (max-width: 768px) {
          .contact-form {
            padding: 1.5rem !important;
          }
          
          .submit-link span {
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;