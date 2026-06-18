import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';

// Import all pages
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Events from './pages/Events';
import News from './pages/News';
import Volunteers from './pages/Volunteers';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Donate from './pages/Donate';
import Login from './auth/Login';
import Signup from './auth/SignUp';
import VerifyOTP from './auth/VerifyOTP';
import Report from './pages/Report';
import Apply from './pages/Apply';
import EventRegister from './pages/EventRegister';
import Leadership from './pages/Leadership';
import Pro from './components/programs'
import EventRegistrationConfirmation from './pages/EventRegistrationConfirmation';
import Publications from './pages/Publications';
import PublicationDetails from './pages/PubDetails';

import AdminTestimonials from './admin/AdminTestmonials';
import EventsRequests from './admin/EventRequests';
import AdminUsers from './admin/AdminUsers';
import AdminProjects from './admin/AdminProjects';
import AdminEvents from './admin/AdminEvents';
import AdminVolunteers from './admin/AdminVolunteers';
import AdminPartners from './admin/AdminPartners';
import AdminMessages from './admin/AdminMessages';
import UserDetails from './admin/UserDetails';
import ProjectDetails from './admin/ProjectDetails';
import EventDetails from './admin/EventDetails';
import PartnerDetails from './admin/PartnerDetails';
import VolunteerDetails from './admin/VolunteerDetails';
import Partners from './pages/partners';
import AdminPrograms from './admin/AdminPrograms';
import ProgramDetails from './admin/ProgramsDetails';
import AdminNews from './admin/AdminNews';
import AdminPublications from './admin/AdminPublications';
import NewsDetails from './admin/NewsDetails';
import AdminLeadership from './admin/AdminLeaderShip';
import AdminDonations from './admin/AdminDonations';
import What from './pages/What';
import AdminReports from './admin/AdminReports';
import AdminImpacts from './admin/AdminImpacts';
import AdminSttats from './admin/AdminStats';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        const userRole = user?.role?.toLowerCase();
        // Check if user role is admin or administrator
        if (userRole === 'admin' || userRole === 'administrator') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  }, [location]);

  if (loading) {
    return (
      <div style={{ 
        paddingTop: '70px', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '3px solid #F9C74F',
            borderTopColor: '#0B3B2F',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#666' }}>Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    // Redirect to home or login page with message
    return <Navigate to="/" replace state={{ message: 'Access denied. Admin privileges required.' }} />;
  }

  return children;
};

// ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    AOS.init({ 
      duration: 800, 
      once: false, 
      offset: 80, 
      easing: 'ease-out-cubic' 
    });
  }, []);

  // Close sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  // Close sidebar when pressing Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Router>
      <ScrollToTop />
      <div className="App" style={{ 
        width: '100%', 
        maxWidth: '100vw', 
        overflowX: 'hidden',
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        
        <Navbar onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} onLoginClick={openModal} />
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onLoginClick={openModal} />
        
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home onLoginClick={openModal} />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/events" element={<Events />} />
            <Route path="/news" element={<News />} />
            <Route path="/volunteers" element={<Volunteers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/report" element={<Report />} />
            <Route path="/programs/apply" element={<Apply />} />
            <Route path="/events/register" element={<EventRegister />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/leadership" element={<Leadership />} />
            <Route path="/events/requests" element={<EventsRequests />} />
            <Route path="/say-about-us" element={<What />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/publications/:id" element={<PublicationDetails />} />
            <Route path="/events/register/confirmation/:id" element={<EventRegistrationConfirmation />} />
            <Route path="/events/register/:id" element={<EventRegister />} />

            {/* Protected Admin Routes - Only accessible by admin users */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/users/:id" element={
              <ProtectedRoute>
                <UserDetails />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/projects" element={
              <ProtectedRoute>
                <AdminProjects />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/projects/:id" element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/events" element={
              <ProtectedRoute>
                <AdminEvents />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/events/:id" element={
              <ProtectedRoute>
                <EventDetails />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/volunteers" element={
              <ProtectedRoute>
                <AdminVolunteers />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/volunteers/:id" element={
              <ProtectedRoute>
                <VolunteerDetails />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/partners" element={
              <ProtectedRoute>
                <AdminPartners />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/partners/:id" element={
              <ProtectedRoute>
                <PartnerDetails />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/impacts" element={
              <ProtectedRoute>
                <AdminImpacts />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/messages" element={
              <ProtectedRoute>
                <AdminMessages />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/news" element={
              <ProtectedRoute>
                <AdminNews />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/news/:id" element={
              <ProtectedRoute>
                <NewsDetails />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/leadership" element={
              <ProtectedRoute>
                <AdminLeadership />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/testimonials" element={
              <ProtectedRoute>
                <AdminTestimonials />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/reports" element={
              <ProtectedRoute>
                <AdminReports />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/stats" element={
              <ProtectedRoute>
                <AdminSttats />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/programs" element={
              <ProtectedRoute>
                <AdminPrograms />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/programs/:id" element={
              <ProtectedRoute>
                <ProgramDetails />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/donations" element={
              <ProtectedRoute>
                <AdminDonations />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/publications" element={
              <ProtectedRoute>
                <AdminPublications />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        
        <Footer />
        <LoginModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </Router>
  );
}

export default App;