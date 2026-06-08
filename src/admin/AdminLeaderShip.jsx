import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminLeadership = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [leaders, setLeaders] = useState([]);
  const [missions, setMissions] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [statistics, setStatistics] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState({});
  const [activeTab, setActiveTab] = useState('leaders');
  
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [editImagePreview, setEditImagePreview] = useState('');
  
  const [newLeader, setNewLeader] = useState({ name: '', role: '', bio: '', full_bio: '', linkedin: '', twitter: '', image_base64: '', image_mime_type: 'image/jpeg', order: 0 });
  const [newMission, setNewMission] = useState({ title: '', category: 'environment', description: '', image_base64: '', image_mime_type: 'image/jpeg', order: 0 });
  const [newTestimonial, setNewTestimonial] = useState({ text: '', author: '', role: '', rating: 5, date: new Date().toISOString().split('T')[0], order: 0 });
  const [newBlogPost, setNewBlogPost] = useState({ title: '', date: new Date().toISOString().split('T')[0], read_time: '5 min read', content: '', image_base64: '', image_mime_type: 'image/jpeg', order: 0 });
  const [newStatistic, setNewStatistic] = useState({ label: '', value: 0, icon: 'fas fa-chart-line', suffix: '+', order: 0 });

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  useEffect(() => {
    AOS.init({ duration: 500, once: true });
    if (location.state?.activeTab) setActiveTab(location.state.activeTab);
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchLeaders(), fetchMissions(), fetchTestimonials(), fetchBlogPosts(), fetchStatistics()]);
    setLoading(false);
  };

  const fetchLeaders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/leaders/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLeaders(Array.isArray(data) ? data : (data.data || data.results || []));
      setErrorDetails(prev => ({ ...prev, leaders: null }));
    } catch (err) {
      setErrorDetails(prev => ({ ...prev, leaders: err.message }));
      setLeaders([]);
    }
  };

  const fetchMissions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/missions/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMissions(Array.isArray(data) ? data : (data.data || data.results || []));
      setErrorDetails(prev => ({ ...prev, missions: null }));
    } catch (err) {
      setErrorDetails(prev => ({ ...prev, missions: err.message }));
      setMissions([]);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/testimonials/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data : (data.data || data.results || []));
      setErrorDetails(prev => ({ ...prev, testimonials: null }));
    } catch (err) {
      setErrorDetails(prev => ({ ...prev, testimonials: err.message }));
      setTestimonials([]);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/blog-posts/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setBlogPosts(Array.isArray(data) ? data : (data.data || data.results || []));
      setErrorDetails(prev => ({ ...prev, blogPosts: null }));
    } catch (err) {
      setErrorDetails(prev => ({ ...prev, blogPosts: err.message }));
      setBlogPosts([]);
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/statistics/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStatistics(Array.isArray(data) ? data : (data.data || data.results || []));
      setErrorDetails(prev => ({ ...prev, statistics: null }));
    } catch (err) {
      setErrorDetails(prev => ({ ...prev, statistics: err.message }));
      setStatistics([]);
    }
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => { const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => resolve(reader.result); reader.onerror = reject; });

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      const base64 = await fileToBase64(file);
      if (type === 'leader') setNewLeader(prev => ({ ...prev, image_base64: base64, image_mime_type: file.type }));
      else if (type === 'mission') setNewMission(prev => ({ ...prev, image_base64: base64, image_mime_type: file.type }));
      else if (type === 'blog') setNewBlogPost(prev => ({ ...prev, image_base64: base64, image_mime_type: file.type }));
    }
  };

  const handleEditImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImagePreview(URL.createObjectURL(file));
      const base64 = await fileToBase64(file);
      setEditingItem(prev => ({ ...prev, image_base64: base64, image_mime_type: file.type }));
    }
  };

  const openModal = (item, type) => { setSelectedItem({ ...item, type }); setIsEditMode(false); setShowModal(true); document.body.style.overflow = 'hidden'; };
  const closeModal = () => { setShowModal(false); setSelectedItem(null); setIsEditMode(false); setEditingItem(null); setEditImagePreview(''); document.body.style.overflow = 'unset'; };
  const openEditModal = (item, type) => { setEditingItem({ ...item, type }); setIsEditMode(true); setShowModal(true); document.body.style.overflow = 'hidden'; if (item.image_base64) setEditImagePreview(item.image_base64); };
  const openAddModal = (type) => { setActiveTab(type); setShowAddModal(true); document.body.style.overflow = 'hidden'; };
  const closeAddModal = () => { setShowAddModal(false); resetForms(); setImagePreview(''); document.body.style.overflow = 'unset'; };

  const resetForms = () => {
    setNewLeader({ name: '', role: '', bio: '', full_bio: '', linkedin: '', twitter: '', image_base64: '', image_mime_type: 'image/jpeg', order: 0 });
    setNewMission({ title: '', category: 'environment', description: '', image_base64: '', image_mime_type: 'image/jpeg', order: 0 });
    setNewTestimonial({ text: '', author: '', role: '', rating: 5, date: new Date().toISOString().split('T')[0], order: 0 });
    setNewBlogPost({ title: '', date: new Date().toISOString().split('T')[0], read_time: '5 min read', content: '', image_base64: '', image_mime_type: 'image/jpeg', order: 0 });
    setNewStatistic({ label: '', value: 0, icon: 'fas fa-chart-line', suffix: '+', order: 0 });
  };

  const handleAddItem = async () => {
    let url = '', body = {}, refreshFn = null, successMsg = '';
    if (activeTab === 'leaders') { url = `${API_BASE_URL}/leaders/`; body = newLeader; refreshFn = fetchLeaders; successMsg = 'Leader added!'; }
    else if (activeTab === 'missions') { url = `${API_BASE_URL}/missions/`; body = newMission; refreshFn = fetchMissions; successMsg = 'Mission added!'; }
    else if (activeTab === 'testimonials') { url = `${API_BASE_URL}/testimonials/`; body = newTestimonial; refreshFn = fetchTestimonials; successMsg = 'Testimonial added!'; }
    else if (activeTab === 'blog-posts') { url = `${API_BASE_URL}/blog-posts/`; body = newBlogPost; refreshFn = fetchBlogPosts; successMsg = 'Blog post added!'; }
    else if (activeTab === 'statistics') { url = `${API_BASE_URL}/statistics/`; body = newStatistic; refreshFn = fetchStatistics; successMsg = 'Statistic added!'; }
    
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { await refreshFn(); setSuccessMessage(successMsg); setShowSuccess(true); setTimeout(() => setShowSuccess(false), 3000); closeAddModal(); }
      else { const err = await res.json(); alert(err.error || 'Failed to add'); }
    } catch (err) { alert('Network error'); }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    let url = '', refreshFn = null, successMsg = '';
    if (editingItem.type === 'leaders') { url = `${API_BASE_URL}/leaders/${editingItem.id}/`; refreshFn = fetchLeaders; successMsg = 'Leader updated!'; }
    else if (editingItem.type === 'missions') { url = `${API_BASE_URL}/missions/${editingItem.id}/`; refreshFn = fetchMissions; successMsg = 'Mission updated!'; }
    else if (editingItem.type === 'testimonials') { url = `${API_BASE_URL}/testimonials/${editingItem.id}/`; refreshFn = fetchTestimonials; successMsg = 'Testimonial updated!'; }
    else if (editingItem.type === 'blog-posts') { url = `${API_BASE_URL}/blog-posts/${editingItem.id}/`; refreshFn = fetchBlogPosts; successMsg = 'Blog post updated!'; }
    else if (editingItem.type === 'statistics') { url = `${API_BASE_URL}/statistics/${editingItem.id}/`; refreshFn = fetchStatistics; successMsg = 'Statistic updated!'; }
    
    const { type, ...updateData } = editingItem;
    try {
      const res = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updateData) });
      if (res.ok) { await refreshFn(); setSuccessMessage(successMsg); setShowSuccess(true); setTimeout(() => setShowSuccess(false), 3000); closeModal(); }
      else { const err = await res.json(); alert(err.error || 'Failed to update'); }
    } catch (err) { alert('Network error'); }
  };

  const handleDelete = async (item, type) => {
    if (!window.confirm(`Delete this ${type.slice(0, -1)}?`)) return;
    let url = '', refreshFn = null, successMsg = '';
    if (type === 'leaders') { url = `${API_BASE_URL}/leaders/${item.id}/`; refreshFn = fetchLeaders; successMsg = 'Leader deleted!'; }
    else if (type === 'missions') { url = `${API_BASE_URL}/missions/${item.id}/`; refreshFn = fetchMissions; successMsg = 'Mission deleted!'; }
    else if (type === 'testimonials') { url = `${API_BASE_URL}/testimonials/${item.id}/`; refreshFn = fetchTestimonials; successMsg = 'Testimonial deleted!'; }
    else if (type === 'blog-posts') { url = `${API_BASE_URL}/blog-posts/${item.id}/`; refreshFn = fetchBlogPosts; successMsg = 'Blog post deleted!'; }
    else if (type === 'statistics') { url = `${API_BASE_URL}/statistics/${item.id}/`; refreshFn = fetchStatistics; successMsg = 'Statistic deleted!'; }
    
    try {
      const res = await fetch(url, { method: 'DELETE' });
      if (res.ok) { await refreshFn(); setSuccessMessage(successMsg); setShowSuccess(true); setTimeout(() => setShowSuccess(false), 3000); closeModal(); }
      else { const err = await res.json(); alert(err.error || 'Failed to delete'); }
    } catch (err) { alert('Network error'); }
  };

  const getCategoryColor = (cat) => cat === 'environment' ? '#4caf50' : '#2196F3';
  const getRatingStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

  const renderTable = (items, type, columns) => {
    if (errorDetails[type]) return <div style={{ textAlign: 'center', padding: '2rem', color: '#d32f2f' }}><i className="fas fa-exclamation-triangle"></i> Failed to load</div>;
    if (!items.length) return <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}><i className="fas fa-inbox"></i> No {type} found</div>;
    
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
          <thead><tr style={{ borderBottom: '1px solid #e0e0e0' }}>{columns.map(col => <th key={col.key} style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>{col.label}</th>)}<th style={{ textAlign: 'center', padding: '0.5rem', color: '#666' }}>Actions</th></tr></thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id || idx} style={{ borderBottom: '1px solid #f0f0f0' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(249,199,79,0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                {columns.map(col => <td key={col.key} style={{ padding: '0.5rem' }}>{col.render ? col.render(item) : (item[col.key] || '-')}</td>)}
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                  <i className="fas fa-eye" style={{ color: '#0B3B2F', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.8rem' }} onClick={() => openModal(item, type)}></i>
                  <i className="fas fa-edit" style={{ color: '#2196F3', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.8rem' }} onClick={() => openEditModal(item, type)}></i>
                  <i className="fas fa-trash" style={{ color: '#d32f2f', cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => handleDelete(item, type)}></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
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

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      <style>{`
        @keyframes fadeInScale { from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .modal-content { animation: slideInUp 0.3s ease; }
        .modal-overlay { animation: fadeIn 0.3s ease; }
        .modal-content::-webkit-scrollbar { width: 4px; }
        .modal-content::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 2px; }
        .modal-content::-webkit-scrollbar-thumb { background: #F9C74F; border-radius: 2px; }
        @media (max-width: 768px) { .modal-content { max-width: 95% !important; } }
      `}</style>

      {/* Success Alert */}
      {showSuccess && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999, animation: 'fadeInScale 0.3s ease' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '1rem', textAlign: 'center', minWidth: '200px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
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
            <h1 style={{ fontSize: '1.3rem', margin: 0 }}><i className="fas fa-users-cog" style={{ marginRight: '0.4rem', color: '#F9C74F' }}></i>Content</h1>
          </div>
          <button onClick={() => openAddModal(activeTab)} style={{ background: '#F9C74F', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '20px', color: '#0B3B2F', fontWeight: 600, fontSize: '0.7rem', cursor: 'pointer' }}><i className="fas fa-plus"></i> Add New</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1rem', flexWrap: 'wrap', borderBottom: '1px solid #e0e0e0' }}>
          {[
            { id: 'leaders', label: 'Leaders', icon: 'fas fa-users', count: leaders.length },
            { id: 'missions', label: 'Missions', icon: 'fas fa-rocket', count: missions.length },
            { id: 'testimonials', label: 'Testimonials', icon: 'fas fa-star', count: testimonials.length },
            { id: 'blog-posts', label: 'Blog', icon: 'fas fa-blog', count: blogPosts.length },
            { id: 'statistics', label: 'Stats', icon: 'fas fa-chart-line', count: statistics.length }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '0.4rem 1rem', background: activeTab === tab.id ? '#0B3B2F' : 'transparent', color: activeTab === tab.id ? 'white' : '#666',
              border: 'none', borderRadius: '20px 20px 0 0', cursor: 'pointer', fontWeight: 600, fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem'
            }}>
              <i className={tab.icon} style={{ fontSize: '0.7rem' }}></i>
              {tab.label}
              {tab.count > 0 && <span style={{ background: activeTab === tab.id ? '#F9C74F' : '#e0e0e0', color: activeTab === tab.id ? '#0B3B2F' : '#666', borderRadius: '10px', padding: '0.1rem 0.4rem', fontSize: '0.6rem' }}>{tab.count}</span>}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '0.8rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          {activeTab === 'leaders' && renderTable(leaders, 'leaders', [
            { key: 'name', label: 'Name' },
            { key: 'role', label: 'Role' },
            { key: 'order', label: 'Order', render: (item) => item.order }
          ])}
          {activeTab === 'missions' && renderTable(missions, 'missions', [
            { key: 'title', label: 'Title' },
            { key: 'category', label: 'Category', render: (item) => <span style={{ background: getCategoryColor(item.category), color: 'white', padding: '0.15rem 0.4rem', borderRadius: '10px', fontSize: '0.6rem' }}>{item.category}</span> },
            { key: 'order', label: 'Order', render: (item) => item.order }
          ])}
          {activeTab === 'testimonials' && renderTable(testimonials, 'testimonials', [
            { key: 'author', label: 'Author' },
            { key: 'text', label: 'Text', render: (item) => item.text?.substring(0, 40) + '...' },
            { key: 'rating', label: 'Rating', render: (item) => getRatingStars(item.rating || 0) }
          ])}
          {activeTab === 'blog-posts' && renderTable(blogPosts, 'blog-posts', [
            { key: 'title', label: 'Title' },
            { key: 'date', label: 'Date' },
            { key: 'read_time', label: 'Read Time' }
          ])}
          {activeTab === 'statistics' && renderTable(statistics, 'statistics', [
            { key: 'label', label: 'Label' },
            { key: 'value', label: 'Value' },
            { key: 'suffix', label: 'Suffix' }
          ])}
        </div>
      </div>

      {/* View/Edit Modal */}
      {showModal && selectedItem && (
        <div className="modal-overlay" onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', maxWidth: '450px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', color: 'white', zIndex: 10 }}><i className="fas fa-times"></i></button>
            
            <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '1rem', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={isEditMode ? "fas fa-edit" : "fas fa-info-circle"} style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1rem' }}>{isEditMode ? 'Edit' : 'View'} {selectedItem.type === 'missions' ? 'Mission' : selectedItem.type.slice(0, -1)}</h2>
            </div>
            
            <div style={{ padding: '1rem', overflowY: 'auto', flex: 1 }}>
              {isEditMode && editingItem ? (
                <>
                  {['leaders', 'missions', 'blog-posts'].includes(editingItem.type) && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      {editImagePreview && <img src={editImagePreview} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.3rem' }} />}
                      <input type="file" accept="image/*" onChange={handleEditImageChange} style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }} />
                    </div>
                  )}
                  {Object.keys(editingItem).filter(k => !['id', 'type', 'image_url', 'image_base64', 'image_mime_type', 'created_at', 'updated_at'].includes(k)).map(key => (
                    <div key={key} style={{ marginBottom: '0.6rem' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>{key.replace('_', ' ')}</label>
                      {key === 'category' ? (
                        <select name={key} value={editingItem[key] || ''} onChange={(e) => setEditingItem({ ...editingItem, [key]: e.target.value })} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }}>
                          <option value="environment">Environment</option><option value="leadership">Leadership</option>
                        </select>
                      ) : (
                        (typeof editingItem[key] === 'string' && editingItem[key]?.length > 80) ? (
                          <textarea value={editingItem[key] || ''} onChange={(e) => setEditingItem({ ...editingItem, [key]: e.target.value })} rows="2" style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }} />
                        ) : (
                          <input type={['order', 'value', 'rating'].includes(key) ? 'number' : 'text'} value={editingItem[key] || ''} onChange={(e) => setEditingItem({ ...editingItem, [key]: e.target.value })} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd' }} />
                        )
                      )}
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
                    <button onClick={closeModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.4rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleUpdateItem} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.4rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Save</button>
                  </div>
                </>
              ) : (
                <>
                  {selectedItem.image_base64 && <div style={{ textAlign: 'center', marginBottom: '0.8rem' }}><img src={selectedItem.image_base64} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px' }} /></div>}
                  {Object.keys(selectedItem).filter(k => !['id', 'type', 'image_base64', 'image_mime_type', 'image_url'].includes(k)).map(key => (
                    <div key={key} style={{ background: '#f9fbf7', borderRadius: '8px', padding: '0.4rem', marginBottom: '0.4rem' }}>
                      <strong style={{ fontSize: '0.65rem', color: '#0B3B2F' }}>{key.replace('_', ' ')}:</strong>
                      <span style={{ fontSize: '0.7rem', display: 'block', marginTop: '0.2rem' }}>
                        {key === 'category' ? <span style={{ background: getCategoryColor(selectedItem[key]), color: 'white', padding: '0.1rem 0.3rem', borderRadius: '8px', fontSize: '0.6rem' }}>{selectedItem[key]}</span>
                        : key === 'rating' ? getRatingStars(selectedItem[key])
                        : selectedItem[key] || '-'}
                      </span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
                    <button onClick={closeModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.4rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Close</button>
                    <button onClick={() => openEditModal(selectedItem, selectedItem.type)} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.4rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Edit</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Modal - Compact */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeAddModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', maxWidth: '450px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <button onClick={closeAddModal} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', color: 'white', zIndex: 10 }}><i className="fas fa-times"></i></button>
            
            <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', padding: '1rem', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-plus-circle" style={{ fontSize: '1.5rem', color: '#0B3B2F' }}></i></div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1rem' }}>Add New {activeTab === 'missions' ? 'Mission' : activeTab.replace('-', ' ').slice(0, -1)}</h2>
            </div>
            
            <div style={{ padding: '1rem', overflowY: 'auto', flex: 1 }}>
              {activeTab === 'leaders' && (
                <>
                  <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'leader')} style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '50px', borderRadius: '50%', marginBottom: '0.5rem' }} />}
                  <input type="text" placeholder="Name *" value={newLeader.name} onChange={(e) => setNewLeader({...newLeader, name: e.target.value})} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <input type="text" placeholder="Role *" value={newLeader.role} onChange={(e) => setNewLeader({...newLeader, role: e.target.value})} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <textarea placeholder="Bio" value={newLeader.bio} onChange={(e) => setNewLeader({...newLeader, bio: e.target.value})} rows="2" style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <textarea placeholder="Full Bio" value={newLeader.full_bio} onChange={(e) => setNewLeader({...newLeader, full_bio: e.target.value})} rows="3" style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                </>
              )}
              {activeTab === 'missions' && (
                <>
                  <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'mission')} style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '50px', borderRadius: '8px', marginBottom: '0.5rem' }} />}
                  <input type="text" placeholder="Title *" value={newMission.title} onChange={(e) => setNewMission({...newMission, title: e.target.value})} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <select value={newMission.category} onChange={(e) => setNewMission({...newMission, category: e.target.value})} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }}><option value="environment">Environment</option><option value="leadership">Leadership</option></select>
                  <textarea placeholder="Description *" value={newMission.description} onChange={(e) => setNewMission({...newMission, description: e.target.value})} rows="3" style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                </>
              )}
              {activeTab === 'testimonials' && (
                <>
                  <textarea placeholder="Testimonial Text *" value={newTestimonial.text} onChange={(e) => setNewTestimonial({...newTestimonial, text: e.target.value})} rows="3" style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <input type="text" placeholder="Author *" value={newTestimonial.author} onChange={(e) => setNewTestimonial({...newTestimonial, author: e.target.value})} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <input type="text" placeholder="Role" value={newTestimonial.role} onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <input type="number" placeholder="Rating (1-5)" value={newTestimonial.rating} onChange={(e) => setNewTestimonial({...newTestimonial, rating: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                </>
              )}
              {activeTab === 'blog-posts' && (
                <>
                  <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'blog')} style={{ width: '100%', padding: '0.3rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '50px', borderRadius: '8px', marginBottom: '0.5rem' }} />}
                  <input type="text" placeholder="Title *" value={newBlogPost.title} onChange={(e) => setNewBlogPost({...newBlogPost, title: e.target.value})} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <input type="date" value={newBlogPost.date} onChange={(e) => setNewBlogPost({...newBlogPost, date: e.target.value})} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <input type="text" placeholder="Read Time" value={newBlogPost.read_time} onChange={(e) => setNewBlogPost({...newBlogPost, read_time: e.target.value})} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <textarea placeholder="Content" value={newBlogPost.content} onChange={(e) => setNewBlogPost({...newBlogPost, content: e.target.value})} rows="4" style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                </>
              )}
              {activeTab === 'statistics' && (
                <>
                  <input type="text" placeholder="Label *" value={newStatistic.label} onChange={(e) => setNewStatistic({...newStatistic, label: e.target.value})} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <input type="number" placeholder="Value" value={newStatistic.value} onChange={(e) => setNewStatistic({...newStatistic, value: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <input type="text" placeholder="Icon" value={newStatistic.icon} onChange={(e) => setNewStatistic({...newStatistic, icon: e.target.value})} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                  <input type="text" placeholder="Suffix" value={newStatistic.suffix} onChange={(e) => setNewStatistic({...newStatistic, suffix: e.target.value})} style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '0.5rem' }} />
                </>
              )}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
                <button onClick={closeAddModal} style={{ flex: 1, background: '#f0f0f0', border: 'none', padding: '0.4rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleAddItem} style={{ flex: 1, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.4rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer' }}>Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeadership;