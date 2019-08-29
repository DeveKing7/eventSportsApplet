const app = getApp();
const utils = app.globalData.utils;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userMap: {
      scoreId: '123456',
      name: '王立涛',
      userId: '123456',
      activityTitle: '纵横燕赵2019河北山地越野大赛阜平站',
      groupName: '35公里竞技组',
      idCard: '130481198907021092',
      activityNum: 'B053',
      phone: '15530114511',
      exactScore: '04:26:28',
      roughScore: '04:26:30',
      exactGroupRanking: '1',
      exactTotalRanking: '14',
      roughGroupRanking: '1',
      roughTotalRanking: '14',
      activityType: '',
      list: [{
        timingPoint: '起点',
        score: '01:10:20'
      },
        {
          timingPoint: '2号点',
          score: '02:35:20'
        },
        {
          timingPoint: '3号点',
          score: '02:44:21'
        },
        {
          timingPoint: '终点',
          score: '03:20:10'
        } ]
    },
    scoreRankingList:[],

    segScoreList: [{
      timingPoint: '计时点',
      score: '分段成绩'
    }],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  var that = this;
    var user = JSON.parse(options.user);
 
    that.data.userMap = user.info;
  that.data.scoreRankingList.push(
      [' ',"成绩","组别排名","全部选手排名"],
    ['枪声成绩', that.data.userMap.roughScore, that.data.userMap.roughGroupRanking, that.data.userMap.roughTotalRanking],
    ['净计时成绩', that.data.userMap.exactScore, that.data.userMap.exactGroupRanking, that.data.userMap.exactTotalRanking]);
    that.data.segScoreList= that.data.segScoreList.concat(that.data.userMap.list);
    var a = user.info.idCard;
    a = a.split('') ;  //将a字符串转换成数组
    a.splice(8, 6, '******') ; //将1这个位置的字符，替换成'xxxxx'. 用的是原生js的splice方法。
    console.log(a);   //结果是：
    
    a=a.join('');
    
    user.info.idCard = a;

    console.log(that.data.segScoreList);
    console.log(that.data.userMap.list);
    that.setData({
      segScoreList: that.data.segScoreList,
      scoreRankingList: that.data.scoreRankingList,
      userMap:user.info,
    })
  

  },

  submitAuth: function (e) {


    var that = this;
  

    if (that.data.userMap.fileUrl != null ){
      wx.navigateTo({
        url: '/pages/EventAssistant/EventResult/certIndex?cert=' + that.data.userMap.fileUrl,
      })
      return;

    }



    wx.showLoading({
      title: '证书正在生成...',
    })


    utils.sendRequest({
      url: '/api/score/downloadcert',
      data: that.data.userMap,

      method: "POST",
   
    }).then(function (res) {
     wx.hideLoading();

      if (res.errorCode == 0) {


    wx.navigateTo({
      url: '/pages/EventAssistant/EventResult/certIndex?cert=' + res.fileUrl,
    })

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})