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
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'activities', 'explanations'
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    icon: 'fas fa-tasks',
    duration: '',
    target_audience: '',
    max_participants: '',
    order: 0,
    is_active: true,
    explanations: []
  });
  const [showAddExplanationModal, setShowAddExplanationModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [newExplanation, setNewExplanation] = useState({
    title: '',
    content: '',
    explanation_type: 'overview',
    order: 0
  });

  const API_BASE_URL = 'http://localhost:8000/api';

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchProgram();
  }, [id]);

  useEffect(() => {
    if (program && activeTab === 'activities') {
      fetchActivities();
    }
  }, [program, activeTab]);

  const fetchProgram = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/prog/${id}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProgram(data);
    } catch (error) {
      console.error('Error fetching program:', error);
      setError('Network error. Please check if the server is running on http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    setLoadingActivities(true);
    try {
      const response = await fetch(`${API_BASE_URL}/activity/by_program/?program_id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      } else {
        // Fallback to getting activities through program data
        if (program && program.activities) {
          setActivities(program.activities);
        }
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      if (program && program.activities) {
        setActivities(program.activities);
      }
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/prog/${program.id}/`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setSuccessMessage('Program deleted successfully!');
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/admin/programs');
        }, 2000);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete program');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity? This will also delete all associated explanations.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/activity/${activityId}/`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setSuccessMessage('Activity deleted successfully!');
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
          fetchActivities();
        } else {
          alert('Failed to delete activity');
        }
      } catch (error) {
        console.error('Error deleting activity:', error);
        alert('Network error. Please try again.');
      }
    }
  };

  const handleDeleteExplanation = async (explanationId) => {
    if (window.confirm('Are you sure you want to delete this explanation?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/explanation/${explanationId}/`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setSuccessMessage('Explanation deleted successfully!');
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
          fetchActivities(); // Refresh to get updated explanations
        } else {
          alert('Failed to delete explanation');
        }
      } catch (error) {
        console.error('Error deleting explanation:', error);
        alert('Network error. Please try again.');
      }
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

  const handleUpdateProgram = async () => {
    if (!editingProgram.name) {
      alert('Please fill in program name');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/prog/${editingProgram.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingProgram.name,
          category: editingProgram.category,
          description: editingProgram.description,
          icon: editingProgram.icon,
          color: editingProgram.color,
          order: editingProgram.order,
          is_active: editingProgram.is_active
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setProgram(data);
        setSuccessMessage('Program updated successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeEditModal();
      } else {
        alert('Failed to update program');
      }
    } catch (error) {
      console.error('Error updating program:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleAddActivity = async () => {
    if (!newActivity.name) {
      alert('Please enter activity name');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/activity/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          program: parseInt(id),
          name: newActivity.name,
          description: newActivity.description,
          icon: newActivity.icon,
          duration: newActivity.duration,
          target_audience: newActivity.target_audience,
          max_participants: newActivity.max_participants || null,
          order: newActivity.order,
          is_active: newActivity.is_active
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuccessMessage('Activity added successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setShowAddActivityModal(false);
        setNewActivity({
          name: '',
          description: '',
          icon: 'fas fa-tasks',
          duration: '',
          target_audience: '',
          max_participants: '',
          order: 0,
          is_active: true,
          explanations: []
        });
        fetchActivities();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to add activity');
      }
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleAddExplanation = async () => {
    if (!newExplanation.title || !newExplanation.content) {
      alert('Please enter both title and content');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/explanation/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activity: selectedActivity.id,
          title: newExplanation.title,
          content: newExplanation.content,
          explanation_type: newExplanation.explanation_type,
          order: newExplanation.order
        }),
      });
      
      if (response.ok) {
        setSuccessMessage('Explanation added successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setShowAddExplanationModal(false);
        setSelectedActivity(null);
        setNewExplanation({
          title: '',
          content: '',
          explanation_type: 'overview',
          order: 0
        });
        fetchActivities();
      } else {
        alert('Failed to add explanation');
      }
    } catch (error) {
      console.error('Error adding explanation:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/admin/programs');
  };

  const categoryLabels = {
    'youth_leadership': 'Youth Leadership',
    'environmental_resilience': 'Environmental Resilience and Adaptation',
    'youth_opportunity': 'Youth and Opportunity'
  };

  const explanationTypeLabels = {
    'overview': 'Overview',
    'benefits': 'Benefits',
    'process': 'Process / How it works',
    'requirements': 'Requirements',
    'impact': 'Impact',
    'testimonial': 'Testimonial',
    'other': 'Other'
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
    { value: 'fas fa-user-graduate', label: 'Graduate' },
    { value: 'fas fa-tree', label: 'Tree' },
    { value: 'fas fa-briefcase', label: 'Briefcase' },
    { value: 'fas fa-rocket', label: 'Rocket' },
    { value: 'fas fa-tasks', label: 'Tasks' },
    { value: 'fas fa-water', label: 'Water' },
    { value: 'fas fa-city', label: 'City' },
    { value: 'fas fa-tractor', label: 'Tractor' },
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
          <p>View complete information about {program.name}</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid #e0e0e0' }}>
          <button
            onClick={() => setActiveTab('details')}
            style={{
              padding: '0.8rem 1.5rem',
              background: activeTab === 'details' ? program.color || '#0B3B2F' : 'transparent',
              color: activeTab === 'details' ? 'white' : '#666',
              border: 'none',
              borderRadius: '10px 10px 0 0',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
            Program Details
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            style={{
              padding: '0.8rem 1.5rem',
              background: activeTab === 'activities' ? program.color || '#0B3B2F' : 'transparent',
              color: activeTab === 'activities' ? 'white' : '#666',
              border: 'none',
              borderRadius: '10px 10px 0 0',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-tasks" style={{ marginRight: '0.5rem' }}></i>
            Activities ({activities.length})
          </button>
        </div>

        {/* Program Details Tab */}
        {activeTab === 'details' && (
          <div data-aos="fade-up" style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
            <div style={{ background: `linear-gradient(135deg, ${program.color || '#0B3B2F'}, ${program.color || '#1a5c48'}dd)`, padding: '2rem', textAlign: 'center', position: 'relative' }}>
              <div style={{ width: '120px', height: '120px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white' }}>
                <i className={program.icon || 'fas fa-chalkboard-user'} style={{ fontSize: '3.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ marginTop: '1rem', marginBottom: '0.3rem', fontSize: '1.8rem' }}>{program.name}</h2>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  background: program.color || '#0B3B2F',
                  color: 'white',
                  padding: '0.3rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}>
                  {categoryLabels[program.category] || program.category}
                </span>
                <span style={{
                  background: program.is_active ? '#4caf50' : '#999',
                  color: 'white',
                  padding: '0.3rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}>
                  {program.is_active ? 'Active' : 'Inactive'}
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
                    <strong style={{ color: '#666', fontSize: '0.85rem' }}>Program Name</strong>
                    <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{program.name}</p>
                  </div>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <strong style={{ color: '#666', fontSize: '0.85rem' }}>Category</strong>
                    <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{categoryLabels[program.category] || program.category}</p>
                  </div>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <strong style={{ color: '#666', fontSize: '0.85rem' }}>Display Order</strong>
                    <p style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{program.order || 0}</p>
                  </div>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <strong style={{ color: '#666', fontSize: '0.85rem' }}>Status</strong>
                    <p style={{ marginTop: '0.3rem' }}>
                      <span style={{
                        background: program.is_active ? '#e8f5e9' : '#ffebee',
                        color: program.is_active ? '#2e7d32' : '#c62828',
                        padding: '0.2rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem'
                      }}>
                        {program.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-align-left"></i> Description
                  </h3>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <strong style={{ color: '#666', fontSize: '0.85rem' }}>Short Description</strong>
                    <p style={{ marginTop: '0.3rem', fontSize: '1rem', lineHeight: '1.5' }}>{program.description || 'No description provided'}</p>
                  </div>
                </div>
              </div>

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
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div data-aos="fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#0B3B2F' }}>
                <i className="fas fa-tasks" style={{ marginRight: '0.5rem' }}></i>
                Program Activities
              </h2>
              <button
                onClick={() => setShowAddActivityModal(true)}
                style={{
                  background: program.color || '#0B3B2F',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 600
                }}
              >
                <i className="fas fa-plus"></i> Add Activity
              </button>
            </div>

            {loadingActivities ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
                <p style={{ marginTop: '1rem', color: '#666' }}>Loading activities...</p>
              </div>
            ) : activities.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <i className="fas fa-inbox" style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }}></i>
                <p style={{ color: '#666' }}>No activities added yet. Click "Add Activity" to get started.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {activities.map((activity, idx) => (
                  <div key={activity.id} data-aos="fade-up" data-aos-delay={idx * 100} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ background: `linear-gradient(135deg, ${program.color || '#0B3B2F'}20, ${program.color || '#0B3B2F'}10)`, padding: '1.5rem', borderBottom: `3px solid ${program.color || '#0B3B2F'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '12px',
                            background: `${program.color || '#0B3B2F'}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <i className={activity.icon || 'fas fa-tasks'} style={{ fontSize: '1.5rem', color: program.color || '#0B3B2F' }}></i>
                          </div>
                          <div>
                            <h3 style={{ margin: 0, color: '#0B3B2F' }}>{activity.name}</h3>
                            {activity.duration && (
                              <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: '#666' }}>
                                <i className="fas fa-clock"></i> {activity.duration}
                              </p>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => {
                              setSelectedActivity(activity);
                              setShowAddExplanationModal(true);
                            }}
                            style={{
                              background: '#4caf50',
                              color: 'white',
                              border: 'none',
                              padding: '0.4rem 0.8rem',
                              borderRadius: '20px',
                              cursor: 'pointer',
                              fontSize: '0.75rem'
                            }}
                          >
                            <i className="fas fa-plus"></i> Add Explanation
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(activity.id)}
                            style={{
                              background: '#d32f2f',
                              color: 'white',
                              border: 'none',
                              padding: '0.4rem 0.8rem',
                              borderRadius: '20px',
                              cursor: 'pointer',
                              fontSize: '0.75rem'
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      {activity.description && (
                        <p style={{ marginTop: '1rem', color: '#666', lineHeight: '1.5' }}>{activity.description}</p>
                      )}
                      {activity.target_audience && (
                        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
                          <i className="fas fa-users"></i> Target: {activity.target_audience}
                        </p>
                      )}
                      {activity.max_participants && (
                        <p style={{ marginTop: '0.3rem', fontSize: '0.8rem', color: '#666' }}>
                          <i className="fas fa-user-friends"></i> Max Participants: {activity.max_participants}
                        </p>
                      )}
                    </div>
                    
                    {/* Explanations Section */}
                    {activity.explanations && activity.explanations.length > 0 && (
                      <div style={{ padding: '1.5rem' }}>
                        <h4 style={{ color: '#0B3B2F', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="fas fa-info-circle"></i> Explanations
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                          {activity.explanations.map(exp => (
                            <div key={exp.id} style={{
                              background: '#f9f9f9',
                              borderRadius: '12px',
                              padding: '1rem',
                              position: 'relative'
                            }}>
                              <button
                                onClick={() => handleDeleteExplanation(exp.id)}
                                style={{
                                  position: 'absolute',
                                  top: '8px',
                                  right: '8px',
                                  background: '#ffebee',
                                  border: 'none',
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  cursor: 'pointer',
                                  color: '#d32f2f',
                                  fontSize: '0.7rem'
                                }}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                              <h5 style={{ margin: '0 0 0.5rem 0', color: program.color || '#0B3B2F' }}>
                                {exp.title}
                              </h5>
                              {exp.explanation_type && (
                                <span style={{
                                  background: '#e0e0e0',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '10px',
                                  fontSize: '0.65rem',
                                  display: 'inline-block',
                                  marginBottom: '0.5rem'
                                }}>
                                  {explanationTypeLabels[exp.explanation_type]}
                                </span>
                              )}
                              <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#666', lineHeight: '1.5' }}>
                                {exp.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Program Modal */}
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
              background: `linear-gradient(135deg, ${program.color || '#0B3B2F'}, ${program.color || '#1a5c48'})`, 
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
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Program Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editingProgram.name}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Category</label>
                <select
                  name="category"
                  value={editingProgram.category}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                >
                  <option value="youth_leadership">Youth Leadership</option>
                  <option value="environmental_resilience">Environmental Resilience and Adaptation</option>
                  <option value="youth_opportunity">Youth and Opportunity</option>
                </select>
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
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Description</label>
                <textarea
                  name="description"
                  value={editingProgram.description || ''}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '80px' }}
                  placeholder="Brief description of the program"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Display Order</label>
                <input
                  type="number"
                  name="order"
                  value={editingProgram.order || 0}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={editingProgram.is_active}
                    onChange={(e) => setEditingProgram({ ...editingProgram, is_active: e.target.checked })}
                    style={{ width: 'auto' }}
                  />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Active</span>
                </label>
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

      {/* Add Activity Modal */}
      {showAddActivityModal && (
        <div className="modal-overlay" onClick={() => setShowAddActivityModal(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '28px', maxWidth: '500px', width: '100%',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={() => setShowAddActivityModal(false)} style={{
              position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.5)', border: 'none',
              width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '1.2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
            }}><i className="fas fa-times"></i></button>
            
            <div style={{ 
              background: `linear-gradient(135deg, ${program.color || '#0B3B2F'}, ${program.color || '#1a5c48'})`, 
              padding: '1.5rem', 
              textAlign: 'center', 
              borderRadius: '28px 28px 0 0',
              flexShrink: 0
            }}>
              <div style={{ width: '70px', height: '70px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-tasks" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.3rem' }}>Add New Activity</h2>
              <p style={{ color: '#F9C74F', fontSize: '0.9rem', marginTop: '0.3rem' }}>Add an activity to {program.name}</p>
            </div>
            
            <div style={{ padding: '1.2rem', overflowY: 'auto', flex: 1, maxHeight: 'calc(90vh - 140px)' }}>
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Activity Name *</label>
                <input
                  type="text"
                  value={newActivity.name}
                  onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="e.g., Youth Interschool Essay Competition"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Description</label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '60px' }}
                  placeholder="Brief description of the activity"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Icon</label>
                <select
                  value={newActivity.icon}
                  onChange={(e) => setNewActivity({ ...newActivity, icon: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                >
                  {iconOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Duration</label>
                <input
                  type="text"
                  value={newActivity.duration}
                  onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="e.g., 3 months, 2 days, Ongoing"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Target Audience</label>
                <input
                  type="text"
                  value={newActivity.target_audience}
                  onChange={(e) => setNewActivity({ ...newActivity, target_audience: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="e.g., Secondary school students, Youth aged 18-25"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Max Participants (optional)</label>
                <input
                  type="number"
                  value={newActivity.max_participants}
                  onChange={(e) => setNewActivity({ ...newActivity, max_participants: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="e.g., 100"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Display Order</label>
                <input
                  type="number"
                  value={newActivity.order}
                  onChange={(e) => setNewActivity({ ...newActivity, order: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="0"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                <button onClick={() => setShowAddActivityModal(false)} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                <button onClick={handleAddActivity} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Add Activity</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Explanation Modal */}
      {showAddExplanationModal && selectedActivity && (
        <div className="modal-overlay" onClick={() => setShowAddExplanationModal(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '28px', maxWidth: '500px', width: '100%',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={() => setShowAddExplanationModal(false)} style={{
              position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.5)', border: 'none',
              width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '1.2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
            }}><i className="fas fa-times"></i></button>
            
            <div style={{ 
              background: `linear-gradient(135deg, ${program.color || '#0B3B2F'}, ${program.color || '#1a5c48'})`, 
              padding: '1.5rem', 
              textAlign: 'center', 
              borderRadius: '28px 28px 0 0',
              flexShrink: 0
            }}>
              <div style={{ width: '70px', height: '70px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-info-circle" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.3rem' }}>Add Explanation</h2>
              <p style={{ color: '#F9C74F', fontSize: '0.9rem', marginTop: '0.3rem' }}>For: {selectedActivity.name}</p>
            </div>
            
            <div style={{ padding: '1.2rem', overflowY: 'auto', flex: 1, maxHeight: 'calc(90vh - 140px)' }}>
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Title *</label>
                <input
                  type="text"
                  value={newExplanation.title}
                  onChange={(e) => setNewExplanation({ ...newExplanation, title: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="e.g., Overview, Benefits, How to Participate"
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Explanation Type</label>
                <select
                  value={newExplanation.explanation_type}
                  onChange={(e) => setNewExplanation({ ...newExplanation, explanation_type: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                >
                  <option value="overview">Overview</option>
                  <option value="benefits">Benefits</option>
                  <option value="process">Process / How it works</option>
                  <option value="requirements">Requirements</option>
                  <option value="impact">Impact</option>
                  <option value="testimonial">Testimonial</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Content *</label>
                <textarea
                  value={newExplanation.content}
                  onChange={(e) => setNewExplanation({ ...newExplanation, content: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', minHeight: '150px' }}
                  placeholder="Detailed explanation content..."
                />
              </div>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Display Order</label>
                <input
                  type="number"
                  value={newExplanation.order}
                  onChange={(e) => setNewExplanation({ ...newExplanation, order: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                  placeholder="0"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                <button onClick={() => setShowAddExplanationModal(false)} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                <button onClick={handleAddExplanation} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Add Explanation</button>
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
            <h3 style={{ marginBottom: '0.5rem' }}>Delete Program</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Are you sure you want to delete "{program.name}"? This action cannot be undone and will also delete all associated activities and explanations.</p>
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