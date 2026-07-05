import { AuthProvider, HttpError } from 'react-admin';
import apiClient from './apiClient';

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const response = await apiClient.post('/auth/login', {
      email: username,
      password,
    });
    const { accessToken, refreshToken } = response.data.data;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return Promise.resolve();
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    return Promise.resolve();
  },

  checkAuth: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject({ message: 'Not authenticated' });
    }
    return Promise.resolve();
  },

  checkError: (error: HttpError) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return Promise.reject({ message: 'Unauthorized' });
    }
    return Promise.resolve();
  },

  getIdentity: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      const { id, email, firstName, lastName } = response.data.data;
      return {
        id,
        fullName: `${firstName || ''} ${lastName || ''}`.trim() || email,
        avatar: undefined,
      };
    } catch {
      return Promise.reject({ message: 'Failed to get identity' });
    }
  },

  getPermissions: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data.data.role;
    } catch {
      return Promise.reject({ message: 'Failed to get permissions' });
    }
  },
};
