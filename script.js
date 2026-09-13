(() => {
  const boardEl = document.getElementById('board');
  const movesEl = document.getElementById('moves');
  const timeEl = document.getElementById('time');
  const bestEl = document.getElementById('best');
  const winEl = document.getElementById('win');
  const winMetaEl = document.getElementById('winMeta');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const sizeBtns = document.querySelectorAll('[data-size]');

  let size = 4;
  let tiles = [];        // tiles[i] = value at cell i (0 = empty), i = row*size+col
  let emptyIndex = 0;
  let moves = 0;
  let seconds = 0;
  let timerId = null;
  let timerStarted = false;
  let won = false;

  function storageKey() {
    return `slide-puzzle-best-${size}`;
  }

  function loadBest() {
    const raw = localStorage.getItem(storageKey());
    bestEl.textContent = raw ? raw : '—';
  }

  function saveBestIfBetter(moveCount) {
    const raw = localStorage.getItem(storageKey());
    const prev = raw ? parseInt(raw, 10) : null;
    if (prev === null || moveCount < prev) {
      localStorage.setItem(storageKey(), String(moveCount));
      loadBest();
    }
  }

  function solvedTiles() {
    const arr = [];
    for (let i = 1; i < size * size; i++) arr.push(i);
    arr.push(0);
    return arr;
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  }

  function startTimer() {
    if (timerStarted) return;
    timerStarted = true;
    timerId = setInterval(() => {
      seconds++;
      timeEl.textContent = formatTime(seconds);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
  }

  function resetStats() {
    moves = 0;
    seconds = 0;
    timerStarted = false;
    won = false;
    stopTimer();
    movesEl.textContent = '0';
    timeEl.textContent = '0:00';
    winEl.hidden = true;
  }

  function neighbors(index) {
    const row = Math.floor(index / size);
    const col = index % size;
    const list = [];
    if (row > 0) list.push(index - size);
    if (row < size - 1) list.push(index + size);
    if (col > 0) list.push(index - 1);
    if (col < size - 1) list.push(index + 1);
    return list;
  }

  function shuffle() {
    tiles = solvedTiles();
    emptyIndex = tiles.length - 1;
    // Perform a long sequence of random valid moves from the solved
    // state so the puzzle is always solvable.
    let lastIndex = -1;
    const totalMoves = size * size * 60;
    for (let i = 0; i < totalMoves; i++) {
      const opts = neighbors(emptyIndex).filter((n) => n !== lastIndex);
      const next = opts[Math.floor(Math.random() * opts.length)];
      tiles[emptyIndex] = tiles[next];
      tiles[next] = 0;
      lastIndex = emptyIndex;
      emptyIndex = next;
    }
    resetStats();
    render();
  }

  function tileSizePercent() {
    return 100 / size;
  }

  function render() {
    boardEl.innerHTML = '';
    const pct = tileSizePercent();
    const gap = 6; // px gap between tiles, accounted via inset math
    tiles.forEach((value, index) => {
      if (value === 0) return;
      const row = Math.floor(index / size);
      const col = index % size;
      const el = document.createElement('div');
      el.className = 'tile';
      if (value === index + 1) el.classList.add('correct');
      el.textContent = value;
      el.style.width = `calc(${pct}% - ${gap}px)`;
      el.style.height = `calc(${pct}% - ${gap}px)`;
      el.style.left = `calc(${pct * col}% + ${gap / 2}px)`;
      el.style.top = `calc(${pct * row}% + ${gap / 2}px)`;
      el.style.fontSize = size >= 5 ? '1.1rem' : '1.4rem';
      el.addEventListener('click', () => attemptMove(index));
      boardEl.appendChild(el);
    });
  }

  function attemptMove(index) {
    if (won) return;
    if (!neighbors(emptyIndex).includes(index)) return;
    tiles[emptyIndex] = tiles[index];
    tiles[index] = 0;
    emptyIndex = index;
    moves++;
    movesEl.textContent = String(moves);
    startTimer();
    render();
    checkWin();
  }

  function checkWin() {
    const solved = solvedTiles();
    for (let i = 0; i < solved.length; i++) {
      if (tiles[i] !== solved[i]) return;
    }
    won = true;
    stopTimer();
    saveBestIfBetter(moves);
    winMetaEl.textContent = `${moves} moves · ${formatTime(seconds)}`;
    document.querySelectorAll('.tile').forEach((t) => t.classList.add('solved-pop'));
    setTimeout(() => { winEl.hidden = false; }, 250);
  }

  function moveEmptyBy(dRow, dCol) {
    // Pressing an arrow key slides the tile in that direction into
    // the empty space, i.e. the empty space moves the opposite way.
    const row = Math.floor(emptyIndex / size);
    const col = emptyIndex % size;
    const targetRow = row + dRow;
    const targetCol = col + dCol;
    if (targetRow < 0 || targetRow >= size || targetCol < 0 || targetCol >= size) return;
    attemptMove(targetRow * size + targetCol);
  }

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp': moveEmptyBy(1, 0); break;
      case 'ArrowDown': moveEmptyBy(-1, 0); break;
      case 'ArrowLeft': moveEmptyBy(0, 1); break;
      case 'ArrowRight': moveEmptyBy(0, -1); break;
      default: return;
    }
    e.preventDefault();
  });

  shuffleBtn.addEventListener('click', shuffle);

  sizeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      size = parseInt(btn.dataset.size, 10);
      loadBest();
      shuffle();
    });
  });

  loadBest();
  shuffle();
})();
