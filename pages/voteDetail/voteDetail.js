// pages/voteDetail/voteDetail.js
const app = getApp();
const utils = app.globalData.utils;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventList: [],
    state:"1",
    vote_state:"1",
    activityId:"",
    eventMap:{},
    activityInfo:{},
    userId:"",
    area:"",
    loginAuthor: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.wlt = res => {
     
      that.setData({
        loginAuthor: true

      });
      console.log('显示授权页面:' + that.data.loginAuthor);
    }
    console.log(options.activityId, options.uuid, options.area);
    that.setData({

      activityId: options.activityId,
      userId: options.uuid,
      area: options.area,
    })


    app.afterUserInfo(function () {

      console.log("开始加载数据");
   
      that.loadData();
      that.setData({
        loginAuthor: false

      });
    }, function () {
      console.log("显示授权页面");
      that.setData({
        loginAuthor: true

      });

    })




 

   
  

     

  },
  loadData: function () {

     

    var that = this;
    utils.sendRequest({
      url: '/api/activity/canvassing',
      data: {
        userId: that.data.userId,
        activityId: that.data.activityId,
        area: that.data.area,
       
  



      },
      method: "POST",
      isLoading: true,
    }).then(function (res) {
      if (res.errorCode != 0) {
        return;
      }


 
      res.info.activityInfo.activityStartTime = utils.formatDate(new Date(res.info.activityInfo.activityStartTime));
      res.info.activityInfo.activityEndTime = utils.formatDate(new Date(res.info.activityInfo.activityEndTime));

      that.setData({
        eventMap: res.info.myVoteInfo,
        activityInfo: res.info.activityInfo,
      })
     



    });







 



  },
  click_vote: function (e) {


    var that = this;
    utils.sendRequest({
      url: '/api/activity/vote',
      data: {
        voteUserId: that.data.userId,
        activityId: that.data.activityId,

      },
      isLoading: true,
      method: "POST",
    }).then(function (res) {

      if (res.errorCode != 0) {
        return;
      }

      utils.showError("投票成功");

      that.loadData();









    });



  },
  click_signUp: function () {

    var that = this;


    wx.navigateTo({
      url: '/pages/toSignUp/toSignUp?uuid=' + that.data.activityId,
    })


  },

  //微信授权
  onGotUserInfo: function (e) {

    var that = this;

    if (e.detail.errMsg.indexOf('deny') == -1) {

      if (!that.data.hasUserInfo) {
        app.createUser(e.detail).then(function (res) {

          console.log('创建新用户成功');
          that.loadData();
          that.setData({
            loginAuthor: false

          })

        })
      }

    } else {

    }



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
    return {
      imageUrl: this.data.activityInfo.shareImage,
      title: this.data.activityInfo.title,
      path: '/pages/voteDetail/voteDetail?uuid=' + this.data.userId + '&activityId=' + this.data.activityId + '&area=' + this.data.area
    }
  
  }
})