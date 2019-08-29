const app = getApp();
const utils = app.globalData.utils;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    functionId:"",
    activityId:"",
    userMap:{},
 

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;


    console.log(options.uuid);
    that.setData({
      activityId: options.uuid,
      functionId: options.functionId,
    })

    that.loadData();
  },
  loadInfo:function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/EventAssistant/generalPage/index?functionId=' + that.data.functionId,
    })
   
  },
  loadData: function () {
    var that = this;
     
    

    utils.sendRequest({
      url: '/playerInfo',
      data: {
        activityId: that.data.activityId,
        activityFunctionId: that.data.functionId,
      },
      method: "GET",
      isLoading: true,
    }, function () {

    }).then(function (res) {




      that.setData({

        userMap: res.data,

      })



    });


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

  }
})