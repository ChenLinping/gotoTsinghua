var game = require('../../utils/game');

// ========== 常量 ==========
var MAP_W = 3000;
var MAP_H = 3000;
var PLAYER_SPEED = 5;
var COLLISION_DIST = 65;
var TICK_MS = 16;

var TREASURE_POOL = [
  { name: '飞刀', emoji: '🗡️', color: '#b0b0b0' },
  { name: '火球', emoji: '🔥', color: '#ff6b35' },
  { name: '雷电', emoji: '⚡', color: '#4fc3f7' },
  { name: '冰晶', emoji: '❄️', color: '#81d4fa' },
  { name: '风刃', emoji: '🌀', color: '#66bb6a' },
  { name: '光盾', emoji: '💎', color: '#ce93d8' },
  { name: '暗星', emoji: '🌑', color: '#78909c' },
  { name: '圣剑', emoji: '⚔️', color: '#ffd700' }
];

var MONSTER_HP = { normal: 3, elite: 5, boss: 8 };

Page({
  data: {
    // 游戏状态
    state: 'exploring', // exploring | colliding | forging | combat | victory
    char: null,
    rank: null,
    daysUntilExam: 0,
    selectedRegionId: null,
    selectedRegion: null,
    regions: [],

    // 相机
    camX: 0,
    camY: 0,

    // 玩家 (像素坐标)
    playerX: 600,
    playerY: 600,
    playerMoving: false,

    // 怪物
    monsters: [],

    // 法宝 (环绕玩家)
    treasures: [],
    treasureAngle: 0,

    // 摇杆
    joyX: 0,
    joyY: 0,
    joyKnobX: 0,
    joyKnobY: 0,
    joyActive: false,

    // 炼宝
    currentQuestion: null,
    forgeSubject: '',
    forgeDifficulty: 'easy',
    forgeTargetMonster: null,
    selectedOption: -1,
    forgeResult: '', // '' | 'correct' | 'wrong'
    forgeExplain: '',

    // 战斗
    combatMonster: null,
    combatTreasureIdx: -1,
    combatPhase: '', // 'launch' | 'hit' | 'counter' | 'end'
    combatDamage: 0,
    combatMonsterHp: 0,
    combatMonsterMaxHp: 0,
    combatPlayerHp: 0,
    combatPlayerMaxHp: 100,
    combatLog: '',

    // 胜利
    victoryXp: 0,
    victoryCoins: 0,
    showWeaponDrop: false,
    dropWeapon: null,

    // HUD
    showChest: false,

    // 区域选择
    showRegionMenu: false,

    // 区域进度
    regionProgress: 0,
    regionTotal: 0,

    // 地面网格 (预生成)
    gridRows: []
  },

  // ===== 生命周期 =====
  onLoad: function() {
    this._touchId = null;
    this._joyCenterX = 0;
    this._joyCenterY = 0;
    this._loopTimer = null;
    this._combatQueue = [];

    // 获取屏幕尺寸(横屏)
    var sysInfo = wx.getSystemInfoSync();
    this._vpW = sysInfo.windowWidth || 667;
    this._vpH = sysInfo.windowHeight || 375;

    // 生成地面网格 (20行25列 = 500个cell，避免14400个)
    var gridRows = [];
    for (var i = 0; i < 20; i++) {
      var row = [];
      for (var j = 0; j < 25; j++) {
        row.push((i + j) % 3);
      }
      gridRows.push(row);
    }
    this.setData({ gridRows: gridRows });

    this.loadData();
    this._startLoop();
  },

  onUnload: function() {
    this._stopLoop();
  },

  onHide: function() {
    this._stopLoop();
  },

  onShow: function() {
    this.loadData();
    if (!this._loopTimer) this._startLoop();
  },

  // ===== 数据加载 =====
  loadData: function() {
    var char = game.loadGame();
    if (!char) {
      wx.redirectTo({ url: '/pages/onboarding/onboarding' });
      return;
    }
    char = game.updateStreak(char);

    var regions = game.getMapRegions(char.level);
    var selectedRegionId = char.currentRegion || (regions[0] && regions[0].id);
    var selectedRegion = null;
    for (var i = 0; i < regions.length; i++) {
      if (regions[i].id === selectedRegionId) { selectedRegion = regions[i]; break; }
    }

    // 生成怪物
    var nodes = game.getRegionNodes(selectedRegionId, char.completedNodes);
    var monsters = [];
    for (var j = 0; j < nodes.length; j++) {
      var n = nodes[j];
      monsters.push({
        id: n.id,
        name: n.label,
        subject: n.subject,
        type: n.type,
        emoji: n.subject === 'math' ? '📐' : n.subject === 'chinese' ? '📖' : n.subject === 'english' ? '🔤' : n.subject === 'physics' ? '⚡' : n.subject === 'chemistry' ? '🧪' : n.subject === 'biology' ? '🧬' : '📚',
        px: (n.x / 100) * MAP_W,
        py: (n.y / 100) * MAP_H,
        hp: MONSTER_HP[n.type] || 3,
        maxHp: MONSTER_HP[n.type] || 3,
        alive: !n.completed,
        unlocked: n.unlocked,
        isBoss: n.type === 'boss',
        isElite: n.type === 'elite'
      });
    }

    var rank = game.getRankByLevel(char.level);
    var daysUntilExam = game.getDaysUntilExam();

    var today = new Date().toDateString();
    var lastChest = wx.getStorageSync('lastChestDate');

    // 区域进度
    var regionProgress = 0;
    for (var k = 0; k < monsters.length; k++) {
      if (!monsters[k].alive) regionProgress++;
    }

    this.setData({
      char: char,
      rank: rank,
      daysUntilExam: daysUntilExam,
      regions: regions,
      selectedRegionId: selectedRegionId,
      selectedRegion: selectedRegion,
      monsters: monsters,
      showChest: lastChest !== today,
      regionProgress: regionProgress,
      regionTotal: monsters.length,
      combatPlayerHp: char.hp,
      combatPlayerMaxHp: char.maxHP || 100
    });

    // 检查区域通关
    this._checkRegionComplete(char, selectedRegionId, monsters);
  },

  // ===== 游戏循环 =====
  _startLoop: function() {
    var self = this;
    this._loopTimer = setInterval(function() { self._tick(); }, TICK_MS);
  },

  _stopLoop: function() {
    if (this._loopTimer) {
      clearInterval(this._loopTimer);
      this._loopTimer = null;
    }
  },

  _tick: function() {
    if (this.data.state !== 'exploring') {
      // 即使非探索状态也更新法宝旋转
      if (this.data.treasures.length > 0) {
        this.setData({ treasureAngle: (this.data.treasureAngle + 2) % 360 });
      }
      return;
    }
    if (!this.data.joyActive) return;

    var px = this.data.playerX + this.data.joyX * PLAYER_SPEED;
    var py = this.data.playerY + this.data.joyY * PLAYER_SPEED;
    px = Math.max(60, Math.min(MAP_W - 60, px));
    py = Math.max(60, Math.min(MAP_H - 60, py));

    var vpW = this._vpW || 667;
    var vpH = this._vpH || 375;
    var cx = px - vpW / 2;
    var cy = py - vpH / 2;
    cx = Math.max(0, Math.min(MAP_W - vpW, cx));
    cy = Math.max(0, Math.min(MAP_H - vpH, cy));

    var update = {
      playerX: px,
      playerY: py,
      camX: cx,
      camY: cy,
      playerMoving: true
    };

    // 法宝旋转
    if (this.data.treasures.length > 0) {
      update.treasureAngle = (this.data.treasureAngle + 2) % 360;
    }

    this.setData(update);

    // 碰撞检测
    this._checkCollisions(px, py);
  },

  _checkCollisions: function(px, py) {
    var monsters = this.data.monsters;
    for (var i = 0; i < monsters.length; i++) {
      var m = monsters[i];
      if (!m.alive || !m.unlocked) continue;
      var dx = px - m.px;
      var dy = py - m.py;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < COLLISION_DIST) {
        this._triggerCollision(m);
        return;
      }
    }
  },

  // ===== 碰撞 → 决定战斗还是炼宝 =====
  _triggerCollision: function(monster) {
    var treasures = this.data.treasures;
    var totalDmg = treasures.length * 2;

    if (totalDmg >= monster.hp) {
      // 法宝足够 → 直接进入地图战斗
      this._startMapCombat(monster);
    } else {
      // 法宝不够 → 先炼宝
      this._startForge(monster);
    }
  },

  // ===== 炼宝系统 =====
  _startForge: function(monster) {
    var difficulty = 'easy';
    if (monster.isElite) difficulty = 'medium';
    if (monster.isBoss) difficulty = 'hard';

    var q = game.getQuestion(monster.subject, difficulty);
    if (!q) {
      q = { q: '1 + 1 = ?', options: ['2', '3', '4', '5'], answer: 0, explain: '基础算术。' };
    }

    this.setData({
      state: 'forging',
      currentQuestion: q,
      forgeSubject: monster.subject,
      forgeDifficulty: difficulty,
      forgeTargetMonster: monster,
      selectedOption: -1,
      forgeResult: '',
      forgeExplain: ''
    });
  },

  selectForgeOption: function(e) {
    if (this.data.forgeResult !== '') return;
    var idx = parseInt(e.currentTarget.dataset.index);
    var q = this.data.currentQuestion;
    var isCorrect = idx === q.answer;

    this.setData({
      selectedOption: idx,
      forgeResult: isCorrect ? 'correct' : 'wrong',
      forgeExplain: q.explain || ''
    });

    var self = this;
    if (isCorrect) {
      // 答对 → 获得法宝
      setTimeout(function() {
        self._acquireTreasure();
      }, 1200);
    } else {
      // 答错 → 换题
      setTimeout(function() {
        self._nextForgeQuestion();
      }, 1800);
    }
  },

  _acquireTreasure: function() {
    var pool = TREASURE_POOL;
    var idx = this.data.treasures.length % pool.length;
    var t = pool[idx];
    var newTreasure = {
      name: t.name,
      emoji: t.emoji,
      color: t.color,
      angle: (360 / (this.data.treasures.length + 1)) * this.data.treasures.length
    };

    var treasures = this.data.treasures.concat([newTreasure]);

    this.setData({
      treasures: treasures,
      state: 'treasure_got'
    });

    // 展示获得动画 1.5秒后回到地图
    var self = this;
    setTimeout(function() {
      self.setData({ state: 'exploring', currentQuestion: null, forgeResult: '' });
    }, 1500);
  },

  _nextForgeQuestion: function() {
    var monster = this.data.forgeTargetMonster;
    var difficulty = this.data.forgeDifficulty;
    var q = game.getQuestion(monster.subject, difficulty);
    if (!q) {
      q = { q: '2 × 3 = ?', options: ['6', '5', '7', '8'], answer: 0, explain: '基础算术。' };
    }
    this.setData({
      currentQuestion: q,
      selectedOption: -1,
      forgeResult: '',
      forgeExplain: ''
    });
  },

  // ===== 地图战斗 =====
  _startMapCombat: function(monster) {
    var m = JSON.parse(JSON.stringify(monster));
    this._combatMonster = m;
    this._combatTreasures = this.data.treasures.slice();
    this._combatIdx = 0;
    this._combatTotalDmg = 0;

    this.setData({
      state: 'combat',
      combatMonster: m,
      combatMonsterHp: m.hp,
      combatMonsterMaxHp: m.maxHp,
      combatTreasureIdx: -1,
      combatPhase: 'start',
      combatLog: '⚔ ' + m.name + ' 出现了！',
      combatDamage: 0
    });

    var self = this;
    setTimeout(function() {
      self._combatNextTreasure();
    }, 800);
  },

  _combatNextTreasure: function() {
    if (this._combatIdx >= this._combatTreasures.length) {
      // 所有法宝都飞完了
      this._combatFinish();
      return;
    }

    var t = this._combatTreasures[this._combatIdx];
    this.setData({
      combatTreasureIdx: this._combatIdx,
      combatPhase: 'launch',
      combatLog: t.emoji + t.name + ' 出击！'
    });

    var self = this;
    // 飞行动画
    setTimeout(function() {
      var dmg = 2;
      self._combatTotalDmg += dmg;
      var newHp = Math.max(0, self.data.combatMonsterHp - dmg);
      self.setData({
        combatPhase: 'hit',
        combatDamage: dmg,
        combatMonsterHp: newHp,
        combatLog: '造成 ' + dmg + ' 点伤害！'
      });

      // 击中后短暂停顿
      setTimeout(function() {
        if (newHp <= 0) {
          // 怪物被击败了
          self._combatFinish();
          return;
        }
        self._combatIdx++;
        self._combatNextTreasure();
      }, 500);
    }, 600);
  },

  _combatFinish: function() {
    var monster = this._combatMonster;
    var totalDmg = this._combatTotalDmg;

    if (monster.hp - totalDmg <= 0) {
      // 胜利！
      var xpReward = monster.type === 'boss' ? 80 : monster.type === 'elite' ? 40 : 20;
      var coinReward = monster.type === 'boss' ? 100 : monster.type === 'elite' ? 50 : 25;

      var char = this.data.char;
      char.xp += xpReward;
      char.coins += coinReward;
      char.kills = (char.kills || 0) + 1;
      if (char.completedNodes.indexOf(monster.id) < 0) {
        char.completedNodes.push(monster.id);
      }
      game.checkLevelUp(char);
      game.updateStreak(char);
      game.saveGame(char);

      // 标记怪物死亡
      var monsters = this.data.monsters;
      for (var i = 0; i < monsters.length; i++) {
        if (monsters[i].id === monster.id) {
          monsters[i].alive = false;
          monsters[i].hp = 0;
          break;
        }
      }

      this.setData({
        state: 'victory',
        combatPhase: 'end',
        combatLog: '🎉 击败了 ' + monster.name + '！',
        char: char,
        monsters: monsters,
        victoryXp: xpReward,
        victoryCoins: coinReward,
        treasures: [],
        regionProgress: this.data.regionProgress + 1
      });

      // 检查区域通关
      this._checkRegionComplete(char, this.data.selectedRegionId, monsters);
    } else {
      // 怪物没死 → 怪物反击 → 需要继续炼宝
      var playerHp = Math.max(0, this.data.combatPlayerHp - 3);
      this.setData({
        state: 'combat_end',
        combatPhase: 'counter',
        combatLog: monster.name + ' 还没倒！对你反击了！',
        combatPlayerHp: playerHp
      });
    }
  },

  // 战斗结束返回探索
  backToExplore: function() {
    this.setData({
      state: 'exploring',
      combatMonster: null,
      combatPhase: ''
    });
  },

  // 战斗后继续炼宝
  forgeAfterCombat: function() {
    var monster = this._combatMonster;
    if (monster && monster.alive) {
      this._startForge(monster);
    } else {
      this.setData({ state: 'exploring' });
    }
  },

  // ===== 区域通关检查 =====
  _checkRegionComplete: function(char, regionId, monsters) {
    var allNormalDone = true;
    var bossAlive = false;
    for (var i = 0; i < monsters.length; i++) {
      if (monsters[i].isBoss) {
        bossAlive = monsters[i].alive;
      } else if (monsters[i].unlocked && monsters[i].alive) {
        allNormalDone = false;
      }
    }
    if (allNormalDone && bossAlive) {
      var dropKey = 'weaponDropped_' + regionId;
      if (!wx.getStorageSync(dropKey)) {
        wx.setStorageSync(dropKey, true);
        var weapon = game.getRegionDropWeapon(regionId);
        if (weapon) {
          this.setData({ showWeaponDrop: true, dropWeapon: weapon });
        }
      }
    }
  },

  confirmWeaponDrop: function() {
    var weapon = this.data.dropWeapon;
    var char = this.data.char;
    if (weapon && char) {
      char.equipment = char.equipment || {};
      char.equipment.weapon = weapon.id;
      game.saveGame(char);
    }
    this.setData({ showWeaponDrop: false, dropWeapon: null, char: char });
  },

  // ===== 摇杆触控 =====
  onJoyTouchStart: function(e) {
    var touch = e.touches[0];
    this._touchId = touch.identifier;
    this._joyCenterX = touch.clientX;
    this._joyCenterY = touch.clientY;
    this.setData({
      joyActive: true,
      joyX: 0,
      joyY: 0,
      joyKnobX: 0,
      joyKnobY: 0
    });
  },

  onJoyTouchMove: function(e) {
    var touch = null;
    for (var i = 0; i < e.touches.length; i++) {
      if (e.touches[i].identifier === this._touchId) {
        touch = e.touches[i];
        break;
      }
    }
    if (!touch) return;

    var dx = touch.clientX - this._joyCenterX;
    var dy = touch.clientY - this._joyCenterY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var maxR = 40;

    if (dist > maxR) {
      dx = (dx / dist) * maxR;
      dy = (dy / dist) * maxR;
      dist = maxR;
    }

    this.setData({
      joyX: dx / maxR,
      joyY: dy / maxR,
      joyKnobX: dx,
      joyKnobY: dy
    });
  },

  onJoyTouchEnd: function() {
    this._touchId = null;
    this.setData({
      joyActive: false,
      joyX: 0,
      joyY: 0,
      joyKnobX: 0,
      joyKnobY: 0,
      playerMoving: false
    });
  },

  // ===== 区域切换 =====
  toggleRegionMenu: function() {
    this.setData({ showRegionMenu: !this.data.showRegionMenu });
  },

  selectRegion: function(e) {
    var regionId = e.currentTarget.dataset.id;
    var region = this.data.regions.find(function(r) { return r.id === regionId; });
    if (!region || !region.unlocked) {
      wx.showToast({ title: '区域未解锁', icon: 'none' });
      return;
    }

    var char = this.data.char;
    char.currentRegion = regionId;
    game.saveGame(char);

    // 重新生成怪物
    var nodes = game.getRegionNodes(regionId, char.completedNodes);
    var monsters = [];
    for (var j = 0; j < nodes.length; j++) {
      var n = nodes[j];
      monsters.push({
        id: n.id, name: n.label, subject: n.subject, type: n.type,
        emoji: n.subject === 'math' ? '📐' : n.subject === 'chinese' ? '📖' : n.subject === 'english' ? '🔤' : n.subject === 'physics' ? '⚡' : n.subject === 'chemistry' ? '🧪' : n.subject === 'biology' ? '🧬' : '📚',
        px: (n.x / 100) * MAP_W, py: (n.y / 100) * MAP_H,
        hp: MONSTER_HP[n.type] || 3, maxHp: MONSTER_HP[n.type] || 3,
        alive: !n.completed, unlocked: n.unlocked,
        isBoss: n.type === 'boss', isElite: n.type === 'elite'
      });
    }

    var rp = 0;
    for (var k = 0; k < monsters.length; k++) { if (!monsters[k].alive) rp++; }

    this.setData({
      char: char,
      selectedRegionId: regionId,
      selectedRegion: region,
      monsters: monsters,
      showRegionMenu: false,
      regionProgress: rp,
      regionTotal: monsters.length,
      treasures: [],
      playerX: MAP_W * 0.15,
      playerY: MAP_H * 0.15
    });
  },

  // ===== 宝箱 =====
  openChest: function() {
    var char = this.data.char;
    var reward = Math.floor(Math.random() * 50) + 20;
    char.coins += reward;
    game.saveGame(char);
    wx.setStorageSync('lastChestDate', new Date().toDateString());
    this.setData({ char: char, showChest: false });
    wx.showToast({ title: '获得 ' + reward + ' 金币!', icon: 'success' });
  }
});
