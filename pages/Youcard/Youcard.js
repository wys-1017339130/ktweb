
var app = getApp()
var util = require('../../utils/utils.js');

Page({

  /**
   * 页面的初始数据
   */
	data: {
		head: '',  //头像
		id: '',   //名片id
		read_num: 0,  //人气
		zandata: true,  //控制点赞icon
		cangData: true, //收藏ICon
		zanNum: 0, //点赞数
		cangNum: 0, //收藏数
		nav1: 0,   //  点赞控制icon
		nav2: 0,  //收藏icon控制
		cardInfo: [],
		// sendHolder:'保存到名片夹'  保存到名片夹
		userInfo: {},
		phone: ''   //自己名片的手机号(用于收藏时录入后台,被收藏人可以查看该手机号)
	},

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo.data,
				id: options.id
			})
			// options.id分享名片的id
			// ids分享名片的openID
			// 是否点赞
			this.show_Fabulous(options.id);
			// 是否收藏
			this.show_keep(options.id);
			// 获取对方名片信息
			this.ShowCard(options.ids,
				app.globalData.userInfo.data.openid,
				app.globalData.userInfo.data.headimgurl,
				app.globalData.userInfo.data.nickname);
				// 获取自己名片的手机号
			this.showmycard();
		} else {
			// 登录
			var that = this;
			wx.showLoading({
				title: '加载中',
			})
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
											wx.hideLoading();
											if (res.data != '') {
												app.globalData.userInfo = res.data;
												that.setData({
													userInfo: app.globalData.userInfo.data,
												})
												that.show_Fabulous(options.id);
												that.show_keep(options.id);
												// that.show_Fabulous(2);
												that.ShowCard(options.ids,
													app.globalData.userInfo.data.openid,
													app.globalData.userInfo.data.headimgurl,
													app.globalData.userInfo.data.nickname);
												that.showmycard();
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
	// 判断该用户是否点赞过
	show_Fabulous: function (id) {
		var that = this;
		var post = {
			cmd: 'show_Fabulous',
			openid: app.globalData.userInfo.data.openid,
			username: app.globalData.userInfo.data.nickname,
			id: id
		}
		// console.log('这是点赞参数');
		// console.log(post);
		util.sendAjax(post, function (res) {
			// console.log('这是点赞');
			// console.log(res);
			if (res.data == 1) {
				that.setData({
					zandata: false
				})
			} else {
				that.setData({
					zandata: true
				})
			}
		})
	},
	// 判断该用户是否收藏
	show_keep: function (id) {
		var that = this;
		var post = {
			cmd: 'show_keep',
			id: id,
			openid: app.globalData.userInfo.data.openid,
			username: app.globalData.userInfo.data.nickname
		}
		console.log('这是收藏参数');
		console.log(post);
		util.sendAjax(post, function (res) {
			console.log('这是收藏');
			console.log(res);
			if (res.data == 1) {
				that.setData({
					cangData: false
				})
			} else {
				that.setData({
					cangData: true
				})
			}
		})
	},
	// 获取对方名片详情
	ShowCard: function (id, isa, img, name) {
		var that = this;
		var post = {
			cmd: 'ShowCard',
			openid: id
		}
		util.sendAjax(post, function (res) {
			// console.log(res);
			if (res.data != null) {
				if (res.data.head != '') {
					var thehead = util.formatHeadimg(res.data.head);
				}
				var num = parseInt(res.data.read_num) + 1; //  点击数
				var zanNum = parseInt(res.data.fabulous_num);  //点赞数
				var cangNum = parseInt(res.data.keep_num);  //收藏数
				that.setData({
					head: thehead,
					id: res.data.id,
					cardInfo: res.data,
					read_num: num,
					zanNum: zanNum,
					cangNum: cangNum
				})
				that.Browse_add(isa, img, name)
			}
		});
	},
	// 获取个人名片信息内的手机号
	showmycard: function () {
		var that = this;
		if (app.globalData.userInfo.data.phone != null) {
			that.setData({
				phone: app.globalData.userInfo.data.phone
			})
		} else {
			var post = {
				cmd: 'ShowCard',
				openid: app.globalData.userInfo.data.openid
			}
			console.log('这是手机号参数')
			console.log(post)
			util.sendAjax(post, function (res) {
				console.log('这是手机号')
				console.log(res);
				if (res.data != null) {
					that.setData({
						phone: res.data.tel
					})
				}
			});
		}
	},
	// 点赞
	Fabulous_add: function (e) {
		var that = this;
		that.setData({
			zandata: !that.data.zandata
		})
		if (that.data.zandata) {
			var num = that.data.zanNum - 1;
			that.setData({
				zanNum: num
			})
			that.Fabulous_add1();
		} else {
			var num = that.data.zanNum + 1;
			that.setData({
				zanNum: num
			})
			that.Fabulous_add1();
		}
	},
	// 点赞方法
	Fabulous_add1: function () {
		var post = {
			cmd: 'Fabulous_add',
			username: app.globalData.userInfo.data.nickname,
			openid: app.globalData.userInfo.data.openid,
			wid: this.data.id,
			w_face: app.globalData.userInfo.data.headimgurl,
			phone: this.data.phone
		}
		console.log('点赞参数')
		console.log(post);
		util.sendAjax(post, (res) => {
			console.log("点赞成功")

		})
	},
	// 收藏(控制icon)
	keep_add: function (e) {
		var that = this;
		if (that.data.phone == '') {
			util.toastLoading('请先创建名片')
		} else {
		that.setData({
			cangData: !that.data.cangData
		})
		if (that.data.cangData) {
			// 取消收藏
			var num = that.data.cangNum - 1;
			that.setData({
				cangNum: num
			})
			that.keep_add1();
		} else {
			// 点击收藏
			var num = that.data.cangNum + 1;
			that.setData({
				cangNum: num
			})
			that.keep_add1();
		}
		}
	},
	// 收藏方法
	keep_add1: function () {
// 手机号不能为空
		var that = this;
			var post = {
				cmd: 'keep_add',
				username: app.globalData.userInfo.data.nickname,
				openid: app.globalData.userInfo.data.openid,
				wid: that.data.id,
				w_face: app.globalData.userInfo.data.headimgurl,
				phone: that.data.phone
			}
			console.log('点击收藏参数');
			console.log(post);
			util.sendAjax(post, (res) => {
				console.log("收藏成功")
			})
	},
	// 谁看过我
	Browse_add(id, images, name) {
		var post = {
			cmd: 'Browse_add',
			username: name,
			openid: id,
			wid: this.data.id,
			w_face: images
		}
		util.sendAjax(post, (res) => {
			console.log("传参成功")
		})
	},
	addPhoneContact() {
		wx.addPhoneContact({
			firstName: this.data.cardInfo.username,
			mobilePhoneNumber: this.data.cardInfo.tel
		})
	},
	myCards() {
		wx.switchTab({
			url: '../mycard/mycard'
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
