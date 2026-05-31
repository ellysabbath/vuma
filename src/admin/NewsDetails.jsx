import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const NewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liking, setLiking] = useState(false);
  const [relatedNews, setRelatedNews] = useState([]);
  
  // Custom alert states
  const [customAlert, setCustomAlert] = useState({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
    fetchNewsDetails();
  }, [id]);

  const showAlert = (type, title, message) => {
    setCustomAlert({
      show: true,
      type,
      title,
      message
    });
    // Auto close after 2 seconds for success messages
    if (type === 'success') {
      setTimeout(() => {
        closeAlert();
      }, 2000);
    }
  };

  const closeAlert = () => {
    setCustomAlert({
      show: false,
      type: 'success',
      title: '',
      message: ''
    });
  };

  const fetchNewsDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.137.83:8000/api/news/${id}/`);
      const data = await response.json();
      
      if (data.success) {
        setNews(data.data);
        
        const allNewsResponse = await fetch('http://192.168.137.83:8000/api/news/');
        const allNewsData = await allNewsResponse.json();
        
        if (allNewsData.success) {
          const otherNews = allNewsData.data.filter(item => item.id !== parseInt(id));
          setRelatedNews(otherNews.slice(0, 3));
        }
      } else {
        setError('News article not found');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
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
        setNews(prev => ({ ...prev, likes: data.likes }));
        showAlert('success', 'Thank You!', 'You liked this article!');
      } else {
        showAlert('error', 'Error!', data.error);
      }
    } catch (error) {
      showAlert('error', 'Network Error', 'Failed to like. Please try again.');
    } finally {
      setLiking(false);
    }
  };

  const getNewsImage = (newsItem) => {
    if (newsItem && newsItem.image_base64) {
      if (newsItem.image_base64.startsWith('data:image')) {
        return newsItem.image_base64;
      }
      return `data:image/jpeg;base64,${newsItem.image_base64}`;
    }
    return 'https://via.placeholder.com/800x400?text=No+Image+Available';
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

  if (error || !news) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f9fbf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#d32f2f' }}></i>
          <p style={{ marginTop: '1rem', color: '#666' }}>{error || 'News article not found'}</p>
          <button 
            onClick={() => navigate('/news')} 
            style={{ 
              marginTop: '1rem', 
              background: '#F9C74F', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '20px', 
              cursor: 'pointer',
              color: '#0B3B2F',
              fontWeight: 600
            }}
          >
            Back to News
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', background: '#f9fbf7' }}>
      {/* Custom Alert Modal */}
      {customAlert.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '400px',
            width: '90%',
            padding: '2rem',
            textAlign: 'center',
            animation: 'slideInUp 0.3s ease',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            {/* Icon */}
            <div style={{ marginBottom: '1rem' }}>
              {customAlert.type === 'success' && (
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: '#4caf50',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <i className="fas fa-heart" style={{ fontSize: '2rem', color: 'white' }}></i>
                </div>
              )}
              {customAlert.type === 'error' && (
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: '#d32f2f',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <i className="fas fa-times" style={{ fontSize: '2rem', color: 'white' }}></i>
                </div>
              )}
            </div>
            
            {/* Title */}
            <h3 style={{
              color: customAlert.type === 'error' ? '#d32f2f' : '#0B3B2F',
              marginBottom: '0.5rem',
              fontSize: '1.5rem'
            }}>
              {customAlert.title}
            </h3>
            
            {/* Message */}
            <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              {customAlert.message}
            </p>
            
            {/* Button */}
            {customAlert.type === 'error' && (
              <button
                onClick={closeAlert}
                style={{
                  padding: '0.6rem 2rem',
                  background: '#d32f2f',
                  border: 'none',
                  borderRadius: '50px',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                OK
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hero Section with Image */}
      <div style={{
        position: 'relative',
        height: '60vh',
        minHeight: '400px',
        overflow: 'hidden'
      }}>
        <img
          src={getNewsImage(news)}
          alt={news.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
          }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8))'
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '2rem',
          color: 'white',
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{
              background: '#F9C74F',
              color: '#0B3B2F',
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginRight: '0.5rem'
            }}>
              {news.read_time}
            </span>
            <span style={{ fontSize: '0.9rem' }}>
              <i className="fas fa-calendar-alt" style={{ marginRight: '0.5rem' }}></i>
              {news.date}
            </span>
          </div>
          <h1 data-aos="fade-up" style={{
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            marginBottom: '1rem',
            lineHeight: '1.3'
          }}>
            {news.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Stats Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 0',
          borderBottom: '1px solid #e0e0e0',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div>
              <i className="fas fa-eye" style={{ color: '#F9C74F', marginRight: '0.5rem' }}></i>
              <span style={{ color: '#666' }}>{news.views} views</span>
            </div>
            <div>
              <i className="fas fa-heart" style={{ color: '#F9C74F', marginRight: '0.5rem' }}></i>
              <span style={{ color: '#666' }}>{news.likes} likes</span>
            </div>
          </div>
          <button
            onClick={handleLike}
            disabled={liking}
            style={{
              background: '#F9C74F',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '50px',
              color: '#0B3B2F',
              fontWeight: 600,
              cursor: liking ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!liking) {
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {liking ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Processing...
              </>
            ) : (
              <>
                <i className="fas fa-heart"></i>
                Like this story
              </>
            )}
          </button>
        </div>

        {/* Key Highlights */}
        {news.key_highlights && news.key_highlights.length > 0 && (
          <div data-aos="fade-up" style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '16px',
            marginBottom: '2rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ color: '#0B3B2F', marginBottom: '1rem', fontSize: '1.3rem' }}>
              <i className="fas fa-star" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
              Key Highlights
            </h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {news.key_highlights.map((highlight, index) => (
                <li key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  marginBottom: '0.8rem',
                  color: '#666'
                }}>
                  <i className="fas fa-check-circle" style={{ color: '#2b7a5c', marginTop: '0.2rem' }}></i>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Full Content */}
        <div data-aos="fade-up" data-aos-delay="100" style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '16px',
          marginBottom: '2rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div style={{ color: '#444', lineHeight: '1.8', fontSize: '1.05rem' }}>
            {news.content.split('\n').map((paragraph, index) => (
              <p key={index} style={{ marginBottom: '1.2rem' }}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div data-aos="fade-up">
            <h2 style={{ color: '#0B3B2F', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              Related News
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {relatedNews.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                  }}
                  onClick={() => navigate(`/news/${item.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <img
                    src={getNewsImage(item)}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                    }}
                  />
                  <div style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem' }}>
                      <i className="fas fa-calendar-alt" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                      {item.date}
                    </div>
                    <h4 style={{ color: '#0B3B2F', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                      {item.title}
                    </h4>
                    <p style={{ color: '#666', fontSize: '0.8rem' }}>
                      {item.excerpt || item.content.substring(0, 80)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/news')}
            style={{
              background: 'transparent',
              border: '2px solid #0B3B2F',
              padding: '0.8rem 2rem',
              borderRadius: '50px',
              color: '#0B3B2F',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0B3B2F';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#0B3B2F';
            }}
          >
            <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
            Back to All News
          </button>
        </div>
      </div>

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
      `}</style>
    </div>
  );
};

export default NewsDetails;