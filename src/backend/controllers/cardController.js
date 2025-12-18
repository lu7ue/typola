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

/**
 * get single set with all cards
 * @param {number} id
 * @returns {object}
 */
const getSetById = async (id) => {
    const set = sqlite
        .prepare(`
            SELECT id, title, description
            FROM sets
            WHERE id = ?
        `)
        .get(id);

    if (!set) return null;

    const cards = sqlite
        .prepare(`
            SELECT id, term, definition, term_language, definition_language, audio
            FROM cards
            WHERE set_id = ?
            ORDER BY id ASC
        `)
        .all(id);

    return {
        ...set,
        cardCount: cards.length,
        cards,
    };
};

/**
 * update set basic info
 * @param {number} id
 * @param {string} title
 * @param {string} description
 */
const updateSetInfo = async (id, title, description) => {
    const result = sqlite
        .prepare(
            `
                UPDATE sets
                SET title       = ?,
                    description = ?
                WHERE id = ?
            `
        )
        .run(title, description ?? null, id);

    return result.changes;
};

/**
 * update languages for all cards in a set
 * @param {number} setId
 * @param {string} termLanguage
 * @param {string} definitionLanguage
 */
const updateSetLanguages = async (
    setId,
    termLanguage,
    definitionLanguage
) => {
    const result = sqlite
        .prepare(
            `
                UPDATE cards
                SET term_language       = ?,
                    definition_language = ?
                WHERE set_id = ?
            `
        )
        .run(termLanguage, definitionLanguage, setId);

    return result.changes;
};

/**
 * update single card
 */
const updateCardById = async (card) => {
    const result = sqlite
        .prepare(
            `
                UPDATE cards
                SET term       = ?,
                    definition = ?
                WHERE id = ?
            `
        )
        .run(card.term, card.definition, card.id);

    return result.changes;
};

/**
 * delete cards by ids
 */
const deleteCardsByIds = async (ids) => {
    if (!ids.length) return 0;
    const placeholders = ids.map(() => "?").join(",");
    const result = sqlite
        .prepare(`DELETE
                  FROM cards
                  WHERE id IN (${placeholders})`)
        .run(...ids);
    return result.changes;
};

const deleteSetById = async (id) => {
    const result = sqlite
        .prepare("DELETE FROM sets WHERE id = ?")
        .run(id);
    return result.changes;
};

module.exports = {
    setDB,
    createSet,
    createCard,
    getAllSets,
    getSetById,
    updateSetInfo,
    updateSetLanguages,
    updateCardById,
    deleteCardsByIds,
    deleteSetById,
};


