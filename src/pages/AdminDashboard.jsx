import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    total_projects: 0,
    ongoing_projects: 0,
    completed_projects: 0,
    total_events: 0,
    total_volunteers: 0,
    total_partners: 0,
    active_partners: 0,
    total_news: 0,
    total_programs: 0,
    volunteer_hours: 0
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    users: null,
    projects: null,
    events: null,
    volunteers: null,
    partners: null,
    news: null,
    programs: null
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    setErrors({
      users: null,
      projects: null,
      events: null,
      volunteers: null,
      partners: null,
      news: null,
      programs: null
    });

    try {
      let usersData = { data: { total_users: 0, active_users: 0 } };
      try {
        const usersRes = await fetch('http://192.168.137.83:8000/api/admin/users/stats/');
        if (usersRes.ok) {
          usersData = await usersRes.json();
        } else {
          setErrors(prev => ({ ...prev, users: `Users API Error: ${usersRes.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, users: 'Users API: Network error' }));
      }

      let projectsData = { data: { total: 0, ongoing: 0, completed: 0 } };
      try {
        const projectsRes = await fetch('http://192.168.137.83:8000/api/projects/stats/');
        if (projectsRes.ok) {
          projectsData = await projectsRes.json();
        } else {
          setErrors(prev => ({ ...prev, projects: `Projects API Error: ${projectsRes.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, projects: 'Projects API: Network error' }));
      }

      let eventsData = { data: [] };
      try {
        const eventsRes = await fetch('http://192.168.137.83:8000/api/events/');
        if (eventsRes.ok) {
          eventsData = await eventsRes.json();
        } else {
          setErrors(prev => ({ ...prev, events: `Events API Error: ${eventsRes.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, events: 'Events API: Network error' }));
      }

      let volunteersData = { data: [] };
      let totalHours = 0;
      try {
        const volunteersRes = await fetch('http://192.168.137.83:8000/api/volunteers/');
        if (volunteersRes.ok) {
          volunteersData = await volunteersRes.json();
          if (volunteersData.success && volunteersData.data) {
            totalHours = volunteersData.data.reduce((sum, v) => sum + (v.hours_contributed || 0), 0);
          }
        } else {
          setErrors(prev => ({ ...prev, volunteers: `Volunteers API Error: ${volunteersRes.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, volunteers: 'Volunteers API: Network error' }));
      }

      let partnersData = { data: { total: 0, active: 0 } };
      try {
        const partnersRes = await fetch('http://192.168.137.83:8000/api/partners/stats/');
        if (partnersRes.ok) {
          partnersData = await partnersRes.json();
        } else {
          setErrors(prev => ({ ...prev, partners: `Partners API Error: ${partnersRes.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, partners: 'Partners API: Network error' }));
      }

      let newsData = { data: [] };
      try {
        const newsRes = await fetch('http://192.168.137.83:8000/api/news/');
        if (newsRes.ok) {
          newsData = await newsRes.json();
        } else {
          setErrors(prev => ({ ...prev, news: `News API Error: ${newsRes.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, news: 'News API: Network error' }));
      }

      let programsData = { data: [] };
      try {
        const programsRes = await fetch('http://192.168.137.83:8000/api/programs/');
        if (programsRes.ok) {
          programsData = await programsRes.json();
        } else {
          setErrors(prev => ({ ...prev, programs: `Programs API Error: ${programsRes.status}` }));
        }
      } catch (err) {
        setErrors(prev => ({ ...prev, programs: 'Programs API: Network error' }));
      }

      setStats({
        total_users: usersData.data?.total_users || 0,
        active_users: usersData.data?.active_users || 0,
        total_projects: projectsData.data?.total || 0,
        ongoing_projects: projectsData.data?.ongoing || 0,
        completed_projects: projectsData.data?.completed || 0,
        total_events: eventsData.data?.length || 0,
        total_volunteers: volunteersData.data?.length || 0,
        total_partners: partnersData.data?.data?.total || 0,
        active_partners: partnersData.data?.data?.active || 0,
        total_news: newsData.data?.length || 0,
        total_programs: programsData.data?.length || 0,
        volunteer_hours: totalHours
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasAnyError = () => {
    return Object.values(errors).some(err => err !== null);
  };

  const handleCardMouseEnter = (e, hasError) => {
    if (!hasError) {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
    }
  };

  const handleCardMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
  };

  const handleIconMouseEnter = (e, hasError) => {
    if (!hasError) {
      e.currentTarget.style.transform = 'scale(1.1)';
    }
  };

  const handleIconMouseLeave = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
  };

  const handleArrowMouseEnter = (e) => {
    e.currentTarget.style.transform = 'translateX(5px)';
  };

  const handleArrowMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateX(0)';
  };

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
      count: '0',
      path: '/admin/messages',
      error: null
    },
  ];

  const statsCards = [
    { label: 'Total Users', value: stats.total_users, icon: 'fas fa-users', color: '#0B3B2F', error: errors.users },
    { label: 'Active Projects', value: stats.ongoing_projects, icon: 'fas fa-project-diagram', color: '#F9C74F', error: errors.projects },
    { label: 'Total Events', value: stats.total_events, icon: 'fas fa-calendar-check', color: '#2b7a5c', error: errors.events },
    { label: 'Volunteer Hours', value: stats.volunteer_hours, icon: 'fas fa-clock', color: '#F9C74F', error: errors.volunteers },
    { label: 'Active Partners', value: stats.active_partners, icon: 'fas fa-handshake', color: '#0B3B2F', error: errors.partners },
    { label: 'News Articles', value: stats.total_news, icon: 'fas fa-newspaper', color: '#2b7a5c', error: errors.news },
  ];

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {statsCards.map((stat, idx) => (
            <div key={idx} data-aos="fade-up" data-aos-delay={idx * 50} style={{
              background: 'white',
              borderRadius: '20px',
              padding: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease',
              border: stat.error ? '1px solid #ffebee' : 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
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
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0B3B2F' }}>{stat.value.toLocaleString()}</div>
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
                justifyContent: 'center'
              }}>
                <i className={stat.icon} style={{ fontSize: '1.5rem', color: stat.color }}></i>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {adminCards.map((card, idx) => (
            <div
              key={card.id}
              data-aos="zoom-in"
              data-aos-delay={idx * 100}
              onClick={() => !card.error && navigate(card.path)}
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
              onMouseEnter={(e) => handleCardMouseEnter(e, card.error)}
              onMouseLeave={handleCardMouseLeave}
            >
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

              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                background: `radial-gradient(circle, ${card.color}10, transparent)`,
                borderRadius: '50%'
              }} />
              
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
                onMouseEnter={(e) => handleIconMouseEnter(e, card.error)}
                onMouseLeave={handleIconMouseLeave}>
                  <i className={card.icon} style={{ fontSize: '1.8rem', color: card.color }}></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0B3B2F', margin: 0 }}>{card.title}</h3>
                  <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>{card.description}</p>
                </div>
              </div>
              
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
                    <span style={{ fontSize: '0.7rem', color: '#999' }}>Total</span>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: card.color }}>{typeof card.count === 'number' ? card.count.toLocaleString() : card.count}</div>
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
                       onMouseEnter={handleArrowMouseEnter}
                       onMouseLeave={handleArrowMouseLeave} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

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
                fontSize: '0.75rem'
              }}
            >
              <i className="fas fa-sync-alt" style={{ marginRight: '0.3rem' }}></i>
              Retry
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;