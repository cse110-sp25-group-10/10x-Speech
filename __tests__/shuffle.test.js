import { Card, Deck, shuffleCards } from "../scripts/deck.js";

// shuffleCards tests
test("shuffled cards should still have the same cards as the original", () => {
    // creating deck
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    const card2 = Card("Example Topic2", "Example description2");
    const card3 = Card("Example Topic3", "Example description3");
    const card4 = Card("Example Topic4", "Example description4");
    const card5 = Card("Example Topic5", "Example description5");
    const card6 = Card("Example Topic6", "Example description6");
    deck.addCard(card1);
    deck.addCard(card2);
    deck.addCard(card3);
    deck.addCard(card4);
    deck.addCard(card5);
    deck.addCard(card6);

    const original = [
        {
            "frontText": "Example Topic1",
            "backText": "Example description1",
        },
        {
            "frontText": "Example Topic2",
            "backText": "Example description2",
        },
       {
            "frontText": "Example Topic3",
            "backText": "Example description3",
        },
        {
            "frontText": "Example Topic4",
            "backText": "Example description4",
        },
        {
            "frontText": "Example Topic5",
            "backText": "Example description5",
        },
       {
            "frontText": "Example Topic6",
            "backText": "Example description6",
        }
    ];
    shuffleCards(deck.cards);

    // make sure order changed
    expect(deck.cards).not.toStrictEqual(original);

    // makes sure all of the cards are still in the deck and that no extra cards were added
    expect(deck.cards.includes(card1)).toBe(true);
    expect(deck.cards.includes(card2)).toBe(true);
    expect(deck.cards.includes(card3)).toBe(true);
    expect(deck.cards.includes(card4)).toBe(true);
    expect(deck.cards.includes(card5)).toBe(true);
    expect(deck.cards.includes(card6)).toBe(true);
    expect(deck.cards.length).toBe(6);
});

test("shuffling with single card deck shouldn't change anything", () => {
    // creating deck
    const deck = Deck("Example Title");
    const card1 = Card("Example Topic1", "Example description1");
    deck.addCard(card1);

    shuffleCards(deck.cards);


    expect(deck.cards).toStrictEqual([card1]);
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
    shuffleCards(deck.cards);

    expect(deck.cards).toStrictEqual([]);
});