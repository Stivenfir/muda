import axios from 'axios';
import { useEffect, useState } from 'react';
import { getProfile, loginRequest, logoutRequest } from '../services/authService';
import {
  getRefreshToken,
  getToken,
  removeRefreshToken,
  removeToken,
  setRefreshToken,
  setToken,
} from '../utils/storage';
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
      removeRefreshToken();
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
      setRefreshToken(response.refresh_token);

      const profile = await getProfile();
      setUser(profile);

      return response;
    } catch (err) {
      console.error(err);
      removeToken();
      removeRefreshToken();

      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError(
            'El backend tardó demasiado en responder. Verifica que el servicio API esté activo.',
          );
        } else if (!err.response) {
          setError('No hay conexión con el backend. Revisa API y CORS.');
        } else if (err.response.status === 401) {
          setError('Credenciales inválidas');
        } else {
          setError(`Error de autenticación (${err.response.status}).`);
        }
      } else {
        setError('No se pudo iniciar sesión. Intenta nuevamente.');
      }

      return null;
    } finally {
      setLoading(false);
      setCheckingSession(false);
    }
  };

  const logout = async () => {
    const refreshToken = getRefreshToken() || undefined;

    try {
      await logoutRequest(refreshToken);
    } catch (err) {
      console.error(err);
    }

    removeRefreshToken();
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
