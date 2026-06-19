// ==========================================
// 清北修仙传 - 游戏核心引擎
// ==========================================

var EXAM_DATE = new Date('2027-06-07T09:00:00+08:00');

// ========== 角色基础属性 ==========
var BASE_HP = 100;
var BASE_ATK = 10;
var BASE_DEF = 5;

// ========== 怪物类型 ==========
var MONSTER_TYPES = {
  normal: { name: '小怪', baseHP: 30, atk: 8, xpReward: 20, coinMin: 5, coinMax: 15, color: '#94a3b8', questions: 1 },
  elite: { name: '精英怪', baseHP: 60, atk: 15, xpReward: 50, coinMin: 15, coinMax: 30, color: '#f59e0b', questions: 2 },
  boss: { name: 'Boss', baseHP: 120, atk: 25, xpReward: 150, coinMin: 50, coinMax: 100, color: '#ef4444', questions: 4 }
};

// ========== 地图区域（对应备考阶段） ==========
var REGIONS = [
  {
    id: 1, name: '启程之谷', icon: '🌱', desc: '暑假预习，夯实基础',
    phase: '暑假自主预习', color: '#10b981', bg: '#ecfdf5',
    unlockLevel: 1,
    nodes: [
      { id: '1-1', x: 20, y: 8, type: 'normal', subject: 'math', label: '函数入门' },
      { id: '1-2', x: 60, y: 16, type: 'normal', subject: 'english', label: '词汇积累' },
      { id: '1-3', x: 32, y: 24, type: 'normal', subject: 'physics', label: '力学基础' },
      { id: '1-4', x: 75, y: 32, type: 'elite', subject: 'math', label: '导数初探' },
      { id: '1-5', x: 45, y: 40, type: 'normal', subject: 'chemistry', label: '化学平衡' },
      { id: '1-6', x: 22, y: 48, type: 'normal', subject: 'biology', label: '细胞结构' },
      { id: '1-7', x: 70, y: 56, type: 'normal', subject: 'chinese', label: '文言基础' },
      { id: '1-8', x: 38, y: 64, type: 'elite', subject: 'english', label: '语法挑战' },
      { id: '1-9', x: 62, y: 74, type: 'normal', subject: 'math', label: '数列练习' },
      { id: '1-B', x: 46, y: 86, type: 'boss', subject: 'mixed', label: '暑假守卫战' }
    ]
  },
  {
    id: 2, name: '知识密林', icon: '🌲', desc: '一轮复习（上），系统梳理',
    phase: '一轮复习（上）', color: '#6366f1', bg: '#eef2ff',
    unlockLevel: 5,
    nodes: [
      { id: '2-1', x: 32, y: 7, type: 'normal', subject: 'math', label: '函数与导数' },
      { id: '2-2', x: 72, y: 14, type: 'normal', subject: 'physics', label: '牛顿定律' },
      { id: '2-3', x: 24, y: 22, type: 'elite', subject: 'english', label: '阅读突破' },
      { id: '2-4', x: 64, y: 30, type: 'normal', subject: 'chemistry', label: '电化学' },
      { id: '2-5', x: 40, y: 38, type: 'normal', subject: 'math', label: '数列综合' },
      { id: '2-6', x: 78, y: 46, type: 'normal', subject: 'biology', label: '遗传定律' },
      { id: '2-7', x: 30, y: 54, type: 'elite', subject: 'chinese', label: '古诗鉴赏' },
      { id: '2-8', x: 68, y: 62, type: 'normal', subject: 'physics', label: '能量守恒' },
      { id: '2-9', x: 24, y: 70, type: 'normal', subject: 'english', label: '写作训练' },
      { id: '2-10', x: 60, y: 78, type: 'elite', subject: 'math', label: '解析几何' },
      { id: '2-B', x: 44, y: 88, type: 'boss', subject: 'mixed', label: '密林Boss战' }
    ]
  },
  {
    id: 3, name: '冰雪峡谷', icon: '❄️', desc: '寒假强化，重点突破弱科',
    phase: '寒假强化', color: '#0891b2', bg: '#ecfeff',
    unlockLevel: 10,
    nodes: [
      { id: '3-1', x: 48, y: 8, type: 'elite', subject: 'math', label: '极限挑战' },
      { id: '3-2', x: 22, y: 18, type: 'normal', subject: 'english', label: '听力特训' },
      { id: '3-3', x: 72, y: 28, type: 'normal', subject: 'chinese', label: '作文突破' },
      { id: '3-4', x: 40, y: 38, type: 'elite', subject: 'physics', label: '电磁感应' },
      { id: '3-5', x: 78, y: 48, type: 'normal', subject: 'chemistry', label: '有机推断' },
      { id: '3-6', x: 28, y: 58, type: 'normal', subject: 'biology', label: '实验设计' },
      { id: '3-7', x: 64, y: 68, type: 'elite', subject: 'math', label: '概率统计' },
      { id: '3-8', x: 36, y: 78, type: 'normal', subject: 'english', label: '完形填空' },
      { id: '3-B', x: 52, y: 90, type: 'boss', subject: 'mixed', label: '冰雪决战' }
    ]
  },
  {
    id: 4, name: '烈焰熔炉', icon: '🔥', desc: '二轮专题，强化题型方法',
    phase: '二轮专题复习', color: '#ef4444', bg: '#fef2f2',
    unlockLevel: 16,
    nodes: [
      { id: '4-1', x: 40, y: 9, type: 'elite', subject: 'math', label: '综合建模' },
      { id: '4-2', x: 72, y: 20, type: 'normal', subject: 'physics', label: '实验探究' },
      { id: '4-3', x: 24, y: 32, type: 'elite', subject: 'english', label: '读写综合' },
      { id: '4-4', x: 64, y: 44, type: 'normal', subject: 'chemistry', label: '实验方案' },
      { id: '4-5', x: 32, y: 56, type: 'normal', subject: 'chinese', label: '辩证思维' },
      { id: '4-6', x: 76, y: 66, type: 'elite', subject: 'biology', label: '综合分析' },
      { id: '4-7', x: 44, y: 78, type: 'normal', subject: 'math', label: '创新题型' },
      { id: '4-B', x: 56, y: 90, type: 'boss', subject: 'mixed', label: '熔炉决战' }
    ]
  },
  {
    id: 5, name: '清华之巅', icon: '🏆', desc: '三轮冲刺，圆梦清华',
    phase: '三轮冲刺', color: '#7c3aed', bg: '#f5f3ff',
    unlockLevel: 22,
    nodes: [
      { id: '5-1', x: 48, y: 9, type: 'elite', subject: 'math', label: '限时冲刺' },
      { id: '5-2', x: 22, y: 20, type: 'elite', subject: 'english', label: '全真模拟' },
      { id: '5-3', x: 72, y: 32, type: 'normal', subject: 'chinese', label: '名篇冲刺' },
      { id: '5-4', x: 40, y: 44, type: 'elite', subject: 'physics', label: '压轴突破' },
      { id: '5-5', x: 78, y: 56, type: 'normal', subject: 'chemistry', label: '综合演练' },
      { id: '5-6', x: 28, y: 66, type: 'normal', subject: 'biology', label: '回归教材' },
      { id: '5-7', x: 64, y: 78, type: 'elite', subject: 'math', label: '新概念题' },
      { id: '5-B', x: 48, y: 90, type: 'boss', subject: 'mixed', label: '终极决战' }
    ]
  }
];

// ========== 装备系统 ==========
var EQUIPMENT = {
  weapons: [
    { id: 'w1', name: '铅笔剑', emoji: '✏️', atk: 3, price: 0, desc: '新手起步武器', rarity: 'common', unlockLevel: 1 },
    { id: 'w2', name: '钢笔长矛', emoji: '🖊️', atk: 6, price: 100, desc: '锋利又可靠', rarity: 'common', unlockLevel: 3 },
    { id: 'w3', name: '圆规双刃', emoji: '📐', atk: 10, price: 250, desc: '精准打击要害', rarity: 'rare', unlockLevel: 6 },
    { id: 'w4', name: '三角板巨斧', emoji: '📏', atk: 15, price: 500, desc: '沉稳有力的重击', rarity: 'rare', unlockLevel: 10 },
    { id: 'w5', name: '计算器光剑', emoji: '🔢', atk: 22, price: 1000, desc: '数据驱动的精准打击', rarity: 'epic', unlockLevel: 15 },
    { id: 'w6', name: '清华之笔', emoji: '🏆', atk: 30, price: 2500, desc: '传说中的清华附魔武器', rarity: 'legendary', unlockLevel: 22 }
  ],
  armor: [
    { id: 'a1', name: '校服外套', emoji: '🧥', def: 3, price: 0, desc: '基础防护', rarity: 'common', unlockLevel: 1 },
    { id: 'a2', name: '笔记本盾牌', emoji: '📓', def: 6, price: 120, desc: '知识就是力量', rarity: 'common', unlockLevel: 3 },
    { id: 'a3', name: '错题铠甲', emoji: '📘', def: 10, price: 300, desc: '从错误中汲取防御', rarity: 'rare', unlockLevel: 7 },
    { id: 'a4', name: '真题战甲', emoji: '📗', def: 16, price: 600, desc: '千锤百炼的防护', rarity: 'rare', unlockLevel: 12 },
    { id: 'a5', name: '满分护甲', emoji: '📕', def: 24, price: 1200, desc: '近乎完美的防御', rarity: 'epic', unlockLevel: 18 }
  ],
  accessories: [
    { id: 'c1', name: '荧光笔', emoji: '🖍️', bonus: { critRate: 0.1 }, price: 80, desc: '10%暴击率', rarity: 'common', unlockLevel: 2 },
    { id: 'c2', name: '计时器', emoji: '⏱️', bonus: { critDmg: 0.5 }, price: 200, desc: '暴击伤害+50%', rarity: 'rare', unlockLevel: 5 },
    { id: 'c3', name: '能量饮料', emoji: '🥤', bonus: { maxHP: 30 }, price: 350, desc: '最大HP+30', rarity: 'rare', unlockLevel: 8 },
    { id: 'c4', name: '学霸眼镜', emoji: '🤓', bonus: { xpBoost: 0.2 }, price: 500, desc: '经验获取+20%', rarity: 'epic', unlockLevel: 12 },
    { id: 'c5', name: '清华校徽', emoji: '🎖️', bonus: { allBoost: 0.15 }, price: 2000, desc: '全属性+15%', rarity: 'legendary', unlockLevel: 20 }
  ]
};

var RARITY_COLORS = {
  common: '#94a3b8',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b'
};

var RARITY_NAMES = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说'
};

// ========== 段位系统 ==========
var RANKS = [
  { id: 0, name: '倔强青铜', emoji: '🥉', minLevel: 1, color: '#a8a29e' },
  { id: 1, name: '不屈白银', emoji: '🥈', minLevel: 4, color: '#94a3b8' },
  { id: 2, name: '荣耀黄金', emoji: '🥇', minLevel: 7, color: '#f59e0b' },
  { id: 3, name: '尊贵铂金', emoji: '💎', minLevel: 10, color: '#06b6d4' },
  { id: 4, name: '永恒钻石', emoji: '💠', minLevel: 14, color: '#8b5cf6' },
  { id: 5, name: '至尊星耀', emoji: '⭐', minLevel: 18, color: '#f97316' },
  { id: 6, name: '最强王者', emoji: '👑', minLevel: 22, color: '#ef4444' },
  { id: 7, name: '荣耀王者', emoji: '🔥', minLevel: 26, color: '#dc2626' },
  { id: 8, name: '\u6E05\u5317\u81F3\u5C0A', emoji: '\uD83C\uDFC6', minLevel: 30, color: '#7c3aed' }
];

// ========== 成就系统 ==========
var ACHIEVEMENTS = [
  { id: 'first_kill', name: '初战告捷', emoji: '⚔️', desc: '消灭第一只怪物', reward: { coins: 20 } },
  { id: 'kill_10', name: '十连斩', emoji: '🗡️', desc: '累计消灭10只怪物', reward: { coins: 50 } },
  { id: 'kill_50', name: '半百勇士', emoji: '⚔️', desc: '累计消灭50只怪物', reward: { coins: 150 } },
  { id: 'kill_100', name: '百怪猎人', emoji: '🏹', desc: '累计消灭100只怪物', reward: { coins: 300 } },
  { id: 'boss_first', name: 'Boss猎手', emoji: '💀', desc: '击败第一个Boss', reward: { coins: 100 } },
  { id: 'boss_all', name: '全Boss通关', emoji: '👹', desc: '击败所有区域Boss', reward: { coins: 500 } },
  { id: 'streak_3', name: '三日之功', emoji: '📅', desc: '连续学习3天', reward: { coins: 30 } },
  { id: 'streak_7', name: '七日不辍', emoji: '🔥', desc: '连续学习7天', reward: { coins: 80 } },
  { id: 'streak_30', name: '月度坚持', emoji: '💪', desc: '连续学习30天', reward: { coins: 300 } },
  { id: 'perfect_battle', name: '完美战斗', emoji: '✨', desc: '一场战斗中全部答对', reward: { coins: 50 } },
  { id: 'math_master', name: '数学达人', emoji: '📐', desc: '答对50道数学题', reward: { coins: 200 } },
  { id: 'level_5', name: '崭露头角', emoji: '🌟', desc: '达到5级', reward: { coins: 100 } },
  { id: 'level_10', name: '小有成就', emoji: '💫', desc: '达到10级', reward: { coins: 200 } },
  { id: 'level_20', name: '学霸觉醒', emoji: '🔥', desc: '达到20级', reward: { coins: 500 } },
  { id: 'coins_1000', name: '小富翁', emoji: '💰', desc: '累计获得1000金币', reward: { coins: 100 } }
];

// ========== 每日宝箱 ==========
var DAILY_CHEST_REWARDS = [
  { type: 'coins', min: 20, max: 80, weight: 40 },
  { type: 'xp', min: 30, max: 100, weight: 30 },
  { type: 'heal', value: 50, weight: 15 },
  { type: 'rare_drop', weight: 10 },
  { type: 'jackpot', min: 200, max: 500, weight: 5 }
];

// ========== 怪物外观库 ==========
var MONSTER_SKINS = [
  { emoji: '👾', name: '知识小鬼' },
  { emoji: '🐉', name: '难题小龙' },
  { emoji: '👻', name: '易错幽灵' },
  { emoji: '🦎', name: '粗心蜥蜴' },
  { emoji: '🐙', name: '混淆章鱼' },
  { emoji: '🦇', name: '遗忘蝙蝠' },
  { emoji: '🐺', name: '公式狼' },
  { emoji: '🦅', name: '语法鹰' },
  { emoji: '🐻', name: '定理熊' },
  { emoji: '🦁', name: '综合狮' },
  { emoji: '🐲', name: '压轴巨龙' },
  { emoji: '👹', name: '阶段Boss' }
];

// ========== 永久Buff池 ==========
var BUFF_POOL = [
  { id: 'fire', name: '\u706B\u7130\u9644\u9B54', desc: '\u98DE\u5200\u5E26\u706B\uFF0C\u6BCF\u6B21\u989D\u5916+2\u4F24\u5BB3', emoji: '\uD83D\uDD25' },
  { id: 'armor', name: '\u62A4\u4F53\u91D1\u7532', desc: '\u51CF\u53D730%\u4F24\u5BB3', emoji: '\uD83D\uDEE1\uFE0F' },
  { id: 'lifesteal', name: '\u5438\u8840\u5149\u73AF', desc: '\u51FB\u6740\u602A\u7269\u6062\u590D15HP', emoji: '\uD83D\uDC9A' },
  { id: 'crit', name: '\u66B4\u51FB\u4E4B\u5FC3', desc: '\u9996\u628A\u98DE\u5200\u4F24\u5BB3\u7FFB\u500D', emoji: '\u2764\uFE0F' },
  { id: 'thorns', name: '\u8346\u68D8\u4E4B\u76FE', desc: '\u53CD\u5C0450%\u53D7\u5230\u7684\u4F24\u5BB3', emoji: '\uD83C\uDF35' }
];

// ========== 核心函数 ==========

// 创建新角色
function createCharacter() {
  return {
    name: '',
    gender: '',
    ownedEquip: [],
    equippedSet: -1,
    level: 1,
    xp: 0,
    coins: 50,
    hp: BASE_HP,
    maxHP: BASE_HP,
    baseAtk: BASE_ATK,
    baseDef: BASE_DEF,
    equipment: { weapon: 'w1', armor: 'a1', accessory: '' },
    inventory: [],
    pets: [],
    achievements: [],
    kills: 0,
    totalCoinsEarned: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    bossKills: 0,
    currentRegion: 1,
    currentNode: '',
    completedNodes: [],
    streakDays: 0,
    lastPlayDate: '',
    perfectBattles: 0,
    subjectKills: { math: 0, english: 0, chinese: 0, physics: 0, chemistry: 0, biology: 0 },
    treasureCount: 1,
    buffs: [],
    totalCultivation: 0,
    cultivationStartDate: ''
  };
}

// 计算角色有效属性（含装备加成）
function getCharStats(char) {
  var atk = char.baseAtk;
  var def = char.baseDef;
  var maxHP = BASE_HP + (char.level - 1) * 5;
  var critRate = 0.05;
  var critDmg = 1.5;
  var xpBoost = 1.0;
  var allBoost = 1.0;

  // 武器加成
  if (char.equipment.weapon) {
    var w = findById(EQUIPMENT.weapons, char.equipment.weapon);
    if (w) atk += w.atk;
  }
  // 防具加成
  if (char.equipment.armor) {
    var a = findById(EQUIPMENT.armor, char.equipment.armor);
    if (a) def += a.def;
  }
  // 饰品加成
  if (char.equipment.accessory) {
    var c = findById(EQUIPMENT.accessories, char.equipment.accessory);
    if (c && c.bonus) {
      if (c.bonus.critRate) critRate += c.bonus.critRate;
      if (c.bonus.critDmg) critDmg += c.bonus.critDmg;
      if (c.bonus.maxHP) maxHP += c.bonus.maxHP;
      if (c.bonus.xpBoost) xpBoost += c.bonus.xpBoost;
      if (c.bonus.allBoost) allBoost += c.bonus.allBoost;
    }
  }

  atk = Math.round(atk * allBoost);
  def = Math.round(def * allBoost);
  maxHP = Math.round(maxHP * allBoost);

  return { atk: atk, def: def, maxHP: maxHP, critRate: critRate, critDmg: critDmg, xpBoost: xpBoost };
}

// 获取当前段位
function getRankByLevel(level) {
  var rank = RANKS[0];
  var next = RANKS[1];
  for (var i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].minLevel) {
      rank = RANKS[i];
      next = RANKS[i + 1] || null;
      break;
    }
  }
  var xpForNextLevel = getXpForLevel(level + 1);
  var xpForCurrentLevel = getXpForLevel(level);
  var progress = (level >= 30) ? 1 : (xpForNextLevel > xpForCurrentLevel) ? 0 : 0;
  return { current: rank, next: next };
}

// 升级所需总经验（累积公式）
function getXpForLevel(level) {
  if (level <= 1) return 0;
  return Math.floor(50 * (level - 1) * (1 + (level - 1) * 0.15));
}

// 检查是否升级
function checkLevelUp(char) {
  var leveled = false;
  var newLevel = char.level;
  while (newLevel < 30) {
    var needed = getXpForLevel(newLevel + 1);
    if (char.xp >= needed) {
      newLevel++;
      leveled = true;
    } else {
      break;
    }
  }
  if (leveled) {
    char.level = newLevel;
    char.baseAtk = BASE_ATK + (newLevel - 1) * 2;
    char.baseDef = BASE_DEF + (newLevel - 1) * 1;
    var stats = getCharStats(char);
    char.maxHP = stats.maxHP;
    char.hp = stats.maxHP; // 升级回满血
  }
  return leveled;
}

// 生成怪物（根据节点类型和角色等级）
function createMonster(nodeType, regionLevel, subject) {
  var type = MONSTER_TYPES[nodeType] || MONSTER_TYPES.normal;
  var levelScale = 1 + (regionLevel - 1) * 0.2;
  var hp = Math.round(type.baseHP * levelScale);

  // 随机选择外观（Boss用特殊外观）
  var skin;
  if (nodeType === 'boss') {
    skin = MONSTER_SKINS[MONSTER_SKINS.length - 1]; // Boss外观
  } else if (nodeType === 'elite') {
    skin = MONSTER_SKINS[7 + Math.floor(Math.random() * 3)]; // 高级外观
  } else {
    skin = MONSTER_SKINS[Math.floor(Math.random() * 7)]; // 随机普通外观
  }

  return {
    name: skin.name,
    emoji: skin.emoji,
    hp: hp,
    maxHP: hp,
    atk: Math.round(type.atk * levelScale),
    xpReward: Math.round(type.xpReward * levelScale),
    coinMin: type.coinMin,
    coinMax: type.coinMax,
    questionsNeeded: type.questions,
    questionsAnswered: 0,
    correctCount: 0,
    wrongCount: 0,
    color: type.color,
    typeName: type.name,
    subject: subject
  };
}

// 计算答对题目的伤害
function calcDamage(charStats, isCrit) {
  var base = charStats.atk;
  var dmg = base + Math.floor(Math.random() * 5);
  if (isCrit) dmg = Math.round(dmg * charStats.critDmg);
  return Math.max(1, dmg);
}

// 计算怪物反击伤害
function calcMonsterDamage(monster, charStats) {
  var raw = monster.atk - Math.floor(charStats.def * 0.5);
  return Math.max(3, raw + Math.floor(Math.random() * 5));
}

// 战斗胜利奖励
function calcBattleReward(monster, charStats) {
  var coins = monster.coinMin + Math.floor(Math.random() * (monster.coinMax - monster.coinMin + 1));
  var xp = Math.round(monster.xpReward * charStats.xpBoost);

  // 额外掉落（20%概率掉装备碎片/道具）
  var bonus = null;
  if (Math.random() < 0.2) {
    var bonusTypes = ['heal_potion', 'xp_scroll', 'lucky_coin'];
    bonus = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
  }

  return { xp: xp, coins: coins, bonus: bonus };
}

// 每日宝箱奖励
function rollDailyChest() {
  var totalWeight = 0;
  DAILY_CHEST_REWARDS.forEach(function(r) { totalWeight += r.weight; });
  var roll = Math.random() * totalWeight;
  var cumulative = 0;

  for (var i = 0; i < DAILY_CHEST_REWARDS.length; i++) {
    cumulative += DAILY_CHEST_REWARDS[i].weight;
    if (roll <= cumulative) {
      var reward = DAILY_CHEST_REWARDS[i];
      var result = { type: reward.type };
      if (reward.min !== undefined && reward.max !== undefined) {
        result.value = reward.min + Math.floor(Math.random() * (reward.max - reward.min + 1));
      } else if (reward.value !== undefined) {
        result.value = reward.value;
      }
      return result;
    }
  }
  return { type: 'coins', value: 30 };
}

// 获取地图区域列表（含解锁状态）
function getMapRegions(charLevel) {
  return REGIONS.map(function(r) {
    return {
      id: r.id,
      name: r.name,
      icon: r.icon,
      desc: r.desc,
      phase: r.phase,
      color: r.color,
      bg: r.bg,
      unlocked: charLevel >= r.unlockLevel,
      unlockLevel: r.unlockLevel,
      nodeCount: r.nodes.length
    };
  });
}

// 获取区域内的节点列表（含完成/锁定状态）
function getRegionNodes(regionId, completedNodes) {
  var region = findById(REGIONS, regionId);
  if (!region) return [];
  completedNodes = completedNodes || [];

  // 先统计非Boss怪物完成情况
  var nonBossTotal = 0;
  var nonBossDone = 0;
  for (var k = 0; k < region.nodes.length; k++) {
    if (region.nodes[k].type !== 'boss') {
      nonBossTotal++;
      if (completedNodes.indexOf(region.nodes[k].id) >= 0) {
        nonBossDone++;
      }
    }
  }

  return region.nodes.map(function(node) {
    var isCompleted = completedNodes.indexOf(node.id) >= 0;
    var isBoss = node.type === 'boss';

    // 普通/精英怪始终解锁(自由探索)，Boss需要清完其他怪
    var isUnlocked;
    if (isBoss) {
      isUnlocked = (nonBossDone >= nonBossTotal);
    } else {
      isUnlocked = true;
    }

    return {
      id: node.id,
      x: node.x,
      y: node.y,
      type: node.type,
      subject: node.subject,
      label: node.label,
      completed: isCompleted,
      unlocked: isUnlocked,
      isBoss: isBoss,
      isElite: node.type === 'elite',
      monsterType: MONSTER_TYPES[node.type] || MONSTER_TYPES.normal
    };
  });
}

// 区域通关武器掉落
var REGION_WEAPONS = {
  1: { id: 'w1', name: '铅笔剑', emoji: '✏️', atk: 3, desc: '启程之谷的战利品，书写你的传奇', rarity: 'common' },
  2: { id: 'w2', name: '钢笔长矛', emoji: '🖊️', atk: 6, desc: '知识密林深处锻造的利刃', rarity: 'common' },
  3: { id: 'w3', name: '圆规双刃', emoji: '📐', atk: 10, desc: '冰雪峡谷中凝结的精准之刃', rarity: 'rare' },
  4: { id: 'w5', name: '计算器光剑', emoji: '🔢', atk: 22, desc: '烈焰熔炉中千锤百炼的神兵', rarity: 'epic' },
  5: { id: 'w6', name: '清华之笔', emoji: '🏆', atk: 30, desc: '登顶清华之巅的传说级武器', rarity: 'legendary' }
};

function getRegionDropWeapon(regionId) {
  return REGION_WEAPONS[regionId] || null;
}

// 获取距离高考天数
function getDaysUntilExam() {
  var now = new Date();
  var diff = EXAM_DATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// 保存游戏状态
function saveGame(char) {
  wx.setStorageSync('game_char', char);
}

// 读取游戏状态
function loadGame() {
  var char = wx.getStorageSync('game_char');
  if (!char) return null;
  return char;
}

// 检查成就解锁
function checkNewAchievements(char) {
  var newlyUnlocked = [];

  ACHIEVEMENTS.forEach(function(a) {
    if (char.achievements.indexOf(a.id) >= 0) return; // 已解锁

    var unlocked = false;
    if (a.id === 'first_kill' && char.kills >= 1) unlocked = true;
    if (a.id === 'kill_10' && char.kills >= 10) unlocked = true;
    if (a.id === 'kill_50' && char.kills >= 50) unlocked = true;
    if (a.id === 'kill_100' && char.kills >= 100) unlocked = true;
    if (a.id === 'boss_first' && char.bossKills >= 1) unlocked = true;
    if (a.id === 'boss_all' && char.bossKills >= REGIONS.length) unlocked = true;
    if (a.id === 'streak_3' && char.streakDays >= 3) unlocked = true;
    if (a.id === 'streak_7' && char.streakDays >= 7) unlocked = true;
    if (a.id === 'streak_30' && char.streakDays >= 30) unlocked = true;
    if (a.id === 'perfect_battle' && char.perfectBattles >= 1) unlocked = true;
    if (a.id === 'math_master' && (char.subjectKills.math || 0) >= 50) unlocked = true;
    if (a.id === 'level_5' && char.level >= 5) unlocked = true;
    if (a.id === 'level_10' && char.level >= 10) unlocked = true;
    if (a.id === 'level_20' && char.level >= 20) unlocked = true;
    if (a.id === 'coins_1000' && char.totalCoinsEarned >= 1000) unlocked = true;

    if (unlocked) {
      char.achievements.push(a.id);
      newlyUnlocked.push(a);
    }
  });

  return newlyUnlocked;
}

// 连胜追踪
function updateStreak(char) {
  var today = new Date().toISOString().slice(0, 10);
  var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (char.lastPlayDate === today) return char;

  if (char.lastPlayDate === yesterday) {
    char.streakDays++;
  } else if (char.lastPlayDate !== '') {
    char.streakDays = 1;
  } else {
    char.streakDays = 1;
  }

  char.lastPlayDate = today;
  return char;
}



// ========== 从题库取题 ==========
// getQuestion已迁移到question-loader按需加载模式
// 如需使用旧接口，请改用questionLoader.loadSubject(subject)

// ========== 辅助函数 ==========
function findById(arr, id) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return arr[i];
  }
  return null;
}

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

// ========== 导出 ==========
module.exports = {
  EXAM_DATE: EXAM_DATE,
  BASE_HP: BASE_HP,
  BASE_ATK: BASE_ATK,
  BASE_DEF: BASE_DEF,
  MONSTER_TYPES: MONSTER_TYPES,
  REGIONS: REGIONS,
  EQUIPMENT: EQUIPMENT,
  RARITY_COLORS: RARITY_COLORS,
  RARITY_NAMES: RARITY_NAMES,
  RANKS: RANKS,
  ACHIEVEMENTS: ACHIEVEMENTS,
  DAILY_CHEST_REWARDS: DAILY_CHEST_REWARDS,
  MONSTER_SKINS: MONSTER_SKINS,
  BUFF_POOL: BUFF_POOL,
  createCharacter: createCharacter,
  getCharStats: getCharStats,
  getRankByLevel: getRankByLevel,
  getXpForLevel: getXpForLevel,
  checkLevelUp: checkLevelUp,
  createMonster: createMonster,
  calcDamage: calcDamage,
  calcMonsterDamage: calcMonsterDamage,
  calcBattleReward: calcBattleReward,
  rollDailyChest: rollDailyChest,
  getMapRegions: getMapRegions,
  getRegionNodes: getRegionNodes,
  getDaysUntilExam: getDaysUntilExam,
  saveGame: saveGame,
  loadGame: loadGame,
  checkNewAchievements: checkNewAchievements,
  updateStreak: updateStreak,
  getRegionDropWeapon: getRegionDropWeapon,
  findById: findById,
  randomInt: randomInt
};
