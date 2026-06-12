import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const EventRequests = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [actionLoading, setActionLoading] = useState(false);

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/event/api';

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/registrations/`);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setRegistrations(data);
      } else if (data.results && Array.isArray(data.results)) {
        setRegistrations(data.results);
      } else {
        setRegistrations([]);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRegistration(null);
    document.body.style.overflow = 'unset';
  };

  const openEditModal = (registration) => {
    setEditingRegistration({ ...registration });
    setShowEditModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingRegistration(null);
    document.body.style.overflow = 'unset';
  };

  const handleEditChange = (e) => {
    setEditingRegistration({
      ...editingRegistration,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateRegistration = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/registrations/${editingRegistration.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRegistration),
      });
      
      if (!response.ok) throw new Error('Update failed');
      const data = await response.json();
      
      if (response.ok) {
        showSuccessMessage('Registration updated successfully!');
        await fetchRegistrations();
        closeEditModal();
      } else {
        alert(data.error || 'Failed to update registration');
      }
    } catch (error) {
      console.error('Error updating registration:', error);
      alert('Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRegistration = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/registrations/${selectedRegistration.id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        showSuccessMessage('Registration cancelled successfully!');
        await fetchRegistrations();
        setShowDeleteConfirm(false);
        closeModal();
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting registration:', error);
      alert('Failed to cancel registration. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (isCancelled) => {
    if (isCancelled) {
      return { text: 'Cancelled', color: '#ef4444', bg: '#fee2e2' };
    }
    return { text: 'Active', color: '#10b981', bg: '#d1fae5' };
  };

  // Filter registrations
  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.event?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = !eventFilter || reg.event?.toLowerCase().includes(eventFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && !reg.is_cancelled) ||
                         (statusFilter === 'cancelled' && reg.is_cancelled);
    return matchesSearch && matchesEvent && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRegistrations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);

  const getEventStats = () => {
    const stats = {};
    registrations.forEach(reg => {
      if (!reg.is_cancelled) {
        stats[reg.event] = (stats[reg.event] || 0) + 1;
      }
    });
    return stats;
  };

  const eventStats = getEventStats();

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', margin: '0 auto', border: '3px solid rgba(11,59,47,0.1)', borderTopColor: '#0B3B2F', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>Loading registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Success Toast */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          animation: 'slideInRight 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderLeft: `4px solid #10b981`
          }}>
            <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '1.25rem' }}></i>
            <span style={{ fontSize: '0.875rem', color: '#0B3B2F', fontWeight: 500 }}>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white',
        padding: '2rem 1.5rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.1rem' }} onClick={() => navigate('/admin')}></i>
            <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 600 }}>
              <i className="fas fa-calendar-check" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
              Event Registration Requests
            </h1>
          </div>
          <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Manage and review all event registration requests</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {error ? (
          <div style={{ textAlign: 'center', background: 'white', padding: '3rem', borderRadius: '16px' }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#ef4444' }}></i>
            <p style={{ marginTop: '1rem', color: '#64748b' }}>{error}</p>
            <button onClick={fetchRegistrations} style={{ marginTop: '1rem', background: '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '30px', cursor: 'pointer' }}>
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <i className="fas fa-users" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
                <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', fontWeight: 700 }}>{registrations.length}</h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Registrations</p>
              </div>
              <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <i className="fas fa-check-circle" style={{ fontSize: '1.5rem', color: '#10b981' }}></i>
                <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', fontWeight: 700 }}>{registrations.filter(r => !r.is_cancelled).length}</h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Active Registrations</p>
              </div>
              <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <i className="fas fa-times-circle" style={{ fontSize: '1.5rem', color: '#ef4444' }}></i>
                <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', fontWeight: 700 }}>{registrations.filter(r => r.is_cancelled).length}</h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Cancelled</p>
              </div>
              <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <i className="fas fa-calendar-alt" style={{ fontSize: '1.5rem', color: '#F9C74F' }}></i>
                <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', fontWeight: 700 }}>{Object.keys(eventStats).length}</h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Unique Events</p>
              </div>
            </div>

            {/* Filters */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '1.5rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                  <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.875rem' }}></i>
                  <input
                    type="text"
                    placeholder="Search by name, email, or event..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.5rem 0.5rem 2rem',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.813rem'
                    }}
                  />
                </div>
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.813rem' }}
                >
                  <option value="">All Events</option>
                  {Object.keys(eventStats).map(event => (
                    <option key={event} value={event}>{event} ({eventStats[event]})</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.813rem' }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button
                onClick={fetchRegistrations}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.813rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-sync-alt"></i> Refresh
              </button>
            </div>

            {/* Registrations Table */}
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.813rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#475569' }}>ID</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#475569' }}>Event</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#475569' }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#475569' }}>Email</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#475569' }}>Phone</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#475569' }}>Registration Date</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#475569' }}>Status</th>
                      <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: '#475569' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                          <i className="fas fa-inbox" style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}></i>
                          No registration requests found
                        </td>
                       </tr>
                    ) : (
                      currentItems.map((reg, index) => {
                        const status = getStatusBadge(reg.is_cancelled);
                        return (
                          <tr key={reg.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                            <td style={{ padding: '0.75rem', color: '#0B3B2F', fontWeight: 500 }}>#{reg.id}</td>
                            <td style={{ padding: '0.75rem', fontWeight: 500 }}>{reg.event}</td>
                            <td style={{ padding: '0.75rem' }}>{reg.full_name}</td>
                            <td style={{ padding: '0.75rem' }}>{reg.email}</td>
                            <td style={{ padding: '0.75rem' }}>{reg.phone}</td>
                            <td style={{ padding: '0.75rem' }}>{formatDate(reg.registration_date)}</td>
                            <td style={{ padding: '0.75rem' }}>
                              <span style={{
                                background: status.bg,
                                color: status.color,
                                padding: '0.2rem 0.6rem',
                                borderRadius: '20px',
                                fontSize: '0.7rem',
                                fontWeight: 600
                              }}>
                                {status.text}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                <button
                                  onClick={() => handleViewDetails(reg)}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#3b82f6',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem'
                                  }}
                                  title="View Details"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  onClick={() => openEditModal(reg)}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#f59e0b',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem'
                                  }}
                                  title="Edit"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '1rem',
                  borderTop: '1px solid #e2e8f0',
                  background: '#f8fafc'
                }}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      background: 'white',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.5 : 1
                    }}
                  >
                    Previous
                  </button>
                  <span style={{ padding: '0.25rem 0.75rem', color: '#475569' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      background: 'white',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages ? 0.5 : 1
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* View Details Modal */}
      {showModal && selectedRegistration && (
        <div className="modal-overlay" onClick={closeModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '24px', maxWidth: '600px', width: '100%', position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={closeModal} style={{
              position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.6)',
              border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer',
              color: 'white', zIndex: 10
            }}><i className="fas fa-times"></i></button>

            <div style={{ background: '#0B3B2F', padding: '1.5rem', color: 'white', borderRadius: '24px 24px 0 0' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Registration Details</h2>
              <p style={{ margin: '0.25rem 0 0', opacity: 0.9, fontSize: '0.8rem' }}>ID: #{selectedRegistration.id}</p>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div><strong>Event:</strong> <span style={{ color: '#0B3B2F', fontWeight: 500 }}>{selectedRegistration.event}</span></div>
                <div><strong>Full Name:</strong> {selectedRegistration.full_name}</div>
                <div><strong>Email:</strong> {selectedRegistration.email}</div>
                <div><strong>Phone:</strong> {selectedRegistration.phone}</div>
                {selectedRegistration.organization && <div><strong>Organization:</strong> {selectedRegistration.organization}</div>}
                {selectedRegistration.position && <div><strong>Position:</strong> {selectedRegistration.position}</div>}
                {selectedRegistration.dietary_needs && <div><strong>Dietary Needs:</strong> {selectedRegistration.dietary_needs}</div>}
                {selectedRegistration.special_accommodation && <div><strong>Special Accommodations:</strong> {selectedRegistration.special_accommodation}</div>}
                {selectedRegistration.hear_about && <div><strong>How they heard:</strong> {selectedRegistration.hear_about}</div>}
                <div><strong>Registration Date:</strong> {formatDate(selectedRegistration.registration_date)}</div>
                <div>
                  <strong>Status:</strong>
                  <span style={{
                    display: 'inline-block',
                    marginLeft: '0.5rem',
                    background: selectedRegistration.is_cancelled ? '#fee2e2' : '#d1fae5',
                    color: selectedRegistration.is_cancelled ? '#ef4444' : '#10b981',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 600
                  }}>
                    {selectedRegistration.is_cancelled ? 'Cancelled' : 'Active'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button onClick={closeModal} style={{
                  flex: 1, background: '#f1f5f9', border: 'none', padding: '0.6rem', borderRadius: '40px', cursor: 'pointer', fontWeight: 600
                }}>Close</button>
                {!selectedRegistration.is_cancelled && (
                  <button onClick={() => setShowDeleteConfirm(true)} style={{
                    flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '0.6rem', borderRadius: '40px', cursor: 'pointer', fontWeight: 600
                  }}>Cancel Registration</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingRegistration && (
        <div className="modal-overlay" onClick={closeEditModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '20px', maxWidth: '500px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', position: 'relative'
          }}>
            <button onClick={closeEditModal} style={{
              position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', border: 'none',
              width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: 'white', zIndex: 10
            }}><i className="fas fa-times"></i></button>
            
            <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '1.25rem', textAlign: 'center', borderRadius: '20px 20px 0 0', flexShrink: 0 }}>
              <h2 style={{ color: 'white', margin: 0, fontSize: '1rem', fontWeight: 600 }}>Edit Registration</h2>
            </div>
            
            <div style={{ padding: '1rem', overflowY: 'auto', flex: 1 }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem' }}>Event</label>
                <input type="text" name="event" value={editingRegistration.event} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.813rem' }} />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem' }}>Full Name</label>
                <input type="text" name="full_name" value={editingRegistration.full_name} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.813rem' }} />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem' }}>Email</label>
                <input type="email" name="email" value={editingRegistration.email} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.813rem' }} />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem' }}>Phone</label>
                <input type="text" name="phone" value={editingRegistration.phone} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.813rem' }} />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem' }}>Organization</label>
                <input type="text" name="organization" value={editingRegistration.organization || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.813rem' }} />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem' }}>Position</label>
                <input type="text" name="position" value={editingRegistration.position || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.813rem' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button onClick={closeEditModal} style={{ flex: 1, background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                <button onClick={handleUpdateRegistration} disabled={actionLoading} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: actionLoading ? 'not-allowed' : 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  {actionLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{ background: 'white', borderRadius: '20px', maxWidth: '380px', width: '100%', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '1.25rem', color: '#ef4444' }}></i>
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>Cancel Registration</h3>
            <p style={{ color: '#64748b', marginBottom: '1.25rem', fontSize: '0.813rem' }}>
              Are you sure you want to cancel this registration for "{selectedRegistration?.full_name}"?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '0.5rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
                No, Keep
              </button>
              <button onClick={handleDeleteRegistration} disabled={actionLoading} style={{ flex: 1, padding: '0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: actionLoading ? 'not-allowed' : 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {actionLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .modal-content::-webkit-scrollbar { width: 5px; }
        .modal-content::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
        .modal-content::-webkit-scrollbar-thumb { background: #0B3B2F; border-radius: 3px; }
      `}</style>
    </div>
  );
};

export default EventRequests;