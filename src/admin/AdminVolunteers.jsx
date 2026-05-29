import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminVolunteers = () => {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', area: 'Community Outreach', hours: 45, status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', area: 'Event Coordination', hours: 32, status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', area: 'Digital Media', hours: 28, status: 'Pending' },
  ]);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7' }}>
      <div style={{ background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)', color: 'white', padding: '2rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => navigate('/admin')}></i>
            <h1 style={{ fontSize: '1.8rem' }}>Volunteers Management</h1>
          </div>
          <p>Manage volunteer applications and assignments</p>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Area</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Hours</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Status</th>
                 </tr>
              </thead>
              <tbody>
                {volunteers.map(vol => (
                  <tr key={vol.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.8rem' }}>{vol.name}</td>
                    <td style={{ padding: '0.8rem' }}>{vol.email}</td>
                    <td style={{ padding: '0.8rem' }}>{vol.area}</td>
                    <td style={{ padding: '0.8rem' }}>{vol.hours}</td>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{
                        background: vol.status === 'Active' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                        color: vol.status === 'Active' ? '#4caf50' : '#ff9800',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem'
                      }}>{vol.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVolunteers;