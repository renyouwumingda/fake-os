# 🖥️ FakeOS

> "表面是一个正常 OS，但越探索越发现这个世界是'坏掉的'，最后被病毒吞噬。"

一个运行在浏览器里的**伪操作系统**，用纯 HTML + CSS + Vanilla JS 构建，零依赖。打开网页就能体验从 BIOS 自检 → 登录 → 桌面 → 应用 → 病毒灾难的完整叙事流程。

[![版本](https://img.shields.io/badge/version-0.2.0-6c63ff)](https://github.com/renyouwumingda/fake-os/releases/tag/v0.2.0)
[![许可证](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🚀 快速体验

### 方式一：直接打开

```bash
git clone https://github.com/renyouwumingda/fake-os.git
cd fake-os
# 双击打开 index.html
```

### 方式二：npm 安装

```bash
npm install fake-os
# 然后打开 node_modules/fake-os/index.html
```

### 方式三：在线体验

> 直接打开 `index.html` 即可，不需要任何服务器或构建工具。

1. 等待 BIOS 自检动画完成
2. 输入任意密码登录（试试输入 "password"）
3. 双击桌面图标打开应用
4. 探索、玩耍、触发病毒 💀

## ✨ 功能

### 🖥️ 桌面环境
- 启动序列（BIOS 自检 → 登录 → 桌面）
- 可拖拽/缩放/最小化/最大化/关闭的窗口系统
- 任务栏（开始菜单、窗口切换、时钟、信号、电量）
- 桌面图标（双击打开、右键菜单、选中效果）

### 🧩 内置应用
| 应用 | 描述 |
|------|------|
| **终端** | 黑底绿字，20+ 条命令，支持 `cd` 导航文件系统 |
| **文件管理器** | 虚拟文件系统，藏着各种彩蛋文件 |
| **聊天** | 5 个 NPC 自动发消息，关键词回复 |
| **设置** | 全是整蛊开关（关不掉的数据共享、关了弹更多广告） |
| **记事本** | 可以编辑文本，"保存"成功但什么都没存 |
| **计算器** | 前 10 次算对，之后开始出错（6×9=42） |
| **音乐** | 播放不存在的歌曲.mp3 |
| **病毒.exe** | ☠️ 5 阶段灾难动画，触发后不可逆 |

### 🎯 快捷键
| 快捷键 | 功能 |
|--------|------|
| `Alt+F4` | 关闭当前窗口 |
| `Alt+Tab` | 切换窗口 |
| `Win+D` / `Ctrl+Shift+D` | 显示桌面 |
| `Win+E` / `Ctrl+Shift+E` | 打开文件管理器 |
| `Escape` | 关闭弹窗/菜单 |
| `↑↑↓↓←→←→BA` | Konami 彩蛋 🌈 |

### 🥚 彩蛋
- 桌面狂点 10 次 → 壁纸变色
- 凌晨 0:00-3:00 → 壁纸变暗红，时钟旁出现 👁️
- 闲置 60 秒 → "你还在吗？还是去倒咖啡了？"
- 终端输入 `matrix` → 黑客帝国字符雨
- 终端输入 `hack` → 假装黑 NASA
- 终端输入 `history` → 查看命令历史
- 终端输入 `why` → 42
- 版本号点 10 次 → 假开发者控制台
- 设置里密码输入 `42` → 解锁"危险区域"

### 💀 病毒结局
三种触发方式：
1. 双击桌面 💀 图标
2. 终端输入 `open virus.exe` 确认 `y`
3. 设置 → 高级 → 格式化硬盘

5 阶段灾难：感染 → 弹窗洪流 → 屏幕旋转 → 崩溃蓝屏 → "格式化" → 自动刷新重来

---

## 🏗️ 项目结构

```
fake-os/
├── index.html          # 入口
├── package.json        # npm 包配置
├── .gitignore          # Git 忽略配置
├── DESIGN.md           # 设计文档
├── ENRICHMENT_PLAN.md  # 内容丰富计划
├── LICENSE             # MIT 许可证
├── css/
│   ├── boot.css        # 启动、登录
│   ├── desktop.css     # 桌面、图标、右键菜单
│   ├── window.css      # 窗口系统
│   ├── taskbar.css     # 任务栏、开始菜单
│   ├── terminal.css    # 终端、文件管理器、聊天
│   └── effects.css     # 特效动画
└── js/
    ├── main.js         # 主控制器、启动、登录
    ├── window.js       # 窗口管理器
    ├── taskbar.js      # 任务栏
    ├── desktop.js      # 桌面图标、应用开关
    ├── terminal.js     # 终端模拟器
    ├── fileManager.js  # 文件管理器
    ├── chat.js         # 聊天软件
    ├── settings.js     # 系统设置
    ├── virus.js        # 病毒灾难
    ├── shortcuts.js    # 快捷键
    ├── notifications.js# 通知系统
    ├── notepad.js      # 记事本
    ├── calculator.js   # 计算器
    └── easterEggs.js   # 全局彩蛋
```

## 🛠️ 技术栈

- **纯前端**：HTML + CSS + Vanilla JS，零依赖
- **特效**：CSS animations + Canvas + requestAnimationFrame
- **大小**：~22 个文件，~4000 行代码

---

## 📋 更新日志

### v0.2.0 (2026-06-13)
- 🐛 修复：聊天窗口重复打开时消息发送多次的 bug
- ✨ 新增：终端 `history` 命令，查看命令历史
- 📦 发布：npm 包 `fake-os`

### v0.1.3
- 初始版本

---

## 📦 发布

```bash
# Git 发布
git tag v0.2.0
git push origin master --tags

# npm 发布
npm login
npm publish
```

---

## 📄 许可证

[MIT](LICENSE)

---

*Built with ❤️ and a lot of free time.*
