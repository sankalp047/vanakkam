import { useEffect, useState } from 'react';
import { useSponsorBanners } from '../../hooks/useBanners';
import './AdCarousel.css';

// Shown when the station hasn't uploaded any banners yet, so the slot (and
// its wave transition) is visible/previewable. Real banners from the admin
// dashboard replace these automatically.
const PLACEHOLDER_SLIDES = [
  { id: 'ph-1', placeholder: true, title: 'Advertise with Vanakkam FM', subtitle: 'Reach thousands of Tamil listeners across DFW' },
  { id: 'ph-2', placeholder: true, title: 'Your Banner Here', subtitle: 'Manage sponsor ads from the admin dashboard' },
];

const ROTATE_MS = 5000;
const WAVE_MS = 850;

export function AdCarousel() {
  const { banners } = useSponsorBanners();
  const slides = banners.length > 0 ? banners : PLACEHOLDER_SLIDES;

  const [index, setIndex] = useState(0);
  const [waving, setWaving] = useState(false);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const rotate = setInterval(() => {
      setWaving(true);
      // swap the image while the wave covers the box
      setTimeout(() => setIndex((i) => (i + 1) % slides.length), WAVE_MS / 2);
      setTimeout(() => setWaving(false), WAVE_MS);
    }, ROTATE_MS);
    return () => clearInterval(rotate);
  }, [slides.length]);

  // keep index in range if the banner set shrinks
  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [slides.length, index]);

  const slide = slides[index];
  const image = slide.placeholder ? null : slide.image16x9?.url;

  const inner = (
    <div className={`ad-box ${waving ? 'ad-box--waving' : ''}`}>
      {image ? (
        <img src={image} alt={slide.title || 'Sponsor'} className="ad-box__img" />
      ) : (
        <div className="ad-box__placeholder">
          <span className="ad-box__ph-kicker">Sponsored</span>
          <span className="ad-box__ph-title">{slide.title}</span>
          <span className="ad-box__ph-sub">{slide.subtitle}</span>
        </div>
      )}

      <div className="ad-wave" aria-hidden="true">
        <svg viewBox="0 0 1200 300" preserveAspectRatio="none">
          <path className="ad-wave__path ad-wave__path--1" d="M0,150 C200,90 400,210 600,150 C800,90 1000,210 1200,150 L1200,300 L0,300 Z" />
          <path className="ad-wave__path ad-wave__path--2" d="M0,170 C200,110 400,230 600,170 C800,110 1000,230 1200,170 L1200,300 L0,300 Z" />
          <path className="ad-wave__path ad-wave__path--3" d="M0,190 C200,130 400,250 600,190 C800,130 1000,250 1200,190 L1200,300 L0,300 Z" />
        </svg>
      </div>

      <div className="ad-box__dots">
        {slides.map((s, i) => (
          <span key={s.id} className={`ad-box__dot ${i === index ? 'ad-box__dot--active' : ''}`} />
        ))}
      </div>
    </div>
  );

  return (
    <section className="ad-carousel" aria-label="Sponsored">
      <div className="container ad-carousel__inner">
        {slide.placeholder || !slide.linkUrl ? (
          inner
        ) : (
          <a href={slide.linkUrl} target="_blank" rel="noopener noreferrer sponsored" className="ad-carousel__link">
            {inner}
          </a>
        )}
      </div>
    </section>
  );
}
