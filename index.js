const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

// Helper: Check if value is an operator
function isOperator(val) {
    return ['+', '-', '*', '/', '÷', '×'].includes(val);
}

function appendToDisplay(value) {
    // Convert × and ÷ to * and /
    if (value === '×') value = '*';
    if (value === '÷') value = '/';

    // Prevent two operators in a row or leading operator (except minus)
    const lastChar = display.value.slice(-1);

    if (isOperator(value)) {
        if (display.value === '' && value !== '-') return;
        if (isOperator(lastChar) && value !== '-') {
            display.value = display.value.slice(0, -1) + value; // Replace
            return;
        }
    }

    // Only one "." per number segment
    if (value === '.' && /\.\d*$/.test(display.value.split(/[\+\-\*\/]/).pop())) return;

    display.value += value;
}

function clearDisplay() {
    display.value = '';
}

// Evaluate the expression
function calculate() {
    let expr = display.value.replace(/×/g, '*').replace(/÷/g, '/');
    try {
        if (expr.trim() === '') return;
        let result = Function('"use strict"; return (' + expr + ")")();
        if (result === undefined) return;
        display.value = result;
    } catch {
        display.value = 'Error';
    }
}

// Keyboard handler
document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || ['+', '-', '*', '/', '.', '(', ')'].includes(e.key)) {
        appendToDisplay(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Escape') {
        clearDisplay();
    } else if (e.key === 'Backspace') {
        display.value = display.value.slice(0, -1);
    }
});

// Optional: Prevents typing directly into input (works in modern browsers)
display.addEventListener('keydown', e => e.preventDefault());

// Allow clicking buttons with keyboard focus
buttons.forEach(btn => btn.addEventListener('focus', () => btn.blur()));
