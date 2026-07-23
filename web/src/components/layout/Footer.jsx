import './Footer.css';

export function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container footer__main">
        <div className="footer__brand">
          <div className="footer__logo">
            <img src="/logo.png" alt="Vanakkam FM" />
            <div>
              <div className="footer__logo-text">
                Vanakkam <span className="highlight">FM</span>
              </div>
              <p className="footer__tagline">உங்கள் இசை பயணம் இங்கே தொடங்குகிறது</p>
            </div>
          </div>
          <p className="footer__desc">
            Dallas–Fort Worth's Tamil station — live RJs, nonstop hits, and culture that feels like home.
          </p>
          <div className="footer__socials">
            <a href="#" aria-label="Facebook" className="footer__social">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="footer__social">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube" className="footer__social">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#0c0a14" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer__columns">
          <div className="footer__col">
            <h4>Station</h4>
            <ul>
              <li>104.9 HD2</li>
              <li>Dallas–Fort Worth</li>
              <li>Live 24/7</li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Contact</h4>
            <ul>
              <li>Studio: (469) 293-7222</li>
              <li>Sales: (469) 424-3188</li>
              <li>sales@funasia.net</li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Studio</h4>
            <ul>
              <li>6850 TPC Dr #108</li>
              <li>McKinney, TX 75070</li>
              <li>United States</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>© {new Date().getFullYear()} Vanakkam FM. All rights reserved.</p>
      </div>
    </footer>
  );
}
