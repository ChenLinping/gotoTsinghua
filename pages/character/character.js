var game = require('../../utils/game');

Page({
  data: {
    char: null,
    stats: null,
    rank: null,
    nextRank: null,
    xpCurrent: 0,
    xpNeeded: 0,
    xpPercent: 0,
    hpPercent: 0,

    // Equipment display
    weapon: null,
    armor: null,
    accessory: null,

    // Achievements
    achievements: [],
    unlockedCount: 0,
    totalCount: 0,

    // Kill stats
    killStats: [],
    totalKills: 0,
    bossKills: 0,

    // Battle stats
    correctRate: 0,
    totalCorrect: 0,
    totalWrong: 0,
    streakDays: 0,

    // Subject name map
    subjectNames: {
      math: '数学',
      english: '英语',
      chinese: '语文',
      physics: '物理',
      chemistry: '化学',
      biology: '生物'
    }
  },

  onLoad: function () {
    this.loadCharacter();
  },

  onShow: function () {
    this.loadCharacter();
  },

  loadCharacter: function () {
    var char = game.loadGame();
    if (!char) {
      wx.showToast({ title: '未找到角色数据', icon: 'none' });
      return;
    }

    var stats = game.getCharStats(char);
    var rankInfo = game.getRankByLevel(char.level);

    // XP progress
    var xpCurrent = char.xp;
    var xpForCurrent = game.getXpForLevel(char.level);
    var xpForNext = game.getXpForLevel(char.level + 1);
    var xpInLevel = xpCurrent - xpForCurrent;
    var xpLevelRange = xpForNext - xpForCurrent;
    var xpPercent = xpLevelRange > 0 ? Math.min(100, Math.round((xpInLevel / xpLevelRange) * 100)) : 100;

    // HP percent
    var hpPercent = stats.maxHP > 0 ? Math.round((char.hp / stats.maxHP) * 100) : 0;

    // Equipment details
    var weapon = null;
    var armor = null;
    var accessory = null;

    if (char.equipment.weapon) {
      weapon = game.findById(game.EQUIPMENT.weapons, char.equipment.weapon);
      if (weapon) {
        weapon.rarityColor = game.RARITY_COLORS[weapon.rarity] || '#94a3b8';
        weapon.rarityName = game.RARITY_NAMES[weapon.rarity] || '普通';
      }
    }
    if (char.equipment.armor) {
      armor = game.findById(game.EQUIPMENT.armor, char.equipment.armor);
      if (armor) {
        armor.rarityColor = game.RARITY_COLORS[armor.rarity] || '#94a3b8';
        armor.rarityName = game.RARITY_NAMES[armor.rarity] || '普通';
      }
    }
    if (char.equipment.accessory) {
      accessory = game.findById(game.EQUIPMENT.accessories, char.equipment.accessory);
      if (accessory) {
        accessory.rarityColor = game.RARITY_COLORS[accessory.rarity] || '#94a3b8';
        accessory.rarityName = game.RARITY_NAMES[accessory.rarity] || '普通';
      }
    }

    // Achievements
    var unlockedIds = char.achievements || [];
    var achievements = game.ACHIEVEMENTS.map(function (a) {
      var unlocked = unlockedIds.indexOf(a.id) >= 0;
      return {
        id: a.id,
        name: a.name,
        emoji: a.emoji,
        desc: a.desc,
        reward: a.reward,
        unlocked: unlocked
      };
    });
    var unlockedCount = 0;
    achievements.forEach(function (a) {
      if (a.unlocked) unlockedCount++;
    });

    // Kill stats per subject
    var subjectKills = char.subjectKills || {};
    var subjectNames = this.data.subjectNames;
    var killStats = [];
    for (var key in subjectNames) {
      if (subjectNames.hasOwnProperty(key)) {
        killStats.push({
          subject: key,
          name: subjectNames[key],
          count: subjectKills[key] || 0
        });
      }
    }

    // Battle stats
    var totalAnswers = (char.correctAnswers || 0) + (char.wrongAnswers || 0);
    var correctRate = totalAnswers > 0 ? Math.round((char.correctAnswers / totalAnswers) * 100) : 0;

    this.setData({
      char: char,
      stats: stats,
      rank: rankInfo.current,
      nextRank: rankInfo.next,
      xpCurrent: xpCurrent,
      xpNeeded: xpForNext,
      xpPercent: xpPercent,
      hpPercent: hpPercent,
      weapon: weapon,
      armor: armor,
      accessory: accessory,
      achievements: achievements,
      unlockedCount: unlockedCount,
      totalCount: achievements.length,
      killStats: killStats,
      totalKills: char.kills || 0,
      bossKills: char.bossKills || 0,
      correctRate: correctRate,
      totalCorrect: char.correctAnswers || 0,
      totalWrong: char.wrongAnswers || 0,
      streakDays: char.streakDays || 0
    });
  }
});
