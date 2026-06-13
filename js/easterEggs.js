// ===== 彩蛋 =====

// Konami 密码
var konamiBuffer = [];
document.addEventListener("keydown", function(e) {
  var KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  konamiBuffer.push(e.key);
  if (konamiBuffer.length > KONAMI.length) konamiBuffer.shift();
  if (konamiBuffer.join(",") === KONAMI.join(",")) {
    document.body.classList.add("rainbow-text");
    showAlert("🎉 KONAMI 模式已激活", "所有文字都变成彩虹了！");
  }

  // Ctrl+U
  if (e.ctrlKey && e.key === "u") {
    e.preventDefault();
    showAlert("查看源代码？", "这就是源代码。");
  }
});

// 控制台彩蛋
console.log("%cFakeOS v0.3.0", "font-size:24px;color:#6c63ff;font-weight:bold;");
console.log("%c你为什么在看控制台？", "color:rgba(255,255,255,0.5);");
console.log("%c这里没什么有趣的。走吧。", "color:rgba(100,100,100,0.5);");
console.log("%c……", "color:rgba(100,100,100,0.3);");
console.log("%c够了。", "color:rgba(255,0,0,0.3);");
