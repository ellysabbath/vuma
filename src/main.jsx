// import React, { Suspense } from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
// import './index.css';

// // Loading component
// const LoadingFallback = () => (
//   <div style={{
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//     background: 'linear-gradient(135deg, #0a3b2e, #0c4d3a)',
//     color: '#F9C74F'
//   }}>
//     <div style={{ textAlign: 'center' }}>
//       <div style={{
//         width: '50px',
//         height: '50px',
//         border: '3px solid rgba(249,199,79,0.3)',
//         borderTop: '3px solid #F9C74F',
//         borderRadius: '50%',
//         animation: 'spin 1s linear infinite',
//         margin: '0 auto 1rem'
//       }} />
//       <p>Loading VUMA Tanzania...</p>
//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   </div>
// );

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <Suspense fallback={<LoadingFallback />}>
//       <App />
//     </Suspense>
//   </React.StrictMode>,
// );







import React, { Suspense, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './index.css';

// ✅ Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 App Error:', error, errorInfo);
    // You can send to error tracking service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #0a3b2e, #0c4d3a)',
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div>
            <h2 style={{ color: '#F9C74F', marginBottom: '16px' }}>
              <i className="fas fa-exclamation-triangle"></i> Something went wrong
            </h2>
            <p style={{ marginBottom: '20px', color: '#e5e7eb' }}>
              We're having trouble loading the page. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#F9C74F',
                color: '#0B3B2F',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ✅ Loading component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #0a3b2e, #0c4d3a)',
    color: '#F9C74F'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '3px solid rgba(249,199,79,0.3)',
        borderTop: '3px solid #F9C74F',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
      }} />
      <p style={{ fontSize: 'clamp(14px, 2vw, 18px)' }}>Loading VUMA Tanzania...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

// ✅ SEO Component
const SEO = () => {
  useEffect(() => {
    // Set default title
    if (!document.title || document.title === 'VUMA Tanzania') {
      document.title = 'VUMA Tanzania | Youth Innovation & Climate Action';
    }
    
    // Set default meta description (if not set by pages)
    const metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = 'VUMA Tanzania empowers youth through innovation and climate action. Join our platform to connect, learn, and make a difference in Tanzania\'s sustainable future.';
      document.head.appendChild(newMeta);
    }
  }, []);

  return null;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <SEO />
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>,
);