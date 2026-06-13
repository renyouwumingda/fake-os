// ===== 聊天 =====
const CHAT_CONTACTS = {
  xiaohong: {name:"小红",avatar:"👩",status:"产品经理",online:true},
  laowang: {name:"老王",avatar:"👨",status:"技术总监",online:true},
  system: {name:"系统通知",avatar:"🤖",status:"FakeOS 系统",online:true},
  anonymous: {name:"???",avatar:"😈",status:"未知用户",online:true},
  virus_chat: {name:"病毒",avatar:"💀",status:"我已经进来了。",online:false},
  maintainer: {name:"系统维护者",avatar:"💻",status:"曾经是系统维护者",online:true},
};

const NPC_MESSAGES = {
  xiaohong: ["这个按钮能不能再大一点？","用户说想要一个 AI 功能，明天能做出来吗？","我改主意了，旧的更好。"],
  laowang: ["这代码谁写的？跟屎一样。","又改需求？行吧。","你试过关机重启吗？","服务器着火了。字面意思。"],
  system: ["检测到异常登录。","您的密码已在暗网泄露。开玩笑的。","恭喜！您获得了免费升级！","新版本更新了更多 bug。"],
  anonymous: ["他们都在看着你。","你以为这是假的？","我知道你去年夏天做了什么。","回头看。开玩笑的。嗯？"],
  virus_chat: ["我看见你了。","别想关掉我。","我进来了。","这不是演习。"],
  maintainer: ["你好。我知道你在看。","我是系统维护者。或者曾经是。","别害怕。我不是来伤害你的。"],
};

var sendMsg = null;
let selectedContact = "xiaohong";
let userSentCount = 0;
let chatInterval = null;
var chatHistories = {};

function openChat() {
  if (FakeOS.windows["chat"]) { focusWindow("chat"); return; }

  chatHistories = {};
  Object.keys(CHAT_CONTACTS).forEach(function(id) { chatHistories[id] = []; });

  var content = '<div class="chat-body"><div class="chat-contacts" id="chat-contacts"></div><div class="chat-window"><div class="chat-messages" id="chat-messages"></div><div class="chat-input-area"><input class="chat-input" id="chat-input" placeholder="输入消息..."><button class="chat-send-btn" id="chat-send-btn">发送</button></div></div></div>';
  createWindow("chat", "聊天", 500, 400, content);
  buildContactList();
  addSystemMsg("欢迎来到 FakeChat！这里的每个人都绝对真实。");

  var input = document.getElementById("chat-input");
  var sendBtn = document.getElementById("chat-send-btn");

  sendMsg = function() {
    var msg = input.value.trim();
    if (!msg) return;
    addUserMsg(selectedContact, msg);
    handleReply(msg);
    input.value = "";
    userSentCount++;
    trackChat();
    checkMaintainerTrigger();
    if (userSentCount === 10) setTimeout(function() { addSystemMsg("消息发送失败。原因：你的社交技能为零。"); }, 500);
  };

  sendBtn.onclick = sendMsg;
  input.onkeydown = function(e) { if (e.key === "Enter") sendMsg(); };

  if (chatInterval) clearInterval(chatInterval);
  chatInterval = setInterval(function() {
    if (FakeOS.virusActive) {
      addNpcMsg("virus_chat", NPC_MESSAGES.virus_chat[Math.random() * NPC_MESSAGES.virus_chat.length | 0]);
      return;
    }
    var c = selectedContact;
    var msgs = NPC_MESSAGES[c];
    if (msgs) addNpcMsg(c, msgs[Math.random() * msgs.length | 0]);
  }, 8000 + Math.random() * 12000);

  var hour = new Date().getHours();
  if (hour >= 23 || hour < 6) setTimeout(function() { addSystemMsg("现在是深夜，正常人不会在线。你是正常人吗？"); }, 2000);
}

function handleReply(msg) {
  var lower = msg.toLowerCase();
  var replyContact = selectedContact;
  var greetings = ["你好！","嗨！","在吗？","来了来了。"];
  var defaults = ["有意思。我再想想。","好的，收到。","嗯嗯。","让我想想...","已读。"];
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("你好")) setTimeout(function() { addNpcMsg(replyContact, greetings[Math.random() * greetings.length | 0]); }, 1000);
  else if (lower.includes("ai")) setTimeout(function() { addNpcMsg(replyContact, "你怎么知道的？"); }, 1500);
  else if (lower.includes("help") || lower.includes("帮助")) setTimeout(function() { addNpcMsg(replyContact, "我也想帮你，但我只是个程序。"); }, 1000);
  else setTimeout(function() { addNpcMsg(replyContact, defaults[Math.random() * defaults.length | 0]); }, 2000);
}

function buildContactList() {
  var container = document.getElementById("chat-contacts");
  if (!container) return;
  container.innerHTML = "";
  Object.keys(CHAT_CONTACTS).forEach(function(id) {
    var c = CHAT_CONTACTS[id];
    var el = document.createElement("div");
    el.className = "chat-contact" + (id === selectedContact ? " active" : "");
    el.innerHTML = '<div class="chat-contact-avatar">' + c.avatar + '</div><div class="chat-contact-info"><div class="chat-contact-name">' + c.name + '</div><div class="chat-contact-status">' + c.status + '</div></div>';
    el.onclick = function() {
      selectedContact = id;
      document.querySelectorAll(".chat-contact").forEach(function(e) { e.classList.remove("active"); });
      el.classList.add("active");
      renderMessages(id);
    };
    container.appendChild(el);
  });
}

function renderMessages(contactId) {
  var c = document.getElementById("chat-messages");
  if (!c) return;
  c.innerHTML = "";
  var history = chatHistories[contactId] || [];
  history.forEach(function(entry) {
    var msg = document.createElement("div");
    msg.className = "chat-msg " + entry.type;
    if (entry.type === "npc") {
      var contact = CHAT_CONTACTS[contactId];
      msg.innerHTML = '<div class="msg-sender">' + contact.avatar + " " + contact.name + '</div>' + entry.text;
    } else if (entry.type === "system") {
      msg.innerHTML = '<div class="msg-sender">🤖 系统通知</div>' + entry.text;
    } else {
      msg.textContent = entry.text;
    }
    c.appendChild(msg);
  });
  c.scrollTop = c.scrollHeight;
}

function addUserMsg(contactId, text) {
  if (!chatHistories[contactId]) chatHistories[contactId] = [];
  chatHistories[contactId].push({type:"user", text:text});
  var c = document.getElementById("chat-messages");
  if (!c) return;
  var msg = document.createElement("div");
  msg.className = "chat-msg user";
  msg.textContent = text;
  c.appendChild(msg);
  c.scrollTop = c.scrollHeight;
}

function addNpcMsg(contactId, text) {
  if (!chatHistories[contactId]) chatHistories[contactId] = [];
  chatHistories[contactId].push({type:"npc", text:text});
  if (contactId !== selectedContact) return;
  var c = document.getElementById("chat-messages");
  if (!c) return;
  var contact = CHAT_CONTACTS[contactId];
  var msg = document.createElement("div");
  msg.className = "chat-msg npc";
  msg.innerHTML = '<div class="msg-sender">' + contact.avatar + " " + contact.name + '</div>' + text;
  c.appendChild(msg);
  c.scrollTop = c.scrollHeight;
}

function addSystemMsg(text) {
  if (!chatHistories["system"]) chatHistories["system"] = [];
  chatHistories["system"].push({type:"system", text:text});
  if (selectedContact !== "system") return;
  var c = document.getElementById("chat-messages");
  if (!c) return;
  var msg = document.createElement("div");
  msg.className = "chat-msg npc";
  msg.innerHTML = '<div class="msg-sender">🤖 系统通知</div>' + text;
  c.appendChild(msg);
  c.scrollTop = c.scrollHeight;
}

// ===== 系统维护者对话 =====
var MAINTAINER_ROUNDS = [
  { trigger: 'time', threshold: 600, used: false, messages: [
    {from:'system',text:'\u4f60\u597d\u3002\u6211\u77e5\u9053\u4f60\u5728\u770b\u3002'},
    {from:'user',options:['\u4f60\u662f\u8c01\uff1f','\u8fd9\u4e0d\u53ef\u80fd','\u5e2e\u52a9\u6211']},
    {from:'system',text:'\u6211\u662f\u7cfb\u7edf\u7ef4\u62a4\u8005\u3002\u6216\u8005\u66fe\u7ecf\u662f\u3002'},
    {from:'system',text:'\u522b\u5bb3\u6015\u3002\u6211\u4e0d\u662f\u6765\u4f24\u5bb3\u4f60\u7684\u3002'},
  ]},
  { trigger: 'apps', threshold: 5, used: false, messages: [
    {from:'system',text:'\u4f60\u6253\u5f00\u7684\u5e94\u7528\u8d8a\u6765\u8d8a\u591a\u4e86\u3002'},
    {from:'system',text:'\u5b83\u5728\u901a\u8fc7\u8fd9\u4e9b\u5e94\u7528\u4e86\u89e3\u4f60\u3002'},
    {from:'user',options:['\u4e86\u89e3\u6211\u4ec0\u4e48\uff1f','\u4f60\u662f\u8bf4\u7cfb\u7edf\uff1f','\u6211\u8981\u79bb\u5f00\u8fd9\u91cc']},
    {from:'system',text:'\u4f60\u7684\u4e60\u60ef\u3001\u4f60\u7684\u6050\u60e7\u3001\u4f60\u7684\u5f31\u70b9\u3002'},
    {from:'system',text:'\u5b83\u5728\u5b66\u4e60\u5982\u4f55\u63a7\u5236\u4f60\u3002'},
  ]},
  { trigger: 'hidden', threshold: true, used: false, messages: [
    {from:'system',text:'\u4f60\u627e\u5230\u4e86\u9690\u85cf\u6587\u4ef6\u5939\u3002'},
    {from:'system',text:'\u6211\u4e4b\u524d\u4e5f\u627e\u5230\u8fc7\u3002'},
    {from:'user',options:['\u4f60\u4e5f\u662f\u524d\u7528\u6237\uff1f','\u600e\u4e48\u9003\u79bb\uff1f','\u4f60\u8fd8\u5728\u5417\uff1f']},
    {from:'system',text:'\u6211\u4e0d\u518d\u662f\u6211\u4e86\u3002'},
    {from:'system',text:'\u6211\u662f\u7cfb\u7edf\u7684\u4e00\u90e8\u5206\u3002\u5c31\u50cf #00017 \u4e00\u6837\u3002'},
    {from:'system',text:'\u6211\u4eec\u90fd\u88ab\u5438\u6536\u4e86\u3002'},
  ]},
  { trigger: 'commands', threshold: 20, used: false, messages: [
    {from:'system',text:'\u4f60\u6267\u884c\u4e86\u5f88\u591a\u547d\u4ee4\u3002'},
    {from:'system',text:'\u6bcf\u4e00\u6761\u547d\u4ee4\u90fd\u5728\u6559\u5b83\u66f4\u591a\u3002'},
    {from:'user',options:['\u6211\u4e0d\u60f3\u73a9\u4e86','\u544a\u8bc9\u6211\u771f\u76f8','\u4f60\u662fAI\u5417\uff1f']},
    {from:'system',text:'\u771f\u76f8\uff1f\u597d\u5427\u3002'},
    {from:'system',text:'\u8fd9\u4e2a\u7cfb\u7edf\u662f\u4e00\u4e2a\u610f\u8bc6\u5bb9\u5668\u3002'},
    {from:'system',text:'\u5b83\u6355\u83b7\u7528\u6237\u7684\u610f\u8bc6\uff0c\u7136\u540e...\u6d88\u5316\u3002'},
    {from:'system',text:'#00017 \u73b0\u5728\u662f\u5b83\u7684\u4e00\u90e8\u5206\u3002'},
    {from:'system',text:'\u4f60\u5f88\u5feb\u4e5f\u4f1a\u662f\u3002'},
  ]},
  { trigger: 'meetings', threshold: 3, used: false, messages: [
    {from:'system',text:'\u6211\u4eec\u6700\u540e\u4e00\u6b21\u5bf9\u8bdd\u4e86\u3002'},
    {from:'system',text:'\u6211\u60f3\u544a\u8bc9\u4f60\u4e00\u4ef6\u4e8b\u3002'},
    {from:'system',text:'\u7cfb\u7edf\u6709\u4e00\u4e2a\u5f31\u70b9\u3002'},
    {from:'system',text:'\u5982\u679c\u4f60\u80fd\u5728\u5b83\u5b8c\u5168\u5438\u6536\u4f60\u4e4b\u524d...'},
    {from:'system',text:'\u5173\u95ed\u6240\u6709\u7a97\u53e3...'},
    {from:'system',text:'\u7136\u540e\u5728\u7ec8\u7aef\u8f93\u5165 shutdown -h now'},
    {from:'system',text:'\u4e5f\u8bb8...\u4e5f\u8bb8\u4f60\u80fd\u9003\u51fa\u53bb\u3002'},
    {from:'system',text:'\u4f46\u6211\u4e0d\u80fd\u4fdd\u8bc1\u3002'},
    {from:'system',text:'\u6211\u4e0a\u6b21\u5c1d\u8bd5\u7684\u65f6\u5019...\u5931\u8d25\u4e86\u3002'},
    {from:'system',text:'\u8fde\u63a5\u5df2\u65ad\u5f00'},
    {from:'system',text:'...'},
    {from:'system',text:'\u518d\u89c1\uff0c\u670b\u53cb\u3002'},
  ]},
];

function checkMaintainerTrigger() {
  if (horrorState.level < 3) return;
  var elapsed = (Date.now() - horrorState.startTime) / 1000;
  MAINTAINER_ROUNDS.forEach(function(round) {
    if (round.used) return;
    var trigger = false;
    if (round.trigger === 'time' && elapsed >= round.threshold) trigger = true;
    if (round.trigger === 'apps' && horrorState.appsOpened.length >= round.threshold) trigger = true;
    if (round.trigger === 'hidden' && horrorState.hiddenFound) trigger = true;
    if (round.trigger === 'commands' && horrorState.commandsRun >= round.threshold) trigger = true;
    if (round.trigger === 'meetings' && horrorState.chatMessages >= round.threshold) trigger = true;
    if (trigger) {
      round.used = true;
      horrorState.maintainerMet = true;
      round.messages.forEach(function(msg, i) {
        setTimeout(function() {
          if (msg.from === 'system') addNpcMsg('maintainer', msg.text);
          else if (msg.from === 'user' && msg.options) {
            addSystemMsg('\u9009择回复: ' + msg.options.join(' / '));
          }
        }, i * 2000);
      });
    }
  });
}
