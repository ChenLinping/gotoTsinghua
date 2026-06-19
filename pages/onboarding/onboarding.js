var game = require('../../utils/game');

// Unicode emojis for WXML
var EM_SWORD = '\u2694\uFE0F';
var EM_CRYSTAL = '\uD83D\uDD2E';
var EM_SCROLL = '\uD83D\uDCDC';
var EM_STAR = '\u2B50';
var EM_FIRE = '\uD83D\uDD25';
var EM_SPARKLE = '\u2728';

var SUBJECTS = [
  { key: 'chinese', name: '\u8BED\u6587', icon: '\uD83D\uDCDC', max: 150, color: '#f59e0b' },
  { key: 'math', name: '\u6570\u5B66', icon: '\uD83D\uDCD0', max: 150, color: '#6366f1' },
  { key: 'english', name: '\u82F1\u8BED', icon: '\uD83D\uDD24', max: 150, color: '#ec4899' },
  { key: 'physics', name: '\u7269\u7406', icon: '\u26A1', max: 100, color: '#0891b2' },
  { key: 'chemistry', name: '\u5316\u5B66', icon: '\uD83E\uDDEA', max: 100, color: '#10b981' },
  { key: 'biology', name: '\u751F\u7269', icon: '\uD83E\uDDEC', max: 100, color: '#8b5cf6' }
];

Page({
  data: {
    step: 0,
    name: '',
    nameError: '',
    selectedGender: '',
    subjects: SUBJECTS,
    totalScore: 0,
    maxTotal: 750,
    scoreWarning: '',
    welcomeMsg: '',
    welcomeTitle: '',
    // Cinematic
    cinematicTexts: [
      '\u7075\u6839\u9274\u5B9A\u5B8C\u6210...',
      '\u53D1\u73B0\u4FEE\u4ED9\u5929\u8D4B...',
      '\u8E0F\u5165\u4FEE\u884C\u4E4B\u8DEF...'
    ],
    cinematicIdx: 0,
    cinematicDone: false,
    // System
    statusBarHeight: 20,
    // Particles
    particles: ['p1','p2','p3','p4','p5','p6']
  },

  onLoad: function() {
    var sysInfo = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: sysInfo.statusBarHeight || 20 });

    var char = game.loadGame();
    if (char && char.name) {
      wx.switchTab({ url: '/pages/map/map' });
    }
  },

  // ========== Step 0: Brand Splash ==========
  enterGame: function() {
    this.setData({ step: 1 });
  },

  // ========== Step 1: Name Input ==========
  onNameInput: function(e) {
    this.setData({ name: e.detail.value, nameError: '' });
  },

  confirmName: function() {
    var name = (this.data.name || '').trim();
    if (!name) {
      this.setData({ nameError: '\u8BF7\u8F93\u5165\u4F60\u7684\u540D\u5B57' });
      return;
    }
    if (name.length > 8) {
      this.setData({ nameError: '\u540D\u5B57\u4E0D\u80FD\u8D85\u8FC78\u4E2A\u5B57' });
      return;
    }
    this.setData({ step: 2 });
  },

  // ========== Step 2: Gender Selection ==========
  selectGender: function(e) {
    var gender = e.currentTarget.dataset.gender;
    this.setData({ selectedGender: gender, step: 3 });
  },

  // ========== Step 3: Score Input ==========
  onScoreInput: function(e) {
    var idx = e.currentTarget.dataset.idx;
    var val = e.detail.value;
    var subjects = this.data.subjects.slice();
    subjects[idx].score = val;

    var total = 0;
    var warning = '';
    for (var i = 0; i < subjects.length; i++) {
      var num = parseInt(subjects[i].score, 10);
      if (!isNaN(num) && num > 0) {
        if (num > subjects[i].max) {
          warning = subjects[i].name + '\u4E0D\u80FD\u8D85\u8FC7' + subjects[i].max + '\u5206';
        }
        total += num;
      }
    }
    if (total > 750) {
      warning = '\u603B\u5206\u4E0D\u80FD\u8D85\u8FC7750\u5206';
    }

    this.setData({
      subjects: subjects,
      totalScore: total,
      scoreWarning: warning
    });
  },

  confirmScores: function() {
    if (this.data.scoreWarning) return;

    // Generate personalized welcome
    var total = this.data.totalScore;
    var name = (this.data.name || '').trim();
    var msg, title;

    if (total >= 650) {
      title = '\u5929\u7EB5\u5947\u624D\uFF01';
      msg = name + '\uFF0C\u9AA8\u9ABC\u6E05\u5947\uFF0C\u5FC5\u6210\u5927\u5668\uFF01\u4FEE\u4ED9\u4E4B\u8DEF\u5DF2\u4E3A\u4F60\u5F00\u542F\uFF01';
    } else if (total >= 550) {
      title = '\u9AA8\u9ABC\u6E05\u5947\uFF01';
      msg = '\u5C11\u5E74\u770B\u4F60\u9AA8\u9ABC\u6E05\u5947\uFF0C\u4E00\u5B9A\u662F\u4FEE\u4ED9\u7684\u597D\u6750\u6599\uFF01' + name + '\uFF0C\u8BA9\u6211\u4EEC\u5F00\u59CB\u4FEE\u4ED9\u4E4B\u8DEF\u5427\uFF01';
    } else if (total >= 450) {
      title = '\u52E4\u80FD\u8865\u62D9\uFF01';
      msg = name + '\uFF0C\u6839\u9AA8\u5C1A\u53EF\uFF0C\u52E4\u80FD\u8865\u62D9\uFF0C\u4FEE\u4ED9\u4E4B\u8DEF\u91CD\u5728\u575A\u6301\uFF01';
    } else {
      title = '\u6F5C\u529B\u65E0\u9650\uFF01';
      msg = name + '\uFF0C\u4E07\u4E2D\u65E0\u4E00\u7684...\u6F5C\u529B\u80A1\uFF01\u4FEE\u4ED9\u4E4B\u8DEF\u4ECE\u811A\u4E0B\u5F00\u59CB\uFF01';
    }

    this.setData({
      welcomeMsg: msg,
      welcomeTitle: title,
      step: 4
    });
  },

  // ========== Step 4: Ceremonial Welcome ==========
  startCinematic: function() {
    this._saveCharacter();
    this.setData({ step: 5, cinematicIdx: 0, cinematicDone: false });
    this._runCinematic();
  },

  _runCinematic: function() {
    var self = this;
    var texts = this.data.cinematicTexts;
    var idx = 0;

    function showNext() {
      if (idx >= texts.length) {
        // All done, transition to main page
        setTimeout(function() {
          wx.switchTab({ url: '/pages/map/map' });
        }, 1500);
        self.setData({ cinematicDone: true });
        return;
      }
      self.setData({ cinematicIdx: idx });
      idx++;
      setTimeout(showNext, 2200);
    }

    showNext();
  },

  skipCinematic: function() {
    wx.switchTab({ url: '/pages/map/map' });
  },

  // ========== Save Character ==========
  _saveCharacter: function() {
    var char = game.createCharacter();
    char.name = (this.data.name || '').trim();
    char.gender = this.data.selectedGender;

    // Grant realm 0 starting equipment
    if (char.gender === 'female') {
      char.ownedEquip = ['fw0', 'fm0'];
    } else {
      char.ownedEquip = ['mw0', 'mm0'];
    }
    char.equippedSet = 0;

    var scores = {};
    var subjects = this.data.subjects;
    for (var i = 0; i < subjects.length; i++) {
      var num = parseInt(subjects[i].score, 10);
      scores[subjects[i].key] = isNaN(num) ? 0 : num;
    }
    char.initialScores = scores;
    char.lastPlayDate = new Date().toISOString().slice(0, 10);
    char.streakDays = 1;
    char.totalCultivation = 0;
    char.cultivationStartDate = new Date().toISOString();

    game.saveGame(char);
  },

  // ========== Navigation ==========
  goBack: function() {
    var s = this.data.step;
    if (s > 0 && s < 5) {
      this.setData({ step: s - 1 });
    }
  }
});
