class CreateScreen extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <!-- whole top part is going to be a form -->
            <a id="page-top"></a>
            <menu>
                <button type="button" id="save-button">Save & Finish</button>
                <form id="speech-form">
                    <!-- title this speech text field, save and finish button -->
                    <fieldset>
                        <label for="title-speech">Speech Name:</label>
                        <input type="text" id="title-speech" name="title-speech" placeholder="Title">
                    </fieldset>
                </form>
            </menu>
            <section>
                <button type="button" class="previous card-nav-button">➤</button>
                <button type="button" class="next card-nav-button">➤</button>
                <form id="customize-card">
                    <!-- front of card, back of card-->
                    <fieldset class="flash-card-creation">
                        <!-- textareas let us go multi-line, also do we want the user to be able to easily do bullet points? -->
                        <section class="card-front">
                            <label for="input-front-card">Front Text</label>
                            <textarea id="input-front-card" name="front-text" placeholder="Front Text"></textarea>
                        </section>
                        <section class="card-back">
                            <label for="input-back-card">Back Text</label>
                            <textarea id="input-back-card" name="back-text" placeholder="Back Text"></textarea>
                        </section>
                        <section class="card-time">
                            <input id="set-time" name="set-time" type="number" placeholder="5">
                            <label for="set-time">
                                <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M12 14V11M12 6C7.85786 6 4.5 9.35786 4.5 13.5C4.5 17.6421 7.85786 21
                                        12 21C16.1421 21 19.5 17.6421 19.5 13.5C19.5 11.5561 18.7605 9.78494
                                        17.5474 8.4525M12 6C14.1982 6 16.1756 6.94572 17.5474 8.4525M12 6V3M19.5 6.5L17.5474
                                        8.4525M12 3H9M12 3H15" stroke="#7a7a7a" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round"></path>
                                    </g>
                                </svg>
                            </label>
                        </section>
                        <button type="submit" id="upload-card">Upload Card</button>
                    </fieldset>
                </form>
            </section>
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
