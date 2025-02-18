// Game setup
const board = document.getElementById("game-board");
const cells = document.querySelectorAll(".cell");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

let currentPlayer = "X"; // Player X starts
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""]; // Keep track of board state

// Winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Function to handle cell clicks
function handleCellClick(event) {
    const cellIndex = event.target.getAttribute("data-index");
    
    // If cell is already occupied or game is over, return
    if (gameState[cellIndex] !== "" || !gameActive || currentPlayer === "O") return;

    // Update game state and cell content
    gameState[cellIndex] = currentPlayer;
    event.target.textContent = currentPlayer;  // Add "X" or "O" to the cell

    // Check for winner
    if (checkWinner()) {
        endGame(`${currentPlayer} Wins!`);
        return;
    }

    // Check for tie
    if (!gameState.includes("")) {
        endGame("It's a Tie!");
        return;
    }

    // Switch player and make the bot move
    currentPlayer = "O";
    message.textContent = `Bot's turn`;
    botMove();
}

// Function to check for a winner
function checkWinner() {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c];
    });
}

// Function for bot's move (O player) - Smart AI
function botMove() {
    const bestMove = findBestMove();
    gameState[bestMove] = "O";
    cells[bestMove].textContent = "O";

    // Check if the bot wins
    if (checkWinner()) {
        endGame("Better luck next time!");
        return;
    }

    // Check for tie
    if (!gameState.includes("")) {
        endGame("It's a Tie!");
        return;
    }

    // Switch player back to X
    currentPlayer = "X";
    message.textContent = `Player X's turn`;
}

// Function to find the best move for the bot
function findBestMove() {
    // First, check if there's a winning move for O
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (gameState[a] === "O" && gameState[b] === "O" && gameState[c] === "") return c;
        if (gameState[b] === "O" && gameState[c] === "O" && gameState[a] === "") return a;
        if (gameState[a] === "O" && gameState[c] === "O" && gameState[b] === "") return b;
    }

    // Then, check if there's a winning move for X (to block them)
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (gameState[a] === "X" && gameState[b] === "X" && gameState[c] === "") return c;
        if (gameState[b] === "X" && gameState[c] === "X" && gameState[a] === "") return a;
        if (gameState[a] === "X" && gameState[c] === "X" && gameState[b] === "") return b;
    }

    // Otherwise, pick a random spot
    const availableCells = gameState
        .map((value, index) => value === "" ? index : null)
        .filter(index => index !== null);

    return availableCells[Math.floor(Math.random() * availableCells.length)];
}

// End the game and show result with effect
function endGame(resultMessage) {
    gameActive = false;
    message.textContent = resultMessage;
    displayEndMessage(resultMessage);
    animateGameOver();
}

// Display the result in a more interactive way
function displayEndMessage(resultMessage) {
    const endMessageContainer = document.createElement('div');
    endMessageContainer.classList.add('end-message-container');
    endMessageContainer.innerHTML = `
        <div class="end-message">
            <h2>${resultMessage}</h2>
            <button id="replayBtn" class="replay-btn">Play Again</button>
        </div>
    `;
    document.body.appendChild(endMessageContainer);

    // Add event listener for the replay button
    const replayBtn = document.getElementById("replayBtn");
    replayBtn.addEventListener("click", restartGame);
}

// Animation effect for game over
function animateGameOver() {
    document.body.classList.add('game-over');
    setTimeout(() => {
        document.body.classList.remove('game-over');
    }, 500);
}

// Restart game function
function restartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    message.textContent = `Player X's turn`;

    cells.forEach(cell => {
        cell.textContent = ""; // Clear text content of each cell
    });

    // Remove end game message
    const endMessageContainer = document.querySelector('.end-message-container');
    if (endMessageContainer) endMessageContainer.remove();
}

// Add event listeners to the cells
cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

// Initialize game state
message.textContent = `Player X's turn`;
