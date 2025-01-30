import axios from 'axios';
import { useSettings } from '../contexts/SettingsContext';

export const createApiClient = () => {
  const { settings } = useSettings();
  
  const instance = axios.create({
    baseURL: settings.apiBaseUrl,
    timeout: 10000,
  });

  instance.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        return Promise.reject(error.response.data);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const useApiClient = () => {
  const apiClient = createApiClient();
  return apiClient;
};