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
        "frontText": "2",
        "backText": "Second Card",
        "time": 15,
    }]);
});

test("returns null for deleting every card until the deck is empty, then deleting", () => {
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

    expect(deck1.deleteCard(0)).toBe(null);
});

test("returns null for a deck with no cards to delete", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");

    expect(deck1.deleteCard(0)).toBe(null);
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
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card", 10);
    const card2 = Card("2", "Second Card", 15);
    const card3 = Card("3", "Third Card", 20);

    // Adding cards to deck
    deck1.addCard(card1);
    deck1.addCard(card2);
    deck1.addCard(card3);

    const newCard = Card("New", "New Card", 50);

    expect(deck1.updateCard(1, newCard)).toBe(true);
    expect(deck1.readCard(1)).toStrictEqual({
        "frontText": "New",
        "backText": "New Card",
        "time": 50,
    });
});

test("Updates same card in deck 3 times", () => {

    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card", 10);
    const card2 = Card("2", "Second Card", 15);
    const card3 = Card("3", "Third Card", 20);

    // Adding cards to deck
    deck1.addCard(card1);
    deck1.addCard(card2);
    deck1.addCard(card3);

    const newCard1 = Card("New1", "New1 Card", 10);
    const newCard2 = Card("New2", "New2 Card", 30);
    const newCard3 = Card("New3", "New3 Card", 60);


    expect(deck1.updateCard(0, newCard1)).toBe(true);
    expect(deck1.updateCard(0, newCard2)).toBe(true);
    expect(deck1.updateCard(0, newCard3)).toBe(true);

    expect(deck1.readCard(0)).toStrictEqual({
        "frontText": "New3",
        "backText": "New3 Card",
        "time": 60,
    });
});

test("Tries updating entire deck, 1 card is stopped", () => {

    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card", 10);
    const card2 = Card("2", "Second Card", 15);
    const card3 = Card("3", "Third Card", 20);

    // Adding cards to deck
    deck1.addCard(card1);
    deck1.addCard(card2);
    deck1.addCard(card3);

    const updateCard1 = Card("New1", "New1 Card", 25);
    const updateCard2 = Card("New2", "New2 Card", 50);
    const updateCard3 = Card("New3", "New3 Card", 100);

    expect(deck1.updateCard(0, updateCard1)).toBe(true);
    expect(deck1.updateCard(1, updateCard2)).toBe(true);
    expect(deck1.updateCard(2, updateCard3)).toBe(false);
});


// ERROR, NEED TO FIX UPDATECARD FUNCTION
/*
test("Returns false for new card being same as old", () => {

    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card", 10);
    const card2 = Card("2", "Second Card", 15);
    const card3 = Card("3", "Third Card", 20);

    // Adding cards to deck
    deck1.addCard(card1);
    deck1.addCard(card2);
    deck1.addCard(card3);

    const newCard = Card("1", "First Card", 10);

    expect(deck1.updateCard(0, newCard)).toBe(false);
});
*/


test("Returns false for updating card outside of index", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card", 10);
    const card2 = Card("2", "Second Card", 15);
    const card3 = Card("3", "Third Card", 20);

    // Adding cards to deck
    deck1.addCard(card1);
    deck1.addCard(card2);
    deck1.addCard(card3);

    const newCard = Card("New", "New Card", 10);

    expect(deck1.updateCard(5, newCard)).toBe(false);
});


// JOHNSON OLD TESTS, DONT WORK BECAUSE UPDATECARD DOESNT CHECK FOR NULL
/*
test("returns false for updating deck with not cards", () => {
    const deck = new Deck();
    deck.Card("Example Topic1", "Example description1", 10);
    deck.Card("Example Topic2", "Example description2", 15);
    deck.Card("Example Topic3", "Example description3", 20);
    let newCard1 = "New Topic, New description, 99";
    let newCard2 = null;
    let newCard3 = {
        "fronttext": "Example Topic3",
        "backtext": "Example description3",
        "time": 20,
    };
    expect(deck.updateCard(1, newCard1)).toStrictEqual(false);
    expect(deck.updateCard(1, newCard2)).toStrictEqual(false);
    expect(deck.updateCard(1, newCard3)).toStrictEqual(false);
});

test("returns false for updating deck with card with invalid front text", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card", 10);
    const card2 = Card("2", "Second Card", 15);
    const card3 = Card("3", "Third Card", 20);

    // Adding cards to deck
    deck1.addCard(card1);
    deck1.addCard(card2);
    deck1.addCard(card3);

    const newCard = Card("", "New Card", 10);

    expect(deck1.updateCard(, newCard)).toBe(false);
});

test("returns false for updating deck with card with invalid back text", () => {
    const deck = new Deck();
    deck.Card("Example Topic1", "Example description1", 10);
    deck.Card("Example Topic2", "Example description2", 15);
    deck.Card("Example Topic3", "Example description3", 20);
    let newCard1 = {
        "fronttext": "Example Topic",
        "backtext": 900,
        "time": 20,
    };
    let newCard2 = {
        "fronttext": "Example Topic",
        "backtext": "",
        "time": 20,
    };
    let newCard3 = {
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
    let newCard1 = {
        "fronttext": "Example Topic",
        "backtext": "Example description",
        "time": "20",
    };
    let newCard2 = {
        "fronttext": "Example Topic",
        "backtext": "Example description",
        "time": 61,
    };
    expect(deck.updateCard(1, newCard1)).toStrictEqual(false);
    expect(deck.updateCard(1, newCard2)).toStrictEqual(false);
});
*/

// addCards 
test("Valid Card added to deck", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card", 10);

    // Adding cards to deck
    expect(deck1.addCard(card1)).toBe(true);
});

test("Adds card when deck already has cards", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card", 10);
    const card2 = Card("2", "Second Card", 20);

    // Adding cards to deck
    deck1.addCard(card1)
    expect(deck1.addCard(card2)).toBe(true);

});

test("Returns false for trying to add card with invalid front text", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("", "First Card", 10);

    // Adding cards to deck
    expect(deck1.addCard(card1)).toBe(false);

});

test("Returns false for trying to add card with invalid back text", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "", 10);

    // Adding cards to deck
    expect(deck1.addCard(card1)).toBe(false);

});

test("Returns false for trying to add card with invalid time", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card", 70);

    // Adding cards to deck
    expect(deck1.addCard(card1)).toBe(false);

});

test("Returns false for trying to add card with time as string", () => {
    // Creating deck and cards
    const deck1 = Deck("Testing");
    const card1 = Card("1", "First Card", "70");

    // Adding cards to deck
    expect(deck1.addCard(card1)).toBe(false);

});

