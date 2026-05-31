import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.137.83:8000/api/news/');
      const data = await response.json();
      if (data.success) {
        setNews(data.data);
      } else {
        setError('Failed to load news');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id, e) => {
    e.stopPropagation();
    setLiking(true);
    try {
      const response = await fetch(`http://192.168.137.83:8000/api/news/${id}/like/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setNews(prevNews => 
          prevNews.map(item => 
            item.id === id ? { ...item, likes: data.likes } : item
          )
        );
        if (selectedPost && selectedPost.id === id) {
          setSelectedPost({ ...selectedPost, likes: data.likes });
        }
      }
    } catch (error) {
      console.error('Error liking news:', error);
    } finally {
      setLiking(false);
    }
  };

  const openModal = async (post) => {
    setSelectedPost(post);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
    
    try {
      const response = await fetch(`http://192.168.137.83:8000/api/news/${post.id}/`);
      const data = await response.json();
      if (data.success) {
        setSelectedPost(data.data);
        setNews(prevNews => 
          prevNews.map(item => 
            item.id === post.id ? { ...item, views: data.data.views } : item
          )
        );
      }
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
    document.body.style.overflow = 'unset';
  };

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, news.length));
  };

  const displayedPosts = news.slice(0, visibleCount);
  const hasMore = visibleCount < news.length;

  const shareOnSocial = (platform, title) => {
    const url = window.location.href;
    let shareUrl = '';
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0B3B2F' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#d32f2f' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>{error}</p>
          <button onClick={fetchNews} style={{ marginTop: '1rem', background: '#F9C74F', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Hero Section */}
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

      {/* Blog Cards Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        {news.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <i className="fas fa-newspaper" style={{ fontSize: '3rem', color: '#999' }}></i>
            <p style={{ marginTop: '1rem', color: '#666' }}>No news articles available at the moment.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {displayedPosts.map((post, idx) => (
              <div key={post.id} data-aos="fade-up" data-aos-delay={idx * 100} style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
                maxWidth: '320px',
                margin: '0 auto'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => openModal(post)}>
                <div style={{ height: '180px', overflow: 'hidden' }}>
                  <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.2rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#888' }}>
                    <i className="far fa-calendar-alt" style={{ marginRight: '0.3rem' }}></i>
                    {post.date} • {post.read_time}
                  </span>
                  <h3 style={{ color: '#0B3B2F', margin: '0.5rem 0', fontSize: '1rem' }}>{post.title}</h3>
                  <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.8rem' }}>{post.excerpt || 'Discover how VUMA Tanzania is making a difference...'}</p>
                  <div style={{ color: '#F9C74F', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-eye"></i>
                    Click to read more
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button onClick={loadMore} style={{
              background: '#F9C74F',
              border: 'none',
              padding: '0.8rem 2rem',
              borderRadius: '50px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 5px 20px rgba(249,199,79,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              Load More Stories
            </button>
          </div>
        )}
      </div>

      {/* Blog Post Modal */}
      {showModal && selectedPost && (
        <div className="modal-overlay" onClick={closeModal} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '28px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            position: 'relative',
            animation: 'slideInUp 0.3s ease'
          }}>
            {/* Modal Header with Image */}
            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))' }} />
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(0,0,0,0.5)',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
              >
                <i className="fas fa-times"></i>
              </button>
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', zIndex: 10 }}>
                <span style={{
                  display: 'inline-block',
                  background: '#F9C74F',
                  color: '#0B3B2F',
                  padding: '0.2rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem'
                }}>
                  LATEST NEWS
                </span>
                <h2 style={{ color: 'white', margin: 0, fontSize: 'clamp(1.3rem, 5vw, 1.8rem)' }}>{selectedPost.title}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 'clamp(1.5rem, 5vw, 2rem)' }}>
              {/* Meta Information */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                  <i className="far fa-calendar-alt" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                  {selectedPost.date}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                  <i className="far fa-clock" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                  {selectedPost.read_time}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                  <i className="far fa-eye" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                  {selectedPost.views} views
                </span>
                <span 
                  onClick={(e) => handleLike(selectedPost.id, e)}
                  style={{ 
                    fontSize: '0.8rem', 
                    color: '#666', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <i className={`fa${liking ? 's fa-spinner fa-spin' : 'r fa-heart'}`} style={{ color: liking ? '#F9C74F' : '#ff6b6b' }}></i>
                  {selectedPost.likes} likes
                </span>
              </div>

              {/* Full Content */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem' }}>
                  <i className="fas fa-info-circle" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  Full Story
                </h3>
                <p style={{ color: '#555', lineHeight: '1.8', fontSize: '0.95rem' }}>
                  {selectedPost.content}
                </p>
              </div>

              {/* Key Highlights */}
              {selectedPost.key_highlights && selectedPost.key_highlights.length > 0 && (
                <div style={{ marginBottom: '1.5rem', background: '#f9fbf7', padding: '1rem', borderRadius: '16px' }}>
                  <h4 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <i className="fas fa-star" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                    Key Highlights
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {selectedPost.key_highlights.map((highlight, index) => (
                      <li key={index} style={{ padding: '0.3rem 0', color: '#555', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                        <i className="fas fa-check-circle" style={{ color: '#F9C74F', fontSize: '0.7rem' }}></i>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Share Section */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <i className="fas fa-share-alt" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  Share this article
                </h4>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button onClick={() => shareOnSocial('facebook', selectedPost.title)} style={{
                    background: '#1877f2',
                    border: 'none',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button onClick={() => shareOnSocial('twitter', selectedPost.title)} style={{
                    background: '#1da1f2',
                    border: 'none',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <i className="fab fa-twitter"></i>
                  </button>
                  <button onClick={() => shareOnSocial('linkedin', selectedPost.title)} style={{
                    background: '#0077b5',
                    border: 'none',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <i className="fab fa-linkedin-in"></i>
                  </button>
                  <button onClick={() => shareOnSocial('whatsapp', selectedPost.title)} style={{
                    background: '#25D366',
                    border: 'none',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <i className="fab fa-whatsapp"></i>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: '2px solid #ddd',
                    padding: '0.8rem',
                    borderRadius: '50px',
                    color: '#666',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#d32f2f';
                    e.currentTarget.style.color = '#d32f2f';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.color = '#666';
                  }}
                >
                  <i className="fas fa-times" style={{ marginRight: '0.5rem' }}></i>
                  Close
                </button>
                <button
                  onClick={() => alert('Subscribe to our newsletter for more updates!')}
                  style={{
                    flex: 2,
                    background: '#F9C74F',
                    border: 'none',
                    padding: '0.8rem',
                    borderRadius: '50px',
                    color: '#0B3B2F',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(249,199,79,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <i className="fas fa-envelope"></i>
                  Subscribe for Updates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modal-content::-webkit-scrollbar {
          width: 6px;
        }
        
        .modal-content::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .modal-content::-webkit-scrollbar-thumb {
          background: #F9C74F;
          border-radius: 3px;
        }
        
        @media (max-width: 768px) {
          .modal-content {
            max-height: 90vh;
          }
          
          .modal-content > div:first-child {
            height: 180px;
          }
        }
        
        @media (max-width: 480px) {
          .modal-content {
            border-radius: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default News;