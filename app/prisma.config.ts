import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
    // @ts-expect-error - Prisma Config types might not have directUrl yet, but it is supported in v7
    directUrl: process.env["DIRECT_URL"],
  },
});
