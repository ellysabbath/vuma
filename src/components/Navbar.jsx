import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/vuma.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const userMenuRef = useRef(null);
  const servicesDropdownRef = useRef(null);
  const aboutDropdownRef = useRef(null);
  const aboutTimeoutRef = useRef(null);
  const servicesTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(e.target)) {
        setIsServicesDropdownOpen(false);
      }
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(e.target)) {
        setIsAboutDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isSidebarOpen && !e.target.closest('.sidebar-container') && !e.target.closest('.menu-toggle-btn')) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isSidebarOpen]);

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

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsUserMenuOpen(false);
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleProfileClick = () => {
    setIsUserMenuOpen(false);
    navigate('/profile');
  };

  const handleAboutMouseEnter = () => {
    if (aboutTimeoutRef.current) {
      clearTimeout(aboutTimeoutRef.current);
    }
    setIsAboutDropdownOpen(true);
  };

  const handleAboutMouseLeave = () => {
    aboutTimeoutRef.current = setTimeout(() => {
      setIsAboutDropdownOpen(false);
    }, 200);
  };

  const handleAboutMenuEnter = () => {
    if (aboutTimeoutRef.current) {
      clearTimeout(aboutTimeoutRef.current);
    }
  };

  const handleAboutMenuLeave = () => {
    aboutTimeoutRef.current = setTimeout(() => {
      setIsAboutDropdownOpen(false);
    }, 200);
  };

  const handleServicesMouseEnter = () => {
    if (servicesTimeoutRef.current) {
      clearTimeout(servicesTimeoutRef.current);
    }
    setIsServicesDropdownOpen(true);
  };

  const handleServicesMouseLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setIsServicesDropdownOpen(false);
    }, 200);
  };

  const handleServicesMenuEnter = () => {
    if (servicesTimeoutRef.current) {
      clearTimeout(servicesTimeoutRef.current);
    }
  };

  const handleServicesMenuLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setIsServicesDropdownOpen(false);
    }, 200);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const aboutItems = [
    { id: 'leaders', label: 'Our Leaders', icon: 'fas fa-users', path: '/leadership' },
    { id: 'mission', label: 'Our Mission', icon: 'fas fa-bullseye', path: '/about#mission' },
    { id: 'events', label: 'Events', icon: 'fas fa-calendar-alt', path: '/events' },
    { id: 'volunteers', label: 'Volunteers', icon: 'fas fa-hands-helping', path: '/volunteers' }
  ];

  const servicesItems = [
    { id: 'home', label: 'Home', icon: 'fas fa-home', path: '/' },
    { id: 'programs', label: 'Programs', icon: 'fas fa-chalkboard-user', path: '/programs' },
    { id: 'partners', label: 'Partners', icon: 'fas fa-handshake', path: '/partners' },
    { id: 'news', label: 'News & Stories', icon: 'fas fa-newspaper', path: '/news' },
    { id: 'contact', label: 'Contact', icon: 'fas fa-envelope', path: '/contact' }
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        zIndex: 1000,
        padding: '0 1rem',
        transition: 'all 0.3s ease',
        background: '#0B3B2F',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 4px 20px rgba(4, 58, 21, 0.2)' : '0 2px 10px rgba(0,0,0,0.1)',
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

          <Link 
            to="/" 
            onClick={closeSidebar}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
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

          <div className="desktop-nav-buttons" style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div 
              style={{ position: 'relative' }} 
              ref={aboutDropdownRef}
              onMouseEnter={handleAboutMouseEnter}
              onMouseLeave={handleAboutMouseLeave}
            >
              <button
                style={{
                  background: isActive('/about') ? 'rgba(249,199,79,0.1)' : 'none',
                  border: 'none',
                  color: isActive('/about') ? '#F9C74F' : 'white',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)';
                  e.currentTarget.style.color = '#F9C74F';
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/about')) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'white';
                  }
                }}
              >
                <i className="fas fa-info-circle" style={{ fontSize: '0.8rem' }}></i>
                About Us
                <i className={`fas fa-chevron-${isAboutDropdownOpen ? 'up' : 'down'}`} style={{ fontSize: '0.7rem', marginLeft: '4px', transition: 'transform 0.3s ease' }}></i>
              </button>

              {isAboutDropdownOpen && (
                <div 
                  className="dropdown-menu" 
                  onMouseEnter={handleAboutMenuEnter}
                  onMouseLeave={handleAboutMenuLeave}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% - 5px)',
                    left: '0',
                    minWidth: '220px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    overflow: 'hidden',
                    zIndex: 1001,
                    marginTop: '5px',
                    animation: 'fadeInUp 0.3s ease'
                  }}
                >
                  {aboutItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={() => setIsAboutDropdownOpen(false)}
                      className="dropdown-item"
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
                      <i className={item.icon} style={{ width: '20px', color: '#F9C74F' }}></i>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem', opacity: 0.5, transition: 'transform 0.3s ease' }}></i>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div 
              style={{ position: 'relative' }} 
              ref={servicesDropdownRef}
              onMouseEnter={handleServicesMouseEnter}
              onMouseLeave={handleServicesMouseLeave}
            >
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)';
                  e.currentTarget.style.color = '#F9C74F';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'white';
                }}
              >
                <i className="fas fa-chalkboard-user" style={{ fontSize: '0.8rem' }}></i>
                Our Services
                <i className={`fas fa-chevron-${isServicesDropdownOpen ? 'up' : 'down'}`} style={{ fontSize: '0.7rem', marginLeft: '4px', transition: 'transform 0.3s ease' }}></i>
              </button>

              {isServicesDropdownOpen && (
                <div 
                  className="dropdown-menu" 
                  onMouseEnter={handleServicesMenuEnter}
                  onMouseLeave={handleServicesMenuLeave}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% - 5px)',
                    left: '0',
                    minWidth: '220px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    overflow: 'hidden',
                    zIndex: 1001,
                    marginTop: '5px',
                    animation: 'fadeInUp 0.3s ease'
                  }}
                >
                  {servicesItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={() => setIsServicesDropdownOpen(false)}
                      className="dropdown-item"
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
                      <i className={item.icon} style={{ width: '20px', color: '#F9C74F' }}></i>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem', opacity: 0.5, transition: 'transform 0.3s ease' }}></i>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/news"
              className="desktop-nav-link"
              style={{
                color: isActive('/news') ? '#F9C74F' : 'white',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: isActive('/news') ? 'rgba(249,199,79,0.1)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)';
                e.currentTarget.style.color = '#F9C74F';
              }}
              onMouseLeave={(e) => {
                if (!isActive('/news')) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'white';
                }
              }}
            >
              <i className="fas fa-blog" style={{ fontSize: '0.8rem' }}></i>
              Blog
            </Link>

            <Link 
              to="/contact"
              className="desktop-nav-link"
              style={{
                color: isActive('/contact') ? '#F9C74F' : 'white',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: isActive('/contact') ? 'rgba(249,199,79,0.1)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)';
                e.currentTarget.style.color = '#F9C74F';
              }}
              onMouseLeave={(e) => {
                if (!isActive('/contact')) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'white';
                }
              }}
            >
              <i className="fas fa-envelope" style={{ fontSize: '0.8rem' }}></i>
              Contact
            </Link>

            <Link 
              to="/donate"
              className="donate-btn"
              style={{
                background: 'linear-gradient(135deg, #F9C74F, #f6b83e)',
                border: 'none',
                color: '#0B3B2F',
                fontSize: '0.9rem',
                fontWeight: 700,
                padding: '0.4rem 1.2rem',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(249,199,79,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <i className="fas fa-heart" style={{ fontSize: '0.8rem' }}></i>
              Donate
            </Link>
          </div>

          <div style={{ position: 'relative' }} ref={userMenuRef}>
            {isLoggedIn && user ? (
              <button
                onClick={toggleUserMenu}
                style={{
                  background: 'none',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  padding: 0,
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {user.profile_picture ? (
                  <img 
                    src={user.profile_picture} 
                    alt="Profile" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      border: '2px solid #F9C74F',
                      borderRadius: '50%'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F9C74F, #f6b83e)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0B3B2F'
                  }}>
                    <i className="fas fa-user" style={{ fontSize: '1.2rem' }}></i>
                  </div>
                )}
              </button>
            ) : (
              <Link
                to="/login"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(249,199,79,0.5)',
                  padding: '0.4rem 1rem',
                  borderRadius: '40px',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                }}
              >
                <i className="fas fa-sign-in-alt"></i>
                Login
              </Link>
            )}

            {isUserMenuOpen && isLoggedIn && user && (
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
                animation: 'fadeInUp 0.3s ease'
              }}>
                <div style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  {user.profile_picture ? (
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      margin: '0 auto 8px',
                      overflow: 'hidden',
                      border: '2px solid #F9C74F'
                    }}>
                      <img 
                        src={user.profile_picture} 
                        alt="Profile" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
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
                      <i className="fas fa-user" style={{ color: '#0B3B2F' }}></i>
                    </div>
                  )}
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Welcome Back!</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{user.email || user.username}</div>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="dropdown-item"
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
                
                {user.role === 'Admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="dropdown-item"
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
                    <i className="fas fa-user-shield" style={{ width: '20px', color: '#F9C74F' }}></i>
                    <span style={{ flex: 1 }}>Admin Dashboard</span>
                    <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem', opacity: 0.5 }}></i>
                  </Link>
                )}
                
                <button
                  onClick={handleLogoutClick}
                  className="dropdown-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '0.8rem 1rem',
                    color: '#d32f2f',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffebee'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <i className="fas fa-sign-out-alt" style={{ width: '20px', color: '#d32f2f' }}></i>
                  <span style={{ flex: 1 }}>Logout</span>
                  <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem', opacity: 0.5 }}></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

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

        <div style={{ flex: 1, padding: '0.5rem 0' }}>
          <div>
            <div style={{ padding: '0.75rem 1.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '1px', fontWeight: 600 }}>
              MAIN MENU
            </div>
            
            {[
              { to: '/', icon: 'fas fa-home', label: 'Home' },
              { to: '/about', icon: 'fas fa-info-circle', label: 'About Us' },
              { to: '/programs', icon: 'fas fa-chalkboard-user', label: 'Programs' },
              { to: '/events', icon: 'fas fa-calendar-alt', label: 'Events' },
              { to: '/news', icon: 'fas fa-newspaper', label: 'News & Stories' },
              { to: '/volunteers', icon: 'fas fa-hands-helping', label: 'Volunteers' },
              { to: '/partners', icon: 'fas fa-handshake', label: 'Partners' },
              { to: '/contact', icon: 'fas fa-envelope', label: 'Contact Us' }
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '0.875rem 1.5rem',
                  margin: '0 0.5rem',
                  borderRadius: '12px',
                  color: isActive(item.to) ? '#F9C74F' : 'white',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  backgroundColor: isActive(item.to) ? 'rgba(249,199,79,0.2)' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.to)) {
                    e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.to)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <i className={item.icon} style={{ width: '20px', color: '#F9C74F' }}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 1.5rem' }} />

          <div>
            <div style={{ padding: '0.75rem 1.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '1px', fontWeight: 600 }}>
              ACCOUNT
            </div>
            
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={closeSidebar}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '0.875rem 1.5rem',
                    margin: '0 0.5rem',
                    borderRadius: '12px',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <i className="fas fa-sign-in-alt" style={{ width: '20px', color: '#F9C74F' }}></i>
                  <span>Sign In</span>
                </Link>
                
                <Link
                  to="/signup"
                  onClick={closeSidebar}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '0.875rem 1.5rem',
                    margin: '0 0.5rem',
                    borderRadius: '12px',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <i className="fas fa-user-plus" style={{ width: '20px', color: '#F9C74F' }}></i>
                  <span>Sign Up</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" onClick={closeSidebar} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1.5rem',
                  margin: '0 0.5rem', borderRadius: '12px', color: 'white', textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <i className="fas fa-user" style={{ width: '20px', color: '#F9C74F' }}></i>
                  <span>My Profile</span>
                </Link>
                
                {user?.role === 'admin' && (
                  <Link to="/admin" onClick={closeSidebar} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1.5rem',
                    margin: '0 0.5rem', borderRadius: '12px', color: 'white', textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
                     onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <i className="fas fa-user-shield" style={{ width: '20px', color: '#F9C74F' }}></i>
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                
                <button onClick={handleLogoutClick} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1.5rem',
                  margin: '0 0.5rem', borderRadius: '12px', color: '#ff6b6b', background: 'none',
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', width: '100%'
                }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,107,107,0.1)'}
                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <i className="fas fa-sign-out-alt" style={{ width: '20px' }}></i>
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 1.5rem' }} />

          <div>
            <div style={{ padding: '0.75rem 1.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '1px', fontWeight: 600 }}>
              SUPPORT
            </div>
            
            <Link to="/donate" onClick={closeSidebar} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1.5rem',
              margin: '0 0.5rem', borderRadius: '12px', color: 'white', textDecoration: 'none',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,199,79,0.1)'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <i className="fas fa-donate" style={{ width: '20px', color: '#F9C74F' }}></i>
              <span>Donate</span>
            </Link>
          </div>
        </div>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
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
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .dropdown-menu {
          animation: fadeInUp 0.3s ease;
        }
        
        .dropdown-item:hover i:last-child {
          transform: translateX(4px);
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
        
        @media (min-width: 992px) {
          .desktop-nav-buttons {
            display: flex !important;
          }
        }
        
        @media (max-width: 991px) {
          .desktop-nav-buttons {
            display: none !important;
          }
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