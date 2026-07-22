import { useEffect, useState } from 'react';
import { RJ_ROSTER } from '../lib/rjRoster';
import { isOnAirNow } from '../lib/schedule';

/**
 * Returns the roster entry currently on air (client-computed from the
 * static schedule, no backend call), re-checked every 30s, or null if no
 * scheduled RJ matches right now.
 */
export function useOnAirNow() {
  const [onAir, setOnAir] = useState(() => RJ_ROSTER.find((rj) => isOnAirNow(rj)) ?? null);

  useEffect(() => {
    const tick = () => setOnAir(RJ_ROSTER.find((rj) => isOnAirNow(rj)) ?? null);
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return onAir;
}
