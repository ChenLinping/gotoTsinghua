Page({
  data: {
    activeTab: 0,   // 0=按日期 1=按科目
    showMode: 0,    // 0=全部 1=错题
    groups: [],
    stats: { total: 0, correct: 0, rate: 0 },
    wrongCount: 0,
    empty: true
  },

  onLoad: function() { this.loadHistory(); },
  onShow: function() { this.loadHistory(); },

  loadHistory: function() {
    var history = wx.getStorageSync('answerHistory') || [];
    if (history.length === 0) {
      this.setData({ groups: [], stats: { total: 0, correct: 0, rate: 0 }, wrongCount: 0, empty: true });
      return;
    }

    // 全局统计
    var total = history.length;
    var correct = 0;
    var wrongCount = 0;
    for (var i = 0; i < history.length; i++) {
      if (history[i].correct) correct++;
      else wrongCount++;
    }

    this.setData({
      stats: {
        total: total,
        correct: correct,
        rate: total > 0 ? Math.round((correct / total) * 100) : 0
      },
      wrongCount: wrongCount,
      empty: false
    });

    this.buildGroups(history);
  },

  buildGroups: function(history) {
    var tab = this.data.activeTab;
    var showMode = this.data.showMode;

    // 筛选: 0=全部, 1=错题
    var filtered = history;
    if (showMode === 1) {
      filtered = [];
      for (var f = 0; f < history.length; f++) {
        if (!history[f].correct) filtered.push(history[f]);
      }
    }

    if (filtered.length === 0) {
      this.setData({ groups: [] });
      return;
    }

    var groups = [];
    var subjectNames = {
      math: '\u6570\u5B66', chinese: '\u8BED\u6587', english: '\u82F1\u8BED',
      physics: '\u7269\u7406', chemistry: '\u5316\u5B66', biology: '\u751F\u7269',
      mixed: '\u7EFC\u5408'
    };

    if (tab === 0) {
      // 按日期分组
      var dateMap = {};
      var dateOrder = [];
      for (var i = filtered.length - 1; i >= 0; i--) {
        var d = filtered[i].date || '\u672A\u77E5';
        if (!dateMap[d]) {
          dateMap[d] = [];
          dateOrder.push(d);
        }
        dateMap[d].push(filtered[i]);
      }
      for (var j = 0; j < dateOrder.length; j++) {
        var dt = dateOrder[j];
        var items = dateMap[dt];
        // 错题优先排序
        items = this._sortWrongFirst(items);
        var c = 0;
        for (var k = 0; k < items.length; k++) {
          if (items[k].correct) c++;
        }
        groups.push({
          title: dt,
          subtitle: items.length + ' \u9898, \u5BF9 ' + c + ' \u9898',
          items: items
        });
      }
    } else {
      // 按科目分组
      var subjectMap = {};
      for (var m = filtered.length - 1; m >= 0; m--) {
        var s = filtered[m].subject || 'mixed';
        if (!subjectMap[s]) subjectMap[s] = [];
        subjectMap[s].push(filtered[m]);
      }
      var order = ['math', 'physics', 'chemistry', 'biology', 'chinese', 'english', 'mixed'];
      for (var n = 0; n < order.length; n++) {
        var sub = order[n];
        if (subjectMap[sub]) {
          var subItems = this._sortWrongFirst(subjectMap[sub]);
          var sc = 0;
          for (var p = 0; p < subItems.length; p++) {
            if (subItems[p].correct) sc++;
          }
          groups.push({
            title: subjectNames[sub] || sub,
            subtitle: subItems.length + ' \u9898, \u6B63\u786E\u7387 ' + (subItems.length > 0 ? Math.round(sc / subItems.length * 100) : 0) + '%',
            items: subItems
          });
        }
      }
    }

    this.setData({ groups: groups });
  },

  // 错题排前面，对的排后面
  _sortWrongFirst: function(items) {
    var wrong = [];
    var right = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].correct) right.push(items[i]);
      else wrong.push(items[i]);
    }
    return wrong.concat(right);
  },

  switchTab: function(e) {
    var idx = parseInt(e.currentTarget.dataset.idx);
    this.setData({ activeTab: idx });
    var history = wx.getStorageSync('answerHistory') || [];
    this.buildGroups(history);
  },

  switchShowMode: function(e) {
    var mode = parseInt(e.currentTarget.dataset.mode);
    this.setData({ showMode: mode });
    var history = wx.getStorageSync('answerHistory') || [];
    this.buildGroups(history);
  }
});
