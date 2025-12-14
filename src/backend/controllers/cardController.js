const { db } = require("../db/index");
const { sets, cards } = require("../db/schema");

const setDB = (_database) => {
};

/**
 * create new Set
 * @param {string} title
 * @param {string} description
 * @returns {number}
 */
const createSet = async (title, description) => {
  const result = await db.insert(sets).values({ title, description }).run();
  return result.lastInsertRowid;
};

/**
 * create new card
 * @param {object} card
 * @returns {number}
 */
const createCard = async (card) => {
  const result = await db
    .insert(cards)
    .values({
      setId: card.set_id,
      term: card.term,
      definition: card.definition,
      termLanguage: card.term_language,
      definitionLanguage: card.definition_language,
      audio: card.audio || null,
    })
    .run();

  return result.lastInsertRowid;
};

module.exports = { setDB, createSet, createCard };
