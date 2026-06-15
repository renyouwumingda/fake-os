// ===== 通知系统 =====
var notifState = { queue: [], active: [], count: 0 };

function showNotification(title, text, icon, onClick) {
  icon = icon || "ℹ️";
  notifState.count++;

  // Easter egg: 10th notification
  if (notifState.count === 10) {
    title = "第 10 条通知";
    text = "没有一条是重要的。";
    icon = "🎉";
  }
  // Random easter egg
  if (notifState.count > 10 && Math.random() < 0.03) {
    text = "我能在你背后看到你。";
    icon = "👁️";
  }

  var notif = document.createElement("div");
  notif.className = "notification-toast";
  notif.style.cssText =
    "position:fixed;bottom:56px;right:16px;background:rgba(26,26,46,0.95);" +
    "backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);" +
    "border-radius:10px;padding:12px 16px;max-width:320px;" +
    "box-shadow:0 8px 32px rgba(0,0,0,0.5);z-index:6000;" +
    "font-family:'Segoe UI',sans-serif;cursor:pointer;" +
    "animation:notifSlideIn 0.3s ease-out;";
  notif.innerHTML =
    '<div style="display:flex;align-items:flex-start;gap:10px;">' +
      '<span style="font-size:20px;flex-shrink:0;">' + icon + '</span>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:13px;font-weight:600;color:#fff;margin-bottom:4px;">' + title + '</div>' +
        '<div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.4;">' + text + '</div>' +
      '</div>' +
      '<button style="background:none;border:none;color:rgba(255,255,255,0.3);cursor:pointer;font-size:16px;padding:0;line-height:1;" onclick="this.parentElement.parentElement.remove()">×</button>' +
    '</div>';

  document.body.appendChild(notif);
  notifState.active.push(notif);

  // Remove oldest if too many
  if (notifState.active.length > 3) {
    var old = notifState.active.shift();
    if (old.parentNode) old.parentNode.removeChild(old);
  }

  // Auto dismiss after 4 seconds
  setTimeout(function() {
    if (notif.parentNode) {
      notif.style.animation = "notifFadeOut 0.3s forwards";
      setTimeout(function() {
        if (notif.parentNode) notif.parentNode.removeChild(notif);
      }, 300);
    }
    notifState.active = notifState.active.filter(function(n) { return n !== notif; });
  }, 4000);

  // Click handler
  if (onClick) {
    notif.addEventListener("click", function(e) {
      if (e.target.tagName === "BUTTON") return;
      onClick();
      if (notif.parentNode) notif.parentNode.removeChild(notif);
    });
  } else {
    notif.addEventListener("click", function(e) {
      if (e.target.tagName === "BUTTON") return;
      if (notif.parentNode) notif.parentNode.removeChild(notif);
    });
  }
}

// Inject notification CSS
var notifStyle = document.createElement("style");
notifStyle.textContent = 
  "@keyframes notifSlideIn {" +
  "  from { transform: translateX(100%); opacity: 0; }" +
  "  to { transform: translateX(0); opacity: 1; }" +
  "}" +
  "@keyframes notifFadeOut {" +
  "  from { transform: translateX(0); opacity: 1; }" +
  "  to { transform: translateX(100%); opacity: 0; }" +
  "}";
document.head.appendChild(notifStyle);

// Trigger notifications from various events
document.addEventListener("DOMContentLoaded", function() {
  // Welcome notification after login
  var checkInterval = setInterval(function() {
    if (FakeOS.state === "desktop") {
      clearInterval(checkInterval);
      setTimeout(function() {
        showNotification("👋 欢迎回来", "……也许。", "👋");
      }, 3000);
      // Night greeting
      var h = new Date().getHours();
      if (h >= 23 || h < 6) {
        setTimeout(function() {
          showNotification("🌙 这么晚了", "还没睡？", "🌙");
        }, 5000);
      }
    }
  }, 500);
});

// Watch for chat messages
var origAddNpcMsg = typeof addNpcMsg !== "undefined" ? addNpcMsg : null;
// Hook into chat message sending via polling
setInterval(function() {
  var chatMsgs = document.getElementById("chat-messages");
  if (!chatMsgs) return;
  var lastMsg = chatMsgs.lastElementChild;
  if (!lastMsg || lastMsg._notified) return;
  lastMsg._notified = true;
  if (lastMsg.classList.contains("chat-msg") && lastMsg.classList.contains("npc")) {
    var sender = lastMsg.querySelector(".msg-sender");
    if (sender) {
      var name = sender.textContent.trim();
      var text = lastMsg.textContent.replace(name, "").trim();
      showNotification("📩 " + name, text, "💬", function() {
        openApp("chat");
      });
    }
  }
}, 2000);
