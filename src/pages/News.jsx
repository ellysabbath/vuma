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
  const [imageErrors, setImageErrors] = useState({});

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';
  const MEDIA_BASE_URL = 'https://vuma.pythonanywhere.com';

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/news/`);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setNews(data.data);
      } else if (Array.isArray(data)) {
        setNews(data);
      } else if (data.results && Array.isArray(data.results)) {
        setNews(data.results);
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (post) => {
    if (post.image_base64 && post.image_base64 !== 'null' && post.image_base64 !== '') {
      if (post.image_base64.startsWith('data:image')) {
        return post.image_base64;
      }
      return `data:image/jpeg;base64,${post.image_base64}`;
    }
    
    if (post.image) {
      if (post.image.startsWith('http')) {
        return post.image;
      }
      if (post.image.startsWith('/')) {
        return `${MEDIA_BASE_URL}${post.image}`;
      }
      return `${MEDIA_BASE_URL}/media/${post.image}`;
    }
    
    if (post.image_url) {
      if (post.image_url.startsWith('http')) {
        return post.image_url;
      }
      return `${MEDIA_BASE_URL}${post.image_url}`;
    }
    
    return null;
  };

  const handleImageError = (postId) => {
    if (!imageErrors[postId]) {
      setImageErrors(prev => ({ ...prev, [postId]: true }));
    }
  };

  const getInitials = (title) => {
    if (!title) return 'N';
    return title.split(' ').slice(0, 2).map(word => word[0]).join('').toUpperCase();
  };

  const getRandomColor = (id) => {
    const colors = ['#0B3B2F', '#1a5c48', '#2b7a5c', '#F9C74F', '#f8b500', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
    return colors[id % colors.length];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    try {
      if (dateString.match(/^[A-Za-z]+ \d{4}$/)) {
        return dateString;
      }
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const handleLike = async (id, e) => {
    e.stopPropagation();
    setLiking(true);
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}/like/`, {
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
      const response = await fetch(`${API_BASE_URL}/news/${post.id}/`);
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
    setVisibleCount(prev => Math.min(prev + 6, news.length));
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
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', margin: '0 auto', border: '3px solid rgba(11,59,47,0.1)', borderTopColor: '#0B3B2F', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>Loading news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', background: 'white', padding: '2rem', borderRadius: '16px', maxWidth: '400px' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#ef4444' }}></i>
          <p style={{ marginTop: '1rem', color: '#64748b' }}>{error}</p>
          <button onClick={fetchNews} style={{ marginTop: '1rem', background: '#0B3B2F', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '30px', cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', background: '#f8fafc' }}>
      {/* Thin Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 2rem',
        position: 'sticky',
        top: '70px',
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0B3B2F', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-newspaper" style={{ color: '#F9C74F' }}></i>
                News & Stories
              </h1>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                {news.length} article{news.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <i className="far fa-eye"></i>
                Views
              </span>
              <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <i className="far fa-heart"></i>
                Likes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Cards Grid - FULL IMAGES VISIBLE (no cropping) */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {news.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <i className="fas fa-newspaper" style={{ fontSize: '3rem', color: '#cbd5e1' }}></i>
            <p style={{ marginTop: '1rem', color: '#64748b' }}>No news articles available at the moment.</p>
          </div>
        ) : (
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
              gap: '2rem'
            }}>
              {displayedPosts.map((post, idx) => {
                const imageUrl = getImageUrl(post);
                const showFallback = imageErrors[post.id] || !imageUrl;
                const initials = getInitials(post.title);
                const bgColor = getRandomColor(post.id);
                
                return (
                  <div key={post.id} data-aos="fade-up" data-aos-delay={idx * 100} style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: '1px solid #e2e8f0',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#F9C74F';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                  onClick={() => openModal(post)}>
                    
                    {/* FULL IMAGE - No cropping, object-fit contain shows entire image */}
                    <div style={{ height: '240px', overflow: 'hidden', background: '#f1f5f9', position: 'relative' }}>
                      {!showFallback && imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={post.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#f1f5f9' }}
                          onError={() => handleImageError(post.id)}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          background: `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column'
                        }}>
                          <i className="fas fa-newspaper" style={{ fontSize: '3rem', color: 'white', opacity: 0.8 }}></i>
                          <span style={{ fontSize: '0.9rem', color: 'white', marginTop: '0.5rem', fontWeight: 600 }}>{initials}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <i className="far fa-calendar-alt" style={{ color: '#F9C74F' }}></i>
                          {formatDate(post.date)}
                        </span>
                        {post.read_time && (
                          <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <i className="far fa-clock" style={{ color: '#F9C74F' }}></i>
                            {post.read_time}
                          </span>
                        )}
                      </div>
                      
                      <h3 style={{ 
                        color: '#0B3B2F', 
                        margin: '0 0 0.5rem 0', 
                        fontSize: '1rem', 
                        fontWeight: 700,
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {post.title}
                      </h3>
                      
                      <p style={{ 
                        color: '#475569', 
                        marginBottom: '1rem', 
                        fontSize: '0.8rem', 
                        lineHeight: '1.5',
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {post.excerpt || (post.content ? post.content.substring(0, 120) + '...' : 'No description available')}
                      </p>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginTop: '0.5rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid #e2e8f0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <i className="far fa-eye"></i>
                            {post.views || 0}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <i className="far fa-heart"></i>
                            {post.likes || 0}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#F9C74F', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <i className="fas fa-eye"></i>
                          Read More
                          <i className="fas fa-arrow-right" style={{ fontSize: '0.6rem' }}></i>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button onClick={loadMore} style={{
                  background: '#F9C74F',
                  border: 'none',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '30px',
                  fontWeight: 600,
                  fontSize: '0.813rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: '#0B3B2F'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(249,199,79,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <i className="fas fa-arrow-down" style={{ marginRight: '0.5rem' }}></i>
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Blog Post Modal - FULL IMAGE VISIBLE */}
      {showModal && selectedPost && (
        <div className="modal-overlay" onClick={closeModal} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(12px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '24px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            position: 'relative',
            animation: 'slideInUp 0.3s ease'
          }}>
            {/* Modal Header with FULL IMAGE - object-fit contain */}
            <div style={{ position: 'relative', height: '280px', overflow: 'hidden', background: '#f1f5f9' }}>
              {getImageUrl(selectedPost) && !imageErrors[selectedPost.id] ? (
                <img 
                  src={getImageUrl(selectedPost)} 
                  alt={selectedPost.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#f1f5f9' }}
                  onError={() => handleImageError(selectedPost.id)}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(135deg, ${getRandomColor(selectedPost.id)}, ${getRandomColor(selectedPost.id)}dd)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <i className="fas fa-newspaper" style={{ fontSize: '4rem', color: 'white', opacity: 0.8 }}></i>
                  <span style={{ fontSize: '1rem', color: 'white', marginTop: '0.5rem', fontWeight: 600 }}>{getInitials(selectedPost.title)}</span>
                </div>
              )}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))' }} />
              
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(4px)',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
              >
                <i className="fas fa-times"></i>
              </button>
              
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', zIndex: 10 }}>
                <span style={{
                  display: 'inline-block',
                  background: '#F9C74F',
                  color: '#0B3B2F',
                  padding: '0.2rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem'
                }}>
                  LATEST NEWS
                </span>
                <h2 style={{ color: 'white', margin: 0, fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 700 }}>
                  {selectedPost.title}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.25rem' }}>
              {/* Meta Information */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                marginBottom: '1.25rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  <i className="far fa-calendar-alt" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                  {formatDate(selectedPost.date)}
                </span>
                {selectedPost.read_time && (
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    <i className="far fa-clock" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                    {selectedPost.read_time}
                  </span>
                )}
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  <i className="far fa-eye" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                  {selectedPost.views || 0} views
                </span>
                <span 
                  onClick={(e) => handleLike(selectedPost.id, e)}
                  style={{ 
                    fontSize: '0.75rem', 
                    color: '#64748b', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <i className={`fa${liking ? 's fa-spinner fa-spin' : 'r fa-heart'}`} style={{ color: liking ? '#F9C74F' : '#ef4444' }}></i>
                  {selectedPost.likes || 0} likes
                </span>
              </div>

              {/* Full Content */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-info-circle" style={{ color: '#F9C74F' }}></i>
                  Full Story
                </h3>
                <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '0.85rem' }}>
                  {selectedPost.content || 'No content available'}
                </p>
              </div>

              {/* Key Highlights */}
              {selectedPost.key_highlights && selectedPost.key_highlights.length > 0 && (
                <div style={{ marginBottom: '1.25rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '12px' }}>
                  <h4 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-star" style={{ color: '#F9C74F' }}></i>
                    Key Highlights
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {selectedPost.key_highlights.map((highlight, index) => (
                      <li key={index} style={{ padding: '0.25rem 0', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                        <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '0.65rem' }}></i>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Share Section */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: '#0B3B2F', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-share-alt" style={{ color: '#F9C74F' }}></i>
                  Share this article
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => shareOnSocial('facebook', selectedPost.title)} style={{
                    background: '#1877f2',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button onClick={() => shareOnSocial('twitter', selectedPost.title)} style={{
                    background: '#1da1f2',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <i className="fab fa-twitter"></i>
                  </button>
                  <button onClick={() => shareOnSocial('linkedin', selectedPost.title)} style={{
                    background: '#0077b5',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <i className="fab fa-linkedin-in"></i>
                  </button>
                  <button onClick={() => shareOnSocial('whatsapp', selectedPost.title)} style={{
                    background: '#25D366',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <i className="fab fa-whatsapp"></i>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    background: '#f1f5f9',
                    border: 'none',
                    padding: '0.5rem',
                    borderRadius: '40px',
                    color: '#64748b',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
                >
                  <i className="fas fa-times" style={{ marginRight: '0.4rem' }}></i>
                  Close
                </button>
                <button
                  onClick={() => alert('Subscribe to our newsletter for more updates!')}
                  style={{
                    flex: 2,
                    background: '#F9C74F',
                    border: 'none',
                    padding: '0.5rem',
                    borderRadius: '40px',
                    color: '#0B3B2F',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(249,199,79,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <i className="fas fa-envelope"></i>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modal-content::-webkit-scrollbar {
          width: 5px;
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
            height: 220px;
          }
        }
      `}</style>
    </div>
  );
};

export default News;