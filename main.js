const form = document.getElementById('start-form');
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

let interval;
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (interval) clearInterval(interval);

  const size = +form.elements.size.value;
  const ratio = +form.elements.ratio.value;
  const board = initBoard(size, ratio);
  const cellSize = canvas.width / size;

  drawBoard(board, cellSize);

  interval = setInterval(() => nextGeneration(board, cellSize), 100);
});

function drawBoard(board, cellSize) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      drawCell(board, i, j, cellSize);
    }
  }
}

function drawCell(board, row, col, size) {
  if (board[row][col]) {
    ctx.fillStyle = 'black';
  } else {
    ctx.fillStyle = 'white';
  }
  ctx.fillRect(row * size, col * size, size, size);
}

function initBoard(size, ratio, populate = true) {
  const board = new Array(size);

  for (let i = 0; i < board.length; i++) {
    board[i] = new Array(size);

    if (populate) {
      for (let j = 0; j < board[i].length; j++) {
        if (isInMiddle(i, size, ratio) && isInMiddle(j, size, ratio)) {
          board[i][j] = Math.random() > 0.75;
        }
      }
    } else {
      board[i].fill(false);
    }
  }

  return board;
}

function isInMiddle(index, size, ratio) {
  const mid = size / 2;
  const offset = (ratio / 2) * size;
  const start = mid - offset;
  const end = mid + offset;
  return index > start && index < end;
}

function nextGeneration(board, cellSize) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      const neighbors = countNeighbors(board, i, j);

      if (neighbors === 3 && !board[i][j]) {
        board[i][j] = true;
        drawCell(board, i, j, cellSize);
      } else if (board[i][j] && (neighbors < 2 || neighbors > 3)) {
        board[i][j] = false;
        drawCell(board, i, j, cellSize);
      }
    }
  }
}

function countNeighbors(board, row, col) {
  let neighbors = 0;

  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      const isCurrent = i === row && j === col;
      const isOutOfBounds =
        i < 0 || i >= board.length || j < 0 || j >= board[i].length;
      if (isCurrent || isOutOfBounds) continue;
      if (board[i][j]) neighbors++;
    }
  }

  return neighbors;
}
