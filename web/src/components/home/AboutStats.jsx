import { useEffect, useRef, useState } from 'react';
import './AboutStats.css';

const STATS = [
  { label: 'Expert RJs', value: 10 },
  { label: 'Hours Live', value: 24 },
  { label: 'Countries Reached', value: 12 },
];

function Counter({ value }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 1600;
          const start = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - (1 - progress) ** 3;
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span className="stat-number" ref={ref}>
      {count}
    </span>
  );
}

export function AboutStats() {
  return (
    <section className="about-section" id="about">
      <div className="container about-grid">
        <div className="about-text">
          <span className="section-tag">Our Story</span>
          <h2>
            About <span className="highlight">Us</span>
          </h2>
          <p>
            Vanakkam FM was created with one simple mission: to keep the Tamil heartbeat alive — through music,
            voices, and stories that feel like home. Built in Dallas and broadcast proudly on 104.9 HD2, we're here
            to connect Tamilians across the U.S. and around the world with the sound of our culture.
          </p>
          <p>
            What truly makes Vanakkam FM special is our people. Our talented Radio Jockeys are live 24/7, bringing
            energy, warmth, and real connection to every show — creating a listening experience that's entertaining,
            meaningful, and community-driven.
          </p>
          <p>
            No matter where you're listening from — Chennai, Toronto, Singapore, London, or right here in Texas —
            Vanakkam FM is your daily companion and your direct link to Tamil music, culture, and community.
          </p>

          <div className="about-stats">
            {STATS.map((stat) => (
              <div className="stat-item" key={stat.label}>
                <Counter value={stat.value} />
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="about-visual" aria-hidden="true">
          <div className="about-img about-img--1" style={{ backgroundImage: 'url(/rj/janani.jpg)' }} />
          <div className="about-img about-img--2" style={{ backgroundImage: 'url(/rj/lucky.jpg)' }} />
          <div className="about-img about-img--3">104.9<span>HD2</span></div>
        </div>
      </div>
    </section>
  );
}
