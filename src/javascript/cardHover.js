// Variables
const card = document.querySelector("#hover-demo-C");
const rect = card.getBoundingClientRect();

// Event Listener - Listens for when we move our mouse.
card.addEventListener("mousemove", (e) => {
    rotateElement(e, card);
});

// Calculates Rotation Amount
function rotateElement(event, element) {
    const x = event.clientX;
    const y = event.clientY;

    // Find the center of the card
    const cardCenterX = rect.right - (rect.width / 2);
    const cardCenterY = rect.bottom - (rect.height / 2);

    // Get cursor offset from card center * scale.
    const offsetX = ((x - cardCenterX) / cardCenterX) * 20;
    const offsetY = ((y - cardCenterY) / cardCenterY) * 50;

    // Send to the CSS variables.
    element.style.setProperty("--rotateX", (-1)*offsetY + "deg");
    element.style.setProperty("--rotateY", offsetX + "deg");

}