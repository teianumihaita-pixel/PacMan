const mazeRows = 12;
const mazeCols = 12;
const mazes = [
    // Level 1
    [
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,1,1,1,1,1,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,1,1,1,1,1,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,1,1,1,1,1,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,1,1,1,1,1,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,1,1,1,1,1,1,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    // Level 2
    [
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,1,1,1,0,0,0,1],
        [1,0,1,0,0,0,0,0,1,0,0,1],
        [1,0,1,1,1,1,1,0,1,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,0,1],
        [1,1,1,1,1,0,1,1,1,1,0,1],
        [1,0,0,0,1,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,1,1,0,1,0,1],
        [1,0,1,0,0,0,0,1,0,1,0,1],
        [1,0,1,1,1,1,0,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    // Level 3
    [
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,1,0,1],
        [1,0,1,0,0,0,1,0,0,1,0,1],
        [1,0,1,0,1,1,1,1,0,1,0,1],
        [1,0,1,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1]
    ]
];
let level = 0;
let maze = JSON.parse(JSON.stringify(mazes[level]));
let player = {row: 1, col: 1};
const playerEmojis = ['😃', '🐱', '🦊'];
let score = 0;
let ghosts = [
    {row: 10, col: 10, dir: 'left'}
];
let ghostInterval = null;

function drawMaze() {
    const mazeDiv = document.getElementById('maze');
    mazeDiv.innerHTML = '';
    for (let r = 0; r < mazeRows; r++) {
        for (let c = 0; c < mazeCols; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (maze[r][c] === 1) cell.classList.add('wall');
            if (maze[r][c] === 0) cell.classList.add('point');
            if (r === player.row && c === player.col) {
                cell.classList.add('player');
                cell.textContent = playerEmojis[level];
            }
            ghosts.forEach(g => {
                if (r === g.row && c === g.col) {
                    cell.classList.add('ghost');
                    cell.textContent = '👻';
                }
            });
            mazeDiv.appendChild(cell);
        }
    }
}

function movePlayer(dir) {
    let newRow = player.row;
    let newCol = player.col;
    if (dir === 'up') newRow--;
    if (dir === 'down') newRow++;
    if (dir === 'left') newCol--;
    if (dir === 'right') newCol++;
    if (maze[newRow][newCol] !== 1) {
        player.row = newRow;
        player.col = newCol;
        if (maze[newRow][newCol] === 0) {
            maze[newRow][newCol] = 2;
            score++;
            document.getElementById('score').textContent = 'Scor: ' + score + ' | Nivel: ' + (level+1);
            if (checkWin()) {
                showWin();
            }
        }
        drawMaze();
    }
}

function checkWin() {
    for (let r = 0; r < mazeRows; r++) {
        for (let c = 0; c < mazeCols; c++) {
            if (maze[r][c] === 0) return false;
        }
    }
    return true;
}

function showWin() {
    clearInterval(ghostInterval);
    document.removeEventListener('keydown', keyHandler);
    if (level < mazes.length - 1) {
        level++;
        maze = JSON.parse(JSON.stringify(mazes[level]));
        player = {row: 1, col: 1};
        ghosts = [{row: 10, col: 10, dir: 'left'}];
        score = 0;
        document.getElementById('score').textContent = 'Nivel: ' + (level+1);
        setTimeout(() => {
            drawMaze();
            ghostInterval = setInterval(() => {
                moveGhosts();
                checkLose();
            }, 1200);
            document.addEventListener('keydown', keyHandler);
        }, 1000);
    } else {
        document.getElementById('score').textContent = 'WIN! Ai terminat toate nivelurile!';
    }
}

function moveGhosts() {
    ghosts.forEach(g => {
        let dirs = ['up','down','left','right'];
        let validDirs = dirs.filter(dir => {
            let r = g.row, c = g.col;
            if (dir === 'up') r--;
            if (dir === 'down') r++;
            if (dir === 'left') c--;
            if (dir === 'right') c++;
            return maze[r][c] !== 1;
        });
        // Try to avoid staying in the same place
        let dir;
        if (validDirs.length > 1) {
            // Remove the direction that would keep the ghost in the same place
            dir = validDirs.filter(d => {
                let r = g.row, c = g.col;
                if (d === 'up') r--;
                if (d === 'down') r++;
                if (d === 'left') c--;
                if (d === 'right') c++;
                return !(r === g.row && c === g.col);
            });
            if (dir.length === 0) dir = validDirs;
            dir = dir[Math.floor(Math.random()*dir.length)];
        } else {
            dir = validDirs[0];
        }
        if (dir === 'up') g.row--;
        if (dir === 'down') g.row++;
        if (dir === 'left') g.col--;
        if (dir === 'right') g.col++;
    });
    drawMaze();
}

function checkLose() {
    ghosts.forEach(g => {
        if (g.row === player.row && g.col === player.col) {
            alert('Ai pierdut!');
            clearInterval(ghostInterval);
        }
    });
}


function keyHandler(e) {
    if (e.key === 'ArrowUp') movePlayer('up');
    if (e.key === 'ArrowDown') movePlayer('down');
    if (e.key === 'ArrowLeft') movePlayer('left');
    if (e.key === 'ArrowRight') movePlayer('right');
    checkLose();
}

document.addEventListener('keydown', keyHandler);

window.onload = function() {
    document.getElementById('score').textContent = 'Scor: 0 | Nivel: 1';
    drawMaze();
    ghostInterval = setInterval(() => {
        moveGhosts();
        checkLose();
    }, 1200);
};
