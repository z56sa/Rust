import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// v2: Neon PostgreSQL (migrated from Turso - 2026-11-28)
const dbUrl =
  process.env.NEON_DATABASE_URL ||
  process.env.DATABASE_URL ||
  process.env.PRISMA_DATABASE_URI;

if (!dbUrl) {
  throw new Error("[DB] No database URL found! Set NEON_DATABASE_URL in environment variables.");
}

console.log("[DB] Connecting to Neon via:", dbUrl.substring(0, 40) + "...");

const sql = neon(dbUrl);
export const db = drizzle(sql, { schema });
export { sql as client };
