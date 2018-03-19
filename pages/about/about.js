const app = getApp()
var util = require('../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "screenHeight": 0,
    "screenWidth": 0,
    latitude: 0,
    mode: 'widthFix',
		scale: 10,
		latitude: "",
		longitude: "",
		markers: [{
			id: "0",
			latitude: 39.06953,
			longitude: 117.1051,
			width: 20,
			height: 30,
			callout: {
				content: '凯拓未来科技有限公司',
				display: 'ALWAYS',
				fontSize: 20,
				padding: 10
			}
		}],
		controls: [{
			id: 1,
			iconPath: '',
			position: {
				left: 0,
				top: 300 - 50,
				width: 20,
				height: 20
			},
			clickable: true
		}],
		circles: [],
		ArticleContent:{},
		corporate_pic:'',  //企业文化图片
		team_pic:"",   //团队风采图片
		tel:'',
		address:'',
		email:''
  },
  regionchange(e) {
    
  },
  markertap(e) {
    
  },
  controltap(e) {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
		this.get_Culture();
		this.get_Contact();
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
      
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            id: "1",
            latitude: res.latitude,
            longitude: res.longitude,
            title: '天津工业大学软件园C512'
          }],
          circles: [{
            latitude: res.latitude,
            longitude: res.longitude,
            color: '#FF0000DD',
            fillColor: '#00b5ec80',
            radius: 3,
            strokeWidth: 1
          }]
        })
      }
    })

  },
	get_Culture:function(){
		var _this = this;
		var post = {
			cmd: 'get_Culture'
		}
		util.sendAjax(post, function (res) {
			var corporate_pic = util.formatImg(res.data[0].corporate_pic1);
			// var team_pic = util.formatImg(res.data[0].team_pic2);
			var team_pic ='https://www.kaituocn.com/upload/201710/1507860607.png';
			console.log(corporate_pic + '--------' + team_pic)
			_this.setData({
				ArticleContent:res.data[0],
				corporate_pic: corporate_pic,  //企业文化图片
				team_pic: team_pic
			})
		})
	},
	// 官网地址
	get_Contact: function () {
		var _this = this;
		var post = {
			cmd: 'get_Contact'
		}
		util.sendAjax(post, function (res) {
			_this.setData({
				tel: res.data[1].value,
				address: res.data[0].value,
				email: res.data[2].value
			})
		})
	},
  phoneNumber(event) {
    var phone = event.currentTarget.id
    wx.makePhoneCall({
      phoneNumber: phone
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