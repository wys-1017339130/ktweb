const app = getApp()
var util = require('../../utils/utils.js');
var WxParse = require('../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "mode": 'widthFix',
    "title": {},
    "ctitle": '',
    "addtime": {},
    "keywords": '',
    "src": '',
    "id":0,
    "nodes": []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var _this= this
    _this.setData({
      id:id
    })
    _this.show_Article_desc(id)
  },
  show_Article_desc(id) {
    var _this = this
    var that = this;
    var post = {
      cmd: 'show_News_desc',
      id: id
    }
    util.sendAjax(post, function (res) {
      console.log(res)
      that.setData({
        title: res.data.title,
        ctitle: res.data.ctitle,
        keywords: res.data.keywords,
        addtime: res.data.addtime,
        src: util.formatImg(res.data.imgurl),
      })
      var article = res.data.content;
      WxParse.wxParse('article', 'html', article, that, 5);
    })
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
    this.show_Article_desc(this.data.id);
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