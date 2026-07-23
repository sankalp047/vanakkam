import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import './AdminLayout.css';

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/banners', label: 'Banners' },
  { to: '/admin/promo', label: 'Promo Bar' },
  { to: '/admin/podcasts', label: 'Podcasts' },
  { to: '/admin/inbox', label: 'Inbox' },
];

export function AdminLayout() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <div className="admin-layout__brand">
          <img src="/logo.png" alt="Vanakkam FM" />
          <span className="admin-layout__brand-tag">Admin</span>
        </div>
        <nav className="admin-layout__nav">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `admin-layout__link ${isActive ? 'admin-layout__link--active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-layout__footer">
          <span className="admin-layout__email">{user?.email}</span>
          <button type="button" className="admin-layout__logout" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="admin-layout__content">
        <Outlet />
      </main>
    </div>
  );
}
