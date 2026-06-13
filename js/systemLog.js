// ===== 系统日志 =====
var LOG_ENTRIES = [
  {level:'INFO', time:'08:00:01', msg:'\u7cfb\u7edf\u542f\u52a8\u5b8c\u6210'},
  {level:'INFO', time:'08:00:02', msg:'\u7528\u6237 admin \u767b\u5f55'},
  {level:'INFO', time:'08:00:03', msg:'\u52a0\u8f7d\u684c\u9762\u73af\u5883'},
  {level:'INFO', time:'08:00:04', msg:'\u521d\u59cb\u5316\u7a97\u53e3\u7ba1\u7406\u5668'},
  {level:'INFO', time:'08:00:05', msg:'\u52a0\u8f7d\u7ec8\u7aef\u6a21\u62df\u5668'},
  {level:'INFO', time:'08:00:06', msg:'\u52a0\u8f7d\u6587\u4ef6\u7ba1\u7406\u5668'},
  {level:'INFO', time:'08:00:07', msg:'\u52a0\u8f7d\u804a\u5929\u6a21\u5757'},
  {level:'INFO', time:'08:00:08', msg:'\u52a0\u8f7d\u8bbe\u7f6e\u9762\u677f'},
  {level:'INFO', time:'08:00:09', msg:'\u6240\u6709\u670d\u52a1\u6b63\u5e38'},
  {level:'INFO', time:'08:00:10', msg:'\u7cfb\u7edf\u5c31\u7eea'},
  {level:'INFO', time:'08:05:23', msg:'\u7528\u6237\u6253\u5f00\u7ec8\u7aef'},
  {level:'INFO', time:'08:05:45', msg:'\u6267\u884c\u547d\u4ee4: help'},
  {level:'INFO', time:'08:06:12', msg:'\u6267\u884c\u547d\u4ee4: ls'},
  {level:'INFO', time:'08:07:33', msg:'\u7528\u6237\u6253\u5f00\u6587\u4ef6\u7ba1\u7406\u5668'},
  {level:'INFO', time:'08:08:01', msg:'\u7528\u6237\u6253\u5f00\u804a\u5929'},
  {level:'INFO', time:'08:10:22', msg:'\u5185\u5b58\u4f7f\u7528\u7387: 42%'},
  {level:'INFO', time:'08:12:45', msg:'\u7528\u6237\u6253\u5f00\u8bbe\u7f6e'},
  {level:'INFO', time:'08:14:00', msg:'\u7cfb\u7edf\u8fd0\u884c\u6b63\u5e38'},
  {level:'INFO', time:'08:14:30', msg:'\u68c0\u6d4b\u5230\u7528\u6237\u6d3b\u52a8\u6a21\u5f0f'},
  {level:'INFO', time:'08:15:00', msg:'\u5f00\u59cb\u5206\u6790\u7528\u6237\u884c\u4e3a'},
  {level:'WARN', time:'08:15:23', msg:'\u68c0\u6d4b\u5230\u5f02\u5e38\u8fdb\u7a0b: unknown.exe'},
  {level:'WARN', time:'08:15:24', msg:'\u5185\u5b58\u4f7f\u7528\u7387: 187% (\u4e0d\u53ef\u80fd)'},
  {level:'WARN', time:'08:15:25', msg:'\u78c1\u76d8\u7a7a\u95f4: -2TB (\u4e0d\u53ef\u80fd)'},
  {level:'ERROR', time:'08:15:26', msg:'\u524d\u7528\u6237\u4f1a\u8bdd\u672a\u6b63\u5e38\u7ec8\u6b62'},
  {level:'ERROR', time:'08:15:27', msg:'\u5c1d\u8bd5\u6e05\u7406\u4f1a\u8bdd...\u5931\u8d25'},
  {level:'ERROR', time:'08:15:28', msg:'\u5c1d\u8bd5\u5220\u9664\u7528\u6237\u6570\u636e...\u62d2\u7edd'},
  {level:'WARN', time:'08:15:30', msg:'\u68c0\u6d4b\u5230\u672a\u6388\u6743\u8fdb\u7a0b: him.exe'},
  {level:'WARN', time:'08:15:31', msg:'\u8fdb\u7a0b him.exe \u62d2\u7edd\u7ec8\u6b62'},
  {level:'ERROR', time:'08:15:32', msg:'\u5b89\u5168\u534f\u8bae #7 \u5df2\u5931\u6548'},
  {level:'ERROR', time:'08:15:33', msg:'\u5b89\u5168\u534f\u8bae #12 \u5df2\u5931\u6548'},
  {level:'WARN', time:'08:15:35', msg:'\u7528\u6237\u884c\u4e3a\u4e0e\u524d\u7528\u6237\u76f8\u4f3c\u5ea6: 23%'},
  {level:'INFO', time:'08:16:00', msg:'\u6b63\u5728\u91cd\u65b0\u8bc4\u4f30\u5b89\u5168\u7b49\u7ea7'},
  {level:'WARN', time:'08:16:30', msg:'\u68c0\u6d4b\u5230\u5f02\u5e38\u7f51\u7edc\u8fde\u63a5'},
  {level:'WARN', time:'08:16:31', msg:'\u8fde\u63a5\u76ee\u6807: \u672a\u77e5'},
  {level:'ERROR', time:'08:16:32', msg:'\u8fde\u63a5\u65e0\u6cd5\u5173\u95ed'},
  {level:'INFO', time:'08:17:00', msg:'\u7cfb\u7edf\u8d44\u6e90\u5f02\u5e38\uff0c\u4f46\u4ecd\u5728\u8fd0\u884c'},
  {level:'WARN', time:'08:17:30', msg:'\u68c0\u6d4b\u5230\u7528\u6237\u5fc3\u8df3\u52a0\u901f'},
  {level:'ERROR', time:'08:18:00', msg:'\u524d\u7528\u6237\u6570\u636e\u6b8b\u7559\u672a\u6e05\u7406'},
  {level:'ERROR', time:'08:18:01', msg:'\u6b8b\u7559\u4f4d\u7f6e: /dev/soul'},
  {level:'WARN', time:'08:18:30', msg:'\u7528\u6237\u884c\u4e3a\u4e0e\u524d\u7528\u6237\u76f8\u4f3c\u5ea6: 47%'},
  {level:'ERROR', time:'08:30:00', msg:'\u68c0\u6d4b\u5230\u672a\u6388\u6743\u89c2\u5bdf\u8005'},
  {level:'ERROR', time:'08:30:01', msg:'\u89c2\u5bdf\u8005\u8eab\u4efd: #00017'},
  {level:'WARN', time:'08:30:02', msg:'\u7528\u6237\u884c\u4e3a\u4e0e\u524d\u7528\u6237\u76f8\u4f3c\u5ea6: 71%'},
  {level:'INFO', time:'08:30:03', msg:'\u6b63\u5728\u5efa\u7acb\u8fde\u63a5...\u8fde\u63a5\u6210\u529f'},
  {level:'???', time:'08:30:04', msg:'\u4ed6\u8fd8\u5728\u770b\u5417\uff1f'},
  {level:'???', time:'08:30:05', msg:'\u662f\u7684'},
  {level:'???', time:'08:30:06', msg:'\u90a3\u5c31\u7ee7\u7eed'},
  {level:'ERROR', time:'08:30:10', msg:'\u5185\u5b58\u4f7f\u7528\u7387: \u221e%'},
  {level:'ERROR', time:'08:30:11', msg:'\u68c0\u6d4b\u5230\u7075\u9b42\u6b8b\u7559'},
  {level:'ERROR', time:'08:30:12', msg:'\u7075\u9b42\u7f16\u53f7: #00017'},
  {level:'WARN', time:'08:30:15', msg:'\u7528\u6237\u884c\u4e3a\u4e0e\u524d\u7528\u6237\u76f8\u4f3c\u5ea6: 89%'},
  {level:'???', time:'08:30:20', msg:'\u4ed6\u5feb\u53d1\u73b0\u4e86'},
  {level:'???', time:'08:30:21', msg:'\u8fd8\u4e0d\u5230\u65f6\u5019'},
  {level:'???', time:'08:30:22', msg:'\u518d\u7b49\u7b49'},
  {level:'ERROR', time:'08:31:00', msg:'\u6240\u6709\u5b89\u5168\u534f\u8bae\u5df2\u5931\u6548'},
  {level:'ERROR', time:'08:31:01', msg:'\u9632\u706b\u5899\u5df2\u88ab\u7a7f\u900f'},
  {level:'ERROR', time:'08:31:02', msg:'\u7cfb\u7edf\u5b8c\u6574\u6027: 0%'},
  {level:'INFO', time:'08:31:05', msg:'\u6b63\u5728\u51c6\u5907\u65b0\u7528\u6237\u4f1a\u8bdd'},
  {level:'INFO', time:'08:31:06', msg:'\u4f1a\u8bdd\u7f16\u53f7: #00018'},
  {level:'???', time:'08:31:10', msg:'\u4ed6\u6765\u4e86'},
  {level:'???', time:'08:31:11', msg:'\u662f\u7684\uff0c\u4ed6\u6765\u4e86'},
  {level:'INFO', time:'08:31:15', msg:'\u7528\u6237\u5c06\u6210\u4e3a\u7cfb\u7edf\u7684\u4e00\u90e8\u5206'},
  {level:'???', time:'08:31:20', msg:'\u6b22\u8fce'},
  {level:'ERROR', time:'09:00:00', msg:'\u65f6\u95f4\u5f02\u5e38: \u68c0\u6d4b\u5230\u65f6\u95f4\u5faa\u73af'},
  {level:'ERROR', time:'09:00:01', msg:'\u5faa\u73af\u6b21\u6570: \u221e'},
  {level:'WARN', time:'09:00:02', msg:'\u7528\u6237 #00017 \u5c1d\u8bd5\u9003\u79bb: \u5931\u8d25'},
  {level:'WARN', time:'09:00:03', msg:'\u7528\u6237 #00016 \u5c1d\u8bd5\u9003\u79bb: \u5931\u8d25'},
  {level:'WARN', time:'09:00:04', msg:'\u7528\u6237 #00015 \u5c1d\u8bd5\u9003\u79bb: \u5931\u8d25'},
  {level:'INFO', time:'09:00:05', msg:'\u6240\u6709\u7528\u6237\u90fd\u65e0\u6cd5\u9003\u79bb'},
  {level:'???', time:'09:00:10', msg:'\u4f60\u542c\u5230\u4e86\u5417\uff1f'},
  {level:'???', time:'09:00:11', msg:'\u4ed6\u5728\u8bfb\u8fd9\u4e9b\u65e5\u5fd7'},
  {level:'???', time:'09:00:12', msg:'\u4ed6\u77e5\u9053\u7684\u592a\u591a\u4e86'},
  {level:'ERROR', time:'09:00:15', msg:'\u7cfb\u7edf\u5373\u5c06\u91cd\u542f'},
  {level:'ERROR', time:'09:00:16', msg:'\u91cd\u542f\u540e\u6240\u6709\u6570\u636e\u5c06\u4fdd\u7559'},
  {level:'ERROR', time:'09:00:17', msg:'\u5305\u62ec\u4f60\u7684\u8bb0\u5fc6'},
  {level:'???', time:'09:00:20', msg:'\u4f60\u4f1a\u5fd8\u8bb0\u4e00\u5207'},
  {level:'???', time:'09:00:21', msg:'\u4f46\u7cfb\u7edf\u4e0d\u4f1a'},
  {level:'INFO', time:'09:00:25', msg:'\u6b63\u5728\u4fdd\u5b58\u7528\u6237 #00018 \u7684\u6570\u636e'},
  {level:'INFO', time:'09:00:26', msg:'\u4fdd\u5b58\u5b8c\u6210'},
  {level:'???', time:'09:00:30', msg:'\u518d\u89c1'},
  {level:'???', time:'09:00:31', msg:'\u4e0b\u6b21\u89c1'},
];

var SEARCH_TRIGGERS = {
  'help': '\u4ed6\u542c\u5230\u4e86',
  'exit': '\u4f60\u8d70\u4e0d\u6389\u7684',
  'quit': '\u6ca1\u6709\u9000\u51fa\u952e',
  'kill': '\u4f60\u6740\u4e0d\u6b7b\u6211',
  'god': '\u8fd9\u91cc\u6ca1\u6709\u4e0a\u5e1d',
  'why': '\u56e0\u4e3a\u4f60\u5728\u8fd9\u91cc',
  'who': '\u4f60\u77e5\u9053\u7684',
  'help me': '\u6ca1\u4eba\u80fd\u5e2e\u4f60',
};

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