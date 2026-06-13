var data = require('../../utils/data');

Page({
  data: {
    daysLeft: 0,
    totalQ: 0,
    totalMastered: 0,
    subjectStats: [],
    weeklyStats: [],
    totalCompleted: 0,
    totalTasks: 0
  },

  onLoad: function() {
    this.refresh();
  },

  onShow: function() {
    this.refresh();
  },

  refresh: function() {
    var mastered = wx.getStorageSync('mastered') || {};
    var completed = wx.getStorageSync('completed') || {};
    var totalQ = 0;
    var totalMastered = 0;

    var subjectStats = data.SUBJECT_KEYS.map(function(key) {
      var sub = data.SUBJECTS[key];
      var content = data.SUBJECT_CONTENT[key];
      var qCount = content.questions.length;
      var masteredN = 0;
      for (var i = 0; i < qCount; i++) {
        if (mastered[key + '-' + i]) masteredN++;
      }
      totalQ += qCount;
      totalMastered += masteredN;
      return {
        name: sub.name,
        icon: sub.icon,
        color: sub.color,
        mastered: masteredN,
        total: qCount,
        pct: qCount > 0 ? Math.round(masteredN / qCount * 100) : 0
      };
    });

    var totalCompleted = 0;
    var totalTasks = 0;
    var weeklyStats = data.WEEK_DAYS.map(function(day) {
      var tasks = data.WEEKLY_PLAN[day] || [];
      var done = 0;
      tasks.forEach(function(t, i) {
        if (completed[day + '-' + i]) done++;
      });
      totalCompleted += done;
      totalTasks += tasks.length;
      return {
        name: data.DAY_NAMES[day],
        completed: done,
        total: tasks.length
      };
    });

    this.setData({
      daysLeft: data.getDaysUntilExam(),
      totalQ: totalQ,
      totalMastered: totalMastered,
      subjectStats: subjectStats,
      weeklyStats: weeklyStats,
      totalCompleted: totalCompleted,
      totalTasks: totalTasks
    });
  },

  resetProgress: function() {
    wx.showModal({
      title: '确认重置',
      content: '确定要重置所有学习进度吗？此操作不可撤销。',
      confirmColor: '#ef4444',
      success: function(res) {
        if (res.confirm) {
          wx.setStorageSync('mastered', {});
          wx.setStorageSync('completed', {});
          wx.showToast({ title: '已重置', icon: 'success' });
          this.refresh();
        }
      }.bind(this)
    });
  }
});
