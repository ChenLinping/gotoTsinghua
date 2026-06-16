// ==========================================
// 清北修仙传 - 智能选题引擎
// 间隔重复 + 自适应难度 + 知识点标签
// ==========================================

// ========== 间隔重复参数 ==========
// 复习间隔(天): 答错→1天, 之后逐步拉长
var INITIAL_INTERVAL = 1;
var INTERVAL_STEPS = [1, 3, 7, 15, 30];
var MIN_EASE = 1.3;
var DEFAULT_EASE = 2.5;

// ========== 选优先级权重 ==========
var W_REVIEW = 0.40;    // 间隔复习优先
var W_WEAK_TAG = 0.30;  // 薄弱知识点优先
var W_DIFFICULTY = 0.20; // 难度适配
var W_RANDOM = 0.10;    // 随机

// ========== 自适应难度阈值 ==========
var ACC_HIGH = 0.80;    // 正确率>80% → 出难题
var ACC_LOW = 0.50;     // 正确率<50% → 出简单题

// ========== 核心数据结构 ==========

// 从localStorage加载复习计划
// reviewSchedule: { [qKey]: { next: 'YYYY-MM-DD', step: 0~4, ease: 2.5 } }
function loadSchedule() {
  return wx.getStorageSync('reviewSchedule') || {};
}

function saveSchedule(schedule) {
  wx.setStorageSync('reviewSchedule', schedule);
}

// 计算科目正确率 (从answerHistory)
function getSubjectAccuracy(history, subject) {
  var total = 0;
  var correct = 0;
  for (var i = 0; i < history.length; i++) {
    if (history[i].subject === subject) {
      total++;
      if (history[i].correct) correct++;
    }
  }
  if (total === 0) return -1; // -1 表示没有历史数据
  return correct / total;
}

// 计算各知识点标签正确率
// 返回 { tagName: { total: n, correct: n, rate: 0~1 } }
function getTagAccuracy(history) {
  var tagMap = {};
  for (var i = 0; i < history.length; i++) {
    var tags = history[i].tags || [];
    for (var j = 0; j < tags.length; j++) {
      var t = tags[j];
      if (!tagMap[t]) tagMap[t] = { total: 0, correct: 0 };
      tagMap[t].total++;
      if (history[i].correct) tagMap[t].correct++;
    }
  }
  // 算正确率
  for (var key in tagMap) {
    if (tagMap.hasOwnProperty(key)) {
      tagMap[key].rate = tagMap[key].total > 0
        ? tagMap[key].correct / tagMap[key].total
        : 1;
    }
  }
  return tagMap;
}

// 获取薄弱标签(正确率低于60%且答题>=2次的标签)
function getWeakTags(tagAccuracy) {
  var weak = [];
  for (var tag in tagAccuracy) {
    if (tagAccuracy.hasOwnProperty(tag)) {
      var info = tagAccuracy[tag];
      if (info.total >= 2 && info.rate < 0.6) {
        weak.push(tag);
      }
    }
  }
  return weak;
}

// 根据正确率决定目标难度
function getTargetDifficulty(subjectAccuracy) {
  if (subjectAccuracy < 0) return 'mixed';   // 无历史→混合
  if (subjectAccuracy >= ACC_HIGH) return 'hard';
  if (subjectAccuracy <= ACC_LOW) return 'easy';
  return 'medium';
}

// ========== 题目唯一标识 ==========
function questionKey(q) {
  // 用题目文本前30字符+科目做key
  var text = (q.q || '').substring(0, 30);
  return (q.subject || '') + ':' + text;
}

// ========== 日期工具 ==========
function todayStr() {
  var d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

function addDays(dateStr, days) {
  var parts = dateStr.split('-');
  var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  d.setDate(d.getDate() + days);
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

// ========== 更新复习计划(答题后调用) ==========
function updateReview(qKey, isCorrect) {
  var schedule = loadSchedule();
  var entry = schedule[qKey];
  var today = todayStr();

  if (!entry) {
    entry = { next: today, step: 0, ease: DEFAULT_EASE };
  }

  if (isCorrect) {
    // 答对→间隔拉长
    entry.step = Math.min(entry.step + 1, INTERVAL_STEPS.length - 1);
    var interval = INTERVAL_STEPS[entry.step];
    entry.next = addDays(today, interval);
    // ease微调
    entry.ease = Math.min(3.0, entry.ease + 0.1);
  } else {
    // 答错→回到短间隔,降低ease
    entry.step = Math.max(0, entry.step - 2);
    var interval2 = INTERVAL_STEPS[entry.step];
    entry.next = addDays(today, interval2);
    entry.ease = Math.max(MIN_EASE, entry.ease - 0.2);
  }

  schedule[qKey] = entry;
  saveSchedule(schedule);
}

// ========== 批量更新(一轮答题后) ==========
function batchUpdateReview(results) {
  // results: [{ qKey, correct }]
  for (var i = 0; i < results.length; i++) {
    updateReview(results[i].qKey, results[i].correct);
  }
}

// ========== 智能选题 ==========
// subject: 科目id
// count: 需要的题目数量
// questionBank: QUESTION_BANK 对象
// history: answerHistory 数组
// 返回: 选中的题目数组
function selectQuestions(subject, count, questionBank, history) {
  var bank = questionBank[subject];
  if (!bank) return [];

  // 1. 收集所有题目
  var allQuestions = [];
  var difficulties = ['easy', 'medium', 'hard'];
  for (var d = 0; d < difficulties.length; d++) {
    var diff = difficulties[d];
    var pool = bank[diff] || [];
    for (var i = 0; i < pool.length; i++) {
      var q = JSON.parse(JSON.stringify(pool[i]));
      q.subject = subject;
      q.difficulty = diff;
      q._key = questionKey(q);
      allQuestions.push(q);
    }
  }

  if (allQuestions.length === 0) return [];
  if (allQuestions.length <= count) return allQuestions;

  // 2. 分析历史数据
  var subjectAcc = getSubjectAccuracy(history, subject);
  var tagAcc = getTagAccuracy(history);
  var weakTags = getWeakTags(tagAcc);
  var targetDiff = getTargetDifficulty(subjectAcc);

  // 3. 加载复习计划
  var schedule = loadSchedule();
  var today = todayStr();

  // 4. 给每道题打分
  var scored = [];
  for (var j = 0; j < allQuestions.length; j++) {
    var question = allQuestions[j];
    var score = 0;

    // 4a. 间隔复习分 (40%)
    var entry = schedule[question._key];
    if (entry && entry.next <= today) {
      // 该复习了！
      score += W_REVIEW;
    } else if (entry) {
      // 还没到复习日期，按紧急程度给分
      var nextParts = entry.next.split('-');
      var nextDate = new Date(parseInt(nextParts[0]), parseInt(nextParts[1]) - 1, parseInt(nextParts[2]));
      var todayDate = new Date();
      var daysUntil = Math.ceil((nextDate - todayDate) / 86400000);
      if (daysUntil <= 1) score += W_REVIEW * 0.7;
      else if (daysUntil <= 3) score += W_REVIEW * 0.3;
    } else {
      // 从未做过，中等优先
      score += W_REVIEW * 0.5;
    }

    // 4b. 薄弱知识点分 (30%)
    var tags = question.tags || [];
    var hasWeakTag = false;
    for (var t = 0; t < tags.length; t++) {
      if (weakTags.indexOf(tags[t]) >= 0) {
        hasWeakTag = true;
        break;
      }
    }
    if (hasWeakTag) {
      score += W_WEAK_TAG;
    } else if (tags.length > 0) {
      // 有标签但都不是薄弱的
      score += W_WEAK_TAG * 0.2;
    } else {
      score += W_WEAK_TAG * 0.3;
    }

    // 4c. 难度适配分 (20%)
    if (targetDiff === 'mixed') {
      score += W_DIFFICULTY * 0.5; // 无历史时均匀
    } else if (question.difficulty === targetDiff) {
      score += W_DIFFICULTY;
    } else if (
      (targetDiff === 'medium' && (question.difficulty === 'easy' || question.difficulty === 'hard')) ||
      (targetDiff === 'hard' && question.difficulty === 'medium') ||
      (targetDiff === 'easy' && question.difficulty === 'medium')
    ) {
      score += W_DIFFICULTY * 0.4;
    }

    // 4d. 随机分 (10%)
    score += W_RANDOM * Math.random();

    scored.push({ q: question, score: score });
  }

  // 5. 按分排序，取前 count 道
  scored.sort(function (a, b) { return b.score - a.score; });

  var selected = [];
  for (var k = 0; k < Math.min(count, scored.length); k++) {
    var picked = scored[k].q;
    delete picked._key; // 清理临时字段
    selected.push(picked);
  }

  return selected;
}

// ========== 导出 ==========
module.exports = {
  loadSchedule: loadSchedule,
  saveSchedule: saveSchedule,
  getSubjectAccuracy: getSubjectAccuracy,
  getTagAccuracy: getTagAccuracy,
  getWeakTags: getWeakTags,
  getTargetDifficulty: getTargetDifficulty,
  questionKey: questionKey,
  updateReview: updateReview,
  batchUpdateReview: batchUpdateReview,
  selectQuestions: selectQuestions,
  ACC_HIGH: ACC_HIGH,
  ACC_LOW: ACC_LOW
};
