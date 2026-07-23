import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { usePodcasts } from '../../hooks/usePodcasts';
import { db } from '../../firebase';
import { RJ_ROSTER } from '../../lib/rjRoster';
import './admin-shared.css';

function formatDate(timestamp) {
  const millis = timestamp?.toMillis?.();
  if (!millis) return 'Never';
  return new Date(millis).toLocaleString();
}

export function AdminPodcastsPage() {
  const { podcasts } = usePodcasts();
  const [selectedSlug, setSelectedSlug] = useState('');
  const [selectedGuid, setSelectedGuid] = useState('');
  const [overrideUrl, setOverrideUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const bySlug = new Map(podcasts.map((p) => [p.slug, p]));
  const selected = bySlug.get(selectedSlug);
  const episodes = selected?.episodes || [];

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedSlug || !selectedGuid || !overrideUrl.trim()) return;
    setSaving(true);
    setMessage('');
    try {
      await setDoc(
        doc(db, 'podcasts', selectedSlug),
        { episodeOverrides: { [selectedGuid]: { image: overrideUrl.trim() } } },
        { merge: true },
      );
      setMessage('Artwork override saved.');
      setOverrideUrl('');
    } catch {
      setMessage('Failed to save override.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="admin-page__title">Podcast Sync Status</h1>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>RJ</th>
              <th>Episodes</th>
              <th>Last Synced</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {RJ_ROSTER.map((rj) => {
              const doc = bySlug.get(rj.slug);
              return (
                <tr key={rj.slug}>
                  <td>{rj.name}</td>
                  <td>{doc?.episodes?.length ?? 0}</td>
                  <td>{formatDate(doc?.lastSyncedAt)}</td>
                  <td>
                    {!doc ? (
                      <span className="admin-badge">Not synced yet</span>
                    ) : doc.lastSyncStatus === 'error' ? (
                      <span className="admin-badge admin-badge--error" title={doc.lastSyncError}>
                        Error
                      </span>
                    ) : (
                      <span className="admin-badge admin-badge--ok">OK</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 className="admin-section-title">Episode Artwork Override</h2>
      <form className="admin-card admin-form" onSubmit={handleSave}>
        {message && <p className="admin-note">{message}</p>}

        <label className="admin-field">
          <span>RJ</span>
          <select
            className="admin-select"
            value={selectedSlug}
            onChange={(e) => {
              setSelectedSlug(e.target.value);
              setSelectedGuid('');
            }}
          >
            <option value="">Select an RJ…</option>
            {RJ_ROSTER.map((rj) => (
              <option key={rj.slug} value={rj.slug}>
                {rj.name}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-field">
          <span>Episode</span>
          <select
            className="admin-select"
            value={selectedGuid}
            onChange={(e) => setSelectedGuid(e.target.value)}
            disabled={!episodes.length}
          >
            <option value="">Select an episode…</option>
            {episodes.map((ep) => (
              <option key={ep.guid} value={ep.guid}>
                {ep.title}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-field">
          <span>Artwork URL</span>
          <input
            type="url"
            value={overrideUrl}
            onChange={(e) => setOverrideUrl(e.target.value)}
            placeholder="https://…"
          />
        </label>

        <button type="submit" className="btn btn-primary" disabled={saving || !selectedGuid || !overrideUrl.trim()}>
          {saving ? 'Saving…' : 'Save Override'}
        </button>
      </form>
    </div>
  );
}
