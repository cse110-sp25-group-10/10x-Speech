import { add } from '../scripts/add.js';

window.addEventListener('DOMContentLoaded', init);

function addNumbers() {
    const n1 = parseFloat(document.getElementById("num1").value);
    const n2 = parseFloat(document.getElementById("num2").value);
    const sum = add(n1, n2);
    document.getElementById("result").textContent = "Result: " + sum;
}

function init() {
    const addButton = document.getElementById("add-button");

    let bad_variable_name = 1234;

    addButton.addEventListener("click", () => {
        addNumbers();
    })
}