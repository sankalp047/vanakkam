import { ContactForm } from './ContactForm';
import './ContactSection.css';

export function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <div className="container contact-grid">
        <div className="contact-info">
          <span className="section-tag">Get in Touch</span>
          <h2>
            Contact <span className="highlight">Us</span>
          </h2>
          <p className="contact-info__desc">
            Want to advertise on the radio? Have a song request, a shoutout, or just want to say வணக்கம்? We'd love
            to hear from you!
          </p>

          <div className="contact-info__list">
            <div className="contact-info__item">
              <span className="contact-info__label">Sales</span>
              <a href="tel:+14694243188">(469) 424-3188</a>
            </div>
            <div className="contact-info__item">
              <span className="contact-info__label">Studio</span>
              <a href="tel:+14692937222">(469) 293-7222</a>
            </div>
            <div className="contact-info__item">
              <span className="contact-info__label">Email</span>
              <a href="mailto:sales@funasia.net">sales@funasia.net</a>
            </div>
            <div className="contact-info__item">
              <span className="contact-info__label">Address</span>
              <span>6850 TPC Dr #108, McKinney, TX 75070</span>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
