import { createCard } from "../scripts/deck.js";

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
    expect(createCard("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "Valid back text", 5)).toBe(null);
});

test("returns null for missing back text", () => {
    expect(createCard("Valid front text", "", 5)).toBe(null);
});

test("returns null for over 60 character back text", () => {
    expect(createCard("Valid front text", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", 5)).toBe(null);
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