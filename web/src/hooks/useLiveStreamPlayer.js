import { useCallback, useEffect, useRef, useState } from 'react';

export const LIVE_STREAM_URL = 'https://streamlky.alsolnet.com/vanakkamaudio';

/**
 * Owns the single persistent <audio> element for the 24/7 live station stream.
 * Mounted once at the app root so playback survives client-side navigation.
 */
export function useLiveStreamPlayer() {
  const audioRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | loading | playing | paused | error

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.src = LIVE_STREAM_URL;
    audioRef.current = audio;

    const onPlaying = () => setStatus('playing');
    const onPause = () => setStatus((s) => (s === 'error' ? s : 'paused'));
    const onWaiting = () => setStatus('loading');
    const onStalled = () => setStatus('loading');
    const onError = () => setStatus('error');

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('stalled', onStalled);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('stalled', onStalled);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      setStatus('loading');
      await audio.play();
    } catch {
      setStatus('paused');
    }
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      play();
    } else {
      pause();
    }
  }, [play, pause]);

  return { status, play, pause, toggle };
}
