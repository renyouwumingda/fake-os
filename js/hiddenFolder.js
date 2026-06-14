// ===== 隐藏文件夹 =====
var hiddenState = { filesOpened: 0, mysteryShown: false };

function openHiddenFolder() {
  if (FakeOS.windows['hiddenFolder']) { focusWindow('hiddenFolder'); return; }
  trackAppOpen('hiddenFolder');
  horrorState.hiddenFound = true;

  var files = HIDDEN_FILES.slice();
  if (hiddenState.filesOpened >= 3 && !hiddenState.mysteryShown) {
    hiddenState.mysteryShown = true;
    files.push({ name: '????.txt', size: '???', content: '\u4f60\u7ffb\u5f97\u8d8a\u6df1\uff0c\u79bb\u51fa\u53e3\u5c31\u8d8a\u8fdc\u3002' });
  }
  // Shuffle
  for (var i = files.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = files[i]; files[i] = files[j]; files[j] = tmp;
  }

  var html = '<div style="display:flex;flex-direction:column;height:100%;background:#1a1a2e;">'
    + '<div style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.1);color:#fff;font-family:monospace;font-size:13px;">\ud83d\udcc2 \u9690\u85cf\u6587\u4ef6\u5939</div>'
    + '<div id="hidden-file-list" style="flex:1;overflow:auto;padding:4px 0;"></div>'
    + '<div style="padding:4px 12px;border-top:1px solid rgba(255,255,255,0.1);font-size:11px;color:rgba(255,255,255,0.3);">\u5171 ' + files.length + ' \u4e2a\u6587\u4ef6</div>'
    + '</div>';

  createWindow('hiddenFolder', '\ud83d\udcc2 \u9690\u85cf\u6587\u4ef6\u5939', 400, 350, html);

  var list = document.getElementById('hidden-file-list');
  files.forEach(function(f) {
    var row = document.createElement('div');
    row.style.cssText = 'padding:8px 12px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;justify-content:space-between;font-family:monospace;font-size:12px;';
    row.innerHTML = '<span style="color:#ccc;">\ud83d\udcc4 ' + f.name + '</span><span style="color:rgba(255,255,255,0.3);">' + f.size + '</span>';
    row.onmouseenter = function() { row.style.background = 'rgba(255,255,255,0.05)'; };
    row.onmouseleave = function() { row.style.background = ''; };
    row.onclick = function() {
      hiddenState.filesOpened++;
      showAlert(f.name, f.content);
    };
    list.appendChild(row);
  });
}