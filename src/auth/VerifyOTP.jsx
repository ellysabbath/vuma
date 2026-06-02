import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import logo from '../assets/vuma.png';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const otpArray = pastedData.split('');
    const newOtp = [...otp];
    for (let i = 0; i < 6 && i < otpArray.length; i++) {
      if (!isNaN(otpArray[i])) {
        newOtp[i] = otpArray[i];
      }
    }
    setOtp(newOtp);
    
    const lastFilledIndex = Math.min(otpArray.length - 1, 5);
    if (lastFilledIndex >= 0 && lastFilledIndex < 6) {
      inputRefs.current[lastFilledIndex].focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://vuma.pythonanywhere.com/api/auth/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpCode }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setSuccessMessage('Email verified successfully! Redirecting to dashboard...');
        setShowSuccess(true);
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.error || 'Invalid verification code. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('https://vuma.pythonanywhere.com/api/auth/resend-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('New verification code sent to your email!');
        setShowSuccess(true);
        setTimeLeft(300);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
        
        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setCanResend(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(data.error || 'Failed to resend code. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!email) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>No email provided</h2>
          <Link to="/signup" style={{ color: '#F9C74F' }}>Go back to Sign Up</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      paddingTop: '70px', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f9fbf7 0%, #f0f5ee 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: '3rem'
    }}>
      <div style={{ maxWidth: '500px', width: '100%', margin: '2rem auto', padding: '0 1rem' }}>
        <div data-aos="fade-up" style={{
          background: 'white',
          borderRadius: '32px',
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.5rem',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <img src={logo} alt="VUMA Tanzania Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h1 style={{ color: '#0B3B2F', fontSize: '1.5rem', marginBottom: '0.3rem' }}>Verify Your Email</h1>
            <p style={{ color: '#666', fontSize: '0.8rem' }}>We've sent a verification code to</p>
            <p style={{ color: '#F9C74F', fontWeight: 600, fontSize: '0.85rem', marginTop: '0.3rem', wordBreak: 'break-all' }}>
              {email}
            </p>
          </div>

          {/* Success Alert with Circle */}
          {showSuccess && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              animation: 'fadeInScale 0.3s ease'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                minWidth: '300px'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#4caf50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  animation: 'scaleIn 0.5s ease'
                }}>
                  <i className="fas fa-check" style={{ fontSize: '2.5rem', color: 'white' }}></i>
                </div>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>Success!</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>{successMessage}</p>
              </div>
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem', textAlign: 'center' }}>
              Enter 6-digit verification code
            </label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap' }} onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => inputRefs.current[index] = el}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={{
                    width: '60px',
                    height: '60px',
                    textAlign: 'center',
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    border: error ? '2px solid #d32f2f' : '2px solid #ddd',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#f9f9f9'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#F9C74F';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.backgroundColor = '#f9f9f9';
                  }}
                />
              ))}
            </div>
            {error && (
              <p style={{ color: '#d32f2f', fontSize: '0.75rem', textAlign: 'center', marginTop: '0.8rem' }}>
                <i className="fas fa-exclamation-circle" style={{ marginRight: '0.3rem' }}></i>
                {error}
              </p>
            )}
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            {!canResend ? (
              <p style={{ color: '#666', fontSize: '0.8rem' }}>
                Code expires in: <span style={{ color: '#F9C74F', fontWeight: 'bold' }}>{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={isLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#F9C74F',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Resend code
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleVerify}
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading ? '#0B3B2F' : '#F9C74F',
              border: 'none',
              padding: '0.7rem',
              borderRadius: '10px',
              color: isLoading ? 'white' : '#0B3B2F',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <i className="fas fa-check-circle"></i>
                <span>Verify Account</span>
              </>
            )}
          </button>

          <p style={{ textAlign: 'center', color: '#666', fontSize: '0.75rem', marginTop: '1rem' }}>
            Wrong email?{' '}
            <Link to="/signup" style={{ color: '#F9C74F', textDecoration: 'none', fontWeight: 600 }}>
              Back to Sign Up
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        
        @media (max-width: 480px) {
          input {
            width: 45px !important;
            height: 50px !important;
            font-size: 1.1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default VerifyOTP;