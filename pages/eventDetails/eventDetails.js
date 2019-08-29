// pages/productOrder/list/list.js
const app = getApp();
const utils = app.globalData.utils;

var sliderWidth = 40;

Page({

  /**
   * 页面的初始数据
   */
  data: {

    tabs: ["活动介绍", "行程安排","注意事项"],
    tabsValue: ["event", "event","event"],
    categoryList:[
      { 'logo':'/image/detail/category/competingPackages.png',
        'functionName':'参赛包',
        'page':'/pages/EventAssistant/EventPackage/EventPackage'},
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
        'h5':'http://m.yundong.runnerbar.com/#/activityDetail?activity_id=22252&VNK=4e9cde68&access_token=BE02A9B00F1748F7E7018D6D92F4DE07&a_existtime=1566545365904&refresh_token=5857F2AF3BDCE74D66ED1FA65EFE9823&r_existtime=1576308565904&ayd_uid=1496544&appid=null&openid=oxibit6rsTQrbC5chuBYhUaJYRNI'
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
    sliderWidth: sliderWidth,
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    hasUserInfo: false,
    loginAuthor: false,
    uuid:"",
    eventMap: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("用户信息:" + that.data.categoryList[6].h5);
  
    app.refresh =res  =>{

    console.log("回调");

    }

     

    if (options.state) {
      for (var i = 0; i < that.data.tabsValue.length; i++) {
        if (that.data.tabsValue[i] == options.state) {
          that.setData({
            activeIndex: i,
            uuid: options.uuid,
          })

          break;
        }
      }

    }

    that.setData({
      
      uuid: options.uuid,
      categoryList: that.data.categoryList,
    })

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
 
 

  },


  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    
    });
  
  },

  loadData: function () {
    var that = this;
    var list = [];

    // for (var i = 0; i < 1; i++) {
    //   var map = {
    //     "img": "/image/Event/eventImg.png",
    //     "SignUp": i == 0 ? true : false,
    //     "title": i == 0 ? "张家口大众体验季招募" : "廊坊站大众体验者招募",
    //     "time": "活动时间：2018-11-20~2018-11-23",
    //     "state": i == 0 ? "进行中" : "已结束"
    //   }
    //   list[i] = map;


    // }

    // that.setData({
    //   eventList: list,
    // })
    
    utils.sendRequest({
      url: '/api/activity/activitydetail?uuid=' + that.data.uuid,
      data: {

      },
      method: "POST",
      isLoading: true,
    }, function () {

    }).then(function (res) {

      wx.hideLoading();


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

      res.info.activityStartTime = utils.formatDate(new Date(res.info.activityStartTime));
      res.info.activityEndTime = utils.formatDate(new Date(res.info.activityEndTime));

      res.info.applyStartTime = utils.formatDate(new Date(res.info.applyStartTime));
      res.info.applyEndTime = utils.formatDate(new Date(res.info.applyEndTime));
      if (res.info.type =='COMPETITION'){
        that.data.tabs = ['赛事介绍','赛事组别','注意事项'];
      }
      that.setData({

        eventMap: res.info,
        loginAuthor: app.globalData.userInfo ? false : true,
        tabs:that.data.tabs,
      })
      if (that.refresh) {

        that.refresh();
      }



    });

    utils.sendRequest({
      url: '/api/function/list',
      data: {
        activityId: that.data.uuid,
       
      },
      method: "POST",
      isLoading: true,
    }, function () {
    
    }).then(function (res) {
for(var i = 0;i<res.list.length;i++){

  res.list[i].url = encodeURIComponent(res.list[i].url);
   


}
      // res.list[0].page = "/pages/EventAssistant/EventPackage/EventPackage";

        that.setData({
  
          categoryList: res.list,
 
        })
   
      

    });
   

  },
  clickResult: function (e) {
    var that = this;
    wx.navigateTo({
      url: "/pages/EventAssistant/EventResult/ExperienceCert?uuid=" + that.data.eventMap.uuid,
    })

  },
  //微信授权
  onGotUserInfo: function (e) {

    var that = this;

    if (e.detail.errMsg.indexOf('deny') == -1) {

    
        app.createUser(e.detail).then(function (res) {

          console.log('创建新用户成功');

          that.data.loginAuthor = false;

          that.refresh = res => {
            if (that.data.loginAuthor == true) {
              that.setData({
                loginAuthor: false,
              })
            if (e.target.dataset.type == 'vote') {
              wx.navigateTo({
                url: '/pages/voteList/voteList?uuid=' + that.data.eventMap.uuid + '&state=' + that.data.eventMap.state,
              })
            }

            if (e.target.dataset.type == 'signup' && that.data.eventMap.joinState =='UNJOIN') {
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

  click_vote: function () {

    var that = this;

    wx.navigateTo({
      url: '/pages/voteList/voteList?uuid=' + that.data.eventMap.uuid + '&state=' + that.data.eventMap.state,
    })

  },
  click_signUp: function () {

    var that = this;
    if (that.data.eventMap.type =='EXPERIENCE'){

  
    wx.navigateTo({
      url: '/pages/toSignUp/toSignUp?uuid=' + that.data.eventMap.uuid,
    })
    } else if (that.data.eventMap.type == 'COMPETITION') {


      wx.navigateTo({
        url: '/pages/toSignUp/CompetitionGroup?uuid=' + that.data.eventMap.uuid,
      })
    }

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

   

  var that = this;

    that.setData({
      loginAuthor: app.globalData.userInfo ? false : true

    });

    that.loadData();
 
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
    var that = this;
    var temp = "";
    if (app.globalData.userInfo) {
      temp = "?sourceUserId=" + app.globalData.userInfo.uuid;
    }
    return {
      imageUrl: that.data.eventMap.acrossImg,
      title: that.data.eventMap.title,
      path: '/pages/eventDetails/eventDetails?uuid=' + that.data.eventMap.uuid,
    }
  }

})