class ExistingScreen extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <header>
                <h1 class="title">10x Cards</h1>
                <h3 class="motto">Study Less, Learn 10x More</h3>
            </header>
            <main>
                <menu class="top">
                    <h2>Your Decks</h2>
                    <button id="create-speech-button">Create</button>
                </menu>
                <output class="flash-card-container"></output>
                <menu class="bottom">
                    <button id="edit-speech-button">Edit</button>
                    <button id="study-button">Study</button>
                    <button id="delete-speech-button">Delete</button>
                </menu>
            </main>
        `;
    }

    disconnectedCallback() {
        this.replaceChildren();
    }
}

customElements.define("existing-screen", ExistingScreen);