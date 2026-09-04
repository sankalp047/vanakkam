import { useCallback, useEffect, useRef, useState } from 'react';

export const LIVE_STREAM_URL = 'https://streamlky.alsolnet.com/vanakkamaudio';

const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'touchstart'];

/**
 * Owns the single persistent <audio> element for the 24/7 live station
 * stream. Mounted once at the app root so playback survives client-side
 * navigation. Tries to start playing itself the moment the site loads;
 * browsers that block that (autoplay policy) get a one-time fallback that
 * starts the stream on the visitor's very first click/tap/keypress anywhere
 * on the page — as close to "plays the instant you land" as the platform
 * allows without a real user gesture.
 */
export function useLiveStreamPlayer() {
  const audioRef = useRef(null);
  // Lets callers tear down the pending "start on first interaction" autoplay
  // fallback the moment the visitor makes an explicit playback choice.
  const cancelAutoplayRef = useRef(() => {});
  const [status, setStatus] = useState('idle'); // idle | loading | playing | paused | error

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
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

    // Attempt autoplay immediately on landing — production only, so local
    // dev (constant reloads/HMR) doesn't blast live radio on every save.
    let cancelled = false;
    let cleanupInteractionListeners = () => {};

    if (import.meta.env.PROD) {
      setStatus('loading');
      audio.play().catch(() => {
        if (cancelled) return;
        setStatus('paused');

        // Blocked by the browser's autoplay policy — start on the first
        // interaction anywhere on the page instead, then stop listening.
        const startOnInteraction = () => {
          audio.play().catch(() => {});
          cleanupInteractionListeners();
        };
        INTERACTION_EVENTS.forEach((evt) => document.addEventListener(evt, startOnInteraction, { once: true, passive: true }));
        cleanupInteractionListeners = () => {
          INTERACTION_EVENTS.forEach((evt) => document.removeEventListener(evt, startOnInteraction));
        };
        cancelAutoplayRef.current = cleanupInteractionListeners;
      });
    }

    return () => {
      cancelled = true;
      cleanupInteractionListeners();
      cancelAutoplayRef.current = () => {};
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('stalled', onStalled);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Once the visitor makes any deliberate playback choice, the pending
  // autoplay fallback must not fire — otherwise a click meant for the podcast
  // player would also kick off the live stream (its pointerdown lands first).
  const cancelPendingAutoplay = useCallback(() => {
    cancelAutoplayRef.current();
    cancelAutoplayRef.current = () => {};
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    cancelPendingAutoplay();
    try {
      setStatus('loading');
      await audio.play();
    } catch {
      setStatus('paused');
    }
  }, [cancelPendingAutoplay]);

  const pause = useCallback(() => {
    cancelPendingAutoplay();
    audioRef.current?.pause();
  }, [cancelPendingAutoplay]);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      play();
    } else {
      pause();
    }
  }, [play, pause]);

  return { status, play, pause, toggle, cancelPendingAutoplay };
}
