const ROWS = 6, COLS = 7;
let grid, currentPlayer, gameOver, scores = { player: 0, ai: 0 };

function init() {
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    currentPlayer = 'player';
    gameOver = false;
    render();
    setStatus('Your turn');
}

function render(winCells) {
    const board = document.getElementById('board');
    board.innerHTML = '';
    const winSet = new Set((winCells || []).map(([r, c]) => r + ',' + c));

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
        const cell = document.createElement('div');
        const key = r + ',' + c;
        let cls = 'cell';
        if (grid[r][c]) cls += ' ' + grid[r][c];
        if (winCells) {
            if (winSet.has(key)) cls += ' win';
            else if (grid[r][c]) cls += ' dim';
        }
        cell.className = cls;
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.addEventListener('click', () => handleClick(c));
        cell.addEventListener('mouseenter', () => hoverCol(c, true));
        cell.addEventListener('mouseleave', () => hoverCol(c, false));
        board.appendChild(cell);
        }
    }
}

function hoverCol(col, on) {
    if (gameOver || currentPlayer !== 'player') return;
    document.querySelectorAll('.cell').forEach(c => {
        if (parseInt(c.dataset.col) === col && !c.classList.contains('player') && !c.classList.contains('ai')) {
        on ? c.classList.add('drop-preview') : c.classList.remove('drop-preview');
        }
    });
}

function handleClick(col) {
    if (gameOver || currentPlayer !== 'player') return;
    const row = drop(col, 'player');
    if (row === -1) return;
    render();
    const win = getWinCells(row, col, 'player');
    if (win) { endGame('player', win); return; }
    if (isDraw()) { endGame(null, null); return; }
    currentPlayer = 'ai';
    setStatus('AI is thinking…');
    setTimeout(() => aiMove(), 400);
}

function drop(col, who) {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (!grid[r][col]) { grid[r][col] = who; return r; }
    }
    return -1;
}

function aiMove() {
    const col = pickAiCol();
    const row = drop(col, 'ai');
    render();
    const win = getWinCells(row, col, 'ai');
    if (win) { endGame('ai', win); return; }
    if (isDraw()) { endGame(null, null); return; }
    currentPlayer = 'player';
    setStatus('Your turn');
}

function pickAiCol() {
    for (let c = 0; c < COLS; c++) { if (wouldWin(c, 'ai')) return c; }
    for (let c = 0; c < COLS; c++) { if (wouldWin(c, 'player')) return c; }
    const pref = [3, 2, 4, 1, 5, 0, 6];
    for (const c of pref) { if (dropAvail(c)) return c; }
    return 0;
}

function wouldWin(col, who) {
    const r = getRow(col);
    if (r === -1) return false;
    grid[r][col] = who;
    const w = getWinCells(r, col, who);
    grid[r][col] = null;
    return !!w;
}

function dropAvail(col) { return grid[0][col] === null; }
function getRow(col) { for (let r = ROWS - 1; r >= 0; r--) { if (!grid[r][col]) return r; } return -1; }

function getWinCells(row, col, who) {
    const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (const [dr, dc] of dirs) {
        let cells = [[row, col]];
        for (let i = 1; i < 4; i++) { const r = row + dr * i, c = col + dc * i; if (r >= 0 && r < ROWS && c >= 0 && c < COLS && grid[r][c] === who) cells.push([r, c]); else break; }
        for (let i = 1; i < 4; i++) { const r = row - dr * i, c = col - dc * i; if (r >= 0 && r < ROWS && c >= 0 && c < COLS && grid[r][c] === who) cells.push([r, c]); else break; }
        if (cells.length >= 4) return cells;
    }
    return null;
}

function isDraw() { return grid[0].every(c => c !== null); }

function endGame(winner, winCells) {
    gameOver = true;
    if (winCells) render(winCells);
    if (winner === 'player') {
        scores.player++;
        document.getElementById('score-player').textContent = scores.player;
        setStatus('You win!');
    } else if (winner === 'ai') {
        scores.ai++;
        document.getElementById('score-ai').textContent = scores.ai;
        setStatus('AI wins!');
    } else {
        setStatus("It's a draw!");
    }
    setTimeout(() => init(), 2500);
}

function setStatus(msg) { document.getElementById('status').textContent = msg; }

document.getElementById('reset-btn').addEventListener('click', init);
init();