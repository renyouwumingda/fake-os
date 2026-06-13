// ===== 回收站 =====
var recycleBinState = { openedCount: 0, extraShown: false };

var RECYCLE_FILES = [
  {name:"会议记录.txt",size:"2KB",content:"2026/03/15 会议记录\n\n参会人：张三、李四、王五\n议题：Q2 目标\n结论：继续推进\n\n---\n\n2026/03/16 补充\n他们开始监控我了\n我不知道还能写多久\n如果有人看到这些，请联系\n\n[记录中断]"},
  {name:"给自己的信.txt",size:"1KB",content:"亲爱的我：\n\n如果你在读这封信，说明你也发现了。\n别让他们知道你知道。\n把这封信删掉。\n\n等等，你正在回收站里读这封信。\n那说明你已经无法删除它了。\n\n祝好运。"},
  {name:"系统日志.log",size:"5KB",content:"[2026-01-01 00:00:01] System boot\n[2026-01-01 00:00:02] Loading FakeOS v0.1.3\n[2026-01-01 00:00:03] WARNING: Sanity module not found\n[2026-02-14 03:33:33] Previous user terminated.\n[2026-02-14 03:33:34] Reason: They found out.\n[2026-03-01 00:00:00] New user assigned.\n[2026-03-01 00:00:01] Monitoring enabled.\n[2026-06-01 12:00:00] WARNING: User accessing recycle bin.\n[2026-06-01 12:00:01] Initiating observation protocol."},
  {name:"不要打开.txt",size:"0KB",content:"我说了不要打开。"},
  {name:"照片_删除确认.jpg",size:"666KB",content:"[图片文件已删除]\n\n删除原因：照片中的人不应该存在。\n删除操作员：系统\n删除时间：未知\n\n附注：即使删除了，你仍然能感觉到它在看着你。"},
  {name:"备份_最后一个.txt",size:"3KB",content:"=== FAKEOS 系统备份 ===\n备份编号：最后一条\n\n这是最后一条备份。\n如果你看到了这条消息，请不要重启系统。\n不要重启。\n不要。\n\n.\n\n..\n\n...\n\n我骗你的。重启吧。\n反正结果都一样。"},
];

function openRecycleBin() {
  recycleBinState.openedCount++;
  recycleBinState.extraShown = false;

  var files = RECYCLE_FILES.slice();
  // Shuffle
  for (var i = files.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = files[i]; files[i] = files[j]; files[j] = tmp;
  }

  var listHtml = "";
  files.forEach(function(f, idx) {
    listHtml += '<div class="fm-file rb-file" data-idx="' + idx + '" data-name="' + f.name + '">'
      + '<div class="fm-file-icon">📄</div>'
      + '<div class="fm-file-name">' + f.name + '</div>'
      + '<div class="fm-file-size">' + f.size + '</div>'
      + '</div>';
  });

  var content = '<div style="display:flex;flex-direction:column;height:100%;">'
    + '<div style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;">'
    + '<span style="font-size:13px;color:rgba(255,255,255,0.5);">共 ' + files.length + ' 个项目</span>'
    + '<span style="flex:1;"></span>'
    + '<button class="notepad-btn" onclick="emptyRecycleBin()" style="font-size:11px;">🗑️ 清空回收站</button>'
    + '</div>'
    + '<div id="rb-list" style="flex:1;overflow-y:auto;padding:4px 0;">' + listHtml + '</div>'
    + '</div>';

  var win = createWindow("recycleBin", "🗑️ 回收站", 400, 350, content);

  var fileClickCount = 0;
  document.querySelectorAll(".rb-file").forEach(function(el) {
    el.addEventListener("click", function() {
      var idx = parseInt(el.getAttribute("data-idx"));
      var file = files[idx];
      if (!file) return;
      fileClickCount++;

      createWindow("rb_" + file.name, "📄 " + file.name, 380, 280,
        '<div style="padding:16px;white-space:pre-wrap;font-family:monospace;font-size:13px;color:#ccc;height:100%;overflow:auto;">'
        + escapeHtml(file.content) + '</div>');

      // Show hidden file after 4th click
      if (fileClickCount >= 4 && !recycleBinState.extraShown) {
        recycleBinState.extraShown = true;
        var list = document.getElementById("rb-list");
        if (list) {
          var extra = document.createElement("div");
          extra.className = "fm-file rb-file";
          extra.style.animation = "windowOpen 0.3s ease-out";
          extra.innerHTML = '<div class="fm-file-icon">📄</div><div class="fm-file-name" style="color:#f55;">????.txt</div><div class="fm-file-size">??KB</div>';
          extra.addEventListener("click", function() {
            createWindow("rb_????", "📄 ????.txt", 380, 280,
              '<div style="padding:16px;white-space:pre-wrap;font-family:monospace;font-size:13px;color:#f55;height:100%;overflow:auto;">'
              + "你翻得越深，离出口就越远。" + '</div>');
          });
          list.appendChild(extra);
        }
      }
    });
  });
}

function emptyRecycleBin() {
  showAlert("无法清空", "这些文件不想被删除。");
}
