import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminVolunteers = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    shortlisted: 0,
    interview_scheduled: 0,
    accepted: 0,
    rejected: 0,
    waitlisted: 0
  });

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchApplications();
  }, []);

  useEffect(() => {
    if (id && applications.length > 0) {
      const application = applications.find(v => v.id === parseInt(id));
      if (application) {
        setSelectedApplication(application);
        setShowModal(true);
      }
    }
  }, [id, applications]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/volunteers/applications/`);
      const data = await response.json();
      
      if (data.success) {
        setApplications(data.data);
        calculateStats(data.data);
        showActionFeedback('Applications loaded successfully!', 'success');
      } else {
        setError('Failed to load applications');
        showActionFeedback('Failed to load applications', 'error');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Network error. Please check your connection.');
      showActionFeedback('Network error. Please check your connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (apps) => {
    const newStats = {
      total: apps.length,
      pending: apps.filter(a => a.status === 'pending').length,
      reviewing: apps.filter(a => a.status === 'reviewing').length,
      shortlisted: apps.filter(a => a.status === 'shortlisted').length,
      interview_scheduled: apps.filter(a => a.status === 'interview_scheduled').length,
      accepted: apps.filter(a => a.status === 'accepted').length,
      rejected: apps.filter(a => a.status === 'rejected').length,
      waitlisted: apps.filter(a => a.status === 'waitlisted').length
    };
    setStats(newStats);
  };

  const showActionFeedback = (message, type = 'success') => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const openModal = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
    navigate(`/admin/volunteers/${application.id}`, { replace: true });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
    navigate('/admin/volunteers', { replace: true });
    document.body.style.overflow = 'unset';
  };

  const handleUpdateStatus = async (applicationId, newStatus, statusNotes = '') => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/volunteers/applications/${applicationId}/update_status/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          status_notes: statusNotes,
          reviewed_by_name: 'Admin',
          reviewed_by_email: 'admin@vuma.org'
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchApplications();
        showActionFeedback(`Application status updated to ${newStatus}! Email notification sent.`, 'success');
        if (showModal) closeModal();
      } else {
        showActionFeedback(data.error || 'Failed to update status', 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showActionFeedback('Network error. Please try again.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleScheduleInterview = async (applicationId, interviewData) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/volunteers/applications/${applicationId}/schedule_interview/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interviewData),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchApplications();
        showActionFeedback(`Interview scheduled! Email notification sent.`, 'success');
        if (showModal) closeModal();
      } else {
        showActionFeedback(data.error || 'Failed to schedule interview', 'error');
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      showActionFeedback('Network error. Please try again.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (application) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${application.full_name}'s application?`);
    if (confirmDelete) {
      setActionLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/volunteers/applications/${application.id}/`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        if (data.success) {
          await fetchApplications();
          showActionFeedback(`${application.full_name}'s application deleted successfully!`, 'success');
        } else {
          showActionFeedback(data.error || 'Failed to delete application', 'error');
        }
      } catch (error) {
        console.error('Error deleting application:', error);
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
    fetchApplications();
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ff9800',
      'reviewing': '#2196F3',
      'shortlisted': '#9C27B0',
      'interview_scheduled': '#00BCD4',
      'accepted': '#4caf50',
      'rejected': '#f44336',
      'waitlisted': '#757575'
    };
    return colors[status] || '#757575';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pending',
      'reviewing': 'Under Review',
      'shortlisted': 'Shortlisted',
      'interview_scheduled': 'Interview Scheduled',
      'accepted': 'Accepted',
      'rejected': 'Rejected',
      'waitlisted': 'Waitlisted'
    };
    return labels[status] || status;
  };

  const getFilteredApplications = () => {
    if (statusFilter === 'all') return applications;
    return applications.filter(app => app.status === statusFilter);
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading applications...</p>
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
          <button onClick={fetchApplications} style={{ marginTop: '1rem', background: '#F9C74F', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer' }}>
            Try Again
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
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '2rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={handleBackToAdmin}></i>
              <h1 style={{ fontSize: '1.8rem' }}>Volunteer Applications</h1>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <i 
                className="fas fa-sync-alt" 
                style={{ 
                  fontSize: '1.2rem', 
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
          <p>Review and manage volunteer applications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2rem 0 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0B3B2F' }}>{stats.total}</div>
            <div style={{ fontSize: '0.7rem', color: '#666' }}>Total</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ff9800' }}>{stats.pending}</div>
            <div style={{ fontSize: '0.7rem', color: '#666' }}>Pending</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2196F3' }}>{stats.reviewing}</div>
            <div style={{ fontSize: '0.7rem', color: '#666' }}>Reviewing</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4caf50' }}>{stats.accepted}</div>
            <div style={{ fontSize: '0.7rem', color: '#666' }}>Accepted</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f44336' }}>{stats.rejected}</div>
            <div style={{ fontSize: '0.7rem', color: '#666' }}>Rejected</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 2rem 2rem' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          {/* Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#666', marginRight: '0.5rem' }}>Filter by status:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '0.85rem'
                }}
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="waitlisted">Waitlisted</option>
              </select>
            </div>
            <div>
              <p style={{ color: '#666', fontSize: '0.85rem' }}>
                Showing: <strong>{getFilteredApplications().length}</strong> of <strong>{applications.length}</strong> applications
              </p>
            </div>
          </div>

          {/* Applications Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Phone</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Location</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Submitted</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredApplications().map(application => (
                  <tr key={application.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{ cursor: 'pointer', color: '#0B3B2F', fontWeight: 600 }} onClick={() => openModal(application)}>
                        {application.full_name}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem', fontSize: '0.85rem' }}>{application.email}</td>
                    <td style={{ padding: '0.8rem', fontSize: '0.85rem' }}>{application.phone}</td>
                    <td style={{ padding: '0.8rem', fontSize: '0.85rem' }}>{application.location}</td>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{
                        background: getStatusColor(application.status),
                        color: 'white',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem'
                      }}>{getStatusLabel(application.status)}</span>
                    </td>
                    <td style={{ padding: '0.8rem', fontSize: '0.8rem' }}>
                      {new Date(application.submitted_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.8rem' }}>
                      <i 
                        className="fas fa-eye" 
                        style={{ color: '#0B3B2F', cursor: 'pointer', marginRight: '0.8rem', fontSize: '1rem' }} 
                        onClick={() => openModal(application)}
                      ></i>
                      <i 
                        className="fas fa-trash" 
                        style={{ color: '#d32f2f', cursor: 'pointer', fontSize: '1rem' }} 
                        onClick={() => handleDelete(application)}
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {getFilteredApplications().length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                <i className="fas fa-inbox" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                <p>No applications found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <div className="modal-overlay" onClick={closeModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '28px', maxWidth: '600px', width: '100%',
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
              {selectedApplication.profile_picture && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <img src={selectedApplication.profile_picture} alt={selectedApplication.full_name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #F9C74F' }} />
                </div>
              )}
              <h2 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '0.3rem', fontSize: '1.3rem' }}>
                {selectedApplication.full_name}
              </h2>
              <p style={{ color: '#F9C74F', fontSize: '0.8rem' }}>Application #{selectedApplication.id}</p>
            </div>
            
            <div style={{ 
              padding: '1.2rem', 
              overflowY: 'auto', 
              flex: 1,
              maxHeight: 'calc(90vh - 140px)'
            }}>
              {/* Personal Information */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '0.9rem', borderBottom: '2px solid #F9C74F', display: 'inline-block' }}>Personal Information</h4>
                <div style={{ background: '#f9f9f9', padding: '0.8rem', borderRadius: '12px', marginTop: '0.5rem' }}>
                  <p><strong>Email:</strong> {selectedApplication.email}</p>
                  <p><strong>Phone:</strong> {selectedApplication.phone}</p>
                  <p><strong>Location:</strong> {selectedApplication.location}</p>
                  <p><strong>Age:</strong> {selectedApplication.age || 'Not provided'}</p>
                  <p><strong>Occupation:</strong> {selectedApplication.occupation || 'Not provided'}</p>
                </div>
              </div>

              {/* Availability & Skills */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '0.9rem', borderBottom: '2px solid #F9C74F', display: 'inline-block' }}>Availability & Skills</h4>
                <div style={{ background: '#f9f9f9', padding: '0.8rem', borderRadius: '12px', marginTop: '0.5rem' }}>
                  <p><strong>Availability:</strong> {getStatusLabel(selectedApplication.availability)}</p>
                  {selectedApplication.availability_details && <p><strong>Availability Details:</strong> {selectedApplication.availability_details}</p>}
                  <p><strong>Skills:</strong> {selectedApplication.skills || 'Not provided'}</p>
                  <p><strong>Experience:</strong> {selectedApplication.experience || 'Not provided'}</p>
                </div>
              </div>

              {/* Motivation */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '0.9rem', borderBottom: '2px solid #F9C74F', display: 'inline-block' }}>Motivation</h4>
                <div style={{ background: '#f9f9f9', padding: '0.8rem', borderRadius: '12px', marginTop: '0.5rem' }}>
                  <p>{selectedApplication.motivation}</p>
                </div>
              </div>

              {/* Emergency Contact */}
              {(selectedApplication.emergency_contact_name || selectedApplication.emergency_contact_phone) && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '0.9rem', borderBottom: '2px solid #F9C74F', display: 'inline-block' }}>Emergency Contact</h4>
                  <div style={{ background: '#f9f9f9', padding: '0.8rem', borderRadius: '12px', marginTop: '0.5rem' }}>
                    <p><strong>Name:</strong> {selectedApplication.emergency_contact_name || 'Not provided'}</p>
                    <p><strong>Phone:</strong> {selectedApplication.emergency_contact_phone || 'Not provided'}</p>
                    <p><strong>Relationship:</strong> {selectedApplication.emergency_contact_relationship || 'Not provided'}</p>
                  </div>
                </div>
              )}

              {/* Current Status */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '0.9rem', borderBottom: '2px solid #F9C74F', display: 'inline-block' }}>Application Status</h4>
                <div style={{ background: '#f9f9f9', padding: '0.8rem', borderRadius: '12px', marginTop: '0.5rem' }}>
                  <p><strong>Status:</strong> <span style={{
                    background: getStatusColor(selectedApplication.status),
                    color: 'white',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    display: 'inline-block'
                  }}>{getStatusLabel(selectedApplication.status)}</span></p>
                  <p><strong>Submitted:</strong> {new Date(selectedApplication.submitted_at).toLocaleString()}</p>
                  {selectedApplication.reviewed_at && <p><strong>Reviewed:</strong> {new Date(selectedApplication.reviewed_at).toLocaleString()}</p>}
                  {selectedApplication.status_notes && <p><strong>Notes:</strong> {selectedApplication.status_notes}</p>}
                  {selectedApplication.interview_date && (
                    <>
                      <p><strong>Interview Date:</strong> {new Date(selectedApplication.interview_date).toLocaleString()}</p>
                      <p><strong>Interview Type:</strong> {selectedApplication.interview_type || 'Not specified'}</p>
                      <p><strong>Interview Location:</strong> {selectedApplication.interview_location || 'Not specified'}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Status Update Actions */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '0.9rem', borderBottom: '2px solid #F9C74F', display: 'inline-block' }}>Update Status</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button onClick={() => handleUpdateStatus(selectedApplication.id, 'pending')} style={{ background: '#ff9800', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Pending</button>
                  <button onClick={() => handleUpdateStatus(selectedApplication.id, 'reviewing')} style={{ background: '#2196F3', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Reviewing</button>
                  <button onClick={() => handleUpdateStatus(selectedApplication.id, 'shortlisted')} style={{ background: '#9C27B0', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Shortlisted</button>
                  <button onClick={() => {
                    const interviewDate = prompt('Enter interview date (YYYY-MM-DD HH:MM):');
                    if (interviewDate) {
                      handleScheduleInterview(selectedApplication.id, {
                        interview_date: new Date(interviewDate).toISOString(),
                        interview_type: 'video',
                        interview_location: 'Zoom link will be sent',
                        interview_notes: 'Please prepare your portfolio'
                      });
                    }
                  }} style={{ background: '#00BCD4', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Schedule Interview</button>
                  <button onClick={() => handleUpdateStatus(selectedApplication.id, 'accepted', 'Congratulations! Your application has been accepted.')} style={{ background: '#4caf50', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Accept</button>
                  <button onClick={() => {
                    const reason = prompt('Enter rejection reason:');
                    if (reason) {
                      handleUpdateStatus(selectedApplication.id, 'rejected', reason);
                    }
                  }} style={{ background: '#f44336', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Reject</button>
                </div>
              </div>

              {/* Close Button */}
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                <button onClick={closeModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Close</button>
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

export default AdminVolunteers;