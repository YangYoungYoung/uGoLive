//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    src:'',
    title:''
  },


  onLoad: function() {

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
          src:src
        })
        
        // 限制最多只能留下3张照片
        console.log(res.tempFilePaths);
        
      }
    })
  },
  getTitle:function(e){
    let title = e.detail.value;
    console.log(title);
  }

})