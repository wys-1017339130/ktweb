//app.js
var util = require('./utils/utils.js');

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;
    // 获取用户信息(授权)
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 登录
          wx.login({
            success: res => {
              var code = res.code;
              wx.getUserInfo({
                data: {
                  withCredentials: "true"
                },
                success: res => {
                  wx.request({
                    url: util.Baseurl,
                    data: {
                      cmd: 'login',
                      code: code,
                      encryptedData: res.encryptedData,
                      iv: res.iv
                    },
                    header: {
                      'Content-Type': 'application/x-www-form-urlencoded' // 默认值
                    },
                    dataType: 'json',
                    method: 'POST',
                    success: function (res) {
											console.log('用户信息')
											console.log(res.data);
											// that.globalData.userInfo = res.data;
                      // 配置全局用户信息变量
                      // 检测登录信息是否录入
                      wx.request({
                        url: util.Baseurl,
                        data: {
                          cmd: 'check_login',
                          nickName: res.data.nickName,
                          avatarUrl: res.data.avatarUrl,
                          city: res.data.city,
                          country: res.data.country,
                          province: res.data.province,
                          gender: res.data.gender,
                          openId: res.data.openId
                        },
                        header: {
                          'Content-Type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        dataType: 'json',
                        method: 'POST',
                        success: function (res) {
													console.log(res);
                          if (res.data != '') {
                            that.globalData.userInfo = res.data;
                          }
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      },
      fail: function () {
        // wx.showModal({
        //   title: '警告',
        //   content: '您点击了拒绝授权，将无法正常使用创建,分享名片等功能体验。请退出后再次点击授权，或者删除小程序重新进入。',
        //   success: function (res) {
        //     if (res.confirm) {
        //       console.log('用户点击确定')
        //     }
        //   }
        // })
        console.log('取消授权')
      }
    })
  },
  globalData: {
    userInfo: null,
    cardid: ''
  }
})