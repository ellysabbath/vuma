import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/vuma.png';

const Navbar = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isSidebarOpen && !e.target.closest('.sidebar-container') && !e.target.closest('.menu-toggle-btn')) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isSidebarOpen]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    setIsUserMenuOpen(false);
    if (!isLoggedIn) {
      onLoginClick();
      setTimeout(() => setIsLoggedIn(true), 500);
    }
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsUserMenuOpen(false);
    setIsLoggedIn(false);
    alert('You have been logged out successfully!');
  };

  const handleSettingsClick = (e) => {
    e.preventDefault();
    setIsUserMenuOpen(false);
    navigate('/settings');
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    setIsUserMenuOpen(false);
    navigate('/profile');
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeSidebar();
  };

  return (
    <>
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        zIndex: 1000,
        padding: '0 1rem',
        transition: 'all 0.3s ease',
        background: scrolled ? '#0B3B2F' : '#0B3B2F',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 4px 20px rgba(4, 58, 21, 0.2)' : 'none',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%'
        }}>
          {/* Menu Toggle Button */}
          <button 
            className="menu-toggle-btn"
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              transition: 'background 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: scrolled ? 'rgba(255,255,255,0.15)' : 'transparent',
              flexShrink: 0
            }}
            aria-label="Open Menu"
          >
            <div style={{
              position: 'relative',
              width: '20px',
              height: '20px'
            }}>
              <span style={{
                position: 'absolute',
                top: '3px',
                left: 0,
                width: '20px',
                height: '2px',
                background: 'white',
                transition: 'transform 0.3s ease'
              }}></span>
              <span style={{
                position: 'absolute',
                top: '9px',
                left: 0,
                width: '20px',
                height: '2px',
                background: 'white',
                transition: 'opacity 0.3s ease'
              }}></span>
              <span style={{
                position: 'absolute',
                bottom: '3px',
                left: 0,
                width: '20px',
                height: '2px',
                background: 'white',
                transition: 'transform 0.3s ease'
              }}></span>
            </div>
          </button>

          {/* Logo with Image - Navigate to Home */}
          <Link 
            to="/" 
            onClick={closeSidebar}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              flex: 1,
              textDecoration: 'none'
            }}
          >
            <div style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
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
            
            <div style={{ 
              fontSize: 'clamp(1rem, 4vw, 1.3rem)', 
              fontWeight: 800, 
              color: 'white', 
              letterSpacing: '-0.5px', 
              textShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}>
              VUMA <span style={{ color: '#F9C74F' }}>TANZANIA</span>
            </div>
          </Link>

          {/* User Profile Circle with Dropdown */}
          <div style={{ position: 'relative' }} ref={userMenuRef}>
            <button
              onClick={toggleUserMenu}
              style={{
                background: isLoggedIn ? 'linear-gradient(135deg, #F9C74F, #f6b83e)' : 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(249,199,79,0.5)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                color: isLoggedIn ? '#0B3B2F' : 'white',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 3px 10px rgba(249,199,79,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {isLoggedIn ? (
                <i className="fas fa-user-check"></i>
              ) : (
                <i className="fas fa-user"></i>
              )}
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '50px',
                right: '0',
                width: '220px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                overflow: 'hidden',
                zIndex: 1001,
                animation: 'slideDown 0.3s ease'
              }}>
                <div style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#F9C74F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                    fontSize: '1.3rem'
                  }}>
                    <i className="fas fa-leaf" style={{ color: '#0B3B2F' }}></i>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {isLoggedIn ? 'Welcome Back!' : 'Guest User'}
                  </div>
                  {isLoggedIn && (
                    <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>user@vuma.or.tz</div>
                  )}
                </div>

                {!isLoggedIn ? (
                  <a
                    href="#"
                    onClick={handleLoginClick}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '0.8rem 1rem',
                      color: '#333',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <i className="fas fa-sign-in-alt" style={{ width: '20px', color: '#F9C74F' }}></i>
                    <span style={{ flex: 1 }}>Login</span>
                    <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem', opacity: 0.5 }}></i>
                  </a>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '0.8rem 1rem',
                        color: '#333',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        borderBottom: '1px solid #f0f0f0'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <i className="fas fa-user-circle" style={{ width: '20px', color: '#F9C74F' }}></i>
                      <span style={{ flex: 1 }}>My Profile</span>
                      <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem', opacity: 0.5 }}></i>
                    </Link>
                    
                    <Link
                      to="/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '0.8rem 1rem',
                        color: '#333',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        borderBottom: '1px solid #f0f0f0'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <i className="fas fa-cog" style={{ width: '20px', color: '#F9C74F' }}></i>
                      <span style={{ flex: 1 }}>Settings</span>
                      <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem', opacity: 0.5 }}></i>
                    </Link>
                    
                    <a
                      href="#"
                      onClick={handleLogoutClick}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '0.8rem 1rem',
                        color: '#d32f2f',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffebee'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <i className="fas fa-sign-out-alt" style={{ width: '20px', color: '#d32f2f' }}></i>
                      <span style={{ flex: 1 }}>Logout</span>
                      <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem', opacity: 0.5 }}></i>
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 999,
            animation: 'fadeIn 0.3s ease',
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Sidebar */}
      <div 
        className="sidebar-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 'min(85%, 320px)',
          backgroundColor: '#0B3B2F',
          zIndex: 1000,
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '2px 0 20px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {/* Sidebar Header with Logo Image */}
        <Link
          to="/"
          onClick={closeSidebar}
          style={{
            padding: '1.5rem',
            backgroundColor: '#0a3528',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'block'
          }}
        >
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
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
          <p style={{ color: '#F9C74F', margin: '5px 0 0', fontSize: '0.7rem' }}>Youth Innovation Hub</p>
        </Link>

        {/* Menu Items - Navigation Links */}
        <div style={{ flex: 1, padding: '0.5rem 0' }}>
          {/* Main Menu Section */}
          <div>
            <div style={{
              padding: '0.75rem 1.5rem',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.7rem',
              letterSpacing: '1px',
              fontWeight: 600
            }}>
              MAIN MENU
            </div>
            
            <Link to="/" onClick={closeSidebar} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1.5rem',
              margin: '0 0.5rem', borderRadius: '12px', color: 'white', textDecoration: 'none',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <i className="fas fa-home" style={{ width: '20px', color: '#F9C74F' }}></i>
              <span>Home</span>
            </Link>

            <Link to="/about" onClick={closeSidebar} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1.5rem',
              margin: '0 0.5rem', borderRadius: '12px', color: 'white', textDecoration: 'none',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <i className="fas fa-info-circle" style={{ width: '20px', color: '#F9C74F' }}></i>
              <span>About Us</span>
            </Link>

            <Link to="/programs" onClick={closeSidebar} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1.5rem',
              margin: '0 0.5rem', borderRadius: '12px', color: 'white', textDecoration: 'none',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <i className="fas fa-chalkboard-user" style={{ width: '20px', color: '#F9C74F' }}></i>
              <span>Programs</span>
            </Link>

            <Link to="/events" onClick={closeSidebar} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1.5rem',
              margin: '0 0.5rem', borderRadius: '12px', color: 'white', textDecoration: 'none',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <i className="fas fa-calendar-alt" style={{ width: '20px', color: '#F9C74F' }}></i>
              <span>Events</span>
            </Link>

            <Link to="/news" onClick={closeSidebar} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1.5rem',
              margin: '0 0.5rem', borderRadius: '12px', color: 'white', textDecoration: 'none',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <i className="fas fa-newspaper" style={{ width: '20px', color: '#F9C74F' }}></i>
              <span>News & Stories</span>
            </Link>

            <Link to="/volunteers" onClick={closeSidebar} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1.5rem',
              margin: '0 0.5rem', borderRadius: '12px', color: 'white', textDecoration: 'none',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <i className="fas fa-hands-helping" style={{ width: '20px', color: '#F9C74F' }}></i>
              <span>Volunteers</span>
            </Link>

            <Link to="/contact" onClick={closeSidebar} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1.5rem',
              margin: '0 0.5rem', borderRadius: '12px', color: 'white', textDecoration: 'none',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <i className="fas fa-envelope" style={{ width: '20px', color: '#F9C74F' }}></i>
              <span>Contact Us</span>
            </Link>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 1.5rem' }} />

          {/* Account Section */}
          <div>
            <div style={{ padding: '0.75rem 1.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '1px', fontWeight: 600 }}>
              ACCOUNT
            </div>
            <div onClick={() => { closeSidebar(); onLoginClick(); }} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1.5rem',
              margin: '0 0.5rem', borderRadius: '12px', color: 'white', cursor: 'pointer',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <i className="fas fa-sign-in-alt" style={{ width: '20px', color: '#F9C74F' }}></i>
              <span>Sign In</span>
            </div>
            <div onClick={() => { closeSidebar(); alert('Sign up form would open here'); }} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1.5rem',
              margin: '0 0.5rem', borderRadius: '12px', color: 'white', cursor: 'pointer',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <i className="fas fa-user-plus" style={{ width: '20px', color: '#F9C74F' }}></i>
              <span>Sign Up</span>
            </div>
            <Link to="/profile" onClick={closeSidebar} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1.5rem',
              margin: '0 0.5rem', borderRadius: '12px', color: 'white', textDecoration: 'none',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <i className="fas fa-user" style={{ width: '20px', color: '#F9C74F' }}></i>
              <span>User Profile</span>
            </Link>
            <Link to="/admin" onClick={closeSidebar} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1.5rem',
              margin: '0 0.5rem', borderRadius: '12px', color: 'white', textDecoration: 'none',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <i className="fas fa-user-shield" style={{ width: '20px', color: '#F9C74F' }}></i>
              <span>Admin Dashboard</span>
            </Link>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 1.5rem' }} />

          {/* Partners Section */}
          <div>
            <div style={{ padding: '0.75rem 1.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '1px', fontWeight: 600 }}>
              PARTNERS & SUPPORT
            </div>
            <div onClick={() => { closeSidebar(); alert('Partnership form would open here'); }} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1.5rem',
              margin: '0 0.5rem', borderRadius: '12px', color: 'white', cursor: 'pointer',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <i className="fas fa-handshake" style={{ width: '20px', color: '#F9C74F' }}></i>
              <span>Become a Partner</span>
            </div>
            <div onClick={() => { closeSidebar(); alert('Donation page would open here'); }} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1.5rem',
              margin: '0 0.5rem', borderRadius: '12px', color: 'white', cursor: 'pointer',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <i className="fas fa-donate" style={{ width: '20px', color: '#F9C74F' }}></i>
              <span>Donate</span>
            </div>
          </div>
        </div>

        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
            <a href="#" style={{ color: 'white', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#F9C74F'} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" style={{ color: 'white', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#F9C74F'} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" style={{ color: 'white', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#F9C74F'} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" style={{ color: 'white', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#F9C74F'} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
            © 2026 VUMA Tanzania<br />All Rights Reserved
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .sidebar-container {
          -webkit-overflow-scrolling: touch;
        }
        
        .sidebar-container::-webkit-scrollbar {
          width: 4px;
        }
        
        .sidebar-container::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
        }
        
        .sidebar-container::-webkit-scrollbar-thumb {
          background: #F9C74F;
          border-radius: 2px;
        }
        
        @media (max-width: 768px) {
          .sidebar-container {
            width: 85% !important;
            max-width: 280px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;