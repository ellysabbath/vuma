import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const PubDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchPublication();
  }, [id]);

  const fetchPublication = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/publications/${id}/`);
      const data = await response.json();
      
      if (data.success) {
        setPublication(data.data);
      } else {
        setError(data.error || 'Publication not found');
      }
    } catch (error) {
      console.error('Error fetching publication:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/publications');
  };

  const handleDownload = async () => {
    if (!publication.pdf_file) {
      alert('No file available for download.');
      return;
    }

    setDownloading(true);
    
    try {
      // Call the download endpoint
      const response = await fetch(`${API_BASE_URL}/publications/${publication.id}/download/`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        // Download the PDF file
        const link = document.createElement('a');
        link.href = publication.pdf_file;
        link.download = publication.pdf_file_name || 'publication.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Failed to download file. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading:', error);
      alert('Network error. Please try again.');
    } finally {
      setDownloading(false);
    }
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

  const getStatusLabel = (status) => {
    const labels = {
      'published': 'Published',
      'pending': 'Pending Review',
      'draft': 'Draft',
      'archived': 'Archived'
    };
    return labels[status] || status;
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

  const getStatusColor = (status) => {
    const colors = {
      'published': '#10b981',
      'pending': '#f59e0b',
      'draft': '#6b7280',
      'archived': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>Loading publication details...</p>
        </div>
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '4rem', color: '#d32f2f', marginBottom: '1rem' }}></i>
            <h2>Error Loading Publication</h2>
            <p style={{ color: '#666', marginBottom: '1rem' }}>{error || 'Publication not found'}</p>
            <button onClick={fetchPublication} style={{ background: '#F9C74F', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', marginRight: '0.5rem' }}>
              Try Again
            </button>
            <div onClick={handleBack} style={{ display: 'inline-block', cursor: 'pointer' }}>
              <span style={{ color: '#0B3B2F', fontWeight: 600 }}>Back to Publications</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '2rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={handleBack}></i>
            <h1 style={{ fontSize: '1.8rem' }}>Publication Details</h1>
          </div>
          <p>View complete information about "{publication.title}"</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div data-aos="fade-up" style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '2rem', textAlign: 'center', position: 'relative' }}>
            <div style={{ width: '80px', height: '80px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white' }}>
              <i className="fas fa-file-alt" style={{ fontSize: '2.5rem', color: '#0B3B2F' }}></i>
            </div>
            <h2 style={{ marginTop: '1rem', marginBottom: '0.3rem', fontSize: '1.5rem' }}>{publication.title}</h2>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                background: getTypeColor(publication.type),
                color: 'white',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>{getTypeLabel(publication.type)}</span>
              <span style={{
                background: getStatusColor(publication.status),
                color: 'white',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>{getStatusLabel(publication.status)}</span>
            </div>
          </div>
          
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-info-circle"></i> Publication Information
                </h3>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Title</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{publication.title}</p>
                </div>
                {publication.author_publisher && (
                  <div style={{ marginBottom: '0.8rem' }}>
                    <strong style={{ color: '#666', fontSize: '0.85rem' }}>Author/Publisher</strong>
                    <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{publication.author_publisher}</p>
                  </div>
                )}
                {publication.published_date && (
                  <div style={{ marginBottom: '0.8rem' }}>
                    <strong style={{ color: '#666', fontSize: '0.85rem' }}>Published Date</strong>
                    <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>
                      {new Date(publication.published_date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-tags"></i> Type & Status
                </h3>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Type</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{getTypeLabel(publication.type)}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Status</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{getStatusLabel(publication.status)}</p>
                </div>
              </div>
            </div>

            {/* Short Description */}
            {publication.short_description && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-align-left"></i> Short Description
                </h3>
                <p style={{ lineHeight: '1.6', color: '#555' }}>{publication.short_description}</p>
              </div>
            )}

            {/* More Description */}
            {publication.more_description && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-file-alt"></i> More Description
                </h3>
                <p style={{ lineHeight: '1.6', color: '#555' }}>{publication.more_description}</p>
              </div>
            )}

            {/* File Download Section */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
              <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-paperclip"></i> Attached File
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {publication.pdf_file ? (
                  <>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: '#f1f5f9',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <i className="fas fa-file-pdf" style={{ fontSize: '1.2rem', color: '#ef4444' }}></i>
                      <span style={{ fontSize: '0.85rem', color: '#0B3B2F' }}>
                        {publication.pdf_file_name || 'document.pdf'}
                      </span>
                    </div>
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      style={{
                        padding: '0.6rem 1.5rem',
                        background: downloading ? '#94a3b8' : '#0B3B2F',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: downloading ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(11, 59, 47, 0.2)',
                        opacity: downloading ? 0.7 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!downloading) {
                          e.currentTarget.style.background = '#1a5c48';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(11, 59, 47, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!downloading) {
                          e.currentTarget.style.background = '#0B3B2F';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(11, 59, 47, 0.2)';
                        }
                      }}
                    >
                      {downloading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-download"></i>
                          Download
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <div style={{
                    padding: '0.5rem 1rem',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '2px dashed #e2e8f0',
                    color: '#64748b',
                    fontSize: '0.85rem'
                  }}>
                    <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
                    No file attached
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'flex-end', 
              marginTop: '2rem', 
              paddingTop: '1rem', 
              borderTop: '1px solid #e0e0e0',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handleBack}
                style={{
                  padding: '0.8rem 1.5rem',
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e0e0e0';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f0f0f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <i className="fas fa-arrow-left"></i>
                Back
              </button>
              
              {publication.pdf_file && (
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  style={{
                    padding: '0.8rem 2rem',
                    background: downloading ? '#94a3b8' : '#0B3B2F',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: downloading ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(11, 59, 47, 0.3)',
                    opacity: downloading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!downloading) {
                      e.currentTarget.style.background = '#1a5c48';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!downloading) {
                      e.currentTarget.style.background = '#0B3B2F';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {downloading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-download"></i>
                      Download PDF
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
        
        button:disabled {
          cursor: not-allowed !important;
        }
      `}</style>
    </div>
  );
};

export default PubDetails;