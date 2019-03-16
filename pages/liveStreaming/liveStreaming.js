// pages/liveStreaming/liveStreaming.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
var webim = require('../../utils/webim_wx.js');
var webimhandler = require('../../utils/webim_handler.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 1334,
    showModalStatus: false,
    pushUrl: '',
    playUrl: '',
    avChatRoomId: '20190201',
    identifier: '', // 当前用户身份标识，必选
    userSig: '', // 当前用户签名，必选
    nickName: '', // 当前用户昵称，选填
    msgContent: '',
    avatar: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res.windowHeight) // 获取可使用窗口高度
        let windowHeight = (res.windowHeight * (750 / res.windowWidth)); //将高度乘以换算后的该设备的rpx与px的比例
        console.log(windowHeight) //最后获得转化后得rpx单位的窗口高度
        that.setData({
          windowHeight: windowHeight
        })
      }
    })
    //获取推流地址
    let pushUrl = wx.getStorageSync('pushUrl');;
    console.log("pushUrl is:=====", pushUrl);
    //获取播流
    let playUrl = wx.getStorageSync('playUrl');
    console.log("playUrl is:=====", playUrl);

    //获取identifier
    let identifier = 'ugo' + wx.getStorageSync('userId');
    //获取userSig
    let userSig = options.userSig;
    //获取用户名
    let nickName = wx.getStorageSync('nickName');
    let avatar = wx.getStorageSync('avatar');
    console.log('avatar..........', avatar);
    that.setData({
      pushUrl: pushUrl,
      identifier: identifier,
      userSig: userSig,
      playUrl: playUrl,
      nickName: nickName,
      avatar: avatar
    })

    console.log("identifier is:", identifier);



    //获取用户信息
    // that.getUserInfo();
    let location = wx.getStorageSync('location');
    that.setData({
      location: location
    })
    //获取推流
    // that.getPushUrl();
    // let userId = wx.getStorageSync('userId');
    // let userName = wx.getStorageSync('userName');
    // that.setData({
    //   userSig: options.userSig,

    // });
    that.initIM();

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  onReady(res) {
    this.ctx = wx.createLivePusherContext('pusher');
    this.ctx.start({
      success: res => {
        console.log('start success')
      },
      fail: res => {
        console.log('start fail')
      }
    })
  },
  statechange(e) {
    console.log('live-player code:', e.detail.code)
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },

  shouModel: function() {
    let that = this;
    that.setData({
      showModalStatus: true
    })
  },
  //关闭监听
  onClose: function() {
    let that = this;
    wx.showModal({
      title: '关闭直播',
      content: '确认关闭直播吗？',
      showCancel: true, //是否显示取消按钮
      cancelText: "否", //默认是“取消”
      cancelColor: '#919191', //取消文字的颜色
      confirmText: "是", //默认是“确定”
      confirmColor: '#E83D2C', //确定文字的颜色
      success: function(res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定，调起关闭直播接口
          that.closeLiveRoom();
        }
      },
      fail: function(res) {}, //接口调用失败的回调函数
      complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）

    })
  },
  //关闭直播接口
  closeLiveRoom: function() {
    let that = this;

    let url = "zhiBo/room/100"
    var params = {

    }
    let method = "DELETE";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          common.showTip("关闭成功");
          wx.redirectTo({
            url: '../index/index',
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
  //获取用户信息
  getUserInfo: function() {
    let that = this;
    // let phone = wx.getStorageSync('phone');

    // let url = "userInfo?mobile=" + phone
    let url = "userInfo?mobile=1"
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        let userName = res.data.userName;
        let userId = res.data.userId;
        that.setData({
          identifier: userId,
          nickName: userName
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
  //获取推流地址
  // getPushUrl: function() {
  //   let that = this;
  //   // let userId = wx.getStorageSync('userId');

  //   let url = "common/MLVC/pushUrl?id=1"
  //   var params = {

  //   }
  //   let method = "GET";
  //   wx.showLoading({
  //       title: '加载中...',
  //     }),
  //     network.POST(url, params, method).then((res) => {
  //       wx.hideLoading();
  //       // if (res.data.code == 200) {
  //     console.log('PushUrl：',res.data);
  //       that.setData({
  //         pushUrl: res.data
  //       })
  //       // }

  //     }).catch((errMsg) => {
  //       wx.hideLoading();
  //       console.log(errMsg); //错误提示信息
  //       wx.showToast({
  //         title: '网络错误',
  //         icon: 'loading',
  //         duration: 1500,
  //       })
  //     });
  // },

  //聊天室初始化
  initIM: function() {
    var that = this;
    var avChatRoomId = that.data.avChatRoomId;

    webimhandler.init({
      accountMode: 0, //帐号模式，0-表示独立模式，1-表示托管模式(已停用，仅作为演示)
      accountType: '36862',
      sdkAppID: '1400184416',
      avChatRoomId: avChatRoomId, //默认房间群ID，群类型必须是直播聊天室（AVChatRoom），这个为官方测试ID(托管模式)
      selType: webim.SESSION_TYPE.GROUP,
      selToID: avChatRoomId,
      selSess: null //当前聊天会话
    });
    //当前用户身份
    var loginInfo = {
      'sdkAppID': '1400184416', //用户所属应用id,必填
      'appIDAt3rd': '1400184416', //用户所属应用id，必填
      'accountType': '36862', //用户所属应用帐号类型，必填
      'identifier': that.data.identifier, //当前用户ID,必须是否字符串类型，选填
      'identifierNick': that.data.nickName || '', //当前用户昵称，选填
      'userSig': that.data.userSig, //当前用户身份凭证，必须是字符串类型，选填
    };

    //监听（多终端同步）群系统消息方法，方法都定义在demo_group_notice.js文件中
    var onGroupSystemNotifys = {
      "5": webimhandler.onDestoryGroupNotify, //群被解散(全员接收)
      "11": webimhandler.onRevokeGroupNotify, //群已被回收(全员接收)
      "255": webimhandler.onCustomGroupNotify //用户自定义通知(默认全员接收) 
    };

    //监听连接状态回调变化事件
    var onConnNotify = function(resp) {
      switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
          //webim.Log.warn('连接状态正常...');
          break;
        case webim.CONNECTION_STATUS.OFF:
          webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
          break;
        default:
          webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
          break;
      }
    };


    //监听事件
    var listeners = {
      "onConnNotify": webimhandler.onConnNotify, //选填
      "onBigGroupMsgNotify": function(msg) {
        webimhandler.onBigGroupMsgNotify(msg, function(msgs) {
          that.receiveMsgs(msgs);
        })
      }, //监听新消息(大群)事件，必填
      "onMsgNotify": webimhandler.onMsgNotify, //监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
      "onGroupSystemNotifys": webimhandler.onGroupSystemNotifys, //监听（多终端同步）群系统消息事件，必填
      "onGroupInfoChangeNotify": webimhandler.onGroupInfoChangeNotify //监听群资料变化事件，选填
    };

    //其他对象，选填
    var options = {
      'isAccessFormalEnv': true, //是否访问正式环境，默认访问正式，选填
      'isLogOn': true //是否开启控制台打印日志,默认开启，选填
    };

    webimhandler.sdkLogin(loginInfo, listeners, options, avChatRoomId);
  },
  onUnload: function() {
    // 登出
    webimhandler.logout();
  },
  //点击小键盘
  bindConfirm: function(e) {
    var that = this;
    var content = e.detail.value;
    console.log('content is:', content);
    if (!content.replace(/^\s*|\s*$/g, '')) return;
    webimhandler.onSendMsg(content, function() {
      that.clearInput();
    })
  },
  clearInput: function() {
    this.setData({
      msgContent: ""
    })
  },
  receiveMsgs: function(data) {
    console.log('receiveMsgs', data);
    var msgs = this.data.msgs || [];
    msgs.push(data);
    //最多展示10条信息
    if (msgs.length > 10) {
      msgs.splice(0, msgs.length - 10)
    }

    this.setData({
      msgs: msgs
    })
  },
})