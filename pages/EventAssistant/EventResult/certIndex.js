// pages/user/authentication/authentication.js
const app = getApp();
const utils = app.globalData.utils;

Page({

  /**
   * 页面的初始数据
   */
  data: {

   
   cert:"",



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    that.setData({

      uuid: options.uuid,
      cert: options.cert,

    })

 



  },
  //点击开始的时间  
  timestart: function (e) {
    var _this = this;
    _this.setData({ timestart: e.timeStamp });
  },
  //点击结束的时间
  timeend: function (e) {
    var _this = this;
    _this.setData({ timeend: e.timeStamp });
  },

  //保存图片
  saveImg: function (e) {
    var that = this;

    wx.previewImage({
      current: that.data.cert + '_750', // 当前显示图片的http链接
      urls: [that.data.cert+'_750'] // 需要预览的图片http链接列表
    })


    // var times = _this.data.timeend - _this.data.timestart;
    // if (times > 300) {
    //   console.log("长按");
    //   wx.getSetting({
    //     success: function (res) {
    //       wx.authorize({
    //         scope: 'scope.writePhotosAlbum',
    //         success: function (res) {
    //           console.log("授权成功");
    //           var imgUrl = _this.data.cert;
    //           wx.showModal({
    //             title: '提示',
    //             content: '保存这张图片到相册吗？',
    //             success(res) {
    //               if (res.confirm) {

    //                 wx.downloadFile({//下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
    //                   url: imgUrl,
    //                   success: function (res) {


    //                     // 下载成功后再保存到本地
    //                     wx.saveImageToPhotosAlbum({
    //                       filePath: res.tempFilePath,//返回的临时文件路径，下载后的文件会存储到一个临时文件
    //                       success: function (res) {
    //                         wx.showToast({
    //                           title: '成功保存到相册',
    //                           icon: 'success'
    //                         })
    //                       }
    //                     })
    //                   }
    //                 })
    //               } else if (res.cancel) {
    //                 console.log('用户点击取消')
    //               }
    //             }
    //           })


    //         } ,fail:function(){
             

    //           wx.showModal({
    //             title: '提示',
    //             content: '请开启相册保存权限',
    //             success(res) {
    //               if (res.confirm) {

                
    //                 wx.openSetting({
    //                   success(res) {
    //                     console.log(res.authSetting)
                      
    //                   }
    //                 })
 
                     
               
    //               } else if (res.cancel) {
    //                 console.log('用户点击取消')
    //               }
    //             }
    //           })




    //         }
    //       })
    //     }
    //   })
    // }
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  loadData: function (e) {


     


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


})