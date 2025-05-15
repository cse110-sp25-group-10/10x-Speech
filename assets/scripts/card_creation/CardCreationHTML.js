export function getCardCreationHTML() {
    return `
        <form id="new-card">
            <fieldset>
                <legend>Front Side</legend>
                <label for="front-topic">Topic/Keyword</label>
                <input type="text" id="front-topic" name="front-topic" required>
            </fieldset>
            <fieldset>
                <legend>Back Side</legend>
                <label for="back-description">Description</label>
                <textarea type="text" id="back-desription" name="back-description" cols="25" rows="5" required></textarea>
            </fieldset>
            <button type="submit" class="">Create Card</button>
        </form>
    `;
}