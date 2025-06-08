import { Card, Deck, shuffleCards } from "../scripts/deck.js";

// shuffleCards tests
test("shuffled cards should still have the same cards as the original", () => {
    // creating deck
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);

    const shuffled = shuffleCards(deck.cards);

    expect(shuffled.sort()).toStrictEqual(deck.cards.sort());
});

test("shuffling with single card deck shouldn't change anything", () => {
    // creating deck
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    deck.addCard(card1);

    const shuffled = shuffleCards(deck.cards);

    expect(shuffled).toStrictEqual(deck.cards);
});

test("returns null for shuffling non-array objects", () => {
    // creating invalid deck
    const deck = "this is not a deck";
    const shuffled = shuffleCards(deck.cards);

    expect(shuffled).toBe(null);
});

test("shuffling empty deck should still work and keep deck empty", () => {
    // creating deck
    const deck = Deck("Example Title");
    const shuffled = shuffleCards(deck.cards);

    expect(shuffled).toStrictEqual(deck.cards);
});

test("shuffled cards should work with letters, numberes, and symbols", () => {
    // creating deck
    const deck = Deck("R@nd0m ");
    const card1 = Card("123456789", "aeiou");
    const card2 = Card("%@!^&gshyis", "the front is gibberish");
    const card3 = Card("xopa8*(89*", "some symbols and numbers and letters");
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);

    const shuffled = shuffleCards(deck.cards);

    expect(shuffled.sort()).toStrictEqual(deck.cards.sort());
});