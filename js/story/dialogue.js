// ===== 对话系统 =====
var DialogueSystem = {
  currentRound: 0,
  rounds: MAINTAINER_ROUNDS, // references narrative/maintainer.js
  
  checkAndTrigger: function() {
    var elapsed = (Date.now() - horrorState.startTime) / 1000;
    var self = this;
    this.rounds.forEach(function(round) {
      if (round.used) return;
      var trigger = false;
      if (round.trigger === 'time' && elapsed >= round.threshold) trigger = true;
      if (round.trigger === 'apps' && horrorState.appsOpened.length >= round.threshold) trigger = true;
      if (round.trigger === 'hidden' && horrorState.hiddenFound) trigger = true;
      if (round.trigger === 'commands' && horrorState.commandsRun >= round.threshold) trigger = true;
      if (round.trigger === 'meetings' && horrorState.chatMessages >= round.threshold) trigger = true;
      if (trigger) {
        round.used = true;
        horrorState.maintainerMet = true;
        StoryEngine.setFlag('maintainerRound_' + self.rounds.indexOf(round), true);
        self.playRound(round);
      }
    });
  },
  
  playRound: function(round) {
    round.messages.forEach(function(msg, i) {
      setTimeout(function() {
        if (typeof addNpcMsg === 'function' && msg.from === 'system') {
          addNpcMsg('maintainer', msg.text);
        } else if (typeof addSystemMsg === 'function' && msg.from === 'user' && msg.options) {
          addSystemMsg('选择回复: ' + msg.options.join(' / '));
        }
      }, i * 2000);
    });
  },
};
