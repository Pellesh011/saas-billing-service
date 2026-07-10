# SaaS Billing Service

Полноценный сервис для управления подписками и биллингом в SaaS приложениях.

## Технологический стек

### Backend
- **Framework**: NestJS 11+ с TypeScript
- **Database**: PostgreSQL 16+ с Prisma ORM
- **Auth**: Keycloak 25 (OpenID Connect / JWT)
- **Payments**: Stripe (MVP)
- **Queue**: BullMQ + Redis
- **Docs**: Swagger/OpenAPI

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Admin**: React Admin 5.x (MUI-based)
- **State**: Redux Toolkit
- **Auth**: keycloak-js + ra-keycloak

### Инфраструктура
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monorepo**: npm workspaces + Turborepo

## Быстрый старт

### Предварительные требования
- Node.js 22+
- npm 10+
- Docker & Docker Compose
- Аккаунт Stripe

### 1. Настройка окружения

```bash
# Клонируем и устанавливаем зависимости
git clone <repo-url>
cd saas-billing-service
npm install

# Настраиваем окружение
cp .env.example .env
# Редактируем .env с вашими значениями
```

### 2. Инициализация Keycloak

Перед первым запуском нужно создать Docker volume и скопировать realm-export:

```bash
# Создать volume и импортировать realm
bash keycloak/seed-volume.sh
```

Это создаст volume `saas-billing_keycloak_import` с конфигурацией realm `billing`.

По умолчанию создаются пользователи:
| Логин | Пароль | Роль |
|---|---|---|
| `admin` | `admin123` | ADMIN |
| `manager` | `manager123` | MANAGER |

### 3. Запуск инфраструктуры

```bash
docker compose up -d
```

После запуска Keycloak будет доступен по адресу http://localhost:8080 (admin / admin).

### 4. Миграции БД

```bash
npm run db:migrate
```

### 5. Запуск dev-серверов

```bash
npm run dev
```

### Точки доступа
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs
- Keycloak Admin: http://localhost:8080 (admin / admin)
- Prisma Studio: `npm run db:studio`

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
├── keycloak/
│   ├── realm-export.json   # Realm configuration
│   └── seed-volume.sh      # Volume seeding script
├── docker-compose.yml      # Production compose
├── docker-compose.dev.yml  # Development compose
└── turbo.json
```

## Аутентификация

Аутентификация осуществляется через **Keycloak** (OpenID Connect).

1. Frontend перенаправляет пользователя на страницу логина Keycloak
2. После успешного входа Keycloak выдаёт JWT-токен
3. Frontend отправляет токен в заголовке `Authorization: Bearer <token>` к API
4. Backend проверяет подпись токена через JWKS-эндпоинт Keycloak
5. Пользователь автоматически создаётся в локальной БД (auto-provision)

Роли (realm roles): `ADMIN`, `MANAGER`, `VIEWER`.

## Доступные команды

```bash
npm run dev        # Запуск всех dev-серверов
npm run build      # Сборка всех пакетов
npm run lint       # Линтинг всех пакетов
npm run typecheck  # Проверка типов
npm test           # Запуск тестов
npm run test:ci    # Запуск тестов в CI режиме
npm run db:generate  # Генерация Prisma клиента
npm run db:push    # Push схемы в БД
npm run db:migrate # Запуск миграций
npm run format     # Форматирование кода
```

## Деплой

- **Staging**: Автоматический деплой при пуше в `main`
- **Production**: Деплой при создании тегов (`v*`)

## Лицензия

MIT
