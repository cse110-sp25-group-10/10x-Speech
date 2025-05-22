const exampleDeck = [
    {
        "front-text": "Introduction",
        "back-text": "Good morning. My name is Miranda Booker, and I’m here today to talk to you about how Target Reach Plus software is changing the way businesses manage data for their customers and products.",
        "time": 10
    }
];

// Returns a card as a JS object
function createCard(frontText, backText, time) {
    // TODO: Validation
    return {
        "front-text": frontText,
        "back-text": backText,
        "time": time,
    }
}

/**
 * Returns a card at an index of a deck
 * @param {JS Object} deck The parameter carrying the multiple JS objects (cards)
 * @param {number} index Where in the deck order the specified card is located
 * @returns A JS object representing the speech card at the specified index if valid and null otherwise
 */
export function readCard(deck, index) {
    // TODO: Validation

    // Check whether deck is empty/null before running if statement
    if(deck.length === 0)
    {
        return null;
    }


    if (index < deck.length && index >= 0) {
        return deck[index];
    }

    // If statement isn't ran, and we return null
    return null;
}

// Removes a card at an index of a deck
function deleteCard(deck, index) {
    // TOOD: Validation
    
    // Check if deck already empty
    if(deck.length === 0)
    {
        return null;
    }

    // Delete first element at location index
    if (index < deck.length && index >= 0) {
        deck.splice(index, 1);
    }

    // If statement isn't ran, return null
    return null;
}

// Updates a card at an in index of a deck with a new card
function updateCard(deck, index, newCard) {
    // TODO
    console.log(deck, index, newCard);
}

function shuffleDeck(deck) {
    // TODO
    console.log(deck);
}

function test() {
    console.log(`Starting deck: ${exampleDeck}`);

    const newCard = createCard("Example Topic", "Example description", 10)
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