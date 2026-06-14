// ===== 剧情引擎 =====
var StoryEngine = {
  phase: 'explore',  // explore → discovery → truth → confrontation → ending
  choices: {},
  flags: {},
  
  setFlag: function(key, val) { this.flags[key] = val; },
  getFlag: function(key) { return this.flags[key]; },
  setChoice: function(key, val) { this.choices[key] = val; },
  getChoice: function(key) { return this.choices[key]; },
  
  // Phase advancement based on horror level
  advance: function() {
    var level = typeof horrorState !== 'undefined' ? horrorState.level : 0;
    if (level >= 1 && this.phase === 'explore') this.phase = 'discovery';
    if (level >= 3 && this.phase === 'discovery') this.phase = 'truth';
    if (level >= 4 && this.phase === 'truth') this.phase = 'confrontation';
    if (level >= 5 && this.phase === 'confrontation') this.phase = 'ending';
  },
  
  // Track app opens
  onAppOpen: function(appName) {
    if (!this.flags.appsOpened) this.flags.appsOpened = [];
    if (this.flags.appsOpened.indexOf(appName) === -1) {
      this.flags.appsOpened.push(appName);
    }
    this.advance();
  },
  
  // Track commands
  onCommand: function(cmd) {
    if (!this.flags.commandsRun) this.flags.commandsRun = 0;
    this.flags.commandsRun++;
    this.advance();
  },
  
  // Track chat messages
  onChat: function() {
    if (!this.flags.chatMessages) this.flags.chatMessages = 0;
    this.flags.chatMessages++;
    this.advance();
  },
  
  // Get phase description for storyline.js reference
  getPhaseDescription: function() {
    return Storyline.phases[this.phase] || '未知阶段';
  },
};
