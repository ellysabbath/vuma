import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import Report from './pages/Report';
import Apply from './pages/Apply';
import EventRegister from './pages/EventRegister';





import AdminUsers from './admin/AdminUsers';
import AdminProjects from './admin/AdminProjects';
import AdminEvents from './admin/AdminEvents';
import AdminVolunteers from './admin/AdminVolunteers';
import AdminPartners from './admin/AdminPartners';
import AdminMessages from './admin/AdminMessages';
// ScrollToTop component to reset scroll on page change


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

  // Close sidebar on window resize (if screen becomes larger)
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
        <Navbar onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} onLoginClick={openModal} />
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onLoginClick={openModal} />
        
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home onLoginClick={openModal} />} />
            <Route path="/admin" element={<AdminDashboard />} />
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





            // Add these routes inside Routes
<Route path="/admin" element={<AdminDashboard />} />
<Route path="/admin/users" element={<AdminUsers />} />
<Route path="/admin/projects" element={<AdminProjects />} />
<Route path="/admin/events" element={<AdminEvents />} />
<Route path="/admin/volunteers" element={<AdminVolunteers />} />
<Route path="/admin/partners" element={<AdminPartners />} />
<Route path="/admin/messages" element={<AdminMessages />} />
          </Routes>
        </main>
        
        <Footer />
        <LoginModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </Router>
  );
}

export default App;