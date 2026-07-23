import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePromo } from '../../hooks/usePromo';
import './PromoBar.css';

// Dismissal is remembered per-device via localStorage, keyed to the promo's
// last-updated time so a NEW/edited promo shows again even to people who
// dismissed the previous one. (True per-IP tracking would need a backend;
// this is the standard per-device equivalent.)
function dismissKey(promo) {
  const v = promo?.updatedAt?.toMillis?.() ?? 0;
  return `vfm-promo-dismissed-${v}`;
}

function setPromoHeight(px) {
  document.documentElement.style.setProperty('--promo-height', `${px}px`);
}

export function PromoBar() {
  const { promo } = usePromo();
  const ref = useRef(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!promo) return;
    try {
      setDismissed(localStorage.getItem(dismissKey(promo)) === '1');
    } catch {
      setDismissed(false);
    }
  }, [promo]);

  const visible = Boolean(promo && promo.active && (promo.title || promo.message)) && !dismissed;

  useLayoutEffect(() => {
    setPromoHeight(visible && ref.current ? ref.current.offsetHeight : 0);
    if (!visible) return undefined;
    const onResize = () => setPromoHeight(ref.current ? ref.current.offsetHeight : 0);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [visible, promo]);

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(dismissKey(promo), '1');
    } catch {
      /* ignore */
    }
    setDismissed(true);
    setPromoHeight(0);
  };

  const style = {};
  if (promo.bg) style.background = promo.bg;
  if (promo.fg) style.color = promo.fg;

  return (
    <div className="promo-bar" ref={ref} style={style} role="region" aria-label="Announcement">
      <div className="promo-bar__inner container">
        <div className="promo-bar__text">
          {promo.title && <strong className="promo-bar__title">{promo.title}</strong>}
          {promo.message && <span className="promo-bar__msg">{promo.message}</span>}
        </div>
        <div className="promo-bar__actions">
          {promo.ctaText && promo.ctaUrl && (
            <a
              href={promo.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="promo-bar__cta"
              onClick={dismiss}
            >
              {promo.ctaText}
            </a>
          )}
          <button type="button" className="promo-bar__close" onClick={dismiss} aria-label="Dismiss announcement">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
