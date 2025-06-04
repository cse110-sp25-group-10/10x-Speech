class CardPreview extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const frontText = this.getAttribute("data-front-text");
        const backText = this.getAttribute("data-back-text");
        const time = this.getAttribute("data-time");
        this.innerHTML = `
            <section>
                <p class="front-text">${frontText}</p>
                <p class="back-text">${backText}</p>
                <p class="time-text">${time}s</p>
            </section>
            <menu>
                <button class="edit-card-btn button-small">Edit</button>
                <button class="delete-card-btn button-small danger">Delete</button>
            </menu>
            <hr>
        `;
        const editBtn = this.querySelector(".edit-card-btn");
        const deleteBtn = this.querySelector(".delete-card-btn");
        editBtn.addEventListener("click", this.editCard);
        deleteBtn.addEventListener("click", this.deleteCard);
    }

    editCard() {
        const editEvent = new CustomEvent("edit-card", {
            detail: this.parentNode.parentNode,
            bubbles: true
        });

        this.dispatchEvent(editEvent);
    }

    deleteCard() {
        const deleteEvent = new CustomEvent("delete-card", {
            detail: this.parentNode.parentNode,
            bubbles: true
        });
        this.dispatchEvent(deleteEvent);
    }

    disconnectedCallback() {
        const editBtn = this.querySelector(".edit-card-btn");
        const deleteBtn = this.querySelector(".delete-card-btn");
        editBtn.removeEventListener("click", this.editCard);
        deleteBtn.removeEventListener("click", this.deleteCard);
        this.replaceChildren();
    }
}

customElements.define("card-preview", CardPreview);