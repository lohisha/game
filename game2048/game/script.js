const gridContainer = document.querySelector('.grid');
const gameOverDisplay = document.getElementById('gameover');
const gameAgainDisplay = document.getElementById("again");
let tiles = Array.from(gridContainer.querySelectorAll('.tile'));
let score = 0;
let best = localStorage.getItem('bestScore') ?parseInt(localStorage.getItem('bestScore')) : 0;

document.getElementById('best').textContent = best;
document.addEventListener('keydown', handleKeyPress);
document.getElementById('newGameButton').addEventListener('click', startNewGame);

function handleKeyPress(event) {
  if (event.key.includes('Arrow')) {
    event.preventDefault();
    move(event.key.replace('Arrow', '').toLowerCase());
    updateGrid();
    checkGameOver();
  }
}

function move(direction) {
  switch (direction) {
    case 'up':
      moveUp();
      break;
    case 'down':
      moveDown();
      break;
    case 'left':
      moveLeft();
      break;
    case 'right':
      moveRight();
      break;
  }
}

function moveUp() {
  for (let col = 0; col < 4; col++) {
    let column = tiles.filter((tile, index) => index % 4 === col);
    column = mergeTiles(column);
    for (let i = 0; i < column.length; i++) {
      tiles[i * 4 + col].textContent = column[i] || '';
    }
  }
}

function moveDown() {
  for (let col = 0; col < 4; col++) {
    let column = tiles.filter((tile, index) => index % 4 === col);
    column = mergeTiles(column.reverse());
    for (let i = 0; i < column.length; i++) {
      tiles[(3 - i) * 4 + col].textContent = column[i] || '';
    }
  }
}

function moveLeft() {
  for (let row = 0; row < 4; row++) {
    let rowTiles = tiles.slice(row * 4, (row + 1) * 4);
    rowTiles = mergeTiles(rowTiles);
    for (let i = 0; i < rowTiles.length; i++) {
      tiles[row * 4 + i].textContent = rowTiles[i] || '';
    }
  }
}

function moveRight() {
  for (let row = 0; row < 4; row++) {
    let rowTiles = tiles.slice(row * 4, (row + 1) * 4);
    rowTiles = mergeTiles(rowTiles.reverse());
    for (let i = 0; i < rowTiles.length; i++) {
      tiles[row * 4 + (3 - i)].textContent = rowTiles[i] || '';
    }
  }
}

function mergeTiles(tiles) {
  let merged = [];
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].textContent !== '') {
      if (merged.length > 0 && merged[merged.length - 1] === tiles[i].textContent) {
        merged[merged.length - 1] = (parseInt(merged[merged.length - 1]) * 2).toString();
        score += parseInt(merged[merged.length - 1]);
      } else {
        merged.push(tiles[i].textContent);
      }
    }
  }
  while (merged.length < 4) {
    merged.push('');
  }
  return merged;
}

function updateGrid() {
  document.getElementById('score').textContent = score;
  if (score > best) {
    best = score;
    localStorage.setItem('bestScore', best);
    document.getElementById('best').textContent = best;
  }
  tiles.forEach(updateTileClass);
  generateTile();
}

function startNewGame() {
  score = 0;
  document.getElementById('score').textContent = score;
  gameOverDisplay.hidden = true; 
  tiles.forEach(tile => {
    tile.textContent = '';
    updateTileClass(tile);
  });
  generateTile();
  generateTile();
}

function generateTile() {
  const emptyTiles = tiles.filter(tile => tile.textContent === '');
  if (emptyTiles.length === 0) return;
  const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  randomTile.textContent = Math.random() < 0.9 ? '2' : '4';
  updateTileClass(randomTile);
}

function updateTileClass(tile) {
  tile.className = 'tile'; 
  if (tile.textContent) {
    tile.classList.add('tile-' + tile.textContent);
  }
}

function checkGameOver() {
  const emptyTiles = tiles.filter(tile => tile.textContent === '');
  if (emptyTiles.length > 0) return; 

  
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    const value = tile.textContent;
    if (i % 4 < 3 && value === tiles[i + 1].textContent) return; 
    if (i < 12 && value === tiles[i + 4].textContent) return;
  }

  gameOverDisplay.hidden = false; 
  gameAgainDisplay.hidden = false; 
}

startNewGame();
