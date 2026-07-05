# Stage 1: Build
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@8.14.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
COPY packages/config/package.json ./packages/config/

RUN pnpm install --frozen-lockfile

COPY tsconfig.base.json ./
COPY apps/backend/tsconfig.json ./apps/backend/
COPY apps/backend/nest-cli.json ./apps/backend/
COPY apps/backend/prisma ./apps/backend/prisma
COPY apps/backend/src ./apps/backend/src

RUN cd apps/backend && pnpm exec prisma generate
RUN cd apps/backend && pnpm run build

# Stage 2: Run
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@8.14.0 --activate

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

USER nestjs

EXPOSE 3001

CMD ["node", "apps/backend/dist/main.js"]
