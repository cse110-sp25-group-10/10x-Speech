describe('User creates a deck for the first time', () => {
    beforeAll(async () => {
        await page.goto('https://team10xflashcard.netlify.app/');

        // preloading page with decks
        await page.evaluate(() => {
            return new Promise((resolve) => {
                const request = indexedDB.open('FlashcardAppDB');
                request.onsuccess = () => {
                    const db = request.result;
                    const tx = db.transaction('decks', 'readwrite');
                    const store = tx.objectStore('decks');
                    store.put({
                        deckName: 'Whales',
                        cards: [
                            { frontText: 'What are whales?', backText: 'Whales are a marine mammal.', time: 10 },
                            { frontText: 'Habitat', backText: 'They live in the ocean.', time: 15 },
                            { frontText: 'Food they eat', backText: 'Whales like to eat krill and plankton.', time: 20 }
                        ]
                    });
                    store.put({
                        deckName: 'Tigers',
                        cards: [
                            { frontText: 'What are tigers?', backText: 'Tigers are a land mammal.', time: 10 },
                            { frontText: 'Habitat', backText: 'They live in the rainforests.', time: 15 },
                            { frontText: 'Food they eat', backText: 'Tigers like to eat deer and boar.', time: 20 }
                        ]
                    });
                    tx.oncomplete = () => resolve();
                };
            });
        });

    });
    

    it('checking number of decks and the cards in the deck after reload', async () => {
        console.log('Checking number of decks and the cards in the deck after reload');
        await page.reload();

    }, 10000);

});