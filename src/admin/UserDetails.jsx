import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const UserDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Mock data - in real app, this would come from an API
  const [users, setUsers] = useState([
    { id: 1, name: 'John Kimathi', email: 'john@vuma.or.tz', phone: '+255 123 456 789', role: 'Youth Leader', status: 'Active', joinDate: '2025-01-15', location: 'Dar es Salaam', projects: 5, hours: 120, bio: 'Passionate youth leader with 5 years of experience in community development.', skills: ['Leadership', 'Project Management', 'Community Outreach'], socialMedia: { twitter: '@johnkimathi', linkedin: 'john-kimathi' } },
    { id: 2, name: 'Mary Wanjiku', email: 'mary@vuma.or.tz', phone: '+255 123 456 790', role: 'Volunteer', status: 'Active', joinDate: '2025-02-20', location: 'Arusha', projects: 3, hours: 80, bio: 'Dedicated volunteer focused on environmental conservation.', skills: ['Communication', 'Team Work', 'Event Planning'], socialMedia: { twitter: '@marywanjiku', linkedin: 'mary-wanjiku' } },
    { id: 3, name: 'Peter Otieno', email: 'peter@vuma.or.tz', phone: '+255 123 456 791', role: 'Partner', status: 'Pending', joinDate: '2025-03-10', location: 'Mwanza', projects: 2, hours: 45, bio: 'Business partner bringing corporate resources to community projects.', skills: ['Business Development', 'Negotiation', 'Strategic Planning'], socialMedia: { twitter: '@peterotieno', linkedin: 'peter-otieno' } },
    { id: 4, name: 'Sarah Mbeki', email: 'sarah@vuma.or.tz', phone: '+255 123 456 792', role: 'Innovator', status: 'Active', joinDate: '2025-01-05', location: 'Dodoma', projects: 8, hours: 200, bio: 'Tech innovator creating digital solutions for community challenges.', skills: ['Programming', 'UI/UX Design', 'Innovation Management'], socialMedia: { twitter: '@sarahmbeki', linkedin: 'sarah-mbeki', github: 'sarah-dev' } },
  ]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    
    // Simulate API call
    setTimeout(() => {
      const foundUser = users.find(u => u.id === parseInt(id));
      if (foundUser) {
        setUser(foundUser);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleDelete = () => {
    // In real app, this would call an API
    setUsers(users.filter(u => u.id !== user.id));
    alert('User deleted successfully');
    navigate('/admin/users');
  };

  const openEditModal = () => {
    setEditingUser({ ...user });
    setShowEditModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    document.body.style.overflow = 'unset';
  };

  const handleEditChange = (e) => {
    setEditingUser({
      ...editingUser,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateUser = () => {
    if (!editingUser.name || !editingUser.email) {
      alert('Please fill in name and email');
      return;
    }
    
    // Update the user in the users array
    const updatedUsers = users.map(u => 
      u.id === editingUser.id ? editingUser : u
    );
    setUsers(updatedUsers);
    
    // Update the current user state
    setUser(editingUser);
    
    alert('User updated successfully');
    closeEditModal();
  };

  const handleBack = () => {
    navigate('/admin/users');
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? '#4caf50' : '#ff9800';
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'Youth Leader': '#2196F3',
      'Volunteer': '#9C27B0',
      'Partner': '#FF9800',
      'Innovator': '#00BCD4'
    };
    return colors[role] || '#757575';
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-user-slash" style={{ fontSize: '4rem', color: '#d32f2f', marginBottom: '1rem' }}></i>
            <h2>User Not Found</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>The user you're looking for doesn't exist or has been removed.</p>
            <div onClick={handleBack} style={{ display: 'inline-block', cursor: 'pointer' }}>
              <i className="fas fa-arrow-left" style={{ fontSize: '1.2rem', color: '#0B3B2F', marginRight: '0.5rem' }}></i>
              <span style={{ color: '#0B3B2F', fontWeight: 600 }}>Back to Users</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '2rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={handleBack}></i>
            <h1 style={{ fontSize: '1.8rem' }}>User Details</h1>
          </div>
          <p>View complete information about {user.name}</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Profile Header Card */}
        <div data-aos="fade-up" style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '2rem', textAlign: 'center', position: 'relative' }}>
            <div style={{ width: '120px', height: '120px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white' }}>
              <i className="fas fa-user" style={{ fontSize: '3.5rem', color: '#0B3B2F' }}></i>
            </div>
            <h2 style={{ marginTop: '1rem', marginBottom: '0.3rem', fontSize: '1.8rem' }}>{user.name}</h2>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                background: getRoleBadgeColor(user.role),
                color: 'white',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>{user.role}</span>
              <span style={{
                background: getStatusColor(user.status),
                color: 'white',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>{user.status}</span>
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
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{user.name}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Email Address</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{user.email}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Phone Number</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{user.phone}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Location</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{user.location}</p>
                </div>
              </div>
              
              <div>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-chart-line"></i> Activity Information
                </h3>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Join Date</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{user.joinDate}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Projects Participated</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem', fontWeight: 600, color: '#0B3B2F' }}>{user.projects} projects</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Volunteer Hours</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem', fontWeight: 600, color: '#0B3B2F' }}>{user.hours} hours</p>
                </div>
                <div>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Member Since</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
            {user.skills && user.skills.length > 0 && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-code"></i> Skills & Expertise
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {user.skills.map((skill, index) => (
                    <span key={index} style={{
                      background: '#e8f5e9',
                      color: '#0B3B2F',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '15px',
                      fontSize: '0.85rem',
                      fontWeight: 500
                    }}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media Section */}
            {user.socialMedia && Object.keys(user.socialMedia).length > 0 && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-share-alt"></i> Social Media
                </h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {user.socialMedia.twitter && (
                    <a href={`https://twitter.com/${user.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1DA1F2', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fab fa-twitter"></i> {user.socialMedia.twitter}
                    </a>
                  )}
                  {user.socialMedia.linkedin && (
                    <a href={`https://linkedin.com/in/${user.socialMedia.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: '#0077B5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fab fa-linkedin"></i> LinkedIn
                    </a>
                  )}
                  {user.socialMedia.github && (
                    <a href={`https://github.com/${user.socialMedia.github}`} target="_blank" rel="noopener noreferrer" style={{ color: '#333', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fab fa-github"></i> {user.socialMedia.github}
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
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B3B2F' }}>{new Date(user.joinDate).getFullYear()}</p>
          </div>
          
          <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-project-diagram" style={{ fontSize: '2rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
            <h3 style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Total Projects</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B3B2F' }}>{user.projects}</p>
          </div>
          
          <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-clock" style={{ fontSize: '2rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
            <h3 style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Volunteer Hours</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B3B2F' }}>{user.hours}</p>
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
              <h2 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.3rem' }}>Edit User</h2>
              <p style={{ color: '#F9C74F', fontSize: '0.9rem', marginTop: '0.3rem' }}>Update user information</p>
            </div>
            
            <div style={{ 
              padding: '1.2rem', 
              overflowY: 'auto', 
              flex: 1,
              maxHeight: 'calc(90vh - 140px)'
            }}>
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editingUser.name}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Enter full name"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Enter email address"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editingUser.phone}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Role</label>
                <select
                  name="role"
                  value={editingUser.role}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                >
                  <option value="Volunteer">Volunteer</option>
                  <option value="Youth Leader">Youth Leader</option>
                  <option value="Partner">Partner</option>
                  <option value="Innovator">Innovator</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Status</label>
                <select
                  name="status"
                  value={editingUser.status}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={editingUser.location}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Enter location"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Join Date</label>
                <input
                  type="text"
                  value={editingUser.joinDate}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', background: '#f5f5f5' }}
                  disabled
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Projects</label>
                <input
                  type="number"
                  name="projects"
                  value={editingUser.projects}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Number of projects"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Volunteer Hours</label>
                <input
                  type="number"
                  name="hours"
                  value={editingUser.hours}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Volunteer hours"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Bio</label>
                <textarea
                  name="bio"
                  value={editingUser.bio || ''}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '80px' }}
                  placeholder="Enter user biography"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                <div onClick={closeEditModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', textAlign: 'center' }}>
                  Cancel
                </div>
                <div onClick={handleUpdateUser} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', textAlign: 'center' }}>
                  Update User
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
            <h3 style={{ marginBottom: '0.5rem' }}>Delete User</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Are you sure you want to delete {user.name}? This action cannot be undone.</p>
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
        
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
        
        /* Custom scrollbar */
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