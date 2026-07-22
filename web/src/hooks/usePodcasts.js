import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { RJ_ROSTER } from '../lib/rjRoster';

const ROSTER_ORDER = RJ_ROSTER.map((rj) => rj.slug);

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
        const docs = snapshot.docs.map((doc) => applyOverrides(doc.data()));
        docs.sort((a, b) => ROSTER_ORDER.indexOf(a.slug) - ROSTER_ORDER.indexOf(b.slug));
        setPodcasts(docs);
        setStatus('ready');
      },
      () => setStatus('error'),
    );

    return unsubscribe;
  }, []);

  return { podcasts, status };
}
