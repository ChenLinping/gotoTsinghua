App({
  onLaunch: function() {
    if (!wx.getStorageSync('mastered')) wx.setStorageSync('mastered', {});
    if (!wx.getStorageSync('completed')) wx.setStorageSync('completed', {});
    if (wx.getStorageSync('totalXP') === '' || wx.getStorageSync('totalXP') === undefined) wx.setStorageSync('totalXP', 0);
    if (wx.getStorageSync('streakDays') === '' || wx.getStorageSync('streakDays') === undefined) wx.setStorageSync('streakDays', 0);
    if (wx.getStorageSync('prevRankId') === '' || wx.getStorageSync('prevRankId') === undefined) wx.setStorageSync('prevRankId', 0);

    // 首次使用引导
    var onboardingDone = wx.getStorageSync('onboardingDone');
    if (!onboardingDone) {
      wx.redirectTo({ url: '/pages/onboarding/onboarding' });
    }
  },
  globalData: {
    examDate: '2027-06-07'
  }
});
