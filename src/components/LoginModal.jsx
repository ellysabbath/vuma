import React, { useState, useEffect } from 'react';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('Please enter email to continue');
      return;
    }
    alert(`Welcome back ${email}! Access granted to VUMA hub.`);
    setEmail('');
    setPassword('');
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="login-modal" style={{
      display: 'flex',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      zIndex: 2000,
      justifyContent: 'center',
      alignItems: 'center',
      animation: 'fadeIn 0.3s'
    }} onClick={onClose}>
      <div className="login-card" style={{
        background: 'white',
        borderRadius: '40px',
        padding: '2rem',
        width: '90%',
        maxWidth: '380px',
        textAlign: 'center',
        position: 'relative'
      }} onClick={(e) => e.stopPropagation()}>
        <span onClick={onClose} style={{
          position: 'absolute',
          right: '1rem',
          top: '0.8rem',
          fontSize: '1.8rem',
          cursor: 'pointer'
        }}>&times;</span>
        
        <h2 style={{ marginBottom: '1rem' }}><i className="fas fa-leaf"></i> Welcome Back</h2>
        
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem',
              margin: '0.6rem 0',
              borderRadius: '50px',
              border: '1px solid #ccc'
            }}
          />
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem',
              margin: '0.6rem 0',
              borderRadius: '50px',
              border: '1px solid #ccc'
            }}
          />
          <button type="submit" style={{
            background: '#0B3B2F',
            width: '100%',
            padding: '0.8rem',
            borderRadius: '50px',
            color: 'white',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            marginTop: '0.5rem'
          }}>
            Access Dashboard
          </button>
        </form>
        
        <p style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
          New? <a href="#" onClick={(e) => { e.preventDefault(); alert('Contact VUMA for registration'); }}>Create account</a>
        </p>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoginModal;