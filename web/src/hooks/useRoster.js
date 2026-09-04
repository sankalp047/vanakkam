import { useSyncExternalStore } from 'react';
import { getPodcastState, subscribeToPodcasts } from '../lib/podcastStore';

/**
 * The single source of truth the whole site reads for RJ/show info:
 * built-in roster defaults with the station's admin edits layered on top.
 *
 * Backed by the shared podcast store, so the roster is merged once per
 * snapshot and every consumer gets the same stable array reference — no
 * duplicate listeners, no per-component re-merging.
 */
export function useRoster() {
  const { roster, status } = useSyncExternalStore(subscribeToPodcasts, getPodcastState, getPodcastState);
  return { roster, status };
}
