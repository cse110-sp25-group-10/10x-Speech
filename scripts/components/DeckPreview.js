class DeckPreview extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.deckName = this.getAttribute("data-deck-name");
        const deckLength = this.getAttribute("data-deck-length");
        this.innerHTML = `
            <p class="deck-name">${this.deckName}</p>
            <p class="deck-length">(${deckLength} cards)</p>
        `;
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