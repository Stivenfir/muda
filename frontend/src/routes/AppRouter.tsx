import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import ProfilePage from '../pages/system/ProfilePage';
import PrivateRoute from './PrivateRoute';
import { getToken } from '../utils/storage';

function AppRouter() {
  const hasSession = Boolean(getToken());

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={hasSession ? '/profile' : '/login'} replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to={hasSession ? '/profile' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
