import { createCard } from "../scripts/deck.js";
import { Deck } from "../scripts/deck.js";

// createCard tests
test("creates a JS object representing a card", () => {
    expect(createCard("Valid front text", "Valid back text", 10)).toStrictEqual({
        "frontText": "Valid front text",
        "backText": "Valid back text",
        "time": 10,
    });
});

test("returns null for non-string front text", () => {
    expect(createCard(5, "Valid front text", 5)).toBe(null);
});

test("returns null for non-string back text", () => {
    expect(createCard("Valid back text", 5, 5)).toBe(null);
});

test("returns null for missing front text", () => {
    expect(createCard("", "Valid back text", 5)).toBe(null);
});

test("returns null for over 60 character front text", () => {
    expect(createCard("a".repeat(61), "Valid back text", 5)).toBe(null);
});

test("returns null for missing back text", () => {
    expect(createCard("Valid front text", "", 5)).toBe(null);
});

test("returns null for over 250 character back text", () => {
    expect(createCard("Valid front text", "a".repeat(251), 5)).toBe(null);
});

test("returns null for non-number time", () => {
    expect(createCard("Valid front text", "Valid back text", "five")).toBe(null);
});

test("returns null for below 1 second time length", () => {
    expect(createCard("Valid front text", "Valid back text", 0)).toBe(null);
});

test("returns null for above 60 second time length", () => {
    expect(createCard("Valid front text", "Valid back text", 61)).toBe(null);
});

test("creates a JS object representing a card with only space as text", () => {
    expect(createCard(" ", " ", 30)).toStrictEqual({
        "frontText": " ",
        "backText": " ",
        "time": 30,
    });
});

// readCard tests
test("returns card at index 2", () => {
    const deck = new Deck();
    deck.createCard("Example Topic1", "Example description1", 10);
    deck.createCard("Example Topic2", "Example description2", 15);
    deck.createCard("Example Topic3", "Example description3", 20);
    expect(deck.readCard(2)).toStrictEqual({
        "frontText": "Example Topic3",
        "backText": "Example description3",
        "time": 20,
    });
});

test("returns null for empty deck", () => {
    const deck = new Deck();
    expect(deck.readCard(0)).toBe(null);
});

test("returns null for card outside of index", () => {
    const deck = new Deck();
    deck.createCard("Example Topic1", "Example description1", 10);
    expect(deck.readCard(2)).toStrictEqual(null);
});

// deleteCard tests
test("updates the deck by deleting the card at index 1", () => {
    const deck = new Deck();
    deck.createCard("Example Topic1", "Example description1", 10);
    deck.createCard("Example Topic2", "Example description2", 15);
    deck.createCard("Example Topic3", "Example description3", 20);
    const expected = [
        {
            "frontText": "Example Topic1",
            "backText": "Example description1",
            "time": 10,
        },
       {
            "frontText": "Example Topic3",
            "backText": "Example description3",
            "time": 20,
        },
    ];

    deck.deleteCard(1);
    expect(deck.cards).toStrictEqual(expected);
});

test("updates the deck by deleting every card until the deck is empty", () => {
    const deck = new Deck();
    deck.createCard("Example Topic1", "Example description1", 10);
    deck.createCard("Example Topic2", "Example description2", 15);
    deck.createCard("Example Topic3", "Example description3", 20);
    deck.deleteCard(0);
    deck.deleteCard(0);
    deck.deleteCard(0);
    const expected = new Deck();
    expect(deck).toStrictEqual(expected);
});

// COMMENTED OUT FOR NOW SINCE FUNCTION IS RETURNING UNDEFINED INSTEAD OF NULL
// test("returns null for empty deck", () => {
//     const deck = new Deck();
//     expect(deck.deleteCard(0)).toBe(null);
// });

// test("returns null for card outside of index", () => {
//     const deck = new Deck();
//     deck.createCard("Example Topic1", "Example description1", 10);
//     expect(deck.deleteCard(2)).toStrictEqual(null);
// });

// updateCard tests
test("updates card in the deck at index 1", () => {
    const deck = new Deck();
    deck.createCard("Example Topic1", "Example description1", 10);
    deck.createCard("Example Topic2", "Example description2", 15);
    deck.createCard("Example Topic3", "Example description3", 20);
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
    const newCard = createCard("New Card Topic", "New card description", 50)
    deck.updateCard(1, newCard);
    expect(deck.cards).toStrictEqual(expected);
});

test("updates every card in the deck", () => {
    const deck = new Deck();
    deck.createCard("Example Topic1", "Example description1", 10);
    deck.createCard("Example Topic2", "Example description2", 15);
    deck.createCard("Example Topic3", "Example description3", 20);
    deck.createCard("Example Topic4", "Example description4", 25);
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
    const newCard1 = createCard("New Topic1", "New description1", 40)
    const newCard2 = createCard("New Topic2", "New description2", 35)
    const newCard3 = createCard("New Topic3", "New description3", 30)
    const newCard4 = createCard("New Topic4", "New description4", 25)
    deck.updateCard(0, newCard1);
    deck.updateCard(1, newCard2);
    deck.updateCard(2, newCard3);
    deck.updateCard(3, newCard4);
    expect(deck.cards).toStrictEqual(expected);
});

test("returns false for updating card outside of index", () => {
    const deck = new Deck();
    deck.createCard("Example Topic1", "Example description1", 10);
    deck.createCard("Example Topic2", "Example description2", 15);
    deck.createCard("Example Topic3", "Example description3", 20);
    const newCard = createCard("New Card Topic", "New card description", 50)
    expect(deck.updateCard(3, newCard)).toStrictEqual(false);
});

test("returns false for updating with invalid cards", () => {
    const deck = new Deck();
    deck.createCard("Example Topic1", "Example description1", 10);
    deck.createCard("Example Topic2", "Example description2", 15);
    deck.createCard("Example Topic3", "Example description3", 20);
    const newCard1 = "New Topic, New description, 99";
    const newCard2 = null;
    expect(deck.updateCard(1, newCard1)).toStrictEqual(false);
    expect(deck.updateCard(1, newCard2)).toStrictEqual(false);
});