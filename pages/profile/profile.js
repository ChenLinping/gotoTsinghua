var data = require('../../utils/data');

Page({
  data: {
    rank: {},
    nextRank: null,
    progress: 0,
    progressPct: 0,
    xpToNext: 0,
    totalXP: 0,
    ranks: [],
    achievements: [],
    achievementCount: 0,
    achievementTotal: 0,
    streak: 0,
    masteredCount: 0,
    totalQuestions: 0,
    subjectProgress: [],
    levelUpAnimation: false
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
    var totalXP = wx.getStorageSync('totalXP') || 0;
    var streakDays = wx.getStorageSync('streakDays') || 0;
    var lastPlayDate = wx.getStorageSync('lastPlayDate') || '';

    // Calculate streak
    var today = new Date().toISOString().slice(0, 10);
    var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    if (lastPlayDate !== today) {
      if (lastPlayDate === yesterday) {
        streakDays++;
      } else if (lastPlayDate !== '') {
        streakDays = 1;
      } else {
        streakDays = 1;
      }
      wx.setStorageSync('streakDays', streakDays);
      wx.setStorageSync('lastPlayDate', today);
    }

    // Calculate rank
    var rankInfo = data.getRankByXP(totalXP);

    // Calculate achievements
    var earnedAchievements = data.checkAchievements(mastered, streakDays, totalXP);
    var earnedIds = earnedAchievements.map(function(a) { return a.id; });

    // Calculate subject progress
    var subjectProgress = data.SUBJECT_KEYS.map(function(key) {
      var sub = data.SUBJECTS[key];
      var content = data.SUBJECT_CONTENT[key];
      var masteredN = content.questions.filter(function(q, i) {
        return mastered[key + '-' + i];
      }).length;
      return {
        name: sub.name,
        icon: sub.icon,
        color: sub.color,
        mastered: masteredN,
        total: content.questions.length,
        pct: Math.round(masteredN / content.questions.length * 100)
      };
    });

    // Total mastered
    var masteredCount = Object.keys(mastered).filter(function(k) { return mastered[k]; }).length;
    var totalQuestions = data.SUBJECT_KEYS.reduce(function(sum, key) {
      return sum + data.SUBJECT_CONTENT[key].questions.length;
    }, 0);

    // Check for level up animation
    var prevRank = wx.getStorageSync('prevRankId') || 0;
    var showLevelUp = rankInfo.current.id > prevRank;
    if (showLevelUp) {
      wx.setStorageSync('prevRankId', rankInfo.current.id);
    }

    this.setData({
      rank: rankInfo.current,
      nextRank: rankInfo.next,
      progress: rankInfo.progress,
      progressPct: Math.round(rankInfo.progress * 100),
      xpToNext: rankInfo.xpToNext,
      totalXP: totalXP,
      ranks: data.RANKS.map(function(r) {
        return {
          name: r.name,
          emoji: r.emoji,
          color: r.color,
          minXP: r.minXP,
          desc: r.desc,
          isCurrent: r.id === rankInfo.current.id,
          isUnlocked: totalXP >= r.minXP
        };
      }),
      achievements: data.ACHIEVEMENTS.map(function(a) {
        return {
          name: a.name,
          emoji: a.emoji,
          desc: a.desc,
          earned: earnedIds.indexOf(a.id) >= 0
        };
      }),
      achievementCount: earnedAchievements.length,
      achievementTotal: data.ACHIEVEMENTS.length,
      streak: streakDays,
      masteredCount: masteredCount,
      totalQuestions: totalQuestions,
      subjectProgress: subjectProgress,
      levelUpAnimation: showLevelUp
    });

    if (showLevelUp) {
      wx.showToast({
        title: '🎉 升段成功！',
        icon: 'none',
        duration: 2000
      });
      setTimeout(function() {
        this.setData({ levelUpAnimation: false });
      }.bind(this), 3000);
    }
  }
});
