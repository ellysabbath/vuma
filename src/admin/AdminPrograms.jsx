import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminPrograms = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [newProgram, setNewProgram] = useState({
    name: '',
    category: 'youth_leadership',
    description: '',
    icon: 'fas fa-lightbulb',
    color: '#F9C74F',
    order: 0,
    is_active: true,
    activities: []
  });

  const API_BASE_URL = 'http://localhost:8000/api';

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchPrograms();
  }, []);

  // When ID is in URL, navigate to program details page
  useEffect(() => {
    if (id && programs.length > 0) {
      const program = programs.find(p => p.id === parseInt(id));
      if (program) {
        navigate(`/admin/programs/${program.id}`, { replace: true });
      }
    }
  }, [id, programs, navigate]);

  const fetchPrograms = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/prog/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Handle different response formats
      if (Array.isArray(data)) {
        setPrograms(data);
      } else if (data.results) {
        setPrograms(data.results);
      } else if (data.data) {
        setPrograms(data.data);
      } else {
        setPrograms([]);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      setError('Network error. Please check if the server is running on http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProgram = (programId) => {
    navigate(`/admin/programs/${programId}`);
  };

  const handleEditProgram = (program) => {
    navigate(`/admin/programs/${program.id}`, { state: { program } });
  };

  const openAddModal = () => {
    setShowAddModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewProgram({
      name: '',
      category: 'youth_leadership',
      description: '',
      icon: 'fas fa-lightbulb',
      color: '#F9C74F',
      order: 0,
      is_active: true,
      activities: []
    });
    document.body.style.overflow = 'unset';
  };

  const handleAddProgram = async () => {
    if (!newProgram.name) {
      alert('Please fill in program name');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/prog/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProgram.name,
          category: newProgram.category,
          description: newProgram.description,
          icon: newProgram.icon,
          color: newProgram.color,
          order: newProgram.order,
          is_active: newProgram.is_active
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        await fetchPrograms();
        setSuccessMessage('Program added successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeAddModal();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to add program');
      }
    } catch (error) {
      console.error('Error adding program:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this program? This will also delete all associated activities and explanations.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/prog/${id}/`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await fetchPrograms();
          setSuccessMessage('Program deleted successfully!');
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Failed to delete program');
        }
      } catch (error) {
        console.error('Error deleting program:', error);
        alert('Network error. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    setNewProgram({
      ...newProgram,
      [e.target.name]: e.target.value
    });
  };

  const categoryOptions = [
    { value: 'youth_leadership', label: 'Youth Leadership' },
    { value: 'environmental_resilience', label: 'Environmental Resilience and Adaptation' },
    { value: 'youth_opportunity', label: 'Youth and Opportunity' },
  ];

  const iconOptions = [
    { value: 'fas fa-lightbulb', label: 'Lightbulb' },
    { value: 'fas fa-leaf', label: 'Leaf' },
    { value: 'fas fa-handshake', label: 'Handshake' },
    { value: 'fas fa-chalkboard-user', label: 'Chalkboard' },
    { value: 'fas fa-users', label: 'Users' },
    { value: 'fas fa-calendar-alt', label: 'Calendar' },
    { value: 'fas fa-chart-line', label: 'Chart Line' },
    { value: 'fas fa-award', label: 'Award' },
    { value: 'fas fa-user-graduate', label: 'Graduate' },
    { value: 'fas fa-tree', label: 'Tree' },
    { value: 'fas fa-briefcase', label: 'Briefcase' },
    { value: 'fas fa-rocket', label: 'Rocket' },
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
    { value: '#0B3B2F', label: 'Dark Green' },
    { value: '#2b7a5c', label: 'Teal' },
  ];

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading programs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#d32f2f' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>{error}</p>
          <div style={{ marginTop: '1rem', background: '#f5f5f5', padding: '1rem', borderRadius: '8px', textAlign: 'left' }}>
            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
              <strong>Troubleshooting tips:</strong>
            </p>
            <ul style={{ fontSize: '0.75rem', color: '#666', marginLeft: '1rem' }}>
              <li>Make sure Django server is running on port 8000</li>
              <li>Check if CORS is configured correctly</li>
              <li>Verify the API endpoints are accessible at: http://localhost:8000/api/prog/</li>
            </ul>
          </div>
          <button 
            onClick={fetchPrograms} 
            style={{ 
              marginTop: '1rem', 
              background: '#F9C74F', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '20px', 
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Try Again
          </button>
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
            <i 
              className="fas fa-arrow-left" 
              style={{ cursor: 'pointer', fontSize: '1.2rem' }} 
              onClick={() => navigate('/admin')}
            ></i>
            <h1 style={{ fontSize: '1.8rem' }}>Programs Management</h1>
          </div>
          <p>Manage all programs, activities, and their explanations</p>
        </div>
      </div>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ color: '#0B3B2F', fontSize: '1.3rem' }}>All Programs</h2>
              <p style={{ color: '#666', fontSize: '0.8rem' }}>Total: {programs.length} programs</p>
            </div>
            <button
              onClick={openAddModal}
              style={{
                background: '#0B3B2F',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <i className="fas fa-plus"></i> Add Program
            </button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>ID</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Program Name</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Category</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Icon</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Activities</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                      <i className="fas fa-folder-open" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                      No programs found. Click "Add Program" to create one.
                    </td>
                  </tr>
                ) : (
                  programs.map(program => (
                    <tr key={program.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '0.8rem', color: '#999' }}>{program.id}</td>
                      <td style={{ padding: '0.8rem' }}>
                        <span 
                          style={{ cursor: 'pointer', color: '#0B3B2F', fontWeight: 600 }} 
                          onClick={() => handleViewProgram(program.id)}
                        >
                          {program.name}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem', fontSize: '0.85rem' }}>
                        <span style={{
                          background: '#f0f0f0',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.7rem'
                        }}>
                          {program.category?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem' }}>
                        <i className={program.icon} style={{ fontSize: '1.2rem', color: program.color }}></i>
                      </td>
                      <td style={{ padding: '0.8rem' }}>
                        <span style={{
                          background: '#e8f5e9',
                          color: '#2e7d32',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: 600
                        }}>
                          {program.activity_count || program.activities?.length || 0} Activities
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem' }}>
                        <span style={{
                          background: program.is_active ? '#e8f5e9' : '#ffebee',
                          color: program.is_active ? '#2e7d32' : '#c62828',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.7rem'
                        }}>
                          {program.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem' }}>
                        <i 
                          className="fas fa-eye" 
                          style={{ color: '#0B3B2F', cursor: 'pointer', marginRight: '0.8rem' }} 
                          onClick={() => handleViewProgram(program.id)}
                          title="View Details"
                        ></i>
                        <i 
                          className="fas fa-edit" 
                          style={{ color: '#2196F3', cursor: 'pointer', marginRight: '0.8rem' }} 
                          onClick={() => handleEditProgram(program)}
                          title="Edit Program"
                        ></i>
                        <i 
                          className="fas fa-trash" 
                          style={{ color: '#d32f2f', cursor: 'pointer' }} 
                          onClick={() => handleDelete(program.id)}
                          title="Delete Program"
                        ></i>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Program Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeAddModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '28px', maxWidth: '550px', width: '100%',
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
              <h2 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.3rem' }}>Add New Program</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                Programs can have multiple activities with explanations
              </p>
            </div>
            
            <div style={{ 
              padding: '1.2rem', 
              overflowY: 'auto', 
              flex: 1,
              maxHeight: 'calc(90vh - 180px)'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Program Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newProgram.name}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="e.g., Youth Leadership"
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Category *</label>
                <select
                  name="category"
                  value={newProgram.category}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Description</label>
                <textarea
                  name="description"
                  value={newProgram.description}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '80px' }}
                  placeholder="Brief description of the program"
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Icon</label>
                <select
                  name="icon"
                  value={newProgram.icon}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                >
                  {iconOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      <i className={option.value}></i> {option.label}
                    </option>
                  ))}
                </select>
                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center' }}>
                  <i className={newProgram.icon} style={{ fontSize: '1.5rem', color: newProgram.color }}></i>
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#666' }}>Preview</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Theme Color</label>
                <select
                  name="color"
                  value={newProgram.color}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                >
                  {colorOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      <span style={{ display: 'inline-block', width: '12px', height: '12px', background: option.value, borderRadius: '2px', marginRight: '8px' }}></span>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Display Order</label>
                <input
                  type="number"
                  name="order"
                  value={newProgram.order}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="0"
                />
                <small style={{ fontSize: '0.7rem', color: '#999' }}>Programs with lower order appear first</small>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={newProgram.is_active}
                    onChange={(e) => setNewProgram({ ...newProgram, is_active: e.target.checked })}
                    style={{ width: 'auto' }}
                  />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Active</span>
                </label>
                <small style={{ fontSize: '0.7rem', color: '#999', display: 'block', marginLeft: '1.5rem' }}>
                  Inactive programs won't be visible on the frontend
                </small>
              </div>
              
              <div style={{ 
                background: '#e8f5e9', 
                padding: '0.8rem', 
                borderRadius: '8px', 
                marginTop: '1rem',
                fontSize: '0.8rem',
                color: '#2e7d32'
              }}>
                <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
                After creating the program, you can add activities and explanations from the program details page.
              </div>
              
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button onClick={closeAddModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                <button onClick={handleAddProgram} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Create Program</button>
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

export default AdminPrograms;