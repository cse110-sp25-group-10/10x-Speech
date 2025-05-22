const exampleDeck = [
  {
    frontText: "Introduction",
    backText:
      "Good morning. My name is Miranda Booker, and I'm here today to talk to you about how Target Reach Plus software is changing the way businesses manage data for their customers and products.",
    time: 10,
  },
];

// Returns a card as a JS object
function createCard(frontText, backText, time) {
  return {
    frontText: frontText,
    backText: backText,
    time: time,
  };
}

// Returns a card at an index of a deck
function readCard(deck, index) {
  if (index < deck.length && index >= 0) {
    return deck[index];
  }
}

// Removes a card at an index of a deck
function deleteCard(deck, index) {
  if (index < deck.length && index >= 0) {
    deck.splice(index, 1);
  }
}

/**
 * Updates a card at an index of a deck with a new card
 * @param {Array} deck - The deck of cards
 * @param {number} index - The index of the card to update
 * @param {Object} newCard - The new card to update with
 * @returns {boolean} - Returns true if the card was updated successfully, false otherwise
 */
function updateCard(deck, index, newCard) {
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
    console.error(
      "Invalid newCard object for updateCard. It must be a complete card object."
    );
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
  if (
    typeof newCard.time !== "number" ||
    newCard.time < 1 ||
    newCard.time > 60
  ) {
    console.error("Invalid time for updateCard.");
    return false;
  }

  // Update the card
  deck[index] = {
    frontText: newCard.frontText,
    backText: newCard.backText,
    time: newCard.time,
  };
  return true;
}

/**
 * Shuffles the cards in the deck
 * @param {Array} deck - The deck of cards
 */
function shuffleCards(deck) {
  if (!Array.isArray(deck)) {
    console.error("Invalid deck for shuffleDeck.");
    return false;
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements using a temporary variable
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  return true;
}

/**
 * Object for a deck of cards
 */
class Deck {
  constructor() {
    this.cards = [];
  }

  // Calls the createCard function and adds the card to this deck
  createCard(frontText, backText, time) {
    const card = createCard(frontText, backText, time);
    this.cards.push(card);
    return card;
  }

  // Calls the readCard function
  readCard(index) {
    return readCard(this.cards, index);
  }

  // Calls the deleteCard function
  deleteCard(index) {
    deleteCard(this.cards, index);
  }

  // Calls the updateCard function
  updateCard(index, newCard) {
    return updateCard(this.cards, index, newCard);
  }

  // Calls the shuffleCards function
  shuffleCards() {
    return shuffleCards(this.cards);
  }
}

function test() {
  console.log(`Starting deck: ${exampleDeck}`);

  const newCard = createCard("Example Topic", "Example description", 10);
  exampleDeck.push(newCard);
  console.log(`Adding a card: ${exampleDeck}`);

  console.log(`Reading a specific card: ${readCard(exampleDeck, 1)}`);

  updateCard(exampleDeck, 0, newCard);
  console.log(`Update a card: ${exampleDeck}`);

  shuffleCards(exampleDeck);
  console.log(`Shuffle a deck: ${exampleDeck}`);

  deleteCard(exampleDeck, 0);
  console.log(`Delete a card: ${exampleDeck}`);

  console.log("\n");

  // Test the Deck class
  const deck = new Deck();
  deck.createCard("Example Topic1", "Example description1", 10);
  deck.createCard("Example Topic2", "Example description2", 10);
  deck.createCard("Example Topic3", "Example description3", 10);
  deck.createCard("Example Topic4", "Example description4", 10);
  deck.createCard("Example Topic5", "Example description5", 10);

  console.log(`Deck: ${JSON.stringify(deck.cards)}\n`);

  deck.shuffleCards();
  console.log(`Shuffled deck: ${JSON.stringify(deck.cards)}\n`);
}

test();
