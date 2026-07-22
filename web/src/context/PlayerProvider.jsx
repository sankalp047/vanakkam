import { useCallback, useMemo } from 'react';
import { PlayerContext } from './PlayerContext';
import { useLiveStreamPlayer } from '../hooks/useLiveStreamPlayer';
import { usePodcastPlayer } from '../hooks/usePodcastPlayer';

/**
 * Coordinates the two independent audio surfaces (live stream + on-demand
 * podcast) so only one is ever audible at a time, without merging them into
 * a single <audio> element (see plan §4 — different playback models).
 */
export function PlayerProvider({ children }) {
  const live = useLiveStreamPlayer();
  const podcast = usePodcastPlayer();

  const playLive = useCallback(async () => {
    if (podcast.status === 'playing' || podcast.status === 'loading') {
      podcast.pause();
    }
    await live.play();
  }, [live, podcast]);

  const toggleLive = useCallback(async () => {
    if (live.status === 'playing' || live.status === 'loading') {
      live.pause();
    } else {
      await playLive();
    }
  }, [live, playLive]);

  const playEpisode = useCallback(
    (rj, episodeOrIndex) => {
      if (live.status === 'playing' || live.status === 'loading') {
        live.pause();
      }
      podcast.playEpisode(rj, episodeOrIndex);
    },
    [live, podcast],
  );

  const togglePodcast = useCallback(() => {
    if (podcast.status === 'idle') return;
    if (live.status === 'playing' || live.status === 'loading') {
      live.pause();
    }
    podcast.toggle();
  }, [live, podcast]);

  const value = useMemo(
    () => ({
      live: { ...live, play: playLive, toggle: toggleLive },
      podcast: { ...podcast, playEpisode, toggle: togglePodcast },
    }),
    [live, podcast, playLive, toggleLive, playEpisode, togglePodcast],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
