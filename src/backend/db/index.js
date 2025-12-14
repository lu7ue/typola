const Database = require("better-sqlite3");
const { drizzle } = require("drizzle-orm/better-sqlite3");
const path = require("path");
const { app } = require("electron");

const schema = require("./schema");

// database path
const dbPath = path.join(__dirname, "db.sqlite");

// create sqlite object
const sqlite = new Database(dbPath);
sqlite.pragma("foreign_keys = ON");

// create Drizzle ORM db
const db = drizzle(sqlite, { schema });

module.exports = { db, sqlite };
