const DB_NAME = "FlashcardAppDB";
const DB_VERSION = 1;
const STORE_NAME = "decks"; // Store deck objects in decks

let db;

/**
 * Opens and initializes the IndexedDB database.
 * @returns {Promise<IDBDatabase>} A promise that resolves with the database instance.
 */
function openDB() {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("Database error:", event.target.error);
            reject("Database error: " + event.target.error);
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("Database opened successfully");
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            console.log("Database upgrade needed");
            const tempDb = event.target.result;
            if (!tempDb.objectStoreNames.contains(STORE_NAME)) {
                // Create an object store for decks. deckName will be the key.
                tempDb.createObjectStore(STORE_NAME, { keyPath: "deckName" });
                console.log(`Object store "${STORE_NAME}" created.`);
            }
        };
    });
}

/**
 * Saves or updates a deck in IndexedDB.
 * The deck object should have a `deckName` and a `cards` array.
 * @param {object} deckObject - The deck object (e.g., { deckName: "...", cards: [...] })
 * @returns {Promise<void>}
 */
export async function saveDeck(deckObject) {
    const currentDb = await openDB();
    return new Promise((resolve, reject) => {
        // Deck object needs to be a plain object for storing
        const plainDeckObject = {
            deckName: deckObject.deckName,
            cards: deckObject.cards,
        };

        const transaction = currentDb.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(plainDeckObject); // `put` adds or updates

        request.onsuccess = () => {
            console.log(`Deck "${deckObject.deckName}" saved successfully.`);
            resolve();
        };
        request.onerror = (event) => {
            console.error(`Error saving deck "${deckObject.deckName}":`, event.target.error);
            reject(event.target.error);
        };
    });
}

/**
 * Retrieves a specific deck from IndexedDB.
 * @param {string} deckName - The name of the deck to retrieve.
 * @returns {Promise<object|null>} A promise that resolves with the deck object or null if not found.
 */
export async function getDeck(deckName) {
    const currentDb = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = currentDb.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(deckName);

        request.onsuccess = () => {
            if (request.result) {
                console.log(`Deck "${deckName}" retrieved.`);
                resolve(request.result); // This will be { deckName: "...", cards: [...] }
            } else {
                console.log(`Deck "${deckName}" not found.`);
                resolve(null);
            }
        };
        request.onerror = (event) => {
            console.error(`Error getting deck "${deckName}":`, event.target.error);
            reject(event.target.error);
        };
    });
}

/**
 * Retrieves all decks from IndexedDB.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of deck objects.
 */
export async function getAllDecks() {
    const currentDb = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = currentDb.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            console.log("All decks retrieved.");
            resolve(request.result || []); // request.result is an array of deck objects
        };
        request.onerror = (event) => {
            console.error("Error getting all decks:", event.target.error);
            reject(event.target.error);
        };
    });
}

/**
 * Deletes a deck from IndexedDB.
 * @param {string} deckName - The name of the deck to delete.
 * @returns {Promise<void>}
 */
export async function deleteDeckDB(deckName) {
    const currentDb = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = currentDb.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(deckName);

        request.onsuccess = () => {
            console.log(`Deck "${deckName}" deleted successfully.`);
            resolve();
        };
        request.onerror = (event) => {
            console.error(`Error deleting deck "${deckName}":`, event.target.error);
            reject(event.target.error);
        };
    });
}
