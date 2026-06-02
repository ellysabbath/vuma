import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ProgramDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchProgram();
  }, [id]);

  const fetchProgram = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://vuma.pythonanywhere.com/api/programs/${id}/`);
      const data = await response.json();
      if (data.success) {
        setProgram(data.data);
      } else {
        setError(data.error || 'Program not found');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://vuma.pythonanywhere.com/api/programs/${program.id}/`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Program deleted successfully!');
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/admin/programs');
        }, 2000);
      } else {
        alert(data.error || 'Failed to delete program');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const openEditModal = () => {
    setEditingProgram({ ...program });
    setShowEditModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingProgram(null);
    document.body.style.overflow = 'unset';
  };

  const handleEditChange = (e) => {
    setEditingProgram({
      ...editingProgram,
      [e.target.name]: e.target.value
    });
  };

  const handleEditFeaturesChange = (e) => {
    const featuresArray = e.target.value.split(',').map(s => s.trim());
    setEditingProgram({
      ...editingProgram,
      features: featuresArray
    });
  };

  const handleEditOutcomesChange = (e) => {
    const outcomesArray = e.target.value.split(',').map(s => s.trim());
    setEditingProgram({
      ...editingProgram,
      outcomes: outcomesArray
    });
  };

  const handleUpdateProgram = async () => {
    if (!editingProgram.title) {
      alert('Please fill in program title');
      return;
    }
    
    try {
      const response = await fetch(`https://vuma.pythonanywhere.com/api/programs/${editingProgram.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProgram),
      });
      
      const data = await response.json();
      if (data.success) {
        setProgram(editingProgram);
        setSuccessMessage('Program updated successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeEditModal();
      } else {
        alert(data.error || 'Failed to update program');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/admin/programs');
  };

  const iconOptions = [
    { value: 'fas fa-lightbulb', label: 'Lightbulb' },
    { value: 'fas fa-leaf', label: 'Leaf' },
    { value: 'fas fa-handshake', label: 'Handshake' },
    { value: 'fas fa-chalkboard-user', label: 'Chalkboard' },
    { value: 'fas fa-users', label: 'Users' },
    { value: 'fas fa-calendar-alt', label: 'Calendar' },
    { value: 'fas fa-chart-line', label: 'Chart Line' },
    { value: 'fas fa-award', label: 'Award' },
  ];

  const colorOptions = [
    { value: '#F9C74F', label: 'Gold' },
    { value: '#4caf50', label: 'Green' },
    { value: '#2196F3', label: 'Blue' },
    { value: '#9C27B0', label: 'Purple' },
    { value: '#FF9800', label: 'Orange' },
    { value: '#d32f2f', label: 'Red' },
    { value: '#00BCD4', label: 'Cyan' },
    { value: '#795548', label: 'Brown' },
  ];

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading program details...</p>
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
            <h2>Error Loading Program</h2>
            <p style={{ color: '#666', marginBottom: '1rem' }}>{error}</p>
            <button onClick={fetchProgram} style={{ background: '#F9C74F', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', marginRight: '0.5rem' }}>
              Try Again
            </button>
            <div onClick={handleBack} style={{ display: 'inline-block', cursor: 'pointer' }}>
              <span style={{ color: '#0B3B2F', fontWeight: 600 }}>Back to Programs</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-chalkboard-user" style={{ fontSize: '4rem', color: '#d32f2f', marginBottom: '1rem' }}></i>
            <h2>Program Not Found</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>The program you're looking for doesn't exist or has been removed.</p>
            <div onClick={handleBack} style={{ display: 'inline-block', cursor: 'pointer' }}>
              <i className="fas fa-arrow-left" style={{ fontSize: '1.2rem', color: '#0B3B2F', marginRight: '0.5rem' }}></i>
              <span style={{ color: '#0B3B2F', fontWeight: 600 }}>Back to Programs</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
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
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={handleBack}></i>
            <h1 style={{ fontSize: '1.8rem' }}>Program Details</h1>
          </div>
          <p>View complete information about {program.title}</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div data-aos="fade-up" style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
          <div style={{ background: `linear-gradient(135deg, ${program.color || '#0B3B2F'}, ${program.color || '#1a5c48'}dd)`, padding: '2rem', textAlign: 'center', position: 'relative' }}>
            <div style={{ width: '120px', height: '120px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white' }}>
              <i className={program.icon || 'fas fa-chalkboard-user'} style={{ fontSize: '3.5rem', color: '#0B3B2F' }}></i>
            </div>
            <h2 style={{ marginTop: '1rem', marginBottom: '0.3rem', fontSize: '1.8rem' }}>{program.title}</h2>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                background: program.color || '#0B3B2F',
                color: 'white',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                Featured Program
              </span>
            </div>
          </div>
          
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-info-circle"></i> Program Information
                </h3>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Program Title</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{program.title}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Duration</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{program.duration}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Eligibility</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{program.eligibility}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Certification</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{program.certification}</p>
                </div>
              </div>
              
              <div>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-chart-line"></i> Program Impact
                </h3>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Description</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{program.description}</p>
                </div>
                {program.full_description && (
                  <div style={{ marginBottom: '0.8rem' }}>
                    <strong style={{ color: '#666', fontSize: '0.85rem' }}>Full Description</strong>
                    <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{program.full_description}</p>
                  </div>
                )}
              </div>
            </div>

            {program.features && program.features.length > 0 && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-list-check"></i> Program Features
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {program.features.map((feature, index) => (
                    <span key={index} style={{
                      background: '#e8f5e9',
                      color: '#0B3B2F',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '15px',
                      fontSize: '0.85rem',
                      fontWeight: 500
                    }}>
                      <i className="fas fa-check-circle" style={{ marginRight: '0.3rem', fontSize: '0.7rem', color: '#4caf50' }}></i>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {program.outcomes && program.outcomes.length > 0 && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-trophy"></i> Key Outcomes
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {program.outcomes.map((outcome, index) => (
                    <span key={index} style={{
                      background: '#e3f2fd',
                      color: '#1976D2',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '15px',
                      fontSize: '0.85rem',
                      fontWeight: 500
                    }}>
                      <i className="fas fa-star" style={{ marginRight: '0.3rem', fontSize: '0.7rem', color: '#F9C74F' }}></i>
                      {outcome}
                    </span>
                  ))}
                </div>
              </div>
            )}

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

        <div data-aos="fade-up" data-aos-delay="100" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-clock" style={{ fontSize: '2rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
            <h3 style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Duration</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B3B2F' }}>{program.duration}</p>
          </div>
          
          <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-certificate" style={{ fontSize: '2rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
            <h3 style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Certification</h3>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0B3B2F' }}>{program.certification}</p>
          </div>
          
          <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-users" style={{ fontSize: '2rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
            <h3 style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Eligibility</h3>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0B3B2F' }}>{program.eligibility}</p>
          </div>
        </div>
      </div>

      {showEditModal && editingProgram && (
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
                <i className="fas fa-edit" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.3rem' }}>Edit Program</h2>
              <p style={{ color: '#F9C74F', fontSize: '0.9rem', marginTop: '0.3rem' }}>Update program information</p>
            </div>
            
            <div style={{ 
              padding: '1.2rem', 
              overflowY: 'auto', 
              flex: 1,
              maxHeight: 'calc(90vh - 140px)'
            }}>
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Program Title *</label>
                <input
                  type="text"
                  name="title"
                  value={editingProgram.title}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Icon</label>
                <select
                  name="icon"
                  value={editingProgram.icon}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                >
                  {iconOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Color</label>
                <select
                  name="color"
                  value={editingProgram.color}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                >
                  {colorOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={editingProgram.duration}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Eligibility</label>
                <input
                  type="text"
                  name="eligibility"
                  value={editingProgram.eligibility}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Certification</label>
                <input
                  type="text"
                  name="certification"
                  value={editingProgram.certification}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Short Description</label>
                <textarea
                  name="description"
                  value={editingProgram.description}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '60px' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Full Description</label>
                <textarea
                  name="full_description"
                  value={editingProgram.full_description}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '100px' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Features (comma separated)</label>
                <input
                  type="text"
                  value={editingProgram.features ? editingProgram.features.join(', ') : ''}
                  onChange={handleEditFeaturesChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Outcomes (comma separated)</label>
                <input
                  type="text"
                  value={editingProgram.outcomes ? editingProgram.outcomes.join(', ') : ''}
                  onChange={handleEditOutcomesChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                <div onClick={closeEditModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', textAlign: 'center' }}>
                  Cancel
                </div>
                <div onClick={handleUpdateProgram} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', textAlign: 'center' }}>
                  Update Program
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{ background: 'white', borderRadius: '20px', maxWidth: '400px', width: '100%', padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', margin: '0 auto', borderRadius: '50%', background: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '1.5rem', color: '#d32f2f' }}></i>
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Delete Program</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Are you sure you want to delete "{program.title}"? This action cannot be undone.</p>
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

export default ProgramDetails;