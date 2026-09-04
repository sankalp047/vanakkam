import './RJBioModal.css';

export function RJBioModal({ rj, onClose }) {
  if (!rj) return null;

  return (
    <div className="rj-bio-overlay" onClick={onClose}>
      <div className="rj-bio-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="rj-bio-modal__close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <img src={rj.image} alt="" className="rj-bio-modal__image" loading="lazy" decoding="async" />
        <h3>{rj.name}</h3>
        <p className="rj-bio-modal__show">{rj.show}</p>
        <p className="rj-bio-modal__schedule">
          {rj.days} · {rj.time}
        </p>
        {rj.bio && <p className="rj-bio-modal__bio">{rj.bio}</p>}
      </div>
    </div>
  );
}
