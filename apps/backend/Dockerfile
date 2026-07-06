# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

COPY apps/backend/package.json ./apps/backend/

RUN node -e "const p=require('./package.json');p.workspaces=['apps/backend'];require('fs').writeFileSync('./package.json',JSON.stringify(p,null,2))" && npm ci

COPY tsconfig.base.json ./
COPY apps/backend/tsconfig.json ./apps/backend/
COPY apps/backend/nest-cli.json ./apps/backend/
COPY apps/backend/src/prisma_client ./apps/backend/src/prisma_client
COPY apps/backend/src ./apps/backend/src

RUN cd apps/backend && npm run build

# Stage 2: Run
FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/src/prisma_client ./apps/backend/src/prisma_client
COPY --from=builder /app/apps/backend/package.json ./apps/backend/

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

USER nestjs

EXPOSE 3001

CMD ["node", "apps/backend/dist/main.js"]
