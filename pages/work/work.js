
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
    "vvork": [],
    "add": 5,
    "pagenum": 0,
    "id": 0,
    "nus": 0,
    "vvorkOne": [],
    "autoplay": true,
    categories: [],
    currentTab: 0,
    height: "200",
    scrollLeftValue: 0,
    isBgNeed: false,
    clientHeight: ''
  },
  get_Business_All(num) {
		wx.showLoading({
			title: '加载中',
		})
    var _this = this
    var post = {
      cmd: 'get_Business_All',
      pageSize: num,
    }
    console.log(post)
    util.sendAjax(post, function (res) {
			console.log('获取数据');
      console.log(res.data.data)
			wx.hideLoading();
			if(res.data.data == []){
				console.log('没东西了');
			}
      var vork = res.data.data
      for (var i = 0; i < res.data.data.length; i++) {
        vork[i].imgurls = util.formatImg(res.data.data[i].imgurl)
      }
      _this.setData({
        vvork: vork,
        pagenum: res.data.pagenum
      })
      _this.getRect(0)
    })
  },
  get_Signal_All(num, id, s) {
		wx.showLoading({
			title: '加载中',
		})
    var _this = this
    var post = {
      cmd: 'get_Signal_All',
      pageSize: num,
      pid: id
    }
		// console.log('请求数据')
		console.log(post)
    util.sendAjax(post, (res) => {
			// console.log('导航数据')
			console.log(res)
			console.log(res.data.data.length)
			wx.hideLoading();
			if (res.data.data.length == 0) {
				_this.setData({
					pagenum:1,
					vvork:[]
				})
				console.log(_this.data.pagenum)
			}else{
				var Signal = res.data.data
				for (var i = 0; i < res.data.data.length; i++) {
					Signal[i].imgurls = util.formatImg(res.data.data[i].imgurl)
				}
				// console.log(res)
				_this.setData({
					vvork: Signal,
					pagenum: res.data.pagenum
				})
				_this.getRect(s)
			}
    })
  },
  get_business_nav() {
    var _this = this
    var post = {
      cmd: "get_Nav"
    }
    util.sendAjax(post, (res) => {
			console.log('导航栏');
			console.log(res)
      var list = res.data[0]
      var mylist = [{ name: '全部', id: '0' }, { name: 'APP开发', id: '0' }, { name: '网站开发', id: '0' }, { name: '微信开发', id: '0' }, { name: '电商开发', id: '0' }, { name: '视觉设计', id: '0' }]
      for (var i = 0; i < res.data[0].sub.length; i++) {
        mylist[i + 1].id = res.data[0].sub[i].id
      }
      _this.setData({
        categories: mylist
      })
    })
  },
  navbarTap: function (e) {
    //将顶部导航栏自动移动到合适的位置
    var _this = this
    var idx = e.currentTarget.dataset.idx;
    console.log(e.currentTarget.dataset.idx)
    this.autoScrollTopNav(idx);
    _this.setData({
      currentTab: idx,
      pagenum: 0,
      add: 5,
      id: e.currentTarget.id,
      nus: idx
    })
    if (e.currentTarget.id == 0) {
      _this.get_Business_All(_this.data.add)
      return
    } else {
      _this.get_Signal_All(_this.data.add, e.currentTarget.id, idx)
    }
    //自动收回
    if (this.data.isPickerShow) {
      _this.navbarBtnClick();
    }
  },

  caseData(e) {
    wx.navigateTo({
      url: '../caseDetalis/caseDetalis?id=' + e.currentTarget.id,
    })
  },
  /**
   * 导航栏右侧箭头按钮点击事件 - 切换模糊背景开闭状态以及展开栏开闭状态
   */
  navbarBtnClick: function (e) {
    this.data.isBgNeed = !this.data.isPickerShow
    this.setData({
      isBgNeed: this.data.isBgNeed
    })
    this.data.isPickerShow = !this.data.isPickerShow
    this.setData({
      isPickerShow: this.data.isPickerShow,
    })
  },
  /**
   * 页面左右滑动事件 - 构造滑动动画，若当前页面无数据，自动加载，需要完善加载函数
   */
  swiperChange: function (e) {
    var idx = e.detail.current;
    this.getRect(idx)
    console.log(this.data.categories[idx].id)
    var ids = this.data.categories[idx].id
    this.autoScrollTopNav(idx);
    this.setData({
      currentTab: e.detail.current,
    })
    //若无数据，自动加载
    // if (this.data.commodities[idx].length == 0) {
    //   this.downloadMoreItem();
    // }
    if (idx == 0) {
      this.get_Business_All(this.data.add)
      return
    } else {
      this.get_Signal_All(this.data.add, ids, idx)
    }
  },
  autoScrollTopNav: function (idx) {
    if (idx <= 2) {
      this.data.scrollLeftValue = 0;
    } else {
      this.data.scrollLeftValue = (idx - 2) * 90;
    }
    this.setData({
      scrollLeftValue: this.data.scrollLeftValue
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.get_business_banner();
    var that = this;
    var id = options.id
    var index = options.index
    that.setData({
      currentTab: index,
      scrollLeftValue: index,
      id: id,
      nus: index
    })
    that.get_business_nav();
    if (index == 0) {
      that.get_Business_All(that.data.add)
    } else {
      that.get_Signal_All(that.data.add, that.data.id, that.data.nus)
    }
  },
	// 轮播
	get_business_banner: function () {
		var _this = this;
		var post = {
			cmd: 'get_business_banner',
			id: 166
		}
		util.sendAjax(post, (res) => {
			var imgArray = [];
			for (var i = 0; i < res.data.length; i++) {
				imgArray[i] = util.formatImg(res.data[i].img_path)
			}
			_this.setData({
				imgUrls: imgArray
			})
			console.log('轮播图'+this.data.imgUrls)
		})
	},
  getRect: function (i) {
    var _this = this
    wx.createSelectorQuery().selectAll('.more_list').boundingClientRect(function (rect) {
      if (rect[i].height < 100) {
        _this.setData({
          height: 550
        })
        return
      } else {
        _this.setData({
          height: rect[i].height
        })
      }

    }).exec()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function () {
  //   var that = this
  //   console.log("下来刷新")
  //   that.get_business_nav()
  //   that.get_Business_All(that.data.add)
  //   wx.stopPullDownRefresh()
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this
    var num = _this.data.add
    this.setData({
      add: num + 5
    })
    // switch (s) {
    //   case 0:
    //     _this.get_Business_All(this.data.add)
    //   break
    //   case 1:
    //     break
    //   case 2:
    //     break
    //   case 3:
    //     break
    //   case 4:
    //     break
    //   case 5:
    //     break

    // }
    if (_this.data.nus == 0) {
      _this.get_Business_All(this.data.add)
      return
    } else {
      _this.get_Signal_All(_this.data.add, _this.data.id, _this.data.nus)
    }

    console.log("上拉加载" + this.data.add)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})