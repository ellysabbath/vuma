import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import logo from '../assets/vuma.png';

const Report = () => {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [reportType, setReportType] = useState('annual');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    reportTitle: '',
    reportType: 'annual',
    year: new Date().getFullYear(),
    description: '',
    author: '',
    file: null
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    window.scrollTo(0, 0);
  }, []);

  const annualReports = [
    { year: '2026', title: 'Annual Impact Report 2026', status: 'Latest', icon: 'fas fa-chart-line' },
    { year: '2025', title: 'Annual Impact Report 2025', status: 'Available', icon: 'fas fa-chart-line' },
    { year: '2024', title: 'Annual Impact Report 2024', status: 'Available', icon: 'fas fa-chart-line' },
    { year: '2023', title: 'Annual Impact Report 2023', status: 'Archived', icon: 'fas fa-archive' }
  ];

  const projectReports = [
    { name: 'Solar-Powered Water Pump', location: 'Rural Areas', impact: '500+ households', status: 'Completed' },
    { name: 'Youth Leadership Academy', location: 'Dar es Salaam', impact: '200+ youth trained', status: 'Ongoing' },
    { name: 'Plastic Upcycling Hub', location: 'Arusha', impact: '10 tons recycled', status: 'Completed' },
    { name: 'Tree Planting Initiative', location: 'Nationwide', impact: '18,750 trees', status: 'Ongoing' }
  ];

  const handleDownload = (reportTitle) => {
    alert(`Downloading: ${reportTitle}\n\nThis feature will be available soon.`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowCreateForm(false);
      alert(`Report "${formData.reportTitle}" has been created successfully!`);
      // Reset form
      setFormData({
        reportTitle: '',
        reportType: 'annual',
        year: new Date().getFullYear(),
        description: '',
        author: '',
        file: null
      });
    }, 1500);
  };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 data-aos="fade-up" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginBottom: '1rem' }}>
            Annual Reports & Impact Data
          </h1>
          <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', opacity: 0.9 }}>
            Transparency, Accountability, and Measurable Impact
          </p>
        </div>
      </div>

      {/* Key Impact Numbers */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            flex: 1
          }}>
            {[
              { value: '10,000+', label: 'Youth Reached', icon: 'fas fa-users' },
              { value: '50+', label: 'Projects Completed', icon: 'fas fa-project-diagram' },
              { value: '20+', label: 'Community Partners', icon: 'fas fa-handshake' },
              { value: '18,750', label: 'Trees Planted', icon: 'fas fa-tree' }
            ].map((stat, idx) => (
              <div key={idx} data-aos="zoom-in" data-aos-delay={idx * 100} style={{
                background: 'white',
                borderRadius: '20px',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <i className={stat.icon} style={{ fontSize: '2rem', color: '#F9C74F', marginBottom: '0.5rem' }}></i>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0B3B2F' }}>{stat.value}</div>
                <div style={{ color: '#666', fontSize: '0.85rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Create Report Button */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="create-report-btn"
            style={{
              background: '#F9C74F',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '50px',
              color: '#0B3B2F',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 5px 20px rgba(249,199,79,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <i className="fas fa-plus-circle"></i>
            Create Report
          </button>
        </div>

        {/* Create Report Form Modal */}
        {showCreateForm && (
          <div className="modal-overlay" onClick={() => setShowCreateForm(false)} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(5px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
              background: 'white',
              borderRadius: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              position: 'relative',
              animation: 'fadeInUp 0.3s ease'
            }}>
              <button
                onClick={() => setShowCreateForm(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#999',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#d32f2f'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
              >
                &times;
              </button>
              
              <h2 style={{ color: '#0B3B2F', marginBottom: '1.5rem' }}>Create New Report</h2>
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>
                    Report Title *
                  </label>
                  <input
                    type="text"
                    name="reportTitle"
                    value={formData.reportTitle}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter report title"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: '1px solid #ddd',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>
                    Report Type *
                  </label>
                  <select
                    name="reportType"
                    value={formData.reportType}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: '1px solid #ddd',
                      fontSize: '1rem',
                      outline: 'none',
                      backgroundColor: 'white'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  >
                    <option value="annual">Annual Report</option>
                    <option value="project">Project Report</option>
                    <option value="financial">Financial Report</option>
                  </select>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>
                    Year *
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    min="2020"
                    max="2030"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: '1px solid #ddd',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>
                    Author Name *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter author name"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: '1px solid #ddd',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Enter report description"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: '1px solid #ddd',
                      fontSize: '1rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#F9C74F'}
                  />
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 600 }}>
                    Upload File (PDF)
                  </label>
                  <input
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '12px',
                      border: '1px solid #ddd',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                  <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.3rem' }}>
                    Accepted formats: PDF, DOC, DOCX (Max 10MB)
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: '2px solid #ddd',
                      padding: '0.8rem',
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
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      flex: 2,
                      background: isSubmitting ? '#0B3B2F' : '#F9C74F',
                      border: 'none',
                      padding: '0.8rem',
                      borderRadius: '50px',
                      color: isSubmitting ? 'white' : '#0B3B2F',
                      fontWeight: 600,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 5px 20px rgba(249,199,79,0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-cloud-upload-alt"></i>
                        Create Report
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Report Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setReportType('annual')}
            className="filter-btn-report"
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '50px',
              border: 'none',
              background: reportType === 'annual' ? '#F9C74F' : '#eef2f0',
              color: reportType === 'annual' ? '#0B3B2F' : '#666',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Annual Reports
          </button>
          <button
            onClick={() => setReportType('projects')}
            className="filter-btn-report"
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '50px',
              border: 'none',
              background: reportType === 'projects' ? '#F9C74F' : '#eef2f0',
              color: reportType === 'projects' ? '#0B3B2F' : '#666',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Project Reports
          </button>
        </div>

        {/* Annual Reports */}
        {reportType === 'annual' && (
          <div data-aos="fade-up">
            <h2 style={{ color: '#0B3B2F', marginBottom: '1.5rem' }}>Annual Impact Reports</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {annualReports.map((report, idx) => (
                <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100} style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  border: report.status === 'Latest' ? '2px solid #F9C74F' : '1px solid #f0f0f0'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      background: 'rgba(249,199,79,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className={report.icon} style={{ fontSize: '1.5rem', color: '#F9C74F' }}></i>
                    </div>
                    <div>
                      <h3 style={{ color: '#0B3B2F' }}>{report.title}</h3>
                      {report.status === 'Latest' && (
                        <span style={{
                          fontSize: '0.7rem',
                          background: '#F9C74F',
                          color: '#0B3B2F',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '20px'
                        }}>
                          Latest
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(report.title)}
                    className="download-btn-report"
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: '2px solid #F9C74F',
                      padding: '0.6rem',
                      borderRadius: '50px',
                      color: '#0B3B2F',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F9C74F';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <i className="fas fa-download"></i>
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Reports */}
        {reportType === 'projects' && (
          <div data-aos="fade-up">
            <h2 style={{ color: '#0B3B2F', marginBottom: '1.5rem' }}>Project Impact Reports</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {projectReports.map((project, idx) => (
                <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100} style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>{project.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.3rem' }}>
                    <i className="fas fa-map-marker-alt" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                    {project.location}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                    <i className="fas fa-users" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                    Impact: {project.impact}
                  </p>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '0.7rem',
                    background: project.status === 'Completed' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(249,199,79,0.1)',
                    color: project.status === 'Completed' ? '#4caf50' : '#F9C74F',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    marginBottom: '1rem'
                  }}>
                    {project.status}
                  </span>
                  <button
                    onClick={() => handleDownload(`${project.name} Report`)}
                    className="download-btn-report"
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: '2px solid #F9C74F',
                      padding: '0.6rem',
                      borderRadius: '50px',
                      color: '#0B3B2F',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F9C74F';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <i className="fas fa-download"></i>
                    View Report
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Filter buttons styling */
        .filter-btn-report {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .filter-btn-report:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .filter-btn-report:active {
          transform: translateY(0);
        }
        
        /* Download buttons styling */
        .download-btn-report {
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        
        .download-btn-report::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .download-btn-report:active::before {
          width: 300px;
          height: 300px;
        }
        
        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .filter-btn-report {
            padding: 0.5rem 1rem !important;
            font-size: 0.85rem !important;
          }
          
          .download-btn-report {
            padding: 0.5rem !important;
            font-size: 0.85rem !important;
          }
          
          .download-btn-report i {
            font-size: 0.8rem !important;
          }
          
          .create-report-btn {
            padding: 0.6rem 1rem !important;
            font-size: 0.85rem !important;
          }
          
          .modal-content {
            padding: 1.5rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .filter-btn-report {
            padding: 0.4rem 0.8rem !important;
            font-size: 0.75rem !important;
          }
          
          .download-btn-report {
            padding: 0.45rem !important;
            font-size: 0.8rem !important;
          }
          
          .download-btn-report i {
            font-size: 0.75rem !important;
          }
          
          .create-report-btn {
            padding: 0.5rem 0.8rem !important;
            font-size: 0.8rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Report;