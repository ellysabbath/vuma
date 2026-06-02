import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import logo from '../assets/vuma.png';

const SignUp = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    region: '',
    role: 'volunteer',
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    
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
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.region) newErrors.region = 'Region is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    if (currentStep === 2) isValid = validateStep2();
    if (currentStep === 3) isValid = validateStep3();
    if (currentStep === 4) isValid = validateStep4();
    
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
    
    if (!validateStep4()) return;
    
    setIsLoading(true);
    setApiError('');
    
    const submitData = {
      username: formData.username,
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,
      date_of_birth: formData.date_of_birth,
      gender: formData.gender.charAt(0),
      address: formData.address,
      city: formData.city,
      region: formData.region,
      role: formData.role,
    };
    
    try {
      const response = await fetch('https://vuma.pythonanywhere.com/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        navigate('/verify-otp', { state: { email: formData.email } });
      } else {
        if (data.errors) {
          const fieldErrors = {};
          Object.keys(data.errors).forEach(key => {
            fieldErrors[key] = data.errors[key][0];
          });
          setErrors(fieldErrors);
          setCurrentStep(1);
        } else {
          setApiError(data.message || 'Registration failed. Please try again.');
        }
      }
    } catch (error) {
      setApiError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: 'Account' },
      { number: 2, title: 'Personal' },
      { number: 3, title: 'Basic' },
      { number: 4, title: 'Location' },
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
                }}>
                  {step.number}
                </div>
                <div style={{
                  fontSize: '0.6rem',
                  color: currentStep >= step.number ? '#F9C74F' : '#999',
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
            <h1 style={{ color: '#0B3B2F', fontSize: '1.5rem', marginBottom: '0.3rem' }}>Create Account</h1>
            <p style={{ color: '#666', fontSize: '0.8rem' }}>Join VUMA Tanzania community</p>
          </div>

          {renderStepIndicator()}

          {apiError && (
            <div style={{ background: '#ffebee', color: '#d32f2f', padding: '0.7rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.8rem', textAlign: 'center' }}>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1rem', textAlign: 'center' }}>
                  Create your account
                </h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                    Username *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-user" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }}></i>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem 0.7rem 2.3rem',
                        borderRadius: '12px',
                        border: errors.username ? '1px solid #d32f2f' : '1px solid #ddd',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                  {errors.username && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.username}</p>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                    Email Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-envelope" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }}></i>
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
                        outline: 'none',
                      }}
                    />
                  </div>
                  {errors.email && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.email}</p>}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1rem', textAlign: 'center' }}>
                  Personal Information
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Your first name"
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      borderRadius: '12px',
                      border: errors.first_name ? '1px solid #d32f2f' : '1px solid #ddd',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                  {errors.first_name && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.first_name}</p>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Your last name"
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      borderRadius: '12px',
                      border: errors.last_name ? '1px solid #d32f2f' : '1px solid #ddd',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                  {errors.last_name && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.last_name}</p>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      borderRadius: '12px',
                      border: errors.phone ? '1px solid #d32f2f' : '1px solid #ddd',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                  {errors.phone && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.phone}</p>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      borderRadius: '12px',
                      border: errors.date_of_birth ? '1px solid #d32f2f' : '1px solid #ddd',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                  {errors.date_of_birth && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.date_of_birth}</p>}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1rem', textAlign: 'center' }}>
                  Basic Information
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                    Gender *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                    {[
                      { value: 'Male', code: 'M' },
                      { value: 'Female', code: 'F' },
                      { value: 'Other', code: 'O' },
                      { value: 'Prefer not to say', code: 'P' }
                    ].map(option => (
                      <label key={option.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                        <input
                          type="radio"
                          name="gender"
                          value={option.code}
                          checked={formData.gender === option.code}
                          onChange={handleChange}
                        />
                        <span>{option.value}</span>
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
                  />
                  {errors.address && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.address}</p>}
                </div>

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
              </div>
            )}

            {currentStep === 4 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1rem', textAlign: 'center' }}>
                  Location
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
                      outline: 'none',
                    }}
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
                      outline: 'none',
                    }}
                  />
                  {errors.region && <p style={{ color: '#d32f2f', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors.region}</p>}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '2rem' }}>
              {currentStep > 1 && (
                <button type="button" onClick={handleBack} style={{
                  flex: 1,
                  background: 'transparent',
                  border: '2px solid #F9C74F',
                  padding: '0.7rem',
                  borderRadius: '50px',
                  color: '#0B3B2F',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}>
                  <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
                  Back
                </button>
              )}
              
              {currentStep < 4 ? (
                <button type="button" onClick={handleNext} style={{
                  flex: currentStep === 1 ? 1 : 2,
                  background: '#F9C74F',
                  border: 'none',
                  padding: '0.7rem',
                  borderRadius: '50px',
                  color: '#0B3B2F',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}>
                  Continue
                  <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
                </button>
              ) : (
                <button type="submit" disabled={isLoading} style={{
                  flex: 2,
                  background: isLoading ? '#0B3B2F' : '#F9C74F',
                  border: 'none',
                  padding: '0.7rem',
                  borderRadius: '50px',
                  color: isLoading ? 'white' : '#0B3B2F',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}>
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