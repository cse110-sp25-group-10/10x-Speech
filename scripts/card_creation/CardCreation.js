import { getCardCreationHTML } from "./CardCreationHTML.js";
import { getCardCreationCSS } from "./CardCreationCSS.js";

// A form for card creation that can be added to a UI or potentially to the card itself
class CardCreation extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open"});

        // Since the elements of this component will be in the Shadow DOM, get a reference to this element's shadow root before query selecting
        // Example:
        // const newCardForm = document.querySelector("card-creation");
        // const shadow = newCardForm.shadowRoot;
        // const article = shadow.querySelector("article");
        const article = document.createElement("article");
        article.innerHTML = getCardCreationHTML();
        shadow.appendChild(article);

        const style = document.createElement("style");
        style.innerHTML = getCardCreationCSS();
        shadow.appendChild(style);
    }
}

customElements.define("card-creation", CardCreation);