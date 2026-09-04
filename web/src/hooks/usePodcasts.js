import { useSyncExternalStore } from 'react';
import { getPodcastState, subscribeToPodcasts } from '../lib/podcastStore';

/**
 * Reads the synced podcasts/{slug} docs (populated by the scheduled
 * podcastSync Cloud Function) from the shared store — one Firestore
 * subscription for the whole app, no matter how many components read it.
 */
export function usePodcasts() {
  const { podcasts, status } = useSyncExternalStore(subscribeToPodcasts, getPodcastState, getPodcastState);
  return { podcasts, status };
}
