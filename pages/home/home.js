//index.js
//获取应用实例
const app = getApp()

var util = require('../../utils/utils.js');

Page({
  data: {
		imgArray:[],  //轮播
		tel:'',
		address:'',
		email:'',
    imgLoad: true,  //图片懒加载
    "interval": '2000',
    "duration": '500',
    "vertical": true,
    "autoplay": true,
    "workList": [],
    "navList": [
      {
        name: '案例作品',
        icon: 'icon-ziyuan1'
      }, {
        name: '行业动态',
        icon: 'icon-ziyuan'
      }, {
        name: "关于我们",
        icon: 'icon-ziyuan2'
      }, {
        name: "管理入口",
        icon: 'icon-ziyuan3'
      }
    ],
    "Journalism": [],
    scale: 10,
    latitude: "",
    longitude: "",
    markers: [{
      id: "0",
      latitude: 39.06953,
      longitude: 117.1051,
      width: 20,
      height: 30,
			callout:{
				content:'凯拓未来科技有限公司',
				display:'ALWAYS',
				fontSize:20,
				padding:10
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
  //事件处理函数
  onLoad: function () {
		this.get_banner();
    if (app.globalData.userInfo) {
      var _this = this
      _this.navs()
      _this.JournalismList()
      _this.works()
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          
          var latitude = res.latitude
          var longitude = res.longitude
          // var speed = res.speed
          // var accuracy = res.accuracy
          _this.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
        }
      })
    } else {
      // console.log('没有获取到');
      // 登录
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
                      }
                    }
                  })
                }
              })
            }
          })
        }
      })
      var _this = this
      _this.navs()
      _this.JournalismList()
      _this.works()
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          
          var latitude = res.latitude
          var longitude = res.longitude
          // var speed = res.speed
          // var accuracy = res.accuracy
          _this.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
        }
      })
    }
		// 获取联系方式
		this.get_Contact();
  },
	// 获取首页轮播
	get_banner:function(){
		var _this = this;
		var post = {
			cmd: 'get_banner'
		}
		util.sendAjax(post, function (res) {
			var imgArray=[];
			for (var i = 0; i < res.data.length; i++) {
				imgArray[i] = util.formatImg(res.data[i].img_path)
			}
			_this.setData({
				imgArray: imgArray
			})
			console.log(_this.data.imgArray[0])
		})
	},
	get_Contact:function(){
		var _this = this;
		var post = {
			cmd: 'get_Contact'
		}
		util.sendAjax(post, function (res) {
			_this.setData({
				tel:res.data[1].value,
				address:res.data[0].value,
				email:res.data[2].value
			})
		})
	},
  deatalista() {
    wx.navigateTo({
      url: '../about/about',
    })
  },
  navList(event) {
    var index = event.currentTarget.dataset.navIndex
    switch (index) {
      case 0:

        wx.navigateTo({
          url: '../work/work?id=105&index=0',
        })
        break
      case 1:

        wx.navigateTo({
          url: '../trends/trends',
        })
        break
      case 2:

        wx.navigateTo({
          url: '../about/about',
        })
        break
      case 3:
        wx.navigateTo({
          url: '../Administration/Administration',
        })
        break
    }
  },
  moreSee() {
    wx.navigateTo({
			url: '../work/work?id=105&index=0',
    })
  },
  JournalismDeatlis(e) {
    wx.navigateTo({
      url: '../JournalismDetalis/JournalismDetalis?id=' + e.currentTarget.id,
    })
  },
  caseDetalis(e) {
    wx.navigateTo({
      url: '../caseDetalis/caseDetalis?id=' + e.currentTarget.id,
    })
  },
  JournalismSee() {
    wx.navigateTo({
      url: '../trends/trends',
    })
  },
  phoneNumber() {
    var phone = this.data.tel.toString().split(':')[1];
	
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  // 导航Ajax
  navs() {
    var _this = this;
    var post = {
      cmd: 'get_Nav'
    }
    util.sendAjax(post, function (res) {
      _this.setData({
        navList: res.data
      })
    })
  },
  // 新闻Ajax
  JournalismList() {
    var _this = this;
    var post = {
      cmd: 'get_Trends_list'
    }
    util.sendAjax(post, function (res) {
	
      var Jou = [];
      Jou = res.data
      for (var i = 0; i < res.data.length; i++) {
        Jou[i].imgurls = util.formatImg(res.data[i].imgurls)
      }
      _this.setData({
        Journalism: Jou
      })
    })
  },
  //  作品案例
  works() {
    var _this = this
    var post = {
      cmd: 'get_Business_list'
    }
    util.sendAjax(post, function (res) {
      var work = res.data
      for (var i = 0; i < res.data.length; i++) {
        work[i].imgurls = util.formatImg(res.data[i].imgurls)
      }
      _this.setData({
        workList: work
      })
    })
  },
  // 关于我们跳转
  openAbout: function () {
    wx.navigateTo({
      url: '../about/about',
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
	// 原生自带转发
	onShareAppMessage: function () {
		return {
			title: '凯拓未来',
			path: '/pages/home/home',
			success: function (res) {
				// 转发成功
				util.toastSuccess('分享成功')
			},
			fail: function (res) {
				// 转发失败
				util.toastLoading('已取消分享')
			}
		}
	},
})
