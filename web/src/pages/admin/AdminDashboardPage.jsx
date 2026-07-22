import { useBanners } from '../../hooks/useBanners';
import { usePodcasts } from '../../hooks/usePodcasts';
import { useContactMessages } from '../../hooks/useContactMessages';
import '../admin/admin-shared.css';

export function AdminDashboardPage() {
  const { banners } = useBanners();
  const { podcasts } = usePodcasts();
  const { messages } = useContactMessages();

  const activeBanners = banners.filter((b) => b.active).length;
  const syncErrors = podcasts.filter((p) => p.lastSyncStatus === 'error').length;
  const lastSynced = podcasts
    .map((p) => p.lastSyncedAt?.toMillis?.())
    .filter(Boolean)
    .sort((a, b) => b - a)[0];

  return (
    <div>
      <h1 className="admin-page__title">Dashboard</h1>
      <div className="admin-cards">
        <div className="admin-card">
          <div className="admin-card__value">{activeBanners}</div>
          <div className="admin-card__label">Active Banners ({banners.length} total)</div>
        </div>
        <div className="admin-card">
          <div className="admin-card__value">{podcasts.length}/10</div>
          <div className="admin-card__label">RJ Feeds Synced</div>
        </div>
        <div className="admin-card">
          <div className="admin-card__value">{syncErrors}</div>
          <div className="admin-card__label">Feeds With Sync Errors</div>
        </div>
        <div className="admin-card">
          <div className="admin-card__value">{messages.length}</div>
          <div className="admin-card__label">Contact Messages</div>
        </div>
      </div>
      {lastSynced && (
        <p style={{ color: 'var(--color-text-muted)' }}>
          Last podcast sync: {new Date(lastSynced).toLocaleString()}
        </p>
      )}
    </div>
  );
}
