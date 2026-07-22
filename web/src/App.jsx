import { Route, Routes } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerProvider';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LiveStreamBar } from './components/player/LiveStreamBar';
import { PodcastMiniPlayer } from './components/player/PodcastMiniPlayer';
import { HomePage } from './pages/HomePage';
import { PodcastsPage } from './pages/PodcastsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <PlayerProvider>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/podcasts" element={<PodcastsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <PodcastMiniPlayer />
      <LiveStreamBar />
    </PlayerProvider>
  );
}
