//index.js
//获取应用实例
const app = getApp();
const utils = app.globalData.utils;
const windowHeight = app.globalData.windowHeight;

Page({
    data: {
     
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,

      loginAuthor:false,
  

        longitude: null,
        latitude: null,
     
        page: 1,
        loadMore: true,
        loading: false,
        is_detail: false,

      eventMap: {},
      state:"1",
      menuFixed: false,
      menuTop: 0,
    },


    onLoad: function(options) {

      var that = this;
     

      app.wlt = res =>{
        that.setData({
          loginAuthor: true

        });
       

      }
      app.afterUserInfo(function () {

        console.log("开始加载数据");
        that.loadData();
        that.setData({
          loginAuthor: false

        });

      }, function () {
        console.log("显示授权页面");
        that.setData({
          loginAuthor: true

        });
 

      })

    
      console.log("高度" + windowHeight);

      // wx.getLocation({
      //   type: 'gcj02',
      //   success(res) {
      //     that.setData({
      //       longitude: res.longitude,
      //       latitude: res.latitude,
      //     })
      //   },
      // })

       
       



        wx.getUpdateManager().onCheckForUpdate(function(res) {
            // 请求完新版本信息的回调
            console.log("是否有新版本：" + res.hasUpdate);
            if (res.hasUpdate) { //如果有新版本

                // 小程序有新版本，会主动触发下载操作（无需开发者触发）
                wx.getUpdateManager().onUpdateReady(function() { //当新版本下载完成，会进行回调
                    wx.showModal({
                        title: '更新提示',
                        content: '新版本已经准备好，单击确定重启应用',
                        showCancel: false,
                        success: function(res) {
                            if (res.confirm) {
                                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                wx.getUpdateManager().applyUpdate();
                            }
                        }
                    })

                })

                // 小程序有新版本，会主动触发下载操作（无需开发者触发）
                wx.getUpdateManager().onUpdateFailed(function() { //当新版本下载失败，会进行回调
                    wx.showModal({
                        title: '提示',
                        content: '检查到有新版本，但下载失败，请检查网络设置',
                        showCancel: false,
                    })
                })
            }
        });


    

    },
  onShow: function () {
    var that = this;
 

    that.setData({
      is_detail: false

    });
 

     that.loadData();
 

    



 
  },
  onPageScroll: function (e) {
    var that = this;
    
    // console.log("移动距离："+e.scrollTop +"  顶部高度： "+ that.data.menuTop);
    

    //console.log("e：" + e);
    // 3.当页面滚动距离scrollTop > menuTop菜单栏距离文档顶部的距离时，菜单栏固定定位

    if (e.scrollTop < 0) {
      if (that.data.menuFixed == false) {
        that.setData({

          menuFixed: true

        })
      }

    } else {
      if (that.data.menuFixed == true) {
        that.setData({

          menuFixed: false

        })
      }
    }

  },
    loadData: function() {

    

        var that = this;
        utils.sendRequest({
          url: '/api/activity/activityinfo',
            data: {},
            method: "POST",
        }).then(function(res) {
            if (res.errorCode != 0) {
                return;
            }
         
          if (res.info.introduce) {
            res.info.introduce = res.info.introduce.replace(/<figure class="image">/g, '').replace(/<\/figure>/g, '')
              .replace(/<img/g, '<img style="max-width:100%;height:auto;width:100%" ');

          }
          if (res.info.schedule) {
            res.info.schedule = res.info.schedule.replace(/<figure class="image">/g, '').replace(/<\/figure>/g, '')
              .replace(/<img/g, '<img style="max-width:100%;height:auto;width:100%" ');

          }
          if (res.info.attention) {
            res.info.attention = res.info.attention.replace(/<figure class="image">/g, '').replace(/<\/figure>/g, '')
              .replace(/<img/g, '<img style="max-width:100%;height:auto;width:100%" ');

          }

            that.setData({
              eventMap: res.info,
            })
          if(that.refresh){

            that.refresh();
          }
         
          // if (res.info.audit == 'REJECTED') {

          //   utils.showError(res.info.auditDesc);

          // }


        });
 
    

        



        // wx.getSetting({
        //     success(res) {
        //         if (res.authSetting["scope.userLocation"]) {
        //             that.loadVenueList("distance", that.data.longitude, that.data.latitude);
        //         } else {
        //             that.loadVenueList("time", null, null);
        //         }
        //     }
        // })



    },
  click_vote: function () {

var that = this;

    wx.navigateTo({
      url: '/pages/voteList/voteList?uuid=' + that.data.eventMap.uuid + '&state=' + that.data.eventMap.state,
    })

  },

  click_signUp: function () {

var that = this;
  

wx.navigateTo({
  url: '/pages/toSignUp/toSignUp?uuid='+that.data.eventMap.uuid,
})

  },
    
    click_eventDetail: function () {

      var that = this;


      wx.navigateTo({
        url: '/pages/eventDetails/eventDetails?uuid=' + that.data.eventMap.uuid,
      })

  },

  click_signUp_competition:function(){

    var that = this;


    wx.navigateTo({
      url: '/pages/toSignUp/CompetitionGroup?uuid=' + that.data.eventMap.uuid,
    })



  },


  click_detail: function () {
  
  let that = this;
  
  that.setData({

    is_detail: !that.data.is_detail,


  })
    

  },

//微信授权
  onGotUserInfo:function(e){

    var that = this;

    if (e.detail.errMsg.indexOf('deny') == -1) {

  
        app.createUser(e.detail).then(function (res) {
          
          console.log('创建新用户成功');
          
       

          that.refresh = res => {
            if (that.data.loginAuthor == true){
              that.setData({
              loginAuthor : false,
              })
              console.log('跳转新的页面');

            if (e.target.dataset.type == 'vote') {
              wx.navigateTo({
                url: '/pages/voteList/voteList?uuid=' + that.data.eventMap.uuid + '&state=' + that.data.eventMap.state,
              })
            }

            if (e.target.dataset.type == 'signup' && that.data.eventMap.joinState == 'UNJOIN') {
              wx.navigateTo({
                url: '/pages/toSignUp/toSignUp?uuid=' + that.data.eventMap.uuid,
              })
            }
            }

          }

           that.loadData();
         
        
         

         
      })
   

    } else {

    }



  },




    imageClick: function(e) {
        var that = this;

        
            wx.navigateToMiniProgram({
              appId: "wx5e2f72d4434fe420",
                path: "",
                extraData: {
               
                },
                envVersion: 'develop',
                success(res) {
                    // 打开成功
                    console.log(1);
                }
            }) 
     
     



    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        var that = this;
        that.setData({
            page: 1,
          is_detail: false,
        })
        this.loadData();


    },

    imageError: function(e) {

        var that = this;
        // console.log(e.);
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

        if (this.data.loadMore) {
            var that = this;
         
        }

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        var that = this;
        var temp = "";
        if (app.globalData.userInfo) {
            temp = "?sourceUserId=" + app.globalData.userInfo.uuid;
        }
        return {
          imageUrl: that.data.eventMap.shareImage,
            title: that.data.eventMap.title,
            path: '/pages/homePage/index' + temp
        }
    }
})