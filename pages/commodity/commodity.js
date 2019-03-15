// pages/commodity/commodity.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let userId = wx.getStorageSync('userId');

    let url = "goods/list?userId=" + userId
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {

          console.log(res.data.data.goodsS);
          let shopList = res.data.data.goodsS
          if (shopList.length != 0) {
            that.setData({
              shopList: shopList
            })
          }else{
            common.showTip("暂无数据",'loading');
          }

        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'loading',
            duration: 1500,
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },


})