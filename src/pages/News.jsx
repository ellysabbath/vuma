import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { blogPosts } from '../data';

const News = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  const displayedPosts = blogPosts.slice(0, visibleCount);
  const hasMore = visibleCount < blogPosts.length;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, blogPosts.length));
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h1 data-aos="fade-up" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>
          News & Stories
        </h1>
        <p data-aos="fade-up" data-aos-delay="200" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>
          Stay updated with the latest from VUMA Tanzania
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {displayedPosts.map((post, idx) => (
            <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100} style={{
              background: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>
                  <i className="far fa-calendar-alt" style={{ marginRight: '0.3rem' }}></i>
                  {post.date} • {post.readTime}
                </span>
                <h3 style={{ color: '#0B3B2F', margin: '0.5rem 0' }}>{post.title}</h3>
                <p style={{ color: '#666', marginBottom: '1rem' }}>Discover how VUMA Tanzania is making a difference...</p>
                <a href="#" style={{ color: '#F9C74F', textDecoration: 'none', fontWeight: 600 }}>Read More →</a>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button onClick={loadMore} style={{
              background: '#F9C74F',
              border: 'none',
              padding: '0.8rem 2rem',
              borderRadius: '50px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              Load More Stories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;