import { api } from './api';
import type { AppInfoResponse } from '../types/appInfo.types';

export const getAppInfo = async (): Promise<AppInfoResponse> => {
  const response = await api.get<AppInfoResponse>('/app-info');
  return response.data;
};