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
  const [newPartner, setNewPartner] = useState({
    name: '',
    type: 'development',
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
        setTimeout(() => setShowSuccess(false), 3000);
        closeModal();
      } else {
        alert(data.error || 'Failed to update partner');
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
    setNewPartner({
      name: '',
      type: 'development',
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
    document.body.style.overflow = 'unset';
  };

  const handleAddPartner = async () => {
    if (!newPartner.name) {
      alert('Please fill in partner name');
      return;
    }
    
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
        setTimeout(() => setShowSuccess(false), 3000);
        closeAddModal();
      } else {
        alert(data.error || 'Failed to add partner');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
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
      }
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

  const getStatusColor = (status) => {
    const colors = {
      'active': '#10b981',
      'pending': '#f59e0b',
      'inactive': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'active': 'Active',
      'pending': 'Pending',
      'inactive': 'Inactive'
    };
    return labels[status] || status;
  };

  const getTypeColor = (type) => {
    const colors = {
      'development': '#3b82f6',
      'environmental': '#10b981',
      'corporate': '#8b5cf6',
      'ngo': '#f59e0b',
      'government': '#ef4444'
    };
    return colors[type] || '#6b7280';
  };

  const getTypeLabel = (type) => {
    const labels = {
      'development': 'Development',
      'environmental': 'Environmental',
      'corporate': 'Corporate',
      'ngo': 'NGO',
      'government': 'Government'
    };
    return labels[type] || type;
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
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderLeft: `3px solid #10b981`
          }}>
            <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '1rem' }}></i>
            <span style={{ fontSize: '0.813rem', color: '#0B3B2F' }}>{successMessage}</span>
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
                padding: '0.375rem 0.875rem',
                borderRadius: '8px',
                fontSize: '0.813rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1a5c48'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#0B3B2F'}
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
                {partners.map(partner => (
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
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <i className="fas fa-eye" style={{ color: '#0B3B2F', cursor: 'pointer', fontSize: '0.875rem', transition: 'opacity 0.2s' }} onClick={() => openModal(partner)} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}></i>
                        <i className="fas fa-edit" style={{ color: '#3b82f6', cursor: 'pointer', fontSize: '0.875rem', transition: 'opacity 0.2s' }} onClick={() => openEditModal(partner)} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}></i>
                        <i className="fas fa-trash" style={{ color: '#ef4444', cursor: 'pointer', fontSize: '0.875rem', transition: 'opacity 0.2s' }} onClick={() => handleDelete(partner.id)} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}></i>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Partner Details/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.2s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '16px', maxWidth: '480px', width: '100%', 
            maxHeight: '85vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.2s ease'
          }}>
            <button onClick={closeModal} style={{
              position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', border: 'none',
              width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
            }}><i className="fas fa-times"></i></button>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', 
              padding: '1rem 1rem', 
              textAlign: 'center', 
              borderRadius: '16px 16px 0 0',
              flexShrink: 0
            }}>
              <div style={{ width: '56px', height: '56px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-handshake" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '0', fontSize: '1rem', fontWeight: 600 }}>
                {isEditMode ? 'Edit Partner' : 'Partner Details'}
              </h2>
            </div>
            
            <div style={{ 
              padding: '1rem', 
              overflowY: 'auto', 
              flex: 1,
              maxHeight: 'calc(85vh - 100px)'
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
                    <input type="text" name="name" value={editingPartner.name} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Type</label>
                    <select name="type" value={editingPartner.type} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <option value="development">Development</option>
                      <option value="environmental">Environmental</option>
                      <option value="corporate">Corporate</option>
                      <option value="ngo">NGO</option>
                      <option value="government">Government</option>
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Status</label>
                    <select name="status" value={editingPartner.status} onChange={handleEditChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
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
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Focus Areas</label>
                    <input type="text" value={editingPartner.focus_areas ? editingPartner.focus_areas.join(', ') : ''} onChange={handleEditFocusAreasChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} placeholder="Area1, Area2, Area3" />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <button onClick={closeModal} style={{ flex: 1, background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem' }}>Cancel</button>
                    <button onClick={handleUpdatePartner} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem' }}>Update</button>
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
                    <button onClick={closeModal} style={{ flex: 1, background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem' }}>Close</button>
                    <button onClick={() => openEditModal(selectedPartner)} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem' }}>Edit</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Partner Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeAddModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.2s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '16px', maxWidth: '480px', width: '100%',
            maxHeight: '85vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.2s ease'
          }}>
            <button onClick={closeAddModal} style={{
              position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', border: 'none',
              width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
            }}><i className="fas fa-times"></i></button>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', 
              padding: '1rem 1rem', 
              textAlign: 'center', 
              borderRadius: '16px 16px 0 0',
              flexShrink: 0
            }}>
              <div style={{ width: '56px', height: '56px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-handshake" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>Add Partner</h2>
            </div>
            
            <div style={{ padding: '1rem', overflowY: 'auto', flex: 1, maxHeight: 'calc(85vh - 100px)' }}>
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
                <select name="type" value={newPartner.type} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <option value="development">Development</option>
                  <option value="environmental">Environmental</option>
                  <option value="corporate">Corporate</option>
                  <option value="ngo">NGO</option>
                  <option value="government">Government</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Status</label>
                <select name="status" value={newPartner.status} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
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
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.75rem', color: '#475569' }}>Focus Areas</label>
                <input type="text" value={newPartner.focus_areas.join(', ')} onChange={handleFocusAreasChange} style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} placeholder="Area1, Area2, Area3" />
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button onClick={closeAddModal} style={{ flex: 1, background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem' }}>Cancel</button>
                <button onClick={handleAddPartner} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem' }}>Add</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        
        .modal-content div::-webkit-scrollbar { width: 4px; }
        .modal-content div::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .modal-content div::-webkit-scrollbar-thumb { background: #0B3B2F; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminPartners;