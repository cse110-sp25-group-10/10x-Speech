describe('User loads their decks edits one of them', () => {
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

        await page.reload();

    });
    

    it('checking that edit button is grayed out, then not when deck is selected', async () => {

        await page.waitForSelector("existing-screen");

        // checks that buttons are disabled
        const deleteDisabled = await page.$eval('#delete-speech-button', (btn) => btn.disabled);
        expect(deleteDisabled).toBe(true);
        const editDisabled = await page.$eval('#edit-speech-button', (btn) => btn.disabled);
        expect(editDisabled).toBe(true);
        const studyDisabled = await page.$eval('#study-button', (btn) => btn.disabled);
        expect(studyDisabled).toBe(true);

        await page.click('deck-preview[data-deck-name="Whales"]');

        // checks that buttons are enabled
        const deleteEnabled = await page.$eval('#delete-speech-button', (btn) => !btn.disabled);
        expect(deleteEnabled).toBe(true);
        const editEnabled = await page.$eval('#edit-speech-button', (btn) => !btn.disabled);
        expect(editEnabled).toBe(true);
        const studyEnabled = await page.$eval('#study-button', (btn) => !btn.disabled);
        expect(studyEnabled).toBe(true);

    }, 10000);

    it('add one card', async () => {

    }, 10000);

    it('add another card', async () => {

    }, 10000);

    it('delete one card', async () => {

    }, 10000);

    it('edit one card', async () => {

    }, 10000);

    it('save and exit', async () => {

    }, 10000);    

    it('check that the deck is updaetd with the new cards', async () => {

    }, 10000); 

    // it('checks that edits to the deck are still there after reload', async () => {

    //     await page.reload();

    //     const decks = await page.evaluate(async () => {
    //         const request = indexedDB.open('FlashcardAppDB');
    //         return await new Promise((resolve) => {
    //         request.onsuccess = () => {
    //             const db = request.result;
    //             const tx = db.transaction('decks', 'readonly');
    //             const store = tx.objectStore('decks');
    //             const getAll = store.getAll();
    //             getAll.onsuccess = () => resolve(getAll.result);
    //         };
    //         });
    //     });
    //     expect(decks.length).toBe(1);
    //     const deckNames = decks.map(d => d.deckName);
    //     expect(deckNames).toContain('Whales');
        

    // }, 10000);

});