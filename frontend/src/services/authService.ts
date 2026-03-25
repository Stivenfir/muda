import { api } from './api';
import type {
  LoginRequest,
  LoginResponse,
  ProfileResponse,
} from '../types/auth.types';

export const loginRequest = async (
  payload: LoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', payload);
  return response.data;
};

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>('/auth/profile');
  return response.data;
};