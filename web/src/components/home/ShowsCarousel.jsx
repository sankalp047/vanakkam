import { useCallback, useEffect, useRef, useState } from 'react';
import { RJ_ROSTER } from '../../lib/rjRoster';
import './ShowsCarousel.css';

export function ShowsCarousel() {
  const trackRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);
  const dotCount = RJ_ROSTER.length;

  const updateActiveDot = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('.show-card');
    if (!card) return;
    const cardWidth = card.offsetWidth + 24;
    setActiveDot(Math.round(track.scrollLeft / cardWidth));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    track.addEventListener('scroll', updateActiveDot, { passive: true });
    return () => track.removeEventListener('scroll', updateActiveDot);
  }, [updateActiveDot]);

  const scrollByCards = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('.show-card');
    const cardWidth = card ? card.offsetWidth + 24 : 300;
    track.scrollBy({ left: direction * cardWidth * 2, behavior: 'smooth' });
  };

  const goToDot = (index) => {
    const track = trackRef.current;
    const card = track?.querySelector('.show-card');
    if (!track || !card) return;
    const cardWidth = card.offsetWidth + 24;
    track.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
  };

  return (
    <section className="shows-section" id="shows">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Our Programs</span>
          <h2>
            Featured <span className="highlight">Shows</span>
          </h2>
          <p className="section-desc">
            Discover our handpicked selection of programs bringing you the best of Tamil entertainment, music, and
            culture — hosted live by our Radio Jockeys.
          </p>
        </div>

        <div className="shows-carousel">
          <div className="show-track" ref={trackRef}>
            {RJ_ROSTER.map((rj) => (
              <article className="show-card" key={rj.slug}>
                <div className="show-card__image" style={{ backgroundImage: `url(${rj.image})` }}>
                  <div className="show-card__overlay">
                    <span className="show-card__time">{rj.time}</span>
                    <h3 className="show-card__title">{rj.name}</h3>
                    <p className="show-card__host">{rj.show}</p>
                    <span className="show-card__days">{rj.days}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button type="button" className="shows-carousel__nav shows-carousel__nav--prev" onClick={() => scrollByCards(-1)} aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button type="button" className="shows-carousel__nav shows-carousel__nav--next" onClick={() => scrollByCards(1)} aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="shows-carousel__dots">
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`shows-carousel__dot ${i === activeDot ? 'shows-carousel__dot--active' : ''}`}
              aria-label={`Go to show ${i + 1}`}
              onClick={() => goToDot(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
