//app.js
const app = getApp();
const utils = require('/utils/util.js')
 
App({
  afterUserInfo: function (func, func_fail) {
    if (this.globalData.userInfo) {
      func();
    } else {

      if (this.globalData.loginCalled) {
        if (func_fail)
          func_fail();
      } else {
        this.userInfoFailCallback = res => {

          func_fail();
        }
      }
      this.userInfoReadyCallback = res => {
        func();
      }
    }
  },

    onLaunch: function() {
     
        // 展示本地存储能力
        // var logs = wx.getStorageSync('logs') || []
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs)

        // // 登录
        // wx.login({
        //     success: res => {
        //         // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //     }
        // })
        // // 获取用户信息
        // wx.getSetting({
        //     success: res => {
        //         if (res.authSetting['scope.userInfo']) {
        //             // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        //             wx.getUserInfo({
        //                 success: res => {
        //                     // 可以将 res 发送给后台解码出 unionId
        //                     this.globalData.userInfo = res.userInfo

        //                     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //                     // 所以此处加入 callback 以防止这种情况
        //                     if (this.userInfoReadyCallback) {
        //                         this.userInfoReadyCallback(res)
        //                     }
        //                 }
        //             })
        //         }
        //     }
        // })
      var that = this;
      wx.getSystemInfo({
        success: function (res) {
          
          that.globalData.windowWidth= res.windowWidth;
          that.globalData.windowHeight= res.windowHeight;
        

        }
      });

      wx.getUpdateManager().onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log("是否有新版本：" + res.hasUpdate);
        if (res.hasUpdate) { //如果有新版本

          // 小程序有新版本，会主动触发下载操作（无需开发者触发）
          wx.getUpdateManager().onUpdateReady(function () { //当新版本下载完成，会进行回调
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，单击确定重启应用',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  wx.getUpdateManager().applyUpdate();
                }
              }
            })

          })

          // 小程序有新版本，会主动触发下载操作（无需开发者触发）
          wx.getUpdateManager().onUpdateFailed(function () { //当新版本下载失败，会进行回调
            wx.showModal({
              title: '提示',
              content: '检查到有新版本，但下载失败，请检查网络设置',
              showCancel: false,
            })
          })
        }
      });

        var that = this;

   
   
     

      utils.login(function (res) {
        console.log("开始登录");
        that.globalData.loginCalled = false;
        // that.globalData.userInfo = res.user;
        if (that.userInfoReadyCallback) {
          that.userInfoReadyCallback(res)
        }
      }, function () {

        console.log("开始登录");
        that.author();
     
        
      });



    },
  author :function () {
    var that = this;
    console.log("开始创建新用户");
    wx.getSetting({
      success: (res) => {
        console.log(res);
        console.log(res.authSetting['scope.userInfo']);
        if (res.authSetting['scope.userInfo'] != undefined && res.authSetting['scope.userInfo'] != true) {//非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权用户信息',
            content: '需要获取您的用户信息，请确认授权，否则活动功能将无法使用',
            success: function (res) {
              if (res.cancel) {
                console.info("1授权失败返回数据");
                if (that.userInfoFailCallback) {
                  that.userInfoFailCallback()
                }

              } else if (res.confirm) {
                //village_LBS(that);
                wx.openSetting({
                  success: function (data) {
                    console.log(data);
                    if (data.authSetting["scope.userInfo"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 2000
                      })
                      

                     that.getUser();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 2000
                      })
                      if (that.userInfoFailCallback) {
                        that.userInfoFailCallback()
                      }

                    }
                  }
                })
              }
            }
          })
        } else {//初始化进入
          this.getUser();
        }
      }
    })

  },

 getUser :function () {

var that = this;


   console.log("开始请求creatuser接口");

    wx.getUserInfo({
      success(res) {
        console.log("wx.getuserinfo数据" + res.errMsg+ " ==:"+ res.userInfo);
     
        if (res.errMsg.indexOf('deny') == -1) {
          that.createUser(res).then(function () {


            console.log("新用户创建成功");
            if (that.userInfoReadyCallback) {
              that.userInfoReadyCallback(res)
            }
          })
        }
        
      },
      fail: function () {

        console.log('创建新用户失败，回调授权页面')
        
          //data 为需要传入的数据
      
        if(that.wlt){

         that.wlt();

        }
      
       
      }
    })





















  },

   

    createUser: function(detail) {
      console.log("请求" + detail);
        var that = this;
        return new Promise(function(r, j) {
            utils.sendRequest({
              url: '/user/createuser',
                data: {
                    info: detail,
                  applet: "SSLNAPPLETMAIN"
                },
                method: 'POST',
                isForm: false,
                isLoading: true,
            }).then(function(obj) {
              console.log("结果"+obj);
                utils.setSessionId(obj.thirdSessionId);
                that.globalData.userInfo = obj.user;
                r();
            });

        });
    },

    globalData: {
        loginCalled: false,
        userInfo: null,
        utils: utils,
        windowHeight:"",
        windowWidth:"",
        myThis: this,
    }
})