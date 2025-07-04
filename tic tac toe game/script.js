const gameContainer = document.getElementById('game');
const statusDiv = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;

const winCombos = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diags
];

function renderBoard() {
    gameContainer.innerHTML = '';
    board.forEach((cell, idx) => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'cell' + (cell ? ' ' + cell.toLowerCase() : '');
        cellDiv.dataset.index = idx;
        cellDiv.tabIndex = 0;
        cellDiv.setAttribute('aria-label', `Cell ${idx+1}`);
        cellDiv.innerHTML = cell ? cell : '';
        cellDiv.addEventListener('click', handleCellClick);
        cellDiv.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && gameActive) {
                handleCellClick({target: cellDiv});
            }
        });
        gameContainer.appendChild(cellDiv);
    });
}

function handleCellClick(e) {
    const idx = +e.target.dataset.index;
    if (!gameActive || board[idx]) return;
    board[idx] = currentPlayer;
    renderBoard();
    const winInfo = checkWin();
    if (winInfo) {
        winInfo.combo.forEach(i => {
            gameContainer.children[i].classList.add('win');
        });
        statusDiv.textContent = `Player ${currentPlayer} wins! 🎉`;
        gameActive = false;
        return;
    }
    if (board.every(cell => cell)) {
        statusDiv.textContent = "It's a draw!";
        gameActive = false;
        return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDiv.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin() {
    for (let combo of winCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return {winner: board[a], combo};
        }
    }
    return null;
}

function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    statusDiv.textContent = `Player ${currentPlayer}'s turn`;
    renderBoard();
}

resetBtn.addEventListener('click', resetGame);

// Initial render
resetGame(); 