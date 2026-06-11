import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useContext } from 'react';

import { AuthContext } from '@/context/authContext';

const ProtectedRoute = () => {
  const location = useLocation()
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" state={{from: location,}} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
