import { AdvertiseWave } from './AdvertiseWave';
import './ContactSection.css';

export function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <div className="container contact-grid">
        <div className="contact-info">
          <span className="section-tag">Advertise With Us</span>
          <h2>
            Reach Thousands of <span className="highlight">Tamil Listeners</span>
          </h2>
          <p className="contact-info__desc">
            Want your business on 104.9 HD2? Have a song request, a shoutout, or just want to say வணக்கம்? Skip the
            forms — call or email our sales team directly.
          </p>

          <div className="contact-cta">
            <a href="mailto:sales@funasia.net" className="btn btn-primary">
              Email Sales
            </a>
            <a href="tel:+14694243188" className="btn btn-secondary">
              Call (469) 424-3188
            </a>
          </div>

          <div className="contact-info__list">
            <div className="contact-info__item">
              <span className="contact-info__label">Studio</span>
              <a href="tel:+14692937222">(469) 293-7222</a>
            </div>
            <div className="contact-info__item">
              <span className="contact-info__label">Address</span>
              <span>6850 TPC Dr #108, McKinney, TX 75070</span>
            </div>
          </div>
        </div>

        <AdvertiseWave />
      </div>
    </section>
  );
}
