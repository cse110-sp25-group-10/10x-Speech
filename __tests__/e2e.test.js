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
    });

});