// ===== 计算器 =====
var calcState = { correctCount: 0, result: 0, buffer: '0', operator: null, newNumber: true };

function openCalculator() {
  if (FakeOS.windows["calculator"]) { focusWindow("calculator"); return; }
  calcState = { correctCount: 0, result: 0, buffer: '0', operator: null, newNumber: true };

  createWindow("calculator", "🧮 计算器", 280, 340,
    '<div style="padding:12px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:8px;">' +
      '<div id="calc-display" style="background:#0d0d1a;padding:12px 16px;text-align:right;font-family:monospace;font-size:28px;color:#fff;border-radius:8px;min-height:40px;">0</div>' +
      '<div id="calc-subdisplay" style="text-align:right;font-family:monospace;font-size:12px;color:rgba(255,255,255,0.3);min-height:16px;"> </div>' +
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;flex:1;">' +
        calcBtn("C","calcClear()") + calcBtn("±","calcNegate()") + calcBtn("%","calcPercent()") + calcBtn("÷","calcOp('/')") +
        calcBtn("7","calcDigit(7)") + calcBtn("8","calcDigit(8)") + calcBtn("9","calcDigit(9)") + calcBtn("×","calcOp('*')") +
        calcBtn("4","calcDigit(4)") + calcBtn("5","calcDigit(5)") + calcBtn("6","calcDigit(6)") + calcBtn("−","calcOp('-')") +
        calcBtn("1","calcDigit(1)") + calcBtn("2","calcDigit(2)") + calcBtn("3","calcDigit(3)") + calcBtn("+","calcOp('+')") +
        calcBtn("0","calcDigit(0)","2") + calcBtn(".","calcDot()") + calcBtn("=","calcEquals()") +
      '</div>' +
    '</div>'
  );
}

function calcBtn(text, action, colSpan) {
  var style = "background:rgba(255,255,255,0.06);border:none;border-radius:8px;color:#fff;font-size:18px;cursor:pointer;";
  if (text === "=") style += "background:#6c63ff;";
  if ("÷×−+".indexOf(text) >= 0) style += "color:#6c63ff;";
  if (text === "C") style += "color:#f55;";
  var colspan = colSpan ? "grid-column:span " + colSpan + ";" : "";
  return '<button style="' + style + colspan + '" onmousedown="' + action + '">' + text + '</button>';
}

function calcDigit(n) {
  if (calcState.newNumber) { calcState.buffer = String(n); calcState.newNumber = false; }
  else { calcState.buffer = (calcState.buffer === "0" ? "" : calcState.buffer) + n; }
  updateCalcDisplay();
}

function calcDot() {
  if (calcState.newNumber) { calcState.buffer = "0."; calcState.newNumber = false; }
  else if (calcState.buffer.indexOf(".") === -1) calcState.buffer += ".";
  updateCalcDisplay();
}

function calcOp(op) {
  if (calcState.operator && !calcState.newNumber) calcEquals();
  calcState.result = parseFloat(calcState.buffer) || 0;
  calcState.operator = op;
  calcState.newNumber = true;
  updateCalcSub(op);
}

function calcEquals() {
  if (!calcState.operator) return;
  var a = calcState.result;
  var b = parseFloat(calcState.buffer) || 0;
  calcState.correctCount++;

  // Easter eggs
  if (a === 1 && b === 1 && calcState.correctCount === 3) {
    calcState.buffer = "3"; calcState.operator = null; calcState.newNumber = true;
    updateCalcDisplay(); updateCalcSub(""); return;
  }
  if (a === 6 && calcState.operator === "*" && b === 9) {
    calcState.buffer = "42"; calcState.operator = null; calcState.newNumber = true;
    updateCalcDisplay(); updateCalcSub(""); return;
  }

  var correct = calcState.correctCount <= 10;
  var result;
  switch (calcState.operator) {
    case "+": result = correct ? a + b : a + b + 1; break;
    case "-": result = correct ? a - b : a - b - 1; break;
    case "*": result = correct ? a * b : a * b + 5; break;
    case "/": result = b === 0 ? "err" : (correct ? a / b : a / b + 0.1); break;
    default: result = a + b;
  }

  calcState.buffer = typeof result === "number" ? String(Math.round(result * 10000) / 10000) : "不能除以零";
  calcState.operator = null;
  calcState.newNumber = true;
  updateCalcDisplay();
  updateCalcSub("");
}

function calcClear() {
  calcState.buffer = "0"; calcState.result = 0; calcState.operator = null; calcState.newNumber = true;
  calcState.correctCount = 0;
  updateCalcDisplay();
  updateCalcSub("");

  if (!window._calcClearCount) window._calcClearCount = 0;
  window._calcClearCount++;
  if (window._calcClearCount >= 10) {
    window._calcClearCount = 0;
    var d = document.getElementById("calc-display");
    if (d) { d.textContent = "你清不掉我的。"; setTimeout(function() { d.textContent = "0"; }, 1500); }
  }
}

function calcNegate() {
  if (calcState.buffer !== "0") {
    calcState.buffer = calcState.buffer.indexOf("-") === 0 ? calcState.buffer.substring(1) : "-" + calcState.buffer;
    updateCalcDisplay();
  }
}

function calcPercent() {
  calcState.buffer = String(parseFloat(calcState.buffer) / 100);
  updateCalcDisplay();
}

function updateCalcDisplay() {
  var d = document.getElementById("calc-display");
  if (d) d.textContent = calcState.buffer || "0";
}

function updateCalcSub(op) {
  var d = document.getElementById("calc-subdisplay");
  if (d) d.innerHTML = op ? escapeHtml(op) : " ";
}
