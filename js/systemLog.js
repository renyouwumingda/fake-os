// ===== 系统日志 =====

function openSystemLog() {
  if (FakeOS.windows['systemLog']) { focusWindow('systemLog'); return; }
  trackAppOpen('systemLog');

  var content = '<div style="display:flex;flex-direction:column;height:100%;background:#0a0a0a;">'
    + '<div style="padding:6px 12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);">'
    + '<span style="color:#fff;font-family:monospace;font-size:13px;">\ud83d\udccb \u7cfb\u7edf\u65e5\u5fd7</span>'
    + '<input id="log-search" type="text" placeholder="\u641c\u7d22..." style="width:120px;padding:2px 6px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:4px;color:#fff;font-size:11px;"></div>'
    + '<div id="log-container" style="flex:1;overflow:auto;padding:8px;font-family:monospace;font-size:12px;"></div>'
    + '<div style="padding:4px 12px;border-top:1px solid rgba(255,255,255,0.1);font-size:11px;color:rgba(255,255,255,0.3);">\u5171 ' + LOG_ENTRIES.length + ' \u6761\u65e5\u5fd7</div>'
    + '</div>';

  createWindow('systemLog', '\ud83d\udccb \u7cfb\u7edf\u65e5\u5fd7', 500, 400, content);

  var container = document.getElementById('log-container');
  var searchInput = document.getElementById('log-search');

  function renderLogs(filter) {
    if (!container) return;
    container.innerHTML = '';
    LOG_ENTRIES.forEach(function(entry) {
      if (filter && entry.msg.indexOf(filter) === -1 && entry.level.indexOf(filter) === -1) return;
      var div = document.createElement('div');
      var color = entry.level === 'ERROR' ? '#f55' : entry.level === 'WARN' ? '#fa0' : entry.level === '???' ? '#f55' : 'rgba(255,255,255,0.6)';
      div.style.color = color;
      if (entry.level === '???') div.className = 'log-weird';
      div.textContent = '[' + entry.time + '] ' + entry.level.padEnd(5) + ' ' + entry.msg;
      container.appendChild(div);
    });
  }

  renderLogs('');

  searchInput.addEventListener('input', function() {
    var val = searchInput.value.trim();
    renderLogs(val);
    if (val && SEARCH_TRIGGERS[val.toLowerCase()]) {
      setTimeout(function() {
        var div = document.createElement('div');
        div.className = 'log-weird';
        div.textContent = '[???  ] ' + SEARCH_TRIGGERS[val.toLowerCase()];
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
      }, 500);
    }
  });

  container.addEventListener('scroll', function() {
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 5) {
      if (!container.querySelector('.log-bottom-msg')) {
        var div = document.createElement('div');
        div.className = 'log-weird log-bottom-msg';
        div.textContent = '[???  ] \u4f60\u4e3a\u4ec0\u4e48\u8981\u5f80\u4e0b\u770b\uff1f';
        container.appendChild(div);
      }
    }
  });
}