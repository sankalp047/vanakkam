import { useEffect, useRef, useState } from 'react';
import './AdvertiseWave.css';

/**
 * A line-art megaphone + broadcast-wave illustration that draws itself in
 * (SVG stroke-dashoffset, using pathLength="1" so the math stays simple)
 * the first time it scrolls into view.
 */
export function AdvertiseWave() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`advertise-wave ${inView ? 'advertise-wave--in-view' : ''}`} ref={ref} aria-hidden="true">
      <svg viewBox="0 0 300 300" fill="none">
        <path className="advertise-wave__path advertise-wave__path--handle" pathLength="1" d="M38,138 L38,162 L58,162 L58,138 Z" />
        <path
          className="advertise-wave__path advertise-wave__path--horn"
          pathLength="1"
          strokeLinejoin="round"
          d="M58,126 L174,84 L174,216 L58,174 Z"
        />
        <path className="advertise-wave__path advertise-wave__path--arc advertise-wave__path--arc1" pathLength="1" d="M174,112 A38,38 0 0 1 174,188" />
        <path className="advertise-wave__path advertise-wave__path--arc advertise-wave__path--arc2" pathLength="1" d="M174,84 A66,66 0 0 1 174,216" />
        <path className="advertise-wave__path advertise-wave__path--arc advertise-wave__path--arc3" pathLength="1" d="M174,56 A94,94 0 0 1 174,244" />
      </svg>
    </div>
  );
}
