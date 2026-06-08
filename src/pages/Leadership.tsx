import React, { useState, useRef } from 'react';

// Import local images from assets folder - only event.jpg to eventf.jpg
import event from '../assets/new/event.jpg';
import eventa from '../assets/new/eventa.jpg';
import eventb from '../assets/new/eventb.jpg';
import eventc from '../assets/new/eventc.jpg';
import eventd from '../assets/new/eventd.jpg';
import evente from '../assets/new/evente.jpg';
import eventf from '../assets/new/eventf.jpg';

// Static leadership data - using only event.jpg to eventf.jpg
const leadershipData = [
  {
    id: 1,
    name: "Mr. Laban Abas Mapabha",
    role: "-Co Founder & Executive Director",
    image: event, // Founder uses event.jpg
    isFounder: true,
    bio: "Leading VUMA's comprehensive ecosystem restoration initiatives across Lake Victoria and beyond. Mr Laban Abas Mapabha holds an experience in Environmental Science and has over 15 years of experience in aquatic ecosystem management and community-led conservation.",
    fullBio: "Mr. Laban Abas Mapabha is the visionary founder of VUMA Organization. With extensive experience in Environmental Science and decades of hands-on experience around Lake Victoria, he has dedicated his life to restoring degraded ecosystems while empowering local communities. Under his leadership, VUMA has launched multiple conservation initiatives, removing thousands of tons of invasive weeds and plastic waste from the lake. He is a recipient of multiple environmental awards and serves on various international environmental advisory boards.",
    achievements: [
      "Environmental Science Expert ",
      "15+ years in aquatic ecosystem restoration",
      "Founded VUMA Organization",
      "NICE attendee in  earth protection SUMMITS"
    ]
  },
  {
    id: 2,
    name: "Lilian Emmanuel Mosha",
    role: "-Co Founder, Treasurer",
    image: eventa,
    isFounder: false,
    bio: "Overseeing large-scale removal of invasive weeds, plastic waste, and industrial debris from Lake Victoria. Expert in logistics and community mobilization.",
    fullBio: "Lilian Emmanuel Mosha brings over 12 years of experience in large-scale environmental operations management. He leads daily activities of conservation initiatives, coordinating mechanical harvesters, plastic recovery boats, and over 200 field staff across three countries.",
    achievements: [
      "12+ years operations management",
      "Led removal of 450+ tons of invasive weeds",
      "Trained 500+ local waste management workers"
    ]
  },
  {
    id: 3,
    name: "Edom Fanuel Mataro",
    role: "Co Founder, Chair person",
    image: eventb,
    isFounder: false,
    bio: "Transforming urban landscapes through native flora landscaping. Specialist in sustainable urban design and biodiversity conservation.",
    fullBio: "Edom Fanuel Mataro is a landscape architect and urban ecologist who leads VUMA's Green Corridors & Urban Blooms initiative. He has transformed over 50 public roundabouts and open spaces into thriving native plant habitats.",
    achievements: [
      "Much experience in Landscape Architecture",
      "Transformed 50+ public spaces",
      "40% increase in urban bee populations"
    ]
  },
  {
    id: 4,
    name: "Johnbosco Munser",
    role: "-Co founder,Secretary",
    image: eventc,
    isFounder: false,
    bio: "Leading solar-powered irrigation programs for smallholder farmers. Specialist in climate-smart agriculture and renewable energy.",
    fullBio: "Mr. Johnbosco Munser is an agricultural engineer and renewable energy expert who heads VUMA's Solar-Agri Empowerment initiative. He has overseen the installation of over 800 solar-powered irrigation systems.",
    achievements: [
      "Bachelor in law",
      "Installed 800+ solar irrigation systems",
      "Trained 2,000+ farmers"
    ]
  },
  {
    id: 5,
    name: "Mr. Obadia Idd Luyagaza",
    role: "-Founder-Program manager",
    image: eventd,
    isFounder: false,
    bio: "Nurturing next generation environmental leaders through training and innovation workshops.",
    fullBio: "Dr. Fatima Hassan is an educator and youth development specialist who leads VUMA's Youth Environmental Stewards program, reaching over 3,000 students across 45 schools.",
    achievements: [
      "Experienced in  in Education and Youth Development",
      "Reached 3,000+ students",
      "Developed environmental curriculum"
    ]
  },
  {
    id: 6,
    name: "Mrs. Grace Alfred Gabriel",
    role: "Events Lead",
    image: evente,
    isFounder: false,
    bio: "Managing financial sustainability and building strategic partnerships with global organizations.",
    fullBio: "Peter Njoroge brings over 18 years of experience in nonprofit finance and has secured funding from World Bank, UNEP, and Global Environment Facility.",
    achievements: [
      "Much experienced in years VUMA missions",
      "Secured World Bank funding",
      "Built 20+ partnerships"
    ]
  },
  {
    id: 7,
    name: "Mr. Justus Juventus",
    role: "Resource Manager",
    image: eventf,
    isFounder: false,
    bio: "Driving technological innovation in waste management and recycling solutions.",
    fullBio: "John Kimani leads VUMA's innovation lab, developing open-source technologies for plastic recycling, water quality monitoring, and composting systems.",
    achievements: [
      "5+ tech innovations deployed",
      "Open-source hardware designs",
      "Trained 200+ youth in tech"
    ]
  }
];

const Leadership = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const carouselRef = useRef(null);
  
  const [counters, setCounters] = useState({
    experience: 0,
    projects: 0,
    youth: 0,
    partners: 0
  });

  // Separate founder and team members
  const founder = leadershipData.find(leader => leader.isFounder === true);
  const teamMembers = leadershipData.filter(leader => leader.isFounder !== true);

  // Intersection Observer for section visibility
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Auto-scroll carousel from left to right
  React.useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationId;
    let startTime;
    const duration = 25000; // 25 seconds for full scroll
    const scrollDistance = carousel.scrollWidth - carousel.clientWidth;

    const scroll = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      const newPosition = progress * scrollDistance;
      carousel.scrollLeft = newPosition;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    carousel._animationId = animationId;

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [teamMembers.length]);

  // Stats counter observer
  React.useEffect(() => {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsVisible) {
            setStatsVisible(true);
            startCounters();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      statsObserver.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        statsObserver.unobserve(statsRef.current);
      }
    };
  }, [statsVisible]);

  const startCounters = () => {
    const duration = 2000;
    const stepTime = 20;
    
    const statsData = [
      { id: 'experience', target: 15 },
      { id: 'projects', target: 50 },
      { id: 'youth', target: 5000 },
      { id: 'partners', target: 25 }
    ];
    
    statsData.forEach((stat) => {
      let currentValue = 0;
      const increment = stat.target / (duration / stepTime);
      
      const interval = setInterval(() => {
        currentValue += increment;
        if (currentValue >= stat.target) {
          setCounters(prev => ({ ...prev, [stat.id]: stat.target }));
          clearInterval(interval);
        } else {
          setCounters(prev => ({ ...prev, [stat.id]: Math.floor(currentValue) }));
        }
      }, stepTime);
    });
  };

  const openModal = (leader) => {
    setSelectedLeader(leader);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLeader(null);
    document.body.style.overflow = 'unset';
  };

  const handleImageLoad = (id) => {
    setImageLoaded(prev => ({ ...prev, [id]: true }));
  };

  // Pause auto-scroll on hover
  const handleCarouselMouseEnter = () => {
    if (carouselRef.current && carouselRef.current._animationId) {
      cancelAnimationFrame(carouselRef.current._animationId);
    }
  };

  const handleCarouselMouseLeave = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationId;
    let startTime;
    const duration = 25000;
    const scrollDistance = carousel.scrollWidth - carousel.clientWidth;

    const scroll = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      const newPosition = progress * scrollDistance;
      carousel.scrollLeft = newPosition;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    carousel._animationId = animationId;
  };

  if (leadershipData.length === 0) {
    return (
      <div style={{
        padding: '4rem 1rem',
        background: 'linear-gradient(135deg, #f9fbf7 0%, #f0f5ee 100%)',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-users-slash" style={{ fontSize: '3rem', color: '#F9C74F', marginBottom: '1rem' }}></i>
          <p style={{ color: '#666' }}>No leadership team members found.</p>
        </div>
      </div>
    );
  }

  // Fixed card size for ALL cards
  const cardWidth = 300;
  const cardImageSize = 120;

  return (
    <>
      {/* Leadership Section */}
      <div ref={sectionRef} style={{
        padding: '5rem 1.5rem',
        background: 'linear-gradient(135deg, #f9fbf7 0%, #f0f5ee 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(10px, -15px); }
            50% { transform: translate(-10px, 20px); }
            75% { transform: translate(15px, -10px); }
          }
          @keyframes floatSlow {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(15px, -10px) rotate(5deg); }
            50% { transform: translate(-5px, 15px) rotate(-3deg); }
            75% { transform: translate(10px, -5px) rotate(2deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
          }
          @keyframes bounceIn {
            0% { opacity: 0; transform: scale(0.3); }
            50% { opacity: 1; transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); }
          }
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes glowPulse {
            0%, 100% { text-shadow: 0 0 0px rgba(249,199,79,0); }
            50% { text-shadow: 0 0 20px rgba(249,199,79,0.3); }
          }
          @keyframes scrollLeftToRight {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          
          .leader-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            width: ${cardWidth}px;
            min-width: ${cardWidth}px;
          }
          
          .leader-card:hover {
            transform: translateY(-10px) scale(1.02) !important;
            box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important;
          }
          
          .leader-card:hover .profile-image {
            transform: scale(1.05);
          }
          
          .leader-card:hover .shine-effect {
            left: 100%;
          }
          
          .profile-image {
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .shine-effect {
            transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .stat-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .stat-card:hover {
            transform: translateY(-5px) scale(1.02);
            background: rgba(11,59,47,0.03);
          }
          
          .modal-content {
            animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .modal-overlay {
            animation: fadeIn 0.3s ease;
          }
          
          .carousel-track {
            display: flex;
            gap: 1.5rem;
            animation: scrollLeftToRight 30s linear infinite;
            width: fit-content;
          }
          
          .carousel-container:hover .carousel-track {
            animation-play-state: paused;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
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
            .modal-content { max-height: 90vh; }
            .leader-card {
              width: 280px !important;
              min-width: 280px !important;
            }
          }
        `}</style>

        {/* Decorative Background Elements */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          right: '-5%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(249,199,79,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: 'float 12s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(11,59,47,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: 'floatSlow 14s ease-in-out infinite reverse'
        }} />

        {/* Section Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          animation: isVisible ? 'fadeInUp 0.8s ease forwards' : 'none'
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(249,199,79,0.2)',
            padding: '0.4rem 1.2rem',
            borderRadius: '50px',
            marginBottom: '1rem',
            animation: isVisible ? 'bounceIn 0.6s ease' : 'none'
          }}>
            <span style={{ color: '#0B3B2F', fontWeight: 600, fontSize: '0.85rem' }}>
              <i className="fas fa-users" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
              MEET THE TEAM
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #0B3B2F, #2b7a5c, #F9C74F)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            animation: isVisible ? 'glowPulse 2s ease-in-out infinite' : 'none'
          }}>
            Our Leadership
          </h2>
          <p style={{
            fontSize: 'clamp(0.9rem, 4vw, 1rem)',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Dedicated professionals driving environmental innovation and community action
          </p>
        </div>

        {/* Founder Card - Static (Non-moving) */}
        {founder && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '4rem'
          }}>
            <div
              className="leader-card"
              style={{
                background: 'linear-gradient(135deg, #ffffff, #fef9e8)',
                borderRadius: '32px',
                padding: '2rem 1.5rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                border: '2px solid rgba(249,199,79,0.3)',
                animation: isVisible ? 'zoomIn 0.6s ease' : 'none'
              }}
              onMouseEnter={() => setHoveredCard(founder.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => openModal(founder)}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                pointerEvents: 'none'
              }}
              className="shine-effect" />

              {/* Founder Badge */}
              <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: '#F9C74F',
                padding: '0.3rem 0.8rem',
                borderRadius: '50px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                color: '#0B3B2F',
                zIndex: 2
              }}>
                <i className="fas fa-crown"></i> Founder
              </div>

              <div style={{
                position: 'relative',
                display: 'inline-block',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-5px',
                  left: '-5px',
                  right: '-5px',
                  bottom: '-5px',
                  background: 'linear-gradient(135deg, #F9C74F, #f6b83e)',
                  borderRadius: '50%',
                  zIndex: 0,
                  animation: hoveredCard === founder.id ? 'pulse 1s ease-in-out infinite' : 'none'
                }} />
                <div style={{
                  width: `${cardImageSize + 20}px`,
                  height: `${cardImageSize + 20}px`,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative',
                  zIndex: 1,
                  border: hoveredCard === founder.id ? '4px solid #F9C74F' : '4px solid white',
                  background: '#f0f0f0'
                }}
                className="profile-image">
                  {!imageLoaded[founder.id] && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite'
                    }} />
                  )}
                  <img 
                    src={founder.image} 
                    alt={founder.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: imageLoaded[founder.id] ? 1 : 0,
                      transition: 'opacity 0.3s ease'
                    }}
                    onLoad={() => handleImageLoad(founder.id)}
                  />
                </div>
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                color: '#0B3B2F',
                marginBottom: '0.3rem',
                fontWeight: 700
              }}>
                {founder.name}
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: '#F9C74F',
                marginBottom: '1rem',
                fontWeight: 600
              }}>
                {founder.role}
              </p>
              <p style={{
                fontSize: '0.85rem',
                color: '#666',
                lineHeight: '1.6',
                marginBottom: '1rem',
                maxWidth: '280px',
                margin: '0 auto 1rem'
              }}>
                {founder.bio.length > 120 ? founder.bio.substring(0, 120) + '...' : founder.bio}
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                borderRadius: '50px',
                background: hoveredCard === founder.id ? '#F9C74F' : 'rgba(249,199,79,0.15)',
                transition: 'all 0.3s ease'
              }}>
                <i className="fas fa-eye" style={{ color: hoveredCard === founder.id ? '#0B3B2F' : '#F9C74F' }}></i>
                <span style={{ fontWeight: 600 }}>View Full Profile</span>
              </div>
            </div>
          </div>
        )}

        {/* Team Members - Moving Carousel Left to Right */}
        <div style={{
          marginTop: '2rem'
        }}>
          <h3 style={{
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#0B3B2F',
            marginBottom: '1.5rem'
          }}>
            <i className="fas fa-users" style={{ color: '#F9C74F', marginRight: '0.5rem' }}></i>
            Our Expert Team
          </h3>
          
          <div 
            className="carousel-container"
            style={{
              width: '100%',
              overflow: 'hidden',
              position: 'relative',
              padding: '1rem 0'
            }}
            onMouseEnter={handleCarouselMouseEnter}
            onMouseLeave={handleCarouselMouseLeave}
          >
            <div 
              ref={carouselRef}
              className="carousel-track"
              style={{
                display: 'flex',
                gap: '1.5rem',
                width: 'fit-content',
                animation: 'scrollLeftToRight 30s linear infinite'
              }}
            >
              {/* Double the team members for seamless infinite scroll */}
              {[...teamMembers, ...teamMembers].map((member, idx) => (
                <div
                  key={`${member.id}-${idx}`}
                  className="leader-card"
                  style={{
                    background: 'white',
                    borderRadius: '28px',
                    padding: '1.5rem 1.2rem',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    width: `${cardWidth}px`,
                    minWidth: `${cardWidth}px`
                  }}
                  onMouseEnter={() => setHoveredCard(member.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => openModal(member)}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    pointerEvents: 'none'
                  }}
                  className="shine-effect" />

                  <div style={{
                    position: 'relative',
                    display: 'inline-block',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-3px',
                      left: '-3px',
                      right: '-3px',
                      bottom: '-3px',
                      background: 'linear-gradient(135deg, #F9C74F, #f6b83e)',
                      borderRadius: '50%',
                      zIndex: 0,
                      opacity: hoveredCard === member.id ? 1 : 0,
                      transition: 'opacity 0.3s ease'
                    }} />
                    <div style={{
                      width: `${cardImageSize}px`,
                      height: `${cardImageSize}px`,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      position: 'relative',
                      zIndex: 1,
                      border: hoveredCard === member.id ? '3px solid #F9C74F' : '3px solid white',
                      background: '#f0f0f0'
                    }}
                    className="profile-image">
                      {!imageLoaded[member.id] && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 1.5s infinite'
                        }} />
                      )}
                      <img 
                        src={member.image} 
                        alt={member.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: imageLoaded[member.id] ? 1 : 0,
                          transition: 'opacity 0.3s ease'
                        }}
                        onLoad={() => handleImageLoad(member.id)}
                      />
                    </div>
                  </div>

                  <h3 style={{
                    fontSize: '1.1rem',
                    color: '#0B3B2F',
                    marginBottom: '0.2rem',
                    fontWeight: 700
                  }}>
                    {member.name}
                  </h3>
                  <p style={{
                    fontSize: '0.7rem',
                    color: '#F9C74F',
                    marginBottom: '0.6rem',
                    fontWeight: 600
                  }}>
                    {member.role}
                  </p>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#666',
                    lineHeight: '1.5',
                    marginBottom: '0.8rem'
                  }}>
                    {member.bio.length > 90 ? member.bio.substring(0, 90) + '...' : member.bio}
                  </p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '50px',
                    background: hoveredCard === member.id ? '#F9C74F' : 'rgba(249,199,79,0.1)',
                    transition: 'all 0.3s ease',
                    fontSize: '0.7rem'
                  }}>
                    <i className="fas fa-eye" style={{ fontSize: '0.7rem' }}></i>
                    <span style={{ fontWeight: 600 }}>View Profile</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div style={{
            textAlign: 'center',
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="fas fa-arrow-left" style={{ fontSize: '0.8rem', color: '#F9C74F' }}></i>
            <span style={{ fontSize: '0.7rem', color: '#666' }}>Scroll Left to Right</span>
            <i className="fas fa-arrow-right" style={{ fontSize: '0.8rem', color: '#F9C74F' }}></i>
          </div>
        </div>
      </div>

      {/* Animated Stats Section */}
      <div ref={statsRef} style={{
        margin: '2rem auto',
        padding: '3rem 2rem',
        background: 'linear-gradient(135deg, #ffffff, #f9fbf7)',
        borderRadius: '40px',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        gap: '2rem',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
      }}>
        {[
          { id: 'experience', icon: 'fas fa-calendar-alt', label: 'Years Combined Experience', value: counters.experience, suffix: '+' },
          { id: 'projects', icon: 'fas fa-project-diagram', label: 'Projects Completed', value: counters.projects, suffix: '+' },
          { id: 'youth', icon: 'fas fa-users', label: 'Youth Empowered', value: counters.youth.toLocaleString(), suffix: '+' },
          { id: 'partners', icon: 'fas fa-handshake', label: 'Community Partners', value: counters.partners, suffix: '+' }
        ].map((stat, idx) => (
          <div 
            key={stat.id}
            className="stat-card"
            style={{ 
              flex: 1, 
              minWidth: '150px',
              padding: '1.5rem',
              borderRadius: '24px',
              cursor: 'pointer',
              opacity: statsVisible ? 1 : 0,
              transform: statsVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)',
              transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${idx * 0.1}s`
            }}
          >
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(249,199,79,0.15)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.8rem'
            }}>
              <i className={stat.icon} style={{ fontSize: '1.3rem', color: '#F9C74F' }}></i>
            </div>
            <div style={{ 
              fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', 
              fontWeight: 800, 
              color: '#0B3B2F',
              fontFamily: 'monospace'
            }}>
              {stat.value}{stat.suffix}
            </div>
            <div style={{ color: '#555', fontSize: '0.8rem', fontWeight: 500 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Leader Profile Modal */}
      {showModal && selectedLeader && (
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
          padding: '16px'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
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
                zIndex: 10,
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <i className="fas fa-times"></i>
            </button>

            <div style={{
              background: 'linear-gradient(135deg, #0B3B2F, #1a5c48)',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid #F9C74F'
              }}>
                <img 
                  src={selectedLeader.image} 
                  alt={selectedLeader.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <h2 style={{ color: 'white', marginTop: '1rem', marginBottom: '0.3rem' }}>{selectedLeader.name}</h2>
              <p style={{ color: '#F9C74F', fontWeight: 600 }}>{selectedLeader.role}</p>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>
                  <i className="fas fa-user-circle" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  Biography
                </h3>
                <p style={{ color: '#555', lineHeight: '1.6' }}>{selectedLeader.fullBio}</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.5rem' }}>
                  <i className="fas fa-trophy" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  Key Achievements
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {selectedLeader.achievements.map((achievement, idx) => (
                    <li key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      color: '#555'
                    }}>
                      <i className="fas fa-check-circle" style={{ color: '#2b7a5c' }}></i>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={closeModal}
                style={{
                  width: '100%',
                  background: '#F9C74F',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '50px',
                  color: '#0B3B2F',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Leadership;