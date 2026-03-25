import { api } from './api';
import type { HealthResponse } from '../types/health.types';

export const getHealth = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>('/health');
  return response.data;
};