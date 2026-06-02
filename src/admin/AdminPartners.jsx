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
      'active': '#4caf50',
      'pending': '#ff9800',
      'inactive': '#d32f2f'
    };
    return colors[status] || '#757575';
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
      'development': '#2196F3',
      'environmental': '#4caf50',
      'corporate': '#9C27B0',
      'ngo': '#FF9800',
      'government': '#d32f2f'
    };
    return colors[type] || '#757575';
  };

  const getTypeLabel = (type) => {
    const labels = {
      'development': 'Development Partner',
      'environmental': 'Environmental Partner',
      'corporate': 'Corporate Partner',
      'ngo': 'NGO Partner',
      'government': 'Government Partner'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading partners...</p>
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
          <button onClick={fetchPartners} style={{ marginTop: '1rem', background: '#F9C74F', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      {/* Sweet Circle Success Alert */}
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
            <h1 style={{ fontSize: '1.8rem' }}>Partners Management</h1>
          </div>
          <p>Manage organizational partners and collaborations</p>
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
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Type</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Since</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Projects</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map(partner => (
                  <tr key={partner.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{ cursor: 'pointer', color: '#0B3B2F', fontWeight: 600 }} onClick={() => openModal(partner)}>
                        {partner.name}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{
                        background: getTypeColor(partner.type),
                        color: 'white',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem'
                      }}>{getTypeLabel(partner.type)}</span>
                    </td>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{
                        background: `${getStatusColor(partner.status)}20`,
                        color: getStatusColor(partner.status),
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem'
                      }}>{getStatusLabel(partner.status)}</span>
                    </td>
                    <td style={{ padding: '0.8rem' }}>{partner.since}</td>
                    <td style={{ padding: '0.8rem' }}>{partner.projects_count || 0}</td>
                    <td style={{ padding: '0.8rem' }}>
                      <i className="fas fa-eye" style={{ color: '#0B3B2F', cursor: 'pointer', marginRight: '0.8rem' }} onClick={() => openModal(partner)}></i>
                      <i className="fas fa-edit" style={{ color: '#2196F3', cursor: 'pointer', marginRight: '0.8rem' }} onClick={() => openEditModal(partner)}></i>
                      <i className="fas fa-trash" style={{ color: '#d32f2f', cursor: 'pointer' }} onClick={() => handleDelete(partner.id)}></i>
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
                <i className={isEditMode ? "fas fa-handshake" : "fas fa-handshake"} style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.8rem', marginBottom: '0.3rem', fontSize: '1.3rem' }}>
                {isEditMode ? 'Edit Partner' : 'Partner Details'}
              </h2>
              {!isEditMode && <p style={{ color: '#F9C74F', fontSize: '0.9rem' }}>View complete partner information</p>}
            </div>
            
            <div style={{ 
              padding: '1.2rem', 
              overflowY: 'auto', 
              flex: 1,
              maxHeight: 'calc(90vh - 140px)'
            }}>
              {isEditMode && editingPartner ? (
                // Edit Form
                <>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Partner Logo</label>
                    <div style={{ marginBottom: '0.5rem' }}>
                      {editLogoPreview ? (
                        <img src={editLogoPreview} alt="Logo" style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '0.5rem' }} />
                      ) : editingPartner.logo_base64 ? (
                        <img src={editingPartner.logo_base64} alt="Logo" style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '0.5rem' }} />
                      ) : null}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditLogoChange}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Partner Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={editingPartner.name}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Partner Type</label>
                    <select
                      name="type"
                      value={editingPartner.type}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    >
                      <option value="development">Development Partner</option>
                      <option value="environmental">Environmental Partner</option>
                      <option value="corporate">Corporate Partner</option>
                      <option value="ngo">NGO Partner</option>
                      <option value="government">Government Partner</option>
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Status</label>
                    <select
                      name="status"
                      value={editingPartner.status}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Since Year</label>
                    <input
                      type="text"
                      name="since"
                      value={editingPartner.since}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Description</label>
                    <textarea
                      name="description"
                      value={editingPartner.description || ''}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '80px' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Website</label>
                    <input
                      type="url"
                      name="website"
                      value={editingPartner.website || ''}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Contact Person</label>
                    <input
                      type="text"
                      name="contact_person"
                      value={editingPartner.contact_person || ''}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editingPartner.email || ''}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={editingPartner.phone || ''}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Projects Count</label>
                    <input
                      type="number"
                      name="projects_count"
                      value={editingPartner.projects_count}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Focus Areas (comma separated)</label>
                    <input
                      type="text"
                      value={editingPartner.focus_areas ? editingPartner.focus_areas.join(', ') : ''}
                      onChange={handleEditFocusAreasChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                      placeholder="Sustainable Development, Climate Action, Education"
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                    <button onClick={closeModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                    <button onClick={handleUpdatePartner} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Update Partner</button>
                  </div>
                </>
              ) : (
                // View Mode
                <>
                  {selectedPartner?.logo_base64 && (
                    <div style={{ marginBottom: '0.8rem', textAlign: 'center' }}>
                      <img src={selectedPartner.logo_base64} alt={selectedPartner.name} style={{ width: '120px', height: '120px', objectFit: 'contain' }} />
                    </div>
                  )}
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Partner Name</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      {selectedPartner?.name}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Partner Type</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      <span style={{
                        background: getTypeColor(selectedPartner?.type),
                        color: 'white',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        display: 'inline-block'
                      }}>{getTypeLabel(selectedPartner?.type)}</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Status</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      <span style={{
                        background: `${getStatusColor(selectedPartner?.status)}20`,
                        color: getStatusColor(selectedPartner?.status),
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        display: 'inline-block'
                      }}>{getStatusLabel(selectedPartner?.status)}</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Partner Since</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      {selectedPartner?.since}
                    </div>
                  </div>
                  
                  {selectedPartner?.description && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Description</label>
                      <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333', lineHeight: '1.5' }}>
                        {selectedPartner?.description}
                      </div>
                    </div>
                  )}
                  
                  {selectedPartner?.website && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Website</label>
                      <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                        <a href={selectedPartner?.website} target="_blank" rel="noopener noreferrer" style={{ color: '#0B3B2F', textDecoration: 'none' }}>
                          {selectedPartner?.website}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {selectedPartner?.contact_person && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Contact Person</label>
                      <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                        <i className="fas fa-user" style={{ marginRight: '0.5rem', color: '#0B3B2F' }}></i>
                        {selectedPartner?.contact_person}
                      </div>
                    </div>
                  )}
                  
                  {selectedPartner?.email && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Email</label>
                      <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                        <i className="fas fa-envelope" style={{ marginRight: '0.5rem', color: '#0B3B2F' }}></i>
                        {selectedPartner?.email}
                      </div>
                    </div>
                  )}
                  
                  {selectedPartner?.phone && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Phone</label>
                      <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                        <i className="fas fa-phone" style={{ marginRight: '0.5rem', color: '#0B3B2F' }}></i>
                        {selectedPartner?.phone}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Projects</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      <i className="fas fa-project-diagram" style={{ marginRight: '0.5rem', color: '#0B3B2F' }}></i>
                      {selectedPartner?.projects_count || 0} projects
                    </div>
                  </div>
                  
                  {selectedPartner?.focus_areas && selectedPartner.focus_areas.length > 0 && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Focus Areas</label>
                      <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                        {selectedPartner.focus_areas.map((area, i) => (
                          <span key={i} style={{ display: 'inline-block', background: '#e8f5e9', color: '#0B3B2F', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', margin: '0.2rem' }}>
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                    <button onClick={closeModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Close</button>
                    <button onClick={() => openEditModal(selectedPartner)} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Edit Partner</button>
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
                <i className="fas fa-handshake" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.3rem' }}>Add New Partner</h2>
            </div>
            
            <div style={{ 
              padding: '1.2rem', 
              overflowY: 'auto', 
              flex: 1,
              maxHeight: 'calc(90vh - 140px)'
            }}>
              {/* Partner Logo */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Partner Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
                {logoPreview && (
                  <img src={logoPreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'contain', marginTop: '0.5rem' }} />
                )}
              </div>

              {/* Partner Name */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Partner Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newPartner.name}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Enter partner name"
                />
              </div>
              
              {/* Partner Type */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Partner Type</label>
                <select
                  name="type"
                  value={newPartner.type}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                >
                  <option value="development">Development Partner</option>
                  <option value="environmental">Environmental Partner</option>
                  <option value="corporate">Corporate Partner</option>
                  <option value="ngo">NGO Partner</option>
                  <option value="government">Government Partner</option>
                </select>
              </div>
              
              {/* Status */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Status</label>
                <select
                  name="status"
                  value={newPartner.status}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              {/* Since Year */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Since Year</label>
                <input
                  type="text"
                  name="since"
                  value={newPartner.since}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Year"
                />
              </div>
              
              {/* Description */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Description</label>
                <textarea
                  name="description"
                  value={newPartner.description}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '80px' }}
                  placeholder="Partner description"
                />
              </div>
              
              {/* Website */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Website</label>
                <input
                  type="url"
                  name="website"
                  value={newPartner.website}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Website URL"
                />
              </div>
              
              {/* Contact Person */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Contact Person</label>
                <input
                  type="text"
                  name="contact_person"
                  value={newPartner.contact_person}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Contact person name"
                />
              </div>
              
              {/* Email */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={newPartner.email}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Email address"
                />
              </div>
              
              {/* Phone */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={newPartner.phone}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Phone number"
                />
              </div>
              
              {/* Projects Count */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Projects Count</label>
                <input
                  type="number"
                  name="projects_count"
                  value={newPartner.projects_count}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Number of projects"
                />
              </div>
              
              {/* Focus Areas */}
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Focus Areas (comma separated)</label>
                <input
                  type="text"
                  value={newPartner.focus_areas.join(', ')}
                  onChange={handleFocusAreasChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Sustainable Development, Climate Action, Education"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                <button onClick={closeAddModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                <button onClick={handleAddPartner} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Add Partner</button>
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

export default AdminPartners;