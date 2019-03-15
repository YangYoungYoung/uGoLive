// pages/label/label.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    labelList: [],
    addList: [],
    labelText: '',
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;

    let url = "zhiBo/room/100/tags"
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        let labelList = res.data.tags;
        let historyList = res.data.tagsUsed;
        console.log(labelList[0]);
        that.setData({
          labelList: labelList,
          historyList: historyList
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



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  getLabel: function(e) {
    let that = this;
    let labelText = e.detail.value;
    if (labelText != '') {
      console.log(labelText);
      that.setData({
        labelText: labelText
      })
    }
  },
  //添加标签
  addLabel: function() {
    let that = this;
    let addList = that.data.addList;
    let labelText = that.data.labelText;
    if (labelText != null && labelText!='') {

      addList.push(labelText);
      that.setData({
        addList: addList,
        labelText: ''
      })
    }





  },
  //删除标签
  onDelete: function(event) {
    let that = this;
    let index = event.currentTarget.dataset.index;
    console.log('index is:', index);
    let addList = that.data.addList;
    //删除指定标签
    addList.splice(index, 1);
    that.setData({
      addList: addList
    })
  },
  //完成,提交标签
  toDone: function() {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    var DZ = "tags"

    let that = this;
    let addList = that.data.addList;
    let tags = '';
    for (var i = 0; i < addList.length; i++) {
      tags += addList[i] + ';'
    }
    console.log(tags);

    let url = "zhiBo/room/100/tags"
    var params = {
      tags: tags
    }
    let method = "POST";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log(res.data);
        common.showTip('添加成功');
        // wx.redirectTo({
        //   url: '../index/index?tags='+tags,
        // })
        prevPage.setData({
          [DZ]: tags

        })
        wx.navigateBack({
          delta: 1
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
  //删除历史
  deleteHistory: function() {
    let that = this;
    let url = "zhiBo/room/100/tags"
    var params = {
      // tags: tags
    }
    let method = "DELETE";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log(res.data);

        if (res.data.code == 200) {
          that.setData({
            historyList: []
          })
          common.showTip('删除成功');
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
  //从历史添加标签
  historyAddToList: function(event) {
    let index = event.currentTarget.dataset.index;
    console.log('index is :', index);
    let that = this;
    let tag = that.data.historyList[index];
    console.log(tag);
    let addList = that.data.addList;
    addList.push(tag);

    that.setData({
      addList: addList
    })
  },

  //从推荐添加标签
  recommendAddToList: function(event) {
    let index = event.currentTarget.dataset.index;
    console.log('index is :', index);
    let that = this;
    let tag = that.data.labelList[index];
    console.log(tag);
    let addList = that.data.addList;
    addList.push(tag);

    that.setData({
      addList: addList
    })
  }
})