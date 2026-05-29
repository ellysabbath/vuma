import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import logo from '../assets/vuma.png';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      const users = localStorage.getItem('vuma_users');
      const verifiedUsers = users ? JSON.parse(users) : [];
      
      const user = verifiedUsers.find(u => u.email === email && u.isVerified === true);
      
      if (user) {
        localStorage.setItem('vuma_current_user', JSON.stringify({
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isLoggedIn: true,
          loginTime: new Date().toISOString()
        }));
        
        setIsLoading(false);
        alert(`Welcome back ${user.fullName}! Login successful.`);
        navigate('/');
      } else {
        const tempUser = localStorage.getItem('vuma_temp_user');
        if (tempUser) {
          const tempUserData = JSON.parse(tempUser);
          if (tempUserData.email === email) {
            setIsLoading(false);
            setError('Please verify your email address first.');
            navigate('/verify-otp', { state: { email: email } });
            return;
          }
        }
        
        setIsLoading(false);
        setError('No account found with this email. Please sign up first.');
      }
    }, 1500);
  };

  return (
    <div style={{ 
      paddingTop: '70px', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f9fbf7 0%, #f0f5ee 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{ 
        maxWidth: '450px', 
        width: '100%', 
        margin: '0 auto'
      }}>
        <div data-aos="fade-up" style={{
          background: 'white',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <img 
                src={logo} 
                alt="VUMA Tanzania Logo" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <h1 style={{ 
              color: '#0B3B2F', 
              fontSize: '24px', 
              marginBottom: '8px',
              fontWeight: 700
            }}>
              Welcome Back
            </h1>
            <p style={{ 
              color: '#666', 
              fontSize: '14px'
            }}>
              Sign in with your email address
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#333', 
                fontWeight: 600, 
                fontSize: '14px'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-envelope" style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                  fontSize: '14px'
                }}></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your registered email"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 44px',
                    borderRadius: '12px',
                    border: error ? '1px solid #d32f2f' : '1px solid #ddd',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                />
              </div>
              {error && (
                <p style={{ 
                  color: '#d32f2f', 
                  fontSize: '12px', 
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <i className="fas fa-exclamation-circle" style={{ fontSize: '11px' }}></i>
                  {error}
                </p>
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer',
                fontSize: '13px'
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span style={{ color: '#666' }}>Remember me</span>
              </label>
              <Link to="/resend-verification" style={{
                fontSize: '13px',
                color: '#F9C74F',
                textDecoration: 'none'
              }}>
                Didn't receive verification?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                background: isLoading ? '#0B3B2F' : '#F9C74F',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '10px',
                color: isLoading ? 'white' : '#0B3B2F',
                fontWeight: 600,
                fontSize: '15px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(249,199,79,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: '14px' }}></i>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt" style={{ fontSize: '14px' }}></i>
                  <span>Sign In</span>
                </>
              )}
            </button>

            <p style={{ 
              textAlign: 'center', 
              color: '#666', 
              fontSize: '13px',
              marginTop: '8px'
            }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#F9C74F', textDecoration: 'none', fontWeight: 600 }}>
                Create Account
              </Link>
            </p>
            
            <p style={{ 
              textAlign: 'center', 
              color: '#999', 
              fontSize: '11px', 
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <i className="fas fa-shield-alt" style={{ fontSize: '11px' }}></i>
              Secure login - No password required
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          input, button {
            -webkit-tap-highlight-color: transparent;
          }
          
          button:active {
            transform: scale(0.98) !important;
          }
          
          .form-container {
            padding: 20px !important;
          }
          
          h1 {
            font-size: 22px !important;
          }
          
          p {
            font-size: 12px !important;
          }
          
          button {
            padding: 10px 16px !important;
            font-size: 14px !important;
          }
          
          input {
            padding: 10px 16px 10px 40px !important;
            font-size: 13px !important;
          }
        }
        
        @media (min-width: 481px) and (max-width: 768px) {
          .form-container {
            padding: 28px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;