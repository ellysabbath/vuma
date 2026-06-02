import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const PartnerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editLogoPreview, setEditLogoPreview] = useState('');
  const [editLogoFile, setEditLogoFile] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchPartner();
  }, [id]);

  const fetchPartner = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://vuma.pythonanywhere.com/api/partners/${id}/`);
      const data = await response.json();
      if (data.success) {
        setPartner(data.data);
      } else {
        setError(data.error || 'Partner not found');
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

  const handleEditLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditLogoFile(file);
      const preview = URL.createObjectURL(file);
      setEditLogoPreview(preview);
      const base64 = await fileToBase64(file);
      setEditingPartner(prev => ({ ...prev, logo_base64: base64 }));
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://vuma.pythonanywhere.com/api/partners/${partner.id}/`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Partner deleted successfully!');
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/admin/partners');
        }, 2000);
      } else {
        alert(data.error || 'Failed to delete partner');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const openEditModal = () => {
    setEditingPartner({ ...partner });
    setShowEditModal(true);
    document.body.style.overflow = 'hidden';
    if (partner.logo_base64) {
      setEditLogoPreview(partner.logo_base64);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingPartner(null);
    setEditLogoFile(null);
    setEditLogoPreview('');
    document.body.style.overflow = 'unset';
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
        setPartner(editingPartner);
        setSuccessMessage('Partner updated successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeEditModal();
      } else {
        alert(data.error || 'Failed to update partner');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/admin/partners');
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
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading partner details...</p>
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
            <h2>Error Loading Partner</h2>
            <p style={{ color: '#666', marginBottom: '1rem' }}>{error}</p>
            <button onClick={fetchPartner} style={{ background: '#F9C74F', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', marginRight: '0.5rem' }}>
              Try Again
            </button>
            <div onClick={handleBack} style={{ display: 'inline-block', cursor: 'pointer' }}>
              <span style={{ color: '#0B3B2F', fontWeight: 600 }}>Back to Partners</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-handshake" style={{ fontSize: '4rem', color: '#d32f2f', marginBottom: '1rem' }}></i>
            <h2>Partner Not Found</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>The partner you're looking for doesn't exist or has been removed.</p>
            <div onClick={handleBack} style={{ display: 'inline-block', cursor: 'pointer' }}>
              <i className="fas fa-arrow-left" style={{ fontSize: '1.2rem', color: '#0B3B2F', marginRight: '0.5rem' }}></i>
              <span style={{ color: '#0B3B2F', fontWeight: 600 }}>Back to Partners</span>
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

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '2rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={handleBack}></i>
            <h1 style={{ fontSize: '1.8rem' }}>Partner Details</h1>
          </div>
          <p>View complete information about {partner.name}</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Partner Header Card */}
        <div data-aos="fade-up" style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '2rem', textAlign: 'center', position: 'relative' }}>
            {partner.logo_base64 ? (
              <img 
                src={partner.logo_base64} 
                alt={partner.name} 
                style={{ width: '120px', height: '120px', margin: '0 auto', borderRadius: '50%', objectFit: 'contain', border: '4px solid white', background: 'white' }}
              />
            ) : (
              <div style={{ width: '120px', height: '120px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white' }}>
                <i className="fas fa-handshake" style={{ fontSize: '3.5rem', color: '#0B3B2F' }}></i>
              </div>
            )}
            <h2 style={{ marginTop: '1rem', marginBottom: '0.3rem', fontSize: '1.8rem' }}>{partner.name}</h2>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                background: getTypeColor(partner.type),
                color: 'white',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>{getTypeLabel(partner.type)}</span>
              <span style={{
                background: getStatusColor(partner.status),
                color: 'white',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>{getStatusLabel(partner.status)}</span>
            </div>
          </div>
          
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-info-circle"></i> Organization Information
                </h3>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Organization Name</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{partner.name}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Partner Type</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{getTypeLabel(partner.type)}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Partner Since</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{partner.since}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Website</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>
                    {partner.website ? (
                      <a href={partner.website} target="_blank" rel="noopener noreferrer" style={{ color: '#0B3B2F', textDecoration: 'none' }}>
                        {partner.website}
                      </a>
                    ) : 'Not provided'}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-address-card"></i> Contact Information
                </h3>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Contact Person</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>
                    <i className="fas fa-user" style={{ marginRight: '0.5rem', color: '#0B3B2F' }}></i>
                    {partner.contact_person || 'Not specified'}
                  </p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Email Address</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>
                    <i className="fas fa-envelope" style={{ marginRight: '0.5rem', color: '#0B3B2F' }}></i>
                    {partner.email || 'Not provided'}
                  </p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Phone Number</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>
                    <i className="fas fa-phone" style={{ marginRight: '0.5rem', color: '#0B3B2F' }}></i>
                    {partner.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Total Projects</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem', fontWeight: 600, color: '#0B3B2F' }}>
                    <i className="fas fa-project-diagram" style={{ marginRight: '0.5rem' }}></i>
                    {partner.projects_count || 0} projects
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            {partner.description && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-align-left"></i> Description
                </h3>
                <p style={{ lineHeight: '1.6', color: '#555' }}>{partner.description}</p>
              </div>
            )}

            {/* Focus Areas Section */}
            {partner.focus_areas && partner.focus_areas.length > 0 && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-bullseye"></i> Focus Areas
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {partner.focus_areas.map((area, index) => (
                    <span key={index} style={{
                      background: '#e8f5e9',
                      color: '#0B3B2F',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '15px',
                      fontSize: '0.85rem',
                      fontWeight: 500
                    }}>{area}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Icons */}
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
              <div onClick={handleBack} style={{ cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <i className="fas fa-arrow-left" style={{ fontSize: '1.5rem', color: '#666' }}></i>
                <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.3rem' }}>Back</p>
              </div>
              
              <div onClick={openEditModal} style={{ cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <i className="fas fa-edit" style={{ fontSize: '1.5rem', color: '#2196F3' }}></i>
                <p style={{ fontSize: '0.7rem', color: '#2196F3', marginTop: '0.3rem' }}>Edit</p>
              </div>
              
              <div onClick={() => setShowDeleteConfirm(true)} style={{ cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <i className="fas fa-trash-alt" style={{ fontSize: '1.5rem', color: '#d32f2f' }}></i>
                <p style={{ fontSize: '0.7rem', color: '#d32f2f', marginTop: '0.3rem' }}>Delete</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div data-aos="fade-up" data-aos-delay="100" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-calendar-alt" style={{ fontSize: '2rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
            <h3 style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Partner Since</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B3B2F' }}>{partner.since}</p>
          </div>
          
          <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-project-diagram" style={{ fontSize: '2rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
            <h3 style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Total Projects</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B3B2F' }}>{partner.projects_count || 0}</p>
          </div>
          
          <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-handshake" style={{ fontSize: '2rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
            <h3 style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Partnership Status</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: getStatusColor(partner.status) }}>{getStatusLabel(partner.status)}</p>
          </div>
        </div>
      </div>

      {/* Edit Partner Modal */}
      {showEditModal && editingPartner && (
        <div className="modal-overlay" onClick={closeEditModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '28px', maxWidth: '500px', width: '100%',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <div onClick={closeEditModal} style={{
              position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.5)', border: 'none',
              width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '1.2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
            }}>
              <i className="fas fa-times"></i>
            </div>
            
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
              <h2 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.3rem' }}>Edit Partner</h2>
              <p style={{ color: '#F9C74F', fontSize: '0.9rem', marginTop: '0.3rem' }}>Update partner information</p>
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
                <div style={{ marginBottom: '0.5rem' }}>
                  {editLogoPreview ? (
                    <img src={editLogoPreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '0.5rem' }} />
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
                <div onClick={closeEditModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', textAlign: 'center' }}>
                  Cancel
                </div>
                <div onClick={handleUpdatePartner} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', textAlign: 'center' }}>
                  Update Partner
                </div>
              </div>
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
            <h3 style={{ marginBottom: '0.5rem' }}>Delete Partner</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Are you sure you want to delete "{partner.name}"? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '0.8rem', background: '#f0f0f0', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, textAlign: 'center' }}>Cancel</div>
              <div onClick={handleDelete} style={{ flex: 1, padding: '0.8rem', background: '#d32f2f', color: 'white', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, textAlign: 'center' }}>Delete</div>
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

export default PartnerDetails;