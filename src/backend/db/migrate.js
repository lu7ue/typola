const { sqlite } = require("./index");

function runMigrations() {
    sqlite.exec(`
    CREATE TABLE IF NOT EXISTS sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT
    );

    CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        set_id INTEGER NOT NULL,
        term TEXT NOT NULL,
        definition TEXT NOT NULL,
        term_language TEXT NOT NULL,
        definition_language TEXT NOT NULL,
        audio TEXT,
        FOREIGN KEY (set_id) REFERENCES sets(id) ON DELETE CASCADE
    );
`);
}

module.exports = { runMigrations };
