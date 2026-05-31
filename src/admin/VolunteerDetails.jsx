import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const VolunteerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editImagePreview, setEditImagePreview] = useState('');
  const [editImageFile, setEditImageFile] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchVolunteer();
  }, [id]);

  const fetchVolunteer = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://192.168.137.83:8000/api/volunteers/${id}/`);
      const data = await response.json();
      if (data.success) {
        setVolunteer(data.data);
      } else {
        setError(data.error || 'Volunteer not found');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
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

  const handleEditImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
      const preview = URL.createObjectURL(file);
      setEditImagePreview(preview);
      const base64 = await fileToBase64(file);
      setEditingVolunteer(prev => ({ ...prev, image_base64: base64 }));
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`http://192.168.137.83:8000/api/volunteers/${volunteer.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Volunteer deleted successfully!');
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/admin/volunteers');
        }, 2000);
      } else {
        alert(data.error || 'Failed to delete volunteer');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const openEditModal = () => {
    setEditingVolunteer({ ...volunteer });
    setShowEditModal(true);
    document.body.style.overflow = 'hidden';
    if (volunteer.image_base64) {
      setEditImagePreview(volunteer.image_base64);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingVolunteer(null);
    setEditImageFile(null);
    setEditImagePreview('');
    document.body.style.overflow = 'unset';
  };

  const handleEditChange = (e) => {
    setEditingVolunteer({
      ...editingVolunteer,
      [e.target.name]: e.target.value
    });
  };

  const handleAchievementsChange = (e) => {
    const achievementsArray = e.target.value.split(',').map(s => s.trim());
    setEditingVolunteer({
      ...editingVolunteer,
      achievements: achievementsArray
    });
  };

  const handleSocialChange = (platform, value) => {
    setEditingVolunteer({
      ...editingVolunteer,
      social: {
        ...editingVolunteer.social,
        [platform]: value
      }
    });
  };

  const handleUpdateVolunteer = async () => {
    if (!editingVolunteer.name) {
      alert('Please fill in volunteer name');
      return;
    }
    
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await fetch(`http://192.168.137.83:8000/api/volunteers/${editingVolunteer.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingVolunteer),
      });
      
      const data = await response.json();
      if (data.success) {
        setVolunteer(editingVolunteer);
        setSuccessMessage('Volunteer updated successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeEditModal();
      } else {
        alert(data.error || 'Failed to update volunteer');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/admin/volunteers');
  };

  const getRoleColor = (role) => {
    const colors = {
      'Team Leader': '#2196F3',
      'Event Coordinator': '#9C27B0',
      'Digital Media Specialist': '#00BCD4',
      'Environmental Lead': '#4caf50',
      'Youth Mentor': '#FF9800',
      'Fundraising Coordinator': '#d32f2f'
    };
    return colors[role] || '#757575';
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading volunteer details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '4rem', color: '#d32f2f', marginBottom: '1rem' }}></i>
            <h2>Error Loading Volunteer</h2>
            <p style={{ color: '#666', marginBottom: '1rem' }}>{error}</p>
            <button onClick={fetchVolunteer} style={{ background: '#F9C74F', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', marginRight: '0.5rem' }}>
              Try Again
            </button>
            <div onClick={handleBack} style={{ display: 'inline-block', cursor: 'pointer' }}>
              <span style={{ color: '#0B3B2F', fontWeight: 600 }}>Back to Volunteers</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-user-slash" style={{ fontSize: '4rem', color: '#d32f2f', marginBottom: '1rem' }}></i>
            <h2>Volunteer Not Found</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>The volunteer you're looking for doesn't exist or has been removed.</p>
            <div onClick={handleBack} style={{ display: 'inline-block', cursor: 'pointer' }}>
              <i className="fas fa-arrow-left" style={{ fontSize: '1.2rem', color: '#0B3B2F', marginRight: '0.5rem' }}></i>
              <span style={{ color: '#0B3B2F', fontWeight: 600 }}>Back to Volunteers</span>
            </div>
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
            <h1 style={{ fontSize: '1.8rem' }}>Volunteer Details</h1>
          </div>
          <p>View complete information about {volunteer.name}</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Volunteer Header Card */}
        <div data-aos="fade-up" style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '2rem', textAlign: 'center', position: 'relative' }}>
            {volunteer.image_base64 ? (
              <img 
                src={volunteer.image_base64} 
                alt={volunteer.name} 
                style={{ width: '120px', height: '120px', margin: '0 auto', borderRadius: '50%', objectFit: 'cover', border: '4px solid white' }}
              />
            ) : (
              <div style={{ width: '120px', height: '120px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white' }}>
                <i className="fas fa-hands-helping" style={{ fontSize: '3.5rem', color: '#0B3B2F' }}></i>
              </div>
            )}
            <h2 style={{ marginTop: '1rem', marginBottom: '0.3rem', fontSize: '1.8rem' }}>{volunteer.name}</h2>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                background: getRoleColor(volunteer.role),
                color: 'white',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>{volunteer.role || 'Volunteer'}</span>
            </div>
          </div>
          
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-info-circle"></i> Personal Information
                </h3>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Full Name</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{volunteer.name}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Role</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{volunteer.role || 'Not specified'}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Location</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{volunteer.location || 'Not specified'}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Join Date</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{new Date(volunteer.join_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              
              <div>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-chart-line"></i> Volunteer Information
                </h3>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Total Hours</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem', fontWeight: 600, color: '#0B3B2F' }}>{volunteer.hours_contributed} hours</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Projects Participated</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem', fontWeight: 600, color: '#0B3B2F' }}>{volunteer.projects_participated} projects</p>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {volunteer.bio && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-user-circle"></i> Biography
                </h3>
                <p style={{ lineHeight: '1.6', color: '#555' }}>{volunteer.bio}</p>
              </div>
            )}

            {/* Achievements Section */}
            {volunteer.achievements && volunteer.achievements.length > 0 && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-trophy"></i> Achievements
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {volunteer.achievements.map((achievement, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-star" style={{ color: '#F9C74F', fontSize: '0.8rem' }}></i>
                      <span style={{ color: '#555' }}>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media Section */}
            {volunteer.social && Object.keys(volunteer.social).length > 0 && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-share-alt"></i> Social Media
                </h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {volunteer.social.twitter && (
                    <a href={`https://twitter.com/${volunteer.social.twitter}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1DA1F2', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fab fa-twitter"></i> @{volunteer.social.twitter}
                    </a>
                  )}
                  {volunteer.social.linkedin && (
                    <a href={`https://linkedin.com/in/${volunteer.social.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: '#0077B5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fab fa-linkedin"></i> {volunteer.social.linkedin}
                    </a>
                  )}
                  {volunteer.social.instagram && (
                    <a href={`https://instagram.com/${volunteer.social.instagram}`} target="_blank" rel="noopener noreferrer" style={{ color: '#E4405F', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fab fa-instagram"></i> @{volunteer.social.instagram}
                    </a>
                  )}
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
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B3B2F' }}>{new Date(volunteer.join_date).getFullYear()}</p>
          </div>
          
          <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-clock" style={{ fontSize: '2rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
            <h3 style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Total Hours</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B3B2F' }}>{volunteer.hours_contributed}</p>
          </div>
          
          <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-project-diagram" style={{ fontSize: '2rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
            <h3 style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Projects</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B3B2F' }}>{volunteer.projects_participated}</p>
          </div>
        </div>
      </div>

      {/* Edit Volunteer Modal */}
      {showEditModal && editingVolunteer && (
        <div className="modal-overlay" onClick={closeEditModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '28px', maxWidth: '500px', width: '100%',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <div onClick={closeEditModal} style={{
              position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.5)', border: 'none',
              width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '1.2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
            }}>
              <i className="fas fa-times"></i>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', 
              padding: '1.5rem', 
              textAlign: 'center', 
              borderRadius: '28px 28px 0 0',
              flexShrink: 0
            }}>
              <div style={{ width: '70px', height: '70px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-user-edit" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.3rem' }}>Edit Volunteer</h2>
              <p style={{ color: '#F9C74F', fontSize: '0.9rem', marginTop: '0.3rem' }}>Update volunteer information</p>
            </div>
            
            <div style={{ 
              padding: '1.2rem', 
              overflowY: 'auto', 
              flex: 1,
              maxHeight: 'calc(90vh - 140px)'
            }}>
              {/* Profile Image */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Profile Image</label>
                <div style={{ marginBottom: '0.5rem' }}>
                  {editImagePreview ? (
                    <img src={editImagePreview} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', marginBottom: '0.5rem' }} />
                  ) : editingVolunteer.image_base64 ? (
                    <img src={editingVolunteer.image_base64} alt="Volunteer" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', marginBottom: '0.5rem' }} />
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editingVolunteer.name}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Role</label>
                <input
                  type="text"
                  name="role"
                  value={editingVolunteer.role || ''}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="e.g., Team Leader, Event Coordinator"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={editingVolunteer.location || ''}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Join Date</label>
                <input
                  type="date"
                  name="join_date"
                  value={editingVolunteer.join_date || ''}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Hours Contributed</label>
                <input
                  type="number"
                  name="hours_contributed"
                  value={editingVolunteer.hours_contributed}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Projects Participated</label>
                <input
                  type="number"
                  name="projects_participated"
                  value={editingVolunteer.projects_participated}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Bio</label>
                <textarea
                  name="bio"
                  value={editingVolunteer.bio || ''}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '80px' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Achievements (comma separated)</label>
                <input
                  type="text"
                  value={editingVolunteer.achievements ? editingVolunteer.achievements.join(', ') : ''}
                  onChange={handleAchievementsChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Best Volunteer 2025, Leadership Award"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Social Media</label>
                <input
                  type="text"
                  placeholder="Twitter username"
                  value={editingVolunteer.social?.twitter || ''}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem', marginBottom: '0.5rem' }}
                />
                <input
                  type="text"
                  placeholder="LinkedIn username"
                  value={editingVolunteer.social?.linkedin || ''}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem', marginBottom: '0.5rem' }}
                />
                <input
                  type="text"
                  placeholder="Instagram username"
                  value={editingVolunteer.social?.instagram || ''}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                <div onClick={closeEditModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', textAlign: 'center' }}>
                  Cancel
                </div>
                <div onClick={handleUpdateVolunteer} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', textAlign: 'center' }}>
                  Update Volunteer
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{ background: 'white', borderRadius: '20px', maxWidth: '400px', width: '100%', padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', margin: '0 auto', borderRadius: '50%', background: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '1.5rem', color: '#d32f2f' }}></i>
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Delete Volunteer</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Are you sure you want to delete "{volunteer.name}"? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '0.8rem', background: '#f0f0f0', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, textAlign: 'center' }}>Cancel</div>
              <div onClick={handleDelete} style={{ flex: 1, padding: '0.8rem', background: '#d32f2f', color: 'white', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, textAlign: 'center' }}>Delete</div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
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

export default VolunteerDetails;