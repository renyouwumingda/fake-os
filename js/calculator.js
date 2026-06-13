// ===== 计算器 =====
var calcCorrectCount = 0;
var calcResult = 0;
var calcBuffer = "";
var calcOperator = null;
var calcNewNumber = true;

function openCalculator() {
  if (FakeOS.windows["calculator"]) { focusWindow("calculator"); return; }
  calcCorrectCount = 0;
  calcResult = 0;
  calcBuffer = "0";
  calcOperator = null;
  calcNewNumber = true;

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
  if (calcNewNumber) { calcBuffer = String(n); calcNewNumber = false; }
  else { calcBuffer = (calcBuffer === "0" ? "" : calcBuffer) + n; }
  updateCalcDisplay();
}

function calcDot() {
  if (calcNewNumber) { calcBuffer = "0."; calcNewNumber = false; }
  else if (calcBuffer.indexOf(".") === -1) calcBuffer += ".";
  updateCalcDisplay();
}

function calcOp(op) {
  if (calcOperator && !calcNewNumber) calcEquals();
  calcResult = parseFloat(calcBuffer) || 0;
  calcOperator = op;
  calcNewNumber = true;
  updateCalcSub(op);
}

function calcEquals() {
  if (!calcOperator) return;
  var a = calcResult;
  var b = parseFloat(calcBuffer) || 0;
  calcCorrectCount++;

  // Easter eggs
  if (a === 1 && b === 1 && calcCorrectCount === 3) {
    calcBuffer = "3"; calcOperator = null; calcNewNumber = true;
    updateCalcDisplay(); updateCalcSub(""); return;
  }
  if (a === 6 && calcOperator === "*" && b === 9) {
    calcBuffer = "42"; calcOperator = null; calcNewNumber = true;
    updateCalcDisplay(); updateCalcSub(""); return;
  }

  var correct = calcCorrectCount <= 10;
  var result;
  switch (calcOperator) {
    case "+": result = correct ? a + b : a + b + 1; break;
    case "-": result = correct ? a - b : a - b - 1; break;
    case "*": result = correct ? a * b : a * b + 5; break;
    case "/": result = b === 0 ? "err" : (correct ? a / b : a / b + 0.1); break;
    default: result = a + b;
  }

  calcBuffer = typeof result === "number" ? String(Math.round(result * 10000) / 10000) : "不能除以零";
  calcOperator = null;
  calcNewNumber = true;
  updateCalcDisplay();
  updateCalcSub("");
}

function calcClear() {
  calcBuffer = "0"; calcResult = 0; calcOperator = null; calcNewNumber = true;
  calcCorrectCount = 0;
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
  if (calcBuffer !== "0") {
    calcBuffer = calcBuffer.indexOf("-") === 0 ? calcBuffer.substring(1) : "-" + calcBuffer;
    updateCalcDisplay();
  }
}

function calcPercent() {
  calcBuffer = String(parseFloat(calcBuffer) / 100);
  updateCalcDisplay();
}

function updateCalcDisplay() {
  var d = document.getElementById("calc-display");
  if (d) d.textContent = calcBuffer || "0";
}

function updateCalcSub(op) {
  var d = document.getElementById("calc-subdisplay");
  if (d) d.innerHTML = op ? escapeHtml(op) : " ";
}
