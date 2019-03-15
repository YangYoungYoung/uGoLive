// pages/login/login.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // authorization:true,
    phone: '',
    password: ''
  },
  onLoad: function() {
    let that = this;
    // 登录
    // wx.login({
    //   success: res => {
    //     app.globalData.code = res.code
    //     //取出本地存储用户信息，解决需要每次进入小程序弹框获取用户信息
    //     app.globalData.userInfo = wx.getStorageSync('userInfo')
    //     if (app.globalData.userInfo) {
    //       that.setData({
    //         authorization: false
    //       })
    //     }
    //     //wx.getuserinfo接口不再支持
    //     wx.getSetting({
    //       success: (res) => {
    //         //判断用户已经授权。不需要弹框
    //         if (!res.authSetting['scope.userInfo']) {
    //           that.setData({
    //             showModel: true
    //           })
    //         } else { //没有授权需要弹框
    //           that.setData({
    //             showModel: false
    //           })
    //           wx.showLoading({
    //             title: '加载中...'
    //           })
    //           that.getOP(app.globalData.userInfo)
    //         }
    //       },
    //       fail: function () {
    //         wx.showToast({
    //           title: '网络错误',
    //           icon: 'warn',
    //           duration: 1500,
    //         })
    //       }
    //     })
    //   },
    //   fail: function () {
    //     wx.showToast({
    //       title: '网络错误',
    //       icon: 'warn',
    //       duration: 1500,
    //     })
    //   }
    // })
  },
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      let that = this;

      wx.setStorageSync('userInfo', e.detail.userInfo);
      that.getOP(e.detail.userInfo)
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  //获取用户信息接口
  getOP: function(res) { //提交用户信息 获取用户id
    let that = this
    let userInfo = res
    app.globalData.userInfo = userInfo
    wx.showLoading({
        title: '加载中...',
      }),
      wx.request({
        url: "https://weixin.cmdd.tech/weixin/ugo365/getOpenId",
        data: {
          code: app.globalData.code
        },
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          wx.hideLoading();
          console.log("openId的结果是：" + res.data.openid); //正确返回结果
          if (res.data.openid != undefined) {
            wx.setStorageSync('openId', res.data.openid); // 单独存储openid
            // that.setData({
            //   authorization: false
            // })
            that.login(res.data.openid)
            // wx.redirectTo({
            //   url: '../home/home',
            // })
          } else {

            wx.showToast({
              title: '网络错误',
              icon: 'loading',
              duration: 1500,
            })
          }
        },
        fail: function(res) {
          wx.hideLoading();
          console.log(errMsg); //错误提示信息
          wx.showToast({
            title: '网络错误',
            icon: 'loading',
            duration: 1500,
          })
        }
      });
  },
  //登录
  login: function() {
    let that = this;
    let phone = that.data.phone;
    let password = that.data.password;

    let url = "login?mobile=" + phone + "&password=" + password;
    var params = {
      // mobile: phone,
      // password: password,
      // openid: openId
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          common.showTip('登录成功');
          wx.setStorageSync('phone', phone);
          let userId = res.data.data.user.userId;
          let avatar = res.data.data.user.avatar;
          console.log('userId :',res.data.data.user.userId);
          wx.setStorageSync('userId', userId);
          wx.setStorageSync('avatar', avatar);
          wx.redirectTo({
            url: '../index/index',
          })
        }else{
          common.showTip(res.data.msg,'loading')
        }

      }).catch((errMsg) => {
        wx.hideLoading();
        console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });

  },
  //获取用户名
  phoneInput: function(event) {
    let that = this;
    let phone = event.detail.value;
    console.log(phone)
    that.setData({
      phone: phone
    })
  },
  //获取密码
  passwordInput: function(event) {
    let that = this;
    let password = event.detail.value;
    console.log(password);
    that.setData({
      password: password
    })
  }
})