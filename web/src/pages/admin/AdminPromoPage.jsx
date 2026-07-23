import { useEffect, useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { usePromo } from '../../hooks/usePromo';
import './admin-shared.css';

const EMPTY = { active: false, title: '', message: '', ctaText: '', ctaUrl: '', bg: '#d4f24a', fg: '#14110f' };

export function AdminPromoPage() {
  const { promo, status } = usePromo();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);

  // Seed the form once from Firestore.
  useEffect(() => {
    if (status === 'ready' && !loadedOnce) {
      setForm({ ...EMPTY, ...(promo || {}) });
      setLoadedOnce(true);
    }
  }, [status, promo, loadedOnce]);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(
        doc(db, 'config', 'promo'),
        {
          active: form.active,
          title: form.title.trim(),
          message: form.message.trim(),
          ctaText: form.ctaText.trim(),
          ctaUrl: form.ctaUrl.trim(),
          bg: form.bg,
          fg: form.fg,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="admin-page__title">Promo Bar</h1>
      <p className="admin-help">
        The promo bar appears above the main navigation on every page. Editing and saving here re-shows it to
        everyone — including visitors who previously dismissed it. Toggle it off to hide it entirely.
      </p>

      <form className="admin-form" onSubmit={save}>
        <label className="admin-check">
          <input type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} />
          <span>Show the promo bar</span>
        </label>

        <label className="admin-field">
          <span>Headline</span>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="2 Free Nights, Going Fast"
            maxLength={70}
          />
        </label>

        <label className="admin-field">
          <span>Message</span>
          <input
            type="text"
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            placeholder="This week only — RSVP before they fill up."
            maxLength={140}
          />
        </label>

        <div className="admin-field-row">
          <label className="admin-field">
            <span>Button text</span>
            <input type="text" value={form.ctaText} onChange={(e) => update('ctaText', e.target.value)} placeholder="RSVP Free" maxLength={30} />
          </label>
          <label className="admin-field">
            <span>Button link</span>
            <input type="url" value={form.ctaUrl} onChange={(e) => update('ctaUrl', e.target.value)} placeholder="https://…" />
          </label>
        </div>

        <div className="admin-field-row">
          <label className="admin-field admin-field--color">
            <span>Background</span>
            <input type="color" value={form.bg} onChange={(e) => update('bg', e.target.value)} />
          </label>
          <label className="admin-field admin-field--color">
            <span>Text color</span>
            <input type="color" value={form.fg} onChange={(e) => update('fg', e.target.value)} />
          </label>
        </div>

        {/* Live preview */}
        <div className="admin-promo-preview" style={{ background: form.bg, color: form.fg }}>
          <div className="admin-promo-preview__text">
            {form.title && <strong>{form.title}</strong>}
            {form.message && <span>{form.message}</span>}
          </div>
          {form.ctaText && <span className="admin-promo-preview__cta" style={{ borderColor: form.fg }}>{form.ctaText}</span>}
        </div>

        <div className="admin-form__actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save promo bar'}
          </button>
          {saved && <span className="admin-saved">Saved ✓</span>}
        </div>
      </form>
    </div>
  );
}
