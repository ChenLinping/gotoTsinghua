var game = require('../../utils/game');
var cult = require('../../utils/cultivation');

// ========== 奖状定义 ==========
var REALM_CERTS = [
  { id: 'rc_0', name: '\u7EC3\u6C14\u5165\u95E8\u72B6', icon: '\uD83C\uDF31', desc: '\u6210\u529F\u7A81\u7834\u81F3\u7B51\u57FA\u671F', rarity: 'common' },
  { id: 'rc_1', name: '\u7B51\u57FA\u6210\u529F\u72B6', icon: '\uD83E\uDDDE', desc: '\u6210\u529F\u7A81\u7834\u81F3\u91D1\u4E39\u671F', rarity: 'common' },
  { id: 'rc_2', name: '\u91D1\u4E39\u5927\u6210\u72B6', icon: '\u2728', desc: '\u6210\u529F\u7A81\u7834\u81F3\u5143\u5A74\u671F', rarity: 'rare' },
  { id: 'rc_3', name: '\u5143\u5A74\u51FA\u7A8D\u72B6', icon: '\uD83D\uDD25', desc: '\u6210\u529F\u7A81\u7834\u81F3\u5316\u795E\u671F', rarity: 'rare' },
  { id: 'rc_4', name: '\u5316\u795E\u901A\u5929\u72B6', icon: '\u26A1', desc: '\u6210\u529F\u7A81\u7834\u81F3\u70BC\u865A\u671F', rarity: 'epic' },
  { id: 'rc_5', name: '\u70BC\u865A\u5F52\u771F\u72B6', icon: '\uD83C\uDF00', desc: '\u6210\u529F\u7A81\u7834\u81F3\u5408\u4F53\u671F', rarity: 'epic' },
  { id: 'rc_6', name: '\u5408\u4F53\u5929\u6210\u72B6', icon: '\uD83D\uDCAB', desc: '\u6210\u529F\u7A81\u7834\u81F3\u5927\u4E58\u671F', rarity: 'legendary' },
  { id: 'rc_7', name: '\u5927\u4E58\u5706\u6EE1\u72B6', icon: '\uD83C\uDF1F', desc: '\u6210\u529F\u7A81\u7834\u81F3\u6E21\u52AB\u671F', rarity: 'legendary' }
];

var CULT_ACHIEVEMENTS = [
  { id: 'ca_1', name: '\u521D\u5165\u4ED9\u95E8', icon: '\uD83D\uDCDC', desc: '\u7D2F\u8BA1\u4FEE\u4E3A\u8FBE1000', check: function(c) { return c >= 1000; }, rarity: 'common' },
  { id: 'ca_2', name: '\u5C0F\u6709\u6210\u5C31', icon: '\uD83D\uDCD6', desc: '\u7D2F\u8BA1\u4FEE\u4E3A\u8FBE3000', check: function(c) { return c >= 3000; }, rarity: 'common' },
  { id: 'ca_3', name: '\u4FEE\u4ED9\u8FBE\u4EBA', icon: '\uD83C\uDFC5', desc: '\u7D2F\u8BA1\u4FEE\u4E3A\u8FBE5000', check: function(c) { return c >= 5000; }, rarity: 'rare' },
  { id: 'ca_4', name: '\u4ED9\u9053\u7CBE\u82F1', icon: '\uD83C\uDFC6', desc: '\u7D2F\u8BA1\u4FEE\u4E3A\u8FBE10000', check: function(c) { return c >= 10000; }, rarity: 'epic' },
  { id: 'ca_5', name: '\u4E09\u65E5\u4E4B\u529F', icon: '\uD83D\uDCC5', desc: '\u8FDE\u7EED\u4FEE\u884C3\u5929', check: function(c, s) { return s >= 3; }, rarity: 'common' },
  { id: 'ca_6', name: '\u4E03\u65E5\u4E0D\u8F8D', icon: '\uD83D\uDD25', desc: '\u8FDE\u7EED\u4FEE\u884C7\u5929', check: function(c, s) { return s >= 7; }, rarity: 'rare' },
  { id: 'ca_7', name: '\u6708\u5EA6\u575A\u6301', icon: '\uD83D\uDCAA', desc: '\u8FDE\u7EED\u4FEE\u884C30\u5929', check: function(c, s) { return s >= 30; }, rarity: 'epic' },
  { id: 'ca_8', name: '\u767E\u65E5\u4FEE\u7EC3', icon: '\uD83C\uDFC6', desc: '\u8FDE\u7EED\u4FEE\u884C100\u5929', check: function(c, s) { return s >= 100; }, rarity: 'legendary' }
];

var ANSWER_RECORDS = [
  { id: 'ar_1', name: '\u521D\u6218\u544A\u6377', icon: '\u2694\uFE0F', desc: '\u7D2F\u8BA1\u7B54\u5BF910\u9898', check: function(c) { return c >= 10; }, rarity: 'common' },
  { id: 'ar_2', name: '\u5341\u8FDE\u65A9', icon: '\uD83D\uDDE1\uFE0F', desc: '\u7D2F\u8BA1\u7B54\u5BF950\u9898', check: function(c) { return c >= 50; }, rarity: 'common' },
  { id: 'ar_3', name: '\u534A\u767E\u5C5E\u5C06', icon: '\uD83C\uDFF9', desc: '\u7D2F\u8BA1\u7B54\u5BF9100\u9898', check: function(c) { return c >= 100; }, rarity: 'rare' },
  { id: 'ar_4', name: '\u767E\u9898\u730E\u4EBA', icon: '\uD83C\uDFAF', desc: '\u7D2F\u8BA1\u7B54\u5BF9200\u9898', check: function(c) { return c >= 200; }, rarity: 'rare' },
  { id: 'ar_5', name: '\u7B54\u9898\u65E0\u654C', icon: '\uD83D\uDCA5', desc: '\u7D2F\u8BA1\u7B54\u5BF9500\u9898', check: function(c) { return c >= 500; }, rarity: 'epic' },
  { id: 'ar_6', name: '\u4E07\u9898\u5B97\u5E08', icon: '\uD83D\uDCD6', desc: '\u7D2F\u8BA1\u7B54\u5BF91000\u9898', check: function(c) { return c >= 1000; }, rarity: 'legendary' }
];

var SUBJECT_MEDALS = [
  { id: 'sm_math', name: '\u6570\u5B66\u8FBE\u4EBA', icon: '\uD83D\uDCD0', desc: '\u6570\u5B66\u7B54\u5BF950\u9898', subject: 'math', need: 50, rarity: 'rare' },
  { id: 'sm_eng', name: '\u82F1\u8BED\u5927\u5E08', icon: '\uD83D\uDD24', desc: '\u82F1\u8BED\u7B54\u5BF950\u9898', subject: 'english', need: 50, rarity: 'rare' },
  { id: 'sm_phy', name: '\u7269\u7406\u5929\u624D', icon: '\u26A1', desc: '\u7269\u7406\u7B54\u5BF950\u9898', subject: 'physics', need: 50, rarity: 'rare' },
  { id: 'sm_chem', name: '\u5316\u5B66\u5947\u624D', icon: '\uD83E\uDDEA', desc: '\u5316\u5B66\u7B54\u5BF950\u9898', subject: 'chemistry', need: 50, rarity: 'rare' },
  { id: 'sm_bio', name: '\u751F\u7269\u4E4B\u661F', icon: '\uD83E\uDDEC', desc: '\u751F\u7269\u7B54\u5BF950\u9898', subject: 'biology', need: 50, rarity: 'rare' },
  { id: 'sm_cn', name: '\u8BED\u6587\u7FE0\u7FD4', icon: '\uD83D\uDCDC', desc: '\u8BED\u6587\u7B54\u5BF950\u9898', subject: 'chinese', need: 50, rarity: 'rare' }
];

var RARITY_NAMES = {
  common: '\u666E\u901A',
  rare: '\u7A00\u6709',
  epic: '\u53F2\u8BD7',
  legendary: '\u4F20\u8BF4'
};

var SUBJECT_NAMES = {
  math: '\u6570\u5B66', english: '\u82F1\u8BED', chinese: '\u8BED\u6587',
  physics: '\u7269\u7406', chemistry: '\u5316\u5B66', biology: '\u751F\u7269'
};

Page({
  data: {
    char: null,
    realmInfo: null,
    realmName: '',
    stageName: '',
    realmColor: '#10b981',
    realmIcon: '\uD83C\uDF31',
    totalCultivation: 0,
    totalCorrect: 0,
    // Categories
    realmCerts: [],
    cultAchievements: [],
    answerRecords: [],
    subjectMedals: [],
    // Counts
    earnedRealm: 0,
    earnedCult: 0,
    earnedAnswer: 0,
    earnedSubject: 0
  },

  onShow: function() {
    this._loadBag();
  },

  _loadBag: function() {
    var char = game.loadGame();
    if (!char) return;

    var totalCultivation = char.totalCultivation || 0;
    var realmInfo = cult.getCurrentRealm(totalCultivation);
    var streakDays = char.streakDays || 0;

    // Answer history
    var history = wx.getStorageSync('answerHistory') || [];
    var totalCorrect = 0;
    var subjectCorrect = {};
    for (var i = 0; i < history.length; i++) {
      if (history[i].correct) {
        totalCorrect++;
        var s = history[i].subject || '';
        subjectCorrect[s] = (subjectCorrect[s] || 0) + 1;
      }
    }

    // 1. Realm certificates: earned if user has passed that realm
    var realmIdx = realmInfo.realmIdx;
    var realmCerts = [];
    var earnedRealm = 0;
    for (var r = 0; r < REALM_CERTS.length; r++) {
      var earned = realmIdx > r;
      if (earned) earnedRealm++;
      realmCerts.push({
        id: REALM_CERTS[r].id,
        name: REALM_CERTS[r].name,
        icon: REALM_CERTS[r].icon,
        desc: REALM_CERTS[r].desc,
        rarity: REALM_CERTS[r].rarity,
        earned: earned
      });
    }

    // 2. Cultivation achievements
    var cultAchievements = [];
    var earnedCult = 0;
    for (var c = 0; c < CULT_ACHIEVEMENTS.length; c++) {
      var a = CULT_ACHIEVEMENTS[c];
      var earned = a.check(totalCultivation, streakDays);
      if (earned) earnedCult++;
      cultAchievements.push({
        id: a.id, name: a.name, icon: a.icon,
        desc: a.desc, rarity: a.rarity, earned: earned
      });
    }

    // 3. Answer records
    var answerRecords = [];
    var earnedAnswer = 0;
    for (var ar = 0; ar < ANSWER_RECORDS.length; ar++) {
      var rec = ANSWER_RECORDS[ar];
      var earned = rec.check(totalCorrect);
      if (earned) earnedAnswer++;
      answerRecords.push({
        id: rec.id, name: rec.name, icon: rec.icon,
        desc: rec.desc, rarity: rec.rarity, earned: earned
      });
    }

    // 4. Subject medals
    var subjectMedals = [];
    var earnedSubject = 0;
    for (var sm = 0; sm < SUBJECT_MEDALS.length; sm++) {
      var medal = SUBJECT_MEDALS[sm];
      var sc = subjectCorrect[medal.subject] || 0;
      var earned = sc >= medal.need;
      if (earned) earnedSubject++;
      subjectMedals.push({
        id: medal.id, name: medal.name, icon: medal.icon,
        desc: medal.desc + ' (' + sc + '/' + medal.need + ')',
        rarity: medal.rarity, earned: earned,
        progress: Math.min(1, sc / medal.need)
      });
    }

    this.setData({
      char: char,
      realmInfo: realmInfo,
      realmName: realmInfo.realm.name,
      stageName: realmInfo.stage.name,
      realmColor: realmInfo.realm.color,
      realmIcon: realmInfo.realm.icon,
      totalCultivation: totalCultivation,
      totalCorrect: totalCorrect,
      realmCerts: realmCerts,
      cultAchievements: cultAchievements,
      answerRecords: answerRecords,
      subjectMedals: subjectMedals,
      earnedRealm: earnedRealm,
      earnedCult: earnedCult,
      earnedAnswer: earnedAnswer,
      earnedSubject: earnedSubject
    });
  }
});
