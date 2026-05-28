import React, { useState, useEffect } from 'react';

const EventCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(2026, 5, 15, 9, 0, 0);
      const diff = target - new Date();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (86400000)) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000)
      });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="event-highlight" data-aos="zoom-in" style={{
      background: 'linear-gradient(125deg, #123e30, #0e553f)',
      margin: '2rem 1rem',
      borderRadius: 40,
      padding: '1.5rem',
      color: 'white',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div>
        <h2>🌍 VUMA Climate Innovation Summit</h2>
        <p>Dodoma | June 15-17, 2026</p>
      </div>
      <div className="countdown" style={{
        fontSize: '1.6rem',
        fontWeight: 800,
        background: 'rgba(0,0,0,0.4)',
        padding: '0.4rem 1.2rem',
        borderRadius: 50
      }}>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.mins}m
      </div>
    </div>
  );
};

export default EventCountdown;