let db;

const setDB = (database) => {
  db = database;
};

const createSet = (title, description) => {
  const result = db
    .prepare(
      `
    INSERT INTO sets (title, description) VALUES (?, ?)
`
    )
    .run(title, description);
  return result.lastInsertRowid;
};

const createCard = (card) => {
  const result = db
    .prepare(
      `
    INSERT INTO cards 
    (set_id, term, definition, term_language, definition_language, image)
    VALUES (?, ?, ?, ?, ?, ?)
`
    )
    .run(
      card.set_id,
      card.term,
      card.definition,
      card.term_language,
      card.definition_language,
      card.image || null
    );
  return result.lastInsertRowid;
};

module.exports = {
  setDB,
  createSet,
  createCard,
};
