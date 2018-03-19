// zan.js

var util = require('../../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardlistShow: true,
    cardList: [{
      image: '../../images/6.png',
      name: '哈哈哈'
    },
    {
      image: '../../images/6.png',
      name: '哈哈哈'
    },
    {
      image: '../../images/6.png',
      name: '哈哈哈'
    }
    ],
    id: ''   //名片id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    try {
      var value = wx.getStorageSync('cardID')
      if (value) {
        // Do something with return value
        that.setData({
          id: value
        })
        that.get_Fabulous();
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  // 获取点赞列表
  get_Fabulous: function () {
    var that = this;
    var post = {
      cmd: 'get_Fabulous',
      id: this.data.id
    }
    util.sendAjax(post, function (res) {
      if (res.data.length != 0) {
        that.setData({
          cardlistShow: false,
          cardList: res.data
        })
      } else {
        that.setData({
          cardlistShow: true
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})