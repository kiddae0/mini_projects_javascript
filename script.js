
const number = document.getElementById('number');
const decrease = document.getElementById('decrease');
const reset = document.getElementById('reset');
const increase = document.getElementById('increase');

let count = 0;

function updateDisplay() {
    number.textContent = count;
}

decrease.addEventListener('click', () => {
    count--;
    updateDisplay();
});

reset.addEventListener('click', () => {
    count = 0;
    updateDisplay();
});

increase.addEventListener('click', () => {
    count++;
    updateDisplay();
});

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowDown':
        case '-':
            count--;
            updateDisplay();
            break;
        case 'ArrowUp':
        case '+':
            count++;
            updateDisplay();
            break;
        case 'r':
        case 'R':
            count = 0;
            updateDisplay();
            break;
    }
});

const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0) scale(1)';
    });
});

updateDisplay();

let clickCount = 0;
const title = document.querySelector('.title');

title.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
        title.textContent = '🎉 Counter Program 🎉';
        setTimeout(() => {
            title.textContent = 'Counter Program';
            clickCount = 0;
        }, 2000);
    }
}); 