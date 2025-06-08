import { Card } from "../scripts/deck.js";
import { Deck } from "../scripts/deck.js";

// Card tests
test("creates a JS object representing a card", () => {
    expect(Card("Valid front text", "Valid back text")).toStrictEqual({
        "frontText": "Valid front text",
        "backText": "Valid back text",
    });
});

test("returns null for non-string front text", () => {
    expect(Card(5, "Valid front text")).toBe(null);
});

test("returns null for non-string back text", () => {
    expect(Card("Valid back text", 5)).toBe(null);
});

test("returns null for missing front text", () => {
    expect(Card("", "Valid back text")).toBe(null);
});

test("returns null for over 60 character front text", () => {
    expect(Card("a".repeat(61), "Valid back text")).toBe(null);
});

test("returns null for missing back text", () => {
    expect(Card("Valid front text", "")).toBe(null);
});

test("returns null for over 250 character back text", () => {
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
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");
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
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card");
    const card2 = Card("2", "Second Card");
    const card3 = Card("3", "Third Card");

    // Adding cards to deck
    deck1.addCard(card1)
    deck1.addCard(card2)
    deck1.addCard(card3)

    expect(deck1.readCard("0")).toStrictEqual({
        "frontText": "1",
        "backText": "First Card",
    });
});

test("returns null for card with negative index", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card");
    const card2 = Card("2", "Second Card");
    const card3 = Card("3", "Third Card");

    // Adding cards to deck
    deck1.addCard(card1);
    deck1.addCard(card2);
    deck1.addCard(card3);

    expect(deck1.readCard(-2)).toBe(null);
});

test("returns card at index 0 when deck size is 1", () => {
    const deck = Deck("Example Title");
    const card = Card("Example Topic", "Example description");
    deck.addCard(card);
    expect(deck.readCard(0)).toStrictEqual({
        "frontText": "Example Topic",
        "backText": "Example description",
    });
    expect(deck.deckName).toBe("Example Title");
});

test("returns null for empty deck", () => {
    const deck = Deck("Empty Deck");
    expect(deck.readCard(0)).toBe(null);
    expect(deck.deckName).toBe("Empty Deck");
});

test("returns null for reading card outside of index", () => {
    const deck = Deck("Empty Deck");
    const card = Card("Example Topic1", "Example description1");
    deck.addCard(card);
    expect(deck.readCard(2)).toStrictEqual(null);
    expect(deck.deckName).toBe("Empty Deck");
});

// deleteCard tests
test.skip("updates the deck by deleting the card at index 1", () => {
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");
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
    expect(deck.deleteCard(1)).toStrictEqual(card2);
    expect(deck.cards).toStrictEqual(expected);
    expect(deck.deckName).toBe("Example Title");
});

test.skip("updates the deck by deleting every card until the deck is empty", () => {
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);
    expect(deck.deleteCard(0)).toStrictEqual(card1);
    expect(deck.deleteCard(0)).toStrictEqual(card2);
    expect(deck.deleteCard(0)).toStrictEqual(card3);
    const expected = Deck("Empty Deck");
    expect(deck.cards).toStrictEqual(expected.cards);
    expect(deck.deckName).toBe("Example Title");
});

test("returns null for empty deck", () => {
    const deck = Deck("Empty Deck");
    expect(deck.deleteCard(0)).toBe(null);
    expect(deck.deckName).toBe("Empty Deck");
});

test.skip("returns null for deleting card outside of index", () => {
    const deck = Deck("Empty Deck");
    const card = Card("Example Topic1", "Example description1");
    deck.addCard(card);
    expect(deck.deleteCard(2)).toStrictEqual(null);
    expect(deck.deckName).toBe("Empty Deck");
});

test("returns null for deleting every card until the deck is empty, then deleting", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card");
    const card2 = Card("2", "Second Card");
    const card3 = Card("3", "Third Card");

    // Adding cards to deck
    deck1.addCard(card1);
    deck1.addCard(card2);
    deck1.addCard(card3);

    deck1.deleteCard(0);
    deck1.deleteCard(0);
    deck1.deleteCard(0);

    expect(deck1.deleteCard(0)).toBe(null);
});

// updateCard tests
test("updates card in the deck at index 1", () => {
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");
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
    const newCard = Card("New Card Topic", "New card description")
    expect(deck.updateCard(1, newCard)).toBe(true);
    expect(deck.cards).toStrictEqual(expected);
    expect(deck.deckName).toBe("Example Title");
});

test("updates card in the deck at index 0 three times", () => {
    const deck = Deck("Example Title");
    const card = Card("Example Topic", "Example description");
    deck.addCard(card);
    const expected = [
        {
            "frontText": "New Card Topic3",
            "backText": "New card description3",
        },
    ];
    const newCard1 = Card("New Card Topic1", "New card description1");
    const newCard2 = Card("New Card Topic2", "New card description2");
    const newCard3 = Card("New Card Topic3", "New card description3");
    expect(deck.updateCard(0, newCard1)).toBe(true);
    expect(deck.updateCard(0, newCard2)).toBe(true);
    expect(deck.updateCard(0, newCard3)).toBe(true);
    expect(deck.cards).toStrictEqual(expected);
    expect(deck.deckName).toBe("Example Title");
});

test("updates every card in the deck", () => {
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");
    const card4 = Card("Example Topic4", "Example description4");
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
    const newCard1 = Card("New Topic1", "New description1");
    const newCard2 = Card("New Topic2", "New description2");
    const newCard3 = Card("New Topic3", "New description3");
    const newCard4 = Card("New Topic4", "New description4");
    expect(deck.updateCard(0, newCard1)).toBe(true);
    expect(deck.updateCard(1, newCard2)).toBe(true);
    expect(deck.updateCard(2, newCard3)).toBe(true);
    expect(deck.updateCard(3, newCard4)).toBe(true);
    expect(deck.cards).toStrictEqual(expected);
    expect(deck.deckName).toBe("Example Title");
});

test("returns false for updating card outside of index", () => {
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);
    const newCard = Card("New Card Topic", "New card description");
    expect(deck.updateCard(3, newCard)).toStrictEqual(false);
    expect(deck.deckName).toBe("Example Title");
});

test("returns false for updating deck with not a card", () => {
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);
    const newCard1 = "New Topic, New description, 99";
    const newCard2 = 100;
    expect(deck.updateCard(1, newCard1)).toStrictEqual(false);
    expect(deck.updateCard(1, newCard2)).toStrictEqual(false);
    expect(deck.deckName).toBe("Example Title");
});

test.skip("returns false for updating deck with null object", () => {
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);
    const newCard = null;
    expect(deck.updateCard(1, newCard)).toStrictEqual(false);
    expect(deck.deckName).toBe("Example Title");
});

test("returns false for updating deck with non-card object", () => {
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);
    const newCard = {
        "fronttext": "Example Topic3",
        "backtext": "Example description3",
    };
    expect(deck.updateCard(1, newCard)).toStrictEqual(false);
    expect(deck.deckName).toBe("Example Title");
});

test("returns false for updating deck with card with invalid front text", () => {
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);
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

test("Tries updating entire deck, 1 card is stopped", () => {

    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card");
    const card2 = Card("2", "Second Card");

    // Adding cards to deck
    deck1.addCard(card1);
    deck1.addCard(card2);

    const updateCard1 = Card("New1", "New1 Card");
    const updateCard2 = Card("New2", "New2 Card");
    const updateCard3 = Card("New3", "New3 Card");

    expect(deck1.updateCard(0, updateCard1)).toBe(true);
    expect(deck1.updateCard(1, updateCard2)).toBe(true);
    expect(deck1.updateCard(2, updateCard3)).toBe(false);
});

test("Returns true when new card same as old", () => {

    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card");
    const card2 = Card("2", "Second Card");
    const card3 = Card("3", "Third Card");

    // Adding cards to deck
    deck1.addCard(card1);
    deck1.addCard(card2);
    deck1.addCard(card3);

    const newCard = Card("1", "First Card");

    expect(deck1.updateCard(0, newCard)).toBe(true);
});

test("returns false for updating deck with card with invalid back text", () => {
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);
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
test("Valid Card added to deck", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card");

    // Adding cards to deck
    expect(deck1.addCard(card1)).toBe(true);
});

test("Adds card when deck already has cards", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card");
    const card2 = Card("2", "Second Card");

    // Adding cards to deck
    deck1.addCard(card1)
    expect(deck1.addCard(card2)).toBe(true);

});

test("Returns false for trying to add card with invalid front text", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("", "First Card");

    // Adding cards to deck
    expect(deck1.addCard(card1)).toBe(false);

});

test("Returns false for trying to add card with invalid back text", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "");

    // Adding cards to deck
    expect(deck1.addCard(card1)).toBe(false);

});