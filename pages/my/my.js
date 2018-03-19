// pages/my/my.js
var util = require('../../utils/utils.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
    id: '',  //名片id
    listShow: true,
    userInfo: {},
    headimgurl: ''  //头像
  },
  // 同步信息
  getMessageSync: function () {
    wx.addPhoneContact({
      nickName: this.data.userInfo.nickname,
      mobilePhoneNumber: this.data.userInfo.phone,
      success:function(res){
        util.toastSuccess('同步成功')
      },
      fail:function(res){
        util.toastSuccess('取消操作')
      }
    })
  },
  // 修改个人信息
  getMessageInfo: function () {
    wx.navigateTo({
      url: './messageInfo/messageInfo'
    })
  },
  // 名片详情
  openCardInfo: function () {
    wx.navigateTo({
      url: '../mycard/cardInfo/cardInfo'
    })
  },
  // 官方网站
  backHome:function(){
    console.log('111')
    wx.switchTab({
      url: '../home/home'
    })
  },
  // 联系我们
  openCallus: function () {
    wx.navigateTo({
      url: './callUs/callUs'
    })
  },
  // 四宫格显隐
  mycardListshow: function () {
    var _this = this;
    _this.setData({
      listShow: !_this.data.listShow
    })
  },
  // 四宫格
  openPage: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;

    switch (id) {
      case 0:
        wx.navigateTo({
          url: './see/see'
        })
        break
      case 1:
        wx.navigateTo({
          url: './zan/zan'
        })
        break
      case 2:
        wx.navigateTo({
          url: './Collection/Collection'
        })
        break
      case 3:
        wx.navigateTo({
          url: '../mycard/cardInfo/cardInfo?id=' + that.data.id
        })
        break
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo.data,
        headimgurl: app.globalData.userInfo.data.headimgurl
      })
      var that = this;
      try {
        var value = wx.getStorageSync('cardID')
        if (value) {
          // Do something with return value
          that.setData({
            id: value
          })
        }
      } catch (e) {
        // Do something when catch error
      }
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo.data,
        headimgurl: app.globalData.userInfo.data.headimgurl
      })
      var that = this;
      try {
        var value = wx.getStorageSync('cardID')
        if (value) {
          // Do something with return value
          that.setData({
            id: value
          })
        }
      } catch (e) {
        // Do something when catch error
      }
    }
  },
  // 获取个人信息
  show_wxInfo: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var post = {
      cmd: 'show_wxInfo',
      openid: that.data.userInfo.openid
    }
    util.sendAjax(post, function (res) {
      wx.hideLoading();
      console.log(res);
      if (res.data != null) {
        that.setData({
          userInfo: res.data,
          headimgurl: res.data.headimgurl
        })
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo.data,
        headimgurl: app.globalData.userInfo.data.headimgurl
      })
      this.show_wxInfo();
      var that = this;
      try {
        var value = wx.getStorageSync('cardID')
        if (value) {
          // Do something with return value
          that.setData({
            id: value
          })
        }
      } catch (e) {
        // Do something when catch error
      }
    }
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})