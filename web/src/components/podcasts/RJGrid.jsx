import { mergeRoster } from '../../lib/rosterMerge';
import './RJGrid.css';

export function RJGrid({ podcasts, onSelect, onShowBio }) {
  const merged = mergeRoster(podcasts);

  return (
    <div className="rj-grid">
      {merged.map((rj) => (
        <div key={rj.slug} className="rj-card">
          <button type="button" className="rj-card__main" onClick={() => onSelect(rj)}>
            {/* The station's poster artwork already has the RJ name, show
                title and time printed on it, so no text overlay here. */}
            <div
              className="rj-card__image"
              style={{ backgroundImage: `url(${rj.image})` }}
              role="img"
              aria-label={`${rj.name} — ${rj.show}, ${rj.time}`}
            />
          </button>
          <div className="rj-card__meta">
            <span>{rj.episodes.length ? `${rj.episodes.length} Episodes` : 'Coming soon'}</span>
            <button
              type="button"
              className="rj-card__info"
              onClick={() => onShowBio && onShowBio(rj)}
              aria-label={`About ${rj.name}`}
            >
              i
            </button>
            <button type="button" className="rj-card__play-icon" onClick={() => onSelect(rj)} aria-label={`Play ${rj.name}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
