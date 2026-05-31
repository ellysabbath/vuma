import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Partners = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchPartners();
  }, [activeFilter]);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      let url = 'http://192.168.137.83:8000/api/partners/';
      if (activeFilter !== 'all') {
        url += `?status=${activeFilter}`;
      }
      const response = await fetch(url);
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

  const openModal = (partner) => {
    setSelectedPartner(partner);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPartner(null);
    document.body.style.overflow = 'unset';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#4caf50';
      case 'pending': return '#ff9800';
      case 'inactive': return '#d32f2f';
      default: return '#757575';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'active': return 'Active';
      case 'pending': return 'Pending';
      case 'inactive': return 'Inactive';
      default: return status;
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'development': return 'Development Partner';
      case 'environmental': return 'Environmental Partner';
      case 'corporate': return 'Corporate Partner';
      case 'ngo': return 'NGO Partner';
      case 'government': return 'Government Partner';
      default: return type;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'development': return '#2196F3';
      case 'environmental': return '#4caf50';
      case 'corporate': return '#9C27B0';
      case 'ngo': return '#FF9800';
      case 'government': return '#d32f2f';
      default: return '#757575';
    }
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
    <div style={{ paddingTop: '70px' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h1 data-aos="fade-up" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>
          Our Partners
        </h1>
        <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', maxWidth: '800px', margin: '0 auto' }}>
          Collaborating with organizations to create lasting impact
        </p>
      </div>

      {/* Filter Buttons */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2rem 0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {['all', 'active', 'pending'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '30px',
                border: 'none',
                background: activeFilter === filter ? '#F9C74F' : 'white',
                color: activeFilter === filter ? '#0B3B2F' : '#666',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activeFilter === filter ? '0 4px 15px rgba(249,199,79,0.3)' : '0 2px 5px rgba(0,0,0,0.05)'
              }}
            >
              {filter === 'all' ? 'All Partners' : filter === 'active' ? 'Active' : 'Pending'}
            </button>
          ))}
        </div>
      </div>

      {/* Partners Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2rem 4rem 2rem' }}>
        {partners.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <i className="fas fa-handshake" style={{ fontSize: '3rem', color: '#999' }}></i>
            <p style={{ marginTop: '1rem', color: '#666' }}>No partners found.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '2rem'
          }}>
            {partners.map((partner, idx) => (
              <div key={partner.id} data-aos="fade-up" data-aos-delay={idx * 100} style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => openModal(partner)}>
                {/* Logo */}
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  background: '#f9fbf7',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  {partner.logo_base64 ? (
                    <img 
                      src={partner.logo_base64} 
                      alt={partner.name}
                      style={{ maxWidth: '120px', maxHeight: '80px', objectFit: 'contain' }}
                    />
                  ) : (
                    <div style={{
                      width: '100px',
                      height: '100px',
                      background: 'linear-gradient(135deg, #F9C74F, #f8b500)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <i className="fas fa-handshake" style={{ fontSize: '2.5rem', color: 'white' }}></i>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ color: '#0B3B2F', margin: 0, fontSize: '1.2rem' }}>{partner.name}</h3>
                    <span style={{
                      background: getTypeColor(partner.type),
                      color: 'white',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '20px',
                      fontSize: '0.65rem',
                      fontWeight: 600
                    }}>
                      {getTypeLabel(partner.type)}
                    </span>
                  </div>
                  
                  <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    <i className="fas fa-calendar-alt" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                    Partner since {partner.since}
                  </p>
                  
                  <p style={{ color: '#888', fontSize: '0.75rem', marginBottom: '0.8rem', lineHeight: '1.5' }}>
                    {partner.description ? partner.description.substring(0, 100) + '...' : 'No description available'}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{
                      background: `${getStatusColor(partner.status)}20`,
                      color: getStatusColor(partner.status),
                      padding: '0.2rem 0.6rem',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: 600
                    }}>
                      {getStatusLabel(partner.status)}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      color: '#F9C74F',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      <i className="fas fa-project-diagram"></i>
                      {partner.projects_count} projects
                    </span>
                  </div>
                  
                  <div style={{
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    color: '#F9C74F',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    <i className="fas fa-eye"></i>
                    <span>Click to view details</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Partner Modal */}
      {showModal && selectedPartner && (
        <div className="modal-overlay" onClick={closeModal} style={{
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
          animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '28px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            position: 'relative',
            animation: 'slideInUp 0.3s ease'
          }}>
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                color: 'white',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
              padding: '2rem',
              textAlign: 'center'
            }}>
              {selectedPartner.logo_base64 ? (
                <img 
                  src={selectedPartner.logo_base64} 
                  alt={selectedPartner.name}
                  style={{ maxWidth: '120px', maxHeight: '80px', objectFit: 'contain', margin: '0 auto', background: 'white', padding: '0.5rem', borderRadius: '10px' }}
                />
              ) : (
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: '#F9C74F',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <i className="fas fa-handshake" style={{ fontSize: '2.5rem', color: '#0B3B2F' }}></i>
                </div>
              )}
              <h2 style={{ color: 'white', marginTop: '1rem', marginBottom: '0.3rem' }}>{selectedPartner.name}</h2>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  background: getTypeColor(selectedPartner.type),
                  color: 'white',
                  padding: '0.2rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 600
                }}>
                  {getTypeLabel(selectedPartner.type)}
                </span>
                <span style={{
                  background: `${getStatusColor(selectedPartner.status)}20`,
                  color: getStatusColor(selectedPartner.status),
                  padding: '0.2rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 600
                }}>
                  {getStatusLabel(selectedPartner.status)}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem' }}>
              {/* Basic Info */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
                background: '#f9fbf7',
                padding: '1rem',
                borderRadius: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.3rem' }}>
                    <i className="fas fa-calendar-alt" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                    Partner Since
                  </div>
                  <div style={{ fontWeight: 600, color: '#0B3B2F' }}>{selectedPartner.since}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.3rem' }}>
                    <i className="fas fa-project-diagram" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                    Projects
                  </div>
                  <div style={{ fontWeight: 600, color: '#0B3B2F' }}>{selectedPartner.projects_count} projects</div>
                </div>
                {selectedPartner.website && (
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.3rem' }}>
                      <i className="fas fa-globe" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                      Website
                    </div>
                    <a href={selectedPartner.website} target="_blank" rel="noopener noreferrer" style={{ color: '#F9C74F', textDecoration: 'none', fontWeight: 500 }}>
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedPartner.description && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1rem' }}>
                    <i className="fas fa-info-circle" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                    About
                  </h3>
                  <p style={{ color: '#555', lineHeight: '1.6', fontSize: '0.9rem' }}>{selectedPartner.description}</p>
                </div>
              )}

              {/* Focus Areas */}
              {selectedPartner.focus_areas && selectedPartner.focus_areas.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1rem' }}>
                    <i className="fas fa-bullseye" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                    Focus Areas
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedPartner.focus_areas.map((area, i) => (
                      <span key={i} style={{
                        background: '#e8f5e9',
                        color: '#0B3B2F',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem'
                      }}>
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {(selectedPartner.contact_person || selectedPartner.email || selectedPartner.phone) && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '1rem' }}>
                    <i className="fas fa-address-card" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                    Contact Information
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedPartner.contact_person && (
                      <p style={{ color: '#555', fontSize: '0.85rem' }}>
                        <i className="fas fa-user" style={{ marginRight: '0.5rem', color: '#F9C74F', width: '20px' }}></i>
                        {selectedPartner.contact_person}
                      </p>
                    )}
                    {selectedPartner.email && (
                      <p style={{ color: '#555', fontSize: '0.85rem' }}>
                        <i className="fas fa-envelope" style={{ marginRight: '0.5rem', color: '#F9C74F', width: '20px' }}></i>
                        {selectedPartner.email}
                      </p>
                    )}
                    {selectedPartner.phone && (
                      <p style={{ color: '#555', fontSize: '0.85rem' }}>
                        <i className="fas fa-phone" style={{ marginRight: '0.5rem', color: '#F9C74F', width: '20px' }}></i>
                        {selectedPartner.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={closeModal}
                style={{
                  width: '100%',
                  background: '#F9C74F',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '50px',
                  color: '#0B3B2F',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginTop: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(249,199,79,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Close
              </button>
            </div>
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
        
        .modal-content::-webkit-scrollbar {
          width: 6px;
        }
        
        .modal-content::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .modal-content::-webkit-scrollbar-thumb {
          background: #F9C74F;
          border-radius: 3px;
        }
        
        @media (max-width: 768px) {
          .modal-content {
            max-height: 90vh;
          }
        }
      `}</style>
    </div>
  );
};

export default Partners;