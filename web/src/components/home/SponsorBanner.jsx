import { useEffect, useState } from 'react';
import { useSponsorBanners } from '../../hooks/useBanners';
import './SponsorBanner.css';

function useIsLandscape() {
  const [isLandscape, setIsLandscape] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(orientation: landscape)').matches,
  );

  useEffect(() => {
    const mql = window.matchMedia('(orientation: landscape)');
    const onChange = (e) => setIsLandscape(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isLandscape;
}

export function SponsorBanner() {
  const { banners } = useSponsorBanners();
  const isLandscape = useIsLandscape();

  if (banners.length === 0) return null;

  return (
    <section className="sponsor-banner" aria-label="Sponsors">
      <div className="container sponsor-banner__strip">
        {banners.map((banner) => {
          const image = isLandscape ? banner.image16x9 : banner.image9x16;
          if (!image?.url) return null;
          return (
            <a
              key={banner.id}
              href={banner.linkUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="sponsor-banner__item"
            >
              <img src={image.url} alt={banner.title} loading="lazy" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
