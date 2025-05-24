import { createCard } from "../scripts/deck.js";

test("creates a JS object representing a card", () => {
    expect(createCard("Title", "Description", 10)).toStrictEqual({
        "frontText": "Title",
        "backText": "Description",
        "time": 10,
    });
});

test("returns null for missing front text", () => {
    expect(createCard("", "Lorem ipsum", 5)).toBe(null);
});
