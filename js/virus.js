// ===== 病毒 =====
var virusStage = 0;
var virusTimers = [];

function startVirus() {
  if (FakeOS.virusActive) return;
  FakeOS.virusActive = true;
  virusStage = 0;

  var icon = document.getElementById("virus-icon");
  if (icon) icon.style.display = "";
  document.getElementById("start-menu").classList.add("hidden");

  Object.keys(FakeOS.windows).forEach(function(id) {
    if (id !== "terminal") closeWindow(id);
  });

  var overlay = document.getElementById("overlay");
  overlay.classList.remove("hidden");
  overlay.innerHTML = '<div style="font-size:48px;color:#f00;animation:blink 0.5s step-end infinite;">☠️</div>';

  // 阶段1：感染 (0-3s)
  setTimeout(function() {
    virusStage = 1;
    overlay.innerHTML = '<div style="text-align:center;color:#f00;"><h2 style="color:#f00;font-size:28px;">⚠️ 检测到感染</h2><p style="color:rgba(255,0,0,0.7);">出问题了……</p></div>';
    document.body.classList.add("red-pulse");

    Object.values(FakeOS.windows).forEach(function(w) {
      var title = w.el.querySelector(".window-title");
      if (title) title.textContent = "我看见你了";
    });

    var clock = document.getElementById("taskbar-clock");
    if (clock) clock.textContent = "∞";
  }, 500);

  // 阶段2：弹窗 (3-8s)
  setTimeout(function() {
    virusStage = 2;
    var popupInterval = setInterval(function() {
      if (virusStage < 2) { clearInterval(popupInterval); return; }
      var win = document.createElement("div");
      win.className = "fake-window";
      win.style.cssText = "left:" + (Math.random() * 300 + 50) + "px;top:" + (Math.random() * 200 + 50) + "px;width:200px;height:120px;z-index:9999;";
      win.innerHTML = "<div class=\"window-titlebar\" style=\"background:#300;\"><span class=\"window-title\" style=\"color:#f00;\">别慌</span><div class=\"window-controls\"><button class=\"window-ctrl-btn close\" onclick=\"tryCloseVirusWin(this)\"></button></div></div><div class=\"window-content\" style=\"padding:20px;text-align:center;font-size:14px;color:#f00;\">太晚了。</div>";
      document.getElementById("windows-container").appendChild(win);

      if (Math.random() < 0.15) {
        win.querySelector(".window-title").textContent = "开玩笑的，关掉我吧！";
        win.querySelector(".window-ctrl-btn.close").onclick = function() { win.remove(); };
      }
    }, 800);
    virusTimers.push(popupInterval);
  }, 3000);

  // 阶段3：失控 (8-15s)
  setTimeout(function() {
    virusStage = 3;
    overlay.innerHTML = '<div style="text-align:center;color:#f00;"><h2 style="color:#f00;font-size:32px;">💀 系统已被入侵</h2><p style="color:rgba(255,0,0,0.7);">你不该点那个的。</p></div>';
    document.getElementById("desktop").classList.add("screen-rotate");

    document.querySelectorAll(".desktop-icon").forEach(function(icon) {
      icon.style.transition = "all 0.5s";
      icon.style.transform = "translate(" + (Math.random() * 200 - 100) + "px," + (Math.random() * 300 - 150) + "px) rotate(" + (Math.random() * 360) + "deg)";
    });

    // 终端乱码
    if (FakeOS.windows.terminal) {
      var termBody = FakeOS.windows.terminal.el.querySelector(".terminal-body");
      if (termBody) {
        var spam = setInterval(function() {
          if (virusStage < 3) { clearInterval(spam); return; }
          var output = termBody.querySelector(".terminal-output") || termBody;
          if (output) {
            var line = document.createElement("div");
            line.className = "error-text";
            line.textContent = Math.random().toString(36).substring(2, 20);
            output.appendChild(line);
            output.scrollTop = output.scrollHeight;
            if (Math.random() < 0.05) {
              var msg = document.createElement("div");
              msg.className = "special-text";
              msg.textContent = "回头看。开玩笑的。……还是说？";
              output.appendChild(msg);
            }
          }
        }, 100);
        virusTimers.push(spam);
      }
    }

    // 聊天刷屏
    if (FakeOS.windows.chat) {
      var chatSpam = setInterval(function() {
        if (virusStage < 3) { clearInterval(chatSpam); return; }
        var msgEl = document.getElementById("chat-messages");
        if (msgEl) {
          var line = document.createElement("div");
          line.className = "chat-msg npc";
          line.style.color = "#f00";
          line.textContent = "终结即将来临";
          msgEl.appendChild(line);
          msgEl.scrollTop = msgEl.scrollHeight;
        }
      }, 1500);
      virusTimers.push(chatSpam);
    }
  }, 8000);

  // 阶段4：崩溃 (15-22s)
  setTimeout(function() {
    virusStage = 4;
    document.getElementById("desktop").classList.remove("screen-rotate");
    document.getElementById("desktop").classList.add("shake");
    document.getElementById("desktop").style.background = "#1a0000";

    document.querySelectorAll("#windows-container > .fake-window").forEach(function(w) { w.remove(); });

    overlay.innerHTML = '<div style="text-align:center;font-family:monospace;">'
      + "<pre style=\"color:#f00;font-size:14px;line-height:1.5;\">"
      + "██████████████████████████████\n"
      + "██  FAKEOS 已崩溃          ██\n"
      + "██  错误代码: 0xDEADBEEF    ██\n"
      + "██  正在收集错误信息...     ██\n"
      + "██  找到 0 条有用信息       ██\n"
      + "██████████████████████████████\n"
      + "</pre></div>";
  }, 15000);

  // 阶段5：格式化 (22-28s)
  setTimeout(function() {
    virusStage = 5;
    document.body.classList.remove("red-pulse");
    document.getElementById("desktop").classList.remove("shake");
    document.getElementById("desktop").style.background = "#f0f0f0";

    var formatLines = [
      "正在格式化 C: ...",
      "正在删除 /home/admin/ ...",
      "正在删除 /home/admin/Documents/ ...",
      "正在删除 /home/admin/Dreams/ ...",
      "正在删除 /home/admin/Hope/ ...",
      "正在删除 /home/admin/Everything/ ...",
      "",
      "格式化完成。",
      "没有数据受到伤害。这些都是假的。",
      "",
      "……还是说？",
    ];

    overlay.innerHTML = '<div style="text-align:left;font-family:monospace;color:#000;font-size:16px;"></div>';
    var formatDiv = overlay.querySelector("div");

    formatLines.forEach(function(line, i) {
      setTimeout(function() {
        if (formatDiv) formatDiv.innerHTML += line + "<br>";
      }, i * 500);
    });

    setTimeout(function() {
      location.reload();
    }, 28000 + formatLines.length * 500);
  }, 22000);
}

function tryCloseVirusWin(btn) {
  var win = btn.closest(".fake-window");
  var title = win ? win.querySelector(".window-title").textContent : "";
  if (title === "开玩笑的，关掉我吧！") {
    if (win.parentNode) win.parentNode.removeChild(win);
  }
}
