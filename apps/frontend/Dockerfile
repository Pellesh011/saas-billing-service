# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/

RUN node -e "const p=require('./package.json');p.workspaces=['apps/frontend'];require('fs').writeFileSync('./package.json',JSON.stringify(p,null,2))"
RUN npm ci --verbose

COPY tsconfig.base.json ./
COPY apps/frontend/tsconfig.json ./apps/frontend/
COPY apps/frontend/tsconfig.node.json ./apps/frontend/
COPY apps/frontend/vite.config.ts ./apps/frontend/
COPY apps/frontend/tailwind.config.js ./apps/frontend/
COPY apps/frontend/postcss.config.js ./apps/frontend/
COPY apps/frontend/index.html ./apps/frontend/
COPY apps/frontend/src ./apps/frontend/src
COPY apps/frontend/public ./apps/frontend/public

RUN cd apps/frontend && npm run build

# Stage 2: Run with Nginx
FROM nginx:alpine AS runner

COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
