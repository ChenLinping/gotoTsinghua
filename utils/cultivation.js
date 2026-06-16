// ==========================================
// 清北修仙传 - 修仙境界体系 (九大境界)
// 高考 = 渡劫，高考完 = 飞仙
// ==========================================

// 高考日期
var EXAM_DATE = new Date('2027-06-07T09:00:00+08:00');

// ========== 九大境界 (凡人修仙传体系) ==========
// 每境界4小阶，每小阶500XP，线性递增
var REALMS = [
  {
    id: 0, name: '\u7EC3\u6C14\u671F', icon: '\uD83C\uDF31',
    color: '#10b981', bg: 'linear-gradient(180deg, #064e3b 0%, #065f46 50%, #047857 100%)',
    desc: '\u6691\u5047\u9884\u4E60\uFF0C\u592F\u5B9E\u57FA\u7840',
    stages: [
      { name: '\u521D\u671F', threshold: 0 },
      { name: '\u4E2D\u671F', threshold: 500 },
      { name: '\u540E\u671F', threshold: 1000 },
      { name: '\u5927\u5706\u6EE1', threshold: 1500 }
    ]
  },
  {
    id: 1, name: '\u7B51\u57FA\u671F', icon: '\uD83E\uDDDE',
    color: '#6366f1', bg: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)',
    desc: '\u4E00\u8F6E\u590D\u4E60\uFF0C\u7CFB\u7EDF\u68B3\u7406',
    stages: [
      { name: '\u521D\u671F', threshold: 2000 },
      { name: '\u4E2D\u671F', threshold: 2500 },
      { name: '\u540E\u671F', threshold: 3000 },
      { name: '\u5927\u5706\u6EE1', threshold: 3500 }
    ]
  },
  {
    id: 2, name: '\u91D1\u4E39\u671F', icon: '\u2728',
    color: '#f59e0b', bg: 'linear-gradient(180deg, #78350f 0%, #92400e 50%, #b45309 100%)',
    desc: '\u5BD2\u5047\u5F3A\u5316\uFF0C\u91CD\u70B9\u7A81\u7834',
    stages: [
      { name: '\u521D\u671F', threshold: 4000 },
      { name: '\u4E2D\u671F', threshold: 4500 },
      { name: '\u540E\u671F', threshold: 5000 },
      { name: '\u5927\u5706\u6EE1', threshold: 5500 }
    ]
  },
  {
    id: 3, name: '\u5143\u5A74\u671F', icon: '\uD83D\uDD25',
    color: '#ef4444', bg: 'linear-gradient(180deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%)',
    desc: '\u4E8C\u8F6E\u4E13\u9898\uFF0C\u5F3A\u5316\u9898\u578B',
    stages: [
      { name: '\u521D\u671F', threshold: 6000 },
      { name: '\u4E2D\u671F', threshold: 6500 },
      { name: '\u540E\u671F', threshold: 7000 },
      { name: '\u5927\u5706\u6EE1', threshold: 7500 }
    ]
  },
  {
    id: 4, name: '\u5316\u795E\u671F', icon: '\u26A1',
    color: '#a855f7', bg: 'linear-gradient(180deg, #4a1d96 0%, #5b21b6 50%, #6d28d9 100%)',
    desc: '\u4E09\u8F6E\u51B2\u523A\uFF0C\u67E5\u7F3A\u8865\u6F0F',
    stages: [
      { name: '\u521D\u671F', threshold: 8000 },
      { name: '\u4E2D\u671F', threshold: 8500 },
      { name: '\u540E\u671F', threshold: 9000 },
      { name: '\u5927\u5706\u6EE1', threshold: 9500 }
    ]
  },
  {
    id: 5, name: '\u70BC\u865A\u671F', icon: '\uD83C\uDF00',
    color: '#0891b2', bg: 'linear-gradient(180deg, #083344 0%, #164e63 50%, #155e75 100%)',
    desc: '\u6A21\u62DF\u5B9E\u6218\uFF0C\u63D0\u5347\u901F\u5EA6',
    stages: [
      { name: '\u521D\u671F', threshold: 10000 },
      { name: '\u4E2D\u671F', threshold: 10500 },
      { name: '\u540E\u671F', threshold: 11000 },
      { name: '\u5927\u5706\u6EE1', threshold: 11500 }
    ]
  },
  {
    id: 6, name: '\u5408\u4F53\u671F', icon: '\uD83D\uDCAB',
    color: '#d946ef', bg: 'linear-gradient(180deg, #4a044e 0%, #701a75 50%, #86198f 100%)',
    desc: '\u771F\u9898\u7CBE\u7EC3\uFF0C\u878D\u4F1A\u8D2F\u901A',
    stages: [
      { name: '\u521D\u671F', threshold: 12000 },
      { name: '\u4E2D\u671F', threshold: 12500 },
      { name: '\u540E\u671F', threshold: 13000 },
      { name: '\u5927\u5706\u6EE1', threshold: 13500 }
    ]
  },
  {
    id: 7, name: '\u5927\u4E58\u671F', icon: '\uD83C\uDF1F',
    color: '#eab308', bg: 'linear-gradient(180deg, #713f12 0%, #854d0e 50%, #a16207 100%)',
    desc: '\u8003\u524D\u8C03\u6574\uFF0C\u7A33\u5B9A\u5FC3\u6001',
    stages: [
      { name: '\u521D\u671F', threshold: 14000 },
      { name: '\u4E2D\u671F', threshold: 14500 },
      { name: '\u540E\u671F', threshold: 15000 },
      { name: '\u5927\u5706\u6EE1', threshold: 15500 }
    ]
  },
  {
    id: 8, name: '\u6E21\u52AB\u671F', icon: '\u2694\uFE0F',
    color: '#dc2626', bg: 'linear-gradient(180deg, #450a0a 0%, #7f1d1d 50%, #991b1b 100%)',
    desc: '\u9AD8\u8003\u51B3\u6218\uFF0C\u6E21\u52AB\u98DE\u4ED9',
    stages: [
      { name: '\u521D\u671F', threshold: 16000 },
      { name: '\u4E2D\u671F', threshold: 16500 },
      { name: '\u540E\u671F', threshold: 17000 },
      { name: '\u5927\u5706\u6EE1', threshold: 17500 }
    ]
  }
];

// 最高境界总修为
var MAX_CULTIVATION = 18000;

// 每日答题数量
var DAILY_QUESTIONS = 10;

// 每题基础修为
var BASE_XP_PER_Q = 3;

// 全对奖励修为
var PERFECT_BONUS = 10;

// ========== 核心函数 ==========

// 获取当前境界信息
function getCurrentRealm(totalCultivation) {
  var xp = totalCultivation || 0;
  var realmIdx = 0;
  var stageIdx = 0;

  // 找大境界
  for (var i = REALMS.length - 1; i >= 0; i--) {
    if (xp >= REALMS[i].stages[0].threshold) {
      realmIdx = i;
      break;
    }
  }

  var realm = REALMS[realmIdx];

  // 找小阶
  for (var j = realm.stages.length - 1; j >= 0; j--) {
    if (xp >= realm.stages[j].threshold) {
      stageIdx = j;
      break;
    }
  }

  // 计算进度
  var currentThreshold = realm.stages[stageIdx].threshold;
  var nextThreshold;
  var isMax = false;

  if (stageIdx < realm.stages.length - 1) {
    nextThreshold = realm.stages[stageIdx + 1].threshold;
  } else if (realmIdx < REALMS.length - 1) {
    nextThreshold = REALMS[realmIdx + 1].stages[0].threshold;
  } else {
    nextThreshold = MAX_CULTIVATION;
    isMax = true;
  }

  var progress = nextThreshold > currentThreshold
    ? (xp - currentThreshold) / (nextThreshold - currentThreshold)
    : 1;
  progress = Math.min(1, Math.max(0, progress));

  return {
    realm: realm,
    realmIdx: realmIdx,
    stage: realm.stages[stageIdx],
    stageIdx: stageIdx,
    progress: progress,
    currentThreshold: currentThreshold,
    nextThreshold: nextThreshold,
    isMax: isMax,
    displayName: realm.name + realm.stages[stageIdx].name
  };
}

// 检查是否突破了境界(返回突破信息或null)
function checkBreakthrough(oldXP, newXP) {
  var oldRealm = getCurrentRealm(oldXP);
  var newRealm = getCurrentRealm(newXP);

  // 大境界突破
  if (newRealm.realmIdx > oldRealm.realmIdx) {
    return {
      type: 'realm',
      from: oldRealm.displayName,
      to: newRealm.displayName,
      newRealm: newRealm.realm,
      stage: newRealm.stage
    };
  }

  // 小阶突破
  if (newRealm.stageIdx > oldRealm.stageIdx && newRealm.realmIdx === oldRealm.realmIdx) {
    return {
      type: 'stage',
      from: oldRealm.displayName,
      to: newRealm.displayName,
      newRealm: newRealm.realm,
      realm: newRealm.realm,
      stage: newRealm.stage
    };
  }

  return null;
}

// 计算距高考天数
function getDaysUntilExam() {
  var now = new Date();
  var diff = EXAM_DATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// 计算已修行天数(从首次打开算起)
function getCultivationDays(startDate) {
  if (!startDate) return 1;
  var start = new Date(startDate);
  var now = new Date();
  var diff = now.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// 每日答题奖励计算
function calculatePracticeReward(correctCount, totalCount) {
  var xp = correctCount * BASE_XP_PER_Q;
  var isPerfect = correctCount === totalCount;
  if (isPerfect) xp += PERFECT_BONUS;
  return { xp: xp, isPerfect: isPerfect };
}

// 获取修行等级(综合评分)
function getCultivationLevel(totalCultivation) {
  return Math.floor(totalCultivation / 100) + 1;
}

module.exports = {
  EXAM_DATE: EXAM_DATE,
  REALMS: REALMS,
  MAX_CULTIVATION: MAX_CULTIVATION,
  DAILY_QUESTIONS: DAILY_QUESTIONS,
  BASE_XP_PER_Q: BASE_XP_PER_Q,
  PERFECT_BONUS: PERFECT_BONUS,
  getCurrentRealm: getCurrentRealm,
  checkBreakthrough: checkBreakthrough,
  getDaysUntilExam: getDaysUntilExam,
  getCultivationDays: getCultivationDays,
  calculatePracticeReward: calculatePracticeReward,
  getCultivationLevel: getCultivationLevel
};
