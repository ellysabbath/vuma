import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminPartners = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([
    { id: 1, name: 'UNDP', type: 'Development Partner', status: 'Active', since: '2024' },
    { id: 2, name: 'UNICEF', type: 'Development Partner', status: 'Active', since: '2024' },
    { id: 3, name: 'WWF', type: 'Environmental Partner', status: 'Active', since: '2025' },
    { id: 4, name: 'Greenpeace', type: 'Environmental Partner', status: 'Pending', since: '2025' },
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
            <h1 style={{ fontSize: '1.8rem' }}>Partners Management</h1>
          </div>
          <p>Manage organizational partners and collaborations</p>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {partners.map(partner => (
              <div key={partner.id} style={{ padding: '1rem', border: '1px solid #f0f0f0', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4>{partner.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#888' }}>{partner.type} • Since {partner.since}</p>
                </div>
                <span style={{
                  background: partner.status === 'Active' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                  color: partner.status === 'Active' ? '#4caf50' : '#ff9800',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem'
                }}>{partner.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPartners;