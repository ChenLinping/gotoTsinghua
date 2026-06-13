var game = require('../../utils/game');

Page({
  data: {
    char: null,
    regions: [],
    selectedRegionId: null,
    selectedRegion: null,
    selectedNodes: [],
    rank: null,
    daysUntilExam: 0,
    showChest: false,
    xpProgress: 0,
    xpForLevel: 0
  },

  onLoad: function() {
    this.loadData();
  },

  onShow: function() {
    this.loadData();
  },

  loadData: function() {
    var char = game.loadGame();
    if (!char) {
      wx.redirectTo({ url: '/pages/onboarding/onboarding' });
      return;
    }

    char = game.updateStreak(char);
    var achievements = game.checkNewAchievements(char);
    if (achievements.length > 0) {
      wx.showToast({
        title: '新成就解锁!',
        icon: 'success',
        duration: 2000
      });
    }

    var regions = game.getMapRegions(char.level);
    var selectedRegionId = char.currentRegion || (regions[0] && regions[0].id);
    var selectedNodes = [];
    if (selectedRegionId) {
      selectedNodes = game.getRegionNodes(selectedRegionId, char.completedNodes);
    }

    var rank = game.getRankByLevel(char.level);
    var daysUntilExam = game.getDaysUntilExam();
    var xpForLevel = game.getXpForLevel(char.level);
    var xpProgress = (char.xp / xpForLevel) * 100;

    var today = new Date().toDateString();
    var lastChest = wx.getStorageSync('lastChestDate');
    var showChest = lastChest !== today;

    var selectedRegion = null;
    for (var i = 0; i < regions.length; i++) {
      if (regions[i].id === selectedRegionId) {
        selectedRegion = regions[i];
        break;
      }
    }

    this.setData({
      char: char,
      regions: regions,
      selectedRegionId: selectedRegionId,
      selectedRegion: selectedRegion,
      selectedNodes: selectedNodes,
      rank: rank,
      daysUntilExam: daysUntilExam,
      showChest: showChest,
      xpProgress: xpProgress,
      xpForLevel: xpForLevel
    });
  },

  selectRegion: function(e) {
    var regionId = e.currentTarget.dataset.id;
    var region = this.data.regions.find(function(r) { return r.id === regionId; });
    if (!region || !region.unlocked) {
      wx.showToast({
        title: '区域未解锁 (需要等级 ' + region.unlockLevel + ')',
        icon: 'none'
      });
      return;
    }

    var nodes = game.getRegionNodes(regionId, this.data.char.completedNodes);
    this.setData({
      selectedRegionId: regionId,
      selectedRegion: region,
      selectedNodes: nodes
    });
  },

  tapNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var node = this.data.selectedNodes.find(function(n) { return n.id === nodeId; });
    if (!node || !node.unlocked || node.completed) {
      return;
    }

    wx.navigateTo({
      url: '/pages/battle/battle?nodeId=' + nodeId + '&regionId=' + this.data.selectedRegionId
    });
  },

  openChest: function() {
    var char = this.data.char;
    var reward = Math.floor(Math.random() * 50) + 20;
    char.coins += reward;
    game.saveGame(char);

    var today = new Date().toDateString();
    wx.setStorageSync('lastChestDate', today);

    this.setData({
      char: char,
      showChest: false
    });

    wx.showToast({
      title: '获得 ' + reward + ' 金币!',
      icon: 'success'
    });
  },

  goToCharacter: function() {
    wx.switchTab({ url: '/pages/character/character' });
  },

  goToShop: function() {
    wx.switchTab({ url: '/pages/shop/shop' });
  }
});
