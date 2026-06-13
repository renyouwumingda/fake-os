// ===== 聊天 =====
const CHAT_CONTACTS = {
  xiaohong: {name:"小红",avatar:"👩",status:"产品经理",online:true},
  laowang: {name:"老王",avatar:"👨",status:"技术总监",online:true},
  system: {name:"系统通知",avatar:"🤖",status:"FakeOS 系统",online:true},
  anonymous: {name:"???",avatar:"😈",status:"未知用户",online:true},
  virus_chat: {name:"病毒",avatar:"💀",status:"我已经进来了。",online:false},
};

const NPC_MESSAGES = {
  xiaohong: ["这个按钮能不能再大一点？","用户说想要一个 AI 功能，明天能做出来吗？","我改主意了，旧的更好。"],
  laowang: ["这代码谁写的？跟屎一样。","又改需求？行吧。","你试过关机重启吗？","服务器着火了。字面意思。"],
  system: ["检测到异常登录。","您的密码已在暗网泄露。开玩笑的。","恭喜！您获得了免费升级！","新版本更新了更多 bug。"],
  anonymous: ["他们都在看着你。","你以为这是假的？","我知道你去年夏天做了什么。","回头看。开玩笑的。嗯？"],
  virus_chat: ["我看见你了。","别想关掉我。","我进来了。","这不是演习。"],
};

let selectedContact = "xiaohong";
let userSentCount = 0;
let chatInterval = null;

function openChat() {
  var content = '<div class="chat-body"><div class="chat-contacts" id="chat-contacts"></div><div class="chat-window"><div class="chat-messages" id="chat-messages"></div><div class="chat-input-area"><input class="chat-input" id="chat-input" placeholder="输入消息..."><button class="chat-send-btn" id="chat-send-btn">发送</button></div></div></div>';
  createWindow("chat", "聊天", 500, 400, content);
  buildContactList();
  addSystemMsg("欢迎来到 FakeChat！这里的每个人都绝对真实。");

  var input = document.getElementById("chat-input");
  var sendBtn = document.getElementById("chat-send-btn");

  function sendMsg() {
    var msg = input.value.trim();
    if (!msg) return;
    addUserMsg(msg);
    handleReply(msg);
    input.value = "";
    userSentCount++;
    if (userSentCount === 10) setTimeout(function() { addSystemMsg("消息发送失败。原因：你的社交技能为零。"); }, 500);
  }

  sendBtn.onclick = sendMsg;
  input.addEventListener("keydown", function(e) { if (e.key === "Enter") sendMsg(); });

  if (chatInterval) clearInterval(chatInterval);
  chatInterval = setInterval(function() {
    if (FakeOS.virusActive) {
      addNpcMsg("virus_chat", NPC_MESSAGES.virus_chat[Math.random() * NPC_MESSAGES.virus_chat.length | 0]);
      return;
    }
    var contacts = ["xiaohong","laowang","system","anonymous"];
    var c = contacts[Math.random() * contacts.length | 0];
    var msgs = NPC_MESSAGES[c];
    addNpcMsg(c, msgs[Math.random() * msgs.length | 0]);
  }, 8000 + Math.random() * 12000);

  var hour = new Date().getHours();
  if (hour >= 23 || hour < 6) setTimeout(function() { addSystemMsg("现在是深夜，正常人不会在线。你是正常人吗？"); }, 2000);
}

function handleReply(msg) {
  var lower = msg.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("你好")) setTimeout(function() { addNpcMsg("xiaohong","你好！有个新需求跟你确认一下！"); }, 1000);
  else if (lower.includes("ai")) setTimeout(function() { addNpcMsg("anonymous","你怎么知道？"); }, 1500);
  else if (lower.includes("help") || lower.includes("帮助")) setTimeout(function() { addSystemMsg("本聊天室不提供帮助服务。"); }, 1000);
  else setTimeout(function() { addNpcMsg("xiaohong","有意思。我再想想，两周后回复你。"); }, 2000);
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
    };
    container.appendChild(el);
  });
}

function addUserMsg(text) {
  var c = document.getElementById("chat-messages");
  if (!c) return;
  var msg = document.createElement("div");
  msg.className = "chat-msg user";
  msg.textContent = text;
  c.appendChild(msg);
  c.scrollTop = c.scrollHeight;
}

function addNpcMsg(contactId, text) {
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
  var c = document.getElementById("chat-messages");
  if (!c) return;
  var msg = document.createElement("div");
  msg.className = "chat-msg npc";
  msg.innerHTML = '<div class="msg-sender">🤖 系统通知</div>' + text;
  c.appendChild(msg);
  c.scrollTop = c.scrollHeight;
}
