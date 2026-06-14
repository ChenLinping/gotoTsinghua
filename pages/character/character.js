var game = require('../../utils/game');
var cult = require('../../utils/cultivation');

var SUBJECT_NAMES = {
  math: '\u6570\u5B66',
  english: '\u82F1\u8BED',
  chinese: '\u8BED\u6587',
  physics: '\u7269\u7406',
  chemistry: '\u5316\u5B66',
  biology: '\u751F\u7269'
};

Page({
  data: {
    char: null,
    realmInfo: null,
    totalCultivation: 0,
    daysLeft: 0,
    cultDays: 0,
    streakDays: 0,

    // Answer stats
    totalAnswers: 0,
    correctCount: 0,
    wrongCount: 0,
    correctRate: 0,

    // Subject breakdown
    subjectStats: [],
    maxSubjectCount: 1,

    // Realm timeline
    realms: [],
    realmIdx: 0,
    realmProgress: 0
  },

  onLoad: function () {
    this.loadStats();
  },

  onShow: function () {
    this.loadStats();
  },

  loadStats: function () {
    var char = game.loadGame();
    if (!char) {
      wx.showToast({ title: '\u672A\u627E\u5230\u89D2\u8272\u6570\u636E', icon: 'none' });
      return;
    }

    // Cultivation info
    var totalCultivation = char.totalCultivation || 0;
    var realmInfo = cult.getCurrentRealm(totalCultivation);
    var daysLeft = cult.getDaysUntilExam();
    var cultDays = cult.getCultivationDays(char.cultivationStartDate);

    // Answer history stats
    var history = wx.getStorageSync('answerHistory') || [];
    var totalAnswers = history.length;
    var correctCount = 0;
    var subjectMap = {};

    for (var i = 0; i < history.length; i++) {
      if (history[i].correct) correctCount++;
      var s = history[i].subject || 'mixed';
      if (!subjectMap[s]) subjectMap[s] = 0;
      subjectMap[s]++;
    }

    var wrongCount = totalAnswers - correctCount;
    var correctRate = totalAnswers > 0 ? Math.round((correctCount / totalAnswers) * 100) : 0;

    // Subject breakdown
    var subjectStats = [];
    var maxSubjectCount = 1;
    var keys = ['math', 'english', 'physics', 'chemistry', 'biology', 'chinese'];
    for (var k = 0; k < keys.length; k++) {
      var key = keys[k];
      var count = subjectMap[key] || 0;
      if (count > maxSubjectCount) maxSubjectCount = count;
      subjectStats.push({
        key: key,
        name: SUBJECT_NAMES[key] || key,
        count: count
      });
    }

    // Realm timeline data
    var realms = cult.REALMS.map(function (r) {
      return { name: r.name, icon: r.icon, color: r.color };
    });

    this.setData({
      char: char,
      realmInfo: realmInfo,
      totalCultivation: totalCultivation,
      daysLeft: daysLeft,
      cultDays: cultDays,
      streakDays: char.streakDays || 0,
      totalAnswers: totalAnswers,
      correctCount: correctCount,
      wrongCount: wrongCount,
      correctRate: correctRate,
      subjectStats: subjectStats,
      maxSubjectCount: maxSubjectCount,
      realms: realms,
      realmIdx: realmInfo.realmIdx,
      realmProgress: realmInfo.progress
    });
  }
});
