import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

function applyOverrides(rjDoc) {
  const overrides = rjDoc.episodeOverrides || {};
  const episodes = (rjDoc.episodes || []).map((ep) => {
    const override = overrides[ep.guid];
    return override ? { ...ep, ...override } : ep;
  });
  return { ...rjDoc, episodes };
}

/**
 * Reads the synced podcasts/{slug} docs from Firestore (populated by the
 * scheduled podcastSync Cloud Function) and keeps them live-updated.
 */
export function usePodcasts() {
  const [podcasts, setPodcasts] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'podcasts'),
      (snapshot) => {
        // Ordering is owned by lib/rosterMerge (it has to account for
        // dashboard-added shows and the admin's drag order), so just hand
        // the raw docs through here.
        setPodcasts(snapshot.docs.map((doc) => applyOverrides(doc.data())));
        setStatus('ready');
      },
      () => setStatus('error'),
    );

    return unsubscribe;
  }, []);

  return { podcasts, status };
}
