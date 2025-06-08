import { saveDeck } from "../database.js";
import { shuffleCards } from "../deck.js";

const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" href="../../stylesheets/styles.css">
    <link rel="stylesheet" href="../../stylesheets/deck_selection.css">
    <link rel="stylesheet" href="../../stylesheets/preparing_speech.css">
    <link rel="stylesheet" href="../../stylesheets/existing_flashcard.css">
    <link rel="stylesheet" href="../../stylesheets/study_screen.css">
    <header>
        <h2 id="deck-name" class="title"></h2>
        <button id="back-button">Back</button>
    </header>
    <section id="card-container" class="flash-card-container">
        <div class="flip-card">
            <div class="flip-card-inner">
                <div class="card card-front"></div>
                <div class="card card-back"></div>
            </div>
        </div>
    </section>
    <span class="card-counter">Card 0 / 0</span>
    <div class="card-timestamps"></div>
    <button id="clear-attempts-button" style="margin-top:8px;">Clear Attempts</button>
    <footer>
        <section class="status">
            <button id="practice-button">Start Practice</button>
            <button id="shuffle-toggle-button">Shuffle: On</button>
            <span class="timer">Time: 0s</span>
        </section>
        <nav class="controls bottom">
            <button id="prev-card" disabled>Previous</button>
            <button id="flip-card" disabled>Flip</button>
            <button id="next-card" disabled>Next</button>
        </nav>
    </footer>
`;

class StudyScreen extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this._deck = null;
        this.shuffledCards = [];
        this.shouldShuffle = true;
        this.currentIndex = 0;
        this.isPracticing = false;
        this.timerInterval = null;
        this.cardTime = 0;
    }

    set deck(deckData) {
        this._deck = deckData;
        this.shuffledCards = [...this._deck.cards]; // Start with unshuffled
    }

    connectedCallback() {
        
    }
}
