import "./screens/HomeScreen.js";
import "./screens/CreateScreen.js";
import "./components/CardPreview.js";
import { Deck, Card } from "./deck.js";
import { saveDeck, getDeck, getAllDecks, deleteDeckDB } from "./database.js";
import "./components/ConfirmationModal.js";

window.addEventListener("DOMContentLoaded", init);

// Application state to hold loaded decks and the deck currently being created
const appState = {
    decks: {}, // Stores Deck instances, keyed by deckName: { "deckName1": deckInstance1, ... }
    currentDeckInCreation: null, // Holds the Deck object while it's being built in CreateScreen
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

        // Reset any previously half created deck
        appState.currentDeckInCreation = null;

        // Create an empty deck
        const newDeck = Deck("Example Deck");

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

        // Add event listeners
        cardForm.addEventListener("submit", handleCardSubmit);
        speechForm.addEventListener("submit", handleDeckNameSubmit);
        saveBtn.addEventListener("click", handleSaveDeckAndGoHome);
        backBtn.addEventListener("click", swapToHome);

        /**
         * Swap to the home screen
         */
        function swapToHome() {
            // TODO: Save the deck
            clearEvents();
            initHome();
            console.log("Swapped to home screen");
        }

        /**
         * Validates that the user input creates a valid card and if so, add it's to the deck
         * @param {Event} event The event that causes this function to trigger (should be submit)
         */
        async function handleCardSubmit(event) {
            event.preventDefault();

            if (!appState.currentDeckInCreation) {
                alert("Please set a deck name first using the 'Name your Speech' form.");
                return;
            }
            if (!appState.currentDeckInCreation.deckName) {
                alert(
                    "The deck needs a name before adding cards. Please use the 'Name your Speech' form."
                );
                return;
            }

            const frontText = front.value;
            const backText = back.value;
            const timeNum = Number(time.value);

            // Attempt to create a new card using given values
            const newCard = Card(frontText, backText, timeNum);
            // If a card is successfully created (i.e. not null), add it to the deck
            if (newCard !== null) {
                const added = appState.currentDeckInCreation.addCard(newCard);
                // If a card is successfully added to the deck, render it in the preview
                if (added) {
                    const newPreview = document.createElement("card-preview");
                    newPreview.setAttribute("data-front-text", frontText);
                    newPreview.setAttribute("data-back-text", backText);
                    cardList.appendChild(newPreview);
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
                        alert("Error saving deck. Changes may not be persisted.");
                    }
                } else {
                    alert("Failed to add card to deck (internal validation).");
                }
            } else {
                alert(
                    "Invalid card details. Please check inputs:\n- Front: 1-60 chars\n- Back: 1-250 chars\n- Time: 1-60 secs"
                );
            }
        }

        /**
         * Updates the name of the deck if it is valid
         * @param {Event} event The event that causes this function to trigger (should be submit)
         * @returns Returns if the name is invalid
         */
        function handleDeckNameSubmit(event) {
            event.preventDefault();
            const name = speechName.value.trim();
            if (typeof name !== "string" || name.length === 0 || name.length > 60) {
                alert("Deck name must be between 1 and 60 characters.");
                return;
            }

            if (!appState.currentDeckInCreation) {
                appState.currentDeckInCreation = Deck(name);
                if (!appState.currentDeckInCreation) {
                    alert("Error creating deck. Please try again.");
                    return;
                }
                console.log(`Deck "${name}" initialized for creation.`);
            } else {
                appState.currentDeckInCreation.deckName = name;
                console.log(`Deck name updated to "${name}".`);
            }
        }

        /**
         * Saves the current deck to IndexedDB and navigates back to the home screen.
         */
        async function handleSaveDeckAndGoHome() {
            if (appState.currentDeckInCreation && appState.currentDeckInCreation.deckName) {
                if (appState.currentDeckInCreation.cards.length === 0) {
                    const modal = document.createElement("confirmation-modal");

                    // Add modal to DOM so it can be displayed
                    document.body.appendChild(modal);

                    const userConfirmed = await modal.open(
                        "This deck has no cards. Do you still want to save it?",
                        "Save Anyway",
                        "Cancel"
                    );

                    // Remove modal from DOM after use
                    document.body.removeChild(modal);

                    if (!userConfirmed) {
                        console.log("User chose not to save empty deck.");
                        return; // User clicked "Cancel" or closed the modal
                    } else {
                        initHome();
                    }
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
                    alert("Error saving deck. Please try again.");
                    return; // Don't navigate away if save failed
                }
            } else {
                alert("No deck to save or deck has no name. Please name your deck.");
                return; // Don't navigate or clear events
            }

            clearEvents();
            initHome(); // This will reload decks from DB, including the new one
        }

        /**
         * Remove event listeners from the deck creation screen to prevent memory leaks
         */
        function clearEvents() {
            // Remove event listeners
            if (speechForm) speechForm.removeEventListener("submit", handleDeckNameSubmit);

            // Remove card form event listener
            if (cardForm) cardForm.removeEventListener("submit", handleCardSubmit);

            // Remove save button event listener
            if (saveBtn) saveBtn.removeEventListener("click", handleSaveDeckAndGoHome);

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
        const existingDecksScreen = document.createElement("div"); // TODO: Use custom element
        existingDecksScreen.id = "existing-decks-screen";
        existingDecksScreen.innerHTML = `
            <h2>Your Decks</h2>
            <div id="deckListContainer"></div>
            <button id="backToHomeBtn">Back to Home</button>
        `;
        flashcardApp.appendChild(existingDecksScreen);

        const deckListContainer = existingDecksScreen.querySelector("#deckListContainer");
        const backToHomeBtn = existingDecksScreen.querySelector("#backToHomeBtn");

        backToHomeBtn.addEventListener("click", () => {
            initHome();
        });

        if (Object.keys(appState.decks).length === 0) {
            deckListContainer.innerHTML =
                "<p>No decks found. Go to the home screen to create one!</p>";
        } else {
            const ul = document.createElement("ul");
            for (const deckName in appState.decks) {
                const deck = appState.decks[deckName];
                const li = document.createElement("li");
                li.textContent = `${deck.deckName} (${deck.cards.length} cards)`;
                li.style.cursor = "pointer";
                li.dataset.deckName = deckName;

                li.addEventListener("click", (e) => {
                    const selectedDeckName = e.currentTarget.dataset.deckName;
                    initDeckViewScreen(selectedDeckName);
                });
                ul.appendChild(li);
            }
            deckListContainer.appendChild(ul);
        }
    }

    /**
     * Initialize and swap to the screen for viewing/managing a single deck.
     * @param {string} deckName The name of the deck to view.
     */
    async function initDeckViewScreen(deckName) {
        const deckToView = appState.decks[deckName];

        if (!deckToView) {
            console.error(`Deck "${deckName}" not found in appState.`);
            alert("Error: Could not load the selected deck.");
            initExisting(); // Go back to the list if deck not found
            return;
        }

        flashcardApp.replaceChildren();
        // You could use a custom element like <deck-view-screen> if you prefer
        const deckViewContainer = document.createElement("div");
        deckViewContainer.id = "deck-view-screen";
        deckViewContainer.innerHTML = `
                <header class="deck-view-header">
                    <h2 id="deckViewName"></h2>
                    <div class="deck-actions">
                        <button id="studyDeckBtn" class="button">Study Deck</button>
                        <button id="editDeckBtn" class="button">Edit Deck Info</button> 
                        <button id="addCardToDeckBtn" class="button">Add New Card</button>
                        <button id="backToDecksBtn" class="button">Back to Decks List</button>
                    </div>
                </header>
                <div id="cardDisplayArea" class="cards-grid">
                    <!-- Cards will be populated here -->
                </div>
            `;
        flashcardApp.appendChild(deckViewContainer);

        const deckViewNameEl = deckViewContainer.querySelector("#deckViewName");
        const cardDisplayArea = deckViewContainer.querySelector("#cardDisplayArea");
        const studyDeckBtn = deckViewContainer.querySelector("#studyDeckBtn");
        const editDeckBtn = deckViewContainer.querySelector("#editDeckBtn");
        const addCardToDeckBtn = deckViewContainer.querySelector("#addCardToDeckBtn");
        const backToDecksBtn = deckViewContainer.querySelector("#backToDecksBtn");

        deckViewNameEl.textContent = deckToView.deckName;

        // --- Populate Cards ---
        if (deckToView.cards.length === 0) {
            cardDisplayArea.innerHTML = "<p>This deck has no cards yet. You can add some!</p>";
        } else {
            deckToView.cards.forEach((card, index) => {
                const cardItemWrapper = document.createElement("div");
                cardItemWrapper.className = "deck-card-item";

                const cardPreviewInstance = document.createElement("card-preview");
                cardPreviewInstance.setAttribute("data-front-text", card.frontText);
                cardPreviewInstance.setAttribute("data-back-text", card.backText);
                if (card.time !== undefined) {
                    cardPreviewInstance.setAttribute("data-time", String(card.time));
                }

                // Add the preview to the wrapper
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

        // --- Event Listeners for Deck View Screen ---
        backToDecksBtn.addEventListener("click", () => {
            initExisting();
        });

        studyDeckBtn.addEventListener("click", () => {
            // TODO: Implement the logic to study the deck
            alert(`Studying deck: ${deckToView.deckName} - Feature to be implemented!`);
        });

        editDeckBtn.addEventListener("click", () => {
            // TODO: Implement the logic to edit the deck name
            // Right now is very simple and cheap and generated by GPT
            // Allow editing deck name. Might reuse part of CreateScreen logic or a small modal.
            const newDeckName = prompt("Enter new deck name:", deckToView.deckName);
            if (newDeckName && newDeckName.trim() !== "" && newDeckName !== deckToView.deckName) {
                const oldDeckName = deckToView.deckName;
                // Validate newDeckName (length, etc.) as in Deck creation
                if (newDeckName.length > 0 && newDeckName.length <= 60) {
                    if (appState.decks[newDeckName]) {
                        alert(
                            "A deck with this name already exists. Please choose a different name."
                        );
                        return;
                    }

                    deckToView.deckName = newDeckName.trim();
                    deckViewNameEl.textContent = deckToView.deckName;

                    (async () => {
                        try {
                            await deleteDeckDB(oldDeckName); // Delete the deck by its old name
                            delete appState.decks[oldDeckName]; // Remove from in-memory cache

                            await saveDeck(deckToView); // Save the deck with its new name
                            appState.decks[deckToView.deckName] = deckToView; // Add to in-memory cache with new name

                            console.log(
                                `Deck name changed from "${oldDeckName}" to "${deckToView.deckName}" and saved.`
                            );
                            // The current screen is now showing the deck under its new name.
                            // If we go back to deck list, it should reflect this.
                        } catch (error) {
                            console.error("Error updating deck name:", error);
                            alert("Error updating deck name. Reverting changes locally.");
                            // Revert local changes if DB operations failed
                            deckToView.deckName = oldDeckName;
                            deckViewNameEl.textContent = deckToView.deckName;
                            appState.decks[oldDeckName] = deckToView;
                            if (appState.decks[newDeckName.trim()])
                                delete appState.decks[newDeckName.trim()];
                        }
                    })();
                } else {
                    alert("Invalid deck name. Must be between 1 and 60 characters.");
                }
            }
        });

        addCardToDeckBtn.addEventListener("click", () => {
            // TODO: Implement the logic to add a new card to the deck
            alert("Add card to deck button clicked");
        });

        // Event delegation for card edit/delete buttons
        cardDisplayArea.addEventListener("click", async (event) => {
            const target = event.target;
            const cardIndex = target.dataset.cardIndex;

            if (target.classList.contains("edit-card-btn") && cardIndex !== undefined) {
                handleEditCard(deckToView, parseInt(cardIndex));
            } else if (target.classList.contains("delete-card-btn") && cardIndex !== undefined) {
                handleDeleteCard(deckToView, parseInt(cardIndex));
            }
        });
    }

    /**
     * Handles editing a specific card within a deck.
     * @param {object} deck The deck object.
     * @param {number} cardIndex The index of the card to edit.
     */
    async function handleEditCard(deck, cardIndex) {
        const card = deck.cards[cardIndex];
        if (!card) return;

        // TODO: use a modal for the edit card
        const newFront = prompt("Enter new front text:", card.frontText);
        if (newFront === null) return; // User cancelled

        const newBack = prompt("Enter new back text:", card.backText);
        if (newBack === null) return; // User cancelled

        const newTimeStr = prompt("Enter new time (seconds):", card.time);
        if (newTimeStr === null) return; // User cancelled
        const newTime = Number(newTimeStr);

        // Validate the new card data
        const tempEditedCard = Card(newFront, newBack, newTime);
        if (!tempEditedCard) {
            alert("Invalid card data. Please check your inputs.");
            return;
        }

        // Update the card in the deck's card array
        deck.updateCard(cardIndex, tempEditedCard);

        try {
            // Save the entire deck with the updated card
            await saveDeck(deck);
            console.log(
                `Card at index ${cardIndex} in deck "${deck.deckName}" updated and deck saved.`
            );
            // Re-render this deck view to show changes
            initDeckViewScreen(deck.deckName);
        } catch (error) {
            console.error("Error saving deck after editing card:", error);
            alert("Failed to save card changes.");
        }
    }

    /**
     * Handles deleting a specific card from a deck.
     * @param {object} deck The deck object.
     * @param {number} cardIndex The index of the card to delete.
     */
    async function handleDeleteCard(deck, cardIndex) {
        const card = deck.cards[cardIndex];
        if (!card) return;

        const modal = document.createElement("confirmation-modal");
        document.body.appendChild(modal);
        const userConfirmed = await modal.open(
            `Are you sure you want to delete this card?\nFront: "${card.frontText}"`,
            "Delete Card",
            "Cancel"
        );
        document.body.removeChild(modal);

        if (!userConfirmed) {
            return;
        }

        deck.deleteCard(cardIndex);

        try {
            // Save the entire deck after card deletion
            await saveDeck(deck);
            console.log(
                `Card at index ${cardIndex} in deck "${deck.deckName}" deleted and deck saved.`
            );
            // Re-render this deck view to show changes
            initDeckViewScreen(deck.deckName);
        } catch (error) {
            console.error("Error saving deck after deleting card:", error);
            alert("Failed to save changes after deleting card.");
        }
    }

    // Helper function to prevent XSS if displaying user content directly as HTML
    function escapeHTML(str) {
        const div = document.createElement("div");
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }
}
