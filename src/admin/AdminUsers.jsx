import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminUsers = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [editProfileImagePreview, setEditProfileImagePreview] = useState('');
  
  // New user form state
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'volunteer',
    is_verified: true,
    bio: '',
    skills: '',
    city: '',
    region: '',
    profile_picture: ''
  });

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  // Fetch users from API
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchUsers();
  }, []);

  // Handle URL param for direct user view
  useEffect(() => {
    if (id && users.length > 0) {
      const user = users.find(u => u.id === parseInt(id));
      if (user) {
        setSelectedUser(user);
        setShowModal(true);
        setIsEditMode(false);
      }
    }
  }, [id, users]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      // Handle response format: { success: true, data: [...] }
      let usersArray = [];
      if (data.success && data.data) {
        usersArray = data.data;
      } else if (Array.isArray(data)) {
        usersArray = data;
      } else if (data.data) {
        usersArray = data.data;
      }
      setUsers(usersArray);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please check your connection.');
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

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setProfileImagePreview(preview);
      const base64 = await fileToBase64(file);
      setNewUser(prev => ({ ...prev, profile_picture: base64 }));
    }
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

  const openModal = (user) => {
    setSelectedUser(user);
    setIsEditMode(false);
    setShowModal(true);
    navigate(`/admin/users/${user.id}`, { replace: true });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setIsEditMode(false);
    setEditingUser(null);
    setEditProfileImagePreview('');
    navigate('/admin/users', { replace: true });
    document.body.style.overflow = 'unset';
  };

  const openEditModal = (user) => {
    setEditingUser({ ...user });
    setIsEditMode(true);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
    if (user.profile_picture) {
      setEditProfileImagePreview(user.profile_picture);
    }
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
        await fetchUsers();
        showAlert('User updated successfully!');
        closeModal();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Network error. Please try again.');
    }
  };

  const openAddModal = () => {
    setShowAddModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewUser({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      role: 'volunteer',
      is_verified: true,
      bio: '',
      skills: '',
      city: '',
      region: '',
      profile_picture: ''
    });
    setProfileImagePreview('');
    document.body.style.overflow = 'unset';
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email) {
      alert('Please fill in username and email');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        await fetchUsers();
        showAlert('User added successfully!');
        closeAddModal();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to add user');
      }
    } catch (err) {
      console.error('Error adding user:', err);
      alert('Network error. Please try again.');
    }
  };

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await fetchUsers();
          showAlert('User deleted successfully!');
          if (selectedUser?.id === userId) {
            closeModal();
          }
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Failed to delete user');
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Network error. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  const getRoleColor = (role) => {
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

  const getFullName = (user) => {
    if (user?.first_name || user?.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user?.username || 'User';
  };

  const getInitials = (user) => {
    const fullName = getFullName(user);
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
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading users...</p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#d32f2f', marginBottom: '1rem' }}></i>
          <p style={{ color: '#666' }}>{error}</p>
          <button onClick={fetchUsers} style={{ marginTop: '1rem', background: '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer' }}>
            <i className="fas fa-sync-alt"></i> Try Again
          </button>
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
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => navigate('/admin')}></i>
            <h1 style={{ fontSize: '1.8rem' }}>Users Management</h1>
          </div>
          <p>Manage all registered users, their roles and permissions</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          
          {/* Add Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <i className="fas fa-plus-circle" style={{ fontSize: '2rem', color: '#0B3B2F', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={openAddModal} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} />
          </div>

          {/* Users Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>User</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Username</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Role</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Location</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Verified</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        {user.profile_picture ? (
                          <img src={user.profile_picture} alt={getFullName(user)} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg, ${getRoleColor(user.role)}, ${getRoleColor(user.role)}cc)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                            {getInitials(user)}
                          </div>
                        )}
                        <span style={{ cursor: 'pointer', color: '#0B3B2F', fontWeight: 600 }} onClick={() => openModal(user)}>{getFullName(user)}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.8rem' }}>@{user.username}</td>
                    <td style={{ padding: '0.8rem' }}>{user.email}</td>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{ background: `${getRoleColor(user.role)}15`, color: getRoleColor(user.role), padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem' }}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem' }}>{user.city || user.region ? `${user.city || ''} ${user.region || ''}`.trim() : '-'}</td>
                    <td style={{ padding: '0.8rem' }}>
                      {user.is_verified ? <i className="fas fa-check-circle" style={{ color: '#4caf50', fontSize: '1.1rem' }} /> : <i className="fas fa-clock" style={{ color: '#ff9800', fontSize: '1.1rem' }} />}
                    </td>
                    <td style={{ padding: '0.8rem' }}>
                      <i className="fas fa-eye" style={{ color: '#0B3B2F', cursor: 'pointer', marginRight: '0.8rem' }} onClick={() => openModal(user)}></i>
                      <i className="fas fa-edit" style={{ color: '#2196F3', cursor: 'pointer', marginRight: '0.8rem' }} onClick={() => openEditModal(user)}></i>
                      <i className="fas fa-trash" style={{ color: '#d32f2f', cursor: 'pointer' }} onClick={() => handleDelete(user.id, getFullName(user))}></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                <i className="fas fa-users-slash" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                <p>No users found. Click the + button to add a user.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Details/Edit Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={closeModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '28px', maxWidth: '550px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={closeModal} style={{
              position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.5)', border: 'none',
              width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '1.2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
            }}><i className="fas fa-times"></i></button>
            
            <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '1.5rem', textAlign: 'center', borderRadius: '28px 28px 0 0', flexShrink: 0 }}>
              {selectedUser.profile_picture ? (
                <img src={selectedUser.profile_picture} alt={getFullName(selectedUser)} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #F9C74F', margin: '0 auto' }} />
              ) : (
                <div style={{ width: '80px', height: '80px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={isEditMode ? "fas fa-user-edit" : "fas fa-user"} style={{ fontSize: '2.5rem', color: '#0B3B2F' }}></i>
                </div>
              )}
              <h2 style={{ color: 'white', marginTop: '0.8rem', marginBottom: '0.3rem', fontSize: '1.3rem' }}>
                {isEditMode ? 'Edit User' : getFullName(selectedUser)}
              </h2>
              {!isEditMode && <p style={{ color: '#F9C74F', fontSize: '0.9rem' }}>@{selectedUser.username}</p>}
            </div>
            
            <div style={{ padding: '1.2rem', overflowY: 'auto', flex: 1, maxHeight: 'calc(90vh - 140px)' }}>
              {isEditMode && editingUser ? (
                // Edit Form
                <>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Profile Picture</label>
                    {editProfileImagePreview && <img src={editProfileImagePreview} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.5rem' }} />}
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
                    <button onClick={closeModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                    <button onClick={handleUpdateUser} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Update User</button>
                  </div>
                </>
              ) : (
                // View Mode
                <>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Username</label>
                    <div style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', background: '#f9f9f9', color: '#333' }}>@{selectedUser.username}</div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Email</label>
                    <div style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', background: '#f9f9f9', color: '#333' }}>{selectedUser.email}</div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Full Name</label>
                    <div style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', background: '#f9f9f9', color: '#333' }}>{getFullName(selectedUser)}</div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Phone</label>
                    <div style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', background: '#f9f9f9', color: '#333' }}>{selectedUser.phone || 'Not provided'}</div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>City</label>
                    <div style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', background: '#f9f9f9', color: '#333' }}>{selectedUser.city || 'Not provided'}</div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Region</label>
                    <div style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', background: '#f9f9f9', color: '#333' }}>{selectedUser.region || 'Not provided'}</div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Role</label>
                    <div style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', background: '#f9f9f9', color: '#333' }}>
                      <span style={{ background: `${getRoleColor(selectedUser.role)}15`, color: getRoleColor(selectedUser.role), padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                        {getRoleLabel(selectedUser.role)}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Verification Status</label>
                    <div style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', background: '#f9f9f9', color: '#333' }}>
                      {selectedUser.is_verified ? <span style={{ color: '#4caf50' }}><i className="fas fa-check-circle"></i> Verified</span> : <span style={{ color: '#ff9800' }}><i className="fas fa-clock"></i> Pending</span>}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Joined Date</label>
                    <div style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', background: '#f9f9f9', color: '#333' }}>
                      {selectedUser.joined_date ? new Date(selectedUser.joined_date).toLocaleDateString() : '-'}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Total Hours</label>
                    <div style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', background: '#f9f9f9', color: '#333' }}>{selectedUser.total_hours || 0} hours</div>
                  </div>
                  
                  {selectedUser.bio && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Bio</label>
                      <div style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', background: '#f9f9f9', color: '#333' }}>{selectedUser.bio}</div>
                    </div>
                  )}
                  
                  {selectedUser.skills && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Skills</label>
                      <div style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', background: '#f9f9f9', color: '#333' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {selectedUser.skills.split(',').map((skill, i) => (
                            <span key={i} style={{ background: '#e8f5e9', color: '#0B3B2F', padding: '0.2rem 0.6rem', borderRadius: '15px', fontSize: '0.75rem' }}>{skill.trim()}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                    <button onClick={closeModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Close</button>
                    <button onClick={() => openEditModal(selectedUser)} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Edit User</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeAddModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '28px', maxWidth: '550px', width: '100%',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={closeAddModal} style={{
              position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.5)', border: 'none',
              width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '1.2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
            }}><i className="fas fa-times"></i></button>
            
            <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '1.5rem', textAlign: 'center', borderRadius: '28px 28px 0 0', flexShrink: 0 }}>
              <div style={{ width: '70px', height: '70px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-user-plus" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.3rem' }}>Add New User</h2>
            </div>
            
            <div style={{ padding: '1.2rem', overflowY: 'auto', flex: 1, maxHeight: 'calc(90vh - 140px)' }}>
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Profile Picture</label>
                {profileImagePreview && <img src={profileImagePreview} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.5rem' }} />}
                <input type="file" accept="image/*" onChange={handleProfilePictureChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Username *</label>
                <input type="text" name="username" value={newUser.username} onChange={handleInputChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }} placeholder="Enter username" />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Email *</label>
                <input type="email" name="email" value={newUser.email} onChange={handleInputChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }} placeholder="Enter email" />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>First Name</label>
                <input type="text" name="first_name" value={newUser.first_name} onChange={handleInputChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }} placeholder="Enter first name" />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Last Name</label>
                <input type="text" name="last_name" value={newUser.last_name} onChange={handleInputChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }} placeholder="Enter last name" />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Phone</label>
                <input type="text" name="phone" value={newUser.phone} onChange={handleInputChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }} placeholder="Enter phone number" />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>City</label>
                <input type="text" name="city" value={newUser.city} onChange={handleInputChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }} placeholder="Enter city" />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Region</label>
                <input type="text" name="region" value={newUser.region} onChange={handleInputChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }} placeholder="Enter region" />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Role</label>
                <select name="role" value={newUser.role} onChange={handleInputChange} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}>
                  <option value="admin">Admin</option>
                  <option value="innovator">Innovator</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="partner">Partner</option>
                  <option value="youth_leader">Youth Leader</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Bio</label>
                <textarea name="bio" value={newUser.bio} onChange={handleInputChange} rows="3" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }} placeholder="Enter bio" />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Skills (comma separated)</label>
                <textarea name="skills" value={newUser.skills} onChange={handleInputChange} rows="2" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }} placeholder="e.g., Leadership, Communication, Project Management" />
              </div>
              
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                <button onClick={closeAddModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                <button onClick={handleAddUser} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Add User</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInScale {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
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

export default AdminUsers;