// ===== 2048 =====
var game2048State = { gameCount: 0, won2048: false, won4096: false };

function openGame2048() {
  if (FakeOS.windows["game2048"]) { focusWindow("game2048"); return; }

  var SIZE = 4;
  var grid, score, gameOver;

  function init() {
    game2048State.gameCount++;
    grid = []; score = 0; gameOver = false;
    for (var r = 0; r < SIZE; r++) { grid[r] = []; for (var c = 0; c < SIZE; c++) grid[r][c] = 0; }
    addRandom(); addRandom();
  }

  function addRandom() {
    var empty = [];
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        if (grid[r][c] === 0) empty.push({r:r,c:c});
      }
    }
    if (empty.length === 0) return;
    var cell = empty[Math.floor(Math.random() * empty.length)];
    grid[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;

    // Creepy: at 1024+, 10% chance of placing 👁️ instead of number
    if (score >= 1024 && !game2048State.won4096 && Math.random() < 0.1) {
      grid[cell.r][cell.c] = "👁️";
    }
  }

  function getMaxValue() {
    var max = 0;
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        if (typeof grid[r][c] === "number" && grid[r][c] > max) max = grid[r][c];
      }
    }
    return max;
  }

  function slide(row) {
    var arr = row.filter(function(v) { return v !== 0 && v !== "👁️"; });
    var eyes = row.filter(function(v) { return v === "👁️"; });
    var merged = false;
    for (var i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i+1]) {
        arr[i] *= 2;
        score += arr[i];
        arr.splice(i+1, 1);
        merged = true;
      }
    }
    while (arr.length < SIZE) arr.push(0);
    // Put eyes back at end
    for (var i = 0; i < eyes.length && arr.length < SIZE; i++) arr.push(eyes[i]);
    while (arr.length < SIZE) arr.push(0);
    return arr;
  }

  function move(dir) {
    var moved = false;
    var oldGrid = JSON.stringify(grid);

    if (dir === "left") {
      for (var r = 0; r < SIZE; r++) grid[r] = slide(grid[r]);
    } else if (dir === "right") {
      for (var r = 0; r < SIZE; r++) grid[r] = slide(grid[r].reverse()).reverse();
    } else if (dir === "up") {
      for (var c = 0; c < SIZE; c++) {
        var col = [];
        for (var r = 0; r < SIZE; r++) col.push(grid[r][c]);
        col = slide(col);
        for (var r = 0; r < SIZE; r++) grid[r][c] = col[r];
      }
    } else if (dir === "down") {
      for (var c = 0; c < SIZE; c++) {
        var col = [];
        for (var r = 0; r < SIZE; r++) col.push(grid[r][c]);
        col = slide(col.reverse()).reverse();
        for (var r = 0; r < SIZE; r++) grid[r][c] = col[r];
      }
    }

    if (JSON.stringify(grid) !== oldGrid) {
      moved = true;
      addRandom();
    }

    // Check win conditions
    var max = getMaxValue();
    if (max >= 2048 && !game2048State.won2048) {
      game2048State.won2048 = true;
      showAlert("你赢了", "但这不是终点。继续。");
    }
    if (max >= 4096 && !game2048State.won4096) {
      game2048State.won4096 = true;
      showAlert("数字已经失去了意义。", "所有数字现在都是 ?");
    }

    // Check game over
    if (moved && isGameOver()) {
      gameOver = true;
      showAlert("游戏结束", "没有可移动的方向了。");
    }

    render();
  }

  function isGameOver() {
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        if (grid[r][c] === 0) return false;
        if (grid[r][c] === "👁️") return false;
        if (c < SIZE-1 && grid[r][c] === grid[r][c+1]) return false;
        if (r < SIZE-1 && grid[r][c] === grid[r+1][c]) return false;
      }
    }
    return true;
  }

  function getCellColor(val) {
    if (val === "👁️") return {bg:"rgba(255,0,0,0.3)",color:"#f00"};
    if (typeof val !== "number") return {bg:"#333",color:"#fff"};
    var max = getMaxValue();
    if (max >= 128) {
      // Creepy: colors shift to red
      var t = Math.min((max - 128) / 1024, 1);
      var r = Math.round(108 + t * 147);
      var g = Math.round(99 - t * 99);
      var b = Math.round(255 - t * 255);
      return {bg:"rgb("+r+","+g+","+b+")", color:"#fff"};
    }
    var colors = {0:{bg:"transparent",color:"transparent"},2:{bg:"#eee4da",color:"#776e65"},4:{bg:"#ede0c8",color:"#776e65"},8:{bg:"#f2b179",color:"#f9f6f2"},16:{bg:"#f59563",color:"#f9f6f2"},32:{bg:"#f67c5f",color:"#f9f6f2"},64:{bg:"#f65e3b",color:"#f9f6f2"},128:{bg:"#edcf72",color:"#f9f6f2"},256:{bg:"#edcc61",color:"#f9f6f2"},512:{bg:"#edc850",color:"#f9f6f2"},1024:{bg:"#edc53f",color:"#f9f6f2"},2048:{bg:"#edc22e",color:"#f9f6f2"}};
    return colors[val] || {bg:"#3c3a32",color:"#f9f6f2"};
  }

  function render() {
    var gridBg = "#bbada0";
    if (game2048State.gameCount >= 3) {
      var t = Math.min((game2048State.gameCount - 2) * 0.15, 0.5);
      gridBg = "rgb(" + Math.round(187-t*87) + "," + Math.round(173-t*100) + "," + Math.round(160-t*100) + ")";
    }

    var maxVal = getMaxValue();
    var shakeClass = (maxVal >= 512 && maxVal < 4096) ? "game-shake" : "";
    var displayGrid = game2048State.won4096;

    var html = '<div style="display:flex;flex-direction:column;height:100%;background:#faf8ef;">'
      + '<div style="padding:8px 12px;display:flex;justify-content:space-between;align-items:center;">'
      + '<span style="color:#776e65;font-size:14px;font-weight:bold;">🔢 2048</span>'
      + '<span style="color:#776e65;font-size:14px;">得分: ' + score + '</span>'
      + '</div>'
      + '<div style="flex:1;display:flex;align-items:center;justify-content:center;padding:8px;">'
      + '<div class="' + shakeClass + '" style="display:grid;grid-template-columns:repeat(4,70px);gap:8px;padding:8px;background:' + gridBg + ';border-radius:8px;">';

    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        var val = grid[r][c];
        var showVal = displayGrid && typeof val === "number" && val > 0 ? "?" : val;
        var clr = getCellColor(val);
        var fontSize = typeof showVal === "string" && showVal.length > 2 ? "16px" : "22px";
        html += '<div style="width:70px;height:70px;display:flex;align-items:center;justify-content:center;background:' + clr.bg + ';color:' + clr.color + ';border-radius:6px;font-size:' + fontSize + ';font-weight:bold;font-family:sans-serif;">' + (showVal || '') + '</div>';
      }
    }

    html += '</div></div></div>';
    return html;
  }

  init();

  var content = render();
  createWindow("game2048", "🔢 2048", 380, 420, content);

  document.addEventListener("keydown", function handler(e) {
    if (!FakeOS.windows["game2048"]) {
      document.removeEventListener("keydown", handler);
      return;
    }
    var keyMap = {"ArrowUp":"up","ArrowDown":"down","ArrowLeft":"left","ArrowRight":"right"};
    if (keyMap[e.key]) {
      e.preventDefault();
      if (!gameOver) move(keyMap[e.key]);
    }
  });
}
