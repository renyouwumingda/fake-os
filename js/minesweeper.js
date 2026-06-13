// ===== 扫雷 =====
var minesweeperState = { mineHits: 0, gameCount: 0 };

function openMinesweeper() {
  if (FakeOS.windows["minesweeper"]) { focusWindow("minesweeper"); return; }

  var ROWS = 10, COLS = 10, MINES = 15;
  var board, revealed, flagged, gameOver, mineCount;

  function init() {
    minesweeperState.gameCount++;
    board = []; revealed = []; flagged = []; gameOver = false; mineCount = MINES;
    for (var r = 0; r < ROWS; r++) {
      board[r] = []; revealed[r] = []; flagged[r] = [];
      for (var c = 0; c < COLS; c++) { board[r][c] = 0; revealed[r][c] = false; flagged[r][c] = false; }
    }
    // Place mines
    var placed = 0;
    while (placed < MINES) {
      var r = Math.floor(Math.random() * ROWS);
      var c = Math.floor(Math.random() * COLS);
      if (board[r][c] !== -1) { board[r][c] = -1; placed++; }
    }
    // Calculate numbers
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        if (board[r][c] === -1) continue;
        var count = 0;
        for (var dr = -1; dr <= 1; dr++) {
          for (var dc = -1; dc <= 1; dc++) {
            var nr = r+dr, nc = c+dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === -1) count++;
          }
        }
        board[r][c] = count;
      }
    }
  }

  function render() {
    var bg = "#1e1e2e";
    if (minesweeperState.gameCount >= 3) {
      var t = Math.min((minesweeperState.gameCount - 2) * 0.15, 0.5);
      var g = Math.round(30 - t * 15);
      bg = "rgb(" + g + "," + g + "," + (g+5) + ")";
    }

    var html = '<div style="display:flex;flex-direction:column;height:100%;background:' + bg + ';">'
      + '<div style="padding:8px 12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);">'
      + '<span style="color:#fff;font-family:monospace;font-size:13px;">💣 剩余: ' + mineCount + '</span>'
      + '<button class="notepad-btn" onclick="openMinesweeper()" style="font-size:11px;">重新开始</button>'
      + '</div>'
      + '<div style="flex:1;display:flex;align-items:center;justify-content:center;padding:8px;">'
      + '<div id="ms-board" style="display:grid;grid-template-columns:repeat(' + COLS + ',32px);gap:1px;">';

    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var cellClass = "ms-cell";
        var cellStyle = "width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:13px;font-family:monospace;cursor:pointer;border-radius:3px;";
        var content = "";

        if (revealed[r][c]) {
          cellClass += " revealed";
          cellStyle += "background:rgba(255,255,255,0.05);color:#ccc;";
          if (board[r][c] === -1) {
            content = "💣";
            cellStyle += "background:rgba(255,0,0,0.2);";
          } else if (board[r][c] > 0) {
            content = board[r][c];
            var colors = ["","#4af","#0c0","#f44","#a0a","#a50","#0aa","#fff","#888"];
            cellStyle += "color:" + (colors[board[r][c]] || "#ccc") + ";";
          }
        } else if (flagged[r][c]) {
          cellStyle += "background:rgba(108,99,255,0.2);";
          content = "🚩";
        } else {
          cellStyle += "background:rgba(255,255,255,0.1);";
        }

        html += '<div class="' + cellClass + '" style="' + cellStyle + '" data-r="' + r + '" data-c="' + c + '">' + content + '</div>';
      }
    }

    html += '</div></div></div>';
    return html;
  }

  function reveal(r, c) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || revealed[r][c] || flagged[r][c]) return;
    revealed[r][c] = true;
    if (board[r][c] === 0) {
      for (var dr = -1; dr <= 1; dr++) {
        for (var dc = -1; dc <= 1; dc++) { reveal(r+dr, c+dc); }
      }
    }
  }

  function checkWin() {
    var unrevealed = 0;
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        if (!revealed[r][c]) unrevealed++;
      }
    }
    return unrevealed === MINES;
  }

  init();

  var content = render();
  createWindow("minesweeper", "💣 扫雷", 380, 420, content);

  var boardEl = document.getElementById("ms-board");
  if (!boardEl) return;

  boardEl.addEventListener("click", function(e) {
    var cell = e.target.closest(".ms-cell");
    if (!cell || gameOver) return;
    var r = parseInt(cell.dataset.r), c = parseInt(cell.dataset.c);
    if (flagged[r][c] || revealed[r][c]) return;

    if (board[r][c] === -1) {
      // Hit mine
      minesweeperState.mineHits++;
      revealed[r][c] = true;

      if (minesweeperState.mineHits === 1) {
        showAlert("游戏结束", "你踩到雷了。");
      } else if (minesweeperState.mineHits === 2) {
        showAlert("又踩到了？", "你在找什么？");
      } else if (minesweeperState.mineHits === 3) {
        showAlert("别再踩了。", "所有雷的位置已互换。");
        // Swap mines
        var mines = [];
        for (var rr = 0; rr < ROWS; rr++) {
          for (var cc = 0; cc < COLS; cc++) {
            if (board[rr][cc] === -1) mines.push({r:rr,c:cc});
            board[rr][cc] = 0;
            revealed[rr][cc] = false;
          }
        }
        // Place new mines in non-mine positions
        var nonMines = [];
        for (var rr = 0; rr < ROWS; rr++) {
          for (var cc = 0; cc < COLS; cc++) {
            var isOld = false;
            for (var m = 0; m < mines.length; m++) {
              if (mines[m].r === rr && mines[m].c === cc) { isOld = true; break; }
            }
            if (!isOld) nonMines.push({r:rr,c:cc});
          }
        }
        for (var m = 0; m < mines.length && m < nonMines.length; m++) {
          var pos = nonMines[Math.floor(Math.random() * nonMines.length)];
          board[pos.r][pos.c] = -1;
          nonMines = nonMines.filter(function(p) { return p.r !== pos.r || p.c !== pos.c; });
        }
        // Recalculate numbers
        for (var rr = 0; rr < ROWS; rr++) {
          for (var cc = 0; cc < COLS; cc++) {
            if (board[rr][cc] === -1) continue;
            var cnt = 0;
            for (var dr = -1; dr <= 1; dr++) {
              for (var dc = -1; dc <= 1; dc++) {
                var nr = rr+dr, nc = cc+dc;
                if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === -1) cnt++;
              }
            }
            board[rr][cc] = cnt;
          }
        }
        gameOver = false;
      } else if (minesweeperState.mineHits === 5) {
        // Flash face
        var overlay = document.getElementById("overlay");
        overlay.classList.remove("hidden");
        overlay.innerHTML = '<div style="font-size:120px;">😱</div>';
        setTimeout(function() { overlay.classList.add("hidden"); overlay.innerHTML = ""; }, 200);
      } else {
        showAlert("游戏结束", "你又踩到雷了。");
      }

      // Reveal all mines on game over
      if (minesweeperState.mineHits !== 3) {
        gameOver = true;
        for (var rr = 0; rr < ROWS; rr++) {
          for (var cc = 0; cc < COLS; cc++) {
            if (board[rr][cc] === -1) revealed[rr][cc] = true;
          }
        }
      }

      var win = FakeOS.windows["minesweeper"];
      if (win) {
        var container = win.el.querySelector(".window-content");
        if (container) container.innerHTML = render();
        var newBoard = document.getElementById("ms-board");
        if (newBoard) {
          newBoard.addEventListener("click", arguments.callee);
          newBoard.addEventListener("contextmenu", function(e2) { e2.preventDefault(); });
        }
      }
      return;
    }

    reveal(r, c);
    if (checkWin()) {
      showAlert("你赢了", "你标完了。但雷还在。它们只是在等。");
    }
    var win = FakeOS.windows["minesweeper"];
    if (win) {
      var container = win.el.querySelector(".window-content");
      if (container) container.innerHTML = render();
    }
  });

  boardEl.addEventListener("contextmenu", function(e) {
    e.preventDefault();
    var cell = e.target.closest(".ms-cell");
    if (!cell || gameOver) return;
    var r = parseInt(cell.dataset.r), c = parseInt(cell.dataset.c);
    if (revealed[r][c]) return;
    flagged[r][c] = !flagged[r][c];
    mineCount += flagged[r][c] ? -1 : 1;
    var win = FakeOS.windows["minesweeper"];
    if (win) {
      var container = win.el.querySelector(".window-content");
      if (container) container.innerHTML = render();
    }
  });
}
