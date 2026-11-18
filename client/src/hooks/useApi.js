import { useState, useCallback } from 'react';
import axiosInstance from '../utils/api';

export const useApi = (url, method = 'GET', initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (config = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance({
          url,
          method,
          ...config,
        });
        setData(response);
        return response;
      } catch (err) {
        setError(err.message || 'An error occurred');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, method]
  );

  return { data, loading, error, request };
};
