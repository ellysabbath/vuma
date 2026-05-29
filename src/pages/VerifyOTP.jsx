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

  const handleVerify = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const tempUser = localStorage.getItem('vuma_temp_user');
      
      if (tempUser) {
        const userData = JSON.parse(tempUser);
        
        if (userData.otp === otpCode) {
          const verifiedUser = {
            ...userData,
            isVerified: true,
            verifiedAt: new Date().toISOString()
          };
          
          const existingUsers = localStorage.getItem('vuma_users');
          const users = existingUsers ? JSON.parse(existingUsers) : [];
          users.push(verifiedUser);
          localStorage.setItem('vuma_users', JSON.stringify(users));
          
          localStorage.setItem('vuma_current_user', JSON.stringify({
            email: userData.email,
            fullName: userData.fullName,
            role: userData.role,
            isLoggedIn: true,
            loginTime: new Date().toISOString()
          }));
          
          localStorage.removeItem('vuma_temp_user');
          
          setIsLoading(false);
          alert(`Welcome ${userData.fullName}! Your account has been verified.`);
          navigate('/');
        } else {
          setIsLoading(false);
          setError('Invalid verification code. Please try again.');
        }
      } else {
        setIsLoading(false);
        setError('Session expired. Please register again.');
      }
    }, 1500);
  };

  const handleResendOtp = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const tempUser = localStorage.getItem('vuma_temp_user');
      if (tempUser) {
        const userData = JSON.parse(tempUser);
        const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
        userData.otp = newOTP;
        localStorage.setItem('vuma_temp_user', JSON.stringify(userData));
        
        alert(`New verification code: ${newOTP}\n\nThis would be sent to ${userData.email}`);
      }
      
      setIsLoading(false);
      setTimeLeft(300);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      
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
      
      inputRefs.current[0].focus();
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
          {/* Logo Section */}
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
            <h1 style={{ color: '#0B3B2F', fontSize: '1.5rem', marginBottom: '0.3rem' }}>Verify Your Email</h1>
            <p style={{ color: '#666', fontSize: '0.8rem' }}>We've sent a verification code to</p>
            <p style={{ color: '#F9C74F', fontWeight: 600, fontSize: '0.85rem', marginTop: '0.3rem', wordBreak: 'break-all' }}>
              {email || 'your email address'}
            </p>
          </div>

          {/* OTP Input Fields */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem', textAlign: 'center' }}>
              Enter 6-digit verification code
            </label>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.8rem',
              flexWrap: 'wrap'
            }}
            onPaste={handlePaste}>
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

          {/* Timer and Resend */}
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

          {/* Verify Button - Short text to prevent overflow */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={isLoading}
            style={{
              width: '80%',
              background: isLoading ? '#0B3B2F' : '#F9C74F',
              border: 'none',
              padding: '0.7rem',
              borderRadius: '10px',
              color: isLoading ? 'white' : '#0B3B2F',
              fontWeight: 600,
              fontSize: '0.7rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
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
                <i className="fas fa-spinner fa-spin"></i>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <i className="fas fa-check-circle"></i>
                <span>Verify</span>
              </>
            )}
          </button>

          {/* Back to Sign Up */}
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
        
        @media (max-width: 480px) {
          input {
            width: 45px !important;
            height: 50px !important;
            font-size: 1.1rem !important;
          }
          
          .otp-container {
            gap: 0.5rem !important;
          }
          
          button {
            padding: 0.6rem !important;
            font-size: 0.85rem !important;
          }
        }
        
        @media (max-width: 380px) {
          input {
            width: 40px !important;
            height: 45px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default VerifyOTP;