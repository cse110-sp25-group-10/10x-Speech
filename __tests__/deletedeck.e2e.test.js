describe('User loads their decks and deletes one of them', () => {
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
                    store.clear();
                    store.put({
                        deckName: 'Whales',
                        cards: [
                            { frontText: 'What are whales?', backText: 'Whales are a marine mammal.' },
                            { frontText: 'Habitat', backText: 'They live in the ocean.'},
                            { frontText: 'Food they eat', backText: 'Whales like to eat krill and plankton.' }
                        ]
                    });
                    store.put({
                        deckName: 'Tigers',
                        cards: [
                            { frontText: 'What are tigers?', backText: 'Tigers are a land mammal.' },
                            { frontText: 'Habitat', backText: 'They live in the rainforests.' },
                            { frontText: 'Food they eat', backText: 'Tigers like to eat deer and boar.' }
                        ]
                    });
                    tx.oncomplete = () => resolve();
                };
            });
        });

        await page.reload();

    });
    

    it('checking that delete button is grayed out, then not when deck is selected', async () => {

        await page.waitForSelector("existing-screen");

        // checks that buttons are disabled
        const deleteDisabled = await page.$eval('#delete-speech-button', (btn) => btn.disabled);
        expect(deleteDisabled).toBe(true);
        const editDisabled = await page.$eval('#edit-speech-button', (btn) => btn.disabled);
        expect(editDisabled).toBe(true);
        const studyDisabled = await page.$eval('#study-button', (btn) => btn.disabled);
        expect(studyDisabled).toBe(true);

        await page.click('deck-preview[data-deck-name="Tigers"]');

        // checks that buttons are enabled
        const deleteEnabled = await page.$eval('#delete-speech-button', (btn) => !btn.disabled);
        expect(deleteEnabled).toBe(true);
        const editEnabled = await page.$eval('#edit-speech-button', (btn) => !btn.disabled);
        expect(editEnabled).toBe(true);
        const studyEnabled = await page.$eval('#study-button', (btn) => !btn.disabled);
        expect(studyEnabled).toBe(true);

    }, 10000);

    it('delete one of the decks', async () => {

        await page.click('#delete-speech-button');

        const decks = await page.evaluate(async () => {
            const request = indexedDB.open('FlashcardAppDB');
            return await new Promise((resolve) => {
            request.onsuccess = () => {
                const db = request.result;
                const tx = db.transaction('decks', 'readonly');
                const store = tx.objectStore('decks');
                const getAll = store.getAll();
                getAll.onsuccess = () => resolve(getAll.result);
            };
            });
        });
        expect(decks.length).toBe(1);
        const deckNames = decks.map(d => d.deckName);

        // making sure the whale deck is unchanged
        expect(deckNames).toContain('Whales');
        const deckWhale = decks.find(d => d.deckName === 'Whales');
        expect(deckWhale.cards.length).toBe(3);
        const cardDolphin1 = deckWhale.cards[0];
        expect(cardDolphin1.frontText).toBe('What are whales?');
        expect(cardDolphin1.backText).toBe('Whales are a marine mammal.');
        const cardDolphin2 = deckWhale.cards[1];
        expect(cardDolphin2.frontText).toBe('Habitat');
        expect(cardDolphin2.backText).toBe('They live in the ocean.');
        const cardDolphin3 = deckWhale.cards[2];
        expect(cardDolphin3.frontText).toBe('Food they eat');
        expect(cardDolphin3.backText).toBe('Whales like to eat krill and plankton.');

    }, 10000);

    it('checks that deck is still deleted after reload ', async () => {

        await page.reload();

        const decks = await page.evaluate(async () => {
            const request = indexedDB.open('FlashcardAppDB');
            return await new Promise((resolve) => {
            request.onsuccess = () => {
                const db = request.result;
                const tx = db.transaction('decks', 'readonly');
                const store = tx.objectStore('decks');
                const getAll = store.getAll();
                getAll.onsuccess = () => resolve(getAll.result);
            };
            });
        });
        expect(decks.length).toBe(1);
        const deckNames = decks.map(d => d.deckName);
        
        // making sure the whale deck is unchanged
        expect(deckNames).toContain('Whales');
        const deckWhale = decks.find(d => d.deckName === 'Whales');
        expect(deckWhale.cards.length).toBe(3);
        const cardDolphin1 = deckWhale.cards[0];
        expect(cardDolphin1.frontText).toBe('What are whales?');
        expect(cardDolphin1.backText).toBe('Whales are a marine mammal.');
        const cardDolphin2 = deckWhale.cards[1];
        expect(cardDolphin2.frontText).toBe('Habitat');
        expect(cardDolphin2.backText).toBe('They live in the ocean.');
        const cardDolphin3 = deckWhale.cards[2];
        expect(cardDolphin3.frontText).toBe('Food they eat');
        expect(cardDolphin3.backText).toBe('Whales like to eat krill and plankton.');

    }, 10000);

});