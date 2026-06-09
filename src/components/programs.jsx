import React, { useState, useRef, useEffect } from 'react';

const Programs = () => {
  const [activeProgram, setActiveProgram] = useState('leadership');
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    youth: 0,
    trees: 0,
    ideas: 0,
    volunteers: 0
  });
  const [statsVisible, setStatsVisible] = useState(false);
  const sectionRef = useRef(null);
  const statsRef = useRef(null);

  // Program data structure - 3 main programs with activities
  const programsData = {
    leadership: {
      title: "Youth Leadership",
      icon: "fas fa-users",
      color: "#0B3B2F",
      bgGradient: "linear-gradient(135deg, #0B3B2F, #1a5c48)",
      description: "Building the next generation of leaders through competitive and collaborative experiences that develop critical thinking, public speaking, and problem-solving skills.",
      activities: [
        {
          name: "Youth Interschool Essay Competition",
          icon: "fas fa-pen-fancy",
          description: "An annual competition that challenges students across schools to write compelling essays on environmental and leadership topics. Winners receive recognition, prizes, and mentorship opportunities.",
          details: [
            "Open to secondary school students across all regions",
            "Topics focused on climate action, innovation, and community leadership",
            "Prizes include educational materials, certificates, and internship opportunities",
            "Top essays published in VUMA's annual youth journal"
          ]
        },
        {
          name: "Youth Leadership Boot Camps & Hackathons",
          icon: "fas fa-laptop-code",
          description: "Intensive multi-day events where young people collaborate to solve real-world challenges through technology, design thinking, and teamwork.",
          details: [
            "Weekend and week-long intensive training programs",
            "Hands-on projects addressing community environmental issues",
            "Mentorship from industry professionals and community leaders",
            "Networking opportunities with like-minded youth across the region"
          ]
        }
      ]
    },
    environment: {
      title: "Environmental Resilience & Adaptation",
      icon: "fas fa-leaf",
      color: "#2b7a5c",
      bgGradient: "linear-gradient(135deg, #2b7a5c, #3a9b7a)",
      description: "Protecting our planet through community-based initiatives that restore ecosystems, build climate resilience, and promote sustainable urban development.",
      activities: [
        {
          name: "Ziwa Letu (Lake Victoria)",
          icon: "fas fa-water",
          description: "A comprehensive initiative focused on restoring and protecting Lake Victoria through community engagement, waste management, and conservation education.",
          details: [
            "Plastic waste collection and recycling programs along lake shores",
            "Water hyacinth removal and sustainable biomass processing",
            "Community education on lake conservation and water protection",
            "Partnerships with fishing communities for sustainable practices"
          ]
        },
        {
          name: "Smart City",
          icon: "fas fa-city",
          description: "Transforming urban spaces into sustainable, green environments through native landscaping, waste reduction, and eco-friendly infrastructure.",
          details: [
            "Green corridor development with native plant species",
            "Urban waste management and recycling initiatives",
            "Public space beautification and maintenance programs",
            "Smart waste sorting and collection systems"
          ]
        },
        {
          name: "Agroecology",
          icon: "fas fa-tractor",
          description: "Promoting sustainable farming practices that work with nature to improve food security, soil health, and farmer livelihoods.",
          details: [
            "Solar-powered irrigation systems for smallholder farmers",
            "Training in organic farming and permaculture techniques",
            "Water conservation and drought-resistant crop education",
            "Farmer cooperatives and market access support"
          ]
        }
      ]
    },
    opportunity: {
      title: "Youth & Opportunity",
      icon: "fas fa-briefcase",
      color: "#F9C74F",
      bgGradient: "linear-gradient(135deg, #F9C74F, #f6b83e)",
      description: "Connecting young people with meaningful economic opportunities that enable them to build sustainable futures while contributing to their communities.",
      activities: [
        {
          name: "Local & International Job Opportunities",
          icon: "fas fa-globe",
          description: "A dedicated platform connecting qualified youth with employment opportunities in environmental conservation, sustainable development, and green technology sectors.",
          details: [
            "Job placement assistance with partner organizations",
            "Internship programs in environmental and leadership fields",
            "International exchange and work opportunities",
            "Career counseling and professional development workshops"
          ]
        }
      ]
    }
  };

  const currentProgram = programsData[activeProgram];
  const currentActivities = currentProgram?.activities || [];

  // Stats counter animation
  useEffect(() => {
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

  // Section visibility
  useEffect(() => {
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

  const startCounters = () => {
    const duration = 2000;
    const stepTime = 20;
    
    const targets = {
      youth: 10000,
      trees: 15000,
      ideas: 500,
      volunteers: 250
    };
    
    Object.keys(targets).forEach((key) => {
      let current = 0;
      const increment = targets[key] / (duration / stepTime);
      
      const interval = setInterval(() => {
        current += increment;
        if (current >= targets[key]) {
          setCounters(prev => ({ ...prev, [key]: targets[key] }));
          clearInterval(interval);
        } else {
          setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
        }
      }, stepTime);
    });
  };

  return (
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
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        
        .program-tab {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .program-tab:hover {
          transform: translateY(-3px);
        }
        
        .activity-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: default;
        }
        
        .activity-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }
        
        .stat-card {
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px) scale(1.02);
        }
        
        .icon-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Decorative Background */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(249,199,79,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        animation: 'float 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '-8%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(11,59,47,0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        animation: 'float 10s ease-in-out infinite reverse'
      }} />

      {/* Section Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.6s ease'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(249,199,79,0.15)',
          padding: '0.4rem 1.2rem',
          borderRadius: '50px',
          marginBottom: '1rem',
          animation: isVisible ? 'bounceIn 0.6s ease' : 'none'
        }}>
          <span style={{ color: '#F9C74F', fontWeight: 600, fontSize: '0.8rem' }}>
            <i className="fas fa-chalkboard-user" style={{ marginRight: '0.5rem' }}></i>
            OUR PROGRAMS
          </span>
        </div>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 800,
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #0B3B2F, #2b7a5c, #F9C74F)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        }}>
          What We Do
        </h2>
        <p style={{
          fontSize: 'clamp(0.9rem, 4vw, 1rem)',
          color: '#666',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Empowering youth through leadership, environmental action, and economic opportunity
        </p>
      </div>

      {/* Program Tabs - 3 Main Programs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '3rem'
      }}>
        {[
          { id: 'leadership', name: 'Youth Leadership', icon: 'fas fa-users', color: '#0B3B2F' },
          { id: 'environment', name: 'Environmental Resilience', icon: 'fas fa-leaf', color: '#2b7a5c' },
          { id: 'opportunity', name: 'Youth & Opportunity', icon: 'fas fa-briefcase', color: '#F9C74F' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveProgram(tab.id)}
            className="program-tab"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.8rem 1.5rem',
              borderRadius: '50px',
              border: 'none',
              background: activeProgram === tab.id ? tab.color : 'white',
              color: activeProgram === tab.id ? 'white' : tab.color,
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: activeProgram === tab.id ? `0 5px 15px ${tab.color}40` : '0 2px 8px rgba(0,0,0,0.08)'
            }}
          >
            <i className={tab.icon} style={{ fontSize: '1rem' }}></i>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Program Content with Activities */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Program Description Banner */}
        <div style={{
          background: currentProgram.bgGradient,
          borderRadius: '28px',
          padding: '2rem',
          marginBottom: '2.5rem',
          textAlign: 'center',
          animation: isVisible ? 'zoomIn 0.6s ease' : 'none'
        }}>
          <div style={{
            width: '70px',
            height: '70px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <i className={currentProgram.icon} style={{ fontSize: '2rem', color: 'white' }}></i>
          </div>
          <h3 style={{
            color: 'white',
            fontSize: '1.8rem',
            marginBottom: '0.5rem'
          }}>
            {currentProgram.title}
          </h3>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {currentProgram.description}
          </p>
        </div>

        {/* Activities Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {currentActivities.map((activity, index) => (
            <div
              key={activity.name}
              className="activity-card"
              style={{
                background: 'white',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                animation: isVisible ? `slideIn${index % 2 === 0 ? 'Left' : 'Right'} 0.6s ease ${index * 0.1}s both` : 'none'
              }}
            >
              {/* Activity Header */}
              <div style={{
                background: `linear-gradient(135deg, ${currentProgram.color}, ${currentProgram.color === '#F9C74F' ? '#e6a800' : '#1a5c48'})`,
                padding: '1.5rem',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className={activity.icon} style={{ color: 'white', fontSize: '1.2rem' }}></i>
                </div>
                <h3 style={{
                  color: 'white',
                  fontSize: '1.3rem',
                  marginBottom: '0.5rem',
                  paddingRight: '3rem'
                }}>
                  {activity.name}
                </h3>
              </div>

              {/* Activity Body */}
              <div style={{ padding: '1.5rem' }}>
                <p style={{
                  color: '#555',
                  lineHeight: '1.6',
                  marginBottom: '1.2rem',
                  fontSize: '0.9rem'
                }}>
                  {activity.description}
                </p>

                <div style={{
                  borderTop: '1px solid #eee',
                  paddingTop: '1rem'
                }}>
                  <p style={{
                    fontWeight: 600,
                    color: currentProgram.color,
                    marginBottom: '0.8rem',
                    fontSize: '0.85rem'
                  }}>
                    <i className="fas fa-list-check" style={{ marginRight: '0.5rem' }}></i>
                    Key Activities:
                  </p>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {activity.details.map((detail, idx) => (
                      <li key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        marginBottom: '0.6rem',
                        fontSize: '0.8rem',
                        color: '#666'
                      }}>
                        <i className="fas fa-check-circle" style={{ color: currentProgram.color, fontSize: '0.7rem', marginTop: '0.15rem' }}></i>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No activities fallback */}
        {currentActivities.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'white',
            borderRadius: '28px'
          }}>
            <i className="fas fa-info-circle" style={{ fontSize: '2rem', color: '#F9C74F', marginBottom: '1rem' }}></i>
            <p>More activities coming soon!</p>
          </div>
        )}
      </div>

      {/* Impact Stats Section - Animated Counters */}
    

      {/* Call to Action */}
      <div style={{
        textAlign: 'center',
        marginTop: '3rem'
      }}>
        <button
          onClick={() => window.location.href = '/events/register'}
          style={{
            background: 'linear-gradient(135deg, #F9C74F, #f6b83e)',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '50px',
            color: '#0B3B2F',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.8rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 5px 20px rgba(249,199,79,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(249,199,79,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 5px 20px rgba(249,199,79,0.3)';
          }}
        >
          <i className="fas fa-rocket"></i>
          Get Involved Today
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Programs;