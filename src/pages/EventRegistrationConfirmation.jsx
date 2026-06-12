import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const EventRegistrationConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const API_BASE_URL = 'https://vuma.pythonanywhere.com';

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    window.scrollTo(0, 0);
    
    if (location.state?.registrationData) {
      setRegistration(location.state.registrationData);
      setLoading(false);
    } else if (id) {
      fetchRegistrationDetails();
    } else {
      setLoading(false);
    }
  }, [id, location.state]);

  const fetchRegistrationDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/event/api/registrations/${id}/`);
      if (!response.ok) throw new Error('Registration not found');
      const data = await response.json();
      setRegistration(data);
    } catch (error) {
      console.error('Error fetching registration:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', margin: '0 auto', border: '3px solid rgba(11,59,47,0.1)', borderTopColor: '#0B3B2F', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white', padding: '3rem 1.5rem', textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div data-aos="fade-up" style={{
            width: '80px', height: '80px', background: '#10b981', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
          }}>
            <i className="fas fa-check" style={{ fontSize: '2.5rem', color: 'white' }}></i>
          </div>
          <h1 data-aos="fade-up" style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '0.5rem' }}>
            Registration Confirmed!
          </h1>
          <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(0.85rem, 3vw, 1rem)', opacity: 0.9 }}>
            You have successfully registered for {location.state?.eventName || registration?.event?.title || 'the event'}
          </p>
          <p data-aos="fade-up" data-aos-delay="300" style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.5rem' }}>
            Registration ID: #{id}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 1rem' }}>
        <div data-aos="fade-up" style={{
          background: 'white', borderRadius: '24px', padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center'
        }}>
          <i className="fas fa-envelope" style={{ fontSize: '3rem', color: '#F9C74F', marginBottom: '1rem' }}></i>
          <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>What happens next?</h3>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>
            A confirmation email has been sent to your registered email address with event details.
          </p>
          
          {registration && (
            <div style={{
              background: '#f8fafc', padding: '1.5rem', borderRadius: '12px',
              textAlign: 'left', marginBottom: '1.5rem'
            }}>
              <h4 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1rem' }}>
                <i className="fas fa-info-circle" style={{ color: '#F9C74F', marginRight: '0.5rem' }}></i>
                Registration Summary:
              </h4>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                  <strong>Event:</strong> <span>{registration.event?.title || location.state?.eventName}</span>
                </p>
                <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                  <strong>Full Name:</strong> <span>{registration.full_name}</span>
                </p>
                <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                  <strong>Email:</strong> <span>{registration.email}</span>
                </p>
                <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Registration Date:</strong> <span>{new Date(registration.registration_date).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/events')} style={{
              background: '#F9C74F', border: 'none', padding: '0.75rem 1.5rem',
              borderRadius: '40px', color: '#0B3B2F', fontWeight: 600, cursor: 'pointer'
            }}>
              <i className="fas fa-calendar-alt"></i> Browse More Events
            </button>
            <button onClick={() => navigate('/')} style={{
              background: 'transparent', border: '2px solid #0B3B2F',
              padding: '0.75rem 1.5rem', borderRadius: '40px', color: '#0B3B2F',
              fontWeight: 600, cursor: 'pointer'
            }}>
              <i className="fas fa-home"></i> Go Home
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EventRegistrationConfirmation;