import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const VolunteerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [statusNotes, setStatusNotes] = useState('');
  const [interviewData, setInterviewData] = useState({
    interview_date: '',
    interview_type: 'video',
    interview_location: '',
    interview_notes: ''
  });

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/volunteers/applications/${id}/`);
      const data = await response.json();
      
      if (data.success) {
        setApplication(data.data);
      } else {
        setError(data.error || 'Application not found');
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/volunteers/applications/${application.id}/update_status/`, {
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
        await fetchApplication();
        setSuccessMessage(`Application status updated to ${newStatus}! Email notification sent.`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setShowStatusModal(false);
        setStatusNotes('');
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleScheduleInterview = async () => {
    if (!interviewData.interview_date) {
      alert('Please select an interview date and time');
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/volunteers/applications/${application.id}/schedule_interview/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interview_date: new Date(interviewData.interview_date).toISOString(),
          interview_type: interviewData.interview_type,
          interview_location: interviewData.interview_location,
          interview_notes: interviewData.interview_notes
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchApplication();
        setSuccessMessage('Interview scheduled successfully! Email notification sent.');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setShowInterviewModal(false);
        setInterviewData({
          interview_date: '',
          interview_type: 'video',
          interview_location: '',
          interview_notes: ''
        });
      } else {
        alert(data.error || 'Failed to schedule interview');
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert('Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/volunteers/applications/${application.id}/`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Application deleted successfully!');
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/admin/volunteers');
        }, 2000);
      } else {
        alert(data.error || 'Failed to delete application');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/volunteers');
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

  const getAvailabilityLabel = (availability) => {
    const labels = {
      'weekdays': 'Weekdays (Mon-Fri)',
      'weekends': 'Weekends (Sat-Sun)',
      'evenings': 'Evenings',
      'flexible': 'Flexible',
      'specific': 'Specific days'
    };
    return labels[availability] || availability;
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '4rem', color: '#d32f2f', marginBottom: '1rem' }}></i>
            <h2>Error Loading Application</h2>
            <p style={{ color: '#666', marginBottom: '1rem' }}>{error}</p>
            <button onClick={fetchApplication} style={{ background: '#F9C74F', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', marginRight: '0.5rem' }}>
              Try Again
            </button>
            <div onClick={handleBack} style={{ display: 'inline-block', cursor: 'pointer' }}>
              <span style={{ color: '#0B3B2F', fontWeight: 600 }}>Back to Applications</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-file-alt" style={{ fontSize: '4rem', color: '#d32f2f', marginBottom: '1rem' }}></i>
            <h2>Application Not Found</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>The application you're looking for doesn't exist or has been removed.</p>
            <div onClick={handleBack} style={{ display: 'inline-block', cursor: 'pointer' }}>
              <i className="fas fa-arrow-left" style={{ fontSize: '1.2rem', color: '#0B3B2F', marginRight: '0.5rem' }}></i>
              <span style={{ color: '#0B3B2F', fontWeight: 600 }}>Back to Applications</span>
            </div>
          </div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={handleBack}></i>
            <h1 style={{ fontSize: '1.8rem' }}>Application Details</h1>
          </div>
          <p>View complete information about {application.full_name}'s application</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Application Header Card */}
        <div data-aos="fade-up" style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '2rem', textAlign: 'center', position: 'relative' }}>
            {application.profile_picture ? (
              <img 
                src={application.profile_picture} 
                alt={application.full_name} 
                style={{ width: '120px', height: '120px', margin: '0 auto', borderRadius: '50%', objectFit: 'cover', border: '4px solid white' }}
              />
            ) : (
              <div style={{ width: '120px', height: '120px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white' }}>
                <i className="fas fa-user" style={{ fontSize: '3.5rem', color: '#0B3B2F' }}></i>
              </div>
            )}
            <h2 style={{ marginTop: '1rem', marginBottom: '0.3rem', fontSize: '1.8rem' }}>{application.full_name}</h2>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                background: getStatusColor(application.status),
                color: 'white',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>{getStatusLabel(application.status)}</span>
              <span style={{
                background: '#F9C74F',
                color: '#0B3B2F',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>Application #{application.id}</span>
            </div>
          </div>
          
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {/* Personal Information */}
              <div>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-user"></i> Personal Information
                </h3>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Full Name</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{application.full_name}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Email</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{application.email}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Phone</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{application.phone}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Location</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{application.location}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Age</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{application.age || 'Not provided'}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Occupation</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{application.occupation || 'Not provided'}</p>
                </div>
              </div>
              
              {/* Application Information */}
              <div>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-clock"></i> Application Information
                </h3>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Submitted Date</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{new Date(application.submitted_at).toLocaleString()}</p>
                </div>
                {application.reviewed_at && (
                  <div style={{ marginBottom: '0.8rem' }}>
                    <strong style={{ color: '#666', fontSize: '0.85rem' }}>Reviewed Date</strong>
                    <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{new Date(application.reviewed_at).toLocaleString()}</p>
                  </div>
                )}
                {application.reviewed_by_name && (
                  <div style={{ marginBottom: '0.8rem' }}>
                    <strong style={{ color: '#666', fontSize: '0.85rem' }}>Reviewed By</strong>
                    <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{application.reviewed_by_name}</p>
                  </div>
                )}
                {application.status_notes && (
                  <div style={{ marginBottom: '0.8rem' }}>
                    <strong style={{ color: '#666', fontSize: '0.85rem' }}>Status Notes</strong>
                    <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{application.status_notes}</p>
                  </div>
                )}
                {application.interview_date && (
                  <>
                    <div style={{ marginBottom: '0.8rem' }}>
                      <strong style={{ color: '#666', fontSize: '0.85rem' }}>Interview Date</strong>
                      <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{new Date(application.interview_date).toLocaleString()}</p>
                    </div>
                    <div style={{ marginBottom: '0.8rem' }}>
                      <strong style={{ color: '#666', fontSize: '0.85rem' }}>Interview Type</strong>
                      <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{application.interview_type || 'Not specified'}</p>
                    </div>
                    <div style={{ marginBottom: '0.8rem' }}>
                      <strong style={{ color: '#666', fontSize: '0.85rem' }}>Interview Location</strong>
                      <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{application.interview_location || 'Not specified'}</p>
                    </div>
                    {application.interview_notes && (
                      <div style={{ marginBottom: '0.8rem' }}>
                        <strong style={{ color: '#666', fontSize: '0.85rem' }}>Interview Notes</strong>
                        <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{application.interview_notes}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Availability & Skills */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
              <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-calendar-alt"></i> Availability & Skills
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                <div>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Availability</strong>
                  <p style={{ marginTop: '0.3rem' }}>{getAvailabilityLabel(application.availability)}</p>
                  {application.availability_details && (
                    <>
                      <strong style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>Availability Details</strong>
                      <p style={{ marginTop: '0.3rem' }}>{application.availability_details}</p>
                    </>
                  )}
                </div>
                <div>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Skills</strong>
                  <p style={{ marginTop: '0.3rem' }}>{application.skills || 'Not provided'}</p>
                </div>
                <div>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Previous Experience</strong>
                  <p style={{ marginTop: '0.3rem' }}>{application.experience || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
              <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-heart"></i> Motivation
              </h3>
              <p style={{ lineHeight: '1.6', color: '#555' }}>{application.motivation}</p>
            </div>

            {/* Emergency Contact */}
            {(application.emergency_contact_name || application.emergency_contact_phone) && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-phone-alt"></i> Emergency Contact
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  <div>
                    <strong style={{ color: '#666', fontSize: '0.85rem' }}>Contact Name</strong>
                    <p style={{ marginTop: '0.3rem' }}>{application.emergency_contact_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <strong style={{ color: '#666', fontSize: '0.85rem' }}>Phone</strong>
                    <p style={{ marginTop: '0.3rem' }}>{application.emergency_contact_phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <strong style={{ color: '#666', fontSize: '0.85rem' }}>Relationship</strong>
                    <p style={{ marginTop: '0.3rem' }}>{application.emergency_contact_relationship || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            {application.additional_info && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-info-circle"></i> Additional Information
                </h3>
                <p style={{ lineHeight: '1.6', color: '#555' }}>{application.additional_info}</p>
              </div>
            )}

            {/* How they heard */}
            {application.hear_about_us && (
              <div style={{ marginTop: '1rem' }}>
                <strong style={{ color: '#666', fontSize: '0.85rem' }}>How did they hear about us?</strong>
                <p style={{ marginTop: '0.3rem' }}>{application.hear_about_us?.replace('_', ' ').toUpperCase()}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0', flexWrap: 'wrap' }}>
              <button
                onClick={handleBack}
                style={{
                  padding: '0.6rem 1.2rem',
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-arrow-left"></i> Back
              </button>
              
              <button
                onClick={() => setShowStatusModal(true)}
                style={{
                  padding: '0.6rem 1.2rem',
                  background: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-tasks"></i> Update Status
              </button>
              
              <button
                onClick={() => setShowInterviewModal(true)}
                style={{
                  padding: '0.6rem 1.2rem',
                  background: '#00BCD4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-calendar-plus"></i> Schedule Interview
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  padding: '0.6rem 1.2rem',
                  background: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      {showStatusModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{ background: 'white', borderRadius: '20px', maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>Update Application Status</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Select Status</label>
              <select
                value={statusNotes.split('|')[0] || ''}
                onChange={(e) => setStatusNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '0.9rem'
                }}
              >
                <option value="">Select status...</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="waitlisted">Waitlisted</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Notes (optional)</label>
              <textarea
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '0.9rem',
                  minHeight: '80px'
                }}
                placeholder="Add any notes about this status change..."
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowStatusModal(false)}
                style={{ flex: 1, padding: '0.7rem', background: '#f0f0f0', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(statusNotes.split('|')[0] || statusNotes)}
                disabled={!statusNotes}
                style={{ flex: 1, padding: '0.7rem', background: '#0B3B2F', color: 'white', border: 'none', borderRadius: '30px', cursor: statusNotes ? 'pointer' : 'not-allowed', fontWeight: 600, opacity: statusNotes ? 1 : 0.6 }}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showInterviewModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{ background: 'white', borderRadius: '20px', maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h3 style={{ color: '#0B3B2F', marginBottom: '1rem' }}>Schedule Interview</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Interview Date & Time *</label>
              <input
                type="datetime-local"
                value={interviewData.interview_date}
                onChange={(e) => setInterviewData({ ...interviewData, interview_date: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Interview Type</label>
              <select
                value={interviewData.interview_type}
                onChange={(e) => setInterviewData({ ...interviewData, interview_type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '0.9rem'
                }}
              >
                <option value="video">Video Call</option>
                <option value="phone">Phone Call</option>
                <option value="in_person">In Person</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Location / Meeting Link</label>
              <input
                type="text"
                value={interviewData.interview_location}
                onChange={(e) => setInterviewData({ ...interviewData, interview_location: e.target.value })}
                placeholder="Zoom link, Google Meet, or physical address"
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Additional Notes</label>
              <textarea
                value={interviewData.interview_notes}
                onChange={(e) => setInterviewData({ ...interviewData, interview_notes: e.target.value })}
                placeholder="Any additional instructions for the candidate..."
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '0.9rem',
                  minHeight: '80px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowInterviewModal(false)}
                style={{ flex: 1, padding: '0.7rem', background: '#f0f0f0', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleInterview}
                disabled={!interviewData.interview_date}
                style={{ flex: 1, padding: '0.7rem', background: '#0B3B2F', color: 'white', border: 'none', borderRadius: '30px', cursor: interviewData.interview_date ? 'pointer' : 'not-allowed', fontWeight: 600, opacity: interviewData.interview_date ? 1 : 0.6 }}
              >
                Schedule Interview
              </button>
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
            <h3 style={{ marginBottom: '0.5rem' }}>Delete Application</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Are you sure you want to delete {application.full_name}'s application? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '0.8rem', background: '#f0f0f0', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: '0.8rem', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
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
        
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default VolunteerDetails;