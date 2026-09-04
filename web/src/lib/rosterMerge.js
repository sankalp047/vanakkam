import { RJ_ROSTER } from './rjRoster';

/**
 * Fields the station can edit from the admin dashboard. Each one falls back
 * to the built-in roster default when it hasn't been overridden, so a blank
 * value in Firestore never blanks out the site.
 */
export const EDITABLE_FIELDS = ['name', 'show', 'time', 'days', 'bio'];

function pick(override, fallback) {
  if (override === undefined || override === null) return fallback;
  if (typeof override === 'string' && override.trim() === '') return fallback;
  return override;
}

/**
 * Merges one roster entry with its Firestore podcasts/{slug} document.
 * Admin-entered values win; anything unset falls back to the code defaults.
 */
export function mergeRjEntry(rosterEntry, podcastDoc) {
  const doc = podcastDoc || {};
  const merged = { ...rosterEntry };

  EDITABLE_FIELDS.forEach((field) => {
    merged[field] = pick(doc[`${field}Override`], rosterEntry[field]);
  });

  // Artwork: admin upload wins, then the StreamGuys feed image, then the
  // bundled roster photo.
  merged.image = pick(doc.imageOverride, pick(doc.image, rosterEntry.image));
  merged.feedUrl = pick(doc.feedUrlOverride, doc.feedUrl);
  merged.episodes = doc.episodes || [];
  merged.lastSyncStatus = doc.lastSyncStatus;
  merged.lastSyncError = doc.lastSyncError;
  merged.lastSyncedAt = doc.lastSyncedAt;

  return merged;
}

/**
 * The full roster, in canonical order, with any admin overrides applied.
 * `podcasts` is the array of Firestore docs from usePodcasts().
 */
export function mergeRoster(podcasts) {
  const bySlug = new Map((podcasts || []).map((p) => [p.slug, p]));
  return RJ_ROSTER.map((entry) => mergeRjEntry(entry, bySlug.get(entry.slug)));
}
