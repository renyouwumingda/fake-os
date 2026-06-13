// ===== 任务栏 =====
function initTaskbar() {
  updateClock();
  setInterval(updateClock, 1000);
}

function updateClock() {
  var now = new Date();
  var h = String(now.getHours()).padStart(2, '0');
  var m = String(now.getMinutes()).padStart(2, '0');
  var s = String(now.getSeconds()).padStart(2, '0');
  var clockEl = document.getElementById('taskbar-clock');
  if (FakeOS.virusActive) {
    clockEl.textContent = '∞';
  } else {
    clockEl.textContent = h + ':' + m + ':' + s;
  }

  if (FakeOS.nightMode && !document.getElementById('night-eye')) {
    var eye = document.createElement('span');
    eye.id = 'night-eye';
    eye.textContent = '👁️';
    eye.style.marginLeft = '4px';
    clockEl.parentElement.insertBefore(eye, clockEl);
  }
}

function updateTaskbar() {
  var container = document.getElementById('taskbar-apps');
  container.innerHTML = '';
  FakeOS.windowOrder.forEach(function(id) {
    var win = FakeOS.windows[id];
    if (!win) return;
    var btn = document.createElement('div');
    btn.className = 'taskbar-app' + (win.el.classList.contains('focused') && !win.minimized ? ' active' : '');
    btn.textContent = win.title;
    btn.onclick = function() { toggleWindow(id); };
    btn.oncontextmenu = function(e) {
      e.preventDefault();
      e.stopPropagation();
      document.querySelectorAll('.context-menu').forEach(function(m) { m.remove(); });
      var win = FakeOS.windows[id];
      if (!win) return;
      var menu = document.createElement('div');
      menu.className = 'context-menu';
      menu.style.left = e.clientX + 'px';
      menu.style.top = (e.clientY - 160) + 'px';
      var closeItem = '<div class="context-menu-item" onclick="closeWindow(\'' + id + '\')">关闭</div>';
      var minItem = '<div class="context-menu-item" onclick="toggleWindow(\'' + id + '\')">' + (win.minimized ? '还原' : '最小化') + '</div>';
      var maxItem = '<div class="context-menu-item" onclick="maximizeWindow(\'' + id + '\')">' + (win.maximized ? '还原大小' : '最大化') + '</div>';
      menu.innerHTML = minItem + maxItem + '<div class="context-menu-divider"></div>' + closeItem;
      document.body.appendChild(menu);
    };
    container.appendChild(btn);
  });
}

// ===== 开始菜单 =====
function toggleStartMenu() {
  document.getElementById('start-menu').classList.toggle('hidden');
}

document.addEventListener('click', function(e) {
  var menu = document.getElementById('start-menu');
  if (!menu.classList.contains('hidden') && !e.target.closest('#start-menu') && !e.target.closest('#start-btn')) {
    menu.classList.add('hidden');
  }
});
