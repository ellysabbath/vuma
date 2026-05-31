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
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
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
    if (id && events.length > 0) {
      const event = events.find(e => e.id === parseInt(id));
      if (event) {
        setSelectedEvent(event);
        setShowModal(true);
        setIsEditMode(false);
      }
    }
  }, [id, events]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.137.83:8000/api/events/');
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      } else {
        setError('Failed to load events');
      }
    } catch (error) {
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

  const openModal = (event) => {
    setSelectedEvent(event);
    setIsEditMode(false);
    setShowModal(true);
    navigate(`/admin/events/${event.id}`, { replace: true });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setIsEditMode(false);
    setEditingEvent(null);
    navigate('/admin/events', { replace: true });
    document.body.style.overflow = 'unset';
  };

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

  const handleUpdateEvent = async () => {
    if (!editingEvent.title) {
      alert('Please fill in event title');
      return;
    }
    
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await fetch(`http://192.168.137.83:8000/api/events/${editingEvent.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingEvent),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchEvents();
        setSuccessMessage('Event updated successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeModal();
      } else {
        alert(data.error || 'Failed to update event');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

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
      alert('Please fill in event title and date');
      return;
    }
    
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await fetch('http://192.168.137.83:8000/api/events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newEvent),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchEvents();
        setSuccessMessage('Event added successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeAddModal();
      } else {
        alert(data.error || 'Failed to add event');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const token = localStorage.getItem('access_token');
      
      try {
        const response = await fetch(`http://192.168.137.83:8000/api/events/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        if (data.success) {
          await fetchEvents();
          setSuccessMessage('Event deleted successfully!');
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          alert(data.error || 'Failed to delete event');
        }
      } catch (error) {
        alert('Network error. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    setNewEvent({
      ...newEvent,
      [e.target.name]: e.target.value
    });
  };

  const handleSpeakersChange = (e) => {
    const speakersArray = e.target.value.split(',').map(s => s.trim());
    setNewEvent({
      ...newEvent,
      speakers: speakersArray
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Upcoming': '#2196F3',
      'Ongoing': '#ff9800',
      'Completed': '#4caf50',
      'Cancelled': '#d32f2f'
    };
    return colors[status] || '#757575';
  };

  const getTypeColor = (type) => {
    const colors = {
      'Workshop': '#9C27B0',
      'Environment': '#4caf50',
      'Webinar': '#00BCD4',
      'Conference': '#2196F3',
      'Online': '#2196F3',
      'In-Person': '#4caf50',
      'Hybrid': '#ff9800'
    };
    return colors[type] || '#757575';
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading events...</p>
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
          <button onClick={fetchEvents} style={{ marginTop: '1rem', background: '#F9C74F', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer' }}>
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

      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '2rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => navigate('/admin')}></i>
            <h1 style={{ fontSize: '1.8rem' }}>Events Management</h1>
          </div>
          <p>Organize and manage all events and activities</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <i 
              className="fas fa-plus-circle" 
              style={{ 
                fontSize: '2rem', 
                color: '#0B3B2F', 
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onClick={openAddModal}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            ></i>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Type</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Registered</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Capacity</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{ cursor: 'pointer', color: '#0B3B2F', fontWeight: 600 }} onClick={() => openModal(event)}>
                        {event.title}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{
                        background: getTypeColor(event.type),
                        color: 'white',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem'
                      }}>{event.type}</span>
                    </td>
                    <td style={{ padding: '0.8rem' }}>{new Date(event.date).toLocaleDateString()}</td>
                    <td style={{ padding: '0.8rem' }}>{event.registered}</td>
                    <td style={{ padding: '0.8rem' }}>{event.capacity}</td>
                    <td style={{ padding: '0.8rem' }}>
                      <i className="fas fa-eye" style={{ color: '#0B3B2F', cursor: 'pointer', marginRight: '0.8rem' }} onClick={() => openModal(event)}></i>
                      <i className="fas fa-edit" style={{ color: '#2196F3', cursor: 'pointer', marginRight: '0.8rem' }} onClick={() => openEditModal(event)}></i>
                      <i className="fas fa-trash" style={{ color: '#d32f2f', cursor: 'pointer' }} onClick={() => handleDelete(event.id)}></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Event Details/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '28px', maxWidth: '500px', width: '100%', 
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
              <div style={{ width: '70px', height: '70px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={isEditMode ? "fas fa-calendar-alt" : "fas fa-calendar-alt"} style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.8rem', marginBottom: '0.3rem', fontSize: '1.3rem' }}>
                {isEditMode ? 'Edit Event' : 'Event Details'}
              </h2>
              {!isEditMode && <p style={{ color: '#F9C74F', fontSize: '0.9rem' }}>View complete event information</p>}
            </div>
            
            <div style={{ 
              padding: '1.2rem', 
              overflowY: 'auto', 
              flex: 1,
              maxHeight: 'calc(90vh - 140px)'
            }}>
              {isEditMode && editingEvent ? (
                <>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Event Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={editingEvent.title}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Type</label>
                    <select
                      name="type"
                      value={editingEvent.type}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    >
                      <option value="Online">Online</option>
                      <option value="In-Person">In-Person</option>
                      <option value="Webinar">Webinar</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={editingEvent.date}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Time</label>
                    <input
                      type="text"
                      name="time"
                      value={editingEvent.time || ''}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                      placeholder="e.g., 10:00 AM - 4:00 PM"
                    />
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={editingEvent.location || ''}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Description</label>
                    <textarea
                      name="description"
                      value={editingEvent.description || ''}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '60px' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Full Description</label>
                    <textarea
                      name="full_description"
                      value={editingEvent.full_description || ''}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '100px' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Speakers (comma separated)</label>
                    <input
                      type="text"
                      name="speakers"
                      value={editingEvent.speakers ? editingEvent.speakers.join(', ') : ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, speakers: e.target.value.split(',').map(s => s.trim()) })}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      value={editingEvent.capacity}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                    <button onClick={closeModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                    <button onClick={handleUpdateEvent} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Update Event</button>
                  </div>
                </>
              ) : (
                <>
                  {selectedEvent?.image_base64 && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Event Image</label>
                      <img src={selectedEvent.image_base64} alt={selectedEvent.title} style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                    </div>
                  )}
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Event Title</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      {selectedEvent?.title}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Type</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      <span style={{
                        background: getTypeColor(selectedEvent?.type),
                        color: 'white',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        display: 'inline-block'
                      }}>{selectedEvent?.type}</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Date</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      {new Date(selectedEvent?.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Time</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      {selectedEvent?.time || 'Not specified'}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Location</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      {selectedEvent?.location || 'Not specified'}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Description</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333', lineHeight: '1.5' }}>
                      {selectedEvent?.description || 'No description'}
                    </div>
                  </div>
                  
                  {selectedEvent?.full_description && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Full Description</label>
                      <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333', lineHeight: '1.5' }}>
                        {selectedEvent?.full_description}
                      </div>
                    </div>
                  )}
                  
                  {selectedEvent?.speakers && selectedEvent.speakers.length > 0 && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Speakers</label>
                      <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                        {selectedEvent.speakers.map((speaker, i) => (
                          <span key={i} style={{ display: 'inline-block', background: '#e8f5e9', color: '#0B3B2F', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', margin: '0.2rem' }}>
                            {speaker}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Registration</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      {selectedEvent?.registered} / {selectedEvent?.capacity} registered
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                    <button onClick={closeModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Close</button>
                    <button onClick={() => openEditModal(selectedEvent)} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Edit Event</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal - Complete with all fields */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeAddModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '28px', maxWidth: '500px', width: '100%',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={closeAddModal} style={{
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
              <div style={{ width: '70px', height: '70px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-plus-circle" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.3rem' }}>Add New Event</h2>
            </div>
            
            <div style={{ 
              padding: '1.2rem', 
              overflowY: 'auto', 
              flex: 1,
              maxHeight: 'calc(90vh - 140px)'
            }}>
              {/* Event Image */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Event Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.5rem' }} />
                )}
              </div>

              {/* Event Title */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Enter event title"
                />
              </div>
              
              {/* Event Type */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Event Type *</label>
                <select
                  name="type"
                  value={newEvent.type}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                >
                  <option value="Online">Online</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              
              {/* Event Date */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Event Date *</label>
                <input
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              {/* Event Time */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Event Time</label>
                <input
                  type="text"
                  name="time"
                  value={newEvent.time}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="e.g., 10:00 AM - 4:00 PM"
                />
              </div>
              
              {/* Event Location */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Event Location *</label>
                <input
                  type="text"
                  name="location"
                  value={newEvent.location}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Event location"
                />
              </div>
              
              {/* Short Description */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Short Description *</label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '60px' }}
                  placeholder="Brief description of the event"
                />
              </div>
              
              {/* Full Description */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Full Description</label>
                <textarea
                  name="full_description"
                  value={newEvent.full_description}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '100px' }}
                  placeholder="Detailed description of the event"
                />
              </div>
              
              {/* Speakers */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Speakers (comma separated)</label>
                <input
                  type="text"
                  value={newEvent.speakers.join(', ')}
                  onChange={handleSpeakersChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Dr. Sarah Mbeki, James Omondi, Mary Wanjiku"
                />
              </div>
              
              {/* Capacity */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={newEvent.capacity}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  min="1"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                <button onClick={closeAddModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                <button onClick={handleAddEvent} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Add Event</button>
              </div>
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

export default AdminEvents;