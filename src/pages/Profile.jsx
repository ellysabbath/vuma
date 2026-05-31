import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://192.168.137.83:8000/api/auth/profile/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setEditedUser(data);
      } else if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('Failed to load profile');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('access_token');
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://192.168.137.83:8000/api/auth/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setEditedUser(data);
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...storedUser, ...data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
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
      setError('Please select an image file (JPEG, PNG, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      const base64String = await fileToBase64(file);
      const token = localStorage.getItem('access_token');

      const response = await fetch('http://192.168.137.83:8000/api/auth/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...editedUser, profile_picture: base64String }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setEditedUser(data);
        setSuccessMessage('Profile picture updated successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...storedUser, ...data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        setError('Failed to upload profile picture');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) return;

    setUploadingImage(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch('http://192.168.137.83:8000/api/auth/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...editedUser, profile_picture: null }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setEditedUser(data);
        setSuccessMessage('Profile picture removed successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setError('Failed to remove profile picture');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return 'Not provided';
    }
  };

  const getGenderLabel = (genderCode) => {
    const genders = {
      'M': 'Male',
      'F': 'Female',
      'O': 'Other',
      'P': 'Prefer not to say'
    };
    return genders[genderCode] || 'Not specified';
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin':
        return 'fas fa-user-shield';
      case 'volunteer':
        return 'fas fa-hands-helping';
      case 'innovator':
        return 'fas fa-lightbulb';
      case 'partner':
        return 'fas fa-handshake';
      default:
        return 'fas fa-user';
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin':
        return '#d32f2f';
      case 'volunteer':
        return '#4caf50';
      case 'innovator':
        return '#2196F3';
      case 'partner':
        return '#ff9800';
      default:
        return '#757575';
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        paddingTop: '70px', 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f9fbf7 0%, #f0f5ee 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-user-slash" style={{ fontSize: '3rem', color: '#ff9800', marginBottom: '1rem' }}></i>
          <h2>No user data found</h2>
          <div onClick={() => navigate('/login')} style={{ marginTop: '1rem', cursor: 'pointer' }}>
            <i className="fas fa-arrow-left" style={{ color: '#F9C74F', marginRight: '0.5rem' }}></i>
            <span style={{ color: '#F9C74F', fontWeight: 600 }}>Go to Login</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      paddingTop: '70px', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f9fbf7 0%, #f0f5ee 100%)'
    }}>
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => navigate('/')}></i>
            <h1 style={{ fontSize: '1.8rem' }}>My Profile</h1>
          </div>
          <p>View and manage your personal information</p>
        </div>
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

      {error && (
        <div style={{ maxWidth: '1200px', margin: '1rem auto 0', padding: '0 2rem' }}>
          <div style={{
            background: '#ffebee',
            color: '#d32f2f',
            padding: '1rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <i className="fas fa-exclamation-circle" style={{ marginRight: '0.5rem' }}></i>
            {error}
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          
          {/* Profile Picture & Basic Info Card */}
          <div data-aos="fade-up" style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
          }}>
            <div style={{ 
              padding: '20px 20px 10px 20px',
              background: 'linear-gradient(135deg, #f0f5ee, #e8f3e4)',
              borderRadius: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div
                  style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F9C74F, #f8b500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    border: '5px solid white',
                    transition: 'transform 0.3s ease'
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {user.profile_picture ? (
                    <img 
                      src={user.profile_picture} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <i className="fas fa-user" style={{ fontSize: '5rem', color: '#0B3B2F' }}></i>
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
                      <i className="fas fa-spinner fa-spin" style={{ fontSize: '2.5rem', color: 'white' }}></i>
                    </div>
                  )}
                </div>
                
                {/* Camera Icon Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
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

                {/* Remove Icon Overlay (only if picture exists) */}
                {user.profile_picture && (
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
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
            </div>

            <h2 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1.5rem' }}>{user.first_name || user.username} {user.last_name || ''}</h2>
            <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{user.email}</p>
            <p style={{ color: '#F9C74F', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>@{user.username}</p>
            
            {/* Role Badge */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={{
                background: getRoleColor(user.role),
                color: 'white',
                padding: '0.5rem 1.2rem',
                borderRadius: '30px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <i className={getRoleIcon(user.role)}></i>
                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
              </span>
            </div>
            
            <div style={{ 
              background: '#f9fbf7', 
              padding: '0.8rem', 
              borderRadius: '12px',
              marginTop: '1rem'
            }}>
              <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                <i className="fas fa-calendar-alt"></i> Member since {formatDate(user.joined_date)}
              </p>
              <p style={{ marginTop: '0.3rem' }}>
                {user.is_verified ? (
                  <span style={{ color: '#4caf50', fontSize: '0.8rem' }}>
                    <i className="fas fa-check-circle"></i> Email Verified
                  </span>
                ) : (
                  <span style={{ color: '#ff9800', fontSize: '0.8rem' }}>
                    <i className="fas fa-exclamation-circle"></i> Pending Verification
                  </span>
                )}
              </p>
            </div>
            
            {/* Logout Icon */}
            <div style={{ marginTop: '1.5rem' }}>
              <div onClick={handleLogout} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                color: '#d32f2f',
                transition: 'transform 0.2s ease',
                fontSize: '0.9rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <i className="fas fa-sign-out-alt" style={{ fontSize: '1.2rem' }}></i>
                <span>Logout</span>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div data-aos="fade-up" data-aos-delay="100" style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#0B3B2F', fontSize: '1.2rem', margin: 0 }}>
                <i className="fas fa-user-circle"></i> Personal Information
              </h3>
              {!isEditing && (
                <div onClick={() => setIsEditing(true)} style={{
                  color: '#F9C74F',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease'
                }}>
                  <i className="fas fa-edit" style={{ fontSize: '1.2rem' }}></i>
                </div>
              )}
            </div>

            {isEditing ? (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={editedUser.username || ''}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={editedUser.first_name || ''}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={editedUser.last_name || ''}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editedUser.phone || ''}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={editedUser.city || ''}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>Region</label>
                  <input
                    type="text"
                    name="region"
                    value={editedUser.region || ''}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <div onClick={() => setIsEditing(false)} style={{ flex: 1, background: '#f0f0f0', padding: '0.7rem', borderRadius: '50px', textAlign: 'center', cursor: 'pointer', fontWeight: 600 }}>
                    Cancel
                  </div>
                  <div onClick={handleUpdateProfile} style={{ flex: 1, background: '#0B3B2F', color: 'white', padding: '0.7rem', borderRadius: '50px', textAlign: 'center', cursor: 'pointer', fontWeight: 600 }}>
                    Save Changes
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.7rem' }}>
                  <span style={{ color: '#666' }}>Username:</span>
                  <span style={{ color: '#333', fontWeight: 500 }}>{user.username}</span>
                </div>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.7rem' }}>
                  <span style={{ color: '#666' }}>Full Name:</span>
                  <span style={{ color: '#333', fontWeight: 500 }}>{user.first_name || ''} {user.last_name || ''}</span>
                </div>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.7rem' }}>
                  <span style={{ color: '#666' }}>Email:</span>
                  <span style={{ color: '#333', fontWeight: 500 }}>{user.email}</span>
                </div>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.7rem' }}>
                  <span style={{ color: '#666' }}>Phone:</span>
                  <span style={{ color: '#333', fontWeight: 500 }}>{user.phone || 'Not provided'}</span>
                </div>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.7rem' }}>
                  <span style={{ color: '#666' }}>City:</span>
                  <span style={{ color: '#333', fontWeight: 500 }}>{user.city || 'Not provided'}</span>
                </div>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.7rem' }}>
                  <span style={{ color: '#666' }}>Region:</span>
                  <span style={{ color: '#333', fontWeight: 500 }}>{user.region || 'Not provided'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Bio & Skills Card */}
          <div data-aos="fade-up" data-aos-delay="200" style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ color: '#0B3B2F', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
              <i className="fas fa-file-alt"></i> Bio & Skills
            </h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ color: '#666', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Bio</span>
              <p style={{ color: '#333', lineHeight: '1.6' }}>{user.bio || 'No bio added yet.'}</p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ color: '#666', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Skills</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {user.skills ? (
                  user.skills.split(',').map((skill, index) => (
                    <span key={index} style={{
                      background: '#e8f5e9',
                      color: '#0B3B2F',
                      padding: '0.4rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 500
                    }}>{skill.trim()}</span>
                  ))
                ) : (
                  <span style={{ color: '#999' }}>No skills added yet.</span>
                )}
              </div>
            </div>
            
            <div>
              <span style={{ color: '#666', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Availability</span>
              <div style={{
                background: '#f0f5ee',
                padding: '0.7rem',
                borderRadius: '10px',
                color: '#0B3B2F',
                fontWeight: 500
              }}>
                <i className="fas fa-clock" style={{ marginRight: '0.5rem' }}></i>
                {user.availability || 'Not specified'}
              </div>
            </div>

            {user.role === 'volunteer' && user.total_hours > 0 && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' }}>
                <span style={{ color: '#666', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Total Volunteer Hours</span>
                <div style={{
                  background: '#e8f5e9',
                  padding: '0.7rem',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0B3B2F' }}>{user.total_hours}</span>
                  <span style={{ color: '#666', marginLeft: '0.5rem' }}>hours</span>
                </div>
              </div>
            )}
          </div>
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
        
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;