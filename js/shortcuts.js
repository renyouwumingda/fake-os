// ===== 快捷键系统 =====

(function() {
  var allMinimized = false;
  var prevMinState = [];

  document.addEventListener("keydown", function(e) {
    // Alt+F4 - 关闭当前聚焦窗口
    if (e.altKey && e.key === "F4") {
      e.preventDefault();
      var focusedWin = null;
      Object.keys(FakeOS.windows).forEach(function(id) {
        var win = FakeOS.windows[id];
        if (win && win.el.classList.contains("focused") && !win.minimized) {
          focusedWin = id;
        }
      });
      if (focusedWin) {
        closeWindow(focusedWin);
      } else {
        showAlert("想关掉什么？", "没有窗口可以关闭。\n……你是在暗示什么吗？");
      }
    }

    // Alt+Tab - 切换窗口
    if (e.altKey && e.key === "Tab") {
      e.preventDefault();
      var openWindows = [];
      Object.keys(FakeOS.windows).forEach(function(id) {
        var win = FakeOS.windows[id];
        if (win && !win.minimized) openWindows.push(id);
      });
      if (openWindows.length <= 1) return;
      var currentIdx = -1;
      for (var i = 0; i < openWindows.length; i++) {
        var w = FakeOS.windows[openWindows[i]];
        if (w && w.el.classList.contains("focused")) {
          currentIdx = i;
          break;
        }
      }
      var nextIdx = (currentIdx + 1) % openWindows.length;
      if (e.shiftKey) {
        nextIdx = (currentIdx - 1 + openWindows.length) % openWindows.length;
      }
      focusWindow(openWindows[nextIdx]);
    }

    // Win+D - 显示桌面
    if (e.key === "Meta" && e.shiftKey === false) {
      // Just track meta key press
      return;
    }
    if (e.key === "d" && e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      // Win+D on Mac is Meta+D
      toggleDesktop();
    }
    // Also support Ctrl+Shift+D as Win+D alternative
    if (e.key === "D" && e.ctrlKey && e.shiftKey && !e.altKey) {
      e.preventDefault();
      toggleDesktop();
    }

    // Win+E - 打开文件管理器
    if (e.key === "e" && e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      openApp("fileManager");
    }
    if (e.key === "E" && e.ctrlKey && e.shiftKey && !e.altKey) {
      e.preventDefault();
      openApp("fileManager");
    }

    // Win+R - 运行对话框
    if (e.key === "r" && e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      showAlert("运行", "这个功能还没开通。\n（其实是骗你的，它永远不会开通。）");
    }

    // Escape - 关闭弹窗/菜单
    if (e.key === "Escape") {
      var overlay = document.getElementById("overlay");
      if (!overlay.classList.contains("hidden")) {
        closeAlert();
      }
      var menu = document.getElementById("start-menu");
      if (!menu.classList.contains("hidden")) {
        menu.classList.add("hidden");
      }
    }
  });

  function toggleDesktop() {
    if (allMinimized) {
      // Restore
      allMinimized = false;
      prevMinState.forEach(function(id) {
        var win = FakeOS.windows[id];
        if (win) {
          win.minimized = false;
          win.el.classList.remove("minimized");
        }
      });
      prevMinState = [];
      updateTaskbar();
    } else {
      // Minimize all
      allMinimized = true;
      prevMinState = [];
      Object.keys(FakeOS.windows).forEach(function(id) {
        var win = FakeOS.windows[id];
        if (win && !win.minimized) {
          prevMinState.push(id);
          win.minimized = true;
          win.el.classList.add("minimized");
        }
      });
      updateTaskbar();
    }
  }

  // Alt+Tab with Shift handled in the keydown handler
  // Track meta key for Win key combos
  var metaDown = false;
  document.addEventListener("keydown", function(e) {
    if (e.key === "Meta") metaDown = true;
  });
  document.addEventListener("keyup", function(e) {
    if (e.key === "Meta") metaDown = false;
  });
})();
