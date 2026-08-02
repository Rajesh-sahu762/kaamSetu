import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useContext } from 'react';

import { AuthContext } from '@/context/authContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation()
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" state={{from: location,}} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
