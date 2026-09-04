import { useEffect, useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { usePodcasts } from '../../hooks/usePodcasts';
import { db, storage } from '../../firebase';
import { RJ_ROSTER } from '../../lib/rjRoster';
import { mergeRjEntry } from '../../lib/rosterMerge';
import './admin-shared.css';
import './AdminShowsPage.css';

function formatDate(timestamp) {
  const millis = timestamp?.toMillis?.();
  if (!millis) return 'Never';
  return new Date(millis).toLocaleString();
}

function ShowEditor({ rosterEntry, podcastDoc }) {
  const merged = mergeRjEntry(rosterEntry, podcastDoc);

  const [form, setForm] = useState({
    name: merged.name,
    show: merged.show,
    time: merged.time,
    days: merged.days,
    bio: merged.bio || '',
    feedUrl: merged.feedUrl || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);

  // Re-seed the form if the underlying doc changes (e.g. a sync lands)
  // while this editor is closed.
  useEffect(() => {
    if (open) return;
    setForm({
      name: merged.name,
      show: merged.show,
      time: merged.time,
      days: merged.days,
      bio: merged.bio || '',
      feedUrl: merged.feedUrl || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podcastDoc, open]);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setMessage('');
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await setDoc(
        doc(db, 'podcasts', rosterEntry.slug),
        {
          slug: rosterEntry.slug,
          nameOverride: form.name.trim(),
          showOverride: form.show.trim(),
          timeOverride: form.time.trim(),
          daysOverride: form.days.trim(),
          bioOverride: form.bio.trim(),
          feedUrlOverride: form.feedUrl.trim(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      setMessage('Saved ✓');
    } catch (err) {
      setMessage('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage('');
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const storageRef = ref(storage, `rj-images/${rosterEntry.slug}/cover.${ext}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await setDoc(
        doc(db, 'podcasts', rosterEntry.slug),
        { slug: rosterEntry.slug, imageOverride: url, updatedAt: serverTimestamp() },
        { merge: true },
      );
      setMessage('Image updated ✓');
    } catch (err) {
      setMessage('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const resetImage = async () => {
    if (!confirm(`Reset ${merged.name}'s image back to the default?`)) return;
    await setDoc(
      doc(db, 'podcasts', rosterEntry.slug),
      { slug: rosterEntry.slug, imageOverride: null, updatedAt: serverTimestamp() },
      { merge: true },
    );
    setMessage('Image reset ✓');
  };

  return (
    <div className={`show-editor ${open ? 'show-editor--open' : ''}`}>
      <button type="button" className="show-editor__head" onClick={() => setOpen((v) => !v)}>
        <img src={merged.image} alt="" className="show-editor__thumb" />
        <span className="show-editor__head-text">
          <strong>{merged.name}</strong>
          <span>
            {merged.show} · {merged.time}
          </span>
        </span>
        <span className="show-editor__meta">
          {merged.episodes.length} eps
          {merged.lastSyncStatus === 'error' && <span className="admin-badge admin-badge--error">Sync error</span>}
        </span>
        <span className="show-editor__chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <form className="show-editor__body" onSubmit={save}>
          <div className="show-editor__image-row">
            <img src={merged.image} alt="" className="show-editor__preview" />
            <div className="show-editor__image-actions">
              <label className="admin-field">
                <span>Replace image</span>
                <input type="file" accept="image/*" onChange={handleImage} disabled={uploading} />
              </label>
              {podcastDoc?.imageOverride && (
                <button type="button" className="show-editor__reset" onClick={resetImage}>
                  Reset to default image
                </button>
              )}
              {uploading && <p className="admin-note">Uploading…</p>}
            </div>
          </div>

          <div className="admin-field-row">
            <label className="admin-field">
              <span>RJ name</span>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} />
            </label>
            <label className="admin-field">
              <span>Show name</span>
              <input type="text" value={form.show} onChange={(e) => update('show', e.target.value)} />
            </label>
          </div>

          <div className="admin-field-row">
            <label className="admin-field">
              <span>Time slot</span>
              <input
                type="text"
                value={form.time}
                onChange={(e) => update('time', e.target.value)}
                placeholder="11am to 2pm"
              />
            </label>
            <label className="admin-field">
              <span>Days</span>
              <input
                type="text"
                value={form.days}
                onChange={(e) => update('days', e.target.value)}
                placeholder="Monday to Friday"
              />
            </label>
          </div>
          <p className="admin-note">
            Time and days drive the schedule grid and the “On air now” banner. Keep the same wording style
            (“11am to 2pm”, “Monday to Friday”, “Saturday and Sunday”) so they parse correctly.
          </p>

          <label className="admin-field">
            <span>Bio</span>
            <input type="text" value={form.bio} onChange={(e) => update('bio', e.target.value)} />
          </label>

          <label className="admin-field">
            <span>Podcast feed / stream URL</span>
            <input
              type="url"
              value={form.feedUrl}
              onChange={(e) => update('feedUrl', e.target.value)}
              placeholder="https://funasia-rss.streamguys1.com/funasia/…json"
            />
          </label>
          <p className="admin-note">
            Where episodes are pulled from every 30 minutes. Only change this if the StreamGuys feed URL for this
            show has actually moved — a wrong URL stops new episodes from arriving.
          </p>

          <div className="admin-form__actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {message && <span className="admin-saved">{message}</span>}
          </div>

          <p className="admin-note">Last episode sync: {formatDate(merged.lastSyncedAt)}</p>
        </form>
      )}
    </div>
  );
}

export function AdminShowsPage() {
  const { podcasts } = usePodcasts();
  const bySlug = new Map(podcasts.map((p) => [p.slug, p]));

  return (
    <div>
      <h1 className="admin-page__title">Shows &amp; RJs</h1>
      <p className="admin-help">
        Edit any show’s image, RJ name, show name, time slot, days, bio, and feed URL. Changes go live on the site
        immediately — no redeploy. Leave a field blank to fall back to its built-in default.
      </p>

      <div className="show-editor-list">
        {RJ_ROSTER.map((entry) => (
          <ShowEditor key={entry.slug} rosterEntry={entry} podcastDoc={bySlug.get(entry.slug)} />
        ))}
      </div>
    </div>
  );
}
