import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminNews = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    read_time: '',
    image_base64: '',
    excerpt: '',
    content: '',
    key_highlights: []
  });
  const [highlightInput, setHighlightInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Custom alert states
  const [customAlert, setCustomAlert] = useState({
    show: false,
    type: 'success', // 'success', 'error', 'confirm'
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://vuma.pythonanywhere.com/api/news/');
      const data = await response.json();
      if (data.success) {
        setNews(data.data);
      } else {
        setError('Failed to load news');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, title, message, onConfirm = null, onCancel = null) => {
    setCustomAlert({
      show: true,
      type,
      title,
      message,
      onConfirm,
      onCancel
    });
  };

  const closeAlert = () => {
    setCustomAlert({
      show: false,
      type: 'success',
      title: '',
      message: '',
      onConfirm: null,
      onCancel: null
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAlert('error', 'File Too Large', 'Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({ ...formData, image_base64: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddHighlight = () => {
    if (highlightInput.trim()) {
      setFormData({
        ...formData,
        key_highlights: [...formData.key_highlights, highlightInput.trim()]
      });
      setHighlightInput('');
    }
  };

  const handleRemoveHighlight = (index) => {
    const newHighlights = formData.key_highlights.filter((_, i) => i !== index);
    setFormData({ ...formData, key_highlights: newHighlights });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const url = editingNews 
      ? `https://vuma.pythonanywhere.com/api/news/${editingNews.id}/`
      : `https://vuma.pythonanywhere.com/api/news/`;
    
    const method = editingNews ? 'PUT' : 'POST';
    
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        showAlert('success', 'Success!', editingNews ? 'News updated successfully!' : 'News created successfully!');
        resetForm();
        fetchNews();
        setShowModal(false);
        setTimeout(() => closeAlert(), 2000);
      } else {
        showAlert('error', 'Error!', data.errors || 'Failed to save news');
      }
    } catch (error) {
      showAlert('error', 'Network Error', 'Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    showAlert('confirm', 'Delete News', `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      async () => {
        try {
          const response = await fetch(`https://vuma.pythonanywhere.com/api/news/${id}/`, {
            method: 'DELETE',
          });
          
          const data = await response.json();
          
          if (data.success) {
            showAlert('success', 'Deleted!', 'News deleted successfully!');
            fetchNews();
            setTimeout(() => closeAlert(), 2000);
          } else {
            showAlert('error', 'Error!', data.error);
          }
        } catch (error) {
          showAlert('error', 'Network Error', 'Please check your connection and try again.');
        }
      }
    );
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      date: newsItem.date,
      read_time: newsItem.read_time,
      image_base64: newsItem.image_base64 || '',
      excerpt: newsItem.excerpt || '',
      content: newsItem.content,
      key_highlights: newsItem.key_highlights || []
    });
    setImagePreview(newsItem.image_base64 || '');
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      date: '',
      read_time: '',
      image_base64: '',
      excerpt: '',
      content: '',
      key_highlights: []
    });
    setImagePreview('');
    setHighlightInput('');
  };

  const getImageDisplay = (imageBase64) => {
    if (imageBase64) {
      if (imageBase64.startsWith('data:image')) {
        return imageBase64;
      }
      return `data:image/jpeg;base64,${imageBase64}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      {/* Custom Alert Modal */}
      {customAlert.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '400px',
            width: '90%',
            padding: '2rem',
            textAlign: 'center',
            animation: 'slideInUp 0.3s ease',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            {/* Icon */}
            <div style={{ marginBottom: '1rem' }}>
              {customAlert.type === 'success' && (
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: '#4caf50',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <i className="fas fa-check" style={{ fontSize: '2rem', color: 'white' }}></i>
                </div>
              )}
              {customAlert.type === 'error' && (
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: '#d32f2f',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <i className="fas fa-times" style={{ fontSize: '2rem', color: 'white' }}></i>
                </div>
              )}
              {customAlert.type === 'confirm' && (
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: '#F9C74F',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <i className="fas fa-question" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
                </div>
              )}
            </div>
            
            {/* Title */}
            <h3 style={{
              color: customAlert.type === 'error' ? '#d32f2f' : '#0B3B2F',
              marginBottom: '0.5rem',
              fontSize: '1.5rem'
            }}>
              {customAlert.title}
            </h3>
            
            {/* Message */}
            <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              {customAlert.message}
            </p>
            
            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              {customAlert.type === 'confirm' ? (
                <>
                  <button
                    onClick={() => {
                      if (customAlert.onCancel) customAlert.onCancel();
                      closeAlert();
                    }}
                    style={{
                      padding: '0.6rem 1.5rem',
                      background: 'transparent',
                      border: '2px solid #ddd',
                      borderRadius: '50px',
                      color: '#666',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#d32f2f';
                      e.currentTarget.style.color = '#d32f2f';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#ddd';
                      e.currentTarget.style.color = '#666';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (customAlert.onConfirm) customAlert.onConfirm();
                      closeAlert();
                    }}
                    style={{
                      padding: '0.6rem 1.5rem',
                      background: '#d32f2f',
                      border: 'none',
                      borderRadius: '50px',
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={closeAlert}
                  style={{
                    padding: '0.6rem 2rem',
                    background: customAlert.type === 'error' ? '#d32f2f' : '#0B3B2F',
                    border: 'none',
                    borderRadius: '50px',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 data-aos="fade-up" style={{ marginBottom: '0.5rem' }}>Manage News</h1>
          <p data-aos="fade-up" data-aos-delay="200">Create, edit, and manage your news articles</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          style={{
            background: '#F9C74F',
            border: 'none',
            padding: '0.8rem 1.5rem',
            borderRadius: '50px',
            color: '#0B3B2F',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem'
          }}
        >
          <i className="fas fa-plus"></i>
          Add New News
        </button>
      </div>

      {/* News List */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {news.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px' }}>
            <i className="fas fa-newspaper" style={{ fontSize: '3rem', color: '#999' }}></i>
            <p style={{ marginTop: '1rem', color: '#666' }}>No news articles yet. Click "Add New News" to create one.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {news.map((item, idx) => (
              <div
                key={item.id}
                data-aos="fade-up"
                data-aos-delay={idx * 50}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1.5rem',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s ease'
                }}
              >
                {/* Image Thumbnail */}
                <div style={{ flex: '0 0 100px' }}>
                  {item.image_base64 ? (
                    <img
                      src={getImageDisplay(item.image_base64)}
                      alt={item.title}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '12px'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100px',
                      height: '100px',
                      background: '#f0f0f0',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999'
                    }}>
                      <i className="fas fa-image" style={{ fontSize: '2rem' }}></i>
                    </div>
                  )}
                </div>

                {/* News Info */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>{item.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>
                      <i className="fas fa-calendar-alt" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                      {item.date}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>
                      <i className="fas fa-clock" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                      {item.read_time}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>
                      <i className="fas fa-eye" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                      {item.views} views
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>
                      <i className="fas fa-heart" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                      {item.likes} likes
                    </span>
                  </div>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>{item.excerpt || item.content.substring(0, 100)}...</p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{
                      background: '#2196F3',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <i className="fas fa-edit"></i>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    style={{
                      background: '#d32f2f',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <i className="fas fa-trash"></i>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '28px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <div style={{
              position: 'sticky',
              top: 0,
              background: 'white',
              padding: '1.5rem',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ color: '#0B3B2F' }}>
                {editingNews ? 'Edit News' : 'Create New News'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              {/* Title */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0B3B2F', fontWeight: 600 }}>
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* Date and Read Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0B3B2F', fontWeight: 600 }}>
                    Date *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., January 15, 2024"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0B3B2F', fontWeight: 600 }}>
                    Read Time *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 5 min read"
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0B3B2F', fontWeight: 600 }}>
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
                {imagePreview && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0B3B2F', fontWeight: 600 }}>
                  Excerpt (Short Description)
                </label>
                <textarea
                  rows="2"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                  placeholder="A brief summary of the news article..."
                />
              </div>

              {/* Key Highlights */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0B3B2F', fontWeight: 600 }}>
                  Key Highlights
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    placeholder="Enter a key highlight"
                    style={{
                      flex: 1,
                      padding: '0.8rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    style={{
                      background: '#0B3B2F',
                      color: 'white',
                      border: 'none',
                      padding: '0 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>
                {formData.key_highlights.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    {formData.key_highlights.map((highlight, index) => (
                      <div
                        key={index}
                        style={{
                          background: '#f9fbf7',
                          padding: '0.5rem',
                          marginBottom: '0.5rem',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span>• {highlight}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(index)}
                          style={{
                            background: '#d32f2f',
                            color: 'white',
                            border: 'none',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0B3B2F', fontWeight: 600 }}>
                  Full Content *
                </label>
                <textarea
                  rows="10"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Write the full news article content here..."
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  style={{
                    padding: '0.8rem 1.5rem',
                    background: 'transparent',
                    border: '2px solid #ddd',
                    borderRadius: '50px',
                    color: '#666',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '0.8rem 1.5rem',
                    background: '#F9C74F',
                    border: 'none',
                    borderRadius: '50px',
                    color: '#0B3B2F',
                    fontWeight: 600,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.6 : 1
                  }}
                >
                  {submitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Saving...
                    </>
                  ) : (
                    editingNews ? 'Update News' : 'Create News'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminNews;