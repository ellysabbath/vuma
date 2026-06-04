import React, { useState, useRef } from 'react';

// Import local images from assets folder
import eventa from '../assets/eventa.jpg';
import eventb from '../assets/event.jpg';
import eventc from '../assets/eventc.jpg';
import eventd from '../assets/eventd.jpg';
import evente from '../assets/evente.jpg';
import eventf from '../assets/eventf.jpg';
import eventg from '../assets/eventg.jpg';
import eventh from '../assets/eventh.jpg';
import eventi from '../assets/eventi.jpg';
import eventj from '../assets/eventj.jpg';
import eventk from '../assets/eventk.jpg';
import eventl from '../assets/eventl.jpg';

// Static news data based on the four initiatives
const newsData = [
  {
    id: 1,
    title: "OPERATION CLEAN VICTORIA",
    date: "March 15, 2026",
    read_time: "5 min read",
    views: 1247,
    likes: 342,
    image: eventa,
    excerpt: "A comprehensive initiative restoring Lake Victoria by removing invasive weeds, plastic wastes, and industrial debris to ensure water quality and aquatic health.",
    content: `Lake Victoria, Africa's largest freshwater lake, has been choking under the weight of water hyacinth, plastic pollution, and industrial runoff for decades. Operation Clean Victoria is changing that narrative.

Launched in early 2025, this ambitious initiative has already removed over 450 tons of invasive water hyacinth from critical waterways near Mwanza, Kisumu, and Entebbe. Working with local fishing communities, the operation deploys specialized harvesting boats that cut, collect, and transport the weeds to processing centers where they are converted into biogas and organic fertilizer.

Plastic waste is another major focus. Over 12,000 kilograms of plastic debris—bottles, fishing nets, and bags—have been extracted from the lake's surface using floating barriers and skimmer boats. The recovered plastics are sorted, cleaned, and sent to recycling partners who transform them into construction materials and household products.

Perhaps most critically, the initiative has identified 47 industrial discharge points around the lake. Through partnership with environmental regulators, 23 factories have installed preliminary wastewater treatment systems, significantly reducing the flow of heavy metals and chemical pollutants into the water.

The results are promising. Early water quality monitoring shows improved oxygen levels in previously hypoxic zones, and local fishermen report the return of native fish species to areas that were once barren. Operation Clean Victoria proves that with sustained effort and community involvement, even the most degraded ecosystems can begin to heal.`,
    key_highlights: [
      "450+ tons of invasive water hyacinth removed",
      "12,000+ kg of plastic waste extracted and recycled",
      "47 industrial discharge points identified and mapped",
      "23 factories now treating wastewater before release",
      "Return of native fish species observed in key zones"
    ]
  },
  {
    id: 2,
    title: "GREEN CORRIDORS & URBAN BLOOMS",
    date: "March 10, 2026",
    read_time: "4 min read",
    views: 892,
    likes: 267,
    image: eventb,
    excerpt: "Transforming city roadsides, roundabouts, and open spaces into vibrant habitats using native plants that require minimal water and maintenance.",
    content: `Cities across the region are turning grey to green. The Green Corridors & Urban Blooms initiative is landscaping road corridors, public roundabouts, and neglected open spaces with native flora that does more than just look beautiful.

Unlike traditional ornamental gardening that demands constant watering, fertilizing, and mowing, this approach uses indigenous plants adapted to local rainfall patterns and soil conditions. Species like African tulip trees, desert roses, and native grasses thrive with minimal intervention while providing essential habitat for urban wildlife.

The results are striking. In the capital city alone, 14 major roundabouts have been transformed into mini-ecosystems. Bee populations have increased by an estimated 40% in these areas, and residents report seeing butterflies, birds, and beneficial insects where once there was only concrete and exhaust.

Road corridors now function as wildlife highways, connecting isolated parks and green spaces. The deep root systems of native grasses and shrubs also capture stormwater runoff, reducing flooding and filtering pollutants before they reach waterways.

Maintenance costs have dropped significantly—some sites require mowing only twice per year compared to monthly for traditional turf. The initiative is now expanding to school grounds, hospital campuses, and industrial parks, proving that sustainability and beauty can go hand in hand.`,
    key_highlights: [
      "14 major roundabouts transformed into native plant habitats",
      "40% increase in urban bee populations observed",
      "70% reduction in watering requirements vs ornamental gardens",
      "Stormwater capture improved by 35% along planted corridors",
      "Maintenance costs reduced by 60% annually"
    ]
  },
  {
    id: 3,
    title: "SOLAR-AGRI EMPOWERMENT",
    date: "March 5, 2026",
    read_time: "6 min read",
    views: 1567,
    likes: 489,
    image: eventc,
    excerpt: "Smallholder farmers gain energy independence with solar-powered irrigation, enabling year-round growing seasons and protection against drought.",
    content: `For generations, smallholder farmers in rural communities have lived at the mercy of unpredictable rainfall. A late monsoon or an early dry spell could mean total crop failure and months of hunger. The Solar-Agri Empowerment initiative is breaking that cycle.

Through a combination of subsidized solar pump systems, hands-on training, and microfinance options, over 800 farming households have gained access to reliable, fossil-fuel-free irrigation. Solar panels power water pumps that draw from wells, rivers, and ponds, delivering consistent moisture to crops even during extended dry periods.

The impact on food security has been transformative. Farmers who previously harvested once per year are now producing two or even three crop cycles annually. Maize yields have doubled, vegetable gardens produce year-round, and families no longer face the seasonal "hunger gap" between harvests.

Climate-smart agriculture training accompanies every solar installation. Farmers learn water-efficient techniques like drip irrigation, mulching to retain soil moisture, and crop rotation that preserves soil health. Many have also begun producing compost from crop residues, reducing the need for expensive chemical fertilizers.

The economic benefits ripple outward. Surplus produce is sold at local markets, generating income that families use for school fees, healthcare, and home improvements. Some villages have formed cooperatives to pool their harvests and negotiate better prices. One farmer put it simply: "Now I decide when to plant, not the sky."`,
    key_highlights: [
      "800+ farming households equipped with solar irrigation systems",
      "2-3 crop cycles per year vs 1 previously",
      "Maize yields increased by 100% on average",
      "Zero carbon emissions from irrigation",
      "Farmers report 70% reduction in seasonal food insecurity"
    ]
  },
  {
    id: 4,
    title: "YOUTH ENVIRONMENTAL STEWARDS",
    date: "February 28, 2026",
    read_time: "5 min read",
    views: 1134,
    likes: 421,
    image: eventd,
    excerpt: "Leadership training and innovation workshops in schools cultivate the next generation of environmental champions across primary, secondary, and tertiary institutions.",
    content: `The most sustainable environmental solution is the one that outlives its founders. That's the philosophy behind the Youth Environmental Stewards program, which is embedding environmental leadership into school curricula at every level.

In primary schools, children learn through hands-on activities: planting trees, maintaining school gardens, sorting waste for recycling, and conducting simple water quality tests. These foundational experiences create lifelong habits of environmental responsibility.

Secondary school students participate in leadership training that teaches them to identify local environmental problems, mobilize their peers, and run campaigns. Recent student-led projects include a plastic bottle collection drive that kept 5,000 bottles out of landfills, and a "green audit" of their school's energy and water use that led to 20% savings on utility bills.

At colleges and universities, innovation workshops challenge young people to design and prototype solutions using local materials. A student team recently developed a low-cost water filter made from charcoal and sand that removes 95% of sediment and bacteria. Another group created a biogas digester from recycled drums that turns cafeteria waste into cooking fuel.

The program has reached 45 schools and trained over 3,000 students as certified Environmental Stewards. Graduates have gone on to start green businesses, pursue environmental science degrees, and advocate for policy changes in their communities. They are not just learning about the environment—they are becoming its protectors.`,
    key_highlights: [
      "45 schools participating across the region",
      "3,000+ students trained as certified Environmental Stewards",
      "Student projects diverted 5,000+ plastic bottles from landfills",
      "School utility costs reduced by 20% through student-led audits",
      "3 student-designed innovations now being piloted for community use"
    ]
  },
  {
    id: 5,
    title: "ZERO WASTE COMMUNITIES",
    date: "February 20, 2026",
    read_time: "4 min read",
    views: 978,
    likes: 312,
    image: evente,
    excerpt: "Neighborhoods across the region are adopting zero-waste practices, turning trash into resources and reducing landfill pressure.",
    content: `The concept of "waste" is being redefined in communities embracing the Zero Waste Initiative. What was once thrown away is now seen as a resource awaiting transformation.

In pilot neighborhoods, residents have been trained to separate waste into organic, recyclable, and residual streams. Organic waste—food scraps, yard trimmings—goes to community composting sites that produce rich soil for gardens and tree planting. Recyclables like plastics, glass, and metals are collected by local cooperatives and sold to recycling facilities, creating income for participating families.

The results are measurable. Participating households have reduced their waste sent to landfills by an average of 65%. Community composting has produced over 12 tons of organic fertilizer used in school and home gardens. And the recycling program has generated over $8,000 in collective income for waste pickers who were previously working in unsafe, informal conditions.

The initiative is now expanding to include "repair cafes" where residents learn to fix broken appliances and clothing instead of discarding them, and bulk-buying cooperatives that reduce packaging waste. Zero waste is proving that environmental action can also be economic opportunity.`,
    key_highlights: [
      "65% average reduction in landfill waste per household",
      "12+ tons of compost produced from organic waste",
      "$8,000+ income generated for waste picker cooperatives",
      "3 community repair cafes established",
      "Model expanding to 15 additional neighborhoods"
    ]
  },
  {
    id: 6,
    title: "CLIMATE TECH BOOTCAMP",
    date: "February 12, 2026",
    read_time: "3 min read",
    views: 2103,
    likes: 567,
    image: eventf,
    excerpt: "Young technologists learn to build climate solutions—from air quality sensors to smart irrigation controllers—in an intensive hands-on program.",
    content: `Technology and environmental action are converging at the Climate Tech Bootcamp, where young innovators learn to build tools that address pressing environmental challenges.

The intensive 8-week program combines coding, electronics, and environmental science. Participants learn to assemble air quality monitors using low-cost sensors, program automated irrigation controllers, and build mobile apps for citizen science data collection.

Graduates have gone on to launch startups: one team created a smart composter that uses temperature sensors to optimize decomposition; another developed a blockchain-based system for tracking plastic recycling credits. Several alumni now work with environmental agencies, helping to modernize data collection and analysis.

The bootcamp emphasizes accessible, repairable technology—no expensive proprietary components. All designs are open-source, allowing communities to adapt and improve them locally. This democratization of climate tech ensures that solutions are not just invented but owned by the communities that use them.`,
    key_highlights: [
      "150+ young technologists trained",
      "8 climate-tech prototypes developed",
      "5 startups launched by program graduates",
      "All designs released as open-source",
      "75% of graduates now working in climate-related fields"
    ]
  },
  {
    id: 7,
    title: "URBAN VERTICAL FARMING",
    date: "February 5, 2026",
    read_time: "4 min read",
    views: 845,
    likes: 234,
    image: eventg,
    excerpt: "Empty walls and rooftops become food-producing gardens, bringing fresh vegetables to crowded city neighborhoods.",
    content: `In dense urban areas where land is scarce and expensive, traditional farming is impossible. Vertical farming offers a solution: growing food upwards instead of outwards.

The Urban Vertical Farming initiative has transformed abandoned walls, building facades, and rooftop spaces into productive gardens. Using hydroponic towers and pocket planters, residents grow leafy greens, herbs, and even small vegetables in spaces as small as a balcony.

Each tower uses 90% less water than conventional soil farming and produces harvests in half the time. No soil contamination is a concern because plants grow in nutrient-rich water solutions, making vertical farms ideal for former industrial areas where soil may be polluted.

Community members—often women and youth—are trained to maintain the systems and sell the produce at local markets. One project on the roof of a public market now supplies fresh lettuce and herbs to vendors downstairs, eliminating transport costs and ensuring maximum freshness.

Vertical farming is proving that even the most concrete-bound neighborhoods can be food-secure.`,
    key_highlights: [
      "35 vertical farming systems installed",
      "90% less water than conventional farming",
      "50% faster crop cycles",
      "200+ urban farmers trained",
      "Fresh produce now available in 12 food-desert neighborhoods"
    ]
  },
  {
    id: 8,
    title: "GREEN ENERGY SOLUTIONS",
    date: "January 28, 2026",
    read_time: "5 min read",
    views: 1432,
    likes: 398,
    image: eventh,
    excerpt: "Rural communities gain access to clean, affordable energy through solar micro-grids and improved cookstoves.",
    content: `Energy poverty and environmental degradation are linked. Communities without electricity burn kerosene for light and charcoal for cooking—both expensive and highly polluting. Green Energy Solutions is breaking that link.

Solar micro-grids now power entire village clusters, providing clean electricity for lighting, phone charging, and small businesses. Each system is managed by a local cooperative that collects small fees for maintenance, ensuring long-term sustainability.

Improved cookstoves reduce charcoal consumption by 60% and cut indoor air pollution by 80%. Women report fewer respiratory illnesses and less time gathering fuelwood—time now spent on income-generating activities.

The environmental benefits are clear: deforestation rates have slowed, and carbon emissions have dropped significantly. Families save money on fuel and electricity, money that goes to food, school fees, and healthcare. Clean energy is proving to be a catalyst for broader community development.`,
    key_highlights: [
      "12 solar micro-grids installed",
      "1,500 households now have clean electricity",
      "3,000 improved cookstoves distributed",
      "60% reduction in charcoal use per household",
      "80% reduction in indoor air pollution"
    ]
  },
  {
    id: 9,
    title: "YOUTH ENTREPRENEURSHIP PROGRAM",
    date: "January 20, 2026",
    read_time: "4 min read",
    views: 1102,
    likes: 445,
    image: eventi,
    excerpt: "Young environmental entrepreneurs receive mentorship, seed funding, and business training to turn green ideas into sustainable enterprises.",
    content: `Good environmental ideas need good business plans to survive. The Youth Entrepreneurship Program bridges that gap, helping young people turn their environmental innovations into viable enterprises.

Participants receive 12 weeks of business training covering market analysis, financial management, marketing, and impact measurement. Each participant is matched with an experienced mentor from their sector—solar energy, waste management, sustainable agriculture, or eco-tourism.

At the end of the program, participants pitch their business plans for seed funding. Past winners have launched a solar phone-charging kiosk network, a composting service for restaurants, and a line of bags made from recycled billboard vinyl.

The program emphasizes that environmental action can be economically self-sustaining. A project that pays for itself lasts longer than one dependent on donations.`,
    key_highlights: [
      "250 young entrepreneurs trained",
      "35 new green businesses launched",
      "80% of businesses still operating after 2 years",
      "$50,000 in seed funding distributed",
      "150+ jobs created across green sectors"
    ]
  },
  {
    id: 10,
    title: "CLIMATE ADVOCACY TRAINING",
    date: "January 15, 2026",
    read_time: "3 min read",
    views: 967,
    likes: 301,
    image: eventj,
    excerpt: "Citizens learn to advocate for climate action at local, regional, and national levels through strategic communication and coalition-building.",
    content: `Technical solutions alone cannot solve the climate crisis. Policy change is essential, and policy change requires skilled advocacy. The Climate Advocacy Training program equips citizens to be effective voices for environmental action.

Participants learn to analyze proposed policies, write position papers, meet with elected officials, organize public campaigns, and work with media. Role-playing exercises simulate legislative hearings and negotiation sessions, building confidence for real-world advocacy.

Graduates have successfully advocated for plastic bag bans, increased funding for public transit, and stricter industrial emissions standards. Several have been appointed to government environmental advisory committees. The program is building a network of informed, articulate advocates who can make the case for climate action in any room.`,
    key_highlights: [
      "500 advocates trained across 4 regions",
      "3 successful policy campaigns led by graduates",
      "12 graduates appointed to government advisory roles",
      "Network of 50+ partner organizations established",
      "Annual advocacy day now brings 1,000+ citizens to capital"
    ]
  },
  {
    id: 11,
    title: "COMMUNITY RECYCLING PROJECT",
    date: "January 8, 2026",
    read_time: "4 min read",
    views: 789,
    likes: 223,
    image: eventk,
    excerpt: "Neighborhood-based recycling hubs make it easy for residents to recycle while creating local jobs in waste management.",
    content: `Recycling works best when it is convenient. The Community Recycling Project establishes small, neighborhood-based collection hubs where residents can drop off sorted recyclables without traveling to distant facilities.

Each hub is staffed by local residents trained in sorting, cleaning, and basic recycling processes. Some hubs include small-scale equipment—baling machines, shredders, and plastic extruders—that process materials into semi-finished goods for sale to manufacturers.

The hubs accept plastics, glass, metals, paper, and electronics. Hazardous materials like batteries and paints are collected separately for safe disposal. Outreach workers visit nearby homes to provide training on sorting and to answer questions.

The project has created stable, dignified employment for over 100 people who previously worked as informal waste pickers. Hubs are managed by community cooperatives, ensuring that profits stay in the neighborhood.`,
    key_highlights: [
      "25 community recycling hubs established",
      "100+ formal jobs created in waste management",
      "500 tons of material processed annually",
      "90% resident satisfaction rate",
      "Model being replicated in 3 additional cities"
    ]
  },
  {
    id: 12,
    title: "VUMA PRESIDENT ON TECH LEADERSHIP",
    date: "January 5, 2026",
    read_time: "6 min read",
    views: 3456,
    likes: 892,
    image: eventl,
    excerpt: "An exclusive interview with VUMA's president on the role of technology in environmental restoration and the organization's five-year vision.",
    content: `In this exclusive interview, VUMA's President shares her vision for integrating technology into every aspect of environmental restoration, from satellite monitoring of deforestation to AI-powered waste sorting.

"The environmental challenges we face are unprecedented in scale," she explains. "Traditional methods alone cannot keep pace. Technology gives us leverage—the ability to monitor vast areas, predict problems before they become crises, and engage citizens in solutions."

She highlights the organization's investment in open-source environmental monitoring tools, citizen science platforms, and data literacy training. "We want communities to not just experience environmental problems but to measure them, understand them, and advocate for solutions based on evidence."

Looking ahead, she describes a five-year vision: a continent-wide network of environmental data hubs, a fellowship program for young climate technologists, and partnerships with universities to embed environmental data science into curricula.

"Technology is a tool, not a solution by itself," she concludes. "But when combined with community knowledge and political will, it is an extraordinarily powerful tool."`,
    key_highlights: [
      "Satellite monitoring now covers 80% of project areas",
      "AI-powered waste sorting pilot achieving 95% accuracy",
      "Open-source data platform launched with 50+ datasets",
      "500 citizens trained in data collection and analysis",
      "5-year vision includes 30 new technology hubs"
    ]
  }
];

const Blog = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewMoreHovered, setIsViewMoreHovered] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Custom alert states
  const [customAlert, setCustomAlert] = useState({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  const showAlert = (type, title, message) => {
    setCustomAlert({
      show: true,
      type,
      title,
      message
    });
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

  const getNewsImage = (newsItem) => {
    return newsItem.image;
  };

  const displayedNews = newsData.slice(0, visibleCount);
  const hasMore = visibleCount < newsData.length;

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 3, newsData.length));
      setIsLoading(false);
    }, 500);
  };

  const openModal = (newsItem) => {
    setSelectedNews(newsItem);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNews(null);
    document.body.style.overflow = 'unset';
  };

  const handleSubscribe = () => {
    showAlert('success', 'Thank You!', 'Thanks for subscribing to our newsletter!');
  };

  return (
    <>
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
                  <i className="fas fa-check" style={{ fontSize: '2rem', color: 'white' }}></i>
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
            
            <h3 style={{
              color: customAlert.type === 'error' ? '#d32f2f' : '#0B3B2F',
              marginBottom: '0.5rem',
              fontSize: '1.5rem'
            }}>
              {customAlert.title}
            </h3>
            
            <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              {customAlert.message}
            </p>
            
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

      <h2 className="section-title" style={{
        textAlign: 'center',
        fontSize: 'clamp(1.5rem, 5vw, 2rem)',
        fontWeight: 800,
        margin: '2rem 0 1rem',
        background: 'linear-gradient(135deg, #0B3B2F, #2b7a5c)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        animation: 'fadeInDown 0.8s ease',
        padding: '0 1rem'
      }}>
        News & Stories
      </h2>
      
      <div className="blog-grid" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1.5rem',
        padding: '1rem'
      }}>
        {displayedNews.map((item, idx) => (
          <BlogCard key={item.id} news={item} index={idx} onCardClick={() => openModal(item)} getNewsImage={getNewsImage} />
        ))}
      </div>

      {/* View More Button */}
      {hasMore && (
        <div style={{
          textAlign: 'center',
          marginTop: '2.5rem',
          marginBottom: '2rem',
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <button 
              className="btn-view-more"
              onClick={loadMore}
              disabled={isLoading}
              onMouseEnter={() => setIsViewMoreHovered(true)}
              onMouseLeave={() => setIsViewMoreHovered(false)}
              style={{
                background: isLoading ? '#0B3B2F' : '#F9C74F',
                border: 'none',
                padding: '0.7rem 1.5rem',
                borderRadius: '60px',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontSize: 'clamp(0.8rem, 3.5vw, 1rem)',
                width: '50%',
                minWidth: '160px',
                color: isLoading ? 'white' : '#1a3a2a',
                opacity: isLoading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.8rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <span style={{
                transition: 'transform 0.3s ease'
              }}>
                {isLoading ? 'Loading...' : 'View More Stories'}
              </span>
              <div style={{
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {isLoading ? (
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                ) : (
                  <i className="fas fa-arrow-right" style={{
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isViewMoreHovered ? 'translateX(8px)' : 'translateX(0)',
                    animation: isViewMoreHovered ? 'none' : 'bounceArrow 1.5s ease-in-out infinite'
                  }}></i>
                )}
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Show all message */}
      {!hasMore && newsData.length > 3 && (
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          marginBottom: '2rem',
          padding: '0.8rem 1rem',
          color: '#666',
          fontSize: 'clamp(0.8rem, 3.5vw, 0.9rem)',
          background: 'rgba(249,199,79,0.1)',
          borderRadius: '60px',
          maxWidth: '300px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <i className="fas fa-check-circle" style={{ color: '#F9C74F', marginRight: '0.5rem' }}></i>
          You've seen all {newsData.length} amazing stories!
        </div>
      )}

      {/* News Modal */}
      {showModal && selectedNews && (
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
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
            >
              <i className="fas fa-times"></i>
            </button>

            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
              <img 
                src={getNewsImage(selectedNews)} 
                alt={selectedNews.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                }}
              />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))' }} />
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', zIndex: 10 }}>
                <span style={{
                  display: 'inline-block',
                  background: '#F9C74F',
                  color: '#0B3B2F',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem'
                }}>
                  LATEST STORY
                </span>
                <h2 style={{ color: 'white', margin: 0, fontSize: 'clamp(1.3rem, 5vw, 1.8rem)' }}>{selectedNews.title}</h2>
              </div>
            </div>

            <div style={{ padding: 'clamp(1.5rem, 5vw, 2rem)' }}>
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
                  {selectedNews.date}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                  <i className="far fa-clock" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                  {selectedNews.read_time}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                  <i className="far fa-eye" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                  {selectedNews.views} views
                </span>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                  <i className="fas fa-heart" style={{ marginRight: '0.3rem', color: '#F9C74F' }}></i>
                  {selectedNews.likes} likes
                </span>
              </div>

              {/* Key Highlights */}
              {selectedNews.key_highlights && selectedNews.key_highlights.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem' }}>
                    <i className="fas fa-star" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                    Key Highlights
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {selectedNews.key_highlights.map((highlight, idx) => (
                      <li key={idx} style={{
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

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0B3B2F', marginBottom: '0.8rem', fontSize: '1.1rem' }}>
                  <i className="fas fa-info-circle" style={{ marginRight: '0.5rem', color: '#F9C74F' }}></i>
                  Full Story
                </h3>
                <div style={{ color: '#555', lineHeight: '1.8', fontSize: '0.95rem' }}>
                  {selectedNews.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} style={{ marginBottom: '1rem' }}>{paragraph}</p>
                  ))}
                </div>
              </div>

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
                  onClick={handleSubscribe}
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
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounceArrow {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5px);
          }
        }
        
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
          .btn-view-more {
            min-width: 140px !important;
            padding: 0.6rem 1.2rem !important;
          }
          
          .btn-view-more span {
            font-size: 0.85rem !important;
          }
          
          .modal-content {
            max-height: 90vh;
          }
          
          .modal-content > div:first-child {
            height: 180px;
          }
        }
        
        @media (max-width: 480px) {
          .btn-view-more {
            min-width: 120px !important;
            padding: 0.5rem 1rem !important;
          }
          
          .btn-view-more span {
            font-size: 0.75rem !important;
          }
          
          .fa-arrow-right {
            font-size: 0.7rem !important;
          }
          
          .modal-content {
            border-radius: 20px !important;
          }
        }
      `}</style>
    </>
  );
};

// Blog Card Component
const BlogCard = ({ news, index, onCardClick, getNewsImage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
          }
        });
      },
      {
        threshold: window.innerWidth < 768 ? 0.1 : 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [hasAnimated]);

  React.useEffect(() => {
    const img = new Image();
    img.src = getNewsImage(news);
    img.onload = () => setImageLoaded(true);
  }, [news, getNewsImage]);

  const getAnimationStyle = () => {
    if (!isVisible) {
      const animations = ['fadeInUp', 'zoomIn', 'slideInLeft', 'slideInRight'];
      const animationIndex = index % animations.length;
      switch (animations[animationIndex]) {
        case 'fadeInUp':
          return { animation: 'fadeInUp 0.6s ease forwards' };
        case 'zoomIn':
          return { animation: 'zoomIn 0.6s ease forwards' };
        case 'slideInLeft':
          return { animation: 'slideInLeft 0.6s ease forwards' };
        case 'slideInRight':
          return { animation: 'slideInRight 0.6s ease forwards' };
        default:
          return { animation: 'fadeInUp 0.6s ease forwards' };
      }
    }
    return { animation: 'none' };
  };

  return (
    <div
      ref={cardRef}
      className="blog-card"
      style={{
        width: '280px',
        background: 'white',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 12px 25px rgba(0,0,0,0.05)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
        ...getAnimationStyle()
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        if (isVisible) {
          e.currentTarget.style.transform = 'translateY(0)';
        }
        e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.05)';
      }}
      onClick={() => onCardClick(news)}
    >
      <div style={{
        height: '180px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f0f0f0'
      }}>
        {!imageLoaded && (
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
          src={getNewsImage(news)}
          alt={news.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'scale(1)',
            opacity: imageLoaded ? 1 : 0
          }}
          className="blog-image"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(11, 59, 47, 0.9)',
          color: '#F9C74F',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          backdropFilter: 'blur(4px)',
          zIndex: 1,
          transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
          transition: `transform 0.4s ease ${index * 0.1 + 0.2}s`
        }}>
          <i className="fas fa-calendar-alt" style={{ marginRight: '4px', fontSize: '0.6rem' }}></i>
          {news.date.split(' ')[0]}
        </div>
        
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: '#F9C74F',
          color: '#0B3B2F',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.65rem',
          fontWeight: 'bold',
          zIndex: 1,
          transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
          transition: `transform 0.4s ease ${index * 0.1 + 0.3}s`
        }}>
          <i className="fas fa-newspaper" style={{ marginRight: '4px' }}></i>
          LATEST NEWS
        </div>
      </div>
      
      <div style={{ padding: '1.2rem', background: 'white', position: 'relative' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          marginBottom: '0.8rem',
          fontSize: '0.7rem',
          color: '#666',
          flexWrap: 'wrap'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <i className="far fa-calendar" style={{ color: '#F9C74F' }}></i>
            {news.date}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <i className="far fa-clock" style={{ color: '#F9C74F' }}></i>
            {news.read_time}
          </span>
        </div>
        
        <h4 style={{
          marginTop: '0',
          marginBottom: '0.8rem',
          fontSize: '1.1rem',
          fontWeight: 700,
          color: '#0B3B2F',
          lineHeight: '1.4',
          transition: 'color 0.3s ease'
        }}
        className="blog-title">
          {news.title}
        </h4>
        
        <p style={{
          fontSize: '0.8rem',
          color: '#666',
          lineHeight: '1.5',
          marginBottom: '1rem'
        }}>
          {news.excerpt}
        </p>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #f0f0f0',
          paddingTop: '0.8rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#F9C74F',
            fontSize: '0.8rem',
            fontWeight: 600
          }}>
            <i className="fas fa-eye"></i>
            <span>Click to read full story</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }
        
        .blog-image {
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .blog-card:hover .blog-image {
          transform: scale(1.1);
        }
        
        .blog-title:hover {
          color: #F9C74F !important;
        }
        
        @media (max-width: 768px) {
          .blog-card {
            width: calc(50% - 0.75rem) !important;
            min-width: 160px;
          }
          
          .blog-card:hover {
            transform: translateY(-4px) !important;
          }
          
          .blog-card div:first-child {
            height: 150px !important;
          }
          
          .blog-card h4 {
            font-size: 0.9rem !important;
          }
          
          .blog-card p {
            font-size: 0.7rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .blog-card {
            width: 100% !important;
            max-width: 320px;
            margin: 0 auto;
          }
          
          .blog-card div:first-child {
            height: 200px !important;
          }
          
          .blog-card h4 {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Blog;