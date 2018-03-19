// pages/orderInfo/orderInfo.js

const app = getApp()
var util = require('../../utils/utils.js');
var WxParse = require('../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		name:'',
		ctitle:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
			console.log(options);
			this.get_Subcolumn(options.id);
  },
	get_Subcolumn:function(id){
		var that = this;
		var post = {
			cmd: 'get_Subcolumn',
			id:id
		}
		console.log(post);
		util.sendAjax(post, (res) => {
			console.log(res);
			that.setData({
				ctitle: res.data.keywords,
				name: res.data.name
			})
			var article = res.data.content
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