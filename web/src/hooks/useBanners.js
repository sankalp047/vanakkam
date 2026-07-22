import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Reads all sponsor/client banners ordered by `order`. Public callers
 * should filter to `active` (and any date window) themselves — see
 * useSponsorBanners for the public-facing slot, and AdminBannersPage for
 * the management view which needs to see inactive ones too.
 */
export function useBanners() {
  const [banners, setBanners] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const q = query(collection(db, 'banners'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setBanners(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setStatus('ready');
      },
      () => setStatus('error'),
    );
    return unsubscribe;
  }, []);

  return { banners, status };
}

function isWithinWindow(banner, now) {
  if (banner.startAt && banner.startAt.toMillis() > now) return false;
  if (banner.endAt && banner.endAt.toMillis() < now) return false;
  return true;
}

export function useSponsorBanners() {
  const { banners, status } = useBanners();
  const now = Date.now();
  const active = banners.filter((b) => b.active && isWithinWindow(b, now));
  return { banners: active, status };
}
