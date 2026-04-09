import { api } from './api';
import type { ComercialDashboardResponse } from '../types/mudanzasDashboard.types';

export const getComercialDashboard = async (): Promise<ComercialDashboardResponse> => {
  const response = await api.get<ComercialDashboardResponse>('/mudanzas/dashboard/comercial');
  return response.data;
};
