var data = require('../../utils/data');

Page({
  data: {
    daysLeft: 0,
    dateStr: '',
    dayName: '',
    userName: '',
    dayType: '',
    dayTypeLabel: '',
    phaseName: '',
    holidayName: '',
    tasks: [],
    currentTask: null,
    nextTask: null,
    phases: [],
    routine: [],
    showSchedule: false,
    completedCount: 0,
    totalTasks: 0,
    totalXP: 0,
    rank: {},
    streak: 0,
    scoreAnalysis: null
  },

  onLoad: function() {
    this.refresh();
  },

  onShow: function() {
    this.refresh();
  },

  refresh: function() {
    var now = new Date();
    var dayOfWeek = now.getDay();
    var scores = wx.getStorageSync('userScores') || null;
    var userName = wx.getStorageSync('userName') || '';
    var completed = wx.getStorageSync('completed') || {};
    var totalXP = wx.getStorageSync('totalXP') || 0;
    var rankInfo = data.getRankByXP(totalXP);
    var streakDays = wx.getStorageSync('streakDays') || 0;

    // 每日连胜追踪
    var today = now.toISOString().slice(0, 10);
    var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    var lastPlayDate = wx.getStorageSync('lastPlayDate') || '';

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

      var streakBonus = data.XP_RULES.streakBonus(streakDays);
      if (streakBonus > 0 && lastPlayDate === yesterday) {
        totalXP += streakBonus;
        wx.setStorageSync('totalXP', totalXP);
      }
    }

    // 获取当前阶段和日期类型
    var phase = data.getCurrentPhase(now);
    var dayType = data.getDayType(now);
    var holidayName = data.getHolidayName(now.toISOString()) || '';
    var dayTypeLabel = holidayName ? holidayName : (dayType === 'weekend' ? '周末' : '工作日');

    // 阶段列表
    var phases = data.PHASES.map(function(p) {
      var start = new Date(p.start);
      var end = new Date(p.end);
      return {
        name: p.name, period: p.period, desc: p.desc,
        color: p.color, isActive: now >= start && now < end
      };
    });

    // 使用智能排课生成今日任务
    var todayStr = now.toISOString().slice(0, 10);
    var smartTasks = scores ? data.generateSmartSchedule(scores, now) : [];
    var scoreAnalysis = scores ? data.analyzeScores(scores) : null;

    // 给任务加上完成状态
    var tasksWithStatus = smartTasks.map(function(t, i) {
      var key = todayStr + '-' + i;
      var done = !!completed[key];
      return {
        time: t.time,
        task: t.task,
        type: t.type,
        subject: t.subject,
        subjectName: t.subjectName,
        subjectIcon: t.subjectIcon,
        color: t.color,
        bg: t.bg,
        text: t.text,
        isWeak: t.isWeak,
        period: t.period,
        done: done,
        key: key,
        index: i
      };
    });

    var completedCount = tasksWithStatus.filter(function(t) { return t.done; }).length;

    // 判断当前正在进行的任务
    var currentTask = null;
    var nextTask = null;
    var currentTime = now.getHours() * 60 + now.getMinutes();

    for (var i = 0; i < tasksWithStatus.length; i++) {
      var parts = tasksWithStatus[i].time.split('-');
      var sp = parts[0].split(':').map(Number);
      var ep = parts[1].split(':').map(Number);
      var startTime = sp[0] * 60 + sp[1];
      var endTime = ep[0] * 60 + ep[1];

      if (currentTime >= startTime && currentTime < endTime && !tasksWithStatus[i].done) {
        currentTask = tasksWithStatus[i];
        break;
      }
      if (currentTime < startTime && !nextTask) {
        nextTask = tasksWithStatus[i];
      }
    }

    this.setData({
      daysLeft: data.getDaysUntilExam(),
      dateStr: data.getDateStr(),
      dayName: data.DAY_NAMES[dayOfWeek],
      userName: userName,
      dayType: dayType,
      dayTypeLabel: dayTypeLabel,
      phaseName: phase ? phase.name : '',
      holidayName: holidayName,
      tasks: tasksWithStatus,
      currentTask: currentTask,
      nextTask: nextTask,
      phases: phases,
      routine: data.DAILY_ROUTINE,
      showSchedule: false,
      completedCount: completedCount,
      totalTasks: tasksWithStatus.length,
      totalXP: totalXP,
      rank: rankInfo.current,
      streak: streakDays,
      scoreAnalysis: scoreAnalysis
    });
  },

  toggleTask: function(e) {
    var idx = e.currentTarget.dataset.index;
    var todayStr = new Date().toISOString().slice(0, 10);
    var key = todayStr + '-' + idx;
    var completed = wx.getStorageSync('completed') || {};
    var wasDone = !!completed[key];
    completed[key] = !completed[key];
    wx.setStorageSync('completed', completed);

    if (completed[key] && !wasDone) {
      var taskXP = data.XP_RULES.dailyTask;
      var totalXP = wx.getStorageSync('totalXP') || 0;
      totalXP += taskXP;
      wx.setStorageSync('totalXP', totalXP);

      var prevRank = data.getRankByXP(totalXP - taskXP);
      var newRank = data.getRankByXP(totalXP);

      if (newRank.current.id > prevRank.current.id) {
        wx.showToast({ title: '🎉 升段！' + newRank.current.name, icon: 'none', duration: 2500 });
        wx.setStorageSync('prevRankId', newRank.current.id);
      } else {
        wx.showToast({ title: '+' + taskXP + ' XP 完成！', icon: 'none', duration: 1000 });
      }
    } else if (!completed[key] && wasDone) {
      var totalXP = wx.getStorageSync('totalXP') || 0;
      totalXP = Math.max(0, totalXP - data.XP_RULES.dailyTask);
      wx.setStorageSync('totalXP', totalXP);
    }

    this.refresh();
  },

  goToSubject: function(e) {
    var subject = e.currentTarget.dataset.subject;
    wx.switchTab({ url: '/pages/subjects/subjects' });
    wx.setStorageSync('selectedSubject', subject);
  },

  toggleSchedule: function() {
    this.setData({ showSchedule: !this.data.showSchedule });
  },

  goToOnboarding: function() {
    wx.navigateTo({ url: '/pages/onboarding/onboarding' });
  }
});
