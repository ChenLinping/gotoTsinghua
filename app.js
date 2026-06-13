App({
  onLaunch: function() {
    var game = require('./utils/game');
    // 检查是否有存档，没有则进入新手引导
    var char = game.loadGame();
    if (!char) {
      wx.redirectTo({ url: '/pages/onboarding/onboarding' });
    }
  },
  globalData: {
    examDate: '2027-06-07'
  }
});
