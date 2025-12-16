const { sqlite } = require("./index");

function runMigrations() {
    sqlite.exec(`
    -- set
    CREATE TABLE IF NOT EXISTS sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT
    );

    -- card
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

    -- exam progress
    CREATE TABLE IF NOT EXISTS card_progress (
        card_id INTEGER PRIMARY KEY,
        passed INTEGER DEFAULT 0,
        FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
    );

    -- total time
    CREATE TABLE IF NOT EXISTS app_stats (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        total_time_ms INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);
}

module.exports = { runMigrations };
