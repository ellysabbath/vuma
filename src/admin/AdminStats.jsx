import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminStats = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingStats, setEditingStats] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [hasStats, setHasStats] = useState(false);
  const [statsHistory, setStatsHistory] = useState([]);

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/leaders';

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/stats/`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
        setHasStats(true);
        showActionFeedback('Stats loaded successfully!', 'success');
      } else {
        setHasStats(false);
        setStats(null);
        if (data.error === 'No stats found') {
          setError('No stats found. Create new stats to get started.');
        } else {
          setError(data.error || 'Failed to load stats');
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Network error. Please check your connection.');
      showActionFeedback('Network error. Please check your connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showActionFeedback = (message, type = 'success') => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const openEditModal = () => {
    setEditingStats({ ...stats });
    setShowEditModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingStats(null);
    document.body.style.overflow = 'unset';
    setActionLoading(false);
  };

  const openCreateModal = () => {
    setEditingStats({
      years_experience: 0,
      projects_completed: 0,
      youth_empowered: 0,
      community_partners: 0,
      is_active: true
    });
    setShowCreateModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setEditingStats(null);
    document.body.style.overflow = 'unset';
    setActionLoading(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingStats({
      ...editingStats,
      [name]: parseInt(value) || 0
    });
  };

  const handleUpdateStats = async () => {
    if (!editingStats) return;
    
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/stats/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingStats),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchStats();
        showActionFeedback('Stats updated successfully!', 'success');
        closeEditModal();
      } else {
        showActionFeedback(data.error || 'Failed to update stats', 'error');
      }
    } catch (error) {
      console.error('Error updating stats:', error);
      showActionFeedback('Network error. Please try again.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateStats = async () => {
    if (!editingStats) return;
    
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/stats/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingStats),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchStats();
        showActionFeedback('Stats created successfully!', 'success');
        closeCreateModal();
      } else {
        showActionFeedback(data.error || 'Failed to create stats', 'error');
      }
    } catch (error) {
      console.error('Error creating stats:', error);
      showActionFeedback('Network error. Please try again.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetStats = async () => {
    const confirmReset = window.confirm('Are you sure you want to reset stats to default values?');
    if (confirmReset) {
      setActionLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/stats/reset/`, {
          method: 'POST',
        });
        
        const data = await response.json();
        if (data.success) {
          await fetchStats();
          showActionFeedback('Stats reset to default values successfully!', 'success');
        } else {
          showActionFeedback(data.error || 'Failed to reset stats', 'error');
        }
      } catch (error) {
        console.error('Error resetting stats:', error);
        showActionFeedback('Network error. Please try again.', 'error');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDeleteStats = async () => {
    if (!stats) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete these stats? This action cannot be undone.');
    if (confirmDelete) {
      setActionLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/stats/${stats.id}/`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        if (data.success) {
          setStats(null);
          setHasStats(false);
          showActionFeedback('Stats deleted successfully!', 'success');
        } else {
          showActionFeedback(data.error || 'Failed to delete stats', 'error');
        }
      } catch (error) {
        console.error('Error deleting stats:', error);
        showActionFeedback('Network error. Please try again.', 'error');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  const handleRefresh = () => {
    fetchStats();
  };

  const formatNumber = (num) => {
    return num ? num.toLocaleString() : '0';
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
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
              background: successMessage.includes('success') || successMessage.includes('Success') ? '#4caf50' : '#f44336',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              animation: 'scaleIn 0.5s ease'
            }}>
              <i className={`fas ${successMessage.includes('success') || successMessage.includes('Success') ? 'fa-check' : 'fa-times'}`} style={{ fontSize: '2.5rem', color: 'white' }}></i>
            </div>
            <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>
              {successMessage.includes('success') || successMessage.includes('Success') ? 'Success!' : 'Error!'}
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {actionLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center', background: 'white', padding: '2rem', borderRadius: '20px' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
            <p style={{ marginTop: '1rem', color: '#666' }}>Processing...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '1.5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1rem' }} onClick={handleBackToAdmin}></i>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Organization Statistics</h1>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <i 
                className="fas fa-sync-alt" 
                style={{ 
                  fontSize: '1rem', 
                  cursor: 'pointer',
                  padding: '0.5rem',
                  transition: 'transform 0.2s'
                }}
                onClick={handleRefresh}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(180deg)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0)'}
              ></i>
            </div>
          </div>
          <p style={{ fontSize: '0.813rem', opacity: 0.9, margin: '0.25rem 0 0 0' }}>Manage organization statistics displayed on the website</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {/* Header with Action Buttons */}
          <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                {hasStats ? 'Current statistics are displayed below' : 'No statistics found'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {!hasStats && (
                <button
                  onClick={openCreateModal}
                  style={{
                    background: '#0B3B2F',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '8px',
                    fontSize: '0.813rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(11, 59, 47, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#1a5c48';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(11, 59, 47, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#0B3B2F';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(11, 59, 47, 0.2)';
                  }}
                >
                  <i className="fas fa-plus" style={{ fontSize: '0.75rem' }}></i>
                  Create Stats
                </button>
              )}
              {hasStats && (
                <>
                  <button
                    onClick={openEditModal}
                    style={{
                      background: '#2196F3',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1.25rem',
                      borderRadius: '8px',
                      fontSize: '0.813rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(33, 150, 243, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#1976D2';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#2196F3';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(33, 150, 243, 0.2)';
                    }}
                  >
                    <i className="fas fa-edit"></i>
                    Edit Stats
                  </button>
                  <button
                    onClick={handleResetStats}
                    style={{
                      background: '#FF9800',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1.25rem',
                      borderRadius: '8px',
                      fontSize: '0.813rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(255, 152, 0, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F57C00';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FF9800';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 152, 0, 0.2)';
                    }}
                  >
                    <i className="fas fa-undo"></i>
                    Reset to Default
                  </button>
                  <button
                    onClick={handleDeleteStats}
                    style={{
                      background: '#d32f2f',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1.25rem',
                      borderRadius: '8px',
                      fontSize: '0.813rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(211, 47, 47, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#C62828';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(211, 47, 47, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#d32f2f';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(211, 47, 47, 0.2)';
                    }}
                  >
                    <i className="fas fa-trash"></i>
                    Delete Stats
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats Display */}
          {hasStats && stats ? (
            <div style={{ padding: '2rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem'
              }}>
                {/* Years Experience */}
                <div data-aos="fade-up" style={{
                  background: 'linear-gradient(135deg, #f8fafc, #ffffff)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'rgba(249,199,79,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="fas fa-calendar-alt" style={{ color: '#F9C74F', fontSize: '1.2rem' }}></i>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Years Experience</span>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0B3B2F' }}>
                    {stats.years_experience}+
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Years of combined experience
                  </div>
                </div>

                {/* Projects Completed */}
                <div data-aos="fade-up" data-aos-delay="100" style={{
                  background: 'linear-gradient(135deg, #f8fafc, #ffffff)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'rgba(33,150,243,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="fas fa-project-diagram" style={{ color: '#2196F3', fontSize: '1.2rem' }}></i>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Projects Completed</span>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0B3B2F' }}>
                    {stats.projects_completed}+
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Projects completed successfully
                  </div>
                </div>

                {/* Youth Empowered */}
                <div data-aos="fade-up" data-aos-delay="200" style={{
                  background: 'linear-gradient(135deg, #f8fafc, #ffffff)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'rgba(76,175,80,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="fas fa-users" style={{ color: '#4caf50', fontSize: '1.2rem' }}></i>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Youth Empowered</span>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0B3B2F' }}>
                    {formatNumber(stats.youth_empowered)}+
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Youth empowered through programs
                  </div>
                </div>

                {/* Community Partners */}
                <div data-aos="fade-up" data-aos-delay="300" style={{
                  background: 'linear-gradient(135deg, #f8fafc, #ffffff)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'rgba(156,39,176,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="fas fa-handshake" style={{ color: '#9C27B0', fontSize: '1.2rem' }}></i>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Community Partners</span>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0B3B2F' }}>
                    {stats.community_partners}+
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Community partners collaborating
                  </div>
                </div>
              </div>

              {/* Status and Timestamp */}
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: stats.is_active ? '#4caf50' : '#ef4444'
                  }}></span>
                  <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                    Status: <strong>{stats.is_active ? 'Active' : 'Inactive'}</strong>
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  <i className="fas fa-clock" style={{ marginRight: '0.3rem' }}></i>
                  Last updated: {new Date(stats.updated_at).toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <i className="fas fa-chart-bar" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '1rem' }}></i>
              <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>No Statistics Found</h3>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Create new organization statistics to display on the website.</p>
              <button
                onClick={openCreateModal}
                style={{
                  background: '#0B3B2F',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1a5c48';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#0B3B2F';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <i className="fas fa-plus"></i>
                Create Stats
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Stats Modal */}
      {showEditModal && editingStats && (
        <div className="modal-overlay" onClick={closeEditModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '20px', maxWidth: '500px', width: '100%', 
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={closeEditModal} style={{
              position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', border: 'none',
              width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
            ><i className="fas fa-times"></i></button>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', 
              padding: '1.25rem', 
              textAlign: 'center', 
              borderRadius: '20px 20px 0 0',
              flexShrink: 0
            }}>
              <div style={{ width: '56px', height: '56px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-chart-bar" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Edit Statistics</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>Update organization statistics</p>
            </div>
            
            <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Years of Combined Experience</label>
                <input
                  type="number"
                  name="years_experience"
                  value={editingStats.years_experience}
                  onChange={handleEditChange}
                  min="0"
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Projects Completed</label>
                <input
                  type="number"
                  name="projects_completed"
                  value={editingStats.projects_completed}
                  onChange={handleEditChange}
                  min="0"
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Youth Empowered</label>
                <input
                  type="number"
                  name="youth_empowered"
                  value={editingStats.youth_empowered}
                  onChange={handleEditChange}
                  min="0"
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Community Partners</label>
                <input
                  type="number"
                  name="community_partners"
                  value={editingStats.community_partners}
                  onChange={handleEditChange}
                  min="0"
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Status</label>
                <select
                  name="is_active"
                  value={editingStats.is_active ? 'true' : 'false'}
                  onChange={(e) => setEditingStats({ ...editingStats, is_active: e.target.value === 'true' })}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button onClick={closeEditModal} disabled={actionLoading} style={{ flex: 1, background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem' }}>
                  Cancel
                </button>
                <button onClick={handleUpdateStats} disabled={actionLoading} style={{ flex: 1, background: actionLoading ? '#94a3b8' : '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: actionLoading ? 'not-allowed' : 'pointer', fontSize: '0.813rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  {actionLoading ? <><i className="fas fa-spinner fa-spin"></i> Updating...</> : <><i className="fas fa-save"></i> Update</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Stats Modal */}
      {showCreateModal && editingStats && (
        <div className="modal-overlay" onClick={closeCreateModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '20px', maxWidth: '500px', width: '100%',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={closeCreateModal} style={{
              position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', border: 'none',
              width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
            }}><i className="fas fa-times"></i></button>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', 
              padding: '1.25rem', 
              textAlign: 'center', 
              borderRadius: '20px 20px 0 0',
              flexShrink: 0
            }}>
              <div style={{ width: '56px', height: '56px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-plus" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Create Statistics</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>Create new organization statistics</p>
            </div>
            
            <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Years of Combined Experience</label>
                <input
                  type="number"
                  name="years_experience"
                  value={editingStats.years_experience}
                  onChange={handleEditChange}
                  min="0"
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Projects Completed</label>
                <input
                  type="number"
                  name="projects_completed"
                  value={editingStats.projects_completed}
                  onChange={handleEditChange}
                  min="0"
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Youth Empowered</label>
                <input
                  type="number"
                  name="youth_empowered"
                  value={editingStats.youth_empowered}
                  onChange={handleEditChange}
                  min="0"
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Community Partners</label>
                <input
                  type="number"
                  name="community_partners"
                  value={editingStats.community_partners}
                  onChange={handleEditChange}
                  min="0"
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Status</label>
                <select
                  name="is_active"
                  value={editingStats.is_active ? 'true' : 'false'}
                  onChange={(e) => setEditingStats({ ...editingStats, is_active: e.target.value === 'true' })}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button onClick={closeCreateModal} disabled={actionLoading} style={{ flex: 1, background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem' }}>
                  Cancel
                </button>
                <button onClick={handleCreateStats} disabled={actionLoading} style={{ flex: 1, background: actionLoading ? '#94a3b8' : '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: actionLoading ? 'not-allowed' : 'pointer', fontSize: '0.813rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  {actionLoading ? <><i className="fas fa-spinner fa-spin"></i> Creating...</> : <><i className="fas fa-plus"></i> Create</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInScale {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        
        .modal-content div::-webkit-scrollbar { width: 4px; }
        .modal-content div::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .modal-content div::-webkit-scrollbar-thumb { background: #0B3B2F; border-radius: 10px; }
        
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed !important;
        }
      `}</style>
    </div>
  );
};

export default AdminStats;