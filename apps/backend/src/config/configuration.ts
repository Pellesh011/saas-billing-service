import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  keycloak: {
    url: process.env.KEYCLOAK_URL || 'http://localhost:8080',
    realm: process.env.KEYCLOAK_REALM || 'billing',
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'backend',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
    adminClientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID || 'admin-cli',
    adminClientSecret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET,
    serviceAccountClientId: process.env.KEYCLOAK_SERVICE_ACCOUNT_CLIENT_ID || 'backend',
    serviceAccountClientSecret: process.env.KEYCLOAK_SERVICE_ACCOUNT_CLIENT_SECRET,
  },
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM,
  },
}));
