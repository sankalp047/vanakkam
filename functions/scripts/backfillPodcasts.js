/* eslint-env node */
/* eslint-disable max-len */

// One-off manual backfill: runs the exact same sync logic as the scheduled
// podcastSync function, but on demand, so the podcasts collection is
// populated immediately after first deploy instead of waiting for the first
// scheduled run. Uses application default credentials (gcloud ADC).
//
//   node scripts/backfillPodcasts.js
//
const admin = require("firebase-admin");

admin.initializeApp({projectId: "vanakkamfm-dabeb"});

const {runPodcastSync} = require("../podcastSync");

runPodcastSync(admin.firestore())
    .then((summary) => {
      console.log("Backfill complete:", summary);
      process.exit(0);
    })
    .catch((err) => {
      console.error("Backfill failed:", err);
      process.exit(1);
    });
