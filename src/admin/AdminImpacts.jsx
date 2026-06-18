import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminImpacts = () => {
  const navigate = useNavigate();
  const [impacts, setImpacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingImpact, setEditingImpact] = useState(null);
  
  // Loading states for buttons
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Form state for create/update
  const [formData, setFormData] = useState({
    youth_reached_target: '',
    youth_reached_label: '',
    youth_reached_suffix: '',
    youth_reached_current: '',
    youth_reached_active: true,
    
    trees_planted_target: '',
    trees_planted_label: '',
    trees_planted_suffix: '',
    trees_planted_current: '',
    trees_planted_active: true,
    
    ideas_generated_target: '',
    ideas_generated_label: '',
    ideas_generated_suffix: '',
    ideas_generated_current: '',
    ideas_generated_active: true,
    
    volunteers_target: '',
    volunteers_label: '',
    volunteers_suffix: '',
    volunteers_current: '',
    volunteers_active: true,
  });

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  useEffect(() => {
    AOS.init({ duration: 500, once: true });
    fetchImpacts();
  }, []);

  // READ - Fetch all impacts
  const fetchImpacts = async () => {
    setIsRefreshing(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/impacts/`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setImpacts(data);
      } else if (data.results) {
        setImpacts(data.results);
      } else if (data.data) {
        setImpacts(data.data);
      } else {
        setImpacts([]);
      }
    } catch (error) {
      console.error('Error fetching impacts:', error);
      setError('Network error. Check if server is running.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Helper to get a single impact record
  const getImpactRecord = () => {
    return impacts.length > 0 ? impacts[0] : null;
  };

  // OPEN ADD MODAL
  const openAddModal = () => {
    setFormData({
      youth_reached_target: '',
      youth_reached_label: '',
      youth_reached_suffix: '',
      youth_reached_current: '',
      youth_reached_active: true,
      
      trees_planted_target: '',
      trees_planted_label: '',
      trees_planted_suffix: '',
      trees_planted_current: '',
      trees_planted_active: true,
      
      ideas_generated_target: '',
      ideas_generated_label: '',
      ideas_generated_suffix: '',
      ideas_generated_current: '',
      ideas_generated_active: true,
      
      volunteers_target: '',
      volunteers_label: '',
      volunteers_suffix: '',
      volunteers_current: '',
      volunteers_active: true,
    });
    setShowAddModal(true);
    document.body.style.overflow = 'hidden';
  };

  // OPEN EDIT MODAL
  const openEditModal = (impact) => {
    setEditingImpact(impact);
    setFormData({
      youth_reached_target: impact.youth_reached_target || '',
      youth_reached_label: impact.youth_reached_label || '',
      youth_reached_suffix: impact.youth_reached_suffix || '',
      youth_reached_current: impact.youth_reached_current || '',
      youth_reached_active: impact.youth_reached_active !== undefined ? impact.youth_reached_active : true,
      
      trees_planted_target: impact.trees_planted_target || '',
      trees_planted_label: impact.trees_planted_label || '',
      trees_planted_suffix: impact.trees_planted_suffix || '',
      trees_planted_current: impact.trees_planted_current || '',
      trees_planted_active: impact.trees_planted_active !== undefined ? impact.trees_planted_active : true,
      
      ideas_generated_target: impact.ideas_generated_target || '',
      ideas_generated_label: impact.ideas_generated_label || '',
      ideas_generated_suffix: impact.ideas_generated_suffix || '',
      ideas_generated_current: impact.ideas_generated_current || '',
      ideas_generated_active: impact.ideas_generated_active !== undefined ? impact.ideas_generated_active : true,
      
      volunteers_target: impact.volunteers_target || '',
      volunteers_label: impact.volunteers_label || '',
      volunteers_suffix: impact.volunteers_suffix || '',
      volunteers_current: impact.volunteers_current || '',
      volunteers_active: impact.volunteers_active !== undefined ? impact.volunteers_active : true,
    });
    setShowEditModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingImpact(null);
    document.body.style.overflow = 'unset';
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // CREATE - Add new impact
  const handleCreate = async () => {
    // Validate required fields
    if (!formData.youth_reached_label || !formData.youth_reached_target ||
        !formData.trees_planted_label || !formData.trees_planted_target ||
        !formData.ideas_generated_label || !formData.ideas_generated_target ||
        !formData.volunteers_label || !formData.volunteers_target) {
      alert('Please fill in all required fields (Label and Target for each impact)');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const payload = {
        youth_reached_target: parseInt(formData.youth_reached_target) || 0,
        youth_reached_label: formData.youth_reached_label,
        youth_reached_suffix: formData.youth_reached_suffix || '+',
        youth_reached_current: parseInt(formData.youth_reached_current) || 0,
        youth_reached_active: formData.youth_reached_active,
        
        trees_planted_target: parseInt(formData.trees_planted_target) || 0,
        trees_planted_label: formData.trees_planted_label,
        trees_planted_suffix: formData.trees_planted_suffix || '+',
        trees_planted_current: parseInt(formData.trees_planted_current) || 0,
        trees_planted_active: formData.trees_planted_active,
        
        ideas_generated_target: parseInt(formData.ideas_generated_target) || 0,
        ideas_generated_label: formData.ideas_generated_label,
        ideas_generated_suffix: formData.ideas_generated_suffix || '+',
        ideas_generated_current: parseInt(formData.ideas_generated_current) || 0,
        ideas_generated_active: formData.ideas_generated_active,
        
        volunteers_target: parseInt(formData.volunteers_target) || 0,
        volunteers_label: formData.volunteers_label,
        volunteers_suffix: formData.volunteers_suffix || '+',
        volunteers_current: parseInt(formData.volunteers_current) || 0,
        volunteers_active: formData.volunteers_active,
      };

      const response = await fetch(`${API_BASE_URL}/impacts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchImpacts();
        setSuccessMessage('Impact data created successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeModals();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create impact data');
      }
    } catch (error) {
      alert('Network error. Please try again.');
      console.error('Create error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // UPDATE - Edit impact
  const handleUpdate = async () => {
    if (!editingImpact) return;

    setIsUpdating(true);
    setError('');

    try {
      const payload = {
        youth_reached_target: parseInt(formData.youth_reached_target) || 0,
        youth_reached_label: formData.youth_reached_label,
        youth_reached_suffix: formData.youth_reached_suffix || '+',
        youth_reached_current: parseInt(formData.youth_reached_current) || 0,
        youth_reached_active: formData.youth_reached_active,
        
        trees_planted_target: parseInt(formData.trees_planted_target) || 0,
        trees_planted_label: formData.trees_planted_label,
        trees_planted_suffix: formData.trees_planted_suffix || '+',
        trees_planted_current: parseInt(formData.trees_planted_current) || 0,
        trees_planted_active: formData.trees_planted_active,
        
        ideas_generated_target: parseInt(formData.ideas_generated_target) || 0,
        ideas_generated_label: formData.ideas_generated_label,
        ideas_generated_suffix: formData.ideas_generated_suffix || '+',
        ideas_generated_current: parseInt(formData.ideas_generated_current) || 0,
        ideas_generated_active: formData.ideas_generated_active,
        
        volunteers_target: parseInt(formData.volunteers_target) || 0,
        volunteers_label: formData.volunteers_label,
        volunteers_suffix: formData.volunteers_suffix || '+',
        volunteers_current: parseInt(formData.volunteers_current) || 0,
        volunteers_active: formData.volunteers_active,
      };

      const response = await fetch(`${API_BASE_URL}/impacts/${editingImpact.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchImpacts();
        setSuccessMessage('Impact data updated successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeModals();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update impact data');
      }
    } catch (error) {
      alert('Network error. Please try again.');
      console.error('Update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // DELETE - Delete impact
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this impact data? This action cannot be undone.')) return;

    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/impacts/${id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchImpacts();
        setSuccessMessage('Impact data deleted successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete impact data');
      }
    } catch (error) {
      alert('Network error. Please try again.');
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // TOGGLE ACTIVE - Toggle individual impact status
  const handleToggleActive = async (impactId, field, currentValue) => {
    setIsToggling(true);
    setError('');

    try {
      const impact = getImpactRecord();
      if (!impact) return;

      const updatedImpact = {
        ...impact,
        [field]: !currentValue
      };

      const response = await fetch(`${API_BASE_URL}/impacts/${impactId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedImpact),
      });

      if (response.ok) {
        await fetchImpacts();
        setSuccessMessage(`${field.replace('_active', '').replace(/_/g, ' ')} status toggled!`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert('Failed to toggle status');
      }
    } catch (error) {
      alert('Network error. Please try again.');
      console.error('Toggle error:', error);
    } finally {
      setIsToggling(false);
    }
  };

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
          <button 
            onClick={fetchImpacts} 
            disabled={isRefreshing}
            style={{ 
              marginTop: '0.5rem', 
              background: '#F9C74F', 
              border: 'none', 
              padding: '0.3rem 0.8rem', 
              borderRadius: '15px', 
              cursor: isRefreshing ? 'not-allowed' : 'pointer', 
              fontSize: '0.7rem',
              opacity: isRefreshing ? 0.6 : 1
            }}
          >
            {isRefreshing ? <i className="fas fa-spinner fa-spin"></i> : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  const impact = getImpactRecord();

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .impact-row:hover { background: rgba(249,199,79,0.05); }
        .modal-content { animation: slideInUp 0.3s ease; }
        .modal-overlay { animation: fadeIn 0.3s ease; }
        .modal-content::-webkit-scrollbar { width: 4px; }
        .modal-content::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 2px; }
        .modal-content::-webkit-scrollbar-thumb { background: #F9C74F; border-radius: 2px; }
        @media (max-width: 768px) { .modal-content { max-width: 95% !important; } }
        .status-toggle {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .status-toggle:hover {
          transform: scale(1.05);
        }
        .btn-loading {
          animation: spin 1s linear infinite;
        }
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
            <h1 style={{ fontSize: '1.3rem', margin: 0 }}>
              <i className="fas fa-chart-bar" style={{ marginRight: '0.4rem', color: '#F9C74F' }}></i>
              Impact Statistics
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {!impact && (
              <button 
                onClick={openAddModal} 
                disabled={isCreating || isRefreshing}
                style={{ 
                  background: '#F9C74F', 
                  border: 'none', 
                  padding: '0.3rem 0.8rem', 
                  borderRadius: '20px', 
                  color: '#0B3B2F', 
                  fontWeight: 600, 
                  fontSize: '0.7rem', 
                  cursor: (isCreating || isRefreshing) ? 'not-allowed' : 'pointer',
                  opacity: (isCreating || isRefreshing) ? 0.6 : 1
                }}
              >
                {isCreating ? <i className="fas fa-spinner btn-loading"></i> : <i className="fas fa-plus"></i>}
                {isCreating ? ' Creating...' : ' Create Impacts'}
              </button>
            )}
            {impact && (
              <button 
                onClick={() => openEditModal(impact)} 
                disabled={isUpdating || isRefreshing}
                style={{ 
                  background: '#F9C74F', 
                  border: 'none', 
                  padding: '0.3rem 0.8rem', 
                  borderRadius: '20px', 
                  color: '#0B3B2F', 
                  fontWeight: 600, 
                  fontSize: '0.7rem', 
                  cursor: (isUpdating || isRefreshing) ? 'not-allowed' : 'pointer',
                  opacity: (isUpdating || isRefreshing) ? 0.6 : 1
                }}
              >
                {isUpdating ? <i className="fas fa-spinner btn-loading"></i> : <i className="fas fa-edit"></i>}
                {isUpdating ? ' Saving...' : ' Edit All'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        {!impact ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
          }}>
            <i className="fas fa-chart-bar" style={{ fontSize: '3rem', color: '#ddd' }}></i>
            <h3 style={{ marginTop: '1rem', color: '#666' }}>No Impact Data</h3>
            <p style={{ color: '#999', fontSize: '0.9rem' }}>Click "Create Impacts" to add impact statistics</p>
          </div>
        ) : (
          <>
            {/* Preview Cards */}
            <div style={{ 
              background: 'linear-gradient(120deg, #0a3b2e, #0c4d3a)',
              padding: '2rem',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ color: '#F9C74F', marginBottom: '1rem', fontSize: '1rem' }}>
                <i className="fas fa-eye"></i> Preview: Active Impacts
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '1.2rem'
              }}>
                {[
                  { key: 'youth_reached', label: impact.youth_reached_label, target: impact.youth_reached_target, suffix: impact.youth_reached_suffix, active: impact.youth_reached_active, color: '#F9C74F' },
                  { key: 'trees_planted', label: impact.trees_planted_label, target: impact.trees_planted_target, suffix: impact.trees_planted_suffix, active: impact.trees_planted_active, color: '#4CAF50' },
                  { key: 'ideas_generated', label: impact.ideas_generated_label, target: impact.ideas_generated_target, suffix: impact.ideas_generated_suffix, active: impact.ideas_generated_active, color: '#FF9800' },
                  { key: 'volunteers', label: impact.volunteers_label, target: impact.volunteers_target, suffix: impact.volunteers_suffix, active: impact.volunteers_active, color: '#2196F3' }
                ].filter(i => i.active).map((item) => (
                  <div key={item.key} style={{
                    flex: 1,
                    minWidth: 160,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: 32,
                    padding: '1.2rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#F9C74F' }}>
                      {item.target?.toLocaleString() || 0}{item.suffix || ''}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'white' }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                <i className="fas fa-info-circle"></i> Only active impacts are displayed
              </p>
            </div>

            {/* Impact Table */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '0.8rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>#</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Impact Type</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Label</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Target</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Suffix</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Current Value</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Status</th>
                    <th style={{ textAlign: 'center', padding: '0.5rem', color: '#666' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: 'youth_reached', label: 'Youth Reached', color: '#F9C74F', icon: 'fa-users' },
                    { key: 'trees_planted', label: 'Trees Planted', color: '#4CAF50', icon: 'fa-tree' },
                    { key: 'ideas_generated', label: 'Ideas Generated', color: '#FF9800', icon: 'fa-lightbulb' },
                    { key: 'volunteers', label: 'Active Volunteers', color: '#2196F3', icon: 'fa-handshake' }
                  ].map((item, index) => {
                    const target = impact[`${item.key}_target`];
                    const label = impact[`${item.key}_label`];
                    const suffix = impact[`${item.key}_suffix`];
                    const current = impact[`${item.key}_current`];
                    const active = impact[`${item.key}_active`];

                    return (
                      <tr key={item.key} className="impact-row" style={{ borderBottom: index < 3 ? '1px solid #f0f0f0' : 'none' }}>
                        <td style={{ padding: '0.5rem', color: '#999', fontSize: '0.7rem' }}>{index + 1}</td>
                        <td style={{ padding: '0.5rem', fontWeight: '600' }}>
                          <span style={{ color: item.color }}>●</span> {item.label}
                        </td>
                        <td style={{ padding: '0.5rem' }}>{label || '-'}</td>
                        <td style={{ padding: '0.5rem', fontWeight: '600' }}>{target?.toLocaleString() || 0}</td>
                        <td style={{ padding: '0.5rem' }}>{suffix || ''}</td>
                        <td style={{ padding: '0.5rem' }}>{current?.toLocaleString() || 0}</td>
                        <td style={{ padding: '0.5rem' }}>
                          <span 
                            className="status-toggle"
                            onClick={() => handleToggleActive(impact.id, `${item.key}_active`, active)}
                            style={{ 
                              background: active ? '#e8f5e9' : '#ffebee', 
                              color: active ? '#2e7d32' : '#c62828', 
                              padding: '0.15rem 0.4rem', 
                              borderRadius: '10px', 
                              fontSize: '0.6rem',
                              display: 'inline-block',
                              opacity: isToggling ? 0.6 : 1
                            }}
                          >
                            {isToggling ? <i className="fas fa-spinner btn-loading"></i> : (active ? 'Active' : 'Inactive')}
                          </span>
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                          <i 
                            className="fas fa-edit" 
                            style={{ 
                              color: '#2196F3', 
                              cursor: (isUpdating || isRefreshing) ? 'not-allowed' : 'pointer', 
                              marginRight: '0.5rem', 
                              fontSize: '0.8rem',
                              opacity: (isUpdating || isRefreshing) ? 0.5 : 1
                            }} 
                            onClick={() => !isUpdating && !isRefreshing && openEditModal(impact)} 
                            title="Edit All"
                          ></i>
                          <i 
                            className="fas fa-trash" 
                            style={{ 
                              color: '#d32f2f', 
                              cursor: (isDeleting || isRefreshing) ? 'not-allowed' : 'pointer', 
                              fontSize: '0.8rem',
                              opacity: (isDeleting || isRefreshing) ? 0.5 : 1
                            }} 
                            onClick={() => !isDeleting && !isRefreshing && handleDelete(impact.id)} 
                            title="Delete All"
                          ></i>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Stats Footer */}
            <div style={{ 
              marginTop: '1rem',
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              background: 'white',
              padding: '0.8rem 1rem',
              borderRadius: '12px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              fontSize: '0.7rem'
            }}>
              <div>
                <span style={{ color: '#666' }}>Total Impacts:</span>
                <strong style={{ marginLeft: '0.3rem' }}>4</strong>
              </div>
              <div>
                <span style={{ color: '#666' }}>Active:</span>
                <strong style={{ marginLeft: '0.3rem', color: '#2e7d32' }}>
                  {[
                    impact.youth_reached_active,
                    impact.trees_planted_active,
                    impact.ideas_generated_active,
                    impact.volunteers_active
                  ].filter(Boolean).length}
                </strong>
              </div>
              <div>
                <span style={{ color: '#666' }}>Inactive:</span>
                <strong style={{ marginLeft: '0.3rem', color: '#c62828' }}>
                  {[
                    impact.youth_reached_active,
                    impact.trees_planted_active,
                    impact.ideas_generated_active,
                    impact.volunteers_active
                  ].filter(a => !a).length}
                </strong>
              </div>
              <div>
                <span style={{ color: '#666' }}>Total Target:</span>
                <strong style={{ marginLeft: '0.3rem' }}>
                  {(
                    (impact.youth_reached_target || 0) +
                    (impact.trees_planted_target || 0) +
                    (impact.ideas_generated_target || 0) +
                    (impact.volunteers_target || 0)
                  ).toLocaleString()}
                </strong>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeModals} style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.85)', 
          zIndex: 2000, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '1rem' 
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ 
            background: 'white', 
            borderRadius: '20px', 
            maxWidth: '600px', 
            width: '100%', 
            maxHeight: '85vh', 
            display: 'flex', 
            flexDirection: 'column', 
            position: 'relative', 
            overflow: 'hidden' 
          }}>
            <button onClick={closeModals} style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px', 
              background: 'rgba(0,0,0,0.5)', 
              border: 'none', 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              cursor: 'pointer', 
              color: 'white', 
              zIndex: 10 
            }}>
              <i className="fas fa-times"></i>
            </button>
            
            <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '1rem', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-chart-bar" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1.1rem' }}>Create Impact Statistics</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>Fill in all required fields (*)</p>
            </div>
            
            <div style={{ padding: '1rem', overflowY: 'auto', flex: 1 }}>
              {/* Youth Reached */}
              <div style={{ background: '#f9fbf7', padding: '0.8rem', borderRadius: '10px', marginBottom: '0.8rem' }}>
                <h4 style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: '#F9C74F' }}>
                  <i className="fas fa-users"></i> Youth Reached <span style={{ color: 'red' }}>*</span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Label *</label>
                    <input
                      type="text"
                      name="youth_reached_label"
                      value={formData.youth_reached_label}
                      onChange={handleInputChange}
                      placeholder="YOUTH REACHED"
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Target *</label>
                    <input
                      type="number"
                      name="youth_reached_target"
                      value={formData.youth_reached_target}
                      onChange={handleInputChange}
                      placeholder="30000"
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Suffix</label>
                    <input
                      type="text"
                      name="youth_reached_suffix"
                      value={formData.youth_reached_suffix}
                      onChange={handleInputChange}
                      placeholder="+"
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Current Value</label>
                    <input
                      type="number"
                      name="youth_reached_current"
                      value={formData.youth_reached_current}
                      onChange={handleInputChange}
                      placeholder="0"
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1/3' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem' }}>
                      <input
                        type="checkbox"
                        name="youth_reached_active"
                        checked={formData.youth_reached_active}
                        onChange={handleInputChange}
                      /> Active
                    </label>
                  </div>
                </div>
              </div>

              {/* Trees Planted */}
              <div style={{ background: '#f9fbf7', padding: '0.8rem', borderRadius: '10px', marginBottom: '0.8rem' }}>
                <h4 style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: '#4CAF50' }}>
                  <i className="fas fa-tree"></i> Trees Planted <span style={{ color: 'red' }}>*</span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Label *</label>
                    <input
                      type="text"
                      name="trees_planted_label"
                      value={formData.trees_planted_label}
                      onChange={handleInputChange}
                      placeholder="TREES PLANTED"
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Target *</label>
                    <input
                      type="number"
                      name="trees_planted_target"
                      value={formData.trees_planted_target}
                      onChange={handleInputChange}
                      placeholder="50000"
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Suffix</label>
                    <input
                      type="text"
                      name="trees_planted_suffix"
                      value={formData.trees_planted_suffix}
                      onChange={handleInputChange}
                      placeholder="+"
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Current Value</label>
                    <input
                      type="number"
                      name="trees_planted_current"
                      value={formData.trees_planted_current}
                      onChange={handleInputChange}
                      placeholder="0"
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1/3' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem' }}>
                      <input
                        type="checkbox"
                        name="trees_planted_active"
                        checked={formData.trees_planted_active}
                        onChange={handleInputChange}
                      /> Active
                    </label>
                  </div>
                </div>
              </div>

              {/* Ideas Generated */}
              <div style={{ background: '#f9fbf7', padding: '0.8rem', borderRadius: '10px', marginBottom: '0.8rem' }}>
                <h4 style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: '#FF9800' }}>
                  <i className="fas fa-lightbulb"></i> Ideas Generated <span style={{ color: 'red' }}>*</span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Label *</label>
                    <input
                      type="text"
                      name="ideas_generated_label"
                      value={formData.ideas_generated_label}
                      onChange={handleInputChange}
                      placeholder="IDEAS GENERATED"
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Target *</label>
                    <input
                      type="number"
                      name="ideas_generated_target"
                      value={formData.ideas_generated_target}
                      onChange={handleInputChange}
                      placeholder="742"
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Suffix</label>
                    <input
                      type="text"
                      name="ideas_generated_suffix"
                      value={formData.ideas_generated_suffix}
                      onChange={handleInputChange}
                      placeholder="+"
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Current Value</label>
                    <input
                      type="number"
                      name="ideas_generated_current"
                      value={formData.ideas_generated_current}
                      onChange={handleInputChange}
                      placeholder="0"
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1/3' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem' }}>
                      <input
                        type="checkbox"
                        name="ideas_generated_active"
                        checked={formData.ideas_generated_active}
                        onChange={handleInputChange}
                      /> Active
                    </label>
                  </div>
                </div>
              </div>

              {/* Active Volunteers */}
              <div style={{ background: '#f9fbf7', padding: '0.8rem', borderRadius: '10px', marginBottom: '0.8rem' }}>
                <h4 style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: '#2196F3' }}>
                  <i className="fas fa-handshake"></i> Active Volunteers <span style={{ color: 'red' }}>*</span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Label *</label>
                    <input
                      type="text"
                      name="volunteers_label"
                      value={formData.volunteers_label}
                      onChange={handleInputChange}
                      placeholder="ACTIVE VOLUNTEERS"
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Target *</label>
                    <input
                      type="number"
                      name="volunteers_target"
                      value={formData.volunteers_target}
                      onChange={handleInputChange}
                      placeholder="435"
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Suffix</label>
                    <input
                      type="text"
                      name="volunteers_suffix"
                      value={formData.volunteers_suffix}
                      onChange={handleInputChange}
                      placeholder="+"
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Current Value</label>
                    <input
                      type="number"
                      name="volunteers_current"
                      value={formData.volunteers_current}
                      onChange={handleInputChange}
                      placeholder="0"
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1/3' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem' }}>
                      <input
                        type="checkbox"
                        name="volunteers_active"
                        checked={formData.volunteers_active}
                        onChange={handleInputChange}
                      /> Active
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button 
                  onClick={closeModals} 
                  disabled={isCreating}
                  style={{ 
                    flex: 1, 
                    background: '#f0f0f0', 
                    border: 'none', 
                    padding: '0.4rem', 
                    borderRadius: '20px', 
                    fontSize: '0.7rem', 
                    cursor: isCreating ? 'not-allowed' : 'pointer',
                    opacity: isCreating ? 0.6 : 1
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreate} 
                  disabled={isCreating}
                  style={{ 
                    flex: 1, 
                    background: '#0B3B2F', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.4rem', 
                    borderRadius: '20px', 
                    fontSize: '0.7rem', 
                    cursor: isCreating ? 'not-allowed' : 'pointer',
                    opacity: isCreating ? 0.6 : 1
                  }}
                >
                  {isCreating ? <i className="fas fa-spinner btn-loading"></i> : null}
                  {isCreating ? ' Creating...' : ' Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingImpact && (
        <div className="modal-overlay" onClick={closeModals} style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.85)', 
          zIndex: 2000, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '1rem' 
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ 
            background: 'white', 
            borderRadius: '20px', 
            maxWidth: '600px', 
            width: '100%', 
            maxHeight: '85vh', 
            display: 'flex', 
            flexDirection: 'column', 
            position: 'relative', 
            overflow: 'hidden' 
          }}>
            <button onClick={closeModals} style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px', 
              background: 'rgba(0,0,0,0.5)', 
              border: 'none', 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              cursor: 'pointer', 
              color: 'white', 
              zIndex: 10 
            }}>
              <i className="fas fa-times"></i>
            </button>
            
            <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '1rem', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-edit" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1.1rem' }}>Edit Impact Statistics</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>Update impact values</p>
            </div>
            
            <div style={{ padding: '1rem', overflowY: 'auto', flex: 1 }}>
              {/* Youth Reached */}
              <div style={{ background: '#f9fbf7', padding: '0.8rem', borderRadius: '10px', marginBottom: '0.8rem' }}>
                <h4 style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: '#F9C74F' }}>
                  <i className="fas fa-users"></i> Youth Reached
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Label</label>
                    <input
                      type="text"
                      name="youth_reached_label"
                      value={formData.youth_reached_label}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Target</label>
                    <input
                      type="number"
                      name="youth_reached_target"
                      value={formData.youth_reached_target}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Suffix</label>
                    <input
                      type="text"
                      name="youth_reached_suffix"
                      value={formData.youth_reached_suffix}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Current Value</label>
                    <input
                      type="number"
                      name="youth_reached_current"
                      value={formData.youth_reached_current}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1/3' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem' }}>
                      <input
                        type="checkbox"
                        name="youth_reached_active"
                        checked={formData.youth_reached_active}
                        onChange={handleInputChange}
                      /> Active
                    </label>
                  </div>
                </div>
              </div>

              {/* Trees Planted */}
              <div style={{ background: '#f9fbf7', padding: '0.8rem', borderRadius: '10px', marginBottom: '0.8rem' }}>
                <h4 style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: '#4CAF50' }}>
                  <i className="fas fa-tree"></i> Trees Planted
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Label</label>
                    <input
                      type="text"
                      name="trees_planted_label"
                      value={formData.trees_planted_label}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Target</label>
                    <input
                      type="number"
                      name="trees_planted_target"
                      value={formData.trees_planted_target}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Suffix</label>
                    <input
                      type="text"
                      name="trees_planted_suffix"
                      value={formData.trees_planted_suffix}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Current Value</label>
                    <input
                      type="number"
                      name="trees_planted_current"
                      value={formData.trees_planted_current}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1/3' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem' }}>
                      <input
                        type="checkbox"
                        name="trees_planted_active"
                        checked={formData.trees_planted_active}
                        onChange={handleInputChange}
                      /> Active
                    </label>
                  </div>
                </div>
              </div>

              {/* Ideas Generated */}
              <div style={{ background: '#f9fbf7', padding: '0.8rem', borderRadius: '10px', marginBottom: '0.8rem' }}>
                <h4 style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: '#FF9800' }}>
                  <i className="fas fa-lightbulb"></i> Ideas Generated
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Label</label>
                    <input
                      type="text"
                      name="ideas_generated_label"
                      value={formData.ideas_generated_label}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Target</label>
                    <input
                      type="number"
                      name="ideas_generated_target"
                      value={formData.ideas_generated_target}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Suffix</label>
                    <input
                      type="text"
                      name="ideas_generated_suffix"
                      value={formData.ideas_generated_suffix}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Current Value</label>
                    <input
                      type="number"
                      name="ideas_generated_current"
                      value={formData.ideas_generated_current}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1/3' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem' }}>
                      <input
                        type="checkbox"
                        name="ideas_generated_active"
                        checked={formData.ideas_generated_active}
                        onChange={handleInputChange}
                      /> Active
                    </label>
                  </div>
                </div>
              </div>

              {/* Active Volunteers */}
              <div style={{ background: '#f9fbf7', padding: '0.8rem', borderRadius: '10px', marginBottom: '0.8rem' }}>
                <h4 style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: '#2196F3' }}>
                  <i className="fas fa-handshake"></i> Active Volunteers
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Label</label>
                    <input
                      type="text"
                      name="volunteers_label"
                      value={formData.volunteers_label}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Target</label>
                    <input
                      type="number"
                      name="volunteers_target"
                      value={formData.volunteers_target}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Suffix</label>
                    <input
                      type="text"
                      name="volunteers_suffix"
                      value={formData.volunteers_suffix}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6rem', color: '#666' }}>Current Value</label>
                    <input
                      type="number"
                      name="volunteers_current"
                      value={formData.volunteers_current}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1/3' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem' }}>
                      <input
                        type="checkbox"
                        name="volunteers_active"
                        checked={formData.volunteers_active}
                        onChange={handleInputChange}
                      /> Active
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button 
                  onClick={closeModals} 
                  disabled={isUpdating}
                  style={{ 
                    flex: 1, 
                    background: '#f0f0f0', 
                    border: 'none', 
                    padding: '0.4rem', 
                    borderRadius: '20px', 
                    fontSize: '0.7rem', 
                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                    opacity: isUpdating ? 0.6 : 1
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdate} 
                  disabled={isUpdating}
                  style={{ 
                    flex: 1, 
                    background: '#0B3B2F', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.4rem', 
                    borderRadius: '20px', 
                    fontSize: '0.7rem', 
                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                    opacity: isUpdating ? 0.6 : 1
                  }}
                >
                  {isUpdating ? <i className="fas fa-spinner btn-loading"></i> : null}
                  {isUpdating ? ' Saving...' : ' Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminImpacts;