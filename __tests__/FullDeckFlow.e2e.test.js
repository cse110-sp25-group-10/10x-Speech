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
        console.log("adding title to deck and adding card to the deck");

        // type in title of deck
        await page.waitForSelector('#title-speech');
        await page.type('#title-speech', 'I will delete this soon');
        await page.keyboard.press('Enter');

        // fill in card information and add it to the deck
        await page.waitForSelector('#input-front-card');
        await page.type('#input-front-card', 'Hello world');
        await page.waitForSelector('#input-back-card');
        await page.type('#input-back-card', 'Bye bye world');
        await page.click('#upload-card');

    }, 10000);

    it('adding another card', async () => {
        console.log("adding another card to the deck");

        // fill in card information and add it to the deck
        await page.waitForSelector('#input-front-card');
        await page.type('#input-front-card', 'Hello again world');
        await page.waitForSelector('#input-back-card');
        await page.type('#input-back-card', "Bye bye for good world");
        await page.click('#upload-card');

    }, 10000);

    it('saving the deck and going back to home screen', async () => {
        console.log("pressing save and exit and checking decks");

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
        expect(deckNames).toContain('I will delete this soon');

        // making sure the cards are in thd deck
        const deck = decks.find(d => d.deckName === 'I will delete this soon');
        expect(deck.cards.length).toBe(2);
        const card1 = deck.cards[0];
        expect(card1.frontText).toBe('Hello world');
        expect(card1.backText).toBe('Bye bye world');
        const card2 = deck.cards[1];
        expect(card2.frontText).toBe('Hello again world');
        expect(card2.backText).toBe("Bye bye for good world");

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
        expect(deckNames).toContain('I will delete this soon');

        // making sure the cards are in thd deck
        const deck = decks.find(d => d.deckName === 'I will delete this soon');
        expect(deck.cards.length).toBe(2);
        const card1 = deck.cards[0];
        expect(card1.frontText).toBe('Hello world');
        expect(card1.backText).toBe('Bye bye world');
        const card2 = deck.cards[1];
        expect(card2.frontText).toBe('Hello again world');
        expect(card2.backText).toBe("Bye bye for good world");

    }, 10000);

    it('pressing the "Create" button should bring you to the create screen', async () => {
        console.log("pressing create deck button again");

        // presses the "Create" button
        await page.waitForSelector("existing-screen");
        await page.waitForSelector('#create-speech-button');
        await page.click('#create-speech-button');

        // timeout if it doesn't go on the create screen
        await page.waitForSelector("create-screen");
    }, 5000);

    it('making empty deck', async () => {
        console.log("adding title to deck");
        // type in title of deck
        await page.waitForSelector('#title-speech');
        await page.type('#title-speech', 'Empty Deck');
        await page.keyboard.press('Enter');
        
    }, 10000);

    it('saving the deck and going back to home screen', async () => {
        console.log("pressing save and exit for empty deck and checking all decks");

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
        expect(decks.length).toBe(2);
        const deckNames = decks.map(d => d.deckName);

        // making sure the delete soon deck exists and has the cards in still
        expect(deckNames).toContain('I will delete this soon');
        const deckDelete = decks.find(d => d.deckName === 'I will delete this soon');
        expect(deckDelete.cards.length).toBe(2);
        const card1 = deckDelete.cards[0];
        expect(card1.frontText).toBe('Hello world');
        expect(card1.backText).toBe('Bye bye world');
        const card2 = deckDelete.cards[1];
        expect(card2.frontText).toBe('Hello again world');
        expect(card2.backText).toBe("Bye bye for good world");

        // making sure the empty deck saved
        expect(deckNames).toContain('Empty Deck');
        const deckEmpty = decks.find(d => d.deckName === 'Empty Deck');
        expect(deckEmpty.cards.length).toBe(0);

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
        expect(decks.length).toBe(2);
        const deckNames = decks.map(d => d.deckName);

        // making sure the delete soon deck exists and has the cards in still
        expect(deckNames).toContain('I will delete this soon');
        const deckDelete = decks.find(d => d.deckName === 'I will delete this soon');
        expect(deckDelete.cards.length).toBe(2);
        const card1 = deckDelete.cards[0];
        expect(card1.frontText).toBe('Hello world');
        expect(card1.backText).toBe('Bye bye world');
        const card2 = deckDelete.cards[1];
        expect(card2.frontText).toBe('Hello again world');
        expect(card2.backText).toBe("Bye bye for good world");

        // making sure the empty deck saved
        expect(deckNames).toContain('Empty Deck');
        const deckEmpty = decks.find(d => d.deckName === 'Empty Deck');
        expect(deckEmpty.cards.length).toBe(0);

    }, 10000);


    it('checking that delete button is grayed out, then not when deck is selected', async () => {
        console.log("clicking on 'Empty Deck'");
        await page.waitForSelector("existing-screen");

        // checks that buttons are disabled
        const deleteDisabled = await page.$eval('#delete-speech-button', (btn) => btn.disabled);
        expect(deleteDisabled).toBe(true);
        const editDisabled = await page.$eval('#edit-speech-button', (btn) => btn.disabled);
        expect(editDisabled).toBe(true);
        const studyDisabled = await page.$eval('#study-button', (btn) => btn.disabled);
        expect(studyDisabled).toBe(true);

        await page.click('deck-preview[data-deck-name="Empty Deck"]');

        // checks that buttons are enabled
        const deleteEnabled = await page.$eval('#delete-speech-button', (btn) => !btn.disabled);
        expect(deleteEnabled).toBe(true);
        const editEnabled = await page.$eval('#edit-speech-button', (btn) => !btn.disabled);
        expect(editEnabled).toBe(true);
        const studyEnabled = await page.$eval('#study-button', (btn) => !btn.disabled);
        expect(studyEnabled).toBe(true);

    }, 10000);

    it('clicking the edit button', async () => {
        console.log("clicking the edit button");

        await page.waitForSelector('#edit-speech-button');
        await page.click('#edit-speech-button');
    }, 10000);

    it('changing the title of the deck', async () => {
        console.log("changing title of the deck");

        // type in title of deck
        await page.waitForSelector('#title-speech');
        await page.click('#title-speech', { clickCount: 3 });
        await page.type('#title-speech', 'Not Empty Anymore');
        await page.keyboard.press('Enter');

    }, 10000);

    it('add card to the deck', async () => {
        console.log("adding card to deck");

        // fill in card information and add it to the deck
        await page.waitForSelector('#input-front-card');
        await page.type('#input-front-card', 'I am not empty anymore');
        await page.waitForSelector('#input-back-card');
        await page.type('#input-back-card', 'stuff stuff stuff stuff');
        await page.waitForSelector('#upload-card');
        await page.click('#upload-card');

    }, 15000);

    it('add another card to the deck', async () => {
        console.log("adding another card to deck");

        // fill in card information and add it to the deck
        await page.waitForSelector('#input-front-card');
        await page.type('#input-front-card', 'The Card');
        await page.waitForSelector('#input-back-card');
        await page.type('#input-back-card', 'This card will be deleted');
        await page.waitForSelector('#upload-card');
        await page.click('#upload-card');

    }, 15000);

    it('user accidentally reloads but the deck should still be fine', async () => {
        console.log('check decks after reloading while in the edit deck screen');
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
        expect(decks.length).toBe(2);
        const deckNames = decks.map(d => d.deckName);

        // making sure the delete soon deck exists and has the cards in still
        expect(deckNames).toContain('I will delete this soon');
        const deckDelete = decks.find(d => d.deckName === 'I will delete this soon');
        expect(deckDelete.cards.length).toBe(2);
        const card1 = deckDelete.cards[0];
        expect(card1.frontText).toBe('Hello world');
        expect(card1.backText).toBe('Bye bye world');
        const card2 = deckDelete.cards[1];
        expect(card2.frontText).toBe('Hello again world');
        expect(card2.backText).toBe("Bye bye for good world");

        // making sure the empty deck saved
        expect(deckNames).toContain('Not Empty Anymore');
        const deckEmpty = decks.find(d => d.deckName === 'Not Empty Anymore');
        expect(deckEmpty.cards.length).toBe(2);
        const cardEmpty1 = deckEmpty.cards[0];
        expect(cardEmpty1.frontText).toBe('I am not empty anymore');
        expect(cardEmpty1.backText).toBe('stuff stuff stuff stuff');
        const cardEmpty2 = deckEmpty.cards[1];
        expect(cardEmpty2.frontText).toBe('The Card');
        expect(cardEmpty2.backText).toBe('This card will be deleted');

    }, 10000);

    it('checking that delete button is grayed out, then not when deck is selected', async () => {
        console.log("clicking on the 'Not Empty Anymore' deck");

        await page.waitForSelector("existing-screen");

        // checks that buttons are disabled
        const deleteDisabled = await page.$eval('#delete-speech-button', (btn) => btn.disabled);
        expect(deleteDisabled).toBe(true);
        const editDisabled = await page.$eval('#edit-speech-button', (btn) => btn.disabled);
        expect(editDisabled).toBe(true);
        const studyDisabled = await page.$eval('#study-button', (btn) => btn.disabled);
        expect(studyDisabled).toBe(true);

        await page.click('deck-preview[data-deck-name="Not Empty Anymore"]');

        // checks that buttons are enabled
        const deleteEnabled = await page.$eval('#delete-speech-button', (btn) => !btn.disabled);
        expect(deleteEnabled).toBe(true);
        const editEnabled = await page.$eval('#edit-speech-button', (btn) => !btn.disabled);
        expect(editEnabled).toBe(true);
        const studyEnabled = await page.$eval('#study-button', (btn) => !btn.disabled);
        expect(studyEnabled).toBe(true);

    }, 10000);

    it('clicking the edit button', async () => {
        console.log("clicking on the edit button");

        await page.waitForSelector('#edit-speech-button');
        await page.click('#edit-speech-button');
    }, 10000);

    it('edit one card', async () => {
        console.log("editing one of the cards");

        await page.waitForSelector('card-preview[data-card-index="0"] .edit-card-btn');
        await page.evaluate(() => {
            const card = document.querySelector('card-preview[data-card-index="0"]');
            const editBtn = card.querySelector('.edit-card-btn');
            editBtn.click();
        });

        await page.waitForSelector('#input-front-card');
        await page.click('#input-front-card', { clickCount: 3 });
        await page.type('#input-front-card', 'Buried Treasure');

        await page.waitForSelector('#input-back-card');
        await page.click('#input-back-card', { clickCount: 3 });
        await page.type('#input-back-card', 'gold and diamonds');

        await page.waitForSelector('#upload-card');
        await page.click('#upload-card');

    }, 10000);

    it('delete one card', async () => {
        console.log("deleting one of the cards");
        await page.evaluate(() => {
            const card = document.querySelector('card-preview[data-card-index="1"]');
            const deleteBtn = card.querySelector('.delete-card-btn');
            deleteBtn.click();
        });
    }, 10000);


    it('saving the deck and going back to home screen', async () => {
        console.log("pressing save and exit and checking the decks");
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
        expect(decks.length).toBe(2);
        const deckNames = decks.map(d => d.deckName);

        // making sure the delete soon deck exists and has the cards in still
        expect(deckNames).toContain('I will delete this soon');
        const deckDelete = decks.find(d => d.deckName === 'I will delete this soon');
        expect(deckDelete.cards.length).toBe(2);
        const card1 = deckDelete.cards[0];
        expect(card1.frontText).toBe('Hello world');
        expect(card1.backText).toBe('Bye bye world');
        const card2 = deckDelete.cards[1];
        expect(card2.frontText).toBe('Hello again world');
        expect(card2.backText).toBe("Bye bye for good world");

        // making sure the empty deck saved
        expect(deckNames).toContain('Not Empty Anymore');
        const deckEmpty = decks.find(d => d.deckName === 'Not Empty Anymore');
        expect(deckEmpty.cards.length).toBe(1);
        const cardEmpty1 = deckEmpty.cards[0];
        expect(cardEmpty1.frontText).toBe('Buried Treasure');
        expect(cardEmpty1.backText).toBe('gold and diamonds');

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
        expect(decks.length).toBe(2);
        const deckNames = decks.map(d => d.deckName);

        // making sure the delete soon deck exists and has the cards in still
        expect(deckNames).toContain('I will delete this soon');
        const deckDelete = decks.find(d => d.deckName === 'I will delete this soon');
        expect(deckDelete.cards.length).toBe(2);
        const card1 = deckDelete.cards[0];
        expect(card1.frontText).toBe('Hello world');
        expect(card1.backText).toBe('Bye bye world');
        const card2 = deckDelete.cards[1];
        expect(card2.frontText).toBe('Hello again world');
        expect(card2.backText).toBe("Bye bye for good world");

        // making sure the empty deck saved
        expect(deckNames).toContain('Not Empty Anymore');
        const deckEmpty = decks.find(d => d.deckName === 'Not Empty Anymore');
        expect(deckEmpty.cards.length).toBe(1);
        const cardEmpty1 = deckEmpty.cards[0];
        expect(cardEmpty1.frontText).toBe('Buried Treasure');
        expect(cardEmpty1.backText).toBe('gold and diamonds');

    }, 10000);

    it('checking that delete button is grayed out, then not when deck is selected', async () => {
        console.log("clicking on the 'I will delete this soon' deck");

        await page.waitForSelector("existing-screen");

        // checks that buttons are disabled
        const deleteDisabled = await page.$eval('#delete-speech-button', (btn) => btn.disabled);
        expect(deleteDisabled).toBe(true);
        const editDisabled = await page.$eval('#edit-speech-button', (btn) => btn.disabled);
        expect(editDisabled).toBe(true);
        const studyDisabled = await page.$eval('#study-button', (btn) => btn.disabled);
        expect(studyDisabled).toBe(true);

        await page.click('deck-preview[data-deck-name="I will delete this soon"]');

        // checks that buttons are enabled
        const deleteEnabled = await page.$eval('#delete-speech-button', (btn) => !btn.disabled);
        expect(deleteEnabled).toBe(true);
        const editEnabled = await page.$eval('#edit-speech-button', (btn) => !btn.disabled);
        expect(editEnabled).toBe(true);
        const studyEnabled = await page.$eval('#study-button', (btn) => !btn.disabled);
        expect(studyEnabled).toBe(true);

    }, 10000);

    it('delete the "I will delete this soon" deck', async () => {
        console.log("pressing the delete button");
        
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

        // making sure the empty deck saved
        expect(deckNames).toContain('Not Empty Anymore');
        const deckEmpty = decks.find(d => d.deckName === 'Not Empty Anymore');
        expect(deckEmpty.cards.length).toBe(1);
        const cardEmpty1 = deckEmpty.cards[0];
        expect(cardEmpty1.frontText).toBe('Buried Treasure');
        expect(cardEmpty1.backText).toBe('gold and diamonds');

    }, 10000);

    it('checks that deck is still deleted after reload ', async () => {
        console.log("reloading the page and checking the decks");

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
        
        // making sure the empty deck saved
        expect(deckNames).toContain('Not Empty Anymore');
        const deckEmpty = decks.find(d => d.deckName === 'Not Empty Anymore');
        expect(deckEmpty.cards.length).toBe(1);
        const cardEmpty1 = deckEmpty.cards[0];
        expect(cardEmpty1.frontText).toBe('Buried Treasure');
        expect(cardEmpty1.backText).toBe('gold and diamonds');

    }, 10000);


    it('checking that delete button is grayed out, then not when deck is selected', async () => {
        console.log("pressing on the 'Not Empty Anymore' deck");

        await page.waitForSelector("existing-screen");

        // checks that buttons are disabled
        const deleteDisabled = await page.$eval('#delete-speech-button', (btn) => btn.disabled);
        expect(deleteDisabled).toBe(true);
        const editDisabled = await page.$eval('#edit-speech-button', (btn) => btn.disabled);
        expect(editDisabled).toBe(true);
        const studyDisabled = await page.$eval('#study-button', (btn) => btn.disabled);
        expect(studyDisabled).toBe(true);

        await page.click('deck-preview[data-deck-name="Not Empty Anymore"]');

        // checks that buttons are enabled
        const deleteEnabled = await page.$eval('#delete-speech-button', (btn) => !btn.disabled);
        expect(deleteEnabled).toBe(true);
        const editEnabled = await page.$eval('#edit-speech-button', (btn) => !btn.disabled);
        expect(editEnabled).toBe(true);
        const studyEnabled = await page.$eval('#study-button', (btn) => !btn.disabled);
        expect(studyEnabled).toBe(true);

    }, 10000);

    it('delete the "Not Empty Anymore" deck', async () => {
        console.log("pressing the delete button");

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
        expect(decks.length).toBe(0);
    }, 10000);

    it('checks that deck is still deleted after reload ', async () => {
        console.log("reloading page and checking decks");

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
        expect(decks.length).toBe(0);

    }, 10000);


});