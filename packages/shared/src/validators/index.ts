import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

export const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const planSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  price: z.number().min(0, 'Цена не может быть отрицательной'),
  currency: z.enum(['RUB', 'USD', 'EUR']).default('RUB'),
  interval: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']).default('MONTH'),
  trialDays: z.number().min(0).default(0),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const customerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Некорректный email'),
  company: z.string().optional(),
  phone: z.string().optional(),
  taxId: z.string().optional(),
});

export const subscriptionSchema = z.object({
  customerId: z.string().min(1, 'Клиент обязателен'),
  planId: z.string().min(1, 'Тариф обязателен'),
  quantity: z.number().min(1).default(1),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PlanInput = z.infer<typeof planSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
