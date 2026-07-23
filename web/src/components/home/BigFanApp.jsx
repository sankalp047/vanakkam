import './BigFanApp.css';

// TODO: replace with the real BigFan app store URLs + logo/screenshots
// once provided.
const APP_STORE_URL = '#';
const PLAY_STORE_URL = '#';

export function BigFanApp() {
  return (
    <section className="bigfan" aria-label="Download the BigFan app">
      <div className="container bigfan__inner">
        <div className="bigfan__phones" aria-hidden="true">
          {/* Placeholder phone mockups — swap for real app screenshots */}
          <div className="bigfan__phone bigfan__phone--back">
            <img src="/logo.png" alt="" />
          </div>
          <div className="bigfan__phone bigfan__phone--front">
            <img src="/logo.png" alt="" />
          </div>
        </div>

        <div className="bigfan__copy">
          <span className="bigfan__kicker">Listen Anywhere</span>
          <h2 className="bigfan__title">
            Take Vanakkam FM
            <br />
            with you on BigFan
          </h2>
          <div className="bigfan__logo">
            {/* Swap for the BigFan app logo when provided */}
            <span className="bigfan__logo-text">BigFan</span>
          </div>
        </div>

        <div className="bigfan__cta">
          <div className="bigfan__badges">
            <a href={APP_STORE_URL} className="store-badge" aria-label="Download on the App Store">
              <svg className="store-badge__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16.365 1.43c0 1.14-.417 2.2-1.25 3.02-.99.98-2.18 1.55-3.35 1.46-.03-1.13.44-2.25 1.24-3.05.86-.86 2.19-1.5 3.36-1.53.02.03.02.06 0 .1zM20.4 17.05c-.55 1.27-.82 1.84-1.53 2.97-1 1.57-2.4 3.53-4.15 3.54-1.55.02-1.95-1.01-4.06-1-2.1.01-2.54 1.02-4.1 1.01-1.74-.02-3.07-1.79-4.06-3.36-2.78-4.4-3.07-9.56-1.36-12.3 1.21-1.95 3.13-3.09 4.94-3.09 1.84 0 3 1.01 4.52 1.01 1.48 0 2.38-1.01 4.51-1.01 1.61 0 3.32.88 4.54 2.4-3.99 2.19-3.34 7.88.21 9.83z" />
              </svg>
              <span className="store-badge__text">
                <small>Download on the</small>
                <strong>App Store</strong>
              </span>
            </a>

            <a href={PLAY_STORE_URL} className="store-badge" aria-label="Get it on Google Play">
              <svg className="store-badge__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#00d2ff" d="M3.6 2.3 13 11.6l-2.6 2.6L3.1 3.1c.1-.4.3-.7.5-.8z" />
                <path fill="#00e676" d="M14.2 12.8 3.6 2.3c.3-.2.7-.2 1.1 0l11.4 6.5-1.9 4z" />
                <path fill="#ffea00" d="M16.1 8.8 20 11c.6.4.6 1.5 0 1.9l-3.9 2.3-2.1-3.2 2.1-3.2z" />
                <path fill="#ff3d00" d="M3.6 21.7 14.2 11.2l1.9 4L4.7 21.7c-.4.2-.8.2-1.1 0z" />
              </svg>
              <span className="store-badge__text">
                <small>Get it on</small>
                <strong>Google Play</strong>
              </span>
            </a>
          </div>
          <p className="bigfan__trust">Trusted by thousands of Tamil listeners</p>
        </div>
      </div>
    </section>
  );
}
