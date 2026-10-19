import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// ==================== PUBLICATIONS SKELETON (DATA ONLY) ====================
const PublicationsSkeleton = ({ count = 5 }) => {
  const items = Array.from({ length: count });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {items.map((_, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            padding: '18px 20px',
            animation: `skeletonFadeIn 0.5s ease ${idx * 0.06}s both`
          }}
        >
          {/* Title */}
          <div
            className="skeleton-block"
            style={{
              height: '18px',
              width: '70%',
              borderRadius: '6px',
              marginBottom: '10px'
            }}
          />

          {/* Author line */}
          <div
            className="skeleton-block"
            style={{
              height: '11px',
              width: '35%',
              borderRadius: '5px',
              marginBottom: '10px'
            }}
          />

          {/* Description lines */}
          <div
            className="skeleton-block"
            style={{
              height: '10px',
              width: '100%',
              borderRadius: '5px',
              marginBottom: '6px'
            }}
          />
          <div
            className="skeleton-block"
            style={{
              height: '10px',
              width: '85%',
              borderRadius: '5px',
              marginBottom: '12px'
            }}
          />

          {/* Meta row: type badge + date + view link */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div
                className="skeleton-block skeleton-pill"
                style={{ height: '16px', width: '70px' }}
              />
              <div
                className="skeleton-block"
                style={{ height: '10px', width: '80px', borderRadius: '5px' }}
              />
            </div>
            <div
              className="skeleton-block"
              style={{ height: '10px', width: '90px', borderRadius: '5px' }}
            />
          </div>
        </div>
      ))}

      <style>{`
        @keyframes skeletonFadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes skeletonShimmer {
          0% { background-position: -500px 0; }
          100% { background-position: 500px 0; }
        }
        .skeleton-block {
          background: linear-gradient(
            90deg,
            #eef2f0 0%,
            #e2e9e5 20%,
            #f5f8f6 40%,
            #eef2f0 60%,
            #eef2f0 100%
          );
          background-size: 1000px 100%;
          animation: skeletonShimmer 1.6s infinite linear;
          display: block;
        }
        .skeleton-pill {
          border-radius: 60px;
        }
      `}</style>
    </div>
  );
};
// ==================== END PUBLICATIONS SKELETON ====================


const Publications = () => {
  const navigate = useNavigate();

  const [publications, setPublications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = 'https://vuma.pythonanywhere.com/api';

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/publications/by-status/?status=published`);
      const data = await response.json();
      if (data.success) {
        setPublications(data.data);
      } else {
        setError('Failed to load publications');
      }
    } catch (error) {
      console.error('Error fetching publications:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPublications = publications
    .filter((pub) => {
      const matchesType = filter === 'all' || pub.type === filter;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        pub.title.toLowerCase().includes(searchLower) ||
        (pub.author_publisher && pub.author_publisher.toLowerCase().includes(searchLower)) ||
        (pub.short_description && pub.short_description.toLowerCase().includes(searchLower));
      return matchesType && matchesSearch;
    })
    .sort((a, b) => new Date(b.published_date || b.created_at) - new Date(a.published_date || a.created_at));

  const handleBack = () => {
    navigate('/');
  };

  const handleViewPublication = (id) => {
    navigate(`/publications/${id}`);
  };

  const getTypeColor = (type) => {
    const colors = {
      'journal': '#2563eb',
      'conference': '#7c3aed',
      'book': '#dc2626',
      'book_chapter': '#059669',
      'thesis': '#d97706',
      'report': '#0891b2',
      'other': '#6b7280'
    };
    return colors[type] || '#6b7280';
  };

  const getTypeLabel = (type) => {
    const labels = {
      'journal': 'Journal',
      'conference': 'Conference',
      'book': 'Book',
      'book_chapter': 'Book Chapter',
      'thesis': 'Thesis',
      'report': 'Report',
      'other': 'Other'
    };
    return labels[type] || type;
  };

  // ==================== ERROR STATE ====================
  if (error) {
    return (
      <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '2rem', color: '#ef4444' }}></i>
          <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>{error}</p>
          <button onClick={fetchPublications} style={{ marginTop: '0.75rem', background: '#F9C74F', border: 'none', padding: '0.375rem 0.875rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.813rem', fontWeight: 500 }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>
        {`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes pulseGlow {
            0%, 100% { text-shadow: 0 0 15px rgba(249, 199, 79, 0.15); }
            50% { text-shadow: 0 0 30px rgba(249, 199, 79, 0.3); }
          }

          .title-animate { animation: fadeInDown 0.6s ease-out; }
          .title-glow { animation: pulseGlow 3s ease-in-out infinite; }

          .title-underline {
            position: relative;
            display: inline-block;
          }

          .title-underline::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 3px;
            background: linear-gradient(90deg, #F9C74F, #0B3B2F, #F9C74F);
            border-radius: 2px;
            animation: underlineGrow 0.8s ease-out forwards;
            animation-delay: 0.2s;
          }

          @keyframes underlineGrow {
            from { width: 0; }
            to { width: 100%; }
          }

          .search-input:focus {
            border-color: #F9C74F !important;
            box-shadow: 0 0 0 3px rgba(249, 199, 79, 0.15) !important;
          }

          .filter-btn:hover { background-color: #f8fafc; }
          .filter-btn.active {
            background-color: #0B3B2F !important;
            color: #ffffff !important;
            border-color: #0B3B2F !important;
            box-shadow: 0 2px 8px rgba(11, 59, 47, 0.25) !important;
          }

          .publication-card {
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .publication-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08) !important;
            border-color: #F9C74F !important;
          }

          .publication-card:hover .view-arrow {
            transform: translateX(6px);
            opacity: 1;
          }

          .publication-card:active {
            transform: scale(0.98);
          }

          .clear-btn:hover { color: #0B3B2F !important; }
          .view-link:hover { color: #0B3B2F !important; text-decoration: underline !important; }

          .back-arrow:hover {
            transform: translateX(-4px);
            color: #F9C74F !important;
          }

          /* Full title — no truncation, always wraps */
          .pub-title {
            font-size: 1.05rem;
            font-weight: 700;
            color: #0B3B2F;
            margin-bottom: 6px;
            line-height: 1.4;
            word-break: break-word;
            overflow-wrap: break-word;
            white-space: normal;
          }

          /* Short description — fully visible (no truncation) */
          .pub-short-desc {
            font-size: 0.85rem;
            color: #334155;
            margin-bottom: 8px;
            line-height: 1.55;
            white-space: normal;
          }

          /* Long description — partial preview (3 lines + fade) */
          .pub-long-desc {
            font-size: 0.8rem;
            color: #64748b;
            margin-bottom: 8px;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            position: relative;
          }

          /* Optional: fade-out gradient on the 3rd line */
          .pub-long-desc::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: 40px;
            height: 1.5em;
            background: linear-gradient(to right, transparent, #ffffff 70%);
            pointer-events: none;
          }

          /* "Read more" hint */
          .read-more-hint {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 0.75rem;
            color: #F9C74F;
            font-weight: 600;
            margin-bottom: 8px;
          }

          @media (min-width: 768px) {
            .controls-row {
              flex-direction: row !important;
              align-items: center !important;
            }
            .search-wrapper { flex: 1 !important; }
            .card-layout {
              flex-direction: row !important;
              align-items: flex-start !important;
              justify-content: space-between !important;
            }
            .card-actions {
              margin-top: 0 !important;
              margin-left: 16px !important;
              flex-shrink: 0 !important;
            }
          }

          @media (max-width: 480px) {
            .filter-group { justify-content: center !important; }
            .filter-btn { font-size: 0.7rem !important; padding: 4px 12px !important; }
            .pub-title { font-size: 0.98rem !important; }
            .pub-short-desc { font-size: 0.8rem !important; }
            .pub-long-desc { font-size: 0.75rem !important; }
          }
        `}
      </style>

      {/* ==================== HEADER (ALWAYS VISIBLE) ==================== */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div className="title-animate" style={styles.titleWrapper}>
            <div
              className="back-arrow"
              onClick={handleBack}
              style={styles.backArrow}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <i className="fas fa-arrow-left"></i>
            </div>

            <h1 style={styles.title}>
              <span style={styles.titleIcon}>
                <i className="fas fa-book-open" style={{ color: '#F9C74F' }}></i>
              </span>
              <span className="title-glow" style={styles.titleText}>
                VUMA Publications
              </span>
            </h1>
            <div className="title-underline" style={styles.underline}></div>
          </div>

          <p style={styles.subtitle}>
            <span style={styles.subtitleIcon}>✦</span>
            Advancing youth about Leadership, environment and Innovation
            <span style={styles.subtitleIcon}>✦</span>
          </p>

          <div style={styles.statsBadge}>
            <span style={styles.statsBadgeNumber}>
              {loading ? '—' : publications.length}
            </span>
            <span style={styles.statsBadgeText}>Published Publications</span>
          </div>
        </div>
      </header>

      <div style={styles.container}>
        {/* ==================== CONTROLS (ALWAYS VISIBLE) ==================== */}
        <div className="controls-row" style={styles.controls}>
          <div className="search-wrapper" style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search by title, author, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={styles.searchInput}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="clear-btn"
                style={styles.clearBtn}
                aria-label="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>

          <div className="filter-group" style={styles.filterGroup}>
            <button
              onClick={() => setFilter('all')}
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              style={styles.filterBtn}
            >
              All
            </button>
            <button
              onClick={() => setFilter('journal')}
              className={`filter-btn ${filter === 'journal' ? 'active' : ''}`}
              style={styles.filterBtn}
            >
              Journals
            </button>
            <button
              onClick={() => setFilter('conference')}
              className={`filter-btn ${filter === 'conference' ? 'active' : ''}`}
              style={styles.filterBtn}
            >
              Conferences
            </button>
            <button
              onClick={() => setFilter('book')}
              className={`filter-btn ${filter === 'book' ? 'active' : ''}`}
              style={styles.filterBtn}
            >
              Books
            </button>
            <button
              onClick={() => setFilter('other')}
              className={`filter-btn ${filter === 'other' ? 'active' : ''}`}
              style={styles.filterBtn}
            >
              Other
            </button>
          </div>
        </div>

        {/* ==================== RESULTS STATS (ALWAYS VISIBLE) ==================== */}
        <div style={styles.resultsStats}>
          {loading ? (
            <>
              <span style={styles.resultsCount}>—</span>
              <span style={styles.resultsLabel}>loading publications...</span>
            </>
          ) : (
            <>
              <span style={styles.resultsCount}>
                {filteredPublications.length}
              </span>
              <span style={styles.resultsLabel}>
                {filteredPublications.length === 1 ? 'publication' : 'publications'} found
              </span>
              {filter !== 'all' && (
                <span style={styles.resultsFilter}>
                  • Filter: <strong>{getTypeLabel(filter)}</strong>
                </span>
              )}
              {searchTerm && (
                <span style={styles.resultsFilter}>
                  • Search: <strong>"{searchTerm}"</strong>
                </span>
              )}
            </>
          )}
        </div>

        {/* ==================== DATA: SKELETON OR CONTENT ==================== */}
        {loading ? (
          <PublicationsSkeleton count={5} />
        ) : filteredPublications.length === 0 ? (
          <div style={styles.noResults}>
            <div style={styles.noResultsIcon}>
              <i className="fas fa-search" style={{ color: '#94a3b8' }}></i>
            </div>
            <h3 style={styles.noResultsTitle}>No publications found</h3>
            <p style={styles.noResultsText}>
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div style={styles.list}>
            {filteredPublications.map((pub, idx) => {
              // Determine if we have a long description
              const hasLongDesc =
                pub.long_description &&
                pub.long_description.trim().length > 0;

              return (
                <div
                  key={pub.id}
                  data-aos="fade-up"
                  data-aos-delay={idx * 50}
                  className="publication-card"
                  style={styles.card}
                  onClick={() => handleViewPublication(pub.id)}
                >
                  <div className="card-layout" style={styles.cardLayout}>
                    <div style={styles.cardLeft}>
                      {/* ============ FULL TITLE (no truncation) ============ */}
                      <h2 className="pub-title">{pub.title}</h2>

                      {/* ============ AUTHOR ============ */}
                      {pub.author_publisher && (
                        <p style={styles.pubAuthors}>
                          <span style={styles.label}>
                            <i className="fas fa-user-edit" style={{ marginRight: 4, color: '#F9C74F' }}></i>
                            By:
                          </span>{' '}
                          {pub.author_publisher}
                        </p>
                      )}

                      {/* ============ SHORT DESCRIPTION (fully visible) ============ */}
                      {pub.short_description && (
                        <p className="pub-short-desc">
                          {pub.short_description}
                        </p>
                      )}

                      {/* ============ PARTIAL LONG DESCRIPTION (3 lines) ============ */}
                      {hasLongDesc && (
                        <>
                          <p className="pub-long-desc">
                            {pub.long_description}
                          </p>
                          <span className="read-more-hint">
                            <i className="fas fa-arrow-right"></i>
                            Read full details
                          </span>
                        </>
                      )}

                      {/* ============ META ============ */}
                      <div style={styles.pubMeta}>
                        <span style={{
                          background: `${getTypeColor(pub.type)}15`,
                          color: getTypeColor(pub.type),
                          padding: '0.125rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.688rem',
                          fontWeight: 500,
                          display: 'inline-block',
                          marginRight: '0.5rem'
                        }}>
                          {getTypeLabel(pub.type)}
                        </span>
                        {pub.published_date && (
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            <i className="far fa-calendar-alt" style={{ marginRight: 4 }}></i>
                            {new Date(pub.published_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="card-actions" style={styles.cardRight}>
                      <span className="view-link" style={styles.viewLink}>
                        View Details{' '}
                        <i className="fas fa-arrow-right view-arrow" style={styles.viewArrow}></i>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <footer style={styles.footer}>
          <div style={styles.footerContent}>
            <span>© {new Date().getFullYear()} — Vuma org Publications</span>
            <span style={styles.footerDot}>•</span>
            <span>{loading ? '—' : publications.length} publications</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    paddingTop: '70px',
  },

  header: {
    background: 'linear-gradient(135deg, #0B3B2F 0%, #1a5c48 50%, #0B3B2F 100%)',
    padding: '24px 20px 20px',
    position: 'relative',
    overflow: 'hidden',
    borderBottom: '4px solid #F9C74F',
  },
  headerContent: {
    maxWidth: '1152px',
    margin: '0 auto',
    textAlign: 'center',
    position: 'relative',
    zIndex: 2,
  },
  titleWrapper: {
    marginBottom: '4px',
    position: 'relative',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    margin: 0,
  },
  titleIcon: { fontSize: '1.8rem', lineHeight: 1 },
  titleText: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #F9C74F, #f8b500, #F9C74F)',
    backgroundSize: '200% 200%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  underline: {
    height: '3px',
    width: '60px',
    margin: '4px auto 0',
    background: 'linear-gradient(90deg, #F9C74F, #0B3B2F, #F9C74F)',
    borderRadius: '2px',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: '6px',
    maxWidth: '500px',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  subtitleIcon: { fontSize: '0.8rem', color: '#F9C74F' },
  statsBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '8px',
    padding: '4px 14px',
    backgroundColor: 'rgba(249, 199, 79, 0.15)',
    backdropFilter: 'blur(10px)',
    borderRadius: '9999px',
    border: '1px solid rgba(249, 199, 79, 0.2)',
  },
  statsBadgeNumber: { fontSize: '1rem', fontWeight: '700', color: '#F9C74F' },
  statsBadgeText: { fontSize: '0.7rem', color: '#e2e8f0', fontWeight: '500' },

  backArrow: {
    position: 'absolute',
    left: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  container: {
    maxWidth: '1152px',
    margin: '0 auto',
    padding: '24px 20px 32px',
  },

  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  },
  searchWrapper: { position: 'relative', width: '100%' },
  searchInput: {
    width: '100%',
    padding: '10px 40px 10px 16px',
    fontSize: '0.9rem',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    color: '#1e293b',
  },
  clearBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    fontSize: '0.9rem',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '2px 6px',
    transition: 'color 0.2s',
  },
  filterGroup: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  filterBtn: {
    padding: '6px 16px',
    fontSize: '0.75rem',
    fontWeight: '600',
    border: '2px solid #e2e8f0',
    borderRadius: '9999px',
    backgroundColor: '#ffffff',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },

  resultsStats: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '0.8rem',
    color: '#475569',
  },
  resultsCount: { fontWeight: '700', fontSize: '1rem', color: '#0B3B2F' },
  resultsLabel: { fontWeight: '500' },
  resultsFilter: { color: '#64748b' },

  noResults: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '2px dashed #e2e8f0',
  },
  noResultsIcon: { fontSize: '2.5rem', marginBottom: '8px' },
  noResultsTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#0B3B2F', marginBottom: '4px' },
  noResultsText: { color: '#64748b', fontSize: '0.85rem' },

  list: { display: 'flex', flexDirection: 'column', gap: '12px' },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    padding: '18px 20px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  cardLayout: { display: 'flex', flexDirection: 'column' },
  cardLeft: { flex: 1, minWidth: 0 },
  cardRight: {
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '10px',
    flexWrap: 'wrap',
  },

  pubAuthors: { fontSize: '0.8rem', color: '#475569', marginBottom: '6px' },
  pubMeta: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px', marginTop: '4px' },
  label: { fontWeight: '600', color: '#0B3B2F' },

  viewLink: {
    color: '#0B3B2F',
    fontSize: '0.8rem',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  viewArrow: {
    transition: 'transform 0.3s ease',
    opacity: 0.6,
    fontSize: '0.7rem',
  },

  footer: {
    marginTop: '32px',
    paddingTop: '16px',
    borderTop: '2px solid #e2e8f0',
  },
  footerContent: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  footerDot: { color: '#cbd5e1' },
};

export default Publications;
