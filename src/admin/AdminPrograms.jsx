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

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  useEffect(() => {
    AOS.init({ duration: 500, once: true });
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (id && programs.length > 0) {
      const program = programs.find(p => p.id === parseInt(id));
      if (program) navigate(`/admin/programs/${program.id}`, { replace: true });
    }
  }, [id, programs, navigate]);

  const fetchPrograms = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/prog/`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) setPrograms(data);
      else if (data.results) setPrograms(data.results);
      else if (data.data) setPrograms(data.data);
      else setPrograms([]);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setError('Network error. Check if server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProgram = (programId) => navigate(`/admin/programs/${programId}`);
  const handleEditProgram = (program) => navigate(`/admin/programs/${program.id}`, { state: { program } });

  const openAddModal = () => { setShowAddModal(true); document.body.style.overflow = 'hidden'; };
  const closeAddModal = () => {
    setShowAddModal(false);
    setNewProgram({ name: '', category: 'youth_leadership', description: '', icon: 'fas fa-lightbulb', color: '#F9C74F', order: 0, is_active: true, activities: [] });
    document.body.style.overflow = 'unset';
  };

  const handleAddProgram = async () => {
    if (!newProgram.name) { alert('Please fill in program name'); return; }
    try {
      const response = await fetch(`${API_BASE_URL}/prog/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProgram.name, category: newProgram.category, description: newProgram.description,
          icon: newProgram.icon, color: newProgram.color, order: newProgram.order, is_active: newProgram.is_active
        }),
      });
      if (response.ok) { 
        await fetchPrograms(); 
        setSuccessMessage('Program added!'); 
        setShowSuccess(true); 
        setTimeout(() => setShowSuccess(false), 3000); 
        closeAddModal(); 
      } else { 
        const errorData = await response.json(); 
        alert(errorData.error || 'Failed to add'); 
      }
    } catch (error) { 
      alert('Network error. Please try again.'); 
    }
  };

  const handleDelete = async (programId) => {
    if (window.confirm('Delete this program? All associated activities will be deleted.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/prog/${programId}/`, { method: 'DELETE' });
        if (response.ok) { 
          await fetchPrograms(); 
          setSuccessMessage('Program deleted!'); 
          setShowSuccess(true); 
          setTimeout(() => setShowSuccess(false), 3000); 
        } else { 
          const errorData = await response.json(); 
          alert(errorData.error || 'Failed to delete'); 
        }
      } catch (error) { 
        alert('Network error. Please try again.'); 
      }
    }
  };

  const handleInputChange = (e) => { 
    setNewProgram({ ...newProgram, [e.target.name]: e.target.value }); 
  };

  const categoryOptions = [
    { value: 'youth_leadership', label: 'Youth Leadership' },
    { value: 'environmental_resilience', label: 'Environmental Resilience' },
    { value: 'youth_opportunity', label: 'Youth Opportunity' },
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
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.8rem' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '1rem' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '2rem', color: '#d32f2f' }}></i>
          <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.8rem' }}>{error}</p>
          <button onClick={fetchPrograms} style={{ marginTop: '0.5rem', background: '#F9C74F', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '15px', cursor: 'pointer', fontSize: '0.7rem' }}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .program-row:hover { background: rgba(249,199,79,0.05); }
        .modal-content { animation: slideInUp 0.3s ease; }
        .modal-overlay { animation: fadeIn 0.3s ease; }
        .modal-content::-webkit-scrollbar { width: 4px; }
        .modal-content::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 2px; }
        .modal-content::-webkit-scrollbar-thumb { background: #F9C74F; border-radius: 2px; }
        @media (max-width: 768px) { .modal-content { max-width: 95% !important; } }
      `}</style>

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
            borderRadius: '16px',
            padding: '1rem',
            textAlign: 'center',
            minWidth: '200px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: '#4caf50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.5rem'
            }}>
              <i className="fas fa-check" style={{ fontSize: '1.5rem', color: 'white' }}></i>
            </div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.2rem', color: '#0B3B2F' }}>Success!</h3>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1rem' }} onClick={() => navigate('/admin')} />
            <h1 style={{ fontSize: '1.3rem', margin: 0 }}><i className="fas fa-chalkboard-user" style={{ marginRight: '0.4rem', color: '#F9C74F' }}></i>Programs</h1>
          </div>
          <button onClick={openAddModal} style={{ background: '#F9C74F', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '20px', color: '#0B3B2F', fontWeight: 600, fontSize: '0.7rem', cursor: 'pointer' }}>
            <i className="fas fa-plus"></i> Add Program
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '0.8rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Category</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Icon</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Activities</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Status</th>
                <th style={{ textAlign: 'center', padding: '0.5rem', color: '#666' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                    <i className="fas fa-folder-open"></i> No programs found
                  </td>
                </tr>
              ) : (
                programs.map(program => (
                  <tr key={program.id} className="program-row" style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.5rem', color: '#999', fontSize: '0.7rem' }}>{program.id}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <span style={{ cursor: 'pointer', color: '#0B3B2F', fontWeight: 600, fontSize: '0.75rem' }} onClick={() => handleViewProgram(program.id)}>
                        {program.name}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <span style={{ background: '#f0f0f0', padding: '0.15rem 0.4rem', borderRadius: '10px', fontSize: '0.6rem' }}>
                        {program.category?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <i className={program.icon} style={{ fontSize: '1rem', color: program.color }}></i>
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.15rem 0.4rem', borderRadius: '10px', fontSize: '0.6rem', fontWeight: 600 }}>
                        {program.activity_count || program.activities?.length || 0} Activities
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <span style={{ background: program.is_active ? '#e8f5e9' : '#ffebee', color: program.is_active ? '#2e7d32' : '#c62828', padding: '0.15rem 0.4rem', borderRadius: '10px', fontSize: '0.6rem' }}>
                        {program.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                      <i className="fas fa-eye" style={{ color: '#0B3B2F', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.8rem' }} onClick={() => handleViewProgram(program.id)} title="View"></i>
                      <i className="fas fa-edit" style={{ color: '#2196F3', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.8rem' }} onClick={() => handleEditProgram(program)} title="Edit"></i>
                      <i className="fas fa-trash" style={{ color: '#d32f2f', cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => handleDelete(program.id)} title="Delete"></i>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Program Modal - Compact */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeAddModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', maxWidth: '450px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <button onClick={closeAddModal} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', color: 'white', zIndex: 10 }}>
              <i className="fas fa-times"></i>
            </button>
            
            <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '1rem', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-plus-circle" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1.1rem' }}>Add Program</h2>
            </div>
            
            <div style={{ padding: '1rem', overflowY: 'auto', flex: 1 }}>
              <input type="text" name="name" placeholder="Program Name *" value={newProgram.name} onChange={handleInputChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
              
              <select name="category" value={newProgram.category} onChange={handleInputChange} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }}>
                {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              
              <textarea name="description" placeholder="Description" value={newProgram.description} onChange={handleInputChange} rows="2" style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
              
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <select name="icon" value={newProgram.icon} onChange={handleInputChange} style={{ flex: 1, padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}>
                  {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <select name="color" value={newProgram.color} onChange={handleInputChange} style={{ flex: 1, padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}>
                  {colorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ flex: 1, background: '#f5f5f5', borderRadius: '6px', padding: '0.3rem', textAlign: 'center' }}>
                  <i className={newProgram.icon} style={{ fontSize: '1rem', color: newProgram.color }}></i>
                </div>
                <input type="number" name="order" placeholder="Order" value={newProgram.order} onChange={handleInputChange} style={{ width: '60px', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem' }}>
                  <input type="checkbox" checked={newProgram.is_active} onChange={(e) => setNewProgram({ ...newProgram, is_active: e.target.checked })} /> Active
                </label>
              </div>
              
              <div style={{ background: '#e8f5e9', padding: '0.5rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.7rem', color: '#2e7d32' }}>
                <i className="fas fa-info-circle"></i> After creating, add activities from details page.
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={closeAddModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.4rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleAddProgram} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.4rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPrograms;