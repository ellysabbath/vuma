import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import logo from '../assets/vuma.png';

const SignUp = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    fullName: '',
    email: '',
    // Step 2: Contact Information
    phone: '',
    dateOfBirth: '',
    // Step 3: Gender & Address
    gender: '',
    address: '',
    // Step 4: Role & Interests
    role: 'volunteer',
    interests: [],
    // Step 5: Location & Terms
    city: '',
    region: '',
    hearAbout: '',
    agreeTerms: false
  });
  
  const [errors, setErrors] = useState({});

  const interestsList = [
    'Leadership', 'Environment', 'Innovation', 
    'Volunteering', 'Mentorship', 'Climate Action'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'interests') {
        const updatedInterests = checked 
          ? [...formData.interests, value]
          : formData.interests.filter(item => item !== value);
        setFormData(prev => ({ ...prev, interests: updatedInterests }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validation for each step
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    else if (formData.fullName.length < 3) newErrors.fullName = 'Name must be at least 3 characters';
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.gender) newErrors.gender = 'Please select your gender';
    if (!formData.address) newErrors.address = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors = {};
    if (!formData.role) newErrors.role = 'Please select your role';
    if (formData.interests.length === 0) newErrors.interests = 'Please select at least one interest';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep5 = () => {
    const newErrors = {};
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms and conditions';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    if (currentStep === 2) isValid = validateStep2();
    if (currentStep === 3) isValid = validateStep3();
    if (currentStep === 4) isValid = validateStep4();
    if (currentStep === 5) isValid = validateStep5();
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep5()) return;
    
    setIsLoading(true);
    
    // Generate random 6-digit OTP
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save user data to localStorage (simulating database)
    const userData = {
      ...formData,
      otp: generatedOTP,
      isVerified: false,
      registeredAt: new Date().toISOString()
    };
    
    // Store in localStorage
    localStorage.setItem('vuma_temp_user', JSON.stringify(userData));
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      
      // In production, this would be sent via email
      alert(`Demo: Your OTP verification code is: ${generatedOTP}\n\nThis code would be sent to your email: ${formData.email}\n\nPlease save this code to login.`);
      
      // Navigate to OTP verification page
      navigate('/verify-otp', { state: { email: formData.email } });
    }, 1500);
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: 'Personal' },
      { number: 2, title: 'Contact' },
      { number: 3, title: 'Basic' },
      { number: 4, title: 'Interests' },
      { number: 5, title: 'Confirm' }
    ];
    
    return (
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          {steps.map((step, idx) => (
            <React.Fragment key={step.number}>
              <div style={{ textAlign: 'center', flex: 1, minWidth: '50px' }}>
                <div style={{
                  width: '35px',
                  height: '35px',
                  margin: '0 auto 0.3rem',
                  borderRadius: '50%',
                  background: currentStep >= step.number ? '#F9C74F' : '#e0e0e0',
                  color: currentStep >= step.number ? '#0B3B2F' : '#999',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}>
                  {step.number}
                </div>
                <div style={{
                  fontSize: '0.6rem',
                  color: currentStep >= step.number ? '#F9C74F' : '#999',
                  fontWeight: currentStep >= step.number ? 600 : 400
                }}>
                  {step.title}
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div style={{
                  flex: 0.5,
                  height: '2px',
                  background: currentStep > step.number ? '#F9C74F' : '#e0e0e0',
                  maxWidth: '20px'
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
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
            <h1 style={{ color: '#0B3B2F', fontSize: '1.5rem', marginBottom: '0.3rem' }}>Create Account</h1>
            <p style={{ color: '#666', fontSize: '0.8rem' }}>Join VUMA Tanzania community</p>
          </div>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="step-content" style={{ animation: 'fadeIn 0.3s ease' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1rem', textAlign: 'center' }}>
                  Tell us about yourself
                </h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                    Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-user" style={{
                      position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '0.9rem'
                    }}></i>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem 0.7rem 2.3rem',
                        borderRadius: '12px',
                        border: errors.fullName ? '1px solid #d32f2f' : '1px solid #ddd',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                    />
                  </div>
                  {errors.fullName && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.fullName}</p>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                    Email Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-envelope" style={{
                      position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '0.9rem'
                    }}></i>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem 0.7rem 2.3rem',
                        borderRadius: '12px',
                        border: errors.email ? '1px solid #d32f2f' : '1px solid #ddd',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                    />
                  </div>
                  {errors.email && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.email}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="step-content" style={{ animation: 'fadeIn 0.3s ease' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1rem', textAlign: 'center' }}>
                  How to reach you
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                    Phone Number *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-phone" style={{
                      position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '0.9rem'
                    }}></i>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem 0.7rem 2.3rem',
                        borderRadius: '12px',
                        border: errors.phone ? '1px solid #d32f2f' : '1px solid #ddd',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                    />
                  </div>
                  {errors.phone && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.phone}</p>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                    Date of Birth *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-calendar-alt" style={{
                      position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '0.9rem'
                    }}></i>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem 0.7rem 2.3rem',
                        borderRadius: '12px',
                        border: errors.dateOfBirth ? '1px solid #d32f2f' : '1px solid #ddd',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                    />
                  </div>
                  {errors.dateOfBirth && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.dateOfBirth}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Gender & Address */}
            {currentStep === 3 && (
              <div className="step-content" style={{ animation: 'fadeIn 0.3s ease' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1rem', textAlign: 'center' }}>
                  Basic Information
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                    Gender *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                    {['Male', 'Female', 'Other', 'Prefer not to say'].map(option => (
                      <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                        <input
                          type="radio"
                          name="gender"
                          value={option}
                          checked={formData.gender === option}
                          onChange={handleChange}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  {errors.gender && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.gender}</p>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your street address"
                    rows="2"
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      borderRadius: '12px',
                      border: errors.address ? '1px solid #d32f2f' : '1px solid #ddd',
                      fontSize: '0.9rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  />
                  {errors.address && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.address}</p>}
                </div>
              </div>
            )}

            {/* Step 4: Role & Interests */}
            {currentStep === 4 && (
              <div className="step-content" style={{ animation: 'fadeIn 0.3s ease' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1rem', textAlign: 'center' }}>
                  Your involvement
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                    I want to join as *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {[
                      { value: 'volunteer', label: 'Volunteer', icon: 'fas fa-hands-helping' },
                      { value: 'innovator', label: 'Innovator', icon: 'fas fa-lightbulb' },
                      { value: 'partner', label: 'Partner', icon: 'fas fa-handshake' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: option.value }))}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '12px',
                          border: formData.role === option.value ? '2px solid #F9C74F' : '1px solid #ddd',
                          background: formData.role === option.value ? 'rgba(249,199,79,0.1)' : 'white',
                          color: formData.role === option.value ? '#F9C74F' : '#666',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.7rem'
                        }}
                      >
                        <i className={option.icon} style={{ fontSize: '0.9rem' }}></i>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                  {errors.role && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.role}</p>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                    Areas of Interest *
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {interestsList.map(interest => (
                      <label key={interest} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                        <input
                          type="checkbox"
                          name="interests"
                          value={interest}
                          checked={formData.interests.includes(interest)}
                          onChange={handleChange}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>{interest}</span>
                      </label>
                    ))}
                  </div>
                  {errors.interests && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.interests}</p>}
                </div>
              </div>
            )}

            {/* Step 5: Location & Terms */}
            {currentStep === 5 && (
              <div className="step-content" style={{ animation: 'fadeIn 0.3s ease' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1rem', textAlign: 'center' }}>
                  Almost there!
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Your city"
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      borderRadius: '12px',
                      border: errors.city ? '1px solid #d32f2f' : '1px solid #ddd',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  />
                  {errors.city && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.city}</p>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                    Region *
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    placeholder="Your region"
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      borderRadius: '12px',
                      border: errors.region ? '1px solid #d32f2f' : '1px solid #ddd',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  />
                  {errors.region && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.region}</p>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                    How did you hear about us?
                  </label>
                  <select
                    name="hearAbout"
                    value={formData.hearAbout}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      borderRadius: '12px',
                      border: '1px solid #ddd',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: 'white'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                  >
                    <option value="">Select an option</option>
                    <option value="social_media">Social Media</option>
                    <option value="friend">Friend/Family</option>
                    <option value="event">Event</option>
                    <option value="website">Website</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      style={{ marginTop: '0.2rem', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#666' }}>
                      I agree to the{' '}
                      <Link to="/terms" style={{ color: '#F9C74F', textDecoration: 'none' }}>Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" style={{ color: '#F9C74F', textDecoration: 'none' }}>Privacy Policy</Link>
                    </span>
                  </label>
                  {errors.agreeTerms && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.agreeTerms}</p>}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
              marginTop: '2rem'
            }}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: '2px solid #F9C74F',
                    padding: '0.7rem',
                    borderRadius: '50px',
                    color: '#0B3B2F',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
                  Back
                </button>
              )}
              
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  style={{
                    flex: currentStep === 1 ? 1 : 2,
                    background: '#F9C74F',
                    border: 'none',
                    padding: '0.7rem',
                    borderRadius: '50px',
                    color: '#0B3B2F',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(249,199,79,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Continue
                  <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    flex: 2,
                    background: isLoading ? '#0B3B2F' : '#F9C74F',
                    border: 'none',
                    padding: '0.7rem',
                    borderRadius: '50px',
                    color: isLoading ? 'white' : '#0B3B2F',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease'
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
                      <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus" style={{ marginRight: '0.5rem' }}></i>
                      Create Account
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <p style={{ textAlign: 'center', color: '#666', fontSize: '0.75rem', marginTop: '1rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#F9C74F', textDecoration: 'none', fontWeight: 600 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default SignUp;