import { Navigate, Outlet } from 'react-router-dom';

/**
 * Wraps authenticated routes.
 * Redirects to /login when no JWT token is found in localStorage.
 *
 * This is a frontend-only guard; the backend remains the real security
 * boundary and will reject requests with missing or invalid tokens.
 */
export const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
