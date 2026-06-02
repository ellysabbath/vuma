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
    title: '',
    icon: 'fas fa-lightbulb',
    color: '#F9C74F',
    description: '',
    features: [],
    full_description: '',
    duration: '',
    eligibility: '',
    certification: '',
    outcomes: [],
    image_base64: ''
  });

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
    try {
      const response = await fetch('https://vuma.pythonanywhere.com/api/programs/');
      const data = await response.json();
      if (data.success) {
        setPrograms(data.data);
      } else {
        setError('Failed to load programs');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProgram = (programId) => {
    navigate(`/admin/programs/${programId}`);
  };

  const handleEditProgram = (program) => {
    navigate(`/admin/programs/edit/${program.id}`, { state: { program } });
  };

  const openAddModal = () => {
    setShowAddModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewProgram({
      title: '',
      icon: 'fas fa-lightbulb',
      color: '#F9C74F',
      description: '',
      features: [],
      full_description: '',
      duration: '',
      eligibility: '',
      certification: '',
      outcomes: [],
      image_base64: ''
    });
    document.body.style.overflow = 'unset';
  };

  const handleAddProgram = async () => {
    if (!newProgram.title) {
      alert('Please fill in program title');
      return;
    }
    
    try {
      const response = await fetch('https://vuma.pythonanywhere.com/api/programs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProgram),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchPrograms();
        setSuccessMessage('Program added successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeAddModal();
      } else {
        alert(data.error || 'Failed to add program');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        const response = await fetch(`https://vuma.pythonanywhere.com/api/programs/${id}/`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        if (data.success) {
          await fetchPrograms();
          setSuccessMessage('Program deleted successfully!');
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          alert(data.error || 'Failed to delete program');
        }
      } catch (error) {
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

  const handleFeaturesChange = (e) => {
    const featuresArray = e.target.value.split(',').map(s => s.trim());
    setNewProgram({
      ...newProgram,
      features: featuresArray
    });
  };

  const handleOutcomesChange = (e) => {
    const outcomesArray = e.target.value.split(',').map(s => s.trim());
    setNewProgram({
      ...newProgram,
      outcomes: outcomesArray
    });
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
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading programs...</p>
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
          <button onClick={fetchPrograms} style={{ marginTop: '1rem', background: '#F9C74F', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer' }}>
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
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => navigate('/admin')}></i>
            <h1 style={{ fontSize: '1.8rem' }}>Programs Management</h1>
          </div>
          <p>Manage all programs and initiatives</p>
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
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Icon</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Duration</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Certification</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map(program => (
                  <tr key={program.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.8rem' }}>
                      <span 
                        style={{ cursor: 'pointer', color: '#0B3B2F', fontWeight: 600 }} 
                        onClick={() => handleViewProgram(program.id)}
                      >
                        {program.title}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem' }}>
                      <i className={program.icon} style={{ fontSize: '1.2rem', color: program.color }}></i>
                    </td>
                    <td style={{ padding: '0.8rem' }}>{program.duration}</td>
                    <td style={{ padding: '0.8rem' }}>{program.certification}</td>
                    <td style={{ padding: '0.8rem' }}>
                      <i 
                        className="fas fa-eye" 
                        style={{ color: '#0B3B2F', cursor: 'pointer', marginRight: '0.8rem' }} 
                        onClick={() => handleViewProgram(program.id)}
                      ></i>
                      <i 
                        className="fas fa-edit" 
                        style={{ color: '#2196F3', cursor: 'pointer', marginRight: '0.8rem' }} 
                        onClick={() => handleEditProgram(program)}
                      ></i>
                      <i 
                        className="fas fa-trash" 
                        style={{ color: '#d32f2f', cursor: 'pointer' }} 
                        onClick={() => handleDelete(program.id)}
                      ></i>
                    </td>
                  </tr>
                ))}
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
              <h2 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.3rem' }}>Add New Program</h2>
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
                  value={newProgram.title}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Enter program title"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Icon</label>
                <select
                  name="icon"
                  value={newProgram.icon}
                  onChange={handleInputChange}
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
                  value={newProgram.color}
                  onChange={handleInputChange}
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
                  value={newProgram.duration}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="e.g., 3 months"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Eligibility</label>
                <input
                  type="text"
                  name="eligibility"
                  value={newProgram.eligibility}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Eligibility criteria"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Certification</label>
                <input
                  type="text"
                  name="certification"
                  value={newProgram.certification}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Certification offered"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Short Description</label>
                <textarea
                  name="description"
                  value={newProgram.description}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '60px' }}
                  placeholder="Brief description"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Full Description</label>
                <textarea
                  name="full_description"
                  value={newProgram.full_description}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '100px' }}
                  placeholder="Detailed description"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Features (comma separated)</label>
                <input
                  type="text"
                  value={newProgram.features.join(', ')}
                  onChange={handleFeaturesChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Leadership Training, Mentorship, Networking"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Outcomes (comma separated)</label>
                <input
                  type="text"
                  value={newProgram.outcomes.join(', ')}
                  onChange={handleOutcomesChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="Enhanced leadership, Career advancement"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                <button onClick={closeAddModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                <button onClick={handleAddProgram} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Add Program</button>
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