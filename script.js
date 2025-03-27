const board = document.getElementById('game-board');
const status = document.getElementById('status');

const symbols = ['🍎', '🍌', '🍇', '🍓', '🍎', '🍌', '🍇', '🍓'];
symbols.sort(() => Math.random() - 0.5); // Shuffle symbols

let flippedCards = [];
let matchedCards = [];

function createCard(symbol) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.innerHTML = '?';
    card.addEventListener('click', () => flipCard(card));
    return card;
}

function flipCard(card) {
    if (flippedCards.length === 2 || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    card.innerHTML = card.dataset.symbol;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards.push(card1, card2);
        status.textContent = 'Matched!';
        if (matchedCards.length === symbols.length) {
            status.textContent = 'You Win!';
        }
    } else {
        status.textContent = 'Try Again!';
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.innerHTML = '?';
            card2.innerHTML = '?';
        }, 1000);
    }
    flippedCards = [];
}

// Generate board
symbols.forEach(symbol => {
    board.appendChild(createCard(symbol));
});
