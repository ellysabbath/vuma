import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = selectedAmount || customAmount;
    if (!amount) {
      alert('Please select or enter a donation amount');
      return;
    }
    if (!name || !email) {
      alert('Please enter your name and email');
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      alert(`Thank you for your ${donationType} donation of $${amount}! Your support means the world to us.`);
      setIsSubmitting(false);
      // Reset form
      setSelectedAmount(null);
      setCustomAmount('');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1500);
  };

  const impactStats = [
    { value: '10,000+', label: 'Youth Reached', icon: 'fas fa-users' },
    { value: '18,750', label: 'Trees Planted', icon: 'fas fa-tree' },
    { value: '50+', label: 'Projects Completed', icon: 'fas fa-project-diagram' },
    { value: '20+', label: 'Community Partners', icon: 'fas fa-handshake' }
  ];

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(249,199,79,0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(249,199,79,0.08) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 data-aos="fade-up" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>
            Support Our Mission
          </h1>
          <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', opacity: 0.9 }}>
            Your donation helps empower youth, protect the environment, and build sustainable communities across Tanzania.
          </p>
        </div>
      </div>

      {/* Impact Stats */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {impactStats.map((stat, idx) => (
            <div key={idx} data-aos="zoom-in" data-aos-delay={idx * 100} style={{
              background: 'white',
              borderRadius: '20px',
              padding: '1.5rem',
              textAlign: 'center',
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <i className={stat.icon} style={{ fontSize: '2rem', color: '#F9C74F', marginBottom: '0.5rem' }}></i>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0B3B2F' }}>{stat.value}</div>
              <div style={{ color: '#666', fontSize: '0.85rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Donation Form */}
        <div data-aos="fade-up" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Donation Form Card */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>Make a Donation</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Your contribution will make a real difference</p>

            <form onSubmit={handleSubmit}>
              {/* Donation Type */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>Donation Type</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setDonationType('one-time')}
                    style={{
                      flex: 1,
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: donationType === 'one-time' ? '2px solid #F9C74F' : '1px solid #ddd',
                      background: donationType === 'one-time' ? 'rgba(249,199,79,0.1)' : 'white',
                      color: donationType === 'one-time' ? '#F9C74F' : '#666',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    One-Time
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationType('monthly')}
                    style={{
                      flex: 1,
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: donationType === 'monthly' ? '2px solid #F9C74F' : '1px solid #ddd',
                      background: donationType === 'monthly' ? 'rgba(249,199,79,0.1)' : 'white',
                      color: donationType === 'monthly' ? '#F9C74F' : '#666',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Donation Amount */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>Select Amount (USD)</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                  gap: '0.8rem',
                  marginBottom: '1rem'
                }}>
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountSelect(amount)}
                      style={{
                        padding: '0.8rem',
                        borderRadius: '12px',
                        border: selectedAmount === amount ? '2px solid #F9C74F' : '1px solid #ddd',
                        background: selectedAmount === amount ? 'rgba(249,199,79,0.1)' : 'white',
                        color: selectedAmount === amount ? '#F9C74F' : '#333',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Other amount (USD)"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                />
              </div>

              {/* Personal Information */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>Your Information</label>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    marginBottom: '1rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    marginBottom: '1rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                />
                <input
                  type="tel"
                  placeholder="Phone Number (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: '1.5rem' }}>
                <textarea
                  placeholder="Leave a message (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  background: isSubmitting ? '#0B3B2F' : '#F9C74F',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '50px',
                  color: isSubmitting ? 'white' : '#0B3B2F',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: isSubmitting ? 0.7 : 1
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
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-heart" style={{ marginRight: '0.5rem' }}></i>
                    Donate Now
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Why Donate Section */}
          <div data-aos="fade-up" data-aos-delay="200">
            <div style={{
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
              borderRadius: '24px',
              padding: '2rem',
              color: 'white',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ marginBottom: '1rem' }}>Why Donate to VUMA?</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {[
                  '100% of donations go directly to programs',
                  'Transparent reporting on impact',
                  'Tax-deductible receipts provided',
                  'Support youth-led initiatives',
                  'Help combat climate change',
                  'Empower local communities'
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                    <i className="fas fa-check-circle" style={{ color: '#F9C74F' }}></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
              textAlign: 'center'
            }}>
              <i className="fas fa-hand-holding-heart" style={{ fontSize: '3rem', color: '#F9C74F', marginBottom: '1rem' }}></i>
              <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>Other Ways to Give</h3>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Contact us for bank transfers, corporate partnerships, or legacy giving.
              </p>
              <Link to="/contact" style={{
                color: '#F9C74F',
                textDecoration: 'none',
                fontWeight: 600
              }}>
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ background: '#f0f5ee', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 data-aos="fade-up" style={{ color: '#0B3B2F', marginBottom: '2rem' }}>What Donors Say</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { text: "I've seen firsthand how VUMA transforms communities. My donation is making a real difference.", author: "Sarah M.", location: "United States" },
              { text: "Supporting VUMA is the best investment I've made in Africa's future. Their youth programs are exceptional.", author: "James K.", location: "United Kingdom" },
              { text: "VUMA's transparency and impact reporting gives me confidence that my contribution is well used.", author: "Maria G.", location: "Germany" }
            ].map((testimonial, idx) => (
              <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100} style={{
                background: 'white',
                borderRadius: '20px',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
              }}>
                <i className="fas fa-quote-left" style={{ fontSize: '2rem', color: '#F9C74F', opacity: 0.5, marginBottom: '1rem' }}></i>
                <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '1rem' }}>"{testimonial.text}"</p>
                <h4 style={{ color: '#0B3B2F', marginBottom: '0.2rem' }}>{testimonial.author}</h4>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>{testimonial.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;