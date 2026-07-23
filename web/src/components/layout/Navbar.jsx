import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { usePlayerContext } from '../../context/PlayerContext';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/#shows', label: 'Shows', hash: true },
  { to: '/#schedule', label: 'Schedule', hash: true },
  { to: '/podcasts', label: 'Podcasts' },
  { to: '/#contact', label: 'Contact', hash: true },
];

export function Navbar() {
  const { live } = usePlayerContext();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const isLive = live.status === 'playing' || live.status === 'loading';

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <button
          type="button"
          className={`navbar__toggle ${menuOpen ? 'navbar__toggle--active' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="navbar__hamburger" />
        </button>

        <a href="/" className="navbar__logo" aria-label="Vanakkam FM home">
          <img src="/logo.png" alt="Vanakkam FM" className="navbar__logo-img" />
        </a>

        <nav className={`navbar__menu ${menuOpen ? 'navbar__menu--open' : ''}`}>
          {NAV_LINKS.map((link) =>
            link.hash ? (
              <a key={link.label} href={link.to} className="navbar__link" onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ),
          )}
        </nav>

        <button type="button" className="navbar__listen" onClick={live.toggle}>
          <span className={`navbar__listen-dot ${isLive ? 'navbar__listen-dot--live' : ''}`} />
          {isLive ? 'Playing' : 'Listen Live'}
        </button>
      </div>
    </header>
  );
}
