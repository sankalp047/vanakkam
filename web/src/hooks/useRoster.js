import { useMemo } from 'react';
import { usePodcasts } from './usePodcasts';
import { mergeRoster } from '../lib/rosterMerge';

/**
 * The single source of truth the whole site reads for RJ/show info:
 * built-in roster defaults with the station's admin edits layered on top.
 */
export function useRoster() {
  const { podcasts, status } = usePodcasts();
  const roster = useMemo(() => mergeRoster(podcasts), [podcasts]);
  return { roster, status };
}
