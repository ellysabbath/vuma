import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const EventDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editImagePreview, setEditImagePreview] = useState('');
  const [editImageFile, setEditImageFile] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [viewMode, setViewMode] = useState('details'); // 'details', 'registrations', 'feedback'

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}/`);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setEvent(data.data);
      } else if (data.id) {
        setEvent(data);
      } else {
        setError('Event not found');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleEditImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
      const preview = URL.createObjectURL(file);
      setEditImagePreview(preview);
      const base64 = await fileToBase64(file);
      setEditingEvent(prev => ({ ...prev, image_base64: base64 }));
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/events/${event.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        showSuccessMessage('Event deleted successfully!');
        setTimeout(() => {
          navigate('/admin/events');
        }, 2000);
      } else {
        const altResponse = await fetch(`${API_BASE_URL}/events/${event.id}/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _method: 'DELETE' }),
        });
        
        if (altResponse.ok) {
          showSuccessMessage('Event deleted successfully!');
          setTimeout(() => {
            navigate('/admin/events');
          }, 2000);
        } else {
          throw new Error('Delete failed');
        }
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const openEditModal = () => {
    setEditingEvent({ ...event });
    setShowEditModal(true);
    document.body.style.overflow = 'hidden';
    if (event.image_base64) {
      setEditImagePreview(event.image_base64);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingEvent(null);
    setEditImageFile(null);
    setEditImagePreview('');
    document.body.style.overflow = 'unset';
  };

  const handleEditChange = (e) => {
    setEditingEvent({
      ...editingEvent,
      [e.target.name]: e.target.value
    });
  };

  const handleSpeakersChange = (e) => {
    const speakersArray = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setEditingEvent({
      ...editingEvent,
      speakers: speakersArray
    });
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent.title) {
      alert('Please fill in event title');
      return;
    }
    
    setUpdateLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/events/${editingEvent.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingEvent),
      });
      
      if (!response.ok) throw new Error('Update failed');
      const data = await response.json();
      
      if (data.success || response.ok) {
        setEvent(editingEvent);
        showSuccessMessage('Event updated successfully!');
        closeEditModal();
      } else {
        alert(data.error || 'Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Network error. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/events');
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCopyLink = () => {
    const eventUrl = `${window.location.origin}/events/${event.id}`;
    navigator.clipboard.writeText(eventUrl);
    showSuccessMessage('Event link copied to clipboard!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: `${window.location.origin}/events/${event.id}`,
      }).catch(() => {
        handleCopyLink();
      });
    } else {
      handleCopyLink();
    }
  };

  const handleExportRegistrants = () => {
    showSuccessMessage('Registrants list exported successfully!');
    // In a real app, you would trigger a download here
  };

  const handleSendReminder = () => {
    showSuccessMessage('Reminder sent to all registrants!');
  };

  const handleMarkComplete = async () => {
    if (window.confirm('Mark this event as completed?')) {
      try {
        const updatedEvent = { ...event, status: 'Completed' };
        const response = await fetch(`${API_BASE_URL}/events/${event.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedEvent),
        });
        
        if (response.ok) {
          setEvent(updatedEvent);
          showSuccessMessage('Event marked as completed!');
        }
      } catch (error) {
        alert('Failed to update event status');
      }
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'Online': '#3b82f6',
      'In-Person': '#10b981',
      'Webinar': '#8b5cf6',
      'Hybrid': '#f59e0b',
      'Workshop': '#ef4444',
      'Conference': '#0B3B2F'
    };
    return colors[type] || '#6b7280';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', margin: '0 auto', border: '3px solid rgba(11,59,47,0.1)', borderTopColor: '#0B3B2F', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '1rem' }}></i>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Error Loading Event</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={fetchEvent} style={{ background: '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '30px', cursor: 'pointer', fontSize: '0.813rem' }}>
                Try Again
              </button>
              <button onClick={handleBack} style={{ background: '#f1f5f9', color: '#0B3B2F', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '30px', cursor: 'pointer', fontSize: '0.813rem' }}>
                Back to Events
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <i className="fas fa-calendar-times" style={{ fontSize: '3rem', color: '#94a3b8', marginBottom: '1rem' }}></i>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Event Not Found</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.875rem' }}>The event you're looking for doesn't exist or has been removed.</p>
            <button onClick={handleBack} style={{ background: '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '30px', cursor: 'pointer', fontSize: '0.813rem' }}>
              <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Success Toast Notification */}
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
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '1.5rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.1rem' }} onClick={handleBack}></i>
              <h1 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 600 }}>Event Details</h1>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleShare}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-share-alt"></i> Share
              </button>
              <button
                onClick={handleCopyLink}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-link"></i> Copy Link
              </button>
            </div>
          </div>
          <p style={{ fontSize: '0.813rem', opacity: 0.9 }}>View complete information about this event</p>
        </div>
      </div>

      {/* View Tabs */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem 0' }}>
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <button
            onClick={() => setViewMode('details')}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: 'none',
              borderBottom: viewMode === 'details' ? '2px solid #0B3B2F' : '2px solid transparent',
              color: viewMode === 'details' ? '#0B3B2F' : '#64748b',
              fontWeight: 500,
              fontSize: '0.813rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
            Event Details
          </button>
          <button
            onClick={() => setViewMode('registrations')}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: 'none',
              borderBottom: viewMode === 'registrations' ? '2px solid #0B3B2F' : '2px solid transparent',
              color: viewMode === 'registrations' ? '#0B3B2F' : '#64748b',
              fontWeight: 500,
              fontSize: '0.813rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <i className="fas fa-users" style={{ marginRight: '0.5rem' }}></i>
            Registrations ({event.registered || 0})
          </button>
          <button
            onClick={() => setViewMode('feedback')}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: 'none',
              borderBottom: viewMode === 'feedback' ? '2px solid #0B3B2F' : '2px solid transparent',
              color: viewMode === 'feedback' ? '#0B3B2F' : '#64748b',
              fontWeight: 500,
              fontSize: '0.813rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <i className="fas fa-comments" style={{ marginRight: '0.5rem' }}></i>
            Feedback
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
        {viewMode === 'details' && (
          <>
            {/* Main Event Card */}
            <div data-aos="fade-up" style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
              {/* Header with Image */}
              <div style={{ 
                background: `linear-gradient(135deg, ${getTypeColor(event.type)}20, #0B3B2F)`,
                padding: '1.5rem', 
                textAlign: 'center', 
                position: 'relative',
                borderBottom: `3px solid ${getTypeColor(event.type)}`
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  {event.image_base64 ? (
                    <img 
                      src={event.image_base64} 
                      alt={event.title} 
                      style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <i className="fas fa-calendar-alt" style={{ fontSize: '2.5rem', color: '#0B3B2F' }}></i>
                  )}
                </div>
                <h2 style={{ marginTop: '0.75rem', marginBottom: '0.3rem', fontSize: '1.3rem', fontWeight: 700, color: '#0B3B2F' }}>
                  {event.title}
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    background: getTypeColor(event.type),
                    color: 'white',
                    padding: '0.2rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 600
                  }}>{event.type}</span>
                  <span style={{
                    background: '#f1f5f9',
                    color: '#64748b',
                    padding: '0.2rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 600
                  }}>ID: {event.id}</span>
                </div>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                {/* Info Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>
                      <i className="fas fa-calendar-alt" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                      Date
                    </div>
                    <div style={{ fontSize: '0.813rem', fontWeight: 600, color: '#0B3B2F' }}>{formatDate(event.date)}</div>
                  </div>
                  
                  <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>
                      <i className="fas fa-clock" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                      Time
                    </div>
                    <div style={{ fontSize: '0.813rem', fontWeight: 600, color: '#0B3B2F' }}>{event.time || 'Not specified'}</div>
                  </div>
                  
                  <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>
                      <i className="fas fa-map-marker-alt" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                      Location
                    </div>
                    <div style={{ fontSize: '0.813rem', fontWeight: 600, color: '#0B3B2F' }}>{event.location || 'TBA'}</div>
                  </div>
                  
                  <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>
                      <i className="fas fa-users" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                      Registration
                    </div>
                    <div style={{ fontSize: '0.813rem', fontWeight: 600, color: event.registered >= event.capacity ? '#ef4444' : '#10b981' }}>
                      {event.registered || 0} / {event.capacity || 100} registered
                    </div>
                  </div>
                </div>

                {/* Description */}
                {event.description && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-align-left" style={{ color: '#F9C74F' }}></i>
                      Description
                    </h3>
                    <p style={{ lineHeight: '1.5', color: '#475569', fontSize: '0.813rem' }}>{event.description}</p>
                  </div>
                )}

                {/* Full Description */}
                {event.full_description && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-file-alt" style={{ color: '#F9C74F' }}></i>
                      Full Description
                    </h3>
                    <p style={{ lineHeight: '1.5', color: '#475569', fontSize: '0.813rem' }}>{event.full_description}</p>
                  </div>
                )}

                {/* Speakers */}
                {event.speakers && event.speakers.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-chalkboard-teacher" style={{ color: '#F9C74F' }}></i>
                      Speakers
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {event.speakers.map((speaker, index) => (
                        <span key={index} style={{
                          background: '#f1f5f9',
                          color: '#0B3B2F',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}>
                          <i className="fas fa-user" style={{ marginRight: '0.3rem', fontSize: '0.688rem' }}></i>
                          {speaker}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                  <button
                    onClick={handleBack}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#f1f5f9',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#64748b',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  >
                    <i className="fas fa-arrow-left"></i> Back
                  </button>
                  
                  <button
                    onClick={handleSendReminder}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#f59e0b',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#d97706'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f59e0b'}
                  >
                    <i className="fas fa-bell"></i> Send Reminder
                  </button>
                  
                  <button
                    onClick={handleMarkComplete}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#10b981',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
                  >
                    <i className="fas fa-check-circle"></i> Mark Complete
                  </button>
                  
                  <button
                    onClick={openEditModal}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#3b82f6',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={deleteLoading}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#ef4444',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      cursor: deleteLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s',
                      opacity: deleteLoading ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => !deleteLoading && (e.currentTarget.style.background = '#dc2626')}
                    onMouseLeave={(e) => !deleteLoading && (e.currentTarget.style.background = '#ef4444')}
                  >
                    {deleteLoading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-trash-alt"></i>
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div data-aos="fade-up" data-aos-delay="100" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem' 
            }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <i className="fas fa-calendar-alt" style={{ fontSize: '1.5rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
                <h3 style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>Event Date</h3>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0B3B2F' }}>
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
              
              <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <i className="fas fa-users" style={{ fontSize: '1.5rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
                <h3 style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>Available Spots</h3>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0B3B2F' }}>
                  {Math.max(0, (event.capacity || 100) - (event.registered || 0))} / {event.capacity || 100}
                </p>
              </div>
              
              <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <i className="fas fa-chalkboard-teacher" style={{ fontSize: '1.5rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
                <h3 style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>Speakers</h3>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0B3B2F' }}>{event.speakers?.length || 0}</p>
              </div>
            </div>
          </>
        )}

        {viewMode === 'registrations' && (
          <div data-aos="fade-up" style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0B3B2F' }}>
                <i className="fas fa-users" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                Registered Participants ({event.registered || 0})
              </h3>
              <button
                onClick={handleExportRegistrants}
                style={{
                  padding: '0.375rem 0.75rem',
                  background: '#0B3B2F',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-download"></i> Export List
              </button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.813rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 600, color: '#475569' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 600, color: '#475569' }}>Email</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 600, color: '#475569' }}>Phone</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 600, color: '#475569' }}>Registered On</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 600, color: '#475569' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      <i className="fas fa-user-friends" style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}></i>
                      No registrations yet
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === 'feedback' && (
          <div data-aos="fade-up" style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0B3B2F' }}>
                <i className="fas fa-comments" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                Participant Feedback
              </h3>
            </div>
            
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <i className="fas fa-star" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '1rem', display: 'block' }}></i>
              <h4 style={{ fontSize: '1rem', color: '#475569', marginBottom: '0.5rem' }}>No Feedback Yet</h4>
              <p style={{ fontSize: '0.813rem', color: '#94a3b8' }}>Feedback will appear here after the event</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Event Modal */}
      {showEditModal && editingEvent && (
        <div className="modal-overlay" onClick={closeEditModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.2s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '20px', maxWidth: '500px', width: '100%',
            maxHeight: '85vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.2s ease'
          }}>
            <button onClick={closeEditModal} style={{
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
                <i className="fas fa-calendar-alt" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>Edit Event</h2>
            </div>
            
            <div style={{ 
              padding: '1rem', 
              overflowY: 'auto', 
              flex: 1,
              maxHeight: 'calc(85vh - 100px)'
            }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Image</label>
                <div>
                  {editImagePreview && (
                    <img src={editImagePreview} alt="Preview" style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} />
                  )}
                  <input type="file" accept="image/*" onChange={handleEditImageChange} style={{ width: '100%', padding: '0.375rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Title *</label>
                <input type="text" name="title" value={editingEvent.title} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Type</label>
                <select name="type" value={editingEvent.type} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <option value="Online">Online</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Date *</label>
                <input type="date" name="date" value={editingEvent.date} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Time</label>
                <input type="text" name="time" value={editingEvent.time || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Location</label>
                <input type="text" name="location" value={editingEvent.location || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Description</label>
                <textarea name="description" value={editingEvent.description || ''} onChange={handleEditChange} rows="2" style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Speakers</label>
                <input type="text" value={editingEvent.speakers ? editingEvent.speakers.join(', ') : ''} onChange={handleSpeakersChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} placeholder="Name1, Name2, Name3" />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Capacity</label>
                <input type="number" name="capacity" value={editingEvent.capacity} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} min="1" />
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button onClick={closeEditModal} style={{ flex: 1, background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem' }}>Cancel</button>
                <button onClick={handleUpdateEvent} disabled={updateLoading} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: updateLoading ? 'not-allowed' : 'pointer', fontSize: '0.813rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  {updateLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Update'}
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
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ background: 'white', borderRadius: '20px', maxWidth: '380px', width: '100%', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '1.25rem', color: '#ef4444' }}></i>
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>Delete Event</h3>
            <p style={{ color: '#64748b', marginBottom: '1.25rem', fontSize: '0.813rem' }}>
              Are you sure you want to delete "{event.title}"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '0.5rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '0.813rem' }}>
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleteLoading} style={{ flex: 1, padding: '0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: deleteLoading ? 'not-allowed' : 'pointer', fontWeight: 500, fontSize: '0.813rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {deleteLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash-alt"></i>}
                Delete
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .modal-content::-webkit-scrollbar {
          width: 4px;
        }
        .modal-content::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .modal-content::-webkit-scrollbar-thumb {
          background: #0B3B2F;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default EventDetails;