// ===== 记事本 =====
var notepadSaveCount = 0;

function openNotepad(fileName, content) {
  fileName = fileName || "无标题.txt";
  content = content || "";

  var safeContent = content.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  createWindow("notepad_" + Date.now(), "📝 " + fileName, 500, 350,
    '<div style="display:flex;flex-direction:column;height:100%;">' +
      '<div style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;gap:8px;align-items:center;">' +
        '<button class="notepad-btn" onclick="notepadSave(this)">💾 保存</button>' +
        '<button class="notepad-btn" onclick="notepadNew()">📄 新建</button>' +
        '<span style="flex:1;"></span>' +
        '<span id="notepad-status" style="font-size:11px;color:rgba(255,255,255,0.3);">就绪</span>' +
      '</div>' +
      '<textarea id="notepad-text" style="flex:1;background:#0d0d1a;border:none;color:#e0e0e0;padding:12px;font-family:monospace;font-size:14px;resize:none;outline:none;box-sizing:border-box;width:100%;">' + safeContent + '</textarea>' +
    '</div>'
  );
}

function notepadSave(btn) {
  var textarea = document.getElementById("notepad-text");
  if (!textarea) return;
  notepadSaveCount++;
  var statusEl = document.getElementById("notepad-status");
  if (!statusEl) return;

  if (notepadSaveCount === 5) {
    statusEl.textContent = "💾 你已经保存 5 次了。但什么都没有保存。";
    return;
  }

  var text = textarea.value;
  if (text.indexOf("FakeOS") >= 0) {
    statusEl.textContent = "💾 已保存。（FakeOS 是最好的操作系统，才怪。）";
  } else if (text.indexOf("日记") >= 0) {
    statusEl.textContent = "💾 写日记吗？小心被人看到。";
  } else {
    var msgs = ["💾 已保存。（假的）","💾 保存成功。（什么都没发生）","💾 文件已保存。在另一个宇宙里。","💾 好了，它被保存了。相信我。"];
    statusEl.textContent = msgs[notepadSaveCount % msgs.length];
  }
}

function notepadNew() {
  var textarea = document.getElementById("notepad-text");
  if (textarea) textarea.value = "";
  var statusEl = document.getElementById("notepad-status");
  if (statusEl) statusEl.textContent = "📄 新文件。（但什么都不会存）";
}
