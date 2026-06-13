// ===== FakeOS 主控制器 =====
var FakeOS = {
  state: 'boot',
  loginClickCount: 0,
  startTime: Date.now(),
  idleTimer: null,
  dragEdgeCount: 0,
  clickCount: 0,
  konamiMode: false,
  nightMode: false,
  windows: {},
  windowOrder: [],
  nextWindowId: 0,
  nextZIndex: 1000,
  virusActive: false,
};

// ===== 启动序列 =====
var BOOT_LINES = [
  { text: 'BIOS v6.6.6 — FakeTech Industries', delay: 0 },
  { text: '内存检测: 65536KB OK', delay: 300 },
  { text: '硬盘检测... C: 2TB OK', delay: 600 },
  { text: '', delay: 700 },
  { text: '警告: 未找到理智模块', delay: 800, cls: 'warning' },
  { text: '警告: 幽默.dll 加载成功', delay: 1000, cls: 'warning' },
  { text: '', delay: 1100 },
  { text: '正在加载 FakeOS v0.2.0...', delay: 1200 },
  { text: '', delay: 1300, progress: true },
  { text: '', delay: 2300 },
  { text: '就绪。（但真的是就绪吗？）', delay: 2400, cls: 'error' },
];

function runBoot() {
  var el = document.getElementById('boot-text');
  BOOT_LINES.forEach(function(line) {
    setTimeout(function() {
      if (line.progress) {
        var bar = document.createElement('div');
        bar.textContent = '[                    ] 0%';
        el.appendChild(bar);
        var filled = 0;
        var total = 20;
        var barInterval = setInterval(function() {
          filled++;
          if (filled > total) { clearInterval(barInterval); return; }
          var pct = Math.round(filled / total * 100);
          var blocks = '█'.repeat(filled);
          var empty = ' '.repeat(total - filled);
          bar.textContent = '[' + blocks + empty + '] ' + pct + '%';
          el.scrollTop = el.scrollHeight;
        }, 50);
      } else {
        var span = document.createElement('div');
        span.textContent = line.text;
        if (line.cls) span.className = line.cls;
        el.appendChild(span);
        el.scrollTop = el.scrollHeight;
      }
    }, line.delay);
  });

  setTimeout(function() {
    document.getElementById('boot-screen').classList.add('fade-out');
    setTimeout(function() {
      document.getElementById('boot-screen').classList.add('hidden');
      document.getElementById('login-screen').classList.remove('hidden');
      document.getElementById('login-screen').classList.add('fade-in');
      FakeOS.state = 'login';
    }, 500);
  }, 2800);
}

// ===== 登录 =====
function initLogin() {
  var btn = document.getElementById('login-btn');
  var input = document.getElementById('login-password');
  var msg = document.getElementById('login-message');

  btn.addEventListener('click', function() {
    FakeOS.loginClickCount++;
    var pw = input.value.toLowerCase().trim();

    if (!pw && FakeOS.loginClickCount >= 5) {
      msg.textContent = '你还好吗？';
      return;
    }

    if (pw === 'password') {
      msg.textContent = '哇，你真没创意。';
      return;
    }
    if (pw === 'admin') {
      msg.textContent = '想得美。不行。';
      return;
    }
    if (pw === 'help') {
      msg.textContent = '这是登录界面，不是终端。';
      return;
    }

    // 任意密码都能进
    input.classList.add('success');
    msg.textContent = '访问已授权';
    msg.style.color = '#4caf50';

    setTimeout(function() {
      document.getElementById('login-screen').classList.add('fade-out');
      setTimeout(function() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('desktop').classList.remove('hidden');
        document.getElementById('desktop').classList.add('fade-in');
        FakeOS.state = 'desktop';
        initDesktop();
        initTaskbar();
        startIdleTimer();
        checkNightMode();
      }, 500);
    }, 800);
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') btn.click();
  });
}

// ===== 闲置计时器 =====
function startIdleTimer() {
  var idleTimeout;
  function resetIdle() {
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(function() {
      showAlert('你还在吗？', '还是去倒咖啡了？☕');
    }, 60000);
  }
  ['mousemove', 'keydown', 'click'].forEach(function(evt) {
    document.addEventListener(evt, resetIdle);
  });
  resetIdle();
}

// ===== 夜间模式检测 =====
function checkNightMode() {
  var hour = new Date().getHours();
  if (hour >= 0 && hour < 3) {
    document.getElementById('desktop').classList.add('night');
    FakeOS.nightMode = true;
  }
}

// ===== 弹窗 =====
function showAlert(title, text, callback) {
  var overlay = document.getElementById('overlay');
  overlay.classList.remove('hidden');
  overlay.innerHTML =
    '<div class="fake-alert">' +
      '<h3>' + title + '</h3>' +
      '<p>' + text + '</p>' +
      '<button class="fake-alert-btn" id="alert-ok-btn">确定</button>' +
    '</div>';
  overlay._callback = callback || null;
  document.getElementById('alert-ok-btn').addEventListener('click', function() {
    closeAlert();
  });
}

function closeAlert() {
  var overlay = document.getElementById('overlay');
  if (overlay._callback) overlay._callback();
  overlay.classList.add('hidden');
  overlay.innerHTML = '';
}

// ===== 假关机 =====
function fakeShutdown() {
  toggleStartMenu();
  showAlert('系统无法关闭', '有重要的事情正在发生。\n\nFakeOS 会永远运行下去。\n就像你的责任感一样。');
}

// ===== 假广告 =====
function showAd() {
  var titles = ['恭喜你中奖了！', '99%的人不知道这个功能！', '月薪翻倍的秘密！', '你的电脑正在被监控！', '你被选为幸运用户！'];
  var contents = ['点击领取 100 万 FakeCoins', '立即点击了解真相', '只需支付 9.9 即可解锁', '点击关闭即可解除', '奖品：一个更大的广告'];
  var i = Math.floor(Math.random() * titles.length);
  var ad = document.createElement('div');
  ad.className = 'ad-popup';
  ad.style.top = (100 + Math.random() * 400) + 'px';
  ad.style.left = (100 + Math.random() * 600) + 'px';
  ad.innerHTML =
    '<div class="ad-close" onclick="this.parentElement.remove()">×</div>' +
    '<div class="ad-title">' + titles[i] + '</div>' +
    '<div>' + contents[i] + '</div>';
  document.body.appendChild(ad);
  setTimeout(function() { if (ad.parentElement) ad.remove(); }, 5000);
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', function() {
  runBoot();
  initLogin();
  preventDevTools();
});

// ===== 防止开发者工具 =====
function preventDevTools() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F12') {
      e.preventDefault();
      showAlert('想得美', 'FakeOS 已禁用开发者工具。');
    }
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
    }
  });
  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
}
