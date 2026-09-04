import { RJ_ROSTER } from './rjRoster';

/**
 * Fields the station can edit from the admin dashboard. Each one falls back
 * to the built-in roster default when it hasn't been overridden, so a blank
 * value in Firestore never blanks out the site.
 */
export const EDITABLE_FIELDS = ['name', 'show', 'time', 'days', 'bio'];

const FALLBACK_IMAGE = '/logo.png';

function pick(override, fallback) {
  if (override === undefined || override === null) return fallback;
  if (typeof override === 'string' && override.trim() === '') return fallback;
  return override;
}

/**
 * Merges one show with its Firestore podcasts/{slug} document. Works both for
 * shows that ship with built-in defaults and for ones added from the
 * dashboard (where `rosterEntry` is absent and the doc supplies everything).
 */
export function mergeRjEntry(rosterEntry, podcastDoc) {
  const doc = podcastDoc || {};
  const base = rosterEntry || { slug: doc.slug };
  const merged = { ...base };

  EDITABLE_FIELDS.forEach((field) => {
    merged[field] = pick(doc[`${field}Override`], base[field] ?? '');
  });

  // Artwork: admin upload wins, then the StreamGuys feed image, then the
  // bundled roster photo, then the station logo for dashboard-added shows.
  merged.image = pick(doc.imageOverride, pick(doc.image, base.image || FALLBACK_IMAGE));
  merged.feedUrl = pick(doc.feedUrlOverride, doc.feedUrl || '');
  merged.episodes = doc.episodes || [];
  merged.hidden = doc.hidden === true;
  merged.isCustom = Boolean(doc.isCustom) || !rosterEntry;
  merged.order = Number.isFinite(doc.order) ? doc.order : null;
  merged.lastSyncStatus = doc.lastSyncStatus;
  merged.lastSyncError = doc.lastSyncError;
  merged.lastSyncedAt = doc.lastSyncedAt;

  return merged;
}

/**
 * The full roster with admin edits applied: built-in shows plus any added
 * from the dashboard, ordered by the admin's drag order (falling back to the
 * built-in order), with hidden shows filtered out unless asked for.
 *
 * @param {Array<object>} podcasts Firestore podcasts docs from usePodcasts().
 * @param {{includeHidden?: boolean}} [options] Admin views pass includeHidden.
 */
export function mergeRoster(podcasts, options = {}) {
  const docs = podcasts || [];
  const bySlug = new Map(docs.map((p) => [p.slug, p]));
  const builtInSlugs = new Set(RJ_ROSTER.map((r) => r.slug));

  const builtIns = RJ_ROSTER.map((entry, index) => ({
    entry: mergeRjEntry(entry, bySlug.get(entry.slug)),
    fallbackOrder: index,
  }));

  // Shows created from the dashboard have no code-side default.
  const custom = docs
    .filter((doc) => doc.slug && !builtInSlugs.has(doc.slug))
    .map((doc, index) => ({
      entry: mergeRjEntry(null, doc),
      fallbackOrder: RJ_ROSTER.length + index,
    }));

  return [...builtIns, ...custom]
    .filter(({ entry }) => options.includeHidden || !entry.hidden)
    .sort((a, b) => {
      const aOrder = a.entry.order ?? a.fallbackOrder;
      const bOrder = b.entry.order ?? b.fallbackOrder;
      return aOrder - bOrder;
    })
    .map(({ entry }) => entry);
}

/** Turns a show/RJ name into a stable, unique document id. */
export function slugify(text, taken = []) {
  const base =
    String(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'show';

  let slug = base;
  let n = 2;
  while (taken.includes(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}
