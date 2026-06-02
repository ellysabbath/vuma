import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const UserDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editProfileImagePreview, setEditProfileImagePreview] = useState('');

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  // Fetch user from API
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}/`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('User not found');
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
        setUser(null);
      } else {
        const data = await response.json();
        // Handle response format: { success: true, data: {...} }
        let userData = null;
        if (data.success && data.data) {
          userData = data.data;
        } else if (data.data) {
          userData = data.data;
        } else {
          userData = data;
        }
        setUser(userData);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to load user details. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSuccessMessage('');
    }, 3000);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleEditProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setEditProfileImagePreview(preview);
      const base64 = await fileToBase64(file);
      setEditingUser(prev => ({ ...prev, profile_picture: base64 }));
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showAlert('User deleted successfully!');
        setTimeout(() => {
          navigate('/admin/users');
        }, 1500);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Network error. Please try again.');
    }
    setShowDeleteConfirm(false);
  };

  const openEditModal = () => {
    setEditingUser({ ...user });
    setShowEditModal(true);
    if (user.profile_picture) {
      setEditProfileImagePreview(user.profile_picture);
    }
    document.body.style.overflow = 'hidden';
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditProfileImagePreview('');
    document.body.style.overflow = 'unset';
  };

  const handleEditChange = (e) => {
    setEditingUser({
      ...editingUser,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateUser = async () => {
    if (!editingUser.username || !editingUser.email) {
      alert('Please fill in username and email');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${editingUser.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: editingUser.username,
          email: editingUser.email,
          first_name: editingUser.first_name || '',
          last_name: editingUser.last_name || '',
          phone: editingUser.phone || '',
          role: editingUser.role || 'volunteer',
          is_verified: editingUser.is_verified,
          bio: editingUser.bio || '',
          skills: editingUser.skills || '',
          city: editingUser.city || '',
          region: editingUser.region || '',
          profile_picture: editingUser.profile_picture || ''
        })
      });

      if (response.ok) {
        await fetchUser();
        showAlert('User updated successfully!');
        closeEditModal();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Network error. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/admin/users');
  };

  const getStatusColor = (isVerified) => {
    return isVerified ? '#4caf50' : '#ff9800';
  };

  const getStatusText = (isVerified) => {
    return isVerified ? 'Active' : 'Pending';
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'admin': '#0B3B2F',
      'innovator': '#00BCD4',
      'volunteer': '#9C27B0',
      'partner': '#FF9800',
      'youth_leader': '#2196F3'
    };
    return colors[role] || '#757575';
  };

  const getRoleLabel = (role) => {
    const labels = {
      'admin': 'Admin',
      'innovator': 'Innovator',
      'volunteer': 'Volunteer',
      'partner': 'Partner',
      'youth_leader': 'Youth Leader'
    };
    return labels[role] || role;
  };

  const getFullName = () => {
    if (user?.first_name || user?.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user?.username || 'User';
  };

  const getInitials = () => {
    const fullName = getFullName();
    if (fullName && fullName !== user?.username) {
      const parts = fullName.split(' ');
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
      }
      return fullName.charAt(0).toUpperCase();
    }
    return user?.username?.charAt(0).toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '3px solid #F9C74F',
            borderTopColor: '#0B3B2F',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading user details...</p>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-user-slash" style={{ fontSize: '4rem', color: '#d32f2f', marginBottom: '1rem' }}></i>
            <h2>User Not Found</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>{error || "The user you're looking for doesn't exist or has been removed."}</p>
            <button 
              onClick={handleBack}
              style={{
                background: '#0B3B2F',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fas fa-arrow-left"></i>
              Back to Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      {/* Success Alert */}
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

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '2rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={handleBack}></i>
            <h1 style={{ fontSize: '1.8rem' }}>User Details</h1>
          </div>
          <p>View complete information about {getFullName()}</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Profile Header Card */}
        <div data-aos="fade-up" style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '2rem', textAlign: 'center', position: 'relative' }}>
            {user.profile_picture ? (
              <img 
                src={user.profile_picture} 
                alt={getFullName()}
                style={{ width: '120px', height: '120px', margin: '0 auto', borderRadius: '50%', objectFit: 'cover', border: '4px solid #F9C74F' }}
              />
            ) : (
              <div style={{ width: '120px', height: '120px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white' }}>
                <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#0B3B2F' }}>{getInitials()}</span>
              </div>
            )}
            <h2 style={{ marginTop: '1rem', marginBottom: '0.3rem', fontSize: '1.8rem' }}>{getFullName()}</h2>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                background: getRoleBadgeColor(user.role),
                color: 'white',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>{getRoleLabel(user.role)}</span>
              <span style={{
                background: getStatusColor(user.is_verified),
                color: 'white',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>{getStatusText(user.is_verified)}</span>
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.8 }}>@{user.username}</p>
          </div>
          
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-info-circle"></i> Personal Information
                </h3>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Username</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{user.username}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Email Address</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{user.email}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Phone Number</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{user.phone || 'Not provided'}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Full Name</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{getFullName()}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>City</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{user.city || 'Not provided'}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Region</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{user.region || 'Not provided'}</p>
                </div>
              </div>
              
              <div>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-chart-line"></i> Activity Information
                </h3>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Role</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{getRoleLabel(user.role)}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Verification Status</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>
                    {user.is_verified ? (
                      <span style={{ color: '#4caf50' }}><i className="fas fa-check-circle"></i> Verified</span>
                    ) : (
                      <span style={{ color: '#ff9800' }}><i className="fas fa-clock"></i> Pending Verification</span>
                    )}
                  </p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Total Hours</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem', fontWeight: 600, color: '#0B3B2F' }}>{user.total_hours || 0} hours</p>
                </div>
                <div>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Joined Date</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>
                    {user.joined_date ? new Date(user.joined_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {user.bio && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-user-circle"></i> Biography
                </h3>
                <p style={{ lineHeight: '1.6', color: '#555' }}>{user.bio}</p>
              </div>
            )}

            {/* Skills Section */}
            {user.skills && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-code"></i> Skills & Expertise
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {user.skills.split(',').map((skill, index) => (
                    <span key={index} style={{
                      background: '#e8f5e9',
                      color: '#0B3B2F',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '15px',
                      fontSize: '0.85rem',
                      fontWeight: 500
                    }}>{skill.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Icons */}
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
              <div onClick={handleBack} style={{ cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <i className="fas fa-arrow-left" style={{ fontSize: '1.5rem', color: '#666' }}></i>
                <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.3rem' }}>Back</p>
              </div>
              
              <div onClick={openEditModal} style={{ cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <i className="fas fa-edit" style={{ fontSize: '1.5rem', color: '#2196F3' }}></i>
                <p style={{ fontSize: '0.7rem', color: '#2196F3', marginTop: '0.3rem' }}>Edit</p>
              </div>
              
              <div onClick={() => setShowDeleteConfirm(true)} style={{ cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <i className="fas fa-trash-alt" style={{ fontSize: '1.5rem', color: '#d32f2f' }}></i>
                <p style={{ fontSize: '0.7rem', color: '#d32f2f', marginTop: '0.3rem' }}>Delete</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div data-aos="fade-up" data-aos-delay="100" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-calendar-alt" style={{ fontSize: '2rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
            <h3 style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Member Since</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B3B2F' }}>{user.joined_date ? new Date(user.joined_date).getFullYear() : '-'}</p>
          </div>
          
          <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-tasks" style={{ fontSize: '2rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
            <h3 style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Projects</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B3B2F' }}>{user.projects_count || 0}</p>
          </div>
          
          <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-clock" style={{ fontSize: '2rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
            <h3 style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Total Hours</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B3B2F' }}>{user.total_hours || 0}</p>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="modal-overlay" onClick={closeEditModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '28px', maxWidth: '550px', width: '100%',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={closeEditModal} style={{
              position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.5)', border: 'none',
              width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '1.2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
            }}><i className="fas fa-times"></i></button>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', 
              padding: '1.5rem', 
              textAlign: 'center', 
              borderRadius: '28px 28px 0 0',
              flexShrink: 0
            }}>
              {editProfileImagePreview ? (
                <img src={editProfileImagePreview} alt="Preview" style={{ width: '70px', height: '70px', margin: '0 auto', borderRadius: '50%', objectFit: 'cover', border: '3px solid #F9C74F' }} />
              ) : (
                <div style={{ width: '70px', height: '70px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-user-edit" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
                </div>
              )}
              <h2 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.3rem' }}>Edit User</h2>
              <p style={{ color: '#F9C74F', fontSize: '0.9rem', marginTop: '0.3rem' }}>Update user information</p>
            </div>
            
            <div style={{ padding: '1.2rem', overflowY: 'auto', flex: 1, maxHeight: 'calc(90vh - 140px)' }}>
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Profile Picture</label>
                <input type="file" accept="image/*" onChange={handleEditProfilePictureChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Username *</label>
                <input type="text" name="username" value={editingUser.username} onChange={handleEditChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }} />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Email *</label>
                <input type="email" name="email" value={editingUser.email} onChange={handleEditChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }} />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>First Name</label>
                <input type="text" name="first_name" value={editingUser.first_name || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }} />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Last Name</label>
                <input type="text" name="last_name" value={editingUser.last_name || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }} />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Phone</label>
                <input type="text" name="phone" value={editingUser.phone || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }} />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>City</label>
                <input type="text" name="city" value={editingUser.city || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }} />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Region</label>
                <input type="text" name="region" value={editingUser.region || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }} />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Role</label>
                <select name="role" value={editingUser.role} onChange={handleEditChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}>
                  <option value="admin">Admin</option>
                  <option value="innovator">Innovator</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="partner">Partner</option>
                  <option value="youth_leader">Youth Leader</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Verification Status</label>
                <select name="is_verified" value={editingUser.is_verified} onChange={handleEditChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}>
                  <option value={true}>Verified</option>
                  <option value={false}>Pending</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Bio</label>
                <textarea name="bio" value={editingUser.bio || ''} onChange={handleEditChange} rows="3" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }} placeholder="Enter user biography" />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Skills (comma separated)</label>
                <textarea name="skills" value={editingUser.skills || ''} onChange={handleEditChange} rows="2" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }} placeholder="e.g., Leadership, Communication, Project Management" />
              </div>
              
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                <button onClick={closeEditModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                <button onClick={handleUpdateUser} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Update User</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ background: 'white', borderRadius: '20px', maxWidth: '400px', width: '100%', padding: '2rem', textAlign: 'center', animation: 'scaleIn 0.3s ease' }}>
            <div style={{ width: '60px', height: '60px', margin: '0 auto', borderRadius: '50%', background: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '1.5rem', color: '#d32f2f' }}></i>
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Delete User</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Are you sure you want to delete <strong>{getFullName()}</strong>? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '0.8rem', background: '#f0f0f0', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: '0.8rem', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInScale {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
        
        .modal-content div::-webkit-scrollbar {
          width: 4px;
        }
        .modal-content div::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .modal-content div::-webkit-scrollbar-thumb {
          background: #0B3B2F;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default UserDetails;