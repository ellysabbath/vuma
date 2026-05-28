import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const footerElement = document.querySelector('.footer-section');
    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => {
      if (footerElement) {
        observer.unobserve(footerElement);
      }
    };
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with ${email}! You'll receive our newsletter.`);
      setEmail('');
    } else {
      alert('Please enter your email address');
    }
  };

  const footerCards = [
    {
      id: 1,
      title: 'About VUMA',
      icon: 'fas fa-leaf',
      content: 'Empowering youth through innovation, leadership, and environmental conservation across Tanzania.',
      items: [
        { icon: 'fas fa-map-marker-alt', text: 'Dar es Salaam, Tanzania' },
        { icon: 'fas fa-flag-checkered', text: 'Est. 2020' }
      ]
    },
    {
      id: 2,
      title: 'Quick Links',
      icon: 'fas fa-link',
      links: [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Programs', path: '/programs' },
        { name: 'Events', path: '/events' },
        { name: 'News & Stories', path: '/news' },
        { name: 'Volunteers', path: '/volunteers' },
        { name: 'Contact', path: '/contact' }
      ]
    },
    {
      id: 3,
      title: 'Contact Info',
      icon: 'fas fa-address-card',
      contacts: [
        { icon: 'fas fa-phone', text: '+255 123 456 789', link: 'tel:+255123456789' },
        { icon: 'fas fa-envelope', text: 'info@vuma.or.tz', link: 'mailto:info@vuma.or.tz' },
        { icon: 'fas fa-clock', text: 'Mon-Fri: 9AM - 5PM' },
        { icon: 'fab fa-whatsapp', text: '+255 123 456 789', link: 'https://wa.me/255123456789' }
      ]
    },
    {
      id: 4,
      title: 'Newsletter',
      icon: 'fas fa-envelope-open-text',
      isNewsletter: true
    }
  ];

  return (
    <footer className="footer-section" style={{
      background: 'linear-gradient(135deg, #07261e 0%, #0a3b2e 100%)',
      color: 'white',
      padding: '3rem 1rem 1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(249,199,79,0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        animation: 'float 15s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-10%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(249,199,79,0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        animation: 'float 12s ease-in-out infinite reverse'
      }} />

      {/* Main Footer Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.6s ease'
      }}>
        
        {/* Grid Cards Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          
          {/* Card 1: About VUMA */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '1.5rem',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255,255,255,0.1)',
            animation: isVisible ? 'fadeInUp 0.5s ease' : 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.borderColor = '#F9C74F';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#F9C74F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fas fa-leaf" style={{ color: '#07261e', fontSize: '1.2rem' }}></i>
              </div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                margin: 0
              }}>
                VUMA <span style={{ color: '#F9C74F' }}>TANZANIA</span>
              </h3>
            </div>
            <p style={{
              fontSize: '0.85rem',
              lineHeight: '1.6',
              opacity: 0.8,
              marginBottom: '1rem'
            }}>
              {footerCards[0].content}
            </p>
            {footerCards[0].items.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                fontSize: '0.8rem',
                opacity: 0.8
              }}>
                <i className={item.icon} style={{ color: '#F9C74F', width: '20px' }}></i>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Card 2: Quick Links */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '1.5rem',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255,255,255,0.1)',
            animation: isVisible ? 'fadeInUp 0.5s ease 0.1s' : 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.borderColor = '#F9C74F';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#F9C74F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fas fa-link" style={{ color: '#07261e', fontSize: '1.2rem' }}></i>
              </div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                margin: 0,
                color: '#F9C74F'
              }}>
                Quick Links
              </h3>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '0.5rem'
            }}>
              {footerCards[1].links.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    opacity: 0.8,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.3rem 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.color = '#F9C74F';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.8';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Card 3: Contact Info */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '1.5rem',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255,255,255,0.1)',
            animation: isVisible ? 'fadeInUp 0.5s ease 0.2s' : 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.borderColor = '#F9C74F';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#F9C74F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fas fa-address-card" style={{ color: '#07261e', fontSize: '1.2rem' }}></i>
              </div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                margin: 0,
                color: '#F9C74F'
              }}>
                Contact Info
              </h3>
            </div>
            {footerCards[2].contacts.map((contact, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                marginBottom: '0.8rem'
              }}>
                <i className={contact.icon} style={{ color: '#F9C74F', width: '25px', fontSize: '0.9rem' }}></i>
                {contact.link ? (
                  <a href={contact.link} style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    opacity: 0.8,
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#F9C74F'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
                    {contact.text}
                  </a>
                ) : (
                  <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{contact.text}</span>
                )}
              </div>
            ))}
            
            {/* Social Media Icons */}
            <div style={{
              display: 'flex',
              gap: '0.8rem',
              marginTop: '1rem',
              justifyContent: 'center'
            }}>
              {[
                { icon: 'fab fa-facebook-f', color: '#1877f2' },
                { icon: 'fab fa-twitter', color: '#1da1f2' },
                { icon: 'fab fa-instagram', color: '#e4405f' },
                { icon: 'fab fa-linkedin-in', color: '#0077b5' },
                { icon: 'fab fa-youtube', color: '#ff0000' }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  style={{
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = social.color;
                    e.currentTarget.style.transform = 'translateY(-3px) rotate(360deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
                  }}
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Card 4: Newsletter */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '1.5rem',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255,255,255,0.1)',
            animation: isVisible ? 'fadeInUp 0.5s ease 0.3s' : 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.borderColor = '#F9C74F';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#F9C74F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fas fa-envelope-open-text" style={{ color: '#07261e', fontSize: '1.2rem' }}></i>
              </div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                margin: 0,
                color: '#F9C74F'
              }}>
                Newsletter
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '1rem' }}>
              Subscribe to get updates on our programs and events.
            </p>
            <form onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '0.8rem',
                  outline: 'none',
                  marginBottom: '0.8rem'
                }}
                required
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#F9C74F',
                  color: '#07261e',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(249,199,79,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Subscribe Now
              </button>
            </form>
            <div style={{
              marginTop: '1rem',
              padding: '0.6rem',
              background: 'rgba(249,199,79,0.1)',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <i className="fas fa-camera" style={{ color: '#F9C74F', fontSize: '0.7rem', marginRight: '0.3rem' }}></i>
              <span style={{ fontSize: '0.7rem' }}>#VUMAYouth | Real-time updates</span>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div style={{
          margin: '1rem 0',
          padding: '1rem',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <h4 style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '0.8rem',
            color: '#F9C74F'
          }}>
            Our Trusted Partners
          </h4>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            {['UNDP', 'UNICEF', 'WWF', 'Greenpeace', 'Youth Alliance', 'UNEP'].map((partner, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.75rem',
                  opacity: 0.7,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.background = '#F9C74F';
                  e.currentTarget.style.color = '#07261e';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {partner}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar with Bolded Message */}
        <div style={{
          padding: '1rem 0 0',
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.8rem'
          }}>
            {/* Bolded Main Message */}
            <div style={{
              fontSize: 'clamp(0.85rem, 4vw, 1rem)',
              fontWeight: 800,
              color: 'white',
              textAlign: 'center',
              letterSpacing: '0.5px',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              background: 'rgba(249,199,79,0.1)',
              padding: '0.5rem 1rem',
              borderRadius: '50px',
              display: 'inline-block',
              marginBottom: '0.5rem'
            }}>
              VUMA Tanzania | Vijana Uongozi Ubunifu na Mazingira © 2026
            </div>
            
            {/* Subtitle */}
            <div style={{
              fontSize: 'clamp(0.75rem, 3.5vw, 0.85rem)',
              fontWeight: 700,
              color: '#F9C74F',
              textAlign: 'center',
              letterSpacing: '1px',
              marginBottom: '0.5rem'
            }}>
              Innovation | Leadership | Environment
            </div>
            
            {/* Legal Links */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              flexWrap: 'wrap', 
              justifyContent: 'center',
              fontSize: '0.7rem',
              opacity: 0.6
            }}>
              <Link to="/privacy" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#F9C74F'} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
                Privacy Policy
              </Link>
              <span>|</span>
              <Link to="/terms" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#F9C74F'} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
                Terms of Service
              </Link>
              <span>|</span>
              <Link to="/cookies" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#F9C74F'} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          background: '#F9C74F',
          border: 'none',
          color: '#07261e',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
          zIndex: 999,
          opacity: isVisible ? 1 : 0,
          animation: isVisible ? 'fadeInUp 0.5s ease 0.6s forwards' : 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        }}
      >
        <i className="fas fa-arrow-up"></i>
      </button>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(15px, -15px);
          }
          50% {
            transform: translate(-10px, 20px);
          }
          75% {
            transform: translate(10px, -10px);
          }
        }
        
        @media (max-width: 768px) {
          .footer-section {
            padding: 2rem 0.8rem 1rem;
          }
          
          div[style*="gridTemplateColumns"] {
            grid-templateColumns: 1fr !important;
            gap: 1rem !important;
          }
          
          button {
            bottom: 1rem !important;
            right: 1rem !important;
            width: 40px !important;
            height: 40px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;