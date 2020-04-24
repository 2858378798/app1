
// 引入coolsite360交互配置设定
//require('coolsite.config.js');
var WxParse = require('../../wxParse/wxParse.js');
// 获取全局应用程序实例对象
const app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "SE Audiotechnik",
  /**
   * 页面的初始数据
   */

  data: {
    id:0,
    title: "暂无",
    model:'',
    pro_number: '',
    usage_mode: '',
    article:'',
    cover_img:'',
    is_like:0,
    is_favorite: 0,
    like_icon:'../../images/like.png',
    favorite_icon: '../../images/shouc.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (this.article == '') {
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
    }
    var id = getApp().requestId;
    console.log(id);
    var that = this;
    var token = (wx.getStorageSync('token'));
    var openId = (wx.getStorageSync('openId'));
    wx.request({
      url: app.globalData.host + '/public/api/portal/products/read?id=' + id + '&openid=' + openId,
      header: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        'XX-Token': token,
        'XX-Device-Type': 'wxapp',
      },
      success: function (res) {
        console.log(res);
        if(res.data.data == ''){
          wx.showModal({
            title: res.data.msg,
            showCancel: false,
            content: '',
          });
          wx.navigateBack({ changed: true });
        }
        var like_icon = '';
        var favorite_icon = '';
        if (res.data.data.is_like == 1){
          like_icon = '../../images/like-fill.png';
        }else{
          like_icon = '../../images/like.png';
        }
        if (res.data.data.is_favorite == 1) {
          favorite_icon = '../../images/shouc-fill.png';
        } else {
          favorite_icon = '../../images/shouc.png';
        }
        if (res.data.data.more.thumbnail == undefined || res.data.data.more.thumbnail == null){
          res.data.data.more.thumbnail = '';
        }
        that.setData({
          'title': res.data.data.post_title,
          'article': res.data.data.post_content,
          'cover_img': res.data.data.more.thumbnail,
          'is_like': res.data.data.is_like,
          'is_favorite': res.data.data.is_favorite,
          'like_icon': like_icon,
          'favorite_icon': favorite_icon,
          'id': id,
          'model': res.data.data.post_model,
          'pro_number': res.data.data.pro_number,
          'usage_mode': res.data.data.usage_mode,
        })
        WxParse.wxParse('article', 'html', that.data.article, that, 5);
        app.globalData.requestTitle = that.data.title;
        app.globalData.requestTableName = 'portal_post';
        app.doView();
      }
    })
    this.doView();
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    //this.getProductDetail();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    
  },

  getProductDetail: function(e){
    var id = getApp().requestId;
    var that = this;
    var token = (wx.getStorageSync('token'));
    var openId = (wx.getStorageSync('openId'));
    wx.request({
      url: app.globalData.host + '/public/api/portal/products/read?id=' + id + '&openid=' + openId, //仅为示例，并非真实的接口地址
      header: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        'XX-Token': token,
        'XX-Device-Type': 'wxapp',
      },
      success: function (res) {
        console.log(res);
        var like_icon = '';
        if (res.data.data.is_like == 1) {
          like_icon = '../../images/like-fill.png';
        } else {
          like_icon = '../../images/like.png';
        }
        if (res.data.data.is_favorite == 1) {
          favorite_icon = '../../images/shouc-fill.png';
        } else {
          favorite_icon = '../../images/shouc.png';
        }
        that.setData({
          'title': res.data.data.post_title,
          'article': res.data.data.post_content,
          'cover_img': res.data.data.more.thumbnail,
          'is_like': res.data.data.is_like,
          'is_favorite': res.data.data.is_favorite,
          'like_icon': like_icon,
          'favorite_icon': favorite_icon,
          'id': id,
          'model': res.data.data.post_model,
          'pro_number': res.data.data.pro_number,
          'usage_mode': res.data.data.usage_mode,
        })

        WxParse.wxParse('article', 'html', that.data.article, that, 5);
      }
    })
  },

  //以下为自定义点击事件
  
  clickLike: function (e) {
    var id_type = e.target.dataset.type;
    var id = e.currentTarget.id;
    var token = (wx.getStorageSync('token'));
    var openId = (wx.getStorageSync('openId'));
    if (parseInt(id_type) == 0) {
      var that = this;
      wx.request({
        url: app.globalData.host + '/public/api/portal/products/doLike?id=' + id + '&openid=' + openId,
        header: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/x-www-form-urlencoded',
          'XX-Token': token,
          'XX-Device-Type': 'wxapp',
        },
        success: function (res) {
          console.log(res.data);
          if (res.data.code == 1) {
            that.setData({
              'is_like': 1,
              'like_icon': '../../images/like-fill.png',
            });
          }
        }
      })
    } else {
      var that = this;
      wx.request({
        url: app.globalData.host + '/public/api/portal/products/cancelLike?id=' + id + '&openid=' + openId,
        header: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/x-www-form-urlencoded',
          'XX-Token': token,
          'XX-Device-Type': 'wxapp',
        },
        success: function (res) {
          console.log(res.data);
          if (res.data.code == 1) {
            that.setData({
              'is_like': 0,
              'like_icon': '../../images/like.png',
            });
          }
        }
      })
    }
  },
  clickFavorite: function (e) {
    var id_type = e.target.dataset.type;
    var id = e.currentTarget.id;
    var token = (wx.getStorageSync('token'));
    var openId = (wx.getStorageSync('openId'));
    console.log(token);
    if (parseInt(id_type) == 1) {
      var that = this;
      wx.request({
        url: app.globalData.host + '/public/api/portal/products/cancelFavorite?id=' + id + '&openid=' + openId,
        header: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/x-www-form-urlencoded',
          'XX-Token': token,
          'XX-Device-Type': 'wxapp',
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 1) {
            that.setData({
              'is_favorite': 0,
              'favorite_icon': '../../images/shouc.png',
            });
          }
        }
      })
    } else {
      var that = this;
      wx.request({
        url: app.globalData.host + '/public/api/portal/products/doFavorite?id=' + id + '&openid=' + openId,
        header: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/x-www-form-urlencoded',
          'XX-Token': token,
          'XX-Device-Type': 'wxapp',
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 1) {
            that.setData({
              'is_favorite': 1,
              'favorite_icon': '../../images/shouc-fill.png',
            });
          }
        }
      })
    }
  },
  doView:function(){
    var token = (wx.getStorageSync('token'));
    var openId = (wx.getStorageSync('openId'));
    var id = getApp().requestId;
    var that = this;
    wx.request({
      url: app.globalData.host + '/public/api/portal/products/doView?id=' + id + '&openid=' + openId,
      header: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        'XX-Token': token,
        'XX-Device-Type': 'wxapp',
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {

        }
      }
    })
  }
})
  

