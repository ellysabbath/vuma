import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John M. Kimathi',
    email: 'john.kimathi@vuma.or.tz',
    phone: '+255 123 456 789',
    location: 'Dar es Salaam, Tanzania',
    role: 'Youth Leader',
    joinDate: 'January 15, 2025',
    bio: 'Passionate about environmental conservation and youth empowerment. Leading community initiatives across Tanzania.',
    interests: ['Environmental Conservation', 'Youth Leadership', 'Climate Action', 'Innovation'],
    achievements: [
      'Completed Leadership Bootcamp 2025',
      'Planted 500+ trees in local communities',
      'Organized 3 youth awareness workshops'
    ],
    socialLinks: {
      twitter: '@johnkimathi',
      linkedin: 'john-kimathi',
      instagram: '@johnkimathi'
    }
  });

  const [formData, setFormData] = useState(userData);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUserData(formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  const stats = [
    { label: 'Projects Joined', value: '12', icon: 'fas fa-project-diagram' },
    { label: 'Volunteer Hours', value: '245', icon: 'fas fa-clock' },
    { label: 'Events Attended', value: '8', icon: 'fas fa-calendar-check' },
    { label: 'Trees Planted', value: '156', icon: 'fas fa-tree' }
  ];

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white',
        padding: '3rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(249,199,79,0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: '#F9C74F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              color: '#0B3B2F'
            }}>
              <i className="fas fa-user"></i>
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '0.5rem' }}>
                {userData.name}
              </h1>
              <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>
                <i className="fas fa-envelope" style={{ marginRight: '0.5rem' }}></i>
                {userData.email}
              </p>
              <p style={{ opacity: 0.9 }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: '0.5rem' }}></i>
                {userData.location}
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <span style={{
                  background: 'rgba(249,199,79,0.2)',
                  padding: '0.2rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem'
                }}>
                  {userData.role}
                </span>
                <span style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '0.2rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem'
                }}>
                  Member since {userData.joinDate}
                </span>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: '#F9C74F',
                  border: 'none',
                  padding: '0.7rem 1.5rem',
                  borderRadius: '50px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-edit"></i>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {stats.map((stat, idx) => (
            <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100} style={{
              background: 'white',
              borderRadius: '20px',
              padding: '1.5rem',
              textAlign: 'center',
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
            }}>
              <i className={stat.icon} style={{ fontSize: '2rem', color: '#F9C74F', marginBottom: '0.5rem' }}></i>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0B3B2F' }}>{stat.value}</div>
              <div style={{ color: '#666', fontSize: '0.85rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: '2px solid #e0e0e0',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {['overview', 'activities', 'achievements', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.8rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: activeTab === tab ? '#F9C74F' : '#666',
                borderBottom: activeTab === tab ? '2px solid #F9C74F' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div data-aos="fade-up">
            {isEditing ? (
              // Edit Form
              <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1.5rem' }}>Edit Profile Information</h3>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #ddd', resize: 'vertical' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleCancel}
                      style={{
                        background: '#e0e0e0',
                        border: 'none',
                        padding: '0.7rem 1.5rem',
                        borderRadius: '50px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      style={{
                        background: '#F9C74F',
                        border: 'none',
                        padding: '0.7rem 1.5rem',
                        borderRadius: '50px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>About Me</h3>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>{userData.bio}</p>
                </div>

                <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>Interests</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                    {userData.interests.map((interest, idx) => (
                      <span key={idx} style={{
                        background: 'rgba(249,199,79,0.1)',
                        color: '#0B3B2F',
                        padding: '0.3rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem'
                      }}>
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>Contact Information</h3>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <i className="fas fa-phone" style={{ color: '#F9C74F', width: '30px' }}></i>
                      <span>{userData.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <i className="fas fa-envelope" style={{ color: '#F9C74F', width: '30px' }}></i>
                      <span>{userData.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <i className="fas fa-map-marker-alt" style={{ color: '#F9C74F', width: '30px' }}></i>
                      <span>{userData.location}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'activities' && (
          <div data-aos="fade-up">
            <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: '#0B3B2F', marginBottom: '1.5rem' }}>Recent Activities</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { title: 'Completed Leadership Bootcamp', date: 'March 2026', status: 'Completed' },
                  { title: 'Joined Tree Planting Drive', date: 'February 2026', status: 'Completed' },
                  { title: 'Registered for Climate Summit', date: 'January 2026', status: 'Upcoming' }
                ].map((activity, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <div>
                      <h4 style={{ marginBottom: '0.3rem' }}>{activity.title}</h4>
                      <span style={{ fontSize: '0.8rem', color: '#888' }}>{activity.date}</span>
                    </div>
                    <span style={{
                      background: activity.status === 'Completed' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(249,199,79,0.1)',
                      color: activity.status === 'Completed' ? '#4caf50' : '#F9C74F',
                      padding: '0.2rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem'
                    }}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div data-aos="fade-up">
            <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: '#0B3B2F', marginBottom: '1.5rem' }}>My Achievements</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {userData.achievements.map((achievement, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: '#f9fbf7',
                    borderRadius: '16px'
                  }}>
                    <i className="fas fa-trophy" style={{ color: '#F9C74F', fontSize: '1.5rem' }}></i>
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div data-aos="fade-up">
            <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: '#0B3B2F', marginBottom: '1.5rem' }}>Account Settings</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #f0f0f0' }}>
                  <h4>Change Password</h4>
                  <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.3rem' }}>Update your password regularly to keep your account secure</p>
                  <button style={{
                    marginTop: '0.8rem',
                    background: 'transparent',
                    border: '1px solid #F9C74F',
                    padding: '0.5rem 1rem',
                    borderRadius: '50px',
                    cursor: 'pointer'
                  }}>
                    Change Password
                  </button>
                </div>
                <div style={{ padding: '1rem', borderBottom: '1px solid #f0f0f0' }}>
                  <h4>Notification Preferences</h4>
                  <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.3rem' }}>Manage how you receive updates from VUMA Tanzania</p>
                  <button style={{
                    marginTop: '0.8rem',
                    background: 'transparent',
                    border: '1px solid #F9C74F',
                    padding: '0.5rem 1rem',
                    borderRadius: '50px',
                    cursor: 'pointer'
                  }}>
                    Manage Notifications
                  </button>
                </div>
                <div style={{ padding: '1rem' }}>
                  <h4>Delete Account</h4>
                  <p style={{ fontSize: '0.8rem', color: '#d32f2f', marginTop: '0.3rem' }}>Permanently delete your account and all associated data</p>
                  <button style={{
                    marginTop: '0.8rem',
                    background: '#d32f2f',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '50px',
                    cursor: 'pointer'
                  }}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;