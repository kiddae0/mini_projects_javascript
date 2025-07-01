// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const diceContainer = document.getElementById('dice');
const diceImage = document.getElementById('diceImage');
const rollBtn = document.getElementById('rollBtn');
const diceCountSelect = document.getElementById('diceCount');
const historyList = document.getElementById('historyList');
const clearBtn = document.getElementById('clearBtn');

// Game State
let isDarkMode = false;
let rollHistory = [];
let isRolling = false;

// Initialize the game
function init() {
    loadTheme();
    loadHistory();
    setupEventListeners();
    updateDiceDisplay();
}

// Theme Management
function loadTheme() {
    const savedTheme = localStorage.getItem('diceRollerTheme');
    if (savedTheme === 'dark') {
        setDarkMode(true);
    }
}

function setDarkMode(dark) {
    isDarkMode = dark;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    themeIcon.src = dark ? 'img/white-mode.png' : 'img/dark-mode.png';
    localStorage.setItem('diceRollerTheme', dark ? 'dark' : 'light');
    
    // Update all dice images to match theme
    updateDiceDisplay();
}

function toggleTheme() {
    setDarkMode(!isDarkMode);
}

// Dice Rolling Logic
function rollDice() {
    if (isRolling) return;
    
    isRolling = true;
    rollBtn.disabled = true;
    
    const diceCount = parseInt(diceCountSelect.value);
    const results = [];
    
    // Create dice elements for multiple dice
    diceContainer.innerHTML = '';
    for (let i = 0; i < diceCount; i++) {
        const dice = document.createElement('div');
        dice.className = 'dice rolling';
        dice.innerHTML = `<img src="img/1.svg" alt="Dice">`;
        diceContainer.appendChild(dice);
    }
    
    // Animate and roll
    setTimeout(() => {
        for (let i = 0; i < diceCount; i++) {
            const result = Math.floor(Math.random() * 6) + 1;
            results.push(result);
            
            const dice = diceContainer.children[i];
            const img = dice.querySelector('img');
            const isDark = isDarkMode;
            
            img.src = `img/${result}${isDark ? '-dark' : ''}.svg`;
            dice.classList.remove('rolling');
        }
        
        // Add to history
        addToHistory(results);
        
        // Re-enable button
        setTimeout(() => {
            isRolling = false;
            rollBtn.disabled = false;
        }, 300);
    }, 600);
}

function updateDiceDisplay() {
    const diceCount = parseInt(diceCountSelect.value);
    diceContainer.innerHTML = '';
    
    for (let i = 0; i < diceCount; i++) {
        const dice = document.createElement('div');
        dice.className = 'dice';
        const isDark = isDarkMode;
        dice.innerHTML = `<img src="img/1${isDark ? '-dark' : ''}.svg" alt="Dice">`;
        diceContainer.appendChild(dice);
    }
}

// History Management
function addToHistory(results) {
    const timestamp = new Date();
    const historyItem = {
        results: results,
        total: results.reduce((sum, result) => sum + result, 0),
        timestamp: timestamp
    };
    
    rollHistory.unshift(historyItem);
    if (rollHistory.length > 20) {
        rollHistory.pop(); // Keep only last 20 rolls
    }
    
    saveHistory();
    displayHistory();
}

function displayHistory() {
    historyList.innerHTML = '';
    
    rollHistory.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const resultsText = item.results.length > 1 
            ? `${item.results.join(', ')} (Total: ${item.total})`
            : item.results[0].toString();
        
        const timeString = item.timestamp.toLocaleTimeString();
        
        historyItem.innerHTML = `
            <span class="roll-result">${resultsText}</span>
            <span class="roll-time">${timeString}</span>
        `;
        
        historyList.appendChild(historyItem);
    });
}

function clearHistory() {
    rollHistory = [];
    saveHistory();
    displayHistory();
}

function saveHistory() {
    localStorage.setItem('diceRollerHistory', JSON.stringify(rollHistory));
}

function loadHistory() {
    const saved = localStorage.getItem('diceRollerHistory');
    if (saved) {
        try {
            rollHistory = JSON.parse(saved);
            rollHistory.forEach(item => {
                item.timestamp = new Date(item.timestamp);
            });
            displayHistory();
        } catch (error) {
            console.error('Error loading history:', error);
            rollHistory = [];
        }
    }
}

// Event Listeners
function setupEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    rollBtn.addEventListener('click', rollDice);
    diceCountSelect.addEventListener('change', updateDiceDisplay);
    clearBtn.addEventListener('click', clearHistory);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !isRolling) {
            e.preventDefault();
            rollDice();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 