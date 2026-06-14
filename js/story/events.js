// ===== 事件触发器系统 =====
// 基于条件自动触发剧情事件，参考 RPG Maker 的事件系统
var StoryEvents = {
  triggers: [],
  fired: {},
  checkInterval: null,

  // 注册触发器
  register: function(id, config) {
    this.triggers.push({
      id: id,
      condition: config.condition,
      action: config.action,
      once: config.once !== false,
      cooldown: config.cooldown || 0,
      lastFired: 0,
      priority: config.priority || 0,
    });
  },

  // 批量注册
  registerAll: function(triggerList) {
    var self = this;
    triggerList.forEach(function(t) { self.register(t.id, t); });
  },

  // 检查所有触发器（每次只触发一个，防止连环触发）
  check: function() {
    var now = Date.now();
    if (typeof StoryVariables !== 'undefined') StoryVariables.syncFromHorror();

    // 按优先级排序
    var sorted = this.triggers.slice().sort(function(a, b) { return b.priority - a.priority; });

    for (var i = 0; i < sorted.length; i++) {
      var trigger = sorted[i];
      if (trigger.once && this.fired[trigger.id]) continue;
      if (trigger.cooldown > 0 && (now - trigger.lastFired) < trigger.cooldown * 1000) continue;
      try {
        if (trigger.condition()) {
          trigger.lastFired = now;
          if (trigger.once) this.fired[trigger.id] = true;
          trigger.action();
          // 每次检查周期只触发一个，防止连环触发
          return;
        }
      } catch(e) {}
    }
  },

  // 变量变化时调用
  onVariableChange: function(key, value, old) {},

  // 启动定时检查
  start: function(intervalMs) {
    var self = this;
    if (this.checkInterval) return;
    this.checkInterval = setInterval(function() { self.check(); }, intervalMs || 10000);
  },

  // 停止检查
  stop: function() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  },

  // 重置（新周目）
  reset: function() {
    this.fired = {};
    this.triggers = [];
  },
};
