import { useEffect, useState } from 'react';
import { getHealth } from '../services/healthService';
import type { HealthResponse } from '../types/health.types';

export const useHealth = () => {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getHealth();
      setData(response);
    } catch (err) {
      setError('No fue posible consultar el health del backend');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  return {
    data,
    loading,
    error,
    reload: loadHealth,
  };
};