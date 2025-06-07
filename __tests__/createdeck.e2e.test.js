describe('User creates a deck for the first time', () => {
    beforeAll(async () => {
        await page.goto('https://team10xflashcard.netlify.app/');
    });
    
    it('pressing the "Create" button should bring you to the create screen', async () => {
        // presses the "Create" button
        await page.waitForSelector("existing-screen");
        await page.waitForSelector('#create-speech-button');
        await page.click('#create-speech-button');

        // timeout if it doesn't go on the create screen
        await page.waitForSelector("create-screen");
    }, 5000);

    it('naming deck and creating first card', async () => {
        // type in title of deck
        await page.waitForSelector('#title-speech');
        await page.type('#title-speech', 'My First Speech!');
        await page.keyboard.press('Enter');

        // fill in card information and add it to the deck
        await page.waitForSelector('#input-front-card');
        await page.type('#input-front-card', 'What I Have To Say');
        await page.waitForSelector('#input-back-card');
        await page.type('#input-back-card', 'I have nothing to say');
        await page.waitForSelector('#set-time');
        await page.type('#set-time', '30');
        await page.click('#upload-card');
    }, 10000);

    it('saving the deck and going back to home screen', async () => {
        await page.click('#save-button');
        await page.waitForSelector("existing-screen");

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
        expect(deckNames).toContain('My First Speech!');
        const deck = decks.find(d => d.deckName === 'My First Speech!');
        expect(deck.cards.length).toBe(1);
        const card = deck.cards[0];
        expect(card.frontText).toBe('What I Have To Say');
        expect(card.backText).toBe('I have nothing to say');
        expect(card.time).toBe(30);

    }, 10000);

    it('checking number of decks and the cards in the deck after reload', async () => {
        console.log('Checking number of decks and the cards in the deck after reload');
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
        expect(deckNames).toContain('My First Speech!');
        const deck = decks.find(d => d.deckName === 'My First Speech!');
        expect(deck.cards.length).toBe(1);
        const card = deck.cards[0];
        expect(card.frontText).toBe('What I Have To Say');
        expect(card.backText).toBe('I have nothing to say');
        expect(card.time).toBe(30);

    }, 10000);

});