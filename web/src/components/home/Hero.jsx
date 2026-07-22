import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { usePlayerContext } from '../../context/PlayerContext';
import './Hero.css';

gsap.registerPlugin(useGSAP);

export function Hero() {
  const { live } = usePlayerContext();
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to('.hero__subtitle', { opacity: 1, y: 0, duration: 0.7 })
        .to('.hero__title', { opacity: 1, y: 0, duration: 0.9 }, '-=0.45')
        .to('.hero__tagline', { opacity: 1, y: 0, duration: 0.7 }, '-=0.55')
        .to('.hero__description', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .to('.hero__actions', { opacity: 1, y: 0, duration: 0.7 }, '-=0.45')
        .to('.hero__visual', { opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(1.6)' }, '-=0.6');
    },
    { scope: rootRef },
  );

  const isPlaying = live.status === 'playing';

  return (
    <section className="hero" id="home" ref={rootRef}>
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__wave hero__wave--1" />
        <div className="hero__wave hero__wave--2" />
        <div className="hero__wave hero__wave--3" />
        <div className="hero__notes">
          <span>♪</span>
          <span>♫</span>
          <span>♪</span>
          <span>♫</span>
          <span>♪</span>
        </div>
      </div>

      <div className="hero__content container">
        <div className="hero__text">
          <p className="hero__subtitle">Welcome to</p>
          <h1 className="hero__title">
            Vanakkam <span className="gradient-text">FM</span>
          </h1>
          <p className="hero__tagline">டாலஸை தலைமையிடமாகக் கொண்ட அமெரிக்காவின் நம்பர் 1 தமிழ் ரேடியோ</p>
          <p className="hero__description">
            Your home for Tamil hits in Dallas–Fort Worth on 104.9 HD2. Live Radio Jockeys around the clock,
            round-the-clock music, and culture that feels like home.
          </p>

          <div className="hero__actions">
            <a href="#shows" className="btn btn-primary">
              <span>Explore Shows</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <button type="button" className="btn btn-secondary" onClick={live.toggle}>
              <span>{isPlaying ? '⏸' : '▶'}</span>
              <span>{isPlaying ? 'Pause Live' : 'Listen Live'}</span>
            </button>
          </div>
        </div>

        <div className="hero__visual">
          <div className={`hero__player-ring ${isPlaying ? 'hero__player-ring--active' : ''}`}>
            <div className="hero__player-ring-inner" />
            <div className="hero__player-ring-inner" />
            <div className="hero__player-ring-inner" />
            <div className="hero__player-center">
              <div className={`hero__equalizer ${isPlaying ? 'hero__equalizer--playing' : ''}`}>
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <p className="hero__now-playing">{isPlaying ? 'Now Playing' : 'Tap to Listen'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__scroll-indicator">
        <div className="hero__mouse">
          <div className="hero__wheel" />
        </div>
        <p>Scroll to explore</p>
      </div>
    </section>
  );
}
