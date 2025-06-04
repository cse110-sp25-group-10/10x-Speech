class DeckPreview extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.deckName = this.getAttribute("data-deck-name");
        const deckLength = this.getAttribute("data-deck-length");
        const p = document.createElement("p");
        p.textContent = `${this.deckName} (${deckLength} cards)`;
        this.appendChild(p);
        this.addEventListener("click", this.dispatch);
    }

    dispatch() {
        const event = new CustomEvent("deck-select", {
            detail: {
                        "node": this,
                        "name": this.deckName
                    },
            bubbles: true
        });
        this.dispatchEvent(event);
    }

    disconnectedCallback() {
        const p = this.querySelector("p");
        p.removeEventListener("click", this.dispatch);
        this.replaceChildren();
    }
}

customElements.define("deck-preview", DeckPreview);