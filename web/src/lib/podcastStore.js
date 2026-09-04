import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { mergeRoster } from './rosterMerge';

/**
 * A single shared Firestore subscription for the podcasts collection.
 *
 * Every roster consumer (hero, carousel, schedule, on-air banner, podcast
 * grid, admin pages) reads from this one store instead of opening its own
 * onSnapshot listener — otherwise a single page mounts half a dozen
 * duplicate listeners, each re-downloading every episode array and
 * re-rendering on every change.
 *
 * The merged roster is computed once per snapshot here too, so components
 * share one stable array reference and don't each redo the merge.
 */

function applyEpisodeOverrides(rjDoc) {
  const overrides = rjDoc.episodeOverrides || {};
  const episodes = (rjDoc.episodes || []).map((ep) => {
    const override = overrides[ep.guid];
    return override ? { ...ep, ...override } : ep;
  });
  return { ...rjDoc, episodes };
}

let state = { podcasts: [], roster: mergeRoster([]), status: 'loading' };
const listeners = new Set();
let unsubscribeSnapshot = null;

function emit() {
  listeners.forEach((notify) => notify());
}

function start() {
  if (unsubscribeSnapshot) return;
  unsubscribeSnapshot = onSnapshot(
    collection(db, 'podcasts'),
    (snapshot) => {
      const podcasts = snapshot.docs.map((docSnap) => applyEpisodeOverrides(docSnap.data()));
      state = { podcasts, roster: mergeRoster(podcasts), status: 'ready' };
      emit();
    },
    () => {
      state = { ...state, status: 'error' };
      emit();
    },
  );
}

export function subscribeToPodcasts(notify) {
  listeners.add(notify);
  start();
  return () => {
    listeners.delete(notify);
    // The listener is deliberately kept open once opened: this data backs
    // almost every screen, and tearing it down on the last unmount only to
    // re-open (and re-download) on the next navigation is worse than the
    // cost of holding one subscription for the session.
  };
}

export function getPodcastState() {
  return state;
}
