import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', subject: 'Partnership Inquiry', message: 'I would like to partner with VUMA...', date: '2026-05-20', status: 'Unread' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', subject: 'Volunteer Application', message: 'I want to volunteer for the tree planting...', date: '2026-05-19', status: 'Read' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', subject: 'Sponsorship Request', message: 'Our company would like to sponsor...', date: '2026-05-18', status: 'Unread' },
  ]);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  const handleMarkAsRead = (id) => {
    setMessages(messages.map(msg => msg.id === id ? { ...msg, status: 'Read' } : msg));
    alert('Message marked as read');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter(msg => msg.id !== id));
      alert('Message deleted');
    }
  };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '2rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => navigate('/admin')}></i>
            <h1 style={{ fontSize: '1.8rem' }}>Messages Management</h1>
          </div>
          <p>View and respond to contact messages</p>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          {messages.map(message => (
            <div key={message.id} style={{
              padding: '1rem',
              borderBottom: '1px solid #f0f0f0',
              background: message.status === 'Unread' ? 'rgba(249,199,79,0.05)' : 'transparent'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div>
                  <strong>{message.name}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#888', marginLeft: '0.5rem' }}>{message.email}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {message.status === 'Unread' && (
                    <i className="fas fa-check-circle" style={{ color: '#4caf50', cursor: 'pointer' }} onClick={() => handleMarkAsRead(message.id)}></i>
                  )}
                  <i className="fas fa-trash" style={{ color: '#d32f2f', cursor: 'pointer' }} onClick={() => handleDelete(message.id)}></i>
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0B3B2F' }}>{message.subject}</div>
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.3rem' }}>{message.message}</div>
              <div style={{ fontSize: '0.65rem', color: '#999', marginTop: '0.3rem' }}>{message.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;