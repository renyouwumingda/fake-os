// ===== 对话系统（基于 StoryGraph） =====
var DialogueSystem = {
  isPlaying: false,
  rounds: MAINTAINER_ROUNDS,

  // 检查并触发对话（保留兼容性，实际触发由 StoryEvents 管理）
  checkAndTrigger: function() {
    if (this.isPlaying) return;
    if (typeof StoryVariables !== 'undefined') StoryVariables.syncFromHorror();
    if (typeof StoryEvents !== 'undefined') StoryEvents.check();
  },

  // 显示选项按钮（兼容旧接口）
  showChoices: function(options, callback) {
    var chatEl = document.getElementById('chat-messages');
    if (!chatEl) { callback(0); return; }
    var container = document.createElement('div');
    container.className = 'chat-choices';
    container.style.cssText = 'padding:8px 12px;display:flex;gap:6px;flex-wrap:wrap;';
    options.forEach(function(opt, i) {
      var btn = document.createElement('button');
      btn.textContent = opt;
      btn.style.cssText = 'padding:6px 12px;background:rgba(76,175,80,0.2);border:1px solid rgba(76,175,80,0.4);border-radius:12px;color:#4caf50;cursor:pointer;font-size:12px;transition:all 0.2s;';
      btn.onmouseenter = function() { btn.style.background = 'rgba(76,175,80,0.4)'; };
      btn.onmouseleave = function() { btn.style.background = 'rgba(76,175,80,0.2)'; };
      btn.onclick = function() {
        if (typeof addUserMsg === 'function') addUserMsg('maintainer', opt);
        container.querySelectorAll('button').forEach(function(b) { b.disabled = true; b.style.opacity = '0.5'; b.style.cursor = 'default'; });
        callback(i);
      };
      container.appendChild(btn);
    });
    chatEl.appendChild(container);
    chatEl.scrollTop = chatEl.scrollHeight;
  },
};
