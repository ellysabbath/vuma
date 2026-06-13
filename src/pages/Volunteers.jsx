import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Volunteers = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    age: '',
    occupation: '',
    availability: '',
    availabilityDetails: '',
    skills: '',
    motivation: '',
    experience: '',
    emergencyContact: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    hearAboutUs: '',
    additionalInfo: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      setIsLoadingUser(false);
      return;
    }

    setIsLoadingUser(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = storedUser.id;
      
      if (!userId) {
        setIsLoadingUser(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        let userData = null;
        if (data.success && data.data) {
          userData = data.data;
        } else if (data.data) {
          userData = data.data;
        } else {
          userData = data;
        }
        
        setUser(userData);
        
        // Set profile picture if exists
        if (userData.profile_picture) {
          setProfilePicturePreview(userData.profile_picture);
          setProfilePicture(userData.profile_picture);
        }
        
        // Pre-fill form with user data
        const fullName = userData.first_name || userData.last_name 
          ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim()
          : userData.username || '';
        
        const location = userData.city || userData.region 
          ? [userData.city, userData.region].filter(Boolean).join(', ')
          : '';
        
        setFormData(prev => ({
          ...prev,
          fullName: fullName,
          email: userData.email || '',
          phone: userData.phone || '',
          location: location,
          skills: userData.skills || '',
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select an image file (JPEG, PNG, GIF)' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
      return;
    }

    setUploadingImage(true);
    setErrors(prev => ({ ...prev, image: '' }));

    try {
      const base64String = await fileToBase64(file);
      setProfilePicture(base64String);
      setProfilePicturePreview(base64String);
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors(prev => ({ ...prev, image: 'Failed to upload image. Please try again.' }));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.availability) newErrors.availability = 'Please select availability';
    if (!formData.motivation.trim()) newErrors.motivation = 'Please tell us why you want to volunteer';
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    setApiError('');
    
    // Prepare application data matching Django model field names
    const applicationData = {
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      age: formData.age ? parseInt(formData.age) : null,
      occupation: formData.occupation,
      availability: formData.availability,
      availability_details: formData.availabilityDetails,
      skills: formData.skills,
      experience: formData.experience,
      motivation: formData.motivation,
      emergency_contact_name: formData.emergencyContact,
      emergency_contact_phone: formData.emergencyPhone,
      emergency_contact_relationship: formData.emergencyRelationship,
      hear_about_us: formData.hearAboutUs,
      additional_info: formData.additionalInfo,
      profile_picture: profilePicture || null,
      user_id: user?.id || null,
      user_username: user?.username || '',
      user_email: user?.email || formData.email,
      status: 'pending'
    };

    try {
      // Make API call to Django backend
      const response = await fetch(`${API_BASE_URL}/volunteers/applications/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitting(false);
        setSubmitted(true);
        setShowSuccess(true);
        setSuccessMessage(data.message || 'Application submitted successfully!');
        
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        // Handle validation errors from backend
        if (data.errors) {
          const backendErrors = {};
          Object.keys(data.errors).forEach(key => {
            backendErrors[key] = data.errors[key][0];
          });
          setErrors(backendErrors);
          setApiError('Please fix the errors below.');
        } else {
          setApiError(data.error || 'Failed to submit application. Please try again.');
        }
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setApiError('Network error. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    // Reset to pre-filled user data
    const fullName = user?.first_name || user?.last_name 
      ? `${user?.first_name || ''} ${user?.last_name || ''}`.trim()
      : user?.username || '';
    
    const location = user?.city || user?.region 
      ? [user?.city, user?.region].filter(Boolean).join(', ')
      : '';
    
    setFormData({
      fullName: fullName,
      email: user?.email || '',
      phone: user?.phone || '',
      location: location,
      age: '',
      occupation: '',
      availability: '',
      availabilityDetails: '',
      skills: user?.skills || '',
      motivation: '',
      experience: '',
      emergencyContact: '',
      emergencyPhone: '',
      emergencyRelationship: '',
      hearAboutUs: '',
      additionalInfo: ''
    });
    setProfilePicture(null);
    setProfilePicturePreview('');
    setSubmitted(false);
    setErrors({});
    setApiError('');
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (submitted) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          maxWidth: '500px', 
          margin: '2rem', 
          background: 'white', 
          borderRadius: '20px', 
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 20px 30px -12px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#0B3B2F',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <i className="fas fa-check" style={{ fontSize: '2.5rem', color: '#F9C74F' }}></i>
          </div>
          <h2 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>Application Submitted!</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            Thank you for your interest in volunteering with us. Our team will review your application and contact you within 2-3 business days.
          </p>
          <div style={{ 
            background: '#f8fafc', 
            padding: '1rem', 
            borderRadius: '12px',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            <p style={{ fontSize: '0.8rem', color: '#0B3B2F', marginBottom: '0.5rem' }}>
              <i className="fas fa-envelope" style={{ color: '#F9C74F', marginRight: '0.5rem' }}></i>
              Next steps:
            </p>
            <ul style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '1.5rem' }}>
              <li>You'll receive a confirmation email shortly</li>
              <li>Our team will review your application</li>
              <li>We'll schedule an interview if shortlisted</li>
              <li>Welcome orientation for selected candidates</li>
            </ul>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={handleReset}
              style={{
                background: '#0B3B2F',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1.5rem',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              Submit Another Application
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'transparent',
                color: '#0B3B2F',
                border: '2px solid #0B3B2F',
                padding: '0.6rem 1.5rem',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Success Toast */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 9999,
          animation: 'slideInRight 0.3s ease'
        }}>
          <div style={{
            background: '#4caf50',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="fas fa-check-circle"></i>
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* API Error Display */}
      {apiError && (
        <div style={{ maxWidth: '800px', margin: '0 auto 1rem', padding: '0 1.5rem' }}>
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '1rem',
            borderRadius: '12px',
            borderLeft: '4px solid #c62828',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="fas fa-exclamation-circle"></i>
            <span>{apiError}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F 0%, #1a5c48 100%)',
        padding: '2rem',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <i className="fas fa-hands-helping" style={{ fontSize: '3rem', color: '#F9C74F', marginBottom: '1rem' }}></i>
          <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem' }}>
            Join Our Volunteer Team
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>
            Make a difference in your community by volunteering with us
          </p>
        </div>
      </div>

      {/* User Info Banner for Logged-in Users */}
      {!isLoadingUser && user && (
        <div style={{ maxWidth: '800px', margin: '0 auto 1rem', padding: '0 1.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            borderLeft: '4px solid #F9C74F'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: '#0B3B2F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-user-check" style={{ color: '#F9C74F', fontSize: '1.5rem' }}></i>
            </div>
            <div>
              <p style={{ color: '#0B3B2F', fontWeight: 600, marginBottom: '0.2rem' }}>
                Welcome back, {user.first_name || user.username}!
              </p>
              <p style={{ color: '#0B3B2F', fontSize: '0.8rem' }}>
                We've pre-filled your details from your profile. Please review and complete the form.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Login Prompt for Non-logged-in Users */}
      {!isLoadingUser && !user && (
        <div style={{ maxWidth: '800px', margin: '0 auto 1rem', padding: '0 1.5rem' }}>
          <div style={{
            background: '#fff3e0',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            borderLeft: '4px solid #F9C74F'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <i className="fas fa-info-circle" style={{ color: '#F9C74F', fontSize: '1.5rem' }}></i>
              <div>
                <p style={{ color: '#0B3B2F', fontWeight: 600, marginBottom: '0.2rem' }}>
                  Not logged in?
                </p>
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>
                  Login to auto-fill your details and track your application status.
                </p>
              </div>
            </div>
            <button
              onClick={handleLoginRedirect}
              style={{
                background: '#0B3B2F',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1.2rem',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                whiteSpace: 'nowrap'
              }}
            >
              <i className="fas fa-sign-in-alt" style={{ marginRight: '0.3rem' }}></i>
              Login Now
            </button>
          </div>
        </div>
      )}

      {/* Form Section */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '2rem',
            borderBottom: '1px solid #e2e8f0',
            background: '#fafbfc'
          }}>
            <h2 style={{ color: '#0B3B2F', fontSize: '1.25rem', marginBottom: '0.25rem' }}>
              Volunteer Application Form
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Please fill out all required fields marked with *
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
            {/* Profile Picture Upload */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <h3 style={{ 
                color: '#0B3B2F', 
                fontSize: '1rem', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <i className="fas fa-camera" style={{ color: '#F9C74F' }}></i>
                Profile Picture
              </h3>
              
              <div style={{ 
                display: 'inline-block',
                position: 'relative'
              }}>
                <div
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F9C74F, #f8b500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    border: '4px solid white',
                    transition: 'transform 0.3s ease'
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {profilePicturePreview ? (
                    <img 
                      src={profilePicturePreview} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <i className="fas fa-user" style={{ fontSize: '4rem', color: '#0B3B2F' }}></i>
                  )}
                  {uploadingImage && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%'
                    }}>
                      <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'white' }}></i>
                    </div>
                  )}
                </div>
                
                <div style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  background: '#0B3B2F',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s ease'
                }}
                onClick={() => fileInputRef.current?.click()}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <i className="fas fa-camera" style={{ color: 'white', fontSize: '1.2rem' }}></i>
                </div>

                {profilePicturePreview && (
                  <div style={{
                    position: 'absolute',
                    bottom: '5px',
                    left: '5px',
                    background: '#d32f2f',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s ease'
                  }}
                  onClick={handleRemoveProfilePicture}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <i className="fas fa-trash-alt" style={{ color: 'white', fontSize: '1.2rem' }}></i>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleProfilePictureUpload}
              />
              
              {errors.image && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem' }}>{errors.image}</p>
              )}
              
              <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem' }}>
                <i className="fas fa-info-circle"></i> Upload a profile picture (optional, max 5MB)
              </p>
            </div>

            {/* Personal Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                color: '#0B3B2F', 
                fontSize: '1rem', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <i className="fas fa-user" style={{ color: '#F9C74F' }}></i>
                Personal Information
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B3B2F', display: 'block', marginBottom: '0.25rem' }}>
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!!user}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: `1px solid ${errors.full_name || errors.fullName ? '#ef4444' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      background: user ? '#f8fafc' : 'white',
                      cursor: user ? 'not-allowed' : 'text'
                    }}
                    placeholder="Enter your full name"
                  />
                  {user && (
                    <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                      <i className="fas fa-info-circle"></i> Name is synced from your profile
                    </p>
                  )}
                  {(errors.full_name || errors.fullName) && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.full_name || errors.fullName}</p>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B3B2F', display: 'block', marginBottom: '0.25rem' }}>
                      Email <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!!user}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: `1px solid ${errors.email ? '#ef4444' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        background: user ? '#f8fafc' : 'white',
                        cursor: user ? 'not-allowed' : 'text'
                      }}
                      placeholder="your@email.com"
                    />
                    {user && (
                      <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                        <i className="fas fa-info-circle"></i> Email is synced from your profile
                      </p>
                    )}
                    {errors.email && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.email}</p>}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B3B2F', display: 'block', marginBottom: '0.25rem' }}>
                      Phone Number <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: `1px solid ${errors.phone ? '#ef4444' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        fontSize: '0.8rem'
                      }}
                      placeholder="+1 234 567 8900"
                    />
                    {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.phone}</p>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B3B2F', display: 'block', marginBottom: '0.25rem' }}>
                      Location <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: `1px solid ${errors.location ? '#ef4444' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        fontSize: '0.8rem'
                      }}
                      placeholder="City, State"
                    />
                    {errors.location && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.location}</p>}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B3B2F', display: 'block', marginBottom: '0.25rem' }}>
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: `1px solid ${errors.age ? '#ef4444' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        fontSize: '0.8rem'
                      }}
                      placeholder="18+"
                    />
                    {errors.age && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.age}</p>}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B3B2F', display: 'block', marginBottom: '0.25rem' }}>
                    Occupation
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: `1px solid ${errors.occupation ? '#ef4444' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '0.8rem'
                    }}
                    placeholder="Student, Professional, Retired, etc."
                  />
                  {errors.occupation && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.occupation}</p>}
                </div>
              </div>
            </div>

            {/* Availability & Skills */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                color: '#0B3B2F', 
                fontSize: '1rem', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <i className="fas fa-clock" style={{ color: '#F9C74F' }}></i>
                Availability & Skills
              </h3>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B3B2F', display: 'block', marginBottom: '0.25rem' }}>
                    Availability <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: `1px solid ${errors.availability ? '#ef4444' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      background: 'white'
                    }}
                  >
                    <option value="">Select availability</option>
                    <option value="weekdays">Weekdays (Mon-Fri)</option>
                    <option value="weekends">Weekends (Sat-Sun)</option>
                    <option value="evenings">Evenings</option>
                    <option value="flexible">Flexible</option>
                    <option value="specific">Specific days</option>
                  </select>
                  {errors.availability && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.availability}</p>}
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B3B2F', display: 'block', marginBottom: '0.25rem' }}>
                    Availability Details
                  </label>
                  <textarea
                    name="availabilityDetails"
                    value={formData.availabilityDetails}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: `1px solid ${errors.availability_details ? '#ef4444' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      resize: 'vertical',
                      minHeight: '60px'
                    }}
                    placeholder="e.g., Available on Tuesday and Thursday evenings, or weekends from 9 AM to 5 PM"
                  />
                  {errors.availability_details && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.availability_details}</p>}
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B3B2F', display: 'block', marginBottom: '0.25rem' }}>
                    Skills & Expertise
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: `1px solid ${errors.skills ? '#ef4444' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      resize: 'vertical',
                      minHeight: '80px'
                    }}
                    placeholder="List your relevant skills (e.g., teaching, event planning, social media, fundraising, etc.)"
                  />
                  {user && formData.skills === user?.skills && (
                    <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                      <i className="fas fa-info-circle"></i> Skills are pre-filled from your profile
                    </p>
                  )}
                  {errors.skills && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.skills}</p>}
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B3B2F', display: 'block', marginBottom: '0.25rem' }}>
                    Previous Volunteer Experience
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: `1px solid ${errors.experience ? '#ef4444' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      resize: 'vertical',
                      minHeight: '80px'
                    }}
                    placeholder="Tell us about any previous volunteer work or relevant experience"
                  />
                  {errors.experience && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.experience}</p>}
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                color: '#0B3B2F', 
                fontSize: '1rem', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <i className="fas fa-heart" style={{ color: '#F9C74F' }}></i>
                Why Volunteer With Us?
              </h3>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B3B2F', display: 'block', marginBottom: '0.25rem' }}>
                  Motivation to Volunteer <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: `1px solid ${errors.motivation ? '#ef4444' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    resize: 'vertical',
                    minHeight: '100px'
                  }}
                  placeholder="Why do you want to volunteer with us? What causes are you passionate about?"
                />
                {errors.motivation && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.motivation}</p>}
              </div>
            </div>

            {/* Emergency Contact */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                color: '#0B3B2F', 
                fontSize: '1rem', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <i className="fas fa-phone-alt" style={{ color: '#F9C74F' }}></i>
                Emergency Contact
              </h3>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B3B2F', display: 'block', marginBottom: '0.25rem' }}>
                      Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: `1px solid ${errors.emergency_contact_name ? '#ef4444' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        fontSize: '0.8rem'
                      }}
                      placeholder="Full name"
                    />
                    {errors.emergency_contact_name && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.emergency_contact_name}</p>}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B3B2F', display: 'block', marginBottom: '0.25rem' }}>
                      Emergency Phone
                    </label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: `1px solid ${errors.emergency_contact_phone ? '#ef4444' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        fontSize: '0.8rem'
                      }}
                      placeholder="Phone number"
                    />
                    {errors.emergency_contact_phone && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.emergency_contact_phone}</p>}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B3B2F', display: 'block', marginBottom: '0.25rem' }}>
                    Relationship
                  </label>
                  <input
                    type="text"
                    name="emergencyRelationship"
                    value={formData.emergencyRelationship}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: `1px solid ${errors.emergency_contact_relationship ? '#ef4444' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '0.8rem'
                    }}
                    placeholder="e.g., Spouse, Parent, Sibling, Friend"
                  />
                  {errors.emergency_contact_relationship && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.emergency_contact_relationship}</p>}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                color: '#0B3B2F', 
                fontSize: '1rem', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <i className="fas fa-info-circle" style={{ color: '#F9C74F' }}></i>
                Additional Information
              </h3>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B3B2F', display: 'block', marginBottom: '0.25rem' }}>
                    How did you hear about us?
                  </label>
                  <select
                    name="hearAboutUs"
                    value={formData.hearAboutUs}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: `1px solid ${errors.hear_about_us ? '#ef4444' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      background: 'white'
                    }}
                  >
                    <option value="">Select an option</option>
                    <option value="social_media">Social Media</option>
                    <option value="friend">Friend/Family</option>
                    <option value="event">Event</option>
                    <option value="website">Website</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.hear_about_us && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.hear_about_us}</p>}
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B3B2F', display: 'block', marginBottom: '0.25rem' }}>
                    Additional Information
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: `1px solid ${errors.additional_info ? '#ef4444' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      resize: 'vertical',
                      minHeight: '80px'
                    }}
                    placeholder="Any other information you'd like to share with us"
                  />
                  {errors.additional_info && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.additional_info}</p>}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  background: 'transparent',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: '#0B3B2F',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 2rem',
                  borderRadius: '30px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: isSubmitting ? 0.7 : 1
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
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .fa-spin {
          animation: spin 1s linear infinite;
        }
        
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #F9C74F;
          box-shadow: 0 0 0 2px rgba(249,199,79,0.1);
        }
        
        input:disabled {
          background-color: #f8fafc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Volunteers;