
// 项目地址
//var Baseurl = 'https://wxapp.kaituocn.com/Api';  //接口地址
var Baseurl = 'https://wxapp.kaituocn.com/Api';
var imgurl = 'https://www.kaituocn.com/';  //图片地址
var headurl = 'https://wxapp.kaituocn.com/';  //头像地址

//正则判断
function Regular(str, reg) {
  if (reg.test(str))
    return true;
  return false;
}
//是否为中文
function IsChinese(str) {
  var reg = /^[\u0391-\uFFE5]+$/;
  return Regular(str, reg);
}
//去左右空格;
function trim(s) {
  return s.replace(/(^\s*)|(\s*$)/g, "");
}
function sendAjax(Object, callback) {
  var data = {}
  wx.request({
    url: Baseurl,
    data: Object,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded' // 默认值
    },
    method: "POST",
    success: function (res) {
      console.log(res);
      switch (res.data.code) {
        case 1:
          callback(res.data);
          break;
        case 2:
          callback(res.data);
          break;
        case 3:
          callback(res.data);
          break;
        case -1:
          toastLoading('操作失败');
          break;
        case -2:
          toastLoading('控制器方法不存在');
          break;
        case -3:
          toastLoading('数据不能为空');
          break;
        case -4:
          toastLoading('token无效');
          break;
        case -5:
          toastLoading('请传递token');
          break;
        case -6:
          toastLoading('60秒以后再发送');
          break;
        case -7:
          toastLoading('文件上传错误');
          break;
        case -8:
          toastLoading('验证码失效');
          break;
        case -9:
          toastLoading('验证码错误');
          break;
        case -10:
          toastLoading('用户名重复');
          break;
        default:
          break;

      }
    }
  })
  return data
}

function formatImg(option, noCache) {
  if (option) {
    option = option.split(',')[0]
    if (option.indexOf('http') !== 0) {
      option = imgurl + option
    } else {
			return '11111'
    }
  }else{
		return 'data:image/png;base64,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'
	}
  if (noCache) {
    return option + '?' + Math.random()
  } else {
    return option
  }
}


function formatHeadimg(option, noCache) {
  if (option) {
    option = option.split(',')[0]
    if (option.indexOf('https') !== 0) {
      option = headurl + option
    } else {
      return option
    }
  } else {
    option = this.getLoadIngPack.pngRectangle
  }

  if (noCache) {
    return option + '?' + Math.random()
  } else {
    return option
  }
}


function toastSuccess(str) {
  wx.showToast({
    title: str,
    icon: 'success',
    duration: 2000
  })
}

function toastLoading(str) {
  wx.showToast({
    title: str,
    icon: 'loading',
    duration: 2000
  })
}


//最下面一定要加上你自定义的方法（作用：将模块接口暴露出来），否则会报错：util.trim is not a function;
module.exports = {
  Regular: Regular,
  IsChinese: IsChinese,
  trim: trim,
  Baseurl: Baseurl,
  formatImg: formatImg,
  sendAjax: sendAjax,
  toastSuccess: toastSuccess,
  toastLoading: toastLoading,
  formatHeadimg: formatHeadimg
}

