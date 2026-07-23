import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import './AdminLoginPage.css';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.34A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.02-2.34z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.9 11.42 0 9 0A9 9 0 0 0 .96 4.94l3.02 2.34C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}

export function AdminLoginPage() {
  const { user, isAdmin, loading, loginWithGoogle, logout } = useAuthContext();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleGoogle = async () => {
    setError('');
    setSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        setError('');
      } else if (err?.code === 'auth/operation-not-allowed' || err?.code === 'auth/configuration-not-found') {
        setError('Google sign-in isn’t enabled for this project yet.');
      } else {
        setError('Sign-in failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const signedInNotAdmin = !loading && user && !isAdmin;

  return (
    <div className="admin-login">
      <aside className="admin-login__brand">
        <img src="/logo.png" alt="Vanakkam FM" className="admin-login__brand-logo" />
        <div className="admin-login__brand-body">
          <span className="admin-login__brand-kicker">Station Dashboard</span>
          <h1 className="admin-login__brand-title">
            Run the airwaves.
            <br />
            Manage every show.
          </h1>
          <p className="admin-login__brand-text">
            Promo bar, sponsor banners, podcast artwork and the contact inbox — all in one place, staff-only.
          </p>
        </div>
        <span className="admin-login__brand-foot">104.9 HD2 · Dallas–Fort Worth</span>
      </aside>

      <main className="admin-login__panel">
        <div className="admin-login__card">
          <span className="admin-login__eyebrow">Admin Access</span>
          <h2 className="admin-login__heading">Sign in to continue</h2>
          <p className="admin-login__sub">Use your authorized Vanakkam FM Google account.</p>

          {error && <div className="admin-login__error">{error}</div>}

          {signedInNotAdmin ? (
            <div className="admin-login__denied">
              <p>
                <strong>{user.email}</strong> isn’t authorized for the dashboard.
              </p>
              <button type="button" className="btn btn-secondary admin-login__google" onClick={logout}>
                Sign out &amp; try another account
              </button>
            </div>
          ) : (
            <button type="button" className="admin-login__google" onClick={handleGoogle} disabled={submitting || loading}>
              <GoogleIcon />
              <span>{submitting ? 'Opening Google…' : 'Continue with Google'}</span>
            </button>
          )}

          <p className="admin-login__note">Access is limited to station staff accounts.</p>
        </div>
      </main>
    </div>
  );
}
