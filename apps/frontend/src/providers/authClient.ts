import axios from 'axios';

const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM;

const authClient = axios.create({
  baseURL: import.meta.env.VITE_KEYCLOAK_URL + `/realms/${KEYCLOAK_REALM}`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default authClient;
