// pages/toSignUp/CompetitionGroup.js
const app = getApp();
const utils = app.globalData.utils;

Page({

  /**
   * 页面的初始数据
   */
  data: {
   groupList:[],
    uuid:"rjfvlkm73w",
    disclaimer:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({

      uuid: options.uuid,


    })

    that.loadData();

  },
  loadData: function () {
    var that = this;
   

   console.log(that.data.uuid);


    utils.sendRequest({
      url: '/api/competition/grouplist',
      data: {
        activityId: that.data.uuid,
       
      },
      method: "POST",
      isLoading: true,
    }, function () {
   
    }).then(function (res) {
  

      if (res.errorCode != 0) {

        return;
      }

       for(var i =0;i<res.info.list.length;i++){

         res.info.list[i].startTime = utils.formatTime(new Date(res.info.list[i].startTime));
         res.info.list[i].endTime = utils.formatTime(new Date(res.info.list[i].endTime));

       }
      console.log(res.info.disclaimer)
       
 
        
          that.setData({
            groupList: res.info.list,
            disclaimer: res.info.disclaimer
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