// pages/news/news.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    newsList:[],
    autoplay:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      autoplay: this.data.imgUrls.length > 1
    })
    var data=new Array();
    for(var i=0;i<20;i++){
      data.push({
        url:'/image/share/main-share.png',
        title:'xxx马拉松体验季已开始报名xxx马拉松体验季已开始报名',
        datetime:'2019-08-19 14:00'
      });
    };
    this.setData({
      newsList:data
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
    var data = new Array();
    for (var i = 0; i < 20; i++) {
      data.push({
        url: '/image/share/main-share.png',
        title: 'xxx马拉松体验季已开始报名xxx马拉松体验季已开始报名',
        datetime: '2019-08-19 14:00'
      });
    };
    this.setData({
      newsList: data
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var data = new Array();
    for (var i = 0; i < 20; i++) {
      data.push({
        url: '/image/share/main-share.png',
        title: 'xxx马拉松体验季已开始报名xxx马拉松体验季已开始报名',
        datetime: '2019-08-19 14:00'
      });
    };
    var contactList = this.data.newsList.concat(data);
    wx.showLoading({
      title: '加载中...',
    });
    var _this=this;
    setTimeout(function(){
      _this.setData({
        newsList: contactList
      });
      wx.hideLoading();
    },2000);
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onNewsItemClick:function(){
    wx.navigateTo({
      url: '/pages/newsDetail/newsDetail',
    })
  },
  onTopAdvClick:function(){
    wx.navigateTo({
      url: '/pages/newsDetail/newsDetail',
    })
  }
})