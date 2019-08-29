// pages/productOrder/list/list.js
const app = getApp();
const utils = app.globalData.utils;

var sliderWidth = 60;

Page({

    /**
     * 页面的初始数据
     */
    data: {

        tabs: ["活动", "我的活动"],
        tabsValue: ["activity", "myactivity"],
        sliderWidth: sliderWidth,
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        hasUserInfo: false,
        eventList: [],
        menuFixed:false,
        menuTop:0,
        page:1,
      loadMore: true,
      loading: false,
      loginCalled: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        var that = this;
       
     
      that.loadData();

    


        if (options.state) {
            for (var i = 0; i < that.data.tabsValue.length; i++) {
                if (that.data.tabsValue[i] == options.state) {
                    that.setData({
                        activeIndex: i,
                    })

                    break;
                }
            }

        }

      

        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });

    },
 

   
    tabClick: function(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id,
            page: 1,
        });
        this.loadData();
    },

    loadData: function() {
        var that = this;
        var list = [];
    
      // for (var i = 0; i < 2; i++) {
      //   var map = {
      //     "img": "/image/Event/eventImg.png",
      //     "SignUp": i == 0 ?true:false,
      //     "title": i == 0 ?"【张家口-尚义】大众体验者招募进行中": "廊坊站大众体验者招募",
      //     "time": "活动时间：2018-11-20~2018-11-23",
      //     "count":"38",
      //     "adress":"张家口易县狼牙山风景区",
      //     "state": i==0?"进行中":"已结束"
      //   }
      //   list[i] = map;
         
       
      // }
      
      
        utils.sendRequest({
          url: '/api/activity/activitylist',
            data: {
              type: that.data.tabsValue[that.data.activeIndex],
              page: that.data.page,
            },
            method: "POST",
          isLoading: true,
        }, function() {
            that.setData({
                showEmpty: true,
            })
        }).then(function(res) {
          wx.stopPullDownRefresh();
          
          if (res.errorCode != 0) {
            
            return;
          }
         
          if (that.data.activeIndex == 1 && (res.list == null) && !res.isLastPage) {
                that.setData({
                  showEmpty: true,
                  loading: false,
                   eventList:[],
                 
                })

                return;
            } else {
             

           
           
           console.log("是否最后:"+res.isLastPage)
            if (res.isLastPage == true) {
              that.setData({
                loadMore: false
              })
            } else {
              that.setData({
                loadMore: true
              })
            }
            if (that.data.page == 1) {
              that.setData({
                eventList: []
              })

            }
            if (res.list){
            for (var i = 0; i < res.list.length; i++) {

              res.list[i].activityStartTime = utils.formatDate(new Date(res.list[i].activityStartTime));
              res.list[i].activityEndTime = utils.formatDate(new Date(res.list[i].activityEndTime));
              res.list[i].acrossImg = res.list[i].acrossImg+'_375';
            }
       
             
              that.setData({
                eventList: that.data.page == 1 ? res.list : that.data.eventList.concat(res.list)
              })

              that.setData({
                page: that.data.page + 1,
                loading: false
              })
               
            }
                 
             

            }
            
        });

    },

    
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;
     
      var that = this;

      var query = wx.createSelectorQuery()//创建节点查询器 query

      query.select('#affix').boundingClientRect()//这段代码的意思是选择Id= the - id的节点，获取节点位置信息的查询请求

      query.exec(function (res) {

        // console.log(res[0].top); // #affix节点的上边界坐

        // that.setData({

        //   menuTop: res[0].top

        // })

      });

      
    },
  onPageScroll: function (e) {

     // console.log(e.scrollTop);

    var that = this;
    // that.setData({

    //   menuTop: e.scrollTop

    // })
    // 3.当页面滚动距离scrollTop > menuTop菜单栏距离文档顶部的距离时，菜单栏固定定位

    if (e.scrollTop >0) {
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

      var that = this;
      that.setData({
        page: 1,
      })
      this.loadData();

    },

    /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {
    var that = this;
    if (that.data.loadMore) {
     
      that.loadData();
    }

  },
 
})