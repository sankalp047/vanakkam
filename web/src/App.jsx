import { Route, Routes } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerProvider';
import { AuthProvider } from './context/AuthProvider';
import { PromoBar } from './components/layout/PromoBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AdminGuard } from './components/layout/AdminGuard';
import { AdminLayout } from './components/layout/AdminLayout';
import { LiveStreamBar } from './components/player/LiveStreamBar';
import { PodcastMiniPlayer } from './components/player/PodcastMiniPlayer';
import { HomePage } from './pages/HomePage';
import { PodcastsPage } from './pages/PodcastsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminBannersPage } from './pages/admin/AdminBannersPage';
import { AdminPromoPage } from './pages/admin/AdminPromoPage';
import { AdminPodcastsPage } from './pages/admin/AdminPodcastsPage';
import { AdminInboxPage } from './pages/admin/AdminInboxPage';

function SiteLayout({ children }) {
  return (
    <>
      <PromoBar />
      <Navbar />
      <LiveStreamBar />
      <main className="site-main">{children}</main>
      <Footer />
      <PodcastMiniPlayer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Routes>
          <Route path="/" element={<SiteLayout><HomePage /></SiteLayout>} />
          <Route path="/podcasts" element={<SiteLayout><PodcastsPage /></SiteLayout>} />

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="banners" element={<AdminBannersPage />} />
              <Route path="promo" element={<AdminPromoPage />} />
              <Route path="podcasts" element={<AdminPodcastsPage />} />
              <Route path="inbox" element={<AdminInboxPage />} />
            </Route>
          </Route>

          <Route path="*" element={<SiteLayout><NotFoundPage /></SiteLayout>} />
        </Routes>
      </PlayerProvider>
    </AuthProvider>
  );
}
