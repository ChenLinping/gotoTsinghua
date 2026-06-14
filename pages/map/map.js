var game = require('../../utils/game');
var cult = require('../../utils/cultivation');

// Emoji Unicode strings (WXML不支持HTML实体)
var EM_FIRE = '\uD83D\uDD25';       // 🔥
var EM_CHECK = '\u2705';             // ✅
var EM_TROPHY = '\uD83C\uDFC6';      // 🏆
var EM_STAR = '\u2B50';              // ⭐
var EM_FLEX = '\uD83D\uDCAA';        // 💪
var EM_ARROW = '\u27A1\uFE0F';       // ➡️

var SUBJECTS = [
  { id: 'math', name: '\u6570\u5B66', icon: '\uD83D\uDCD0' },
  { id: 'english', name: '\u82F1\u8BED', icon: '\uD83D\uDD24' },
  { id: 'physics', name: '\u7269\u7406', icon: '\u26A1' },
  { id: 'chemistry', name: '\u5316\u5B66', icon: '\uD83E\uDDEA' },
  { id: 'biology', name: '\u751F\u7269', icon: '\uD83E\uDDEC' },
  { id: 'chinese', name: '\u8BED\u6587', icon: '\uD83D\uDCD6' }
];

Page({
  data: {
    char: null,
    // 境界
    realmInfo: null,
    totalCultivation: 0,
    daysLeft: 0,
    cultDays: 0,
    level: 1,
    // 状态: idle | practice | result
    state: 'idle',
    // 每日练习
    subjects: SUBJECTS,
    selectedSubject: null,
    questions: [],
    qIdx: 0,
    correct: 0,
    results: [],
    selectedOption: -1,
    showResult: false,
    // 今日记录
    todayDone: false,
    todayXP: 0,
    todayCorrect: 0,
    todayTotal: 0,
    // 突破
    breakthroughInfo: null,
    showBreakthrough: false,
    // 日期
    dateStr: '',
    // Emoji (WXML不支持HTML实体)
    emFire: EM_FIRE,
    emCheck: EM_CHECK,
    emArrow: EM_ARROW,
    resultIcon: EM_TROPHY
  },

  onLoad: function() {
    this._initData();
  },

  onShow: function() {
    this._initData();
  },

  _initData: function() {
    var char = game.loadGame();
    if (!char) {
      wx.redirectTo({ url: '/pages/onboarding/onboarding' });
      return;
    }
    char = game.updateStreak(char);

    if (!char.totalCultivation) char.totalCultivation = 0;
    if (!char.cultivationStartDate) {
      char.cultivationStartDate = new Date().toISOString();
      game.saveGame(char);
    }

    var realmInfo = cult.getCurrentRealm(char.totalCultivation);
    var daysLeft = cult.getDaysUntilExam();
    var cultDays = cult.getCultivationDays(char.cultivationStartDate);
    var level = cult.getCultivationLevel(char.totalCultivation);

    var now = new Date();
    var dateStr = (now.getMonth() + 1) + '\u6708' + now.getDate() + '\u65E5';

    this.setData({
      char: char,
      realmInfo: realmInfo,
      totalCultivation: char.totalCultivation || 0,
      daysLeft: daysLeft,
      cultDays: cultDays,
      level: level,
      todayDone: false,
      state: 'idle',
      selectedSubject: null,
      dateStr: dateStr
    });
  },

  selectSubject: function(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({ selectedSubject: id });
  },

  startPractice: function() {
    var subject = this.data.selectedSubject;
    if (!subject) {
      wx.showToast({ title: '\u8BF7\u5148\u9009\u62E9\u79D1\u76EE', icon: 'none' });
      return;
    }

    var questions = [];
    for (var i = 0; i < cult.DAILY_QUESTIONS; i++) {
      var q = game.getQuestion(subject, 'easy');
      if (q) questions.push(q);
    }

    if (questions.length === 0) {
      wx.showToast({ title: '\u9898\u5E93\u6682\u65E0\u9898\u76EE', icon: 'none' });
      return;
    }

    this.setData({
      state: 'practice',
      questions: questions,
      qIdx: 0,
      correct: 0,
      results: new Array(questions.length).fill(''),
      selectedOption: -1,
      showResult: false
    });
  },

  selectOption: function(e) {
    if (this.data.showResult) return;

    var idx = parseInt(e.currentTarget.dataset.index);
    var q = this.data.questions[this.data.qIdx];
    var isCorrect = idx === q.answer;

    var results = this.data.results.slice();
    results[this.data.qIdx] = isCorrect ? 'correct' : 'wrong';
    var correct = this.data.correct + (isCorrect ? 1 : 0);

    this.setData({
      selectedOption: idx,
      showResult: true,
      results: results,
      correct: correct
    });

    var self = this;
    setTimeout(function() {
      self._nextQuestion();
    }, 1200);
  },

  _nextQuestion: function() {
    var next = this.data.qIdx + 1;
    if (next >= this.data.questions.length) {
      this._finishPractice();
      return;
    }
    this.setData({
      qIdx: next,
      selectedOption: -1,
      showResult: false
    });
  },

  _finishPractice: function() {
    var char = this.data.char;
    var correct = this.data.correct;
    var total = this.data.questions.length;
    var reward = cult.calculatePracticeReward(correct, total);
    var oldXP = char.totalCultivation || 0;
    var newXP = oldXP + reward.xp;

    char.totalCultivation = newXP;
    game.saveGame(char);

    var breakthrough = cult.checkBreakthrough(oldXP, newXP);

    // 保存答题记录
    var history = wx.getStorageSync('answerHistory') || [];
    var questions = this.data.questions;
    var results = this.data.results;
    var subject = this.data.selectedSubject;
    var now = new Date();
    var dateStr = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

    for (var h = 0; h < questions.length; h++) {
      if (results[h]) {
        history.push({
          q: questions[h].q,
          options: questions[h].options,
          answer: questions[h].answer,
          correct: results[h] === 'correct',
          subject: subject,
          date: dateStr,
          explain: questions[h].explain || ''
        });
      }
    }
    if (history.length > 200) {
      history = history.slice(history.length - 200);
    }
    wx.setStorageSync('answerHistory', history);

    var realmInfo = cult.getCurrentRealm(newXP);

    var resultIcon = EM_TROPHY;
    if (correct < total * 0.8) {
      resultIcon = correct >= total * 0.5 ? EM_STAR : EM_FLEX;
    }

    this.setData({
      state: 'result',
      todayXP: reward.xp,
      todayCorrect: correct,
      todayTotal: total,
      totalCultivation: newXP,
      realmInfo: realmInfo,
      char: char,
      resultIcon: resultIcon
    });

    if (breakthrough) {
      var self = this;
      setTimeout(function() {
        self.setData({
          breakthroughInfo: breakthrough,
          showBreakthrough: true
        });
      }, 1500);
    }
  },

  closeBreakthrough: function() {
    this.setData({ showBreakthrough: false, breakthroughInfo: null });
  },

  backToIdle: function() {
    this._initData();
  }
});
