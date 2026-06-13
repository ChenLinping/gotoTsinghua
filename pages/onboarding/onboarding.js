var data = require('../../utils/data');

Page({
  data: {
    step: 0,
    name: '',
    subjects: [
      { key: 'math', name: '数学', icon: '📐', max: 150, score: '' },
      { key: 'english', name: '英语', icon: '🌍', max: 150, score: '' },
      { key: 'chinese', name: '语文', icon: '📖', max: 150, score: '' },
      { key: 'physics', name: '物理', icon: '⚡', max: 100, score: '' },
      { key: 'chemistry', name: '化学', icon: '🧪', max: 100, score: '' },
      { key: 'biology', name: '生物', icon: '🧬', max: 100, score: '' }
    ],
    analysis: null,
    totalScore: 0,
    totalMax: 750,
    canNext: false,
    statusBarHeight: 20
  },

  onLoad: function () {
    var that = this;
    var sysInfo = wx.getSystemInfoSync();
    that.setData({
      statusBarHeight: sysInfo.statusBarHeight || 20
    });
  },

  nextStep: function () {
    var that = this;
    var step = that.data.step;

    if (step === 1) {
      if (!that.data.name || that.data.name.trim().length === 0) {
        wx.showToast({ title: '请输入你的名字', icon: 'none' });
        return;
      }
    }

    if (step === 2) {
      var subjects = that.data.subjects;
      for (var i = 0; i < subjects.length; i++) {
        var s = subjects[i];
        var val = parseFloat(s.score);
        if (s.score === '' || isNaN(val)) {
          wx.showToast({ title: '请填写' + s.name + '成绩', icon: 'none' });
          return;
        }
        if (val < 0 || val > s.max) {
          wx.showToast({ title: s.name + '成绩需在 0-' + s.max + ' 之间', icon: 'none' });
          return;
        }
      }
      that.generateAnalysis();
    }

    that.setData({ step: step + 1 });
  },

  prevStep: function () {
    var that = this;
    if (that.data.step > 0) {
      that.setData({ step: that.data.step - 1 });
    }
  },

  onNameInput: function (e) {
    var that = this;
    var val = e.detail.value;
    that.setData({
      name: val,
      canNext: val.trim().length > 0
    });
  },

  onScoreInput: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var key = e.currentTarget.dataset.key;
    var val = e.detail.value;

    var subjects = that.data.subjects.slice();
    var maxVal = subjects[index].max;

    // Allow empty while typing
    if (val === '') {
      subjects[index].score = '';
      that.setData({ subjects: subjects });
      return;
    }

    var num = parseFloat(val);
    if (isNaN(num)) {
      return;
    }

    // Clamp to max
    if (num > maxVal) {
      num = maxVal;
      subjects[index].score = String(maxVal);
    } else if (num < 0) {
      subjects[index].score = '0';
    } else {
      subjects[index].score = val;
    }

    // Check if all scores are filled
    var allFilled = true;
    for (var i = 0; i < subjects.length; i++) {
      var sv = parseFloat(subjects[i].score);
      if (subjects[i].score === '' || isNaN(sv)) {
        allFilled = false;
        break;
      }
    }

    that.setData({ subjects: subjects, canNext: allFilled });
  },

  generateAnalysis: function () {
    var that = this;
    var subjects = that.data.subjects;

    var items = [];
    var total = 0;
    for (var i = 0; i < subjects.length; i++) {
      var s = subjects[i];
      var score = parseFloat(s.score) || 0;
      var pct = Math.round((score / s.max) * 100);
      total += score;
      items.push({
        key: s.key,
        name: s.name,
        icon: s.icon,
        score: score,
        max: s.max,
        pct: pct
      });
    }

    // Sort by percentage ascending (weakest first)
    items.sort(function (a, b) { return a.pct - b.pct; });

    var weak = [];
    var stable = [];
    var strong = [];

    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      if (j < 2) {
        item.category = 'weak';
        item.suggestion = that.getSuggestion(item.key, 'weak');
        weak.push(item);
      } else if (j >= items.length - 2) {
        item.category = 'strong';
        item.suggestion = that.getSuggestion(item.key, 'strong');
        strong.push(item);
      } else {
        item.category = 'stable';
        item.suggestion = that.getSuggestion(item.key, 'stable');
        stable.push(item);
      }
    }

    var totalPct = Math.round((total / that.data.totalMax) * 100);

    that.setData({
      totalScore: total,
      analysis: {
        total: total,
        totalPct: totalPct,
        weak: weak,
        strong: strong,
        stable: stable,
        weakCount: weak.length,
        strongCount: strong.length,
        stableCount: stable.length
      }
    });
  },

  getSuggestion: function (key, category) {
    var weakMap = {
      math: '建议每天增加30分钟数学专项练习，重点攻克函数与导数、解析几何等高频考点',
      english: '建议每天坚持背单词30个，并做一套阅读理解真题训练',
      chinese: '建议加强文言文阅读和作文素材积累，每天阅读一篇范文',
      physics: '建议系统梳理力学和电学公式，配合典型例题加深理解',
      chemistry: '建议重点记忆化学方程式和元素周期表规律，多做实验题',
      biology: '建议回归课本，梳理遗传、细胞代谢等核心知识框架'
    };

    var strongMap = {
      math: '数学基础扎实，建议保持每日练习，挑战压轴题',
      english: '英语表现优秀，建议拓展阅读面和写作深度',
      chinese: '语文功底不错，建议在诗词鉴赏和作文上继续精进',
      physics: '物理理解力强，建议接触竞赛题拓展思维',
      chemistry: '化学掌握良好，建议多做综合推断题',
      biology: '生物成绩出色，建议关注实验设计与综合分析'
    };

    var stableMap = {
      math: '成绩稳定，建议针对薄弱章节做专项提升',
      english: '基础尚可，建议增加词汇量并强化听力训练',
      chinese: '水平平稳，建议在阅读理解和作文上多下功夫',
      physics: '基础一般，建议通过画图辅助理解物理过程',
      chemistry: '掌握中等，建议多做分类练习巩固知识点',
      biology: '成绩中等，建议制作思维导图梳理知识体系'
    };

    if (category === 'weak') return weakMap[key] || '建议针对该科目制定专项提升计划';
    if (category === 'strong') return strongMap[key] || '保持优势，继续巩固';
    return stableMap[key] || '稳步提升，查漏补缺';
  },

  finishOnboarding: function () {
    var that = this;
    var subjects = that.data.subjects;
    var scores = {};

    for (var i = 0; i < subjects.length; i++) {
      scores[subjects[i].key] = parseFloat(subjects[i].score) || 0;
    }

    wx.setStorageSync('userName', that.data.name);
    wx.setStorageSync('userScores', scores);
    wx.setStorageSync('onboardingDone', true);

    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});
