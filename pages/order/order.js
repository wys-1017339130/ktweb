const app = getApp()
var util = require('../../utils/utils.js');
var WxParse = require('../wxParse/wxParse.js');
Page({
  data: {
    "imgUrls": [],
    "left":'',
    "id": 0,
    "mode":'widthFix',
    "ctitle": {},
    "name": {},
    "newData": {},
		"img":'',
    "meunlist": [],
    "currentTab":0,
    "indicatorDots": false,
    "autoplay": true,
    "interval": 5000,  //轮播切换时间
    "duration": 1000   //切换速度
  },
  onLoad: function() {
    var _this=this
    _this.get_business_nav(_this.data.id);
		_this.get_business_banner();
  },
	// 轮播
	get_business_banner:function(){
		var _this = this;
		var post = {
			cmd: 'get_business_banner',
			id:160
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
  tagChoose: function (options) {
    var that = this
    var id = options.currentTarget.dataset.id;
    var ids = options.currentTarget.id
    that.setData({
      id:id
    })
    that.get_Subcolumn(ids)
    if (that.data.currentTab === id){
      return false
    }else{
      that.setData({
        key: options.currentTarget.dataset.num,
        left: options.currentTarget.offsetLeft,
        currentTab: id
      })     
    }
    if(id == "1"){
      var left = parseInt(options.currentTarget.offsetLeft) +100;
      that.setData({
        left: left
      })
    }
  },
  scroll(e) {
    var num = e.detail.current
    var ide = this.data.meunlist[num].id
    switch (num) {
      case 0:
        this.lian(e, num)
        this.get_Subcolumn(ide)
        break
      case 1:
        this.lian(e, num)
        this.get_Subcolumn(ide)
        break
      case 2:
        this.lian(e, num)
        this.get_Subcolumn(ide)
        break
      case 3:
        this.lian(e, num)
        this.get_Subcolumn(ide)
        break
      case 4:
        this.lian(e, num)
        this.get_Subcolumn(ide)
        break
    }
  },

  lian(list, n) {
    this.setData({
      key: list.detail.current,
      currentTab: list.detail.current,
      left: n * 200
    })
  },
  currentlist () {
    var _this = this
    var num = _this.data.currentTab
    var id=_this.data.meunlist[num].id
    var m = num+1
    wx.navigateTo({
			url: '../orderInfo/orderInfo?id=' +id+'&index='+m,
    })
  },
  get_business_nav (n) {
    var _this=this
    var post = {
      cmd: 'get_business_nav'
    }
    util.sendAjax(post, (res)=>{
    //   var navmy = [{ name: 'APP案例展示', id: '0' }, { name: '微信案例展示', id: '0' }, { name: '网站案例展示', id: '0' }, { name: '电商案例展示', id: '0' }, { name: '视觉设计与拍摄作品', id: '0' }]
    //  for(var i=0;i<res.data[0].sub.length;i++){
    //    navmy[i].id = res.data[0].sub[i].id
    //  }
     _this.setData({
       meunlist: res.data[0].sub
     })
     this.get_Subcolumn(res.data[0].sub[n].id)
    })
  },
  get_Subcolumn (id) {
    var that=this
    var post = {
      cmd: 'get_Subcolumn',
      id: id
    }
    util.sendAjax(post,function(res){
			console.log('业务范围内容');
			console.log(res);
			var imgUrl = util.formatImg(res.data.columnimg);
      that.setData({
				ctitle: res.data.keywords,
        id: res.data.id,
				img: imgUrl,
        name: res.data.name
      })
			var article = res.data.description
      WxParse.wxParse('article', 'html', article, that, 5);
    })
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  onPullDownRefresh: function () {
    var _this=this
    _this.get_business_nav(_this.data.id);
    wx.stopPullDownRefresh()
  }
})