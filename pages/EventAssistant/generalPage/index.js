const app = getApp();
const utils = app.globalData.utils;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that= this;
    utils.sendRequest({
      url: '/api/function/info',
      data: {
        uuid: options.functionId,

      },
      method: "POST",
      isLoading: true,
    }, function () {

    }).then(function (res) {


      if (res.data.desc) {
        res.data.desc = res.data.desc.replace(/<figure class="image">/g, '').replace(/<\/figure>/g, '')
          .replace(/<img/g, '<img style="max-width:100%;height:auto;width:100%" ');

      }

      that.setData({

        info: res.data,

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