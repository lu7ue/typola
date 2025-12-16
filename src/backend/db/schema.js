import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Sets table
 */
const sets = sqliteTable("sets", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description"),
});

/**
 * Cards table
 */
const cards = sqliteTable("cards", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    setId: integer("set_id")
        .notNull()
        .references(() => sets.id, { onDelete: "cascade" }),

    term: text("term").notNull(),
    definition: text("definition").notNull(),

    termLanguage: text("term_language").notNull(),
    definitionLanguage: text("definition_language").notNull(),

    audio: text("audio"),
});

export { sets, cards };