import "./screens/HomeScreen.js"
import "./screens/CreateScreen.js"

window.addEventListener("DOMContentLoaded", init);

function init() {
    const flashcardApp = document.querySelector("flashcard-app");
    initHome();

    /**
     * Swap to the home screen
     */
    function initHome() {
        flashcardApp.replaceChildren();
        const homeScreen = document.createElement("home-screen");
        flashcardApp.appendChild(homeScreen);

        // Get references to the buttons within the home screen
        const createDeck = document.querySelector(".create-deck");
        const existingDecks = document.querySelector(".existing-decks");

        // Add event listeners
        createDeck.addEventListener("click", swapToCreate);
        existingDecks.addEventListener("click", swapToExisting);

        /**
         * Swap to the deck creation screen
         */
        function swapToCreate() {
            clearEvents();
            initCreate();
        }

        /**
         * Swap to the existing decks screen
         */
        function swapToExisting() {
            clearEvents();
            initExisting();
        }

        /**
         * Remove event listeners from the home screen elements to prevent memory leaks
         */
        function clearEvents() {
            createDeck.removeEventListener("click", swapToCreate);
            existingDecks.removeEventListener("click", swapToExisting);
        }
    }


    /**
     * Swap to the deck creation screen
     */
    function initCreate() {
        // TODO: Set up creation screen implementation
        flashcardApp.replaceChildren();
        const createScreen = document.createElement("create-screen");
        flashcardApp.appendChild(createScreen);

        // Get references to the buttons within the deck creation screen
        const home = flashcardApp.querySelector("#home-button");

        // Add event listeners
        home.addEventListener("click", swapToHome);

        /**
         * Swap to the home screen
         */
        function swapToHome() {
            clearEvents();
            initHome();
        }

        /**
         * Remove event listeners from the deck creation screen to prevent memory leaks
         */
        function clearEvents() {
            home.removeEventListener("click", swapToHome);
        }
    }

    function initExisting() {
        // TODO: Add functionality to swap to existing decks screen
    }
}