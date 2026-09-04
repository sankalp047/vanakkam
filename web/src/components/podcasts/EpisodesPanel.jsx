import { usePlayerContext } from '../../context/PlayerContext';
import './EpisodesPanel.css';

function formatDate(pubDate) {
  if (!pubDate) return '';
  const date = new Date(pubDate);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function EpisodesPanel({ rj, onClose }) {
  const { podcast } = usePlayerContext();

  if (!rj) return null;

  return (
    <div className="episodes-panel-overlay" onClick={onClose}>
      <aside className="episodes-panel" onClick={(e) => e.stopPropagation()}>
        <div className="episodes-panel__header">
          <img src={rj.image} alt="" className="episodes-panel__image" loading="lazy" decoding="async" />
          <div>
            <h3>{rj.name}</h3>
            <p>{rj.show}</p>
          </div>
          <button type="button" className="episodes-panel__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="episodes-panel__list">
          {rj.episodes.length === 0 && (
            <div className="episodes-panel__empty">
              <p>No episodes yet — check back soon!</p>
            </div>
          )}

          {rj.episodes.map((ep, i) => {
            const isCurrent = podcast.rj?.slug === rj.slug && podcast.episodeIndex === i;
            const isPlayingThis = isCurrent && podcast.status === 'playing';
            return (
              <button
                type="button"
                key={ep.guid}
                className={`episode-row ${isCurrent ? 'episode-row--active' : ''}`}
                onClick={() => podcast.playEpisode(rj, i)}
              >
                <span className="episode-row__play">{isPlayingThis ? '⏸' : '▶'}</span>
                <span className="episode-row__meta">
                  <span className="episode-row__title">{ep.title}</span>
                  <span className="episode-row__sub">
                    {formatDate(ep.pubDate)}
                    {ep.duration ? ` · ${ep.duration}` : ''}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
