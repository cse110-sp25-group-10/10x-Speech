const exampleDeck = [
  {
    "front-text": "Introduction", // Fong: We can make it to: frontText: "Introduction", to match the variable names?
    // Fong: backText: ...
    "back-text":
      "Good morning. My name is Miranda Booker, and I’m here today to talk to you about how Target Reach Plus software is changing the way businesses manage data for their customers and products.",
    time: 10,
  },
];

// Returns a card as a JS object
function createCard(frontText, backText, time) {
  let finalFrontText;
  let finalBackText;
  let finalTime;

  // Validate and set frontText
  if (typeof frontText === "string" && frontText.trim() !== "") {
    finalFrontText = frontText;
  } else {
    finalFrontText = "Default Question/Term";
    console.warn(
      'Invalid frontText for createCard. Using default: "' +
        finalFrontText +
        '"'
    );
  }

  // Validate and set backText
  if (typeof backText === "string" && backText.trim() !== "") {
    finalBackText = backText;
  } else {
    finalBackText = "Default Answer/Definition";
    console.warn(
      'Invalid backText for createCard. Using default: "' + finalBackText + '"'
    );
  }

  // Validate and set time
  if (typeof time === "number" && time > 0) {
    finalTime = time;
  } else {
    finalTime = 10; // Default time
    console.warn("Invalid time for createCard. Using default: " + finalTime);
  }

  return {
    id: Date.now(), // Give ID to each card for flipping
    frontText: finalFrontText,
    backText: finalBackText,
    time: finalTime,
    isFlipped: false,
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
