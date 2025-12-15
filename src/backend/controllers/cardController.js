const {db, sqlite} = require("../db/index");
const {sets, cards} = require("../db/schema");

const setDB = (_database) => {
};

/**
 * create new Set
 * @param {string} title
 * @param {string} description
 * @returns {number}
 */
const createSet = async (title, description) => {
    const result = await db.insert(sets).values({title, description}).run();
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

/**
 * get all sets with card count
 * @returns {Array}
 */
const getAllSets = async () => {
    const rows = sqlite
        .prepare(`
            SELECT s.id,
                   s.title,
                   s.description,
                   COUNT(c.id) AS cardCount
            FROM sets s
                     LEFT JOIN cards c ON c.set_id = s.id
            GROUP BY s.id
            ORDER BY s.id DESC
        `)
        .all();

    return rows;
};

module.exports = {setDB, createSet, createCard, getAllSets};
