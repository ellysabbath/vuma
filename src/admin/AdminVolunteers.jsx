import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminVolunteers = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [newVolunteer, setNewVolunteer] = useState({
    name: '',
    role: '',
    location: '',
    join_date: new Date().toISOString().split('T')[0],
    hours_contributed: 0,
    projects_participated: 0,
    image_base64: '',
    bio: '',
    achievements: [],
    social: {}
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchVolunteers();
  }, []);

  useEffect(() => {
    if (id && volunteers.length > 0) {
      const volunteer = volunteers.find(v => v.id === parseInt(id));
      if (volunteer) {
        setSelectedVolunteer(volunteer);
        setShowModal(true);
        setIsEditMode(false);
      }
    }
  }, [id, volunteers]);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      // Remove Authorization header since backend has permission_classes = []
      const response = await fetch('http://192.168.137.83:8000/api/volunteers/');
      const data = await response.json();
      if (data.success) {
        setVolunteers(data.data);
      } else {
        setError('Failed to load volunteers');
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      const base64 = await fileToBase64(file);
      setNewVolunteer(prev => ({ ...prev, image_base64: base64 }));
    }
  };

  const handleEditImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setEditImagePreview(preview);
      const base64 = await fileToBase64(file);
      setEditingVolunteer(prev => ({ ...prev, image_base64: base64 }));
    }
  };

  const openModal = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsEditMode(false);
    setShowModal(true);
    navigate(`/admin/volunteers/${volunteer.id}`, { replace: true });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVolunteer(null);
    setIsEditMode(false);
    setEditingVolunteer(null);
    navigate('/admin/volunteers', { replace: true });
    document.body.style.overflow = 'unset';
  };

  const openEditModal = (volunteer) => {
    setEditingVolunteer({ ...volunteer });
    setIsEditMode(true);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
    if (volunteer.image_base64) {
      setEditImagePreview(volunteer.image_base64);
    }
  };

  const handleEditChange = (e) => {
    setEditingVolunteer({
      ...editingVolunteer,
      [e.target.name]: e.target.value
    });
  };

  const handleEditAchievementsChange = (e) => {
    const achievementsArray = e.target.value.split(',').map(s => s.trim());
    setEditingVolunteer({
      ...editingVolunteer,
      achievements: achievementsArray
    });
  };

  const handleEditSocialChange = (platform, value) => {
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
    
    // Remove Authorization header for update
    try {
      const response = await fetch(`http://192.168.137.83:8000/api/volunteers/${editingVolunteer.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingVolunteer),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchVolunteers();
        setSuccessMessage('Volunteer updated successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeModal();
      } else {
        alert(data.error || 'Failed to update volunteer');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const openAddModal = () => {
    setShowAddModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewVolunteer({
      name: '',
      role: '',
      location: '',
      join_date: new Date().toISOString().split('T')[0],
      hours_contributed: 0,
      projects_participated: 0,
      image_base64: '',
      bio: '',
      achievements: [],
      social: {}
    });
    setImagePreview('');
    setImageFile(null);
    document.body.style.overflow = 'unset';
  };

  const handleAddVolunteer = async () => {
    if (!newVolunteer.name) {
      alert('Please fill in volunteer name');
      return;
    }
    
    // Remove Authorization header for add
    try {
      const response = await fetch('http://192.168.137.83:8000/api/volunteers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVolunteer),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchVolunteers();
        setSuccessMessage('Volunteer added successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeAddModal();
      } else {
        alert(data.error || 'Failed to add volunteer');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this volunteer?')) {
      // Remove Authorization header for delete
      try {
        const response = await fetch(`http://192.168.137.83:8000/api/volunteers/${id}/`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        if (data.success) {
          await fetchVolunteers();
          setSuccessMessage('Volunteer deleted successfully!');
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          alert(data.error || 'Failed to delete volunteer');
        }
      } catch (error) {
        alert('Network error. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    setNewVolunteer({
      ...newVolunteer,
      [e.target.name]: e.target.value
    });
  };

  const handleAchievementsChange = (e) => {
    const achievementsArray = e.target.value.split(',').map(s => s.trim());
    setNewVolunteer({
      ...newVolunteer,
      achievements: achievementsArray
    });
  };

  const handleSocialChange = (platform, value) => {
    setNewVolunteer({
      ...newVolunteer,
      social: {
        ...newVolunteer.social,
        [platform]: value
      }
    });
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
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading volunteers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#d32f2f' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>{error}</p>
          <button onClick={fetchVolunteers} style={{ marginTop: '1rem', background: '#F9C74F', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      {/* Sweet Circle Success Alert */}
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

      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '2rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => navigate('/admin')}></i>
            <h1 style={{ fontSize: '1.8rem' }}>Volunteers Management</h1>
          </div>
          <p>Manage volunteer applications and assignments</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <i 
              className="fas fa-plus-circle" 
              style={{ 
                fontSize: '2rem', 
                color: '#0B3B2F', 
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onClick={openAddModal}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            ></i>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Role</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Location</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Hours</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Projects</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map(volunteer => (
                  <tr key={volunteer.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{ cursor: 'pointer', color: '#0B3B2F', fontWeight: 600 }} onClick={() => openModal(volunteer)}>
                        {volunteer.name}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{
                        background: getRoleColor(volunteer.role),
                        color: 'white',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem'
                      }}>{volunteer.role || 'Volunteer'}</span>
                    </td>
                    <td style={{ padding: '0.8rem' }}>{volunteer.location || '-'}</td>
                    <td style={{ padding: '0.8rem' }}>{volunteer.hours_contributed}</td>
                    <td style={{ padding: '0.8rem' }}>{volunteer.projects_participated}</td>
                    <td style={{ padding: '0.8rem' }}>
                      <i className="fas fa-eye" style={{ color: '#0B3B2F', cursor: 'pointer', marginRight: '0.8rem' }} onClick={() => openModal(volunteer)}></i>
                      <i className="fas fa-edit" style={{ color: '#2196F3', cursor: 'pointer', marginRight: '0.8rem' }} onClick={() => openEditModal(volunteer)}></i>
                      <i className="fas fa-trash" style={{ color: '#d32f2f', cursor: 'pointer' }} onClick={() => handleDelete(volunteer.id)}></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Volunteer Details/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '28px', maxWidth: '500px', width: '100%', 
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={closeModal} style={{
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
              <div style={{ width: '70px', height: '70px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={isEditMode ? "fas fa-user-edit" : "fas fa-hands-helping"} style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.8rem', marginBottom: '0.3rem', fontSize: '1.3rem' }}>
                {isEditMode ? 'Edit Volunteer' : 'Volunteer Details'}
              </h2>
              {!isEditMode && <p style={{ color: '#F9C74F', fontSize: '0.9rem' }}>View complete volunteer information</p>}
            </div>
            
            <div style={{ 
              padding: '1.2rem', 
              overflowY: 'auto', 
              flex: 1,
              maxHeight: 'calc(90vh - 140px)'
            }}>
              {isEditMode && editingVolunteer ? (
                // Edit Form
                <>
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
                      onChange={handleEditAchievementsChange}
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
                      onChange={(e) => handleEditSocialChange('twitter', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem', marginBottom: '0.5rem' }}
                    />
                    <input
                      type="text"
                      placeholder="LinkedIn username"
                      value={editingVolunteer.social?.linkedin || ''}
                      onChange={(e) => handleEditSocialChange('linkedin', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem', marginBottom: '0.5rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Instagram username"
                      value={editingVolunteer.social?.instagram || ''}
                      onChange={(e) => handleEditSocialChange('instagram', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                    <button onClick={closeModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                    <button onClick={handleUpdateVolunteer} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Update Volunteer</button>
                  </div>
                </>
              ) : (
                // View Mode
                <>
                  {selectedVolunteer?.image_base64 && (
                    <div style={{ marginBottom: '0.8rem', textAlign: 'center' }}>
                      <img src={selectedVolunteer.image_base64} alt={selectedVolunteer.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
                    </div>
                  )}
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Full Name</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      {selectedVolunteer?.name}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Role</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      {selectedVolunteer?.role || 'Not specified'}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Location</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      {selectedVolunteer?.location || 'Not specified'}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Join Date</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      {new Date(selectedVolunteer?.join_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Hours Contributed</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      {selectedVolunteer?.hours_contributed} hours
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Projects Participated</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      {selectedVolunteer?.projects_participated} projects
                    </div>
                  </div>
                  
                  {selectedVolunteer?.bio && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Bio</label>
                      <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333', lineHeight: '1.5' }}>
                        {selectedVolunteer?.bio}
                      </div>
                    </div>
                  )}
                  
                  {selectedVolunteer?.achievements && selectedVolunteer.achievements.length > 0 && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Achievements</label>
                      <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                        {selectedVolunteer.achievements.map((achievement, i) => (
                          <span key={i} style={{ display: 'inline-block', background: '#e8f5e9', color: '#0B3B2F', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', margin: '0.2rem' }}>
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedVolunteer?.social && Object.keys(selectedVolunteer.social).length > 0 && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Social Media</label>
                      <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                        {selectedVolunteer.social.twitter && (
                          <div><i className="fab fa-twitter" style={{ color: '#1DA1F2', marginRight: '0.5rem' }}></i> @{selectedVolunteer.social.twitter}</div>
                        )}
                        {selectedVolunteer.social.linkedin && (
                          <div><i className="fab fa-linkedin" style={{ color: '#0077B5', marginRight: '0.5rem' }}></i> {selectedVolunteer.social.linkedin}</div>
                        )}
                        {selectedVolunteer.social.instagram && (
                          <div><i className="fab fa-instagram" style={{ color: '#E4405F', marginRight: '0.5rem' }}></i> @{selectedVolunteer.social.instagram}</div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                    <button onClick={closeModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Close</button>
                    <button onClick={() => openEditModal(selectedVolunteer)} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Edit Volunteer</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Volunteer Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeAddModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '28px', maxWidth: '500px', width: '100%',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={closeAddModal} style={{
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
              <div style={{ width: '70px', height: '70px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-user-plus" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.3rem' }}>Add New Volunteer</h2>
            </div>
            
            <div style={{ 
              padding: '1.2rem', 
              overflowY: 'auto', 
              flex: 1,
              maxHeight: 'calc(90vh - 140px)'
            }}>
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', marginTop: '0.5rem' }} />
                )}
              </div>

              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newVolunteer.name}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Enter full name"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Role</label>
                <input
                  type="text"
                  name="role"
                  value={newVolunteer.role}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="e.g., Team Leader, Event Coordinator"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={newVolunteer.location}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="City, Region"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Join Date</label>
                <input
                  type="date"
                  name="join_date"
                  value={newVolunteer.join_date}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Hours Contributed</label>
                <input
                  type="number"
                  name="hours_contributed"
                  value={newVolunteer.hours_contributed}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Total hours"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Projects Participated</label>
                <input
                  type="number"
                  name="projects_participated"
                  value={newVolunteer.projects_participated}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Number of projects"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Bio</label>
                <textarea
                  name="bio"
                  value={newVolunteer.bio}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '80px' }}
                  placeholder="Short biography"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Achievements (comma separated)</label>
                <input
                  type="text"
                  value={newVolunteer.achievements.join(', ')}
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
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem', marginBottom: '0.5rem' }}
                />
                <input
                  type="text"
                  placeholder="LinkedIn username"
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem', marginBottom: '0.5rem' }}
                />
                <input
                  type="text"
                  placeholder="Instagram username"
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                <button onClick={closeAddModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                <button onClick={handleAddVolunteer} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Add Volunteer</button>
              </div>
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

export default AdminVolunteers;