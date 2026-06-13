// ===== 镜像 =====
function openMirror() {
  if (FakeOS.windows['mirror']) { focusWindow('mirror'); return; }
  trackAppOpen('mirror');

  var inputCount = 0;
  var eventsFired = {};

  var content = '<div style="display:flex;flex-direction:column;height:100%;background:#0a0a0a;">'
    + '<div style="padding:6px 12px;border-bottom:1px solid rgba(255,255,255,0.1);">'
    + '<span style="color:#fff;font-family:monospace;font-size:13px;">\ud83e\ude9e \u955c\u50cf</span>'
    + '</div>'
    + '<div style="flex:1;display:flex;flex-direction:column;padding:16px;gap:16px;">'
    + '<div><div style="font-size:11px;color:rgba(255,255,255,0.3);margin-bottom:4px;">\u8f93\u5165\u6587\u5b57</div>'
    + '<textarea id="mirror-input" style="width:calc(100% - 4px);height:80px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:6px;color:#fff;padding:8px;font-size:16px;resize:none;font-family:monospace;box-sizing:border-box;"></textarea></div>'
    + '<div><div style="font-size:11px;color:rgba(255,255,255,0.3);margin-bottom:4px;">\u955c\u50cf\u663e\u793a</div>'
    + '<div id="mirror-output" class="mirror-output" style="width:calc(100% - 4px);height:80px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:8px;font-size:16px;overflow:auto;display:flex;align-items:center;justify-content:flex-end;box-sizing:border-box;"></div></div>'
    + '</div>'
    + '<div style="padding:4px 12px;border-top:1px solid rgba(255,255,255,0.1);font-size:11px;color:rgba(255,255,255,0.3);">\u8f93\u5165\u6b21\u6570: <span id="mirror-count">0</span></div>'
    + '</div>';

  createWindow('mirror', '\ud83e\ude9e \u955c\u50cf', 600, 400, content);

  var input = document.getElementById('mirror-input');
  var output = document.getElementById('mirror-output');
  var countEl = document.getElementById('mirror-count');

  function updateMirror() {
    if (!output) return;
    var text = input.value;
    output.textContent = text;
  }

  input.addEventListener('input', function() {
    inputCount++;
    horrorState.mirrorInputs = inputCount;
    if (countEl) countEl.textContent = inputCount;

    // Delay increases with input count
    var delay = 0;
    if (inputCount >= 22) delay = 1000;
    else if (inputCount >= 12) delay = 500;
    else if (inputCount >= 8) delay = 300;

    setTimeout(updateMirror, delay);

    // Horror events
    if (inputCount === 6 && !eventsFired[6]) {
      eventsFired[6] = true;
      output.textContent = input.value + '\u4f60';
      output.classList.add('mirror-ghost');
      setTimeout(function() { output.classList.remove('mirror-ghost'); updateMirror(); }, 2000);
    }
    if (inputCount === 10 && !eventsFired[10]) {
      eventsFired[10] = true;
      output.textContent = '\u4f60\u597d';
      output.classList.add('mirror-ghost');
      setTimeout(function() { output.classList.remove('mirror-ghost'); updateMirror(); }, 2000);
    }
    if (inputCount === 15 && !eventsFired[15]) {
      eventsFired[15] = true;
      output.textContent = '\u6211\u77e5\u9053\u4f60\u5728\u8bf4\u4ec0\u4e48';
      output.classList.add('mirror-ghost');
      setTimeout(function() { output.classList.remove('mirror-ghost'); updateMirror(); }, 2000);
    }
    if (inputCount === 18 && !eventsFired[18]) {
      eventsFired[18] = true;
      // Reverse direction - show normal text
      output.style.transform = 'none';
      output.style.direction = 'ltr';
      output.textContent = input.value;
    }
    if (inputCount === 20 && !eventsFired[20]) {
      eventsFired[20] = true;
      output.textContent = '\u955c\u5b50\u91cc\u7684\u4f60\uff0c\u6b63\u5728\u770b\u7740\u4f60';
      output.classList.add('mirror-ghost');
    }
    if (inputCount === 25 && !eventsFired[25]) {
      eventsFired[25] = true;
      showAlert('\u2139\ufe0f', '\u955c\u5b50\u91cc\u7684\u4f60\uff0c\u6b63\u5728\u770b\u7740\u4f60\u3002');
    }
    if (inputCount === 28 && !eventsFired[28]) {
      eventsFired[28] = true;
      output.textContent = '\u4e0d\u8981\u56de\u5934';
      output.classList.add('mirror-ghost');
    }
    if (inputCount === 30 && !eventsFired[30]) {
      eventsFired[30] = true;
      if (FakeOS.windows['mirror']) closeWindow('mirror');
    }
    checkHorrorLevel();
  });
}