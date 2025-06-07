describe('User creates a deck for the first time', () => {
    beforeAll(async () => {
        await page.goto('https://cse110-sp25-group-10.github.io/Flashcard-Project/');
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

        // TODO: access database and check for the deck and its contents in data base

    }, 10000);

}) ;