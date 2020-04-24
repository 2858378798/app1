var app = getApp()
Page({
  data: {
    userInfo: {},
    rightimg:'/images/jian_r.png',
    userListInfo: [ {
      icon: '/images/e12860cb450a4c012c47ac95c933fb3a.png',
      text: '我的收藏',
      link:'../feature/feature?id=1',
      id:1
  
    }, {
        icon: '/images/index_normal.png',
        text: '我的点赞',
        link:'../feature/feature?id=2',
        id:2
  
      }, {
        icon: '/images/22-0.png',
        text: '完善信息',
        link: '../login/login',

      }, {
        icon: '/images/21.png',
        text: '联系我们',
        link: '../view/view',

      }]
  },
  onLoad: function () {  
      //onload 进入页面加载
    var that=this
    wx.getSystemInfo({
      success: function(res) {
          that.setData({width:res.windowWidth,height:res.windowHeight})
      }
    })
    app.getUserInfo(function(userInfo){
        //更新数据
          that.setData({
            userInfo:userInfo
          })
    })
    
  }, 
  getInfoimage:function(){

  },
  setIcon:function(){
      var that = this
      wx.chooseImage({
        count: 9, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function(res){
          // success
          var tempFilePaths = res.tempFilePaths
          that.setData({image:tempFilePaths})
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
  },
  userinfo_itemType: function (e) {
    var index = e.target.dataset.index;
    var app = getApp();
    app.requestType = e.currentTarget.id;
    app.requestTypeIndex = index;
    console.log(app.requestType);
  },
  toRegister(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  onShow: function(){
    app.globalData.requestTitle = '个人中心';
    app.globalData.requestTableName = '';
    app.doView();
  }
})