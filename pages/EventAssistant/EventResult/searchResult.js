// pages/user/authentication/authentication.js
const app = getApp();
const utils = app.globalData.utils;

Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    name:"",
    code: "",
    uuid: "",
    title:"",
    img:"",
    activityFunctionId:"",
    typeList: ['10km', '20km'],
    typeIndex: -1,

  },
  changeType(e) {
    this.setData({ typeIndex: e.detail.value });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    that.setData({

      uuid: options.uuid,
      activityFunctionId: options.functionId,
      title:options.title,
      img:options.img,
    })
    utils.sendRequest({
      url: '/api/score/competitiontypelist',
      data: {
        activityId: that.data.uuid,



      },

      method: "POST",
      isLoading: true,
    }).then(function (res) {


      if (res.errorCode == 0) {

        that.setData({
          typeList: res.list,
        })


      }


    });
   
   

  },
  onReady: function () {

  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
   

  submitAuth: function (e) {
   

    var that = this;



    
    if (e.detail.value.name == '') {
      utils.showError("姓名不能为空")
      wx.hideLoading();
      return;
    }


    if (e.detail.value.code == '') {
      utils.showError("号码必须为身份证号或者参赛号")
      wx.hideLoading();
      return;
    }

    

 
          utils.sendRequest({
            url: '/api/score/search',
            data: {
              activityId: that.data.uuid,
              name: e.detail.value.name,
              activityFunctionId: that.data.activityFunctionId,
              code: e.detail.value.code,
              functionName: that.data.typeList[that.data.typeIndex],

            },
       
            method: "POST",
            isLoading: true,
          }).then(function (res) {
 

            if (res.errorCode == 0) {
             let user = JSON.stringify(res);
              wx.navigateTo({
                url: '/pages/EventAssistant/EventResult/resultIndex?user=' + user,
              })
        
            }
           

          });




   

   
     
 







  },
  click_photo: function () {

    var that = this;

    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      count: 1,
      success: res => {
        var images = this.data.photo.concat(res.tempFilePaths)
        // 限制最多只能留下1张照片

        console.log(images);
        that.setData({
          photo: images.splice(images.length - 1, 1),

        })


      }
    })
  },
  click_agree_icon: function () {

    var that = this;
    that.setData({
      is_agree: !that.data.is_agree

    })

  },
  click_agree: function () {

    var that = this;
    that.setData({
      is_detail: false

    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {



  },
  notouch: function () {

    console.log("nomovetouch");
    return;

  },
  handler: function (e) {
    var that = this;
    if (!e.detail.authSetting['scope.userLocation']) {
      that.setData({
        ldata: false
      })
    } else {
      that.setData({
        ldata: true,
      })
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude

          that.setData({
            latitude: latitude,
            longitude: longitude
          })
          wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 28
          })
        }
      })
    }
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
  // onShareAppMessage: function () {
  //   var that = this;
  //   var temp = "";
  //   if (app.globalData.userInfo) {
  //     temp = "?sourceUserId=" + app.globalData.userInfo.uuid;
  //   }
  //   return {
  //     imageUrl: that.data.img,
  //     title: that.data.title,
  //     path: '/pages/EventAssistant/EventResult/searchResult?uuid=' + that.data.uuid + '&functionId=' + that.data.activityFunctionId +'&title='+that.data.title+'&img='+that.data.img,
  //   }
  // }


})