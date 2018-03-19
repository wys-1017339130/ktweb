// pages/messageInfo/messageInfo.js
var util = require('../../../utils/utils.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickname: ''
    },
    headimgurl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo.data,
        headimgurl: app.globalData.userInfo.data.headimgurl
      })
      this.show_wxInfo();
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，无法正常使用该功能体验。请尝试删除小程序重新进入并授权。',
        success: function (res) {
          if (res) {
            wx.navigateBack({
              delta: 1
            });
          }
        }
      })
    }
  },
// 获取个人信息
  show_wxInfo:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var post = {
      cmd: 'show_wxInfo',
      openid: that.data.userInfo.openid
    }
    util.sendAjax(post, function (res) {
      wx.hideLoading();
      console.log(res);
      if(res.data != null){
        that.setData({
          userInfo: res.data,
          headimgurl: res.data.headimgurl
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 修改个人信息
  edit_wxInfo: function (e) {
    if (e.detail.value.nickname !=''){
      if (e.detail.value.sex != ''){
        // if (e.detail.value.phone != '')
        var that = this;
        console.log(e.detail.value);
        var name = e.detail.value.nickname == '' ? userInfo.nickname : e.detail.value.nickname;
        var sex = e.detail.value.sex == '' ? userInfo.sex : e.detail.value.sex;
        var post = {
          cmd: 'edit_wxInfo',
          nickname: name,
					old: that.data.userInfo.nickname,
          openid: that.data.userInfo.openid,
          id: that.data.userInfo.id,
          sex: e.detail.value.sex,
          phone: e.detail.value.phone,
          address: e.detail.value.address,
          desc: e.detail.value.desc
        }
        console.log(post);
        util.sendAjax(post, function (res) {
          util.toastSuccess("保存成功");
					wx.navigateBack({
						delta: 1
					});
        })
      }else{
        util.toastLoading('请选择性别')
      }     
    }else{
      util.toastLoading('请输入用户名')
    }
    
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
    this.show_wxInfo();
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