// ===== 监控时间线数据 =====
// 提取自 js/camera.js — openCamera() 内的 events 数组
// 注意: 函数回调引用 cam1/cam2/cam3/cam4 局部变量，需在 openCamera 上下文中使用
var CAMERA_EVENTS = [
    { time: 30, id: 'shadow1', fn: function() {
      var s = document.getElementById('cam4-shadow');
      if (s) s.classList.add('visible');
    }},
    { time: 45, id: 'flicker2', fn: function() {
      cam2.style.filter = 'brightness(3)';
      setTimeout(function() { cam2.style.filter = ''; }, 200);
    }},
    { time: 75, id: 'timeWarp', fn: function() {
      var el = document.getElementById('camera-time');
      if (el) { el.style.color = '#f55'; el.textContent = '13:37:42'; }
    }},
    { time: 160, id: 'officeLight', fn: function() {
      cam1.style.filter = 'brightness(0.2)';
      setTimeout(function() { cam1.style.filter = ''; }, 300);
      setTimeout(function() { cam1.style.filter = 'brightness(0.1)'; }, 500);
      setTimeout(function() { cam1.style.filter = ''; }, 700);
    }},
    { time: 220, id: 'breath', fn: function() {
      try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var buf = ctx.createBuffer(1, 4410, 44100);
        var data = buf.getChannelData(0);
        for (var i = 0; i < 4410; i++) data[i] = (Math.random() * 2 - 1) * 0.02;
        var src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start();
        setTimeout(function() { ctx.close(); }, 50);
      } catch(e) {}
    }},
    { time: 250, id: 'whiteFlash', fn: function() {
      [cam1,cam2,cam3,cam4].forEach(function(c) {
        c.style.background = '#fff';
        setTimeout(function() { c.style.background = ''; }, 200);
      });
    }},
    { time: 60, id: 'figure', fn: function() {
      cam2.innerHTML += '<div id="cam2-figure" style="position:absolute;bottom:50%;left:50%;width:20px;height:40px;background:rgba(255,255,255,0.3);border-radius:50% 50% 0 0;transform:translateX(-50%);filter:blur(2px);"></div>';
    }},
    { time: 90, id: 'signalLost', fn: function() {
      [cam1,cam2,cam3,cam4].forEach(function(c) {
        var lost = document.createElement('div');
        lost.className = 'signal-lost';
        lost.textContent = 'Signal Lost';
        c.appendChild(lost);
        setTimeout(function() { lost.remove(); }, 2000);
      });
    }},
    { time: 120, id: 'shadow2', fn: function() {
      var s = document.getElementById('cam4-shadow');
      if (s) { s.classList.remove('visible'); s.classList.add('standing', 'visible'); }
    }},
    { time: 150, id: 'help', fn: function() {
      cam1.innerHTML += '<div style="position:absolute;top:30%;left:30%;color:rgba(255,0,0,0.6);font-size:12px;font-family:monospace;animation:ghostFade 1s infinite;">HELP ME</div>';
    }},
    { time: 180, id: 'blackout', fn: function() {
      cam3.style.background = '#000';
      cam3.innerHTML += '<div style="position:absolute;top:50%;left:50%;width:6px;height:6px;border-radius:50%;background:#f00;box-shadow:0 0 10px #f00;"></div>';
      cam3.innerHTML += '<div style="position:absolute;bottom:4px;left:4px;color:#0f0;font-size:10px;font-family:monospace;">CAM-03 \u670d\u52a1\u5668\u673a\u623f</div>';
    }},
    { time: 200, id: 'shadow3', fn: function() {
      var s = document.getElementById('cam4-shadow');
      if (s) { s.classList.remove('standing'); s.classList.add('approaching'); }
    }},
    { time: 240, id: 'alert', fn: function() {
      showAlert('\u26a0\ufe0f \u68c0\u6d4b\u5230\u672a\u6388\u6743\u8bbf\u95ee', '\u5f53\u524d\u4f4d\u7f6e\uff1a\u4f60\u8eab\u540e\u3002');
    }},
    { time: 270, id: 'message', fn: function() {
      cam4.innerHTML += '<div style="position:absolute;top:40%;left:20%;color:rgba(255,0,0,0.7);font-size:11px;font-family:monospace;animation:ghostFade 2s infinite;white-space:nowrap;">\u6211\u77e5\u9053\u4f60\u5728\u770b</div>';
    }},
    { time: 300, id: 'close', fn: function() {
      cameraState.blocked = true;
      if (FakeOS.windows['camera']) closeWindow('camera');
    }},
];
