var game = require('../../utils/game');
var cult = require('../../utils/cultivation');
var smartQuiz = require('../../utils/smart-quiz');
var questionLoader = require('../../utils/question-loader');

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
    totalQ: 0,
    totalAnswered: 0,
    correctSet: {},
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

    // Character image path based on gender and realm
    var gender = char.gender || 'male';
    var charImg = '/images/char/char_' + gender + '_' + realmInfo.realmIdx + '.jpg';

    // Current equipment
    var equipItems = [];
    if (realmInfo.realmIdx >= 0) {
      var allEquip = cult.getEquipForRealm(realmInfo.realmIdx, gender);
      // Show equipped items (those the player has earned)
      var owned = char.ownedEquip || [];
      for (var e = 0; e < allEquip.length; e++) {
        var isOwned = owned.indexOf(allEquip[e].id) >= 0;
        equipItems.push({
          id: allEquip[e].id,
          name: allEquip[e].name,
          type: allEquip[e].type,
          rarity: allEquip[e].rarity,
          img: allEquip[e].img,
          owned: isOwned
        });
      }
    }

    var now = new Date();
    var dateStr = (now.getMonth() + 1) + '\u6708' + now.getDate() + '\u65E5';

    this.setData({
      char: char,
      realmInfo: realmInfo,
      totalCultivation: char.totalCultivation || 0,
      daysLeft: daysLeft,
      cultDays: cultDays,
      level: level,
      charImg: charImg,
      charGender: gender,
      equipItems: equipItems,
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

    var history = wx.getStorageSync('answerHistory') || [];
    var subjectBank = {};
    subjectBank[subject] = questionLoader.loadSubject(subject);
    var questions = smartQuiz.selectQuestions(subject, cult.DAILY_QUESTIONS, subjectBank, history);

    if (questions.length === 0) {
      wx.showToast({ title: '\u9898\u5E93\u6682\u65E0\u9898\u76EE', icon: 'none' });
      return;
    }

    this.setData({
      state: 'practice',
      questions: questions,
      totalQ: questions.length,
      totalAnswered: 0,
      qIdx: 0,
      correct: 0,
      correctSet: {},
      results: new Array(questions.length).fill(''),
      selectedOption: -1,
      showResult: false
    });
  },

  selectOption: function(e) {
    if (this.data.showResult) return;

    var idx = parseInt(e.currentTarget.dataset.index);
    var qIdx = this.data.qIdx;
    var q = this.data.questions[qIdx];
    var isCorrect = idx === q.answer;

    var results = this.data.results.slice();
    var firstAnswer = !results[qIdx];
    results[qIdx] = isCorrect ? 'correct' : 'wrong';
    var correct = this.data.correct;
    var correctSet = this.data.correctSet;
    var totalAnswered = this.data.totalAnswered + (firstAnswer ? 1 : 0);

    if (isCorrect && !correctSet[qIdx]) {
      correct++;
      var cs = {};
      for (var k in correctSet) {
        if (correctSet.hasOwnProperty(k)) cs[k] = correctSet[k];
      }
      cs[qIdx] = true;
      correctSet = cs;
    }

    this.setData({
      selectedOption: idx,
      showResult: true,
      results: results,
      correct: correct,
      correctSet: correctSet,
      totalAnswered: totalAnswered
    });
  },

  // ========== Swipe Navigation ==========
  nextQuestion: function() {
    var next = this.data.qIdx + 1;
    if (next >= this.data.questions.length) return;
    this._loadQuestionState(next);
  },

  prevQuestion: function() {
    var prev = this.data.qIdx - 1;
    if (prev < 0) return;
    this._loadQuestionState(prev);
  },

  goToQuestion: function(e) {
    var idx = parseInt(e.currentTarget.dataset.idx);
    if (idx === this.data.qIdx) return;
    // Block: can't navigate to unanswered questions beyond the furthest reached
    this._loadQuestionState(idx);
  },

  retryQuestion: function() {
    var qIdx = this.data.qIdx;
    var results = this.data.results.slice();
    results[qIdx] = '';
    this.setData({
      results: results,
      selectedOption: -1,
      showResult: false
    });
  },

  onTouchStart: function(e) {
    this._touchStartX = e.touches[0].clientX;
    this._touchStartY = e.touches[0].clientY;
  },

  onTouchEnd: function(e) {
    var dx = e.changedTouches[0].clientX - this._touchStartX;
    var dy = e.changedTouches[0].clientY - this._touchStartY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx > 0) this.prevQuestion();
      else this.nextQuestion();
    }
  },

  _loadQuestionState: function(idx) {
    var results = this.data.results;
    var correctSet = this.data.correctSet;
    if (results[idx] === 'correct' || correctSet[idx]) {
      // Correctly answered - show locked state
      this.setData({
        qIdx: idx,
        selectedOption: this.data.questions[idx].answer,
        showResult: true
      });
    } else if (results[idx] === 'wrong') {
      // Wrong - allow retry, clear selection
      this.setData({
        qIdx: idx,
        selectedOption: -1,
        showResult: false
      });
    } else {
      // Unanswered
      this.setData({
        qIdx: idx,
        selectedOption: -1,
        showResult: false
      });
    }
  },

  finishPractice: function() {
    var char = this.data.char;
    var correct = this.data.correct;
    var total = this.data.questions.length;
    var reward = cult.calculatePracticeReward(correct, total);
    var oldXP = char.totalCultivation || 0;
    var newXP = oldXP + reward.xp;

    char.totalCultivation = newXP;
    game.saveGame(char);

    var breakthrough = cult.checkBreakthrough(oldXP, newXP);

    // Grant equipment on realm breakthrough
    var newEquipIds = [];
    var newEquips = [];
    if (breakthrough && breakthrough.type === 'realm') {
      var newRealmIdx = cult.getCurrentRealm(newXP).realmIdx;
      var gender = char.gender || 'male';
      var newEquip = cult.getEquipForRealm(newRealmIdx, gender);
      var ownedEquip = char.ownedEquip || [];
      for (var eq = 0; eq < newEquip.length; eq++) {
        if (ownedEquip.indexOf(newEquip[eq].id) < 0) {
          ownedEquip.push(newEquip[eq].id);
          newEquipIds.push(newEquip[eq].id);
          newEquips.push(newEquip[eq]);
        }
      }
      char.ownedEquip = ownedEquip;
      char.equippedSet = newRealmIdx;
      game.saveGame(char);
    }

    // 保存答题记录 (只保存最终答对的)
    var history = wx.getStorageSync('answerHistory') || [];
    var questions = this.data.questions;
    var correctSet = this.data.correctSet;
    var subject = this.data.selectedSubject;
    var now = new Date();
    var dateStr = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

    for (var h = 0; h < questions.length; h++) {
      history.push({
        q: questions[h].q,
        options: questions[h].options,
        answer: questions[h].answer,
        correct: !!correctSet[h],
        subject: subject,
        date: dateStr,
        explain: questions[h].explain || '',
        tags: questions[h].tags || []
      });
    }
    if (history.length > 200) {
      history = history.slice(history.length - 200);
    }
    wx.setStorageSync('answerHistory', history);

    // 更新间隔复习计划
    var reviewResults = [];
    for (var r = 0; r < questions.length; r++) {
      reviewResults.push({
        qKey: smartQuiz.questionKey(questions[r]),
        correct: !!correctSet[r]
      });
    }
    smartQuiz.batchUpdateReview(reviewResults);

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
      resultIcon: resultIcon,
      newEquipIds: newEquipIds,
      newEquips: newEquips
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
