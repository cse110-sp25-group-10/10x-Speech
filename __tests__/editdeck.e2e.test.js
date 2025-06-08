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
                            { frontText: 'What are whales?', backText: 'Whales are a marine mammal.' },
                            { frontText: 'Habitat', backText: 'They live in the ocean.' },
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

    it('clicking the edit button', async () => {

        await page.waitForSelector('#edit-speech-button');
        await page.click('#edit-speech-button');
    }, 10000);

    it('changing the title of the deck', async () => {

        // type in title of deck
        await page.waitForSelector('#title-speech');
        await page.click('#title-speech', { clickCount: 3 });
        await page.type('#title-speech', 'Dolphins');
        await page.keyboard.press('Enter');

    }, 10000);

    it('add another card to the deck', async () => {
        // fill in card information and add it to the deck
        await page.waitForSelector('#input-front-card');
        await page.type('#input-front-card', 'Relationship with others');
        await page.waitForSelector('#input-back-card');
        await page.type('#input-back-card', 'Dolphins swim in groups called pods, typically consisting of 2-30 dolphins.');
        await page.waitForSelector('#upload-card');
        await page.click('#upload-card');

    }, 15000);

    it('edit one card', async () => {
        await page.evaluate(() => {
            const card = document.querySelector('card-preview[data-card-index="0"]');
            const editBtn = card.querySelector('.edit-card-btn');
            editBtn.click();
        });

        await page.waitForSelector('#input-front-card');
        await page.click('#input-front-card', { clickCount: 3 });
        await page.type('#input-front-card', 'What are dolphins?');

        await page.waitForSelector('#input-back-card');
        await page.click('#input-back-card', { clickCount: 3 });
        await page.type('#input-back-card', 'Dolphins are a marine mammal.');

        await page.waitForSelector('#upload-card');
        await page.click('#upload-card');

    }, 10000);

    it('delete one card', async () => {
        await page.evaluate(() => {
            const card = document.querySelector('card-preview[data-card-index="2"]');
            const deleteBtn = card.querySelector('.delete-card-btn');
            deleteBtn.click();
        });
    }, 10000);

    it('add another card', async () => {
        await page.waitForSelector('#input-front-card');
        await page.type('#input-front-card', 'Entertainment');
        await page.waitForSelector('#input-back-card');
        await page.type('#input-back-card', 'Dolphins will hit pufferfish to each other for fun.');
        await page.waitForSelector('#upload-card');
        await page.click('#upload-card');
    }, 10000);    

    it('save and exit deck editor', async () => {

        // clicking save and exit
        await page.waitForSelector('#save-button');
        await page.click('#save-button');

        // making sure there are still two decks
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
        expect(decks.length).toBe(2);
        const deckNames = decks.map(d => d.deckName);

        // making sure the dolphin deck is there and that the cards are edited
        expect(deckNames).toContain('Dolphins');
        const deckDolphin = decks.find(d => d.deckName === 'Dolphins');
        expect(deckDolphin.cards.length).toBe(4);
        const cardDolphin1 = deckDolphin.cards[0];
        expect(cardDolphin1.frontText).toBe('What are dolphins?');
        expect(cardDolphin1.backText).toBe('Dolphins are a marine mammal.');
        const cardDolphin2 = deckDolphin.cards[1];
        expect(cardDolphin2.frontText).toBe('Habitat');
        expect(cardDolphin2.backText).toBe('They live in the ocean.');
        const cardDolphin3 = deckDolphin.cards[2];
        expect(cardDolphin3.frontText).toBe('Relationship with others');
        expect(cardDolphin3.backText).toBe('Dolphins swim in groups called pods, typically consisting of 2-30 dolphins.');
        const cardDolphin4 = deckDolphin.cards[3];
        expect(cardDolphin4.frontText).toBe('Entertainment');
        expect(cardDolphin4.backText).toBe('Dolphins will hit pufferfish to each other for fun.');

        // making sure the tiger deck did not get affected
        expect(deckNames).toContain('Tigers');
        const deckTiger = decks.find(d => d.deckName === 'Tigers');
        expect(deckTiger.cards.length).toBe(3);
        const cardTiger1 = deckTiger.cards[0];
        expect(cardTiger1.frontText).toBe('What are tigers?');
        expect(cardTiger1.backText).toBe('Tigers are a land mammal.');
        const cardTiger2 = deckTiger.cards[1];
        expect(cardTiger2.frontText).toBe('Habitat');
        expect(cardTiger2.backText).toBe('They live in the rainforests.');
        const cardTiger3 = deckTiger.cards[2];
        expect(cardTiger3.frontText).toBe('Food they eat');
        expect(cardTiger3.backText).toBe('Tigers like to eat deer and boar.');

    }, 10000); 

    it('checks that edits to the deck are still saved after reload', async () => {

        await page.reload();

        // making sure there are still two decks
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
        expect(decks.length).toBe(2);
        const deckNames = decks.map(d => d.deckName);

        // making sure the dolphin deck is there and that the cards are edited
        expect(deckNames).toContain('Dolphins');
        const deckDolphin = decks.find(d => d.deckName === 'Dolphins');
        expect(deckDolphin.cards.length).toBe(4);
        const cardDolphin1 = deckDolphin.cards[0];
        expect(cardDolphin1.frontText).toBe('What are dolphins?');
        expect(cardDolphin1.backText).toBe('Dolphins are a marine mammal.');
        const cardDolphin2 = deckDolphin.cards[1];
        expect(cardDolphin2.frontText).toBe('Habitat');
        expect(cardDolphin2.backText).toBe('They live in the ocean.');
        const cardDolphin3 = deckDolphin.cards[2];
        expect(cardDolphin3.frontText).toBe('Relationship with others');
        expect(cardDolphin3.backText).toBe('Dolphins swim in groups called pods, typically consisting of 2-30 dolphins.');
        const cardDolphin4 = deckDolphin.cards[3];
        expect(cardDolphin4.frontText).toBe('Entertainment');
        expect(cardDolphin4.backText).toBe('Dolphins will hit pufferfish to each other for fun.');

        // making sure the tiger deck did not get affected
        expect(deckNames).toContain('Tigers');
        const deckTiger = decks.find(d => d.deckName === 'Tigers');
        expect(deckTiger.cards.length).toBe(3);
        const cardTiger1 = deckTiger.cards[0];
        expect(cardTiger1.frontText).toBe('What are tigers?');
        expect(cardTiger1.backText).toBe('Tigers are a land mammal.');
        const cardTiger2 = deckTiger.cards[1];
        expect(cardTiger2.frontText).toBe('Habitat');
        expect(cardTiger2.backText).toBe('They live in the rainforests.');
        const cardTiger3 = deckTiger.cards[2];
        expect(cardTiger3.frontText).toBe('Food they eat');
        expect(cardTiger3.backText).toBe('Tigers like to eat deer and boar.');

    }, 10000);

});