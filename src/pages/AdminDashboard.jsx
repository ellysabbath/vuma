import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Kimathi', email: 'john@vuma.or.tz', role: 'Youth Leader', status: 'Active', joinDate: '2025-01-15' },
    { id: 2, name: 'Mary Wanjiku', email: 'mary@vuma.or.tz', role: 'Volunteer', status: 'Active', joinDate: '2025-02-20' },
    { id: 3, name: 'Peter Otieno', email: 'peter@vuma.or.tz', role: 'Partner', status: 'Pending', joinDate: '2025-03-10' },
    { id: 4, name: 'Sarah Mbeki', email: 'sarah@vuma.or.tz', role: 'Innovator', status: 'Active', joinDate: '2025-01-05' },
  ]);

  const [projects, setProjects] = useState([
    { id: 1, title: 'Solar-Powered Water Pump', category: 'Environment', status: 'Ongoing', progress: 75 },
    { id: 2, title: 'Youth Leadership Academy', category: 'Leadership', status: 'Completed', progress: 100 },
    { id: 3, title: 'Plastic Upcycling Hub', category: 'Environment', status: 'Ongoing', progress: 60 },
    { id: 4, title: 'Policy Innovators Fellowship', category: 'Leadership', status: 'Planning', progress: 30 },
  ]);

  const [events, setEvents] = useState([
    { id: 1, title: 'Youth Leadership Bootcamp', date: '2026-05-30', attendees: 45, status: 'Upcoming' },
    { id: 2, title: 'Tree Planting Drive', date: '2026-06-05', attendees: 120, status: 'Upcoming' },
    { id: 3, title: 'Climate Policy Webinar', date: '2026-06-12', attendees: 89, status: 'Upcoming' },
  ]);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  const stats = [
    { label: 'Total Users', value: '1,248', icon: 'fas fa-users', color: '#0B3B2F', change: '+12%' },
    { label: 'Active Projects', value: '18', icon: 'fas fa-project-diagram', color: '#F9C74F', change: '+5%' },
    { label: 'Completed Events', value: '24', icon: 'fas fa-calendar-check', color: '#2b7a5c', change: '+8%' },
    { label: 'Volunteer Hours', value: '3,245', icon: 'fas fa-clock', color: '#F9C74F', change: '+15%' },
    { label: 'Partners', value: '32', icon: 'fas fa-handshake', color: '#0B3B2F', change: '+3%' },
    { label: 'Trees Planted', value: '18,750', icon: 'fas fa-tree', color: '#2b7a5c', change: '+22%' },
  ];

  const handleUserStatus = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    alert(`User status updated to ${newStatus}`);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      alert('User deleted successfully');
    }
  };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      {/* Admin Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white',
        padding: '2rem 2rem',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '0.5rem' }}>
                <i className="fas fa-shield-alt" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                Admin Dashboard
              </h1>
              <p style={{ opacity: 0.9 }}>Manage users, projects, and monitor platform activity</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <i className="fas fa-bell"></i>
                <span>Notifications</span>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <i className="fas fa-user-shield"></i>
                <span>Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {stats.map((stat, idx) => (
            <div key={idx} data-aos="fade-up" data-aos-delay={idx * 50} style={{
              background: 'white',
              borderRadius: '20px',
              padding: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>{stat.label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0B3B2F' }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#4caf50', marginTop: '0.5rem' }}>{stat.change} from last month</div>
              </div>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: `${stat.color}10`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className={stat.icon} style={{ fontSize: '1.5rem', color: stat.color }}></i>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '2px solid #e0e0e0',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {['overview', 'users', 'projects', 'events', 'reports'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.8rem 1.5rem',
                fontSize: '0.9rem',
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div data-aos="fade-up">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
              {/* Recent Users */}
              <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>Recent Users</h3>
                {users.slice(0, 3).map(user => (
                  <div key={user.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.8rem 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>{user.email}</div>
                    </div>
                    <span style={{
                      background: user.status === 'Active' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                      color: user.status === 'Active' ? '#4caf50' : '#ff9800',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '20px',
                      fontSize: '0.7rem'
                    }}>
                      {user.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Active Projects */}
              <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>Active Projects</h3>
                {projects.filter(p => p.status === 'Ongoing').map(project => (
                  <div key={project.id} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 500 }}>{project.title}</span>
                      <span style={{ fontSize: '0.8rem', color: '#888' }}>{project.progress}%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      background: '#f0f0f0',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${project.progress}%`,
                        height: '100%',
                        background: '#F9C74F',
                        borderRadius: '3px'
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Upcoming Events */}
              <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>Upcoming Events</h3>
                {events.map(event => (
                  <div key={event.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.8rem 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{event.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>{event.date} • {event.attendees} attendees</div>
                    </div>
                    <span style={{
                      background: 'rgba(249,199,79,0.1)',
                      color: '#F9C74F',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '20px',
                      fontSize: '0.7rem'
                    }}>
                      {event.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gap: '0.8rem' }}>
                  <button style={{
                    background: '#F9C74F',
                    border: 'none',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}>
                    <i className="fas fa-user-plus"></i>
                    Add New User
                  </button>
                  <button style={{
                    background: '#0B3B2F',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}>
                    <i className="fas fa-project-diagram"></i>
                    Create New Project
                  </button>
                  <button style={{
                    background: '#2b7a5c',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}>
                    <i className="fas fa-calendar-plus"></i>
                    Schedule Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div data-aos="fade-up">
            <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ color: '#0B3B2F' }}>All Users</h3>
                <input
                  type="text"
                  placeholder="Search users..."
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '50px',
                    border: '1px solid #ddd',
                    width: '250px'
                  }}
                />
              </div>
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
                        <td style={{ padding: '0.8rem' }}>{user.name}</td>
                        <td style={{ padding: '0.8rem' }}>{user.email}</td>
                        <td style={{ padding: '0.8rem' }}>{user.role}</td>
                        <td style={{ padding: '0.8rem' }}>
                          <select
                            value={user.status}
                            onChange={(e) => handleUserStatus(user.id, e.target.value)}
                            style={{
                              padding: '0.2rem 0.5rem',
                              borderRadius: '20px',
                              border: '1px solid #ddd',
                              background: user.status === 'Active' ? '#4caf5010' : '#ff980010'
                            }}
                          >
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Suspended">Suspended</option>
                          </select>
                        </td>
                        <td style={{ padding: '0.8rem' }}>{user.joinDate}</td>
                        <td style={{ padding: '0.8rem' }}>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#d32f2f',
                              cursor: 'pointer'
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div data-aos="fade-up">
            <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B3B2F' }}>All Projects</h3>
                <button style={{
                  background: '#F9C74F',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '50px',
                  cursor: 'pointer'
                }}>
                  + Add Project
                </button>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {projects.map(project => (
                  <div key={project.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    border: '1px solid #f0f0f0',
                    borderRadius: '12px',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <h4>{project.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#888' }}>{project.category}</p>
                    </div>
                    <div style={{ width: '200px' }}>
                      <div style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Progress: {project.progress}%</div>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        background: '#f0f0f0',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${project.progress}%`,
                          height: '100%',
                          background: project.status === 'Completed' ? '#4caf50' : '#F9C74F',
                          borderRadius: '3px'
                        }} />
                      </div>
                    </div>
                    <div>
                      <span style={{
                        background: project.status === 'Completed' ? 'rgba(76, 175, 80, 0.1)' : 
                                   project.status === 'Ongoing' ? 'rgba(249,199,79,0.1)' : 'rgba(33, 150, 243, 0.1)',
                        color: project.status === 'Completed' ? '#4caf50' : 
                               project.status === 'Ongoing' ? '#F9C74F' : '#2196f3',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem'
                      }}>
                        {project.status}
                      </span>
                    </div>
                    <div>
                      <button style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        marginRight: '0.5rem'
                      }}>
                        <i className="fas fa-edit" style={{ color: '#0B3B2F' }}></i>
                      </button>
                      <button style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}>
                        <i className="fas fa-trash" style={{ color: '#d32f2f' }}></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div data-aos="fade-up">
            <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B3B2F' }}>All Events</h3>
                <button style={{
                  background: '#F9C74F',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '50px',
                  cursor: 'pointer'
                }}>
                  + Create Event
                </button>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {events.map(event => (
                  <div key={event.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    border: '1px solid #f0f0f0',
                    borderRadius: '12px',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <h4>{event.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#888' }}>
                        <i className="fas fa-calendar-alt" style={{ marginRight: '0.3rem' }}></i>
                        {event.date}
                      </p>
                    </div>
                    <div>
                      <i className="fas fa-users" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                      {event.attendees} attendees
                    </div>
                    <div>
                      <span style={{
                        background: 'rgba(249,199,79,0.1)',
                        color: '#F9C74F',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem'
                      }}>
                        {event.status}
                      </span>
                    </div>
                    <div>
                      <button style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        marginRight: '0.5rem'
                      }}>
                        <i className="fas fa-edit" style={{ color: '#0B3B2F' }}></i>
                      </button>
                      <button style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}>
                        <i className="fas fa-trash" style={{ color: '#d32f2f' }}></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div data-aos="fade-up">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>Generate Report</h3>
                <select style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '1rem' }}>
                  <option>User Activity Report</option>
                  <option>Project Progress Report</option>
                  <option>Event Participation Report</option>
                  <option>Financial Report</option>
                </select>
                <input type="month" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '1rem' }} />
                <button style={{
                  width: '100%',
                  background: '#F9C74F',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  Download Report
                </button>
              </div>

              <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>Export Data</h3>
                <button style={{
                  width: '100%',
                  background: '#0B3B2F',
                  color: 'white',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: '0.8rem'
                }}>
                  Export Users (CSV)
                </button>
                <button style={{
                  width: '100%',
                  background: '#0B3B2F',
                  color: 'white',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: '0.8rem'
                }}>
                  Export Projects (CSV)
                </button>
                <button style={{
                  width: '100%',
                  background: '#0B3B2F',
                  color: 'white',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  Export Events (CSV)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;