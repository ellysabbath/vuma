import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/vuma.png';

const Sidebar = ({ isOpen, onClose, onLoginClick }) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuItems = {
    main: [
      { id: 'home', label: 'Home', icon: 'fas fa-home', path: '/' },
      { id: 'about', label: 'About Us', icon: 'fas fa-info-circle', path: '/about' },
      { 
        id: 'programs', 
        label: 'Programs', 
        icon: 'fas fa-chalkboard-user', 
        path: '/programs', 
        dropdown: true, 
        submenu: [
          { id: 'innovation-leadership', label: 'Innovation Leadership', icon: 'fas fa-lightbulb', path: '/programs' },
          { id: 'environmental-innovation', label: 'Environmental Innovation', icon: 'fas fa-leaf', path: '/programs' },
          { id: 'mentorship', label: 'Mentorship Program', icon: 'fas fa-handshake', path: '/programs' }
        ]
      },
      { id: 'events', label: 'Events', icon: 'fas fa-calendar-alt', path: '/events' },
      { id: 'news', label: 'News & Stories', icon: 'fas fa-newspaper', path: '/news' },
      { id: 'volunteers', label: 'Volunteers', icon: 'fas fa-hands-helping', path: '/volunteers' },
      { id: 'contact', label: 'Contact', icon: 'fas fa-envelope', path: '/contact' }
    ],
    account: [
      { id: 'signin', label: 'Sign In', icon: 'fas fa-sign-in-alt', action: 'login' },
      { id: 'signup', label: 'Sign Up', icon: 'fas fa-user-plus', action: 'signup' },
      { id: 'profile', label: 'User Profile', icon: 'fas fa-user', action: 'profile' },
      { id: 'admin', label: 'Admin Dashboard', icon: 'fas fa-user-shield', action: 'admin' }
    ],
    partners: [
      { id: 'partners', label: 'Become a Partner', icon: 'fas fa-handshake', action: 'partner' },
      { id: 'donate', label: 'Donate', icon: 'fas fa-donate', action: 'donate' }
    ]
  };

  const handleActionClick = (item) => {
    if (item.action === 'login') {
      onLoginClick();
    } else if (item.action === 'signup') {
      alert('Sign up form would open here');
    } else if (item.action === 'profile') {
      alert('User profile would open here');
    } else if (item.action === 'admin') {
      alert('Admin dashboard would open here');
    } else if (item.action === 'partner') {
      alert('Partnership form would open here');
    } else if (item.action === 'donate') {
      alert('Donation page would open here');
    }
    onClose();
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          backgroundColor: '#0B3B2F',
          zIndex: 1000,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header with Logo */}
        <Link
          to="/"
          onClick={onClose}
          style={{
            padding: '1.5rem',
            backgroundColor: '#0a3528',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
            textDecoration: 'none'
          }}
        >
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            overflow: 'hidden'
          }}>
            <img 
              src={logo} 
              alt="VUMA Tanzania Logo" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
          <h3 style={{ color: 'white', margin: 0, fontSize: '1.1rem' }}>VUMA Tanzania</h3>
          <p style={{ color: '#F9C74F', margin: '5px 0 0', fontSize: '0.75rem' }}>Youth Innovation Hub</p>
        </Link>

        {/* Menu Items */}
        <div style={{ 
          flex: 1, 
          padding: '0.5rem 0',
          overflowY: 'auto'
        }}>
          {/* Main Menu */}
          <div>
            <div style={{
              padding: '0.5rem 1.5rem',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.7rem',
              fontWeight: 600
            }}>
              MAIN MENU
            </div>
            
            {menuItems.main.map((item) => (
              <div key={item.id}>
                {item.dropdown ? (
                  <>
                    <div
                      onClick={() => toggleDropdown(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1.5rem',
                        margin: '0 0.5rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        backgroundColor: isActive(item.path) ? 'rgba(249,199,79,0.2)' : 'transparent',
                        color: isActive(item.path) ? '#F9C74F' : 'white'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <i className={item.icon} style={{ width: '20px' }}></i>
                        <span>{item.label}</span>
                      </div>
                      <i className={`fas fa-chevron-${openDropdown === item.id ? 'up' : 'down'}`}></i>
                    </div>
                    
                    {openDropdown === item.id && (
                      <div style={{ paddingLeft: '3rem' }}>
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.id}
                            to={sub.path}
                            onClick={onClose}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '0.6rem 1rem',
                              margin: '0.25rem 0',
                              borderRadius: '8px',
                              color: 'rgba(255,255,255,0.8)',
                              fontSize: '0.85rem',
                              textDecoration: 'none'
                            }}
                          >
                            <i className={sub.icon} style={{ width: '16px' }}></i>
                            <span>{sub.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '0.75rem 1.5rem',
                      margin: '0 0.5rem',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      backgroundColor: isActive(item.path) ? 'rgba(249,199,79,0.2)' : 'transparent',
                      color: isActive(item.path) ? '#F9C74F' : 'white'
                    }}
                  >
                    <i className={item.icon} style={{ width: '20px' }}></i>
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Account Section */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{
              padding: '0.5rem 1.5rem',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.7rem',
              fontWeight: 600
            }}>
              ACCOUNT
            </div>
            
            {menuItems.account.map((item) => (
              <div
                key={item.id}
                onClick={() => handleActionClick(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '0.75rem 1.5rem',
                  margin: '0 0.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >
                <i className={item.icon} style={{ width: '20px' }}></i>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Partners Section */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{
              padding: '0.5rem 1.5rem',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.7rem',
              fontWeight: 600
            }}>
              PARTNERS & SUPPORT
            </div>
            
            {menuItems.partners.map((item) => (
              <div
                key={item.id}
                onClick={() => handleActionClick(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '0.75rem 1.5rem',
                  margin: '0 0.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >
                <i className={item.icon} style={{ width: '20px' }}></i>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <a href="#" style={{ color: 'white' }}><i className="fab fa-instagram"></i></a>
            <a href="#" style={{ color: 'white' }}><i className="fab fa-twitter"></i></a>
            <a href="#" style={{ color: 'white' }}><i className="fab fa-facebook-f"></i></a>
            <a href="#" style={{ color: 'white' }}><i className="fab fa-linkedin"></i></a>
          </div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
            © 2026 VUMA Tanzania
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;