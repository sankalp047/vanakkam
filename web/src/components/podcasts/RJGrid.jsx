import { RJ_ROSTER } from '../../lib/rjRoster';
import './RJGrid.css';

function mergeRoster(rosterEntry, podcastDoc) {
  return {
    slug: rosterEntry.slug,
    name: rosterEntry.name,
    show: rosterEntry.show,
    time: rosterEntry.time,
    days: rosterEntry.days,
    image: (podcastDoc && (podcastDoc.imageOverride || podcastDoc.image)) || rosterEntry.image,
    episodes: (podcastDoc && podcastDoc.episodes) || [],
    lastSyncStatus: podcastDoc && podcastDoc.lastSyncStatus,
  };
}

export function RJGrid({ podcasts, onSelect }) {
  const bySlug = new Map(podcasts.map((p) => [p.slug, p]));
  const merged = RJ_ROSTER.map((rosterEntry) => mergeRoster(rosterEntry, bySlug.get(rosterEntry.slug)));

  return (
    <div className="rj-grid">
      {merged.map((rj) => (
        <button type="button" key={rj.slug} className="rj-card" onClick={() => onSelect(rj)}>
          <div className="rj-card__image" style={{ backgroundImage: `url(${rj.image})` }}>
            <div className="rj-card__overlay">
              <span className="rj-card__time">{rj.time}</span>
              <h3 className="rj-card__name">{rj.name}</h3>
              <p className="rj-card__show">{rj.show}</p>
            </div>
          </div>
          <div className="rj-card__meta">
            <span>{rj.episodes.length ? `${rj.episodes.length} Episodes` : 'Coming soon'}</span>
            <span className="rj-card__play-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
