
// pages/user/user.js

const app = getApp();
const utils = app.globalData.utils;

Page({

  /**
   * 页面的初始数据
   */
  data: {
   user:{},
    loginAuthor: false,
  },
  //微信授权
  onGotUserInfo: function (e) {

    var that = this;

    if (e.detail.errMsg.indexOf('deny') == -1) {


      app.createUser(e.detail).then(function (res) {

        console.log('创建新用户成功');

        that.data.loginAuthor = false;

        that.refresh = res => {
          if (that.data.loginAuthor == true) {
            that.setData({
              loginAuthor: false,
            })
           

          }
        }

   






      })


    } else {

    }



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that  = this;
    app.afterUserInfo(function () {

      console.log("开始加载数据");
    
      that.setData({
     
        user: app.globalData.userInfo,
      });
      console.log(that.data.user.headImageUrl);
    }, function () {
      console.log("显示授权页面");
      that.setData({
        loginAuthor: true

      });


    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({

      user: app.globalData.userInfo,
    });
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

  },
  nav2MyActivity: function () {
    wx.navigateTo({
      url: '/pages/orderList/orderList',
    })
  },
  makeCall: function () {
    wx.makePhoneCall({
      phoneNumber: '400-0511-101'
    })
  }
})