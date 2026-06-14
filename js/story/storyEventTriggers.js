// ===== 剧情事件触发器注册 =====
// 根据 storyline.js 的设计，注册所有条件→事件映射
function registerStoryTriggers() {
  if (typeof StoryEvents === 'undefined' || typeof StoryVariables === 'undefined') return;

  // ==========================================
  // 维护者对话触发器（5轮）
  // ==========================================
  StoryEvents.register('maintainer.round1', {
    condition: function() {
      return StoryVariables.get('playTime') >= 600
        && !StoryEvents.fired['maintainer.round1']
        && typeof StoryEngine !== 'undefined'
        && StoryEngine.getFlag('maintainerRound_0') !== true;
    },
    action: function() {
      if (typeof StoryEngine !== 'undefined') StoryEngine.setFlag('maintainerRound_0', true);
      if (typeof MAINTAINER_ROUNDS !== 'undefined' && MAINTAINER_ROUNDS[0]) MAINTAINER_ROUNDS[0].used = true;
      if (typeof horrorState !== 'undefined') horrorState.maintainerMet = true;
      if (typeof DialogueSystem !== 'undefined') DialogueSystem.isPlaying = true;
      StoryVariables.set('maintainerRounds', 1);
      StoryGraph.clearChat('maintainer');
      StoryGraph.trigger('maintainer.r1.start');
    },
    once: true,
    priority: 10,
  });

  StoryEvents.register('maintainer.round2', {
    condition: function() {
      return StoryVariables.get('appsOpened') >= 3
        && StoryEvents.fired['maintainer.round1']
        && !StoryEvents.fired['maintainer.round2']
        && typeof StoryEngine !== 'undefined'
        && StoryEngine.getFlag('maintainerRound_1') !== true
        && !(typeof DialogueSystem !== 'undefined' && DialogueSystem.isPlaying);
    },
    action: function() {
      if (typeof StoryEngine !== 'undefined') StoryEngine.setFlag('maintainerRound_1', true);
      if (typeof MAINTAINER_ROUNDS !== 'undefined' && MAINTAINER_ROUNDS[1]) MAINTAINER_ROUNDS[1].used = true;
      if (typeof DialogueSystem !== 'undefined') DialogueSystem.isPlaying = true;
      StoryVariables.set('maintainerRounds', 2);
      StoryGraph.clearChat('maintainer');
      StoryGraph.trigger('maintainer.r2.start');
    },
    once: true,
    priority: 9,
  });

  StoryEvents.register('maintainer.round3', {
    condition: function() {
      return StoryVariables.get('hiddenFound')
        && StoryEvents.fired['maintainer.round2']
        && !StoryEvents.fired['maintainer.round3']
        && typeof StoryEngine !== 'undefined'
        && StoryEngine.getFlag('maintainerRound_2') !== true
        && !(typeof DialogueSystem !== 'undefined' && DialogueSystem.isPlaying);
    },
    action: function() {
      if (typeof StoryEngine !== 'undefined') StoryEngine.setFlag('maintainerRound_2', true);
      if (typeof MAINTAINER_ROUNDS !== 'undefined' && MAINTAINER_ROUNDS[2]) MAINTAINER_ROUNDS[2].used = true;
      if (typeof DialogueSystem !== 'undefined') DialogueSystem.isPlaying = true;
      StoryVariables.set('maintainerRounds', 3);
      StoryGraph.clearChat('maintainer');
      StoryGraph.trigger('maintainer.r3.start');
    },
    once: true,
    priority: 8,
  });

  StoryEvents.register('maintainer.round4', {
    condition: function() {
      return StoryVariables.get('commandsRun') >= 10
        && StoryEvents.fired['maintainer.round3']
        && !StoryEvents.fired['maintainer.round4']
        && typeof StoryEngine !== 'undefined'
        && StoryEngine.getFlag('maintainerRound_3') !== true
        && !(typeof DialogueSystem !== 'undefined' && DialogueSystem.isPlaying);
    },
    action: function() {
      if (typeof StoryEngine !== 'undefined') StoryEngine.setFlag('maintainerRound_3', true);
      if (typeof MAINTAINER_ROUNDS !== 'undefined' && MAINTAINER_ROUNDS[3]) MAINTAINER_ROUNDS[3].used = true;
      if (typeof DialogueSystem !== 'undefined') DialogueSystem.isPlaying = true;
      StoryVariables.set('maintainerRounds', 4);
      StoryGraph.clearChat('maintainer');
      StoryGraph.trigger('maintainer.r4.start');
    },
    once: true,
    priority: 7,
  });

  StoryEvents.register('maintainer.round5', {
    condition: function() {
      return StoryVariables.get('maintainerRounds') >= 3
        && StoryEvents.fired['maintainer.round4']
        && !StoryEvents.fired['maintainer.round5']
        && typeof StoryEngine !== 'undefined'
        && StoryEngine.getFlag('maintainerRound_4') !== true
        && !(typeof DialogueSystem !== 'undefined' && DialogueSystem.isPlaying);
    },
    action: function() {
      if (typeof StoryEngine !== 'undefined') StoryEngine.setFlag('maintainerRound_4', true);
      if (typeof MAINTAINER_ROUNDS !== 'undefined' && MAINTAINER_ROUNDS[4]) MAINTAINER_ROUNDS[4].used = true;
      if (typeof DialogueSystem !== 'undefined') DialogueSystem.isPlaying = true;
      StoryVariables.set('maintainerRounds', 5);
      StoryGraph.clearChat('maintainer');
      StoryGraph.trigger('maintainer.r5.start');
    },
    once: true,
    priority: 6,
  });

  // ==========================================
  // 恐怖等级推进剧情
  // ==========================================
  StoryEvents.register('phase.discovery', {
    condition: function() {
      return StoryVariables.get('playTime') >= 180
        && StoryVariables.get('appsOpened') >= 3
        && typeof StoryEngine !== 'undefined'
        && StoryEngine.phase === 'explore';
    },
    action: function() {
      StoryEngine.phase = 'discovery';
    },
    once: true,
    priority: 15,
  });

  StoryEvents.register('phase.truth', {
    condition: function() {
      return StoryVariables.get('hiddenFound')
        && typeof StoryEngine !== 'undefined'
        && StoryEngine.phase === 'discovery';
    },
    action: function() {
      StoryEngine.phase = 'truth';
    },
    once: true,
    priority: 14,
  });

  StoryEvents.register('phase.confrontation', {
    condition: function() {
      return StoryVariables.get('maintainerRounds') >= 3
        && typeof StoryEngine !== 'undefined'
        && StoryEngine.phase === 'truth';
    },
    action: function() {
      StoryEngine.phase = 'confrontation';
    },
    once: true,
    priority: 13,
  });
}
