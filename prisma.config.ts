import "dotenv/config";
import type { PrismaConfig } from "prisma";
import { env } from "prisma/config";

export default {
  schema: "apps/backend/src/prisma_client/schema.prisma",
  migrations: {
    path: "apps/backend/src/prisma_client/migrations",
    seed: "tsx apps/backend/src/prisma_client/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
} satisfies PrismaConfig;