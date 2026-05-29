import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  const adminCards = [
    { 
      id: 'users', 
      title: 'Users Management', 
      icon: 'fas fa-users', 
      color: '#0B3B2F', 
      description: 'Manage all registered users, their roles and permissions',
      count: '1,248',
      path: '/admin/users',
      bgColor: '#e8f5e9'
    },
    { 
      id: 'projects', 
      title: 'Projects', 
      icon: 'fas fa-project-diagram', 
      color: '#F9C74F', 
      description: 'Track and manage all ongoing and completed projects',
      count: '18',
      path: '/admin/projects',
      bgColor: '#fff3e0'
    },
    { 
      id: 'events', 
      title: 'Events', 
      icon: 'fas fa-calendar-alt', 
      color: '#2b7a5c', 
      description: 'Organize and manage all events and activities',
      count: '24',
      path: '/admin/events',
      bgColor: '#e0f2f1'
    },
    { 
      id: 'volunteers', 
      title: 'Volunteers', 
      icon: 'fas fa-hands-helping', 
      color: '#F9C74F', 
      description: 'Manage volunteer applications and assignments',
      count: '435',
      path: '/admin/volunteers',
      bgColor: '#fff8e1'
    },
    { 
      id: 'partners', 
      title: 'Partners', 
      icon: 'fas fa-handshake', 
      color: '#0B3B2F', 
      description: 'Manage organizational partners and collaborations',
      count: '32',
      path: '/admin/partners',
      bgColor: '#e8eaf6'
    },
    { 
      id: 'messages', 
      title: 'Messages', 
      icon: 'fas fa-envelope', 
      color: '#2b7a5c', 
      description: 'View and respond to contact messages',
      count: '45',
      path: '/admin/messages',
      bgColor: '#fce4ec'
    },
  ];

  const stats = [
    { label: 'Total Users', value: '1,248', icon: 'fas fa-users', color: '#0B3B2F', change: '+12%' },
    { label: 'Active Projects', value: '18', icon: 'fas fa-project-diagram', color: '#F9C74F', change: '+5%' },
    { label: 'Completed Events', value: '24', icon: 'fas fa-calendar-check', color: '#2b7a5c', change: '+8%' },
    { label: 'Volunteer Hours', value: '3,245', icon: 'fas fa-clock', color: '#F9C74F', change: '+15%' },
    { label: 'Partners', value: '32', icon: 'fas fa-handshake', color: '#0B3B2F', change: '+3%' },
    { label: 'Trees Planted', value: '18,750', icon: 'fas fa-tree', color: '#2b7a5c', change: '+22%' },
  ];

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      {/* Admin Header */}
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

      {/* Stats Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {stats.map((stat, idx) => (
            <div key={idx} data-aos="fade-up" data-aos-delay={idx * 50} style={{
              background: 'white',
              borderRadius: '20px',
              padding: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>{stat.label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0B3B2F' }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#4caf50', marginTop: '0.5rem' }}>{stat.change} from last month</div>
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
              onClick={() => navigate(card.path)}
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '1.5rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
              }}
            >
              {/* Decorative element */}
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
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  <i className={card.icon} style={{ fontSize: '1.8rem', color: card.color }}></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0B3B2F', margin: 0 }}>{card.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>{card.description}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#999' }}>Total</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: card.color }}>{card.count}</div>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;