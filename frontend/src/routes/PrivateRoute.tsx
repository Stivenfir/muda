import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/storage';

interface PrivateRouteProps {
  children: ReactElement;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;