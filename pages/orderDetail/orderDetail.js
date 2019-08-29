// pages/voteDetail/voteDetail.js
const app = getApp();
const utils = app.globalData.utils;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        eventList: [],
        state: "1",
        vote_state: "1",
        activityId: "",
        eventMap: {},
        activityInfo: {},
        uuid: "",
        area: "",
        loginAuthor: false,
      categoryList: [
        {
          'logo': '/image/detail/category/competingPackages.png',
          'name': '参赛包',
          'page': '/pages/EventAssistant/EventPackage/EventPackage'
        },
        {
          'logo': '/image/detail/category/starting.png',
          'name': '起点',
          'page': '/pages/EventAssistant/generalPage/index'
        },
        {
          'logo': '/image/detail/category/end.png',
          'name': '终点',
          'page': '/pages/EventAssistant/generalPage/index'
        },
        {
          'logo': '/image/detail/category/competingManual.png',
          'name': '参赛手册',
          'page': '/pages/EventAssistant/generalPage/index'
        },
        {
          'logo': '/image/detail/category/circuitDiagram.png',
          'name': '赛道图',
          'page': '/pages/EventAssistant/generalPage/index'
        },
        {
          'logo': '/image/detail/category/ShuttleBuses.png',
          'name': '摆渡车',
          'page': '/pages/EventAssistant/generalPage/index'
        },
        {
          'logo': '/image/detail/category/picture.png',
          'name': '相册',
          'page': '/pages/EventAssistant/picture/index',
          'h5': 'http://m.yundong.runnerbar.com/#/activityDetail?activity_id=22252&VNK=4e9cde68&access_token=BE02A9B00F1748F7E7018D6D92F4DE07&a_existtime=1566545365904&refresh_token=5857F2AF3BDCE74D66ED1FA65EFE9823&r_existtime=1576308565904&ayd_uid=1496544&appid=null&openid=oxibit6rsTQrbC5chuBYhUaJYRNI'
        },
        {
          'logo': '/image/detail/category/results.png',
          'name': '成绩',
          'page': '/pages/EventAssistant/EventResult/searchResult'
        },
        {
          'logo': '/image/detail/category/tracking.png',
          'name': '追踪',
          'page': '/pages/EventAssistant/map/index'
        },],

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;


      that.data.categoryList[6].h5 = encodeURIComponent(that.data.categoryList[6].h5);


        that.setData({

            uuid: options.uuid,
          activityId: options.activityId,
      

        })

 







    },
    loadData: function() {



        var that = this;
        utils.sendRequest({
            url: '/api/signorder/signorderdetail',
            data: {
                orderId: that.data.uuid,






            },
            method: "POST",
            isLoading: true,
        }).then(function(res) {
            if (res.errorCode != 0) {
                return;
            }

            res.info.payTime = utils.formatTime(new Date(res.info.payTime));
          

            that.setData({
                eventMap: res.info,
              activityId: res.info.activityId,
            })




        });








      utils.sendRequest({
        url: '/api/function/list',
        data: {
          activityId: that.data.activityId,

        },
        method: "POST",
        isLoading: true,
      }, function () {

      }).then(function (res) {




        that.setData({

          categoryList: res.list,

        })



      });




    },

    clickTopay: function(e) {
     var that = this;
        console.log(e.currentTarget.dataset.uuid);
      utils.pay_request(e.currentTarget.dataset.uuid, "redirect", that.data.activityId);

    },
  clickResult:function(e){
  var that = this;
    wx.navigateTo({
      url: "/pages/EventAssistant/EventResult/ExperienceCert?uuid=" + that.data.activityId,
    })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

      this.loadData();

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})