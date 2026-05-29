import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([
    { id: 1, title: 'Solar-Powered Water Pump', category: 'Environment', status: 'Ongoing', progress: 75 },
    { id: 2, title: 'Youth Leadership Academy', category: 'Leadership', status: 'Completed', progress: 100 },
    { id: 3, title: 'Plastic Upcycling Hub', category: 'Environment', status: 'Ongoing', progress: 60 },
    { id: 4, title: 'Policy Innovators Fellowship', category: 'Leadership', status: 'Planning', progress: 30 },
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
            <h1 style={{ fontSize: '1.8rem' }}>Projects Management</h1>
          </div>
          <p>Track and manage all ongoing and completed projects</p>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {projects.map(project => (
              <div key={project.id} style={{ padding: '1rem', border: '1px solid #f0f0f0', borderRadius: '12px' }}>
                <h4>{project.title}</h4>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>{project.category}</p>
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{
                    background: project.status === 'Completed' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(249,199,79,0.1)',
                    color: project.status === 'Completed' ? '#4caf50' : '#F9C74F',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    fontSize: '0.7rem'
                  }}>{project.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;