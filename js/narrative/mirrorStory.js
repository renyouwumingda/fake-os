// ===== 镜像恐怖事件数据 =====
// 提取自 js/mirror.js — inputCount 检查逻辑中的恐怖事件
var MIRROR_EVENTS = [
  { count: 6,  text: '\u4f60', appendToInput: true, ghost: true, duration: 2000 },
  { count: 10, text: '\u4f60\u597d', ghost: true, duration: 2000 },
  { count: 15, text: '\u6211\u77e5\u9053\u4f60\u5728\u8bf5\u4ec0\u4e48', ghost: true, duration: 2000 },
  { count: 18, action: 'reverse' },
  { count: 20, text: '\u955c\u5b50\u91cc\u7684\u4f60\uff0c\u6b63\u5728\u770b\u7740\u4f60', ghost: true },
  { count: 25, action: 'alert', title: '\u2139\ufe0f', text: '\u955c\u5b50\u91cc\u7684\u4f60\uff0c\u6b63\u5728\u770b\u7740\u4f60\u3002' },
  { count: 28, text: '\u4e0d\u8981\u56de\u5934', ghost: true },
  { count: 30, action: 'close' },
];
