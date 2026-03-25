import { useEffect, useState } from 'react';
import { getProfile, loginRequest } from '../services/authService';
import { getToken, removeToken, setToken } from '../utils/storage';
import type {
  LoginRequest,
  LoginResponse,
  ProfileResponse,
} from '../types/auth.types';

export const useAuth = () => {
  const [user, setUser] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      const token = getToken();

      if (!token) {
        setUser(null);
        return;
      }

      const profile = await getProfile();
      setUser(profile);
    } catch (err) {
      console.error(err);
      removeToken();
      setUser(null);
    } finally {
      setCheckingSession(false);
    }
  };

  const login = async (payload: LoginRequest): Promise<LoginResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await loginRequest(payload);
      setToken(response.access_token);

      const profile = await getProfile();
      setUser(profile);

      return response;
    } catch (err) {
      console.error(err);
      setError('Credenciales inválidas');
      return null;
    } finally {
      setLoading(false);
      setCheckingSession(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    user,
    loading,
    checkingSession,
    error,
    isAuthenticated: !!getToken(),
    login,
    logout,
  };
};