import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const sql = neon(
  process.env.NEON_DATABASE_URL ||
  process.env.DATABASE_URL ||
  process.env.PRISMA_DATABASE_URI!
);
export const db = drizzle(sql, { schema });
export { sql as client };
