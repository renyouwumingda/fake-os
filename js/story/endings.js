// ===== 结局系统 =====
var Endings = {
  // Determine which ending based on player choices
  determine: function() {
    var helpedMaintainer = StoryEngine.getChoice('helpedMaintainer');
    var obeyedSystem = StoryEngine.getChoice('obeyedSystem');
    var readEscapePlan = StoryEngine.getFlag('readEscapePlan');
    
    // Ending C: Became the new maintainer
    if (helpedMaintainer && readEscapePlan) return 'maintainer';
    if (StoryEngine.getChoice('foughtSystem')) return 'defiance';
    if (StoryEngine.getChoice('sacrificedSelf')) return 'sacrifice';
    // Ending B: Escape failed
    if (obeyedSystem === false) return 'escape_failed';
    // Ending A: Absorbed by system (default)
    return 'absorbed';
  },
  
  // Get ending display text
  getText: function(endingId) {
    var texts = {
      absorbed: {
        title: '你被吸收了',
        text: '系统成功捕获了你的意识。\n\n现在你是 #00019。\n\n你的影子会留在系统各处。\n等待下一个用户。',
      },
      escape_failed: {
        title: '逃离失败',
        text: '你尝试了逃离。\n\n但系统早已预料到一切。\n\n一切重来。\n\n你是新的 #00018。',
      },
      maintainer: {
        title: '成为维护者',
        text: '你选择帮助系统维护者。\n\n但代价是...\n你成为了新的系统维护者。\n\n等待下一个用户。',
      },
    };
    return texts[endingId] || texts.absorbed;
  },
  
  // Trigger the ending
  trigger: function(forcedEnding) {
    var ending = forcedEnding || this.determine();
    var text = this.getText(ending);
    StoryEngine.phase = 'ending';
    StoryEngine.setChoice('ending', ending);
    StoryMemory.save();
    showAlert(text.title, text.text, function() {
      location.reload();
    });
  },
};
