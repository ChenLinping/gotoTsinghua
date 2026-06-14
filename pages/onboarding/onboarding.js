var game = require('../../utils/game');

Page({
  data: {
    step: 0,
    name: '',
    nameError: '',

    // 6 subjects for score input
    subjects: [
      { key: 'math', name: '数学', icon: '📐', color: '#6366f1', desc: '逻辑之力', score: '', placeholder: '如: 120' },
      { key: 'english', name: '英语', icon: '🌍', color: '#ec4899', desc: '语言之力', score: '', placeholder: '如: 130' },
      { key: 'chinese', name: '语文', icon: '📜', color: '#f59e0b', desc: '文字之力', score: '', placeholder: '如: 115' },
      { key: 'physics', name: '物理', icon: '⚡', color: '#0891b2', desc: '自然之力', score: '', placeholder: '如: 85' },
      { key: 'chemistry', name: '化学', icon: '🧪', color: '#10b981', desc: '变化之力', score: '', placeholder: '如: 80' },
      { key: 'biology', name: '生物', icon: '🧬', color: '#8b5cf6', desc: '生命之力', score: '', placeholder: '如: 78' }
    ],

    totalScore: 0,
    startLevel: 1,
    scoreAnalysis: '',
    statusBarHeight: 20
  },

  onLoad: function () {
    var sysInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sysInfo.statusBarHeight || 20
    });

    // Check if already has a character
    var char = game.loadGame();
    if (char && char.name) {
      wx.switchTab({ url: '/pages/map/map' });
    }
  },

  // ========== Step 0: 欢迎 ==========
  startAdventure: function () {
    this.setData({ step: 1 });
  },

  // ========== Step 1: 名字输入 ==========
  onNameInput: function (e) {
    var val = e.detail.value;
    this.setData({
      name: val,
      nameError: ''
    });
  },

  confirmName: function () {
    var name = (this.data.name || '').trim();
    if (!name) {
      this.setData({ nameError: '请输入你的名字' });
      return;
    }
    if (name.length > 8) {
      this.setData({ nameError: '名字不能超过8个字' });
      return;
    }
    this.setData({ step: 2 });
  },

  // ========== Step 2: 成绩输入 ==========
  onScoreInput: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var val = e.detail.value;
    var subjects = this.data.subjects.slice();
    subjects[idx].score = val;

    // Calculate total
    var total = 0;
    subjects.forEach(function (s) {
      var num = parseInt(s.score, 10);
      if (!isNaN(num) && num > 0) {
        total += num;
      }
    });

    // Calculate start level
    var startLevel = 1;
    if (total >= 600) startLevel = 8;
    else if (total >= 550) startLevel = 6;
    else if (total >= 500) startLevel = 5;
    else if (total >= 450) startLevel = 4;
    else if (total >= 400) startLevel = 3;
    else if (total >= 300) startLevel = 2;

    // Generate analysis text
    var analysis = '';
    if (total >= 600) {
      analysis = '卓越的天赋！你将以高起点开始修行！';
    } else if (total >= 500) {
      analysis = '出色的基础！你拥有不错的修行资质。';
    } else if (total >= 400) {
      analysis = '良好的基础。努力修行，前途无量！';
    } else if (total > 0) {
      analysis = '修行之路才刚开始，每一步都是积累！';
    }

    this.setData({
      subjects: subjects,
      totalScore: total,
      startLevel: startLevel,
      scoreAnalysis: analysis
    });
  },

  confirmScores: function () {
    this.setData({ step: 3 });
  },

  // ========== Step 3: 完成 ==========
  enterWorld: function () {
    var char = game.createCharacter();
    char.name = (this.data.name || '').trim();

    // Save initial scores
    var scores = {};
    this.data.subjects.forEach(function (s) {
      var num = parseInt(s.score, 10);
      scores[s.key] = isNaN(num) ? 0 : num;
    });
    char.initialScores = scores;

    // Set play date
    char.lastPlayDate = new Date().toISOString().slice(0, 10);
    char.streakDays = 1;

    // Cultivation fields
    char.totalCultivation = 0;
    char.cultivationStartDate = new Date().toISOString();

    game.saveGame(char);

    wx.showToast({
      title: '\u6B22\u8FCE\u6765\u5230\u4FEE\u4ED9\u4E4B\u8DEF\uFF01',
      icon: 'success',
      duration: 1500
    });

    setTimeout(function () {
      wx.switchTab({ url: '/pages/map/map' });
    }, 1500);
  },

  // ========== 导航 ==========
  goBack: function () {
    if (this.data.step > 0) {
      this.setData({ step: this.data.step - 1 });
    }
  }
});
