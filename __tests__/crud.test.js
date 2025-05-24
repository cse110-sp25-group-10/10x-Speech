import { Card } from "../scripts/deck.js";

test("creates a JS object representing a card", () => {
    expect(Card("Title", "Description", 10)).toStrictEqual({
        "frontText": "Title",
        "backText": "Description",
        "time": 10,
    });
});

test("returns null for missing front text", () => {
    expect(Card("", "Lorem ipsum", 5)).toBe(null);
});
