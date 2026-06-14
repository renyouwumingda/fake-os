// ===== 集中式游戏变量系统 =====
// 所有剧情相关变量集中管理，供条件判断和副作用使用
var StoryVariables = {
  // 游戏变量
  vars: {
    // 时间
    playTime: 0,           // 游戏时间（秒）
    
    // 探索
    appsOpened: 0,         // 打开的应用数
    commandsRun: 0,        // 执行的命令数
    hiddenFound: false,    // 是否发现隐藏文件夹
    
    // 对话
    chatMessages: 0,       // 聊天消息数
    maintainerRounds: 0,   // 维护者对话轮次
    maintainerMet: false,  // 是否见过维护者
    
    // 应用
    mirrorInputs: 0,       // 镜像输入次数
    cameraTime: 0,         // 监控使用时间（秒）
    filesOpened: 0,        // 打开的文件数
    
    // 剧情标记
    readEscapePlan: false, // 读过逃生计划
    helpedMaintainer: false, // 帮助了维护者
    obeyedSystem: null,    // 是否服从系统（null=未选择, true=服从, false=反抗）
    
    // 周目
    playCount: 0,          // 第几次玩
    isReturning: false,    // 是否是回归玩家
  },

  // 获取变量
  get: function(key) {
    return this.vars[key];
  },

  // 设置变量
  set: function(key, value) {
    var old = this.vars[key];
    this.vars[key] = value;
    // 触发变量变化事件
    if (old !== value && typeof StoryEvents !== 'undefined') {
      StoryEvents.onVariableChange(key, value, old);
    }
  },

  // 应用副作用集合
  applyEffects: function(effects) {
    var self = this;
    if (typeof effects === 'function') { effects(); return; }
    Object.keys(effects).forEach(function(key) {
      var val = effects[key];
      if (typeof val === 'function') {
        self.set(key, val(self.get(key)));
      } else {
        self.set(key, val);
      }
    });
  },

  // 从 horrorState 同步变量
  syncFromHorror: function() {
    if (typeof horrorState === 'undefined') return;
    this.vars.playTime = horrorState.totalPlayTime || 0;
    this.vars.appsOpened = horrorState.appsOpened ? horrorState.appsOpened.length : 0;
    this.vars.commandsRun = horrorState.commandsRun || 0;
    this.vars.hiddenFound = horrorState.hiddenFound || false;
    this.vars.chatMessages = horrorState.chatMessages || 0;
    this.vars.maintainerMet = horrorState.maintainerMet || false;
    this.vars.mirrorInputs = horrorState.mirrorInputs || 0;
    this.vars.cameraTime = horrorState.cameraTime || 0;
    if (typeof StoryEngine !== 'undefined') {
      this.vars.helpedMaintainer = StoryEngine.getChoice('helpedMaintainer') || false;
      this.vars.obeyedSystem = StoryEngine.getChoice('obeyedSystem');
      this.vars.readEscapePlan = StoryEngine.getFlag('readEscapePlan') || false;
    }
  },

  // 同步到 horrorState（反向同步）
  syncToHorror: function() {
    if (typeof horrorState === 'undefined') return;
    horrorState.totalPlayTime = this.vars.playTime;
    horrorState.commandsRun = this.vars.commandsRun;
    horrorState.hiddenFound = this.vars.hiddenFound;
    horrorState.chatMessages = this.vars.chatMessages;
    horrorState.maintainerMet = this.vars.maintainerMet;
    horrorState.mirrorInputs = this.vars.mirrorInputs;
    horrorState.cameraTime = this.vars.cameraTime;
  },
};
