import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Reads the single editable promo-bar config doc (config/promo), kept live.
 */
export function usePromo() {
  const [promo, setPromo] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'config', 'promo'),
      (snap) => {
        setPromo(snap.exists() ? snap.data() : null);
        setStatus('ready');
      },
      () => setStatus('error'),
    );
    return unsubscribe;
  }, []);

  return { promo, status };
}
