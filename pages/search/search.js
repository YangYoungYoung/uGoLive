// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //搜索功能
  onSearch: function(event) {
    // console.log('搜索功能', event.detail);
    let that = this;
    let searchText = that.data.value;
    console.log('搜索功能', searchText);
    that.setData({
      searchText: event.detail
    })
    if (searchText != '' && searchText != null) {
      that.search();
    }

  },
  onChange: function(event) {
    let that = this;
    let searchText = event.detail;
    that.setData({
      value: searchText
    })
  },
  search: function() {
    let that = this;
    let userId = wx.getStorageSync('userId');
    let searchText = that.data.searchText;

    let url = "goods/list?userId=" + userId + "&searchText=" + searchText;
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
          } else {
            common.showTip("暂无数据", 'loading');
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
  //提交
  submit: function() {
    let that = this;
    let userId = that.data.userId;
    let selectList = that.data.selectList;
    let goodsIds = '';
    for (var i = 0; i < selectList.length; i++) {
      if (selectList.hasNext) {
        goodsIds += selectList[i] + ','
      } else {
        goodsIds += selectList[i]
      }
    }

    let url = "zhiBo/room/" + userId + "/goodsIds?goodsIds=" + goodsIds
    var params = {

    }
    let method = "PUT";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          common.showTip("提交成功", 'success');

          // console.log(res.data.data.goodsS);
          // let shopList = res.data.data.goodsS
          // if (shopList.length != 0) {
          //   that.setData({
          //     shopList: shopList
          //   })
          // } else {
          //   common.showTip("暂无数据", 'loading');
          // }

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
  }
})