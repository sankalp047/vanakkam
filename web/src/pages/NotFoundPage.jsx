import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="container page-content" style={{ paddingTop: '10rem', textAlign: 'center' }}>
      <h1>404</h1>
      <p>This page wandered off air.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
        Back home
      </Link>
    </div>
  );
}
