import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import * as schema from "./schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// database path
const dbPath = path.join(__dirname, "db.sqlite");

// create sqlite object
const sqlite = new Database(dbPath);
sqlite.pragma("foreign_keys = ON");

// create Drizzle ORM db
const db = drizzle(sqlite, { schema });

export { db, sqlite };
