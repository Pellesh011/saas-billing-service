import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string().required(),
  REDIS_URL: Joi.string().default('redis://localhost:6379'),
  KEYCLOAK_URL: Joi.string().default('http://localhost:8080'),
  KEYCLOAK_REALM: Joi.string().default('billing'),
  KEYCLOAK_CLIENT_ID: Joi.string().default('backend'),
  SMTP_HOST: Joi.string().optional(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.string().optional(),
  SMTP_PASS: Joi.string().optional(),
  EMAIL_FROM: Joi.string().optional(),
});
