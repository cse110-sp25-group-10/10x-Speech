import { saveDeck } from "../database.js";
import { shuffleCards } from "../deck.js";

const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" href="../../stylesheets/styles.css">
    <link rel="stylesheet" href="../../stylesheets/study_screen.css">
    <header id="study-screen-header">
        <button id="back-button">
            <svg fill="#000000" width="2em" height="2em" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round">
            </g><g id="SVGRepo_iconCarrier"><path d="M27 18.039L16 9.501 5 18.039V14.56l11-8.54 11 8.538v3.481zm-2.75-.31v8.251h-5.5v-5.5h-5.5v5.5h-5.5v-8.25L16
            11.543l8.25 6.186z"></path></g></svg></button>
        <h2 id="deck-name" class="title"></h2>
        <button id="shuffle-toggle-button">Shuffle: Off</button>
    </header id="study-screen-header">
    <section id="card-container">
        <div class="flip-card">
            <div class="flip-card-inner">
                <div class="card card-front">
                    <p id="front-content" class="card-content" style="color:black">Tomatoes!</p>
                </div>
                <div class="card card-back">
                    <p id="back-content" class="card-content" style="color:black">Potatoes!</p>
                </div>
            </div>
        </div>
    </section>
    <button id="flip-card">
        <svg fill="#000000" width="1em" height="1em" viewBox="0 0 24.00 24.00" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round">
            </g><g id="SVGRepo_iconCarrier"> <g data-name="Layer 2"> <g data-name="flip-2"> <rect width="24" height="24"
            transform="rotate(180 12 12)" opacity="0"></rect> <path d="M6.09 19h12l-1.3 1.29a1 1 0 0 0 1.42 1.42l3-3a1 1 0 0
            0 0-1.42l-3-3a1 1 0 0 0-1.42 0 1 1 0 0 0 0 1.42l1.3 1.29h-12a1.56 1.56 0 0 1-1.59-1.53V13a1 1 0 0 0-2 0v2.47A3.56 3.56 0
            0 0 6.09 19z"></path> <path d="M5.79 9.71a1 1 0 1 0 1.42-1.42L5.91 7h12a1.56 1.56 0 0 1 1.59 1.53V11a1 1 0 0 0
            2 0V8.53A3.56 3.56 0 0 0 17.91 5h-12l1.3-1.29a1 1 0 0 0 0-1.42 1 1 0 0 0-1.42 0l-3 3a1 1 0 0 0 0 1.42z"></path> </g> </g> </g>
        </svg>
         Flip
    </button>
    <footer id="study-footer">
        <section class="status">
            <span class="timer">
                <svg fill="#000000" width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g data-name="Layer 2"> <g data-name="clock">
                <rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"></rect> <path d="M12 2a10 10 0 1
                0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path> <path d="M16 11h-3V8a1 1 0 0 0-2 0v4a1
                1 0 0 0 1 1h4a1 1 0 0 0 0-2z"></path> </g> </g> </g></svg> 0s</span>
        </section>
        <nav id="study-controls" class="controls bottom">
            <button id="prev-card" disabled>Previous</button>
            <button id="practice-button">Start Practice</button>
            <button id="next-card" disabled>Next</button>
        </nav>
    </footer>
`;

class StudyScreen extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._deck = null;
        this.shuffledCards = [];
        this.shouldShuffle = false;
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
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Get element references
        this.elements = {
            deckName: this.shadowRoot.querySelector("#deck-name"),
            backButton: this.shadowRoot.querySelector("#back-button"),
            practiceButton: this.shadowRoot.querySelector("#practice-button"),
            timer: this.shadowRoot.querySelector(".timer"),
            prevButton: this.shadowRoot.querySelector("#prev-card"),
            flipButton: this.shadowRoot.querySelector("#flip-card"),
            nextButton: this.shadowRoot.querySelector("#next-card"),
            cardContainer: this.shadowRoot.querySelector("#card-container"),
            cardFront: this.shadowRoot.querySelector(".card-front"),
            cardBack: this.shadowRoot.querySelector(".card-back"),
            cardFrontContent: this.shadowRoot.querySelector("#front-content"),
            cardBackContent: this.shadowRoot.querySelector("#back-content"),
            flipCardContainer: this.shadowRoot.querySelector(".flip-card"),
            clearAttemptsButton: this.shadowRoot.querySelector("#clear-attempts-button"),
            shuffleToggleButton: this.shadowRoot.querySelector("#shuffle-toggle-button"),
        };

        // Add event listeners using named functions
        this.elements.backButton.addEventListener("click", this.handleBackButtonClick.bind(this));
        this.elements.practiceButton.addEventListener(
            "click",
            this.handlePracticeButtonClick.bind(this)
        );

        this.elements.shuffleToggleButton = this.shadowRoot.querySelector("#shuffle-toggle-button");
        this.elements.shuffleToggleButton.addEventListener(
            "click",
            this.handleShuffleToggleClick.bind(this)
        );

        this.elements.nextButton.addEventListener("click", this.handleNextButtonClick.bind(this));
        this.elements.prevButton.addEventListener("click", this.handlePrevButtonClick.bind(this));
        this.elements.flipButton.addEventListener("click", this.handleFlipButtonClick.bind(this));
        this.elements.cardContainer.addEventListener(
            "click",
            this.handleCardContainerClick.bind(this)
        );

        this.updateShuffleButtonLabel();

        this.render();
    }

    disconnectedCallback() {
        // Clean up the timer when the element is removed
        this.stopTimer();
    }

    /**
     * Toggles the practice mode on and off.
     * When starting, shuffles cards and resets timer.
     * When ending, saves practice times.
     */
    togglePracticeMode() {
        if (this.isPracticing) {
            // Save time spent on the current card before ending practice
            this.saveCurrentCardTime();
            // Practice is ending: save times to IndexedDB
            this.savePracticeTimes();
        }

        this.isPracticing = !this.isPracticing;
        if (this.isPracticing) {
            this.practiceTimes = Array(this.shuffledCards.length).fill(0);
            this.practiceStart = Date.now();
            this.lastCardIndex = this.currentIndex;
            // Shuffle the deck depending on toggleable state
            this.shuffledCards = this.shouldShuffle
                ? shuffleCards([...this._deck.cards])
                : [...this._deck.cards];

            this.currentIndex = 0;

            // Update UI
            this.elements.practiceButton.textContent = "End Practice";
            this.elements.practiceButton.classList.add("active");
            this.elements.shuffleToggleButton.disabled = this.isPracticing;
            this.startTimer();

            // Switch to practice mode layout
            this.elements.cardContainer.classList.add("practice-mode");
        } else {
            // Reset to initial state
            this.shuffledCards = [...this._deck.cards];
            this.currentIndex = 0;

            // Update UI
            this.elements.practiceButton.textContent = "Start Practice";
            this.elements.practiceButton.classList.remove("active");

            this.stopTimer();

            // Show the last card's time after ending practice
            if (this.practiceTimes && typeof this.lastCardIndex === "number") {
                const lastTime = this.practiceTimes[this.lastCardIndex] || 0;
                this.elements.timer.textContent = `Time: ${lastTime}s`;
            } else {
                this.elements.timer.textContent = "Time: 0s";
            }

            // Switch to default layout
            this.elements.cardContainer.classList.remove("practice-mode");
            this.elements.shuffleToggleButton.disabled = false;
        }
        this.render();
    }

    /**
     * Navigates to the next or previous card.
     * @param {number} direction - 1 for next, -1 for previous.
     */
    navigateCard(direction) {
        const newIndex = this.currentIndex + direction;
        if (newIndex >= 0 && newIndex < this.shuffledCards.length) {
            if (this.isPracticing) {
                // Save time spent on current card
                this.saveCurrentCardTime();
            }
            this.currentIndex = newIndex;
            if (this.isPracticing) {
                this.startTimer();
            }
            this.render();
        }
    }

    /**
     * Flips the current card to show the back or front.
     */
    flipCard() {
        if (!this._deck || this._deck.cards.length === 0) return;
        this.elements.flipCardContainer.classList.toggle("flipped");
    }

    /**
     * Renders the current state of the study screen.
     * Updates card content, navigation, and practice data.
     */
    render() {
        if (!this._deck) return;

        // Always reset flip on render in practice mode
        this.elements.flipCardContainer.classList.remove("flipped");

        // Update deck name
        this.elements.deckName.textContent = `${this._deck.deckName}`;

        const cardCount = this.shuffledCards.length;
        if (cardCount === 0) {
            this.elements.cardFrontContent.textContent = "This deck has no cards.";
            this.elements.cardBackContent.textContent = "";
            this.elements.practiceButton.setAttribute("disabled", "");
            // Clear timer/practice info
            this.elements.timer.textContent = "Time: 0s";
            return;
        }

        // Enable/disable navigation buttons
        this.elements.nextButton.disabled = this.currentIndex >= cardCount - 1;
        this.elements.prevButton.disabled = this.currentIndex <= 0;

        // Update card content
        const currentCard = this.shuffledCards[this.currentIndex];
        this.elements.cardFrontContent.textContent = currentCard.frontText;
        this.elements.cardBackContent.textContent = currentCard.backText;

        const originalIndex = this._deck.cards.findIndex(
            (card) =>
                card.frontText === currentCard.frontText && card.backText === currentCard.backText
        );
        let practiceTimeText = "";
        if (
            originalIndex !== -1 &&
            Array.isArray(this._deck.cards[originalIndex].practiceTimes) &&
            this._deck.cards[originalIndex].practiceTimes.length > 0
        ) {
            const times = this._deck.cards[originalIndex].practiceTimes;
            const lastTime = times[times.length - 1];
            practiceTimeText = `Last practice: ${lastTime}s`;
        } else {
            practiceTimeText = "No practice data";
        }

        // Update the timer area to include last practice
        // If timer is running, keep the time, else default to 0s
        this.elements.timer.textContent = `${practiceTimeText}`;
    }

    /**
     * Starts the timer for the current card.
     */
    startTimer() {
        this.stopTimer();
        this.cardTime = 0;
        this.elements.timer.textContent = "Time: 0s";
        this.timerInterval = setInterval(() => {
            this.cardTime++;
            this.elements.timer.textContent = `Time: ${this.cardTime}s`;
        }, 1000);
        this.practiceStart = Date.now();
    }

    /**
     * Stops the current timer.
     */
    stopTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }

    /**
     * Save practice times for each card to IndexedDB.
     */
    async savePracticeTimes() {
        // Attach times to each card in the original deck order
        for (let i = 0; i < this.shuffledCards.length; i++) {
            const shuffledCard = this.shuffledCards[i];
            const originalIndex = this._deck.cards.findIndex(
                (card) =>
                    card.frontText === shuffledCard.frontText &&
                    card.backText === shuffledCard.backText
            );
            if (originalIndex !== -1) {
                const card = this._deck.cards[originalIndex];
                if (!Array.isArray(card.practiceTimes)) card.practiceTimes = [];

                // Push new time into specific card
                card.practiceTimes.push(this.practiceTimes[i]);

                // Remove oldest attempt to keep 5 latest attempts per card
                while (card.practiceTimes.length > 5) {
                    card.practiceTimes.shift();
                }
            }
        }
        // Save the deck
        if (this._deck) {
            await saveDeck(this._deck);
        }
    }

    /**
     * Save the time spent on the current card.
     */
    saveCurrentCardTime() {
        if (!this.practiceTimes) return;
        const elapsed = Math.floor((Date.now() - this.practiceStart) / 1000);
        this.practiceTimes[this.currentIndex] += elapsed;
        this.practiceStart = Date.now();
    }

    // Event handler functions
    handleBackButtonClick() {
        this.dispatchEvent(new CustomEvent("study-finished"));
    }

    handlePracticeButtonClick() {
        this.togglePracticeMode();
    }

    handleNextButtonClick() {
        this.navigateCard(1);
    }

    handlePrevButtonClick() {
        this.navigateCard(-1);
    }

    handleFlipButtonClick() {
        this.flipCard();
    }

    handleCardContainerClick() {
        this.flipCard();
    }

    handleShuffleToggleClick() {
        this.shouldShuffle = !this.shouldShuffle;
        this.elements.shuffleToggleButton.textContent = `Shuffle: ${
            this.shouldShuffle ? "On" : "Off"
        }`;
    }

    updateShuffleButtonLabel() {
        this.elements.shuffleToggleButton.textContent = `Shuffle: ${
            this.shouldShuffle ? "On" : "Off"
        }`;
    }
}

customElements.define("study-screen", StudyScreen);
