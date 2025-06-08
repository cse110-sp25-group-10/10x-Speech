describe('User creates a deck for the first time', () => {
    beforeAll(async () => {
        await page.goto('https://team10xflashcard.netlify.app/');
        await page.evaluate(() => {
            return new Promise((resolve) => {
                const request = indexedDB.open('FlashcardAppDB');
                request.onsuccess = () => {
                    const db = request.result;
                    const tx = db.transaction('decks', 'readwrite');
                    const store = tx.objectStore('decks');
                    store.clear();
                    tx.oncomplete = () => resolve();
                };
            });
        });
    });
    
    it('pressing the "Create" button should bring you to the create screen', async () => {
        console.log("pressing create deck button");
        // presses the "Create" button
        await page.waitForSelector("existing-screen");
        await page.waitForSelector('#create-speech-button');
        await page.click('#create-speech-button');

        // timeout if it doesn't go on the create screen
        await page.waitForSelector("create-screen");
    }, 5000);

    it('naming deck and creating first card', async () => {
        console.log("typing name for the deck and adding a card");
        // type in title of deck
        await page.waitForSelector('#title-speech');
        await page.type('#title-speech', 'My First Speech!');
        await page.keyboard.press('Enter');

        // fill in card information and add it to the deck
        await page.waitForSelector('#input-front-card');
        await page.type('#input-front-card', 'What I Have To Say');
        await page.waitForSelector('#input-back-card');
        await page.type('#input-back-card', 'I have nothing to say');
        await page.click('#upload-card');

    }, 10000);

    it('adding another card', async () => {
        console.log("adding another card");
        // fill in card information and add it to the deck
        await page.waitForSelector('#input-front-card');
        await page.type('#input-front-card', 'The Meaning of Life');
        await page.waitForSelector('#input-back-card');
        await page.type('#input-back-card', "I don't know");
        await page.click('#upload-card');

    }, 10000);

    it('saving the deck and going back to home screen', async () => {
        console.log("pressing save and exit button and checking number of decks and the cards in the deck");
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

        // make sure there is only one deck and that it is the correct one
        expect(decks.length).toBe(1);
        const deckNames = decks.map(d => d.deckName);
        expect(deckNames).toContain('My First Speech!');

        // making sure the cards are in thd deck
        const deck = decks.find(d => d.deckName === 'My First Speech!');
        expect(deck.cards.length).toBe(2);
        const card1 = deck.cards[0];
        expect(card1.frontText).toBe('What I Have To Say');
        expect(card1.backText).toBe('I have nothing to say');
        const card2 = deck.cards[1];
        expect(card2.frontText).toBe('The Meaning of Life');
        expect(card2.backText).toBe("I don't know");

    }, 10000);

    it('checking number of decks and the cards in the deck after reload', async () => {
        console.log('checking number of decks and the cards in the deck after reload');
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

        // make sure there is only one deck and that it is the correct one
        expect(decks.length).toBe(1);
        const deckNames = decks.map(d => d.deckName);
        expect(deckNames).toContain('My First Speech!');

        // making sure the cards are in thd deck
        const deck = decks.find(d => d.deckName === 'My First Speech!');
        expect(deck.cards.length).toBe(2);
        const card1 = deck.cards[0];
        expect(card1.frontText).toBe('What I Have To Say');
        expect(card1.backText).toBe('I have nothing to say');
        const card2 = deck.cards[1];
        expect(card2.frontText).toBe('The Meaning of Life');
        expect(card2.backText).toBe("I don't know");

    }, 10000);

});