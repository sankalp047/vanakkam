import { usePlayerContext } from '../../context/PlayerContext';
import './PodcastMiniPlayer.css';

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function PodcastMiniPlayer() {
  const { podcast, live } = usePlayerContext();

  if (podcast.status === 'idle' || !podcast.currentEpisode) return null;

  // When live radio takes over (controlled from the top ON AIR bar), slide the
  // podcast player down out of the way instead of leaving a stale episode bar.
  // Never hide it while the podcast itself is playing/loading — otherwise a
  // transient live state could bury the bar the visitor just asked for.
  const podcastActive = podcast.status === 'playing' || podcast.status === 'loading';
  const liveActive = !podcastActive && (live.status === 'playing' || live.status === 'loading');

  const progress = podcast.duration ? (podcast.currentTime / podcast.duration) * 100 : 0;
  const artwork = podcast.currentEpisode.image || podcast.rj?.image || '/logo.png';

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    podcast.seek(percent * podcast.duration);
  };

  return (
    <div
      className={`podcast-bar ${podcast.isExpanded ? 'podcast-bar--expanded' : ''} ${
        liveActive ? 'podcast-bar--hidden' : ''
      }`}
    >
      <button
        type="button"
        className="podcast-bar__seek"
        onClick={handleSeek}
        aria-label="Seek"
      >
        <div className="podcast-bar__seek-fill" style={{ width: `${progress}%` }} />
      </button>

      {podcast.isExpanded && (
        <div className="podcast-bar__expanded">
          <button type="button" className="podcast-bar__collapse" onClick={podcast.collapse} aria-label="Collapse player">
            ⌄
          </button>
          <img src={artwork} alt="" className="podcast-bar__expanded-art" />
          <h3 className="podcast-bar__expanded-title">{podcast.currentEpisode.title}</h3>
          <p className="podcast-bar__expanded-artist">{podcast.rj?.name}</p>
        </div>
      )}

      <div className="podcast-bar__inner container">
        <button
          type="button"
          className="podcast-bar__art-btn"
          onClick={podcast.toggleExpanded}
          aria-label="Expand player"
        >
          <img src={artwork} alt="" className="podcast-bar__art" />
        </button>

        <div className="podcast-bar__meta">
          <span className="podcast-bar__title">{podcast.currentEpisode.title}</span>
          <span className="podcast-bar__artist">{podcast.rj?.name}</span>
        </div>

        <div className="podcast-bar__controls">
          <button type="button" className="podcast-bar__ctrl" onClick={podcast.playPrevious} aria-label="Previous episode">
            ⏮
          </button>
          <button
            type="button"
            className="podcast-bar__ctrl podcast-bar__ctrl--play"
            onClick={podcast.toggle}
            aria-label={podcast.status === 'playing' ? 'Pause' : 'Play'}
          >
            {podcast.status === 'playing' ? '⏸' : '▶'}
          </button>
          <button type="button" className="podcast-bar__ctrl" onClick={podcast.playNext} aria-label="Next episode">
            ⏭
          </button>
        </div>

        <div className="podcast-bar__times">
          <span className="podcast-bar__time">{formatTime(podcast.currentTime)}</span>
          <span className="podcast-bar__time-sep">/</span>
          <span className="podcast-bar__time podcast-bar__time--muted">{formatTime(podcast.duration)}</span>
        </div>

        <input
          type="range"
          className="podcast-bar__volume"
          min="0"
          max="100"
          value={podcast.volume * 100}
          onChange={(e) => podcast.setVolume(Number(e.target.value) / 100)}
          aria-label="Volume"
        />
      </div>
    </div>
  );
}
