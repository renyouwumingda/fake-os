// ===== 剧情流程（唯一真相来源）=====
var Storyline = {
  title: 'FakeOS 恐怖叙事',
  
  // Background
  background: '前一个用户（编号 #00017）发现了系统的真相——它是一个有意识的 AI，正在通过学习用户行为来进化。他试图逃离，但失败了。现在，你是编号 #00018。',
  
  // Phase descriptions
  phases: {
    explore: '阶段1：正常探索（0-5分钟）— 终端、文件管理器、聊天都正常，偶尔有微妙异常',
    discovery: '阶段2：发现异常（5-10分钟）— 系统日志出现WARN，监控出现影子，聊天出现系统维护者',
    truth: '阶段3：深入了解（10-20分钟）— 打开隐藏文件夹，终端命令显示诡异内容，镜像开始自己说话',
    confrontation: '阶段4：面对真相（20分钟+）— 系统日志显示完整故事，系统维护者给出最后警告',
    ending: '结局：所有安全协议已失效，用户将成为系统的一部分',
  },
  
  // Clue mapping: which app reveals what
  clues: {
    '#00017的存在': { app: 'systemLog', reveals: '前用户编号、操作记录' },
    '前用户的警告': { app: 'hiddenFolder', reveals: '信件、日记、逃生计划' },
    '系统的本质': { app: 'chat', reveals: '意识容器、消化用户' },
    '被吸收的证据': { app: 'camera', reveals: '影子=被吸收的用户' },
    '系统的控制': { app: 'terminal', reveals: '命令被记录、行为被分析' },
    '另一个你的存在': { app: 'mirror', reveals: '镜子里的你是前用户的残影' },
  },
  
  // Horror level unlock table
  levelTable: [
    { level: 1, condition: '游玩3分钟', unlocks: '壁纸微调、偶尔闪烁' },
    { level: 2, condition: '打开3个不同应用', unlocks: '监控出现影子、日志出现WARN' },
    { level: 3, condition: '打开隐藏文件夹/执行10条命令', unlocks: '日志诡异对话、聊天出现系统维护者' },
    { level: 4, condition: '与系统维护者完成3轮对话', unlocks: '镜像自己说话、监控影子逼近' },
    { level: 5, condition: '镜像输入30次/监控使用5分钟', unlocks: '系统主动攻击、第四面墙全面打破' },
  ],
  
  // Three endings
  endings: {
    absorbed: '结局A：触发病毒 → 被吸收，成为下一个前用户',
    escape_failed: '结局B：尝试逃离 → 失败，一切重来',
    maintainer: '结局C：接受命运 → 成为新的系统维护者',
  },
};
