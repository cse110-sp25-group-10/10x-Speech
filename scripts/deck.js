const exampleDeck = [
    {
        "frontText": "Introduction",
        "backText":
            "Good morning. My name is Miranda Booker, and I’m here today to talk to you about how Target Reach Plus software is changing the way businesses manage data for their customers and products.",
        "time": 10,
    },
];

/**
 * Creates a speech card with the appropriate data.
 * @param {string} frontText The text for the front of the card
 * @param {string} backText The text for the back of the card
 * @param {number} time The time length the user expects to spend on a card (in seconds)
 * @returns A JS object representing the speech card if valid and null otherwise
 */
export function createCard(frontText, backText, time) {
    // Validate that frontText and backText are strings and that time is a number
    // Validate that the front text is between 1 and 60 characters (inclusive)
    // Validate that the back text is between 1 and 250 characters (inclusive)
    // Validate that the time length is between 1 and 60 seconds (inclusive)
    if (typeof(frontText) !== "string" || typeof(backText) !== "string") { return null; }
    if (frontText.length === 0 || frontText.length > 60) { return null; }
    if (backText.length === 0 || backText.length > 250) { return null; }
    if (typeof(time) !== "number") { return null; }
    if (time < 1 || time > 60) { return null; }
    
    return {
        "frontText": frontText,
        "backText": backText,
        "time": time,
    };
}

// Returns a card at an index of a deck
function readCard(deck, index) {
    // TOOD: Validation
    if (index < deck.length && index >= 0) {
        return deck[index];
    }
}

// Removes a card at an index of a deck
function deleteCard(deck, index) {
    // TOOD: Validation
    if (index < deck.length && index >= 0) {
        deck.splice(index, 1);
    }
}

/**
 * Updates a card at an in index of a deck with a new card
 * @param {Array} deck - The deck of cards
 * @param {number} index - The index of the card to update
 * @param {Object} newCard - The new card to update with
 * @returns {boolean} - Returns true if the card was updated successfully, false otherwise
 */
export function updateCard(deck, index, newCard) {
    // Validate the deck and index
    if (!Array.isArray(deck) || index < 0 || index >= deck.length) {
        console.error("Invalid deck or index for updateCard.");
        return false;
    }
    // Validate the new card
    if (
        typeof newCard !== "object" ||
        newCard === null ||
        // Make sure the newCard object has the correct properties
        !Object.hasOwn(newCard, "frontText") ||
        !Object.hasOwn(newCard, "backText") ||
        !Object.hasOwn(newCard, "time")
    ) {
        console.error("Invalid newCard object for updateCard. It must be a complete card object.");
        return false;
    }

    // Same Validation as createCard
    if (
        typeof newCard.frontText !== "string" ||
        newCard.frontText.length === 0 ||
        newCard.frontText.length > 60
    ) {
        console.error("Invalid frontText for updateCard.");
        return false;
    }
    if (
        typeof newCard.backText !== "string" ||
        newCard.backText.length === 0 ||
        newCard.backText.length > 250
    ) {
        console.error("Invalid backText for updateCard.");
        return false;
    }
    if (typeof newCard.time !== "number" || newCard.time < 1 || newCard.time > 60) {
        console.error("Invalid time for updateCard.");
        return false;
    }

    // Update the card
    deck[index] = {
        "frontText": newCard.frontText,
        "backText": newCard.backText,
        "time": newCard.time,
    };
    return true;
}

function shuffleDeck(deck) {
    // TODO
    console.log(deck);
}

function test() {
    console.log(`Starting deck: ${exampleDeck}`);

    const newCard = createCard("Example Topic", "Example description", 10);
    exampleDeck.push(newCard);
    console.log(`Adding a card: ${exampleDeck}`);

    console.log(`Reading a specific card: ${readCard(exampleDeck, 1)}`);

    updateCard(exampleDeck, 0, newCard);
    console.log(`Update a card: ${exampleDeck}`);

    shuffleDeck(exampleDeck);
    console.log(`Shuffle a deck: ${exampleDeck}`);

    deleteCard(exampleDeck, 0);
    console.log(`Delete a card: ${exampleDeck}`);
}

test();
