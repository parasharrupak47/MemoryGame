document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("game-board");
  const statusDisplay = document.getElementById("status");
  const startButton = document.getElementById("start");
  const levels = {
    easy: { time: 30, grid: [2, 4], match: 2 },
    medium: { time: 60, grid: [3, 4], match: 3 },
    hard: { time: 150, grid: [4, 4], match: 4 },
  };
  let selectedLevel = null;
  let timeLeft;
  let timerInterval;
  let flipCount = 0;
  let gameStarted = false;

  const symbols = ["🍎", "🍌", "🍒", "🍇", "🍉", "🍋", "🍓", "🍍", "🥝", "🍈"];
  let cards = [];
  let flippedCards = [];
  let matchedCards = 0;

  function updateButtonColors(level) {
    document.querySelectorAll(".controls .btn").forEach((button) => {
      button.style.backgroundColor = "#007bff"; // Default color
    });
    document.getElementById(level).style.backgroundColor = "#28a745"; // Highlight selected level
  }

  function selectLevel(level) {
    selectedLevel = level;
    updateButtonColors(level);
  }

  function startGame() {
    if (!selectedLevel) {
      statusDisplay.textContent = "Please select a level first!";
      return;
    }

    gameStarted = true;
    timeLeft = levels[selectedLevel].time;
    statusDisplay.textContent = `Time Left: ${timeLeft}s`;
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    generateCards(selectedLevel);
    resetBoard();
  }

  function updateTimer() {
    timeLeft--;
    statusDisplay.textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      statusDisplay.textContent = "Time's up! You lost!";
      gameBoard.style.pointerEvents = "none";
    }
  }

  function generateCards(level) {
    let { grid, match } = levels[level];
    let symbolsSet = symbols.slice(0, (grid[0] * grid[1]) / match);
    cards = Array(match)
      .fill(symbolsSet)
      .flat()
      .sort(() => Math.random() - 0.5);
  }

  function resetBoard() {
    gameBoard.innerHTML = "";
    gameBoard.style.gridTemplateColumns = `repeat(${levels[selectedLevel].grid[1]}, 100px)`;
    matchedCards = 0;
    flippedCards = [];
    flipCount = 0;
    gameBoard.style.pointerEvents = "auto";

    cards.forEach((symbol, index) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.symbol = symbol;
      card.dataset.index = index;
      card.innerHTML = `${index}`;
      card.addEventListener("click", handleCardClick);
      gameBoard.appendChild(card);
    });
  }

  function handleCardClick(event) {
    const card = event.target;
    if (
      flippedCards.length < levels[selectedLevel].match &&
      !card.classList.contains("flipped")
    ) {
      card.classList.add("flipped");
      card.innerHTML = card.dataset.symbol;
      flippedCards.push(card);
    }

    if (flippedCards.length === levels[selectedLevel].match) {
      setTimeout(checkMatch, 800);
    }

    flipCount++;
    if (selectedLevel === "hard" && flipCount % 2 === 0) {
      swapPositions();
    }
  }

  function checkMatch() {
    if (
      flippedCards.every(
        (card) => card.dataset.symbol === flippedCards[0].dataset.symbol
      )
    ) {
      flippedCards.forEach((card) => card.classList.add("matched"));
      matchedCards += flippedCards.length;

      if (matchedCards === cards.length) {
        clearInterval(timerInterval); // Stop the timer when all matches are found
        statusDisplay.textContent = "Congratulations! You won!";
        gameBoard.style.pointerEvents = "none";
      }
    } else {
      flippedCards.forEach((card) => {
        card.classList.remove("flipped");
        card.innerHTML = `${card.dataset.index}`;
      });
    }
    flippedCards = [];
  }

  function swapPositions() {
    let availableCards = document.querySelectorAll(
      ".card:not(.flipped, .matched)"
    );
    let shuffledIndexes = [...availableCards]
      .map((card) => card.dataset.index)
      .sort(() => Math.random() - 0.5);

    availableCards.forEach((card, i) => {
      let newIndex = shuffledIndexes[i];
      let targetCard = [...availableCards].find(
        (c) => c.dataset.index == newIndex
      );

      [card.dataset.index, targetCard.dataset.index] = [
        targetCard.dataset.index,
        card.dataset.index,
      ];
      [card.dataset.symbol, targetCard.dataset.symbol] = [
        targetCard.dataset.symbol,
        card.dataset.symbol,
      ];

      card.innerHTML = `${card.dataset.index}`;
      targetCard.innerHTML = `${targetCard.dataset.index}`;
    });
  }

  function restartGame() {
    startGame(selectedLevel);
  }

  function exitGame() {
    clearInterval(timerInterval);
    gameBoard.innerHTML = "";
    statusDisplay.textContent = "Game exited. Choose a level to start again.";
  }

  function initializeGame() {
    gameStarted = true;
    statusDisplay.textContent = "Select a level to start!";
  }

  // Event listeners for level selection
  document
    .getElementById("easy")
    .addEventListener("click", () => selectLevel("easy"));
  document
    .getElementById("medium")
    .addEventListener("click", () => selectLevel("medium"));
  document
    .getElementById("hard")
    .addEventListener("click", () => selectLevel("hard"));

  // Event listener for Start button
  startButton.addEventListener("click", startGame);

  document.getElementById("restart").addEventListener("click", restartGame);
  document.getElementById("exit").addEventListener("click", exitGame);
  startButton.addEventListener("click", initializeGame);
});
