import { useEffect, useState } from 'react';
import { getAppInfo } from '../services/appInfoService';
import type { AppInfoResponse } from '../types/appInfo.types';

export const useAppInfo = () => {
  const [data, setData] = useState<AppInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAppInfo();
      setData(response);
    } catch (err) {
      setError('No fue posible consultar la información de la API');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppInfo();
  }, []);

  return {
    data,
    loading,
    error,
    reload: loadAppInfo,
  };
};