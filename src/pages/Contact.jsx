import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Contact = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! We will get back to you soon.');
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
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" style={{ background: '#0B3B2F', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}
                   onMouseEnter={(e) => e.currentTarget.style.background = '#F9C74F'}
                   onMouseLeave={(e) => e.currentTarget.style.background = '#0B3B2F'}>
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" style={{ background: '#0B3B2F', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}
                   onMouseEnter={(e) => e.currentTarget.style.background = '#F9C74F'}
                   onMouseLeave={(e) => e.currentTarget.style.background = '#0B3B2F'}>
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" style={{ background: '#0B3B2F', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}
                   onMouseEnter={(e) => e.currentTarget.style.background = '#F9C74F'}
                   onMouseLeave={(e) => e.currentTarget.style.background = '#0B3B2F'}>
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" style={{ background: '#0B3B2F', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}
                   onMouseEnter={(e) => e.currentTarget.style.background = '#F9C74F'}
                   onMouseLeave={(e) => e.currentTarget.style.background = '#0B3B2F'}>
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>

          <div data-aos="fade-left">
            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <input type="text" placeholder="Your Name" required style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '50px', border: '1px solid #ddd' }} />
              <input type="email" placeholder="Your Email" required style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '50px', border: '1px solid #ddd' }} />
              <input type="text" placeholder="Subject" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '50px', border: '1px solid #ddd' }} />
              <textarea rows="5" placeholder="Your Message" required style={{ width: '100%', padding: '0.8rem', borderRadius: '20px', border: '1px solid #ddd', resize: 'vertical' }}></textarea>
              <button type="submit" style={{
                marginTop: '1rem',
                background: '#F9C74F',
                border: 'none',
                padding: '0.8rem',
                borderRadius: '50px',
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%'
              }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;