// ===== 桌面图标 =====
function initDesktop() {
  initDesktopClock();
  document.getElementById("desktop-icons").addEventListener("dblclick", function(e) {
    var icon = e.target.closest(".desktop-icon");
    if (icon) {
      var app = icon.getAttribute("data-app");
      if (app) openApp(app);
    }
  });
  document.getElementById('desktop').addEventListener('click', function(e) {
    if (e.target.closest('.desktop-icon') || e.target.closest('.fake-window') ||
        e.target.closest('#taskbar') || e.target.closest('#start-menu')) return;
    FakeOS.clickCount++;
    if (FakeOS.clickCount >= 10) {
      FakeOS.clickCount = 0;
      document.getElementById('desktop').style.background = '#2a1a3e';
      setTimeout(function() {
        document.getElementById('desktop').style.background = '';
      }, 3000);
    }
  });
  document.getElementById('desktop').addEventListener('contextmenu', function(e) {
    if (e.target.closest('.fake-window') || e.target.closest('#taskbar')) return;
    e.preventDefault();
    document.querySelectorAll('.context-menu').forEach(function(m) { m.remove(); });
    showDesktopMenu(e.clientX, e.clientY);
  });
  document.addEventListener('click', function() {
    document.querySelectorAll('.context-menu').forEach(function(m) { m.remove(); });
  });
  document.querySelectorAll('.desktop-icon').forEach(function(icon) {
    icon.addEventListener('click', function(e) {
      document.querySelectorAll('.desktop-icon').forEach(function(i) { i.classList.remove('selected'); });
      icon.classList.add('selected');
      e.stopPropagation();
    });
    icon.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      e.stopPropagation();
      document.querySelectorAll('.context-menu').forEach(function(m) { m.remove(); });
      showIconMenu(e.clientX, e.clientY, icon.getAttribute('data-app'));
    });
  });
}

function showDesktopMenu(x, y) {
  var menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
  menu.innerHTML =
    '<div class="context-menu-item" onclick="openApp(\'terminal\')">🖥️ 打开终端</div>' +
    '<div class="context-menu-item" onclick="openApp(\'fileManager\')">📁 打开文件管理器</div>' +
    '<div class="context-menu-divider"></div>' +
    '<div class="context-menu-item" onclick="openDisplaySettings()">显示设置</div>' +
    '<div class="context-menu-item" onclick="openPersonalization()">个性化</div>' +
    '<div class="context-menu-divider"></div>' +
    '<div class="context-menu-item" onclick="openAbout()">关于</div>';
  document.body.appendChild(menu);
}

function showIconMenu(x, y, app) {
  var menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
  menu.innerHTML =
    '<div class="context-menu-item" onclick="openApp(\'' + app + '\')">打开</div>' +
    '<div class="context-menu-item" onclick="showAlert(\'属性\', \'类型：应用程序\n大小：∞KB\n描述：一个谎言\')">属性</div>' +
    '<div class="context-menu-divider"></div>' +
    '<div class="context-menu-item" onclick="showAlert(\'权限不足\', \'想得美。\')">删除</div>';
  document.body.appendChild(menu);
}

// ===== 打开应用 =====
function openApp(name) {
  document.querySelectorAll('.context-menu').forEach(function(m) { m.remove(); });
  document.getElementById('start-menu').classList.add('hidden');

  // 如果窗口已存在，直接聚焦
  if (FakeOS.windows[name]) {
    focusWindow(name);
    if (FakeOS.windows[name].minimized) {
      FakeOS.windows[name].minimized = false;
      FakeOS.windows[name].el.classList.remove('minimized');
      updateTaskbar();
    }
    return;
  }

  // 同时打开所有窗口彩蛋
  var openCount = Object.keys(FakeOS.windows).length;
  if (openCount >= 7) {
    showAlert('你想把电脑炸了吗？', 'FakeOS 没那么强大……\n\n……还是说？');
  }

  switch (name) {
    case 'terminal': openTerminal(); break;
    case 'fileManager': openFileManager(); break;
    case 'chat': openChat(); break;
    case 'settings': openSettings(); break;
    case 'virus': startVirus(); break;
    case 'notepad': openNotepad(); break;
    case 'calculator': openCalculator(); break;
    case 'music': openMusic(); break;
    case 'weather': openWeather(); break;
    case 'drawpad': openDrawpad(); break;
    case 'recycleBin': openRecycleBin(); break;
    default: showAlert('未找到', '无法打开 "' + name + '"');
  }
}

// ===== 显示设置 =====
function openDisplaySettings() {
  document.querySelectorAll('.context-menu').forEach(function(m) { m.remove(); });
  if (FakeOS.windows['displaySettings']) { focusWindow('displaySettings'); return; }

  var content = '<div style="padding:20px;color:#e0e0e0;font-family:Segoe UI,sans-serif;height:100%;overflow:auto;">'
    + '<h3 style="margin:0 0 16px;font-size:16px;color:#fff;">显示设置</h3>'
    + '<div style="margin-bottom:16px;">'
    + '<div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:8px;">分辨率</div>'
    + '<div style="display:flex;gap:8px;">'
    + '<button class="notepad-btn" style="padding:8px 16px;background:rgba(108,99,255,0.3);border:1px solid #6c63ff;border-radius:6px;color:#fff;cursor:pointer;">1920×1080 ✓</button>'
    + '<button class="notepad-btn" style="padding:8px 16px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:6px;color:rgba(255,255,255,0.5);cursor:pointer;" onclick="showAlert(\'分辨率\', \'此分辨率会导致现实崩塌。\')">2560×1440</button>'
    + '<button class="notepad-btn" style="padding:8px 16px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:6px;color:rgba(255,255,255,0.5);cursor:pointer;" onclick="showAlert(\'分辨率\', \'此分辨率超出人类感知范围。\')">3840×2160</button>'
    + '</div></div>'
    + '<div style="margin-bottom:16px;">'
    + '<div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:8px;">亮度</div>'
    + '<input type="range" min="0" max="100" value="70" style="width:100%;" onchange="showAlert(\'亮度\', \'亮度已调整。但你看到的仍然是假的。\')">'
    + '</div>'
    + '<div style="margin-bottom:16px;">'
    + '<div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:8px;">缩放</div>'
    + '<div style="display:flex;gap:8px;">'
    + '<button class="notepad-btn" style="padding:8px 16px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:6px;color:rgba(255,255,255,0.5);cursor:pointer;" onclick="showAlert(\'缩放\', \'100% — 你看到的就是全部。不，其实不是。\')">100%</button>'
    + '<button class="notepad-btn" style="padding:8px 16px;background:rgba(108,99,255,0.3);border:1px solid #6c63ff;border-radius:6px;color:#fff;cursor:pointer;">125% ✓</button>'
    + '<button class="notepad-btn" style="padding:8px 16px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:6px;color:rgba(255,255,255,0.5);cursor:pointer;" onclick="showAlert(\'缩放\', \'150% — 放大后更恐怖。\')">150%</button>'
    + '</div></div>'
    + '<div style="padding:12px;background:rgba(255,0,0,0.1);border-radius:8px;border:1px solid rgba(255,0,0,0.2);">'
    + '<div style="font-size:12px;color:rgba(255,255,255,0.5);">⚠️ 当前渲染：你的想象力 × 125%</div>'
    + '</div></div>';

  createWindow('displaySettings', '🖥️ 显示设置', 450, 380, content);
}

// ===== 个性化 =====
function openPersonalization() {
  document.querySelectorAll('.context-menu').forEach(function(m) { m.remove(); });
  if (FakeOS.windows['personalization']) { focusWindow('personalization'); return; }

  var wallpapers = [
    {name: '默认', gradient: 'linear-gradient(135deg, #0a0a2e 0%, #1a0a3e 40%, #0a1a4e 70%, #0a2a3e 100%)'},
    {name: '暗红', gradient: 'linear-gradient(135deg, #1a0000 0%, #2a0505 50%, #1a0a0a 100%)'},
    {name: '深渊', gradient: 'linear-gradient(135deg, #000 0%, #0a0a0a 50%, #000 100%)'},
    {name: '毒液', gradient: 'linear-gradient(135deg, #0a2e0a 0%, #0a3e0a 50%, #0a2e0a 100%)'},
    {name: '虚空', gradient: 'linear-gradient(135deg, #1a0a2e 0%, #0a1a3e 50%, #2e0a1a 100%)'},
  ];

  var wpHtml = '';
  wallpapers.forEach(function(wp, i) {
    wpHtml += '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer;" onclick="applyWallpaper(' + i + ')">'
      + '<div style="width:48px;height:32px;border-radius:4px;background:' + wp.gradient + ';border:1px solid rgba(255,255,255,0.1);flex-shrink:0;"></div>'
      + '<div><div style="font-size:13px;color:#fff;">' + wp.name + '</div>'
      + '<div style="font-size:11px;color:rgba(255,255,255,0.4);">' + (i === 0 ? '当前使用' : '点击切换') + '</div></div>'
      + '</div>';
  });

  var content = '<div style="padding:20px;color:#e0e0e0;font-family:Segoe UI,sans-serif;height:100%;overflow:auto;">'
    + '<h3 style="margin:0 0 16px;font-size:16px;color:#fff;">个性化</h3>'
    + '<div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:12px;">壁纸</div>'
    + wpHtml
    + '<div style="margin-top:16px;padding:12px;background:rgba(255,0,0,0.1);border-radius:8px;border:1px solid rgba(255,0,0,0.2);">'
    + '<div style="font-size:12px;color:rgba(255,255,255,0.5);">⚠️ 所有壁纸均由 AI 生成，不代表任何真实世界观。</div>'
    + '</div></div>';

  createWindow('personalization', '🎨 个性化', 400, 380, content);
}

function applyWallpaper(idx) {
  var wallpapers = [
    'linear-gradient(135deg, #0a0a2e 0%, #1a0a3e 40%, #0a1a4e 70%, #0a2a3e 100%)',
    'linear-gradient(135deg, #1a0000 0%, #2a0505 50%, #1a0a0a 100%)',
    'linear-gradient(135deg, #000 0%, #0a0a0a 50%, #000 100%)',
    'linear-gradient(135deg, #0a2e0a 0%, #0a3e0a 50%, #0a2e0a 100%)',
    'linear-gradient(135deg, #1a0a2e 0%, #0a1a3e 50%, #2e0a1a 100%)',
  ];
  document.getElementById('desktop').style.background = wallpapers[idx] || wallpapers[0];
}

// ===== 关于 =====
function openAbout() {
  document.querySelectorAll('.context-menu').forEach(function(m) { m.remove(); });
  if (FakeOS.windows['about']) { focusWindow('about'); return; }

  var content = '<div style="padding:24px;text-align:center;color:#e0e0e0;font-family:Segoe UI,sans-serif;height:100%;overflow:auto;display:flex;flex-direction:column;align-items:center;">'
    + '<div style="font-size:64px;margin-bottom:12px;">🖥️</div>'
    + '<div style="font-size:20px;font-weight:600;color:#fff;margin-bottom:4px;">FakeOS</div>'
    + '<div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:20px;">v0.3.0 (Build: nobody-cares)</div>'
    + '<div style="text-align:left;width:100%;max-width:300px;">'
    + '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;"><span style="color:rgba(255,255,255,0.5);">内存</span><span style="color:#fff;">640KB (应该够用了)</span></div>'
    + '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;"><span style="color:rgba(255,255,255,0.5);">存储</span><span style="color:#fff;">2TB / 2TB</span></div>'
    + '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;"><span style="color:rgba(255,255,255,0.5);">处理器</span><span style="color:#fff;">Intel i9-99999K @ -3.5GHz</span></div>'
    + '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;"><span style="color:rgba(255,255,255,0.5);">系统状态</span><span style="color:#f00;">⚠️ 一切正常</span></div>'
    + '</div>'
    + '<div style="margin-top:20px;font-size:11px;color:rgba(255,255,255,0.3);">© 2026 FakeTech Industries<br>保留所有假的权力。</div>'
    + '</div>';

  createWindow('about', 'ℹ️ 关于 FakeOS', 380, 420, content);
}

function openMusic() {
  createWindow('music', '🎵 音乐', 350, 200,
    '<div style="padding:24px;text-align:center;">' +
      '<div style="font-size:48px;margin-bottom:16px;">🎶</div>' +
      '<div style="color:rgba(255,255,255,0.5);font-size:13px;">正在播放：<em>不存在的歌曲.mp3</em></div>' +
      '<div style="margin-top:20px;display:flex;justify-content:center;gap:16px;">' +
        '<span style="font-size:24px;cursor:pointer;">⏮</span>' +
        '<span style="font-size:28px;cursor:pointer;">▶️</span>' +
        '<span style="font-size:24px;cursor:pointer;">⏭</span>' +
      '</div>' +
      '<div style="margin-top:12px;font-size:12px;color:rgba(255,255,255,0.3);">00:00 / ∞:∞</div>' +
    '</div>');
}

// ===== 桌面时钟小部件 =====
function initDesktopClock() {
  var clockEl = document.createElement("div");
  clockEl.id = "desktop-clock";
  clockEl.style.cssText =
    "position:absolute;top:20px;right:24px;text-align:right;z-index:101;" +
    "color:rgba(255,255,255,0.6);font-family:'Segoe UI',sans-serif;" +
    "cursor:pointer;user-select:none;transition:opacity 0.3s;" +
    "text-shadow:0 2px 8px rgba(0,0,0,0.5);" +
    "pointer-events:auto;";
  clockEl.innerHTML =
    '<div id="clock-time" style="font-size:48px;font-weight:300;letter-spacing:2px;line-height:1.1;"></div>' +
    '<div id="clock-date" style="font-size:14px;opacity:0.7;margin-top:4px;"></div>';
  document.getElementById("desktop").appendChild(clockEl);

  var clickCount = 0;
  clockEl.addEventListener("click", function() {
    clickCount++;
    if (clickCount === 5) {
      clickCount = 0;
      showAlert("你赶时间吗？", "时间不会因为你一直点它就变快。\n……虽然在这个系统里可能会。");
    }
  });

  updateClockWidget();
  setInterval(updateClockWidget, 1000);

  setInterval(function() {
    var timeEl = document.getElementById("clock-time");
    if (timeEl && !timeEl._speed) {
      timeEl._speed = 0;
    }
  }, 1000);
}

function updateClockWidget() {
  var now = new Date();
  var h = String(now.getHours()).padStart(2, "0");
  var m = String(now.getMinutes()).padStart(2, "0");
  var s = String(now.getSeconds()).padStart(2, "0");

  var timeEl = document.getElementById("clock-time");
  var dateEl = document.getElementById("clock-date");
  if (!timeEl || !dateEl) return;

  timeEl.textContent = h + ":" + m + ":" + s;

  var weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  var day = weekdays[now.getDay()];
  dateEl.textContent = "星期" + day + " " + now.getFullYear() + "年" + (now.getMonth()+1) + "月" + now.getDate() + "日";

  if (h === "00" && m === "00" && s === "00") {
    timeEl.textContent = "🎉 新的一天";
    dateEl.textContent = "……还是一样";
  }
}
