// ===== 文件管理器 =====
const VIRTUAL_FS = {
  "": { "Documents/": ["老板的黑历史.txt","辞职信_最终版.docx","密码.txt","会议记录_机密.pdf"],
        "Downloads/": ["免费VPN.exe","绩效评估_真实版.xlsx","重要备份.zip"],
        "Pictures/": ["壁纸_正常.jpg","壁纸_诡异.jpg","截图.png"],
        "Videos/": ["README.txt"],
        "Diary/": ["2026-01-15.txt","2026-02-20.txt","2026-03-30.txt"] },
  "Documents": {
    "老板的黑历史.txt": {size:"2.4 KB",date:"2026-03-15",content:"2024/03/15 - 在办公室睡觉被抓\n2024/05/20 - 把咖啡洒在了客户文件上\n2024/08/01 - 年度总结是从网上抄的"},
    "辞职信_最终版.docx": {size:"0 KB",date:"2026-04-01",content:"[无法读取：文件已损坏]\n可能是因为写的时候手在抖"},
    "密码.txt": {size:"0 KB",date:"2026-01-01",content:"此文件为空。"},
    "会议记录_机密.pdf": {size:"1.2 KB",date:"2026-05-20",content:"[PDF格式不支持]\n但里面其实就是\"会议取消，去吃饭了\""} },
  "Downloads": {
    "免费VPN.exe": {size:"999 MB",date:"2026-02-30",content:"[二进制文件]\n实际上是一个 404 页面的快捷方式。"},
    "绩效评估_真实版.xlsx": {size:"3 KB",date:"2026-06-01",content:"绩效：F-\n评语：你还活着就已经是个奇迹了。"},
    "重要备份.zip": {size:"0 KB",date:"2026-06-10",content:"[文件损坏]\nPK..PK..PK......."} },
  "Pictures": {
    "壁纸_正常.jpg": {size:"256 KB",date:"2026-01-01",content:"[图片文件：一张正常的渐变壁纸]"},
    "壁纸_诡异.jpg": {size:"666 KB",date:"2026-06-06",content:"[图片文件：???]"},
    "截图.png": {size:"42 KB",date:"2026-05-15",content:"[图片文件：时间戳未知]"} },
  "Videos": { "README.txt": {size:"0.1 KB",date:"2026-05-01",content:"视频文件已被删除。\n原因：太丑了。"} },
  "Diary": {
    "2026-01-15.txt": {size:"0.5 KB",date:"2026-01-15",content:"今天入职新公司，一切都很好。`n同事很友善，办公室也干净。`n唯一奇怪的是...墙上的时钟有时候会倒着走。"},
    "2026-02-20.txt": {size:"0.8 KB",date:"2026-02-20",content:"已经一个月了。我发现了一些不对劲的事。`n服务器机房的灯会在凌晨3点自己亮起来。`nIT部门说没有人在维护。`n但日志显示...有个用户一直在登录。"},
    "2026-03-30.txt": {size:"1.2 KB",date:"2026-03-30",content:"如果你在读这封信，说明你也发现了。`n`n别让他们知道你知道。`n`n系统的密码不是 admin 也不是 password。`n是 #00017。`n`n那是前一个用户的编号。`n他试图逃离。`n他失败了。`n`n他的影子还在系统各处。`n`n如果你看到了影子... 不要回头。"}
  },
  ".hidden": {
    "不要打开.txt": {size:"0.1 KB",date:"2026-01-01",content:"我说了不要打开。你还打开？\n好吧... 其实什么都没有。\n骗你的。"},
    "真正的密码.txt": {size:"0.1 KB",date:"2026-01-01",content:"admin123\n\n(没错，就这？你以为呢？)"},
    "virus.exe": {size:"6.66 KB",date:"2026-06-06",content:"[警告：此文件包含恶意代码]\n\n你确定要运行吗？\n\n提示：这是假的。\n……还是说？"}
  }
};

let currentFolder = "";

function openFileManager() {
  if (FakeOS.windows["fileManager"]) { focusWindow("fileManager"); return; }
  var content = '<div class="fm-body"><div class="fm-sidebar" id="fm-sidebar"></div><div class="fm-main" id="fm-main"></div></div>';
  createWindow("fileManager", "文件管理器", 550, 400, content);
  buildFileTree();
  loadFolder("");
}

function buildFileTree() {
  var sidebar = document.getElementById("fm-sidebar");
  if (!sidebar) return;
  sidebar.innerHTML = "";
  var roots = ["", "Documents", "Downloads", "Pictures", "Videos", "Diary"];
  roots.forEach(function(folder) {
    var el = document.createElement("div");
    el.className = "fm-folder" + (folder === currentFolder ? " active" : "");
    el.dataset.folder = folder;
    el.textContent = folder === "" ? "主页" : "" + getFolderIcon(folder) + " " + folder;
    el.onclick = function() { loadFolder(folder); };
    sidebar.appendChild(el);
  });
}

function getFolderIcon(name) { return "📁"; }

var _emptyClickCount = 0;
function loadFolder(folder) {
  currentFolder = folder;
  buildFileTree();
  var main = document.getElementById("fm-main");
  if (!main) return;
  main.innerHTML = "";
  // Hidden folder trigger: 5 clicks on empty area
  main.onclick = function(e) {
    if (e.target === main) {
      _emptyClickCount++;
      if (_emptyClickCount >= 5) {
        _emptyClickCount = 0;
        openHiddenFolder();
      }
      setTimeout(function() { _emptyClickCount = 0; }, 2000);
    }
  };
  if (!VIRTUAL_FS[folder]) return;

  var files = VIRTUAL_FS[folder];
  Object.keys(files).forEach(function(name) {
    var file = files[name];
    var row = document.createElement("div");
    row.className = "fm-file";

    if (name === "壁纸_诡异.jpg") {
      row.onclick = function() {
        document.body.classList.add("effect-flash");
        setTimeout(function() { document.body.classList.remove("effect-flash"); }, 200);
      };
    } else {
    if (name === "virus.exe") { row.onclick = function() { showVirusPrompt(); }; } else { row.onclick = function() { showFileContent(name, file.content || "无内容"); }; }
    }

    row.innerHTML = '<div class="fm-file-icon">' + getFileIcon(name) + '</div><div class="fm-file-name">' + name + '</div><div class="fm-file-size">' + (file.size || "") + '</div>';
    main.appendChild(row);
  });
}

function getFileIcon(name) {
  if (name.endsWith(".txt")) return "📄";
  if (name.endsWith(".exe")) return "⚙️";
  if (name.endsWith(".jpg") || name.endsWith(".png")) return "🖼️";
  if (name.endsWith(".docx")) return "📝";
  if (name.endsWith(".pdf")) return "📕";
  if (name.endsWith(".zip")) return "🗜️";
  if (name.endsWith(".xlsx")) return "📊";
  return "📄";
}

function showFileContent(name, content) {
  createWindow("file_" + name, name, 400, 300,
    '<div style="padding:16px;white-space:pre-wrap;font-family:monospace;font-size:13px;color:#ccc;height:100%;overflow:auto;">' + escapeHtml(content) + '</div>');
}
