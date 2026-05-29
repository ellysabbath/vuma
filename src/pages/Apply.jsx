import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import logo from '../assets/vuma.png';

const Apply = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const programName = location.state?.programName || 'our program';
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    education: '',
    experience: '',
    motivation: '',
    hearAbout: '',
    agreeTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.gender) newErrors.gender = 'Please select your gender';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.education) newErrors.education = 'Please select your education level';
    if (!formData.motivation) newErrors.motivation = 'Please tell us why you want to join';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    if (currentStep === 2) isValid = validateStep2();
    if (isValid) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep3()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`✅ Application submitted successfully for ${programName}!\n\nWe will contact you soon.`);
      navigate('/programs');
    }, 1500);
  };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white',
        padding: '3rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 data-aos="fade-up" style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '0.5rem' }}>
            Apply for {programName}
          </h1>
          <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(0.85rem, 3vw, 1rem)', opacity: 0.9 }}>
            Complete the form below to start your journey with VUMA Tanzania
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div style={{ maxWidth: '550px', width: '100%', margin: '0 auto', padding: '2rem 1rem 3rem' }}>
        <div data-aos="fade-up" style={{
          background: 'white',
          borderRadius: '24px',
          padding: 'clamp(1.2rem, 5vw, 2rem)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          {/* Step Indicator */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              {[1, 2, 3].map(step => (
                <div key={step} style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    width: 'clamp(32px, 10vw, 38px)',
                    height: 'clamp(32px, 10vw, 38px)',
                    margin: '0 auto 0.3rem',
                    borderRadius: '50%',
                    background: currentStep >= step ? '#F9C74F' : '#e0e0e0',
                    color: currentStep >= step ? '#0B3B2F' : '#999',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: 'clamp(0.9rem, 4vw, 1rem)'
                  }}>{step}</div>
                  <div style={{ fontSize: 'clamp(0.55rem, 2.5vw, 0.65rem)', color: currentStep >= step ? '#F9C74F' : '#999' }}>
                    {step === 1 ? 'Personal' : step === 2 ? 'Address' : 'Application'}
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              height: '4px',
              background: '#e0e0e0',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(currentStep - 1) * 50}%`,
                height: '100%',
                background: '#F9C74F',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1.2rem', fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>
                  <i className="fas fa-user" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  Personal Information
                </h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: 'clamp(0.8rem, 3.5vw, 0.85rem)' }}>
                    Full Name <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    placeholder="Enter your full name"
                    style={{ 
                      width: '100%', 
                      padding: 'clamp(0.7rem, 4vw, 0.8rem)', 
                      borderRadius: '12px', 
                      border: errors.fullName ? '2px solid #d32f2f' : '1px solid #ddd',
                      fontSize: 'clamp(0.85rem, 4vw, 1rem)',
                      transition: 'border-color 0.3s ease'
                    }} 
                  />
                  {errors.fullName && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.fullName}</p>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: 'clamp(0.8rem, 3.5vw, 0.85rem)' }}>
                    Email Address <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="Enter your email"
                    style={{ 
                      width: '100%', 
                      padding: 'clamp(0.7rem, 4vw, 0.8rem)', 
                      borderRadius: '12px', 
                      border: errors.email ? '2px solid #d32f2f' : '1px solid #ddd',
                      fontSize: 'clamp(0.85rem, 4vw, 1rem)'
                    }} 
                  />
                  {errors.email && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.email}</p>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: 'clamp(0.8rem, 3.5vw, 0.85rem)' }}>
                    Phone Number <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="Enter your phone number"
                    style={{ 
                      width: '100%', 
                      padding: 'clamp(0.7rem, 4vw, 0.8rem)', 
                      borderRadius: '12px', 
                      border: errors.phone ? '2px solid #d32f2f' : '1px solid #ddd',
                      fontSize: 'clamp(0.85rem, 4vw, 1rem)'
                    }} 
                  />
                  {errors.phone && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.phone}</p>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: 'clamp(0.8rem, 3.5vw, 0.85rem)' }}>
                    Date of Birth <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <input 
                    type="date" 
                    name="dateOfBirth" 
                    value={formData.dateOfBirth} 
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      padding: 'clamp(0.7rem, 4vw, 0.8rem)', 
                      borderRadius: '12px', 
                      border: errors.dateOfBirth ? '2px solid #d32f2f' : '1px solid #ddd',
                      fontSize: 'clamp(0.85rem, 4vw, 1rem)'
                    }} 
                  />
                  {errors.dateOfBirth && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.dateOfBirth}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Address Information */}
            {currentStep === 2 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1.2rem', fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>
                  <i className="fas fa-location-dot" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  Address Information
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: 'clamp(0.8rem, 3.5vw, 0.85rem)' }}>
                    Gender <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {['Male', 'Female', 'Other'].map(option => (
                      <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="gender" 
                          value={option} 
                          checked={formData.gender === option} 
                          onChange={handleChange}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span style={{ fontSize: 'clamp(0.8rem, 3.5vw, 0.85rem)' }}>{option}</span>
                      </label>
                    ))}
                  </div>
                  {errors.gender && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.gender}</p>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: 'clamp(0.8rem, 3.5vw, 0.85rem)' }}>
                    Address <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <textarea 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    rows="2" 
                    placeholder="Your street address"
                    style={{ 
                      width: '100%', 
                      padding: 'clamp(0.7rem, 4vw, 0.8rem)', 
                      borderRadius: '12px', 
                      border: errors.address ? '2px solid #d32f2f' : '1px solid #ddd',
                      fontSize: 'clamp(0.85rem, 4vw, 1rem)',
                      resize: 'vertical'
                    }} 
                  />
                  {errors.address && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.address}</p>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: 'clamp(0.8rem, 3.5vw, 0.85rem)' }}>
                    City <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    placeholder="Your city"
                    style={{ 
                      width: '100%', 
                      padding: 'clamp(0.7rem, 4vw, 0.8rem)', 
                      borderRadius: '12px', 
                      border: errors.city ? '2px solid #d32f2f' : '1px solid #ddd',
                      fontSize: 'clamp(0.85rem, 4vw, 1rem)'
                    }} 
                  />
                  {errors.city && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.city}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Application Details */}
            {currentStep === 3 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1.2rem', fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>
                  <i className="fas fa-file-alt" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  Application Details
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: 'clamp(0.8rem, 3.5vw, 0.85rem)' }}>
                    Education Level <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <select 
                    name="education" 
                    value={formData.education} 
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      padding: 'clamp(0.7rem, 4vw, 0.8rem)', 
                      borderRadius: '12px', 
                      border: errors.education ? '2px solid #d32f2f' : '1px solid #ddd',
                      fontSize: 'clamp(0.85rem, 4vw, 1rem)',
                      backgroundColor: 'white'
                    }}>
                    <option value="">Select education level</option>
                    <option>High School</option>
                    <option>Bachelor's Degree</option>
                    <option>Master's Degree</option>
                    <option>PhD</option>
                    <option>Other</option>
                  </select>
                  {errors.education && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.education}</p>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: 'clamp(0.8rem, 3.5vw, 0.85rem)' }}>
                    Relevant Experience
                  </label>
                  <textarea 
                    name="experience" 
                    value={formData.experience} 
                    onChange={handleChange} 
                    rows="2" 
                    placeholder="Tell us about any relevant experience"
                    style={{ 
                      width: '100%', 
                      padding: 'clamp(0.7rem, 4vw, 0.8rem)', 
                      borderRadius: '12px', 
                      border: '1px solid #ddd',
                      fontSize: 'clamp(0.85rem, 4vw, 1rem)',
                      resize: 'vertical'
                    }} 
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: 'clamp(0.8rem, 3.5vw, 0.85rem)' }}>
                    Why do you want to join? <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <textarea 
                    name="motivation" 
                    value={formData.motivation} 
                    onChange={handleChange} 
                    rows="3" 
                    placeholder="Tell us why you're interested in this program"
                    style={{ 
                      width: '100%', 
                      padding: 'clamp(0.7rem, 4vw, 0.8rem)', 
                      borderRadius: '12px', 
                      border: errors.motivation ? '2px solid #d32f2f' : '1px solid #ddd',
                      fontSize: 'clamp(0.85rem, 4vw, 1rem)',
                      resize: 'vertical'
                    }} 
                  />
                  {errors.motivation && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.motivation}</p>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: 'clamp(0.8rem, 3.5vw, 0.85rem)' }}>
                    How did you hear about us?
                  </label>
                  <select 
                    name="hearAbout" 
                    value={formData.hearAbout} 
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      padding: 'clamp(0.7rem, 4vw, 0.8rem)', 
                      borderRadius: '12px', 
                      border: '1px solid #ddd',
                      fontSize: 'clamp(0.85rem, 4vw, 1rem)',
                      backgroundColor: 'white'
                    }}>
                    <option value="">Select an option</option>
                    <option>Social Media</option>
                    <option>Friend/Family</option>
                    <option>Event</option>
                    <option>Website</option>
                    <option>Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      name="agreeTerms" 
                      checked={formData.agreeTerms} 
                      onChange={handleChange} 
                      style={{ marginTop: '0.2rem', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: 'clamp(0.75rem, 3.5vw, 0.8rem)', color: '#666' }}>
                      I agree to the Terms of Service and Privacy Policy <span style={{ color: '#d32f2f' }}>*</span>
                    </span>
                  </label>
                  {errors.agreeTerms && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.agreeTerms}</p>}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '2rem' }}>
              {currentStep > 1 && (
                <button 
                  type="button" 
                  onClick={handleBack} 
                  style={{ 
                    flex: 1,
                    background: 'transparent', 
                    border: '2px solid #F9C74F', 
                    padding: 'clamp(0.6rem, 3.5vw, 0.7rem)', 
                    borderRadius: '50px', 
                    color: '#0B3B2F', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    fontSize: 'clamp(0.8rem, 3.5vw, 0.9rem)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <i className="fas fa-arrow-left"></i> Back
                </button>
              )}
              {currentStep < 3 ? (
                <button 
                  type="button" 
                  onClick={handleNext} 
                  style={{ 
                    flex: currentStep === 1 ? 1 : 2,
                    background: '#F9C74F', 
                    border: 'none', 
                    padding: 'clamp(0.6rem, 3.5vw, 0.7rem)', 
                    borderRadius: '50px', 
                    color: '#0B3B2F', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    fontSize: 'clamp(0.8rem, 3.5vw, 0.9rem)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
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
                  Continue <i className="fas fa-arrow-right"></i>
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  style={{ 
                    flex: 2,
                    background: isSubmitting ? '#0B3B2F' : '#F9C74F', 
                    border: 'none', 
                    padding: 'clamp(0.6rem, 3.5vw, 0.7rem)', 
                    borderRadius: '50px', 
                    color: isSubmitting ? 'white' : '#0B3B2F', 
                    fontWeight: 600, 
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontSize: 'clamp(0.8rem, 3.5vw, 0.9rem)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
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
                      <i className="fas fa-spinner fa-spin"></i>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Submit Application
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        input:focus, textarea:focus, select:focus {
          border-color: #F9C74F !important;
          outline: none;
          box-shadow: 0 0 0 2px rgba(249,199,79,0.1);
        }
        
        @media (max-width: 480px) {
          input, textarea, select, button {
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Apply;