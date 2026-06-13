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
  system: {title:"系统", content:getSystemHtml},
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
    + '<div style="display:flex;justify-content:space-between;"><span>版本：</span><span style="color:#fff;cursor:pointer;" id="version-number" onclick="onVersionClick()">FakeOS v0.4.0</span></div>'
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

function getSystemHtml() {
  return '<h3 style="margin:0 0 16px;font-size:16px;color:#fff;">\u7cfb\u7edf\u8bbe\u7f6e</h3>'
    + '<div style="margin-bottom:16px;">'
    + '<div style="font-size:13px;color:#fff;margin-bottom:8px;">\u7cfb\u7edf\u8bed\u8a00</div>'
    + '<select id="sys-language" style="padding:6px 12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:6px;color:#fff;width:100%;" onchange="changeLanguage(this.value)">'
    + '<option value="zh">\u4e2d\u6587</option>'
    + '<option value="en">English</option>'
    + '<option value="???">???</option>'
    + '</select></div>'
    + toggleRow('\u901a\u77e5\u8bbe\u7f6e','notifications','\u5141\u8bb8\u7cfb\u7edf\u53d1\u9001\u901a\u77e5',function(on){
        if(!on) {
          setTimeout(function(){showNotification('\u7cfb\u7edf\u901a\u77e5','\u4f60\u5173\u95ed\u4e86\u901a\u77e5\u6743\u9650');},1000);
          setTimeout(function(){showNotification('\u7cfb\u7edf\u901a\u77e5','\u4f46\u8fd9\u4e0d\u5f71\u54cd\u6211');},2000);
          setTimeout(function(){showNotification('\u7cfb\u7edf\u901a\u77e5','\u6211\u65e0\u5904\u4e0d\u5728');},3000);
        }
      })
    + '<div style="margin-top:16px;padding:12px;background:rgba(255,0,0,0.1);border-radius:8px;">'
    + '<div style="font-size:13px;color:rgba(255,255,255,0.5);">\u6570\u636e\u5171\u4eab</div>'
    + '<div style="font-size:11px;color:rgba(255,255,255,0.3);margin-top:4px;">\u4f60\u5df2\u7ecf\u5206\u4eab\u4e86</div>'
    + '</div>';
}

function changeLanguage(lang) {
  if (lang === '???') {
    var gibberish = '\u65ad\u58c1\u6b8b\u58f3\u7075\u9b42\u8650\u5f81\u8840\u8089\u571f\u5c38\u9ab7\u9ac5\u9b3c\u72fc\u72d0\u9f99\u86e4\u86f1\u8747\u8748\u8776\u877e\u8811\u8822\u8836\u884c\u5f71\u5f62\u75d5\u7634\u766b\u76d7\u75f4\u75fb\u763b\u764c\u76ae\u76b2\u76fc\u7720\u773a\u7740\u7791\u77b3\u77d7\u77e9\u77eb\u77ee\u7809\u7814\u783e\u785d\u786c\u7892\u7893\u7897\u789d\u789f\u78a7\u78ba\u78cd\u78e7\u78ef\u78f5\u7901\u793e\u795a\u795e\u7965\u797f\u7981\u79bb\u79c1\u79cd\u79d8\u7a06\u7a20\u7a3b\u7a46\u7a51\u7a74\u7a76\u7a79\u7a84\u7a8d\u7a91\u7a93\u7a9d\u7aa5\u7aa6\u7aad\u7ab0\u7ab3\u7ab5\u7ac4\u7ac5\u7ac7\u7acb\u7ad6\u7ad9\u7aef\u7af6\u7af9\u7b08\u7b0a\u7b0f\u7b11\u7b1b\u7b1e\u7b20\u7b26\u7b28\u7b2b\u7b2d\u7b33\u7b3c\u7b3e\u7b40\u7b43\u7b45\u7b47\u7b49\u7b4c\u7b4e\u7b51\u7b52\u7b54\u7b56\u7b58\u7b5a\u7b5c\u7b5e\u7b61\u7b62\u7b63\u7b65\u7b66\u7b68\u7b6a\u7b6c\u7b6e\u7b71\u7b72\u7b73\u7b75\u7b77\u7b79\u7b7b\u7b7d\u7b83\u7b85\u7b86\u7b88\u7b8a\u7b8c\u7b8e\u7b90\u7b92\u7b94\u7b97\u7b98\u7b9a\u7b9c\u7b9e\u7ba0\u7ba2\u7ba4\u7ba5\u7ba7\u7ba9\u7bab\u7bad\u7baf\u7bb1\u7bb3\u7bb5\u7bb7\u7bb9\u7bbb\u7bbd\u7bc0\u7bc2\u7bc4\u7bc5\u7bc7\u7bc9\u7bcb\u7bcd\u7bcf\u7bd2\u7bd4\u7bd6\u7bd8\u7bda\u7bdc\u7bde\u7be0\u7be2\u7be4\u7be6\u7be8\u7bea\u7bec\u7bee\u7bf0\u7bf2\u7bf4\u7bf6\u7bf8\u7bfa\u7bfc\u7bfe\u7c00\u7c02\u7c04\u7c06\u7c08\u7c0a\u7c0c\u7c0e\u7c10\u7c12\u7c14\u7c16\u7c18\u7c1a\u7c1c\u7c1e\u7c20\u7c22\u7c24\u7c26\u7c28\u7c2a\u7c2c\u7c2e\u7c30\u7c32\u7c34\u7c36\u7c38\u7c3a\u7c3c\u7c3e\u7c40\u7c42\u7c44\u7c46\u7c48\u7c4a\u7c4c\u7c4e\u7c50\u7c52\u7c54\u7c56\u7c58\u7c5a\u7c5c\u7c5e\u7c60\u7c62\u7c64\u7c66\u7c68\u7c6a\u7c6c\u7c6e\u7c70\u7c72\u7c74\u7c76\u7c78\u7c7a\u7c7c\u7c7e\u7c80\u7c82\u7c84\u7c86\u7c88\u7c8a\u7c8c\u7c8e\u7c90\u7c92\u7c94\u7c96\u7c98\u7c9a\u7c9c\u7c9e\u7ca0\u7ca2\u7ca4\u7ca6\u7ca8\u7caa\u7cac\u7cae\u7cb0\u7cb2\u7cb4\u7cb6\u7cb8\u7cba\u7cbc\u7cbe\u7cc0\u7cc2\u7cc4\u7cc6\u7cc8\u7cca\u7ccc\u7cce\u7cd0\u7cd2\u7cd4\u7cd6\u7cd8\u7cda\u7cdc\u7cde\u7ce0\u7ce2\u7ce4\u7ce6\u7ce8\u7cea\u7cec\u7cee\u7cf0\u7cf2\u7cf4\u7cf6\u7cf8\u7cfa\u7cfc\u7cfe\u7d00\u7d02\u7d04\u7d06\u7d08\u7d0a\u7d0c\u7d0e\u7d10\u7d12\u7d14\u7d16\u7d18\u7d1a\u7d1c\u7d1e\u7d20\u7d22\u7d24\u7d26\u7d28\u7d2a\u7d2c\u7d2e\u7d30\u7d32\u7d34\u7d36\u7d38\u7d3a\u7d3c\u7d3e\u7d40\u7d42\u7d44\u7d46\u7d48\u7d4a\u7d4c\u7d4e\u7d50\u7d52\u7d54\u7d56\u7d58\u7d5a\u7d5c\u7d5e\u7d60\u7d62\u7d64\u7d66\u7d68\u7d6a\u7d6c\u7d6e\u7d70\u7d72\u7d74\u7d76\u7d78\u7d7a\u7d7c\u7d7e\u7d80\u7d82\u7d84\u7d86\u7d88\u7d8a\u7d8c\u7d8e\u7d90\u7d92\u7d94\u7d96\u7d98\u7d9a\u7d9c\u7d9e\u7da0\u7da2\u7da4\u7da6\u7da8\u7daa\u7dac\u7dae\u7db0\u7db2\u7db4\u7db6\u7db8\u7dba\u7dbc\u7dbe\u7dc0\u7dc2\u7dc4\u7dc6\u7dc8\u7dca\u7dcc\u7dce\u7dd0\u7dd2\u7dd4\u7dd6\u7dd8\u7dda\u7ddc\u7dde\u7de0\u7de2\u7de4\u7de6\u7de8\u7dea\u7dec\u7dee\u7df0\u7df2\u7df4\u7df6\u7df8\u7dfa\u7dfc\u7dfe\u7e00\u7e02\u7e04\u7e06\u7e08\u7e0a\u7e0c\u7e0e\u7e10\u7e12\u7e14\u7e16\u7e18\u7e1a\u7e1c\u7e1e\u7e20\u7e22\u7e24\u7e26\u7e28\u7e2a\u7e2c\u7e2e\u7e30\u7e32\u7e34\u7e36\u7e38\u7e3a\u7e3c\u7e3e\u7e40\u7e42\u7e44\u7e46\u7e48\u7e4a\u7e4c\u7e4e\u7e50\u7e52\u7e54\u7e56\u7e58\u7e5a\u7e5c\u7e5e\u7e60\u7e62\u7e64\u7e66\u7e68\u7e6a\u7e6c\u7e6e\u7e70\u7e72\u7e74\u7e76\u7e78\u7e7a\u7e7c\u7e7e\u7e80\u7e82\u7e84\u7e86\u7e88\u7e8a\u7e8c\u7e8e\u7e90\u7e92\u7e94\u7e96\u7e98\u7e9a\u7e9c\u7e9e';
    document.querySelectorAll('.icon-label, .window-title, .context-menu-item').forEach(function(el) {
      var text = el.textContent;
      var result = '';
      for (var i = 0; i < text.length; i++) {
        result += gibberish[Math.floor(Math.random() * gibberish.length)];
      }
      el.textContent = result;
    });
  }
}
