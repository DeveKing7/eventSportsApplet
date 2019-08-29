// pages/user/authentication/authentication.js
const app = getApp();
const utils = app.globalData.utils;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    photo: [],
    HealCert: [],
    FinishCert: [],
    childPhoto:[],
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
    groupId: "",
    groupType: "",
    isTeam: "",
    groupInfo: {},
    is_agree: false,
    sigupList: [1],
    on_car: [false],
    totalMoney: "",
    activityId: "",
    adultSizeList: ['S/165/80A', 'M/170/84A', 'L/175/88A', 'XL/180/92A', 'XXL/185/96A', 'XXXL/190/100A'],
    adultSizeIndex: [],
    childSizeList: ['2#/80-90cm', '4#/90-100cm', '6#/100-110cm', '8#/110-115cm', '10#/115-120cm', '14#/125-135cm', '16#/135-145cm', '18#/145cm以上'],
    childSizeIndex: [],
    idcardList: ['居民身份证', '护照', '台湾居民来往大陆通行证', '港澳回乡证'],
    idcardListType: ['idCard', 'passport', 'hmPermit', 'twPermit'],
    idcardIndex: [],
    sexList: ['男', '女'],
    sexIndex: [],
    acSignOrderUuid: "",
    disclaimer: '',
    date: [],

  },

  changeAdultSize(e) {
    var that = this;
    that.data.adultSizeIndex[e.currentTarget.dataset.index] = e.detail.value;
    this.setData({ adultSizeIndex: that.data.adultSizeIndex });
  },
  changeIdcard(e) {

    var that = this;

    that.data.idcardIndex[e.currentTarget.dataset.index] = e.detail.value;

    this.setData({ idcardIndex: that.data.idcardIndex});
  },
  changeSex(e) {
    var  that = this;
    that.data.sexIndex[e.currentTarget.dataset.index] = e.detail.value;

    this.setData({ sexIndex: that.data.sexIndex });
  },
  bindDateChange: function (e) {
    var that = this;
    that.data.date[e.currentTarget.dataset.index] = e.detail.value;

    this.setData({
      date: that.data.date
    })
  },
  changechildSize(e) {
    var that = this;

    that.data.childSizeIndex.splice(e.currentTarget.dataset.index, 1, e.detail.value);


    this.setData({ childSizeIndex: that.data.childSizeIndex });

    console.log(that.data.childSizeIndex)
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    that.setData({

      groupId: options.groupId,
      isTeam: options.isTeam,
      groupType: options.groupType,
      activityId: options.activityId,
      disclaimer: options.disclaimer,
    })


    console.log(options.disclaimer)
    that.loadData();

    // var that = this;
    // wx.getSetting({
    //   success: (res) => {
    //     console.log(res);
    //     console.log(res.authSetting['scope.userLocation']);
    //     if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权
    //       wx.showModal({
    //         title: '是否授权当前位置',
    //         content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
    //         success: function (res) {
    //           if (res.cancel) {
    //             console.info("1授权失败返回数据");
    //             utils.navigateBack();

    //           } else if (res.confirm) {
    //             //village_LBS(that);
    //             wx.openSetting({
    //               success: function (data) {
    //                 console.log(data);
    //                 if (data.authSetting["scope.userLocation"] == true) {
    //                   wx.showToast({
    //                     title: '授权成功',
    //                     icon: 'success',
    //                     duration: 2000
    //                   })
    //                   //再次授权，调用getLocationt的API
    //                   that.loadAdress();
    //                 } else {
    //                   wx.showToast({
    //                     title: '授权失败',
    //                     icon: 'success',
    //                     duration: 2000
    //                   })
    //                   utils.navigateBack();
    //                 }
    //               }
    //             })
    //           }
    //         }
    //       })
    //     } else  {//初始化进入
    //       that.loadAdress();
    //     }
    //   }
    // })

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
  onReady: function () {

  },

  on_car: function (e) {
    var that = this;

    var index = e.currentTarget.dataset.index;
    console.log(index);
    that.data.on_car.splice(e.currentTarget.dataset.index, 1, !that.data.on_car[e.currentTarget.dataset.index]);
    console.log(!that.data.on_car[e.currentTarget.dataset.index]);
    var carFrae = 0;
    for (var i = 0; i < that.data.on_car.length; i++) {

      if (that.data.on_car[i] == true) {

        carFrae += that.data.groupInfo.carFare;

      }

      that.data.totalMoney = that.data.groupInfo.deposit + that.data.groupInfo.price + carFrae + that.data.groupInfo.premium;


    }
    that.setData({

      on_car: that.data.on_car,
      totalMoney: that.data.totalMoney,

    })
    console.log(that.data.on_car);

  },
  loadUserinfo: function () {
    var that = this;



    utils.sendRequest({
      url: '/api/competition/getuserenterforinfo',
      data: {

      },
      method: "POST",
    }, function () {

    }).then(function (res) {

      console.log('成功:' + res.info);
      if (res.errorCode == 0) {

        that.setData({

          userMap: res.info,
          phoneInputValue: res.info.phone,


        })

        console.log('成功:' + that.data.userMap.wlt);

      }









    })


  },
  loadData: function () {
    var that = this;


    console.log(that.data.uuid);


    utils.sendRequest({
      url: '/api/competition/getgroupverify',
      data: {
        groupId: that.data.groupId,
        isTeam: that.data.isTeam,
      },
      method: "POST",
      isLoading: true,
    }, function () {

    }).then(function (res) {

      that.loadUserinfo();
      if (res.errorCode != 0) {

        return;
      }

      /**初始化数组用于存储跨行插入数据时的问题 */
      that.data.sigupList[res.info.teamAmountMax - 1] = {};
      that.data.photo[res.info.teamAmountMax - 1] ="1";
      that.data.HealCert[res.info.teamAmountMax - 1] = "1";
      that.data.FinishCert[res.info.teamAmountMax - 1] = "1";
     // that.data.childPhoto[res.info.teamAmountMax - 1] = "";
   


      for (var i = 0; i < res.info.teamAmountMax; i++) {
        that.data.adultSizeIndex[i] = -1;
        that.data.childSizeIndex[i] = -1;
        that.data.idcardIndex[i]=0;
        that.data.sexIndex[i]=-1;
        that.data.on_car[i] = false;
        that.data.sigupList[i] = i;
        that.data.date[i] = '请选择出生年月';
      }

      console.log(that.data.adultSizeIndex);
      console.log(that.data.idcardIndex);
      that.data.totalMoney = res.info.deposit + res.info.price + res.info.premium;
      res.info.ageMin = utils.formatDate2(new Date(res.info.ageMin));
      res.info.ageMax = utils.formatDate2(new Date(res.info.ageMax));
      that.setData({
        groupInfo: res.info,
         sigupList:that.data.sigupList,
        totalMoney: that.data.totalMoney,
        adultSizeIndex: that.data.adultSizeIndex,
        childSizeIndex: that.data.childSizeIndex,
        idcardIndex: that.data.idcardIndex,
        sexIndex:that.data.sexIndex,
        date:that.data.date,
      })




      console.log(that.data.groupInfo);








    });

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  smsTimerFn: function () {
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
  phoneInput: function (e) {
    let that = this;
    that.setData({
      phoneInputValue: e.detail.value
    });
  },
  codeClick: function () {

    let that = this;
    console.log("code点击" + that.data.smsBtnClicked)
    if (!that.data.smsBtnClicked) {
      utils.showError("请先获取验证码");
      return false;
    }

  },
  codeInput: function (e) {
    let that = this;
    that.setData({
      codeNumer: e.detail.value
    });
  },
  beginSmsTimer: function () {
    let that = this;
    if (!utils.isPhone(that.data.phoneInputValue)) {
      utils.showError("手机号格式不正确");
      return false;
    }
    utils.sendRequest({
      url: '/api/getcode',
      data: {
        phone: that.data.phoneInputValue,
      },
      method: "POST",
      isLoding: true
    }).then(function (res) {
      if (!res.hasErrors) {
        that.setData({
          smsTimer: setInterval(that.smsTimerFn, 1000),
          smsBtnClicked: true
        });
      }
    });

  },

  submitAuth: function (e) {
    var that = this;

    console.log(e.detail.value.price0);

    console.log(e.detail.value.name1);

    console.log(e.detail.value.name);
    console.log(that.data.photo[0]);

    if (e.detail.value.name0 == '') {
      utils.showError("姓名不能为空")
      return;
    }

    if (e.detail.value.cardNumber0.length == 0) {
      utils.showError("请填写正确的身份证号")
      return;
    }
    if (that.data.idcardIndex != 0 && that.data.sexIndex == -1) {

      utils.showError("请选择性别")
      return;

    }
    if (that.data.idcardIndex != 0 && that.data.date == '请选择出生年月') {

      utils.showError("请选择出生年月")
      return;

    }
    if (that.data.groupInfo.sex == '男' && ((that.data.idcardIndex == 0 && e.detail.value.cardNumber0.charAt(16) % 2 == 0) || that.data.sexIndex == 1)) {

      utils.showError("本组别仅支持男性")
      return;

    }

    if (that.data.groupInfo.sex == '女' && ((that.data.idcardIndex == 0 && e.detail.value.cardNumber0.charAt(16) % 2 != 0) || that.data.sexIndex == 0)) {

      utils.showError("本组别仅支持女性")
      return;

    }

    if (!utils.isPhone(e.detail.value.phone0)) {

      utils.showError("请填写正确的手机号")
      return;
    }
    if (!utils.isSMSCode(that.data.codeNumer)) {
      utils.showError("请输入验证码")
      return;
    }
    if (that.data.groupInfo.needHealCert && !that.data.photo[0] && !that.data.FinishCert[0]) {

      utils.showError("请至少上传一张健康证明或完赛证书")
      return;

    }
    if (that.data.groupInfo.needSize && that.data.adultSizeIndex == -1) {

      utils.showError("请选择衣服尺码")
      return;

    }
    if (that.data.groupInfo.needLinkman && e.detail.value.urgencyName0 == '') {

      utils.showError("紧急联系人姓名不能为空")
      return;

    }
    if (that.data.groupInfo.needLinkman && !utils.isPhone(e.detail.value.urgencyPhone0)) {

      utils.showError("请填写正确的紧急联系人手机号")
      return;
    }



    wx.showLoading({
      title: '报名中',
    })


    var resultPhotoList = [];
    var resultHealCertList = []
    var resultFinishCertList = [];
    var processCount = 0;
    var processtotal = that.data.photo.length + that.data.FinishCert.length + that.data.HealCert.length;
    var j = 0;
    var totalPhoto = [];
    if (that.data.photo.length>0){
      totalPhoto = totalPhoto.concat(that.data.photo);
    }
    
    // if (that.data.photo.length > 0) {
    //   totalPhoto = totalPhoto.concat(that.data.photo);
    // }
    if (that.data.HealCert.length > 0) {
      totalPhoto = totalPhoto.concat(that.data.HealCert);
    }

    if (that.data.FinishCert.length > 0) {
      totalPhoto = totalPhoto.concat(that.data.FinishCert);
    }
  
  
   
   
   console.log("照片合集："+totalPhoto);
  
    if (processtotal == 0) {


      utils.sendRequest({
        url: '/api/competition/enterfor',
        data: {
          activityId: that.data.activityId,
          groupId: that.data.groupId,
          isTeam: that.data.isTeam,
          groupType: that.data.groupType,
          code: that.data.codeNumer,
          count: that.data.sigupList.length,
          totalPrice: that.data.totalMoney,
          acSignOrderUuid: that.data.acSignOrderUuid,
          list: [
            {
              isCaptain: true,
              name: e.detail.value.name0,
              idCard: e.detail.value.cardNumber0,
              birthday: new Date(that.data.date.replace(/-/g, "/")).getTime(),
              sex: that.data.sexList[that.data.sexIndex],
              phone: e.detail.value.phone0,
              certHealImg: resultHealCertList[0],
              certFinishImg: resultFinishCertList[0],
              photo: resultPhotoList[0],
              idType: that.data.idcardListType[that.data.idcardIndex],
              size: that.data.adultSizeList[that.data.adultSizeIndex],
              linkManName: e.detail.value.urgencyName0,
              linkManPhone: e.detail.value.urgencyPhone0,
              isByCar: that.data.on_car[0],
            }
          ],

        },
        isForm: false,
        method: "POST",
        isLoading: true,
      }).then(function (res) {

        wx.hideLoading();
        if (res.errorCode == 0) {


          that.data.acSignOrderUuid = res.acSignOrderUuid;
          utils.pay_request(res.acSignOrderUuid, "redirect", that.data.activityId);
          if (app.refresh) {
            app.refresh();
          }



        }

      });

    } else {
      for (var i = 0; i < processtotal; i++) {
        if (processCount == that.data.photo.length || processCount == (that.data.HealCert.length + that.data.photo.length)) {

          j = 0;
        }
        wx.uploadFile({
          url: utils.convertUrl("/admin/file/upload"),
          filePath: totalPhoto[i] ,
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

                resultHealCertList.push(resJson.items[0].url);
              } else if (processCount == (that.data.HealCert.length + that.data.photo.length)) {

                resultFinishCertList.push(resJson.items[0].url);
              } else {

                resultPhotoList.push(resJson.items[0].url);

              }


              processCount++;
              j++;
              console.log(processCount);
              console.log('photo:' + resultPhotoList);
              console.log('Finish:' + resultFinishCertList);
              console.log('resultHealCertList:' + resultHealCertList);
              if (processCount == processtotal) {


                var signDataList = [];
                for (var i = 0; i < that.data.sigupList.length; i++) {

                  var map =
                  {
                    isCaptain: i == 0 ? true : false,
                    name: e.detail.value.name + i,
                    idCard: e.detail.value.cardNumber + i,
                    birthday: new Date(that.data.date[i].replace(/-/g, "/")).getTime(),
                    sex: that.data.sexList[that.data.sexIndex[i]],
                    phone: e.detail.value.phone + i,
                    certHealImg: resultHealCertList[i],
                    certFinishImg: resultFinishCertList[i],
                    photo: resultPhotoList[i],
                    idType: that.data.idcardListType[that.data.idcardIndex[i]],
                    size: that.data.adultSizeList[that.data.adultSizeIndex[i]],
                    linkManName: e.detail.value.urgencyName + i,
                    linkManPhone: e.detail.value.urgencyPhone + i,
                    isByCar: that.data.on_car[i],
                  }

                  signDataList.concat(map);

                }
                console.log("封装数据："+signDataList);

                return;


                utils.sendRequest({
                  url: '/api/competition/enterfor',
                  data: {
                    activityId: that.data.activityId,
                    groupId: that.data.groupId,
                    isTeam: that.data.isTeam,
                    groupType: that.data.groupType,
                    code: that.data.codeNumer,
                    count: that.data.sigupList.length,
                    totalPrice: that.data.totalMoney,
                    acSignOrderUuid: that.data.acSignOrderUuid,
                    list: [
                      {
                        isCaptain: true,
                        name: e.detail.value.name0,
                        idCard: e.detail.value.cardNumber0,
                        phone: e.detail.value.phone0,
                        birthday: new Date(that.data.date.replace(/-/g, "/")).getTime(),
                        sex: that.data.sexList[that.data.sexIndex],
                        certHealImg: resultHealCertList[0],
                        certFinishImg: resultFinishCertList[0],
                        photo: resultPhotoList[0],
                        idType: that.data.idcardListType[that.data.idcardIndex],
                        size: that.data.adultSizeList[that.data.adultSizeIndex],
                        linkManName: e.detail.value.urgencyName0,
                        linkManPhone: e.detail.value.urgencyPhone0,
                        isByCar: that.data.on_car[0],
                      }
                    ],

                  },
                  isForm: false,
                  method: "POST",
                  isLoading: true,
                }).then(function (res) {

                  wx.hideLoading();
                  if (res.errorCode == 0) {


                    that.data.acSignOrderUuid = res.acSignOrderUuid;
                    utils.pay_request(res.acSignOrderUuid, "redirect", that.data.activityId);
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
  click_childPhoto:function(e){

    var that = this;

    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      count: 1,
      success: res => {
        var images = this.data.childPhoto.concat(res.tempFilePaths)
        // 限制最多只能留下1张照片

        console.log(e.currentTarget.dataset.index);
        that.data.childPhoto.splice(e.currentTarget.dataset.index, 1, images[images.length - 1]);
        console.log(that.data.childPhoto);

        that.setData({
          childPhoto: that.data.childPhoto,

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
      count: 1,
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