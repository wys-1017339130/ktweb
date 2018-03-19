const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
		categories: ['全部', '凯拓OA系统', '凯拓企业邮箱'],
    currentTab: 0,
    scrollLeftValue: 0,
    isBgNeed: false,
    "autoplay":true,
    "interval": 2000,
    "duration": 200
  },
  navClick(e) {
    console.log(e)
    this.setData({
      key: e.currentTarget.dataset.num
    })
  },
  navbarTap: function (e) {
    //将顶部导航栏自动移动到合适的位置
    var idx = e.currentTarget.dataset.idx;
    this.autoScrollTopNav(idx);
    //自动收回
    if (this.data.isPickerShow) {
      this.navbarBtnClick();
    }
    this.setData({
      currentTab: idx
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
  // swiperChange: function (e) {
  //   var idx = e.detail.current;
  //   this.autoScrollTopNav(idx);
  //   this.setData({
  //     currentTab: e.detail.current,
  //   })
  //   //若无数据，自动加载
  //   if (this.data.commodities[idx].length == 0) {
  //     this.downloadMoreItem();
  //   }
  // },
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