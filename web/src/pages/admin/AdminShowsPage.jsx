import { useEffect, useState } from 'react';
import { deleteDoc, doc, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePodcasts } from '../../hooks/usePodcasts';
import { db, storage } from '../../firebase';
import { mergeRoster, slugify } from '../../lib/rosterMerge';
import './admin-shared.css';
import './AdminShowsPage.css';

function formatDate(timestamp) {
  const millis = timestamp?.toMillis?.();
  if (!millis) return 'Never';
  return new Date(millis).toLocaleString();
}

async function uploadShowImage(slug, file) {
  const ext = file.name.split('.').pop() || 'jpg';
  const storageRef = ref(storage, `rj-images/${slug}/cover.${ext}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

function ShowEditor({ show }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: show.slug });

  const [form, setForm] = useState({
    name: show.name,
    show: show.show,
    time: show.time,
    days: show.days,
    bio: show.bio || '',
    feedUrl: show.feedUrl || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  // Re-seed from Firestore when the doc changes while this row is collapsed
  // (e.g. an episode sync lands), without clobbering in-progress edits.
  useEffect(() => {
    if (open) return;
    setForm({
      name: show.name,
      show: show.show,
      time: show.time,
      days: show.days,
      bio: show.bio || '',
      feedUrl: show.feedUrl || '',
    });
  }, [open, show.name, show.show, show.time, show.days, show.bio, show.feedUrl]);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setMessage('');
  };

  const write = (data) =>
    setDoc(doc(db, 'podcasts', show.slug), { slug: show.slug, ...data, updatedAt: serverTimestamp() }, { merge: true });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await write({
        nameOverride: form.name.trim(),
        showOverride: form.show.trim(),
        timeOverride: form.time.trim(),
        daysOverride: form.days.trim(),
        bioOverride: form.bio.trim(),
        feedUrlOverride: form.feedUrl.trim(),
      });
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
    setBusy(true);
    setMessage('');
    try {
      const url = await uploadShowImage(show.slug, file);
      await write({ imageOverride: url });
      setMessage('Image updated ✓');
    } catch (err) {
      setMessage('Upload failed: ' + err.message);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const resetImage = async () => {
    if (!confirm(`Reset ${show.name}'s image back to the default?`)) return;
    await write({ imageOverride: null });
    setMessage('Image reset ✓');
  };

  const toggleHidden = async () => {
    await write({ hidden: !show.hidden });
  };

  const removeShow = async () => {
    if (!confirm(`Permanently delete "${show.show}"? This can't be undone.`)) return;
    await deleteDoc(doc(db, 'podcasts', show.slug));
  };

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`show-editor ${open ? 'show-editor--open' : ''} ${show.hidden ? 'show-editor--hidden' : ''}`}
    >
      <div className="show-editor__head">
        <button
          type="button"
          className="show-editor__drag"
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${show.name}`}
        >
          ⠿
        </button>

        <button type="button" className="show-editor__summary" onClick={() => setOpen((v) => !v)}>
          <img src={show.image} alt="" className="show-editor__thumb" />
          <span className="show-editor__head-text">
            <strong>{show.name}</strong>
            <span>
              {show.show} · {show.time}
            </span>
          </span>
          <span className="show-editor__meta">
            {show.hidden && <span className="admin-badge">Hidden</span>}
            {show.isCustom && <span className="admin-badge">Added</span>}
            {show.lastSyncStatus === 'error' && <span className="admin-badge admin-badge--error">Sync error</span>}
            <span>{show.episodes.length} eps</span>
          </span>
          <span className="show-editor__chevron">{open ? '▲' : '▼'}</span>
        </button>
      </div>

      {open && (
        <form className="show-editor__body" onSubmit={save}>
          <div className="show-editor__image-row">
            <img src={show.image} alt="" className="show-editor__preview" />
            <div className="show-editor__image-actions">
              <label className="admin-field">
                <span>Replace image</span>
                <input type="file" accept="image/*" onChange={handleImage} disabled={busy} />
              </label>
              {show.image && !show.image.startsWith('/') && (
                <button type="button" className="show-editor__link-btn" onClick={resetImage}>
                  Reset to default image
                </button>
              )}
              {busy && <p className="admin-note">Uploading…</p>}
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
              <input type="text" value={form.time} onChange={(e) => update('time', e.target.value)} placeholder="11am to 2pm" />
            </label>
            <label className="admin-field">
              <span>Days</span>
              <input type="text" value={form.days} onChange={(e) => update('days', e.target.value)} placeholder="Monday to Friday" />
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
            Where episodes are pulled from every 30 minutes. Leave blank if this show has no podcast feed.
          </p>

          <div className="admin-form__actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button type="button" className="show-editor__link-btn" onClick={toggleHidden}>
              {show.hidden ? 'Show on site' : 'Hide from site'}
            </button>
            {show.isCustom && (
              <button type="button" className="show-editor__link-btn show-editor__link-btn--danger" onClick={removeShow}>
                Delete permanently
              </button>
            )}
            {message && <span className="admin-saved">{message}</span>}
          </div>

          <p className="admin-note">Last episode sync: {formatDate(show.lastSyncedAt)}</p>
        </form>
      )}
    </div>
  );
}

const EMPTY_NEW_SHOW = { name: '', show: '', time: '', days: '', bio: '', feedUrl: '', file: null };

function AddShowForm({ existingSlugs, nextOrder }) {
  const [form, setForm] = useState(EMPTY_NEW_SHOW);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.show.trim()) {
      setError('RJ name and show name are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const slug = slugify(form.name, existingSlugs);
      let imageOverride = null;
      if (form.file) imageOverride = await uploadShowImage(slug, form.file);

      await setDoc(doc(db, 'podcasts', slug), {
        slug,
        isCustom: true,
        hidden: false,
        order: nextOrder,
        nameOverride: form.name.trim(),
        showOverride: form.show.trim(),
        timeOverride: form.time.trim(),
        daysOverride: form.days.trim(),
        bioOverride: form.bio.trim(),
        feedUrlOverride: form.feedUrl.trim(),
        imageOverride,
        episodes: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setForm(EMPTY_NEW_SHOW);
      setOpen(false);
    } catch (err) {
      setError('Could not add the show: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button type="button" className="btn btn-primary add-show__trigger" onClick={() => setOpen(true)}>
        + Add a show
      </button>
    );
  }

  return (
    <form className="admin-card admin-form add-show" onSubmit={submit}>
      <h2 className="add-show__title">New show</h2>
      {error && <p className="banner-form__error">{error}</p>}

      <div className="admin-field-row">
        <label className="admin-field">
          <span>RJ name *</span>
          <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Kavya" />
        </label>
        <label className="admin-field">
          <span>Show name *</span>
          <input type="text" value={form.show} onChange={(e) => update('show', e.target.value)} placeholder="Morning Masala" />
        </label>
      </div>

      <div className="admin-field-row">
        <label className="admin-field">
          <span>Time slot</span>
          <input type="text" value={form.time} onChange={(e) => update('time', e.target.value)} placeholder="6am to 9am" />
        </label>
        <label className="admin-field">
          <span>Days</span>
          <input type="text" value={form.days} onChange={(e) => update('days', e.target.value)} placeholder="Monday to Friday" />
        </label>
      </div>

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
          placeholder="https://…json (optional)"
        />
      </label>

      <label className="admin-field">
        <span>Photo</span>
        <input type="file" accept="image/*" onChange={(e) => update('file', e.target.files?.[0] || null)} />
      </label>

      <div className="admin-form__actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Adding…' : 'Add show'}
        </button>
        <button type="button" className="show-editor__link-btn" onClick={() => { setOpen(false); setForm(EMPTY_NEW_SHOW); }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export function AdminShowsPage() {
  const { podcasts } = usePodcasts();
  const shows = mergeRoster(podcasts, { includeHidden: true });
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = shows.findIndex((s) => s.slug === active.id);
    const newIndex = shows.findIndex((s) => s.slug === over.id);
    const reordered = arrayMove(shows, oldIndex, newIndex);

    // Persist an explicit order for every row so the new sequence sticks
    // even for shows that had only an implicit built-in position.
    const batch = writeBatch(db);
    reordered.forEach((show, index) => {
      batch.set(
        doc(db, 'podcasts', show.slug),
        { slug: show.slug, order: index, updatedAt: serverTimestamp() },
        { merge: true },
      );
    });
    await batch.commit();
  };

  return (
    <div>
      <h1 className="admin-page__title">Shows &amp; RJs</h1>
      <p className="admin-help">
        Add, edit, reorder, hide, or remove any show. Drag the ⠿ handle to change the order they appear in across the
        site. Changes go live immediately — no redeploy.
      </p>

      <AddShowForm existingSlugs={shows.map((s) => s.slug)} nextOrder={shows.length} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={shows.map((s) => s.slug)} strategy={verticalListSortingStrategy}>
          <div className="show-editor-list">
            {shows.map((show) => (
              <ShowEditor key={show.slug} show={show} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
