# Руководство по участию в проекте

## Рабочий процесс

1. Fork репозитория
2. Создание feature ветки: `git checkout -b feat/amazing-feature`
3. Внесение изменений с соблюдением конвенций
4. Проверка качества: `npm run lint && npm run typecheck && npm run test:ci`
5. Коммит с conventional commits: `git commit -m "feat: add amazing feature"`
6. Push и создание Pull Request

## Конвенция коммитов

Используем [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` Новый функционал
- `fix:` Исправление бага
- `docs:` Изменения документации
- `style:` Форматирование кода
- `refactor:` Рефакторинг
- `perf:` Оптимизация производительности
- `test:` Добавление/обновление тестов
- `chore:` Задачи по обслуживанию
- `build:` Изменения в системе сборки
- `ci:` Изменения в CI/CD

## Нейминг веток

- `feat/*` - Новый функционал
- `fix/*` - Исправление багов
- `chore/*` - Обслуживание
- `docs/*` - Документация
- `refactor/*` - Рефакторинг
- `release/*` - Подготовка релиза

## Стиль кода

- ESLint + Prettier (контролируется через Husky)
- TypeScript strict mode
- JSDoc для публичных API
- Минимум 80% покрытия тестами

## Требования к Pull Request

- [ ] Все CI проверки проходят
- [ ] Минимум 1 одобрение
- [ ] Нет конфликтов
- [ ] Запись в CHANGELOG (для feat/fix)
- [ ] Обновленная документация (если нужно)
