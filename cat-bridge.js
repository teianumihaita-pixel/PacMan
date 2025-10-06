const bridgeCols = 100;
const bridgeRows = 5;
const colors = ["#ff6666", "#66ff66", "#6666ff", "#ffff66", "#ff66ff", "#66ffff", "#ffa500", "#00bfff"];
let catCol = 0;
let catRow = 2;
let targetColorIdx = null;
let timer = null;
let visibleColor = null;
let playing = true;


function showMessage(msg) {
    let msgDiv = document.getElementById('game-msg');
    if (!msgDiv) {
        msgDiv = document.createElement('div');
        msgDiv.id = 'game-msg';
        msgDiv.style.margin = '20px';
        msgDiv.style.fontSize = '1.5rem';
        document.body.insertBefore(msgDiv, document.getElementById('game-container'));
    }
    msgDiv.textContent = msg;
// removed stray closing brace



function drawBridge() {
    const bridge = document.getElementById('bridge');
    bridge.innerHTML = '';
    for (let row = 0; row < bridgeRows; row++) {
        for (let col = 0; col < bridgeCols; col++) {
            const color = colors[(col + row) % colors.length];
            if (visibleColor && color !== visibleColor) {
                // Nu afișa pătrățelul
                bridge.appendChild(document.createElement('div'));
                continue;
            }
            const square = document.createElement('div');
            square.classList.add('square');
            square.style.background = color;
            if (col === catCol && row === catRow) {
                square.classList.add('cat');
                square.textContent = '🐱';
            }
            bridge.appendChild(square);
        }
    }
// removed stray closing brace
function startGame() {
    catCol = 0;
    catRow = Math.floor(bridgeRows / 2);
    playing = true;
    targetColorIdx = Math.floor(Math.random() * colors.length);
    visibleColor = null;
    showMessage('START! Ajută pisica să ajungă la culoarea: ' + colors[targetColorIdx]);
    drawBridge();
    timer = setTimeout(() => {
        visibleColor = colors[targetColorIdx];
        drawBridge();
        // Verifică dacă pisica e pe culoarea corectă
        if (colors[(catCol + catRow) % colors.length] !== visibleColor) {
            lose();
        }
    }, 5000);
// removed stray closing brace


function lose() {
    showMessage('Pisica a căzut! Ai pierdut!');
    playing = false;
    document.removeEventListener('keydown', keyHandler);
}
}

function win() {
    showMessage('Bravo! Pisica a traversat podul!');
    playing = false;
    document.removeEventListener('keydown', keyHandler);
}
}








function moveCat(direction) {
    if (!playing) return;
    if (direction === 'right' && catCol < bridgeCols - 1) catCol++;
    if (direction === 'left' && catCol > 0) catCol--;
    if (direction === 'up' && catRow > 0) catRow--;
    if (direction === 'down' && catRow < bridgeRows - 1) catRow++;
    drawBridge();
    // Win if cat reaches the last column and is on the correct color
    if (visibleColor && catCol === bridgeCols - 1 && colors[(catCol + catRow) % colors.length] === visibleColor) {
        win();
    }
}
}



function keyHandler(e) {
    if (e.key === 'ArrowRight') moveCat('right');
    if (e.key === 'ArrowLeft') moveCat('left');
    if (e.key === 'ArrowUp') moveCat('up');
    if (e.key === 'ArrowDown') moveCat('down');
}

window.onload = function() {
    startGame();
    document.addEventListener('keydown', keyHandler);
};
