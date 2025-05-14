const secretNumber = [];
const userInput = [];
let tries = 0;
let previousGuesses = []; // Track previous guesses
const maxTries = 10; // Maximum number of attempts

function updateResults(tries, guess, bulls, cows) {
    const tableBody = document.querySelector('#gameResults tbody');
    const newRow = document.createElement('tr');

    const triesCell = document.createElement('td');
    triesCell.textContent = tries;
    newRow.appendChild(triesCell);

    const guessCell = document.createElement('td');
    guessCell.textContent = guess;
    newRow.appendChild(guessCell);

    const bullsCell = document.createElement('td');
    bullsCell.textContent = bulls;
    newRow.appendChild(bullsCell);

    const cowsCell = document.createElement('td');
    cowsCell.textContent = cows;
    newRow.appendChild(cowsCell);

    tableBody.appendChild(newRow);
}

function GenerateSecretNumber() {
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (let i = digits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [digits[i], digits[j]] = [digits[j], digits[i]];
    }
    secretNumber.length = 0; // Clear the previous secret number
    for (let i = 0; i < 4; i++) {
        secretNumber.push(digits[i]);
    }
}

function Start() {
    const tableBody = document.querySelector('#gameResults tbody');
    tableBody.innerHTML = ''; // Clear the table

    tries = 0;
    userInput.length = 0;
    secretNumber.length = 0;
    previousGuesses = []; // Reset previous guesses
    GenerateSecretNumber();
    console.log(secretNumber); // Optional: You can check the secret number in the console
}

Start();

document.getElementById('guessForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent form from submitting and refreshing the page

    const inputField = document.getElementById('guessInput');
    const inputValue = inputField.value;
    let cows = 0;
    let bulls = 0;

    // Check if the input is a valid guess (4 unique digits)
    if (/^\d{4}$/.test(inputValue) && new Set(inputValue).size === 4) {

        // Check if the guess is a duplicate
        if (previousGuesses.includes(inputValue)) {
            // Show error for duplicate guess
            document.getElementById('errorMessage').textContent = 'You already tried this number. Please guess a new one!';
            document.getElementById('errorMessage').style.display = 'block';
            return;
        }

        // Store the guess in the previous guesses array
        previousGuesses.push(inputValue);

        // Clear any existing error message
        document.getElementById('errorMessage').style.display = 'none';

        userInput.length = 0;
        userInput.push(...inputValue.split(''));
        tries++;

        // Check for bulls and cows
        for (let i = 0; i < 4; i++) {
            if (secretNumber[i] === userInput[i]) {
                bulls++;
            }
            if (secretNumber.includes(userInput[i]) && secretNumber[i] !== userInput[i]) {
                cows++;
            }
        }

        // Update the results table
        updateResults(tries, userInput, bulls, cows);

        // Check for win condition (bulls == 4)
        if (bulls === 4) {
            document.getElementById('errorMessage').textContent = 'You win! Congratulations!';
            document.getElementById('errorMessage').style.color = 'green';
            document.getElementById('errorMessage').style.display = 'block';

            // Disable further input after win
            document.getElementById('guessInput').disabled = true;
            document.querySelector('button[type="submit"]').disabled = true;
        }

        // Check for game over condition (max tries reached)
        if (tries >= maxTries && bulls !== 4) {
            document.getElementById('errorMessage').textContent = 'Game Over! You have exceeded the maximum number of tries.';
            document.getElementById('errorMessage').style.color = 'red';
            document.getElementById('errorMessage').style.display = 'block';

            // Disable further input after game over
            document.getElementById('guessInput').disabled = true;
            document.querySelector('button[type="submit"]').disabled = true;
        }
    } else {
        // Show error for invalid input
        document.getElementById('errorMessage').textContent = 'Error: Please enter 4 non-repeating digits.';
        document.getElementById('errorMessage').style.color = 'red';
        document.getElementById('errorMessage').style.display = 'block';
    }
});

// Event listener for the reset button
document.getElementById('resetButton').addEventListener('click', function() {
    Start(); // Reset the game by calling Start() when the button is clicked
    document.getElementById('errorMessage').style.display = 'none'; // Hide any error messages
    document.getElementById('guessInput').disabled = false; // Re-enable the input field
    document.querySelector('button[type="submit"]').disabled = false; // Re-enable the submit button
});

