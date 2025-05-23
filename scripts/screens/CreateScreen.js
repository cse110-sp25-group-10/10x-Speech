class CreateScreen extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <!-- whole top part is going to be a form -->
            <form id="customize-card">
                <!-- title this speech text field, save and finish button -->
                <fieldset class="top">
                    <input type="text" id="title-speech" name="title-speech">
                    <button id="save-button">Save &amp; Finish</button>
                </fieldset>

                <!-- previous button, front of card, back of card, next button -->
                <fieldset class="flash-card-container">
                    <button class="previous-card-button">left arrow</button>

                    <!-- textareas let us go multi-line, also do we want the user to be able to easily do bullet points? -->
                    <textarea id="input-front-card">[Add Text]</textarea>
                    <textarea id="input-back-card">[Add Text]</textarea>

                    <button class="next-card-button">right arrow</button>
                </fieldset>

                <fieldset class="bottom">
                    <button id="set-timer">Set Timer: XX:XX</button>
                    <button id="upload-card">Upload Card</button>
                </fieldset>
            </form>

            <!-- shuffle button, press to record button, return home button -->
            <!-- maybe change from section to nav -->
            <section class="bottom">
                <button id="shuffle-button">Shuffle</button>

                <!-- remember that this changes states -->
                <button id="record-button">Press to Record Voice</button>

                <!-- go back to home.html screen -->
                <button id="home-button">Return Home</button>
            </section>

            <section class="flash-card-list-container">
                <!-- idea here is make list of card components using menu (should be same as ol) (maybe better handled in JS) -->
                <ol id="flash-card-list">
                    <li>
                        <!-- should show front on left, back on right -->
                        <article class="temp-card">
                            <p>Front</p>
                            <hr>
                            <p>Back</p>
                        </article>
                    </li>
                    <li>
                        <article class="temp-card">
                            <p>Front</p>
                            <hr>
                            <p>Back</p>
                        </article>
                    </li>
                    <li>
                        <article class="temp-card">
                            <p>Front</p>
                            <hr>
                            <p>Back</p>
                        </article>
                    </li>
                    <li>
                        <article class="temp-card">
                            <p>Front</p>
                            <hr>
                            <p>Back</p>
                        </article>
                    </li>
                </ol>

                <!-- same idea as above, but for buttons on the side -->
                <menu>
                    <li>
                        <button id="sort-up">up arrow</button>
                    </li>
                    <li>
                        <button id="edit-list-entry">Edit</button>
                    </li>
                    <li>
                        <button id="delete-list-entry">Delete</button>
                    </li>
                    <li>
                        <button id="sort-down">down arrow</button>
                    </li>
                </menu>
            </section>
        `;
    }

    disconnectedCallback() {
        this.replaceChildren();
    }
}

customElements.define("create-screen", CreateScreen);