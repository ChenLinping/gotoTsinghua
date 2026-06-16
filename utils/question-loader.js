// 题库加载器 - 抽象层，后续迁移云开发只需改这个文件
var _cache = {};

function loadSubject(subject) {
  if (_cache[subject]) return _cache[subject];
  var data = require('../questionBank/' + subject + '.js');
  _cache[subject] = data;
  return data;
}

function loadAllSubjects() {
  var subjects = ['math', 'english', 'physics', 'chemistry', 'biology', 'chinese'];
  var bank = {};
  for (var i = 0; i < subjects.length; i++) {
    bank[subjects[i]] = loadSubject(subjects[i]);
  }
  return bank;
}

function getQuestionCount(subject) {
  var data = loadSubject(subject);
  var count = 0;
  if (data.easy) count += data.easy.length;
  if (data.medium) count += data.medium.length;
  if (data.hard) count += data.hard.length;
  return count;
}

module.exports = {
  loadSubject: loadSubject,
  loadAllSubjects: loadAllSubjects,
  getQuestionCount: getQuestionCount
};
