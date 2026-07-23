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
const WAVE_MS = 1000;
const WIDE_QUERY = '(min-width: 700px)';

// A tall wavy vertical band (sine edges) — three copies sweep across the box.
const WAVE_BAND =
  'M15,-8 C3,14 27,22 15,38 C3,54 27,62 15,78 C3,94 27,102 15,116 L35,116 C23,102 47,94 35,78 C23,62 47,54 35,38 C23,22 47,14 35,-8 Z';

// Drives both the image choice (16:9 vs 9:16) and the box shape off the same
// breakpoint as the CSS, so the two can never fall out of sync.
function useIsWide() {
  const [isWide, setIsWide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(WIDE_QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(WIDE_QUERY);
    const onChange = (e) => setIsWide(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isWide;
}

export function AdCarousel() {
  const { banners } = useSponsorBanners();
  const isWide = useIsWide();
  const slides = banners.length > 0 ? banners : PLACEHOLDER_SLIDES;

  const [index, setIndex] = useState(0);
  const [waving, setWaving] = useState(false);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const rotate = setInterval(() => {
      setWaving(true);
      // swap the image as the wave crosses the middle of the box
      setTimeout(() => setIndex((i) => (i + 1) % slides.length), Math.round(WAVE_MS * 0.48));
      setTimeout(() => setWaving(false), WAVE_MS);
    }, ROTATE_MS);
    return () => clearInterval(rotate);
  }, [slides.length]);

  // keep index in range if the banner set shrinks
  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [slides.length, index]);

  const slide = slides[index];
  const image = slide.placeholder
    ? null
    : (isWide ? slide.image16x9?.url : slide.image9x16?.url) || slide.image16x9?.url || slide.image9x16?.url;

  const inner = (
    <div className={`ad-box ${isWide ? 'ad-box--wide' : 'ad-box--tall'} ${waving ? 'ad-box--waving' : ''}`}>
      <span className="ad-box__tag">Ad</span>

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
        <svg viewBox="0 0 120 100" preserveAspectRatio="none">
          <path className="ad-wave__band ad-wave__band--1" d={WAVE_BAND} />
          <path className="ad-wave__band ad-wave__band--2" d={WAVE_BAND} />
          <path className="ad-wave__band ad-wave__band--3" d={WAVE_BAND} />
        </svg>
      </div>

      <div className="ad-box__dots">
        {slides.map((s, i) => (
          <span key={s.id} className={`ad-box__dot ${i === index ? 'ad-box__dot--active' : ''}`} />
        ))}
      </div>
    </div>
  );

  // Real banners link out to their sponsor; placeholders link to the
  // advertise/contact section so the slot is clickable even before any
  // banners exist.
  const href = slide.placeholder ? '#contact' : slide.linkUrl;
  const isExternal = !slide.placeholder && Boolean(slide.linkUrl);

  return (
    <section className="ad-carousel" aria-label="Sponsored">
      <div className="container ad-carousel__inner">
        {href ? (
          <a
            href={href}
            className="ad-carousel__link"
            {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer sponsored' } : {})}
          >
            {inner}
          </a>
        ) : (
          inner
        )}
      </div>
    </section>
  );
}
