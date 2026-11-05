import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { usePlayerContext } from '../../context/PlayerContext';
import { useOnAirNow } from '../../hooks/useOnAirNow';
import { useRoster } from '../../hooks/useRoster';
import './Hero.css';

gsap.registerPlugin(useGSAP);

export function Hero() {
  const { live } = usePlayerContext();
  const onAir = useOnAirNow();
  const { roster } = useRoster();
  const rootRef = useRef(null);

  useGSAP(
    () => {
      gsap.from('.hero__reveal', {
        opacity: 0,
        y: 28,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
      });
      gsap.from('.hero__feature', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.2,
      });
    },
    { scope: rootRef },
  );

  const feature = onAir || roster[0];
  const isPlaying = live.status === 'playing';

  return (
    <section className="hero" ref={rootRef}>
      <div className="container hero__grid">
        <div className="hero__intro">
          <span className="hero__kicker hero__reveal">Now Broadcasting · 104.9 HD2 · Dallas–Fort Worth</span>
          <h1 className="hero__title hero__reveal">
            Vanakkam<span className="hero__title-fm">FM</span>
          </h1>
          <p className="hero__tagline hero__reveal serif">
            America's №1 Tamil radio — live RJs, nonstop hits, and culture that feels like home.
          </p>
          <p className="hero__tamil hero__reveal">டாலஸை தலைமையிடமாகக் கொண்ட அமெரிக்காவின் நம்பர் 1 தமிழ் ரேடியோ</p>

          <div className="hero__actions hero__reveal">
            <button type="button" className="btn btn-primary" onClick={live.toggle}>
              {isPlaying ? '❚❚ Playing Live' : '▶ Listen Live'}
            </button>
            <a href="#shows" className="btn btn-secondary">
              Explore Shows
            </a>
          </div>
        </div>

        <button
          type="button"
          className="hero__feature"
          onClick={live.toggle}
          aria-label={`Listen live — ${feature.show} with ${feature.name}, ${feature.time}`}
        >
          <div className="hero__feature-image" style={{ backgroundImage: `url(${feature.image})` }}>
            <span className="hero__feature-badge">
              <span className="hero__feature-dot" />
              {onAir ? 'On Air Now' : 'Up Next'}
            </span>
            {/* Show name, host and times are already printed on the poster
                artwork — only the play affordance is added here. */}
            <div className="hero__feature-overlay">
              <span className="hero__feature-play">{isPlaying ? '❚❚ Playing' : '▶ Tune In'}</span>
            </div>
          </div>
        </button>
      </div>
    </section>
  );
}
