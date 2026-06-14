// ===== 记忆系统 =====
var StoryMemory = {
  STORAGE_KEY: 'fakeos_story',
  
  save: function() {
    try {
      var data = {
        playCount: this.getPlayCount() + 1,
        choices: StoryEngine.choices,
        flags: StoryEngine.flags,
        phase: StoryEngine.phase,
        lastPlayed: Date.now(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch(e) {}
  },
  
  load: function() {
    try {
      var raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
  },
  
  getPlayCount: function() {
    var data = this.load();
    return data ? data.playCount || 0 : 0;
  },
  
  isNewPlayer: function() {
    return this.getPlayCount() === 0;
  },
  
  isReturning: function() {
    return this.getPlayCount() > 0;
  },
  
  restoreState: function() {
    var data = this.load();
    if (data) {
      StoryEngine.choices = data.choices || {};
      StoryEngine.flags = data.flags || {};
      StoryEngine.phase = data.phase || 'explore';
    }
  },
};
