import { usePlayerContext } from '../../context/PlayerContext';
import { useOnAirNow } from '../../hooks/useOnAirNow';
import './LiveStreamBar.css';

export function LiveStreamBar() {
  const { live } = usePlayerContext();
  const onAir = useOnAirNow();

  const isPlaying = live.status === 'playing';
  const isLoading = live.status === 'loading';

  return (
    <div className="onair-bar">
      <div className="onair-bar__inner container">
        <span className="onair-bar__badge">
          <span className="onair-bar__badge-dot" />
          On Air
        </span>

        <button
          type="button"
          className="onair-bar__play"
          onClick={live.toggle}
          aria-label={isPlaying ? 'Pause live radio' : 'Play live radio'}
        >
          <span className="onair-bar__play-label">{isPlaying ? 'Playing' : 'Listen Live'}</span>
          <span className="onair-bar__play-icon">{isPlaying ? '❚❚' : isLoading ? '···' : '▶'}</span>
        </button>

        <div className="onair-bar__now">
          {onAir ? (
            <>
              <span className="onair-bar__show">{onAir.show}</span>
              <span className="onair-bar__host">with {onAir.name}</span>
            </>
          ) : (
            <>
              <span className="onair-bar__show">Vanakkam FM</span>
              <span className="onair-bar__host">104.9 HD2 · Tamil hits, 24/7</span>
            </>
          )}
        </div>

        {isPlaying && (
          <div className="onair-bar__eq" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
      </div>
    </div>
  );
}
