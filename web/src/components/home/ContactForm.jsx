import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import './ContactForm.css';

const initialValues = { name: '', email: '', phone: '', businessName: '' };

function validate(values) {
  if (!values.name.trim()) return 'Please enter your name.';
  if (!values.email.trim()) return 'Please enter your email.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return 'Please enter a valid email.';
  if (!values.phone.trim()) return 'Please enter your phone number.';
  if (values.phone.replace(/\D/g, '').length < 7) return 'Please enter a valid phone number.';
  if (!values.businessName.trim()) return 'Please enter your business name.';
  return null;
}

export function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate(values);
    if (validationError) {
      setStatus('error');
      setMessage(validationError);
      return;
    }

    setStatus('submitting');
    try {
      await addDoc(collection(db, 'contactMessages'), {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        businessName: values.businessName.trim(),
        page: window.location.href,
        userAgent: navigator.userAgent,
        createdAt: serverTimestamp(),
      });
      setValues(initialValues);
      setStatus('success');
      setMessage("Thanks! We'll reach out soon.");
    } catch {
      setStatus('error');
      setMessage('Sorry, something went wrong. Please try again.');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {status === 'error' && <div className="contact-form__message contact-form__message--error">{message}</div>}
      {status === 'success' && <div className="contact-form__message contact-form__message--success">{message}</div>}

      <div className="contact-form__group">
        <label htmlFor="name">Your Name *</label>
        <input id="name" name="name" type="text" placeholder="Full name" value={values.name} onChange={handleChange} required />
      </div>

      <div className="contact-form__group">
        <label htmlFor="email">Email *</label>
        <input id="email" name="email" type="email" placeholder="name@company.com" value={values.email} onChange={handleChange} required />
      </div>

      <div className="contact-form__group">
        <label htmlFor="phone">Phone Number *</label>
        <input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" value={values.phone} onChange={handleChange} required />
      </div>

      <div className="contact-form__group">
        <label htmlFor="businessName">Business Name *</label>
        <input
          id="businessName"
          name="businessName"
          type="text"
          placeholder="Business / Organization"
          value={values.businessName}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary contact-form__submit" disabled={status === 'submitting'}>
        <span>{status === 'submitting' ? 'Sending...' : 'Submit'}</span>
        {status !== 'submitting' && (
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </form>
  );
}
