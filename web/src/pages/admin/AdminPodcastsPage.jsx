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

      <div className="admin-table-wrap" style={{ marginBottom: 'var(--space-xl)' }}>
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

      <h2 style={{ marginBottom: 'var(--space-sm)' }}>Episode Artwork Override</h2>
      <form className="admin-card" onSubmit={handleSave} style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {message && <p style={{ color: 'var(--color-text-secondary)' }}>{message}</p>}

        <label>
          RJ
          <select
            value={selectedSlug}
            onChange={(e) => {
              setSelectedSlug(e.target.value);
              setSelectedGuid('');
            }}
            style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.6rem', borderRadius: 8 }}
          >
            <option value="">Select an RJ…</option>
            {RJ_ROSTER.map((rj) => (
              <option key={rj.slug} value={rj.slug}>
                {rj.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Episode
          <select
            value={selectedGuid}
            onChange={(e) => setSelectedGuid(e.target.value)}
            disabled={!episodes.length}
            style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.6rem', borderRadius: 8 }}
          >
            <option value="">Select an episode…</option>
            {episodes.map((ep) => (
              <option key={ep.guid} value={ep.guid}>
                {ep.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Artwork URL
          <input
            type="url"
            value={overrideUrl}
            onChange={(e) => setOverrideUrl(e.target.value)}
            placeholder="https://…"
            style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.6rem', borderRadius: 8 }}
          />
        </label>

        <button type="submit" className="btn btn-primary" disabled={saving || !selectedGuid || !overrideUrl.trim()}>
          {saving ? 'Saving…' : 'Save Override'}
        </button>
      </form>
    </div>
  );
}
