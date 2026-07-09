import Keycloak, { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js';
import { keycloakAuthProvider } from 'ra-keycloak';

const config: KeycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
};

const initOptions: KeycloakInitOptions = {
  onLoad: 'login-required',
  checkLoginIframe: false,
};

const keycloakClient = new Keycloak(config);

export const authProvider = keycloakAuthProvider(keycloakClient, {
  initOptions,
});
