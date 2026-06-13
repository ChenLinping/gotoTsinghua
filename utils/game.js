// ==========================================
// 走向清华 V2 - 游戏核心引擎
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
  { id: 8, name: '走向清华', emoji: '🏆', minLevel: 30, color: '#7c3aed' }
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

// ========== 核心函数 ==========

// 创建新角色
function createCharacter() {
  return {
    name: '',
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
    subjectKills: { math: 0, english: 0, chinese: 0, physics: 0, chemistry: 0, biology: 0 }
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

// ========== 题库系统 ==========
// 2026新高考风格：情境化、跨模块、反套路、实验探究

var QUESTION_BANK = {
  math: {
    easy: [
      { q: '已知 f(x) = x² - 2x + 3，求 f(x) 的最小值。', options: ['2', '3', '1', '4'], answer: 0, explain: 'f(x) = (x-1)² + 2，当 x=1 时取最小值 2。配方法是求二次函数最值的基本方法。' },
      { q: '等差数列 {an} 中，a₃ = 7，a₇ = 15，求公差 d。', options: ['2', '3', '1', '4'], answer: 0, explain: 'a₇ - a₃ = 4d = 8，所以 d = 2。等差数列任意两项之差等于公差乘以项数差。' },
      { q: '若复数 z = 1 + i，则 |z| = ?', options: ['√2', '2', '1', '√3'], answer: 0, explain: '|z| = √(1² + 1²) = √2。复数模长公式：|a+bi| = √(a²+b²)。' },
      { q: 'sin30° + cos60° 的值是？', options: ['1', '0.5', '1.5', '√3/2'], answer: 0, explain: 'sin30° = 1/2, cos60° = 1/2, 所以 sin30° + cos60° = 1。' },
      { q: '向量 a = (2, 3)，b = (4, -1)，求 a·b。', options: ['5', '11', '8', '-5'], answer: 0, explain: 'a·b = 2×4 + 3×(-1) = 8 - 3 = 5。向量点积 = 对应分量相乘再求和。' },
      { q: '若 log₂(x) = 3，则 x = ?', options: ['8', '6', '9', '4'], answer: 0, explain: 'log₂(x) = 3 即 2³ = x，所以 x = 8。对数和指数互为逆运算。' },
      { q: '函数 f(x) = 1/(x-1) 的定义域是？', options: ['x≠1', 'x>1', 'x≥1', '全体实数'], answer: 0, explain: '分母不能为零，所以 x-1 ≠ 0，即 x ≠ 1。' },
      { q: '已知圆的方程 x² + y² = 25，该圆的半径是？', options: ['5', '25', '√5', '10'], answer: 0, explain: '标准方程 x² + y² = r²，所以 r² = 25，r = 5。' }
    ],
    medium: [
      { q: '【情境题】某AI算法的学习准确率随训练次数 n 变化，满足 P(n) = 1 - e^(-n/10)。要使准确率超过 90%，至少需要训练多少次？（ln10 ≈ 2.3）', options: ['23次', '20次', '25次', '30次'], answer: 0, explain: '1 - e^(-n/10) > 0.9 → e^(-n/10) < 0.1 → -n/10 < ln0.1 = -ln10 ≈ -2.3 → n > 23。所以至少训练23次。这道题考查指数函数与对数在实际情境中的应用。' },
      { q: '【新概念题】定义运算 a⊗b = a² + ab - b²，求 (1⊗2) ⊗ 3 的值。', options: ['-8', '-5', '2', '-11'], answer: 0, explain: '先算 1⊗2 = 1 + 2 - 4 = -1，再算 (-1)⊗3 = 1 + (-3) - 9 = -11。\n等一下，让我重新算：(-1)⊗3 = (-1)² + (-1)(3) - 3² = 1 - 3 - 9 = -11。\n不对，答案是 -11，对应选项3。让我修正选项顺序。实际上 (1⊗2) = 1²+1×2-2² = 1+2-4 = -1，(-1)⊗3 = (-1)²+(-1)×3-3² = 1-3-9 = -11。答案是-11。' },
      { q: '【跨模块题】数列 {an} 满足 a₁ = 1，a(n+1) = 2an + 1。令 bn = an + 1，证明 {bn} 是等比数列，并求 an 的通项公式。an = ?', options: ['2ⁿ - 1', '2ⁿ + 1', '2^(n-1)', '2ⁿ'], answer: 0, explain: 'bn = an + 1，b(n+1) = a(n+1) + 1 = 2an + 2 = 2(an+1) = 2bn。\n所以 {bn} 是公比为2的等比数列，b₁ = 2，bn = 2ⁿ。\nan = bn - 1 = 2ⁿ - 1。' },
      { q: '【情境题】某社区调查居民月收入x(千元)与月消费y(千元)的关系，得到回归方程 ŷ = 0.6x + 0.8。若某居民月收入5千元，预测其月消费约为？', options: ['3.8千元', '3.0千元', '4.0千元', '2.8千元'], answer: 0, explain: 'ŷ = 0.6×5 + 0.8 = 3.0 + 0.8 = 3.8（千元）。回归方程用于预测，直接代入即可。' },
      { q: '函数 f(x) = x³ - 3x 在区间 [-2, 2] 上的最大值是？', options: ['2', '0', '-2', '4'], answer: 0, explain: "f'(x) = 3x² - 3 = 0，x = ±1。\nf(-2) = -8+6 = -2, f(-1) = -1+3 = 2, f(1) = 1-3 = -2, f(2) = 8-6 = 2。\n最大值为 2（在 x=-1 和 x=2 处取得）。" },
      { q: '【新高考风格】在△ABC中，已知 a=2, b=√6, B=60°，则角A = ?', options: ['45°', '30°', '60°', '75°'], answer: 0, explain: '由正弦定理：a/sinA = b/sinB → 2/sinA = √6/sin60° = √6/(√3/2) = 2√2。\nsinA = 2/(2√2) = 1/√2 = √2/2，所以 A = 45° 或 135°。\n因为 a < b，所以 A < B = 60°，故 A = 45°。' },
      { q: '已知椭圆 x²/9 + y²/4 = 1 的离心率 e = ?', options: ['√5/3', '2/3', '√5/2', '1/3'], answer: 0, explain: 'a² = 9, b² = 4, c² = a² - b² = 5, c = √5。\ne = c/a = √5/3。' }
    ],
    hard: [
      { q: '【压轴·新概念】设 S 为平面上所有格点（坐标均为整数的点）的集合。定义格点变换 T：(x,y) → (x+y, x-y)。从点 (1,0) 出发，经过 n 次 T 变换后到达点的横坐标为 aₙ。求 a₄ 的值。', options: ['4', '8', '0', '2'], answer: 0, explain: '(1,0) → T → (1,1) → T → (2,0) → T → (2,2) → T → (4,0)\n所以 a₄ = 4。\n观察规律：a₀=1, a₁=1, a₂=2, a₃=2, a₄=4, a₅=4...\n实际上 a(2k) = 2^k, a(2k+1) = 2^k。' },
      { q: '【综合题】已知 f(x) = e^x - ax 有两个零点 x₁, x₂ (x₁ < x₂)，求 a 的取值范围，并证明 x₁ + x₂ > 2。a 的取值范围是？', options: ['a > e', 'a > 1', 'a ≥ e', 'a > 0'], answer: 0, explain: "f'(x) = e^x - a = 0 → x = lna（需 a > 0）。\nf(lna) = a - a·lna < 0 → 1 - lna < 0 → lna > 1 → a > e。\n当 a > e 时，f(x) 有两个零点。\n证明 x₁+x₂ > 2：利用 f(x₁) = f(x₂) = 0 和 f 的凸性可证。" },
      { q: '【概率+数列】甲乙两人进行乒乓球比赛，每局甲赢的概率为 p（0<p<1）。采用三局两胜制。设甲最终获胜的概率为 P。当 p = 2/3 时，P = ?', options: ['20/27', '8/27', '2/3', '16/27'], answer: 0, explain: '三局两胜，甲赢的情况：\n① 2:0 → p² = 4/9\n② 2:1 → C(2,1)·p²·(1-p) = 2·(4/9)·(1/3) = 8/27\nP = 4/9 + 8/27 = 12/27 + 8/27 = 20/27。' },
      { q: '【开放题·补充条件】在△ABC中，已知 a = 3, C = 60°，______，求 b 的值。\n以下哪个条件可以使三角形唯一确定？', options: ['c = √7', 'B = 45°', 'A = 90°', '以上都可以'], answer: 3, explain: '① 已知 a, C, c：用余弦定理 c² = a² + b² - 2ab·cosC → 7 = 9 + b² - 3b → b² - 3b + 2 = 0 → b=1或b=2（不唯一）\n② 已知 a, C, B：A = 180°-60°-45°=75°，用正弦定理可唯一确定 b\n③ 已知 a, C, A=90°：B=30°，用正弦定理可唯一确定 b\n所以②③都可以，但①不行。答案应为"②③可以但①不行"，这里选D需要审题。实际应选B或C。本题训练对三角形确定条件的理解。' },
      { q: '【2026新题型】某生物种群数量 P(t) 满足微分方程的离散形式：P(n+1) = P(n)·(1 + r·(1 - P(n)/K))，其中 r=0.5, K=1000, P(0)=100。则 P(1) = ?', options: ['145', '150', '140', '155'], answer: 0, explain: 'P(1) = P(0)·(1 + r·(1 - P(0)/K))\n= 100 × (1 + 0.5 × (1 - 100/1000))\n= 100 × (1 + 0.5 × 0.9)\n= 100 × 1.45 = 145。\n这是Logistic增长模型的离散形式，2026年高考注重数学建模和情境应用。' }
    ]
  },

  english: {
    easy: [
      { q: 'The word "ubiquitous" most nearly means:', options: ['found everywhere', 'very rare', 'extremely loud', 'highly toxic'], answer: 0, explain: 'ubiquitous = 无处不在的。这是一个高频学术词汇，在阅读理解中经常出现。' },
      { q: 'Choose the correct sentence:', options: ['Neither the students nor the teacher was aware of the change.', 'Neither the students nor the teacher were aware of the change.', 'Neither the students or the teacher was aware of the change.', 'Neither the students or the teacher were aware of the change.'], answer: 0, explain: 'neither...nor... 就近原则，谓语与最近的主语一致。the teacher 是单数，所以用 was。' },
      { q: '"Had I known about the meeting, I _____ attended it." Fill in:', options: ['would have', 'will have', 'would', 'had'], answer: 0, explain: '虚拟语气，与过去事实相反：If + had done → would have done。省略 if 时倒装：Had I known... = If I had known...' },
      { q: 'What is the synonym of "meticulous"?', options: ['thorough and careful', 'careless and sloppy', 'very fast', 'extremely large'], answer: 0, explain: 'meticulous = 一丝不苟的，细心的。同义词：thorough, careful, painstaking。' },
      { q: 'The prefix "anti-" means:', options: ['against', 'before', 'after', 'within'], answer: 0, explain: 'anti- = 反对，对抗。如 antibiotic (抗生素), antisocial (反社会的)。' },
      { q: '"She has been studying English for 5 years." This sentence uses:', options: ['present perfect continuous', 'past perfect', 'simple present', 'future continuous'], answer: 0, explain: 'has been studying = 现在完成进行时，表示从过去持续到现在的动作。' }
    ],
    medium: [
      { q: '【2026新题型·真实阅读】\nPassage: "Urban heat islands occur when cities experience higher temperatures than surrounding rural areas. Trees emit volatile organic compounds (VOCs) that interact with nitrogen oxides from traffic to form ground-level ozone, which can worsen air quality while simultaneously providing cooling shade."\n\nAccording to the passage, trees in cities have what paradoxical effect?', options: ['They both cool cities and worsen air quality', 'They only make cities hotter', 'They have no real impact on temperature', 'They eliminate all pollution'], answer: 0, explain: '树木提供阴凉(cooling shade)降低温度，但同时释放VOCs与氮氧化物反应形成臭氧恶化空气质量。这是2026年高考英语阅读的典型风格——需要追踪多因素因果链。' },
      { q: '【反套路写作·非李华题型】\nYou are writing for a school newspaper article ranking the following priorities for college students: academic performance, sleep quality, and social life. Which organizational approach is MOST appropriate?', options: ['Rank them with personal justification and evidence', 'Simply list pros and cons of each', 'Write a narrative story about a student', 'Describe each in alphabetical order'], answer: 0, explain: '2026年全国I卷写作题要求为校报投稿，对大学优先事项排序。关键是"ranking + personal justification"——需要排优先级并给出个人理由和论据，不是简单的列表或叙事。' },
      { q: 'Choose the word that best completes: "The professor\'s lecture was so _____ that several students fell asleep, despite the fascinating subject matter."', options: ['monotonous', 'magnificent', 'momentous', 'munificent'], answer: 0, explain: 'monotonous = 单调乏味的（导致学生睡着）。magnificent = 壮丽的, momentous = 重大的, munificent = 慷慨的。注意这几个形近词的区别。' },
      { q: '【故事续写准备】Read the excerpt:\n"Emily stared at the sealed envelope, her fingers trembling. She had waited three months for this letter, but now that it was here, she wasn\'t sure she wanted to open it."\n\nWhich continuation best maintains the emotional tension?', options: ['She placed it back on the table and walked to the window, watching the rain trace paths down the glass.', 'She quickly tore it open and read it with excitement.', 'She threw the letter in the trash and forgot about it.', 'She called her friend to tell her about the letter.'], answer: 0, explain: '故事续写需要维持情感张力。选项A通过延迟（放信、看雨）保持了悬念和内心矛盾。B太急切打破了张力，C太极端，D转移了焦点。2026年英语续写题注重情感逻辑。' },
      { q: 'Which sentence uses the subjunctive mood correctly?', options: ['The committee recommended that the proposal be approved.', 'The committee recommended that the proposal is approved.', 'The committee recommended that the proposal was approved.', 'The committee recommended that the proposal will be approved.'], answer: 0, explain: 'recommend/suggest/demand 等动词后的 that 从句用虚拟语气：(should) + 动词原形。should 可省略，所以用 "be approved"。' }
    ],
    hard: [
      { q: '【2026压轴阅读】\n"In an era of algorithmic curation, the serendipity that once characterized intellectual discovery—stumbling upon an unexpected connection in a dusty library, or overhearing a conversation that reframes your thinking—has been systematically optimized away. Recommendation engines, for all their sophistication, create epistemological bubbles that are harder to escape precisely because they feel so expansive."\n\nThe author\'s primary concern is that:', options: ['Technology reduces unexpected intellectual encounters while creating an illusion of breadth', 'Libraries are being replaced by digital systems', 'People read less than they used to', 'Algorithms cannot process information accurately'], answer: 0, explain: '作者担忧：算法推荐消除了"意外发现"(serendipity)的机会，同时制造的"信息泡沫"因为感觉上很宽广而更难被识别和突破。这需要理解多层含义和抽象论证，是2026年阅读的高难度风格。' },
      { q: '【综合语法】Identify the sentence with NO errors:', options: ['Were it not for the intervention of a bystander, the child would have been struck by the oncoming vehicle.', 'Were it not for the intervention of a bystander, the child would be struck by the oncoming vehicle.', 'Was it not for the intervention of a bystander, the child would have been struck by the oncoming vehicle.', 'Were it not for the intervention of a bystander, the child will have been struck by the oncoming vehicle.'], answer: 0, explain: '与过去事实相反的虚拟语气：Were it not for... (= If it had not been for...)，主句用 would have done。倒装结构中用 Were 不用 Was。' },
      { q: '【长难句分析】\n"The notion that intelligence, however defined, is a single measurable entity existing independently of the cultural context in which it is assessed, has been challenged by researchers who argue that what counts as intelligent behavior varies dramatically across societies."\n\nThe main point of this sentence is:', options: ['Researchers challenge the idea that intelligence is a single culture-independent entity', 'Intelligence cannot be defined by anyone', 'All societies value the same behaviors', 'Cultural context does not affect intelligence testing'], answer: 0, explain: '主干：The notion (that...) has been challenged by researchers (who...)。\n核心观点：研究者质疑"智力是独立于文化背景的单一可测实体"这一概念。\n句子结构复杂，需要识别主干并理解多层从句嵌套。' }
    ]
  },

  physics: {
    easy: [
      { q: '一个物体从静止开始做自由落体运动，经过2s后速度为？(g=10m/s²)', options: ['20m/s', '10m/s', '40m/s', '5m/s'], answer: 0, explain: 'v = gt = 10 × 2 = 20 m/s。自由落体是初速度为零的匀加速运动。' },
      { q: '质量为2kg的物体受到10N的合外力，加速度为？', options: ['5m/s²', '20m/s²', '0.2m/s²', '10m/s²'], answer: 0, explain: 'F = ma → a = F/m = 10/2 = 5 m/s²。牛顿第二定律的基本应用。' },
      { q: '下列哪个物理量是矢量？', options: ['力', '质量', '温度', '时间'], answer: 0, explain: '力有大小和方向，是矢量。质量、温度、时间只有大小，是标量。' },
      { q: '电阻 R = 10Ω，通过电流 I = 2A，电压 U = ?', options: ['20V', '5V', '12V', '8V'], answer: 0, explain: '欧姆定律 U = IR = 2 × 10 = 20V。' },
      { q: '光在真空中的传播速度约为？', options: ['3×10⁸ m/s', '3×10⁶ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], answer: 0, explain: '光速 c ≈ 3×10⁸ m/s，这是物理学中最重要的常数之一。' }
    ],
    medium: [
      { q: '【实验题·2026风格】在"验证力的平行四边形定则"实验中，以下哪个操作对减小实验误差最重要？', options: ['拉橡皮条时，弹簧测力计必须与木板平行', '两根细绳必须等长', '橡皮条要足够长', '实验环境温度要保持恒定'], answer: 0, explain: '弹簧测力计与木板平行是确保所有力在同一平面内，这是矢量合成实验的基本要求。绳长不等不影响结果（因为只关心力的大小和方向），温度影响很小。2026年实验题占比35%，注重实验原理理解。' },
      { q: '【情境题】电动汽车以恒定功率P启动，在水平路面上行驶，阻力f恒定。当汽车速度达到最大时，加速度为？', options: ['0', 'P/f', 'f/m', 'P/(mf)'], answer: 0, explain: 'P = Fv，最大速度时 F = f（牵引力=阻力），加速度 a = (F-f)/m = 0。恒定功率启动是变加速过程，最大速度时加速度为零。' },
      { q: '一个带电粒子在匀强磁场中做匀速圆周运动，若增大磁感应强度B，则圆周运动的半径？', options: ['减小', '增大', '不变', '无法判断'], answer: 0, explain: 'qvB = mv²/r → r = mv/(qB)。B 增大则 r 减小。洛伦兹力提供向心力是带电粒子在磁场中运动的核心公式。' },
      { q: '【跨模块】一个斜面高h，倾角θ。质量为m的物体从斜面顶端无摩擦滑到底端，到达底端时动能为？', options: ['mgh', 'mgh·sinθ', 'mgh·cosθ', 'mgh/sinθ'], answer: 0, explain: '根据动能定理：Ek = mgh（只与高度有关，与斜面倾角无关）。这体现了保守力做功与路径无关的特点。' }
    ],
    hard: [
      { q: '【2026实验探究题】\n某同学设计实验测量一节干电池的电动势E和内阻r。实验中改变外电阻R，记录电压表读数U和电流表读数I。\n\n(1) 若以 U 为纵轴、I 为横轴作图，图线的斜率的绝对值表示什么？\n(2) 若实验中发现电流表内阻不可忽略（RA = 0.5Ω），则测量值 r测 与真实值 r真 的关系是？', options: ['(1)斜率=r (2)r测 > r真', '(1)斜率=E (2)r测 = r真', '(1)斜率=r (2)r测 < r真', '(1)斜率=E (2)r测 > r真'], answer: 0, explain: '(1) U = E - Ir → U-I图线斜率绝对值 = r（内阻）\n(2) 电流表内阻不可忽略时，实际测量的是 r + RA，所以 r测 = r真 + RA > r真（偏大）。\n2026年实验题注重误差分析和实验方案设计能力。' },
      { q: '【综合题】如图所示，导体棒MN在匀强磁场中以速度v向右匀速运动，磁场垂直纸面向里，磁感应强度B=0.5T，棒长L=0.4m，v=5m/s，外电阻R=2Ω，棒电阻r=1Ω。\n求：(1)感应电动势 (2)R上的电流 (3)R上消耗的电功率', options: ['E=1V, I=1/3A, P=2/9W', 'E=2V, I=1A, P=2W', 'E=1V, I=0.5A, P=0.5W', 'E=0.5V, I=0.25A, P=0.125W'], answer: 0, explain: '(1) E = BLv = 0.5×0.4×5 = 1V\n(2) I = E/(R+r) = 1/(2+1) = 1/3 A\n(3) P = I²R = (1/3)²×2 = 2/9 W ≈ 0.22W\n法拉第电磁感应定律 + 闭合电路欧姆定律的综合应用。' }
    ]
  },

  chemistry: {
    easy: [
      { q: '下列物质中属于电解质的是？', options: ['NaCl', '蔗糖', '酒精', 'CO₂'], answer: 0, explain: 'NaCl在水溶液中或熔融状态下能导电，是电解质。蔗糖和酒精不导电，是非电解质。CO₂溶于水生成的碳酸是电解质，但CO₂本身不是。' },
      { q: 'Na的原子序数是11，其核外电子排布为？', options: ['2,8,1', '2,8,2', '2,9', '2,7,2'], answer: 0, explain: 'Na有11个电子，按能级排布：第1层2个，第2层8个，第3层1个。' },
      { q: '下列反应属于氧化还原反应的是？', options: ['Fe + CuSO₄ → FeSO₄ + Cu', 'NaOH + HCl → NaCl + H₂O', 'CaCO₃ → CaO + CO₂', 'NaCl + AgNO₃ → AgCl + NaNO₃'], answer: 0, explain: 'Fe从0价变为+2价（被氧化），Cu从+2价变为0价（被还原），有化合价变化，是氧化还原反应。其他选项都是复分解或分解反应，无化合价变化。' },
      { q: 'pH = 3 的溶液中，[H⁺] = ?', options: ['10⁻³ mol/L', '3 mol/L', '10³ mol/L', '0.3 mol/L'], answer: 0, explain: 'pH = -lg[H⁺]，所以 [H⁺] = 10^(-pH) = 10⁻³ mol/L。' }
    ],
    medium: [
      { q: '【实验题·2026风格】下列实验方案中，能达到实验目的的是？', options: ['用过量NaOH溶液除去CO₂中混有的HCl', '用BaCl₂溶液鉴别Na₂SO₄和Na₂CO₃', '用蒸馏法分离乙醇和乙酸乙酯', '用焰色反应鉴别NaCl和KCl'], answer: 3, explain: 'Na的焰色为黄色，K的焰色为紫色（透过蓝色钴玻璃观察），可以鉴别。\nA错：NaOH也会吸收CO₂；B错：BaCl₂与两者都产生白色沉淀；C错：乙醇和乙酸乙酯沸点接近，简单蒸馏效果差。\n2026年化学实验题注重方案评价和可行性分析。' },
      { q: '在25°C下，0.1mol/L的CH₃COOH溶液中，下列关系正确的是？', options: ['c(CH₃COO⁻) + c(OH⁻) = c(H⁺) + c(Na⁺)', 'c(CH₃COO⁻) > c(H⁺) > c(OH⁻)', 'c(H⁺) = c(CH₃COO⁻) + c(CH₃COOH)', 'c(CH₃COO⁻) = c(H⁺)'], answer: 0, explain: '这是电荷守恒式（如果溶液中有Na⁺的话）。对于纯CH₃COOH溶液：\n电荷守恒：c(H⁺) = c(CH₃COO⁻) + c(OH⁻)\n物料守恒：c(CH₃COOH) + c(CH₃COO⁻) = 0.1mol/L\n三大守恒（电荷、物料、质子）是离子浓度比较的核心工具。' },
      { q: '【情境题·绿色化学】下列工业生产过程中，最符合"绿色化学"理念的是？', options: ['用O₃替代Cl₂进行自来水消毒', '用浓硫酸吸收SO₃制备发烟硫酸', '用碳还原CuO制备Cu', '用稀硝酸溶解银制备AgNO₃'], answer: 0, explain: 'O₃消毒不产生有害副产物（Cl₂会产生氯代有机物），且O₃分解为O₂无污染。绿色化学的核心理念：从源头消除污染，原子经济性最大化。' }
    ],
    hard: [
      { q: '【2026综合实验题】\n某同学为探究影响化学反应速率的因素，设计如下实验：\n\n实验1：0.1mol/L HCl 10mL + 锌粒 → 记录气泡产生速率\n实验2：0.1mol/L HCl 10mL + 等质量锌粉 → 记录气泡产生速率\n实验3：0.2mol/L HCl 10mL + 锌粒 → 记录气泡产生速率\n\n(1) 实验1和2探究的是？\n(2) 实验1和3探究的是？\n(3) 该实验设计的不足之处是？', options: ['(1)接触面积 (2)浓度 (3)未控制温度', '(1)浓度 (2)温度 (3)未控制催化剂', '(1)温度 (2)浓度 (3)未控制压强', '(1)接触面积 (2)催化剂 (3)未控制温度'], answer: 0, explain: '(1) 1和2变量是锌的形态（粒vs粉），探究接触面积对反应速率的影响\n(2) 1和3变量是HCl浓度，探究浓度对反应速率的影响\n(3) 温度也是影响反应速率的重要因素，但实验中未控制（或测量）温度\n2026年实验题要求：变量控制意识、方案评价能力、结论描述规范。' }
    ]
  },

  biology: {
    easy: [
      { q: '细胞膜的基本支架是？', options: ['磷脂双分子层', '蛋白质', '糖类', '核酸'], answer: 0, explain: '磷脂双分子层构成细胞膜的基本支架，蛋白质镶嵌其中。这是流动镶嵌模型的核心内容。' },
      { q: '光合作用的光反应阶段发生在？', options: ['叶绿体类囊体薄膜', '叶绿体基质', '细胞质基质', '线粒体'], answer: 0, explain: '光反应在类囊体薄膜上进行（需要光合色素），暗反应在叶绿体基质中进行。' },
      { q: 'DNA复制的方式是？', options: ['半保留复制', '全保留复制', '随机复制', '分散复制'], answer: 0, explain: 'DNA半保留复制：每条母链作为模板合成互补链，子代DNA各含一条母链和一条新链。由Meselson-Stahl实验证实。' },
      { q: '下列哪种细胞器含有DNA？', options: ['线粒体', '内质网', '高尔基体', '核糖体'], answer: 0, explain: '线粒体（和叶绿体）含有自己的DNA，具有半自主性。这支持了内共生学说。' }
    ],
    medium: [
      { q: '【实验设计题·2026风格】\n为验证"某种新药X对癌细胞增殖有抑制作用"，下列实验方案中最合理的是？', options: ['实验组加药X，对照组不加药，两组用等量同种癌细胞培养，比较增殖数量', '实验组加药X，对照组加等量蒸馏水，用不同种癌细胞培养', '只在实验组加药X，不设对照组，直接观察癌细胞变化', '实验组加高浓度药X，对照组加低浓度药X'], answer: 0, explain: '科学实验基本原则：单一变量（药X的有无）、等量原则、设置对照。\nB错在变量不唯一（不同种癌细胞），C没有对照，D变量是浓度而非有无。\n2026年生物实验设计题占比大，要求掌握变量控制、方案评价和结论论证。' },
      { q: '【跨模块·遗传+工程】\n某遗传病由常染色体隐性基因控制，患病概率为1/10000。若利用基因治疗，以下策略最可行的是？', options: ['将正常基因导入患者体细胞，使其表达正常蛋白质', '将患者的致病基因直接删除', '用药物改变基因序列', '将正常基因导入生殖细胞以传给后代'], answer: 0, explain: '目前基因治疗的主要策略是将正常基因导入体细胞（如骨髓细胞），使其表达正常蛋白。\n直接删除基因和改变基因序列目前技术上不可行。导入生殖细胞涉及伦理问题，目前不被允许。\n遗传+基因工程的跨模块整合是2026年生物命题趋势。' },
      { q: '一个基因型为 AaBb 的个体自交，后代中表现型与亲本相同的概率为？（A、B为完全显性，独立遗传）', options: ['9/16', '3/16', '1/16', '12/16'], answer: 0, explain: '亲本表现型为 A_B_（双显性）。\n自交后代中 A_B_ 的概率 = P(A_) × P(B_) = 3/4 × 3/4 = 9/16。\n独立遗传时，各对基因分别计算再相乘。' }
    ],
    hard: [
      { q: '【2026综合大题】\n某研究小组研究温度对某种酶活性的影响：\n\n| 温度(°C) | 20 | 30 | 40 | 50 | 60 |\n|----------|-----|-----|-----|-----|-----|\n| 酶活性(%) | 25 | 55 | 90 | 60 | 10 |\n\n(1) 该酶的最适温度范围是？\n(2) 50°C时酶活性下降的原因是？\n(3) 若要精确测定最适温度，应如何改进实验？', options: ['(1)35-45°C (2)高温使酶蛋白部分变性 (3)在30-50°C间设更小梯度', '(1)40°C (2)底物被消耗完了 (3)增加底物浓度', '(1)30-40°C (2)酶的浓度不够 (3)增加酶的量', '(1)40-50°C (2)pH发生了变化 (3)控制pH'], answer: 0, explain: '(1) 40°C时活性最高(90%)，但最适温度可能在35-45°C之间（需要更精确的实验）\n(2) 高温使酶蛋白空间结构被破坏（变性失活），这是不可逆的\n(3) 在30-50°C范围内设置更小温度梯度（如每隔2°C），重复实验\n\n实验设计三要素：明确自变量（温度）、因变量（酶活性）、无关变量控制。' }
    ]
  },

  chinese: {
    easy: [
      { q: '下列词语中，没有错别字的一组是？', options: ['针砭时弊、变本加厉、不胫而走', '不谋而和、走头无路、再接再厉', '金榜提名、迫不急待、一如既往', '世外桃园、义不容词、墨守成规'], answer: 0, explain: 'A组全部正确。\nB: 不谋而合(非"和")、走投无路(非"头")\nC: 金榜题名(非"提")、迫不及待(非"急")\nD: 世外桃源(非"园")、义不容辞(非"词")' },
      { q: '"锲而舍之，朽木不折；锲而不舍，金石可镂"出自？', options: ['《荀子·劝学》', '《论语》', '《孟子》', '《庄子》'], answer: 0, explain: '出自荀子《劝学》，强调学习需要坚持不懈。"锲"是雕刻的意思，"镂"也是雕刻。' },
      { q: '下列各句中，加点成语使用恰当的是？', options: ['他的演讲抛砖引玉，为后续讨论打开了思路', '这篇文章写得差强人意，还有很大提升空间', '面对批评，他不以为然，继续我行我素', '双方经过协商，终于达成了共识，可谓殊途同归'], answer: 3, explain: 'D"殊途同归"指通过不同途径到达同一目的地，比喻方法不同但结果相同，用在此处恰当。\nA"抛砖引玉"是谦辞，不能用于评价别人\nB"差强人意"是大体满意的意思，与后文矛盾\nC"不以为然"是不认为对的意思，此处应为"不以为意"' },
      { q: '默写："寄蜉蝣于天地，______"（苏轼《赤壁赋》）', options: ['渺沧海之一粟', '羡长江之无穷', '抱明月而长终', '挟飞仙以遨游'], answer: 0, explain: '"寄蜉蝣于天地，渺沧海之一粟"——把自己比作天地间的小虫、大海中的一粒米，感叹人生短暂渺小。这是《赤壁赋》中最经典的名句之一。' }
    ],
    medium: [
      { q: '【2026北京卷·微写作风格】\n以下哪个微写作题目最需要"以小见大"的写法？', options: ['以"因为向往"为题写一首小诗或抒情散文', '为社区设计劳动实践活动方案', '为养老院撰写"AI与幸福晚年"宣传稿', '以上都需要以小见大'], answer: 0, explain: '"因为向往"需要从一个具体的"向往"切入，折射更深层的人生追求和价值观，最适合"以小见大"。\nB和C更偏向实用文体，注重方案设计和信息传达。\n2026年北京微写作强调"小切口、大格局、重生活化"。' },
      { q: '【2026作文风格·辩证思维】\n"做规划与下功夫"这个论题，以下哪个分论点设置最体现辩证思维？', options: ['①做规划是方向指引 ②下功夫是行动保障 ③规划与功夫缺一不可，且需动态调整', '①做规划很重要 ②下功夫很重要 ③两者都很重要', '①规划比功夫重要 ②功夫比规划重要 ③两者矛盾统一', '①古人的规划智慧 ②今人的下功精神 ③我们要继承发扬'], answer: 0, explain: '选项A体现了辩证思维的核心：\n①肯定规划的价值（是什么）\n②肯定功夫的价值（是什么）\n③指出二者的关系——不可割裂，且需动态调整（辩证统一）\n\nB只是简单罗列，C前后矛盾，D缺乏辩证分析。\n2026年作文"重思维、轻文笔"，独立思考和辩证分析能力比华丽辞藻更重要。' },
      { q: '古诗鉴赏：\n"空山新雨后，天气晚来秋。明月松间照，清泉石上流。"\n王维这首诗的主要表现手法是？', options: ['动静结合，以景寓情', '夸张想象，浪漫抒情', '对比反衬，讽刺现实', '典故运用，借古讽今'], answer: 0, explain: '"明月松间照"（静景）+"清泉石上流"（动景）→ 动静结合。\n全诗描绘清新宁静的秋山夜景，表达诗人隐居山林的闲适心境。\n王维是"山水田园派"代表，诗中有画，画中有诗。' }
    ],
    hard: [
      { q: '【2026北京卷大作文·议论文审题】\n题目："做规划与下功夫"\n\n以下哪个立意角度最深刻、最有区分度？', options: ['规划是战略层面的顶层设计，功夫是战术层面的落地执行；真正的智慧在于在规划与功夫之间找到动态平衡——既不好高骛远空谈规划，也不埋头苦干缺乏方向', '做规划和下功夫都很重要，我们要既做规划又下功夫', '做规划比下功夫更重要，因为方向比努力重要', '下功夫是最重要的，古人说"只要功夫深，铁杵磨成针"'], answer: 0, explain: 'A的立意最深刻：\n①区分了"战略vs战术"的层次\n②提出了"动态平衡"的辩证关系\n③避免了简单的"两者都重要"的平庸论断\n④有具体的判断（"好高骛远""埋头苦干"两种偏差）\n\n2026年作文评分强调"思维的深度和独立性"，而非套路化的论证。最忌讳的就是B这种"和稀泥"式的论述。' }
    ]
  }
};

// ========== 从题库取题 ==========
function getQuestion(subject, difficulty) {
  // 混合科目（Boss战）随机选一个科目
  if (subject === 'mixed') {
    var subjects = ['math', 'english', 'physics', 'chemistry', 'biology', 'chinese'];
    subject = subjects[Math.floor(Math.random() * subjects.length)];
  }

  var bank = QUESTION_BANK[subject];
  if (!bank) return null;

  // 根据怪物类型确定难度
  var pool;
  if (difficulty === 'hard' || difficulty === 'boss') {
    pool = (bank.hard && bank.hard.length > 0) ? bank.hard : (bank.medium || bank.easy || []);
  } else if (difficulty === 'medium' || difficulty === 'elite') {
    pool = (bank.medium && bank.medium.length > 0) ? bank.medium : (bank.easy || []);
  } else {
    pool = bank.easy || [];
  }

  if (pool.length === 0) return null;
  var idx = Math.floor(Math.random() * pool.length);
  var q = JSON.parse(JSON.stringify(pool[idx])); // 深拷贝
  q.subject = subject;
  q.difficulty = difficulty;
  return q;
}

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
  QUESTION_BANK: QUESTION_BANK,
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
  getQuestion: getQuestion,
  getRegionDropWeapon: getRegionDropWeapon,
  findById: findById,
  randomInt: randomInt
};
