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

// ========== 装备套装 (按境界+性别) ==========
var EQUIPMENT_SETS = {
  0: { // \u7EC3\u6C14\u671F
    male: [
      { id: 'mw0', name: '\u7C97\u5E03\u9053\u888D', type: 'armor', rarity: 'common', desc: '\u7EC3\u6C14\u5165\u95E8\u7684\u6734\u7D20\u9053\u888D', img: '/images/equip/m_armor_0.jpg' },
      { id: 'mm0', name: '\u94C1\u5251', type: 'weapon', rarity: 'common', desc: '\u51E1\u4EBA\u7684\u94C1\u5251\uFF0C\u5939\u5B9E\u53EF\u9760', img: '/images/equip/m_weapon_0.jpg' }
    ],
    female: [
      { id: 'fw0', name: '\u7D20\u8863', type: 'armor', rarity: 'common', desc: '\u7EC3\u6C14\u5165\u95E8\u7684\u7D20\u96C5\u8863\u88D9', img: '/images/equip/f_armor_0.jpg' },
      { id: 'fm0', name: '\u7389\u7C2A', type: 'accessory', rarity: 'common', desc: '\u6E05\u96C5\u7684\u7389\u7C2A\uFF0C\u521D\u5165\u4ED9\u9014', img: '/images/equip/f_acc_0.jpg' }
    ]
  },
  1: { // \u7B51\u57FA\u671F
    male: [
      { id: 'mw1', name: '\u7075\u888D', type: 'armor', rarity: 'common', desc: '\u7EC7\u5165\u7075\u6C14\u7684\u84DD\u8272\u6CD5\u888D', img: '/images/equip/m_armor_1.jpg' },
      { id: 'mm1', name: '\u7075\u5251', type: 'weapon', rarity: 'common', desc: '\u51DD\u7EC3\u7075\u6C14\u7684\u6CD5\u5251', img: '/images/equip/m_weapon_1.jpg' }
    ],
    female: [
      { id: 'fw1', name: '\u84DD\u7075\u88D9', type: 'armor', rarity: 'common', desc: '\u7075\u6C14\u7F16\u7EC7\u7684\u84DD\u8272\u4ED9\u88D9', img: '/images/equip/f_armor_1.jpg' },
      { id: 'fm1', name: '\u7075\u7C2A', type: 'accessory', rarity: 'common', desc: '\u51DD\u805A\u7075\u6C14\u7684\u53D1\u7C2A', img: '/images/equip/f_acc_1.jpg' }
    ]
  },
  2: { // \u91D1\u4E39\u671F
    male: [
      { id: 'mw2', name: '\u91D1\u7EB9\u6CD5\u888D', type: 'armor', rarity: 'rare', desc: '\u91D1\u4E39\u706B\u7130\u70BC\u5236\u7684\u6CD5\u888D', img: '/images/equip/m_armor_2.jpg' },
      { id: 'mm2', name: '\u91D1\u4E39\u5251', type: 'weapon', rarity: 'rare', desc: '\u4EE5\u91D1\u4E39\u4E4B\u529B\u50AC\u52A8\u7684\u795E\u5251', img: '/images/equip/m_weapon_2.jpg' }
    ],
    female: [
      { id: 'fw2', name: '\u91D1\u7EB9\u7075\u88D9', type: 'armor', rarity: 'rare', desc: '\u91D1\u4E39\u706B\u7130\u7F16\u7EC7\u7684\u534E\u7F8E\u7075\u88D9', img: '/images/equip/f_armor_2.jpg' },
      { id: 'fm2', name: '\u51E4\u9497', type: 'accessory', rarity: 'rare', desc: '\u51E4\u51F0\u9020\u578B\u7684\u7075\u5668\u53D1\u9970', img: '/images/equip/f_acc_2.jpg' }
    ]
  },
  3: { // \u5143\u5A74\u671F
    male: [
      { id: 'mw3', name: '\u5143\u795E\u6218\u7532', type: 'armor', rarity: 'rare', desc: '\u5143\u795E\u706B\u7130\u953B\u9020\u7684\u6218\u7532', img: '/images/equip/m_armor_3.jpg' },
      { id: 'mm3', name: '\u5143\u795E\u5251', type: 'weapon', rarity: 'rare', desc: '\u5143\u795E\u9A71\u4F7F\u7684\u672C\u547D\u6CD5\u5B9D', img: '/images/equip/m_weapon_3.jpg' }
    ],
    female: [
      { id: 'fw3', name: '\u7EA2\u7075\u7532\u88D9', type: 'armor', rarity: 'rare', desc: '\u7EA2\u8272\u7075\u7EB9\u7F16\u7EC7\u7684\u6218\u88D9', img: '/images/equip/f_armor_3.jpg' },
      { id: 'fm3', name: '\u51E4\u51A0', type: 'accessory', rarity: 'rare', desc: '\u51E4\u51F0\u7FBD\u7FFC\u9020\u578B\u7684\u51A0\u9970', img: '/images/equip/f_acc_3.jpg' }
    ]
  },
  4: { // \u5316\u795E\u671F
    male: [
      { id: 'mw4', name: '\u7D2B\u96F7\u6CD5\u888D', type: 'armor', rarity: 'epic', desc: '\u7D2B\u96F7\u4E4B\u529B\u7F16\u7EC7\u7684\u6CD5\u888D', img: '/images/equip/m_armor_4.jpg' },
      { id: 'mm4', name: '\u96F7\u795E\u5251', type: 'weapon', rarity: 'epic', desc: '\u53EC\u5524\u5929\u96F7\u7684\u795E\u5251', img: '/images/equip/m_weapon_4.jpg' }
    ],
    female: [
      { id: 'fw4', name: '\u7D2B\u7075\u6218\u88D9', type: 'armor', rarity: 'epic', desc: '\u7D2B\u8272\u7075\u529B\u7F16\u7EC7\u7684\u6218\u88D9', img: '/images/equip/f_armor_4.jpg' },
      { id: 'fm4', name: '\u7D2B\u7075\u51A0', type: 'accessory', rarity: 'epic', desc: '\u7D2B\u96F7\u51DD\u805A\u7684\u7075\u51A0', img: '/images/equip/f_acc_4.jpg' }
    ]
  },
  5: { // \u70BC\u865A\u671F
    male: [
      { id: 'mw5', name: '\u865A\u7A7A\u6CD5\u888D', type: 'armor', rarity: 'epic', desc: '\u878D\u5165\u865A\u7A7A\u4E4B\u529B\u7684\u6CD5\u888D', img: '/images/equip/m_armor_5.jpg' },
      { id: 'mm5', name: '\u865A\u7A7A\u5203', type: 'weapon', rarity: 'epic', desc: '\u5207\u5272\u7A7A\u95F4\u7684\u65E0\u5F62\u5203', img: '/images/equip/m_weapon_5.jpg' }
    ],
    female: [
      { id: 'fw5', name: '\u865A\u7A7A\u4ED9\u88D9', type: 'armor', rarity: 'epic', desc: '\u865A\u7A7A\u4E4B\u529B\u7F16\u7EC7\u7684\u4ED9\u88D9', img: '/images/equip/f_armor_5.jpg' },
      { id: 'fm5', name: '\u865A\u7A7A\u7C2A', type: 'accessory', rarity: 'epic', desc: '\u7A7F\u900F\u7A7A\u95F4\u7684\u7075\u7C2A', img: '/images/equip/f_acc_5.jpg' }
    ]
  },
  6: { // \u5408\u4F53\u671F
    male: [
      { id: 'mw6', name: '\u5929\u888D', type: 'armor', rarity: 'epic', desc: '\u5929\u5730\u7075\u6C14\u51DD\u805A\u7684\u795E\u888D', img: '/images/equip/m_armor_6.jpg' },
      { id: 'mm6', name: '\u5929\u5251', type: 'weapon', rarity: 'epic', desc: '\u5929\u5730\u7075\u6C14\u5316\u5F62\u7684\u795E\u5251', img: '/images/equip/m_weapon_6.jpg' }
    ],
    female: [
      { id: 'fw6', name: '\u5929\u88D9', type: 'armor', rarity: 'epic', desc: '\u5929\u5730\u7CBE\u534E\u7F16\u7EC7\u7684\u4ED9\u88D9', img: '/images/equip/f_armor_6.jpg' },
      { id: 'fm6', name: '\u5929\u51A0', type: 'accessory', rarity: 'epic', desc: '\u5929\u5730\u7075\u6C14\u51DD\u805A\u7684\u5B9D\u51A0', img: '/images/equip/f_acc_6.jpg' }
    ]
  },
  7: { // \u5927\u4E58\u671F
    male: [
      { id: 'mw7', name: '\u4ED9\u888D', type: 'armor', rarity: 'legendary', desc: '\u91D1\u5149\u7384\u5999\u7684\u4ED9\u4EBA\u6CD5\u888D', img: '/images/equip/m_armor_7.jpg' },
      { id: 'mm7', name: '\u4ED9\u5251', type: 'weapon', rarity: 'legendary', desc: '\u4ED9\u529B\u6CE8\u5165\u7684\u7EDD\u4E16\u795E\u5251', img: '/images/equip/m_weapon_7.jpg' }
    ],
    female: [
      { id: 'fw7', name: '\u4ED9\u88D9', type: 'armor', rarity: 'legendary', desc: '\u91D1\u5149\u7F16\u7EC7\u7684\u4ED9\u4EBA\u7075\u88D9', img: '/images/equip/f_armor_7.jpg' },
      { id: 'fm7', name: '\u4ED9\u51A0', type: 'accessory', rarity: 'legendary', desc: '\u4ED9\u4EBA\u4E13\u5C5E\u7684\u5B9D\u51A0', img: '/images/equip/f_acc_7.jpg' }
    ]
  },
  8: { // \u6E21\u52AB\u671F
    male: [
      { id: 'mw8', name: '\u6E21\u52AB\u6218\u888D', type: 'armor', rarity: 'legendary', desc: '\u6297\u5FA1\u5929\u52AB\u7684\u7EC8\u6781\u6218\u888D', img: '/images/equip/m_armor_8.jpg' },
      { id: 'mm8', name: '\u6E21\u52AB\u4ED9\u5251', type: 'weapon', rarity: 'legendary', desc: '\u65A9\u7834\u5929\u52AB\u7684\u7EC8\u6781\u795E\u5251', img: '/images/equip/m_weapon_8.jpg' }
    ],
    female: [
      { id: 'fw8', name: '\u51E4\u51A0\u4ED9\u88D9', type: 'armor', rarity: 'legendary', desc: '\u51E4\u51F0\u6D85\u69C3\u7684\u7EC8\u6781\u4ED9\u88D9', img: '/images/equip/f_armor_8.jpg' },
      { id: 'fm8', name: '\u51E4\u51A0', type: 'accessory', rarity: 'legendary', desc: '\u6E21\u52AB\u98DE\u4ED9\u7684\u7EC8\u6781\u51A0\u9970', img: '/images/equip/f_acc_8.jpg' }
    ]
  }
};

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

// 获取指定境界和性别的装备套装
function getEquipForRealm(realmIdx, gender) {
  var set = EQUIPMENT_SETS[realmIdx];
  if (!set) return [];
  return gender === 'female' ? set.female : set.male;
}

module.exports = {
  EXAM_DATE: EXAM_DATE,
  REALMS: REALMS,
  EQUIPMENT_SETS: EQUIPMENT_SETS,
  MAX_CULTIVATION: MAX_CULTIVATION,
  DAILY_QUESTIONS: DAILY_QUESTIONS,
  BASE_XP_PER_Q: BASE_XP_PER_Q,
  PERFECT_BONUS: PERFECT_BONUS,
  getCurrentRealm: getCurrentRealm,
  checkBreakthrough: checkBreakthrough,
  getDaysUntilExam: getDaysUntilExam,
  getCultivationDays: getCultivationDays,
  calculatePracticeReward: calculatePracticeReward,
  getCultivationLevel: getCultivationLevel,
  getEquipForRealm: getEquipForRealm
};
