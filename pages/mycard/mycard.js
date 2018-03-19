// pages/mycard/mycard.js
var util = require('../../utils/utils.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardShow: true,
    head: '',
    id: '',
    list: [
      {
        title: '谁看过我',
        icon: 'iconfont icon-ziyuan8'
      },
      {
        title: '谁赞过我',
        icon: 'iconfont icon-ziyuan11'
      },
      {
        title: '谁收藏我',
        icon: 'iconfont icon-ziyuan10'
      },
      {
        title: '编辑名片',
        icon: 'iconfont icon-ziyuan12'
      }
    ],
    cardInfo: {},
    userInfo: {},
    coverBox: false
  },
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo.data
      })
      this.ShowCard();
    }
  },
  // 获取名片
  ShowCard: function () {
    var that = this;
    var post = {
      cmd: 'ShowCard',
      openid: that.data.userInfo.openid
    }
    console.log(post);
    util.sendAjax(post, function (res) {
      console.log(res);
      wx.stopPullDownRefresh()
      if (res.data != null) {
        if (res.data.head != '') {
          var thehead = util.formatHeadimg(res.data.head);
        }
        that.setData({
          cardShow: false,
          head: thehead,
          id: res.data.id,
          cardInfo: res.data
        })
        try {
          wx.setStorageSync('cardID', res.data.id)
        } catch (e) {
        }
      }
    });
  },
  // 原生自带转发
  onShareAppMessage: function () {
    return {
      title: '名片分享',
      path: '/pages/Youcard/Youcard?id=' + this.data.id
      + '&ids=' + this.data.userInfo.openid,
      success: function (res) {
        // 转发成功
        console.log("我发送的")
        util.toastSuccess('分享成功')
      },
      fail: function (res) {
        // 转发失败
        util.toastLoading('已取消分享')
      }
    }
  },

  // 编辑
  openCardInfo: function (id) {
    wx.navigateTo({
      url: './cardInfo/cardInfo?id=' + this.data.id
    })
  },


  openPage: function (e) {
    var id = e.currentTarget.dataset.id;
    switch (id) {
      case 0:
        wx.navigateTo({
          url: '../my/see/see'
        })
        break
      case 1:
        wx.navigateTo({
          url: '../my/zan/zan'
        })
        break
      case 2:
        wx.navigateTo({
          url: '../my/Collection/Collection'
        })
        break
      case 3:
        wx.navigateTo({
          url: './cardInfo/cardInfo?id=' + this.data.id
        })
        break
    }
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    var that = this;
    try {
      var value = wx.getStorageSync('cardID')
      if (value) {
        // Do something with return value
        that.ShowCard();
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    this.ShowCard();
    wx.stopPullDownRefresh()
  }
})