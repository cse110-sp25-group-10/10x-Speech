class HomeScreen extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <!-- title, motto text -->
            <header class="top">
                <h1 class="title">10x Cards</h1>
                <h3 class="motto">Study Less, Learn 10x More</h3>
            </header>

            <!-- two buttons, remember to have them glow when you hover over them -->
            <main class="flash-card-container">
                <button class="create-deck">Create a New Deck</button>
                <button class="existing-decks">Study or Edit an Exisiting Deck</button>
            </main>
        `;
        const createDeckBtn = this.querySelector(".create-deck");
        const existingDecksBtn = this.querySelector(".existing-decks");
        createDeckBtn.addEventListener("click", this.swapToCreate);
        existingDecksBtn.addEventListener("click", this.swapToDeck);      
    }

    swapToCreate() {
        this.dispatchEvent(
            new CustomEvent("swap-screen", {
                detail: "create",
                bubbles: true
            }),
        );
    }

    swapToDeck() {
        this.dispatchEvent(
            new CustomEvent("swap-screen", {
                detail: "existing",
                bubbles: true
            }),
        );
    }

    disconnectedCallback() {
        const createDeckBtn = this.querySelector(".create-deck");
        const existingDecksBtn = this.querySelector(".existing-decks");
        createDeckBtn.removeEventListener("click", this.swapToCreate);
        existingDecksBtn.removeEventListener("click", this.swapToDeck);
        this.replaceChildren();
    }
}

customElements.define("home-screen", HomeScreen);