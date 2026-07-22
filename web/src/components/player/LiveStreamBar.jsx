import { useEffect, useRef, useState } from 'react';
import { usePlayerContext } from '../../context/PlayerContext';
import { useOnAirNow } from '../../hooks/useOnAirNow';
import './LiveStreamBar.css';

export function LiveStreamBar() {
  const { live } = usePlayerContext();
  const [docked, setDocked] = useState(false);
  const barRef = useRef(null);
  const onAir = useOnAirNow();

  useEffect(() => {
    const footer = document.getElementById('footer');
    if (!footer) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setDocked(entry.isIntersecting),
      { rootMargin: '0px 0px 0px 0px', threshold: 0 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const label =
    live.status === 'playing' ? 'Pause' : live.status === 'loading' ? 'Loading' : 'Play';
  const icon = live.status === 'playing' ? '⏸' : live.status === 'loading' ? '⏳' : '▶';

  return (
    <div ref={barRef} className={`live-bar ${docked ? 'live-bar--docked' : ''}`} aria-label="Live radio player">
      <div className="live-bar__inner container">
        <div className="live-bar__brand">
          <img src="/logo.png" alt="" className="live-bar__logo" />
          <div className="live-bar__brand-text">
            <span className="live-bar__title">Vanakkam FM</span>
            {onAir ? (
              <span className="live-bar__onair">
                <span className="live-bar__pulse" />
                On air now — {onAir.name}
              </span>
            ) : (
              <span className="live-bar__onair live-bar__onair--muted">104.9 HD2 · Live 24/7</span>
            )}
          </div>
        </div>

        <div className="live-bar__actions">
          <button
            type="button"
            className={`live-bar__play ${live.status === 'playing' ? 'live-bar__play--active' : ''}`}
            onClick={live.toggle}
            aria-label={label}
          >
            <span className="live-bar__play-icon">{icon}</span>
            <span>{label}</span>
          </button>
          <a href="tel:+19123456789" className="live-bar__action">
            Call Studio
          </a>
          <a href="tel:+19123456789" className="live-bar__action live-bar__action--hide-sm">
            Call Sales
          </a>
        </div>
      </div>
    </div>
  );
}
