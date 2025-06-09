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
                <!--front of card, back of card-->
                <fieldset class="flash-card-creation">
                    <!-- textareas let us go multi-line, also do we want the user to be able to easily do bullet points? -->
                    <section class="card-textareas">
                        <textarea id="input-front-card" placeholder="Front Text"></textarea>
                        <textarea id="input-back-card" placeholder="Back Text"></textarea>
                    </section>
                </fieldset>
                <button type="submit" id="upload-card">Upload Card</button>
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
