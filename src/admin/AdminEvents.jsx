import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminEvents = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 1
  });
  const [viewMode, setViewMode] = useState('list');

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    type: 'Online',
    time: '',
    location: '',
    description: '',
    full_description: '',
    speakers: [],
    capacity: 100,
    registered: 0,
    image_base64: ''
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchEvents();
  }, []);

  useEffect(() => {
    if (id && events.length > 0 && viewMode === 'list') {
      const event = events.find(e => e.id === parseInt(id));
      if (event) {
        setSelectedEvent(event);
        setViewMode('details');
      }
    }
  }, [id, events, viewMode]);

  const fetchEvents = async (pageUrl = null) => {
    setLoading(true);
    setError('');
    try {
      const url = pageUrl || `${API_BASE_URL}/events/`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      if (data.results && Array.isArray(data.results)) {
        setEvents(data.results);
        setPagination({
          count: data.count || 0,
          next: data.next,
          previous: data.previous,
          currentPage: pagination.currentPage,
          totalPages: Math.ceil((data.count || 0) / 10)
        });
      } else if (Array.isArray(data)) {
        setEvents(data);
        setPagination({
          count: data.length,
          next: null,
          previous: null,
          currentPage: 1,
          totalPages: 1
        });
      } else if (data.success && Array.isArray(data.data)) {
        setEvents(data.data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const goToNextPage = () => {
    if (pagination.next) {
      fetchEvents(pagination.next);
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const goToPreviousPage = () => {
    if (pagination.previous) {
      fetchEvents(pagination.previous);
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      const base64 = await fileToBase64(file);
      setNewEvent(prev => ({ ...prev, image_base64: base64 }));
    }
  };

  // Show circled alert
  const showCircledAlert = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  // Show confirmation modal
  const showConfirmationModal = (action, data, message) => {
    setConfirmAction(() => action);
    setConfirmData(data);
    setShowConfirmModal(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmData(null);
  };

  // CRUD: CREATE - Add new event
  const openAddModal = () => {
    setShowAddModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewEvent({
      title: '',
      date: '',
      type: 'Online',
      time: '',
      location: '',
      description: '',
      full_description: '',
      speakers: [],
      capacity: 100,
      registered: 0,
      image_base64: ''
    });
    setImagePreview('');
    setImageFile(null);
    document.body.style.overflow = 'unset';
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) {
      showCircledAlert('Please fill in event title and date', 'error');
      return;
    }
    
    setAddLoading(true);
    try {
      const eventData = {
        title: newEvent.title,
        date: newEvent.date,
        type: newEvent.type,
        time: newEvent.time,
        location: newEvent.location,
        description: newEvent.description || '',
        full_description: newEvent.full_description || '',
        speakers: newEvent.speakers || [],
        capacity: parseInt(newEvent.capacity) || 100,
        registered: 0,
        image_base64: newEvent.image_base64 || ''
      };
      
      const response = await fetch(`${API_BASE_URL}/events/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      const data = await response.json();
      
      if (response.ok || data.success) {
        await fetchEvents();
        showCircledAlert('Event added successfully!', 'success');
        closeAddModal();
      } else {
        showCircledAlert(data.error || 'Failed to add event', 'error');
      }
    } catch (error) {
      console.error('Error adding event:', error);
      showCircledAlert('Network error. Please try again.', 'error');
    } finally {
      setAddLoading(false);
    }
  };

  // CRUD: UPDATE - Edit event
  const openEditModal = (event) => {
    setEditingEvent({ ...event });
    setIsEditMode(true);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleEditChange = (e) => {
    setEditingEvent({
      ...editingEvent,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSpeakersChange = (e) => {
    const speakersArray = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setEditingEvent({
      ...editingEvent,
      speakers: speakersArray
    });
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent.title) {
      showCircledAlert('Please fill in event title', 'error');
      return;
    }
    
    setUpdateLoading(true);
    try {
      const updateData = {
        title: editingEvent.title,
        date: editingEvent.date,
        type: editingEvent.type,
        time: editingEvent.time || '',
        location: editingEvent.location || '',
        description: editingEvent.description || '',
        full_description: editingEvent.full_description || '',
        speakers: editingEvent.speakers || [],
        capacity: parseInt(editingEvent.capacity) || 100,
        registered: editingEvent.registered || 0,
        image_base64: editingEvent.image_base64 || ''
      };
      
      const response = await fetch(`${API_BASE_URL}/events/${editingEvent.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (response.ok || data.success) {
        await fetchEvents();
        showCircledAlert('Event updated successfully!', 'success');
        closeEditModal();
        if (selectedEvent && selectedEvent.id === editingEvent.id) {
          setSelectedEvent({ ...editingEvent });
        }
      } else {
        showCircledAlert(data.error || 'Failed to update event', 'error');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      showCircledAlert('Network error. Please try again.', 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  const closeEditModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setIsEditMode(false);
    document.body.style.overflow = 'unset';
  };

  // CRUD: DELETE - Remove event
  const confirmDelete = (id, eventTitle) => {
    showConfirmationModal(
      async () => {
        setDeleteLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/events/${id}/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            await fetchEvents();
            showCircledAlert('Event deleted successfully!', 'success');
            if (selectedEvent && selectedEvent.id === id) {
              setViewMode('list');
              navigate('/admin/events');
            }
            closeConfirmationModal();
          } else {
            const altResponse = await fetch(`${API_BASE_URL}/events/${id}/delete/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: id }),
            });
            
            if (altResponse.ok) {
              await fetchEvents();
              showCircledAlert('Event deleted successfully!', 'success');
              if (selectedEvent && selectedEvent.id === id) {
                setViewMode('list');
                navigate('/admin/events');
              }
              closeConfirmationModal();
            } else {
              showCircledAlert('Failed to delete event', 'error');
            }
          }
        } catch (error) {
          console.error('Error deleting event:', error);
          showCircledAlert('Failed to delete event. Please try again.', 'error');
        } finally {
          setDeleteLoading(false);
        }
      },
      { id, title: eventTitle },
      `Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`
    );
  };

  // View event details
  const openModal = (event) => {
    setSelectedEvent(event);
    setViewMode('details');
    navigate(`/admin/events/${event.id}`, { replace: true });
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setViewMode('list');
    navigate('/admin/events', { replace: true });
  };

  const handleInputChange = (e) => {
    setNewEvent({
      ...newEvent,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSpeakersChange = (e) => {
    const speakersArray = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setNewEvent({
      ...newEvent,
      speakers: speakersArray
    });
  };

  // Additional Actions
  const handleCopyEventLink = (event) => {
    const eventUrl = `${window.location.origin}/events/${event.id}`;
    navigator.clipboard.writeText(eventUrl);
    showCircledAlert('Event link copied to clipboard!', 'success');
  };

  const handleShareEvent = (event) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: `${window.location.origin}/events/${event.id}`,
      }).catch(() => {
        handleCopyEventLink(event);
      });
    } else {
      handleCopyEventLink(event);
    }
  };

  const confirmDuplicate = (event) => {
    showConfirmationModal(
      async () => {
        const duplicatedEvent = {
          title: `${event.title} (Copy)`,
          date: event.date,
          type: event.type,
          time: event.time,
          location: event.location,
          description: event.description,
          full_description: event.full_description,
          speakers: event.speakers || [],
          capacity: event.capacity,
          registered: 0,
          image_base64: event.image_base64 || ''
        };
        
        try {
          const response = await fetch(`${API_BASE_URL}/events/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(duplicatedEvent),
          });
          
          if (response.ok) {
            await fetchEvents();
            showCircledAlert('Event duplicated successfully!', 'success');
            closeConfirmationModal();
          } else {
            showCircledAlert('Failed to duplicate event', 'error');
          }
        } catch (error) {
          showCircledAlert('Network error. Please try again.', 'error');
        }
      },
      event,
      `Are you sure you want to duplicate "${event.title}"?`
    );
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
        year: 'numeric', 
        month: 'short', 
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
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', background: 'white', padding: '2rem', borderRadius: '16px', maxWidth: '400px' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#ef4444' }}></i>
          <p style={{ marginTop: '1rem', color: '#64748b' }}>{error}</p>
          <button onClick={() => fetchEvents()} style={{ marginTop: '1rem', background: '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '30px', cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Event Details View
  if (viewMode === 'details' && selectedEvent) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
        {/* Circled Alert */}
        {showAlert && (
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
              padding: '1.5rem',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              minWidth: '280px'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: alertType === 'success' ? '#4caf50' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                animation: 'scaleIn 0.5s ease'
              }}>
                <i className={`fas ${alertType === 'success' ? 'fa-check' : 'fa-times'}`} style={{ fontSize: '2rem', color: 'white' }}></i>
              </div>
              <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1rem' }}>
                {alertType === 'success' ? 'Success!' : 'Error!'}
              </h3>
              <p style={{ color: '#666', fontSize: '0.85rem' }}>{alertMessage}</p>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              maxWidth: '400px',
              width: '100%',
              padding: '1.5rem',
              textAlign: 'center',
              animation: 'slideInUp 0.2s ease'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                margin: '0 auto',
                borderRadius: '50%',
                background: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <i className="fas fa-exclamation-triangle" style={{ fontSize: '1.5rem', color: '#ef4444' }}></i>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Confirm Action</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Are you sure you want to proceed?
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={closeConfirmationModal}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontSize: '0.813rem'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontSize: '0.813rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {deleteLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash-alt"></i>}
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '1.5rem 1.5rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.1rem' }} onClick={closeModal}></i>
                <h1 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 600 }}>Event Details</h1>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleShareEvent(selectedEvent)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '0.375rem 0.75rem', borderRadius: '8px', color: 'white', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-share-alt"></i> Share
                </button>
                <button onClick={() => handleCopyEventLink(selectedEvent)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '0.375rem 0.75rem', borderRadius: '8px', color: 'white', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-link"></i> Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Details Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ background: `linear-gradient(135deg, ${getTypeColor(selectedEvent.type)}20, #0B3B2F)`, padding: '1.5rem', textAlign: 'center', borderBottom: `3px solid ${getTypeColor(selectedEvent.type)}` }}>
              <div style={{ width: '100px', height: '100px', margin: '0 auto', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                {selectedEvent.image_base64 ? (
                  <img src={selectedEvent.image_base64} alt={selectedEvent.title} style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <i className="fas fa-calendar-alt" style={{ fontSize: '2.5rem', color: '#0B3B2F' }}></i>
                )}
              </div>
              <h2 style={{ marginTop: '0.75rem', marginBottom: '0.3rem', fontSize: '1.3rem', fontWeight: 700, color: '#0B3B2F' }}>{selectedEvent.title}</h2>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ background: getTypeColor(selectedEvent.type), color: 'white', padding: '0.2rem 0.75rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600 }}>{selectedEvent.type}</span>
                <span style={{ background: '#f1f5f9', color: '#64748b', padding: '0.2rem 0.75rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600 }}>ID: {selectedEvent.id}</span>
              </div>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}><i className="fas fa-calendar-alt" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>Date</div>
                  <div style={{ fontSize: '0.813rem', fontWeight: 600, color: '#0B3B2F' }}>{formatDate(selectedEvent.date)}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}><i className="fas fa-clock" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>Time</div>
                  <div style={{ fontSize: '0.813rem', fontWeight: 600, color: '#0B3B2F' }}>{selectedEvent.time || 'Not specified'}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}><i className="fas fa-map-marker-alt" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>Location</div>
                  <div style={{ fontSize: '0.813rem', fontWeight: 600, color: '#0B3B2F' }}>{selectedEvent.location || 'TBA'}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}><i className="fas fa-users" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>Registration</div>
                  <div style={{ fontSize: '0.813rem', fontWeight: 600, color: selectedEvent.registered >= selectedEvent.capacity ? '#ef4444' : '#10b981' }}>
                    {selectedEvent.registered || 0} / {selectedEvent.capacity || 100} registered
                  </div>
                </div>
              </div>

              {selectedEvent.description && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 700 }}><i className="fas fa-align-left" style={{ color: '#F9C74F', marginRight: '0.5rem' }}></i>Description</h3>
                  <p style={{ lineHeight: '1.5', color: '#475569', fontSize: '0.813rem' }}>{selectedEvent.description}</p>
                </div>
              )}

              {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 700 }}><i className="fas fa-chalkboard-teacher" style={{ color: '#F9C74F', marginRight: '0.5rem' }}></i>Speakers</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedEvent.speakers.map((speaker, index) => (
                      <span key={index} style={{ background: '#f1f5f9', color: '#0B3B2F', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 500 }}>
                        <i className="fas fa-user" style={{ marginRight: '0.3rem', fontSize: '0.688rem' }}></i>{speaker}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                <button onClick={closeModal} style={{ padding: '0.5rem 1rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#64748b', fontWeight: 500, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-arrow-left"></i> Back
                </button>
                <button onClick={() => confirmDuplicate(selectedEvent)} style={{ padding: '0.5rem 1rem', background: '#8b5cf6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 500, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-copy"></i> Duplicate
                </button>
                <button onClick={() => openEditModal(selectedEvent)} style={{ padding: '0.5rem 1rem', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 500, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button onClick={() => confirmDelete(selectedEvent.id, selectedEvent.title)} style={{ padding: '0.5rem 1rem', background: '#ef4444', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 500, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View (main admin panel)
  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Circled Alert */}
      {showAlert && (
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
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            minWidth: '280px'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: alertType === 'success' ? '#4caf50' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              animation: 'scaleIn 0.5s ease'
            }}>
              <i className={`fas ${alertType === 'success' ? 'fa-check' : 'fa-times'}`} style={{ fontSize: '2rem', color: 'white' }}></i>
            </div>
            <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1rem' }}>
              {alertType === 'success' ? 'Success!' : 'Error!'}
            </h3>
            <p style={{ color: '#666', fontSize: '0.85rem' }}>{alertMessage}</p>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '400px',
            width: '100%',
            padding: '1.5rem',
            textAlign: 'center',
            animation: 'slideInUp 0.2s ease'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              margin: '0 auto',
              borderRadius: '50%',
              background: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '1.5rem', color: '#ef4444' }}></i>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Confirm Action</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              {confirmData && confirmData.title ? `Are you sure you want to delete "${confirmData.title}"? This action cannot be undone.` : 'Are you sure you want to proceed?'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={closeConfirmationModal}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontSize: '0.813rem'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontSize: '0.813rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {deleteLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash-alt"></i>}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '1.5rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.1rem' }} onClick={() => navigate('/admin')}></i>
              <h1 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 600 }}>Events Management</h1>
            </div>
            <button
              onClick={openAddModal}
              style={{
                background: '#F9C74F',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '30px',
                color: '#0B3B2F',
                fontWeight: 600,
                fontSize: '0.813rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <i className="fas fa-plus"></i> Add Event
            </button>
          </div>
          <p style={{ fontSize: '0.813rem', opacity: 0.9 }}>Total Events: {pagination.count}</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.813rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>ID</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Type</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Registered</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Capacity</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                      <i className="fas fa-calendar-times" style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}></i>
                      No events found
                    </td>
                  </tr>
                ) : (
                  events.map(event => (
                    <tr key={event.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.75rem' }}>{event.id}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ cursor: 'pointer', color: '#0B3B2F', fontWeight: 600, fontSize: '0.813rem' }} onClick={() => openModal(event)}>
                          {event.title}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          background: `${getTypeColor(event.type)}15`,
                          color: getTypeColor(event.type),
                          padding: '0.2rem 0.6rem',
                          borderRadius: '20px',
                          fontSize: '0.688rem',
                          fontWeight: 600,
                          display: 'inline-block'
                        }}>{event.type}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.75rem' }}>{formatDate(event.date)}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ fontWeight: 600, color: event.registered >= event.capacity ? '#ef4444' : '#10b981', fontSize: '0.75rem' }}>
                          {event.registered || 0}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.75rem' }}>{event.capacity || 100}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <i className="fas fa-eye" style={{ color: '#0B3B2F', cursor: 'pointer', fontSize: '0.875rem' }} onClick={() => openModal(event)} title="View"></i>
                          <i className="fas fa-copy" style={{ color: '#8b5cf6', cursor: 'pointer', fontSize: '0.875rem' }} onClick={() => confirmDuplicate(event)} title="Duplicate"></i>
                          <i className="fas fa-share-alt" style={{ color: '#f59e0b', cursor: 'pointer', fontSize: '0.875rem' }} onClick={() => handleShareEvent(event)} title="Share"></i>
                          <i className="fas fa-edit" style={{ color: '#3b82f6', cursor: 'pointer', fontSize: '0.875rem' }} onClick={() => openEditModal(event)} title="Edit"></i>
                          <i 
                            className="fas fa-trash" 
                            style={{ color: '#ef4444', cursor: 'pointer', fontSize: '0.875rem' }} 
                            onClick={() => confirmDelete(event.id, event.title)} 
                            title="Delete"
                          ></i>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination.count > 10 && (
            <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <button onClick={goToPreviousPage} disabled={!pagination.previous} style={{ padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: pagination.previous ? 'white' : '#f1f5f9', color: pagination.previous ? '#0B3B2F' : '#94a3b8', cursor: pagination.previous ? 'pointer' : 'not-allowed', fontSize: '0.75rem' }}>
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              <span style={{ padding: '0.375rem 0.75rem', color: '#475569', fontSize: '0.75rem' }}>Page {pagination.currentPage} of {pagination.totalPages}</span>
              <button onClick={goToNextPage} disabled={!pagination.next} style={{ padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: pagination.next ? 'white' : '#f1f5f9', color: pagination.next ? '#0B3B2F' : '#94a3b8', cursor: pagination.next ? 'pointer' : 'not-allowed', fontSize: '0.75rem' }}>
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Event Modal */}
      {showModal && editingEvent && (
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
            
            <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '1.25rem', textAlign: 'center', borderRadius: '20px 20px 0 0', flexShrink: 0 }}>
              <div style={{ width: '56px', height: '56px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-calendar-alt" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>Edit Event</h2>
            </div>
            
            <div style={{ padding: '1rem', overflowY: 'auto', flex: 1 }}>
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
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Speakers</label>
                <input type="text" value={editingEvent.speakers ? editingEvent.speakers.join(', ') : ''} onChange={handleEditSpeakersChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} placeholder="Name1, Name2, Name3" />
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

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeAddModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.2s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '20px', maxWidth: '500px', width: '100%',
            maxHeight: '85vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.2s ease'
          }}>
            <button onClick={closeAddModal} style={{
              position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', border: 'none',
              width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
            }}><i className="fas fa-times"></i></button>
            
            <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '1.25rem', textAlign: 'center', borderRadius: '20px 20px 0 0', flexShrink: 0 }}>
              <div style={{ width: '56px', height: '56px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-plus-circle" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>Add New Event</h2>
            </div>
            
            <div style={{ padding: '1rem', overflowY: 'auto', flex: 1 }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ width: '100%', padding: '0.375rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.5rem' }} />}
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Title *</label>
                <input type="text" name="title" value={newEvent.title} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Type *</label>
                <select name="type" value={newEvent.type} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <option value="Online">Online</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Date *</label>
                <input type="date" name="date" value={newEvent.date} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Time</label>
                <input type="text" name="time" value={newEvent.time} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} placeholder="e.g., 10:00 AM" />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Location</label>
                <input type="text" name="location" value={newEvent.location} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Speakers</label>
                <input type="text" value={newEvent.speakers.join(', ')} onChange={handleAddSpeakersChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} placeholder="Name1, Name2, Name3" />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Capacity</label>
                <input type="number" name="capacity" value={newEvent.capacity} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} min="1" />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Description</label>
                <textarea name="description" value={newEvent.description} onChange={handleInputChange} rows="2" style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button onClick={closeAddModal} style={{ flex: 1, background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem' }}>Cancel</button>
                <button onClick={handleAddEvent} disabled={addLoading} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: addLoading ? 'not-allowed' : 'pointer', fontSize: '0.813rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  {addLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Add Event'}
                </button>
              </div>
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
        
        .modal-content::-webkit-scrollbar {
          width: 4px;
        }
        .modal-content::-webkit-scrollbar-track {
          background: #f1f1f5;
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

export default AdminEvents;