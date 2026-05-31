import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminProjects = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Environment',
    status: 'Planning',
    progress: 0,
    description: '',
    start_date: '',
    end_date: '',
    budget: '',
    location: ''
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchProjects();
  }, []);

  useEffect(() => {
    if (id && projects.length > 0) {
      const project = projects.find(p => p.id === parseInt(id));
      if (project) {
        setSelectedProject(project);
        setShowModal(true);
        setIsEditMode(false);
      }
    }
  }, [id, projects]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.137.83:8000/api/projects/');
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      } else {
        setError('Failed to load projects');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (project) => {
    setSelectedProject(project);
    setIsEditMode(false);
    setShowModal(true);
    navigate(`/admin/projects/${project.id}`, { replace: true });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
    setIsEditMode(false);
    setEditingProject(null);
    navigate('/admin/projects', { replace: true });
    document.body.style.overflow = 'unset';
  };

  const openEditModal = (project) => {
    setEditingProject({ ...project });
    setIsEditMode(true);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
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
      const response = await fetch(`http://192.168.137.83:8000/api/projects/${editingProject.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingProject),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchProjects();
        setSuccessMessage('Project updated successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeModal();
      } else {
        alert(data.error || 'Failed to update project');
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
    setNewProject({
      title: '',
      category: 'Environment',
      status: 'Planning',
      progress: 0,
      description: '',
      start_date: '',
      end_date: '',
      budget: '',
      location: ''
    });
    document.body.style.overflow = 'unset';
  };

  const handleAddProject = async () => {
    if (!newProject.title) {
      alert('Please fill in project title');
      return;
    }
    
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await fetch('http://192.168.137.83:8000/api/projects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProject),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchProjects();
        setSuccessMessage('Project added successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeAddModal();
      } else {
        alert(data.error || 'Failed to add project');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const token = localStorage.getItem('access_token');
      
      try {
        const response = await fetch(`http://192.168.137.83:8000/api/projects/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        if (data.success) {
          await fetchProjects();
          setSuccessMessage('Project deleted successfully!');
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          alert(data.error || 'Failed to delete project');
        }
      } catch (error) {
        alert('Network error. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    setNewProject({
      ...newProject,
      [e.target.name]: e.target.value
    });
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
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading projects...</p>
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
          <button onClick={fetchProjects} style={{ marginTop: '1rem', background: '#F9C74F', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer' }}>
            Try Again
          </button>
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

      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '2rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => navigate('/admin')}></i>
            <h1 style={{ fontSize: '1.8rem' }}>Projects Management</h1>
          </div>
          <p>Track and manage all ongoing and completed projects</p>
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
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Category</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Progress</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{ cursor: 'pointer', color: '#0B3B2F', fontWeight: 600 }} onClick={() => openModal(project)}>
                        {project.title}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{
                        background: getCategoryColor(project.category),
                        color: 'white',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem'
                      }}>{project.category}</span>
                    </td>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{
                        background: `${getStatusColor(project.status)}20`,
                        color: getStatusColor(project.status),
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem'
                      }}>{project.status}</span>
                    </td>
                    <td style={{ padding: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, background: '#e0e0e0', borderRadius: '10px', height: '6px', overflow: 'hidden' }}>
                          <div style={{ width: `${project.progress}%`, background: '#0B3B2F', height: '100%', borderRadius: '10px' }}></div>
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{project.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.8rem' }}>
                      <i className="fas fa-eye" style={{ color: '#0B3B2F', cursor: 'pointer', marginRight: '0.8rem' }} onClick={() => openModal(project)}></i>
                      <i className="fas fa-edit" style={{ color: '#2196F3', cursor: 'pointer', marginRight: '0.8rem' }} onClick={() => openEditModal(project)}></i>
                      <i className="fas fa-trash" style={{ color: '#d32f2f', cursor: 'pointer' }} onClick={() => handleDelete(project.id)}></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Project Details/Edit Modal */}
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
                <i className={isEditMode ? "fas fa-edit" : "fas fa-project-diagram"} style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.8rem', marginBottom: '0.3rem', fontSize: '1.3rem' }}>
                {isEditMode ? 'Edit Project' : 'Project Details'}
              </h2>
              {!isEditMode && <p style={{ color: '#F9C74F', fontSize: '0.9rem' }}>View complete project information</p>}
            </div>
            
            <div style={{ 
              padding: '1.2rem', 
              overflowY: 'auto', 
              flex: 1,
              maxHeight: 'calc(90vh - 140px)'
            }}>
              {isEditMode && editingProject ? (
                <>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Project Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={editingProject.title}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                      placeholder="Enter project title"
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
                      placeholder="Project description"
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
                      placeholder="Project budget"
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
                      placeholder="Project location"
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                    <button onClick={closeModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                    <button onClick={handleUpdateProject} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Update Project</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Project Title</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      {selectedProject?.title}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Category</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      <span style={{
                        background: getCategoryColor(selectedProject?.category),
                        color: 'white',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        display: 'inline-block'
                      }}>{selectedProject?.category}</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Status</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      <span style={{
                        background: `${getStatusColor(selectedProject?.status)}20`,
                        color: getStatusColor(selectedProject?.status),
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        display: 'inline-block'
                      }}>{selectedProject?.status}</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Progress</label>
                    <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, background: '#e0e0e0', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
                          <div style={{ width: `${selectedProject?.progress}%`, background: '#0B3B2F', height: '100%', borderRadius: '10px' }}></div>
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{selectedProject?.progress}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedProject?.description && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Description</label>
                      <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333', lineHeight: '1.5' }}>
                        {selectedProject?.description}
                      </div>
                    </div>
                  )}
                  
                  {selectedProject?.start_date && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Start Date</label>
                      <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                        {selectedProject?.start_date}
                      </div>
                    </div>
                  )}
                  
                  {selectedProject?.end_date && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>End Date</label>
                      <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                        {selectedProject?.end_date}
                      </div>
                    </div>
                  )}
                  
                  {selectedProject?.budget && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Budget</label>
                      <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                        {selectedProject?.budget}
                      </div>
                    </div>
                  )}
                  
                  {selectedProject?.location && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#0B3B2F' }}>Location</label>
                      <div style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.9rem', background: '#f9f9f9', color: '#333' }}>
                        {selectedProject?.location}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                    <button onClick={closeModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Close</button>
                    <button onClick={() => openEditModal(selectedProject)} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Edit Project</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
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
                <i className="fas fa-plus-circle" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.3rem' }}>Add New Project</h2>
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
                  value={newProject.title}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Enter project title"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Category</label>
                <select
                  name="category"
                  value={newProject.category}
                  onChange={handleInputChange}
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
                  value={newProject.status}
                  onChange={handleInputChange}
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
                  value={newProject.progress}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Description</label>
                <textarea
                  name="description"
                  value={newProject.description}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '80px' }}
                  placeholder="Project description"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={newProject.start_date}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={newProject.end_date}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Budget</label>
                <input
                  type="text"
                  name="budget"
                  value={newProject.budget}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Project budget"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={newProject.location}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Project location"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                <button onClick={closeAddModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                <button onClick={handleAddProject} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Add Project</button>
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

export default AdminProjects;