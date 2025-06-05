import "./screens/CreateScreen.js";
import "./screens/ExistingScreen.js"
import "./components/CardPreview.js";
import "./components/DeckPreview.js";
import "./screens/DeckScreen.js"
import { Deck, Card } from "./deck.js";
import { saveDeck, getAllDecks, deleteDeckDB } from "./database.js";

window.addEventListener("DOMContentLoaded", init);

// Application state to hold loaded decks and the deck currently being created
const appState = {
    decks: {}, // Stores Deck instances, keyed by deckName: { "deckName1": deckInstance1, ... }
    currentDeckInCreation: null, // Holds the Deck object while it's being built in CreateScreen
    previousScreen: "home"
};

function init() {
    const flashcardApp = document.querySelector("flashcard-app");
    if (!flashcardApp) {
        console.error("Flashcard app container not found!");
        return;
    }
    
    initExisting();

    /**
     * Initialize and swap to the existing decks screen (list view).
     */
    async function initExisting() {
        // Add functionality to swap to existing decks screen
        flashcardApp.replaceChildren();
        const existingDecksScreen = document.createElement("existing-screen");
        
        flashcardApp.appendChild(existingDecksScreen);

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

        // Get references to elements in existing decks screen
        const deckListContainer = existingDecksScreen.querySelector(".flash-card-container");
        const editBtn = existingDecksScreen.querySelector("#edit-speech-button");
        const createBtn = existingDecksScreen.querySelector("#create-speech-button");
        const studyBtn = existingDecksScreen.querySelector("#study-button");
        const deleteBtn = existingDecksScreen.querySelector("#delete-speech-button");
        const deckCount = existingDecksScreen.querySelector(".deck-count");

        // Add existing decks to the deck list
        if (Object.keys(appState.decks).length === 0) {
            deckListContainer.innerHTML = `
                <p>There are no decks yet. Please create one.</p>
            `;
        } else {
            for (const deckName in appState.decks) {
                const deck = appState.decks[deckName]
                const deckPreview = document.createElement("deck-preview");
                deckPreview.setAttribute("data-deck-name", deck.deckName);
                deckPreview.setAttribute("data-deck-length", deck.cards.length);
                deckPreview.classList.add("speech");
                deckListContainer.appendChild(deckPreview);
                deckCount.textContent = `${Object.keys(appState.decks).length}`;
            }
        }

        // Add event listeners
        deckListContainer.addEventListener("deck-select", selectDeck);
        editBtn.addEventListener("click", editDeck);
        createBtn.addEventListener("click", createDeck);
        deleteBtn.addEventListener("click", deleteDeck);

        let selectedIndex = -1;

        function selectDeck(event) {
            try {
                if (selectedIndex !== -1) {
                    deckListContainer.children[selectedIndex].classList.remove("selected");
                }   
                // Remove disabled attribute when decks are selected
                studyBtn.removeAttribute("disabled");
                editBtn.removeAttribute("disabled");
                deleteBtn.removeAttribute("disabled");

                const elementNode = event.detail.node;
                const deckName = event.detail.name;
                elementNode.classList.add("selected");
                selectedIndex = getIndexInDOM(elementNode);
                appState.currentDeckInCreation = appState.decks[deckName];
            } catch {
                throw new Error("Function selectDeck was triggered without the appropriate event.")
            }        
        }

        function editDeck() {
            clearEvents();
            initCreate();
        }

        function createDeck() {
            appState.currentDeckInCreation = null;
            clearEvents();
            initCreate();
        }

        async function deleteDeck() {
            if (selectedIndex !== -1) {
                try {
                    await deleteDeckDB(appState.currentDeckInCreation.deckName);
                } catch {
                    return;
                }
                deckListContainer.removeChild(deckListContainer.children[selectedIndex]);
                selectedIndex = -1;
                delete appState.decks[appState.currentDeckInCreation.deckName];
                appState.currentDeckInCreation = null;
                deckCount.textContent = `${Object.keys(appState.decks).length}`;
            }
        }

        function clearEvents() {
            deckListContainer.removeEventListener("deck-select", selectDeck);
            editBtn.removeEventListener("click", editDeck);
            createBtn.removeEventListener("click", createDeck);
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
        backBtn.addEventListener("click", initExisting);
        cardList.addEventListener("delete-card", deleteCard);
        cardList.addEventListener("edit-card", editCard);

        let editingState = -1;

        initExistingCards();
        // Puts in the name of the deck if editing an existing deck automatically
        if (appState.currentDeckInCreation) {
            speechName.value = appState.currentDeckInCreation.deckName;
        }

        /**
         * Validates that the user input creates a valid card and if so, add it's to the deck
         * @param {Event} event The event that causes this function to trigger (should be submit)
         */
        async function handleCardSubmit(event) {
            event.preventDefault();
            // TODO: Use validation techniques instead of alert
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
            // TODO: Use validation techniques instead of alert
            // If a card is successfully created (i.e. not null), add it to the deck if we're creating a card or override the card at the specified index
            if (newCard !== null) {
                if (editingState >= 0) {
                    const updated = appState.currentDeckInCreation.updateCard(editingState, newCard);
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
                            alert("Error saving deck. Changes may not be persisted.");
                        }
                    } else {
                        alert("Failed to add card to deck (internal validation).");
                    }
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
        async function handleDeckNameSubmit(event) {
            if (event) {
                event.preventDefault();
            }
            const name = speechName.value.trim();
            if (typeof name !== "string" || name.length === 0 || name.length > 60) {
                alert("Deck name must be between 1 and 60 characters.");
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
                    alert("Error creating deck. Please try again.");
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
        }

        /**
         * Saves the current deck to IndexedDB and navigates back to the home screen.
         */
        async function handleSaveDeckAndGoHome() {
            if (appState.currentDeckInCreation && appState.currentDeckInCreation.deckName) {
                if (appState.currentDeckInCreation.cards.length === 0) {
                    // TODO: Use dialog implementation
                }
                
                // Prevent navigation if invaid deck name
                if (!handleDeckNameSubmit()) {
                    return;
                }

                try {
                    await saveDeck(appState.currentDeckInCreation);
                    appState.decks[appState.currentDeckInCreation.deckName] = appState.currentDeckInCreation; // Update in-memory list
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
            initExisting(); // Go back to the existing deck screen
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
            if (speechForm) { speechForm.removeEventListener("submit", handleDeckNameSubmit) };

            // Remove card form event listener
            if (cardForm) { cardForm.removeEventListener("submit", handleCardSubmit) };

            // Remove save button event listener
            if (saveBtn) { saveBtn.removeEventListener("click", handleSaveDeckAndGoHome) };

            cardList.removeEventListener("edit-card", editCard);
            cardList.removeEventListener("delete-card", deleteCard);
            // Reset the current deck in creation
            appState.currentDeckInCreation = null;
        }
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
