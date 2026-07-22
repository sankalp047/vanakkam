import { RJ_ROSTER } from '../../lib/rjRoster';
import './RJGrid.css';

function mergeRoster(rosterEntry, podcastDoc) {
  return {
    slug: rosterEntry.slug,
    name: rosterEntry.name,
    show: rosterEntry.show,
    time: rosterEntry.time,
    days: rosterEntry.days,
    bio: rosterEntry.bio,
    image: (podcastDoc && (podcastDoc.imageOverride || podcastDoc.image)) || rosterEntry.image,
    episodes: (podcastDoc && podcastDoc.episodes) || [],
    lastSyncStatus: podcastDoc && podcastDoc.lastSyncStatus,
  };
}

export function RJGrid({ podcasts, onSelect, onShowBio }) {
  const bySlug = new Map(podcasts.map((p) => [p.slug, p]));
  const merged = RJ_ROSTER.map((rosterEntry) => mergeRoster(rosterEntry, bySlug.get(rosterEntry.slug)));

  return (
    <div className="rj-grid">
      {merged.map((rj) => (
        <div key={rj.slug} className="rj-card">
          <button type="button" className="rj-card__main" onClick={() => onSelect(rj)}>
            <div className="rj-card__image" style={{ backgroundImage: `url(${rj.image})` }}>
              <div className="rj-card__overlay">
                <span className="rj-card__time">{rj.time}</span>
                <h3 className="rj-card__name">{rj.name}</h3>
                <p className="rj-card__show">{rj.show}</p>
              </div>
            </div>
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
