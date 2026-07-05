export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const CURRENCIES = {
  RUB: { symbol: '₽', name: 'Рубль', locale: 'ru-RU' },
  USD: { symbol: '$', name: 'Доллар', locale: 'en-US' },
  EUR: { symbol: '€', name: 'Евро', locale: 'de-DE' },
} as const;

export const SUBSCRIPTION_STATUS_LABELS: Record<string, string> = {
  TRIALING: 'Триал',
  ACTIVE: 'Активна',
  PAST_DUE: 'Просрочена',
  CANCELED: 'Отменена',
  PAUSED: 'Приостановлена',
  INCOMPLETE: 'Незавершена',
  INCOMPLETE_EXPIRED: 'Истекла',
  UNPAID: 'Не оплачена',
};

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Черновик',
  OPEN: 'Открыт',
  PAID: 'Оплачен',
  VOID: 'Аннулирован',
  UNCOLLECTIBLE: 'Безнадёжный',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Ожидает',
  PROCESSING: 'Обработка',
  SUCCEEDED: 'Успешно',
  FAILED: 'Ошибка',
  CANCELED: 'Отменён',
  REFUNDED: 'Возврат',
  PARTIALLY_REFUNDED: 'Частичный возврат',
};

export const INTERVAL_LABELS: Record<string, string> = {
  DAY: 'День',
  WEEK: 'Неделя',
  MONTH: 'Месяц',
  YEAR: 'Год',
};

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 25,
  maxLimit: 100,
} as const;

export const STRIPE_API_VERSION = '2023-10-16';
