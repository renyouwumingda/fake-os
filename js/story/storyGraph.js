// ===== 节点式剧情图引擎 =====
// 参考 Ink/Twine/Yarn Spinner 的成熟设计模式
var StoryGraph = {
  nodes: {},
  currentNodeId: null,
  history: [],
  waitQueue: [],
  isWaiting: false,

  // 注册节点
  define: function(id, node) {
    node.id = id;
    this.nodes[id] = node;
  },

  // 批量注册
  defineAll: function(nodeMap) {
    var self = this;
    Object.keys(nodeMap).forEach(function(id) {
      self.define(id, nodeMap[id]);
    });
  },

  // 触发节点
  trigger: function(id, silent) {
    var node = this.nodes[id];
    if (!node) return false;

    // 检查条件
    if (node.condition && !node.condition()) return false;

    this.currentNodeId = id;
    if (!silent) this.history.push(id);

    // 执行进入副作用
    if (node.onEnter) node.onEnter();

    // 如果有文本，显示
    if (node.text) {
      this.display(node);
    }
    // 有 choices 则显示选项按钮
    if (node.choices) {
      this.showChoiceButtons(node.choices);
      return; // 等待玩家选择
    }
    // 有 next 则自动跳转
    if (node.next) {
      var self = this;
      var delay = node.delay || 2000;
      setTimeout(function() { self.trigger(node.next); }, delay);
    } else if (!node.choices) {
      // 对话结束：没有 next 也没有 choices → 重置 isPlaying
      var self = this;
      var delay = node.delay || 2000;
      setTimeout(function() {
        if (typeof DialogueSystem !== 'undefined') DialogueSystem.isPlaying = false;
      }, delay);
    }

    return true;
  },

  // 清空当前联系人的聊天消息（新轮次开始时调用）
  clearChat: function(contactId) {
    if (typeof chatHistories !== 'undefined' && chatHistories[contactId]) {
      chatHistories[contactId] = [];
    }
    var chatEl = document.getElementById('chat-messages');
    if (chatEl) chatEl.innerHTML = '';
  },

  // 显示节点内容
  display: function(node) {
    if (node.speaker) {
      if (typeof addNpcMsg === 'function') {
        if (!FakeOS.windows['chat'] && typeof openApp === 'function') {
          openApp('chat');
        }
        if (typeof focusWindow === 'function') focusWindow('chat');
        try {
          if (typeof window !== 'undefined') window._selectedContact = node.speaker;
        } catch(e) {}
        selectedContact = node.speaker;
        if (typeof buildContactList === 'function') buildContactList();
        if (typeof renderMessages === 'function') renderMessages(node.speaker);
        addNpcMsg(node.speaker, node.text);
      }
    } else if (typeof addSystemMsg === 'function') {
      addSystemMsg(node.text);
    }
  },

  // 玩家做出选择
  choose: function(choiceIndex) {
    var node = this.nodes[this.currentNodeId];
    if (!node || !node.choices) return;
    var choice = node.choices[choiceIndex];
    if (!choice) return;

    if (choice.condition && !choice.condition()) return;

    if (choice.effects) {
      if (typeof choice.effects === 'function') choice.effects();
      else if (typeof StoryVariables !== 'undefined') StoryVariables.applyEffects(choice.effects);
    }

    if (typeof StoryEngine !== 'undefined' && choice.setChoice) {
      StoryEngine.setChoice(choice.setChoice.key, choice.setChoice.value);
    }
    if (typeof StoryEngine !== 'undefined' && choice.setFlag) {
      StoryEngine.setFlag(choice.setFlag.key, choice.setFlag.value);
    }

    if (choice.next) {
      var self = this;
      var delay = choice.delay || 1500;
      setTimeout(function() { self.trigger(choice.next); }, delay);
    }
  },

  // 跳过当前对话
  skip: function() {
    this.isWaiting = false;
    if (this.waitQueue.length > 0) {
      var next = this.waitQueue.shift();
      next();
    }
  },

  // 序列化对话消息到聊天窗口
  playSequence: function(messages, onComplete) {
    var self = this;
    var i = 0;
    function next() {
      if (i >= messages.length) {
        if (onComplete) onComplete();
        return;
      }
      var msg = messages[i];
      i++;

      if (msg.speaker) {
        addNpcMsg(msg.speaker, msg.text);
      } else if (msg.system) {
        addSystemMsg(msg.text);
      } else if (msg.choices) {
        self.showChoiceButtons(msg.choices);
        return;
      }

      setTimeout(next, msg.delay || 2000);
    }
    next();
  },

  // 显示选项按钮
  showChoiceButtons: function(choices) {
    var chatEl = document.getElementById('chat-messages');
    if (!chatEl) return;

    var container = document.createElement('div');
    container.className = 'chat-choices';
    container.style.cssText = 'padding:8px 12px;display:flex;gap:6px;flex-wrap:wrap;';

    choices.forEach(function(choice, i) {
      if (choice.condition && !choice.condition()) return;

      var btn = document.createElement('button');
      btn.textContent = choice.text;
      btn.style.cssText = 'padding:6px 12px;background:rgba(76,175,80,0.2);border:1px solid rgba(76,175,80,0.4);border-radius:12px;color:#4caf50;cursor:pointer;font-size:12px;transition:all 0.2s;';
      btn.onmouseenter = function() { btn.style.background = 'rgba(76,175,80,0.4)'; };
      btn.onmouseleave = function() { btn.style.background = 'rgba(76,175,80,0.2)'; };
      btn.onclick = function() {
        if (typeof addUserMsg === 'function') addUserMsg(choice.speaker || 'maintainer', choice.text);
        container.querySelectorAll('button').forEach(function(b) { b.disabled = true; b.style.opacity = '0.5'; b.style.cursor = 'default'; });
        if (choice.effects) {
          if (typeof choice.effects === 'function') choice.effects();
          else if (typeof StoryVariables !== 'undefined') StoryVariables.applyEffects(choice.effects);
        }
        if (choice.setChoice && typeof StoryEngine !== 'undefined') {
          StoryEngine.setChoice(choice.setChoice.key, choice.setChoice.value);
        }
        if (choice.setFlag && typeof StoryEngine !== 'undefined') {
          StoryEngine.setFlag(choice.setFlag.key, choice.setFlag.value);
        }
        if (choice.next) {
          setTimeout(function() { StoryGraph.trigger(choice.next); }, 1000);
        }
      };
      container.appendChild(btn);
    });

    chatEl.appendChild(container);
    chatEl.scrollTop = chatEl.scrollHeight;
    // Safety: auto-reset isPlaying after 30s if choices not clicked
    setTimeout(function() {
      if (typeof DialogueSystem !== 'undefined' && DialogueSystem.isPlaying) {
        DialogueSystem.isPlaying = false;
      }
    }, 30000);
  },
};
