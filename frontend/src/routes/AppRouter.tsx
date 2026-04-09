import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import CommercialFlowPage from '../pages/commercial/CommercialFlowPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import PrivateRoute from './PrivateRoute';
import { getToken } from '../utils/storage';

function AppRouter() {
  const hasSession = Boolean(getToken());

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={hasSession ? '/dashboard' : '/login'} replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/comercial"
          element={
            <PrivateRoute>
              <CommercialFlowPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to={hasSession ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
