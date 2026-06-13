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

    // HUD 默认收起
    hudExpanded: false,

    // 区域下拉菜单
    showRegionMenu: false,

    // 区域进度
    regionProgress: 0,
    regionTotal: 0,

    // 武器掉落
    showWeaponDrop: false,
    dropWeapon: null,
    dropRegionName: '',

    // 战斗转场
    showTransition: false,
    transitionText: '',

    // 玩家位置
    playerX: 50,
    playerY: 50
  },

  onLoad: function() {
    this.loadData();
  },

  onShow: function() {
    this.loadData();
    // 从战斗返回时短暂展开HUD
    var self = this;
    self.setData({ hudExpanded: true });
    setTimeout(function() {
      self.setData({ hudExpanded: false });
    }, 2500);
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
      wx.showToast({ title: '新成就解锁!', icon: 'success', duration: 2000 });
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

    // 进度
    var regionProgress = 0;
    var regionTotal = selectedNodes.length;
    for (var j = 0; j < selectedNodes.length; j++) {
      if (selectedNodes[j].completed) regionProgress++;
    }

    // 计算玩家位置（当前可挑战节点附近）
    var playerX = 50;
    var playerY = 50;
    for (var k = 0; k < selectedNodes.length; k++) {
      if (selectedNodes[k].unlocked && !selectedNodes[k].completed) {
        // 玩家站在目标节点左上方
        playerX = Math.max(10, selectedNodes[k].x - 12);
        playerY = Math.max(8, selectedNodes[k].y - 10);
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
      xpForLevel: xpForLevel,
      regionProgress: regionProgress,
      regionTotal: regionTotal,
      playerX: playerX,
      playerY: playerY
    });

    this._checkRegionComplete(char, selectedRegionId, selectedNodes);
  },

  // ===== 区域通关武器掉落 =====
  _checkRegionComplete: function(char, regionId, nodes) {
    if (!regionId || !nodes || nodes.length === 0) return;
    var allNormalDone = true;
    var bossNode = null;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].type === 'boss') {
        bossNode = nodes[i];
      } else if (!nodes[i].completed) {
        allNormalDone = false;
      }
    }
    if (allNormalDone && bossNode && !bossNode.completed) {
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
    this.setData({
      showWeaponDrop: true,
      dropWeapon: weapon,
      dropRegionName: this.data.selectedRegion ? this.data.selectedRegion.name : ''
    });
  },

  confirmWeaponDrop: function() {
    var weapon = this.data.dropWeapon;
    var char = this.data.char;
    this.setData({ showWeaponDrop: false });
    if (weapon && char) {
      char.equipment = char.equipment || {};
      char.equipment.weapon = weapon.id;
      game.saveGame(char);
      this.setData({ char: char });
      wx.showToast({ title: '获得 ' + weapon.name + '!', icon: 'success', duration: 1500 });
    }
    var self = this;
    setTimeout(function() {
      var nodes = self.data.selectedNodes;
      var bossNode = null;
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].type === 'boss') { bossNode = nodes[i]; break; }
      }
      if (bossNode && !bossNode.completed) {
        self._startBattleTransition(bossNode.id);
      }
    }, 1600);
  },

  // ===== HUD 切换 =====
  toggleHud: function() {
    var self = this;
    if (!this.data.hudExpanded) {
      self.setData({ hudExpanded: true });
      // 5秒后自动收起
      setTimeout(function() {
        self.setData({ hudExpanded: false });
      }, 5000);
    } else {
      self.setData({ hudExpanded: false });
    }
  },

  // ===== 区域菜单 =====
  toggleRegionMenu: function() {
    this.setData({ showRegionMenu: !this.data.showRegionMenu });
  },

  selectRegion: function(e) {
    var regionId = e.currentTarget.dataset.id;
    var region = this.data.regions.find(function(r) { return r.id === regionId; });
    if (!region || !region.unlocked) {
      wx.showToast({ title: '区域未解锁 (需要等级 ' + region.unlockLevel + ')', icon: 'none' });
      return;
    }

    var nodes = game.getRegionNodes(regionId, this.data.char.completedNodes);

    var char = this.data.char;
    char.currentRegion = regionId;
    game.saveGame(char);

    var regionProgress = 0;
    var regionTotal = nodes.length;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].completed) regionProgress++;
    }

    // 计算新区域的玩家位置
    var playerX = 50;
    var playerY = 50;
    for (var k = 0; k < nodes.length; k++) {
      if (nodes[k].unlocked && !nodes[k].completed) {
        playerX = Math.max(10, nodes[k].x - 12);
        playerY = Math.max(8, nodes[k].y - 10);
        break;
      }
    }

    this.setData({
      char: char,
      selectedRegionId: regionId,
      selectedRegion: region,
      selectedNodes: nodes,
      regionProgress: regionProgress,
      regionTotal: regionTotal,
      showRegionMenu: false,
      playerX: playerX,
      playerY: playerY
    });
  },

  // ===== 战斗转场 + 节点点击 =====
  tapNode: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    var node = this.data.selectedNodes.find(function(n) { return n.id === nodeId; });
    if (!node || !node.unlocked || node.completed) return;
    this._startBattleTransition(nodeId);
  },

  _startBattleTransition: function(nodeId) {
    var self = this;
    var node = this.data.selectedNodes.find(function(n) { return n.id === nodeId; });
    var text = node ? ('⚔ ' + node.label) : '⚔ 战斗开始!';
    self.setData({
      showTransition: true,
      transitionText: text
    });
    setTimeout(function() {
      wx.navigateTo({
        url: '/pages/battle/battle?nodeId=' + nodeId + '&regionId=' + self.data.selectedRegionId
      });
      setTimeout(function() {
        self.setData({ showTransition: false });
      }, 400);
    }, 800);
  },

  // ===== 每日宝箱 =====
  openChest: function() {
    var char = this.data.char;
    var reward = Math.floor(Math.random() * 50) + 20;
    char.coins += reward;
    game.saveGame(char);
    var today = new Date().toDateString();
    wx.setStorageSync('lastChestDate', today);
    this.setData({ char: char, showChest: false });
    wx.showToast({ title: '获得 ' + reward + ' 金币!', icon: 'success' });
  }
});
