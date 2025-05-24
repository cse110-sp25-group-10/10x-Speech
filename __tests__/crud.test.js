import { createCard } from "../scripts/deck.js";

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
    expect(readCard(deck, 2)).toStrictEqual({
        "frontText": "Example Topic3",
        "backText": "Example description3",
        "time": 20,
    });
});

test("returns null for empty deck", () => {
    const deck = new Deck();
    expect(readCard(deck, 0)).toBe(null);
});

test("returns null for null deck", () => {
    expect(readCard(null, 0)).toBe(null);
});

test("returns null for card outside of index", () => {
    const deck = new Deck();
    deck.createCard("Example Topic1", "Example description1", 10);
    expect(readCard(deck, 2)).toStrictEqual(null);
});

// deleteCard tests
test("updates the deck by deleting the card at index 1", () => {
    const deck = new Deck();
    deck.createCard("Example Topic1", "Example description1", 10);
    deck.createCard("Example Topic2", "Example description2", 15);
    deck.createCard("Example Topic3", "Example description3", 20);
    const expected = new Deck();
    deck.createCard("Example Topic1", "Example description1", 10);
    deck.createCard("Example Topic3", "Example description3", 20);
    deleteCard(deck, 1);
    expect(deck).toStrictEqual(expected);
});

test("returns null for empty deck", () => {
    const deck = new Deck();
    expect(deleteCard(deck, 0)).toBe(null);
});

test("returns null for card outside of index", () => {
    const deck = new Deck();
    deck.createCard("Example Topic1", "Example description1", 10);
    expect(deleteCard(deck, 2)).toStrictEqual(null);
});

// updateCard tests


