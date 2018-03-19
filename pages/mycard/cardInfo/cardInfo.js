// pages/cardInfo/cardInfo.js
const app = getApp()

var util = require('../../../utils/utils.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    avatarUrl: true, //头像更换时控制显隐
    tempFilePaths: [],
    imglist: [],
    VerifyCode: '获取验证码',
		btntype:'primary',
    tel: '',  //手机号
    name: '',  //用户名
    code: '', //验证码
    corporate_name: '', //公司名称
    post: '', //技术部
    email: '', //邮箱
    desc: '', //自我介绍
    head: '', // 头像
    cardInfo: {},  //名片信息
    isFirst: '',
    disabled: false,
    id: ''  //编辑名片id
  },
  onLoad: function (options) {
    // 有openID  可以注册名片
    if (app.globalData.userInfo) {
      console.log('1111')
      this.setData({
        userInfo: app.globalData.userInfo.data
      })
      this.ShowCard();
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，无法正常使用创建名片功能体验。请尝试删除小程序重新进入并授权。',
        success: function (res) {
          if (res) {
            wx.navigateBack({
              delta: 1
            });
          }
        }
      })
    }
    if (options.id != "") {
      var that = this;
      that.setData({
        id: options.id
      })

    }
  },

  ShowCard: function () {
    var that = this;
    var post = {
      cmd: 'ShowCard',
      openid: this.data.userInfo.openid
    }
    util.sendAjax(post, function (res) {
      if (res.data != null) {
        if (res.data.head != '') {
          var thehead = util.formatHeadimg(res.data.head);
        }
        that.setData({
          cardShow: false,
          head: thehead,
          id: res.data.id,
          cardInfo: res.data
        })
      }
    });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  // 遗失光标时获取手机号
  blurTel: function (e) {
    var tel = e.detail.value;
		var that = this;
		that.setData({
			tel: tel
		})
		setInterval(function(){
			if (that.data.tel == '' || !util.Regular(that.data.tel, /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/)){
				that.setData({
					btntype: 'warn',
					disabled:true
				})
			}else{
				that.setData({
					btntype: 'primary',
					disabled: false
				})
			}
		},1000)
  },
  // 获取验证码
  get_Sms: function () {
    var that = this;
    if (that.data.tel != '') {
      if (util.Regular(that.data.tel, /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/)) {
        var post = {
          cmd: 'get_Sms',
          tel: that.data.tel
        }
        util.sendAjax(post, function (res) {
          var total_micro_second = 120 * 1000;    //表示60秒倒计时，想要变长就把60修改更大
          //验证码倒计时
          count_down(that, total_micro_second);
          wx.showLoading({
            title: '发送中',
          })
          if (res.code == 3) {
            wx.hideLoading();
          }
        });
      } else {
        util.toastLoading('请输入正确的手机号')
      }
    } else {
      util.toastLoading('请输入手机号');
    }

  },
  // 打开相册
  getPicker: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

        // 多张上传
        that.data.imglist.push(res.tempFilePaths);
        that.setData({
          tempFilePaths: that.data.imglist
        })
        // 单张上传
        // that.setData({
        //   tempFilePaths: res.tempFilePaths
        // })
        // 图片列表显示隐藏
        if (that.data.tempFilePaths != '') {
          that.setData({
            avatarUrl: false
          })
        } else {
          that.setData({
            avatarUrl: true
          })
        }
        wx.showLoading({
          title: '上传中',
        })
        // 上传图片到服务器
        wx.uploadFile({
          url: util.Baseurl,
          filePath: res.tempFilePaths[0],
          name: 'head',
          formData: {
            cmd: 'upload_info',
            file: 'head',
            head: that.data.tempFilePaths[0]
          },
          header: {
            'content-type': 'application/form-data'
          }, // 设置请求的 header
          success: function (res) {
            wx.hideLoading();
            // 图片赋值
            that.setData({
              head: res.data
            })
          },
          fail: function (res) {

            util.toastLoading('上传失败')
          }
        })
      }
    })
  },
  // 注册(编辑)名片
  register: function (e) {
    var that = this;
    // 头像为空赋值默认头像
    if (that.data.head === '') {
      that.setData({
        head: that.data.userInfo.headimgurl
      })
    }
    if (e.detail.value.name != '') {
      if (e.detail.value.tel != '' && e.detail.value.code != '') {
        if (that.data.id === '') {
          // id为空新建
          var post = {
            cmd: 'register',
            username: e.detail.value.name,
            tel: e.detail.value.tel,
            code: e.detail.value.code,
            corporate_name: e.detail.value.corporate_name,
            post: e.detail.value.post,
            email: e.detail.value.email,
            desc: e.detail.value.desc,
            head: that.data.head,
            openid: that.data.userInfo.openid
          }
        } else {
          // 编辑修改
          var post = {
            cmd: 'editCard',
            username: e.detail.value.name,
            tel: e.detail.value.tel,
            code: e.detail.value.code,
            corporate_name: e.detail.value.corporate_name,
            post: e.detail.value.post,
            email: e.detail.value.email,
            desc: e.detail.value.desc,
            head: that.data.head,
            id: that.data.id
          }
        }
        util.sendAjax(post, function (res) {
          try {
            wx.setStorageSync('cardID', res.code)
          } catch (e) {
          }
          wx.navigateBack({
            delta: 1
          });
        });
      } else {
        util.toastLoading('手机号验证码不能为空')
      }
    } else {
      util.toastLoading('用户名不能为空')
    }
  }
})

/* 毫秒级倒计时 */
function count_down(that, total_micro_second) {
  if (total_micro_second <= 0) {
    that.setData({
      VerifyCode: "重新发送"
    });
    // timeout则跳出递归
    return;
  }

  // 渲染倒计时时钟
  that.setData({
    VerifyCode: date_format(total_micro_second) + " 秒"
  });

  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 10;
    count_down(that, total_micro_second);
  }, 10)



}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

  return sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}