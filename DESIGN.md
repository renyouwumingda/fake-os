# Fake OS — 完整设计文档

---

## 一、用户旅程总览

```
打开网页
  → 启动动画（BIOS 自检风格）
    → 登录界面（假密码，随便输都能进）
      → 桌面加载（图标逐个弹出）
        → 自由探索各模块
          → 触发病毒.exe
            → 5阶段灾难动画
              → "系统已格式化" → 自动刷新，一切重来
```

**设计理念**：表面是一个正常 OS，但越探索越发现这个世界是"坏掉的"，最后被病毒吞噬。整个过程像在玩一个叙事游戏。

---

## 二、Phase 0: 启动序列

### 2.1 BIOS 自检屏（3秒）
- 黑屏 + 绿色等宽字体
- 模拟 POST 自检：
  ```
  BIOS v6.6.6 — FakeTech Industries
  Memory Test: 65536KB OK
  Detecting drives... C: 2TB OK
  WARNING: Sanity module not found
  Loading FakeOS v0.2.0...
  ```
- 最后一行 "Sanity module not found" 是第一个彩蛋
- 3秒后自动跳转登录页

### 2.2 登录界面
- 背景：模糊的壁纸（暗示桌面的样子）
- 中央：用户头像（一个像素风的 🤖）+ 用户名 "Admin"
- 密码输入框 + 登录按钮
- **彩蛋**：
  - 输任意密码都能进，但如果你输入 "password"，会多显示一行 "Wow, you're basic."
  - 输 "admin" → "Nice try. But no."
  - 点登录按钮 5 次不输密码 → "Are you okay?"
  - 输 "help" → "This is a login screen, not a terminal."
- 登录成功后：密码框变绿，显示 "Access Granted"，屏幕淡出

---

## 三、Phase 1: 桌面环境

### 3.1 壁纸
- 默认壁纸：深色渐变（蓝→紫），带微妙的网格纹理
- 时钟组件：右上角显示实时时间，格式 `HH:MM:SS`
- **彩蛋**：凌晨 0:00-3:00 壁纸会变成暗红色，时钟旁多一个 👁️ 图标

### 3.2 桌面图标（左侧排列）
```
┌─────────────┐
│ 🖥️ 终端     │
│ 📁 文件管理器│
│ 💬 聊天     │
│ ⚙️ 设置     │
│ 💀 病毒.exe │  ← 默认隐藏，触发后出现
│ 🎵 音乐     │  ← 额外小模块
└─────────────┘
```
- 双击图标打开对应窗口
- 右键图标 → 弹出菜单：打开 / 属性 / 删除（删除无效果但会弹窗 "Permission Denied: Nice try"）
- 图标支持拖拽重新排列

### 3.3 任务栏（底部）
```
┌──────────────────────────────────────────────────────┐
│ [开始] │ 已打开的窗口标签...           │ 22:43 📶 🔋 │
└──────────────────────────────────────────────────────┘
```
- 左侧：假的"开始"按钮，点击弹出假开始菜单（关机按钮、关于、都是假的）
- 中间：已打开窗口的缩略标签，点击切换焦点
- 右侧：时钟 + 假信号图标 + 假电量（永远 47%，因为 "电池已损坏"）
- 点"开始"→"关机"→ 弹窗 "System cannot shut down: Important things are happening" → 只能点 OK

### 3.4 窗口系统
- 每个窗口：标题栏（可拖拽）+ 内容区 + 右上角三按钮（最小化/最大化/关闭）
- 窗口可拖拽、可重叠、可最小化到任务栏
- 最大化时填满内容区（不覆盖任务栏）
- 窗口打开/关闭有缩放动画
- **彩蛋**：快速拖拽窗口到屏幕边缘 10 次 → 窗口开始轻微抖动

---

## 四、Phase 2: 伪终端

### 4.1 外观
- 黑底绿字（经典黑客风格）
- 顶部显示 `admin@fakeos:~$`
- 光标闪烁，支持输入
- 输入时有轻微的打字音效感（CSS 动画）

### 4.2 命令系统

**基础命令（让用户觉得正常）：**
| 命令 | 输出 |
|------|------|
| `help` | 显示命令列表 |
| `ls` | 列出当前目录文件 |
| `pwd` | `/home/admin` |
| `echo [text]` | 回显文本 |
| `date` | 当前时间 |
| `whoami` | `admin` (然后闪一下变成 `guest`) |
| `cat [file]` | 显示文件内容 |
| `clear` | 清屏 |

**整蛊命令（逐渐暴露异常）：**
| 命令 | 输出 |
|------|------|
| `sudo anything` | `[sudo] password for admin: ... Just kidding, I don't have sudo access. Or do I?` |
| `rm -rf /` | `Nice try. But this isn't Linux. ...Or is it?` |
| `matrix` | 屏幕进入黑客帝国绿色字符雨（5秒后自动恢复） |
| `hack` | 显示假进度条 "Hacking NASA... 1%" 然后 "Access denied. You're not Tom Cruise." |
| `money` | `Your bank balance: -$42,069.69` |
| `why` | `42` |
| `exit` | `You can check out any time you like, but you can never leave.` |
| `su root` | `root@fakeos:~#` 提示符变了，但输入任何命令都返回 "Permission denied. Even as root, you're nobody." |
| `history` | 显示用户所有输入过的历史，但夹杂一些你没输过的奇怪命令 |
| `secret` | `Segmentation fault (core dumped)` |
| `life` | `42 years of school debt. 0 achievement. Try again? (y/n)` |
| `open virus.exe` | `Are you sure? This cannot be undone. (y/n)` 输入 y → 触发病毒流程 |
| `ping god` | `Pinging god.local [127.0.0.1]... Reply: "I'm busy."` |
| `uninstall fakeos` | `Error: You are the virus.` |

### 4.3 隐藏触发
- 连续输入 3 次错误命令 → 终端闪红一下，显示 "Stop breaking things."
- 终端输入满 50 行后 → 底部出现一行小字 "Are you still typing? Nobody's reading this."
- 在终端输入 "open virus.exe" 后选 y → 进入病毒阶段

---

## 五、Phase 3: 文件管理器

### 5.1 虚拟文件系统
```
/home/admin/
├── Documents/
│   ├── 老板的黑历史.txt
│   ├── 辞职信_最终版.docx
│   ├── 密码.txt (空文件，打不开)
│   └── 会议记录_机密.pdf
├── Downloads/
│   ├── 免费VPN.exe (实际上是一个404页面的截图)
│   ├── 绩效评估_真实版.xlsx
│   └── 重要备份.zip (损坏的文件，打开显示乱码)
├── Pictures/
│   ├── 壁纸_正常.jpg
│   ├── 壁纸_诡异.jpg (点击后全屏闪一下)
│   └── screenshot_????.png
├── Videos/
│   └── README.txt: "视频文件已被删除。原因：太丑了。"
└── .hidden/
    ├── 不要打开.txt → "我说了不要打开。你还打开？好吧... 其实什么都没有。骗你的。"
    └── 真正的密码.txt → "admin123 (没错，就这？你以为呢？)"
```

### 5.2 交互细节
- 左侧：文件夹树形导航
- 右侧：当前目录文件列表
- 双击文件 → 打开预览窗口（文本文件用记事本风格显示）
- 文件有假的修改日期、大小
- **彩蛋**：
  - "壁纸_诡异.jpg" 点击后全屏闪一帧恐怖图片（CSS 红色闪烁）
  - "密码.txt" 双击后弹窗 "File is encrypted. Password required." → 输入任何内容 → "Wrong. Try again forever."
  - "免费VPN.exe" → 弹窗显示一个假的404页面
  - `.hidden` 文件夹默认隐藏，需要在终端输入 `show hidden` 才显示

---

## 六、Phase 4: 聊天软件

### 6.1 外观
- 仿微信/QQ 风格
- 左侧：联系人列表（5个 NPC）
- 右侧：聊天窗口

### 6.2 NPC 列表
```
👩 小红 — "产品经理"
👨 老王 — "技术总监"
🤖 系统通知 — "FakeOS System"
😈 匿名用户 — "???"
💀 病毒本尊 — "I'm already inside."
```

### 6.3 NPC 自动行为
- 每隔 15-30 秒，随机 NPC 发一条消息
- 小红：总是发需求变更（"这个按钮能不能再大一点？"、"用户说想要一个AI功能"）
- 老王：吐槽（"又改需求？"、"这个功能谁写的？代码像屎一样"）
- 系统通知：假的系统消息（"检测到异常登录"、"您的密码已被泄露"、"恭喜！您获得了免费升级"）
- 匿名用户：偶尔发一句莫名其妙的话（"他们都在看着你"、"你以为这是假的？"）
- 病毒本尊：触发后才出现，会说 "I see you."、"Don't try to close me."

### 6.4 用户交互
- 用户可以输入消息，NPC 会"回复"（预设的关键词匹配回复）
- 输入 "你好" → 小红: "你好！有个新需求跟你确认一下"
- 输入脏话 → 老王: "请注意言辞，这里是工作群"
- 输入 "help" → 系统通知: "本聊天室不提供帮助服务"
- 输入 "你是AI吗" → 匿名用户: "你怎么知道？"

### 6.5 彩蛋
- 连续发 10 条消息不被回复 → 弹窗 "消息发送失败。原因：你的社交技能为零。"
- 把聊天窗口拖拽到屏幕外 → NPC 发消息 "你去哪了？"
- 在 23:00-6:00 打开聊天 → 系统通知: "现在是深夜，正常人不会在线。你是正常人吗？"

---

## 七、Phase 5: 系统设置

### 7.1 设置面板布局
- 左侧导航：外观 / 隐私 / 关于 / 高级
- 右侧：对应设置项

### 7.2 外观设置
| 开关 | 效果 |
|------|------|
| 深色模式 | 整个 UI 变暗红（不是正常的深色） |
| 动画效果 | 关闭后所有动画消失，界面变得极丑（纯色方块） |
| 字体大小 | 拖动条从"正常"到"巨大"，超过某个值后文字开始重叠 |
| 壁纸轮换 | 开启后壁纸每 5 秒切换，但有一张是诡异的 |

### 7.3 隐私设置
| 开关 | 效果 |
|------|------|
| 发送使用数据 | 关不掉，每次关闭自动弹回 ON，下方小字 "你没有选择" |
| 麦克风权限 | 弹窗 "FakeOS 已获取您的麦克风权限"（假的） |
| 位置权限 | 显示 "当前位置：北京市朝阳区某地下室" |
| 广告个性化 | 关闭后反而出现更多"广告"（弹窗广告模拟） |

### 7.4 关于系统
- 系统版本：FakeOS v0.2.0 (Build: nobody-cares)
- 内存：640KB (应该够用了)
- 存储：已用 2TB / 总共 2TB (但你只存了几个txt)
- 处理器：Intel i9-99999K @ -3.5GHz
- 系统状态：⚠️ 一切正常 (但文字在闪红色)
- **彩蛋**：点击版本号 10 次 → 进入开发者控制台（假的，显示一堆乱码）

### 7.5 高级设置（需要输入密码才能进入）
- 密码提示："Hint: It's the answer to life"
- 输入 `42` → 进入
- 内容：
  - [危险区域] 格式化硬盘 → 点击后弹窗 "这只是个按钮，别紧张" → 但鼠标指针变成沙漏 3 秒
  - [危险区域] 删除所有数据 → 弹窗 "数据已删除" → 1秒后 "骗你的"
  - [开发者选项] → 打开后显示满屏的 console.log 风格输出

---

## 八、Phase 6: 病毒.exe

### 8.1 触发方式（三种）
1. 双击桌面隐藏的 💀 图标
2. 在终端输入 `open virus.exe` 然后输入 `y`
3. 在设置里点"格式化硬盘"然后输入 `confirm`

### 8.2 五阶段灾难

**阶段 1（0-3秒）：感染**
- 屏幕边缘开始出现红色脉冲
- 所有窗口标题变成 "I SEE YOU"
- 任务栏时间变成 "∞"

**阶段 2（3-8秒）：扩散**
- 鼠标指针变成骷髅头
- 每 1 秒自动弹出一个新窗口，标题是 "DON'T PANIC"，内容是 "Too late."
- 窗口无法关闭

**阶段 3（8-15秒）：失控**
- 屏幕开始轻微旋转（CSS transform）
- 桌面图标开始随机移动
- 终端自动打开，疯狂输入无意义字符
- 聊天软件自动发送 "THE END IS NEAR"

**阶段 4（15-22秒）：崩溃**
- 屏幕开始抖动
- 所有窗口开始无序弹出
- 壁纸变成纯红色
- 出现全屏遮罩，显示：
  ```
  ████████████████████████████
  █  FAKEOS HAS CRASHED    █
  █  错误代码: 0xDEADBEEF  █
  █  正在收集错误信息...   █
  █  找到 0 条有用信息      █
  ████████████████████████████
  ```

**阶段 5（22-28秒）：格式化**
- 屏幕变白
- 逐行显示：
  ```
  Formatting C: ...
  Deleting /home/admin/ ...
  Deleting /home/admin/Documents/ ...
  Deleting /home/admin/Dreams/ ...
  Deleting /home/admin/Hope/ ...
  Deleting /home/admin/Everything/ ...
  
  Format complete.
  No data was harmed. This is all fake.
  
  ...or is it?
  ```
- 3秒后页面自动刷新（location.reload()），一切重来

### 8.3 病毒中的隐藏信息
- 阶段 2 的弹窗中，有一个窗口标题写着 "Just kidding, close me!"（但真的能关闭）
- 阶段 3 的终端输入中，夹杂着一行 "Look behind you. Just kidding. Or am I?"
- 格式化阶段的 "Deleting /home/admin/Dreams/" 等是叙事性文字，暗示这个 OS 有灵魂

---

## 九、Phase 7: 全局彩蛋汇总

| 触发条件 | 效果 |
|---------|------|
| 桌面快速点击 10 次 | 壁纸变成猫的照片 |
| 按 F12 | 弹窗 "Nice try. DevTools are disabled in FakeOS." |
| Ctrl+U | 弹窗 "View source? This IS the source." |
| 凌晨打开 | 壁纸变暗红 + 时钟旁出现 👁️ |
| 同时打开所有窗口 | 弹窗 "你是想把电脑炸了吗？" |
| 窗口拖到屏幕边缘 10 次 | 窗口开始抖动 |
| 在任何输入框输入 "konami" | 激活彩蛋模式：所有文字变彩色 |
| 长时间不操作（60秒） | 弹窗 "你还在吗？还是去倒咖啡了？" |
| 右键桌面 | 显示自定义菜单，选项全是荒诞的 |
| 在终端输入 `sudo reboot` | `Rebooting... Just kidding. I don't listen to you.` |

---

## 十、技术规格

- **零依赖**：纯 HTML + CSS + Vanilla JS
- **性能**：所有动画使用 CSS transform/opacity，避免重排
- **响应式**：适配 1280px+ 桌面宽度
- **浏览器兼容**：Chrome / Edge / Firefox 最新版
- **文件大小**：目标 < 100KB（不含壁纸图片）

---

## 十一、开发顺序

1. `index.html` + `css/desktop.css` → 骨架和壁纸
2. `css/window.css` + `js/window.js` → 可拖拽窗口系统
3. `css/taskbar.css` + `js/taskbar.js` → 任务栏
4. `js/desktop.js` → 图标管理和双击事件
5. `js/terminal.js` + `css/terminal.css` → 终端 + 命令系统
6. `js/fileManager.js` → 文件管理器 + 虚拟文件系统
7. `js/chat.js` → 聊天软件 + NPC 逻辑
8. `js/settings.js` → 设置面板 + 整蛊开关
9. `js/virus.js` + `css/effects.css` → 病毒 5 阶段
10. `js/easterEggs.js` → 全局彩蛋
11. 打磨细节、添加过渡动画、优化体验

---

*文档版本: v1.0 | 创建时间: 2026-06-12*
