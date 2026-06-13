var game = require('../../utils/game');

// ========== 常量 ==========
var MAP_W = 3000;
var MAP_H = 3000;
var PLAYER_SPEED = 5;
var DETECT_RANGE = 300;   // 怪物感知半径
var COMBAT_RANGE = 100;   // 飞刀攻击范围
var KNIFE_CONSUME_TICKS = 60;  // 每消耗1把飞刀的帧数(~1秒)
var KNIFE_BASE_DMG = 3;       // 每把飞刀基础伤害
var MONSTER_DPS = 3;      // 怪物每秒对主角伤害
var TICK_MS = 16;

var MONSTER_HP = { normal: 30, elite: 60, boss: 150 };
var MONSTER_SPEED = { normal: 1.5, elite: 2.2, boss: 2.8 };

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

var MAX_KNIVES = TREASURE_POOL.length; // 初始满飞刀(8把)

var BUFF_POOL = game.BUFF_POOL;

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

    // 法宝(环绕) - 消耗品
    treasures: [],
    treasureAngle: 0,

    // 永久Buff
    buffs: [],
    buffList: [],   // 显示用

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
    forgeRewardKnives: 0,
    forgeRewardBuff: null,
    forgeTransition: false,
    showForgeText: false,

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
    this._dmgTimers = {};   // monsterId -> lastDmgFrame
    this._playerDmgTimer = 0;
    this._knifeConsumeTimer = 0;

    // 隐藏底部TabBar
    try { wx.hideTabBar(); } catch (e) {}

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
    try { wx.hideTabBar(); } catch (e) {}
  },

  // ===== 数据加载 =====
  loadData: function() {
    var char = game.loadGame();
    if (!char) {
      wx.redirectTo({ url: '/pages/onboarding/onboarding' });
      return;
    }
    char = game.updateStreak(char);

    // 确保buffs数组存在
    if (!char.buffs) char.buffs = [];
    // 确保有飞刀(默认满刀)
    if (!char.treasureCount || char.treasureCount < 1) char.treasureCount = MAX_KNIVES;

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

    // 恢复已有法宝(飞刀)
    var treasures = [];
    for (var t = 0; t < char.treasureCount; t++) {
      var pool = TREASURE_POOL;
      treasures.push(pool[t % pool.length]);
    }

    // 恢复buff显示
    var buffList = this._buildBuffList(char.buffs);

    this.setData({
      char: char,
      rank: rank,
      regions: regions,
      selectedRegionId: selId,
      selectedRegion: selRegion,
      monsters: monsters,
      treasures: treasures,
      buffs: char.buffs,
      buffList: buffList,
      showChest: lastChest !== today,
      showHint: treasures.length <= 1
    });
  },

  _buildBuffList: function(buffIds) {
    var list = [];
    for (var i = 0; i < buffIds.length; i++) {
      for (var j = 0; j < BUFF_POOL.length; j++) {
        if (BUFF_POOL[j].id === buffIds[i]) {
          list.push(BUFF_POOL[j]);
          break;
        }
      }
    }
    return list;
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
    } else if (this.data.forgeTransition) {
      // 慢动作过渡: 怪物极慢移动
      this._updateMonsterAI(true);
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

  // ===== 实时战斗 (消耗飞刀机制) =====
  _updateCombat: function() {
    var monsters = this.data.monsters;
    var px = this.data.playerX;
    var py = this.data.playerY;
    var treasures = this.data.treasures;
    var knifeCount = treasures.length;
    var tick = this._tickCount;
    var char = this.data.char;
    var buffs = char.buffs || [];
    var dmgList = [];
    var dirty = false;

    // 护盾期间怪物不攻击主角
    var shielded = this.data.forgeShieldFrames > 0;

    // 检测附近是否有怪物
    var hasNearby = false;
    for (var i = 0; i < monsters.length; i++) {
      var m = monsters[i];
      if (!m.alive || !m.unlocked) continue;
      var dx = px - m.px;
      var dy = py - m.py;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < COMBAT_RANGE) {
        hasNearby = true;
        break;
      }
    }

    // 飞刀消耗计时器 - 有怪物在附近时消耗飞刀
    if (hasNearby && knifeCount > 0) {
      this._knifeConsumeTimer++;
    } else {
      this._knifeConsumeTimer = 0;
    }

    // 消耗飞刀并造成伤害
    if (this._knifeConsumeTimer >= KNIFE_CONSUME_TICKS && knifeCount > 0) {
      this._knifeConsumeTimer = 0;

      // 消耗一把飞刀
      var consumed = treasures.pop();
      knifeCount = treasures.length;

      // 计算伤害(含buff加成)
      var dmg = KNIFE_BASE_DMG;
      // 火焰附魔: +2额外伤害
      if (buffs.indexOf('fire') >= 0) dmg += 2;
      // 暴击之心: 第一把刀伤害翻倍
      if (buffs.indexOf('crit') >= 0 && knifeCount === 0) dmg *= 2;

      // 对最近的怪物造成伤害
      var nearest = null;
      var minDist = Infinity;
      for (var i = 0; i < monsters.length; i++) {
        var m = monsters[i];
        if (!m.alive || !m.unlocked) continue;
        var dx2 = px - m.px;
        var dy2 = py - m.py;
        var d = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (d < COMBAT_RANGE && d < minDist) {
          minDist = d;
          nearest = m;
        }
      }

      if (nearest) {
        nearest.hp = Math.max(0, nearest.hp - dmg);
        dmgList.push({
          id: ++this._dmgId,
          x: nearest.px + (Math.random() - 0.5) * 30,
          y: nearest.py - 50,
          value: dmg,
          isPlayer: false
        });

        if (nearest.hp <= 0) {
          this._onMonsterKilled(nearest, char);
        }
        dirty = true;
      }
    }

    // 怪物攻击主角 (每秒)
    if (!shielded && tick % 60 === 0) {
      for (var i = 0; i < monsters.length; i++) {
        var m = monsters[i];
        if (!m.alive || !m.unlocked) continue;
        var dx3 = px - m.px;
        var dy3 = py - m.py;
        var dist3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

        if (dist3 < COMBAT_RANGE) {
          var mDmg = MONSTER_DPS;
          // 护体金甲: 减伤30%
          if (buffs.indexOf('armor') >= 0) {
            mDmg = Math.max(1, Math.floor(mDmg * 0.7));
          }
          char.hp = Math.max(0, char.hp - mDmg);

          dmgList.push({
            id: ++this._dmgId,
            x: px + (Math.random() - 0.5) * 20,
            y: py - 55,
            value: mDmg,
            isPlayer: true
          });

          // 荆棘之盾: 反射50%伤害
          if (buffs.indexOf('thorns') >= 0 && m.alive) {
            var reflectDmg = Math.floor(mDmg * 0.5);
            if (reflectDmg > 0) {
              m.hp = Math.max(0, m.hp - reflectDmg);
              dmgList.push({
                id: ++this._dmgId,
                x: m.px + (Math.random() - 0.5) * 20,
                y: m.py - 40,
                value: reflectDmg,
                isPlayer: false
              });
              if (m.hp <= 0) {
                this._onMonsterKilled(m, char);
              }
            }
          }

          dirty = true;
          break; // 每秒只受一次怪物攻击
        }
      }
    }

    // 飞刀用尽 -> 慢动作过渡 -> 炼宝
    if (treasures.length === 0 && this.data.state === 'exploring' && !this._forgeTriggered) {
      this._forgeTriggered = true;
      game.saveGame(char);
      this._startForgeTransition();
    }

    // HP过低也能触发炼宝(兜底)
    if (char.hp > 0 && char.hp < char.maxHP * 0.15 && this.data.state === 'exploring' && !this._forgeTriggered) {
      this._forgeTriggered = true;
      game.saveGame(char);
      this._startForgeTransition();
    }

    if (dmgList.length > 0) {
      var current = this.data.dmgNumbers.slice();
      for (var d = 0; d < dmgList.length; d++) {
        current.push(dmgList[d]);
      }
      if (current.length > 10) current = current.slice(current.length - 10);
      this.setData({ dmgNumbers: current, hitFlash: true });
      var self3 = this;
      setTimeout(function() { self3.setData({ hitFlash: false }); }, 150);
    }

    if (dirty) {
      this.setData({ monsters: monsters, char: char, treasures: treasures });
    }
  },

  _cleanDmgNumbers: function(update) {
    if (this.data.dmgNumbers.length > 0 && this._tickCount % 30 === 0) {
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

    // 吸血光环: 击杀回复15HP
    if (char.buffs && char.buffs.indexOf('lifesteal') >= 0) {
      char.hp = Math.min(char.maxHP, char.hp + 15);
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
          var newPx = Math.random() * (MAP_W - 400) + 200;
          var newPy = Math.random() * (MAP_H - 400) + 200;
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

  // ===== 慢动作过渡 -> 炼宝 =====
  _startForgeTransition: function() {
    var self = this;

    // 1. 进入慢动作状态(怪物极慢移动)
    this.setData({ forgeTransition: true });

    // 2. 0.6秒后显示"飞刀耗尽!"文字
    setTimeout(function() {
      self.setData({ showForgeText: true });
    }, 600);

    // 3. 1.8秒后淡入炼宝面板
    setTimeout(function() {
      self.setData({
        forgeTransition: false,
        showForgeText: false
      });
      self._forgeTriggered = false;
      self._triggerForge();
    }, 1800);
  },

  // ===== 炼宝系统 =====
  _triggerForge: function() {
    if (this.data.state === 'forging') return;

    var subject = this._findNearestSubject();

    var questions = [];
    for (var i = 0; i < FORGE_COUNT; i++) {
      var q = game.getQuestion(subject, 'easy');
      if (q) questions.push(q);
    }

    if (questions.length === 0) {
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
      forgeShieldFrames: FORGE_SHIELD,
      forgeRewardKnives: 0,
      forgeRewardBuff: null
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
    var char = this.data.char;
    var buffs = char.buffs || [];
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
    if (history.length > 200) {
      history = history.slice(history.length - 200);
    }
    wx.setStorageSync('answerHistory', history);

    // === 消耗层: 补充飞刀 ===
    var newKnives = correct;  // 每答对1题得1把
    if (correct >= 4) newKnives += 1; // 答对4题以上额外+1
    if (correct === 5) newKnives += 1; // 全对再+1
    // 保证至少有1把
    if (newKnives < 1) newKnives = 1;

    var treasures = [];
    var totalKnives = newKnives;
    for (var i = 0; i < totalKnives; i++) {
      treasures.push(pool[i % pool.length]);
    }

    // === 永久层: 尝试获得buff ===
    var rewardBuff = null;
    if (correct >= 3) {
      // 找出还没有的buff
      var available = [];
      for (var b = 0; b < BUFF_POOL.length; b++) {
        if (buffs.indexOf(BUFF_POOL[b].id) < 0) {
          available.push(BUFF_POOL[b]);
        }
      }
      if (available.length > 0) {
        // 答对越多概率越高: 3题50%, 4题75%, 5题100%
        var buffChance = correct === 5 ? 1.0 : correct === 4 ? 0.75 : 0.5;
        if (Math.random() < buffChance) {
          var picked = available[Math.floor(Math.random() * available.length)];
          buffs.push(picked.id);
          rewardBuff = picked;
        }
      }
    }

    // 更新角色数据
    char.treasureCount = totalKnives;
    char.buffs = buffs;
    char.hp = Math.min(char.maxHP, char.hp + 30); // 炼宝后回复30HP
    game.saveGame(char);

    var buffList = this._buildBuffList(buffs);

    this.setData({
      state: 'exploring',
      treasures: treasures,
      char: char,
      buffs: buffs,
      buffList: buffList,
      forgeQuestions: [],
      forgeResults: [],
      forgeShieldFrames: 0,
      forgeRewardKnives: totalKnives,
      forgeRewardBuff: rewardBuff,
      showHint: false
    });

    // 显示奖励
    var msg = '获得 ' + totalKnives + ' 把飞刀!';
    if (rewardBuff) {
      msg += ' + ' + rewardBuff.name + '!';
    }
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    });
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

    // 确保有飞刀
    if (!char.treasureCount || char.treasureCount < 1) char.treasureCount = MAX_KNIVES;
    var treasures = [];
    for (var t = 0; t < char.treasureCount; t++) {
      treasures.push(TREASURE_POOL[t % TREASURE_POOL.length]);
    }

    this.setData({
      char: char,
      selectedRegionId: regionId,
      selectedRegion: region,
      monsters: monsters,
      showRegionMenu: false,
      treasures: treasures,
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
