/* eslint-env node */
/* eslint-disable max-len */

const {onSchedule} = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

// Real, live StreamGuys JSON feeds — one per RJ. Kept in sync with the
// roster in web/src/lib/rjRoster.js (slug is the shared key).
const RJ_FEEDS = [
  {slug: "rj-malini", name: "RJ Malini", url: "https://funasia-rss.streamguys1.com/funasia/rj-malini.json"},
  {slug: "rj-janani", name: "RJ Janani", url: "https://funasia-rss.streamguys1.com/funasia/rj-janani.json"},
  {slug: "rj-zara", name: "RJ Zara", url: "https://funasia-rss.streamguys1.com/funasia/rj-zara.json"},
  {slug: "rj-prabhu", name: "RJ Prabhu", url: "https://funasia-rss.streamguys1.com/funasia/rj-prabhu.json"},
  {slug: "rj-gomathi", name: "RJ Gomathi", url: "https://funasia-rss.streamguys1.com/funasia/rj-gomathi.json"},
  {slug: "rj-lingesh", name: "RJ Lingesh", url: "https://funasia-rss.streamguys1.com/funasia/rj-lingesh.json"},
  {slug: "rj-ananth", name: "RJ Ananth", url: "https://funasia-rss.streamguys1.com/funasia/rj-ananth.json"},
  {slug: "rj-lucky", name: "RJ Lucky", url: "https://funasia-rss.streamguys1.com/funasia/rj-lucky.json"},
  {slug: "rj-mythri", name: "RJ Mythri", url: "https://funasia-rss.streamguys1.com/funasia/rj-mythri.json"},
  {slug: "rj-raksha", name: "RJ Raksha", url: "https://funasia-rss.streamguys1.com/funasia/rj-raksha.json"},
];

const TIME_SLOT_REGEX = /\d+[AP]M\s*to\s*\d+[AP]M/i;

/**
 * Normalizes one StreamGuys feed item into the episode shape stored in
 * Firestore.
 * @param {object} item Raw `channel.items[]` entry from the feed JSON.
 * @return {object} Normalized episode.
 */
function normalizeEpisode(item) {
  return {
    guid: item.guid || item.url,
    title: item.title || "Untitled episode",
    pubDate: item.pubDate || null,
    duration: item["itunes:duration"] || null,
    audioUrl: item.url || (item.enclosure && item.enclosure.url) || "",
    image: item["itunes:image"] || null,
  };
}

/**
 * Merges freshly-fetched episodes into the existing stored list, deduped
 * by guid, without disturbing any admin-set episode overrides.
 * @param {Array<object>} existingEpisodes Episodes currently stored in Firestore.
 * @param {Array<object>} freshEpisodes Newly normalized episodes from the feed.
 * @return {Array<object>} Merged episode list.
 */
function mergeEpisodes(existingEpisodes, freshEpisodes) {
  const existingByGuid = new Map((existingEpisodes || []).map((ep) => [ep.guid, ep]));
  const merged = freshEpisodes.map((fresh) => {
    const existing = existingByGuid.get(fresh.guid);
    // Keep the freshest feed data, but this is also where an existing
    // episode's fields would be preserved if we ever needed to — for now
    // the feed is the source of truth for everything except overrides,
    // which live in a separate `episodeOverrides` map (see podcastSync
    // plan) and are never touched here.
    return existing ? {...existing, ...fresh} : fresh;
  });
  return merged;
}

/**
 * Fetches and normalizes a single RJ's StreamGuys feed.
 * @param {{slug: string, name: string, url: string}} feed Feed descriptor.
 * @param {admin.firestore.Firestore} db Firestore instance.
 * @return {Promise<{slug: string, ok: boolean, data: object}>} Sync result.
 */
async function syncOneFeed(feed, db) {
  const docRef = db.collection("podcasts").doc(feed.slug);

  try {
    // The station can repoint a show's feed from the admin dashboard; that
    // override wins over the built-in URL.
    const preSnap = await docRef.get();
    const feedUrl = (preSnap.exists && preSnap.data().feedUrlOverride) || feed.url;
    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    const channel = data.channel || {};

    const title = channel.title || feed.name;
    const timeMatch = title.match(TIME_SLOT_REGEX);
    const image = channel["itunes:image"] || (channel.image && channel.image.url) || "";
    const items = Array.isArray(channel.items) ? channel.items : [];
    const freshEpisodes = items.map(normalizeEpisode);

    const existing = preSnap.exists ? preSnap.data() : null;
    const episodes = mergeEpisodes(existing && existing.episodes, freshEpisodes);

    return {
      slug: feed.slug,
      ok: true,
      data: {
        slug: feed.slug,
        name: feed.name,
        feedUrl,
        channelTitle: title,
        description: channel.description || "",
        timeSlot: timeMatch ? timeMatch[0] : ((existing && existing.timeSlot) || null),
        image: image || (existing && existing.image) || "",
        episodeCount: episodes.length,
        episodes,
        lastSyncedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastSyncStatus: "ok",
        lastSyncError: null,
      },
    };
  } catch (err) {
    console.error(`❌ podcastSync: ${feed.slug} failed:`, err.message);
    return {
      slug: feed.slug,
      ok: false,
      data: {
        slug: feed.slug,
        name: feed.name,
        feedUrl: feed.url,
        lastSyncedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastSyncStatus: "error",
        lastSyncError: err.message,
      },
    };
  }
}

/**
 * Fetches all RJ feeds and upserts them into Firestore in one batch.
 * Shared by the scheduled function and the one-off backfill script so the
 * two can never drift.
 * @param {admin.firestore.Firestore} db Firestore instance.
 * @return {Promise<{okCount: number, errorCount: number}>} Sync summary.
 */
async function runPodcastSync(db) {
  console.log("🎙️ podcastSync: starting sync of", RJ_FEEDS.length, "RJ feeds");

  const results = await Promise.allSettled(RJ_FEEDS.map((feed) => syncOneFeed(feed, db)));

  const batch = db.batch();
  let okCount = 0;
  let errorCount = 0;

  results.forEach((result, i) => {
    const feed = RJ_FEEDS[i];
    const docRef = db.collection("podcasts").doc(feed.slug);

    if (result.status === "fulfilled") {
      batch.set(docRef, result.value.data, {merge: true});
      result.value.ok ? okCount++ : errorCount++;
    } else {
      // syncOneFeed itself never rejects (it catches internally), but guard
      // anyway so one unexpected throw can't take down the whole batch.
      console.error(`❌ podcastSync: unexpected rejection for ${feed.slug}:`, result.reason);
      batch.set(
          docRef,
          {
            slug: feed.slug,
            lastSyncedAt: admin.firestore.FieldValue.serverTimestamp(),
            lastSyncStatus: "error",
            lastSyncError: String(result.reason),
          },
          {merge: true},
      );
      errorCount++;
    }
  });

  await batch.commit();
  console.log(`✅ podcastSync: done — ${okCount} ok, ${errorCount} failed`);
  return {okCount, errorCount};
}

exports.runPodcastSync = runPodcastSync;

exports.podcastSync = onSchedule("every 30 minutes", async () => {
  await runPodcastSync(admin.firestore());
});
