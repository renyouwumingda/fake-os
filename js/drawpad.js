// ===== 画板 =====
var drawpadState = { drawing: false, startTime: 0, color: "#fff", size: 3, eyeTimer: null, spamTimer: null, eyeShown: [false, false], warned: false };

function openDrawpad() {
  drawpadState = { drawing: false, startTime: Date.now(), color: "#fff", size: 3, eyeTimer: null, spamTimer: null, eyeShown: [false, false], warned: false };

  var colors = ["#fff","#f55","#ff0","#0f0","#0af","#f0f","#ff8800"];

  var colorHtml = "";
  colors.forEach(function(c) {
    colorHtml += '<div class="drawpad-color" data-color="' + c + '" style="width:22px;height:22px;border-radius:50%;background:' + c + ';cursor:pointer;border:2px solid transparent;box-sizing:border-box;"></div>';
  });

  var content = '<div style="display:flex;flex-direction:column;height:100%;">'
    + '<div style="padding:6px 10px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:8px;">'
    + '<div style="display:flex;gap:4px;">' + colorHtml + '</div>'
    + '<input type="color" id="drawpad-custom" value="#ffffff" style="width:22px;height:22px;border:none;padding:0;cursor:pointer;background:transparent;">'
    + '<span style="flex:1;"></span>'
    + '<input type="range" id="drawpad-size" min="1" max="20" value="3" style="width:80px;">'
    + '<button class="notepad-btn" onclick="drawpadClear()">🗑️ 清除</button>'
    + '</div>'
    + '<div style="flex:1;position:relative;overflow:hidden;background:#0d0d1a;">'
    + '<canvas id="drawpad-canvas" style="display:block;width:100%;height:100%;cursor:crosshair;"></canvas>'
    + '<div id="drawpad-eye1" class="drawpad-eye" style="bottom:20px;right:20px;">👁️</div>'
    + '<div id="drawpad-eye2" class="drawpad-eye" style="top:20px;left:20px;">👁️</div>'
    + '</div>'
    + '<div id="drawpad-msg" style="padding:4px 10px;font-size:11px;color:rgba(255,255,255,0.3);min-height:20px;"></div>'
    + '</div>';

  createWindow("drawpad", "🎨 画板", 500, 400, content);

  var canvas = document.getElementById("drawpad-canvas");
  var container = canvas.parentElement;
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "#0d0d1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var isDrawing = false;
  var lastX = 0, lastY = 0;

  canvas.addEventListener("mousedown", function(e) {
    isDrawing = true;
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    lastX = (e.clientX - rect.left) * scaleX;
    lastY = (e.clientY - rect.top) * scaleY;
  });

  canvas.addEventListener("mousemove", function(e) {
    if (!isDrawing) return;
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    var x = (e.clientX - rect.left) * scaleX;
    var y = (e.clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = drawpadState.color;
    ctx.lineWidth = drawpadState.size;
    ctx.lineCap = "round";
    ctx.stroke();

    lastX = x;
    lastY = y;
  });

  canvas.addEventListener("mouseup", function() { isDrawing = false; });
  canvas.addEventListener("mouseleave", function() { isDrawing = false; });

  // Color picker
  document.querySelectorAll(".drawpad-color").forEach(function(el) {
    el.addEventListener("click", function() {
      document.querySelectorAll(".drawpad-color").forEach(function(e) { e.style.borderColor = "transparent"; });
      el.style.borderColor = "#6c63ff";
      drawpadState.color = el.getAttribute("data-color");
    });
  });

  var customInput = document.getElementById("drawpad-custom");
  if (customInput) {
    customInput.addEventListener("input", function() {
      drawpadState.color = customInput.value;
    });
  }

  var sizeInput = document.getElementById("drawpad-size");
  if (sizeInput) {
    sizeInput.addEventListener("input", function() {
      drawpadState.size = parseInt(sizeInput.value) || 3;
    });
  }

  // Eye timers
  drawpadState.eyeTimer = setInterval(function() {
    var elapsed = (Date.now() - drawpadState.startTime) / 1000;
    if (elapsed >= 30 && !drawpadState.eyeShown[0]) {
      drawpadState.eyeShown[0] = true;
      var e1 = document.getElementById("drawpad-eye1");
      if (e1) e1.classList.add("visible");
    }
    if (elapsed >= 60 && !drawpadState.eyeShown[1]) {
      drawpadState.eyeShown[1] = true;
      var e2 = document.getElementById("drawpad-eye2");
      if (e2) e2.classList.add("visible");
    }
    if (elapsed >= 120 && !drawpadState.warned) {
      drawpadState.warned = true;
      var msgEl = document.getElementById("drawpad-msg");
      if (msgEl) { msgEl.textContent = "有人在看你画画。"; msgEl.style.color = "#f55"; }
    }
  }, 1000);

  // Random red stroke
  drawpadState.spamTimer = setInterval(function() {
    if (!canvas.getContext) return;
    var cx = canvas.getContext("2d");
    var rx = Math.random() * canvas.width;
    var ry = Math.random() * canvas.height;
    cx.beginPath();
    cx.arc(rx, ry, 2 + Math.random() * 4, 0, Math.PI * 2);
    cx.fillStyle = "rgba(255,0,0,0.6)";
    cx.fill();
  }, 30000 + Math.random() * 30000);
}

function drawpadClear() {
  var canvas = document.getElementById("drawpad-canvas");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0d0d1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  var msgEl = document.getElementById("drawpad-msg");
  if (msgEl) { msgEl.textContent = "画布已清除。眼睛还在。"; msgEl.style.color = "#f55"; }
}
