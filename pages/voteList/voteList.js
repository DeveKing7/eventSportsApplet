// pages/voteList/voteList.js
var sliderWidth = 40;
const app = getApp();
const utils = app.globalData.utils;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myData:{},
    voteList:[],
    tabs: ["河北", "北京", "天津"],
    citys:["河北省","北京市","天津市"],
    tabsValue: ["event", "event", "event"],
    sliderWidth: sliderWidth,
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    searchInputShowed: false,
    searchInputValue: "",
    loadMore: true,
    page: 1,
    searchInputValueTemp: "",
    activityId:"",
    loadMore: true,
    loading: false,
    menuFixed: false,
    menuTop: 0,
    state:"",
    loginAuthor: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.wlt = res => {
      that.setData({
        loginAuthor: true

      });
    
    }
    that.setData({
      
      activityId: options.uuid,
      state: options.state,
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

  loadMydata:function(){


    var that = this;
    utils.sendRequest({
      url: '/api/activity/myactivityvote',
      data: {
  
        activityId: that.data.activityId,

      },
      method: "POST",
    }).then(function (res) {
      wx.stopPullDownRefresh();
      if (res.errorCode != 0) {
        return;
      }


      that.setData({
        myData: res.info,
      })




    });


  },
  loadData: function () {

 

    var that = this;
    utils.sendRequest({
      url: that.data.state == 'NOW' ? '/api/activity/activityvotelist' : '/api/activity/voteresultlist',
      data: {
        area: that.data.citys[that.data.activeIndex],
        activityId: that.data.activityId,
        search: that.data.searchInputValueTemp,
        page: that.data.page,
      },
      method: "POST",
      isLoading: true,
    }).then(function (res) {
      wx.stopPullDownRefresh();
      if (res.errorCode != 0) {
         
        return;
      }
      
      if(res.list){

     
       for(var i = 0;i<res.list.length;i++){

         res.list[i].headImageUrl = res.list[i].headImageUrl;

       }
      }
      if (res.isLastPage == true) {
        that.setData({
          loadMore: false
        })
      } else {
        that.setData({
          loadMore: true
        })
      }

     
     if(that.data.page==1){
       that.setData({
         voteList: []
      })

     }
     
     if(res.list){


    
      that.setData({
        voteList: that.data.page == 1 ? res.list  : that.data.voteList.concat(res.list)
      })
     }
      that.setData({
        state: res.state,
        loading: false
      })


     



    });
},
  click_vote:function(e){


    var that = this;
    utils.sendRequest({
      url: '/api/activity/vote',
  
      data: {
        voteUserId: e.currentTarget.dataset.uuid,
        activityId: that.data.activityId,

      },
      isLoading: true,
      method: "POST",
    }).then(function (res) {
      
      if (res.errorCode != 0) {
        return;
      }
      utils.showError("投票成功");
      that.data.voteList[e.currentTarget.dataset.index].count++;
      
      
      that.setData({
        voteList: that.data.voteList,

      })
    
       

      
 




    });



  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      page:1,
    });
    
    this.loadMydata();
    this.loadData();

  },
  showSearchInput: function () {
    this.setData({
      searchInputShowed: true
    });
  },
  hideSearchInput: function () {
    this.setData({
      searchInputValue: "",
      searchInputValueTemp: "",
      page:1,
      loadMore: true,
      searchInputShowed: false
    });
    this.loadMydata();
    this.loadData();
  },
  clearSearchInput: function () {
    this.setData({
      searchInputValue: "",
      searchInputValueTemp:"",
      searchInputShowed: true
    });
 
  },
  searchInputTyping: function (e) {

    this.setData({
      searchInputValue: e.detail.value,
    });
  },
  searchInputConfirm: function (e) {
    this.setData({
      page: 1,
      loadMore: true,
      searchInputValueTemp: e.detail.value,
      searchInputShowed: false
    });

    console.log(e.detail.value)

   this.loadData();
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


    
    app.afterUserInfo(function () {

      console.log("开始加载数据");
      that.loadMydata();
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
     

   
  },
  onPageScroll: function (e) {
    var that = this;
  //  console.log("移动距离："+e.scrollTop +"  顶部高度： "+ that.data.menuTop);

   

    // 3.当页面滚动距离scrollTop > menuTop菜单栏距离文档顶部的距离时，菜单栏固定定位

    if (e.scrollTop > that.data.menuTop) {
      if(that.data.menuFixed==false){
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

  //微信授权
  onGotUserInfo: function (e) {

    var that = this;

    if (e.detail.errMsg.indexOf('deny') == -1) {

      if (!that.data.hasUserInfo) {
        app.createUser(e.detail).then(function (res) {

          console.log('创建新用户成功');
          that.loadMydata();
          that.loadData();
          that.setData({
            loginAuthor: false

          })
        })
      }

    } else {

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
   
    onPullDownRefresh: function() {

      var that = this;
      that.setData({
        page: 1,
      })
      this.loadMydata();
      this.loadData();

    },

    /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {
    var that = this;
    that.setData({
      page: that.data.page + 1,
     
    })
    if (this.data.loadMore) {
     
      that.loadData();
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      imageUrl: this.data.myData.shareImage,
      title: this.data.myData.title,
      path: '/pages/voteList/voteList?uuid=' + this.data.activityId +   '&state=' + this.data.state
    }
  }
})

