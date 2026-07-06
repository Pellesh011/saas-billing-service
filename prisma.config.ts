import "dotenv/config";
import type { PrismaConfig } from "prisma";
import { env } from "prisma/config";

export default {
  schema: "apps/backend/prisma/schema.prisma",
  migrations: {
    path: "apps/backend/prisma/migrations",
    seed: "tsx apps/backend/prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
} satisfies PrismaConfig;