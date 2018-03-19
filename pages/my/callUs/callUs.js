// callUs.js
var util = require('../../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		tel: '',
		address: '',
		email: '',
    "interval": '2000',
    "duration": '500',
    "vertical": true,
    "autoplay": true,
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
		circles: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //事件处理函数
  onLoad: function () {
    var _this = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        // var latitude = res.latitude
        // var longitude = res.longitude
        // var speed = res.speed
        // var accuracy = res.accuracy
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            id: "1",
            latitude: res.latitude,
            longitude: res.longitude,
            width: 50,
            height: 50,
            title: "哪里"
          }],
          circles: [{
            latitude: res.latitude,
            longitude: res.longitude,
            color: '#FF0000DD',
            fillColor: '#7cb5ec88',
            radius: 3,
            strokeWidth: 1
          }]
        })
      }
    })
		this.get_Contact();
  },
	get_Contact: function () {
		var _this = this;
		var post = {
			cmd: 'get_Contact'
		}
		util.sendAjax(post, function (res) {
			console.log('联系方式')
			console.log(res);
			_this.setData({
				tel: res.data[1].value,
				address: res.data[0].value,
				email: res.data[2].value
			})
		})
	},
	phoneNumber() {
		var phone = this.data.tel.toString().split(':')[1];
		console.log(phone);
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