import { defineConfig } from "drizzle-kit";

// DATABASE_URL is optional for local development (using in-memory storage)
// Required only when running database migrations
const databaseUrl = process.env.DATABASE_URL || "postgresql://localhost:5432/db";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
