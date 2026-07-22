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
              <span>+1 (912) 345-6789</span>
            </div>
            <div className="contact-info__item">
              <span className="contact-info__label">Studio</span>
              <span>+1 (912) 345-6789</span>
            </div>
            <div className="contact-info__item">
              <span className="contact-info__label">Email</span>
              <span>hello@vanakkamfm.net</span>
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
