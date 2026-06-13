var data = require('../../utils/data');

Page({
  data: {
    activeSubject: 'math',
    subjects: [],
    subjectInfo: {},
    content: {},
    expandedTopic: {},
    expandedQ: {},
    showAnswer: {},
    showHint: {},
    mastered: {},
    masteredCount: 0,
    totalQ: 0
  },

  onLoad: function() {
    var selected = wx.getStorageSync('selectedSubject') || 'math';
    this.initSubjects(selected);
  },

  onShow: function() {
    var selected = wx.getStorageSync('selectedSubject');
    if (selected && selected !== this.data.activeSubject) {
      this.initSubjects(selected);
      wx.removeStorageSync('selectedSubject');
    }
    this.refreshMastered();
  },

  initSubjects: function(active) {
    var subjects = data.SUBJECT_KEYS.map(function(key) {
      var s = data.SUBJECTS[key];
      return { key: key, name: s.name, icon: s.icon, color: s.color, bg: s.bg, text: s.text };
    });

    this.setData({ activeSubject: active, subjects: subjects });
    this.loadSubjectContent(active);
  },

  loadSubjectContent: function(subjectKey) {
    var content = data.SUBJECT_CONTENT[subjectKey];
    var sub = data.SUBJECTS[subjectKey];
    var mastered = wx.getStorageSync('mastered') || {};
    var masteredCount = 0;

    content.questions.forEach(function(q, i) {
      if (mastered[subjectKey + '-' + i]) masteredCount++;
    });

    this.setData({
      subjectInfo: sub,
      content: content,
      masteredCount: masteredCount,
      totalQ: content.questions.length,
      expandedTopic: {},
      expandedQ: {},
      showAnswer: {},
      showHint: {}
    });
  },

  switchSubject: function(e) {
    var key = e.currentTarget.dataset.key;
    this.setData({ activeSubject: key });
    this.loadSubjectContent(key);
  },

  toggleTopic: function(e) {
    var idx = e.currentTarget.dataset.index;
    var key = 'expandedTopic[' + idx + ']';
    this.setData({ [key]: !this.data.expandedTopic[idx] });
  },

  toggleQuestion: function(e) {
    var idx = e.currentTarget.dataset.index;
    var key = 'expandedQ[' + idx + ']';
    this.setData({ [key]: !this.data.expandedQ[idx] });
  },

  toggleAnswer: function(e) {
    var idx = e.currentTarget.dataset.index;
    var key = 'showAnswer[' + idx + ']';
    this.setData({ [key]: !this.data.showAnswer[idx] });
  },

  toggleHint: function(e) {
    var idx = e.currentTarget.dataset.index;
    var key = 'showHint[' + idx + ']';
    this.setData({ [key]: !this.data.showHint[idx] });
  },

  toggleMastered: function(e) {
    var idx = e.currentTarget.dataset.index;
    var subjectKey = this.data.activeSubject;
    var mKey = subjectKey + '-' + idx;
    var mastered = wx.getStorageSync('mastered') || {};
    var wasMastered = !!mastered[mKey];
    mastered[mKey] = !mastered[mKey];
    wx.setStorageSync('mastered', mastered);

    if (mastered[mKey] && !wasMastered) {
      // Award XP based on question difficulty
      var question = this.data.content.questions[idx];
      var xpGained = data.XP_RULES[question.difficulty] || 30;
      var totalXP = wx.getStorageSync('totalXP') || 0;

      // Add streak bonus
      var streakDays = wx.getStorageSync('streakDays') || 0;
      var streakBonus = data.XP_RULES.streakBonus(streakDays);
      xpGained += streakBonus;

      totalXP += xpGained;
      wx.setStorageSync('totalXP', totalXP);

      // Check rank before and after
      var prevRank = data.getRankByXP(totalXP - xpGained);
      var newRank = data.getRankByXP(totalXP);

      if (newRank.current.id > prevRank.current.id) {
        wx.showToast({
          title: '🎉 升段！' + newRank.current.name,
          icon: 'none',
          duration: 2500
        });
        wx.setStorageSync('prevRankId', newRank.current.id);
      } else {
        var msg = '+' + xpGained + ' XP';
        if (streakBonus > 0) msg += '（含连胜+' + streakBonus + '）';
        wx.showToast({ title: msg, icon: 'none', duration: 1200 });
      }
    } else if (!mastered[mKey] && wasMastered) {
      // Remove XP when unmastering
      var question = this.data.content.questions[idx];
      var xpToRemove = data.XP_RULES[question.difficulty] || 30;
      var totalXP = wx.getStorageSync('totalXP') || 0;
      totalXP = Math.max(0, totalXP - xpToRemove);
      wx.setStorageSync('totalXP', totalXP);
    }

    this.refreshMastered();
  },

  refreshMastered: function() {
    var mastered = wx.getStorageSync('mastered') || {};
    var subjectKey = this.data.activeSubject;
    var count = 0;
    var total = this.data.totalQ || 5;

    for (var i = 0; i < total; i++) {
      if (mastered[subjectKey + '-' + i]) count++;
    }

    this.setData({ masteredCount: count });
  }
});
