
function generatePassword(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols) {
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%&*()_-+=";

    let allowedChars = "";
    let password = "";

    allowedChars += includeLowercase ? lowercaseChars : "";
    allowedChars += includeUppercase ? uppercaseChars : "";
    allowedChars += includeNumbers ? numberChars : "";
    allowedChars += includeSymbols ? symbolChars : "";

    if (length <= 0) {
        return "Password length must be at least 1";
    }
    if (allowedChars.length === 0) {
        return "At least 1 set of character needs to be selected";
    }

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allowedChars.length);
        password += allowedChars[randomIndex];
    }
    return password;
}

const passwordInput = document.getElementById('password');
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');

lengthSlider.addEventListener('input', function() {
    lengthValue.textContent = lengthSlider.value;
});


function handleGenerate() {
    const length = parseInt(lengthSlider.value);
    const includeLowercase = lowercaseCheckbox.checked;
    const includeUppercase = uppercaseCheckbox.checked;
    const includeNumbers = numbersCheckbox.checked;
    const includeSymbols = symbolsCheckbox.checked;
    const password = generatePassword(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols);
    passwordInput.value = password;
}

generateBtn.addEventListener('click', handleGenerate);

copyBtn.addEventListener('click', function() {
    if (!passwordInput.value) return;
    passwordInput.select();
    document.execCommand('copy');
    alert('Password copied to clipboard!');
});

document.addEventListener('DOMContentLoaded', function() {
    lengthValue.textContent = lengthSlider.value;
    handleGenerate();
}); 