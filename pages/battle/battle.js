// ==========================================
// 走向清华 V2 - 战斗页面
// ==========================================
var game = require('../../utils/game');

Page({
  data: {
    // Monster
    monster: null,
    monsterHpPercent: 100,

    // Player
    char: null,
    charStats: null,
    playerHp: 100,
    playerMaxHp: 100,
    playerHpPercent: 100,

    // Question
    currentQuestion: null,
    questionIndex: 0,
    selectedOption: -1,
    showResult: false,
    isCorrect: false,
    explanation: '',
    answeredOptions: [],

    // Battle state
    battleOver: false,
    victory: false,
    defeat: false,
    isAttacking: false,
    isMonsterDamaged: false,
    isPlayerDamaged: false,

    // Rewards
    rewards: null,
    leveledUp: false,
    newAchievements: [],

    // Combat log
    battleLog: [],

    // Damage display
    showPlayerDamage: false,
    playerDamageAmount: 0,
    showMonsterDamage: false,
    monsterDamageAmount: 0,
    showCrit: false,

    // Node info
    nodeLabel: '',

    // Progress tracking
    answerHistory: [],
    progressDots: []
  },

  // ===== Lifecycle =====
  onLoad: function(options) {
    var regionId = parseInt(options.regionId) || 1;
    var nodeId = options.nodeId || '';

    var region = null;
    for (var i = 0; i < game.REGIONS.length; i++) {
      if (game.REGIONS[i].id === regionId) {
        region = game.REGIONS[i];
        break;
      }
    }
    if (!region) {
      wx.showToast({ title: '区域数据错误', icon: 'none' });
      return;
    }

    var node = null;
    for (var j = 0; j < region.nodes.length; j++) {
      if (region.nodes[j].id === nodeId) {
        node = region.nodes[j];
        break;
      }
    }
    if (!node) {
      wx.showToast({ title: '节点数据错误', icon: 'none' });
      return;
    }

    this.regionId = regionId;
    this.nodeId = nodeId;
    this.nodeType = node.type;
    this.subject = node.subject;
    this.nodeLabel = node.label;
    this.difficulty = node.type; // 'normal' → easy, 'elite' → medium, 'boss' → hard

    var char = game.loadGame();
    if (!char) {
      wx.showToast({ title: '角色数据丢失', icon: 'none' });
      return;
    }

    this.char = char;
    this.initBattle();
  },

  // ===== Battle Initialization =====
  initBattle: function() {
    var char = this.char;
    var charStats = game.getCharStats(char);
    var monster = game.createMonster(this.nodeType, this.regionId, this.subject);
    var question = game.getQuestion(this.subject, this.difficulty);

    // Fallback if no question available
    if (!question) {
      question = this._getFallbackQuestion();
    }

    this.setData({
      char: char,
      charStats: charStats,
      monster: monster,
      monsterHpPercent: 100,
      playerHp: char.hp,
      playerMaxHp: charStats.maxHP,
      playerHpPercent: Math.round((char.hp / charStats.maxHP) * 100),
      currentQuestion: question,
      questionIndex: 0,
      selectedOption: -1,
      showResult: false,
      isCorrect: false,
      explanation: '',
      answeredOptions: [],
      battleOver: false,
      victory: false,
      defeat: false,
      isAttacking: false,
      isMonsterDamaged: false,
      isPlayerDamaged: false,
      rewards: null,
      leveledUp: false,
      newAchievements: [],
      battleLog: ['⚔️ 战斗开始！遭遇了 ' + monster.emoji + monster.name + '（' + monster.typeName + '）'],
      showPlayerDamage: false,
      playerDamageAmount: 0,
      showMonsterDamage: false,
      monsterDamageAmount: 0,
      showCrit: false,
      nodeLabel: this.nodeLabel,
      answerHistory: [],
      progressDots: []
    });
  },

  // ===== Answer Selection =====
  selectAnswer: function(e) {
    // Guard: prevent double-tap or answering during animation
    if (this.data.showResult || this.data.battleOver || this.data.isAttacking) {
      return;
    }

    var selectedIndex = parseInt(e.currentTarget.dataset.index);
    var question = this.data.currentQuestion;
    var monster = this.data.monster;
    var charStats = this.data.charStats;
    var isCorrect = selectedIndex === question.answer;

    // Mark answered options for styling
    var answeredOptions = [];
    for (var i = 0; i < 4; i++) {
      if (i === question.answer) {
        answeredOptions.push('correct');
      } else if (i === selectedIndex && !isCorrect) {
        answeredOptions.push('wrong');
      } else {
        answeredOptions.push('normal');
      }
    }

    this.setData({
      selectedOption: selectedIndex,
      showResult: true,
      isCorrect: isCorrect,
      explanation: question.explain || '',
      answeredOptions: answeredOptions
    });

    var self = this;

    if (isCorrect) {
      // === CORRECT ANSWER: Player attacks monster ===
      var isCrit = Math.random() < charStats.critRate;
      var damage = game.calcDamage(charStats, isCrit);
      var oldMonsterHp = monster.hp;
      var newMonsterHp = Math.max(0, oldMonsterHp - damage);

      monster.correctCount++;
      monster.questionsAnswered++;

      // Track answer history and update progress dots
      var answerHistory = this.data.answerHistory.concat([true]);
      var progressDots = this._buildProgressDots(answerHistory);

      // Add to battle log
      var logEntry = '✅ 答对了！对' + monster.name + '造成 ' + damage + ' 点伤害';
      if (isCrit) {
        logEntry += '（暴击！）';
      }
      var battleLog = this.data.battleLog.concat([logEntry]);

      // Trigger attack animation
      this.setData({
        isAttacking: true,
        showPlayerDamage: true,
        playerDamageAmount: damage,
        showCrit: isCrit,
        battleLog: battleLog,
        answerHistory: answerHistory,
        progressDots: progressDots
      });

      // Apply damage after animation starts
      setTimeout(function() {
        var hpPercent = Math.round((newMonsterHp / monster.maxHP) * 100);
        self.setData({
          'monster.hp': newMonsterHp,
          monsterHpPercent: hpPercent,
          isMonsterDamaged: true
        });
      }, 300);

      // End animation and check battle state
      setTimeout(function() {
        self.setData({
          isAttacking: false,
          isMonsterDamaged: false,
          showPlayerDamage: false,
          showCrit: false
        });

        // Check if monster defeated
        if (newMonsterHp <= 0) {
          self.processVictory();
        } else {
          self.nextQuestion();
        }
      }, 1000);

    } else {
      // === WRONG ANSWER: Monster attacks player ===
      var monsterDamage = game.calcMonsterDamage(monster, charStats);
      var oldPlayerHp = this.data.playerHp;
      var newPlayerHp = Math.max(0, oldPlayerHp - monsterDamage);

      monster.wrongCount++;
      monster.questionsAnswered++;

      // Track answer history and update progress dots
      var answerHistory2 = this.data.answerHistory.concat([false]);
      var progressDots2 = this._buildProgressDots(answerHistory2);

      var logEntry2 = '❌ 答错了！' + monster.name + '对你造成 ' + monsterDamage + ' 点伤害';
      var battleLog2 = this.data.battleLog.concat([logEntry2]);

      // Trigger monster attack animation
      this.setData({
        showMonsterDamage: true,
        monsterDamageAmount: monsterDamage,
        battleLog: battleLog2,
        answerHistory: answerHistory2,
        progressDots: progressDots2
      });

      // Apply damage after brief delay
      setTimeout(function() {
        var hpPercent = Math.round((newPlayerHp / self.data.playerMaxHp) * 100);
        self.setData({
          playerHp: newPlayerHp,
          playerHpPercent: hpPercent,
          isPlayerDamaged: true
        });
      }, 300);

      // End animation and check battle state
      setTimeout(function() {
        self.setData({
          isPlayerDamaged: false,
          showMonsterDamage: false
        });

        // Check if player defeated
        if (newPlayerHp <= 0) {
          self.processDefeat();
        } else {
          self.nextQuestion();
        }
      }, 1000);
    }
  },

  // ===== Next Question =====
  nextQuestion: function() {
    var question = game.getQuestion(this.subject, this.difficulty);
    if (!question) {
      question = this._getFallbackQuestion();
    }

    this.setData({
      currentQuestion: question,
      questionIndex: this.data.questionIndex + 1,
      selectedOption: -1,
      showResult: false,
      isCorrect: false,
      explanation: '',
      answeredOptions: []
    });
  },

  // ===== Victory Processing =====
  processVictory: function() {
    var char = this.char;
    var monster = this.data.monster;
    var charStats = this.data.charStats;
    var rewards = game.calcBattleReward(monster, charStats);

    // Apply rewards to character
    char.xp += rewards.xp;
    char.coins += rewards.coins;
    char.totalCoinsEarned += rewards.coins;
    char.kills++;
    char.correctAnswers += monster.correctCount;
    char.wrongAnswers += monster.wrongCount;

    // Track subject kills
    if (monster.subject && monster.subject !== 'mixed') {
      if (!char.subjectKills) char.subjectKills = {};
      char.subjectKills[monster.subject] = (char.subjectKills[monster.subject] || 0) + 1;
    }

    // Boss kills
    if (this.nodeType === 'boss') {
      char.bossKills = (char.bossKills || 0) + 1;
    }

    // Perfect battle tracking (no wrong answers)
    if (monster.wrongCount === 0) {
      char.perfectBattles = (char.perfectBattles || 0) + 1;
    }

    // Mark node as completed
    if (char.completedNodes.indexOf(this.nodeId) < 0) {
      char.completedNodes.push(this.nodeId);
    }

    // Check level up
    var leveledUp = game.checkLevelUp(char);

    // Check achievements
    var newAchievements = game.checkNewAchievements(char);

    // Update streak
    game.updateStreak(char);

    // Save
    game.saveGame(char);
    this.char = char;

    // Victory log
    var battleLog = this.data.battleLog.concat([
      '🎉 战斗胜利！',
      '📊 获得 ' + rewards.xp + ' 经验，' + rewards.coins + ' 金币'
    ]);

    if (leveledUp) {
      battleLog.push('⬆️ 升级！当前等级：' + char.level);
    }

    this.setData({
      battleOver: true,
      victory: true,
      defeat: false,
      rewards: rewards,
      leveledUp: leveledUp,
      newAchievements: newAchievements || [],
      char: char,
      charStats: game.getCharStats(char),
      battleLog: battleLog
    });
  },

  // ===== Defeat Processing =====
  processDefeat: function() {
    var char = this.char;
    var monster = this.data.monster;

    // Still save answer stats even on defeat
    char.correctAnswers += monster.correctCount;
    char.wrongAnswers += monster.wrongCount;
    char.hp = 0;
    game.saveGame(char);
    this.char = char;

    var battleLog = this.data.battleLog.concat([
      '💀 战斗失败...',
      '你的HP归零了，需要回复后再来挑战！'
    ]);

    this.setData({
      battleOver: true,
      victory: false,
      defeat: true,
      battleLog: battleLog
    });
  },

  // ===== Retry Battle =====
  retry: function() {
    var char = game.loadGame();
    if (!char) {
      wx.showToast({ title: '角色数据丢失', icon: 'none' });
      return;
    }
    // Restore some HP for retry (at least 50%)
    var stats = game.getCharStats(char);
    if (char.hp < Math.floor(stats.maxHP * 0.5)) {
      char.hp = Math.floor(stats.maxHP * 0.5);
      game.saveGame(char);
    }
    this.char = char;
    this.initBattle();
  },

  // ===== Navigate Back =====
  goBack: function() {
    wx.navigateBack({
      fail: function() {
        wx.redirectTo({ url: '/pages/map/map' });
      }
    });
  },

  // ===== Build Progress Dots =====
  _buildProgressDots: function(answerHistory) {
    var dots = [];
    for (var i = 0; i < answerHistory.length; i++) {
      dots.push(answerHistory[i] ? 'correct' : 'wrong');
    }
    // Add a few empty dots for upcoming questions
    var remaining = Math.max(0, 4 - dots.length);
    for (var j = 0; j < remaining; j++) {
      dots.push('empty');
    }
    return dots;
  },

  // ===== Fallback Question Generator =====
  _getFallbackQuestion: function() {
    var fallbacks = [
      {
        q: '以下哪个是正确的学习态度？',
        options: ['坚持不懈，每日积累', '临时抱佛脚', '只看不练', '三天打鱼两天晒网'],
        answer: 0,
        explain: '学习贵在坚持，每天积累一点，终将汇聚成知识的海洋。'
      },
      {
        q: '高考备考中，最重要的复习策略是？',
        options: ['系统梳理，查漏补缺', '只做难题', '只看书不做题', '考前突击'],
        answer: 0,
        explain: '科学的备考需要系统性地梳理知识点，找到自己的薄弱环节进行针对性突破。'
      },
      {
        q: '1 + 1 = ?',
        options: ['2', '3', '1', '0'],
        answer: 0,
        explain: '这是最基础的数学运算。'
      },
      {
        q: '"学而不思则罔，思而不学则殆"出自哪部经典？',
        options: ['《论语》', '《孟子》', '《大学》', '《中庸》'],
        answer: 0,
        explain: '出自《论语·为政》，强调学习与思考要结合，只学不思会迷惘，只思不学会危险殆。'
      }
    ];
    var idx = Math.floor(Math.random() * fallbacks.length);
    var q = JSON.parse(JSON.stringify(fallbacks[idx]));
    q.subject = 'general';
    q.difficulty = 'fallback';
    return q;
  }
});
