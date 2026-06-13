Page({
  data: {
    activeTab: 0,  // 0=按日期 1=按科目
    groups: [],
    stats: { total: 0, correct: 0, rate: 0 },
    subjectStats: [],
    empty: true
  },

  onLoad: function() { this.loadHistory(); },
  onShow: function() { this.loadHistory(); },

  loadHistory: function() {
    var history = wx.getStorageSync('answerHistory') || [];
    if (history.length === 0) {
      this.setData({ groups: [], stats: { total: 0, correct: 0, rate: 0 }, subjectStats: [], empty: true });
      return;
    }

    // 统计
    var total = history.length;
    var correct = 0;
    var subjectMap = {};
    for (var i = 0; i < history.length; i++) {
      if (history[i].correct) correct++;
      var s = history[i].subject || 'mixed';
      if (!subjectMap[s]) subjectMap[s] = { subject: s, total: 0, correct: 0 };
      subjectMap[s].total++;
      if (history[i].correct) subjectMap[s].correct++;
    }

    var subjectNames = {
      math: '数学', chinese: '语文', english: '英语',
      physics: '物理', chemistry: '化学', biology: '生物', mixed: '综合'
    };

    var subjectStats = [];
    for (var key in subjectMap) {
      var st = subjectMap[key];
      subjectStats.push({
        subject: st.subject,
        name: subjectNames[st.subject] || st.subject,
        total: st.total,
        correct: st.correct,
        rate: st.total > 0 ? Math.round((st.correct / st.total) * 100) : 0
      });
    }

    var stats = {
      total: total,
      correct: correct,
      rate: total > 0 ? Math.round((correct / total) * 100) : 0
    };

    this.setData({
      stats: stats,
      subjectStats: subjectStats,
      empty: false
    });

    this.buildGroups(history);
  },

  buildGroups: function(history) {
    var tab = this.data.activeTab;
    var groups = [];

    if (tab === 0) {
      // 按日期分组
      var dateMap = {};
      var dateOrder = [];
      for (var i = history.length - 1; i >= 0; i--) {
        var d = history[i].date || '未知';
        if (!dateMap[d]) {
          dateMap[d] = [];
          dateOrder.push(d);
        }
        dateMap[d].push(history[i]);
      }
      for (var j = 0; j < dateOrder.length; j++) {
        var dt = dateOrder[j];
        var items = dateMap[dt];
        var c = 0;
        for (var k = 0; k < items.length; k++) {
          if (items[k].correct) c++;
        }
        groups.push({
          title: dt,
          subtitle: items.length + ' 题, 对 ' + c + ' 题',
          items: items
        });
      }
    } else {
      // 按科目分组
      var subjectMap = {};
      var subjectNames = {
        math: '数学', chinese: '语文', english: '英语',
        physics: '物理', chemistry: '化学', biology: '生物', mixed: '综合'
      };
      for (var m = history.length - 1; m >= 0; m--) {
        var s = history[m].subject || 'mixed';
        if (!subjectMap[s]) subjectMap[s] = [];
        subjectMap[s].push(history[m]);
      }
      var order = ['math', 'physics', 'chemistry', 'biology', 'chinese', 'english', 'mixed'];
      for (var n = 0; n < order.length; n++) {
        var sub = order[n];
        if (subjectMap[sub]) {
          var subItems = subjectMap[sub];
          var sc = 0;
          for (var p = 0; p < subItems.length; p++) {
            if (subItems[p].correct) sc++;
          }
          groups.push({
            title: subjectNames[sub] || sub,
            subtitle: subItems.length + ' 题, 正确率 ' + (subItems.length > 0 ? Math.round(sc / subItems.length * 100) : 0) + '%',
            items: subItems
          });
        }
      }
    }

    this.setData({ groups: groups });
  },

  switchTab: function(e) {
    var idx = parseInt(e.currentTarget.dataset.idx);
    this.setData({ activeTab: idx });
    var history = wx.getStorageSync('answerHistory') || [];
    this.buildGroups(history);
  }
});
