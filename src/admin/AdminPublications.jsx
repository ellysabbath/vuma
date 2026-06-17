import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminPublications = () => {
  const navigate = useNavigate();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPublication, setEditingPublication] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [newPublication, setNewPublication] = useState({
    title: '',
    short_description: '',
    more_description: '',
    author_publisher: '',
    published_date: '',
    type: 'journal',
    status: 'published',
    pdf_file: '',
    pdf_file_name: ''
  });

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/publications/`);
      const data = await response.json();
      if (data.success) {
        setPublications(data.data);
        showActionFeedback('Publications loaded successfully!', 'success');
      } else {
        setError('Failed to load publications');
        showActionFeedback('Failed to load publications', 'error');
      }
    } catch (error) {
      console.error('Error fetching publications:', error);
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

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePdfChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showActionFeedback('File size should be less than 10MB', 'error');
        return;
      }
      const base64 = await fileToBase64(file);
      setNewPublication(prev => ({ 
        ...prev, 
        pdf_file: base64, 
        pdf_file_name: file.name 
      }));
      showActionFeedback('PDF selected successfully!', 'success');
    }
  };

  const handleEditPdfChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showActionFeedback('File size should be less than 10MB', 'error');
        return;
      }
      const base64 = await fileToBase64(file);
      setEditingPublication(prev => ({ 
        ...prev, 
        pdf_file: base64, 
        pdf_file_name: file.name 
      }));
      showActionFeedback('PDF updated successfully!', 'success');
    }
  };

  const openModal = (publication) => {
    setSelectedPublication(publication);
    setIsEditMode(false);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPublication(null);
    setIsEditMode(false);
    setEditingPublication(null);
    document.body.style.overflow = 'unset';
  };

  const openEditModal = (publication) => {
    setEditingPublication({ ...publication });
    setIsEditMode(true);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingPublication({
      ...editingPublication,
      [name]: value
    });
  };

  const handleUpdatePublication = async () => {
    if (!editingPublication.title) {
      showActionFeedback('Please fill in publication title', 'error');
      return;
    }
    
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/publications/${editingPublication.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingPublication),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchPublications();
        showActionFeedback(`${editingPublication.title} updated successfully!`, 'success');
        closeModal();
      } else {
        showActionFeedback(data.error || 'Failed to update publication', 'error');
      }
    } catch (error) {
      console.error('Error updating publication:', error);
      showActionFeedback('Network error. Please try again.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const openAddModal = () => {
    setShowAddModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewPublication({
      title: '',
      short_description: '',
      more_description: '',
      author_publisher: '',
      published_date: '',
      type: 'journal',
      status: 'published',
      pdf_file: '',
      pdf_file_name: ''
    });
    document.body.style.overflow = 'unset';
  };

  const handleAddPublication = async () => {
    if (!newPublication.title) {
      showActionFeedback('Please fill in publication title', 'error');
      return;
    }
    
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/publications/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPublication),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchPublications();
        showActionFeedback(`${newPublication.title} added successfully!`, 'success');
        closeAddModal();
      } else {
        showActionFeedback(data.error || 'Failed to add publication', 'error');
      }
    } catch (error) {
      console.error('Error adding publication:', error);
      showActionFeedback('Network error. Please try again.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (publication) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${publication.title}"?`);
    if (confirmDelete) {
      setActionLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/publications/${publication.id}/`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        if (data.success) {
          await fetchPublications();
          showActionFeedback(`${publication.title} deleted successfully!`, 'success');
        } else {
          showActionFeedback(data.error || 'Failed to delete publication', 'error');
        }
      } catch (error) {
        console.error('Error deleting publication:', error);
        showActionFeedback('Network error. Please try again.', 'error');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPublication({
      ...newPublication,
      [name]: value
    });
  };

  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  const handleRefresh = () => {
    fetchPublications();
  };

  const handleViewClick = (publication) => {
    openModal(publication);
  };

  const handleEditClick = (publication) => {
    openEditModal(publication);
  };

  const handleDeleteClick = (publication) => {
    handleDelete(publication);
  };

  const handleAddClick = () => {
    openAddModal();
  };

  const getTypeColor = (type) => {
    const colors = {
      'journal': '#2563eb',
      'conference': '#7c3aed',
      'book': '#dc2626',
      'book_chapter': '#059669',
      'thesis': '#d97706',
      'report': '#0891b2',
      'other': '#6b7280'
    };
    return colors[type] || '#6b7280';
  };

  const getTypeLabel = (type) => {
    const labels = {
      'journal': 'Journal',
      'conference': 'Conference',
      'book': 'Book',
      'book_chapter': 'Book Chapter',
      'thesis': 'Thesis',
      'report': 'Report',
      'other': 'Other'
    };
    return labels[type] || type;
  };

  const getStatusColor = (status) => {
    const colors = {
      'published': '#10b981',
      'pending': '#f59e0b',
      'draft': '#6b7280',
      'archived': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'published': 'Published',
      'pending': 'Pending Review',
      'draft': 'Draft',
      'archived': 'Archived'
    };
    return labels[status] || status;
  };

  // Filter publications
  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.author_publisher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || pub.type === filterType;
    const matchesStatus = filterStatus === 'all' || pub.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>Loading publications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '2rem', color: '#ef4444' }}></i>
          <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>{error}</p>
          <button onClick={fetchPublications} style={{ marginTop: '0.75rem', background: '#F9C74F', border: 'none', padding: '0.375rem 0.875rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.813rem', fontWeight: 500 }}>
            Try Again
          </button>
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
              <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Publications Management</h1>
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
          <p style={{ fontSize: '0.813rem', opacity: 0.9, margin: '0.25rem 0 0 0' }}>Manage research publications and scholarly contributions</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          {/* Header with Add Button and Filters */}
          <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flex: 1 }}>
              <input
                type="text"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.813rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  minWidth: '200px',
                  flex: 1
                }}
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.813rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              >
                <option value="all">All Types</option>
                <option value="journal">Journal</option>
                <option value="conference">Conference</option>
                <option value="book">Book</option>
                <option value="book_chapter">Book Chapter</option>
                <option value="thesis">Thesis</option>
                <option value="report">Report</option>
                <option value="other">Other</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.813rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="pending">Pending Review</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <button
              onClick={handleAddClick}
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
              Add Publication
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.813rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Author/Publisher</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Type</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Published Date</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPublications.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                      <i className="fas fa-file-alt" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}></i>
                      No publications found. Click "Add Publication" to get started.
                    </td>
                  </tr>
                ) : (
                  filteredPublications.map(pub => (
                    <tr key={pub.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s ease' }} 
                        onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'} 
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ cursor: 'pointer', color: '#0B3B2F', fontWeight: 500, fontSize: '0.813rem' }} onClick={() => handleViewClick(pub)}>
                          {pub.title.length > 50 ? pub.title.substring(0, 50) + '...' : pub.title}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#475569' }}>
                        {pub.author_publisher || '-'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          background: `${getTypeColor(pub.type)}15`,
                          color: getTypeColor(pub.type),
                          padding: '0.125rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.688rem',
                          fontWeight: 500,
                          display: 'inline-block'
                        }}>{getTypeLabel(pub.type)}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          background: `${getStatusColor(pub.status)}15`,
                          color: getStatusColor(pub.status),
                          padding: '0.125rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.688rem',
                          fontWeight: 500,
                          display: 'inline-block'
                        }}>{getStatusLabel(pub.status)}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#475569' }}>
                        {pub.published_date ? new Date(pub.published_date).toLocaleDateString() : '-'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <button
                            onClick={() => handleViewClick(pub)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              transition: 'all 0.2s ease',
                              color: '#0B3B2F'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.2)';
                              e.currentTarget.style.color = '#1a5c48';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.color = '#0B3B2F';
                            }}
                            title="View Details"
                          >
                            <i className="fas fa-eye" style={{ fontSize: '0.875rem' }}></i>
                          </button>
                          <button
                            onClick={() => handleEditClick(pub)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              transition: 'all 0.2s ease',
                              color: '#3b82f6'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.2)';
                              e.currentTarget.style.color = '#2563eb';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.color = '#3b82f6';
                            }}
                            title="Edit Publication"
                          >
                            <i className="fas fa-edit" style={{ fontSize: '0.875rem' }}></i>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(pub)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              transition: 'all 0.2s ease',
                              color: '#ef4444'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.2)';
                              e.currentTarget.style.color = '#dc2626';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.color = '#ef4444';
                            }}
                            title="Delete Publication"
                          >
                            <i className="fas fa-trash" style={{ fontSize: '0.875rem' }}></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer Stats */}
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Showing {filteredPublications.length} of {publications.length} publications
            </span>
          </div>
        </div>
      </div>

      {/* Publication Details/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '20px', maxWidth: '500px', width: '100%', 
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={closeModal} style={{
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
                <i className="fas fa-file-alt" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '0', fontSize: '1.1rem', fontWeight: 600 }}>
                {isEditMode ? 'Edit Publication' : 'Publication Details'}
              </h2>
            </div>
            
            <div style={{ 
              padding: '1.25rem', 
              overflowY: 'auto', 
              flex: 1,
              maxHeight: 'calc(90vh - 120px)'
            }}>
              {isEditMode && editingPublication ? (
                // Edit Form
                <>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Title *</label>
                    <input type="text" name="title" value={editingPublication.title} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Short Description</label>
                    <textarea name="short_description" value={editingPublication.short_description || ''} onChange={handleEditChange} rows="2" style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>More Description</label>
                    <textarea name="more_description" value={editingPublication.more_description || ''} onChange={handleEditChange} rows="3" style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Author/Publisher</label>
                    <input type="text" name="author_publisher" value={editingPublication.author_publisher || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Type</label>
                      <select name="type" value={editingPublication.type} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        <option value="journal">Journal</option>
                        <option value="conference">Conference</option>
                        <option value="book">Book</option>
                        <option value="book_chapter">Book Chapter</option>
                        <option value="thesis">Thesis</option>
                        <option value="report">Report</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Status</label>
                      <select name="status" value={editingPublication.status} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        <option value="published">Published</option>
                        <option value="pending">Pending Review</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Published Date</label>
                    <input type="date" name="published_date" value={editingPublication.published_date || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>PDF File</label>
                    <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleEditPdfChange} style={{ width: '100%', padding: '0.375rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                    {editingPublication.pdf_file_name && (
                      <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#4caf50' }}>
                        <i className="fas fa-check-circle"></i> {editingPublication.pdf_file_name}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <button onClick={closeModal} disabled={actionLoading} style={{ flex: 1, background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem' }}>
                      Cancel
                    </button>
                    <button onClick={handleUpdatePublication} disabled={actionLoading} style={{ flex: 1, background: actionLoading ? '#94a3b8' : '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: actionLoading ? 'not-allowed' : 'pointer', fontSize: '0.813rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      {actionLoading ? <><i className="fas fa-spinner fa-spin"></i> Updating...</> : <><i className="fas fa-save"></i> Update</>}
                    </button>
                  </div>
                </>
              ) : (
                // View Mode
                <>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>Title</label>
                    <div style={{ padding: '0.5rem', fontSize: '0.813rem', background: '#f8fafc', borderRadius: '8px', color: '#0B3B2F', fontWeight: 500 }}>{selectedPublication?.title}</div>
                  </div>
                  
                  {selectedPublication?.short_description && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>Short Description</label>
                      <div style={{ padding: '0.5rem', fontSize: '0.813rem', background: '#f8fafc', borderRadius: '8px', lineHeight: '1.4' }}>{selectedPublication.short_description}</div>
                    </div>
                  )}
                  
                  {selectedPublication?.more_description && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>More Description</label>
                      <div style={{ padding: '0.5rem', fontSize: '0.813rem', background: '#f8fafc', borderRadius: '8px', lineHeight: '1.4' }}>{selectedPublication.more_description}</div>
                    </div>
                  )}
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>Author/Publisher</label>
                    <div style={{ padding: '0.5rem', fontSize: '0.813rem', background: '#f8fafc', borderRadius: '8px' }}>{selectedPublication?.author_publisher || '-'}</div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>Type</label>
                      <div><span style={{ background: `${getTypeColor(selectedPublication?.type)}15`, color: getTypeColor(selectedPublication?.type), padding: '0.25rem 0.625rem', borderRadius: '12px', fontSize: '0.75rem', display: 'inline-block' }}>{getTypeLabel(selectedPublication?.type)}</span></div>
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>Status</label>
                      <div><span style={{ background: `${getStatusColor(selectedPublication?.status)}15`, color: getStatusColor(selectedPublication?.status), padding: '0.25rem 0.625rem', borderRadius: '12px', fontSize: '0.75rem', display: 'inline-block' }}>{getStatusLabel(selectedPublication?.status)}</span></div>
                    </div>
                  </div>
                  
                  {selectedPublication?.published_date && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>Published Date</label>
                      <div style={{ padding: '0.5rem', fontSize: '0.813rem', background: '#f8fafc', borderRadius: '8px' }}>
                        {new Date(selectedPublication.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  )}
                  
                  {selectedPublication?.pdf_file_name && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>Attached File</label>
                      <div style={{ padding: '0.5rem', fontSize: '0.813rem', background: '#f8fafc', borderRadius: '8px' }}>
                        <i className="fas fa-file-pdf" style={{ color: '#ef4444', marginRight: '0.5rem' }}></i>
                        {selectedPublication.pdf_file_name}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <button onClick={closeModal} style={{ flex: 1, background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem' }}>
                      Close
                    </button>
                    <button onClick={() => openEditModal(selectedPublication)} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-edit"></i> Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Publication Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeAddModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '20px', maxWidth: '500px', width: '100%',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={closeAddModal} style={{
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
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Add New Publication</h2>
            </div>
            
            <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1, maxHeight: 'calc(90vh - 120px)' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Title *</label>
                <input type="text" name="title" value={newPublication.title} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Short Description</label>
                <textarea name="short_description" value={newPublication.short_description} onChange={handleInputChange} rows="2" style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>More Description</label>
                <textarea name="more_description" value={newPublication.more_description} onChange={handleInputChange} rows="3" style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Author/Publisher</label>
                <input type="text" name="author_publisher" value={newPublication.author_publisher} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Type</label>
                  <select name="type" value={newPublication.type} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <option value="journal">Journal</option>
                    <option value="conference">Conference</option>
                    <option value="book">Book</option>
                    <option value="book_chapter">Book Chapter</option>
                    <option value="thesis">Thesis</option>
                    <option value="report">Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Status</label>
                  <select name="status" value={newPublication.status} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <option value="published">Published</option>
                    <option value="pending">Pending Review</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Published Date</label>
                <input type="date" name="published_date" value={newPublication.published_date} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>PDF File</label>
                <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handlePdfChange} style={{ width: '100%', padding: '0.375rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                {newPublication.pdf_file_name && (
                  <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#4caf50' }}>
                    <i className="fas fa-check-circle"></i> {newPublication.pdf_file_name}
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button onClick={closeAddModal} disabled={actionLoading} style={{ flex: 1, background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem' }}>
                  Cancel
                </button>
                <button onClick={handleAddPublication} disabled={actionLoading} style={{ flex: 1, background: actionLoading ? '#94a3b8' : '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: actionLoading ? 'not-allowed' : 'pointer', fontSize: '0.813rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  {actionLoading ? <><i className="fas fa-spinner fa-spin"></i> Adding...</> : <><i className="fas fa-plus"></i> Add Publication</>}
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

export default AdminPublications;