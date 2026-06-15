// ===== 恐怖等级系统 =====
var horrorState = {
  level: 0,
  startTime: Date.now(),
  appsOpened: [],
  filesOpened: 0,
  commandsRun: 0,
  chatMessages: 0,
  hiddenFound: false,
  maintainerMet: false,
  mirrorInputs: 0,
  cameraTime: 0,
  totalPlayTime: 0,
  eventCooldowns: {},
  lastActivityTime: Date.now(),
  clickTimestamps: [],
  lastClickTarget: '',
  sameClickCount: 0,
  resizeTimeout: null,
  metaTriggered: [],
  horrorScheduler: null,
  checkAliveTimer: null,
};

function trackAppOpen(appName) {
  if (horrorState.appsOpened.indexOf(appName) === -1) horrorState.appsOpened.push(appName);
  checkHorrorLevel();
  if (typeof StoryEngine !== 'undefined') StoryEngine.onAppOpen(appName);
}

function trackCommand() {
  horrorState.commandsRun++;
  checkHorrorLevel();
  if (typeof StoryEngine !== 'undefined') StoryEngine.onCommand();
}

function trackChat() {
  horrorState.chatMessages++;
  checkHorrorLevel();
  if (typeof StoryEngine !== 'undefined') StoryEngine.onChat();
}

function checkHorrorLevel() {
  var elapsed = (Date.now() - horrorState.startTime) / 1000;
  var newLevel = horrorState.level;
  if (newLevel === 0 && elapsed > 180) newLevel = 1;
  else if (newLevel === 1 && horrorState.appsOpened.length >= 3) newLevel = 2;
  else if (newLevel === 2 && (horrorState.hiddenFound || horrorState.commandsRun >= 10)) newLevel = 3;
  else if (newLevel === 3 && typeof MAINTAINER_ROUNDS !== 'undefined' && MAINTAINER_ROUNDS.filter(function(r) { return r.used; }).length >= 3) newLevel = 4;
  else if (newLevel === 4 && (horrorState.mirrorInputs >= 30 || horrorState.cameraTime >= 300)) newLevel = 5;
  if (newLevel > horrorState.level) {
    horrorState.level = newLevel;
    if (typeof StoryEngine !== 'undefined') StoryEngine.advance();
    showNotification("\u26a0\ufe0f \u7cfb\u7edf\u8b66\u544a", getHorrorMessage(newLevel));
  }
}

function getHorrorMessage(level) {
  var msgs = {
    1: "\u7cfb\u7edf\u8d44\u6e90\u5f02\u5e38...\u4f46\u4ecd\u5728\u8fd0\u884c",
    2: "\u68c0\u6d4b\u5230\u672a\u6388\u6743\u8fde\u63a5",
    3: "\u524d\u7528\u6237\u6570\u636e\u6b8b\u7559\u672a\u6e05\u7406",
    4: "\u7528\u6237\u884c\u4e3a\u4e0e\u524d\u7528\u6237\u76f8\u4f3c\u5ea6: 89%",
    5: "\u6240\u6709\u5b89\u5168\u534f\u8bae\u5df2\u5931\u6548",
  };
  return msgs[level] || "\u7cfb\u7edf\u5f02\u5e38";
}

function startHorrorScheduler() {
  if (horrorState.horrorScheduler) return;
  horrorState.horrorScheduler = setInterval(function() {
    horrorState.totalPlayTime += 10;
    if (typeof StoryMemory !== 'undefined') StoryMemory.save();
    if (typeof StoryVariables !== 'undefined') StoryVariables.syncFromHorror();
    if (typeof StoryEvents !== 'undefined') StoryEvents.check();
    HORROR_EVENTS.forEach(function(event) {
      if (horrorState.level >= event.minLevel &&
          !horrorState.eventCooldowns[event.name] &&
          Math.random() < event.probability) {
        event.action();
        horrorState.eventCooldowns[event.name] = true;
        setTimeout(function() {
          horrorState.eventCooldowns[event.name] = false;
        }, event.cooldown);
      }
    });
    checkHorrorLevel();
  }, 10000);
}

function stopHorrorScheduler() {
  if (horrorState.horrorScheduler) {
    clearInterval(horrorState.horrorScheduler);
    horrorState.horrorScheduler = null;
  }
}

// ===== 环境恐怖事件 =====
var HORROR_EVENTS = [
  {
    name: "flash",
    minLevel: 1,
    cooldown: 120000,
    probability: 0.08,
    action: function() {
      var flash = document.createElement('div');
      flash.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:99999;opacity:0.3;pointer-events:none;transition:opacity 0.1s;';
      document.body.appendChild(flash);
      setTimeout(function() { flash.style.opacity = '0'; }, 50);
      setTimeout(function() { flash.remove(); }, 200);
    }
  },
  {
    name: "shake",
    minLevel: 2,
    cooldown: 180000,
    probability: 0.06,
    action: function() {
      Object.keys(FakeOS.windows).forEach(function(id) {
        var win = FakeOS.windows[id].el;
        win.classList.add('shake');
        setTimeout(function() { win.classList.remove('shake'); }, 2000);
      });
    }
  },
  {
    name: "cursor",
    minLevel: 3,
    cooldown: 300000,
    probability: 0.04,
    action: function() {
      document.body.style.cursor = 'none';
      var fakeCursor = document.createElement('div');
      fakeCursor.id = 'horror-cursor';
      fakeCursor.style.cssText = 'position:fixed;width:20px;height:20px;background:rgba(0,0,0,0.5);border-radius:50%;pointer-events:none;z-index:99999;transition:left 0.3s,top 0.3s;';
      document.body.appendChild(fakeCursor);
      var moveHandler = function(e) {
        fakeCursor.style.left = (e.clientX + 5) + 'px';
        fakeCursor.style.top = (e.clientY + 5) + 'px';
      };
      document.addEventListener('mousemove', moveHandler);
      setTimeout(function() {
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', moveHandler);
        fakeCursor.remove();
      }, 5000);
    }
  },
  {
    name: "text",
    minLevel: 2,
    cooldown: 300000,
    probability: 0.05,
    action: function() {
      var icons = document.querySelectorAll('.icon-label');
      if (icons.length === 0) return;
      var weirdTexts = ['\u522b\u770b','\u5b83\u5728','\u5feb\u8dd1','\u56de\u5934','\u4f60\u597d','\u518d\u89c1'];
      var target = icons[Math.floor(Math.random() * icons.length)];
      var original = target.textContent;
      target.textContent = weirdTexts[Math.floor(Math.random() * weirdTexts.length)];
      target.style.color = '#f55';
      setTimeout(function() {
        target.textContent = original;
        target.style.color = '';
      }, 3000);
    }
  },
  {
    name: "clock",
    minLevel: 1,
    cooldown: 60000,
    probability: 0.1,
    action: function() {
      var clock = document.getElementById('taskbar-clock');
      if (clock) {
        clock.style.color = '#f55';
        setTimeout(function() { clock.style.color = ''; }, 500);
      }
    }
  },
  {
    name: "shadow",
    minLevel: 3,
    cooldown: 360000,
    probability: 0.03,
    action: function() {
      var shadow = document.createElement('div');
      shadow.style.cssText = 'position:fixed;right:0;top:0;width:100px;height:100%;background:linear-gradient(to left, rgba(0,0,0,0.3), transparent);z-index:99998;pointer-events:none;opacity:0;transition:opacity 2s;';
      document.body.appendChild(shadow);
      setTimeout(function() { shadow.style.opacity = '1'; }, 100);
      setTimeout(function() { shadow.style.opacity = '0'; }, 3000);
      setTimeout(function() { shadow.remove(); }, 5000);
    }
  },
  {
    name: 'sound',
    minLevel: 2,
    cooldown: 240000,
    probability: 0.05,
    action: function() {
      try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.value = 80 + Math.random() * 40;
        gain.gain.value = 0.05;
        osc.start();
        setTimeout(function() { osc.stop(); ctx.close(); }, 50);
      } catch(e) {}
    }
  },
];

// ===== 第四面墙打破 =====
// Idle tracking
// _lastActivityTime moved to horrorState.lastActivityTime
// _clickTimestamps moved to horrorState.clickTimestamps
// horrorState.lastClickTarget moved to horrorState.lastClickTarget
// _sameClickCount moved to horrorState.sameClickCount

document.addEventListener('mousemove', function() { horrorState.lastActivityTime = Date.now(); });
document.addEventListener('keydown', function() { horrorState.lastActivityTime = Date.now(); });
document.addEventListener('click', function() {
  horrorState.lastActivityTime = Date.now();
  var now = Date.now();
  horrorState.clickTimestamps.push(now);
  horrorState.clickTimestamps = horrorState.clickTimestamps.filter(function(t) { return now - t < 5000; });
  // Track same icon clicks
  var icon = document.querySelector('.desktop-icon.selected');
  var iconId = icon ? icon.getAttribute('data-app') : '';
  if (iconId && iconId === horrorState.lastClickTarget) {
    horrorState.sameClickCount++;
  } else {
    horrorState.sameClickCount = 1;
    horrorState.lastClickTarget = iconId;
  }
});

var META_TRIGGERS = [
  { id: 'idle', check: function() { return Date.now() - horrorState.lastActivityTime > 120000; }, message: '\u4f60\u5728\u7b49\u4ec0\u4e48\uff1f' },
  { id: 'manyWin', check: function() { return Object.keys(FakeOS.windows).length >= 6; }, message: '\u4f60\u5f88\u5fd9\u554a\u3002' },
  { id: 'allClosed', check: function() { return Object.keys(FakeOS.windows).length === 0 && FakeOS.state === 'desktop'; }, message: '\u5c31\u5269\u6211\u4eec\u4e86\u3002' },
  { id: 'quickClick', check: function() { return horrorState.clickTimestamps.length >= 10; }, message: '\u522b\u7d27\u5f20\u3002' },
  { id: 'sameIcon', check: function() { return horrorState.sameClickCount >= 5; }, message: '\u4f60\u5728\u627e\u4ec0\u4e48\uff1f' },
];

function checkMetaTriggers() {
  if (horrorState.level < 2) return;
  META_TRIGGERS.forEach(function(t) {
    if (horrorState.metaTriggered.indexOf(t.id) === -1 && t.check()) {
      horrorState.metaTriggered.push(t.id);
      setTimeout(function() { showAlert('\u2139\ufe0f', t.message); }, 2000);
    }
  });
}

// 绑定到窗口关闭事件
// _origCloseWindow removed (not needed)
if (typeof closeWindow === 'function') {
  var origClose = closeWindow;
  closeWindow = function(id) {
    origClose(id);
    setTimeout(checkMetaTriggers, 500);
  };
}
// ===== 窗口调整检测 =====
// horrorState.resizeTimeout moved to horrorState.resizeTimeout
window.addEventListener('resize', function() {
  if (horrorState.resizeTimeout) clearTimeout(horrorState.resizeTimeout);
  horrorState.resizeTimeout = setTimeout(function() {
    if (horrorState.level >= 3 && horrorState.metaTriggered.indexOf('resize') === -1) {
      horrorState.metaTriggered.push('resize');
      setTimeout(function() { showAlert('\u2139\ufe0f', '\u4f60\u5728\u8bd5\u56fe\u9003\u8dd1\u5417\uff1f'); }, 2000);
    }
  }, 1000);
});

// ===== 定时检查第四面墙 =====
function startMetaTriggerCheck() {
  setInterval(function() { checkMetaTriggers(); }, 30000);
}
