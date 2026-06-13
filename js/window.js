// ===== 窗口管理器（事件委托版） =====
var dragState = null;
var resizeState = null;

function createWindow(id, title, width, height, contentHtml) {
  if (FakeOS.windows[id]) {
    focusWindow(id);
    if (FakeOS.windows[id].minimized) {
      FakeOS.windows[id].minimized = false;
      FakeOS.windows[id].el.classList.remove("minimized");
      updateTaskbar();
    }
    return FakeOS.windows[id];
  }

  var w = document.createElement("div");
  w.className = "fake-window focused";
  w.setAttribute("data-win-id", id);

  var x = 80 + (FakeOS.windowOrder.length % 6) * 30;
  var y = 40 + (FakeOS.windowOrder.length % 6) * 30;
  w.style.cssText = "left:" + x + "px;top:" + y + "px;width:" + width + "px;height:" + height + "px;z-index:" + (++FakeOS.nextZIndex);

  w.innerHTML =
    '<div class="window-titlebar" data-id="' + id + '">' +
      '<span class="window-title">' + title + '</span>' +
      '<div class="window-controls">' +
        '<button class="window-ctrl-btn minimize" data-action="minimize" data-id="' + id + '"></button>' +
        '<button class="window-ctrl-btn maximize" data-action="maximize" data-id="' + id + '"></button>' +
        '<button class="window-ctrl-btn close" data-action="close" data-id="' + id + '"></button>' +
      '</div>' +
    '</div>' +
    '<div class="window-content">' + contentHtml + '</div>' +
    '<div class="window-resize" data-id="' + id + '"></div>';

  document.getElementById("windows-container").appendChild(w);

  FakeOS.windows[id] = { el: w, id: id, title: title, minimized: false, maximized: false, prevRect: null };
  FakeOS.windowOrder.push(id);
  focusWindow(id);
  updateTaskbar();
  return FakeOS.windows[id];
}

function focusWindow(id) {
  var win = FakeOS.windows[id];
  if (!win) return;
  Object.keys(FakeOS.windows).forEach(function(k) {
    FakeOS.windows[k].el.classList.remove("focused");
  });
  win.el.classList.add("focused");
  win.el.style.zIndex = ++FakeOS.nextZIndex;
  updateTaskbar();
}

function minimizeWindow(id) {
  var win = FakeOS.windows[id];
  if (!win) return;
  win.minimized = true;
  win.el.classList.add("minimized");
  updateTaskbar();
}

function maximizeWindow(id) {
  var win = FakeOS.windows[id];
  if (!win) return;
  if (win.maximized) {
    win.maximized = false;
    win.el.classList.remove("maximized");
    if (win.prevRect) {
      win.el.style.left = win.prevRect.left;
      win.el.style.top = win.prevRect.top;
      win.el.style.width = win.prevRect.width;
      win.el.style.height = win.prevRect.height;
    }
  } else {
    win.prevRect = {
      left: win.el.style.left,
      top: win.el.style.top,
      width: win.el.style.width,
      height: win.el.style.height,
    };
    win.maximized = true;
    win.el.classList.add("maximized");
  }
}

function closeWindow(id) {
  var win = FakeOS.windows[id];
  if (!win) return;
  win.el.style.animation = "windowClose 0.2s forwards";
  setTimeout(function() {
    if (win.el.parentNode) win.el.parentNode.removeChild(win.el);
    delete FakeOS.windows[id];
    FakeOS.windowOrder = FakeOS.windowOrder.filter(function(wid) { return wid !== id; });
    updateTaskbar();
  }, 200);
}

function toggleWindow(id) {
  var win = FakeOS.windows[id];
  if (!win) return;
  if (win.minimized) {
    win.minimized = false;
    win.el.classList.remove("minimized");
    focusWindow(id);
  } else if (win.el.classList.contains("focused")) {
    minimizeWindow(id);
  } else {
    focusWindow(id);
  }
}

// ===== 事件委托：窗口控制按钮 =====
document.addEventListener("click", function(e) {
  var btn = e.target.closest("[data-action]");
  if (!btn) return;
  var action = btn.getAttribute("data-action");
  var id = btn.getAttribute("data-id");
  if (!id) return;
  e.stopPropagation();

  if (action === "close") closeWindow(id);
  else if (action === "minimize") minimizeWindow(id);
  else if (action === "maximize") maximizeWindow(id);
});

// ===== 事件委托：拖拽标题栏 =====
document.addEventListener("mousedown", function(e) {
  var titlebar = e.target.closest(".window-titlebar");
  if (!titlebar) {
    // 点击窗口内部聚焦
    var winEl = e.target.closest(".fake-window");
    if (winEl) {
      var wid = winEl.getAttribute("data-win-id");
      if (wid && FakeOS.windows[wid] && !FakeOS.windows[wid].el.classList.contains("focused")) {
        focusWindow(wid);
      }
    }
    return;
  }

  var id = titlebar.getAttribute("data-id");
  if (!id) return;
  var win = FakeOS.windows[id];
  if (!win || win.maximized) return;
  if (e.target.closest(".window-controls")) return;

  focusWindow(id);
  dragState = {
    id: id,
    startX: e.clientX,
    startY: e.clientY,
    origLeft: win.el.offsetLeft,
    origTop: win.el.offsetTop,
  };
  e.preventDefault();
});

document.addEventListener("mousemove", function(e) {
  var ds = dragState;
  if (ds) {
    var dx = e.clientX - ds.startX;
    var dy = e.clientY - ds.startY;
    var win = FakeOS.windows[ds.id];
    if (win) {
      win.el.style.left = (ds.origLeft + dx) + "px";
      win.el.style.top = (ds.origTop + dy) + "px";

      if (e.clientX <= 0 || e.clientX >= window.innerWidth - 1 || e.clientY <= 0 || e.clientY >= window.innerHeight - 49) {
        FakeOS.dragEdgeCount++;
        if (FakeOS.dragEdgeCount >= 10) {
          win.el.classList.add("shake");
          setTimeout(function() { win.el.classList.remove("shake"); }, 2000);
          FakeOS.dragEdgeCount = 0;
        }
      }
    }
  }
  var rs = resizeState;
  if (rs) {
    var dx2 = e.clientX - rs.startX;
    var dy2 = e.clientY - rs.startY;
    var win2 = FakeOS.windows[rs.id];
    if (win2) {
      win2.el.style.width = Math.max(320, rs.origW + dx2) + "px";
      win2.el.style.height = Math.max(200, rs.origH + dy2) + "px";
    }
  }
});

document.addEventListener("mouseup", function() {
  dragState = null;
  resizeState = null;
});

// ===== 缩放 =====
document.addEventListener("mousedown", function(e) {
  var handle = e.target.closest(".window-resize");
  if (!handle) return;
  var id = handle.getAttribute("data-id");
  if (!id) return;
  var win = FakeOS.windows[id];
  if (!win || win.maximized) return;
  resizeState = {
    id: id,
    startX: e.clientX,
    startY: e.clientY,
    origW: win.el.offsetWidth,
    origH: win.el.offsetHeight,
  };
  e.preventDefault();
  e.stopPropagation();
});
