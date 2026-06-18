import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminPartners = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [editLogoPreview, setEditLogoPreview] = useState('');
  
  // Loading states for actions
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  // Status choices
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const [newPartner, setNewPartner] = useState({
    name: '',
    type: '',
    status: 'pending',
    since: new Date().getFullYear().toString(),
    description: '',
    website: '',
    contact_person: '',
    email: '',
    phone: '',
    projects_count: 0,
    logo_base64: '',
    focus_areas: []
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchPartners();
  }, []);

  useEffect(() => {
    if (id && partners.length > 0) {
      const partner = partners.find(p => p.id === parseInt(id));
      if (partner) {
        setSelectedPartner(partner);
        setShowModal(true);
        setIsEditMode(false);
      }
    }
  }, [id, partners]);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://vuma.pythonanywhere.com/api/partners/');
      const data = await response.json();
      if (data.success) {
        setPartners(data.data);
      } else {
        setError('Failed to load partners');
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

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const preview = URL.createObjectURL(file);
      setLogoPreview(preview);
      const base64 = await fileToBase64(file);
      setNewPartner(prev => ({ ...prev, logo_base64: base64 }));
    }
  };

  const handleEditLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setEditLogoPreview(preview);
      const base64 = await fileToBase64(file);
      setEditingPartner(prev => ({ ...prev, logo_base64: base64 }));
    }
  };

  const openModal = (partner) => {
    setSelectedPartner(partner);
    setIsEditMode(false);
    setShowModal(true);
    navigate(`/admin/partners/${partner.id}`, { replace: true });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPartner(null);
    setIsEditMode(false);
    setEditingPartner(null);
    setEditLogoPreview('');
    setIsUpdating(false);
    navigate('/admin/partners', { replace: true });
    document.body.style.overflow = 'unset';
  };

  const openEditModal = (partner) => {
    setEditingPartner({ ...partner });
    setIsEditMode(true);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
    if (partner.logo_base64) {
      setEditLogoPreview(partner.logo_base64);
    }
  };

  const handleEditChange = (e) => {
    setEditingPartner({
      ...editingPartner,
      [e.target.name]: e.target.value
    });
  };

  const handleEditFocusAreasChange = (e) => {
    const focusAreasArray = e.target.value.split(',').map(s => s.trim());
    setEditingPartner({
      ...editingPartner,
      focus_areas: focusAreasArray
    });
  };

  const handleUpdatePartner = async () => {
    if (!editingPartner.name) {
      alert('Please fill in partner name');
      return;
    }
    
    setIsUpdating(true);
    try {
      const response = await fetch(`https://vuma.pythonanywhere.com/api/partners/${editingPartner.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingPartner),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchPartners();
        setSuccessMessage('Partner updated successfully!');
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          closeModal();
        }, 2000);
      } else {
        alert(data.error || 'Failed to update partner');
        setIsUpdating(false);
      }
    } catch (error) {
      alert('Network error. Please try again.');
      setIsUpdating(false);
    }
  };

  const openAddModal = () => {
    setShowAddModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewPartner({
      name: '',
      type: '',
      status: 'pending',
      since: new Date().getFullYear().toString(),
      description: '',
      website: '',
      contact_person: '',
      email: '',
      phone: '',
      projects_count: 0,
      logo_base64: '',
      focus_areas: []
    });
    setLogoPreview('');
    setLogoFile(null);
    setIsAdding(false);
    document.body.style.overflow = 'unset';
  };

  const handleAddPartner = async () => {
    if (!newPartner.name) {
      alert('Please fill in partner name');
      return;
    }
    
    setIsAdding(true);
    try {
      const response = await fetch('https://vuma.pythonanywhere.com/api/partners/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPartner),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchPartners();
        setSuccessMessage('Partner added successfully!');
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          closeAddModal();
        }, 2000);
      } else {
        alert(data.error || 'Failed to add partner');
        setIsAdding(false);
      }
    } catch (error) {
      alert('Network error. Please try again.');
      setIsAdding(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setIsDeleting(true);
    try {
      const response = await fetch(`https://vuma.pythonanywhere.com/api/partners/${id}/`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchPartners();
        setSuccessMessage('Partner deleted successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert(data.error || 'Failed to delete partner');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const handleInputChange = (e) => {
    setNewPartner({
      ...newPartner,
      [e.target.name]: e.target.value
    });
  };

  const handleFocusAreasChange = (e) => {
    const focusAreasArray = e.target.value.split(',').map(s => s.trim());
    setNewPartner({
      ...newPartner,
      focus_areas: focusAreasArray
    });
  };

  // Get status color based on status string
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'active') return '#10b981';
    if (statusLower === 'pending') return '#f59e0b';
    if (statusLower === 'inactive') return '#ef4444';
    return '#6b7280';
  };

  const getStatusLabel = (status) => {
    return status || 'Not specified';
  };

  // Get type color based on type string
  const getTypeColor = (type) => {
    const typeLower = type?.toLowerCase() || '';
    if (typeLower === 'development' || typeLower.includes('development')) return '#3b82f6';
    if (typeLower === 'environmental' || typeLower.includes('environmental')) return '#10b981';
    if (typeLower === 'corporate' || typeLower.includes('corporate')) return '#8b5cf6';
    if (typeLower === 'ngo' || typeLower.includes('ngo')) return '#f59e0b';
    if (typeLower === 'government' || typeLower.includes('government')) return '#ef4444';
    return '#6b7280';
  };

  const getTypeLabel = (type) => {
    return type || 'Not specified';
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>Loading partners...</p>
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
          <button onClick={fetchPartners} style={{ marginTop: '0.75rem', background: '#F9C74F', border: 'none', padding: '0.375rem 0.875rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.813rem', fontWeight: 500 }}>
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
              background: '#10b981',
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

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '1.5rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1rem' }} onClick={() => navigate('/admin')}></i>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Partners Management</h1>
          </div>
          <p style={{ fontSize: '0.813rem', opacity: 0.9, margin: 0 }}>Manage organizational partners and collaborations</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          {/* Header with Add Button */}
          <div style={{ padding: '1rem 1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={openAddModal}
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
              Add Partner
            </button>
          </div>

          {/* Compact Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.813rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Type</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Since</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Projects</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                      <i className="fas fa-handshake" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}></i>
                      No partners found. Click "Add Partner" to get started.
                    </td>
                  </tr>
                ) : (
                  partners.map(partner => (
                    <tr key={partner.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ cursor: 'pointer', color: '#0B3B2F', fontWeight: 500, fontSize: '0.813rem' }} onClick={() => openModal(partner)}>
                          {partner.name}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          background: `${getTypeColor(partner.type)}15`,
                          color: getTypeColor(partner.type),
                          padding: '0.125rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.688rem',
                          fontWeight: 500,
                          display: 'inline-block'
                        }}>{getTypeLabel(partner.type)}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          background: `${getStatusColor(partner.status)}15`,
                          color: getStatusColor(partner.status),
                          padding: '0.125rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.688rem',
                          fontWeight: 500,
                          display: 'inline-block'
                        }}>{getStatusLabel(partner.status)}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.813rem' }}>{partner.since}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.813rem' }}>{partner.projects_count || 0}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <button
                            onClick={() => openModal(partner)}
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
                            onClick={() => openEditModal(partner)}
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
                            title="Edit Partner"
                          >
                            <i className="fas fa-edit" style={{ fontSize: '0.875rem' }}></i>
                          </button>
                          <button
                            onClick={() => handleDelete(partner.id)}
                            disabled={isDeleting && deletingId === partner.id}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: isDeleting && deletingId === partner.id ? 'not-allowed' : 'pointer',
                              padding: '0.25rem',
                              transition: 'all 0.2s ease',
                              color: '#ef4444',
                              opacity: isDeleting && deletingId === partner.id ? 0.5 : 1
                            }}
                            onMouseEnter={(e) => {
                              if (!(isDeleting && deletingId === partner.id)) {
                                e.currentTarget.style.transform = 'scale(1.2)';
                                e.currentTarget.style.color = '#dc2626';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!(isDeleting && deletingId === partner.id)) {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.color = '#ef4444';
                              }
                            }}
                            title="Delete Partner"
                          >
                            {isDeleting && deletingId === partner.id ? (
                              <i className="fas fa-spinner fa-spin" style={{ fontSize: '0.875rem' }}></i>
                            ) : (
                              <i className="fas fa-trash" style={{ fontSize: '0.875rem' }}></i>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Partner Details/Edit Modal - Enhanced */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '20px', maxWidth: '480px', width: '100%', 
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
              padding: '1.25rem 1.25rem', 
              textAlign: 'center', 
              borderRadius: '20px 20px 0 0',
              flexShrink: 0
            }}>
              <div style={{ width: '56px', height: '56px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-handshake" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '0', fontSize: '1.1rem', fontWeight: 600 }}>
                {isEditMode ? 'Edit Partner' : 'Partner Details'}
              </h2>
            </div>
            
            <div style={{ 
              padding: '1.25rem', 
              overflowY: 'auto', 
              flex: 1,
              maxHeight: 'calc(90vh - 120px)'
            }}>
              {isEditMode && editingPartner ? (
                <>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Logo</label>
                    <div>
                      {editLogoPreview || editingPartner.logo_base64 ? (
                        <img src={editLogoPreview || editingPartner.logo_base64} alt="Logo" style={{ width: '64px', height: '64px', objectFit: 'contain', marginBottom: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                      ) : null}
                      <input type="file" accept="image/*" onChange={handleEditLogoChange} style={{ width: '100%', padding: '0.375rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Name *</label>
                    <input type="text" name="name" value={editingPartner.name} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'border-color 0.2s' }} />
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Type</label>
                    <input type="text" name="type" value={editingPartner.type || ''} onChange={handleEditChange} placeholder="e.g., Development, Environmental, Corporate, NGO, Government" style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Status</label>
                    <select 
                      name="status" 
                      value={editingPartner.status || 'pending'} 
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white' }}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Since</label>
                    <input type="text" name="since" value={editingPartner.since} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Description</label>
                    <textarea name="description" value={editingPartner.description || ''} onChange={handleEditChange} rows="3" style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Website</label>
                    <input type="url" name="website" value={editingPartner.website || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} placeholder="https://example.com" />
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Contact Person</label>
                    <input type="text" name="contact_person" value={editingPartner.contact_person || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Email</label>
                    <input type="email" name="email" value={editingPartner.email || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Phone</label>
                    <input type="text" name="phone" value={editingPartner.phone || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Projects Count</label>
                    <input type="number" name="projects_count" value={editingPartner.projects_count || 0} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Focus Areas</label>
                    <input type="text" value={editingPartner.focus_areas ? editingPartner.focus_areas.join(', ') : ''} onChange={handleEditFocusAreasChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} placeholder="Area1, Area2, Area3" />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <button onClick={closeModal} style={{ 
                      flex: 1, background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '8px', 
                      fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    disabled={isUpdating}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleUpdatePartner} 
                      disabled={isUpdating}
                      style={{ 
                        flex: 1, 
                        background: isUpdating ? '#94a3b8' : '#0B3B2F', 
                        color: 'white', 
                        border: 'none', 
                        padding: '0.5rem', 
                        borderRadius: '8px', 
                        fontWeight: 500, 
                        cursor: isUpdating ? 'not-allowed' : 'pointer', 
                        fontSize: '0.813rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isUpdating) {
                          e.currentTarget.style.background = '#1a5c48';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isUpdating) {
                          e.currentTarget.style.background = '#0B3B2F';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {isUpdating ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save"></i>
                          Update
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {selectedPartner?.logo_base64 && (
                    <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                      <img src={selectedPartner.logo_base64} alt={selectedPartner.name} style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px' }} />
                    </div>
                  )}
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>Name</label>
                    <div style={{ padding: '0.5rem', fontSize: '0.813rem', background: '#f8fafc', borderRadius: '8px', color: '#0B3B2F', fontWeight: 500 }}>{selectedPartner?.name}</div>
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>Type</label>
                    <div><span style={{ background: `${getTypeColor(selectedPartner?.type)}15`, color: getTypeColor(selectedPartner?.type), padding: '0.25rem 0.625rem', borderRadius: '12px', fontSize: '0.75rem', display: 'inline-block' }}>{getTypeLabel(selectedPartner?.type)}</span></div>
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>Status</label>
                    <div><span style={{ background: `${getStatusColor(selectedPartner?.status)}15`, color: getStatusColor(selectedPartner?.status), padding: '0.25rem 0.625rem', borderRadius: '12px', fontSize: '0.75rem', display: 'inline-block' }}>{getStatusLabel(selectedPartner?.status)}</span></div>
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>Since</label>
                    <div style={{ padding: '0.5rem', fontSize: '0.813rem', background: '#f8fafc', borderRadius: '8px' }}>{selectedPartner?.since}</div>
                  </div>
                  
                  {selectedPartner?.website && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>Website</label>
                      <div style={{ padding: '0.5rem', fontSize: '0.813rem', background: '#f8fafc', borderRadius: '8px' }}>
                        <a href={selectedPartner.website} target="_blank" rel="noopener noreferrer" style={{ color: '#0B3B2F', textDecoration: 'none' }}>
                          {selectedPartner.website}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {selectedPartner?.contact_person && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>Contact Person</label>
                      <div style={{ padding: '0.5rem', fontSize: '0.813rem', background: '#f8fafc', borderRadius: '8px' }}>{selectedPartner.contact_person}</div>
                    </div>
                  )}
                  
                  {selectedPartner?.email && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>Email</label>
                      <div style={{ padding: '0.5rem', fontSize: '0.813rem', background: '#f8fafc', borderRadius: '8px' }}>{selectedPartner.email}</div>
                    </div>
                  )}
                  
                  {selectedPartner?.phone && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>Phone</label>
                      <div style={{ padding: '0.5rem', fontSize: '0.813rem', background: '#f8fafc', borderRadius: '8px' }}>{selectedPartner.phone}</div>
                    </div>
                  )}
                  
                  {selectedPartner?.description && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>Description</label>
                      <div style={{ padding: '0.5rem', fontSize: '0.813rem', background: '#f8fafc', borderRadius: '8px', lineHeight: '1.4' }}>{selectedPartner?.description}</div>
                    </div>
                  )}
                  
                  {selectedPartner?.focus_areas && selectedPartner.focus_areas.length > 0 && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>Focus Areas</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {selectedPartner.focus_areas.map((area, i) => (
                          <span key={i} style={{ background: '#e8f5e9', color: '#0B3B2F', padding: '0.125rem 0.5rem', borderRadius: '12px', fontSize: '0.688rem' }}>{area}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <button onClick={closeModal} style={{ 
                      flex: 1, background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '8px', 
                      fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    >
                      Close
                    </button>
                    <button 
                      onClick={() => openEditModal(selectedPartner)} 
                      style={{ 
                        flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem', 
                        borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#1a5c48';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#0B3B2F';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <i className="fas fa-edit"></i>
                      Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Partner Modal - Enhanced */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeAddModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '20px', maxWidth: '480px', width: '100%',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={closeAddModal} style={{
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
              padding: '1.25rem 1.25rem', 
              textAlign: 'center', 
              borderRadius: '20px 20px 0 0',
              flexShrink: 0
            }}>
              <div style={{ width: '56px', height: '56px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-handshake" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Add New Partner</h2>
            </div>
            
            <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1, maxHeight: 'calc(90vh - 120px)' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Logo</label>
                <input type="file" accept="image/*" onChange={handleLogoChange} style={{ width: '100%', padding: '0.375rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                {logoPreview && <img src={logoPreview} alt="Preview" style={{ width: '64px', height: '64px', objectFit: 'contain', marginTop: '0.5rem', borderRadius: '8px' }} />}
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Name *</label>
                <input type="text" name="name" value={newPartner.name} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Type</label>
                <input type="text" name="type" value={newPartner.type} onChange={handleInputChange} placeholder="e.g., Development, Environmental, Corporate, NGO, Government" style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Status</label>
                <select 
                  name="status" 
                  value={newPartner.status} 
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white' }}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Since</label>
                <input type="text" name="since" value={newPartner.since} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Description</label>
                <textarea name="description" value={newPartner.description} onChange={handleInputChange} rows="3" style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Website</label>
                <input type="url" name="website" value={newPartner.website} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} placeholder="https://example.com" />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Contact Person</label>
                <input type="text" name="contact_person" value={newPartner.contact_person} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Email</label>
                <input type="email" name="email" value={newPartner.email} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Phone</label>
                <input type="text" name="phone" value={newPartner.phone} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Projects Count</label>
                <input type="number" name="projects_count" value={newPartner.projects_count} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Focus Areas</label>
                <input type="text" value={newPartner.focus_areas.join(', ')} onChange={handleFocusAreasChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} placeholder="Area1, Area2, Area3" />
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button onClick={closeAddModal} style={{ 
                  flex: 1, background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '8px', 
                  fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
                disabled={isAdding}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddPartner}
                  disabled={isAdding}
                  style={{ 
                    flex: 1, 
                    background: isAdding ? '#94a3b8' : '#0B3B2F', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.5rem', 
                    borderRadius: '8px', 
                    fontWeight: 500, 
                    cursor: isAdding ? 'not-allowed' : 'pointer', 
                    fontSize: '0.813rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isAdding) {
                      e.currentTarget.style.background = '#1a5c48';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isAdding) {
                      e.currentTarget.style.background = '#0B3B2F';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {isAdding ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus"></i>
                      Add Partner
                    </>
                  )}
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

export default AdminPartners;