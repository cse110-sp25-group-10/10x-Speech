class ExistingScreen extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <header>
                <h1 class="title">10x Speech</h1>
                <h3 class="motto">Practice Less, Say 10x More</h3>
            </header>
            <main>
                <menu class="top">
                    <h2>Your Decks (<span class="deck-count">0</span>)</h2>
                    <button id="create-speech-button">Create</button>
                </menu>
                <output class="flash-card-container"></output>
                <menu class="bottom">
                    <button id="edit-speech-button" disabled>Edit</button>
                    <button id="study-button" disabled>Study</button>
                    <button id="delete-speech-button" disabled>Delete</button>
                </menu>
            </main>
        `;
    }

    disconnectedCallback() {
        this.replaceChildren();
    }
}

customElements.define("existing-screen", ExistingScreen);