// ===== 设置 =====
var versionClickCount = 0;

function openSettings() {
  if (FakeOS.windows["settings"]) { focusWindow("settings"); return; }
  var content = '<div style="display:flex;height:100%;"><div style="width:120px;background:#12122a;border-right:1px solid rgba(255,255,255,0.06);flex-shrink:0;" id="settings-nav"></div><div style="flex:1;padding:20px;overflow:auto;" id="settings-content"></div></div>';
  createWindow("settings", "设置", 550, 400, content);
  buildSettingsNav();
  showSettings("appearance");
}

const SETTINGS_PAGES = {
  appearance: {title:"外观", content:getAppearanceHtml},
  privacy: {title:"隐私", content:getPrivacyHtml},
  about: {title:"关于", content:getAboutHtml},
  advanced: {title:"高级", content:getAdvancedHtml},
};

function buildSettingsNav() {
  var nav = document.getElementById("settings-nav");
  if (!nav) return;
  nav.innerHTML = "";
  Object.keys(SETTINGS_PAGES).forEach(function(key) {
    var el = document.createElement("div");
    el.className = "fm-folder" + (key === "appearance" ? " active" : "");
    el.textContent = SETTINGS_PAGES[key].title;
    el.onclick = function() {
      document.querySelectorAll("#settings-nav .fm-folder").forEach(function(e) { e.classList.remove("active"); });
      el.classList.add("active");
      showSettings(key);
    };
    nav.appendChild(el);
  });
}

function showSettings(page) {
  var content = document.getElementById("settings-content");
  if (!content || !SETTINGS_PAGES[page]) return;
  content.innerHTML = SETTINGS_PAGES[page].content();
}

function getAppearanceHtml() {
  return '<h3 style="margin:0 0 16px;font-size:16px;color:#fff;">外观</h3>'
    + toggleRow("深色模式","darkMode","让一切变得更糟",function(on){document.getElementById("desktop").classList.toggle("night",on);})
    + toggleRow("动画效果","animations","关闭后界面变丑",function(){})
    + toggleRow("壁纸轮播","wallpaperSlide","每5秒切换，有一张很诡异",function(on){
        if(on){FakeOS._slideInterval=setInterval(function(){document.getElementById("desktop").style.background="linear-gradient(135deg,#"+Math.floor(Math.random()*16777215).toString(16)+" 0%,#"+Math.floor(Math.random()*16777215).toString(16)+" 100%)";},5000);}
        else{clearInterval(FakeOS._slideInterval);document.getElementById("desktop").style.background="";}
      });
}

function getPrivacyHtml() {
  return '<h3 style="margin:0 0 16px;font-size:16px;color:#fff;">隐私</h3>'
    + toggleRow("发送使用数据","usageData","无法关闭",function(){
        setTimeout(function(){document.getElementById("toggle_usageData").checked=true;showAlert("想得美。","你没有选择。");},500);
      })
    + toggleRow("麦克风权限","micAccess","已授权",function(on){showAlert("麦克风","FakeOS 已获取您的麦克风权限。");})
    + toggleRow("位置服务","location","显示：北京市朝阳区某地下室",function(){return false;})
    + toggleRow("个性化广告","ads","关闭后显示更多广告",function(on){
        if(!on) for(var i=0;i<3;i++) setTimeout(showAd,i*1000);
      })
    + '<div style="margin-top:16px;padding:12px;background:rgba(255,0,0,0.1);border-radius:8px;"><p style="margin:0;font-size:12px;color:rgba(255,255,255,0.5);">您的隐私从来都不是优先考虑项。</p></div>';
}

function getAboutHtml() {
  return '<h3 style="margin:0 0 16px;font-size:16px;color:#fff;">关于 FakeOS</h3>'
    + '<div style="font-size:13px;line-height:2;color:rgba(255,255,255,0.7);">'
    + '<div style="display:flex;justify-content:space-between;"><span>版本：</span><span style="color:#fff;cursor:pointer;" id="version-number" onclick="onVersionClick()">FakeOS v0.2.0</span></div>'
    + '<div style="display:flex;justify-content:space-between;"><span>构建：</span><span style="color:#fff;">nobody-cares</span></div>'
    + '<div style="display:flex;justify-content:space-between;"><span>内存：</span><span style="color:#fff;">640KB (应该够用了)</span></div>'
    + '<div style="display:flex;justify-content:space-between;"><span>存储：</span><span style="color:#fff;">2TB / 2TB (但你只存了几个txt)</span></div>'
    + '<div style="display:flex;justify-content:space-between;"><span>处理器：</span><span style="color:#fff;">Intel i9-99999K @ -3.5GHz</span></div>'
    + '<div style="display:flex;justify-content:space-between;margin-top:8px;"><span>状态：</span><span style="color:#f00;animation:blink 1s step-end infinite;">错误：一切正常。</span></div></div>';
}

function onVersionClick() {
  versionClickCount++;
  if (versionClickCount >= 10) {
    versionClickCount = 0;
    var content = document.getElementById("settings-content");
    if (content) content.innerHTML = "<pre style=\"font-family:monospace;font-size:11px;color:#0f0;overflow:auto;height:100%;\">" + Array(50).fill("[开发者控制台] " + Math.random().toString(36).substring(2)).join("\n") + "</pre>";
  }
}

function getAdvancedHtml() {
  return '<h3 style="margin:0 0 16px;font-size:16px;color:#fff;">高级设置</h3>'
    + '<div style="margin-bottom:16px;padding:12px;background:rgba(255,0,0,0.08);border-radius:8px;border:1px solid rgba(255,0,0,0.2);">'
    + '<div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:8px;">需要密码才能进入此区域</div>'
    + '<input id="adv-password" type="password" placeholder="提示：生命的意义" style="padding:8px 12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:6px;color:#fff;width:100%;box-sizing:border-box;">'
    + '<button onclick="checkAdvPassword()" style="margin-top:8px;padding:6px 16px;background:#6c63ff;border:none;border-radius:6px;color:#fff;cursor:pointer;">解锁</button>'
    + '<div id="adv-content" style="margin-top:12px;"></div></div>';
}

function checkAdvPassword() {
  var pw = document.getElementById("adv-password");
  if (!pw) return;
  if (pw.value === "42") {
    document.getElementById("adv-content").innerHTML = ""
      + '<div style="font-size:13px;color:#fff;margin-bottom:8px;">危险区域</div>'
      + '<button onclick="fakeFormat()" style="display:block;width:100%;margin-bottom:8px;padding:8px;background:rgba(255,0,0,0.2);border:1px solid rgba(255,0,0,0.4);border-radius:6px;color:#f00;cursor:pointer;">格式化硬盘</button>'
      + '<button onclick="fakeDelete()" style="display:block;width:100%;margin-bottom:8px;padding:8px;background:rgba(255,0,0,0.1);border:1px solid rgba(255,0,0,0.2);border-radius:6px;color:rgba(255,255,255,0.7);cursor:pointer;">删除所有数据</button>'
      + '<button onclick="showDevConsole()" style="display:block;width:100%;padding:8px;background:rgba(0,255,0,0.1);border:1px solid rgba(0,255,0,0.2);border-radius:6px;color:#0f0;cursor:pointer;">开发者控制台</button>';
  } else {
    showAlert("密码错误", "提示：生命、宇宙以及一切问题的答案。");
  }
}

function fakeFormat() {
  showAlert("只是个按钮", "别紧张。不过……", function() {
    document.body.style.cursor = "wait";
    setTimeout(function() {
      document.body.style.cursor = "default";
      showAlert("格式化完成", "骗你的，什么也没发生。");
    }, 3000);
  });
}

function fakeDelete() { showAlert("已删除", "骗你的。"); }
function showDevConsole() { showAlert("开发者控制台", "这不是真正的控制台。\n你为什么在这里？"); }

function toggleRow(label, id, desc, onChange) {
  return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);">'
    + '<div><div style="font-size:13px;color:#fff;">' + label + '</div><div style="font-size:11px;color:rgba(255,255,255,0.35);">' + desc + '</div></div>'
    + '<label><input type="checkbox" id="toggle_' + id + '" onchange="toggleChanged(this,\'' + id + '\')" checked></label></div>';
}

function toggleChanged(el, id) {
  if (id === "darkMode") document.getElementById("desktop").classList.toggle("night", el.checked);
  if (id === "wallpaperSlide") {
    if (el.checked) {
      FakeOS._slideInterval = setInterval(function() {
        document.getElementById("desktop").style.background = "linear-gradient(135deg,#" + Math.floor(Math.random()*16777215).toString(16) + " 0%,#" + Math.floor(Math.random()*16777215).toString(16) + " 100%)";
      }, 5000);
    } else {
      clearInterval(FakeOS._slideInterval);
      document.getElementById("desktop").style.background = "";
    }
  }
}
