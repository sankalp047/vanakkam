import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRoster } from '../hooks/useRoster';
import { RJGrid } from '../components/podcasts/RJGrid';
import { EpisodesPanel } from '../components/podcasts/EpisodesPanel';
import { RJBioModal } from '../components/shared/RJBioModal';
import './PodcastsPage.css';

export function PodcastsPage() {
  const { roster, status } = useRoster();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRj, setSelectedRj] = useState(null);
  const [bioRj, setBioRj] = useState(null);

  // Deep link: /podcasts?show=rj-janani opens that show's episodes directly,
  // so clicking a card on the home page lands people on the episode list
  // instead of the grid. Only auto-opens once per slug, so closing the panel
  // doesn't immediately re-open it.
  const requestedSlug = searchParams.get('show');
  const autoOpenedFor = useRef(null);

  useEffect(() => {
    if (!requestedSlug || roster.length === 0) return;
    if (autoOpenedFor.current === requestedSlug) return;
    const match = roster.find((rj) => rj.slug === requestedSlug);
    if (match) {
      autoOpenedFor.current = requestedSlug;
      setSelectedRj(match);
    }
  }, [requestedSlug, roster]);

  // Keep the panel showing fresh data if a sync lands while it's open.
  useEffect(() => {
    if (!selectedRj) return;
    const fresh = roster.find((rj) => rj.slug === selectedRj.slug);
    if (fresh && fresh !== selectedRj) setSelectedRj(fresh);
  }, [roster, selectedRj]);

  const closePanel = useCallback(() => {
    setSelectedRj(null);
    if (searchParams.has('show')) {
      const next = new URLSearchParams(searchParams);
      next.delete('show');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="page-content podcasts-page">
      <div className="container">
        <div className="section-header podcasts-page__header">
          <span className="section-tag">On Demand</span>
          <h1>
            Browse <span className="highlight">Podcasts</span>
          </h1>
          <p className="section-desc">
            Missed a show? Catch up on any Radio Jockey's recent episodes anytime — synced straight from our
            broadcast archive.
          </p>
        </div>

        {status === 'error' && (
          <p className="podcasts-page__status">Couldn't load podcasts right now. Please try again shortly.</p>
        )}

        <RJGrid shows={roster} onSelect={setSelectedRj} onShowBio={setBioRj} />
      </div>

      {selectedRj && <EpisodesPanel rj={selectedRj} onClose={closePanel} />}
      <RJBioModal rj={bioRj} onClose={() => setBioRj(null)} />
    </div>
  );
}
