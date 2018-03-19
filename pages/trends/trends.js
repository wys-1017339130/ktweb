const app = getApp()
var util = require('../../utils/utils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
		imgUrls:[],
    "interval": '2000',
    "duration": '500',
    "vertical": true,
    "autoplay": true,
    "keyinng": 0,
    "add": 5,
    "pagenum": 0,
    "get_Trends": [],
    "nav": [
      '行业动态'
    ]
  },
  navbar(e) {
    this.setData({
      keyinng: e.currentTarget.dataset.num
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
		_this.get_business_banner();
    _this.get_Trends_list_All(_this.data.add)
  },
	// 轮播
	get_business_banner: function () {
		var _this = this;
		var post = {
			cmd: 'get_business_banner',
			id: 99
		}
		util.sendAjax(post, (res) => {
			var imgArray = [];
			for (var i = 0; i < res.data.length; i++) {
				imgArray[i] = util.formatImg(res.data[i].img_path)
			}
			_this.setData({
				imgUrls: imgArray
			})
		})
	},
  JournalismDeatlis(e) {
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '../JournalismDetalis/JournalismDetalis?id=' + e.currentTarget.id,
    })
  },
  get_Trends_list_All(num) {
    var _this = this
    var post = {
      cmd: 'get_Trends_list_All',
      pageSize: num
    }
    util.sendAjax(post, (res) => {
      console.log(res)
      var myget_Trends = res.data.data
      for (var i=0;i<res.data.data.length;i++) {
        myget_Trends[i].imgurls = util.formatImg(res.data.data[i].imgurls)
      }
      _this.setData({
        get_Trends: myget_Trends,
        pagenum:res.data.pagenum
      })
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
    var _this = this
    _this.setData({
      add:5
    })
    _this.get_Trends_list_All(_this.data.add)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this
    console.log(1111111)
    var n = _this.data.add
    _this.setData({
      add:n+5
    })
    _this.get_Trends_list_All(_this.data.add)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})