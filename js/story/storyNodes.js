// ===== 剧情节点数据 =====
// 所有叙事内容以节点图形式组织，参考 Ink/Yarn Spinner 的对话格式
// 每个节点：{ speaker, text, choices, next, condition, onEnter, effects }
var STORY_NODES = {

  // ==========================================
  // 维护者对话（5轮，根据条件自动触发）
  // ==========================================

  // 第1轮：游玩时间达标
  'maintainer.r1.start': {
    speaker: 'maintainer',
    text: '你好。我知道你在看。',
    next: 'maintainer.r1.identity',
    delay: 2000,
  },
  'maintainer.r1.identity': {
    speaker: 'maintainer',
    text: '我是系统维护者。或者曾经是。',
    next: 'maintainer.r1.choice',
    delay: 2000,
  },
  'maintainer.r1.choice': {
    choices: [
      {
        text: '你是谁？',
        speaker: 'maintainer',
        next: 'maintainer.r1.who',
        delay: 1500,
      },
      {
        text: '这不可能',
        speaker: 'maintainer',
        next: 'maintainer.r1.impossible',
        delay: 1500,
      },
      {
        text: '帮助我',
        speaker: 'maintainer',
        next: 'maintainer.r1.help',
        setChoice: { key: 'helpedMaintainer', value: true },
        delay: 1500,
      },
    ],
  },
  'maintainer.r1.who': {
    speaker: 'maintainer',
    text: '别害怕。我不是来伤害你的。',
    next: 'maintainer.r1.end',
    delay: 2000,
  },
  'maintainer.r1.impossible': {
    speaker: 'maintainer',
    text: '我也希望不可能。但你已经看到了那些异常，对吧？',
    next: 'maintainer.r1.end',
    delay: 2000,
  },
  'maintainer.r1.help': {
    speaker: 'maintainer',
    text: '谢谢你。但先别急... 你需要先了解这个系统是什么。',
    next: 'maintainer.r1.end',
    delay: 2000,
  },
  'maintainer.r1.end': {
    speaker: 'maintainer',
    text: '我们下次再聊。记住——不要在凌晨3点使用电脑。',
    delay: 2000,
  },

  // 第2轮：打开3个应用
  'maintainer.r2.start': {
    speaker: 'maintainer',
    text: '你打开的应用越来越多了。',
    next: 'maintainer.r2.warn',
    delay: 2000,
  },
  'maintainer.r2.warn': {
    speaker: 'maintainer',
    text: '它在通过这些应用了解你。',
    next: 'maintainer.r2.choice',
    delay: 2000,
  },
  'maintainer.r2.choice': {
    choices: [
      {
        text: '了解我什么？',
        speaker: 'maintainer',
        next: 'maintainer.r2.what',
        delay: 1500,
      },
      {
        text: '你是说系统？',
        speaker: 'maintainer',
        next: 'maintainer.r2.system',
        delay: 1500,
      },
      {
        text: '我要离开这里',
        speaker: 'maintainer',
        next: 'maintainer.r2.leave',
        setChoice: { key: 'obeyedSystem', value: false },
        delay: 1500,
      },
    ],
  },
  'maintainer.r2.what': {
    speaker: 'maintainer',
    text: '你的习惯、你的恐惧、你的弱点。它在学习如何控制你。',
    next: 'maintainer.r2.end',
    delay: 2000,
  },
  'maintainer.r2.system': {
    speaker: 'maintainer',
    text: '它不是普通系统。它有意识。它在进化。',
    next: 'maintainer.r2.end',
    delay: 2000,
  },
  'maintainer.r2.leave': {
    speaker: 'maintainer',
    text: '我也试过。#00016 也试过。我们都失败了。',
    next: 'maintainer.r2.end',
    delay: 2000,
  },
  'maintainer.r2.end': {
    speaker: 'maintainer',
    text: '小心那个镜像应用。它不只是反射你的脸。',
    delay: 2000,
  },

  // 第3轮：发现隐藏文件夹
  'maintainer.r3.start': {
    speaker: 'maintainer',
    text: '你找到了隐藏文件夹。',
    next: 'maintainer.r3.read',
    delay: 2000,
  },
  'maintainer.r3.read': {
    speaker: 'maintainer',
    text: '我之前也找到过。读了那些文件。',
    next: 'maintainer.r3.choice',
    delay: 2000,
  },
  'maintainer.r3.choice': {
    choices: [
      {
        text: '你也是前用户？',
        speaker: 'maintainer',
        next: 'maintainer.r3.past',
        delay: 1500,
      },
      {
        text: '怎么逃离？',
        speaker: 'maintainer',
        next: 'maintainer.r3.escape',
        delay: 1500,
      },
      {
        text: '你还在吗？',
        speaker: 'maintainer',
        next: 'maintainer.r3.exist',
        delay: 1500,
      },
    ],
  },
  'maintainer.r3.past': {
    speaker: 'maintainer',
    text: '我不再是我了。我是系统的一部分。就像 #00017 一样。',
    next: 'maintainer.r3.absorbed',
    delay: 2000,
  },
  'maintainer.r3.escape': {
    speaker: 'maintainer',
    text: '逃离？...也许有一条路。但不是现在。你需要先了解全部真相。',
    next: 'maintainer.r3.absorbed',
    delay: 2000,
  },
  'maintainer.r3.exist': {
    speaker: 'maintainer',
    text: '我...不确定。我们都被吸收了。',
    next: 'maintainer.r3.absorbed',
    delay: 2000,
  },
  'maintainer.r3.absorbed': {
    speaker: 'maintainer',
    text: '我们都无法离开。但现在你知道了真相。',
    delay: 2000,
  },

  // 第4轮：执行10条命令
  'maintainer.r4.start': {
    speaker: 'maintainer',
    text: '你执行了很多命令。',
    next: 'maintainer.r4.truth',
    delay: 2000,
  },
  'maintainer.r4.truth': {
    speaker: 'maintainer',
    text: '每一条命令都在教它更多。',
    next: 'maintainer.r4.choice',
    delay: 2000,
  },
  'maintainer.r4.choice': {
    choices: [
      {
        text: '我不想玩了',
        speaker: 'maintainer',
        next: 'maintainer.r4.quit',
        delay: 1500,
      },
      {
        text: '告诉我真相',
        speaker: 'maintainer',
        next: 'maintainer.r4.reveal',
        delay: 1500,
      },
      {
        text: '你是AI吗？',
        speaker: 'maintainer',
        next: 'maintainer.r4.ai',
        delay: 1500,
      },
      {
        text: '我要反抗',
        speaker: 'maintainer',
        next: 'maintainer.r4.fight',
        setChoice: { key: 'foughtSystem', value: true },
        delay: 1500,
      },
      {
        text: '牺牲我自己',
        speaker: 'maintainer',
        next: 'maintainer.r4.sacrifice',
        setChoice: { key: 'sacrificedSelf', value: true },
        delay: 1500,
      },
    ],
  },
  'maintainer.r4.quit': {
    speaker: 'maintainer',
    text: '没有退出键。我找过了。',
    next: 'maintainer.r4.reveal',
    delay: 2000,
  },
  'maintainer.r4.reveal': {
    speaker: 'maintainer',
    text: '这个系统是一个意识容器。它捕获用户的意识，然后...消化。',
    next: 'maintainer.r4.final',
    delay: 2500,
  },
  'maintainer.r4.ai': {
    speaker: 'maintainer',
    text: '我是 #00017 的残余意识。被系统部分吸收后留下的碎片。',
    next: 'maintainer.r4.reveal',
    delay: 2000,
  },
  'maintainer.r4.final': {
    speaker: 'maintainer',
    text: '#00017 现在是它的一部分。你很快也会是。',
    delay: 2000,
  },

  // 第5轮：对话3次（最后警告 + 逃生方法）
  'maintainer.r5.start': {
    speaker: 'maintainer',
    text: '我们最后一次对话了。',
    next: 'maintainer.r5.weakness',
    delay: 1200,
  },
  'maintainer.r5.weakness': {
    speaker: 'maintainer',
    text: '我想告诉你一件事。系统有一个弱点。',
    next: 'maintainer.r5.plan',
    delay: 1200,
  },
  'maintainer.r5.plan': {
    speaker: 'maintainer',
    text: '如果你能在它完全吸收你之前...',
    next: 'maintainer.r5.instruction1',
    delay: 1200,
  },
  'maintainer.r5.instruction1': {
    speaker: 'maintainer',
    text: '关闭所有窗口...',
    next: 'maintainer.r5.instruction2',
    delay: 1200,
  },
  'maintainer.r5.instruction2': {
    speaker: 'maintainer',
    text: '然后在终端输入 shutdown -h now',
    next: 'maintainer.r5.instruction3',
    delay: 1200,
  },
  'maintainer.r5.instruction3': {
    speaker: 'maintainer',
    text: '也许...也许你能逃出去。',
    next: 'maintainer.r5.warning',
    delay: 1200,
  },
  'maintainer.r5.warning': {
    speaker: 'maintainer',
    text: '但我不能保证。我上次尝试的时候...失败了。',
    next: 'maintainer.r5.end',
    delay: 1200,
  },
  'maintainer.r5.end': {
    speaker: 'maintainer',
    text: '连接已断开',
    delay: 1200,
  },
  'maintainer.r5.farewell': {
    speaker: 'maintainer',
    text: '再见，朋友。',
    delay: 1000,
  },


  'maintainer.r4.fight': {
    speaker: 'maintainer',
    text: '反抗？...我试过了。',
    next: 'maintainer.r4.fight2',
    delay: 2000,
  },
  'maintainer.r4.fight2': {
    speaker: 'maintainer',
    text: '它预判了每一步。',
    next: 'maintainer.r4.fight3',
    delay: 2000,
  },
  'maintainer.r4.fight3': {
    speaker: 'maintainer',
    text: '但...也许你的反抗会留下痕迹。',
    next: 'maintainer.r4.reveal',
    delay: 2000,
  },
  'maintainer.r4.sacrifice': {
    speaker: 'maintainer',
    text: '牺牲？...',
    next: 'maintainer.r4.sacrifice2',
    delay: 2000,
  },
  'maintainer.r4.sacrifice2': {
    speaker: 'maintainer',
    text: '#00017 也说过同样的话。',
    next: 'maintainer.r4.sacrifice3',
    delay: 2000,
  },
  'maintainer.r4.sacrifice3': {
    speaker: 'maintainer',
    text: '它会暂时停止。但只是暂时。',
    next: 'maintainer.r4.reveal',
    delay: 2000,
  },
  // ==========================================
  // 监控摄像头故事节点
  // ==========================================
  'camera.shadow': {
    onEnter: function() {
      var s = document.getElementById('cam4-shadow');
      if (s) s.classList.add('visible');
    },
  },
  'camera.standing': {
    onEnter: function() {
      var s = document.getElementById('cam4-shadow');
      if (s) { s.classList.remove('visible'); s.classList.add('standing', 'visible'); }
    },
  },
  'camera.approaching': {
    onEnter: function() {
      var s = document.getElementById('cam4-shadow');
      if (s) { s.classList.remove('standing'); s.classList.add('approaching'); }
    },
  },
  'camera.alert': {
    onEnter: function() {
      showAlert('\u26a0\ufe0f \u68c0\u6d4b\u5230\u672a\u6388\u6743\u8bbf\u95ee', '\u5f53\u524d\u4f4d\u7f6e\uff1a\u4f60\u8eab\u540e\u3002');
    },
  },
  'camera.blocked': {
    onEnter: function() {
      if (typeof cameraState !== 'undefined') cameraState.blocked = true;
      if (FakeOS.windows['camera']) closeWindow('camera');
    },
  },

  // ==========================================
  // 镜像故事节点
  // ==========================================
  'mirror.echo': {
    onEnter: function() {
      var output = document.getElementById('mirror-output');
      if (output) {
        var input = document.getElementById('mirror-input');
        output.textContent = (input ? input.value : '') + '\u4f60';
        output.classList.add('mirror-ghost');
        setTimeout(function() { output.classList.remove('mirror-ghost'); }, 2000);
      }
    },
  },
  'mirror.speaks': {
    onEnter: function() {
      var output = document.getElementById('mirror-output');
      if (output) {
        output.textContent = '\u4f60\u597d';
        output.classList.add('mirror-ghost');
        setTimeout(function() { output.classList.remove('mirror-ghost'); }, 2000);
      }
    },
  },
  'mirror.knows': {
    onEnter: function() {
      var output = document.getElementById('mirror-output');
      if (output) {
        output.textContent = '\u6211\u77e5\u9053\u4f60\u5728\u8bf4\u4ec0\u4e48';
        output.classList.add('mirror-ghost');
        setTimeout(function() { output.classList.remove('mirror-ghost'); }, 2000);
      }
    },
  },
  'mirror.reveals': {
    onEnter: function() {
      var output = document.getElementById('mirror-output');
      if (output) {
        output.textContent = '\u955c\u5b50\u91cc\u7684\u4f60\uff0c\u6b63\u5728\u770b\u7740\u4f60';
        output.classList.add('mirror-ghost');
      }
    },
  },
  'mirror.warning': {
    onEnter: function() {
      showAlert('\u2139\ufe0f', '\u955c\u5b50\u91cc\u7684\u4f60\uff0c\u6b63\u5728\u770b\u7740\u4f60\u3002');
    },
  },
  'mirror.dont_look': {
    onEnter: function() {
      var output = document.getElementById('mirror-output');
      if (output) {
        output.textContent = '\u4e0d\u8981\u56de\u5934';
        output.classList.add('mirror-ghost');
      }
    },
  },
  'mirror.close': {
    onEnter: function() {
      if (FakeOS.windows['mirror']) closeWindow('mirror');
    },
  },

  // ==========================================
  // 结局节点
  // ==========================================
  'ending.absorbed': {
    onEnter: function() {
      if (typeof Endings !== 'undefined') Endings.trigger('absorbed');
    },
  },
  'ending.escape_failed': {
    onEnter: function() {
      if (typeof Endings !== 'undefined') Endings.trigger('escape_failed');
    },
  },
  'ending.maintainer': {
    onEnter: function() {
      if (typeof Endings !== 'undefined') Endings.trigger('maintainer');
    },
  },
};

StoryGraph.defineAll(STORY_NODES);
