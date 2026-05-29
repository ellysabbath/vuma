import React, { useEffect, useRef, useState } from 'react';

const Counter = ({ target, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const increment = target / 60;
          const update = () => {
            start += increment;
            if (start < target) {
              setCount(Math.floor(start));
              requestAnimationFrame(update);
            } else {
              setCount(target);
            }
          };
          update();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div className="counter-item" ref={ref} style={{
      flex: 1,
      minWidth: 160,
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(4px)',
      borderRadius: 32,
      padding: '1.2rem',
      textAlign: 'center'
    }}>
      <div className="counter-number" style={{ fontSize: '2.5rem', fontWeight: 800, color: '#F9C74F' }}>
        {count.toLocaleString()}
      </div>
      <div className="counter-label" style={{ fontSize: '0.9rem' }}>{label}</div>
    </div>
  );
};

const ImpactCounters = () => {
  const counters = [
    { target: 12480, label: 'YOUTH REACHED' },
    { target: 18750, label: 'TREES PLANTED' },
    { target: 742, label: 'IDEAS GENERATED' },
    { target: 435, label: 'ACTIVE VOLUNTEERS' }
  ];

  return (
    <div className="impact-section" data-aos="fade-up" style={{
      background: 'linear-gradient(120deg, #0a3b2e, #0c4d3a)',
      padding: '3rem 1.5rem'
    }}>
      <div className="counter-grid" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1.2rem',
        maxWidth: 1000,
        margin: 'auto'
      }}>
        {counters.map((counter, idx) => (
          <Counter key={idx} target={counter.target} label={counter.label} />
        ))}
      </div>
    </div>
  );
};

export default ImpactCounters;