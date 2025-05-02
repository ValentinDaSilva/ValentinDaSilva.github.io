// Select all input elements on the page
const inputs = document.querySelectorAll('input');

// Add an event listener to each input
inputs.forEach(input => {
    input.addEventListener('input', (event) => {
        const value = event.target.value;
        // Convert letters to uppercase
        event.target.value = value.replace(/[a-z]/g, (char) => char.toUpperCase());
    });
});