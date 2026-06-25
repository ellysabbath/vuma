// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import Navbar from './components/Navbar';
// import Sidebar from './components/Sidebar';
// import Footer from './components/Footer';
// import LoginModal from './components/LoginModal';

// // Import all pages
// import Home from './pages/Home';
// import About from './pages/About';
// import Programs from './pages/Programs';
// import Events from './pages/Events';
// import News from './pages/News';
// import Volunteers from './pages/Volunteers';
// import Contact from './pages/Contact';
// import Profile from './pages/Profile';
// import AdminDashboard from './pages/AdminDashboard';
// import Donate from './pages/Donate';
// import Login from './auth/Login';
// import Signup from './auth/SignUp';
// import VerifyOTP from './auth/VerifyOTP';
// import Report from './pages/Report';
// import Apply from './pages/Apply';
// import EventRegister from './pages/EventRegister';
// import Leadership from './pages/Leadership';

// import EventRegistrationConfirmation from './pages/EventRegistrationConfirmation';
// import Publications from './pages/Publications';
// import PublicationDetails from './pages/PubDetails';

// import AdminTestimonials from './admin/AdminTestmonials';
// import EventsRequests from './admin/EventRequests';
// import AdminUsers from './admin/AdminUsers';
// import AdminProjects from './admin/AdminProjects';
// import AdminEvents from './admin/AdminEvents';
// import AdminVolunteers from './admin/AdminVolunteers';
// import AdminPartners from './admin/AdminPartners';
// import AdminMessages from './admin/AdminMessages';
// import UserDetails from './admin/UserDetails';
// import ProjectDetails from './admin/ProjectDetails';
// import EventDetails from './admin/EventDetails';
// import PartnerDetails from './admin/PartnerDetails';
// import VolunteerDetails from './admin/VolunteerDetails';
// import Partners from './pages/partners';
// import AdminPrograms from './admin/AdminPrograms';
// import ProgramDetails from './admin/ProgramsDetails';
// import AdminNews from './admin/AdminNews';
// import AdminPublications from './admin/AdminPublications';
// import NewsDetails from './admin/NewsDetails';
// import AdminLeadership from './admin/AdminLeaderShip';
// import AdminDonations from './admin/AdminDonations';
// import What from './pages/Whet';
// import AdminReports from './admin/AdminReports';
// import AdminImpacts from './admin/AdminImpacts';
// import AdminSttats from './admin/AdminStats';

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();

//   useEffect(() => {
//     const token = localStorage.getItem('access_token');
//     const userData = localStorage.getItem('user');
    
//     if (token && userData) {
//       try {
//         const user = JSON.parse(userData);
//         const userRole = user?.role?.toLowerCase();
//         // Check if user role is admin or administrator
//         if (userRole === 'admin' || userRole === 'administrator') {
//           setIsAdmin(true);
//         } else {
//           setIsAdmin(false);
//         }
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//         setIsAdmin(false);
//       }
//     } else {
//       setIsAdmin(false);
//     }
//     setLoading(false);
//   }, [location]);

//   if (loading) {
//     return (
//       <div style={{ 
//         paddingTop: '70px', 
//         minHeight: '100vh', 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'center' 
//       }}>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{
//             width: '60px',
//             height: '60px',
//             border: '3px solid #F9C74F',
//             borderTopColor: '#0B3B2F',
//             borderRadius: '50%',
//             animation: 'spin 1s linear infinite',
//             margin: '0 auto 1rem'
//           }} />
//           <p style={{ color: '#666' }}>Verifying access...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAdmin) {
//     // Redirect to home or login page with message
//     return <Navigate to="/" replace state={{ message: 'Access denied. Admin privileges required.' }} />;
//   }

//   return children;
// };

// // ScrollToTop component
// const ScrollToTop = () => {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return null;
// };

// function App() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     AOS.init({ 
//       duration: 800, 
//       once: false, 
//       offset: 80, 
//       easing: 'ease-out-cubic' 
//     });
//   }, []);

//   // Close sidebar on window resize
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth > 768 && isSidebarOpen) {
//         setIsSidebarOpen(false);
//       }
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [isSidebarOpen]);

//   // Close sidebar when pressing Escape key
//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === 'Escape' && isSidebarOpen) {
//         setIsSidebarOpen(false);
//       }
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, [isSidebarOpen]);

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
//   const closeSidebar = () => setIsSidebarOpen(false);
//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   return (
//     <Router>
//       <ScrollToTop />
//       <div className="App" style={{ 
//         width: '100%', 
//         maxWidth: '100vw', 
//         overflowX: 'hidden',
//         position: 'relative',
//         minHeight: '100vh',
//         display: 'flex',
//         flexDirection: 'column'
//       }}>
//         <style>{`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}</style>
        
//         <Navbar onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} onLoginClick={openModal} />
//         <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onLoginClick={openModal} />
        
//         <main style={{ flex: 1 }}>
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Home onLoginClick={openModal} />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/programs" element={<Programs />} />
//             <Route path="/events" element={<Events />} />
//             <Route path="/news" element={<News />} />
//             <Route path="/volunteers" element={<Volunteers />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/donate" element={<Donate />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/verify-otp" element={<VerifyOTP />} />
//             <Route path="/report" element={<Report />} />
//             <Route path="/programs/apply" element={<Apply />} />
//             <Route path="/events/register" element={<EventRegister />} />
//             <Route path="/partners" element={<Partners />} />
//             <Route path="/leadership" element={<Leadership />} />
//             <Route path="/events/requests" element={<EventsRequests />} />
//             <Route path="/say-about-us" element={<What />} />
//             <Route path="/publications" element={<Publications />} />
//             <Route path="/publications/:id" element={<PublicationDetails />} />
//             <Route path="/events/register/confirmation/:id" element={<EventRegistrationConfirmation />} />
//             <Route path="/events/register/:id" element={<EventRegister />} />

//             {/* Protected Admin Routes - Only accessible by admin users */}
//             <Route path="/admin" element={
//               <ProtectedRoute>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/users" element={
//               <ProtectedRoute>
//                 <AdminUsers />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/users/:id" element={
//               <ProtectedRoute>
//                 <UserDetails />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/projects" element={
//               <ProtectedRoute>
//                 <AdminProjects />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/projects/:id" element={
//               <ProtectedRoute>
//                 <ProjectDetails />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/events" element={
//               <ProtectedRoute>
//                 <AdminEvents />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/events/:id" element={
//               <ProtectedRoute>
//                 <EventDetails />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/volunteers" element={
//               <ProtectedRoute>
//                 <AdminVolunteers />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/volunteers/:id" element={
//               <ProtectedRoute>
//                 <VolunteerDetails />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/partners" element={
//               <ProtectedRoute>
//                 <AdminPartners />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/partners/:id" element={
//               <ProtectedRoute>
//                 <PartnerDetails />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/impacts" element={
//               <ProtectedRoute>
//                 <AdminImpacts />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/messages" element={
//               <ProtectedRoute>
//                 <AdminMessages />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/news" element={
//               <ProtectedRoute>
//                 <AdminNews />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/news/:id" element={
//               <ProtectedRoute>
//                 <NewsDetails />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/leadership" element={
//               <ProtectedRoute>
//                 <AdminLeadership />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/testimonials" element={
//               <ProtectedRoute>
//                 <AdminTestimonials />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/reports" element={
//               <ProtectedRoute>
//                 <AdminReports />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/stats" element={
//               <ProtectedRoute>
//                 <AdminSttats />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/programs" element={
//               <ProtectedRoute>
//                 <AdminPrograms />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/programs/:id" element={
//               <ProtectedRoute>
//                 <ProgramDetails />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/donations" element={
//               <ProtectedRoute>
//                 <AdminDonations />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin/publications" element={
//               <ProtectedRoute>
//                 <AdminPublications />
//               </ProtectedRoute>
//             } />
//           </Routes>
//         </main>
        
//         <Footer />
//         <LoginModal isOpen={isModalOpen} onClose={closeModal} />
//       </div>
//     </Router>
//   );
// }

// export default App;








import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // ✅ For SEO
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';

// ✅ LAZY LOAD PAGES - Improves performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Programs = lazy(() => import('./pages/Programs'));
const Events = lazy(() => import('./pages/Events'));
const News = lazy(() => import('./pages/News'));
const Volunteers = lazy(() => import('./pages/Volunteers'));
const Contact = lazy(() => import('./pages/Contact'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Donate = lazy(() => import('./pages/Donate'));
const Login = lazy(() => import('./auth/Login'));
const Signup = lazy(() => import('./auth/SignUp'));
const VerifyOTP = lazy(() => import('./auth/VerifyOTP'));
const Report = lazy(() => import('./pages/Report'));
const Apply = lazy(() => import('./pages/Apply'));
const EventRegister = lazy(() => import('./pages/EventRegister'));
const Leadership = lazy(() => import('./pages/Leadership'));
const EventRegistrationConfirmation = lazy(() => import('./pages/EventRegistrationConfirmation'));
const Publications = lazy(() => import('./pages/Publications'));
const PublicationDetails = lazy(() => import('./pages/PubDetails'));
const Partners = lazy(() => import('./pages/partners'));
const What = lazy(() => import('./pages/Whet'));

// ✅ LAZY LOAD ADMIN PAGES
const AdminTestimonials = lazy(() => import('./admin/AdminTestmonials'));
const EventsRequests = lazy(() => import('./admin/EventRequests'));
const AdminUsers = lazy(() => import('./admin/AdminUsers'));
const AdminProjects = lazy(() => import('./admin/AdminProjects'));
const AdminEvents = lazy(() => import('./admin/AdminEvents'));
const AdminVolunteers = lazy(() => import('./admin/AdminVolunteers'));
const AdminPartners = lazy(() => import('./admin/AdminPartners'));
const AdminMessages = lazy(() => import('./admin/AdminMessages'));
const UserDetails = lazy(() => import('./admin/UserDetails'));
const ProjectDetails = lazy(() => import('./admin/ProjectDetails'));
const EventDetails = lazy(() => import('./admin/EventDetails'));
const PartnerDetails = lazy(() => import('./admin/PartnerDetails'));
const VolunteerDetails = lazy(() => import('./admin/VolunteerDetails'));
const AdminPrograms = lazy(() => import('./admin/AdminPrograms'));
const ProgramDetails = lazy(() => import('./admin/ProgramsDetails'));
const AdminNews = lazy(() => import('./admin/AdminNews'));
const AdminPublications = lazy(() => import('./admin/AdminPublications'));
const NewsDetails = lazy(() => import('./admin/NewsDetails'));
const AdminLeadership = lazy(() => import('./admin/AdminLeaderShip'));
const AdminDonations = lazy(() => import('./admin/AdminDonations'));
const AdminReports = lazy(() => import('./admin/AdminReports'));
const AdminImpacts = lazy(() => import('./admin/AdminImpacts'));
const AdminSttats = lazy(() => import('./admin/AdminStats'));

// ✅ LOADING COMPONENT
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    padding: '40px'
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
      <p style={{ color: '#666' }}>Loading page...</p>
    </div>
  </div>
);

// ✅ Protected Route Component with SEO
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
    return <PageLoader />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace state={{ message: 'Access denied. Admin privileges required.' }} />;
  }

  return children;
};

// ✅ ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// ✅ SEO Component for each route
const RouteSEO = ({ title, description, keywords, canonical, image, type = 'website' }) => {
  const location = useLocation();
  const currentUrl = `https://vumatanzania.or.tz${location.pathname}`;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical || currentUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

// ✅ Route wrapper with SEO
const RouteWithSEO = ({ element, ...seoProps }) => {
  return (
    <>
      <RouteSEO {...seoProps} />
      <Suspense fallback={<PageLoader />}>
        {element}
      </Suspense>
    </>
  );
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
            {/* ✅ Public Routes with SEO */}
            <Route path="/" element={
              <RouteWithSEO 
                element={<Home onLoginClick={openModal} />}
                title="VUMA Tanzania | Youth Innovation & Climate Action"
                description="VUMA Tanzania empowers youth through innovation and climate action. Join our platform to connect, learn, and make a difference in Tanzania's sustainable future."
                keywords="VUMA Tanzania, youth innovation, climate action, Tanzania youth, sustainability"
                image="https://vumatanzania.or.tz/vuma.png"
              />
            } />
            
            <Route path="/about" element={
              <RouteWithSEO 
                element={<About />}
                title="About VUMA Tanzania | Our Mission & Vision"
                description="Learn about VUMA Tanzania's mission to empower youth through innovation and climate action. Discover our story, values, and impact in Tanzania."
                keywords="about VUMA, mission, vision, youth empowerment, Tanzania"
              />
            } />
            
            <Route path="/programs" element={
              <RouteWithSEO 
                element={<Programs />}
                title="Programs - VUMA Tanzania | Youth Innovation & Climate Action"
                description="Explore VUMA Tanzania's programs for youth innovation, climate action, and sustainable development. Join our initiatives in Tanzania."
                keywords="youth programs, innovation programs, climate action, Tanzania programs"
              />
            } />
            
            <Route path="/events" element={
              <RouteWithSEO 
                element={<Events />}
                title="Events - VUMA Tanzania | Youth Innovation & Climate Action Events"
                description="Discover upcoming events by VUMA Tanzania. Join workshops, seminars, and conferences on youth innovation and climate action in Tanzania."
                keywords="Tanzania events, youth events, climate events, innovation events"
              />
            } />
            
            <Route path="/news" element={
              <RouteWithSEO 
                element={<News />}
                title="News - VUMA Tanzania | Youth Innovation & Climate Action"
                description="Stay updated with the latest news from VUMA Tanzania. Read about youth innovation, climate action, and sustainable development in Tanzania."
                keywords="VUMA news, Tanzania news, youth news, climate news"
              />
            } />
            
            <Route path="/volunteers" element={
              <RouteWithSEO 
                element={<Volunteers />}
                title="Volunteer - VUMA Tanzania | Make a Difference"
                description="Join VUMA Tanzania as a volunteer. Contribute to youth innovation and climate action initiatives in Tanzania. Make a lasting impact."
                keywords="volunteer Tanzania, youth volunteer, climate volunteer, community service"
              />
            } />
            
            <Route path="/contact" element={
              <RouteWithSEO 
                element={<Contact />}
                title="Contact VUMA Tanzania | Get in Touch"
                description="Contact VUMA Tanzania. Reach out for partnerships, inquiries, or to learn more about our youth innovation and climate action programs."
                keywords="contact VUMA, Tanzania contact, youth organization contact"
              />
            } />
            
            <Route path="/donate" element={
              <RouteWithSEO 
                element={<Donate />}
                title="Donate - VUMA Tanzania | Support Youth Innovation"
                description="Support VUMA Tanzania's mission. Your donation empowers youth innovation and climate action in Tanzania. Make a difference today."
                keywords="donate Tanzania, support youth, climate action donation, innovation support"
              />
            } />
            
            <Route path="/partners" element={
              <RouteWithSEO 
                element={<Partners />}
                title="Partners - VUMA Tanzania | Our Collaborators"
                description="Meet VUMA Tanzania's partners. Organizations and businesses supporting youth innovation and climate action in Tanzania."
                keywords="VUMA partners, Tanzania partners, youth partners, climate partners"
              />
            } />
            
            <Route path="/leadership" element={
              <RouteWithSEO 
                element={<Leadership />}
                title="Leadership - VUMA Tanzania | Our Team"
                description="Meet the leadership team at VUMA Tanzania. Dedicated individuals driving youth innovation and climate action in Tanzania."
                keywords="VUMA leadership, Tanzania leadership, youth leaders, climate leaders"
              />
            } />
            
            <Route path="/publications" element={
              <RouteWithSEO 
                element={<Publications />}
                title="Publications - VUMA Tanzania | Research & Insights"
                description="Explore publications from VUMA Tanzania. Research papers, reports, and insights on youth innovation and climate action in Tanzania."
                keywords="VUMA publications, Tanzania research, youth research, climate research"
              />
            } />
            
            <Route path="/publications/:id" element={
              <RouteWithSEO 
                element={<PublicationDetails />}
                title="Publication - VUMA Tanzania"
                description="Read detailed publications from VUMA Tanzania on youth innovation and climate action."
              />
            } />
            
            {/* ✅ Auth Routes */}
            <Route path="/login" element={
              <RouteWithSEO 
                element={<Login />}
                title="Login - VUMA Tanzania"
                description="Login to your VUMA Tanzania account. Access youth innovation programs and climate action initiatives."
                keywords="VUMA login, Tanzania login, youth login"
              />
            } />
            
            <Route path="/signup" element={
              <RouteWithSEO 
                element={<Signup />}
                title="Sign Up - VUMA Tanzania | Join Us"
                description="Create your VUMA Tanzania account. Join youth innovators and climate activists in Tanzania. Start making a difference today."
                keywords="VUMA signup, Tanzania signup, youth registration, climate registration"
              />
            } />
            
            <Route path="/verify-otp" element={
              <RouteWithSEO 
                element={<VerifyOTP />}
                title="Verify - VUMA Tanzania"
                description="Verify your VUMA Tanzania account. Complete your registration to access youth innovation programs."
              />
            } />
            
            {/* ✅ Program & Event Routes */}
            <Route path="/programs/apply" element={
              <RouteWithSEO 
                element={<Apply />}
                title="Apply - VUMA Tanzania Programs"
                description="Apply for VUMA Tanzania youth innovation and climate action programs. Join our initiatives in Tanzania."
                keywords="apply VUMA, program application, Tanzania programs"
              />
            } />
            
            <Route path="/events/register" element={
              <RouteWithSEO 
                element={<EventRegister />}
                title="Event Registration - VUMA Tanzania"
                description="Register for VUMA Tanzania events. Join workshops and conferences on youth innovation and climate action."
              />
            } />
            
            <Route path="/events/register/:id" element={
              <RouteWithSEO 
                element={<EventRegister />}
                title="Register for Event - VUMA Tanzania"
              />
            } />
            
            <Route path="/events/register/confirmation/:id" element={
              <RouteWithSEO 
                element={<EventRegistrationConfirmation />}
                title="Registration Confirmed - VUMA Tanzania"
              />
            } />
            
            <Route path="/report" element={
              <RouteWithSEO 
                element={<Report />}
                title="Report - VUMA Tanzania"
                description="Submit reports and updates to VUMA Tanzania. Share your impact and contributions to youth innovation."
              />
            } />
            
            <Route path="/say-about-us" element={
              <RouteWithSEO 
                element={<What />}
                title="What People Say - VUMA Tanzania"
                description="Read testimonials about VUMA Tanzania. Hear from youth, partners, and community members about our impact."
                keywords="testimonials, VUMA reviews, community feedback"
              />
            } />
            
            <Route path="/events/requests" element={
              <RouteWithSEO 
                element={<EventsRequests />}
                title="Event Requests - VUMA Tanzania"
                description="Request events and workshops from VUMA Tanzania. Bring youth innovation and climate action to your community."
              />
            } />
            
            <Route path="/profile" element={
              <RouteWithSEO 
                element={<Profile />}
                title="My Profile - VUMA Tanzania"
                description="View and manage your VUMA Tanzania profile. Track your involvement in youth innovation programs."
              />
            } />
            
            {/* ✅ Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<AdminDashboard />}
                  title="Admin Dashboard - VUMA Tanzania"
                  description="VUMA Tanzania admin dashboard. Manage youth innovation programs, events, and users."
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<AdminUsers />}
                  title="Manage Users - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/users/:id" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<UserDetails />}
                  title="User Details - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/projects" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<AdminProjects />}
                  title="Manage Projects - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/projects/:id" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<ProjectDetails />}
                  title="Project Details - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/events" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<AdminEvents />}
                  title="Manage Events - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/events/:id" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<EventDetails />}
                  title="Event Details - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/volunteers" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<AdminVolunteers />}
                  title="Manage Volunteers - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/volunteers/:id" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<VolunteerDetails />}
                  title="Volunteer Details - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/partners" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<AdminPartners />}
                  title="Manage Partners - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/partners/:id" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<PartnerDetails />}
                  title="Partner Details - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/impacts" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<AdminImpacts />}
                  title="Manage Impacts - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/messages" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<AdminMessages />}
                  title="Manage Messages - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/news" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<AdminNews />}
                  title="Manage News - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/news/:id" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<NewsDetails />}
                  title="News Details - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/leadership" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<AdminLeadership />}
                  title="Manage Leadership - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/testimonials" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<AdminTestimonials />}
                  title="Manage Testimonials - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/reports" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<AdminReports />}
                  title="Manage Reports - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/stats" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<AdminSttats />}
                  title="Statistics - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/programs" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<AdminPrograms />}
                  title="Manage Programs - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/programs/:id" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<ProgramDetails />}
                  title="Program Details - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/donations" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<AdminDonations />}
                  title="Manage Donations - VUMA Tanzania Admin"
                />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/publications" element={
              <ProtectedRoute>
                <RouteWithSEO 
                  element={<AdminPublications />}
                  title="Manage Publications - VUMA Tanzania Admin"
                />
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