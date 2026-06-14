# 🖥️ FakeOS

> "表面是一个正常 OS，但越探索越发现这个世界是'坏掉的'。"

一个运行在浏览器里的**伪操作系统**，用纯 HTML + CSS + Vanilla JS 构建，零依赖。

[![版本](https://img.shields.io/badge/version-0.4.2-6c63ff)](https://github.com/renyouwumingda/fake-os/releases/tag/v0.4.2)
[![许可证](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🚀 快速体验

`ash
git clone https://github.com/renyouwumingda/fake-os.git
cd fake-os
# 双击打开 index.html
`

直接打开 index.html 即可，不需要任何服务器或构建工具。

---

## ✨ 功能

### 🖥️ 桌面环境
- 启动序列（BIOS 自检 → 登录 → 桌面）
- 可拖拽/缩放/最小化/最大化/关闭的窗口系统
- 任务栏（开始菜单、窗口切换、时钟、信号、电量）
- 桌面图标（双击打开、右键菜单、选中效果）

### 🧩 内置应用
| 应用 | 描述 |
|------|------|
| **终端** | 黑底绿字，支持多种命令和文件系统导航 |
| **文件管理器** | 虚拟文件系统，里面藏着一些东西 |
| **聊天** | 多个联系人，自动发消息 |
| **设置** | 各种开关，有些行为可能不太正常 |
| **记事本** | 可以编辑文本 |
| **计算器** | 基础计算器 |
| **音乐** | 播放器界面 |
| **天气** | 天气预报 |
| **画板** | 绘图工具 |
| **回收站** | 已删除的文件 |
| **监控摄像头** | ？？？ |
| **系统日志** | ？？？ |
| **镜像** | ？？？ |

### 🎯 快捷键
| 快捷键 | 功能 |
|--------|------|
| Alt+F4 | 关闭当前窗口 |
| Alt+Tab | 切换窗口 |
| Win+D / Ctrl+Shift+D | 显示桌面 |
| Win+E / Ctrl+Shift+E | 打开文件管理器 |
| Escape | 关闭弹窗/菜单 |

### 💀 关于病毒
> 不要轻易尝试。

---

## 🏗️ 项目结构

`
fake-os/
├── index.html          # 入口
├── .gitignore          # Git 忽略配置
├── DESIGN.md           # 设计文档
├── ENRICHMENT_PLAN.md  # 内容丰富计划
├── HORROR_LORE.md      # 恐怖叙事设计文档
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
    ├── easterEggs.js   # 彩蛋系统
    ├── horror.js       # 恐怖等级系统
    ├── camera.js       # 监控摄像头
    ├── systemLog.js    # 系统日志
    ├── mirror.js       # 镜像
    ├── hiddenFolder.js # 隐藏文件夹
    ├── weather.js      # 天气
    ├── drawpad.js      # 画板
    └── recycleBin.js   # 回收站
`

## 🛠️ 技术栈

- **纯前端**：HTML + CSS + Vanilla JS，零依赖
- **特效**：CSS animations + Canvas + requestAnimationFrame
- **大小**：~24 个文件，~5000+ 行代码

---

## 📋 更新日志

### v0.4.2 (2026-06-14)
- 🐛 修复：终端版本号更新为 v0.4.2
- 🐛 修复：终端 cat /dev/brain 返回内容修正
- 🐛 修复：终端 cat 命令重复注册
- ✨ 优化：完整剧情流程测试通过（Playwright）
- ✨ 优化：叙事引擎架构完善

### v0.4.1 (2026-06-13)
- 🐛 修复：恐怖系统调度器未启动
- 🐛 修复：语法错误导致多个应用无法打开
- 🐛 修复：监控摄像头防重开机制
- ✨ 优化：系统日志内容补全
- ✨ 新增：文件管理器日记目录
- ✨ 优化：病毒文件发现机制

### v0.4.0 (2026-06-13)
- ✨ 新增：恐怖等级系统
- ✨ 新增：监控摄像头应用
- ✨ 新增：系统日志应用
- ✨ 新增：镜像应用
- ✨ 新增：隐藏文件夹
- ✨ 新增：环境恐怖事件
- ✨ 新增：第四面墙打破机制

### v0.3.0 (2026-06-13)
- ✨ 新增：天气应用
- ✨ 新增：画板应用
- ✨ 新增：回收站应用
- 🐛 修复：多项 UI 和交互问题

### v0.2.0 (2026-06-13)
- 🐛 修复：聊天窗口重复打开时消息发送多次
- ✨ 新增：终端 history 命令

### v0.1.3
- 初始版本

---

## 📄 许可证

[MIT](LICENSE)

---

*Built with ❤️ and a lot of free time.*
*有些东西，最好别发现。*
