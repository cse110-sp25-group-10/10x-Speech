import "./screens/HomeScreen.js";
import "./screens/CreateScreen.js";
import "./screens/ExistingScreen.js";
import "./components/CardPreview.js";
import "./components/DeckPreview.js";
import "./screens/DeckScreen.js";
import { Deck, Card } from "./deck.js";
import { saveDeck, getAllDecks, deleteDeckDB } from "./database.js";

window.addEventListener("DOMContentLoaded", init);

// Application state to hold loaded decks and the deck currently being created
const appState = {
    decks: {}, // Stores Deck instances, keyed by deckName: { "deckName1": deckInstance1, ... }
    currentDeckInCreation: null, // Holds the Deck object while it's being built in CreateScreen
    previousScreen: "home",
};

function init() {
    const flashcardApp = document.querySelector("flashcard-app");
    if (!flashcardApp) {
        console.error("Flashcard app container not found!");
        return;
    }
    initHome();

    /**
     * Swap to the home screen
     */
    async function initHome() {
        flashcardApp.replaceChildren();
        const homeScreen = document.createElement("home-screen");
        flashcardApp.appendChild(homeScreen);

        // Load all decks from the database
        try {
            const allDeckData = await getAllDecks();
            appState.decks = {};
            for (const deckData of allDeckData) {
                const deckInstance = Deck(deckData.deckName); // Re-create Deck instance
                if (deckInstance) {
                    deckInstance.cards = deckData.cards; // Populate cards
                    appState.decks[deckInstance.deckName] = deckInstance;
                }
            }
            console.log("Decks loaded from DB:", appState.decks);
        } catch (error) {
            console.error("Failed to load decks from DB:", error);
        }

        // Get references to the buttons within the home screen
        const shadowRoot = homeScreen.shadowRoot;
        const createDeck = shadowRoot.querySelector(".create-deck");
        const existingDecks = shadowRoot.querySelector(".existing-decks");

        // Add event listeners
        createDeck.addEventListener("click", swapToCreate);
        existingDecks.addEventListener("click", swapToExisting);

        /**
         * Swap to the deck creation screen
         */
        function swapToCreate() {
            appState.previousScreen = "home";
            clearEvents();
            initCreate();
        }

        /**
         * Swap to the existing decks screen
         */
        function swapToExisting() {
            appState.previousScreen = "home";
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
     * @param {Number} editIndex The index if a specific card is edited, -1 otherwise
     */
    function initCreate(editIndex = -1) {
        flashcardApp.replaceChildren();
        const createScreen = document.createElement("create-screen");
        flashcardApp.appendChild(createScreen);

        // Get references to buttons
        const saveBtn = flashcardApp.querySelector("#save-button");

        // Get references to card form elements
        const cardForm = flashcardApp.querySelector("#customize-card");
        const front = flashcardApp.querySelector("#input-front-card");
        const back = flashcardApp.querySelector("#input-back-card");
        const time = flashcardApp.querySelector("#set-time");
        const cardList = flashcardApp.querySelector("output");
        const backBtn = flashcardApp.querySelector("#back-button");

        // Get references to speech form elements
        const speechForm = flashcardApp.querySelector("#speech-form");
        const speechName = flashcardApp.querySelector("#title-speech");

        // Helper to attach error span after input if not present
        function ensureErrorSpan(input) {
            let errorSpan = input.nextElementSibling;
            if (!errorSpan || !errorSpan.classList.contains("error")) {
                errorSpan = document.createElement("span");
                errorSpan.className = "error";
                input.parentNode.insertBefore(errorSpan, input.nextSibling);
            }
            return errorSpan;
        }

        // Attach error spans for all inputs
        const frontError = ensureErrorSpan(front);
        const backError = ensureErrorSpan(back);
        const timeError = ensureErrorSpan(time);
        const speechNameError = ensureErrorSpan(speechName);

        // Validation and error display for each input
        front.addEventListener("input", handleFrontInput);
        back.addEventListener("input", handleBackInput);
        time.addEventListener("input", handleTimeInput);
        speechName.addEventListener("input", handleSpeechNameInput);

        function handleFrontInput() {
            if (front.validity.valid && front.value.length >= 1 && front.value.length <= 60) {
                frontError.textContent = "";
                frontError.className = "error";
            } else {
                showFrontError();
            }
        }
        function showFrontError() {
            if (front.validity.valueMissing) {
                frontError.textContent = "You need to enter front text.";
            } else if (front.value.length < 1 || front.value.length > 60) {
                frontError.textContent = "Front text must be 1-60 characters.";
            }
            frontError.className = "error active";
        }

        function handleBackInput() {
            if (back.validity.valid && back.value.length >= 1 && back.value.length <= 250) {
                backError.textContent = "";
                backError.className = "error";
            } else {
                showBackError();
            }
        }
        function showBackError() {
            if (back.validity.valueMissing) {
                backError.textContent = "You need to enter back text.";
            } else if (back.value.length < 1 || back.value.length > 250) {
                backError.textContent = "Back text must be 1-250 characters.";
            }
            backError.className = "error active";
        }

        function handleTimeInput() {
            if (
                time.validity.valid &&
                !isNaN(Number(time.value)) &&
                Number(time.value) >= 1 &&
                Number(time.value) <= 60
            ) {
                timeError.textContent = "";
                timeError.className = "error";
            } else {
                showTimeError();
            }
        }
        function showTimeError() {
            if (time.validity.valueMissing) {
                timeError.textContent = "You need to enter a time.";
            } else if (
                isNaN(Number(time.value)) ||
                Number(time.value) < 1 ||
                Number(time.value) > 60
            ) {
                timeError.textContent = "Time must be a number between 1 and 60.";
            }
            timeError.className = "error active";
        }

        function handleSpeechNameInput() {
            if (
                speechName.validity.valid &&
                speechName.value.length >= 1 &&
                speechName.value.length <= 60
            ) {
                speechNameError.textContent = "";
                speechNameError.className = "error";
            } else {
                showSpeechNameError();
            }
        }
        function showSpeechNameError() {
            if (speechName.validity.valueMissing) {
                speechNameError.textContent = "You need to enter a deck name.";
            } else if (speechName.value.length < 1 || speechName.value.length > 60) {
                speechNameError.textContent = "Deck name must be 1-60 characters.";
            }
            speechNameError.className = "error active";
        }

        // Only use named submit handlers for validation and submission
        cardForm.addEventListener("submit", handleCardSubmit);
        speechForm.addEventListener("submit", handleDeckNameSubmit);
        saveBtn.addEventListener("click", handleSaveDeckAndGoHome);
        backBtn.addEventListener("click", swapToPrevScreen);
        cardList.addEventListener("delete-card", deleteCard);
        cardList.addEventListener("edit-card", editCard);

        let editingState = editIndex;

        initExistingCards();
        if (appState.currentDeckInCreation) {
            speechName.value = appState.currentDeckInCreation.deckName;
        }

        if (editingState !== -1) {
            editCard(
                new CustomEvent("edit-card", {
                    detail: cardList.children[editingState],
                })
            );
        }

        /**
         * Swap to the screen the user last came from
         */
        function swapToPrevScreen() {
            if (appState.previousScreen === "deck") {
                const deckName = appState.currentDeckInCreation.deckName;
                clearEvents();
                initDeckViewScreen(
                    new CustomEvent("deck-select", {
                        detail: deckName,
                        bubbles: false,
                    })
                );
            } else {
                clearEvents();
                initHome();
            }
        }

        /**
         * Validates that the user input creates a valid card and if so, add it's to the deck
         * @param {Event} event The event that causes this function to trigger (should be submit)
         */
        async function handleCardSubmit(event) {
            // Validate all fields before proceeding
            let valid = true;
            if (!front.validity.valid || front.value.length < 1 || front.value.length > 60) {
                showFrontError();
                valid = false;
            }
            if (!back.validity.valid || back.value.length < 1 || back.value.length > 250) {
                showBackError();
                valid = false;
            }
            if (
                !time.validity.valid ||
                isNaN(Number(time.value)) ||
                Number(time.value) < 1 ||
                Number(time.value) > 60
            ) {
                showTimeError();
                valid = false;
            }
            if (!valid) {
                event.preventDefault();
                return;
            }

            event.preventDefault();
            if (!appState.currentDeckInCreation) {
                return;
            }
            if (!appState.currentDeckInCreation.deckName) {
                await showDialog(
                    "The deck needs a name before adding cards. Please use the 'Name your Speech' form.",
                    "OK"
                );
                return;
            }

            const frontText = front.value;
            const backText = back.value;
            const timeNum = Number(time.value);

            // Attempt to create a new card using given values
            const newCard = Card(frontText, backText, timeNum);
            // If a card is successfully created (i.e. not null), add it to the deck if we're creating a card or override the card at the specified index
            if (newCard !== null) {
                if (editingState >= 0) {
                    const updated = appState.currentDeckInCreation.updateCard(
                        editingState,
                        newCard
                    );
                    if (updated) {
                        // Create a new card component with the new values
                        const newPreview = document.createElement("card-preview");
                        newPreview.setAttribute("data-front-text", frontText);
                        newPreview.setAttribute("data-back-text", backText);
                        newPreview.setAttribute("data-time", timeNum);
                        // Clear the data in the form
                        front.value = "";
                        back.value = "";
                        time.value = "";
                        // Replace the existing card in the DOM
                        cardList.children[editingState].replaceWith(newPreview);
                        // Reset the state to -1 (indicating that we are back to creating new cards)
                        editingState = -1;
                        // Save the deck
                        await saveDeck(appState.currentDeckInCreation);
                    }
                } else {
                    const added = appState.currentDeckInCreation.addCard(newCard);
                    // If a card is successfully added to the deck, render it in the preview
                    if (added) {
                        // Create a new card component with the new values
                        const newPreview = document.createElement("card-preview");
                        newPreview.setAttribute("data-front-text", frontText);
                        newPreview.setAttribute("data-back-text", backText);
                        newPreview.setAttribute("data-time", timeNum);
                        // Render it in the DOM
                        cardList.appendChild(newPreview);
                        // Reset form values
                        front.value = "";
                        back.value = "";
                        time.value = "";

                        try {
                            await saveDeck(appState.currentDeckInCreation);
                            console.log(
                                `Deck "${appState.currentDeckInCreation.deckName}" saved after adding card.`
                            );
                        } catch (error) {
                            console.error("Error saving deck after adding card:", error);
                            await showDialog(
                                "Error saving deck. Changes may not be persisted.",
                                "OK"
                            );
                        }
                    } else {
                        await showDialog("Failed to add card to deck (internal validation).", "OK");
                    }
                }
            }
        }

        /**
         * Updates the name of the deck if it is valid
         * @param {Event} event The event that causes this function to trigger (should be submit)
         * @returns Returns if the name is invalid
         */
        async function handleDeckNameSubmit(event) {
            // Validate deck name before proceeding
            if (event) {
                event.preventDefault();
            }
            if (
                !speechName.validity.valid ||
                speechName.value.length < 1 ||
                speechName.value.length > 60
            ) {
                showSpeechNameError();
                return false;
            }

            const name = speechName.value.trim();
            if (typeof name !== "string" || name.length === 0 || name.length > 60) {
                return false;
            }

            // Only check for existing name if editing an existing deck
            if (appState.currentDeckInCreation) {
                if (name === appState.currentDeckInCreation.deckName) {
                    console.log("same name");
                    return true;
                }
            }

            if (!appState.currentDeckInCreation) {
                appState.currentDeckInCreation = Deck(name);
                if (!appState.currentDeckInCreation) {
                    showDialog("Error creating deck. Please try again.", "OK");
                    return false;
                }
                console.log(`Deck "${name}" initialized for creation.`);
            } else {
                // Removes the old key from the decks dictionary and replaces it with a new key using the new name
                const oldName = appState.currentDeckInCreation.deckName;
                appState.currentDeckInCreation.deckName = name;
                delete appState.decks[oldName];
                appState.decks[name] = appState.currentDeckInCreation;
                // Removes the old deck from the database and inserts a new one in its place
                // Possible TODO: In-place editing
                await deleteDeckDB(oldName);
                await saveDeck(appState.currentDeckInCreation);
                console.log(`Deck name updated to "${name}".`);
                return true;
            }
            return true;
        }

        /**
         * Saves the current deck to IndexedDB and navigates back to the home screen.
         */
        async function handleSaveDeckAndGoHome() {
            if (appState.currentDeckInCreation && appState.currentDeckInCreation.deckName) {
                if (appState.currentDeckInCreation.cards.length === 0) {
                    const userConfirmed = await showDialog(
                        "This deck has no cards. Do you still want to save it?",
                        "Save Anyway",
                        "Cancel"
                    );
                    if (!userConfirmed) {
                        console.log("User chose not to save empty deck.");
                        return;
                    } else {
                        initHome();
                    }
                }

                // Prevent navigation if invalid deck name
                const nameValid = await handleDeckNameSubmit();
                if (!nameValid) {
                    return;
                }

                try {
                    await saveDeck(appState.currentDeckInCreation);
                    appState.decks[appState.currentDeckInCreation.deckName] =
                        appState.currentDeckInCreation; // Update in-memory list
                    console.log(
                        `Deck "${appState.currentDeckInCreation.deckName}" finalized and saved.`
                    );
                } catch (error) {
                    console.error("Error saving deck:", error);
                    showDialog("Error saving deck. Please try again.", "OK");
                    return; // Don't navigate away if save failed
                }
            } else {
                showDialog("No deck to save or deck has no name. Please name your deck.", "OK");
                return; // Don't navigate or clear events
            }

            swapToPrevScreen(); // Go back to the previous screen you came from (either home or deck screen)
        }

        /**
         * Deletes the card from the deck
         * @param {Event} event The event that triggered this function (should be "delete-card")
         */
        async function deleteCard(event) {
            const index = getIndexInDOM(event.detail);
            const deleted = appState.currentDeckInCreation.deleteCard(index);
            if (deleted) {
                cardList.removeChild(cardList.children[index]);
                await saveDeck(appState.currentDeckInCreation);
            }
        }

        /**
         * Sets the existing values in the form and sets the editingState to be the index of the card to edit
         * @param {Event} event The event that triggered this function (should be "edit-card");
         */
        function editCard(event) {
            const index = getIndexInDOM(event.detail);
            const card = appState.currentDeckInCreation.readCard(index);
            if (card) {
                if (editingState !== -1 && editingState !== index) {
                    cardList.children[editingState].classList.remove("selected");
                }
                cardList.children[index].classList.add("selected");
                front.value = card.frontText;
                back.value = card.backText;
                time.value = card.time;
                editingState = index;
            }
        }

        /**
         * Loads existing cards when editing an existing deck
         */
        function initExistingCards() {
            if (appState.currentDeckInCreation !== null) {
                let index = 0;
                for (const card of appState.currentDeckInCreation.cards) {
                    const newPreview = document.createElement("card-preview");
                    newPreview.setAttribute("data-front-text", card.frontText);
                    newPreview.setAttribute("data-back-text", card.backText);
                    newPreview.setAttribute("data-time", card.time);
                    newPreview.setAttribute("data-card-index", index);
                    cardList.appendChild(newPreview);
                    index++;
                }
            }
        }

        /**
         * Remove event listeners from the deck creation screen to prevent memory leaks
         */
        function clearEvents() {
            // Remove event listeners
            if (speechForm) {
                speechForm.removeEventListener("submit", handleDeckNameSubmit);
            }

            // Remove card form event listener
            if (cardForm) {
                cardForm.removeEventListener("submit", handleCardSubmit);
            }

            // Remove save button event listener
            if (saveBtn) {
                saveBtn.removeEventListener("click", handleSaveDeckAndGoHome);
            }

            cardList.removeEventListener("edit-card", editCard);
            cardList.removeEventListener("delete-card", deleteCard);
            // Reset the current deck in creation
            appState.currentDeckInCreation = null;
        }
    }

    /**
     * Initialize and swap to the existing decks screen (list view).
     */
    function initExisting() {
        // Add functionality to swap to existing decks screen
        flashcardApp.replaceChildren();
        const existingDecksScreen = document.createElement("existing-screen");

        flashcardApp.appendChild(existingDecksScreen);

        // Get references to elements in existing decks screen
        const deckListContainer = existingDecksScreen.querySelector("#deck-list-container");
        const backToHomeBtn = existingDecksScreen.querySelector("#back-button");

        // Add event listeners
        backToHomeBtn.addEventListener("click", swapToHome);

        // Add existing decks to the deck list
        if (Object.keys(appState.decks).length === 0) {
            deckListContainer.innerHTML = `
                <p>There are no decks yet. Please create one.</p>
            `;
        } else {
            for (const deckName in appState.decks) {
                const deck = appState.decks[deckName];
                const deckPreview = document.createElement("deck-preview");
                deckPreview.setAttribute("data-deck-name", deck.deckName);
                deckPreview.setAttribute("data-deck-length", deck.cards.length);
                deckListContainer.appendChild(deckPreview);
            }
        }

        deckListContainer.addEventListener("deck-select", initDeckViewScreen);

        /**
         * Swap to the home screen from the existing deck screen, clears event listeners for elements in the existing deck screen
         */
        function swapToHome() {
            appState.previousScreen = "existing";
            clearEvents();
            initHome();
        }

        /**
         * Remove event listeners from the deck creation screen to prevent memory leaks
         */
        function clearEvents() {
            // Remove event listeners
            backToHomeBtn.removeEventListener("click", swapToHome);
        }
    }

    /**
     * Initialize and swap to the screen for viewing/managing a single deck.
     * @param {Event} event Should be a custom event "deck-select" with a detail key containing the values of the deck name
     */
    async function initDeckViewScreen(event) {
        const deckName = event.detail;
        const deckToView = appState.decks[deckName];
        if (!deckToView) {
            console.error(`Deck "${deckName}" not found in appState.`);
            showDialog("Error: Could not load the selected deck.", "OK");
            initExisting(); // Go back to the list if deck not found
            return;
        }

        flashcardApp.replaceChildren();
        const deckViewContainer = document.createElement("deck-screen");
        deckViewContainer.setAttribute("data-deck-name", deckName);
        flashcardApp.appendChild(deckViewContainer);

        // Get references to the buttons
        const cardDisplayArea = deckViewContainer.querySelector(".card-list");
        const studyDeckBtn = deckViewContainer.querySelector(".study-btn");
        const editDeckBtn = deckViewContainer.querySelector(".edit-btn");
        const backToDecksBtn = deckViewContainer.querySelector(".back-btn");

        // Populate Cards
        if (deckToView.cards.length === 0) {
            cardDisplayArea.innerHTML = "<p>This deck has no cards yet. You can add some!</p>";
        } else {
            deckToView.cards.forEach(function (card, index) {
                const cardItemWrapper = document.createElement("div");
                cardItemWrapper.className = "card-item-wrapper";

                const cardPreviewInstance = document.createElement("card-preview");
                cardPreviewInstance.setAttribute("data-front-text", card.frontText);
                cardPreviewInstance.setAttribute("data-back-text", card.backText);
                cardPreviewInstance.setAttribute("data-card-index", index);
                if (card.time !== undefined) {
                    cardPreviewInstance.setAttribute("data-time", String(card.time));
                }

                cardItemWrapper.appendChild(cardPreviewInstance);

                const actionsDiv = document.createElement("div");
                actionsDiv.className = "card-item-actions";
                actionsDiv.innerHTML = `
                    <button class="edit-card-btn button-small" data-card-index="${index}">Edit</button>
                    <button class="delete-card-btn button-small danger" data-card-index="${index}">Delete</button>
                `;
                cardItemWrapper.appendChild(actionsDiv);

                cardDisplayArea.appendChild(cardItemWrapper);
            });
        }

        // Add event listeners
        backToDecksBtn.addEventListener("click", swapToExisting);
        studyDeckBtn.addEventListener("click", initStudy);
        editDeckBtn.addEventListener("click", editDeck);
        cardDisplayArea.addEventListener("delete-card", deleteCard);
        cardDisplayArea.addEventListener("edit-card", editCard);

        /**
         * Sets the current deck to let initCreate() know to use the existing deck instead of creating a new one, clear event listeners, and swap to the create deck screen.
         */
        function editDeck() {
            appState.previousScreen = "deck";
            appState.currentDeckInCreation = deckToView;
            clearEvents();
            initCreate();
        }

        /**
         * Deletes a card from a deck and removes the corresponding element from the DOM
         * @param {Event} event The event that triggered this function (should be "delete-card" event)
         */
        async function deleteCard(event) {
            const index = getIndexInDOM(event.detail);
            // TODO: Dialog confirmation
            const deleted = deckToView.deleteCard(index);
            if (deleted) {
                cardDisplayArea.removeChild(cardDisplayArea.children[index]);
                await saveDeck(deckToView);
            }
        }

        function editCard(event) {
            appState.previousScreen = "deck";
            appState.currentDeckInCreation = deckToView;
            const index = getIndexInDOM(event.detail);
            if (index !== -1) {
                clearEvents();
                initCreate(index);
            }
        }

        /**
         * Clear event listeners before swapping to the existing deck screen
         */
        function swapToExisting() {
            appState.previousScreen = "deck";
            clearEvents();
            initExisting();
        }

        /**
         * Clears events for elements in the deck view screen
         */
        function clearEvents() {
            backToDecksBtn.removeEventListener("click", initExisting);
            studyDeckBtn.removeEventListener("click", initStudy);
            editDeckBtn.removeEventListener("click", editDeck);
            cardDisplayArea.removeEventListener("delete-card", deleteCard);
            cardDisplayArea.removeEventListener("edit-card", editCard);
        }
    }

    function initStudy() {
        // TODO: Implement study screen
    }
}

/**
 * Gets the index of an HTML element within its parent (i.e. the 5th child of its parent)
 * @param {HTMLElement} el An HTML element
 * @returns The index of el or -1 if not found
 */
function getIndexInDOM(el) {
    const parent = el.parentElement;
    let count = 0;
    for (const child of parent.children) {
        if (child === el) {
            return count;
        }
        count++;
    }
    return -1;
}

/**
 * Shows a native dialog and returns a Promise that resolves to true (confirm) or false (cancel)
 * @param {string} message The message to display
 * @param {string} confirmText The confirm button text
 * @param {string} cancelText The cancel button text
 * @returns {Promise<boolean>}
 */
function showDialog(message, confirmText = "OK", cancelText = "Cancel") {
    return new Promise((resolve) => {
        const dialog = document.createElement("dialog");
        dialog.className = "custom-dialog";
        dialog.innerHTML = `
            <form method="dialog">
                <p>${message}</p>
                <menu>
                    <button value="cancel">${cancelText}</button>
                    <button value="confirm" autofocus>${confirmText}</button>
                </menu>
            </form>
        `;
        document.body.appendChild(dialog);

        function handleClose() {
            resolve(dialog.returnValue === "confirm");
            dialog.removeEventListener("close", handleClose);
            dialog.remove();
        }

        dialog.addEventListener("close", handleClose);
        dialog.showModal();
    });
}
