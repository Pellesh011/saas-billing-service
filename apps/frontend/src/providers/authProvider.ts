import { AuthProvider, HttpError } from 'react-admin';
import authClient from './authClient';
import apiClient from './apiClient';

let cachedMe: {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
} | null = null;
let mePromise: Promise<{
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
} | null> | null = null;

async function fetchMe() {
  if (mePromise) return mePromise;
  mePromise = (async () => {
    try {
      const response = await apiClient.get('/auth/me');
      const { id, email, role, firstName, lastName } = response.data;
      cachedMe = { id, email, role, firstName, lastName };
      return cachedMe;
    } catch {
      cachedMe = null;
      return null;
    } finally {
      mePromise = null;
    }
  })();
  return mePromise;
}

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const client_id = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
    const response = await authClient.post('/protocol/openid-connect/token', {
      client_id: client_id,
      username,
      password,
      grant_type: 'password',
    });
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    cachedMe = null;
    return Promise.resolve();
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    cachedMe = null;
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
      cachedMe = null;
      return Promise.reject({ message: 'Unauthorized' });
    }
    return Promise.resolve();
  },

  getIdentity: async () => {
    const me = await fetchMe();
    if (!me) return Promise.reject({ message: 'Failed to get identity' });
    return {
      id: me.id,
      fullName: `${me.firstName || ''} ${me.lastName || ''}`.trim() || me.email,
      avatar: undefined,
    };
  },

  getPermissions: async () => {
    const me = await fetchMe();
    if (!me) return Promise.reject({ message: 'Failed to get permissions' });
    return me.role;
  },
};
