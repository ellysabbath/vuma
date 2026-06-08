import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminUsers = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
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
  
  const [newUser, setNewUser] = useState({
    username: '', email: '', first_name: '', last_name: '', phone: '',
    role: 'volunteer', is_verified: true, bio: '', skills: '', city: '', region: '', profile_picture: ''
  });

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  useEffect(() => {
    AOS.init({ duration: 500, once: true });
    fetchUsers();
  }, []);

  useEffect(() => {
    if (id && users.length > 0) {
      const user = users.find(u => u.id === parseInt(id));
      if (user) { setSelectedUser(user); setShowModal(true); setIsEditMode(false); }
    }
  }, [id, users]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      let usersArray = [];
      if (data.success && data.data) usersArray = data.data;
      else if (Array.isArray(data)) usersArray = data;
      else if (data.data) usersArray = data.data;
      setUsers(usersArray);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => { setShowSuccess(false); setSuccessMessage(''); }, 3000);
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
      setProfileImagePreview(URL.createObjectURL(file));
      const base64 = await fileToBase64(file);
      setNewUser(prev => ({ ...prev, profile_picture: base64 }));
    }
  };

  const handleEditProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditProfileImagePreview(URL.createObjectURL(file));
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
    if (user.profile_picture) setEditProfileImagePreview(user.profile_picture);
  };

  const handleEditChange = (e) => {
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
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
          username: editingUser.username, email: editingUser.email,
          first_name: editingUser.first_name || '', last_name: editingUser.last_name || '',
          phone: editingUser.phone || '', role: editingUser.role || 'volunteer',
          is_verified: editingUser.is_verified, bio: editingUser.bio || '',
          skills: editingUser.skills || '', city: editingUser.city || '',
          region: editingUser.region || '', profile_picture: editingUser.profile_picture || ''
        })
      });
      if (response.ok) { await fetchUsers(); showAlert('User updated!'); closeModal(); }
      else { const errorData = await response.json(); alert(errorData.error || 'Failed to update'); }
    } catch (err) { alert('Network error. Please try again.'); }
  };

  const openAddModal = () => { setShowAddModal(true); document.body.style.overflow = 'hidden'; };
  const closeAddModal = () => {
    setShowAddModal(false);
    setNewUser({ username: '', email: '', first_name: '', last_name: '', phone: '', role: 'volunteer', is_verified: true, bio: '', skills: '', city: '', region: '', profile_picture: '' });
    setProfileImagePreview('');
    document.body.style.overflow = 'unset';
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email) { alert('Please fill in username and email'); return; }
    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUser)
      });
      if (response.ok) { await fetchUsers(); showAlert('User added!'); closeAddModal(); }
      else { const errorData = await response.json(); alert(errorData.error || 'Failed to add user'); }
    } catch (err) { alert('Network error. Please try again.'); }
  };

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Delete ${userName}?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/`, { method: 'DELETE' });
        if (response.ok) { await fetchUsers(); showAlert('User deleted!'); if (selectedUser?.id === userId) closeModal(); }
        else { const errorData = await response.json(); alert(errorData.error || 'Failed to delete'); }
      } catch (err) { alert('Network error.'); }
    }
  };

  const handleInputChange = (e) => { setNewUser({ ...newUser, [e.target.name]: e.target.value }); };

  const getRoleColor = (role) => {
    const colors = { 'admin': '#0B3B2F', 'innovator': '#00BCD4', 'volunteer': '#9C27B0', 'partner': '#FF9800', 'youth_leader': '#2196F3' };
    return colors[role] || '#757575';
  };

  const getRoleLabel = (role) => {
    const labels = { 'admin': 'Admin', 'innovator': 'Innovator', 'volunteer': 'Volunteer', 'partner': 'Partner', 'youth_leader': 'Youth Leader' };
    return labels[role] || role;
  };

  const getFullName = (user) => {
    if (user?.first_name || user?.last_name) return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    return user?.username || 'User';
  };

  const getInitials = (user) => {
    const fullName = getFullName(user);
    if (fullName && fullName !== user?.username) {
      const parts = fullName.split(' ');
      if (parts.length >= 2) return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
      return fullName.charAt(0).toUpperCase();
    }
    return user?.username?.charAt(0).toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid #F9C74F', borderTopColor: '#0B3B2F', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.8rem' }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}><i className="fas fa-exclamation-circle" style={{ fontSize: '2rem', color: '#d32f2f' }}></i><p style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>
          <button onClick={fetchUsers} style={{ marginTop: '0.5rem', background: '#0B3B2F', color: 'white', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '15px', cursor: 'pointer', fontSize: '0.7rem' }}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      {showSuccess && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999, animation: 'fadeInScale 0.3s ease' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '1rem', textAlign: 'center', minWidth: '200px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
              <i className="fas fa-check" style={{ fontSize: '1.5rem', color: 'white' }}></i>
            </div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Success!</h3>
            <p style={{ fontSize: '0.8rem' }}>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1rem' }} onClick={() => navigate('/admin')} />
            <h1 style={{ fontSize: '1.3rem', margin: 0 }}><i className="fas fa-users" style={{ marginRight: '0.4rem', color: '#F9C74F' }}></i>Users</h1>
          </div>
          <button onClick={openAddModal} style={{ background: '#F9C74F', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '20px', color: '#0B3B2F', fontWeight: 600, fontSize: '0.7rem', cursor: 'pointer' }}><i className="fas fa-plus"></i> Add User</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '0.8rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>User</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Username</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Role</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Location</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Verified</th>
                <th style={{ textAlign: 'center', padding: '0.5rem', color: '#666' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="user-row" style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(249,199,79,0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {user.profile_picture ? (
                        <img src={user.profile_picture} alt={getFullName(user)} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: getRoleColor(user.role), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 'bold' }}>{getInitials(user)}</div>
                      )}
                      <span style={{ cursor: 'pointer', color: '#0B3B2F', fontWeight: 600, fontSize: '0.75rem' }} onClick={() => openModal(user)}>{getFullName(user)}</span>
                    </div>
                   </td>
                  <td style={{ padding: '0.5rem', fontSize: '0.7rem' }}>@{user.username}</td>
                  <td style={{ padding: '0.5rem', fontSize: '0.7rem' }}>{user.email}</td>
                  <td style={{ padding: '0.5rem' }}><span style={{ background: `${getRoleColor(user.role)}15`, color: getRoleColor(user.role), padding: '0.15rem 0.4rem', borderRadius: '12px', fontSize: '0.6rem' }}>{getRoleLabel(user.role)}</span></td>
                  <td style={{ padding: '0.5rem', fontSize: '0.65rem', color: '#666' }}>{user.city || user.region ? `${user.city || ''} ${user.region || ''}`.trim() : '-'}</td>
                  <td style={{ padding: '0.5rem' }}>{user.is_verified ? <i className="fas fa-check-circle" style={{ color: '#4caf50', fontSize: '0.9rem' }} /> : <i className="fas fa-clock" style={{ color: '#ff9800', fontSize: '0.9rem' }} />}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                    <i className="fas fa-eye" style={{ color: '#0B3B2F', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.8rem' }} onClick={() => openModal(user)}></i>
                    <i className="fas fa-edit" style={{ color: '#2196F3', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.8rem' }} onClick={() => openEditModal(user)}></i>
                    <i className="fas fa-trash" style={{ color: '#d32f2f', cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => handleDelete(user.id, getFullName(user))}></i>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}><i className="fas fa-users-slash"></i> No users found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', maxWidth: '450px', width: '100%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', color: 'white' }}><i className="fas fa-times"></i></button>
            
            <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '1rem', textAlign: 'center', borderRadius: '20px 20px 0 0' }}>
              {selectedUser.profile_picture ? (
                <img src={selectedUser.profile_picture} alt={getFullName(selectedUser)} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #F9C74F', margin: '0 auto' }} />
              ) : (
                <div style={{ width: '60px', height: '60px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={isEditMode ? "fas fa-user-edit" : "fas fa-user"} style={{ fontSize: '1.8rem', color: '#0B3B2F' }}></i>
                </div>
              )}
              <h3 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '0.2rem', fontSize: '1.1rem' }}>{isEditMode ? 'Edit User' : getFullName(selectedUser)}</h3>
              {!isEditMode && <p style={{ color: '#F9C74F', fontSize: '0.7rem' }}>@{selectedUser.username}</p>}
            </div>
            
            <div style={{ padding: '1rem' }}>
              {isEditMode && editingUser ? (
                <>
                  <div style={{ marginBottom: '0.6rem' }}>{editProfileImagePreview && <img src={editProfileImagePreview} alt="Preview" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.3rem' }} />}<input type="file" accept="image/*" onChange={handleEditProfilePictureChange} style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }} /></div>
                  <input type="text" name="username" placeholder="Username *" value={editingUser.username} onChange={handleEditChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <input type="email" name="email" placeholder="Email *" value={editingUser.email} onChange={handleEditChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <input type="text" name="first_name" placeholder="First Name" value={editingUser.first_name || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <input type="text" name="last_name" placeholder="Last Name" value={editingUser.last_name || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <input type="text" name="phone" placeholder="Phone" value={editingUser.phone || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <input type="text" name="city" placeholder="City" value={editingUser.city || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <input type="text" name="region" placeholder="Region" value={editingUser.region || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <select name="role" value={editingUser.role} onChange={handleEditChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }}><option value="admin">Admin</option><option value="innovator">Innovator</option><option value="volunteer">Volunteer</option><option value="partner">Partner</option><option value="youth_leader">Youth Leader</option></select>
                  <select name="is_verified" value={editingUser.is_verified} onChange={handleEditChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }}><option value={true}>Verified</option><option value={false}>Pending</option></select>
                  <textarea name="bio" placeholder="Bio" value={editingUser.bio || ''} onChange={handleEditChange} rows="2" style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <textarea name="skills" placeholder="Skills (comma separated)" value={editingUser.skills || ''} onChange={handleEditChange} rows="2" style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.8rem' }} />
                  <div style={{ display: 'flex', gap: '0.5rem' }}><button onClick={closeModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.4rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Cancel</button><button onClick={handleUpdateUser} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.4rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Update</button></div>
                </>
              ) : (
                <>
                  <div style={{ background: '#f9fbf7', borderRadius: '8px', padding: '0.5rem', marginBottom: '0.5rem' }}><strong style={{ fontSize: '0.7rem' }}>Email:</strong> <span style={{ fontSize: '0.7rem' }}>{selectedUser.email}</span></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem', marginBottom: '0.5rem' }}>
                    <div style={{ background: '#f9fbf7', borderRadius: '8px', padding: '0.3rem' }}><strong style={{ fontSize: '0.65rem' }}>Full Name</strong><br/><span style={{ fontSize: '0.65rem' }}>{getFullName(selectedUser)}</span></div>
                    <div style={{ background: '#f9fbf7', borderRadius: '8px', padding: '0.3rem' }}><strong style={{ fontSize: '0.65rem' }}>Phone</strong><br/><span style={{ fontSize: '0.65rem' }}>{selectedUser.phone || '-'}</span></div>
                    <div style={{ background: '#f9fbf7', borderRadius: '8px', padding: '0.3rem' }}><strong style={{ fontSize: '0.65rem' }}>City</strong><br/><span style={{ fontSize: '0.65rem' }}>{selectedUser.city || '-'}</span></div>
                    <div style={{ background: '#f9fbf7', borderRadius: '8px', padding: '0.3rem' }}><strong style={{ fontSize: '0.65rem' }}>Region</strong><br/><span style={{ fontSize: '0.65rem' }}>{selectedUser.region || '-'}</span></div>
                  </div>
                  <div style={{ background: '#f9fbf7', borderRadius: '8px', padding: '0.3rem', marginBottom: '0.3rem', display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: '0.65rem' }}>Role:</strong> <span style={{ background: `${getRoleColor(selectedUser.role)}15`, color: getRoleColor(selectedUser.role), padding: '0.1rem 0.3rem', borderRadius: '10px', fontSize: '0.6rem' }}>{getRoleLabel(selectedUser.role)}</span></div>
                  <div style={{ background: '#f9fbf7', borderRadius: '8px', padding: '0.3rem', marginBottom: '0.3rem', display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: '0.65rem' }}>Status:</strong> {selectedUser.is_verified ? <span style={{ color: '#4caf50', fontSize: '0.65rem' }}>✓ Verified</span> : <span style={{ color: '#ff9800', fontSize: '0.65rem' }}>⏳ Pending</span>}</div>
                  <div style={{ background: '#f9fbf7', borderRadius: '8px', padding: '0.3rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: '0.65rem' }}>Joined:</strong> <span style={{ fontSize: '0.65rem' }}>{selectedUser.joined_date ? new Date(selectedUser.joined_date).toLocaleDateString() : '-'}</span></div>
                  {selectedUser.bio && <div style={{ background: '#f9fbf7', borderRadius: '8px', padding: '0.3rem', marginBottom: '0.3rem' }}><strong style={{ fontSize: '0.65rem' }}>Bio:</strong><br/><span style={{ fontSize: '0.65rem' }}>{selectedUser.bio}</span></div>}
                  {selectedUser.skills && <div style={{ background: '#f9fbf7', borderRadius: '8px', padding: '0.3rem', marginBottom: '0.5rem' }}><strong style={{ fontSize: '0.65rem' }}>Skills:</strong><br/><div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.3rem' }}>{selectedUser.skills.split(',').map((s, i) => <span key={i} style={{ background: '#e8f5e9', padding: '0.1rem 0.4rem', borderRadius: '10px', fontSize: '0.6rem' }}>{s.trim()}</span>)}</div></div>}
                  <div style={{ display: 'flex', gap: '0.5rem' }}><button onClick={closeModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.4rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Close</button><button onClick={() => openEditModal(selectedUser)} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.4rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Edit</button></div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeAddModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', maxWidth: '450px', width: '100%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={closeAddModal} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', color: 'white' }}><i className="fas fa-times"></i></button>
            
            <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '1rem', textAlign: 'center', borderRadius: '20px 20px 0 0' }}>
              <div style={{ width: '50px', height: '50px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-user-plus" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i></div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1.1rem' }}>Add New User</h2>
            </div>
            
            <div style={{ padding: '1rem' }}>
              {profileImagePreview && <img src={profileImagePreview} alt="Preview" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.5rem' }} />}
              <input type="file" accept="image/*" onChange={handleProfilePictureChange} style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
              <input type="text" name="username" placeholder="Username *" value={newUser.username} onChange={handleInputChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
              <input type="email" name="email" placeholder="Email *" value={newUser.email} onChange={handleInputChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
              <input type="text" name="first_name" placeholder="First Name" value={newUser.first_name} onChange={handleInputChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
              <input type="text" name="last_name" placeholder="Last Name" value={newUser.last_name} onChange={handleInputChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
              <input type="text" name="phone" placeholder="Phone" value={newUser.phone} onChange={handleInputChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
              <input type="text" name="city" placeholder="City" value={newUser.city} onChange={handleInputChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
              <input type="text" name="region" placeholder="Region" value={newUser.region} onChange={handleInputChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
              <select name="role" value={newUser.role} onChange={handleInputChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }}><option value="admin">Admin</option><option value="innovator">Innovator</option><option value="volunteer">Volunteer</option><option value="partner">Partner</option><option value="youth_leader">Youth Leader</option></select>
              <textarea name="bio" placeholder="Bio" value={newUser.bio} onChange={handleInputChange} rows="2" style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
              <textarea name="skills" placeholder="Skills (comma separated)" value={newUser.skills} onChange={handleInputChange} rows="2" style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.8rem' }} />
              <div style={{ display: 'flex', gap: '0.5rem' }}><button onClick={closeAddModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.4rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Cancel</button><button onClick={handleAddUser} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.4rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Add</button></div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInScale { from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        .modal-content { animation: slideInUp 0.3s ease; }
        .modal-overlay { animation: fadeIn 0.3s ease; }
        .user-row:hover { background: rgba(249,199,79,0.05); }
        .modal-content::-webkit-scrollbar { width: 4px; }
        .modal-content::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 2px; }
        .modal-content::-webkit-scrollbar-thumb { background: #F9C74F; border-radius: 2px; }
        @media (max-width: 768px) { .modal-content { max-width: 95% !important; } }
      `}</style>
    </div>
  );
};

export default AdminUsers;