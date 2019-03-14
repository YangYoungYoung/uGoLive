//index.js
//获取应用实例
const app = getApp()
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({
  data: {
    src: '',
    title: '',
    tags: '',
    district: '',
    goodId: '',
    userSig: ''
  },


  onLoad: function(options) {
    let that = this;
    that.getUserLocation();
    that.getUserSig();
  },

  chooseImage: function() {
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        // const images = this.data.images.concat(res.tempFilePaths)
        let src = res.tempFilePaths;
        this.setData({
          src: src
        })

        // 限制最多只能留下3张照片
        console.log(res.tempFilePaths);

      }
    })
  },
  getTitle: function(e) {
    let title = e.detail.value;
    console.log(title);
  },
  //进入标签
  toLabel: function() {
    wx.navigateTo({
      url: '../label/label',
    })
  },
  onShow() {
    let that = this;

    console.log(that.data.tags, '..............');
  },
  //直播
  toLive: function() {
    let that = this;
    let src = that.data.src; //封面
    let district = that.data.district; //地理位置
    let goodId = that.data.goodId;
    let tags = that.data.tags;
    let title = that.data.title;
    let userId = wx.getStorageSync(userId);

    console.log(tags);

    let url = "zhiBo/room"
    var params = {
      tags: tags
    }
    let method = "POST";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        let userSig = that.data.userSig
       wx.navigateTo({
         url: '../liveStreaming/liveStreaming?userSig=' + userSig,
       })

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
  //获取用户地址
  getUserLocation: function() {
    let that = this;
    wx.getLocation({
      success: function(res) {
        console.log(res)
        // let location = res.latitude
        let qqMapApi = 'http://apis.map.qq.com/ws/geocoder/v1/' + "?location=" + res.latitude + ',' +
          res.longitude + "&key=F24BZ-B5FKQ-6PC5F-GTQJO-RETFK-C7F5M" + "&get_poi=1";
        wx.request({
          url: qqMapApi,
          data: {

          },
          method: 'GET',
          success: (res) => {
            console.log(res.data);
            console.log(res.data.result.address_component.city)

            //取位置名
            that.setData({
              district: res.data.result.address_component.city
            })
            wx.setStorageSync('location', res.data.result.address_component.city)
          }
        });

      },
      fail: function(res) {
        that.setData({
          showModal: true
        })
      }
    })
  },

  //获取userSig
  getUserSig: function() {
    let that = this;
    let userId = wx.getStorageSync(userId);
    let url = "common/im/userSig?userId=1"
    var params = {}
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          let userSig = res.data.urlSig;
          console.log(userSig)
          that.setData({
            userSig: userSig
          })
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
  }

})