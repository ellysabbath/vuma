// Import local images from assets folder (K to O)
import eventk from './assets/eventk.jpg';
import eventl from './assets/eventl.jpg';
import eventm from './assets/eventm.jpg';
import eventn from './assets/eventn.jpg';
import evento from './assets/evento.jpg';

// Import blog post images from local assets
import blog1 from './assets/event.jpg';
import blog2 from './assets/eventc.jpg';
import blog3 from './assets/eventd.jpg';

// Import leader images from local assets
import leader1 from './assets/eventm.jpg';
import leader2 from './assets/eventf.jpg';
import leader3 from './assets/eventg.jpg';

export const projects = [
  { 
    title: "Solar-Powered Water Pump", 
    cat: "environment", 
    img: eventk,
    description: "Sustainable water solution for rural communities"
  },
  { 
    title: "Youth Leadership Academy", 
    cat: "leadership", 
    img: eventl,
    description: "Empowering next generation of African leaders"
  },
  { 
    title: "Plastic Upcycling Hub", 
    cat: "environment", 
    img: eventm,
    description: "Turning waste into valuable products"
  },
  { 
    title: "Policy Innovators Fellowship", 
    cat: "leadership", 
    img: eventn,
    description: "Shaping tomorrow's environmental policies"
  },
  { 
    title: "Urban Vertical Farming", 
    cat: "environment", 
    img: evento,
    description: "Innovative food production in city spaces"
  },
  { 
    title: "Climate Tech Bootcamp", 
    cat: "leadership", 
    img: eventk,
    description: "Tech skills for climate solutions"
  }
];

export const testimonials = [
  {
    text: "VUMA turned my green startup idea into a funded project. Most impactful youth hub in Tanzania.",
    author: "Neema J., Innovator"
  },
  {
    text: "The leadership workshops gave me tools to mobilize 100+ students for climate action.",
    author: "David M., Volunteer"
  },
  {
    text: "Partnering with VUMA aligns with the Vice President's Office goal of youth empowerment.",
    author: "Government Rep."
  }
];

export const timelineEvents = [
  { date: "May 30, 2026", title: "Youth Leadership Bootcamp (Online)", icon: "fa-chalkboard-user", type: "Online" },
  { date: "June 5, 2026", title: "World Environment Day – Tree Planting Drive", icon: "fa-leaf", type: "In-Person" },
  { date: "June 12, 2026", title: "Climate Policy Webinar with Experts", icon: "fa-microphone-alt", type: "Webinar" }
];

export const blogPosts = [
  {
    title: "VUMA Launches Green Innovation Fund",
    date: "May 20, 2026",
    readTime: "4 min read",
    img: blog1
  },
  {
    title: "Leadership Summit 2026 Recap",
    date: "May 15, 2026",
    readTime: "6 min read",
    img: blog2
  },
  {
    title: "Partnering with UNDP for Climate Action",
    date: "May 10, 2026",
    readTime: "3 min read",
    img: blog3
  }
];

export const leaders = [
  { name: "Dr. Esther M.", role: "Executive Director", img: leader1, linkedin: "#", twitter: "#" },
  { name: "James Omondi", role: "Head of Innovation", img: leader2, linkedin: "#", twitter: "#" },
  { name: "Grace Kimathi", role: "Environment Lead", img: leader3, linkedin: "#", twitter: "#" }
];