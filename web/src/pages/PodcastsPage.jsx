import { useState } from 'react';
import { usePodcasts } from '../hooks/usePodcasts';
import { RJGrid } from '../components/podcasts/RJGrid';
import { EpisodesPanel } from '../components/podcasts/EpisodesPanel';
import { RJBioModal } from '../components/shared/RJBioModal';
import './PodcastsPage.css';

export function PodcastsPage() {
  const { podcasts, status } = usePodcasts();
  const [selectedRj, setSelectedRj] = useState(null);
  const [bioRj, setBioRj] = useState(null);

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

        <RJGrid podcasts={podcasts} onSelect={setSelectedRj} onShowBio={setBioRj} />
      </div>

      {selectedRj && <EpisodesPanel rj={selectedRj} onClose={() => setSelectedRj(null)} />}
      <RJBioModal rj={bioRj} onClose={() => setBioRj(null)} />
    </div>
  );
}
