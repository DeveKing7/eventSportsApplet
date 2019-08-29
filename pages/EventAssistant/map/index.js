// pages/map/index.js
const app = getApp()
Page({
  data: {
    mapCtx:null,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    height: wx.getSystemInfoSync().windowHeight,
    latitude: 0,
    longitude: 0,
    playIndex: 0,
    //缩放级别，取值范围为3-20 
    scale: 16,
    satellite:true,
    timer: null,
    satellite:false,
    markers: [
      {
        id: 0,
        latitude: 38.041,
        longitude: 114.511,
        iconPath:'/image/icon-point-start.png',
        // alpha:0,
        callout: {
          content: "50KM马拉松起点",
          padding: 10,
          display: 'BYCLICK',
          textAlign: 'center',
          // borderRadius: 10,
          // borderColor:'#ff0000',
          // borderWidth: 2,
        }

      },
      {
        id: 1,
        latitude: 38.04,
        longitude: 114.51,
        // alpha:0,
        callout: {
          content: "50KM马拉松终点",
          padding: 10,
          display: 'BYCLICK',
          textAlign: 'center',
          // borderRadius: 10,
          // borderColor:'#ff0000',
          // borderWidth: 2,
        }

      },
      {
        id: 3,
        latitude: 38.042,
        longitude: 114.511,
        title:"①",
        iconPath: '',
      },

    ],
    polyline: [{
      points: [],
      color: "#FF0000DD",
      width: 8,
      arrowLine: true,
      // arrowIconPath: '/image/down.png',
      borderColor: '#fff',
      borderWidth: 2
    }],
    pointsInfo: [],
    points: [{ latitude: 38.04, longitude: 114.51 },
    { latitude: 38.041, longitude: 114.511 },
    { latitude: 38.042, longitude: 114.511 },
    { latitude: 38.043, longitude: 114.511 },
    { latitude: 38.044, longitude: 114.511 },
    { latitude: 38.045, longitude: 114.511 },
    { latitude: 38.046, longitude: 114.511 },
    { latitude: 38.045, longitude: 114.512 },
    { latitude: 38.044, longitude: 114.512 },
    { latitude: 38.043, longitude: 114.512 },
    { latitude: 38.042, longitude: 114.512 },
    { latitude: 38.041, longitude: 114.512 },
    { latitude: 38.04, longitude: 114.51 }],
    matches:
      [{ name: '男子全马' }, { name: '男子半马' }, { name: '男子迷你' }, { name: '女子全马' }, { name: '女子半马' }, { name: '女子迷你' }],
    
  },
  regionchange(e) {
    var _this=this;
    this.data.mapCtx.getScale({success:function(res){
      _this.data.scale=res.scale;
    }
    })
  
  },
  markertap(e) {
     console.log(e.markerId)
  },
  controltap(e) {
     console.log(e.controlId)
  },
  beginTrack: function (e) {
   
  },
 
  
  onLoad: function (options) {
    var that = this;
    this.data.mapCtx = wx.createMapContext('map');

   
 
  },
  onShow:function(){

    this.data.mapCtx.moveToLocation();

    var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: latitude,//纬度 
          longitude: longitude,//经度 

        })
      }
    })
     this.beginTrack();
  },
  /**
   * 开始
   */
  beginTrack: function () {
    var that = this;
    
    var i = that.data.playIndex == 0 ? 0 : that.data.playIndex;
    that.timer = setInterval(function () {
 
      that.data.polyline[0].points.push(that.data.points[i]);
      that.setData({
       
        polyline : that.data.polyline
     
      })
  
      if ((i + 1) >= that.data.points.length) {
        that.endTrack();
      }
      i++;
    }, 500)
  },
  /**
   * 暂停
   */
  pauseTrack: function () {
    var that = this;
    clearInterval(this.timer)
  },
  satellite:function(){
    var that = this;
    that.setData({

      satellite: !that.data.satellite

    })

  },
  /**
   * 结束
   */
  endTrack: function () {
    var that = this;
    // that.setData({
    //   playIndex: 0,
    //   latitude: that.data.polyline[0].points[0].latitude,
    //   longitude: that.data.polyline[0].points[0].longitude,
    //   markers: [{
    //     iconPath: '/image/up.png',
    //     id: 0,
    //     latitude: that.data.polyline[0].points[0].latitude,
    //     longitude: that.data.polyline[0].points[0].longitude,
    //     width: 30,
    //     height: 30,
    //     title: "头1",
    //     callout: {
    //       content:  "内容2",
    //       color: "#000000",
    //       fontSize: 13,
    //       borderRadius: 2,
    //       bgColor: "#fff",
    //       display: "ALWAYS",
    //       boxShadow: "5px 5pxW 10px #aaa"
    //     }
    //   }]
    // })
    clearInterval(this.timer)
  },
  switchSatellite:function(){
    var showSatellite = this.data.satellite;
    this.setData({
      satellite:!showSatellite
    })
  },
  enlargeMap:function(){
    if (this.data.scale==20){
      return ;
    }
      this.setData({
        scale:++this.data.scale
      })

  },
  reduceMap:function(){
    if (this.data.scale==3){
      return ;
    }
    this.setData({
      scale: --this.data.scale
    })
    console.log(this.data.scale)
  },
  locate2Me:function(){
    var _this=this;
      wx.getLocation({
        type: 'gcj02',
        success: function(res) {
          _this.data.mapCtx.moveToLocation(res);
          _this.setData({
            scale:16
          })
        },
      })
  }
})