// ===== 监控摄像头 =====
var cameraState = { startTime: 0, timer: null, eventsFired: [], checkAlive: null, blocked: false };

function openCamera() {
  if (cameraState.blocked) { return; }
  if (FakeOS.windows['camera']) { focusWindow('camera'); return; }
  cameraState = { startTime: Date.now(), timer: null, eventsFired: [], checkAlive: null };
  trackAppOpen('camera');

  var content = '<div style="display:flex;flex-direction:column;height:100%;background:#0a0a0a;">'
    + '<div style="padding:6px 12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);">'
    + '<span style="color:#fff;font-family:monospace;font-size:13px;">\ud83d\udce1 \u76d1\u63a7\u6444\u50cf\u5934</span>'
    + '<span id="camera-time" style="color:#0f0;font-family:monospace;font-size:11px;">00:00:00</span>'
    + '</div>'
    + '<div style="flex:1;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:2px;padding:4px;">'
    + '<div class="camera-feed" id="cam1" style="background:linear-gradient(180deg,#1a1a2e,#16213e);position:relative;"><div style="position:absolute;bottom:4px;left:4px;color:#0f0;font-size:10px;font-family:monospace;">CAM-01 \u529e\u516c\u5ba4</div></div>'
    + '<div class="camera-feed" id="cam2" style="background:linear-gradient(180deg,#16213e,#0f3460);position:relative;"><div style="position:absolute;bottom:4px;left:4px;color:#0f0;font-size:10px;font-family:monospace;">CAM-02 \u8d70\u5eca</div></div>'
    + '<div class="camera-feed" id="cam3" style="background:linear-gradient(180deg,#0f3460,#1a1a2e);position:relative;"><div style="position:absolute;bottom:4px;left:4px;color:#0f0;font-size:10px;font-family:monospace;">CAM-03 \u670d\u52a1\u5668\u673a\u623f</div></div>'
    + '<div class="camera-feed" id="cam4" style="background:linear-gradient(180deg,#1a1a2e,#0f3460);position:relative;"><div id="cam4-shadow" class="camera-shadow" style="bottom:30px;left:50%;margin-left:-20px;"></div><div style="position:absolute;bottom:4px;left:4px;color:#0f0;font-size:10px;font-family:monospace;">CAM-04 \u4f60\u7684\u623f\u95f4</div></div>'
    + '</div>'
    + '<div style="padding:4px 12px;border-top:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;">'
    + '<span style="color:#f00;font-size:11px;font-family:monospace;">\u25cf \u5f55\u5236\u4e2d</span>'
    + '<span id="camera-ts" style="color:rgba(255,255,255,0.4);font-size:11px;font-family:monospace;"></span>'
    + '</div></div>';

  createWindow('camera', '\ud83d\udce1 \u76d1\u63a7\u6444\u50cf\u5934', 450, 350, content);

  // Camera elements
  var cam1 = document.getElementById('cam1');
  var cam2 = document.getElementById('cam2');
  var cam3 = document.getElementById('cam3');
  var cam4 = document.getElementById('cam4');
  var shadow = document.getElementById('cam4-shadow');
  var tsEl = document.getElementById('camera-ts');

  // Draw room outlines with CSS
  function addRoomElements() {
    // Cam1: office - desks
    cam1.innerHTML += '<div style="position:absolute;bottom:40px;left:20px;width:50px;height:30px;border:1px solid rgba(255,255,255,0.2);"></div>';
    cam1.innerHTML += '<div style="position:absolute;bottom:40px;left:90px;width:50px;height:30px;border:1px solid rgba(255,255,255,0.2);"></div>';
    cam1.innerHTML += '<div style="position:absolute;bottom:40px;right:20px;width:50px;height:30px;border:1px solid rgba(255,255,255,0.2);"></div>';
    // Cam2: corridor - perspective lines
    cam2.innerHTML += '<div style="position:absolute;inset:0;background:linear-gradient(to bottom, transparent 20%, rgba(255,255,255,0.03) 50%, transparent 80%);"></div>';
    // Cam3: server room - blinking LEDs
    for (var i = 0; i < 6; i++) {
      cam3.innerHTML += '<div style="position:absolute;bottom:'+(30+i*25)+'px;left:'+(20+i*30)+'px;width:4px;height:4px;border-radius:50%;background:#0f0;animation:blink 1s step-end infinite '+(i*0.2)+'s;"></div>';
    }
    // Cam4: your room - desk and chair
    cam4.innerHTML += '<div style="position:absolute;bottom:30px;left:30px;width:60px;height:40px;border:1px solid rgba(255,255,255,0.2);"></div>';
    cam4.innerHTML += '<div style="position:absolute;bottom:30px;right:30px;width:30px;height:40px;border:1px solid rgba(255,255,255,0.15);"></div>';
    cam4.innerHTML += '<div id="cam4-shadow" class="camera-shadow" style="bottom:30px;left:50%;margin-left:-20px;"></div>';
  }
  addRoomElements();

  // Update timestamp
  function updateTimestamp() {
    var elapsed = Math.floor((Date.now() - cameraState.startTime) / 1000);
    var h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    var m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    var s = String(elapsed % 60).padStart(2, '0');
    var el = document.getElementById('camera-time');
    if (el) el.textContent = h + ':' + m + ':' + s;
    horrorState.cameraTime = elapsed;
  }

  // Horror events timeline
  var events = [
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

  cameraState.timer = setInterval(function() {
    if (!FakeOS.windows['camera']) return;
    updateTimestamp();
    var elapsed = (Date.now() - cameraState.startTime) / 1000;
    events.forEach(function(ev) {
      if (elapsed >= ev.time && cameraState.eventsFired.indexOf(ev.id) === -1) {
        cameraState.eventsFired.push(ev.id);
        ev.fn();
      }
    });
  }, 1000);

  cameraState.checkAlive = setInterval(function() {
    if (!FakeOS.windows['camera']) {
      clearInterval(cameraState.timer);
      clearInterval(cameraState.checkAlive);
    }
  }, 1000);
}
