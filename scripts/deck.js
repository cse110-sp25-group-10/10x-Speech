const example_deck = [
    {
        "front-text": "Introduction",
        "back-text": "Good morning. My name is Miranda Booker, and I’m here today to talk to you about how Target Reach Plus software is changing the way businesses manage data for their customers and products.",
        "time": 10
    }
];

// Returns a card as a JS object
function createCard(frontText, backText, time, options) {
    // TODO: Validation
    return {
        "front-text": frontText,
        "back-text": backText,
        "time": time,
    }
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

// Updates a card at an in index of a deck with a new card
function updateCard(deck, index, newCard) {
    // TODO
}

function shuffleDeck(deck) {
    // TODO
}

