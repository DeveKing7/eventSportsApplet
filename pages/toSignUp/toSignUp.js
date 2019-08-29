// pages/user/authentication/authentication.js
const app = getApp();
const utils = app.globalData.utils;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        photo: [],
        is_detail: true,
        phoneInputValue: "",
        codeNumer: "",
        smsTimer: null,
        //倒计时一分钟
        smsTimerCount: 60,
        smsBtnClicked: false,
        ldata: false,
        latitude: "",
        longitude: "",
        userMap: {},
        uuid: "",
        is_agree: false,
        nocode:false,
      province:"",


    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        var that = this;
        that.setData({

            uuid: options.uuid,


        })



        var that = this;
        wx.getSetting({
            success: (res) => {
                console.log("位置"+res);
                console.log(res.authSetting['scope.userLocation']);
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权
                    wx.showModal({
                        title: '是否授权当前位置',
                        content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                        success: function(res) {
                            if (res.cancel) {
                                console.info("1授权失败返回数据");
                                utils.navigateBack();

                            } else if (res.confirm) {
                                //village_LBS(that);
                                wx.openSetting({
                                    success: function(data) {
                                        console.log(data);
                                        if (data.authSetting["scope.userLocation"] == true) {
                                            wx.showToast({
                                                title: '授权成功',
                                                icon: 'success',
                                                duration: 2000
                                            })
                                            //再次授权，调用getLocationt的API
                                            that.loadAdress();
                                        } else {
                                            wx.showToast({
                                                title: '授权失败',
                                                icon: 'success',
                                                duration: 2000
                                            })
                                            utils.navigateBack();
                                        }
                                    }
                                })
                            } else   {
                              console.info("2授权失败返回数据");
                              utils.navigateBack();

                            }
                        }
                    })
                } else { //初始化进入
                console.log("来喽~");
                    that.loadAdress();
                }
            }
        })

        // wx.getSetting({
        //   success(getRes) {
        //     if (getRes.authSetting["scope.userLocation"]) {


        //       that.loadAdress();

        //     } else {

        //       wx.authorize({
        //         scope: 'scope.userLocation',
        //         success: res => {
        //           //用户点击允许之后就可以获取地址了，使用wx.chooseAddress接口
        //          that.loadAdress();
        //         },

        //       })

        //     }
        //   }
        // })

    },
    onReady: function() {

    },
    loadAdress: function() {
        var that = this;

        wx.getLocation({
            type: 'gcj02',
            success(res) {

                console.log("位置" + res.name + "   " + res.address + res.latitude + res.longitude);
                that.setData({

                    latitude: res.latitude,
                    longitude: res.longitude,


                })

                utils.sendRequest({
                    url: '/api/activity/isIdentificationAndCity',
                    data: {
                        lng: res.longitude,
                        lat: res.latitude,
                    },
                    method: "POST",
                }, function() {

                }).then(function(res) {

                    console.log('成功:' + res.info);
                    if (res.errorCode == 0) {
                        
                        that.setData({

                            userMap: res.info,
                            phoneInputValue: res.info.phone,
                          nocode: res.info.phone&&res.info.phone.length>0?true:false

                        })
                        console.log('成功:' + that.data.userMap.city);

                    } else if (res.errorCode == 100) {

                        wx.showModal({
                            title: "未满足报名条件",
                            content: res.errorMessage,
                            showCancel: false,
                            success(res) {

                                utils.navigateBack();

                            }
                        })

                    }  







                });

            },
          fail: function () {
         
              console.log("请开启手机系统定位权限");
              utils.showError("请开启手机系统定位，并确保对微信已授权。", (function (res) {

                utils.navigateBack();

              }));
        
          }
        })


    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    smsTimerFn: function() {
        let that = this;
        if (that.data.smsTimerCount == 1) {
            clearInterval(that.data.smsTimer);
            that.setData({
                smsTimerCount: 60,
                smsTimer: null,
                smsBtnClicked: false
            })
        } else {
            that.setData({
                smsTimerCount: that.data.smsTimerCount - 1
            });
        }
    },
    phoneInput: function(e) {
        let that = this;
        that.setData({
            phoneInputValue: e.detail.value
        });
    },
    codeClick: function() {

        let that = this;
        console.log("code点击" + that.data.smsBtnClicked)
        if (!that.data.smsBtnClicked) {
            utils.showError("请先获取验证码");
            return false;
        }

    },
    codeInput: function(e) {
        let that = this;
        that.setData({
            codeNumer: e.detail.value
        });
    },
    beginSmsTimer: function() {
        let that = this;
        if (!utils.isPhone(that.data.phoneInputValue)) {
            utils.showError("手机号格式不正确");
            return false;
        }
        utils.sendRequest({
            url: '/api/getcode',
            data: {
                phone: that.data.phoneInputValue,
              applet: "SSLNAPPLETMAIN"
            },
            method: "POST",
            isLoding: true
        }).then(function(res) {
            if (!res.hasErrors) {
                that.setData({
                    smsTimer: setInterval(that.smsTimerFn, 1000),
                    smsBtnClicked: true
                });
            }
        });

    },

    submitAuth: function(e) {
      wx.showLoading({
        title: '报名中',
      })

        var that = this;

     

        var temp = new Date();
      if (that.data.latitude==''){
        utils.showError("请点击授权地理位置信息")
        wx.hideLoading();
        return;

      }
        if (e.detail.value.name == '') {
            utils.showError("姓名不能为空")
          wx.hideLoading();
            return;
        }

        if (utils.isCardNumber(e.detail.value.cardNumber)) {
            utils.showError("请填写正确的身份证号")
          wx.hideLoading();
            return;
        }

        if (!utils.isPhone(e.detail.value.phone)) {

            utils.showError("请填写正确的手机号")
          wx.hideLoading();
            return;
        }
      if (that.data.nocode==false){

   
        if (!utils.isSMSCode(that.data.codeNumer)) {
            utils.showError("请输入4位验证码")
          wx.hideLoading();
            return;
        }
        }
        if (that.data.photo.length == 0) {

            utils.showError("请选择自己真实照片")
          wx.hideLoading();
            return;

        }
        var resultList = [];


       
        wx.uploadFile({
            url: utils.convertUrl("/admin/file/upload"),
            filePath: that.data.photo[0],
            name: 'files',
            success: function(res) {
                console.log((new Date() - temp)+ "22222222222");
                var resJson = JSON.parse(res.data);
            
                if (!resJson.hasErrors) {


                    resultList.push(resJson.items[0].url);
                  console.log(e.detail.formId);
                    utils.sendRequest({
                        url: '/api/activity/enterfor',
                        data: {
                            photoUrl: resultList,
                            name: e.detail.value.name,
                            cardNumber: e.detail.value.cardNumber,
                            phone: e.detail.value.phone,
                            code: e.detail.value.code,
                            lng: that.data.longitude,
                            lat: that.data.latitude,
                            activityId: that.data.uuid,
                            city: that.data.userMap.city,
                            province: that.data.userMap.province,
                            formId: e.detail.formId,

                        },
                        method: "POST",
                       
                    }).then(function(res) {
                        console.log((new Date() - temp)+ "33333333333");
                       
                        if (res.errorCode == 0) {

                            wx.showModal({
                                content: "报名成功",
                                showCancel: false,

                                success: function(res) {

                                    utils.navigateBack();
                                    if (app.refresh) {
                                        app.refresh();
                                    }

                                }
                            });
                        }
                      wx.hideLoading();

                    });




                }

            },
            fail: function(errMs) {
                console.log('uploadImage fail, errMsg is', errMsg)
                wx.hideLoading();
            }
        })







    },
    click_photo: function() {

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
    click_agree_icon: function() {

        var that = this;
        that.setData({
            is_agree: !that.data.is_agree

        })

    },
    click_agree: function() {

        var that = this;
        that.setData({
            is_detail: false

        })

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {



    },
  notouch:function(){

   console.log("nomovetouch");
   return;

  },
    handler: function(e) {
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
                success: function(res) {
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


})