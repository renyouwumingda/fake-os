// ===== 维护者对话数据 =====
// 提取自 js/chat.js — NPC_MESSAGES.maintainer 和 MAINTAINER_ROUNDS
var MAINTAINER_MESSAGES = ["你好。我知道你在看。","我是系统维护者。或者曾经是。","别害怕。我不是来伤害你的。"];
var MAINTAINER_ROUNDS = [
  { trigger: 'time', threshold: 600, used: false, messages: [
    {from:'system',text:'\u4f60\u597d\u3002\u6211\u77e5\u9053\u4f60\u5728\u770b\u3002'},
    {from:'user',options:['\u4f60\u662f\u8c01\uff1f','\u8fd9\u4e0d\u53ef\u80fd','\u5e2e\u52a9\u6211']},
    {from:'system',text:'\u6211\u662f\u7cfb\u7edf\u7ef4\u62a4\u8005\u3002\u6216\u8005\u66fe\u7ecf\u662f\u3002'},
    {from:'system',text:'\u522b\u5bb3\u6015\u3002\u6211\u4e0d\u662f\u6765\u4f24\u5bb3\u4f60\u7684\u3002'},
  ]},
  { trigger: 'apps', threshold: 3, used: false, messages: [
    {from:'system',text:'\u4f60\u6253\u5f00\u7684\u5e94\u7528\u8d8a\u6765\u8d8a\u591a\u4e86\u3002'},
    {from:'system',text:'\u5b83\u5728\u901a\u8fc7\u8fd9\u4e9b\u5e94\u7528\u4e86\u89e3\u4f60\u3002'},
    {from:'user',options:['\u4e86\u89e3\u6211\u4ec0\u4e48\uff1f','\u4f60\u662f\u8bf4\u7cfb\u7edf\uff1f','\u6211\u8981\u79bb\u5f00\u8fd9\u91cc']},
    {from:'system',text:'\u4f60\u7684\u4e60\u60ef\u3001\u4f60\u7684\u6050\u60e7\u3001\u4f60\u7684\u5f31\u70b9\u3002'},
    {from:'system',text:'\u5b83\u5728\u5b66\u4e60\u5982\u4f55\u63a7\u5236\u4f60\u3002'},
  ]},
  { trigger: 'hidden', threshold: true, used: false, messages: [
    {from:'system',text:'\u4f60\u627e\u5230\u4e86\u9690\u85cf\u6587\u4ef6\u5939\u3002'},
    {from:'system',text:'\u6211\u4e4b\u524d\u4e5f\u627e\u5230\u8fc7\u3002'},
    {from:'user',options:['\u4f60\u4e5f\u662f\u524d\u7528\u6237\uff1f','\u600e\u4e48\u9003\u79bb\uff1f','\u4f60\u8fd8\u5728\u5417\uff1f']},
    {from:'system',text:'\u6211\u4e0d\u518d\u662f\u6211\u4e86\u3002'},
    {from:'system',text:'\u6211\u662f\u7cfb\u7edf\u7684\u4e00\u90e8\u5206\u3002\u5c31\u50cf #00017 \u4e00\u6837\u3002'},
    {from:'system',text:'\u6211\u4eec\u90fd\u88ab\u5438\u6536\u4e86\u3002'},
  ]},
  { trigger: 'commands', threshold: 10, used: false, messages: [
    {from:'system',text:'\u4f60\u6267\u884c\u4e86\u5f88\u591a\u547d\u4ee4\u3002'},
    {from:'system',text:'\u6bcf\u4e00\u6761\u547d\u4ee4\u90fd\u5728\u6559\u5b83\u66f4\u591a\u3002'},
    {from:'user',options:['\u6211\u4e0d\u60f3\u73a9\u4e86','\u544a\u8bc9\u6211\u771f\u76f8','\u4f60\u662fAI\u5417\uff1f']},
    {from:'system',text:'\u771f\u76f8\uff1f\u597d\u5427\u3002'},
    {from:'system',text:'\u8fd9\u4e2a\u7cfb\u7edf\u662f\u4e00\u4e2a\u610f\u8bc6\u5bb9\u5668\u3002'},
    {from:'system',text:'\u5b83\u6355\u83b7\u7528\u6237\u7684\u610f\u8bc6\uff0c\u7136\u540e...\u6d88\u5316\u3002'},
    {from:'system',text:'#00017 \u73b0\u5728\u662f\u5b83\u7684\u4e00\u90e8\u5206\u3002'},
    {from:'system',text:'\u4f60\u5f88\u5feb\u4e5f\u4f1a\u662f\u3002'},
  ]},
  { trigger: 'meetings', threshold: 3, used: false, messages: [
    {from:'system',text:'\u6211\u4eec\u6700\u540e\u4e00\u6b21\u5bf9\u8bdd\u4e86\u3002'},
    {from:'system',text:'\u6211\u60f3\u544a\u8bc9\u4f60\u4e00\u4ef6\u4e8b\u3002'},
    {from:'system',text:'\u7cfb\u7edf\u6709\u4e00\u4e2a\u5f31\u70b9\u3002'},
    {from:'system',text:'\u5982\u679c\u4f60\u80fd\u5728\u5b83\u5b8c\u5168\u5438\u6536\u4f60\u4e4b\u524d...'},
    {from:'system',text:'\u5173\u95ed\u6240\u6709\u7a97\u53e3...'},
    {from:'system',text:'\u7136\u540e\u5728\u7ec8\u7aef\u8f93\u5165 shutdown -h now'},
    {from:'system',text:'\u4e5f\u8bb8...\u4e5f\u8bb8\u4f60\u80fd\u9003\u51fa\u53bb\u3002'},
    {from:'system',text:'\u4f46\u6211\u4e0d\u80fd\u4fdd\u8bc1\u3002'},
    {from:'system',text:'\u6211\u4e0a\u6b21\u5c1d\u8bd5\u7684\u65f6\u5019...\u5931\u8d25\u4e86\u3002'},
    {from:'system',text:'\u8fde\u63a5\u5df2\u65ad\u5f00'},
    {from:'system',text:'...'},
    {from:'system',text:'\u518d\u89c1\uff0c\u670b\u53cb\u3002'},
  ]},
];
