import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import logo from '../assets/vuma.png';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = [];

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    
    const rememberedEmail = localStorage.getItem('remember_email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (step === 'otp' && !canResend) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, canResend]);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    
    if (value && index < 5) {
      inputRefs[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1]?.focus();
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
      inputRefs[lastFilledIndex]?.focus();
    }
  };

  const handleEmailSubmit = async () => {
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
    
    try {
      const response = await fetch('http://192.168.137.83:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStep('otp');
        setTimeLeft(300);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        setSuccessMessage('Verification code sent to your email!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else if (data.requires_verification) {
        setError('Please verify your email first. Check your inbox for OTP.');
        setTimeout(() => {
          navigate('/verify-otp', { state: { email } });
        }, 2000);
      } else {
        setError(data.error || 'Login failed. Please sign up first.');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://192.168.137.83:8000/api/auth/verify-login-otp/', {
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
        
        if (rememberMe) {
          localStorage.setItem('remember_email', email);
        } else {
          localStorage.removeItem('remember_email');
        }
        
        setSuccessMessage(`Welcome back ${data.user.first_name || data.user.username}!`);
        setShowSuccess(true);
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.error || 'Invalid verification code');
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
      const response = await fetch('http://192.168.137.83:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTimeLeft(300);
        setCanResend(false);
        setError('');
        setSuccessMessage('New OTP has been sent to your email!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
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
        setError(data.error || 'Failed to resend OTP');
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEmailSubmit();
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #D4D7D6 0%, #D4D7D6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(12px, 4vw, 24px)'
    }}>
      <div style={{ 
        maxWidth: 'min(500px, 100%)', 
        width: '100%', 
        margin: '0 auto'
      }}>
        <div data-aos="fade-up" style={{
          background: 'white',
          borderRadius: 'clamp(24px, 5vw, 40px)',
          padding: 'clamp(24px, 6vw, 48px) clamp(20px, 5vw, 32px)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 6vw, 40px)' }}>
            <div style={{
              width: 'clamp(80px, 20vw, 110px)',
              height: 'clamp(80px, 20vw, 110px)',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f0f5ee, #e8f3e4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
            }}>
              <img 
                src={logo} 
                alt="VUMA Tanzania Logo" 
                style={{ 
                  width: '70%', 
                  height: '70%', 
                  objectFit: 'contain',
                  borderRadius: '50%'
                }} 
              />
            </div>
            <h1 style={{ 
              color: '#0B3B2F', 
              fontSize: 'clamp(26px, 6vw, 34px)', 
              marginBottom: '8px', 
              fontWeight: 800,
              letterSpacing: '-0.5px'
            }}>
              {step === 'email' ? 'Welcome Back!' : 'Verify Email'}
            </h1>
            <p style={{ 
              color: '#6b7280', 
              fontSize: 'clamp(13px, 3.5vw, 15px)',
              lineHeight: '1.5'
            }}>
              {step === 'email' 
                ? 'Enter your email to receive a verification code' 
                : `We've sent a code to ${email}`}
            </p>
          </div>

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
                borderRadius: '24px',
                padding: 'clamp(20px, 5vw, 32px)',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                minWidth: 'min(300px, 85vw)'
              }}>
                <div style={{
                  width: 'clamp(65px, 15vw, 85px)',
                  height: 'clamp(65px, 15vw, 85px)',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4caf50, #45a049)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  animation: 'scaleIn 0.5s ease'
                }}>
                  <i className="fas fa-check" style={{ fontSize: 'clamp(28px, 6vw, 36px)', color: 'white' }}></i>
                </div>
                <h3 style={{ color: '#0B3B2F', marginBottom: '8px', fontSize: 'clamp(18px, 4.5vw, 22px)' }}>Success!</h3>
                <p style={{ color: '#6b7280', fontSize: 'clamp(12px, 3.5vw, 14px)' }}>{successMessage}</p>
              </div>
            </div>
          )}

          {error && (
            <div style={{
              background: '#fef2f2',
              color: '#dc2626',
              padding: 'clamp(12px, 3vw, 14px)',
              borderRadius: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: 'clamp(12px, 3.5vw, 14px)',
              borderLeft: '4px solid #dc2626'
            }}>
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          {step === 'email' ? (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '10px', 
                  color: '#374151', 
                  fontWeight: 600, 
                  fontSize: 'clamp(13px, 3.5vw, 14px)'
                }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-envelope" style={{
                    position: 'absolute',
                    left: 'clamp(16px, 4vw, 20px)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#0B3B2F',
                    fontSize: 'clamp(16px, 4vw, 18px)',
                    opacity: 0.6
                  }}></i>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="your@email.com"
                    style={{
                      width: '100%',
                      padding: 'clamp(16px, 4vw, 20px) clamp(16px, 4vw, 20px) clamp(16px, 4vw, 20px) clamp(45px, 11vw, 55px)',
                      borderRadius: '20px',
                      border: '2px solid #e5e7eb',
                      fontSize: 'clamp(14px, 3.5vw, 16px)',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      backgroundColor: '#f9fafb'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#F9C74F';
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,199,79,0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '28px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer', 
                  fontSize: 'clamp(12px, 3.5vw, 14px)'
                }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ 
                      width: 'clamp(16px, 4vw, 18px)', 
                      height: 'clamp(16px, 4vw, 18px)', 
                      cursor: 'pointer',
                      accentColor: '#F9C74F'
                    }}
                  />
                  <span style={{ color: '#6b7280' }}>Remember me</span>
                </label>
                <Link to="/signup" style={{
                  fontSize: 'clamp(12px, 3.5vw, 14px)',
                  color: '#F9C74F',
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'opacity 0.3s'
                }}>
                  Create Account →
                </Link>
              </div>

              <div
                onClick={handleEmailSubmit}
                style={{
                  width: '100%',
                  background: isLoading ? '#1a5c48' : 'linear-gradient(135deg, #F9C74F, #f8b500)',
                  padding: 'clamp(14px, 4vw, 18px)',
                  borderRadius: '50px',
                  color: '#0B3B2F',
                  fontWeight: 700,
                  fontSize: 'clamp(14px, 4vw, 16px)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(249,199,79,0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(249,199,79,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(249,199,79,0.3)';
                }}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}></i>
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane" style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}></i>
                    <span>Send Code</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '28px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  color: '#374151', 
                  fontWeight: 600, 
                  fontSize: 'clamp(13px, 3.5vw, 14px)',
                  textAlign: 'center'
                }}>
                  Enter 6-digit verification code
                </label>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 'clamp(8px, 2.5vw, 12px)',
                  flexWrap: 'wrap'
                }} onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => inputRefs[index] = el}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      style={{
                        width: 'clamp(55px, 13vw, 70px)',
                        height: 'clamp(55px, 13vw, 70px)',
                        textAlign: 'center',
                        fontSize: 'clamp(22px, 5vw, 28px)',
                        fontWeight: 'bold',
                        borderRadius: '16px',
                        border: error ? '2px solid #dc2626' : '2px solid #e5e7eb',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        backgroundColor: '#f9fafb'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#F9C74F';
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,199,79,0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                {!canResend ? (
                  <p style={{ color: '#6b7280', fontSize: 'clamp(12px, 3.5vw, 14px)' }}>
                    <i className="fas fa-clock" style={{ marginRight: '6px' }}></i>
                    Code expires in: <span style={{ color: '#F9C74F', fontWeight: 'bold' }}>{formatTime(timeLeft)}</span>
                  </p>
                ) : (
                  <div
                    onClick={handleResendOtp}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#F9C74F',
                      fontWeight: 600,
                      fontSize: 'clamp(12px, 3.5vw, 14px)',
                      cursor: 'pointer',
                      transition: 'opacity 0.3s'
                    }}
                  >
                    <i className="fas fa-redo-alt"></i>
                    Resend code
                  </div>
                )}
              </div>

              <div
                onClick={handleVerifyOTP}
                style={{
                  width: '100%',
                  background: isLoading ? '#1a5c48' : 'linear-gradient(135deg, #F9C74F, #f8b500)',
                  padding: 'clamp(14px, 4vw, 18px)',
                  borderRadius: '50px',
                  color: '#0B3B2F',
                  fontWeight: 700,
                  fontSize: 'clamp(14px, 4vw, 16px)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(249,199,79,0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(249,199,79,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(249,199,79,0.3)';
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
                    <span>Verify & Login</span>
                  </>
                )}
              </div>

              <div
                onClick={() => {
                  setStep('email');
                  setError('');
                  setOtp(['', '', '', '', '', '']);
                }}
                style={{
                  width: '100%',
                  textAlign: 'center',
                  color: '#9ca3af',
                  fontSize: 'clamp(12px, 3.5vw, 14px)',
                  cursor: 'pointer',
                  transition: 'color 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0B3B2F'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                <i className="fas fa-arrow-left"></i>
                Back to email
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
};

export default Login;