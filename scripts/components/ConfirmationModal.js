// TODO: Make this a custom element
// This is a simple one for temporary use

const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000; /* Ensure it's on top */
            visibility: hidden;
            opacity: 0;
            transition: opacity 0.3s ease-in-out, visibility 0s 0.3s;
        }
        :host([open]) {
            visibility: visible;
            opacity: 1;
            transition: opacity 0.3s ease-in-out;
        }
        .modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-align: center;
        }
        .modal-content p {
            margin-bottom: 20px;
        }
        .modal-actions button {
            padding: 10px 15px;
            margin: 0 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .confirm-btn {
            background-color: #4CAF50;
            color: white;
        }
        .cancel-btn {
            background-color: #f44336;
            color: white;
        }
    </style>
    <div class="modal-content">
        <p id="message-text">Are you sure?</p>
        <div class="modal-actions">
            <button class="confirm-btn" id="confirmBtn">Yes</button>
            <button class="cancel-btn" id="cancelBtn">No</button>
        </div>
    </div>
`;

class ConfirmationModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this._resolvePromise = null;
        this._confirmBtn = this.shadowRoot.getElementById("confirmBtn");
        this._cancelBtn = this.shadowRoot.getElementById("cancelBtn");
        this._messageEl = this.shadowRoot.getElementById("message-text");
    }

    connectedCallback() {
        this._confirmBtn.addEventListener("click", () => this._resolve(true));
        this._cancelBtn.addEventListener("click", () => this._resolve(false));
        // Optional: Close on Escape key
        this._boundHandleKeydown = this._handleKeydown.bind(this);
    }

    disconnectedCallback() {
        // Clean up if needed, though listeners on shadow DOM elements are usually fine
        window.removeEventListener("keydown", this._boundHandleKeydown);
    }

    _handleKeydown(event) {
        if (event.key === "Escape") {
            this._resolve(false); // Or a specific value for "closed via escape"
        }
    }

    _resolve(value) {
        if (this._resolvePromise) {
            this._resolvePromise(value);
            this._resolvePromise = null; // Reset for next use
        }
        this.close();
    }

    open(message = "Are you sure?", confirmText = "Yes", cancelText = "No") {
        return new Promise((resolve) => {
            this._resolvePromise = resolve;
            this._messageEl.textContent = message;
            this._confirmBtn.textContent = confirmText;
            this._cancelBtn.textContent = cancelText;
            this.setAttribute("open", "");
            window.addEventListener("keydown", this._boundHandleKeydown);
        });
    }

    close() {
        this.removeAttribute("open");
        window.removeEventListener("keydown", this._boundHandleKeydown);
    }
}

customElements.define("confirmation-modal", ConfirmationModal);
