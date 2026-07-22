import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

export function AdminGuard() {
  const { user, isAdmin, loading } = useAuthContext();

  if (loading) {
    return <div className="admin-guard-loading">Loading…</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
