// pages/voteDetail/voteDetail.js
const app = getApp();
const utils = app.globalData.utils;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventList: [],
    state: "",
    type:"",
    activityId: "",
    eventMap: {},
    userInfo: {},
    uuid: "",
    area: "",
    loginAuthor: false,
    FinishCert:[],
    photo:[],
    HealCert:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    that.setData({

      uuid: options.uuid,
      activityId: options.activityId,
      type:options.type,

    })

    that.loadData();







  },
  loadData: function () {



    var that = this;
    utils.sendRequest({
      url: '/api/signorder/signorderdetail',
      data: {
        orderId: that.data.uuid,





      },
      method: "POST",
      isLoading: true,
    }).then(function (res) {
      if (res.errorCode != 0) {
        return;
      }

      res.info.payTime = utils.formatTime(new Date(res.info.payTime));
      

      that.setData({
        eventMap: res.info,
        userInfo: res.info.userList

      })

      console.log(that.data.eventMap);


    });











  },

  clickTopay: function (e) {

var that = this;

    console.log(e.currentTarget.dataset.uuid);
    utils.pay_request(e.currentTarget.dataset.uuid, "redirect", that.data.activityId);

  },
  click_HealCert: function (e) {

    var that = this;

    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      count: 1,
      success: res => {
        var images = this.data.HealCert.concat(res.tempFilePaths)
        // 限制最多只能留下1张照片

        console.log(e.currentTarget.dataset.index);
        that.data.HealCert.splice(e.currentTarget.dataset.index, 1, images[images.length - 1]);
        console.log(that.data.HealCert);

        that.setData({
          HealCert: that.data.HealCert,

        })


      }
    })

  },

  click_photo: function (e) {

    var that = this;

    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      count: 1,
      success: res => {
        var images = this.data.photo.concat(res.tempFilePaths)
        // 限制最多只能留下1张照片

        console.log(e.currentTarget.dataset.index);
        that.data.photo.splice(e.currentTarget.dataset.index, 1, images[images.length - 1]);
        console.log(that.data.photo);

        that.setData({
          photo: that.data.photo,

        })


      }
    })
  },
  click_FinishCert: function (e) {

    var that = this;

    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      count:1,
      success: res => {
        var images = this.data.FinishCert.concat(res.tempFilePaths)
        // 限制最多只能留下1张照片

        console.log(e.currentTarget.dataset.index);
        that.data.FinishCert.splice(e.currentTarget.dataset.index, 1, images[images.length - 1]);
        console.log(that.data.FinishCert);

        that.setData({
          FinishCert: that.data.FinishCert,

        })


      }
    })
  },

  clickRejected:function(){

    var that = this;
  
    var resultPhotoList = [];
    var resultFinishCertList = [];
    var processCount = 0;
    var processtotal = that.data.photo.length + that.data.FinishCert.length;
    var j = 0;
    console.log(processtotal);
    if (processtotal == 0) {

      utils.showError("请重新上传相关证明");

      return;

    } else {
      for (var i = 0; i < processtotal; i++) {
        if (j == that.data.photo.length) {

          j = 0;
        }
        wx.uploadFile({
          url: utils.convertUrl("/admin/file/upload"),
          filePath: processCount == that.data.photo.length ? that.data.FinishCert[j] : that.data.photo[j],
          name: 'files',
          success: function (res) {
            var resJson = JSON.parse(res.data);
            if (!resJson.hasErrors) {
              // utils.sendRequest({
              //     url: "/qijukeji/wechat/appletmerchant/checkorder/inserttrack",
              //     data: {
              //         checkOrderUuid: that.data.checkOrderUuid,
              //         type: 'image',
              //         content: resJson.items[0].url,
              //     },
              //     method: "POST",
              //     isLoading: true
              // }).then(function (res) {
              //     that.setData({
              //         textareaContent: "",
              //     });
              //     that.loadTrackList();
              // });
              if (processCount == that.data.photo.length) {

                resultFinishCertList.push(resJson.items[0].url);
              } else {

                resultPhotoList.push(resJson.items[0].url);
              }


              processCount++;
              j++;
              console.log(processCount);
              if (processCount == processtotal) {

                utils.sendRequest({
                  url: '/api/competition/updatesignresultinfo',
                  data: {
                    activityId: that.data.activityId,
                        list:[{
                         urUserActivityUuid: that.data.userInfo[0].uuid,
                        certHealImg: resultPhotoList[0],
                        certFinishImg: resultFinishCertList[0],
                        }],
                  

                  },
                  isForm: false,
                  method: "POST",
                  isLoading: true,
                }).then(function (res) {

                  wx.hideLoading();
                  if (res.errorCode == 0) {
                  
                    utils.navigateBack();
                    if (app.refresh) {
                      app.refresh();
                    }

                  }



                });




              }
            }
          },
          fail: function (errMs) {
            console.log('uploadImage fail, errMsg is', errMs)
          }
        })
      }




    }





    var that = this;
    utils.sendRequest({
      url: '/api/competition/updatesignresultinfo',
      data: {
        urUserActivityUuid: that.data.userInfo[0].uuid,
        
 



      },
      method: "POST",
      isLoading: true,
    }).then(function (res) {
      if (res.errorCode != 0) {
        return;
      }

      res.info.payTime = utils.formatTime(new Date(res.info.payTime));


      that.setData({
        eventMap: res.info,

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