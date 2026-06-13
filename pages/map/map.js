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
    xpForLevel: 0,

    // 可折叠英雄栏
    heroCollapsed: false,

    // 区域通关武器掉落动画
    showWeaponDrop: false,
    dropWeapon: null,
    dropRegionName: '',

    // 区域进度
    regionProgress: 0,
    regionTotal: 0
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

    // 计算当前区域进度
    var regionProgress = 0;
    var regionTotal = 0;
    if (selectedRegion) {
      for (var j = 0; j < selectedNodes.length; j++) {
        regionTotal++;
        if (selectedNodes[j].completed) {
          regionProgress++;
        }
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
      xpForLevel: xpForLevel,
      regionProgress: regionProgress,
      regionTotal: regionTotal
    });

    // 检查区域是否刚刚通关（所有非Boss节点完成）
    this._checkRegionComplete(char, selectedRegionId, selectedNodes);
  },

  // ===== 检查区域通关 & 武器掉落 =====
  _checkRegionComplete: function(char, regionId, nodes) {
    if (!regionId || !nodes || nodes.length === 0) return;

    // 检查是否所有非Boss节点都已完成
    var allNormalDone = true;
    var bossNode = null;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].type === 'boss') {
        bossNode = nodes[i];
      } else if (!nodes[i].completed) {
        allNormalDone = false;
      }
    }

    // 所有普通节点完成，Boss节点未打且存在 → 触发武器掉落
    if (allNormalDone && bossNode && !bossNode.completed) {
      // 检查是否已经触发过（用 storage 记录）
      var dropKey = 'weaponDropped_' + regionId;
      var alreadyDropped = wx.getStorageSync(dropKey);
      if (!alreadyDropped) {
        wx.setStorageSync(dropKey, true);
        this._triggerWeaponDrop(char, regionId, bossNode);
      }
    }
  },

  _triggerWeaponDrop: function(char, regionId, bossNode) {
    var weapon = game.getRegionDropWeapon(regionId);
    if (!weapon) return;

    var selectedRegion = this.data.selectedRegion;
    this.setData({
      showWeaponDrop: true,
      dropWeapon: weapon,
      dropRegionName: selectedRegion ? selectedRegion.name : ''
    });
  },

  // ===== 武器掉落确认 → 进入Boss战 =====
  confirmWeaponDrop: function() {
    var weapon = this.data.dropWeapon;
    var char = this.data.char;

    this.setData({ showWeaponDrop: false });

    if (weapon && char) {
      // 自动装备武器
      char.equipment = char.equipment || {};
      char.equipment.weapon = weapon.id;
      game.saveGame(char);
      this.setData({ char: char });

      wx.showToast({
        title: '获得 ' + weapon.name + '!',
        icon: 'success',
        duration: 1500
      });
    }

    // 延迟一下然后进入Boss战
    var self = this;
    setTimeout(function() {
      // 找到Boss节点
      var nodes = self.data.selectedNodes;
      var bossNode = null;
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].type === 'boss') {
          bossNode = nodes[i];
          break;
        }
      }
      if (bossNode && !bossNode.completed) {
        wx.navigateTo({
          url: '/pages/battle/battle?nodeId=' + bossNode.id + '&regionId=' + self.data.selectedRegionId
        });
      }
    }, 1600);
  },

  // ===== 折叠/展开英雄栏 =====
  toggleHeroBar: function() {
    this.setData({
      heroCollapsed: !this.data.heroCollapsed
    });
  },

  // ===== 区域切换 =====
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

    // 持久化当前区域，战斗返回后不会跳回旧区域
    var char = this.data.char;
    char.currentRegion = regionId;
    game.saveGame(char);

    // 计算进度
    var regionProgress = 0;
    var regionTotal = nodes.length;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].completed) {
        regionProgress++;
      }
    }

    this.setData({
      char: char,
      selectedRegionId: regionId,
      selectedRegion: region,
      selectedNodes: nodes,
      regionProgress: regionProgress,
      regionTotal: regionTotal
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
  }
});
