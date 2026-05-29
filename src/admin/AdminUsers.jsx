import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminUsers = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [users, setUsers] = useState([
    { id: 1, name: 'John Kimathi', email: 'john@vuma.or.tz', phone: '+255 123 456 789', role: 'Youth Leader', status: 'Active', joinDate: '2025-01-15', location: 'Dar es Salaam', projects: 5, hours: 120 },
    { id: 2, name: 'Mary Wanjiku', email: 'mary@vuma.or.tz', phone: '+255 123 456 790', role: 'Volunteer', status: 'Active', joinDate: '2025-02-20', location: 'Arusha', projects: 3, hours: 80 },
    { id: 3, name: 'Peter Otieno', email: 'peter@vuma.or.tz', phone: '+255 123 456 791', role: 'Partner', status: 'Pending', joinDate: '2025-03-10', location: 'Mwanza', projects: 2, hours: 45 },
    { id: 4, name: 'Sarah Mbeki', email: 'sarah@vuma.or.tz', phone: '+255 123 456 792', role: 'Innovator', status: 'Active', joinDate: '2025-01-05', location: 'Dodoma', projects: 8, hours: 200 },
  ]);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    if (id) {
      const user = users.find(u => u.id === parseInt(id));
      if (user) {
        setSelectedUser(user);
        setShowModal(true);
      }
    }
  }, [id]);

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    navigate(`/admin/users/${user.id}`, { replace: true });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    navigate('/admin/users', { replace: true });
    document.body.style.overflow = 'unset';
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
      alert('User deleted successfully');
    }
  };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '2rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => navigate('/admin')}></i>
            <h1 style={{ fontSize: '1.8rem' }}>Users Management</h1>
          </div>
          <p>Manage all registered users, their roles and permissions</p>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Role</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Join Date</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Actions</th>
                 </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{ cursor: 'pointer', color: '#0B3B2F', fontWeight: 600 }} onClick={() => openModal(user)}>
                        {user.name}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem' }}>{user.email}</td>
                    <td style={{ padding: '0.8rem' }}>{user.role}</td>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{
                        background: user.status === 'Active' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                        color: user.status === 'Active' ? '#4caf50' : '#ff9800',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem'
                      }}>{user.status}</span>
                    </td>
                    <td style={{ padding: '0.8rem' }}>{user.joinDate}</td>
                    <td style={{ padding: '0.8rem' }}>
                      <i className="fas fa-eye" style={{ color: '#0B3B2F', cursor: 'pointer', marginRight: '0.8rem' }} onClick={() => openModal(user)}></i>
                      <i className="fas fa-trash" style={{ color: '#d32f2f', cursor: 'pointer' }} onClick={() => handleDelete(user.id)}></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={closeModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '28px', maxWidth: '500px', width: '100%', position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={closeModal} style={{
              position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.5)', border: 'none',
              width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '1.2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
            }}><i className="fas fa-times"></i></button>
            
            <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '2rem', textAlign: 'center', borderRadius: '28px 28px 0 0' }}>
              <div style={{ width: '100px', height: '100px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-user" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '1rem', marginBottom: '0.3rem' }}>{selectedUser.name}</h2>
              <p style={{ color: '#F9C74F' }}>{selectedUser.role}</p>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}><strong>Email:</strong> {selectedUser.email}</div>
              <div style={{ marginBottom: '1rem' }}><strong>Phone:</strong> {selectedUser.phone}</div>
              <div style={{ marginBottom: '1rem' }}><strong>Location:</strong> {selectedUser.location}</div>
              <div style={{ marginBottom: '1rem' }}><strong>Status:</strong> {selectedUser.status}</div>
              <div style={{ marginBottom: '1rem' }}><strong>Join Date:</strong> {selectedUser.joinDate}</div>
              <div style={{ marginBottom: '1rem' }}><strong>Projects:</strong> {selectedUser.projects}</div>
              <div><strong>Volunteer Hours:</strong> {selectedUser.hours}</div>
              <button onClick={closeModal} style={{ width: '100%', marginTop: '1.5rem', background: '#F9C74F', border: 'none', padding: '0.8rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default AdminUsers;