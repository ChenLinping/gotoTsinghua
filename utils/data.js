var EXAM_DATE = new Date('2027-06-07T09:00:00+08:00');

var SUBJECTS = {
  math: { name: '数学', icon: '📐', color: '#6366f1', bg: '#eef2ff', text: '#3730a3', weight: 150, desc: '150分 · 理科核心' },
  english: { name: '英语', icon: '🌍', color: '#059669', bg: '#ecfdf5', text: '#065f46', weight: 150, desc: '150分 · 重点突破', weak: true },
  physics: { name: '物理', icon: '⚡', color: '#d97706', bg: '#fffbeb', text: '#92400e', weight: 110, desc: '110分 · 选考' },
  chemistry: { name: '化学', icon: '🧪', color: '#dc2626', bg: '#fef2f2', text: '#991b1b', weight: 100, desc: '100分 · 选考' },
  biology: { name: '生物', icon: '🧬', color: '#7c3aed', bg: '#f5f3ff', text: '#5b21b6', weight: 90, desc: '90分 · 选考' },
  chinese: { name: '语文', icon: '📖', color: '#0891b2', bg: '#ecfeff', text: '#155e75', weight: 150, desc: '150分 · 重点突破', weak: true }
};

var SUBJECT_KEYS = ['math', 'english', 'physics', 'chemistry', 'biology', 'chinese'];

var DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

var WEEKLY_PLAN = {
  1: [
    { time: '19:00-20:00', subject: 'math', task: '函数与导数：复习导数定义，做3道切线方程题', type: '专项训练' },
    { time: '20:15-21:15', subject: 'english', task: '语法专项：完成时态练习题20道 + 背50个高频词', type: '基础巩固' }
  ],
  2: [
    { time: '19:00-20:00', subject: 'physics', task: '力学：牛顿运动定律综合应用，做5道典型题', type: '专项训练' },
    { time: '20:15-21:15', subject: 'chemistry', task: '化学反应原理：化学平衡移动方向判断练习', type: '专项训练' }
  ],
  3: [
    { time: '19:00-20:00', subject: 'math', task: '数列：等差等比数列通项公式与前n项和', type: '专项训练' },
    { time: '20:15-21:15', subject: 'english', task: '阅读理解：精读1篇高考真题 + 整理生词', type: '能力提升' }
  ],
  4: [
    { time: '19:00-20:00', subject: 'physics', task: '电磁学：电场力与电势能关系，做5道题', type: '专项训练' },
    { time: '20:15-21:15', subject: 'chemistry', task: '有机化学：官能团性质与有机推断练习', type: '专项训练' }
  ],
  5: [
    { time: '19:00-20:00', subject: 'biology', task: '遗传与进化：孟德尔定律应用，做遗传图谱题', type: '专项训练' },
    { time: '20:15-21:15', subject: 'chinese', task: '文言文：精读1篇古文 + 积累实词虚词', type: '基础巩固' }
  ],
  6: [
    { time: '08:30-10:00', subject: 'math', task: '立体几何：空间向量法解二面角问题，做4道大题', type: '重点攻克' },
    { time: '10:15-11:30', subject: 'english', task: '写作：仿写1篇高考范文 + 积累高级句型', type: '重点突破' },
    { time: '14:00-15:30', subject: 'chinese', task: '作文：审题立意练习 + 素材积累与整理', type: '重点突破' },
    { time: '16:00-17:15', subject: 'physics', task: '本周错题回顾 + 能量守恒综合题3道', type: '查漏补缺' }
  ],
  0: [
    { time: '08:30-10:00', subject: 'chemistry', task: '电化学：原电池与电解池对比，做综合题', type: '重点攻克' },
    { time: '10:15-11:30', subject: 'biology', task: '细胞代谢：光合呼吸综合题 + 实验设计', type: '重点攻克' },
    { time: '14:00-15:30', subject: 'math', task: '本周错题整理 + 限时模拟选择填空训练', type: '综合训练' },
    { time: '16:00-17:00', subject: 'english', task: '听力训练1套 + 完形填空1篇', type: '综合训练' },
    { time: '19:00-20:00', subject: 'chinese', task: '古诗鉴赏：手法分析专项 + 名篇默写', type: '巩固提升' }
  ]
};

var WEEK_DAYS = [1, 2, 3, 4, 5, 6, 0];

var PHASES = [
  { name: '暑假自主预习', period: '2026.7 - 2026.8', desc: '提前预习高三内容，补齐弱科基础', color: '#f59e0b', start: '2026-07-01', end: '2026-08-31' },
  { name: '一轮复习（上）', period: '2026.9 - 2027.1', desc: '全面梳理知识体系，夯实基础', color: '#6366f1', start: '2026-09-01', end: '2027-01-14' },
  { name: '寒假强化', period: '2027.1 - 2027.2', desc: '重点突破弱科，查漏补缺', color: '#ef4444', start: '2027-01-15', end: '2027-02-14' },
  { name: '一轮复习（下）', period: '2027.2 - 2027.4', desc: '完成一轮复习，建立知识网络', color: '#6366f1', start: '2027-02-15', end: '2027-03-31' },
  { name: '二轮专题复习', period: '2027.4 - 2027.5', desc: '专题突破，强化题型方法', color: '#10b981', start: '2027-04-01', end: '2027-04-30' },
  { name: '三轮冲刺', period: '2027.5 - 2027.6', desc: '模拟训练，调整心态，回归基础', color: '#f43f5e', start: '2027-05-01', end: '2027-06-07' }
];

var DAILY_ROUTINE = [
  { time: '6:30', task: '起床 · 晨读英语/语文', icon: '🌅' },
  { time: '7:00', task: '早餐 · 听英语听力', icon: '🎧' },
  { time: '7:30-17:00', task: '学校课程', icon: '🏫' },
  { time: '17:00-18:00', task: '运动/休息（重要！）', icon: '🏃' },
  { time: '18:00-18:30', task: '晚餐', icon: '🍽' },
  { time: '18:30-19:00', task: '回顾当天笔记', icon: '📝' },
  { time: '19:00-21:15', task: '晚间自学（按计划）', icon: '📚' },
  { time: '21:15-22:00', task: '自由复习/错题整理', icon: '📖' },
  { time: '22:00-22:30', task: '洗漱 · 听英语播客', icon: '🎧' },
  { time: '22:30', task: '睡觉（保证8小时睡眠）', icon: '🌙' }
];

// ========== 智能排课引擎 ==========

// 2026-2027学年主要节假日（国务院公布）
var HOLIDAYS = [
  { start: '2026-10-01', end: '2026-10-07', name: '国庆节' },
  { start: '2027-01-01', end: '2027-01-03', name: '元旦' },
  { start: '2027-01-27', end: '2027-02-25', name: '寒假' },
  { start: '2027-04-03', end: '2027-04-05', name: '清明节' },
  { start: '2027-05-01', end: '2027-05-05', name: '劳动节' }
];

// 各阶段 × 日期类型 的时间槽模板
var TIME_SLOTS = {
  // 暑假/寒假：全天可安排
  summer: {
    weekday: [
      { time: '08:30-10:00', period: 'morning' },
      { time: '10:15-11:30', period: 'morning' },
      { time: '14:30-16:00', period: 'afternoon' }
    ],
    weekend: [
      { time: '08:30-10:00', period: 'morning' },
      { time: '10:15-11:30', period: 'morning' },
      { time: '14:00-15:30', period: 'afternoon' },
      { time: '16:00-17:15', period: 'afternoon' },
      { time: '19:30-20:45', period: 'evening' }
    ],
    holiday: [
      { time: '08:30-10:00', period: 'morning' },
      { time: '10:15-11:30', period: 'morning' },
      { time: '14:00-15:30', period: 'afternoon' },
      { time: '19:30-20:45', period: 'evening' }
    ]
  },
  // 一轮复习/二轮专题：在校上课期间
  semester: {
    weekday: [
      { time: '19:00-20:10', period: 'evening' }
    ],
    weekend: [
      { time: '08:30-10:00', period: 'morning' },
      { time: '10:15-11:30', period: 'morning' },
      { time: '14:00-15:30', period: 'afternoon' },
      { time: '16:00-17:00', period: 'afternoon' }
    ],
    holiday: [
      { time: '08:30-10:00', period: 'morning' },
      { time: '10:15-11:30', period: 'morning' },
      { time: '14:00-15:30', period: 'afternoon' },
      { time: '16:00-17:00', period: 'afternoon' },
      { time: '19:30-20:45', period: 'evening' }
    ]
  },
  // 三轮冲刺
  sprint: {
    weekday: [
      { time: '19:00-20:00', period: 'evening' }
    ],
    weekend: [
      { time: '08:30-10:30', period: 'morning' },
      { time: '14:00-16:00', period: 'afternoon' },
      { time: '19:00-20:30', period: 'evening' }
    ],
    holiday: [
      { time: '08:30-10:30', period: 'morning' },
      { time: '14:00-16:00', period: 'afternoon' },
      { time: '19:00-20:30', period: 'evening' }
    ]
  }
};

// 各阶段 × 各科目 的任务模板（根据时段自动选择）
var TASK_TEMPLATES = {
  math: {
    summer: {
      morning: ['预习函数与导数：理解导数定义与几何意义，做5道基础求导题', '预习数列：等差数列通项公式推导，做基础练习6道', '预习立体几何：复习空间向量基础，做建系练习'],
      afternoon: ['复习高一数学薄弱章节，整理错题', '做函数综合基础题4道，重点练定义域值域', '数列求和方法练习：累加法、裂项法各2道']
    },
    semester: {
      evening: ['导数专项：做2道切线方程+1道单调性分析题', '数列专项：练习等比数列求和与错位相减法', '立体几何：用向量法求二面角，做1道完整大题', '概率统计：做1道条件概率+1道正态分布题', '解析几何：椭圆焦点弦问题，做2道典型题', '三角函数：化简与图像变换练习3道']
    },
    sprint: {
      morning: ['限时训练：选择填空12道（35分钟）+ 对答案', '模拟卷前100分部分，限时50分钟完成'],
      afternoon: ['错题回顾：本周数学错题重做一遍', '压轴题训练：导数+数列综合题1道'],
      evening: ['回归基础：默写公式+看错题本', '查漏补缺：针对薄弱知识点做3道基础题']
    }
  },
  english: {
    summer: {
      morning: ['背诵高考核心词汇50个（含例句朗读）', '语法基础：时态系统梳理，做20道时态选择题', '阅读入门：精读1篇简单文章，标注生词'],
      afternoon: ['听力训练：听1段短对话+做练习', '基础写作：仿写3个高级句型', '词汇复习：默写上午背诵的单词']
    },
    semester: {
      evening: ['背单词50个 + 语法专项练习15道', '阅读理解精读1篇 + 整理高频词组', '完形填空1篇 + 错题分析', '写作练习：写1篇120词短文', '语法错题回顾 + 知识点整理', '听力训练1套（15分钟）+ 跟读练习']
    },
    sprint: {
      morning: ['限时阅读4篇（35分钟）+ 对答案分析', '完形填空限时训练（15分钟）'],
      afternoon: ['写作模板整理 + 仿写1篇范文', '听力模拟1套 + 错题精听'],
      evening: ['高频词汇速记30个 + 作文素材积累', '错题回顾 + 易错语法点默写']
    }
  },
  chinese: {
    summer: {
      morning: ['文言文基础：精读《劝学》全文，逐句翻译', '背诵名篇名句10句（标注易错字）', '古诗鉴赏入门：学习常见意象和手法'],
      afternoon: ['作文素材积累：整理3个人物素材', '现代文阅读：精读1篇散文+分析手法', '文言文虚词积累：之、其、而各5个例句']
    },
    semester: {
      evening: ['文言文精读1篇 + 实词虚词积累10个', '古诗鉴赏：分析1首诗的手法与情感', '名篇名句默写练习10句', '作文审题立意练习2个题目', '现代文阅读：论述类文本1篇+答题', '语言文字运用：病句修改+成语积累']
    },
    sprint: {
      morning: ['名篇名句限时默写（10分钟）+ 文言文阅读1篇', '现代文阅读限时训练（40分钟）'],
      afternoon: ['作文全篇限时写作（50分钟）', '古诗鉴赏+语言运用综合训练'],
      evening: ['默写易错句5句 + 素材积累', '作文素材整理 + 范文精读1篇']
    }
  },
  physics: {
    summer: {
      morning: ['预习力学：牛顿三大定律理解+受力分析练习', '预习运动学：匀变速直线运动5大公式推导', '力学综合：整体法与隔离法练习3道'],
      afternoon: ['复习力学基础题+错题整理', '预习能量守恒：动能定理推导+简单应用', '运动学图像分析：v-t图、x-t图练习']
    },
    semester: {
      evening: ['力学综合：做3道牛顿定律应用题', '能量守恒：动能定理+机械能守恒各2道', '电磁学：电场力与电势能练习3道', '电磁感应：法拉第定律应用2道', '力学实验：回顾实验步骤+数据处理', '电路分析：串并联+欧姆定律练习']
    },
    sprint: {
      morning: ['力学+电磁学综合限时训练（45分钟）', '模拟卷物理部分限时完成'],
      afternoon: ['错题重做 + 实验题专项', '压轴题训练：电磁感应综合1道'],
      evening: ['公式默写 + 物理模型总结', '基础题查漏补缺3道']
    }
  },
  chemistry: {
    summer: {
      morning: ['预习反应原理：化学平衡概念+平衡常数', '预习电化学：原电池原理+电极反应式', '有机化学基础：官能团性质归纳'],
      afternoon: ['化学平衡计算练习3道', '元素周期律：原子结构与周期性变化', '有机推断入门：从反应条件推官能团']
    },
    semester: {
      evening: ['化学平衡：勒夏特列原理应用3道题', '电化学：原电池与电解池对比练习', '有机推断：完整推断题1道', '水溶液：离子浓度比较3道题', '化学反应速率：影响因素分析2道', '物质结构：杂化轨道+分子极性练习']
    },
    sprint: {
      morning: ['化学综合限时训练（45分钟）', '选择题限时训练12道（20分钟）'],
      afternoon: ['有机推断专项2道 + 实验题1道', '错题回顾 + 方程式默写'],
      evening: ['方程式默写10个 + 基础概念回顾', 'Ksp计算+三大守恒练习']
    }
  },
  biology: {
    summer: {
      morning: ['预习细胞代谢：光合作用过程+呼吸作用对比', '预习遗传：孟德尔两大定律+典型例题', '细胞结构：细胞器功能归纳+对比表'],
      afternoon: ['遗传题练习：分离定律+自由组合各3道', '预习稳态：神经调节+体液调节机制', '光合作用影响因素实验分析']
    },
    semester: {
      evening: ['遗传题：系谱图分析+概率计算3道', '细胞代谢：光合呼吸综合题2道', '稳态调节：神经-体液-免疫综合1道', '生态学：种群与群落练习3道', '实验设计：控制变量法练习2道', '基因工程：基本操作步骤+应用']
    },
    sprint: {
      morning: ['生物综合限时训练（40分钟）', '选择题限时20道（25分钟）'],
      afternoon: ['遗传大题专项2道 + 实验设计1道', '错题回顾 + 核心概念默写'],
      evening: ['知识框架默写 + 易错点整理', '回归教材：重点章节精读']
    }
  }
};

// 根据日期字符串判断是否在假期内
function getHolidayName(dateStr) {
  var d = dateStr.slice(0, 10);
  for (var i = 0; i < HOLIDAYS.length; i++) {
    if (d >= HOLIDAYS[i].start && d <= HOLIDAYS[i].end) {
      return HOLIDAYS[i].name;
    }
  }
  return null;
}

// 获取当前复习阶段信息
function getCurrentPhase(date) {
  date = date || new Date();
  for (var i = 0; i < PHASES.length; i++) {
    var start = new Date(PHASES[i].start);
    var end = new Date(PHASES[i].end);
    if (date >= start && date < end) return PHASES[i];
  }
  return PHASES[0];
}

// 获取日期类型：weekday / weekend / holiday
function getDayType(date) {
  date = date || new Date();
  var dateStr = date.toISOString();
  if (getHolidayName(dateStr)) return 'holiday';
  var day = date.getDay();
  return (day === 0 || day === 6) ? 'weekend' : 'weekday';
}

// 获取阶段对应的时间槽分组键
function getSlotGroup(phase) {
  if (!phase) return 'semester';
  if (phase.name.indexOf('暑假') >= 0) return 'summer';
  if (phase.name.indexOf('寒假') >= 0) return 'summer';
  if (phase.name.indexOf('三轮') >= 0 || phase.name.indexOf('冲刺') >= 0) return 'sprint';
  return 'semester';
}

// 分析成绩 → 生成优先级排序
function analyzeScores(scores) {
  if (!scores) return null;
  var maxScores = { math: 150, english: 150, chinese: 150, physics: 100, chemistry: 100, biology: 100 };
  var analysis = [];
  var total = 0;
  var totalMax = 750;

  SUBJECT_KEYS.forEach(function(key) {
    var s = scores[key] || 0;
    var m = maxScores[key];
    var pct = s / m;
    var lossRate = 1 - pct;
    // 失分率高的科目权重更高（需要更多学习时间）
    var weight = lossRate * 2 + 0.5;
    total += s;
    analysis.push({
      key: key,
      name: SUBJECTS[key].name,
      icon: SUBJECTS[key].icon,
      color: SUBJECTS[key].color,
      score: s,
      max: m,
      pct: Math.round(pct * 100),
      lossRate: lossRate,
      weight: weight,
      level: pct >= 0.85 ? 'strong' : pct >= 0.65 ? 'stable' : 'weak'
    });
  });

  // 按失分率排序（失分最多的排前面，优先学习）
  analysis.sort(function(a, b) { return b.weight - a.weight; });

  return {
    subjects: analysis,
    totalScore: total,
    totalMax: totalMax,
    totalPct: Math.round(total / totalMax * 100),
    weakSubjects: analysis.filter(function(a) { return a.level === 'weak'; }),
    strongSubjects: analysis.filter(function(a) { return a.level === 'strong'; }),
    stableSubjects: analysis.filter(function(a) { return a.level === 'stable'; })
  };
}

// 核心函数：根据用户成绩 + 日期 生成个性化学习计划
function generateSmartSchedule(scores, date) {
  date = date || new Date();
  var dayType = getDayType(date);
  var phase = getCurrentPhase(date);
  var group = getSlotGroup(phase);
  var holidayName = getHolidayName(date.toISOString());

  // 获取时间槽
  var slots = TIME_SLOTS[group][dayType] || [];
  if (slots.length === 0) return [];

  // 分析成绩
  var analysis = analyzeScores(scores);
  if (!analysis) return [];
  var sorted = analysis.subjects; // 已按优先级排序

  // 用日期做简单轮换，让不同天安排不同
  var dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);

  var tasks = [];
  var usedSubjects = {};

  for (var i = 0; i < slots.length; i++) {
    // 在优先级列表上轮换
    var pickIdx = (i + dayOfYear) % sorted.length;
    var subject = sorted[pickIdx];
    var subjectKey = subject.key;

    // 同一天的相邻时段避免重复科目
    var tries = 0;
    while (usedSubjects[subjectKey + '-' + i] && tries < sorted.length) {
      pickIdx = (pickIdx + 1) % sorted.length;
      subject = sorted[pickIdx];
      subjectKey = subject.key;
      tries++;
    }
    usedSubjects[subjectKey + '-' + i] = true;

    // 选择具体任务（用 dayOfYear + slot index 做轮换）
    var period = slots[i].period;
    var pool = (TASK_TEMPLATES[subjectKey] && TASK_TEMPLATES[subjectKey][group] && TASK_TEMPLATES[subjectKey][group][period]) || [];
    var taskIdx = pool.length > 0 ? (dayOfYear + i) % pool.length : 0;
    var taskDesc = pool[taskIdx] || ('复习' + subject.name + '相关知识点，做练习题');

    // 根据科目水平确定学习类型
    var typeLabel;
    if (subject.level === 'weak') {
      typeLabel = group === 'sprint' ? '重点攻克' : '弱科突破';
    } else if (subject.level === 'strong') {
      typeLabel = '巩固保持';
    } else {
      typeLabel = dayType === 'weekday' ? '专项训练' : '能力提升';
    }

    tasks.push({
      time: slots[i].time,
      subject: subjectKey,
      subjectName: subject.name,
      subjectIcon: subject.icon,
      color: subject.color,
      bg: SUBJECTS[subjectKey].bg,
      text: SUBJECTS[subjectKey].text,
      task: taskDesc,
      type: typeLabel,
      isWeak: subject.level === 'weak',
      period: period
    });
  }

  return tasks;
}

// 生成一周的智能计划预览（用于展示）
function generateWeeklyPreview(scores) {
  var week = [];
  var today = new Date();
  var dayOrder = [1, 2, 3, 4, 5, 6, 0]; // 周一到周日

  for (var d = 0; d < 7; d++) {
    var targetDate = new Date(today);
    // 找到本周对应的每一天
    var currentDay = today.getDay();
    var diff = dayOrder[d] - currentDay;
    if (diff < 0) diff += 7;
    targetDate.setDate(today.getDate() + diff);

    var dayTasks = generateSmartSchedule(scores, targetDate);
    var dayType = getDayType(targetDate);
    var holidayName = getHolidayName(targetDate.toISOString());

    week.push({
      dayIndex: dayOrder[d],
      dayName: DAY_NAMES[dayOrder[d]],
      date: (targetDate.getMonth() + 1) + '/' + targetDate.getDate(),
      isToday: targetDate.toDateString() === today.toDateString(),
      dayType: dayType,
      dayTypeLabel: holidayName ? holidayName : (dayType === 'weekend' ? '周末' : '工作日'),
      tasks: dayTasks,
      taskCount: dayTasks.length,
      studyMinutes: dayTasks.length * 75 // 估算每节课75分钟
    });
  }

  return week;
}

// ========== 段位系统 ==========
var RANKS = [
  { id: 0, name: '倔强青铜', emoji: '🥉', minXP: 0, color: '#a8a29e', desc: '备战起步，踏上征程' },
  { id: 1, name: '不屈白银', emoji: '🥈', minXP: 300, color: '#94a3b8', desc: '基础渐稳，初窥门径' },
  { id: 2, name: '荣耀黄金', emoji: '🥇', minXP: 750, color: '#f59e0b', desc: '知识扎实，稳步提升' },
  { id: 3, name: '尊贵铂金', emoji: '💎', minXP: 1400, color: '#06b6d4', desc: '融会贯通，实力不俗' },
  { id: 4, name: '永恒钻石', emoji: '💠', minXP: 2300, color: '#8b5cf6', desc: '出类拔萃，志在必得' },
  { id: 5, name: '至尊星耀', emoji: '⭐', minXP: 3500, color: '#f97316', desc: '锋芒毕露，冲刺名校' },
  { id: 6, name: '最强王者', emoji: '👑', minXP: 5000, color: '#ef4444', desc: '学霸觉醒，势不可挡' },
  { id: 7, name: '荣耀王者·冲刺', emoji: '🔥', minXP: 7000, color: '#dc2626', desc: '巅峰状态，全力冲刺' },
  { id: 8, name: '走向清华', emoji: '🏆', minXP: 9500, color: '#7c3aed', desc: '终极荣耀，圆梦清华！' }
];

// ========== 成就系统 ==========
var ACHIEVEMENTS = [
  { id: 'first_win', name: '初战告捷', emoji: '⚔️', desc: '掌握第一道题', condition: 'mastered >= 1' },
  { id: 'streak_3', name: '三日之功', emoji: '📅', desc: '连续学习3天', condition: 'streak >= 3' },
  { id: 'streak_7', name: '七日不辍', emoji: '🔥', desc: '连续学习7天', condition: 'streak >= 7' },
  { id: 'streak_30', name: '月度坚持', emoji: '💪', desc: '连续学习30天', condition: 'streak >= 30' },
  { id: 'math_ace', name: '数学达人', emoji: '📐', desc: '掌握全部数学题', condition: 'math_all' },
  { id: 'physics_ace', name: '物理高手', emoji: '⚡', desc: '掌握全部物理题', condition: 'physics_all' },
  { id: 'chem_ace', name: '化学大师', emoji: '🧪', desc: '掌握全部化学题', condition: 'chemistry_all' },
  { id: 'bio_ace', name: '生物王者', emoji: '🧬', desc: '掌握全部生物题', condition: 'biology_all' },
  { id: 'eng_ace', name: '英语突破', emoji: '🌍', desc: '掌握全部英语题', condition: 'english_all' },
  { id: 'chi_ace', name: '语文精进', emoji: '📖', desc: '掌握全部语文题', condition: 'chinese_all' },
  { id: 'all_subjects', name: '全科精通', emoji: '🌟', desc: '每科至少掌握50%', condition: 'all_50pct' },
  { id: 'half_master', name: '半壁江山', emoji: '🏔️', desc: '总掌握率达到50%', condition: 'total_50pct' },
  { id: 'rank_gold', name: '黄金段位', emoji: '🥇', desc: '达到荣耀黄金段位', condition: 'rank >= 2' },
  { id: 'rank_diamond', name: '钻石段位', emoji: '💠', desc: '达到永恒钻石段位', condition: 'rank >= 4' },
  { id: 'rank_king', name: '王者觉醒', emoji: '👑', desc: '达到最强王者段位', condition: 'rank >= 6' }
];

// ========== 经验值规则 ==========
var XP_RULES = {
  easy: 30,
  medium: 60,
  hard: 100,
  ultra: 150,
  dailyTask: 50,
  topicReview: 15,
  streakBonus: function(streak) {
    if (streak >= 30) return 100;
    if (streak >= 14) return 60;
    if (streak >= 7) return 40;
    if (streak >= 3) return 20;
    return 0;
  }
};

// ========== 学科内容（每科6专题 × 3题 = 18题） ==========
var SUBJECT_CONTENT = {

  // ==================== 数学 ====================
  math: {
    phase: '一轮复习 · 夯实基础',
    keyTopics: [
      { title: '函数与导数', points: [
        '导数的几何意义：f\'(x₀) 表示曲线在 x₀ 处切线的斜率',
        '利用导数判断单调性：f\'(x)>0 递增，f\'(x)<0 递减',
        '极值点处 f\'(x)=0，但 f\'(x)=0 不一定是极值点',
        '含参讨论：对参数分类讨论是高考压轴题的核心方法'
      ]},
      { title: '数列', points: [
        '等差数列：aₙ = a₁+(n-1)d，Sₙ = na₁+n(n-1)d/2',
        '等比数列：aₙ = a₁·qⁿ⁻¹，Sₙ = a₁(1-qⁿ)/(1-q)',
        '求通项公式：累加法、累乘法、特征方程法',
        '错位相减法、裂项相消法是最常用的求和方法'
      ]},
      { title: '立体几何', points: [
        '空间向量法建系三步骤：找三条两两垂直的边作为基底',
        '线面角 = 线向量与法向量夹角的余角',
        '二面角 = 两个半平面法向量的夹角（或其补角）',
        '证明线面平行：线向量与法向量点积为零'
      ]},
      { title: '概率统计', points: [
        '古典概型：P = 有利事件数 / 总事件数',
        '条件概率：P(B|A) = P(AB)/P(A)',
        '正态分布 X~N(μ,σ²)，μ 决定位置，σ 决定形状',
        '回归分析：ŷ = b̂x + â，相关系数 r 衡量线性相关程度'
      ]},
      { title: '解析几何', points: [
        '椭圆：x²/a² + y²/b² = 1，焦点在长轴上，c² = a²-b²',
        '双曲线：x²/a² - y²/b² = 1，渐近线 y = ±(b/a)x',
        '抛物线：y² = 2px，焦点(p/2, 0)，准线 x = -p/2',
        '直线与圆锥曲线联立→韦达定理是通法'
      ]},
      { title: '三角函数', points: [
        '基本关系：sin²α + cos²α = 1，tanα = sinα/cosα',
        '辅助角公式：a·sinx + b·cosx = √(a²+b²)·sin(x+φ)',
        '正弦定理：a/sinA = b/sinB = c/sinC = 2R',
        '余弦定理：a² = b² + c² - 2bc·cosA'
      ]}
    ],
    questions: [
      // —— 函数与导数 (3题) ——
      { q: '已知 f(x) = x·eˣ，求 f(x) 在 x=0 处的切线方程。', difficulty: 'easy', topic: '函数与导数', answer: 'f\'(x) = eˣ + x·eˣ = (1+x)eˣ\n\nf\'(0) = 1（切线斜率）\nf(0) = 0（切点）\n\n切线方程：y = x', hint: '切线方程公式：y - f(x₀) = f\'(x₀)(x - x₀)' },
      { q: '已知 f(x) = x³ - 3x² + 2，求 f(x) 的单调区间和极值。', difficulty: 'medium', topic: '函数与导数', answer: 'f\'(x) = 3x² - 6x = 3x(x-2)\n\n令 f\'(x)=0，得 x=0 或 x=2\n\nf\'(x)>0 当 x<0 或 x>2 → 递增区间 (-∞,0) 和 (2,+∞)\nf\'(x)<0 当 0<x<2 → 递减区间 (0,2)\n\n极大值 f(0)=2，极小值 f(2)=-2', hint: '先求导，令导数为零找临界点，再用符号表判断单调性' },
      { q: '设函数 f(x) = ln(x) - ax（a>0），讨论 f(x) 的极值。', difficulty: 'hard', topic: '函数与导数', answer: '定义域 x>0，f\'(x) = 1/x - a\n\n令 f\'(x)=0 → x = 1/a\n\n当 0<x<1/a 时 f\'(x)>0 递增\n当 x>1/a 时 f\'(x)<0 递减\n\n∴ 在 x=1/a 处取极大值\nf(1/a) = -ln(a) - 1', hint: '含参问题要注意定义域，对参数分类讨论' },

      // —— 数列 (3题) ——
      { q: '等差数列 {aₙ} 中，a₃=7，a₇=19，求通项公式和前10项和 S₁₀。', difficulty: 'easy', topic: '数列', answer: 'a₇ - a₃ = 4d → 19-7 = 4d → d=3\na₁ = a₃ - 2d = 7-6 = 1\n\n通项公式：aₙ = 3n - 2\n\nS₁₀ = 10×1 + 10×9/2×3 = 10 + 135 = 145', hint: '利用已知两项求公差和首项' },
      { q: '等比数列 {aₙ} 中，a₁+a₂=3，a₂+a₃=6，求 a₇。', difficulty: 'medium', topic: '数列', answer: '设公比为 q，则：\na₁(1+q) = 3 ①\na₁q(1+q) = 6 ②\n\n②÷①：q = 2\n代入①：a₁×3 = 3 → a₁ = 1\n\na₇ = a₁·q⁶ = 1×64 = 64', hint: '利用相邻两项和的比值求公比' },
      { q: '数列 {aₙ} 满足 a₁=1，aₙ₊₁ = 2aₙ + 1，求通项公式和前n项和 Sₙ。', difficulty: 'ultra', topic: '数列', answer: '构造法：aₙ₊₁ + 1 = 2(aₙ + 1)\n\n令 bₙ = aₙ + 1，则 b₁ = 2\n{bₙ} 是公比为2的等比数列\nbₙ = 2·2ⁿ⁻¹ = 2ⁿ\n\n∴ aₙ = 2ⁿ - 1\n\nSₙ = (2¹+2²+...+2ⁿ) - n = 2ⁿ⁺¹ - 2 - n', hint: '递推式含常数项时，用构造法转化为等比数列' },

      // —— 立体几何 (3题) ——
      { q: '正方体 ABCD-A₁B₁C₁D₁ 棱长为1，求 AC₁ 的长度。', difficulty: 'easy', topic: '立体几何', answer: '正方体体对角线公式：\nAC₁ = √(a² + a² + a²) = √(3a²)\n\nAC₁ = √3 × 1 = √3', hint: '体对角线 = √3 × 棱长' },
      { q: '正四面体 ABCD 棱长为2，求其体积。', difficulty: 'medium', topic: '立体几何', answer: '正四面体体积公式：V = (√2/12)a³\n\nV = (√2/12)×8 = 2√2/3', hint: '正四面体体积 V = (√2/12)a³，也可用底面积×高÷3推导' },
      { q: '在正三棱柱 ABC-A₁B₁C₁ 中，所有棱长均为2，D为BB₁的中点。用向量法求二面角 A-DC₁-C 的大小。', difficulty: 'hard', topic: '立体几何', answer: '以C为原点建系：\nC(0,0,0), A(√3,1,0), B(0,2,0), C₁(0,0,2), D(0,2,1)\n\n向量DA = (√3,-1,-1), DC₁ = (0,-2,1)\n\n平面ADC₁法向量 n₁ = (√3, 1, 2)\n平面DCC₁法向量 n₂ = (1, 0, 0)\n\ncos θ = √3/(2√2) = √6/4\n\n二面角约 arccos(√6/4) ≈ 52.2°', hint: '建系 → 求两平面法向量 → 用点积公式求夹角' },

      // —— 概率统计 (3题) ——
      { q: '袋中有4个红球和2个白球，随机取2个球，求至少取到1个白球的概率。', difficulty: 'easy', topic: '概率统计', answer: '用对立事件法：\nP(至少1白) = 1 - P(全红)\n\nP(全红) = C(4,2)/C(6,2) = 6/15 = 2/5\n\nP(至少1白) = 1 - 2/5 = 3/5', hint: '"至少"类问题优先用对立事件法' },
      { q: '某校1000名学生数学成绩近似服从正态分布 N(90, 10²)，估计成绩在80~100分之间的学生人数。\n（参考：P(μ-σ<X<μ+σ)≈0.6826）', difficulty: 'medium', topic: '概率统计', answer: 'μ=90, σ=10\n\n80 = μ-σ，100 = μ+σ\n\nP(80<X<100) = P(μ-σ<X<μ+σ) ≈ 0.6826\n\n人数 ≈ 1000 × 0.6826 ≈ 683人', hint: '利用正态分布的对称性和3σ原则' },
      { q: '甲、乙两人独立地解同一道题，甲解出的概率为0.6，乙解出的概率为0.5。求：(1) 至少有一人解出的概率；(2) 已知题目被解出，求甲解出的条件概率。', difficulty: 'hard', topic: '概率统计', answer: '(1) P(至少一人解出) = 1 - P(都解不出)\n= 1 - (1-0.6)(1-0.5)\n= 1 - 0.4×0.5 = 1 - 0.2 = 0.8\n\n(2) 设A="甲解出"，B="题目被解出"\nP(A∩B) = P(甲解出) = 0.6（甲解出则题目一定被解出）\n\nP(A|B) = P(A∩B)/P(B) = 0.6/0.8 = 0.75', hint: '条件概率公式 P(A|B) = P(AB)/P(B)' },

      // —— 解析几何 (3题) ——
      { q: '椭圆 x²/9 + y²/4 = 1，求其焦点坐标和离心率。', difficulty: 'easy', topic: '解析几何', answer: 'a² = 9, b² = 4\n\nc² = a² - b² = 9 - 4 = 5\nc = √5\n\n焦点在x轴上：F₁(-√5, 0), F₂(√5, 0)\n\n离心率 e = c/a = √5/3', hint: '椭圆中 c² = a² - b²，焦点在分母大的轴上' },
      { q: '直线 y = x + 1 与抛物线 y² = 4x 交于 A、B 两点，求 |AB|。', difficulty: 'medium', topic: '解析几何', answer: '联立：(x+1)² = 4x\nx² + 2x + 1 = 4x\nx² - 2x + 1 = 0\n(x-1)² = 0\n\n只有一个交点(1, 2)，即直线与抛物线相切。\n\n|AB| = 0（此时A、B重合，直线为抛物线切线）\n\n注意：此题说明直线与抛物线可能相切，需先判断判别式。', hint: '联立方程后先看判别式 Δ，再决定后续计算' },
      { q: '已知椭圆 C: x²/4 + y²/3 = 1，过右焦点 F 作斜率为 k 的直线交椭圆于 A、B 两点。若 |AF|·|BF| = 9/4，求 k 的值。', difficulty: 'ultra', topic: '解析几何', answer: 'a²=4, b²=3, c²=1, F(1,0)\n\n设直线 y = k(x-1)，代入椭圆：\n3x² + 4k²(x-1)² = 12\n(3+4k²)x² - 8k²x + 4k²-12 = 0\n\n由韦达定理：x₁+x₂ = 8k²/(3+4k²)，x₁x₂ = (4k²-12)/(3+4k²)\n\n|AF|·|BF| = (a-ex₁)(a-ex₂)（焦半径公式，e=1/2）\n= (2-x₁/2)(2-x₂/2)\n= 4 - (x₁+x₂) + x₁x₂/4\n\n代入得：4 - 8k²/(3+4k²) + (4k²-12)/(4(3+4k²)) = 9/4\n\n化简解得 k² = 3，即 k = ±√3', hint: '利用焦半径公式结合韦达定理是椭圆综合题的通法' },

      // —— 三角函数 (3题) ——
      { q: '已知 sinα = 3/5，α∈(π/2, π)，求 cosα 和 tanα。', difficulty: 'easy', topic: '三角函数', answer: 'α∈(π/2, π)，即第二象限，cosα < 0\n\ncos²α = 1 - sin²α = 1 - 9/25 = 16/25\ncosα = -4/5\n\ntanα = sinα/cosα = (3/5)/(-4/5) = -3/4', hint: '先判断象限确定符号，再用基本关系式' },
      { q: '在△ABC中，a=5, b=7, C=60°，求 c 和 △ABC 的面积。', difficulty: 'medium', topic: '三角函数', answer: '余弦定理：\nc² = a² + b² - 2ab·cosC\n= 25 + 49 - 2×5×7×cos60°\n= 74 - 70×(1/2)\n= 74 - 35 = 39\n\nc = √39\n\n面积 S = (1/2)ab·sinC\n= (1/2)×5×7×sin60°\n= (35/2)×(√3/2)\n= 35√3/4', hint: '已知两边和夹角用余弦定理求第三边，面积用 (1/2)ab·sinC' },
      { q: '将函数 f(x) = 2sin(2x + π/6) 化为 A·sin(ωx + φ) 的形式并求：(1) 最小正周期；(2) 最大值及取得最大值时 x 的集合；(3) 单调递增区间。', difficulty: 'hard', topic: '三角函数', answer: '已为标准形式 A=2, ω=2, φ=π/6\n\n(1) T = 2π/ω = 2π/2 = π\n\n(2) 最大值 = A = 2\n当 2x + π/6 = π/2 + 2kπ 时取最大值\n即 x = π/6 + kπ (k∈Z)\n\n(3) 令 -π/2 + 2kπ ≤ 2x + π/6 ≤ π/2 + 2kπ\n-π/2 - π/6 ≤ 2x ≤ π/2 - π/6\n-2π/3 ≤ 2x ≤ π/3\n-π/3 + kπ ≤ x ≤ π/6 + kπ\n\n递增区间：[-π/3 + kπ, π/6 + kπ] (k∈Z)', hint: '三角函数性质都基于 ωx+φ 的范围分析' }
    ]
  },

  // ==================== 英语 ====================
  english: {
    phase: '持续突破 · 词汇+语法双线并行',
    keyTopics: [
      { title: '核心语法', points: [
        '时态：重点掌握现在完成时(have done)、过去进行时(was doing)、过去完成时(had done)',
        '非谓语动词：to do(目的/将来), doing(主动/进行), done(被动/完成)',
        '定语从句：who/whom/whose/which/that 的选择，限制性 vs 非限制性',
        '虚拟语气：if从句用过去式/过去完成式，主句用would+do/have done'
      ]},
      { title: '阅读理解', points: [
        '主旨题：看首尾段+各段首句，关注转折词后内容',
        '推断题：需要根据线索推理，文中不直接给出答案',
        '词义猜测：利用上下文(同义/反义/举例/因果)推断',
        '细节题：定位关键词回原文，注意同义替换'
      ]},
      { title: '完形填空', points: [
        '通读全文抓大意，不要逐题翻译',
        '利用上下文逻辑和复现词选择答案',
        '关注固定搭配和习惯用法',
        '注意情感色彩和语义场的统一'
      ]},
      { title: '写作提分', points: [
        '开头：直奔主题，可用设问引入，避免冗长铺垫',
        '中间：用 First/Second/Finally 等连接词组织逻辑',
        '结尾：总结观点+展望/建议，不要引入新信息',
        '高级替换：important→vital, think→hold/maintain, very→extremely'
      ]},
      { title: '词汇与短语', points: [
        '高频动词短语：take up, turn out, give in, look into, put off',
        '高考核心词汇：accommodate, acknowledge, compensate, distinguish',
        '易混词辨析：affect/effect, principle/principal, compliment/complement',
        '词根词缀法：un-(否定), re-(再次), -tion(名词), -able(可…的)'
      ]},
      { title: '听力与口语', points: [
        '预读选项，预测话题和关键信息',
        '注意数字、时间、地点等具体信息的捕捉',
        '关注语气和态度词：unfortunately, actually, to be honest',
        '口语交际常用功能句：建议、请求、道歉、邀请等'
      ]}
    ],
    questions: [
      // —— 核心语法 (3题) ——
      { q: '选择正确答案：By the time he arrived, we ______ (finish) dinner.', difficulty: 'easy', topic: '核心语法', answer: 'had finished\n\nBy the time + 过去时，主句用过去完成时(had done)，表示在他到达之前已经吃完了。', hint: 'By the time 引导的时间状语从句，主句要用更早的时态' },
      { q: '改写句子（使用非谓语动词）：Because he was ill, he didn\'t go to school.', difficulty: 'medium', topic: '核心语法', answer: 'Being ill, he didn\'t go to school.\n\n当从句主语和主句主语相同时，可将 because 从句改为现在分词作原因状语。', hint: '主语一致时，原因状语从句可简化为分词短语' },
      { q: '翻译：正是他的坚持不懈使他最终取得了成功。（强调句）', difficulty: 'medium', topic: '核心语法', answer: 'It was his perseverance that eventually led to his success.\n\n强调句结构：It is/was + 被强调部分 + that + 其余部分', hint: '强调句型 It is/was ... that ... 是高考高频考点' },

      // —— 阅读理解 (3题) ——
      { q: '阅读短文回答问题：\n"Many scientists now believe that the Arctic is warming faster than any other region on Earth. This phenomenon, known as Arctic amplification, is largely driven by the loss of sea ice."', difficulty: 'easy', topic: '阅读理解', answer: '主旨理解：北极地区变暖速度超过地球其他区域，原因是海冰消失。\n\n关键词：\n- Arctic amplification（北极放大效应）\n- warming faster（加速变暖）\n- loss of sea ice（海冰减少是主因）\n\n推断：海冰减少→反射率降低→吸收更多热量→加速变暖（正反馈）', hint: '主旨题关注首句，细节题回原文定位' },
      { q: '阅读推断：分析作者态度。\n"While the new policy has drawn considerable criticism, its supporters argue that the long-term benefits far outweigh the short-term inconveniences."', difficulty: 'medium', topic: '阅读理解', answer: '作者态度：客观中立(objective/neutral)\n\n作者同时呈现批评和支持两方面，While 表示让步，没有明显偏向。', hint: '注意 While 等让步连词暗示的平衡视角' },
      { q: '阅读猜词：根据上下文推断 "ubiquitous" 的含义。\n"Smartphones have become ubiquitous in modern society. From teenagers to seniors, nearly everyone carries one, and they can be seen in every corner of the world."', difficulty: 'hard', topic: '阅读理解', answer: 'ubiquitous 意为"无处不在的，普遍存在的"\n\n推断线索：\n① "nearly everyone carries one" → 几乎人人都有\n② "in every corner of the world" → 世界各地都有\n③ "From teenagers to seniors" → 各年龄段都使用\n\n综合三个线索，该词表示"非常普遍、到处可见"。', hint: '利用后文的解释性语句（同义线索）推断词义' },

      // —— 完形填空 (3题) ——
      { q: '选择最佳选项：\n"She ______ at the photo for a long time before she finally recognized the man in it."\nA. glanced  B. stared  C. peeked  D. watched', difficulty: 'easy', topic: '完形填空', answer: '答案：B. stared\n\n辨析：\n- glance at: 瞥一眼（短暂）\n- stare at: 凝视、盯着看（长时间注视）\n- peek at: 偷看\n- watch: 观看（持续性活动如比赛、节目）\n\n关键线索："for a long time" 说明长时间注视 → stared', hint: '时间状语 "for a long time" 是选择 stare 的关键' },
      { q: '选词填空：\n"The teacher\'s encouragement had a profound ______ on the students\' confidence."\nA. affect  B. effect  C. effort  D. afford', difficulty: 'medium', topic: '完形填空', answer: '答案：B. effect\n\n辨析：\n- affect (v.) 影响（动词）\n- effect (n.) 影响、效果（名词）\n- effort (n.) 努力\n- afford (v.) 负担得起\n\n句型 "have a/an ... effect on" 是固定搭配，意为"对……产生……影响"。', hint: 'have an effect on 是固定搭配，effect 是名词' },
      { q: '完形填空解题策略：\n阅读以下段落并分析第3空应选什么：\n"I was walking home late at night when I heard footsteps behind me. I quickened my pace, feeling increasingly (1)____. When I finally reached my door, I turned around only to find a small cat (2)____ me. I couldn\'t help but (3)____ with relief."\n第3空选项：A. cry  B. laugh  C. run  D. hide', difficulty: 'hard', topic: '完形填空', answer: '第3空答案：B. laugh\n\n解题思路：\n① 通读全段：讲述夜间回家被"跟踪"，结果发现是一只猫\n② 情感变化：紧张(fear) → 发现真相 → 释然(relief)\n③ "couldn\'t help but laugh with relief" 表示如释重负后忍不住笑了\n④ cry（哭）不符合"relief"的积极情感\n⑤ run（跑）和 hide（躲）与到达门口后的情境矛盾\n\n关键：完形填空要看前后文的情感线索和逻辑关系。', hint: '完形填空要通读全文，把握情感走向，不能逐句孤立选择' },

      // —— 写作提分 (3题) ——
      { q: '将以下简单句升级为高级表达：\n"I think reading is very important. It can help us learn a lot of things."', difficulty: 'easy', topic: '写作提分', answer: '升级版：\n"I firmly maintain that reading is of vital significance, as it enables us to acquire a wealth of knowledge."\n\n升级要点：\n① think → firmly maintain（更正式）\n② very important → of vital significance（高级替换）\n③ help us learn → enable us to acquire（高级动词）\n④ a lot of things → a wealth of knowledge（精准表达）', hint: '高考作文加分项：高级词汇替换 + 句式多样化' },
      { q: '书面表达：用3-4句描述一个印象深刻的经历，要求使用：①定语从句 ②非谓语动词 ③强调句', difficulty: 'medium', topic: '写作提分', answer: '参考范文：\nIt was last summer that I participated in a volunteer program, which was organized to help elderly people. Spending two weeks with them, I learned the importance of patience.\n\n① which was... (定语从句)\n② Spending... (非谓语动词)\n③ It was...that... (强调句)', hint: '高考作文加分项：句式多样化 + 高级语法 + 逻辑连贯' },
      { q: '根据以下要求写一段80词左右的议论文开头：\n话题："Whether high school students should use smartphones at school"', difficulty: 'hard', topic: '写作提分', answer: '参考范文：\n"Nowadays, whether high school students should be allowed to use smartphones at school has sparked a heated debate. Some argue that phones serve as powerful learning tools, while others contend that they distract students from their studies. From my perspective, a balanced approach is the key."\n\n写作技巧：\n① Nowadays 引入时代背景\n② sparked a heated debate 表明争议性\n③ Some...while others... 呈现双方观点\n④ From my perspective 亮明立场', hint: '议论文开头三要素：背景引入+争议呈现+立场表明' },

      // —— 词汇与短语 (3题) ——
      { q: '选择正确的词填空：\n"The government has taken measures to ______ the spread of the disease."\nA. cure  B. prevent  C. treat  D. recover', difficulty: 'easy', topic: '词汇与短语', answer: '答案：B. prevent\n\n辨析：\n- cure 治愈（治疗疾病本身）\n- prevent 阻止、防止（阻止传播）\n- treat 治疗（对病人进行医疗）\n- recover 恢复（从疾病中康复）\n\n"prevent the spread of" = 阻止……的传播，是常见搭配。', hint: '注意动词与宾语的搭配关系' },
      { q: '用所给词的适当形式填空：\n"The ______ (discover) of new evidence led to the suspect being set free."', difficulty: 'medium', topic: '词汇与短语', answer: 'discovery\n\n分析：\n① 该处在句中做主语，需要名词形式\n② discover (v.) → discovery (n.)\n③ "The discovery of new evidence" = 新证据的发现\n\n词性转换规律：-y 是常见的名词后缀，如 recover→recovery, deliver→delivery。', hint: '根据语法位置判断词性，注意词性转换的后缀规律' },
      { q: '辨析并造句：distinguish / distinct / distinctive', difficulty: 'hard', topic: '词汇与短语', answer: '辨析：\n① distinguish (v.) 区分、辨别\n   造句：It is difficult to distinguish the twins from each other.\n\n② distinct (adj.) 明显的、不同的\n   造句：There is a distinct difference between the two approaches.\n\n③ distinctive (adj.) 有特色的、独特的\n   造句：The panda\'s black and white coloring is distinctive.\n\n记忆技巧：\n- distinguish = 动词"区分"\n- distinct = "清晰可辨的"\n- distinctive = "具有独特特征的"', hint: '同根词辨析要关注后缀差异：-t（形容词）vs -tive（有…特征的）' },

      // —— 听力与口语 (3题) ——
      { q: '听力策略题：听前预读以下选项，预测对话主题：\nA. At a restaurant  B. At a hospital  C. At a library  D. At an airport', difficulty: 'easy', topic: '听力与口语', answer: '预测策略：\n① 四个选项都是地点 → 该题考查"对话发生的场所"\n② 预读时应联想各场景的关键词：\n   - restaurant: menu, order, bill, tip\n   - hospital: doctor, medicine, symptom, appointment\n   - library: borrow, return, due, shelf\n   - airport: flight, boarding, gate, luggage\n③ 听的时候捕捉这些关键词即可判断地点\n\n听力技巧：预读选项→预测话题→带着问题去听', hint: '预读选项是听力提分的关键策略' },
      { q: '口语交际：选择合适的回应。\nA: "I\'m really sorry about breaking your cup."\nB: ______\nA. "You should be more careful." B. "Don\'t worry about it. It was an accident."\nC. "I don\'t like it anyway." D. "You broke it on purpose!"', difficulty: 'medium', topic: '听力与口语', answer: '答案：B\n\n分析：\nA 在道歉（I\'m really sorry），合适的回应应该是接受道歉。\n\n- A项：批评对方，不够礼貌\n- B项：安慰对方"别担心，是意外"，得体友好 ✓\n- C项：虽然看似不在意但语气不好\n- D项：指责对方故意，过于激烈\n\n口语交际原则：接受道歉时表现宽容和理解。', hint: '口语交际要注意语境和文化礼貌规范' },
      { q: '听力精听练习：根据以下听力文本，回答三个问题：\n"W: Excuse me, could you tell me when the next train to London leaves?\nM: Let me check. The next one departs at 3:15 from Platform 4. But I\'m afraid it\'s been delayed by about 20 minutes due to signal failure."\n问题：(1) 目的地是哪？(2) 原定发车时间？(3) 延误原因？', difficulty: 'hard', topic: '听力与口语', answer: '(1) 目的地：London（伦敦）\n   线索词："train to London"\n\n(2) 原定发车时间：3:15\n   线索词："departs at 3:15 from Platform 4"\n\n(3) 延误原因：信号故障\n   线索词："delayed by about 20 minutes due to signal failure"\n\n精听技巧：\n① 第一遍听大意\n② 第二遍抓细节\n③ 注意转折词 but/however 后面的信息往往是考点\n④ 数字和时间要快速记录', hint: '精听要反复听，重点捕捉数字、原因、转折等关键信息' }
    ]
  },

  // ==================== 物理 ====================
  physics: {
    phase: '一轮复习 · 模型建构',
    keyTopics: [
      { title: '力学核心', points: [
        '牛顿第二定律 F=ma 是力学的灵魂，受力分析是基础',
        '受力分析顺序：重力→弹力→摩擦力→其他力',
        '整体法与隔离法：求加速度用整体，求内力用隔离',
        '运动学五大公式，选公式的关键是找已知量和待求量'
      ]},
      { title: '能量守恒', points: [
        '动能定理：W合 = ΔEk = ½mv² - ½mv₀²（万能公式）',
        '机械能守恒条件：只有重力或弹力做功',
        '功能关系：除重力和弹力外的力做的功 = 机械能变化量',
        '摩擦生热：Q = f·s相对（注意是相对位移）'
      ]},
      { title: '电磁学', points: [
        '电场力 F=qE，电势能 Ep=qφ，电场力做功 W=qU',
        '安培力 F=BIL，方向用左手定则',
        '洛伦兹力 f=qvB，不做功只改变方向',
        '法拉第电磁感应：ε = nΔΦ/Δt = BLv'
      ]},
      { title: '电磁感应', points: [
        '楞次定律：感应电流的磁场总是阻碍原磁通量的变化',
        '导体切割：ε = BLv，电流方向用右手定则',
        '自感现象：电流增大时自感电流阻碍增大',
        '电磁感应中的能量转化：外力做功→电能→焦耳热'
      ]},
      { title: '热学与光学', points: [
        '理想气体状态方程：pV/T = 常数',
        '热力学第一定律：ΔU = Q + W',
        '折射定律：n = sinθ₁/sinθ₂ = c/v',
        '全反射条件：从光密介质到光疏介质，入射角≥临界角'
      ]},
      { title: '实验专题', points: [
        '验证牛顿第二定律：补偿摩擦力，m>>M 的近似条件',
        '测定电源电动势和内阻：U-I 图像法',
        '打点计时器测速度和加速度：逐差法求加速度',
        '游标卡尺和螺旋测微器的读数方法'
      ]}
    ],
    questions: [
      // —— 力学核心 (3题) ——
      { q: '质量为 2kg 的物体在水平面上受 F=10N 水平推力，摩擦系数 μ=0.3，求加速度。(g=10m/s²)', difficulty: 'easy', topic: '力学核心', answer: '摩擦力 f = μmg = 0.3×2×10 = 6N\n\n由牛顿第二定律：F - f = ma\n10 - 6 = 2a\na = 2 m/s²', hint: '先画受力图：推力 - 摩擦力 = ma' },
      { q: '如图所示，质量分别为 m₁=2kg 和 m₂=3kg 的物体A、B叠放在光滑水平面上，A、B之间摩擦系数 μ=0.4。对A施加水平力 F，求A、B不发生相对滑动时 F 的最大值。(g=10m/s²)', difficulty: 'medium', topic: '力学核心', answer: 'A、B一起运动时，整体加速度相同。\n\nB的最大加速度由A对B的摩擦力决定：\nf_max = μm₁g = 0.4×2×10 = 8N（注意：这里是A对B的摩擦力，m₁g是A对B的压力）\n\n纠正：A叠在B上面，A对B的压力 = m₁g\nB受A给的摩擦力 = m₁g×μ 使B加速\na_max(B) = μm₁g/m₂ = 0.4×2×10/3 = 8/3 m/s²\n\n整体：F = (m₁+m₂)a_max = 5 × 8/3 = 40/3 ≈ 13.3N', hint: '临界条件：A、B间摩擦力达到最大值时即将相对滑动' },
      { q: '在倾角 θ=30° 的斜面上，质量 m=4kg 的物体受平行于斜面向上的力 F=30N 作用匀速上滑。求：(1) 摩擦力大小；(2) 撤去F后物体还能上滑多远？(g=10m/s²)', difficulty: 'hard', topic: '力学核心', answer: '(1) 匀速→合力为零：\nF = mg·sinθ + f\n30 = 4×10×0.5 + f\nf = 30 - 20 = 10N\n\n(2) 撤去F后，物体受 mg·sinθ + f = 20 + 10 = 30N 的合力（沿斜面向下）\n\na = 30/4 = 7.5 m/s²（减速）\n\n撤去F时速度 v₀：需要先知道此前运动过程。但题设"匀速上滑"说明v₀就是匀速速度。\n设匀速速度为v，撤去F后减速到0：\nv² = 2a·s → s = v²/(2×7.5)\n\n若题意中匀速速度已知为 v₀=3m/s（典型值）：\ns = 9/15 = 0.6m', hint: '匀速条件用来求摩擦力，撤力后用动能定理或运动学求距离' },

      // —— 能量守恒 (3题) ——
      { q: '物体从 h=20m 处自由落下(g=10m/s²)，求：(1) 落地时间 (2) 落地速度', difficulty: 'easy', topic: '能量守恒', answer: '(1) h = ½gt² → 20 = 5t² → t = 2s\n\n(2) v = gt = 10×2 = 20m/s', hint: '自由落体初速度为零，v₀=0' },
      { q: '质量 m 的小球从高 h 处沿光滑曲面滑下，求到达底端时的速度。（用动能定理）', difficulty: 'medium', topic: '能量守恒', answer: '由动能定理：\nmgh = ½mv² - 0\nv = √(2gh)\n\n动能定理优势：不需知道路径形状，只看初末状态。', hint: '动能定理不关心过程细节，只看初末状态' },
      { q: '质量为 m 的小球以初速度 v₀ 从地面竖直上抛，空气阻力恒为 f。求：(1) 上升的最大高度 H；(2) 小球落回地面时的速度 v。', difficulty: 'hard', topic: '能量守恒', answer: '(1) 上升过程，由动能定理：\n-mgH - fH = 0 - ½mv₀²\nH = mv₀² / (2(mg+f))\n\n(2) 上升和下降各经过高度 H：\n上升：-(mg+f)H = -½mv₀²  →  H = mv₀²/(2(mg+f))\n下降：(mg-f)H = ½mv² - 0\n\nv² = 2(mg-f)H/m = 2(mg-f)·mv₀²/(2m(mg+f))\nv = v₀·√((mg-f)/(mg+f))\n\n落地速度小于初速度（因为有阻力消耗能量）。', hint: '上升和下降分别用动能定理，注意阻力方向始终与运动方向相反' },

      // —— 电磁学 (3题) ——
      { q: '带电量 q=2×10⁻⁶C 的正电荷在匀强电场中从A移到B，电场力做功 W=6×10⁻⁴J，AB距离 d=0.1m。求：(1) 电场强度 (2) AB间电势差', difficulty: 'easy', topic: '电磁学', answer: '(1) W = qEd\nE = 6×10⁻⁴ / (2×10⁻⁶×0.1) = 3000 V/m\n\n(2) U = W/q = 300V\n（或 U = Ed = 300V）', hint: '电场力做功 W=qU=qEd' },
      { q: '在匀强磁场 B=0.2T 中，质量 m=1×10⁻²⁶kg、电荷 q=1.6×10⁻¹⁹C 的带电粒子以 v=2×10⁶m/s 垂直磁场射入。求：(1) 圆周运动半径 (2) 运动周期', difficulty: 'medium', topic: '电磁学', answer: '(1) 洛伦兹力提供向心力：\nqvB = mv²/r\nr = mv/(qB)\n= 1×10⁻²⁶ × 2×10⁶ / (1.6×10⁻¹⁹ × 0.2)\n= 2×10⁻²⁰ / 3.2×10⁻²⁰\n= 0.625 m\n\n(2) T = 2πm/(qB)\n= 2π × 1×10⁻²⁶ / (1.6×10⁻¹⁹ × 0.2)\n= 2π × 10⁻²⁶ / 3.2×10⁻²⁰\n≈ 1.96×10⁻⁶ s', hint: '带电粒子在匀强磁场中做匀速圆周运动，洛伦兹力提供向心力' },
      { q: '在平行板电容器中，板间距 d=2cm，电压 U=200V。一个电子从静止开始从负极板向正极板加速。求：(1) 到达正极板的速度；(2) 运动时间。（mₑ=9.1×10⁻³¹kg, e=1.6×10⁻¹⁹C）', difficulty: 'hard', topic: '电磁学', answer: '(1) 电场力做功 = 动能变化：\neU = ½mₑv²\nv = √(2eU/mₑ)\n= √(2×1.6×10⁻¹⁹×200 / 9.1×10⁻³¹)\n= √(6.4×10⁻¹⁷ / 9.1×10⁻³¹)\n= √(7.03×10¹³)\n≈ 8.39×10⁶ m/s\n\n(2) E = U/d = 200/0.02 = 10000 V/m\n加速度 a = eE/mₑ = 1.6×10⁻¹⁹×10⁴ / 9.1×10⁻³¹\n= 1.76×10¹⁵ m/s²\n\nd = ½at² → t = √(2d/a)\n= √(2×0.02 / 1.76×10¹⁵)\n= √(2.27×10⁻¹⁷)\n≈ 4.77×10⁻⁹ s', hint: '带电粒子在匀强电场中加速，用动能定理最简便' },

      // —— 电磁感应 (3题) ——
      { q: '矩形线圈面积 S=0.1m²，在 B=0.5T 的匀强磁场中。初始时线圈平面与磁场垂直，经 Δt=0.2s 转过 90°。求平均感应电动势。', difficulty: 'easy', topic: '电磁感应', answer: '初始磁通量：Φ₁ = BS = 0.5×0.1 = 0.05 Wb\n转过90°后：Φ₂ = 0（线圈平面平行于磁场）\n\nΔΦ = |Φ₂ - Φ₁| = 0.05 Wb\n\nε = ΔΦ/Δt = 0.05/0.2 = 0.25 V', hint: '法拉第电磁感应定律 ε = nΔΦ/Δt，注意磁通量的变化量' },
      { q: '导体棒 L=1m 在 B=0.5T 磁场中以 v=4m/s 匀速运动，电路电阻 R=2Ω。求：(1) 感应电动势 (2) 感应电流 (3) 维持匀速所需外力', difficulty: 'medium', topic: '电磁感应', answer: '(1) ε = BLv = 0.5×1×4 = 2V\n\n(2) I = ε/R = 1A\n\n(3) 匀速→外力=安培力\nF = BIL = 0.5×1×1 = 0.5N（方向与运动方向相同）', hint: '匀速→合力为零→外力等于安培力' },
      { q: '如图所示，光滑水平导轨上放质量 m=0.1kg、电阻 r=1Ω 的导体棒，导轨间距 L=0.5m，匀强磁场 B=2T 竖直向下，外接电阻 R=3Ω。导体棒受恒力 F=1N 从静止开始运动。求：(1) 最大速度；(2) 达到最大速度时棒的位移（已知此过程产生焦耳热 Q=0.5J）。', difficulty: 'ultra', topic: '电磁感应', answer: '(1) 最大速度时加速度为零：F = F_安培\nF = BIL = B²L²v/(R+r)\n\nv_max = F(R+r)/(B²L²)\n= 1×4 / (4×0.25)\n= 4/1 = 4 m/s\n\n(2) 由能量守恒：\nFx = ½mv_max² + Q\n1×x = ½×0.1×16 + 0.5\nx = 0.8 + 0.5 = 1.3 m', hint: '最大速度时外力等于安培力；能量守恒求位移' },

      // —— 热学与光学 (3题) ——
      { q: '密封容器中一定质量的理想气体，温度从 27°C 升高到 127°C，体积不变。求压强变为原来的多少倍？', difficulty: 'easy', topic: '热学与光学', answer: '等容变化（查理定律）：\np₁/T₁ = p₂/T₂\n\nT₁ = 27 + 273 = 300K\nT₂ = 127 + 273 = 400K\n\np₂/p₁ = T₂/T₁ = 400/300 = 4/3\n\n压强变为原来的 4/3 倍。', hint: '气体问题温度一定要用热力学温度(K)，T = t + 273' },
      { q: '光从玻璃(n=√2)射入空气，求：(1) 全反射临界角；(2) 当入射角为 30° 时折射角。', difficulty: 'medium', topic: '热学与光学', answer: '(1) 全反射临界角 C：\nsinC = 1/n = 1/√2\nC = 45°\n\n(2) 入射角30° < 45°（未发生全反射）\n由折射定律：n·sinθ₁ = sinθ₂（从玻璃到空气）\n√2 × sin30° = sinθ₂\n√2 × 0.5 = sinθ₂\nsinθ₂ = √2/2\nθ₂ = 45°', hint: '全反射临界角 sinC = 1/n，入射角小于临界角时发生折射' },
      { q: '一定质量的理想气体经历如下过程：从状态 A(p₀, V₀, T₀) 等温膨胀到体积 2V₀，再等容加热到压强 2p₀。求：(1) 状态B(等温膨胀后)的压强；(2) 状态C(等容加热后)的温度；(3) 全过程内能变化。', difficulty: 'hard', topic: '热学与光学', answer: '(1) A→B 等温膨胀：\np₀V₀ = p_B × 2V₀\np_B = p₀/2\n\n(2) B→C 等容加热：\np_B/T_B = p_C/T_C\np_B = p₀/2，T_B = T₀（等温过程）\np_C = 2p₀\n\n(p₀/2)/T₀ = 2p₀/T_C\nT_C = 4T₀\n\n(3) 理想气体内能只与温度有关：\nΔU 取决于 T_C - T₀ = 3T₀\n\n温度升高，内能增加。\nΔU = nCv × 3T₀（具体值需要知道 n 和 Cv）', hint: '等温→温度不变→内能不变；等容→体积不变→不做功' },

      // —— 实验专题 (3题) ——
      { q: '用打点计时器研究匀变速直线运动，相邻两点间距分别为 s₁=2.0cm, s₂=3.0cm, s₃=4.0cm, s₄=5.0cm。打点间隔 T=0.02s。求加速度 a。', difficulty: 'easy', topic: '实验专题', answer: '用逐差法求加速度：\na = (s₃+s₄ - s₁-s₂) / (4T²)\n\ns₃+s₄ = 9.0cm = 0.09m\ns₁+s₂ = 5.0cm = 0.05m\n\na = (0.09 - 0.05) / (4×0.0004)\n= 0.04 / 0.0016\n= 25 m/s²\n\n注意：这个结果较大，可能是特殊实验条件。逐差法的核心是利用所有数据减小误差。', hint: '逐差法公式 a = (s₄+s₃-s₂-s₁)/(4T²)，利用全部数据更精确' },
      { q: '用伏安法测量电阻（约100Ω），电源电压约6V。电流表量程0-50mA、内阻约1Ω；电压表量程0-3V、内阻约3kΩ。问应选用电流表内接法还是外接法？为什么？', difficulty: 'medium', topic: '实验专题', answer: '判断依据：比较 R/R_A 与 R_V/R\n\nR/R_A = 100/1 = 100\nR_V/R = 3000/100 = 30\n\n因为 R/R_A > R_V/R（即100 > 30），\n说明电流表分压造成的相对误差大于电压表分流造成的误差。\n\n应选用电流表外接法。\n\n口诀："大电阻用外接，小电阻用内接"\n待测电阻与√(R_A·R_V) = √3000 ≈ 55Ω 比较：\n100Ω > 55Ω → 大电阻 → 外接法', hint: '比较 R与√(RA·RV) 的大小来选择接法' },
      { q: '用以下器材测量电源电动势 E 和内阻 r：电流表、电压表、滑动变阻器、开关、导线。实验测得6组数据如下：\nI(A): 0.10, 0.15, 0.20, 0.25, 0.30, 0.40\nU(V): 1.37, 1.32, 1.25, 1.18, 1.10, 0.95\n用图像法求 E 和 r。', difficulty: 'hard', topic: '实验专题', answer: 'U-I 图像法：U = E - Ir\n\n图像是一条直线，纵截距 = E，斜率的绝对值 = r\n\n取首尾两点计算斜率：\nΔU = 0.95 - 1.37 = -0.42V\nΔI = 0.40 - 0.10 = 0.30A\n\nr = |ΔU/ΔI| = 0.42/0.30 = 1.4Ω\n\nE = U + Ir = 1.37 + 0.10×1.4 = 1.37 + 0.14 = 1.51V\n\n（也可用其他数据点验证：E = 0.95 + 0.40×1.4 = 1.51V ✓）\n\n∴ E ≈ 1.5V，r ≈ 1.4Ω', hint: 'U-I图的纵截距是电动势，斜率绝对值是内阻' }
    ]
  },

  // ==================== 化学 ====================
  chemistry: {
    phase: '一轮复习 · 原理+有机双管齐下',
    keyTopics: [
      { title: '化学反应原理', points: [
        '平衡标志：正反应速率=逆反应速率，各组分浓度不变',
        '平衡常数 K 只与温度有关，K越大反应越完全',
        '勒夏特列原理：平衡向减弱改变的方向移动',
        'ΔH < 0 放热，ΔH > 0 吸热；盖斯定律可求反应热'
      ]},
      { title: '电化学', points: [
        '原电池：负极氧化(失电子)，正极还原(得电子)',
        '电解池：阳极氧化，阴极还原（阳氧阴还）',
        '电极反应式：先判断放电物质，再配平电荷和原子',
        '盐桥作用：传导离子，维持电中性'
      ]},
      { title: '有机化学', points: [
        '官能团决定性质：-OH(醇/酚), -COOH(酸), -CHO(醛)',
        '反应类型：取代、加成、消去、氧化还原、酯化、水解',
        '同分异构体：碳链异构、位置异构、官能团异构',
        '推断题思路：从特征反应和条件反推官能团和结构'
      ]},
      { title: '水溶液中的离子', points: [
        '强酸弱碱盐水解显酸性，强碱弱酸盐水解显碱性',
        '三大守恒：电荷守恒、物料守恒、质子守恒',
        '离子浓度比较：先判断酸碱性，再排大小',
        'Ksp 是沉淀溶解平衡常数，Q>Ksp 沉淀'
      ]},
      { title: '化学反应速率', points: [
        '反应速率 v = Δc/Δt，单位 mol/(L·s) 或 mol/(L·min)',
        '影响速率的因素：浓度↑、温度↑、催化剂、接触面积↑',
        '温度每升高10°C，速率约增大2~4倍',
        '催化剂改变反应路径降低活化能，同等程度改变正逆反应速率'
      ]},
      { title: '物质结构', points: [
        '电子排布：1s→2s→2p→3s→3p→4s→3d→4p（能量递增）',
        '元素周期律：同周期从左到右金属性减弱，同主族从上到下金属性增强',
        '化学键：离子键(电子转移)、共价键(电子共用)、金属键',
        '杂化轨道：sp(直线)、sp²(平面三角)、sp³(四面体)'
      ]}
    ],
    questions: [
      // —— 化学反应原理 (3题) ——
      { q: '合成氨反应 N₂(g) + 3H₂(g) ⇌ 2NH₃(g) ΔH<0。下列哪些是达到平衡的标志？\nA. v正(N₂) = 3v逆(H₂)\nB. 容器内各组分浓度不再变化\nC. 容器内压强不再变化（恒温恒容）\nD. 混合气体密度不再变化（恒温恒容）', difficulty: 'easy', topic: '化学反应原理', answer: '答案：A、B、C\n\nA ✓ v正(N₂)/1 = v逆(H₂)/3 → 3v正(N₂) = v逆(H₂)，即v正(N₂) = v逆(H₂)/3。原题写的是 v正(N₂)=3v逆(H₂) 则不对。\n\n纠正分析：\nv正(N₂) = 3v逆(H₂) 意味着 v正(N₂)/v逆(H₂) = 3\n而平衡时 v正(N₂)/v逆(H₂) = 1/3\n所以 A ✗\n\nB ✓ 浓度不变是平衡的直接标志\nC ✓ 恒温恒容下，该反应前后气体分子数不等(1+3≠2)，压强不变说明总物质的量不变→达平衡\nD ✗ 恒温恒容密闭容器，质量守恒体积不变，密度始终不变\n\n答案：B、C', hint: '平衡标志两类：直接标志（v正=v逆）和间接标志（各量不再变化）' },
      { q: '对于 2SO₂(g)+O₂(g)⇌2SO₃(g) ΔH<0，分析：①升温 ②加压 ③增大O₂浓度 ④加催化剂 对平衡的影响', difficulty: 'medium', topic: '化学反应原理', answer: '① 升温：平衡左移（正反应放热，升温有利于吸热方向）\n② 加压：平衡右移（右边气体分子数少 3→2）\n③ 增大O₂：平衡右移\n④ 催化剂：平衡不移动（只改变速率）', hint: '勒夏特列原理：平衡向减弱改变的方向移动' },
      { q: '已知：\n① C(s) + O₂(g) → CO₂(g)  ΔH₁ = -393.5 kJ/mol\n② CO(g) + ½O₂(g) → CO₂(g)  ΔH₂ = -283.0 kJ/mol\n利用盖斯定律求 C(s) + ½O₂(g) → CO(g) 的 ΔH。', difficulty: 'hard', topic: '化学反应原理', answer: '目标反应 = ① - ②\n\nC(s) + O₂(g) → CO₂(g)         ΔH₁ = -393.5\nCO₂(g) → CO(g) + ½O₂(g)     -ΔH₂ = +283.0\n\n相加：C(s) + O₂(g) + CO₂(g) → CO₂(g) + CO(g) + ½O₂(g)\n化简：C(s) + ½O₂(g) → CO(g)\n\nΔH = ΔH₁ - ΔH₂ = -393.5 - (-283.0) = -110.5 kJ/mol', hint: '盖斯定律：目标反应 = 已知反应的代数组合' },

      // —— 电化学 (3题) ——
      { q: '写出 Zn-Cu 原电池（稀硫酸）的电极反应式和总反应式。', difficulty: 'easy', topic: '电化学', answer: '负极(Zn)：Zn - 2e⁻ → Zn²⁺（氧化）\n正极(Cu)：2H⁺ + 2e⁻ → H₂↑（还原）\n\n总反应：Zn + H₂SO₄ → ZnSO₄ + H₂↑', hint: '活泼金属做负极，发生氧化反应（失电子）' },
      { q: '用惰性电极电解 CuSO₄ 溶液，写出阴阳极反应式和总反应式。', difficulty: 'medium', topic: '电化学', answer: '阴极（还原）：Cu²⁺ + 2e⁻ → Cu\n阳极（氧化）：4OH⁻ - 4e⁻ → 2H₂O + O₂↑\n（或写为 2H₂O - 4e⁻ → O₂↑ + 4H⁺）\n\n配平（阴极×2）：\n2Cu²⁺ + 4e⁻ → 2Cu\n2H₂O - 4e⁻ → O₂↑ + 4H⁺\n\n总反应：2CuSO₄ + 2H₂O →(电解) 2Cu + O₂↑ + 2H₂SO₄\n\n现象：阴极析出红色铜，阳极产生气泡，溶液变酸。', hint: '电解时阳极阴离子放电：OH⁻ > SO₄²⁻；阴极阳离子放电：Cu²⁺ > H⁺' },
      { q: '某燃料电池以 KOH 为电解质，H₂ 为燃料，O₂ 为氧化剂。写出电极反应式。', difficulty: 'hard', topic: '电化学', answer: '负极（H₂ 氧化）：\nH₂ - 2e⁻ + 2OH⁻ → 2H₂O\n\n正极（O₂ 还原）：\nO₂ + 2H₂O + 4e⁻ → 4OH⁻\n\n（配平后负极×2）：\n2H₂ - 4e⁻ + 4OH⁻ → 4H₂O\nO₂ + 2H₂O + 4e⁻ → 4OH⁻\n\n总反应：2H₂ + O₂ → 2H₂O\n\n注意：碱性电解质中，负极产物不能有H⁺，要用OH⁻配平成H₂O。', hint: '燃料电池：燃料在负极氧化，氧化剂在正极还原，注意电解质环境' },

      // —— 有机化学 (3题) ——
      { q: '写出乙醇(CH₃CH₂OH)发生以下反应的化学方程式：\n(1) 与Na反应\n(2) 催化氧化\n(3) 与乙酸酯化', difficulty: 'easy', topic: '有机化学', answer: '(1) 与Na反应（置换）：\n2CH₃CH₂OH + 2Na → 2CH₃CH₂ONa + H₂↑\n\n(2) 催化氧化（Cu/Ag催化）：\n2CH₃CH₂OH + O₂ →(Cu/△) 2CH₃CHO + 2H₂O\n（生成乙醛）\n\n(3) 酯化反应：\nCH₃COOH + CH₃CH₂OH ⇌(浓H₂SO₄, △) CH₃COOCH₂CH₃ + H₂O\n（乙酸乙酯）', hint: '醇的-OH能与Na反应；伯醇氧化得醛；醇+酸→酯+水' },
      { q: '某有机物 C₃H₆O₂，能与 NaOH 反应，不能与 Na 反应。写出结构简式。', difficulty: 'medium', topic: '有机化学', answer: '能与NaOH反应但不与Na反应 → 无-COOH和-OH → 是酯类\n\nC₃H₆O₂ 的酯：\nHCOOCH₂CH₃（甲酸乙酯）或 CH₃COOCH₃（乙酸甲酯）', hint: '与NaOH反应但无-COOH和-OH → 酯' },
      { q: '以乙烯(CH₂=CH₂)为起始原料，设计合成乙酸乙酯(CH₃COOCH₂CH₃)的路线（其他无机试剂自选）。', difficulty: 'hard', topic: '有机化学', answer: '合成路线：\n\n步骤1：乙烯水化制乙醇\nCH₂=CH₂ + H₂O →(催化剂) CH₃CH₂OH\n\n步骤2：乙醇氧化制乙醛\n2CH₃CH₂OH + O₂ →(Cu/△) 2CH₃CHO + 2H₂O\n\n步骤3：乙醛氧化制乙酸\n2CH₃CHO + O₂ →(催化剂) 2CH₃COOH\n\n步骤4：酯化反应\nCH₃COOH + CH₃CH₂OH ⇌(浓H₂SO₄/△) CH₃COOCH₂CH₃ + H₂O\n\n总路线：乙烯 →(水化) 乙醇 →(氧化) 乙醛 →(氧化) 乙酸 →(+乙醇酯化) 乙酸乙酯', hint: '逆推法：乙酸乙酯←乙酸+乙醇，再从乙烯正向合成这两者' },

      // —— 水溶液中的离子 (3题) ——
      { q: '下列溶液一定显酸性的是：\nA. pH < 7 的溶液\nB. c(H⁺) > c(OH⁻) 的溶液\nC. 含 H⁺ 的溶液\nD. 能使石蕊变红的溶液', difficulty: 'easy', topic: '水溶液中的离子', answer: '答案：B、D\n\nA ✗ 100°C时中性pH=6，pH<7不一定酸性（温度不确定）\nB ✓ c(H⁺) > c(OH⁻) 是酸性的本质定义，与温度无关\nC ✗ 任何水溶液都含H⁺\nD ✓ 石蕊变红是酸性的实验现象', hint: '判断酸碱性的本质是 c(H⁺) 与 c(OH⁻) 的大小关系' },
      { q: '0.1mol/L Na₂CO₃ 溶液中，比较 Na⁺、CO₃²⁻、HCO₃⁻、OH⁻、H⁺ 的浓度大小。', difficulty: 'medium', topic: '水溶液中的离子', answer: 'Na₂CO₃ 是强碱弱酸盐，CO₃²⁻ 水解显碱性。\n\n浓度排序：\nc(Na⁺) > c(CO₃²⁻) > c(OH⁻) > c(HCO₃⁻) > c(H⁺)\n\nNa⁺不水解最大；CO₃²⁻部分水解；OH⁻来自水解；碱性中H⁺最小。', hint: '强碱弱酸盐→显碱性→c(OH⁻)>c(H⁺)' },
      { q: '25°C时，0.1mol/L CH₃COOH 溶液和 0.1mol/L NaOH 溶液等体积混合。\n(1) 混合液显什么性？\n(2) 写出离子浓度大小关系。\n(3) 写出电荷守恒式。', difficulty: 'hard', topic: '水溶液中的离子', answer: '等体积等浓度混合→恰好完全反应→生成 CH₃COONa\n\n(1) CH₃COONa 是强碱弱酸盐，水解显碱性。\n\n(2) 离子浓度排序：\nc(Na⁺) > c(CH₃COO⁻) > c(OH⁻) > c(H⁺)\n\n解释：Na⁺不水解最大；CH₃COO⁻部分水解而减小；OH⁻来自水解；H⁺在碱性溶液中最小。\n\n(3) 电荷守恒：\nc(Na⁺) + c(H⁺) = c(CH₃COO⁻) + c(OH⁻)', hint: '恰好中和≠中性，生成盐的水解决定了溶液的酸碱性' },

      // —— 化学反应速率 (3题) ——
      { q: '在 2A(g) + B(g) → 3C(g) 反应中，2s内A的浓度从 1.0mol/L 降到 0.6mol/L。求：(1) v(A) (2) v(B) (3) v(C)', difficulty: 'easy', topic: '化学反应速率', answer: '(1) v(A) = Δc/Δt = (1.0-0.6)/2 = 0.2 mol/(L·s)\n\n(2) 各物质速率之比 = 化学计量数之比：\nv(A):v(B):v(C) = 2:1:3\n\nv(B) = v(A)/2 = 0.1 mol/(L·s)\n\n(3) v(C) = 3v(A)/2 = 0.3 mol/(L·s)', hint: '不同物质表示的速率之比等于化学计量数之比' },
      { q: '对于反应 N₂ + 3H₂ ⇌ 2NH₃，在恒温恒容条件下，下列操作对反应速率有何影响？\n(1) 充入 N₂\n(2) 充入 Ar（不参与反应的惰性气体）\n(3) 升高温度', difficulty: 'medium', topic: '化学反应速率', answer: '(1) 充入N₂：\n恒容→c(N₂)增大→正反应速率增大→平衡右移\n\n(2) 充入Ar（恒容）：\n各反应物浓度不变→反应速率不变→平衡不移动\n（恒容充惰气不影响浓度）\n\n(3) 升高温度：\n正反应和逆反应速率都增大\n但正反应放热→逆反应速率增大幅度更大→平衡左移\n（活化能角度：吸热方向活化能更大，升温对其影响更显著）', hint: '恒容充惰气不改变反应物浓度，不影响反应速率' },
      { q: '某反应 A → B，在不同条件下的实验数据：\n① 25°C, c(A)=0.1mol/L, v=2×10⁻³mol/(L·min)\n② 25°C, c(A)=0.2mol/L, v=4×10⁻³mol/(L·min)\n③ 35°C, c(A)=0.1mol/L, v=6×10⁻³mol/(L·min)\n求：(1) 反应级数；(2) 温度系数γ（温度每升高10°C速率增大的倍数）', difficulty: 'hard', topic: '化学反应速率', answer: '(1) 比较①②（温度相同）：\nc(A) 翻倍(0.1→0.2)，v 翻倍(2→4)\nv ∝ c(A)¹ → 一级反应\n\n速率方程：v = k·c(A)\n\nk(25°C) = v/c(A) = 2×10⁻³/0.1 = 0.02 min⁻¹\n\n(2) 比较①③（浓度相同，温度不同）：\nv₃/v₁ = 6×10⁻³/2×10⁻³ = 3\n\nγ = 3（即温度每升高10°C，速率增大为原来的3倍）\n\n在2~4的范围内，符合经验规律。', hint: '控制变量法：固定温度看浓度影响，固定浓度看温度影响' },

      // —— 物质结构 (3题) ——
      { q: '写出下列微粒的电子排布式：\n(1) Na原子\n(2) Fe原子\n(3) Cl⁻ 离子', difficulty: 'easy', topic: '物质结构', answer: '(1) Na (Z=11)：\n1s² 2s² 2p⁶ 3s¹\n或 [Ne]3s¹\n\n(2) Fe (Z=26)：\n1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²\n或 [Ar]3d⁶4s²\n\n(3) Cl⁻ (Z=17+1=18个电子)：\n1s² 2s² 2p⁶ 3s² 3p⁶\n或 [Ar]（与Ar等电子）', hint: '电子排布按能级顺序填充：1s→2s→2p→3s→3p→4s→3d' },
      { q: '判断下列分子的杂化类型和空间构型：\n(1) CH₄\n(2) BF₃\n(3) CO₂\n(4) H₂O', difficulty: 'medium', topic: '物质结构', answer: '(1) CH₄：\nC有4个σ键，0对孤对电子 → sp³杂化\n空间构型：正四面体，键角109°28\'\n\n(2) BF₃：\nB有3个σ键，0对孤对电子 → sp²杂化\n空间构型：平面三角形，键角120°\n\n(3) CO₂：\nC有2个σ键（2个双键），0对孤对电子 → sp杂化\n空间构型：直线型，键角180°\n\n(4) H₂O：\nO有2个σ键，2对孤对电子 → sp³杂化\n空间构型：V形（角形），键角约104.5°\n（孤对电子排斥力大于成键电子对）', hint: '杂化类型由σ键数+孤对电子对数决定：2→sp, 3→sp², 4→sp³' },
      { q: '已知A、B、C、D是原子序数依次增大的前四周期元素。A是原子半径最小的元素；B最外层电子数是内层的2倍；C的气态氢化物水溶液显碱性；D的原子序数是26。回答：\n(1) A、B、C、D分别是什么元素？\n(2) B、C的第一电离能谁大？为什么？', difficulty: 'ultra', topic: '物质结构', answer: '(1) 推断：\nA = H（原子半径最小）\nB = C（碳，最外层4个电子 = 内层2个×2）\nC = N（氮，气态氢化物NH₃水溶液显碱性）\nD = Fe（原子序数26）\n\n(2) 第一电离能：N > C\n\n原因：\n① 同周期元素从左到右，核电荷数增大，原子半径减小，第一电离能总体增大\n② N的2p轨道半充满(2p³)，电子排布特别稳定，第一电离能比O还高（反常）\n③ C的2p²没有这种稳定性\n\n∴ I₁(N) > I₁(C)', hint: 'N的2p³半充满是重要的电离能反常现象' }
    ]
  },

  // ==================== 生物 ====================
  biology: {
    phase: '一轮复习 · 回归教材',
    keyTopics: [
      { title: '细胞与分子', points: [
        '细胞膜：流动镶嵌模型，磷脂双分子层为基本骨架',
        '线粒体(有氧呼吸)、叶绿体(光合)、核糖体(蛋白质合成)',
        'DNA双螺旋：A-T、G-C 配对，反向平行',
        '中心法则：DNA→(转录)→mRNA→(翻译)→蛋白质'
      ]},
      { title: '细胞代谢', points: [
        '光合作用：6CO₂+12H₂O → C₆H₁₂O₆+6O₂+6H₂O',
        '光反应在类囊体薄膜，暗反应在叶绿体基质',
        '有氧呼吸：糖酵解→柠檬酸循环→电子传递链',
        '净光合 = 总光合 - 呼吸'
      ]},
      { title: '遗传与进化', points: [
        '分离定律：Aa×Aa → 1AA:2Aa:1aa（3:1）',
        '自由组合：AaBb×AaBb → 9:3:3:1',
        '伴性遗传：红绿色盲X染色体隐性，男多于女',
        '基因频率改变是进化的实质，自然选择决定方向'
      ]},
      { title: '稳态与调节', points: [
        '反射是神经调节基本方式，反射弧是结构基础',
        '兴奋在神经纤维上以电信号传导，突触以化学信号传递',
        '血糖调节：胰岛素(降)和胰高血糖素(升)的拮抗',
        '免疫：非特异性 + 特异性（体液免疫+细胞免疫）'
      ]},
      { title: '生态学', points: [
        '种群特征：种群密度、出生率/死亡率、年龄组成、性别比例',
        '群落结构：垂直结构（分层）和水平结构（镶嵌）',
        '生态系统功能：能量流动（单向递减）和物质循环',
        '食物链/网：营养级越高能量越少，富集越多'
      ]},
      { title: '生物技术与实验', points: [
        'PCR技术：变性(95°C)→退火(55°C)→延伸(72°C)循环扩增',
        '凝胶电泳：DNA带负电向阳极移动，小片段跑得远',
        '显微镜使用：先低倍后高倍，高倍镜不能调粗准焦螺旋',
        '实验设计原则：对照原则、单一变量原则、等量原则'
      ]}
    ],
    questions: [
      // —— 细胞与分子 (3题) ——
      { q: '关于细胞器，正确的是：\nA. 线粒体和叶绿体都能进行DNA复制\nB. 高尔基体只参与蛋白质加工\nC. 核糖体只存在于粗面内质网上\nD. 中心体存在于所有真核细胞中', difficulty: 'easy', topic: '细胞与分子', answer: '答案：A\n\nA ✓ 半自主细胞器，含自己的DNA\nB ✗ 还参与多糖合成等\nC ✗ 还有游离核糖体\nD ✗ 高等植物细胞无中心体', hint: '半自主细胞器（线粒体、叶绿体）含有自己的DNA' },
      { q: '关于 DNA 复制的描述，正确的是：\nA. DNA复制是半保留复制\nB. DNA聚合酶能从头合成新链\nC. 两条母链都作为模板\nD. 复制方向是3\'→5\'', difficulty: 'medium', topic: '细胞与分子', answer: '答案：A、C\n\nA ✓ 每个子代DNA含一条母链和一条新链\nB ✗ DNA聚合酶需要引物，不能从头合成\nC ✓ 两条母链分别作为模板\nD ✗ 新链合成方向是5\'→3\'（沿模板链3\'→5\'方向读取）\n\n注意：DNA复制需要解旋酶、DNA聚合酶、引物等条件。', hint: 'DNA新链合成方向始终是5\'→3\'，需要RNA引物' },
      { q: '某DNA分子片段含1000个碱基对，其中G-C碱基对占40%。该片段复制2次，求：(1) 需要多少个游离的腺嘌呤脱氧核苷酸？(2) 复制后共有多少个DNA分子？', difficulty: 'hard', topic: '细胞与分子', answer: '(1) G-C占40% → A-T占60%\nA-T碱基对 = 1000×60% = 600对\n即A有600个（一条链），T有600个\n\n由于双链中 A=T，所以A总数 = 600\n\n复制2次 → 共产生4个DNA分子 → 净增3个DNA分子\n需要游离的A脱氧核苷酸 = 600×3 = 1800个\n\n(2) 复制2次后共有 2² = 4个DNA分子', hint: '复制n次净增(2ⁿ-1)个DNA分子，需要的原料 = 原含量 × (2ⁿ-1)' },

      // —— 细胞代谢 (3题) ——
      { q: '下列关于光合作用的叙述，正确的是：\nA. 光反应在叶绿体基质中进行\nB. 暗反应不需要光照\nC. O₂来源于H₂O的光解\nD. CO₂的固定需要ATP', difficulty: 'easy', topic: '细胞代谢', answer: '答案：C\n\nA ✗ 光反应在类囊体薄膜上进行\nB ✗ 暗反应虽不直接需光，但需要光反应提供的ATP和NADPH，长时间无光则停止\nC ✓ 光反应中水光解产生O₂\nD ✗ CO₂固定（CO₂+C₅→2C₃）不需要ATP，C₃的还原才需要ATP', hint: '光合作用中O₂来源于水的光解，不是来源于CO₂' },
      { q: '密闭容器中植物在适宜温度下光照增强。分析：(1) 光补偿点含义 (2) 超光饱和点后光合速率不再增大的原因', difficulty: 'medium', topic: '细胞代谢', answer: '(1) 光补偿点：光合速率=呼吸速率时的光照强度，净光合为零\n\n(2) 超过光饱和点的限制因素：\n① CO₂浓度有限，暗反应跟不上\n② 酶的数量和活性有限\n③ C₅再生速度受限', hint: '光饱和点的限制因素在暗反应而非光反应' },
      { q: '某植物在25°C条件下测得：光照下CO₂吸收速率为 8mg/h（净光合），黑暗中CO₂释放速率为 4mg/h（呼吸）。求：(1) 总光合速率；(2) 若每天光照14小时、黑暗10小时，该植物一天净积累有机物多少（以CO₂计）？', difficulty: 'hard', topic: '细胞代谢', answer: '(1) 总光合速率 = 净光合速率 + 呼吸速率\n= 8 + 4 = 12 mg/h\n\n(2) 一天净积累：\n光照14h净吸收CO₂ = 8×14 = 112 mg\n黑暗10h释放CO₂ = 4×10 = 40 mg\n\n净积累 = 112 - 40 = 72 mg CO₂\n\n换算为葡萄糖（如需要）：\n72 × (180/44×6) ≈ 72 × 0.682 ≈ 49.1 mg 葡萄糖', hint: '净光合 = 总光合 - 呼吸；一天积累 = 光照净吸收 - 黑暗释放' },

      // —— 遗传与进化 (3题) ——
      { q: '正常夫妇生了白化病(常隐)孩子。问：(1) 夫妇基因型 (2) 再生一个患病概率 (3) 再生一个正常男孩概率', difficulty: 'easy', topic: '遗传与进化', answer: '(1) 正常父母生出患病孩子(aa) → 夫妇都是Aa\n\n(2) Aa×Aa → 患病(aa)概率 = 1/4\n\n(3) 正常男孩 = 3/4 × 1/2 = 3/8', hint: '正常父母生患病孩子 → 父母都是杂合子(Aa)' },
      { q: '基因型为 AaBb（两对基因独立遗传）的个体自交，求：(1) 后代中纯合子的比例；(2) 后代与亲本基因型相同的比例；(3) 后代中表现型与亲本不同的比例（假设均为完全显性）。', difficulty: 'medium', topic: '遗传与进化', answer: 'AaBb 自交 → 分别看两对：\nAa×Aa → AA:Aa:aa = 1:2:1\nBb×Bb → BB:Bb:bb = 1:2:1\n\n(1) 纯合子 = AA或aa × BB或bb\n= (1/4+1/4) × (1/4+1/4)\n= 1/2 × 1/2 = 1/4\n\n(2) 与亲本AaBb相同：\nP(Aa) × P(Bb) = 1/2 × 1/2 = 1/4\n\n(3) 亲本表现型：A_B_（双显）\nP(A_B_) = 3/4 × 3/4 = 9/16\n与亲本不同 = 1 - 9/16 = 7/16', hint: '独立遗传→两对分别计算再相乘（乘法原理）' },
      { q: '某人群中红绿色盲（X连锁隐性遗传）的男性发病率为7%。求：(1) 该人群中色盲基因频率；(2) 女性发病率；(3) 女性携带者的比例。', difficulty: 'hard', topic: '遗传与进化', answer: '设色盲基因为 b，正常基因为 B。\n\n(1) 男性只有一条X染色体：\n男性发病率 = XᵇY 的频率 = q(b基因频率)\n∴ q = 0.07 = 7%\np = 1 - 0.07 = 0.93\n\n(2) 女性发病率 = XᵇXᵇ = q²\n= 0.07² = 0.0049 = 0.49%\n\n(3) 女性携带者 XᴮXᵇ = 2pq\n= 2 × 0.93 × 0.07 = 0.1302 = 13.02%\n\n注意：X连锁遗传中，男性发病率 = 基因频率；女性发病率 = 基因频率的平方。', hint: 'X连锁隐性遗传：男性发病率=基因频率q，女性发病率=q²' },

      // —— 稳态与调节 (3题) ——
      { q: '下列关于神经调节和体液调节的比较，正确的是：\nA. 神经调节作用范围更广\nB. 体液调节反应速度更快\nC. 神经调节作用时间更短暂\nD. 体液调节只作用于内分泌腺', difficulty: 'easy', topic: '稳态与调节', answer: '答案：C\n\nA ✗ 神经调节通过反射弧精确到特定效应器，范围较窄\nB ✗ 神经调节通过电信号传导，速度更快\nC ✓ 神经调节作用时间短暂（毫秒级），体液调节持续时间长\nD ✗ 激素可作用于全身靶细胞，不仅限于内分泌腺', hint: '神经调节：快速、精确、短暂；体液调节：缓慢、广泛、持久' },
      { q: '简述兴奋在突触处的传递过程，并解释为何只能单向传递。', difficulty: 'medium', topic: '稳态与调节', answer: '过程：\n① 兴奋到达突触前膜→释放神经递质\n② 递质经突触间隙扩散\n③ 与突触后膜受体结合\n④ 引起后膜电位变化\n\n单向原因：递质只能由前膜释放，作用于后膜，后膜不能释放递质。', hint: '突触结构决定了信号传递的方向性' },
      { q: '某人空腹血糖浓度为 5.6mmol/L（正常）。饭后1小时血糖升至 10mmol/L，2小时后回到 6mmol/L。分析：(1) 饭后血糖升高的原因及调节机制；(2) 血糖回降的调节过程。', difficulty: 'hard', topic: '稳态与调节', answer: '(1) 饭后血糖升高：\n原因：食物消化吸收→血糖浓度升高\n调节：血糖升高→刺激胰岛B细胞→分泌胰岛素\n胰岛素作用：\n① 促进组织细胞摄取葡萄糖\n② 促进葡萄糖合成糖原（肝、肌肉）\n③ 促进葡萄糖转化为脂肪\n④ 抑制肝糖原分解和糖异生\n\n(2) 血糖回降过程：\n胰岛素分泌增加→血糖利用加快→血糖浓度下降\n当血糖接近正常水平时→胰岛素分泌减少→形成负反馈\n\n同时：血糖降低时胰高血糖素分泌增加→促进肝糖原分解→维持血糖稳定\n\n整个调节过程体现了激素之间的拮抗作用和负反馈调节机制。', hint: '血糖调节是典型的负反馈调节，胰岛素和胰高血糖素相互拮抗' },

      // —— 生态学 (3题) ——
      { q: '植物固定太阳能10000kJ，按10%-20%传递效率：(1) 初级消费者最多获得多少？(2) 三级消费者最少获得多少？', difficulty: 'easy', topic: '生态学', answer: '(1) 最多按20%：10000×20% = 2000kJ\n\n(2) 最少按10%逐级：\n10000×10%×10%×10% = 10kJ', hint: '最多→最高效率(20%)，最少→最低效率(10%)逐级' },
      { q: '某湖泊中藻类大量繁殖导致水体富营养化。分析：(1) 富营养化的原因；(2) 藻类大量繁殖对其他水生生物的影响；(3) 提出两条治理建议。', difficulty: 'medium', topic: '生态学', answer: '(1) 富营养化原因：\n① 生活污水、农业废水排入→N、P等营养物质过多\n② 藻类利用丰富的N、P大量繁殖\n\n(2) 对其他生物的影响：\n① 藻类覆盖水面→水下光照不足→沉水植物死亡\n② 藻类死亡后→微生物分解消耗大量O₂→水体缺氧→鱼类等水生动物死亡\n③ 某些藻类产生毒素→直接毒害水生生物\n④ 生物多样性下降→生态系统稳定性降低\n\n(3) 治理建议：\n① 截污控源：禁止工业废水和生活污水直接排入\n② 生态修复：种植水生植物（如芦苇）吸收多余营养物质，投放滤食性鱼类控制藻类', hint: '富营养化：N、P过多→藻类暴发→缺氧→生物死亡（链式反应）' },
      { q: '一个生态系统中存在以下食物网：\n草 → 兔 → 狐\n草 → 鼠 → 狐\n草 → 鼠 → 蛇 → 鹰\n狐 → 鹰\n若蛇被大量捕杀，分析短期内狐和鹰的种群数量变化。', difficulty: 'hard', topic: '生态学', answer: '蛇被大量捕杀→蛇数量减少\n\n对狐的影响：\n狐与蛇竞争鼠这一食物资源→蛇减少→狐获得更多鼠→狐数量增加\n\n对鹰的影响：\n① 蛇减少→鹰失去一个食物来源（蛇）→不利\n② 但狐增加→鹰获得更多狐→有利\n③ 鹰还可直接捕食狐和鼠\n\n短期内综合效果：\n鹰的变化需看蛇和狐哪个是鹰的主要食物。\n一般而言：蛇减少的直接负面影响和狐增加的补偿作用会相互抵消，鹰数量可能基本稳定或略有下降。\n\n关键分析方法：\n① 明确营养关系（捕食和竞争）\n② 分析直接效应和间接效应\n③ 注意"短期"和"长期"的区别', hint: '食物网分析要理清所有营养关系，综合考虑直接和间接效应' },

      // —— 生物技术与实验 (3题) ——
      { q: '下列关于实验操作的叙述，正确的是：\nA. 用斐林试剂检测蛋白质\nB. 观察细胞有丝分裂用甲基绿染色\nC. 提取叶绿体色素用无水乙醇\nD. 鉴定脂肪用碘液', difficulty: 'easy', topic: '生物技术与实验', answer: '答案：C\n\nA ✗ 斐林试剂检测还原糖，蛋白质用双缩脲试剂\nB ✗ 有丝分裂用龙胆紫或醋酸洋红染色（染染色体），甲基绿染DNA\nC ✓ 叶绿体色素溶于有机溶剂，用无水乙醇提取\nD ✗ 脂肪用苏丹III或苏丹IV染液，碘液检测淀粉', hint: '生物实验试剂要对应：斐林→还原糖，双缩脲→蛋白质，苏丹→脂肪' },
      { q: '在"探究培养液中酵母菌种群数量变化"实验中：(1) 采用什么方法计数？(2) 取样前为什么要振荡？(3) 预期种群数量变化趋势。', difficulty: 'medium', topic: '生物技术与实验', answer: '(1) 计数方法：抽样检测法（血细胞计数板计数）\n具体操作：取少量培养液→滴入计数室→显微镜下计数→换算\n\n(2) 振荡原因：\n酵母菌可能沉降到培养液底部，不振荡会导致取样不均匀，计数结果偏小或偏大。\n振荡使酵母菌分布均匀，保证取样的随机性。\n\n(3) 种群数量变化趋势：\n① 初期：适应环境，增长缓慢（延滞期）\n② 中期：营养充足，快速增长（指数增长期/对数期）\n③ 后期：营养消耗、代谢废物积累→增长减缓→达K值\n④ 末期：营养耗尽→种群数量下降\n\n整体呈"S"型增长曲线后下降。', hint: '酵母菌在有限资源环境中呈S型增长，后期因营养耗尽而下降' },
      { q: '设计实验验证"生长素(IAA)促进植物生长具有两重性（低浓度促进、高浓度抑制）"。\n要求：写出实验材料、步骤、预期结果和结论。', difficulty: 'ultra', topic: '生物技术与实验', answer: '实验材料：胚芽鞘若干（生长状态一致）、不同浓度IAA溶液（10⁻¹⁰、10⁻⁸、10⁻⁶、10⁻⁴、10⁻² mol/L）、蒸馏水、培养皿、尺子\n\n实验步骤：\n① 取等量胚芽鞘分成6组（5个浓度+1个对照）\n② 对照组用蒸馏水处理\n③ 实验组分别用不同浓度IAA处理（浸泡胚芽鞘尖端以下部位）\n④ 相同且适宜条件下培养相同时间\n⑤ 测量各组胚芽鞘长度，计算增长率\n\n预期结果：\n① 10⁻¹⁰~10⁻⁶ mol/L 组：胚芽鞘长度 > 对照组（促进生长）\n② 10⁻⁴~10⁻² mol/L 组：胚芽鞘长度 < 对照组（抑制生长）\n③ 存在一个最适浓度，促进效果最大\n\n结论：\n低浓度IAA促进胚芽鞘生长，高浓度IAA抑制生长，说明生长素的作用具有两重性。\n\n注意实验设计三原则：\n① 对照原则（蒸馏水对照组）\n② 单一变量原则（IAA浓度是唯一变量）\n③ 等量原则（等量胚芽鞘、等量溶液、相同时间）', hint: '验证两重性需要设置多个浓度梯度，与对照组比较促进或抑制' }
    ]
  },

  // ==================== 语文 ====================
  chinese: {
    phase: '日积月累 · 文言文+写作双线突破',
    keyTopics: [
      { title: '文言文', points: [
        '词类活用：名词作动词（鼓→击鼓），形容词作动词（善→擅长）',
        '特殊句式：判断句(…者…也)、被动句(为…所)、宾语前置(何…之有)',
        '重点虚词：之(代词/助词/动词)、其(代词/语气)、而(并列/转折/因果)',
        '翻译原则：直译为主，字字落实，补出省略成分'
      ]},
      { title: '古诗鉴赏', points: [
        '意象分析：月(思乡)、柳(离别)、菊(高洁)、梅(坚韧)',
        '常见手法：借景抒情、托物言志、虚实结合、对比衬托',
        '语言风格：清新自然、豪放飘逸、沉郁顿挫、含蓄委婉',
        '答题模板：本诗用了XX手法，描写了XX，表达了XX情感'
      ]},
      { title: '现代文阅读', points: [
        '散文阅读：抓"形散神聚"，理清线索，品味语言',
        '小说阅读：人物形象、情节结构、环境描写、主题探究',
        '论述类文本：论点、论据、论证方法，逻辑推理',
        '答题技巧：分点作答，先概括后分析，结合原文'
      ]},
      { title: '写作技巧', points: [
        '开头技巧：引用名言/设问引入/现象描述（不超过80字）',
        '论证方法：举例、道理、对比、比喻、因果论证',
        '结构模式：并列式(三分论点)、递进式(层层深入)、对照式(正反)',
        '结尾升华：回扣主题+展望/呼吁，避免空喊口号'
      ]},
      { title: '语言文字运用', points: [
        '病句类型：语序不当、搭配不当、成分残缺、结构混乱、表意不明',
        '成语使用：注意褒贬色彩、适用对象、语境搭配',
        '语言表达连贯：注意逻辑顺序、过渡衔接、前后照应',
        '仿写句式：保持句式一致、修辞相同、内容相关'
      ]},
      { title: '名篇名句', points: [
        '《劝学》：积土成山，风雨兴焉；积水成渊，蛟龙生焉',
        '《师说》：师者，所以传道受业解惑也',
        '《赤壁赋》：寄蜉蝣于天地，渺沧海之一粟',
        '《登高》：无边落木萧萧下，不尽长江滚滚来'
      ]}
    ],
    questions: [
      // —— 文言文 (3题) ——
      { q: '翻译：\n"蚓无爪牙之利，筋骨之强，上食埃土，下饮黄泉，用心一也。"（《劝学》）', difficulty: 'easy', topic: '文言文', answer: '蚯蚓没有锋利的爪牙，强健的筋骨，却能向上吃到泥土，向下喝到地下水，这是因为用心专一。\n\n得分点：\n① 爪牙之利→定语后置\n② 上/下→名词作状语\n③ 用心一也→判断句', hint: '注意定语后置和名词作状语' },
      { q: '翻译并分析句式特点：\n"句读之不知，惑之不解，或师焉，或不焉。"（《师说》）', difficulty: 'medium', topic: '文言文', answer: '翻译：不理解句读，不解决疑惑，有的向老师学习，有的却不向老师学习。\n\n句式特点：\n① "句读之不知，惑之不解" → 宾语前置\n   "之"是宾语前置标志，正常语序：不知句读，不解惑\n② "或师焉，或不焉" → 省略句\n   完整为：或师焉，或不(师)焉\n③ 整句形成对比：该学的反而不学，不该纠结的却纠结\n\n韩愈借此讽刺当时士大夫耻于从师的风气。', hint: '"之"作宾语前置标志是文言文高频考点' },
      { q: '阅读短文回答问题：\n"管仲夷吾者，颍上人也。少时常与鲍叔牙游，鲍叔知其贤。管仲贫困，常欺鲍叔，鲍叔终善遇之，不以为言。已而鲍叔事齐公子小白，管仲事公子纠。及小白立为桓公，公子纠死，管仲囚焉。鲍叔遂进管仲。"\n(1) "不以为言"的意思？(2) "进"是什么意思？(3) 概括鲍叔牙的品质。', difficulty: 'hard', topic: '文言文', answer: '(1) "不以为言" = 不把这些（管仲占便宜的事）说出口/不因此有怨言\n   "以"：因为；"为言"：说出来/抱怨\n\n(2) "进" = 推荐、举荐\n   "鲍叔遂进管仲" = 鲍叔于是向齐桓公推荐了管仲\n\n(3) 鲍叔牙的品质：\n① 知人善任："鲍叔知其贤"——识人之明\n② 宽容大度："终善遇之，不以为言"——不计较\n③ 忠义荐贤："鲍叔遂进管仲"——主动让贤\n④ 深明大义：管仲曾为敌方效力，鲍叔仍荐之——以国事为重\n\n这段文字出自《史记·管晏列传》，是"管鲍之交"的典故来源。', hint: '文言文阅读要逐字翻译，注意一词多义和省略成分' },

      // —— 古诗鉴赏 (3题) ——
      { q: '赏析王维《鹿柴》：\n空山不见人，但闻人语响。\n返景入深林，复照青苔上。\n(1) 前两句用了什么手法？(2) 全诗表达了怎样的意境？', difficulty: 'easy', topic: '古诗鉴赏', answer: '(1) 手法：以动衬静（反衬）\n"不见人"写视觉之静，"闻人语响"写听觉之动\n用人声反衬山林的空旷寂静，动中见静，更显幽静\n\n(2) 意境：\n全诗营造了一种空灵幽静的意境：\n① 空山无人→寂静\n② 偶闻人声→以声衬静\n③ 夕阳返照→光影斑驳\n④ 青苔上→幽深冷寂\n\n表达了诗人隐居山林、超脱尘世的闲适心境。', hint: '王维的诗"诗中有画"，注意光影、声静的对比' },
      { q: '赏析李白《春夜洛城闻笛》：\n谁家玉笛暗飞声，散入春风满洛城。\n此夜曲中闻折柳，何人不起故园情。\n(1)"折柳"含义 (2)情感和手法', difficulty: 'medium', topic: '古诗鉴赏', answer: '(1) "折柳"指《折杨柳》曲，柳谐音留，表达惜别。\n\n(2) 情感：思乡之情\n手法：借景抒情（借笛声抒思乡情）\n① 前两句渲染氛围\n② 后两句直抒胸臆\n③ "何人不起"反问加强情感', hint: '"折柳"的文化意象和反问句效果' },
      { q: '比较阅读：\n杜甫《登高》：无边落木萧萧下，不尽长江滚滚来。\n李白《将进酒》：君不见黄河之水天上来，奔流到海不复回。\n分析两位诗人写"水"的不同情感和手法。', difficulty: 'hard', topic: '古诗鉴赏', answer: '杜甫写"水"：\n① "不尽长江滚滚来"——长江之水无穷无尽\n② 情感：悲秋伤时，感慨人生短暂、壮志未酬\n③ 手法：以壮阔之景写悲凉之情（以乐景写哀情），对仗工整\n④ "萧萧""滚滚"叠词增强气势和悲壮感\n\n李白写"水"：\n① "黄河之水天上来"——极言黄河气势磅礴\n② 情感：感叹时光流逝、人生苦短，抒发豪放不羁\n③ 手法：夸张（天上来）、比喻，气势恢宏\n④ "不复回"强调一去不返，引发及时行乐之情\n\n对比：\n同为写水，杜甫沉郁顿挫、借景抒悲；李白豪放飘逸、以水喻时。\n两者都借自然之永恒对比人生之短暂，但表达方式截然不同。', hint: '比较鉴赏要从手法、情感、语言风格三个维度展开' },

      // —— 现代文阅读 (3题) ——
      { q: '阅读下面文段，概括作者的主要观点（不超过30字）：\n"数字化阅读虽然方便快捷，但研究表明，人们在屏幕上的阅读往往是碎片化的、跳跃式的。相比之下，纸质阅读更容易让人沉浸其中，进行深度思考和系统性理解。"', difficulty: 'easy', topic: '现代文阅读', answer: '主要观点：纸质阅读比数字化阅读更有利于深度思考和系统理解。\n\n概括技巧：\n① 抓住转折词"但"后的内容（重点在后半段）\n② 对比结构：数字化（碎片化）vs 纸质（深度沉浸）\n③ 提炼关键词：纸质阅读、深度思考、系统理解', hint: '转折复句的重点在"但是"之后' },
      { q: '分析文段表达技巧和作用：\n"风从湖面吹来，芦苇随风摇曳。远山在暮色中模糊，像褪色的水墨画。他坐在长椅上，一动不动，仿佛成了暮色的一部分。"', difficulty: 'medium', topic: '现代文阅读', answer: '技巧：\n① 景物描写渲染暮色氛围\n② 比喻：山如褪色的水墨画\n③ 动静结合：风来摇曳 vs 一动不动\n④ 借景抒情：暮色暗示孤独心境\n\n作用：\n① 渲染宁静略带忧伤的氛围\n② 烘托人物沉思心境\n③ 引发读者对人物内心的想象', hint: '从手法识别+效果分析+情感三个层面展开' },
      { q: '小说结尾常见类型分析：\n(1) 欧·亨利式结尾（出人意料又在情理之中）\n(2) 开放式结尾（留白引发思考）\n(3) 悲剧式结尾（震撼人心）\n请分析鲁迅《祝福》的结尾属于哪种类型，并说明其艺术效果。', difficulty: 'hard', topic: '现代文阅读', answer: '《祝福》结尾分析：\n\n类型：悲剧式结尾 + 反讽式结尾\n\n小说结尾，祥林嫂在祝福的鞭炮声中寂然死去，而鲁镇的人们仍在忙着"祝福"。\n\n艺术效果：\n① 强烈对比：祥林嫂的悲惨死亡 vs 鲁镇的祝福热闹\n② 深化主题：封建礼教和迷信对底层妇女的残酷迫害\n③ 反讽效果："祝福"本应祈求幸福，而最需要祝福的人却惨死\n④ 以乐衬悲：用热闹的年节气氛反衬祥林嫂的死寂\n⑤ 引发思考：揭示冷漠的社会现实，批判麻木的看客心理\n\n结尾的巧妙之处在于将个人悲剧与社会环境紧密结合，使小说的批判力度达到顶峰。', hint: '分析小说结尾要从结构、主题、情感三个角度入手' },

      // —— 写作技巧 (3题) ——
      { q: '以"坚持"为话题，拟写三个分论点。', difficulty: 'easy', topic: '写作技巧', answer: '递进式：\n① 坚持是面对困难不放弃的勇气（是什么）\n② 坚持能将量变转化为质变（为什么）\n③ 坚持需正确方向，否则变固执（辩证看）\n\n并列式：\n① 坚持需要信念（司马迁著《史记》）\n② 坚持需要行动（爱迪生千次实验）\n③ 坚持需要智慧（鲁迅弃医从文）', hint: '好的分论点要角度不同、层次分明' },
      { q: '以下是一段议论文的开头，请指出其不足并修改：\n"坚持是一种很好的品质。很多人都知道坚持很重要。比如马云就很坚持，他创办阿里巴巴的时候遇到了很多困难，但是他没有放弃。所以我们要坚持。"', difficulty: 'medium', topic: '写作技巧', answer: '不足之处：\n① 开头平淡，缺乏吸引力（"很好的品质"太空泛）\n② 语言口语化（"很多人""很多困难"）\n③ 论证简单化，缺乏深度\n④ 论据陈旧（马云例子太常见）\n⑤ 结尾直接"所以要坚持"，缺乏升华\n\n修改版：\n"古往今来，凡成大事者，无不具备坚韧不拔之志。司马迁忍辱负重十九载著成《史记》，曹雪芹批阅十载增删五次写就《红楼梦》。他们用生命诠释了一个真理：坚持，是通往卓越的必经之路。然而，在浮躁的当下，我们是否真正理解了坚持的含义？"\n\n修改要点：\n① 引用概括式开头，气势更足\n② 举例更文学化、多样化\n③ 设问引发思考\n④ 语言更书面化', hint: '议论文开头三忌：平淡、口语化、直接说教' },
      { q: '阅读以下材料，完成审题立意练习：\n"有人问三个石匠在做什么。第一个说：我在砌墙。第二个说：我在建一座大楼。第三个说：我在建造一座美丽的城市。"\n要求：(1) 提炼核心主题；(2) 写出两个不同角度的立意；(3) 选择其一拟写标题和提纲。', difficulty: 'hard', topic: '写作技巧', answer: '(1) 核心主题：格局与视野决定人生的高度\n\n(2) 两个立意角度：\n角度一：格局决定成就\n① 同样的工作，不同的认知高度\n② 大格局让人看到意义和价值，从而更有动力\n③ 培养宏观视野，不拘泥于眼前\n\n角度二：脚踏实地与仰望星空的统一\n① 三个石匠缺一不可：执行者+管理者+规划者\n② 既要有远大理想，也要脚踏实地做好每一步\n③ 理想主义与务实精神的辩证统一\n\n(3) 选择角度一的提纲：\n标题：《格局之上，方见天地》\n\n引论：用石匠故事引入→提出"格局决定高度"\n\n本论（递进式）：\n① 格局是一种认知能力（看见整体而非碎片）\n   例：任正非创立华为时的长远规划\n② 格局是一种价值追求（超越个人利益）\n   例：袁隆平"让天下人吃饱"的格局\n③ 格局需要实践磨砺来提升\n   例：从"砌墙"到"建城"需要不断学习和反思\n\n结论：提升格局，在平凡工作中看见不平凡的意义', hint: '材料作文审题三步：理解材料→提炼主题→多角度立意' },

      // —— 语言文字运用 (3题) ——
      { q: '默写填空：\n(1) 故不积跬步，______；不积小流，______。\n(2) ______，不如登高之博见也。\n(3) 师者，______。', difficulty: 'easy', topic: '语言文字运用', answer: '(1) 无以至千里；无以成江海（《劝学》）\n\n(2) 吾尝跂而望矣（《劝学》）\n\n(3) 所以传道受业解惑也（《师说》注意"受"通"授"）', hint: '《劝学》《师说》是默写最高频篇目' },
      { q: '下列各句中，没有语病的一句是：\nA. 通过这次活动，使我们开阔了眼界。\nB. 他对自己能否考上理想大学充满信心。\nC. 我们要防止不再出现类似问题。\nD. 中国古典诗词意蕴丰富，字字珠玑，是中华文化宝库中的瑰宝。', difficulty: 'medium', topic: '语言文字运用', answer: '答案：D\n\nA ✗ 成分残缺——"通过""使"不能同时用，缺主语\n   修改：去掉"通过"或去掉"使"\n\nB ✗ 两面与一面不搭配——"能否"是两面，"充满信心"是一面\n   修改："他对自己考上理想大学充满信心"\n\nC ✗ 否定不当——"防止"含否定意味，再加"不再"造成三重否定\n   修改："防止再出现类似问题"\n\nD ✓ 无语病', hint: '病句辨析口诀：看到"通过…使"想缺主语，看到"能否"想两面一面' },
      { q: '依次填入下列横线处的成语，最恰当的一组是：\n(1) 他做事总是______，从不马虎。\n(2) 面对困难，我们不能______，而要迎难而上。\n(3) 这部小说情节______，读来令人拍案叫绝。\n选项：A. 一丝不苟/望而却步/跌宕起伏\nB. 小心翼翼/退避三舍/波澜壮阔\nC. 一丝不苟/退避三舍/跌宕起伏\nD. 小心翼翼/望而却步/波澜壮阔', difficulty: 'hard', topic: '语言文字运用', answer: '答案：A\n\n第(1)空："一丝不苟" vs "小心翼翼"\n- 一丝不苟：做事认真细致，一点儿不马虎\n- 小心翼翼：形容谨慎小心，不敢疏忽\n语境强调"不马虎"→ 一丝不苟更恰当 ✓\n\n第(2)空："望而却步" vs "退避三舍"\n- 望而却步：看到困难就退缩\n- 退避三舍：比喻对人让步，不与人争\n语境是面对困难→ 望而却步更恰当 ✓\n\n第(3)空："跌宕起伏" vs "波澜壮阔"\n- 跌宕起伏：形容情节曲折多变\n- 波澜壮阔：形容声势雄壮或规模宏大\n语境说小说情节→ 跌宕起伏更恰当 ✓\n\n成语使用三注意：① 适用对象 ② 褒贬色彩 ③ 语境搭配', hint: '成语辨析要关注适用对象和语境差异' },

      // —— 名篇名句 (3题) ——
      { q: '默写填空（高考高频）：\n(1) ______，渺沧海之一粟。\n(2) 无边落木萧萧下，______。\n(3) 安得广厦千万间，______。', difficulty: 'easy', topic: '名篇名句', answer: '(1) 寄蜉蝣于天地（《赤壁赋》苏轼）\n   注意"蜉蝣"的写法\n\n(2) 不尽长江滚滚来（《登高》杜甫）\n\n(3) 大庇天下寒士俱欢颜（《茅屋为秋风所破歌》杜甫）\n   注意"庇"和"俱"的写法', hint: '名篇名句默写要做到"一字不差"，重点记忆易错字' },
      { q: '理解性默写：\n(1) 《赤壁赋》中写作者与友人泛舟江上，感觉如在太空中乘风飞行的句子是：______，______。\n(2) 《劝学》中以雕刻为喻说明学习要坚持的句子是：______，______。', difficulty: 'medium', topic: '名篇名句', answer: '(1) 浩浩乎如冯虚御风，而不知其所止\n   飘飘乎如遗世独立，羽化而登仙\n   （"冯虚御风"即凌空驾风，有太空飞行之感）\n   注意"冯"通"凭"\n\n(2) 锲而舍之，朽木不折\n   锲而不舍，金石可镂\n   （"锲"是雕刻，"镂"也是雕刻，强调坚持的效果）\n   注意"锲""镂"的写法', hint: '理解性默写需要先理解题意再定位原文，不能死记硬背' },
      { q: '综合运用默写：\n苏轼在《赤壁赋》中借水月阐述哲理，其中表达"变与不变"辩证思想的句子是：\n(1) 从变化的角度看：______\n(2) 从不变的角度看：______\n(3) 简要分析这两句的哲理含义。', difficulty: 'hard', topic: '名篇名句', answer: '(1) 逝者如斯，而未尝往也\n   （水不停地流，但江河始终存在）\n\n(2) 盈虚者如彼，而卒莫消长也\n   （月亮有圆有缺，但月亮本身并没有增减）\n\n(3) 哲理分析：\n苏轼借水和月阐述了"变"与"不变"的辩证思想：\n\n① 从"变"的角度看：万物都在变化，没有一刻是相同的\n② 从"不变"的角度看：万物的本质和规律是永恒的\n\n③ 启示：如果从变化的角度看，天地万物每一瞬间都在改变；如果从不变的角度看，万物与我一样都是永恒的。\n\n④ 深层含义：人生短暂不必悲伤，因为从更宏观的角度看，生命是永恒循环的一部分。这体现了苏轼旷达超脱的人生态度。', hint: '苏轼《赤壁赋》的水月哲理是高考重点，要理解其辩证思想' }
    ]
  }
};

// ========== 工具函数 ==========

function getDaysUntilExam() {
  var now = new Date();
  var diff = EXAM_DATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getDateStr() {
  var d = new Date();
  return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
}

function getCurrentSlot(dayOfWeek) {
  var now = new Date();
  var t = now.getHours() * 60 + now.getMinutes();
  var slots = WEEKLY_PLAN[dayOfWeek] || [];
  for (var i = 0; i < slots.length; i++) {
    var parts = slots[i].time.split('-');
    var sp = parts[0].split(':').map(Number);
    var ep = parts[1].split(':').map(Number);
    if (t >= sp[0] * 60 + sp[1] && t < ep[0] * 60 + ep[1]) {
      return { index: i, slot: slots[i], active: true };
    }
  }
  return { index: -1, slot: null, active: false };
}

function getNextSlot(dayOfWeek) {
  var now = new Date();
  var t = now.getHours() * 60 + now.getMinutes();
  var slots = WEEKLY_PLAN[dayOfWeek] || [];
  for (var i = 0; i < slots.length; i++) {
    var sp = slots[i].time.split('-')[0].split(':').map(Number);
    if (t < sp[0] * 60 + sp[1]) {
      return { slot: slots[i], isNextDay: false };
    }
  }
  var nextDay = (dayOfWeek + 1) % 7;
  var tries = 0;
  while (tries < 7) {
    if (WEEKLY_PLAN[nextDay] && WEEKLY_PLAN[nextDay].length > 0) {
      return { slot: WEEKLY_PLAN[nextDay][0], isNextDay: true, dayName: DAY_NAMES[nextDay] };
    }
    nextDay = (nextDay + 1) % 7;
    tries++;
  }
  return { slot: null };
}

function getRankByXP(xp) {
  var rank = RANKS[0];
  var nextRank = RANKS[1];
  for (var i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXP) {
      rank = RANKS[i];
      nextRank = RANKS[i + 1] || null;
      break;
    }
  }
  var progress = 0;
  if (nextRank) {
    progress = (xp - rank.minXP) / (nextRank.minXP - rank.minXP);
  } else {
    progress = 1;
  }
  return {
    current: rank,
    next: nextRank,
    progress: Math.min(1, Math.max(0, progress)),
    xpToNext: nextRank ? nextRank.minXP - xp : 0
  };
}

function checkAchievements(mastered, streakDays, totalXP) {
  var earned = [];
  var masteredCount = Object.keys(mastered).filter(function(k) { return mastered[k]; }).length;

  ACHIEVEMENTS.forEach(function(a) {
    var unlocked = false;
    if (a.id === 'first_win' && masteredCount >= 1) unlocked = true;
    if (a.id === 'streak_3' && streakDays >= 3) unlocked = true;
    if (a.id === 'streak_7' && streakDays >= 7) unlocked = true;
    if (a.id === 'streak_30' && streakDays >= 30) unlocked = true;

    SUBJECT_KEYS.forEach(function(sk) {
      var content = SUBJECT_CONTENT[sk];
      var allMastered = content.questions.every(function(q, i) {
        return mastered[sk + '-' + i];
      });
      if (a.condition === sk + '_all' && allMastered) unlocked = true;
    });

    if (a.id === 'all_50pct') {
      var allPass = SUBJECT_KEYS.every(function(sk) {
        var content = SUBJECT_CONTENT[sk];
        var count = content.questions.filter(function(q, i) { return mastered[sk + '-' + i]; }).length;
        return count >= Math.ceil(content.questions.length / 2);
      });
      if (allPass) unlocked = true;
    }

    if (a.id === 'total_50pct') {
      var total = 0, totalM = 0;
      SUBJECT_KEYS.forEach(function(sk) {
        total += SUBJECT_CONTENT[sk].questions.length;
        totalM += SUBJECT_CONTENT[sk].questions.filter(function(q, i) { return mastered[sk + '-' + i]; }).length;
      });
      if (totalM >= total / 2) unlocked = true;
    }

    if (a.condition && a.condition.indexOf('rank >=') === 0) {
      var reqRank = parseInt(a.condition.split('>=')[1]);
      var currentRank = getRankByXP(totalXP);
      if (currentRank.current.id >= reqRank) unlocked = true;
    }

    if (unlocked) earned.push(a);
  });

  return earned;
}

// ========== 导出 ==========
module.exports = {
  EXAM_DATE, SUBJECTS, SUBJECT_KEYS, DAY_NAMES, WEEKLY_PLAN, WEEK_DAYS,
  PHASES, DAILY_ROUTINE, SUBJECT_CONTENT,
  HOLIDAYS, TIME_SLOTS, TASK_TEMPLATES,
  RANKS, ACHIEVEMENTS, XP_RULES,
  getDaysUntilExam, getDateStr, getCurrentSlot, getNextSlot,
  getRankByXP, checkAchievements,
  getHolidayName, getCurrentPhase, getDayType, getSlotGroup,
  analyzeScores, generateSmartSchedule, generateWeeklyPreview
};
