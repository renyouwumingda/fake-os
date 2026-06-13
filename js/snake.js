// ===== 贪吃蛇 =====
var snakeState = { gameCount: 0, animFrame: null };

function openSnake() {
  if (FakeOS.windows["snake"]) { focusWindow("snake"); return; }

  var content = '<div style="display:flex;flex-direction:column;height:100%;background:#0a0a0a;">'
    + '<div style="padding:8px 12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);">'
    + '<span style="color:#0f0;font-family:monospace;font-size:14px;">🐍 贪吃蛇</span>'
    + '<span id="snake-score" style="color:#fff;font-family:monospace;font-size:14px;">得分: 0</span>'
    + '</div>'
    + '<div style="flex:1;display:flex;align-items:center;justify-content:center;"><canvas id="snake-canvas" width="400" height="400"></canvas></div>'
    + '</div>';

  createWindow("snake", "🐍 贪吃蛇", 400, 450, content);

  var canvas = document.getElementById("snake-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var gridSize = 20;
  var cols = canvas.width / gridSize;
  var rows = canvas.height / gridSize;

  var snake, food, dir, nextDir, score, gameOver, speed, lastMove;

  function initGame() {
    snakeState.gameCount++;
    snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}];
    dir = {x:1,y:0};
    nextDir = {x:1,y:0};
    score = 0;
    gameOver = false;
    speed = 150;
    lastMove = 0;
    placeFood();
    updateScore();
  }

  function placeFood() {
    var empty = [];
    for (var x = 0; x < cols; x++) {
      for (var y = 0; y < rows; y++) {
        var occupied = false;
        for (var i = 0; i < snake.length; i++) {
          if (snake[i].x === x && snake[i].y === y) { occupied = true; break; }
        }
        if (!occupied) empty.push({x:x,y:y});
      }
    }
    if (empty.length === 0) { gameOver = true; return; }
    food = empty[Math.floor(Math.random() * empty.length)];
    food.isEye = score >= 20 && Math.random() < 0.3;
  }

  function updateScore() {
    var el = document.getElementById("snake-score");
    if (el) el.textContent = "得分: " + score;
  }

  function draw() {
    // Background
    var bg = "#0a0a0a";
    if (snakeState.gameCount >= 3) {
      var t = Math.min((snakeState.gameCount - 2) * 0.15, 0.6);
      bg = "rgb(" + Math.round(10 + t * 30) + ",10,10)";
    }
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 0.5;
    for (var i = 0; i <= cols; i++) {
      ctx.beginPath(); ctx.moveTo(i*gridSize,0); ctx.lineTo(i*gridSize,canvas.height); ctx.stroke();
    }
    for (var j = 0; j <= rows; j++) {
      ctx.beginPath(); ctx.moveTo(0,j*gridSize); ctx.lineTo(canvas.width,j*gridSize); ctx.stroke();
    }

    // Food
    if (food) {
      ctx.font = (gridSize - 2) + "px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var foodChar = food.isEye ? "👁️" : "🍎";
      ctx.fillText(foodChar, food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2);
    }

    // Snake
    for (var i = snake.length - 1; i >= 0; i--) {
      var seg = snake[i];
      var cx = seg.x * gridSize + gridSize/2;
      var cy = seg.y * gridSize + gridSize/2;

      if (i === 0) {
        // Head
        if (score >= 10) {
          ctx.font = (gridSize - 2) + "px serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("💀", cx, cy);
        } else {
          ctx.fillStyle = "#0f0";
          ctx.beginPath();
          ctx.arc(cx, cy, gridSize/2 - 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Body
        if (score >= 30 && i % 2 === 0) {
          ctx.font = (gridSize - 4) + "px serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("🦴", cx, cy);
        } else {
          ctx.fillStyle = "#0a0";
          ctx.fillRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2);
        }
      }
    }

    if (gameOver) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#f00";
      ctx.font = "24px monospace";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
    }
  }

  function update(timestamp) {
    if (!FakeOS.windows["snake"]) { cancelAnimationFrame(snakeState.animFrame); return; }
    snakeState.animFrame = requestAnimationFrame(update);
    if (gameOver) { draw(); return; }
    if (timestamp - lastMove < speed) { draw(); return; }
    lastMove = timestamp;

    dir = nextDir;
    var head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};

    // Wall collision
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
      gameOver = true;
      showAlert("你死了", "但在这个系统里，死亡不是终点。");
      setTimeout(function() { if (FakeOS.windows["snake"]) initGame(); }, 3000);
      draw(); return;
    }
    // Self collision
    for (var i = 0; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        gameOver = true;
        showAlert("你死了", "但在这个系统里，死亡不是终点。");
        setTimeout(function() { if (FakeOS.windows["snake"]) initGame(); }, 3000);
        draw(); return;
      }
    }

    snake.unshift(head);

    if (food && head.x === food.x && head.y === food.y) {
      score += 10;
      updateScore();
      if (score >= 20 && food.isEye) {
        canvas.style.filter = "brightness(2)";
        setTimeout(function() { canvas.style.filter = ""; }, 100);
      }
      placeFood();
      if (speed > 80) speed -= 3;
    } else {
      snake.pop();
    }
    draw();
  }

  document.addEventListener("keydown", function handler(e) {
    if (!FakeOS.windows["snake"]) {
      document.removeEventListener("keydown", handler);
      return;
    }
    if (e.key === "ArrowUp" && dir.y !== 1) nextDir = {x:0,y:-1};
    else if (e.key === "ArrowDown" && dir.y !== -1) nextDir = {x:0,y:1};
    else if (e.key === "ArrowLeft" && dir.x !== 1) nextDir = {x:-1,y:0};
    else if (e.key === "ArrowRight" && dir.x !== -1) nextDir = {x:1,y:0};
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.key) >= 0) e.preventDefault();
  });

  initGame();
  snakeState.animFrame = requestAnimationFrame(update);
}
