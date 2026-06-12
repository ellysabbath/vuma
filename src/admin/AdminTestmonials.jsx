import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminTestimonials = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [stats, setStats] = useState({
    total: 0,
    average_rating: 0,
    rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    rating: 5,
    text: '',
    is_active: true,
    order: 0
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchTestimonials();
    fetchStats();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/test/`);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      let testimonialsList = [];
      if (data.results && Array.isArray(data.results)) {
        testimonialsList = data.results;
      } else if (Array.isArray(data)) {
        testimonialsList = data;
      }
      
      setTestimonials(testimonialsList);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/test/stats/`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.text.trim()) errors.text = 'Testimonial text is required';
    if (formData.text.length < 10) errors.text = 'Text must be at least 10 characters';
    if (formData.rating < 1 || formData.rating > 5) errors.rating = 'Rating must be between 1 and 5';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      role: '',
      rating: 5,
      text: '',
      is_active: true,
      order: testimonials.length
    });
    setEditingTestimonial(null);
    setFormErrors({});
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const openEditModal = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role || '',
      rating: testimonial.rating,
      text: testimonial.text,
      is_active: testimonial.is_active,
      order: testimonial.order || 0
    });
    setFormErrors({});
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTestimonial(null);
    setFormData({
      name: '',
      role: '',
      rating: 5,
      text: '',
      is_active: true,
      order: 0
    });
    document.body.style.overflow = 'unset';
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setActionLoading(true);
    try {
      const url = editingTestimonial 
        ? `${API_BASE_URL}/test/${editingTestimonial.id}/`
        : `${API_BASE_URL}/test/`;
      
      const method = editingTestimonial ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Operation failed');
      
      showSuccessMessage(editingTestimonial ? 'Testimonial updated successfully!' : 'Testimonial created successfully!');
      await fetchTestimonials();
      await fetchStats();
      closeModal();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Failed to save testimonial. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/test/${selectedTestimonial.id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        showSuccessMessage('Testimonial deleted successfully!');
        await fetchTestimonials();
        await fetchStats();
        setShowDeleteConfirm(false);
        setSelectedTestimonial(null);
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    const selectedIds = testimonials.filter(t => t.selected).map(t => t.id);
    if (selectedIds.length === 0) {
      alert('Please select testimonials to delete');
      return;
    }
    
    if (!window.confirm(`Delete ${selectedIds.length} testimonial(s)?`)) return;
    
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials/bulk-delete/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });
      
      if (response.ok) {
        showSuccessMessage(`${selectedIds.length} testimonial(s) deleted successfully!`);
        await fetchTestimonials();
        await fetchStats();
      }
    } catch (error) {
      console.error('Error bulk deleting:', error);
      alert('Failed to delete testimonials');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleSelectAll = (e) => {
    const checked = e.target.checked;
    setTestimonials(prev => prev.map(t => ({ ...t, selected: checked })));
  };

  const toggleSelect = (id) => {
    setTestimonials(prev => prev.map(t => 
      t.id === id ? { ...t, selected: !t.selected } : t
    ));
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
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  // Filter testimonials
  const filteredTestimonials = testimonials.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (t.role && t.role.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRating = ratingFilter === 'all' || t.rating === parseInt(ratingFilter);
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && t.is_active) ||
                         (statusFilter === 'inactive' && !t.is_active);
    return matchesSearch && matchesRating && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTestimonials.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);

  const selectedCount = testimonials.filter(t => t.selected).length;

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', border: '3px solid rgba(11,59,47,0.1)', borderTopColor: '#0B3B2F', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Success Toast */}
      {showSuccess && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999, animation: 'slideInRight 0.3s ease'
        }}>
          <div style={{
            background: 'white', borderRadius: '12px', padding: '0.75rem 1rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderLeft: '4px solid #10b981'
          }}>
            <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '1.25rem' }}></i>
            <span style={{ fontSize: '0.875rem', color: '#0B3B2F', fontWeight: 500 }}>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white', padding: '1.5rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.1rem' }} onClick={() => navigate('/admin')}></i>
              <h1 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 600 }}>
                <i className="fas fa-star" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                Manage Testimonials
              </h1>
            </div>
            <button
              onClick={openCreateModal}
              style={{
                background: '#F9C74F',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                color: '#0B3B2F',
                fontWeight: 600,
                fontSize: '0.813rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fas fa-plus"></i> Add Testimonial
            </button>
          </div>
          <p style={{ fontSize: '0.813rem', opacity: 0.9 }}>Manage community testimonials and feedback</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <i className="fas fa-comments" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
            <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', fontWeight: 700 }}>{stats.total}</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Testimonials</p>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <i className="fas fa-star-half-alt" style={{ fontSize: '1.5rem', color: '#F9C74F' }}></i>
            <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', fontWeight: 700 }}>{stats.average_rating}</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Average Rating</p>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <i className="fas fa-star" style={{ fontSize: '1.5rem', color: '#F9C74F' }}></i>
            <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', fontWeight: 700 }}>{stats.rating_distribution?.[5] || 0}</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>5-Star Reviews</p>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <i className="fas fa-check-circle" style={{ fontSize: '1.5rem', color: '#10b981' }}></i>
            <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', fontWeight: 700 }}>{testimonials.filter(t => t.is_active).length}</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Active</p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1rem',
          marginBottom: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.875rem' }}></i>
                <input
                  type="text"
                  placeholder="Search by name, role, or text..."
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
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.813rem' }}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.813rem' }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            {selectedCount > 0 && (
              <button
                onClick={handleBulkDelete}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.813rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-trash-alt"></i> Delete Selected ({selectedCount})
              </button>
            )}
            <button
              onClick={fetchTestimonials}
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
        </div>

        {/* Testimonials Table */}
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.813rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'center', padding: '0.75rem', width: '40px' }}>
                    <input type="checkbox" onChange={toggleSelectAll} />
                  </th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 600, color: '#475569' }}>#</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 600, color: '#475569' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 600, color: '#475569' }}>Role</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', fontWeight: 600, color: '#475569' }}>Rating</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 600, color: '#475569' }}>Testimonial</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', fontWeight: 600, color: '#475569' }}>Status</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', fontWeight: 600, color: '#475569' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                      <i className="fas fa-inbox" style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}></i>
                      No testimonials found
                    </td>
                  </tr>
                ) : (
                  currentItems.map((testimonial, idx) => (
                    <tr key={testimonial.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ textAlign: 'center', padding: '0.75rem' }}>
                        <input
                          type="checkbox"
                          checked={testimonial.selected || false}
                          onChange={() => toggleSelect(testimonial.id)}
                        />
                      </td>
                      <td style={{ padding: '0.75rem', color: '#0B3B2F', fontWeight: 500 }}>{testimonial.id}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 500 }}>{testimonial.name}</td>
                      <td style={{ padding: '0.75rem' }}>{testimonial.role || '-'}</td>
                      <td style={{ textAlign: 'center', padding: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.1rem', justifyContent: 'center' }}>
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={i < testimonial.rating ? 'fas fa-star' : 'far fa-star'} style={{ color: '#F9C74F', fontSize: '0.7rem' }}></i>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem', maxWidth: '300px' }}>
                        <div style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {testimonial.text.substring(0, 60)}...
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', padding: '0.75rem' }}>
                        <span style={{
                          background: testimonial.is_active ? '#d1fae5' : '#fee2e2',
                          color: testimonial.is_active ? '#10b981' : '#ef4444',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '20px',
                          fontSize: '0.7rem',
                          fontWeight: 600
                        }}>
                          {testimonial.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', padding: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button
                            onClick={() => openEditModal(testimonial)}
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
                          <button
                            onClick={() => {
                              setSelectedTestimonial(testimonial);
                              setShowDeleteConfirm(true);
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                            title="Delete"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
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
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '24px', maxWidth: '600px', width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative'
          }}>
            <button onClick={closeModal} style={{
              position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.6)',
              border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', color: 'white', zIndex: 10
            }}><i className="fas fa-times"></i></button>

            <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '1.5rem', textAlign: 'center', borderRadius: '24px 24px 0 0' }}>
              <div style={{ width: '56px', height: '56px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-star" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1.2rem', fontWeight: 600 }}>
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h2>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.8rem' }}>
                  Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full name"
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    borderRadius: '12px',
                    border: formErrors.name ? '2px solid #ef4444' : '1px solid #ddd',
                    fontSize: '0.9rem'
                  }}
                />
                {formErrors.name && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{formErrors.name}</p>}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.8rem' }}>Role/Title</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="e.g., Executive Director, VUMA"
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.8rem' }}>
                  Rating <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        padding: 0
                      }}
                    >
                      <i className={star <= formData.rating ? 'fas fa-star' : 'far fa-star'} style={{ color: '#F9C74F' }}></i>
                    </button>
                  ))}
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>({formData.rating}/5)</span>
                </div>
                {formErrors.rating && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{formErrors.rating}</p>}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.8rem' }}>
                  Testimonial <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="What they said about VUMA..."
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    borderRadius: '12px',
                    border: formErrors.text ? '2px solid #ef4444' : '1px solid #ddd',
                    fontSize: '0.9rem',
                    resize: 'vertical'
                  }}
                />
                {formErrors.text && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{formErrors.text}</p>}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  <span style={{ fontSize: '0.8rem' }}>Active (show on website)</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={closeModal} style={{
                  flex: 1, background: '#f1f5f9', border: 'none', padding: '0.7rem', borderRadius: '40px', cursor: 'pointer', fontWeight: 600
                }}>Cancel</button>
                <button onClick={handleSubmit} disabled={actionLoading} style={{
                  flex: 2, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '40px', cursor: actionLoading ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}>
                  {actionLoading ? <i className="fas fa-spinner fa-spin"></i> : (editingTestimonial ? 'Update' : 'Create')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedTestimonial && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{ background: 'white', borderRadius: '20px', maxWidth: '380px', width: '100%', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '1.25rem', color: '#ef4444' }}></i>
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>Delete Testimonial</h3>
            <p style={{ color: '#64748b', marginBottom: '1.25rem', fontSize: '0.813rem' }}>
              Are you sure you want to delete testimonial from "{selectedTestimonial.name}"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '0.5rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
              <button onClick={handleDelete} disabled={actionLoading} style={{ flex: 1, padding: '0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: actionLoading ? 'not-allowed' : 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {actionLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Delete'}
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

export default AdminTestimonials;