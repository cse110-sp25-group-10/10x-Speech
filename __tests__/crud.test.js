import { Card } from "../scripts/deck.js";
import { Deck } from "../scripts/deck.js";

// Card tests
test("creates a JS object representing a card", () => {
    expect(Card("Valid front text", "Valid back text")).toStrictEqual({
        "frontText": "Valid front text",
        "backText": "Valid back text",
    });
});

test("returns null for creating a card with non-string front text", () => {
    expect(Card(5, "Valid front text")).toBe(null);
});

test("returns null for creating a card with non-string back text", () => {
    expect(Card("Valid back text", 5)).toBe(null);
});

test("returns null for creating a card with missing front text", () => {
    expect(Card("", "Valid back text")).toBe(null);
});

test("returns null for creating a card with over 60 character front text", () => {
    expect(Card("a".repeat(61), "Valid back text")).toBe(null);
});

test("returns null for creating a card with missing back text", () => {
    expect(Card("Valid front text", "")).toBe(null);
});

test("returns null for creating a card with over 250 character back text", () => {
    expect(Card("Valid front text", "a".repeat(251))).toBe(null);
});

test("creates a JS object representing a card with only space as text", () => {
    expect(Card(" ", " ")).toStrictEqual({
        "frontText": " ",
        "backText": " ",
    });
});

// readCard tests
test("returns card at index 2", () => {
    // creating deck and cards
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");
    
    // adding cards to deck
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);

    expect(deck.readCard(2)).toStrictEqual({
        "frontText": "Example Topic3",
        "backText": "Example description3",
    });
    expect(deck.deckName).toBe("Example Title");
});

test("returns card at index when index is a string", () => {
    // creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card");
    const card2 = Card("2", "Second Card");
    const card3 = Card("3", "Third Card");

    // adding cards to deck
    deck1.addCard(card1)
    deck1.addCard(card2)
    deck1.addCard(card3)

    expect(deck1.readCard("0")).toStrictEqual({
        "frontText": "1",
        "backText": "First Card",
    });
});

test("returns null for card with negative index", () => {
    // creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card");
    const card2 = Card("2", "Second Card");
    const card3 = Card("3", "Third Card");

    // adding cards to deck
    deck1.addCard(card1);
    deck1.addCard(card2);
    deck1.addCard(card3);

    expect(deck1.readCard(-2)).toBe(null);
});

test("returns card at index 0 when deck size is 1", () => {
    // creating deck and card
    const deck = Deck("Example Title");
    const card = Card("Example Topic", "Example description");

    // adding card to deck
    deck.addCard(card);

    expect(deck.readCard(0)).toStrictEqual({
        "frontText": "Example Topic",
        "backText": "Example description",
    });
    expect(deck.deckName).toBe("Example Title");
});

test("returns null for reading empty deck", () => {
    // creating empty deck
    const deck = Deck("Empty Deck");

    expect(deck.readCard(0)).toBe(null);
    expect(deck.deckName).toBe("Empty Deck");
});

test("returns null for reading card outside of index", () => {
    // creating deck and card
    const deck = Deck("Single Deck");
    const card = Card("Example Topic1", "Example description1");

    // adding card to deck
    deck.addCard(card);

    expect(deck.readCard(2)).toStrictEqual(null);
    expect(deck.deckName).toBe("Single Deck");
});

// deleteCard tests
test("updates the deck by deleting the card at index 1", () => {
    // creating deck and cards
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");

    // adding cards to deck
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);

    const expected = [
        {
            "frontText": "Example Topic1",
            "backText": "Example description1",
        },
       {
            "frontText": "Example Topic3",
            "backText": "Example description3",
        },
    ];

    // deletes card at index 1
    expect(deck.deleteCard(1)).toStrictEqual(card2);

    expect(deck.cards).toStrictEqual(expected);
    expect(deck.deckName).toBe("Example Title");
});

test("updates the deck by deleting every card until the deck is empty", () => {
    // creating deck and cards
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");

    // adding cards to deck
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);

    // deleting all 3 cards in deck
    expect(deck.deleteCard(0)).toStrictEqual(card1);
    expect(deck.deleteCard(0)).toStrictEqual(card2);
    expect(deck.deleteCard(0)).toStrictEqual(card3);

    const expected = Deck("Empty Deck");
    expect(deck.cards).toStrictEqual(expected.cards);
    expect(deck.deckName).toBe("Example Title");
});

test("returns null for deleting card from empty deck", () => {
    // creating empty deck
    const deck = Deck("Empty Deck");

    // attempts to delete card at index 0
    expect(deck.deleteCard(0)).toBe(null);

    expect(deck.deckName).toBe("Empty Deck");
});

test("returns null for deleting card outside of index", () => {
    // creating deck and card
    const deck = Deck("Single Deck");
    const card = Card("Example Topic1", "Example description1");

    // adding card to deck
    deck.addCard(card);

    // attempts to delete card at index 2
    expect(deck.deleteCard(2)).toStrictEqual(null);

    expect(deck.deckName).toBe("Single Deck");
});

test("returns null for deleting every card until the deck is empty, then deleting", () => {
    // creating deck and cards
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");

    // adding cards to deck
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);

    // deleting all 3 cards in deck
    expect(deck.deleteCard(0)).toStrictEqual(card1);
    expect(deck.deleteCard(0)).toStrictEqual(card2);
    expect(deck.deleteCard(0)).toStrictEqual(card3);

    const expected = Deck("Empty Deck");
    expect(deck.cards).toStrictEqual(expected.cards);
    expect(deck.deckName).toBe("Example Title");

    expect(deck.deleteCard(0)).toBe(null);
});

// updateCard tests
test("updates card in the deck at index 1", () => {
    // creating deck and cards
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");

    // adding cards to deck
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);

    const expected = [
        {
            "frontText": "Example Topic1",
            "backText": "Example description1",
        },
        {
            "frontText": "New Card Topic",
            "backText": "New card description",
        },
       {
            "frontText": "Example Topic3",
            "backText": "Example description3",
        },
    ];

    // creates new card and updates deck at index 1
    const newCard = Card("New Card Topic", "New card description")
    expect(deck.updateCard(1, newCard)).toBe(true);

    expect(deck.cards).toStrictEqual(expected);
    expect(deck.deckName).toBe("Example Title");
});

test("updates card in the deck at index 0 three times", () => {
    // creating deck and card
    const deck = Deck("Example Title");
    const card = Card("Example Topic", "Example description");

    // adding ard to deck
    deck.addCard(card);

    const expected = [
        {
            "frontText": "New Card Topic3",
            "backText": "New card description3",
        },
    ];

    // creating 3 new cards
    const newCard1 = Card("New Card Topic1", "New card description1");
    const newCard2 = Card("New Card Topic2", "New card description2");
    const newCard3 = Card("New Card Topic3", "New card description3");

    // updates index 0 three times with different new cards
    expect(deck.updateCard(0, newCard1)).toBe(true);
    expect(deck.updateCard(0, newCard2)).toBe(true);
    expect(deck.updateCard(0, newCard3)).toBe(true);

    expect(deck.cards).toStrictEqual(expected);
    expect(deck.deckName).toBe("Example Title");
});

test("updates every card in the deck", () => {
    // creating deck and cards
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");
    const card4 = Card("Example Topic4", "Example description4");

    // adding cards to deck
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);
    deck.addCard(card4);

    const expected = [
        {
            "frontText": "New Topic1",
            "backText": "New description1",
        },
        {
            "frontText": "New Topic2",
            "backText": "New description2",
        },
        {
            "frontText": "New Topic3",
            "backText": "New description3",
        },
        {
            "frontText": "New Topic4",
            "backText": "New description4",
        },
    ];

    // creating 4 new cards
    const newCard1 = Card("New Topic1", "New description1");
    const newCard2 = Card("New Topic2", "New description2");
    const newCard3 = Card("New Topic3", "New description3");
    const newCard4 = Card("New Topic4", "New description4");

    // updates every index with a new card
    expect(deck.updateCard(0, newCard1)).toBe(true);
    expect(deck.updateCard(1, newCard2)).toBe(true);
    expect(deck.updateCard(2, newCard3)).toBe(true);
    expect(deck.updateCard(3, newCard4)).toBe(true);

    expect(deck.cards).toStrictEqual(expected);
    expect(deck.deckName).toBe("Example Title");
});

test("returns false for updating card outside of index", () => {
    // creating deck and cards
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");

    // adding cards to deck
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);

    // creating new card and updating outside of index
    const newCard = Card("New Card Topic", "New card description");
    expect(deck.updateCard(3, newCard)).toStrictEqual(false);
    expect(deck.deckName).toBe("Example Title");
});

test("returns false for updating deck with not a card", () => {
    // creating deck and cards
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");

    // adding cards to deck
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);

    // creating invalid cards
    const newCard1 = "New Topic, New description, 99";
    const newCard2 = 100;

    // updating index 1 with invalid cards
    expect(deck.updateCard(1, newCard1)).toStrictEqual(false);
    expect(deck.updateCard(1, newCard2)).toStrictEqual(false);
    expect(deck.deckName).toBe("Example Title");
});

test("returns false for updating deck with null object", () => {
    // creating deck and cards
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");

    // adding cards to deck
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);

    const newCard = null;
    expect(deck.updateCard(1, newCard)).toStrictEqual(false);
    expect(deck.deckName).toBe("Example Title");
});

test("returns false for updating deck with non-card object", () => {
    // creating deck and cards
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");

    // adding cards to deck
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);

    // creating invalid new card
    const newCard = {
        "fronttext": "Example Topic3",
        "backtext": "Example description3",
    };

    expect(deck.updateCard(1, newCard)).toStrictEqual(false);
    expect(deck.deckName).toBe("Example Title");
});

test("returns false for updating deck with card with invalid front text", () => {
    // creating deck and cards
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");

    // adding cards to deck
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);

    // creating cards with invalid front text
    const newCard1 = {
        "fronttext": 900,
        "backtext": "Example description",
    };
   const newCard2 = {
        "fronttext": "",
        "backtext": "Example description",
    };
   const newCard3 = {
        "fronttext": "a".repeat(61),
        "backtext": "Example description",
    };

    expect(deck.updateCard(1, newCard1)).toStrictEqual(false);
    expect(deck.updateCard(1, newCard2)).toStrictEqual(false);
    expect(deck.updateCard(1, newCard3)).toStrictEqual(false);
    expect(deck.deckName).toBe("Example Title");
});

test("tries updating entire deck, 1 card is stopped", () => {
    // creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card");
    const card2 = Card("2", "Second Card");

    // adding cards to deck
    deck1.addCard(card1);
    deck1.addCard(card2);

    // creating new cards
    const updateCard1 = Card("New1", "New1 Card");
    const updateCard2 = Card("New2", "New2 Card");
    const updateCard3 = Card("New3", "New3 Card");

    // updates every card, then one outside of the deck 
    expect(deck1.updateCard(0, updateCard1)).toBe(true);
    expect(deck1.updateCard(1, updateCard2)).toBe(true);
    expect(deck1.updateCard(2, updateCard3)).toBe(false);
});

test("returns true when updating with a new card that is the same as the one being replaced", () => {
    // creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card");
    const card2 = Card("2", "Second Card");
    const card3 = Card("3", "Third Card");

    // adding cards to deck
    deck1.addCard(card1);
    deck1.addCard(card2);
    deck1.addCard(card3);

    const newCard = Card("1", "First Card");

    expect(deck1.updateCard(0, newCard)).toBe(true);
});

test("returns false for updating deck with card with invalid back text", () => {
    // creating deck and cards
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");

    // adding cards to deck
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);

    // creating cards with invalid back text
    const newCard1 = {
        "fronttext": "Example Topic",
        "backtext": 900,
    };
    const newCard2 = {
        "fronttext": "Example Topic",
        "backtext": "",
    };

   const newCard3 = {
        "fronttext": "Example Topic",
        "backtext": "a".repeat(61),
    };

    expect(deck.updateCard(1, newCard1)).toStrictEqual(false);
    expect(deck.updateCard(1, newCard2)).toStrictEqual(false);
    expect(deck.updateCard(1, newCard3)).toStrictEqual(false);
    expect(deck.deckName).toBe("Example Title");
});

// addCards 
test("valid Card added to deck", () => {
    // creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card");

    // adding cards to deck
    expect(deck1.addCard(card1)).toBe(true);
});

test("adds card when deck already has cards", () => {
    // creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card");
    const card2 = Card("2", "Second Card");

    // adding cards to deck
    deck1.addCard(card1)
    expect(deck1.addCard(card2)).toBe(true);

});

test("returns false for trying to add card with invalid front text", () => {
    // creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("", "First Card");

    // adding cards to deck
    expect(deck1.addCard(card1)).toBe(false);

});

test("returns false for trying to add card with invalid back text", () => {
    // creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "");

    // adding cards to deck
    expect(deck1.addCard(card1)).toBe(false);

});