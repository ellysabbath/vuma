import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://vuma.pythonanywhere.com/api/projects/${id}/`);
      const data = await response.json();
      if (data.success) {
        setProject(data.data);
      } else {
        setError(data.error || 'Project not found');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`https://vuma.pythonanywhere.com/api/projects/${project.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Project deleted successfully!');
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/admin/projects');
        }, 2000);
      } else {
        alert(data.error || 'Failed to delete project');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const openEditModal = () => {
    setEditingProject({ ...project });
    setShowEditModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingProject(null);
    document.body.style.overflow = 'unset';
  };

  const handleEditChange = (e) => {
    setEditingProject({
      ...editingProject,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProject = async () => {
    if (!editingProject.title) {
      alert('Please fill in project title');
      return;
    }
    
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await fetch(`https://vuma.pythonanywhere.com/api/projects/${editingProject.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingProject),
      });
      
      const data = await response.json();
      if (data.success) {
        setProject(editingProject);
        setSuccessMessage('Project updated successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeEditModal();
      } else {
        alert(data.error || 'Failed to update project');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/admin/projects');
  };

  const getStatusColor = (status) => {
    const colors = {
      'Ongoing': '#2196F3',
      'Completed': '#4caf50',
      'Planning': '#ff9800',
      'On Hold': '#d32f2f'
    };
    return colors[status] || '#757575';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Environment': '#4caf50',
      'Leadership': '#9C27B0',
      'Technology': '#00BCD4',
      'Education': '#FF9800'
    };
    return colors[category] || '#757575';
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading project details...</p>
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
            <h2>Error Loading Project</h2>
            <p style={{ color: '#666', marginBottom: '1rem' }}>{error}</p>
            <button onClick={fetchProject} style={{ background: '#F9C74F', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', marginRight: '0.5rem' }}>
              Try Again
            </button>
            <div onClick={handleBack} style={{ display: 'inline-block', cursor: 'pointer' }}>
              <span style={{ color: '#0B3B2F', fontWeight: 600 }}>Back to Projects</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-project-diagram" style={{ fontSize: '4rem', color: '#d32f2f', marginBottom: '1rem' }}></i>
            <h2>Project Not Found</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>The project you're looking for doesn't exist or has been removed.</p>
            <div onClick={handleBack} style={{ display: 'inline-block', cursor: 'pointer' }}>
              <i className="fas fa-arrow-left" style={{ fontSize: '1.2rem', color: '#0B3B2F', marginRight: '0.5rem' }}></i>
              <span style={{ color: '#0B3B2F', fontWeight: 600 }}>Back to Projects</span>
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
            <h1 style={{ fontSize: '1.8rem' }}>Project Details</h1>
          </div>
          <p>View complete information about {project.title}</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Project Header Card */}
        <div data-aos="fade-up" style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '2rem', textAlign: 'center', position: 'relative' }}>
            <div style={{ width: '120px', height: '120px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white' }}>
              <i className="fas fa-project-diagram" style={{ fontSize: '3.5rem', color: '#0B3B2F' }}></i>
            </div>
            <h2 style={{ marginTop: '1rem', marginBottom: '0.3rem', fontSize: '1.8rem' }}>{project.title}</h2>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                background: getCategoryColor(project.category),
                color: 'white',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>{project.category}</span>
              <span style={{
                background: getStatusColor(project.status),
                color: 'white',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>{project.status}</span>
            </div>
          </div>
          
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-info-circle"></i> Project Information
                </h3>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Project Title</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{project.title}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Category</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{project.category}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Location</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{project.location}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Budget</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem', fontWeight: 600, color: '#0B3B2F' }}>{project.budget}</p>
                </div>
              </div>
              
              <div>
                <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-calendar-alt"></i> Timeline
                </h3>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Start Date</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{project.start_date}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>End Date</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{project.end_date}</p>
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Progress</strong>
                  <div style={{ marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ flex: 1, background: '#e0e0e0', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
                      <div style={{ width: `${project.progress}%`, background: '#0B3B2F', height: '100%', borderRadius: '10px' }}></div>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{project.progress}%</span>
                  </div>
                </div>
                <div>
                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Status</strong>
                  <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{project.status}</p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            {project.description && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-align-left"></i> Description
                </h3>
                <p style={{ lineHeight: '1.6', color: '#555' }}>{project.description}</p>
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
            <i className="fas fa-chart-line" style={{ fontSize: '2rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
            <h3 style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Progress</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B3B2F' }}>{project.progress}%</p>
          </div>
          
          <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-calendar-alt" style={{ fontSize: '2rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
            <h3 style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Duration</h3>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0B3B2F' }}>
              {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'} - {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          
          <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-dollar-sign" style={{ fontSize: '2rem', color: '#0B3B2F', marginBottom: '0.5rem' }}></i>
            <h3 style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Budget</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B3B2F' }}>{project.budget || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Edit Project Modal */}
      {showEditModal && editingProject && (
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
                <i className="fas fa-project-diagram" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.3rem' }}>Edit Project</h2>
              <p style={{ color: '#F9C74F', fontSize: '0.9rem', marginTop: '0.3rem' }}>Update project information</p>
            </div>
            
            <div style={{ 
              padding: '1.2rem', 
              overflowY: 'auto', 
              flex: 1,
              maxHeight: 'calc(90vh - 140px)'
            }}>
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Project Title *</label>
                <input
                  type="text"
                  name="title"
                  value={editingProject.title}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Category</label>
                <select
                  name="category"
                  value={editingProject.category}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                >
                  <option value="Environment">Environment</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Technology">Technology</option>
                  <option value="Education">Education</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Status</label>
                <select
                  name="status"
                  value={editingProject.status}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Planning">Planning</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Progress (%)</label>
                <input
                  type="number"
                  name="progress"
                  value={editingProject.progress}
                  onChange={handleEditChange}
                  min="0"
                  max="100"
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Description</label>
                <textarea
                  name="description"
                  value={editingProject.description || ''}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '80px' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={editingProject.start_date || ''}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={editingProject.end_date || ''}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Budget</label>
                <input
                  type="text"
                  name="budget"
                  value={editingProject.budget || ''}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={editingProject.location || ''}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                <div onClick={closeEditModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', textAlign: 'center' }}>
                  Cancel
                </div>
                <div onClick={handleUpdateProject} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', textAlign: 'center' }}>
                  Update Project
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
            <h3 style={{ marginBottom: '0.5rem' }}>Delete Project</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Are you sure you want to delete "{project.title}"? This action cannot be undone.</p>
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

export default ProjectDetails;