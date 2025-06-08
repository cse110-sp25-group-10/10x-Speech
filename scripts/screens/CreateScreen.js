class CreateScreen extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <!-- whole top part is going to be a form -->
            <a id="page-top"></a>
            <button type="button" id="save-button">Save & Finish</button>
            <form id="speech-form">
                <!-- title this speech text field, save and finish button -->
                <fieldset>
                    <label for="title-speech">Speech Name:</label>
                    <input type="text" id="title-speech" name="title-speech" placeholder="Title">
                </fieldset>
            </form>
            <form id="customize-card">
                <!-- previous button, front of card, back of card, next button -->
                <button type="button" class="previous card-nav-button">➤</button>
                <fieldset class="flash-card-creation">
                    <!-- textareas let us go multi-line, also do we want the user to be able to easily do bullet points? -->
                    <section class="card-textareas">
                        <textarea id="input-front-card" placeholder="Front Text"></textarea>
                        <textarea id="input-back-card" placeholder="Back Text"></textarea>
                    </section>
                    <section class="card-time">
                        <label for="set-time">Time Length:</label>
                        <input id="set-time" name="set-time" type="number" placeholder="5">
                    </section>
                    <button type="submit" id="upload-card">Upload Card</button>
                </fieldset>
                <button type="button" class="next card-nav-button">➤</button>
            </form>

            <output class="flash-card-list-container"></output>
            <br>
            <button type="button" id="back-button">Back</button>
        `;
    }

    disconnectedCallback() {
        this.replaceChildren();
    }
}

customElements.define("create-screen", CreateScreen);
