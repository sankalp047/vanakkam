import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Owns the single persistent <audio> element for on-demand podcast episode
 * playback (playlist, seek, volume, expand). Independent from the live
 * stream player — the two are only ever coordinated at the mutual-exclusion
 * layer in PlayerProvider, never share an <audio> node.
 */
export function usePodcastPlayer() {
  const audioRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | loading | playing | paused | error
  const [rj, setRj] = useState(null); // { slug, name, image, episodes: [...] }
  const [episodeIndex, setEpisodeIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audioRef.current = audio;

    const onPlaying = () => setStatus('playing');
    const onPause = () => setStatus((s) => (s === 'error' ? s : 'paused'));
    const onWaiting = () => setStatus('loading');
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onError = () => setStatus('error');
    const onEnded = () => {
      // advance to next episode, if any — handled by playNext via closure below
      audio.dispatchEvent(new Event('vanakkam:ended'));
    };

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const playIndex = useCallback((nextRj, index) => {
    const audio = audioRef.current;
    const episode = nextRj?.episodes?.[index];
    if (!audio || !episode) return;

    setRj(nextRj);
    setEpisodeIndex(index);
    setStatus('loading');
    audio.src = episode.audioUrl;
    audio.play().catch(() => setStatus('paused'));
  }, []);

  const playEpisode = useCallback(
    (nextRj, episodeOrIndex) => {
      const index =
        typeof episodeOrIndex === 'number'
          ? episodeOrIndex
          : nextRj.episodes.findIndex((e) => e.guid === episodeOrIndex.guid);
      if (index < 0) return;
      playIndex(nextRj, index);
    },
    [playIndex],
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    if (audio.paused) {
      audio.play().catch(() => setStatus('paused'));
    } else {
      audio.pause();
    }
  }, []);

  const playNext = useCallback(() => {
    if (!rj || episodeIndex < 0) return;
    if (episodeIndex < rj.episodes.length - 1) {
      playIndex(rj, episodeIndex + 1);
    }
  }, [rj, episodeIndex, playIndex]);

  const playPrevious = useCallback(() => {
    if (!rj || episodeIndex <= 0) return;
    playIndex(rj, episodeIndex - 1);
  }, [rj, episodeIndex, playIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => playNext();
    audio.addEventListener('vanakkam:ended', onEnded);
    return () => audio.removeEventListener('vanakkam:ended', onEnded);
  }, [playNext]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = time;
  }, []);

  const setVolume = useCallback((v) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = v;
    setVolumeState(v);
  }, []);

  const toggleExpanded = useCallback(() => setIsExpanded((v) => !v), []);
  const collapse = useCallback(() => setIsExpanded(false), []);

  const currentEpisode = rj?.episodes?.[episodeIndex] ?? null;

  return {
    status,
    rj,
    currentEpisode,
    episodeIndex,
    currentTime,
    duration,
    volume,
    isExpanded,
    playEpisode,
    pause,
    toggle,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleExpanded,
    collapse,
  };
}
