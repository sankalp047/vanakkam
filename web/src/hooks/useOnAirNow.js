import { useEffect, useState } from 'react';
import { useRoster } from './useRoster';
import { isOnAirNow } from '../lib/schedule';

/**
 * Returns the roster entry currently on air, computed client-side from the
 * schedule (no backend call) and re-checked every 30s, or null if no
 * scheduled RJ matches right now. Reads the admin-editable roster, so
 * schedule edits take effect without a redeploy.
 */
export function useOnAirNow() {
  const { roster } = useRoster();
  const [onAir, setOnAir] = useState(null);

  useEffect(() => {
    const tick = () => setOnAir(roster.find((rj) => isOnAirNow(rj)) ?? null);
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [roster]);

  return onAir;
}
