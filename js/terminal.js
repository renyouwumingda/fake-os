// ===== 终端 =====
const TERMINAL_COMMANDS = {};
let terminalHistory = [];
let terminalInputCount = 0;
let isSuRoot = false;

let terminalPath = "";

function resolvePath(input) {
  if (input === "" || input === ".") return terminalPath;
  if (input === "~" || input === "/") return "";
  if (input === "..") {
    if (terminalPath === "") return "";
    var parts = terminalPath.split("/");
    parts.pop();
    return parts.join("/");
  }
  if (terminalPath === "") return input;
  return terminalPath + "/" + input;
}

function isValidFolder(path) {
  if (path === "") return true;
  return VIRTUAL_FS[path] !== undefined;
}

function syncFileManager() {
  if (FakeOS.windows.fileManager) {
    loadFolder(terminalPath);
  }
}


function registerCommand(name, handler) {
  TERMINAL_COMMANDS[name] = handler;
}

registerCommand("help", function() {
  return "可用命令：\n  help           显示帮助\n  ls             列出文件\n  pwd            当前目录\n  echo [文字]    输出文字\n  date           当前时间\n  whoami         你是谁\n  cat [文件]     查看文件\n  clear          清屏\n  history        命令历史\n  matrix         黑客帝国\n  hack           黑客模式\n  money          查看余额\n  why            生命的意义\n  ping [地址]    Ping\n  secret         秘密\n  life           人生模拟\n  show hidden    显示隐藏文件\n  open virus.exe 打开病毒\n  uninstall fakeos 卸载";
});

registerCommand("ls", function() {
    if (terminalPath === "") return "Documents/  Downloads/  Pictures/  Videos/  .hidden/";
    var folder = VIRTUAL_FS[terminalPath];
    if (!folder) return "ls: cannot access " + terminalPath;
    var names = Object.keys(folder);
    return names.join("  ") || "(empty)";
  });
registerCommand("pwd", function() {
    if (isSuRoot) return "/root";
    if (terminalPath === "") return "/home/admin";
    return "/home/admin/" + terminalPath;
  });
registerCommand("echo", function(args) { return args.join(" ") || ""; });
registerCommand("date", function() { return new Date().toString(); });
registerCommand("whoami", function() { return "admin"; });
registerCommand("clear", function() { return "__CLEAR__"; });
registerCommand("matrix", function() { return "__MATRIX__"; });
registerCommand("hack", function() { return "正在入侵 NASA... 1%\n正在入侵 NASA... 2%\n正在入侵 NASA... 0%\n\n访问被拒绝。你不是汤姆·克鲁斯。"; });
registerCommand("money", function() { return "你的银行余额：-$42,069.69\n\n提示：别再买 FakeOS 授权了。"; });
registerCommand("why", function() { return "42"; });
registerCommand("exit", function() { return "你可以随时离开，但你永远无法真正离开。"; });
registerCommand("secret", function() { return "段错误 (核心已转储)"; });
registerCommand("life", function() { return "42 年的学生贷款。0 项成就。\n再试一次？(这是终端，不是游戏。)"; });
registerCommand("sudo", function() { return "[sudo] admin 的密码：...\n开玩笑的，我没有 sudo 权限。\n……还是说我有？"; });
registerCommand("uninstall", function() { return "错误：你就是病毒。"; });
registerCommand("reboot", function() { return "正在重启...\n开玩笑的。我不听你的。"; });

registerCommand("ping", function(args) {
  var host = args[0] || "localhost";
  if (host.toLowerCase() === "god") return "正在 Ping god.local [127.0.0.1]...\n回复：\"我很忙。\"";
  return "PING " + host + " [127.0.0.1]... 100% 丢失";
});

registerCommand("show", function(args) {
  if (args[0] === "hidden") return "__SHOW_HIDDEN__";
  return "show: 未知子命令";
});



registerCommand("cat", function(args) {
  if (!args[0]) return "cat: missing operand";
  var target = resolvePath(args[0]);
  var folder = terminalPath ? VIRTUAL_FS[terminalPath] : VIRTUAL_FS[""];
  if (folder && folder[args[0]] && folder[args[0]].content) return folder[args[0]].content;
  if (VIRTUAL_FS[target]) return "cat: " + args[0] + ": Is a directory";
  return "cat: " + args[0] + ": No such file or directory";
});

registerCommand("history", function() {
  if (terminalHistory.length === 0) return "没有命令历史。";
  return terminalHistory.map(function(cmd, i) { return "  " + (i + 1) + "  " + cmd; }).join("\n");
});

registerCommand("cd", function(args) {
  if (!args[0]) return "Where do you want to go?";
  var target = resolvePath(args.join(" "));
  if (!isValidFolder(target)) return "cd: " + args[0] + ": No such file or directory";
  terminalPath = target;
  syncFileManager();
  return "";
});

registerCommand("mkdir", function(args) {
  if (!args[0]) return "mkdir: missing operand";
  return "mkdir: permission denied\n(But we pretended to create it.)";
});

registerCommand("rm", function(args) {
  if (!args[0]) return "rm: missing operand";
  return "rm: File has gone to a better place.";
});

registerCommand("cp", function(args) {
  if (args.length < 2) return "cp: missing operand";
  return "cp: copied. (Nothing actually happened.)";
});

registerCommand("mv", function(args) {
  if (args.length < 2) return "mv: missing operand";
  return "mv: moved. (In a parallel universe.)";
});

registerCommand("find", function(args) {
  if (!args[0]) return "find: missing keyword";
  var kw = args.join(" ").toLowerCase();
  if (kw === "treasure") return ".hidden/real_password.txt\n(But you already knew that.)";
  if (kw === "self" || kw === "me") return "You are here. You always were.";
  if (kw === "virus") return "./virus.exe\n(Are you sure you want to find it?)";
  return "find: no results for \"" + kw + "\"";
});

registerCommand("open", function(args) {
  var name = args.join(" ");
  if (name === "virus.exe" || name === "./virus.exe") return "__VIRUS_PROMPT__";
  if (terminalPath && VIRTUAL_FS[terminalPath] && VIRTUAL_FS[terminalPath][name]) {
    var file = VIRTUAL_FS[terminalPath][name];
    showFileContent(name, file.content || "No content");
    return "Opening " + name + "...";
  }
  // Also check root
  if (!terminalPath && VIRTUAL_FS[""][name + "/"]) {
    return "That is a directory. Try: cd " + name;
  }
  return "open: cannot open \"" + name + "\"";
});

function openTerminal() {
  if (FakeOS.windows["terminal"]) { focusWindow("terminal"); return; }
  var content = '<div class="terminal-body"></div>';
  var win = createWindow("terminal", "终端", 600, 400, content);
  var termEl = win.el.querySelector(".terminal-body");
  termEl.style.height = "100%";
  termEl.style.display = "flex";
  termEl.style.flexDirection = "column";

  var output = document.createElement("div");
  output.style.flex = "1";
  output.style.overflow = "auto";
  output.innerHTML = '<div style="color:#0ff">FakeOS 终端 v0.2.0<br>输入 "help" 查看可用命令。<br></div>';
  termEl.appendChild(output);

  var inputLine = document.createElement("div");
  inputLine.className = "terminal-input-line";
  inputLine.innerHTML = '<span class="prompt">admin@fakeos:~$ </span><input class="terminal-input" type="text" autofocus>';
  termEl.appendChild(inputLine);

  var input = inputLine.querySelector(".terminal-input");
  input.focus();

  input.addEventListener("keydown", function(e) {
    if (e.key !== "Enter") return;
    var cmd = input.value.trim();
    if (!cmd) return;
    terminalHistory.push(cmd);
    terminalInputCount++;

    var cmdLine = document.createElement("div");
    cmdLine.innerHTML = '<span class="prompt">admin@fakeos:~$ </span>' + escapeHtml(cmd);
    output.appendChild(cmdLine);

    var parts = cmd.split(/\s+/);
    var name = parts[0].toLowerCase();
    var args = parts.slice(1);
    var result = "";

    if (TERMINAL_COMMANDS[name]) {
      result = TERMINAL_COMMANDS[name](args, termEl);
    } else {
      result = "bash: " + name + ": 找不到命令";
    }

    if (result === "__CLEAR__") { output.innerHTML = ""; }
    else if (result === "__MATRIX__") { startMatrixEffect(); }
    else if (result === "__SHOW_HIDDEN__") { revealHiddenFiles(); output.innerHTML += "<div class='special-text'>已显示隐藏文件。</div>"; }
    else if (result === "__VIRUS_PROMPT__") {
      output.innerHTML += "<div class='warning-text'>你确定吗？这是不可逆的。(y/n)</div>";
      input.waitingVirus = true;
    }
    else if (result) {
      var outDiv = document.createElement("div");
      outDiv.className = "output";
      outDiv.textContent = result;
      output.appendChild(outDiv);
    }

    if (input.waitingVirus && cmd.toLowerCase() === "y") {
      startVirus();
      input.waitingVirus = false;
    }

    input.value = "";
    output.scrollTop = output.scrollHeight;
  });
}

function revealHiddenFiles() {
  if (!FakeOS.windows.fileManager) return;
  var sidebar = FakeOS.windows.fileManager.el.querySelector(".fm-sidebar");
  if (!sidebar || sidebar.querySelector("[data-folder=\".hidden\"]")) return;
  var hidden = document.createElement("div");
  hidden.className = "fm-folder";
  hidden.dataset.folder = ".hidden";
  hidden.textContent = "--- .hidden";
  hidden.onclick = function() { loadFolder(".hidden"); };
  sidebar.appendChild(hidden);
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function startMatrixEffect() {
  var canvas = document.createElement("canvas");
  canvas.id = "matrix-canvas";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  var fontSize = 14;
  var cols = Math.floor(canvas.width / fontSize);
  var drops = Array(cols).fill(1);
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?";

  function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f0";
    ctx.font = fontSize + "px monospace";
    for (var i = 0; i < drops.length; i++) {
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  var interval = setInterval(draw, 33);
  setTimeout(function() { clearInterval(interval); canvas.remove(); }, 5000);
}
