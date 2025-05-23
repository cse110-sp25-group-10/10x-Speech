import { Card, Deck } from "./deck.js";
import "./screens/HomeScreen.js"
import "./screens/CreateScreen.js"

window.addEventListener("DOMContentLoaded", init);

function init() {
    const body = document.querySelector("body");
    const event = new CustomEvent("swap-screen", { detail: "home" });

    body.addEventListener("swap-screen", (e) => {
        switch(e.detail) {
            case "home":
                const homeScreen = document.createElement("home-screen");
                body.replaceChildren();
                body.appendChild(homeScreen);
                break;
            case "create":
                const createScreen = document.createElement("create-screen");
                body.replaceChildren();
                body.appendChild(createScreen);
                break;
        }
    });

    body.dispatchEvent(event);
}