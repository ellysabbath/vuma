import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [filters, setFilters] = useState({
    year: '',
    status: '',
    search: ''
  });

  // Initial state for new report
  const [newReport, setNewReport] = useState({
    organization_name: 'Vuma Foundation',
    report_year: new Date().getFullYear(),
    tagline: '',
    cover_image: null,
    executive_name: '',
    executive_title: 'Executive Director',
    executive_message: '',
    executive_signature: null,
    message_date: new Date().toISOString().split('T')[0],
    status: 'draft',
    is_featured: false,
    impact_metrics: [],
    programs: [],
    stories: [],
    incomes: [],
    expenditures: [],
    partners: [],
    board_members: [],
    gallery_images: []
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchReports();
  }, []);

  // Fetch all reports
  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      let url = 'https://vuma.pythonanywhere.com/api/annual-reports/';
      const params = new URLSearchParams();
      if (filters.year) params.append('year', filters.year);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setReports(data.data);
      } else {
        setError('Failed to load reports');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle input changes for new report
  const handleNewReportChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewReport({
      ...newReport,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle nested field changes for new report
  const handleNestedChange = (section, index, field, value) => {
    const updatedSection = [...newReport[section]];
    updatedSection[index] = { ...updatedSection[index], [field]: value };
    setNewReport({
      ...newReport,
      [section]: updatedSection
    });
  };

  // Add new item to nested array
  const addNestedItem = (section, template) => {
    setNewReport({
      ...newReport,
      [section]: [...newReport[section], template]
    });
  };

  // Remove nested item
  const removeNestedItem = (section, index) => {
    const updatedSection = newReport[section].filter((_, i) => i !== index);
    setNewReport({
      ...newReport,
      [section]: updatedSection
    });
  };

  // Check if report exists
  const checkExistingReport = async (orgName, year) => {
    try {
      const response = await fetch(
        `https://vuma.pythonanywhere.com/api/annual-reports/?year=${year}&search=${encodeURIComponent(orgName)}`
      );
      const data = await response.json();
      return data.success && data.data && data.data.length > 0 ? data.data[0] : null;
    } catch (error) {
      return null;
    }
  };

  // Create new report
  const handleCreateReport = async () => {
    if (!newReport.organization_name || !newReport.report_year) {
      alert('Organization name and year are required');
      return;
    }

    if (!newReport.executive_name) {
      alert('Executive name is required');
      return;
    }

    setIsAdding(true);
    try {
      const existingReport = await checkExistingReport(
        newReport.organization_name,
        newReport.report_year
      );

      if (existingReport) {
        const confirmUpdate = window.confirm(
          `A report for "${newReport.organization_name}" in ${newReport.report_year} already exists.\n\n` +
          `Would you like to update the existing report instead?`
        );
        
        if (confirmUpdate) {
          setIsAdding(false);
          closeAddModal();
          const detailResponse = await fetch(
            `https://vuma.pythonanywhere.com/api/annual-reports/${existingReport.id}/`
          );
          const detailData = await detailResponse.json();
          if (detailData.success) {
            openEditModal(detailData.data);
          }
          return;
        } else {
          setIsAdding(false);
          return;
        }
      }

      const reportData = {
        organization_name: newReport.organization_name,
        report_year: parseInt(newReport.report_year),
        tagline: newReport.tagline || '',
        executive_name: newReport.executive_name || '',
        executive_title: newReport.executive_title || 'Executive Director',
        executive_message: newReport.executive_message || '',
        message_date: newReport.message_date || new Date().toISOString().split('T')[0],
        status: newReport.status || 'draft',
        is_featured: newReport.is_featured || false,
        impact_metrics: newReport.impact_metrics || [],
        programs: newReport.programs || [],
        stories: newReport.stories || [],
        incomes: newReport.incomes || [],
        expenditures: newReport.expenditures || [],
        partners: newReport.partners || [],
        board_members: newReport.board_members || [],
        gallery_images: newReport.gallery_images || []
      };

      const response = await fetch('https://vuma.pythonanywhere.com/api/annual-reports/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchReports();
        setSuccessMessage('Annual Report created successfully!');
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          closeAddModal();
        }, 2000);
      } else {
        console.error('Server errors:', data.errors);
        if (data.errors && data.errors.non_field_errors) {
          alert(data.errors.non_field_errors.join('\n'));
        } else {
          alert('Failed to create report. Please check all fields.');
        }
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
      setIsAdding(false);
    }
  };

  // Open edit modal
  const openEditModal = (report) => {
    // Deep clone the report to avoid reference issues
    const clonedReport = JSON.parse(JSON.stringify(report));
    setEditingReport(clonedReport);
    setShowEditModal(true);
    document.body.style.overflow = 'hidden';
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingReport(null);
    setIsUpdating(false);
    document.body.style.overflow = 'unset';
  };

  // Handle edit input changes
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingReport({
      ...editingReport,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle edit nested changes - FIXED: Properly update nested arrays
  const handleEditNestedChange = (section, index, field, value) => {
    const updatedSection = [...editingReport[section]];
    updatedSection[index] = { ...updatedSection[index], [field]: value };
    setEditingReport({
      ...editingReport,
      [section]: updatedSection
    });
  };

  // Add nested item in edit - FIXED: Create new array with proper spread
  const addEditNestedItem = (section, template) => {
    const currentItems = editingReport[section] || [];
    setEditingReport({
      ...editingReport,
      [section]: [...currentItems, template]
    });
  };

  // Remove nested item in edit - FIXED: Create new array without the removed item
  const removeEditNestedItem = (section, index) => {
    const currentItems = editingReport[section] || [];
    const updatedSection = currentItems.filter((_, i) => i !== index);
    setEditingReport({
      ...editingReport,
      [section]: updatedSection
    });
  };

  // Update report
  const handleUpdateReport = async () => {
    if (!editingReport.organization_name || !editingReport.report_year) {
      alert('Organization name and year are required');
      return;
    }

    if (!editingReport.executive_name) {
      alert('Executive name is required');
      return;
    }

    setIsUpdating(true);
    try {
      const cleanData = {
        organization_name: editingReport.organization_name,
        report_year: parseInt(editingReport.report_year),
        tagline: editingReport.tagline || '',
        executive_name: editingReport.executive_name || '',
        executive_title: editingReport.executive_title || 'Executive Director',
        executive_message: editingReport.executive_message || '',
        message_date: editingReport.message_date || new Date().toISOString().split('T')[0],
        status: editingReport.status || 'draft',
        is_featured: editingReport.is_featured || false,
        impact_metrics: editingReport.impact_metrics || [],
        programs: editingReport.programs || [],
        stories: editingReport.stories || [],
        incomes: editingReport.incomes || [],
        expenditures: editingReport.expenditures || [],
        partners: editingReport.partners || [],
        board_members: editingReport.board_members || [],
        gallery_images: editingReport.gallery_images || []
      };

      const response = await fetch(`https://vuma.pythonanywhere.com/api/annual-reports/${editingReport.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchReports();
        setSuccessMessage('Annual Report updated successfully!');
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          closeEditModal();
        }, 2000);
      } else {
        console.error('Server errors:', data.errors);
        alert('Failed to update report. Please check all fields.');
        setIsUpdating(false);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
      setIsUpdating(false);
    }
  };

  // Delete report
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this annual report? This action cannot be undone.')) return;

    setDeletingId(id);
    setIsDeleting(true);
    try {
      const response = await fetch(`https://vuma.pythonanywhere.com/api/annual-reports/${id}/`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        await fetchReports();
        setSuccessMessage('Annual Report deleted successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert(data.error || 'Failed to delete report');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  // Publish report
  const handlePublish = async (id) => {
    try {
      const response = await fetch(`https://vuma.pythonanywhere.com/api/annual-reports/${id}/publish/`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        await fetchReports();
        setSuccessMessage('Report published successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert(data.message || 'Failed to publish report');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  // Open view modal
  const openViewModal = (report) => {
    setSelectedReport(report);
    setShowViewModal(true);
    document.body.style.overflow = 'hidden';
  };

  // Close view modal
  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedReport(null);
    document.body.style.overflow = 'unset';
  };

  // Open add modal
  const openAddModal = () => {
    setShowAddModal(true);
    document.body.style.overflow = 'hidden';
  };

  // Close add modal
  const closeAddModal = () => {
    setShowAddModal(false);
    setNewReport({
      organization_name: 'Vuma Foundation',
      report_year: new Date().getFullYear(),
      tagline: '',
      cover_image: null,
      executive_name: '',
      executive_title: 'Executive Director',
      executive_message: '',
      executive_signature: null,
      message_date: new Date().toISOString().split('T')[0],
      status: 'draft',
      is_featured: false,
      impact_metrics: [],
      programs: [],
      stories: [],
      incomes: [],
      expenditures: [],
      partners: [],
      board_members: [],
      gallery_images: []
    });
    setIsAdding(false);
    document.body.style.overflow = 'unset';
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'draft': '#f59e0b',
      'published': '#10b981',
      'archived': '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  // Get status label
  const getStatusLabel = (status) => {
    const labels = {
      'draft': 'Draft',
      'published': 'Published',
      'archived': 'Archived'
    };
    return labels[status] || status;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>Loading annual reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
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
              background: '#10b981',
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
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1rem' }} onClick={() => navigate('/admin')}></i>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Annual Reports Management</h1>
          </div>
          <p style={{ fontSize: '0.813rem', opacity: 0.9, margin: 0 }}>Create and manage organization annual reports</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          
          {/* Filter and Add Section */}
          <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Search by organization or tagline..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && fetchReports()}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.813rem',
                    minWidth: '200px',
                    flex: 1
                  }}
                />
                <select
                  value={filters.year}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.813rem'
                  }}
                >
                  <option value="">All Years</option>
                  {[...Array(10)].map((_, i) => {
                    const year = new Date().getFullYear() - i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.813rem'
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                <button
                  onClick={fetchReports}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#0B3B2F',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.813rem',
                    fontWeight: 500,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#1a5c48'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#0B3B2F'}
                >
                  <i className="fas fa-search"></i> Filter
                </button>
              </div>
              <button
                onClick={openAddModal}
                style={{
                  padding: '0.5rem 1.25rem',
                  background: '#0B3B2F',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.813rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(11, 59, 47, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1a5c48';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(11, 59, 47, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#0B3B2F';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(11, 59, 47, 0.2)';
                }}
              >
                <i className="fas fa-plus"></i>
                New Report
              </button>
            </div>
          </div>

          {/* Reports Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.813rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Year</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Organization</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Income</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Views</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Downloads</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                      <i className="fas fa-file-alt" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}></i>
                      No annual reports found. Click "New Report" to get started.
                    </td>
                  </tr>
                ) : (
                  reports.map(report => (
                    <tr key={report.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s ease' }} 
                        onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'} 
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0B3B2F' }}>
                        {report.report_year}
                        {report.is_featured && (
                          <span style={{
                            marginLeft: '0.5rem',
                            fontSize: '0.6rem',
                            background: '#F9C74F',
                            color: '#0B3B2F',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '4px',
                            fontWeight: 600
                          }}>★ Featured</span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{report.organization_name}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          background: `${getStatusColor(report.status)}15`,
                          color: getStatusColor(report.status),
                          padding: '0.125rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.688rem',
                          fontWeight: 500,
                          display: 'inline-block'
                        }}>{getStatusLabel(report.status)}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>
                        {formatCurrency(report.total_income || 0)}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{report.view_count || 0}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{report.download_count || 0}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => openViewModal(report)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              color: '#0B3B2F',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.color = '#1a5c48'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.color = '#0B3B2F'; }}
                            title="View Report"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            onClick={() => openEditModal(report)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              color: '#3b82f6',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.color = '#2563eb'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.color = '#3b82f6'; }}
                            title="Edit Report"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          {report.status !== 'published' && (
                            <button
                              onClick={() => handlePublish(report.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.25rem',
                                color: '#10b981',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.color = '#059669'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.color = '#10b981'; }}
                              title="Publish Report"
                            >
                              <i className="fas fa-check-circle"></i>
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(report.id)}
                            disabled={isDeleting && deletingId === report.id}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: isDeleting && deletingId === report.id ? 'not-allowed' : 'pointer',
                              padding: '0.25rem',
                              color: '#ef4444',
                              opacity: isDeleting && deletingId === report.id ? 0.5 : 1,
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              if (!(isDeleting && deletingId === report.id)) {
                                e.currentTarget.style.transform = 'scale(1.2)';
                                e.currentTarget.style.color = '#dc2626';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!(isDeleting && deletingId === report.id)) {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.color = '#ef4444';
                              }
                            }}
                            title="Delete Report"
                          >
                            {isDeleting && deletingId === report.id ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fas fa-trash"></i>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Report Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeAddModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '20px', maxWidth: '800px', width: '100%',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={closeAddModal} style={{
              position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', border: 'none',
              width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
            ><i className="fas fa-times"></i></button>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', 
              padding: '1.25rem', 
              textAlign: 'center', 
              borderRadius: '20px 20px 0 0',
              flexShrink: 0
            }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-file-alt" style={{ fontSize: '1.25rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Create Annual Report</h2>
              <p style={{ color: '#F9C74F', fontSize: '0.85rem', margin: 0 }}>Fill in the details below to create a new annual report</p>
            </div>
            
            <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1, maxHeight: 'calc(90vh - 120px)' }}>
              {/* Basic Information Section */}
              <div style={{ 
                background: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '12px', 
                marginBottom: '1rem',
                borderLeft: '4px solid #0B3B2F'
              }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0B3B2F', marginBottom: '0.75rem' }}>
                  <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
                  Basic Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                      Organization Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      name="organization_name" 
                      value={newReport.organization_name} 
                      onChange={handleNewReportChange} 
                      placeholder="Enter organization name"
                      style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} 
                    />
                    <small style={{ fontSize: '0.7rem', color: '#64748b' }}>The organization that published this report</small>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                      Report Year <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="number" 
                      name="report_year" 
                      value={newReport.report_year} 
                      onChange={handleNewReportChange} 
                      placeholder="e.g., 2025"
                      style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} 
                    />
                    <small style={{ fontSize: '0.7rem', color: '#64748b' }}>The year this report covers</small>
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                    Tagline / Subtitle
                  </label>
                  <input 
                    type="text" 
                    name="tagline" 
                    value={newReport.tagline} 
                    onChange={handleNewReportChange} 
                    placeholder="e.g., Empowering Communities, Transforming Lives"
                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} 
                  />
                  <small style={{ fontSize: '0.7rem', color: '#64748b' }}>A short, inspiring phrase that summarizes the report</small>
                </div>
              </div>

              {/* Executive Message Section */}
              <div style={{ 
                background: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '12px', 
                marginBottom: '1rem',
                borderLeft: '4px solid #F9C74F'
              }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0B3B2F', marginBottom: '0.75rem' }}>
                  <i className="fas fa-user" style={{ marginRight: '0.5rem' }}></i>
                  Executive Message
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                      Executive Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      name="executive_name" 
                      value={newReport.executive_name} 
                      onChange={handleNewReportChange} 
                      placeholder="e.g., John Doe"
                      style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} 
                    />
                    <small style={{ fontSize: '0.7rem', color: '#64748b' }}>Full name of the executive</small>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                      Executive Title
                    </label>
                    <input 
                      type="text" 
                      name="executive_title" 
                      value={newReport.executive_title} 
                      onChange={handleNewReportChange} 
                      placeholder="e.g., Executive Director"
                      style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} 
                    />
                    <small style={{ fontSize: '0.7rem', color: '#64748b' }}>The executive's position/title</small>
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                    Executive Message <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea 
                    name="executive_message" 
                    value={newReport.executive_message} 
                    onChange={handleNewReportChange} 
                    rows="4" 
                    placeholder="Write a personal message from the executive director..."
                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px', resize: 'vertical' }} 
                  />
                  <small style={{ fontSize: '0.7rem', color: '#64748b' }}>A personal message from the executive director</small>
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                    Message Date
                  </label>
                  <input 
                    type="date" 
                    name="message_date" 
                    value={newReport.message_date} 
                    onChange={handleNewReportChange} 
                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} 
                  />
                  <small style={{ fontSize: '0.7rem', color: '#64748b' }}>Date of the executive message</small>
                </div>
              </div>

              {/* Status Section */}
              <div style={{ 
                background: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '12px', 
                marginBottom: '1rem',
                borderLeft: '4px solid #2196F3'
              }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0B3B2F', marginBottom: '0.75rem' }}>
                  <i className="fas fa-cog" style={{ marginRight: '0.5rem' }}></i>
                  Status & Settings
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                      Status <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select 
                      name="status" 
                      value={newReport.status} 
                      onChange={handleNewReportChange} 
                      style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    >
                      <option value="draft">Draft - Work in Progress</option>
                      <option value="published">Published - Ready for Public</option>
                      <option value="archived">Archived - Old/Inactive</option>
                    </select>
                    <small style={{ fontSize: '0.7rem', color: '#64748b' }}>Select the publication status of this report</small>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.5rem' }}>
                    <input 
                      type="checkbox" 
                      name="is_featured" 
                      checked={newReport.is_featured} 
                      onChange={handleNewReportChange} 
                      style={{ marginRight: '0.5rem', width: '18px', height: '18px' }} 
                    />
                    <label style={{ fontSize: '0.813rem', color: '#475569', fontWeight: 500 }}>
                      <i className="fas fa-star" style={{ color: '#F9C74F', marginRight: '0.25rem' }}></i>
                      Featured Report
                    </label>
                  </div>
                </div>
              </div>

              {/* Financial Data Section */}
              <div style={{ 
                background: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '12px', 
                marginBottom: '1rem',
                borderLeft: '4px solid #4caf50'
              }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0B3B2F', marginBottom: '0.75rem' }}>
                  <i className="fas fa-coins" style={{ marginRight: '0.5rem' }}></i>
                  Financial Data
                </h4>
                
                {/* Incomes */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                      <i className="fas fa-arrow-up" style={{ color: '#4caf50', marginRight: '0.25rem' }}></i>
                      Income Sources
                    </label>
                    <button
                      onClick={() => addNestedItem('incomes', { source: '', amount: 0, percentage: 0, order: 0 })}
                      style={{
                        padding: '0.25rem 0.75rem',
                        background: '#e8f5e9',
                        border: '1px solid #4caf50',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        color: '#2e7d32'
                      }}
                    >
                      <i className="fas fa-plus"></i> Add Income
                    </button>
                  </div>
                  {newReport.incomes.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>No income sources added. Click "Add Income" to add one.</p>
                  ) : (
                    newReport.incomes.map((item, index) => (
                      <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', alignItems: 'center', background: 'white', padding: '0.5rem', borderRadius: '6px' }}>
                        <div style={{ flex: 1 }}>
                          <input
                            type="text"
                            placeholder="Source name (e.g., Donations)"
                            value={item.source}
                            onChange={(e) => handleNestedChange('incomes', index, 'source', e.target.value)}
                            style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                          />
                        </div>
                        <div style={{ width: '120px' }}>
                          <input
                            type="number"
                            placeholder="Amount ($)"
                            value={item.amount}
                            onChange={(e) => handleNestedChange('incomes', index, 'amount', parseFloat(e.target.value) || 0)}
                            style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                          />
                        </div>
                        <div style={{ width: '80px' }}>
                          <input
                            type="number"
                            placeholder="%"
                            value={item.percentage}
                            onChange={(e) => handleNestedChange('incomes', index, 'percentage', parseFloat(e.target.value) || 0)}
                            style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                          />
                        </div>
                        <button
                          onClick={() => removeNestedItem('incomes', index)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#ffebee',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: '#d32f2f'
                          }}
                          title="Remove this income source"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))
                  )}
                  <small style={{ fontSize: '0.7rem', color: '#64748b' }}>Add all income sources and their amounts</small>
                </div>

                {/* Expenditures */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                      <i className="fas fa-arrow-down" style={{ color: '#ef4444', marginRight: '0.25rem' }}></i>
                      Expenditures
                    </label>
                    <button
                      onClick={() => addNestedItem('expenditures', { category: '', amount: 0, percentage: 0, order: 0, color: '#4caf50' })}
                      style={{
                        padding: '0.25rem 0.75rem',
                        background: '#fff3e0',
                        border: '1px solid #FF9800',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        color: '#e65100'
                      }}
                    >
                      <i className="fas fa-plus"></i> Add Expenditure
                    </button>
                  </div>
                  {newReport.expenditures.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>No expenditures added. Click "Add Expenditure" to add one.</p>
                  ) : (
                    newReport.expenditures.map((item, index) => (
                      <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', alignItems: 'center', background: 'white', padding: '0.5rem', borderRadius: '6px' }}>
                        <div style={{ flex: 1 }}>
                          <input
                            type="text"
                            placeholder="Category (e.g., Programs)"
                            value={item.category}
                            onChange={(e) => handleNestedChange('expenditures', index, 'category', e.target.value)}
                            style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                          />
                        </div>
                        <div style={{ width: '120px' }}>
                          <input
                            type="number"
                            placeholder="Amount ($)"
                            value={item.amount}
                            onChange={(e) => handleNestedChange('expenditures', index, 'amount', parseFloat(e.target.value) || 0)}
                            style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                          />
                        </div>
                        <div style={{ width: '80px' }}>
                          <input
                            type="number"
                            placeholder="%"
                            value={item.percentage}
                            onChange={(e) => handleNestedChange('expenditures', index, 'percentage', parseFloat(e.target.value) || 0)}
                            style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                          />
                        </div>
                        <button
                          onClick={() => removeNestedItem('expenditures', index)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#ffebee',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: '#d32f2f'
                          }}
                          title="Remove this expenditure"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))
                  )}
                  <small style={{ fontSize: '0.7rem', color: '#64748b' }}>Add all expenditure categories and their amounts</small>
                </div>
              </div>

              {/* Impact Metrics Section */}
              <div style={{ 
                background: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '12px', 
                marginBottom: '1rem',
                borderLeft: '4px solid #9C27B0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0B3B2F', margin: 0 }}>
                    <i className="fas fa-chart-bar" style={{ marginRight: '0.5rem' }}></i>
                    Impact Metrics
                  </h4>
                  <button
                    onClick={() => addNestedItem('impact_metrics', { icon: 'fa-users', value: '', label: '', order: 0 })}
                    style={{
                      padding: '0.25rem 0.75rem',
                      background: '#f3e5f5',
                      border: '1px solid #9C27B0',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      color: '#4a148c'
                    }}
                  >
                    <i className="fas fa-plus"></i> Add Metric
                  </button>
                </div>
                {newReport.impact_metrics.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>No impact metrics added. Click "Add Metric" to add one.</p>
                ) : (
                  newReport.impact_metrics.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', alignItems: 'center', background: 'white', padding: '0.5rem', borderRadius: '6px' }}>
                      <div style={{ width: '100px' }}>
                        <select
                          value={item.icon}
                          onChange={(e) => handleNestedChange('impact_metrics', index, 'icon', e.target.value)}
                          style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                        >
                          <option value="fa-users">Users</option>
                          <option value="fa-map-marker-alt">Communities</option>
                          <option value="fa-child">Children</option>
                          <option value="fa-female">Women</option>
                          <option value="fa-tint">Water</option>
                          <option value="fa-hands-helping">Volunteers</option>
                          <option value="fa-graduation-cap">Graduates</option>
                          <option value="fa-tree">Environment</option>
                          <option value="fa-hospital">Health</option>
                          <option value="fa-hand-holding-heart">Support</option>
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="text"
                          placeholder="Value (e.g., 25,000+)"
                          value={item.value}
                          onChange={(e) => handleNestedChange('impact_metrics', index, 'value', e.target.value)}
                          style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="text"
                          placeholder="Label (e.g., Beneficiaries)"
                          value={item.label}
                          onChange={(e) => handleNestedChange('impact_metrics', index, 'label', e.target.value)}
                          style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                        />
                      </div>
                      <button
                        onClick={() => removeNestedItem('impact_metrics', index)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          background: '#ffebee',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: '#d32f2f'
                        }}
                        title="Remove this metric"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))
                )}
                <small style={{ fontSize: '0.7rem', color: '#64748b' }}>Add key metrics that show your organization's impact</small>
              </div>

              {/* Info Note */}
              <div style={{ 
                padding: '0.75rem', 
                background: '#e3f2fd', 
                borderRadius: '8px', 
                fontSize: '0.8rem', 
                color: '#0d47a1',
                marginBottom: '1rem',
                border: '1px solid #bbdefb'
              }}>
                <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
                <strong>Note:</strong> Programs, stories, partners, and board members can be added after creating the report through the edit interface.
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button 
                  onClick={closeAddModal} 
                  style={{ 
                    flex: 1, 
                    background: '#f1f5f9', 
                    border: 'none', 
                    padding: '0.625rem', 
                    borderRadius: '8px', 
                    fontWeight: 500, 
                    cursor: 'pointer', 
                    fontSize: '0.813rem',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  disabled={isAdding}
                >
                  <i className="fas fa-times"></i> Cancel
                </button>
                <button 
                  onClick={handleCreateReport}
                  disabled={isAdding}
                  style={{ 
                    flex: 2, 
                    background: isAdding ? '#94a3b8' : '#0B3B2F', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.625rem', 
                    borderRadius: '8px', 
                    fontWeight: 600, 
                    cursor: isAdding ? 'not-allowed' : 'pointer', 
                    fontSize: '0.813rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isAdding) {
                      e.currentTarget.style.background = '#1a5c48';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isAdding) {
                      e.currentTarget.style.background = '#0B3B2F';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {isAdding ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus"></i>
                      Create Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Report Modal - WITH WORKING ADD BUTTONS */}
      {showEditModal && editingReport && (
        <div className="modal-overlay" onClick={closeEditModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '20px', maxWidth: '800px', width: '100%',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={closeEditModal} style={{
              position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', border: 'none',
              width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
            ><i className="fas fa-times"></i></button>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', 
              padding: '1.25rem', 
              textAlign: 'center', 
              borderRadius: '20px 20px 0 0',
              flexShrink: 0
            }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-edit" style={{ fontSize: '1.25rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Edit Annual Report</h2>
              <p style={{ color: '#F9C74F', fontSize: '0.85rem', margin: 0 }}>Update report details and content</p>
            </div>
            
            <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1, maxHeight: 'calc(90vh - 120px)' }}>
              {/* Basic Information Section */}
              <div style={{ 
                background: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '12px', 
                marginBottom: '1rem',
                borderLeft: '4px solid #0B3B2F'
              }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0B3B2F', marginBottom: '0.75rem' }}>
                  <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
                  Basic Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                      Organization Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      name="organization_name" 
                      value={editingReport.organization_name} 
                      onChange={handleEditChange} 
                      placeholder="Enter organization name"
                      style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                      Report Year <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="number" 
                      name="report_year" 
                      value={editingReport.report_year} 
                      onChange={handleEditChange} 
                      placeholder="e.g., 2025"
                      style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} 
                    />
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                    Tagline / Subtitle
                  </label>
                  <input 
                    type="text" 
                    name="tagline" 
                    value={editingReport.tagline || ''} 
                    onChange={handleEditChange} 
                    placeholder="e.g., Empowering Communities, Transforming Lives"
                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} 
                  />
                </div>
              </div>

              {/* Executive Message Section */}
              <div style={{ 
                background: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '12px', 
                marginBottom: '1rem',
                borderLeft: '4px solid #F9C74F'
              }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0B3B2F', marginBottom: '0.75rem' }}>
                  <i className="fas fa-user" style={{ marginRight: '0.5rem' }}></i>
                  Executive Message
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                      Executive Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      name="executive_name" 
                      value={editingReport.executive_name || ''} 
                      onChange={handleEditChange} 
                      placeholder="e.g., John Doe"
                      style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                      Executive Title
                    </label>
                    <input 
                      type="text" 
                      name="executive_title" 
                      value={editingReport.executive_title || ''} 
                      onChange={handleEditChange} 
                      placeholder="e.g., Executive Director"
                      style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} 
                    />
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                    Executive Message <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea 
                    name="executive_message" 
                    value={editingReport.executive_message || ''} 
                    onChange={handleEditChange} 
                    rows="4" 
                    placeholder="Write a personal message from the executive director..."
                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px', resize: 'vertical' }} 
                  />
                </div>
              </div>

              {/* Status Section */}
              <div style={{ 
                background: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '12px', 
                marginBottom: '1rem',
                borderLeft: '4px solid #2196F3'
              }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0B3B2F', marginBottom: '0.75rem' }}>
                  <i className="fas fa-cog" style={{ marginRight: '0.5rem' }}></i>
                  Status & Settings
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                      Status <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select 
                      name="status" 
                      value={editingReport.status} 
                      onChange={handleEditChange} 
                      style={{ width: '100%', padding: '0.5rem', fontSize: '0.813rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    >
                      <option value="draft">Draft - Work in Progress</option>
                      <option value="published">Published - Ready for Public</option>
                      <option value="archived">Archived - Old/Inactive</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.5rem' }}>
                    <input 
                      type="checkbox" 
                      name="is_featured" 
                      checked={editingReport.is_featured} 
                      onChange={handleEditChange} 
                      style={{ marginRight: '0.5rem', width: '18px', height: '18px' }} 
                    />
                    <label style={{ fontSize: '0.813rem', color: '#475569', fontWeight: 500 }}>
                      <i className="fas fa-star" style={{ color: '#F9C74F', marginRight: '0.25rem' }}></i>
                      Featured Report
                    </label>
                  </div>
                </div>
              </div>

              {/* FINANCIAL DATA SECTION - WITH WORKING ADD BUTTONS */}
              <div style={{ 
                background: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '12px', 
                marginBottom: '1rem',
                borderLeft: '4px solid #4caf50'
              }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0B3B2F', marginBottom: '0.75rem' }}>
                  <i className="fas fa-coins" style={{ marginRight: '0.5rem' }}></i>
                  Financial Data
                </h4>
                
                {/* Incomes - WITH WORKING ADD BUTTON */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                      <i className="fas fa-arrow-up" style={{ color: '#4caf50', marginRight: '0.25rem' }}></i>
                      Income Sources ({editingReport.incomes?.length || 0})
                    </label>
                    <button
                      onClick={() => addEditNestedItem('incomes', { source: '', amount: 0, percentage: 0, order: 0 })}
                      style={{
                        padding: '0.25rem 0.75rem',
                        background: '#e8f5e9',
                        border: '1px solid #4caf50',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        color: '#2e7d32'
                      }}
                    >
                      <i className="fas fa-plus"></i> Add Income
                    </button>
                  </div>
                  {(!editingReport.incomes || editingReport.incomes.length === 0) ? (
                    <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>No income sources added. Click "Add Income" to add one.</p>
                  ) : (
                    editingReport.incomes.map((item, index) => (
                      <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', alignItems: 'center', background: 'white', padding: '0.5rem', borderRadius: '6px' }}>
                        <div style={{ flex: 1 }}>
                          <input
                            type="text"
                            placeholder="Source name (e.g., Donations)"
                            value={item.source || ''}
                            onChange={(e) => handleEditNestedChange('incomes', index, 'source', e.target.value)}
                            style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                          />
                        </div>
                        <div style={{ width: '120px' }}>
                          <input
                            type="number"
                            placeholder="Amount ($)"
                            value={item.amount || 0}
                            onChange={(e) => handleEditNestedChange('incomes', index, 'amount', parseFloat(e.target.value) || 0)}
                            style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                          />
                        </div>
                        <div style={{ width: '80px' }}>
                          <input
                            type="number"
                            placeholder="%"
                            value={item.percentage || 0}
                            onChange={(e) => handleEditNestedChange('incomes', index, 'percentage', parseFloat(e.target.value) || 0)}
                            style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                          />
                        </div>
                        <button
                          onClick={() => removeEditNestedItem('incomes', index)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#ffebee',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: '#d32f2f'
                          }}
                          title="Remove this income source"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))
                  )}
                  <small style={{ fontSize: '0.7rem', color: '#64748b' }}>Add all income sources and their amounts</small>
                </div>

                {/* Expenditures - WITH WORKING ADD BUTTON */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.8rem', color: '#475569' }}>
                      <i className="fas fa-arrow-down" style={{ color: '#ef4444', marginRight: '0.25rem' }}></i>
                      Expenditures ({editingReport.expenditures?.length || 0})
                    </label>
                    <button
                      onClick={() => addEditNestedItem('expenditures', { category: '', amount: 0, percentage: 0, order: 0, color: '#4caf50' })}
                      style={{
                        padding: '0.25rem 0.75rem',
                        background: '#fff3e0',
                        border: '1px solid #FF9800',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        color: '#e65100'
                      }}
                    >
                      <i className="fas fa-plus"></i> Add Expenditure
                    </button>
                  </div>
                  {(!editingReport.expenditures || editingReport.expenditures.length === 0) ? (
                    <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>No expenditures added. Click "Add Expenditure" to add one.</p>
                  ) : (
                    editingReport.expenditures.map((item, index) => (
                      <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', alignItems: 'center', background: 'white', padding: '0.5rem', borderRadius: '6px' }}>
                        <div style={{ flex: 1 }}>
                          <input
                            type="text"
                            placeholder="Category (e.g., Programs)"
                            value={item.category || ''}
                            onChange={(e) => handleEditNestedChange('expenditures', index, 'category', e.target.value)}
                            style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                          />
                        </div>
                        <div style={{ width: '120px' }}>
                          <input
                            type="number"
                            placeholder="Amount ($)"
                            value={item.amount || 0}
                            onChange={(e) => handleEditNestedChange('expenditures', index, 'amount', parseFloat(e.target.value) || 0)}
                            style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                          />
                        </div>
                        <div style={{ width: '80px' }}>
                          <input
                            type="number"
                            placeholder="%"
                            value={item.percentage || 0}
                            onChange={(e) => handleEditNestedChange('expenditures', index, 'percentage', parseFloat(e.target.value) || 0)}
                            style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                          />
                        </div>
                        <button
                          onClick={() => removeEditNestedItem('expenditures', index)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#ffebee',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: '#d32f2f'
                          }}
                          title="Remove this expenditure"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))
                  )}
                  <small style={{ fontSize: '0.7rem', color: '#64748b' }}>Add all expenditure categories and their amounts</small>
                </div>
              </div>

              {/* IMPACT METRICS SECTION - WITH WORKING ADD BUTTON */}
              <div style={{ 
                background: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '12px', 
                marginBottom: '1rem',
                borderLeft: '4px solid #9C27B0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0B3B2F', margin: 0 }}>
                    <i className="fas fa-chart-bar" style={{ marginRight: '0.5rem' }}></i>
                    Impact Metrics ({editingReport.impact_metrics?.length || 0})
                  </h4>
                  <button
                    onClick={() => addEditNestedItem('impact_metrics', { icon: 'fa-users', value: '', label: '', order: 0 })}
                    style={{
                      padding: '0.25rem 0.75rem',
                      background: '#f3e5f5',
                      border: '1px solid #9C27B0',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      color: '#4a148c'
                    }}
                  >
                    <i className="fas fa-plus"></i> Add Metric
                  </button>
                </div>
                {(!editingReport.impact_metrics || editingReport.impact_metrics.length === 0) ? (
                  <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>No impact metrics added. Click "Add Metric" to add one.</p>
                ) : (
                  editingReport.impact_metrics.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', alignItems: 'center', background: 'white', padding: '0.5rem', borderRadius: '6px' }}>
                      <div style={{ width: '100px' }}>
                        <select
                          value={item.icon || 'fa-users'}
                          onChange={(e) => handleEditNestedChange('impact_metrics', index, 'icon', e.target.value)}
                          style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                        >
                          <option value="fa-users">Users</option>
                          <option value="fa-map-marker-alt">Communities</option>
                          <option value="fa-child">Children</option>
                          <option value="fa-female">Women</option>
                          <option value="fa-tint">Water</option>
                          <option value="fa-hands-helping">Volunteers</option>
                          <option value="fa-graduation-cap">Graduates</option>
                          <option value="fa-tree">Environment</option>
                          <option value="fa-hospital">Health</option>
                          <option value="fa-hand-holding-heart">Support</option>
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="text"
                          placeholder="Value (e.g., 25,000+)"
                          value={item.value || ''}
                          onChange={(e) => handleEditNestedChange('impact_metrics', index, 'value', e.target.value)}
                          style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="text"
                          placeholder="Label (e.g., Beneficiaries)"
                          value={item.label || ''}
                          onChange={(e) => handleEditNestedChange('impact_metrics', index, 'label', e.target.value)}
                          style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                        />
                      </div>
                      <button
                        onClick={() => removeEditNestedItem('impact_metrics', index)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          background: '#ffebee',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: '#d32f2f'
                        }}
                        title="Remove this metric"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))
                )}
                <small style={{ fontSize: '0.7rem', color: '#64748b' }}>Add key metrics that show your organization's impact</small>
              </div>

              {/* Summary Section */}
              <div style={{ 
                padding: '0.75rem', 
                background: '#f8fafc', 
                borderRadius: '8px', 
                marginBottom: '1rem',
                border: '1px solid #e2e8f0'
              }}>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                  <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
                  <strong>Report Summary:</strong> 
                  {editingReport.impact_metrics?.length || 0} metrics, 
                  {editingReport.programs?.length || 0} programs, 
                  {editingReport.stories?.length || 0} stories, 
                  {editingReport.incomes?.length || 0} income sources, 
                  {editingReport.expenditures?.length || 0} expenditures, 
                  {editingReport.partners?.length || 0} partners, 
                  and {editingReport.board_members?.length || 0} board members.
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button 
                  onClick={closeEditModal} 
                  style={{ 
                    flex: 1, 
                    background: '#f1f5f9', 
                    border: 'none', 
                    padding: '0.625rem', 
                    borderRadius: '8px', 
                    fontWeight: 500, 
                    cursor: 'pointer', 
                    fontSize: '0.813rem',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  disabled={isUpdating}
                >
                  <i className="fas fa-times"></i> Cancel
                </button>
                <button 
                  onClick={handleUpdateReport}
                  disabled={isUpdating}
                  style={{ 
                    flex: 2, 
                    background: isUpdating ? '#94a3b8' : '#0B3B2F', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.625rem', 
                    borderRadius: '8px', 
                    fontWeight: 600, 
                    cursor: isUpdating ? 'not-allowed' : 'pointer', 
                    fontSize: '0.813rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isUpdating) {
                      e.currentTarget.style.background = '#1a5c48';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isUpdating) {
                      e.currentTarget.style.background = '#0B3B2F';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {isUpdating ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      Update Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {showViewModal && selectedReport && (
        <div className="modal-overlay" onClick={closeViewModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', borderRadius: '20px', maxWidth: '700px', width: '100%',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'slideInUp 0.3s ease'
          }}>
            <button onClick={closeViewModal} style={{
              position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', border: 'none',
              width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
            ><i className="fas fa-times"></i></button>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', 
              padding: '1.25rem', 
              textAlign: 'center', 
              borderRadius: '20px 20px 0 0',
              flexShrink: 0
            }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto', borderRadius: '50%', background: '#F9C74F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-file-alt" style={{ fontSize: '1.25rem', color: '#0B3B2F' }}></i>
              </div>
              <h2 style={{ color: 'white', marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
                {selectedReport.organization_name} - {selectedReport.report_year}
              </h2>
              <span style={{
                display: 'inline-block',
                background: `${getStatusColor(selectedReport.status)}20`,
                color: getStatusColor(selectedReport.status),
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 500,
                marginTop: '0.25rem'
              }}>{getStatusLabel(selectedReport.status)}</span>
            </div>
            
            <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
              {/* Tagline */}
              {selectedReport.tagline && (
                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.95rem', color: '#0B3B2F', fontStyle: 'italic', margin: 0 }}>"{selectedReport.tagline}"</p>
                </div>
              )}

              {/* Executive Message */}
              {selectedReport.executive_message && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0B3B2F', marginBottom: '0.5rem' }}>
                    <i className="fas fa-envelope" style={{ marginRight: '0.5rem' }}></i>
                    Executive Message
                  </h4>
                  <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-line' }}>
                      {selectedReport.executive_message}
                    </p>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
                      <strong>{selectedReport.executive_name}</strong>
                      {selectedReport.executive_title && `, ${selectedReport.executive_title}`}
                      {selectedReport.message_date && ` • ${new Date(selectedReport.message_date).toLocaleDateString()}`}
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Total Income</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4caf50' }}>
                    {formatCurrency(selectedReport.total_income || 0)}
                  </div>
                </div>
                <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Total Expenditure</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2196F3' }}>
                    {formatCurrency(selectedReport.total_expenditure || 0)}
                  </div>
                </div>
                <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Views</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B3B2F' }}>
                    {selectedReport.view_count || 0}
                  </div>
                </div>
                <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Downloads</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B3B2F' }}>
                    {selectedReport.download_count || 0}
                  </div>
                </div>
              </div>

              {/* Metrics */}
              {selectedReport.impact_metrics && selectedReport.impact_metrics.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0B3B2F', marginBottom: '0.5rem' }}>
                    <i className="fas fa-chart-bar" style={{ marginRight: '0.5rem' }}></i>
                    Impact Metrics ({selectedReport.impact_metrics.length})
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedReport.impact_metrics.map((metric, idx) => (
                      <span key={idx} style={{
                        padding: '0.25rem 0.75rem',
                        background: '#e8f5e9',
                        color: '#0B3B2F',
                        borderRadius: '12px',
                        fontSize: '0.8rem'
                      }}>
                        <i className={`fas ${metric.icon}`} style={{ marginRight: '0.25rem' }}></i>
                        {metric.value} {metric.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Programs */}
              {selectedReport.programs && selectedReport.programs.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0B3B2F', marginBottom: '0.5rem' }}>
                    <i className="fas fa-project-diagram" style={{ marginRight: '0.5rem' }}></i>
                    Programs ({selectedReport.programs.length})
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedReport.programs.map((program, idx) => (
                      <span key={idx} style={{
                        padding: '0.25rem 0.75rem',
                        background: `${program.color || '#2196F3'}15`,
                        color: program.color || '#2196F3',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        border: `1px solid ${program.color || '#2196F3'}30`
                      }}>
                        <i className={`fas ${program.icon || 'fa-circle'}`} style={{ marginRight: '0.25rem' }}></i>
                        {program.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stories */}
              {selectedReport.stories && selectedReport.stories.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0B3B2F', marginBottom: '0.5rem' }}>
                    <i className="fas fa-book-open" style={{ marginRight: '0.5rem' }}></i>
                    Stories ({selectedReport.stories.length})
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedReport.stories.map((story, idx) => (
                      <span key={idx} style={{
                        padding: '0.25rem 0.75rem',
                        background: '#fff3e0',
                        color: '#e65100',
                        borderRadius: '12px',
                        fontSize: '0.8rem'
                      }}>
                        {story.name} - {story.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Partners */}
              {selectedReport.partners && selectedReport.partners.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0B3B2F', marginBottom: '0.5rem' }}>
                    <i className="fas fa-handshake" style={{ marginRight: '0.5rem' }}></i>
                    Partners ({selectedReport.partners.length})
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedReport.partners.map((partner, idx) => (
                      <span key={idx} style={{
                        padding: '0.25rem 0.75rem',
                        background: '#e3f2fd',
                        color: '#0d47a1',
                        borderRadius: '12px',
                        fontSize: '0.8rem'
                      }}>
                        {partner.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Board Members */}
              {selectedReport.board_members && selectedReport.board_members.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0B3B2F', marginBottom: '0.5rem' }}>
                    <i className="fas fa-users" style={{ marginRight: '0.5rem' }}></i>
                    Board Members ({selectedReport.board_members.length})
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedReport.board_members.map((member, idx) => (
                      <span key={idx} style={{
                        padding: '0.25rem 0.75rem',
                        background: '#f3e5f5',
                        color: '#4a148c',
                        borderRadius: '12px',
                        fontSize: '0.8rem'
                      }}>
                        {member.name} - {member.role}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f0f0f0', fontSize: '0.75rem', color: '#64748b' }}>
                <div><strong>Created:</strong> {new Date(selectedReport.created_at).toLocaleString()}</div>
                <div><strong>Updated:</strong> {new Date(selectedReport.updated_at).toLocaleString()}</div>
                {selectedReport.published_date && (
                  <div><strong>Published:</strong> {new Date(selectedReport.published_date).toLocaleString()}</div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button onClick={closeViewModal} style={{ 
                  flex: 1, background: '#f1f5f9', border: 'none', padding: '0.625rem', borderRadius: '8px', 
                  fontWeight: 500, cursor: 'pointer', fontSize: '0.813rem'
                }}>
                  <i className="fas fa-times"></i> Close
                </button>
                <button 
                  onClick={() => {
                    closeViewModal();
                    openEditModal(selectedReport);
                  }} 
                  style={{ 
                    flex: 2, background: '#0B3B2F', color: 'white', border: 'none', padding: '0.625rem', 
                    borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.813rem',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#1a5c48'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#0B3B2F'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <i className="fas fa-edit"></i> Edit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInScale {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        
        .modal-content div::-webkit-scrollbar { width: 4px; }
        .modal-content div::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .modal-content div::-webkit-scrollbar-thumb { background: #0B3B2F; border-radius: 10px; }
        
        button:disabled { opacity: 0.7; cursor: not-allowed !important; }
        
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
          .modal-content {
            max-width: 100% !important;
            margin: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminReports;