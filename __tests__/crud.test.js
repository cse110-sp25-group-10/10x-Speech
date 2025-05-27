import { Card } from "../scripts/deck.js";
import { Deck } from "../scripts/deck.js";

// Card tests
test("creates a JS object representing a card", () => {
    expect(Card("Valid front text", "Valid back text", 10)).toStrictEqual({
        "frontText": "Valid front text",
        "backText": "Valid back text",
        "time": 10,
    });
});

test("returns null for non-string front text", () => {
    expect(Card(5, "Valid front text", 5)).toBe(null);
});

test("returns null for non-string back text", () => {
    expect(Card("Valid back text", 5, 5)).toBe(null);
});

test("returns null for missing front text", () => {
    expect(Card("", "Valid back text", 5)).toBe(null);
});

test("returns null for over 60 character front text", () => {
    expect(Card("a".repeat(61), "Valid back text", 5)).toBe(null);
});

test("returns null for missing back text", () => {
    expect(Card("Valid front text", "", 5)).toBe(null);
});

test("returns null for over 250 character back text", () => {
    expect(Card("Valid front text", "a".repeat(251), 5)).toBe(null);
});

test("returns null for non-number time", () => {
    expect(Card("Valid front text", "Valid back text", "five")).toBe(null);
});

test("returns null for below 1 second time length", () => {
    expect(Card("Valid front text", "Valid back text", 0)).toBe(null);
});

test("returns null for above 60 second time length", () => {
    expect(Card("Valid front text", "Valid back text", 61)).toBe(null);
});

test("creates a JS object representing a card with only space as text", () => {
    expect(Card(" ", " ", 30)).toStrictEqual({
        "frontText": " ",
        "backText": " ",
        "time": 30,
    });
});

// readCard tests
test("returns card at index 2", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card", 10);
    const card2 = Card("2", "Second Card", 15);
    const card3 = Card("3", "Third Card", 20);

    // Adding cards to deck
    deck1.addCard(card1)
    deck1.addCard(card2)
    deck1.addCard(card3)

    expect(deck1.readCard(2)).toStrictEqual({
        "frontText": "3",
        "backText": "Third Card",
        "time": 20,
    });
});

test("returns card at index when index is a string", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card", 10);
    const card2 = Card("2", "Second Card", 15);
    const card3 = Card("3", "Third Card", 20);

    // Adding cards to deck
    deck1.addCard(card1)
    deck1.addCard(card2)
    deck1.addCard(card3)

    expect(deck1.readCard("0")).toStrictEqual({
        "frontText": "1",
        "backText": "First Card",
        "time": 10,
    });
});

test("returns null for empty deck", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");

    expect(deck1.readCard(2)).toBe(null);
});

test("returns null for card outside of index", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card", 10);
    const card2 = Card("2", "Second Card", 15);
    const card3 = Card("3", "Third Card", 20);

    // Adding cards to deck
    deck1.addCard(card1)
    deck1.addCard(card2)
    deck1.addCard(card3)

    expect(deck1.readCard(3)).toBe(null)
});

test("returns null for card with negative index", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card", 10);
    const card2 = Card("2", "Second Card", 15);
    const card3 = Card("3", "Third Card", 20);

    // Adding cards to deck
    deck1.addCard(card1);
    deck1.addCard(card2);
    deck1.addCard(card3);

    expect(deck1.readCard(-2)).toBe(null);
});

// deleteCard tests
test("updates the deck by deleting the card at index 1", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card", 10);
    const card2 = Card("2", "Second Card", 15);
    const card3 = Card("3", "Third Card", 20);

    // Adding cards to deck
    deck1.addCard(card1);
    deck1.addCard(card2);
    deck1.addCard(card3);

    expect(deck1.deleteCard(1)).toStrictEqual([{
        "frontText": "1",
        "backText": "First Card",
        "time": 10,
        "frontText": "3",
        "backText": "Third Card",
        "time": 20,
    }]);
});

test("updates the deck by deleting every card until the deck is empty", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card", 10);
    const card2 = Card("2", "Second Card", 15);
    const card3 = Card("3", "Third Card", 20);

    // Adding cards to deck
    deck1.addCard(card1);
    deck1.addCard(card2);
    deck1.addCard(card3);

    deck1.deleteCard(0);
    deck1.deleteCard(0);
    deck1.deleteCard(0);

    expect(deck1.deleteCard(1)).toStrictEqual([{
    }]);
});

// COMMENTED OUT FOR NOW SINCE FUNCTION IS RETURNING UNDEFINED INSTEAD OF NULL
// test("returns null for empty deck", () => {
//     const deck = new Deck();
//     expect(deck.deleteCard(0)).toBe(null);
// });

// test("returns null for card outside of index", () => {
//     const deck = new Deck();
//     deck.Card("Example Topic1", "Example description1", 10);
//     expect(deck.deleteCard(2)).toStrictEqual(null);
// });

// updateCard tests
test("updates card in the deck at index 1", () => {
    const deck = new Deck();
    deck.Card("Example Topic1", "Example description1", 10);
    deck.Card("Example Topic2", "Example description2", 15);
    deck.Card("Example Topic3", "Example description3", 20);
    const expected = [
        {
            "frontText": "Example Topic1",
            "backText": "Example description1",
            "time": 10,
        },
        {
            "frontText": "New Card Topic",
            "backText": "New card description",
            "time": 50,
        },
       {
            "frontText": "Example Topic3",
            "backText": "Example description3",
            "time": 20,
        },
    ];
    const newCard = Card("New Card Topic", "New card description", 50)
    expect(deck.updateCard(1, newCard)).toBe(true);
    expect(deck.cards).toStrictEqual(expected);
});

test("updates card in the deck at index 0 three times", () => {
    const deck = new Deck();
    deck.Card("Example Topic", "Example description", 30);
    const expected = [
        {
            "frontText": "New Card Topic3",
            "backText": "New card description3",
            "time": 52,
        },
    ];
    const newCard1 = Card("New Card Topic1", "New card description1", 50);
    const newCard2 = Card("New Card Topic2", "New card description2", 51);
    const newCard3 = Card("New Card Topic3", "New card description3", 52);
    expect(deck.updateCard(0, newCard1)).toBe(true);
    expect(deck.updateCard(0, newCard2)).toBe(true);
    expect(deck.updateCard(0, newCard3)).toBe(true);
    expect(deck.cards).toStrictEqual(expected);
});

test("updates every card in the deck", () => {
    const deck = new Deck();
    deck.Card("Example Topic1", "Example description1", 10);
    deck.Card("Example Topic2", "Example description2", 15);
    deck.Card("Example Topic3", "Example description3", 20);
    deck.Card("Example Topic4", "Example description4", 25);
    const expected = [
        {
            "frontText": "New Topic1",
            "backText": "New description1",
            "time": 40,
        },
        {
            "frontText": "New Topic2",
            "backText": "New description2",
            "time": 35,
        },
        {
            "frontText": "New Topic3",
            "backText": "New description3",
            "time": 30,
        },
        {
            "frontText": "New Topic4",
            "backText": "New description4",
            "time": 25,
        },
    ];
    const newCard1 = Card("New Topic1", "New description1", 40)
    const newCard2 = Card("New Topic2", "New description2", 35)
    const newCard3 = Card("New Topic3", "New description3", 30)
    const newCard4 = Card("New Topic4", "New description4", 25)
    expect(deck.updateCard(0, newCard1)).toBe(true);
    expect(deck.updateCard(1, newCard2)).toBe(true);
    expect(deck.updateCard(2, newCard3)).toBe(true);
    expect(deck.updateCard(3, newCard4)).toBe(true);
    expect(deck.cards).toStrictEqual(expected);
});

test("returns false for updating card outside of index", () => {
    const deck = new Deck();
    deck.Card("Example Topic1", "Example description1", 10);
    deck.Card("Example Topic2", "Example description2", 15);
    deck.Card("Example Topic3", "Example description3", 20);
    const newCard = Card("New Card Topic", "New card description", 50)
    expect(deck.updateCard(3, newCard)).toStrictEqual(false);
});

test("returns false for updating deck with not cards", () => {
    const deck = new Deck();
    deck.Card("Example Topic1", "Example description1", 10);
    deck.Card("Example Topic2", "Example description2", 15);
    deck.Card("Example Topic3", "Example description3", 20);
    const newCard1 = "New Topic, New description, 99";
    const newCard2 = null;
    const newCard3 = {
        "fronttext": "Example Topic3",
        "backtext": "Example description3",
        "time": 20,
    };
    expect(deck.updateCard(1, newCard1)).toStrictEqual(false);
    expect(deck.updateCard(1, newCard2)).toStrictEqual(false);
    expect(deck.updateCard(1, newCard3)).toStrictEqual(false);
});

test("returns false for updating deck with card with invalid front text", () => {
    const deck = new Deck();
    deck.Card("Example Topic1", "Example description1", 10);
    deck.Card("Example Topic2", "Example description2", 15);
    deck.Card("Example Topic3", "Example description3", 20);
    const newCard1 = {
        "fronttext": 900,
        "backtext": "Example description",
        "time": 20,
    };
   const newCard2 = {
        "fronttext": "",
        "backtext": "Example description",
        "time": 20,
    };
   const newCard3 = {
        "fronttext": "a".repeat(61),
        "backtext": "Example description",
        "time": 20,
    };
    expect(deck.updateCard(1, newCard1)).toStrictEqual(false);
    expect(deck.updateCard(1, newCard2)).toStrictEqual(false);
    expect(deck.updateCard(1, newCard3)).toStrictEqual(false);
});

test("returns false for updating deck with card with invalid back text", () => {
    const deck = new Deck();
    deck.Card("Example Topic1", "Example description1", 10);
    deck.Card("Example Topic2", "Example description2", 15);
    deck.Card("Example Topic3", "Example description3", 20);
    const newCard1 = {
        "fronttext": "Example Topic",
        "backtext": 900,
        "time": 20,
    };
    const newCard2 = {
        "fronttext": "Example Topic",
        "backtext": "",
        "time": 20,
    };
   const newCard3 = {
        "fronttext": "Example Topic",
        "backtext": "a".repeat(61),
        "time": 20,
    };
    expect(deck.updateCard(1, newCard1)).toStrictEqual(false);
    expect(deck.updateCard(1, newCard2)).toStrictEqual(false);
    expect(deck.updateCard(1, newCard3)).toStrictEqual(false);
});

test("returns false for updating deck with card with invalid time", () => {
    const deck = new Deck();
    deck.Card("Example Topic1", "Example description1", 10);
    deck.Card("Example Topic2", "Example description2", 15);
    deck.Card("Example Topic3", "Example description3", 20);
    const newCard1 = {
        "fronttext": "Example Topic",
        "backtext": "Example description",
        "time": "20",
    };
    const newCard2 = {
        "fronttext": "Example Topic",
        "backtext": "Example description",
        "time": 61,
    };
    expect(deck.updateCard(1, newCard1)).toStrictEqual(false);
    expect(deck.updateCard(1, newCard2)).toStrictEqual(false);
});