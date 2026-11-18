import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ROLE_DASHBOARDS = {
  student: '/student/dashboard',
  graduate: '/student/dashboard',
  job_seeker: '/student/dashboard',
  employer: '/employer/dashboard',
  admin: '/admin/dashboard',
  super_admin: '/admin/dashboard',
};

export default function ProtectedRoute({ children, roles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-3" />
          <p className="text-text-light text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to their own dashboard instead of showing 403
    return <Navigate to={ROLE_DASHBOARDS[user.role] || '/'} replace />;
  }

  return children;
}
