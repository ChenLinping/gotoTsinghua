var game = require('../../utils/game');

// ========== 常量 ==========
var MAP_W = 3000;
var MAP_H = 3000;
var PLAYER_SPEED = 5;
var DETECT_RANGE = 300;   // 怪物感知半径
var COMBAT_RANGE = 100;   // 飞刀攻击范围
var KNIFE_DPS = 3;        // 每把飞刀每秒伤害
var MONSTER_DPS = 3;      // 怪物每秒对主角伤害
var TICK_MS = 16;

var MONSTER_HP = { normal: 30, elite: 60, boss: 150 };
var MONSTER_SPEED = { normal: 1.5, elite: 2.2, boss: 2.8 };

var FORGE_HP_RATIO = 0.3;  // 血量低于30%触发炼宝
var FORGE_SHIELD = 300;     // 炼宝护盾帧数(~5秒)
var FORGE_COUNT = 5;        // 每轮5道题
var RESPAWN_TICKS = 900;    // 怪物重生间隔(~15秒)

var TREASURE_POOL = [
  { name: '飞刀', emoji: '\uD83D\uDDE1\uFE0F' },
  { name: '火球', emoji: '\uD83D\uDD25' },
  { name: '雷电', emoji: '\u26A1' },
  { name: '冰晶', emoji: '\u2744\uFE0F' },
  { name: '风刃', emoji: '\uD83C\uDF00' },
  { name: '光盾', emoji: '\uD83D\uDC8E' },
  { name: '暗星', emoji: '\uD83C\uDF11' },
  { name: '圣剑', emoji: '\u2694\uFE0F' }
];

// ========== Page ==========
Page({
  data: {
    // 状态机: exploring | forging
    state: 'exploring',
    char: null,
    rank: null,
    selectedRegionId: null,
    selectedRegion: null,
    regions: [],

    // 相机
    camX: 0, camY: 0,

    // 玩家
    playerX: 450, playerY: 450,
    playerMoving: false,

    // 怪物
    monsters: [],

    // 法宝(环绕)
    treasures: [],
    treasureAngle: 0,

    // 摇杆
    joyX: 0, joyY: 0,
    joyKnobX: 0, joyKnobY: 0,
    joyActive: false,

    // 炼宝(5题)
    forgeQuestions: [],
    forgeIdx: 0,
    forgeCorrect: 0,
    forgeWrong: 0,
    forgeResults: [],   // '' | 'correct' | 'wrong'
    forgeSelectedOption: -1,
    forgeShowResult: false,
    forgeSubject: '',
    forgeShieldFrames: 0,

    // HUD
    showChest: false,
    showRegionMenu: false,
    showWeaponDrop: false,
    dropWeapon: null,

    // 伤害飘字
    dmgNumbers: [],

    // 红屏闪烁
    hitFlash: false,

    // 提示
    showHint: true,

    // 网格
    gridRows: []
  },

  // ===== 生命周期 =====
  onLoad: function() {
    this._touchId = null;
    this._joyCenterX = 0;
    this._joyCenterY = 0;
    this._loopTimer = null;
    this._tickCount = 0;
    this._dmgId = 0;
    this._dmgTimers = {};   // monsterId → lastDmgFrame
    this._playerDmgTimer = 0;

    // 屏幕尺寸
    var sys = wx.getSystemInfoSync();
    this._vpW = sys.windowWidth || 667;
    this._vpH = sys.windowHeight || 375;

    // 地面网格
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

  onUnload: function() { this._stopLoop(); },
  onHide: function() { this._stopLoop(); },

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
    var selId = char.currentRegion || (regions[0] && regions[0].id);
    var selRegion = null;
    for (var i = 0; i < regions.length; i++) {
      if (regions[i].id === selId) { selRegion = regions[i]; break; }
    }

    var monsters = this._buildMonsters(selId, char.completedNodes);
    var rank = game.getRankByLevel(char.level);

    var today = new Date().toDateString();
    var lastChest = wx.getStorageSync('lastChestDate');

    // 恢复已有法宝
    var treasures = [];
    if (char.treasureCount) {
      for (var t = 0; t < char.treasureCount; t++) {
        var pool = TREASURE_POOL;
        treasures.push(pool[t % pool.length]);
      }
    }

    this.setData({
      char: char,
      rank: rank,
      regions: regions,
      selectedRegionId: selId,
      selectedRegion: selRegion,
      monsters: monsters,
      treasures: treasures,
      showChest: lastChest !== today,
      showHint: treasures.length === 0
    });
  },

  _buildMonsters: function(regionId, completedNodes) {
    var nodes = game.getRegionNodes(regionId, completedNodes);
    var monsters = [];
    for (var j = 0; j < nodes.length; j++) {
      var n = nodes[j];
      var hp = MONSTER_HP[n.type] || 30;
      var emoji = this._subjectEmoji(n.subject);
      monsters.push({
        id: n.id,
        name: n.label,
        subject: n.subject,
        type: n.type,
        emoji: emoji,
        px: (n.x / 100) * MAP_W,
        py: (n.y / 100) * MAP_H,
        hp: n.completed ? 0 : hp,
        maxHp: hp,
        alive: !n.completed,
        unlocked: n.unlocked,
        isBoss: n.type === 'boss',
        isElite: n.type === 'elite',
        // AI
        aiState: n.completed ? 'dead' : 'patrol',
        patrolDx: 0,
        patrolDy: 0,
        patrolTimer: 0,
        respawnTimer: n.completed ? Math.floor(Math.random() * 300) + 300 : 0
      });
    }
    return monsters;
  },

  _subjectEmoji: function(subject) {
    var map = {
      math: '\uD83D\uDCD0', chinese: '\uD83D\uDCD6', english: '\uD83D\uDD24',
      physics: '\u26A1', chemistry: '\uD83E\uDDEA', biology: '\uD83E\uDDEC'
    };
    return map[subject] || '\uD83D\uDCDA';
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
    this._tickCount++;
    var update = {};

    // 法宝始终旋转
    if (this.data.treasures.length > 0) {
      update.treasureAngle = (this.data.treasureAngle + 2) % 360;
    }

    // 护盾倒计时
    if (this.data.forgeShieldFrames > 0) {
      update.forgeShieldFrames = this.data.forgeShieldFrames - 1;
    }

    if (this.data.state === 'exploring') {
      this._updatePlayerMovement(update);
      this._updateMonsterAI();
      this._updateCombat();
    } else if (this.data.state === 'forging') {
      // 炼宝时怪物减速(不攻击)
      this._updateMonsterAI(true);
    }

    // 怪物重生
    this._updateRespawn();

    // 清理过期伤害飘字
    this._cleanDmgNumbers(update);

    if (Object.keys(update).length > 0) {
      this.setData(update);
    }
  },

  // ===== 玩家移动 =====
  _updatePlayerMovement: function(update) {
    if (!this.data.joyActive) {
      if (this.data.playerMoving) update.playerMoving = false;
      return;
    }

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

    update.playerX = px;
    update.playerY = py;
    update.camX = cx;
    update.camY = cy;
    update.playerMoving = true;
  },

  // ===== 怪物AI =====
  _updateMonsterAI: function(slowMode) {
    var monsters = this.data.monsters;
    var px = this.data.playerX;
    var py = this.data.playerY;
    var dirty = false;
    var speedMul = slowMode ? 0.2 : 1;

    for (var i = 0; i < monsters.length; i++) {
      var m = monsters[i];
      if (!m.alive || !m.unlocked) continue;

      var dx = px - m.px;
      var dy = py - m.py;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < DETECT_RANGE) {
        m.aiState = 'chase';
        var spd = (MONSTER_SPEED[m.type] || 1.5) * speedMul;
        if (dist > 1) {
          m.px += (dx / dist) * spd;
          m.py += (dy / dist) * spd;
        }
      } else {
        if (m.aiState !== 'patrol') {
          m.aiState = 'patrol';
          m.patrolTimer = 0;
        }
        // 巡逻
        if (m.patrolTimer <= 0) {
          var angle = Math.random() * Math.PI * 2;
          m.patrolDx = Math.cos(angle) * 0.8;
          m.patrolDy = Math.sin(angle) * 0.8;
          m.patrolTimer = Math.floor(Math.random() * 120) + 60;
        }
        m.patrolTimer--;
        m.px += m.patrolDx * speedMul;
        m.py += m.patrolDy * speedMul;
      }

      // 边界
      m.px = Math.max(80, Math.min(MAP_W - 80, m.px));
      m.py = Math.max(80, Math.min(MAP_H - 80, m.py));
      dirty = true;
    }

    if (dirty) {
      this.setData({ monsters: monsters });
    }
  },

  // ===== 实时战斗 =====
  _updateCombat: function() {
    var monsters = this.data.monsters;
    var px = this.data.playerX;
    var py = this.data.playerY;
    var treasures = this.data.treasures;
    var knifeCount = treasures.length;
    var tick = this._tickCount;
    var char = this.data.char;
    var dmgList = [];
    var dirty = false;

    // 护盾期间怪物不攻击主角
    var shielded = this.data.forgeShieldFrames > 0;

    for (var i = 0; i < monsters.length; i++) {
      var m = monsters[i];
      if (!m.alive || !m.unlocked) continue;

      var dx = px - m.px;
      var dy = py - m.py;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < COMBAT_RANGE) {
        // 飞刀攻击怪物
        if (knifeCount > 0 && tick % 20 === 0) {
          var dmg = knifeCount;
          m.hp = Math.max(0, m.hp - dmg);

          if (!this._dmgTimers[m.id] || tick - this._dmgTimers[m.id] >= 20) {
            this._dmgTimers[m.id] = tick;
            dmgList.push({
              id: ++this._dmgId,
              x: m.px + (Math.random() - 0.5) * 30,
              y: m.py - 50,
              value: dmg,
              isPlayer: false
            });
          }

          if (m.hp <= 0) {
            this._onMonsterKilled(m, char);
          }
          dirty = true;
        }

        // 怪物攻击主角
        if (!shielded && tick % 30 === 0) {
          var mDmg = MONSTER_DPS;
          char.hp = Math.max(0, char.hp - mDmg);

          dmgList.push({
            id: ++this._dmgId,
            x: px + (Math.random() - 0.5) * 20,
            y: py - 55,
            value: mDmg,
            isPlayer: true
          });

          dirty = true;

          // 触发炼宝
          if (char.hp < char.maxHP * FORGE_HP_RATIO && char.hp > 0) {
            game.saveGame(char);
            this.setData({ char: char, monsters: monsters, hitFlash: true });
            var self = this;
            setTimeout(function() { self.setData({ hitFlash: false }); }, 200);
            this._triggerForge();
            return;
          }
        }
      }
    }

    if (dmgList.length > 0) {
      var current = this.data.dmgNumbers.slice();
      for (var d = 0; d < dmgList.length; d++) {
        current.push(dmgList[d]);
      }
      // 限制最多显示10个
      if (current.length > 10) current = current.slice(current.length - 10);
      this.setData({ dmgNumbers: current, hitFlash: true });
      var self2 = this;
      setTimeout(function() { self2.setData({ hitFlash: false }); }, 150);
    }

    if (dirty) {
      this.setData({ monsters: monsters, char: char });
    }
  },

  _cleanDmgNumbers: function(update) {
    if (this.data.dmgNumbers.length > 0 && this._tickCount % 30 === 0) {
      // 保留最近的5个，清除旧的
      var nums = this.data.dmgNumbers;
      if (nums.length > 5) {
        update.dmgNumbers = nums.slice(nums.length - 5);
      } else if (this._tickCount % 60 === 0) {
        update.dmgNumbers = [];
      }
    }
  },

  // ===== 怪物被击杀 =====
  _onMonsterKilled: function(monster, char) {
    monster.alive = false;
    monster.hp = 0;
    monster.aiState = 'dead';
    monster.respawnTimer = RESPAWN_TICKS;

    var xpReward = monster.type === 'boss' ? 80 : monster.type === 'elite' ? 40 : 20;
    var coinReward = monster.type === 'boss' ? 100 : monster.type === 'elite' ? 50 : 25;

    char.xp += xpReward;
    char.coins += coinReward;
    char.kills = (char.kills || 0) + 1;
    if (char.completedNodes.indexOf(monster.id) < 0) {
      char.completedNodes.push(monster.id);
    }
    game.checkLevelUp(char);
    game.updateStreak(char);
    game.saveGame(char);

    // 检查武器掉落
    this._checkWeaponDrop(char, monster);
  },

  // ===== 怪物重生 =====
  _updateRespawn: function() {
    var monsters = this.data.monsters;
    var dirty = false;

    for (var i = 0; i < monsters.length; i++) {
      var m = monsters[i];
      if (m.alive || m.isBoss) continue; // Boss不重生

      if (m.respawnTimer > 0) {
        m.respawnTimer--;
        if (m.respawnTimer <= 0) {
          // 重生：随机位置
          var newPx = Math.random() * (MAP_W - 400) + 200;
          var newPy = Math.random() * (MAP_H - 400) + 200;
          // 不要离玩家太近
          var dpx = newPx - this.data.playerX;
          var dpy = newPy - this.data.playerY;
          if (Math.sqrt(dpx * dpx + dpy * dpy) < 300) {
            newPx = (newPx + 500) % (MAP_W - 200) + 100;
          }
          m.px = newPx;
          m.py = newPy;
          m.hp = m.maxHp;
          m.alive = true;
          m.aiState = 'patrol';
          m.patrolTimer = 0;
          dirty = true;
        }
      }
    }

    if (dirty) {
      this.setData({ monsters: monsters });
    }
  },

  // ===== 炼宝系统 =====
  _triggerForge: function() {
    // 找一个最近的活怪作为出题科目来源
    var subject = this._findNearestSubject();

    var questions = [];
    for (var i = 0; i < FORGE_COUNT; i++) {
      var q = game.getQuestion(subject, 'easy');
      if (q) questions.push(q);
    }

    if (questions.length === 0) {
      // 兜底
      questions.push({
        q: '1 + 1 = ?', options: ['2', '3', '4', '5'],
        answer: 0, explain: '基础算术'
      });
    }

    this.setData({
      state: 'forging',
      forgeQuestions: questions,
      forgeIdx: 0,
      forgeCorrect: 0,
      forgeWrong: 0,
      forgeResults: new Array(questions.length).fill(''),
      forgeSelectedOption: -1,
      forgeShowResult: false,
      forgeSubject: subject,
      forgeShieldFrames: FORGE_SHIELD
    });
  },

  _findNearestSubject: function() {
    var px = this.data.playerX;
    var py = this.data.playerY;
    var nearest = null;
    var minDist = Infinity;
    var monsters = this.data.monsters;

    for (var i = 0; i < monsters.length; i++) {
      var m = monsters[i];
      if (!m.alive) continue;
      var dx = px - m.px;
      var dy = py - m.py;
      var dist = dx * dx + dy * dy;
      if (dist < minDist) {
        minDist = dist;
        nearest = m;
      }
    }

    return nearest ? nearest.subject : 'math';
  },

  selectForgeOption: function(e) {
    if (this.data.forgeShowResult) return;

    var idx = parseInt(e.currentTarget.dataset.index);
    var qIdx = this.data.forgeIdx;
    var q = this.data.forgeQuestions[qIdx];
    var isCorrect = idx === q.answer;

    var results = this.data.forgeResults.slice();
    results[qIdx] = isCorrect ? 'correct' : 'wrong';

    var correct = this.data.forgeCorrect + (isCorrect ? 1 : 0);
    var wrong = this.data.forgeWrong + (isCorrect ? 0 : 1);

    this.setData({
      forgeSelectedOption: idx,
      forgeShowResult: true,
      forgeResults: results,
      forgeCorrect: correct,
      forgeWrong: wrong
    });

    var self = this;
    setTimeout(function() {
      self._forgeNextQuestion();
    }, 1200);
  },

  _forgeNextQuestion: function() {
    var nextIdx = this.data.forgeIdx + 1;

    if (nextIdx >= this.data.forgeQuestions.length) {
      this._forgeComplete();
      return;
    }

    this.setData({
      forgeIdx: nextIdx,
      forgeSelectedOption: -1,
      forgeShowResult: false
    });
  },

  _forgeComplete: function() {
    var correct = this.data.forgeCorrect;
    var treasures = this.data.treasures.slice();
    var pool = TREASURE_POOL;

    // 保存答题记录
    var history = wx.getStorageSync('answerHistory') || [];
    var questions = this.data.forgeQuestions;
    var results = this.data.forgeResults;
    var subject = this.data.forgeSubject;
    var now = new Date();
    var dateStr = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

    for (var h = 0; h < questions.length; h++) {
      if (results[h]) {
        history.push({
          q: questions[h].q,
          options: questions[h].options,
          answer: questions[h].answer,
          correct: results[h] === 'correct',
          subject: subject,
          date: dateStr,
          explain: questions[h].explain || ''
        });
      }
    }

    // 限制最多保存200条
    if (history.length > 200) {
      history = history.slice(history.length - 200);
    }
    wx.setStorageSync('answerHistory', history);

    // 每答对一题多一把法宝
    for (var i = 0; i < correct; i++) {
      var t = pool[treasures.length % pool.length];
      treasures.push(t);
    }

    var char = this.data.char;
    char.treasureCount = treasures.length;
    char.hp = char.maxHP; // 炼宝后恢复满血
    game.saveGame(char);

    this.setData({
      state: 'exploring',
      treasures: treasures,
      char: char,
      forgeQuestions: [],
      forgeResults: [],
      forgeShieldFrames: 0,
      showHint: false
    });

    if (correct > 0) {
      wx.showToast({
        title: '获得 ' + correct + ' 件法宝!',
        icon: 'success',
        duration: 1500
      });
    }
  },

  // ===== 武器掉落 =====
  _checkWeaponDrop: function(char, killedMonster) {
    var monsters = this.data.monsters;
    var nonBossDone = true;
    for (var i = 0; i < monsters.length; i++) {
      if (!monsters[i].isBoss && monsters[i].alive && monsters[i].unlocked) {
        nonBossDone = false;
        break;
      }
    }
    if (!nonBossDone) return;

    var dropKey = 'weaponDropped_' + this.data.selectedRegionId;
    if (wx.getStorageSync(dropKey)) return;

    wx.setStorageSync(dropKey, true);
    var weapon = game.getRegionDropWeapon(this.data.selectedRegionId);
    if (weapon) {
      this.setData({ showWeaponDrop: true, dropWeapon: weapon });
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
    this.setData({ joyActive: true, joyX: 0, joyY: 0, joyKnobX: 0, joyKnobY: 0 });
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
      joyActive: false, joyX: 0, joyY: 0,
      joyKnobX: 0, joyKnobY: 0, playerMoving: false
    });
  },

  // ===== 区域切换 =====
  toggleRegionMenu: function() {
    this.setData({ showRegionMenu: !this.data.showRegionMenu });
  },

  selectRegion: function(e) {
    var regionId = e.currentTarget.dataset.id;
    var region = null;
    var regions = this.data.regions;
    for (var r = 0; r < regions.length; r++) {
      if (regions[r].id === regionId) { region = regions[r]; break; }
    }
    if (!region || !region.unlocked) {
      wx.showToast({ title: '区域未解锁', icon: 'none' });
      return;
    }

    var char = this.data.char;
    char.currentRegion = regionId;
    game.saveGame(char);

    var monsters = this._buildMonsters(regionId, char.completedNodes);

    this.setData({
      char: char,
      selectedRegionId: regionId,
      selectedRegion: region,
      monsters: monsters,
      showRegionMenu: false,
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
