import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminLeadership = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Data states
  const [leaders, setLeaders] = useState([]);
  const [missions, setMissions] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [statistics, setStatistics] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState({});
  const [activeTab, setActiveTab] = useState('leaders');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Image preview states
  const [imagePreview, setImagePreview] = useState('');
  const [editImagePreview, setEditImagePreview] = useState('');
  
  // Form data for new items
  const [newLeader, setNewLeader] = useState({
    name: '',
    role: '',
    bio: '',
    full_bio: '',
    linkedin: '',
    twitter: '',
    image_base64: '',
    image_mime_type: 'image/jpeg',
    order: 0
  });
  
  const [newMission, setNewMission] = useState({
    title: '',
    category: 'environment',
    description: '',
    image_base64: '',
    image_mime_type: 'image/jpeg',
    order: 0
  });
  
  const [newTestimonial, setNewTestimonial] = useState({
    text: '',
    author: '',
    role: '',
    rating: 5,
    date: new Date().toISOString().split('T')[0],
    order: 0
  });
  
  const [newBlogPost, setNewBlogPost] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    read_time: '5 min read',
    content: '',
    image_base64: '',
    image_mime_type: 'image/jpeg',
    order: 0
  });
  
  const [newStatistic, setNewStatistic] = useState({
    label: '',
    value: 0,
    icon: 'fas fa-chart-line',
    suffix: '+',
    order: 0
  });

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    
    // Check if activeTab was passed from dashboard
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
    
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    setErrorDetails({});
    
    try {
      // Fetch all data in parallel
      await Promise.all([
        fetchLeaders(),
        fetchMissions(),
        fetchTestimonials(),
        fetchBlogPosts(),
        fetchStatistics()
      ]);
    } catch (error) {
      setError('Network error. Please check your connection.');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaders = async () => {
    try {
      console.log('Fetching leaders from:', `${API_BASE_URL}/leaders/`);
      const response = await fetch(`${API_BASE_URL}/leaders/`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Leaders data received:', data);
      // Handle both array response and object with data property
      const leadersArray = Array.isArray(data) ? data : (data.data || data.results || []);
      console.log('Leaders array:', leadersArray);
      setLeaders(leadersArray);
      setErrorDetails(prev => ({ ...prev, leaders: null }));
    } catch (error) {
      console.error('Error fetching leaders:', error);
      setErrorDetails(prev => ({ ...prev, leaders: error.message }));
      setLeaders([]);
    }
  };

  const fetchMissions = async () => {
    try {
      console.log('Fetching missions from:', `${API_BASE_URL}/missions/`);
      const response = await fetch(`${API_BASE_URL}/missions/`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Missions data received:', data);
      // Handle both array response and object with data property
      const missionsArray = Array.isArray(data) ? data : (data.data || data.results || []);
      console.log('Missions array:', missionsArray);
      setMissions(missionsArray);
      setErrorDetails(prev => ({ ...prev, missions: null }));
    } catch (error) {
      console.error('Error fetching missions:', error);
      setErrorDetails(prev => ({ ...prev, missions: error.message }));
      setMissions([]);
    }
  };

  const fetchTestimonials = async () => {
    try {
      console.log('Fetching testimonials from:', `${API_BASE_URL}/testimonials/`);
      const response = await fetch(`${API_BASE_URL}/testimonials/`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Testimonials data received:', data);
      // Handle both array response and object with data property
      const testimonialsArray = Array.isArray(data) ? data : (data.data || data.results || []);
      console.log('Testimonials array:', testimonialsArray);
      setTestimonials(testimonialsArray);
      setErrorDetails(prev => ({ ...prev, testimonials: null }));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setErrorDetails(prev => ({ ...prev, testimonials: error.message }));
      setTestimonials([]);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      console.log('Fetching blog posts from:', `${API_BASE_URL}/blog-posts/`);
      const response = await fetch(`${API_BASE_URL}/blog-posts/`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Blog posts data received:', data);
      // Handle both array response and object with data property
      const blogPostsArray = Array.isArray(data) ? data : (data.data || data.results || []);
      console.log('Blog posts array:', blogPostsArray);
      setBlogPosts(blogPostsArray);
      setErrorDetails(prev => ({ ...prev, blogPosts: null }));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setErrorDetails(prev => ({ ...prev, blogPosts: error.message }));
      setBlogPosts([]);
    }
  };

  const fetchStatistics = async () => {
    try {
      console.log('Fetching statistics from:', `${API_BASE_URL}/statistics/`);
      const response = await fetch(`${API_BASE_URL}/statistics/`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Statistics data received:', data);
      // Handle both array response and object with data property
      const statisticsArray = Array.isArray(data) ? data : (data.data || data.results || []);
      console.log('Statistics array:', statisticsArray);
      setStatistics(statisticsArray);
      setErrorDetails(prev => ({ ...prev, statistics: null }));
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setErrorDetails(prev => ({ ...prev, statistics: error.message }));
      setStatistics([]);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      const base64 = await fileToBase64(file);
      
      if (type === 'leader') {
        setNewLeader(prev => ({ ...prev, image_base64: base64, image_mime_type: file.type }));
      } else if (type === 'mission') {
        setNewMission(prev => ({ ...prev, image_base64: base64, image_mime_type: file.type }));
      } else if (type === 'blog') {
        setNewBlogPost(prev => ({ ...prev, image_base64: base64, image_mime_type: file.type }));
      }
    }
  };

  const handleEditImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setEditImagePreview(preview);
      const base64 = await fileToBase64(file);
      setEditingItem(prev => ({ ...prev, image_base64: base64, image_mime_type: file.type }));
    }
  };

  const openModal = (item, type) => {
    setSelectedItem({ ...item, type });
    setIsEditMode(false);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setIsEditMode(false);
    setEditingItem(null);
    setEditImagePreview('');
    document.body.style.overflow = 'unset';
  };

  const openEditModal = (item, type) => {
    setEditingItem({ ...item, type });
    setIsEditMode(true);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
    if (item.image_base64) {
      setEditImagePreview(item.image_base64);
    } else {
      setEditImagePreview('');
    }
  };

  const openAddModal = (type) => {
    setActiveTab(type);
    setShowAddModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    resetForms();
    setImagePreview('');
    document.body.style.overflow = 'unset';
  };

  const resetForms = () => {
    setNewLeader({
      name: '',
      role: '',
      bio: '',
      full_bio: '',
      linkedin: '',
      twitter: '',
      image_base64: '',
      image_mime_type: 'image/jpeg',
      order: 0
    });
    setNewMission({
      title: '',
      category: 'environment',
      description: '',
      image_base64: '',
      image_mime_type: 'image/jpeg',
      order: 0
    });
    setNewTestimonial({
      text: '',
      author: '',
      role: '',
      rating: 5,
      date: new Date().toISOString().split('T')[0],
      order: 0
    });
    setNewBlogPost({
      title: '',
      date: new Date().toISOString().split('T')[0],
      read_time: '5 min read',
      content: '',
      image_base64: '',
      image_mime_type: 'image/jpeg',
      order: 0
    });
    setNewStatistic({
      label: '',
      value: 0,
      icon: 'fas fa-chart-line',
      suffix: '+',
      order: 0
    });
  };

  const handleAddItem = async () => {
    let url = '';
    let body = {};
    let successMsg = '';
    let refreshFunction = null;

    switch (activeTab) {
      case 'leaders':
        url = `${API_BASE_URL}/leaders/`;
        body = { ...newLeader, order: leaders.length };
        successMsg = 'Leader added successfully!';
        refreshFunction = fetchLeaders;
        break;
      case 'missions':
        url = `${API_BASE_URL}/missions/`;
        body = { ...newMission, order: missions.length };
        successMsg = 'Mission added successfully!';
        refreshFunction = fetchMissions;
        break;
      case 'testimonials':
        url = `${API_BASE_URL}/testimonials/`;
        body = { ...newTestimonial, order: testimonials.length };
        successMsg = 'Testimonial added successfully!';
        refreshFunction = fetchTestimonials;
        break;
      case 'blog-posts':
        url = `${API_BASE_URL}/blog-posts/`;
        body = { ...newBlogPost, order: blogPosts.length };
        successMsg = 'Blog post added successfully!';
        refreshFunction = fetchBlogPosts;
        break;
      case 'statistics':
        url = `${API_BASE_URL}/statistics/`;
        body = { ...newStatistic, order: statistics.length };
        successMsg = 'Statistic added successfully!';
        refreshFunction = fetchStatistics;
        break;
      default:
        return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Add response:', result);
        // Refresh the specific data type
        if (refreshFunction) await refreshFunction();
        setSuccessMessage(successMsg);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeAddModal();
      } else {
        const errorData = await response.json();
        console.error('Add error:', errorData);
        alert(errorData.error || errorData.message || `Failed to add ${activeTab.slice(0, -1)}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    
    let url = '';
    let successMsg = '';
    let refreshFunction = null;

    switch (editingItem.type) {
      case 'leaders':
        url = `${API_BASE_URL}/leaders/${editingItem.id}/`;
        successMsg = 'Leader updated successfully!';
        refreshFunction = fetchLeaders;
        break;
      case 'missions':
        url = `${API_BASE_URL}/missions/${editingItem.id}/`;
        successMsg = 'Mission updated successfully!';
        refreshFunction = fetchMissions;
        break;
      case 'testimonials':
        url = `${API_BASE_URL}/testimonials/${editingItem.id}/`;
        successMsg = 'Testimonial updated successfully!';
        refreshFunction = fetchTestimonials;
        break;
      case 'blog-posts':
        url = `${API_BASE_URL}/blog-posts/${editingItem.id}/`;
        successMsg = 'Blog post updated successfully!';
        refreshFunction = fetchBlogPosts;
        break;
      case 'statistics':
        url = `${API_BASE_URL}/statistics/${editingItem.id}/`;
        successMsg = 'Statistic updated successfully!';
        refreshFunction = fetchStatistics;
        break;
      default:
        return;
    }

    // Remove type property before sending
    const { type, ...updateData } = editingItem;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Update response:', result);
        // Refresh the specific data type
        if (refreshFunction) await refreshFunction();
        setSuccessMessage(successMsg);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeModal();
      } else {
        const errorData = await response.json();
        console.error('Update error:', errorData);
        alert(errorData.error || errorData.message || `Failed to update ${editingItem.type.slice(0, -1)}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleDelete = async (item, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) {
      let url = '';
      let successMsg = '';
      let refreshFunction = null;

      switch (type) {
        case 'leaders':
          url = `${API_BASE_URL}/leaders/${item.id}/`;
          successMsg = 'Leader deleted successfully!';
          refreshFunction = fetchLeaders;
          break;
        case 'missions':
          url = `${API_BASE_URL}/missions/${item.id}/`;
          successMsg = 'Mission deleted successfully!';
          refreshFunction = fetchMissions;
          break;
        case 'testimonials':
          url = `${API_BASE_URL}/testimonials/${item.id}/`;
          successMsg = 'Testimonial deleted successfully!';
          refreshFunction = fetchTestimonials;
          break;
        case 'blog-posts':
          url = `${API_BASE_URL}/blog-posts/${item.id}/`;
          successMsg = 'Blog post deleted successfully!';
          refreshFunction = fetchBlogPosts;
          break;
        case 'statistics':
          url = `${API_BASE_URL}/statistics/${item.id}/`;
          successMsg = 'Statistic deleted successfully!';
          refreshFunction = fetchStatistics;
          break;
        default:
          return;
      }

      try {
        const response = await fetch(url, { method: 'DELETE' });
        
        if (response.ok) {
          console.log('Delete successful');
          // Refresh the specific data type
          if (refreshFunction) await refreshFunction();
          setSuccessMessage(successMsg);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
          closeModal();
        } else {
          const errorData = await response.json();
          console.error('Delete error:', errorData);
          alert(errorData.error || errorData.message || `Failed to delete ${type.slice(0, -1)}`);
        }
      } catch (error) {
        console.error('Network error:', error);
        alert('Network error. Please try again.');
      }
    }
  };

  const handleEditChange = (e) => {
    setEditingItem({
      ...editingItem,
      [e.target.name]: e.target.value
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'environment': '#4caf50',
      'leadership': '#2196F3'
    };
    return colors[category] || '#757575';
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const renderTable = (items, type, columns) => {
    const hasError = errorDetails[type];
    
    console.log(`Rendering ${type} table with ${items.length} items:`, items);
    
    if (hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#d32f2f' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
          <p>Failed to load {type} data</p>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>{hasError}</p>
          <button 
            onClick={fetchAllData}
            style={{
              marginTop: '1rem',
              background: '#0B3B2F',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-sync-alt"></i> Retry
          </button>
        </div>
      );
    }
    
    if (!items || items.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <i className="fas fa-inbox" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
          <p>No {type} found. Click "Add New" to create one.</p>
        </div>
      );
    }
    
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
              {columns.map(col => (
                <th key={col.key} style={{ textAlign: 'left', padding: '0.8rem' }}>{col.label}</th>
              ))}
              <th style={{ textAlign: 'left', padding: '0.8rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id || index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '0.8rem' }}>
                    {col.render ? col.render(item) : (item[col.key] || '-')}
                  </td>
                ))}
                <td style={{ padding: '0.8rem' }}>
                  <i 
                    className="fas fa-eye" 
                    style={{ color: '#0B3B2F', cursor: 'pointer', marginRight: '0.8rem' }} 
                    onClick={() => openModal(item, type)}
                  ></i>
                  <i 
                    className="fas fa-edit" 
                    style={{ color: '#2196F3', cursor: 'pointer', marginRight: '0.8rem' }} 
                    onClick={() => openEditModal(item, type)}
                  ></i>
                  <i 
                    className="fas fa-trash" 
                    style={{ color: '#d32f2f', cursor: 'pointer' }} 
                    onClick={() => handleDelete(item, type)}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const hasAnyError = Object.values(errorDetails).some(e => e !== null);

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading data...</p>
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
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => navigate('/admin')}></i>
            <h1 style={{ fontSize: '1.8rem' }}>Content Management</h1>
          </div>
          <p>Manage leaders, missions, testimonials, blog posts, and statistics</p>
        </div>
      </div>

      {/* Error Banner */}
      {hasAnyError && !loading && (
        <div style={{ maxWidth: '1200px', margin: '1rem auto 0', padding: '0 2rem' }}>
          <div style={{
            background: '#ffebee',
            borderLeft: '4px solid #d32f2f',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-exclamation-circle" style={{ color: '#d32f2f' }}></i>
              <strong style={{ color: '#d32f2f' }}>API Connection Issues:</strong>
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
              Unable to connect to the backend server at {API_BASE_URL}. 
              Please make sure your Django server is running on this address.
            </p>
            <button
              onClick={fetchAllData}
              style={{
                marginTop: '0.5rem',
                background: '#0B3B2F',
                color: 'white',
                border: 'none',
                padding: '0.3rem 0.8rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              <i className="fas fa-sync-alt"></i> Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <details style={{ background: '#f5f5f5', padding: '0.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Debug Info (Click to expand)</summary>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
              <p><strong>Leaders:</strong> {leaders.length} items</p>
              <p><strong>Missions:</strong> {missions.length} items</p>
              <p><strong>Testimonials:</strong> {testimonials.length} items</p>
              <p><strong>Blog Posts:</strong> {blogPosts.length} items</p>
              <p><strong>Statistics:</strong> {statistics.length} items</p>
              <p><strong>Active Tab:</strong> {activeTab}</p>
              <p><strong>Errors:</strong> {JSON.stringify(errorDetails)}</p>
            </div>
          </details>
        </div>
      )}

      {/* Tabs */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', borderBottom: '2px solid #e0e0e0' }}>
          {[
            { id: 'leaders', label: 'Leaders', icon: 'fas fa-users', count: leaders.length },
            { id: 'missions', label: 'Missions', icon: 'fas fa-rocket', count: missions.length },
            { id: 'testimonials', label: 'Testimonials', icon: 'fas fa-star', count: testimonials.length },
            { id: 'blog-posts', label: 'Blog Posts', icon: 'fas fa-blog', count: blogPosts.length },
            { id: 'statistics', label: 'Statistics', icon: 'fas fa-chart-line', count: statistics.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === tab.id ? '#0B3B2F' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#666',
                border: 'none',
                borderRadius: '50px 50px 0 0',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                position: 'relative'
              }}
            >
              <i className={tab.icon}></i>
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  background: activeTab === tab.id ? '#F9C74F' : '#e0e0e0',
                  color: activeTab === tab.id ? '#0B3B2F' : '#666',
                  borderRadius: '20px',
                  padding: '0.1rem 0.5rem',
                  fontSize: '0.7rem',
                  marginLeft: '0.3rem'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ color: '#0B3B2F' }}>
              Manage {activeTab === 'missions' ? 'Missions' : activeTab.replace('-', ' ').charAt(0).toUpperCase() + activeTab.replace('-', ' ').slice(1)}
            </h2>
            {!errorDetails[activeTab] && (
              <button
                onClick={() => openAddModal(activeTab)}
                style={{
                  background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className="fas fa-plus"></i>
                Add New
              </button>
            )}
          </div>

          {/* Leaders Table */}
          {activeTab === 'leaders' && renderTable(leaders, 'leaders', [
            { key: 'name', label: 'Name' },
            { key: 'role', label: 'Role' },
            { key: 'order', label: 'Order' },
            { key: 'created_at', label: 'Created', render: (item) => item.created_at ? new Date(item.created_at).toLocaleDateString() : '-' }
          ])}

          {/* Missions Table */}
          {activeTab === 'missions' && renderTable(missions, 'missions', [
            { key: 'title', label: 'Title' },
            { key: 'category', label: 'Category', render: (item) => (
              <span style={{
                background: getCategoryColor(item.category),
                color: 'white',
                padding: '0.2rem 0.6rem',
                borderRadius: '20px',
                fontSize: '0.7rem'
              }}>{item.category}</span>
            )},
            { key: 'order', label: 'Order' },
            { key: 'created_at', label: 'Created', render: (item) => item.created_at ? new Date(item.created_at).toLocaleDateString() : '-' }
          ])}

          {/* Testimonials Table */}
          {activeTab === 'testimonials' && renderTable(testimonials, 'testimonials', [
            { key: 'author', label: 'Author' },
            { key: 'text', label: 'Text', render: (item) => item.text ? (item.text.substring(0, 50) + '...') : '-' },
            { key: 'rating', label: 'Rating', render: (item) => getRatingStars(item.rating || 0) },
            { key: 'date', label: 'Date' }
          ])}

          {/* Blog Posts Table */}
          {activeTab === 'blog-posts' && renderTable(blogPosts, 'blog-posts', [
            { key: 'title', label: 'Title' },
            { key: 'date', label: 'Date' },
            { key: 'read_time', label: 'Read Time' }
          ])}

          {/* Statistics Table */}
          {activeTab === 'statistics' && renderTable(statistics, 'statistics', [
            { key: 'label', label: 'Label' },
            { key: 'value', label: 'Value' },
            { key: 'suffix', label: 'Suffix' },
            { key: 'order', label: 'Order' }
          ])}
        </div>
      </div>

      {/* View/Edit Modal */}
      {showModal && selectedItem && (
        <div className="modal-overlay" onClick={closeModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '28px', maxWidth: '600px', width: '100%', 
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
                <i className={isEditMode ? "fas fa-edit" : "fas fa-info-circle"} style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.3rem' }}>
                {isEditMode ? `Edit ${selectedItem.type === 'missions' ? 'Mission' : selectedItem.type.slice(0, -1)}` : `${selectedItem.type === 'missions' ? 'Mission' : selectedItem.type.slice(0, -1)} Details`}
              </h2>
            </div>
            
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {isEditMode && editingItem ? (
                // Edit Form
                <>
                  {(editingItem.type === 'leaders' || editingItem.type === 'missions' || editingItem.type === 'blog-posts') && (
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Image</label>
                      {editImagePreview && (
                        <img src={editImagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', marginBottom: '0.5rem' }} />
                      )}
                      <input type="file" accept="image/*" onChange={(e) => handleEditImageChange(e, editingItem.type)} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                    </div>
                  )}

                  {Object.keys(editingItem).filter(key => !['id', 'type', 'image_url', 'image_base64', 'image_mime_type', 'created_at', 'updated_at'].includes(key)).map(key => (
                    <div key={key} style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'capitalize' }}>{key.replace('_', ' ')}</label>
                      {key === 'category' ? (
                        <select
                          name={key}
                          value={editingItem[key] || ''}
                          onChange={handleEditChange}
                          style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd' }}
                        >
                          <option value="environment">Environment</option>
                          <option value="leadership">Leadership</option>
                        </select>
                      ) : (
                        typeof editingItem[key] === 'string' && editingItem[key] && editingItem[key].length > 100 ? (
                          <textarea
                            name={key}
                            value={editingItem[key] || ''}
                            onChange={handleEditChange}
                            style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }}
                          />
                        ) : (
                          <input
                            type={key === 'order' || key === 'value' || key === 'rating' ? 'number' : 'text'}
                            name={key}
                            value={editingItem[key] || ''}
                            onChange={handleEditChange}
                            style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd' }}
                          />
                        )
                      )}
                    </div>
                  ))}
                  
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button onClick={closeModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleUpdateItem} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
                  </div>
                </>
              ) : (
                // View Mode
                <>
                  {selectedItem.image_base64 && (
                    <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                      <img src={selectedItem.image_base64} alt={selectedItem.name || selectedItem.title} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '10px' }} />
                    </div>
                  )}
                  {Object.keys(selectedItem).filter(key => !['id', 'type', 'image_base64', 'image_mime_type', 'image_url'].includes(key)).map(key => (
                    <div key={key} style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.85rem', color: '#0B3B2F', textTransform: 'capitalize' }}>{key.replace('_', ' ')}</label>
                      <div style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #e0e0e0', background: '#f9f9f9', color: '#333', fontSize: '0.9rem' }}>
                        {key === 'category' ? (
                          <span style={{
                            background: getCategoryColor(selectedItem[key]),
                            color: 'white',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem'
                          }}>{selectedItem[key]}</span>
                        ) : key === 'rating' ? (
                          getRatingStars(selectedItem[key])
                        ) : (
                          typeof selectedItem[key] === 'object' ? JSON.stringify(selectedItem[key]) : selectedItem[key]
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button onClick={closeModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer' }}>Close</button>
                    <button onClick={() => openEditModal(selectedItem, selectedItem.type)} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
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
              <h2 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.3rem' }}>
                Add New {activeTab === 'missions' ? 'Mission' : activeTab.replace('-', ' ').slice(0, -1)}
              </h2>
            </div>
            
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {/* Leader Form */}
              {activeTab === 'leaders' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Image</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'leader')} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                    {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '80px', marginTop: '0.5rem', borderRadius: '50%' }} />}
                  </div>
                  <input type="text" placeholder="Name *" value={newLeader.name} onChange={(e) => setNewLeader({...newLeader, name: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }} />
                  <input type="text" placeholder="Role *" value={newLeader.role} onChange={(e) => setNewLeader({...newLeader, role: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }} />
                  <textarea placeholder="Bio" value={newLeader.bio} onChange={(e) => setNewLeader({...newLeader, bio: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem', minHeight: '80px' }} />
                  <textarea placeholder="Full Bio" value={newLeader.full_bio} onChange={(e) => setNewLeader({...newLeader, full_bio: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem', minHeight: '100px' }} />
                  <input type="text" placeholder="LinkedIn URL" value={newLeader.linkedin} onChange={(e) => setNewLeader({...newLeader, linkedin: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }} />
                  <input type="text" placeholder="Twitter URL" value={newLeader.twitter} onChange={(e) => setNewLeader({...newLeader, twitter: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }} />
                </>
              )}

              {/* Mission Form */}
              {activeTab === 'missions' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Image</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'mission')} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                    {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '80px', marginTop: '0.5rem', borderRadius: '10px' }} />}
                  </div>
                  <input type="text" placeholder="Title *" value={newMission.title} onChange={(e) => setNewMission({...newMission, title: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }} />
                  <select value={newMission.category} onChange={(e) => setNewMission({...newMission, category: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }}>
                    <option value="environment">Environment</option>
                    <option value="leadership">Leadership</option>
                  </select>
                  <textarea placeholder="Description *" value={newMission.description} onChange={(e) => setNewMission({...newMission, description: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem', minHeight: '100px' }} />
                </>
              )}

              {/* Testimonial Form */}
              {activeTab === 'testimonials' && (
                <>
                  <textarea placeholder="Testimonial Text *" value={newTestimonial.text} onChange={(e) => setNewTestimonial({...newTestimonial, text: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem', minHeight: '100px' }} />
                  <input type="text" placeholder="Author *" value={newTestimonial.author} onChange={(e) => setNewTestimonial({...newTestimonial, author: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }} />
                  <input type="text" placeholder="Role" value={newTestimonial.role} onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }} />
                  <input type="number" placeholder="Rating (1-5)" value={newTestimonial.rating} onChange={(e) => setNewTestimonial({...newTestimonial, rating: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }} />
                  <input type="date" value={newTestimonial.date} onChange={(e) => setNewTestimonial({...newTestimonial, date: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }} />
                </>
              )}

              {/* Blog Post Form */}
              {activeTab === 'blog-posts' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Image</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'blog')} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                    {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '80px', marginTop: '0.5rem', borderRadius: '10px' }} />}
                  </div>
                  <input type="text" placeholder="Title *" value={newBlogPost.title} onChange={(e) => setNewBlogPost({...newBlogPost, title: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }} />
                  <input type="date" value={newBlogPost.date} onChange={(e) => setNewBlogPost({...newBlogPost, date: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }} />
                  <input type="text" placeholder="Read Time" value={newBlogPost.read_time} onChange={(e) => setNewBlogPost({...newBlogPost, read_time: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }} />
                  <textarea placeholder="Content" value={newBlogPost.content} onChange={(e) => setNewBlogPost({...newBlogPost, content: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem', minHeight: '150px' }} />
                </>
              )}

              {/* Statistic Form */}
              {activeTab === 'statistics' && (
                <>
                  <input type="text" placeholder="Label *" value={newStatistic.label} onChange={(e) => setNewStatistic({...newStatistic, label: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }} />
                  <input type="number" placeholder="Value" value={newStatistic.value} onChange={(e) => setNewStatistic({...newStatistic, value: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }} />
                  <input type="text" placeholder="Icon (FontAwesome class)" value={newStatistic.icon} onChange={(e) => setNewStatistic({...newStatistic, icon: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }} />
                  <input type="text" placeholder="Suffix" value={newStatistic.suffix} onChange={(e) => setNewStatistic({...newStatistic, suffix: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }} />
                </>
              )}
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={closeAddModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleAddItem} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer' }}>Add {activeTab === 'missions' ? 'Mission' : activeTab.replace('-', ' ').slice(0, -1)}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInScale {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
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

export default AdminLeadership;