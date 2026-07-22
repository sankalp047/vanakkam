import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/#shows', label: 'Shows', hash: true },
  { to: '/podcasts', label: 'Podcasts' },
  { to: '/#contact', label: 'Contact', hash: true },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <a href="/" className="navbar__logo" aria-label="Vanakkam FM home">
          <img src="/logo.png" alt="" className="navbar__logo-img" />
          <span className="navbar__logo-text">
            Vanakkam <span className="highlight">FM</span>
          </span>
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

        <button
          type="button"
          className={`navbar__toggle ${menuOpen ? 'navbar__toggle--active' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="navbar__hamburger" />
        </button>
      </div>
    </header>
  );
}
