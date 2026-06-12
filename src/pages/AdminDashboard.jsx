import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Stats state
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    total_projects: 0,
    ongoing_projects: 0,
    completed_projects: 0,
    total_events: 0,
    total_volunteers: 0,
    volunteer_hours: 0,
    total_partners: 0,
    active_partners: 0,
    total_news: 0,
    total_programs: 0,
    total_leaders: 0,
    total_missions: 0,
    total_testimonials: 0,
    total_blog_posts: 0,
    total_statistics: 0,
    total_environment_missions: 0,
    total_leadership_missions: 0,
    average_rating: 0,
    pending_event_requests: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  
  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchDashboardData();
  }, []);

  // Helper function to extract data from API responses
  const extractData = (response, isPaginated = false) => {
    if (!response) return [];
    if (response.success && response.data) return response.data;
    if (isPaginated && response.results) return response.results;
    if (Array.isArray(response)) return response;
    if (response.data && Array.isArray(response.data)) return response.data;
    return [];
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setErrors({});

    try {
      // USERS API
      let totalUsers = 0, activeUsers = 0;
      try {
        const response = await fetch('https://vuma.pythonanywhere.com/api/users/');
        if (response.ok) {
          const data = await response.json();
          const users = extractData(data);
          totalUsers = users.length;
          activeUsers = users.filter(u => u.is_verified === true).length;
        } else {
          setErrors(prev => ({ ...prev, users: `API Error: ${response.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, users: 'Network error' }));
      }

      // PROJECTS API
      let totalProjects = 0, ongoingProjects = 0, completedProjects = 0;
      try {
        const response = await fetch('https://vuma.pythonanywhere.com/api/projects/');
        if (response.ok) {
          const data = await response.json();
          const projects = extractData(data);
          totalProjects = projects.length;
          ongoingProjects = projects.filter(p => p.status === 'ongoing' || p.status === 'active' || !p.status).length;
          completedProjects = projects.filter(p => p.status === 'completed').length;
        } else {
          setErrors(prev => ({ ...prev, projects: `API Error: ${response.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, projects: 'Network error' }));
      }

      // EVENTS API
      let totalEvents = 0;
      try {
        const response = await fetch('https://vuma.pythonanywhere.com/api/events/');
        if (response.ok) {
          const data = await response.json();
          if (data.results && Array.isArray(data.results)) {
            totalEvents = data.count || data.results.length;
          } else if (Array.isArray(data)) {
            totalEvents = data.length;
          } else if (data.success && data.data) {
            totalEvents = data.data.length;
          }
        } else {
          setErrors(prev => ({ ...prev, events: `API Error: ${response.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, events: 'Network error' }));
      }

      // EVENT REQUESTS API
      let pendingEventRequests = 0;
      try {
        const response = await fetch('https://vuma.pythonanywhere.com/event/api/registrations/');
        if (response.ok) {
          const data = await response.json();
          const requests = extractData(data, true);
          pendingEventRequests = requests.filter(r => r.status === 'pending' || !r.status).length;
        } else {
          setErrors(prev => ({ ...prev, event_requests: `API Error: ${response.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, event_requests: 'Network error' }));
      }

      // VOLUNTEERS API
      let totalVolunteers = 0, volunteerHours = 0;
      try {
        const response = await fetch('https://vuma.pythonanywhere.com/api/volunteers/');
        if (response.ok) {
          const data = await response.json();
          const volunteers = extractData(data);
          totalVolunteers = volunteers.length;
          volunteerHours = volunteers.reduce((sum, v) => sum + (v.hours_contributed || v.total_hours || 0), 0);
        } else {
          setErrors(prev => ({ ...prev, volunteers: `API Error: ${response.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, volunteers: 'Network error' }));
      }

      // PARTNERS API
      let totalPartners = 0, activePartners = 0;
      try {
        const response = await fetch('https://vuma.pythonanywhere.com/api/partners/stats/');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            totalPartners = data.data.total || 0;
            activePartners = data.data.active || 0;
          } else if (data.data) {
            totalPartners = data.data.total || 0;
            activePartners = data.data.active || 0;
          }
        } else {
          setErrors(prev => ({ ...prev, partners: `API Error: ${response.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, partners: 'Network error' }));
      }

      // NEWS API
      let totalNews = 0;
      try {
        const response = await fetch('https://vuma.pythonanywhere.com/api/news/');
        if (response.ok) {
          const data = await response.json();
          const news = extractData(data);
          totalNews = news.length;
        } else {
          setErrors(prev => ({ ...prev, news: `API Error: ${response.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, news: 'Network error' }));
      }

      // PROGRAMS API
      let totalPrograms = 0;
      try {
        const response = await fetch(`${API_BASE_URL}/prog/`);
        if (response.ok) {
          const data = await response.json();
          const programs = extractData(data);
          totalPrograms = programs.length;
        } else {
          setErrors(prev => ({ ...prev, programs: `API Error: ${response.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, programs: 'Network error' }));
      }

      // LEADERS API
      let leadersData = [];
      try {
        const response = await fetch(`${API_BASE_URL}/leaders/`);
        if (response.ok) {
          const data = await response.json();
          leadersData = extractData(data, true);
        } else {
          setErrors(prev => ({ ...prev, leaders: `API Error: ${response.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, leaders: 'Network error' }));
      }

      // MISSIONS API
      let missionsData = [];
      try {
        const response = await fetch(`${API_BASE_URL}/missions/`);
        if (response.ok) {
          const data = await response.json();
          missionsData = extractData(data, true);
        } else {
          setErrors(prev => ({ ...prev, missions: `API Error: ${response.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, missions: 'Network error' }));
      }

      // TESTIMONIALS API
      let testimonialsData = [];
      let avgRating = 0;
      try {
        const response = await fetch(`${API_BASE_URL}/testimonials/`);
        if (response.ok) {
          const data = await response.json();
          testimonialsData = extractData(data, true);
          if (testimonialsData.length > 0) {
            const sum = testimonialsData.reduce((acc, t) => acc + (t.rating || 0), 0);
            avgRating = (sum / testimonialsData.length).toFixed(1);
          }
        } else {
          setErrors(prev => ({ ...prev, testimonials: `API Error: ${response.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, testimonials: 'Network error' }));
      }

      // BLOG POSTS API
      let blogPostsData = [];
      try {
        const response = await fetch(`${API_BASE_URL}/blog-posts/`);
        if (response.ok) {
          const data = await response.json();
          blogPostsData = extractData(data, true);
        } else {
          setErrors(prev => ({ ...prev, blog_posts: `API Error: ${response.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, blog_posts: 'Network error' }));
      }

      // STATISTICS API
      let statisticsData = [];
      try {
        const response = await fetch(`${API_BASE_URL}/statistics/`);
        if (response.ok) {
          const data = await response.json();
          statisticsData = extractData(data, true);
        } else {
          setErrors(prev => ({ ...prev, statistics: `API Error: ${response.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, statistics: 'Network error' }));
      }

      // Calculate derived stats
      const environmentMissions = missionsData.filter(m => m.category === 'environment' || m.category === 'environmental').length;
      const leadershipMissions = missionsData.filter(m => m.category === 'leadership').length;

      setStats({
        total_users: totalUsers,
        active_users: activeUsers,
        total_projects: totalProjects,
        ongoing_projects: ongoingProjects,
        completed_projects: completedProjects,
        total_events: totalEvents,
        total_volunteers: totalVolunteers,
        volunteer_hours: volunteerHours,
        total_partners: totalPartners,
        active_partners: activePartners,
        total_news: totalNews,
        total_programs: totalPrograms,
        total_leaders: leadersData.length,
        total_missions: missionsData.length,
        total_testimonials: testimonialsData.length,
        total_blog_posts: blogPostsData.length,
        total_statistics: statisticsData.length,
        total_environment_missions: environmentMissions,
        total_leadership_missions: leadershipMissions,
        average_rating: avgRating,
        pending_event_requests: pendingEventRequests
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasAnyError = () => Object.values(errors).length > 0;

  // Stats Cards Data
  const statsCards = [
    { label: 'Total Users', value: stats.total_users, icon: 'fas fa-users', color: '#0B3B2F', error: errors.users },
    { label: 'Active Users', value: stats.active_users, icon: 'fas fa-user-check', color: '#4caf50', error: errors.users },
    { label: 'Active Projects', value: stats.ongoing_projects, icon: 'fas fa-project-diagram', color: '#F9C74F', error: errors.projects },
    { label: 'Total Events', value: stats.total_events, icon: 'fas fa-calendar-check', color: '#2b7a5c', error: errors.events },
    { label: 'Volunteer Hours', value: stats.volunteer_hours, icon: 'fas fa-clock', color: '#F9C74F', error: errors.volunteers },
    { label: 'Active Partners', value: stats.active_partners, icon: 'fas fa-handshake', color: '#0B3B2F', error: errors.partners },
    { label: 'News Articles', value: stats.total_news, icon: 'fas fa-newspaper', color: '#FF9800', error: errors.news },
    { label: 'Total Leaders', value: stats.total_leaders, icon: 'fas fa-users-cog', color: '#0B3B2F', error: errors.leaders },
    { label: 'Total Missions', value: stats.total_missions, icon: 'fas fa-rocket', color: '#F9C74F', error: errors.missions },
    { label: 'Testimonials', value: stats.total_testimonials, icon: 'fas fa-star', color: '#FF9800', error: errors.testimonials },
    { label: 'Blog Posts', value: stats.total_blog_posts, icon: 'fas fa-blog', color: '#2b7a5c', error: errors.blog_posts },
    { label: 'Statistics', value: stats.total_statistics, icon: 'fas fa-chart-line', color: '#9C27B0', error: errors.statistics },
    { label: 'Avg Rating', value: stats.average_rating, icon: 'fas fa-star-half-alt', color: '#FF9800', error: errors.testimonials, suffix: '★' },
    { label: 'Event Requests', value: stats.pending_event_requests, icon: 'fas fa-calendar-plus', color: '#f59e0b', error: errors.event_requests },
  ];

  // Admin Cards Data - UPDATED with Testimonials direct path
  const adminCards = [
    { 
      id: 'users', 
      title: 'Users Management', 
      icon: 'fas fa-users', 
      color: '#0B3B2F', 
      description: 'Manage all registered users, their roles and permissions',
      count: stats.total_users,
      path: '/admin/users',
      error: errors.users
    },
    { 
      id: 'projects', 
      title: 'Projects', 
      icon: 'fas fa-project-diagram', 
      color: '#F9C74F', 
      description: 'Track and manage all ongoing and completed projects',
      count: stats.total_projects,
      path: '/admin/projects',
      error: errors.projects
    },
    { 
      id: 'events', 
      title: 'Events', 
      icon: 'fas fa-calendar-alt', 
      color: '#2b7a5c', 
      description: 'Organize and manage all events and activities',
      count: stats.total_events,
      path: '/admin/events',
      error: errors.events
    },
    { 
      id: 'event_requests', 
      title: 'Event Requests', 
      icon: 'fas fa-calendar-plus', 
      color: '#f59e0b', 
      description: 'Review and manage event registration requests',
      count: stats.pending_event_requests,
      path: '/events/requests',
      error: errors.event_requests,
      badge: stats.pending_event_requests > 0 ? stats.pending_event_requests : null
    },
    { 
      id: 'volunteers', 
      title: 'Volunteers', 
      icon: 'fas fa-hands-helping', 
      color: '#F9C74F', 
      description: 'Manage volunteer applications and assignments',
      count: stats.total_volunteers,
      path: '/admin/volunteers',
      error: errors.volunteers
    },
    { 
      id: 'partners', 
      title: 'Partners', 
      icon: 'fas fa-handshake', 
      color: '#0B3B2F', 
      description: 'Manage organizational partners and collaborations',
      count: stats.total_partners,
      path: '/admin/partners',
      error: errors.partners
    },
    { 
      id: 'news', 
      title: 'News & Stories', 
      icon: 'fas fa-newspaper', 
      color: '#FF9800', 
      description: 'Manage news articles and stories',
      count: stats.total_news,
      path: '/admin/news',
      error: errors.news
    },
    { 
      id: 'testimonials', 
      title: 'Testimonials', 
      icon: 'fas fa-star', 
      color: '#F9C74F', 
      description: 'Manage community testimonials and reviews',
      count: stats.total_testimonials,
      path: '/admin/testimonials',
      error: errors.testimonials,
      subStats: [
        { label: 'Avg Rating', value: stats.average_rating, suffix: '★' }
      ]
    },
    { 
      id: 'programs', 
      title: 'Programs', 
      icon: 'fas fa-chalkboard-user', 
      color: '#9C27B0', 
      description: 'Manage programs and initiatives',
      count: stats.total_programs,
      path: '/admin/programs',
      error: errors.programs
    },
    { 
      id: 'messages', 
      title: 'Messages', 
      icon: 'fas fa-envelope', 
      color: '#2b7a5c', 
      description: 'View and respond to contact messages',
      count: 0,
      path: '/admin/messages',
      error: null
    },
    { 
      id: 'leaders', 
      title: 'Leadership Team', 
      icon: 'fas fa-users-cog', 
      color: '#0B3B2F', 
      description: 'Manage leadership team members and their profiles',
      count: stats.total_leaders,
      path: '/admin/leadership',
      error: errors.leaders,
      tab: 'leaders'
    },
    { 
      id: 'missions', 
      title: 'Missions', 
      icon: 'fas fa-rocket', 
      color: '#F9C74F', 
      description: 'Track and manage all missions by category',
      count: stats.total_missions,
      path: '/admin/leadership',
      error: errors.missions,
      tab: 'missions',
      subStats: [
        { label: 'Environment', value: stats.total_environment_missions },
        { label: 'Leadership', value: stats.total_leadership_missions }
      ]
    },
    { 
      id: 'blog_posts', 
      title: 'Blog Posts', 
      icon: 'fas fa-blog', 
      color: '#2b7a5c', 
      description: 'Manage news, articles, and blog content',
      count: stats.total_blog_posts,
      path: '/admin/leadership',
      error: errors.blog_posts,
      tab: 'blog-posts'
    },
    { 
      id: 'statistics', 
      title: 'Statistics', 
      icon: 'fas fa-chart-line', 
      color: '#9C27B0', 
      description: 'Manage key statistics and metrics',
      count: stats.total_statistics,
      path: '/admin/leadership',
      error: errors.statistics,
      tab: 'statistics'
    }
  ];

  // Loading State
  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '3px solid #F9C74F',
            borderTopColor: '#0B3B2F',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 data-aos="fade-up" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginBottom: '0.5rem' }}>
            <i className="fas fa-shield-alt" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
            Admin Dashboard
          </h1>
          <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', opacity: 0.9 }}>
            Welcome back, Administrator. Here's what's happening with your platform today.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        
        {/* Stats Cards Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {statsCards.map((stat, idx) => (
            <div 
              key={idx} 
              data-aos="fade-up" 
              data-aos-delay={idx * 50} 
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: stat.error ? '1px solid #ffebee' : 'none',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#888' }}>{stat.label}</div>
                  {stat.error && (
                    <div style={{ fontSize: '0.65rem', color: '#d32f2f', background: '#ffebee', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                      <i className="fas fa-exclamation-circle" style={{ marginRight: '0.2rem' }}></i>
                      Error
                    </div>
                  )}
                </div>
                {stat.error ? (
                  <div style={{ fontSize: '0.8rem', color: '#d32f2f', marginBottom: '0.5rem' }}>
                    {stat.error}
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0B3B2F' }}>
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}{stat.suffix || ''}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#4caf50', marginTop: '0.5rem' }}>Current data</div>
                  </>
                )}
              </div>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: `${stat.color}10`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <i className={stat.icon} style={{ fontSize: '1.5rem', color: stat.color }}></i>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {adminCards.map((card, idx) => (
            <div
              key={card.id}
              data-aos="zoom-in"
              data-aos-delay={idx * 100}
              onClick={() => !card.error && card.path && navigate(card.path, { state: { activeTab: card.tab } })}
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '1.5rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                cursor: card.error ? 'not-allowed' : 'pointer',
                position: 'relative',
                overflow: 'hidden',
                opacity: card.error ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!card.error) {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
              }}
            >
              {/* Badge for pending requests */}
              {card.badge && card.badge > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#ef4444',
                  color: 'white',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  zIndex: 10,
                  animation: 'pulse 2s infinite'
                }}>
                  {card.badge} Pending
                </div>
              )}

              {/* Error Badge */}
              {card.error && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#ffebee',
                  color: '#d32f2f',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  zIndex: 10
                }}>
                  <i className="fas fa-exclamation-circle"></i>
                  API Error
                </div>
              )}

              {/* Background Decoration */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                background: `radial-gradient(circle, ${card.color}10, transparent)`,
                borderRadius: '50%'
              }} />
              
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: `${card.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!card.error) e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  <i className={card.icon} style={{ fontSize: '1.8rem', color: card.color }}></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0B3B2F', margin: 0 }}>{card.title}</h3>
                  <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>{card.description}</p>
                </div>
              </div>
              
              {/* Sub Stats */}
              {card.subStats && !card.error && (
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '0.5rem',
                  marginBottom: '1rem',
                  padding: '0.5rem',
                  background: '#f9f9f9',
                  borderRadius: '12px'
                }}>
                  {card.subStats.map((sub, subIdx) => (
                    <div key={subIdx} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#888' }}>{sub.label}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: card.color }}>
                        {sub.value}{sub.suffix || ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Card Footer */}
              {card.error ? (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.8rem',
                  background: '#ffebee',
                  borderRadius: '12px',
                  color: '#d32f2f',
                  fontSize: '0.75rem',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.3rem' }}></i>
                  {card.error}
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#999' }}>Total Items</span>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: card.color }}>
                      {typeof card.count === 'number' ? card.count.toLocaleString() : card.count}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    color: card.color,
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    <span>Manage</span>
                    <i className="fas fa-arrow-right" style={{ fontSize: '0.7rem', transition: 'transform 0.3s ease' }}
                       onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                       onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Error Summary Banner */}
        {hasAnyError() && (
          <div style={{
            marginTop: '3rem',
            padding: '1rem',
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <i className="fas fa-info-circle" style={{ color: '#856404', marginRight: '0.5rem' }}></i>
            <span style={{ color: '#856404', fontSize: '0.85rem' }}>
              Some data could not be loaded. Please check your API connections and try again.
            </span>
            <button 
              onClick={fetchDashboardData}
              style={{
                marginLeft: '1rem',
                background: '#856404',
                color: 'white',
                border: 'none',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <i className="fas fa-sync-alt" style={{ marginRight: '0.3rem' }}></i>
              Retry
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;