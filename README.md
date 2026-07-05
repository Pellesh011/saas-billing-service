# SaaS Billing Service

Полноценный сервис для управления подписками и биллингом в SaaS приложениях.

## Технологический стек

### Backend
- **Framework**: NestJS 10+ с TypeScript
- **Database**: PostgreSQL 15+ с Prisma ORM
- **Auth**: JWT + Passport
- **Payments**: Stripe (MVP)
- **Queue**: BullMQ + Redis
- **Docs**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Admin**: React Admin 4.x (MUI-based)
- **State**: Redux Toolkit
- **Styling**: Tailwind CSS + MUI

### Инфраструктура
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monorepo**: pnpm workspaces + Turborepo

## Быстрый старт

### Предварительные требования
- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- Аккаунт Stripe

### Установка и запуск

```bash
# Клонируем и устанавливаем зависимости
git clone https://github.com/Pellesh011/saas-billing-service.git
cd saas-billing-service
pnpm install

# Настраиваем окружение
cp .env.example .env
# Редактируем .env с вашими значениями

# Запускаем инфраструктуру
docker-compose up -d postgres redis

# Запускаем миграции БД
pnpm db:migrate

# Запускаем dev-серверы
pnam dev
```

### Точки доступа
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs
- Prisma Studio: `pnpm db:studio`

## Структура проекта

```
saas-billing-service/
├── apps/
│   ├── backend/      # NestJS API
│   └── frontend/     # React Admin Panel
├── packages/
│   ├── shared/       # Общие типы, валидаторы, утилиты
│   ├── ui/           # Общие UI компоненты
│   └── config/       # Общие конфигурации
└── docker-compose.yml
```

## Доступные команды

```bash
pnpm dev          # Запуск всех dev-серверов
pnpm build        # Сборка всех пакетов
pnpm lint         # Линтинг всех пакетов
pnpm typecheck    # Проверка типов
pnpm test         # Запуск тестов
pnpm test:ci      # Запуск тестов в CI режиме
pnpm db:generate  # Генерация Prisma клиента
pnpm db:push      # Push схемы в БД
pnpm db:migrate   # Запуск миграций
pnpm format       # Форматирование кода
```

## Деплой

- **Staging**: Автоматический деплой при пуше в `main`
- **Production**: Деплой при создании тегов (`v*`)

## Лицензия

MIT
