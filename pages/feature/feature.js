
// 引入coolsite360交互配置设定
//require('coolsite.config.js');
var $ = require('../../js/util.js');
// 获取全局应用程序实例对象
const app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "收藏",
  /**
   * 页面的初始数据
   */

  data: {
    goods: null,
    likeActive: false,
    favoriteActive: true,
    hasInfo: 'block',
    noInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    if (this.goods == null) {
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
    }
    this.getList();
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
    this.getList();
    app.globalData.requestTitle = '收藏点赞';
    app.globalData.requestTableName = '';
    app.doView();
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

  getList: function () {
    var that = this;
    var typeId = getApp().requestType;
    if(typeId == 'undefinde' || typeId == undefined || typeId == ''){
      typeId = 1;
    }
    if (typeId == 1){
      that.setData({
        'likeActive': false,
        'favoriteActive': true
      })
    }else if(typeId == 2){
      that.setData({
        'likeActive': true,
        'favoriteActive': false
      })
    }
    var token = (wx.getStorageSync('token'));
    var openId = (wx.getStorageSync('openId'));
    console.log(token);
    console.log(app.globalData.host + '/public/api/portal/products/my?type=' + typeId + '&openid=' + openId);
    wx.request({
      url: app.globalData.host + '/public/api/portal/products/my?type=' + typeId + '&openid=' + openId,
      header: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        'XX-Token': token,
        'XX-Device-Type': 'wxapp',
      },
      success: function (res) {
        console.log(res);
        if(res){
          var goods = [];
          if (res.data.code != 1) {
            // wx.showModal({
            //   title: res.data.msg,
            //   showCancel: false,
            //   content: '',
            // });
            that.setData({
              'noInfo': true,
              'hasInfo': 'none'
            });
            console.log(that.data.noInfo);
          }
          $.each(res.data.data, function (i, d) {
            //console.log(d);
            var data = {
              id: [],
              title: [],
              img: [],
              likenum: [],
              favoritenum: [],
              is_like: [],
              is_favorite: [],
              like_type: [],
              favorite_type: [],
              is_like_icon: [],
              is_favorite_icon: [],
              model: [],
              bass_model: [],
              pro_number: [],
              usage_mode: [],
            };
            var is_like_icon = '';
            var is_favorite_icon = '';
            if (res.data.data[i].is_like == 1) {
              is_like_icon = '../../images/like-fill.png';
            } else {
              is_like_icon = '../../images/like.png';
            }
            if (res.data.data[i].is_favorite == 1) {
              is_favorite_icon = '../../images/shouc-fill.png';
            } else {
              is_favorite_icon = '../../images/shouc.png';
            }
            data.title.push(res.data.data[i].post_title);
            data.id.push(res.data.data[i].id);
            if (res.data.data[i].thumbnail.indexOf("https://") == -1) {
              res.data.data[i].thumbnail = "https://t.ungerms.cn/public/upload/" + res.data.data[i].thumbnail;
            }
            data.img.push(res.data.data[i].thumbnail);
            data.likenum.push(res.data.data[i].post_like);
            data.favoritenum.push(res.data.data[i].post_favorites);
            data.is_like.push(res.data.data[i].is_like);
            data.is_favorite.push(res.data.data[i].is_favorite);
            data.like_type.push(res.data.data[i].is_like);
            data.favorite_type.push(res.data.data[i].is_favorite);
            data.model.push(res.data.data[i].post_model);
            data.pro_number.push(res.data.data[i].pro_number);
            data.usage_mode.push(res.data.data[i].usage_mode);

            data.is_like_icon.push(is_like_icon);
            data.is_favorite_icon.push(is_favorite_icon);
            goods.push(data);
          })
          that.setData({
            'goods': goods
          })
          if(goods.length != 0){
            that.setData({
              'noInfo': false,
              'hasInfo': 'block'
            })
          }else{
            that.setData({
              'noInfo': true,
              'hasInfo': 'none'
            })
          }
          console.log(goods);
          console.log(that.data.noInfo);
          console.log(that.data.goods);
        }else{
          that.setData({
            'noInfo': true,
            'hasInfo': 'none'
          })
        }
      }
    })
  },
  doFavorite:function(e){
    var that = this;
    that.setData({
      'likeActive': false,
      'favoriteActive': true
    });
    var token = wx.getStorageSync('token');
    var openId = (wx.getStorageSync('openId'));
    wx.request({
      url: app.globalData.host + '/public/api/portal/products/my?type=1' + '&openid=' + openId,
      header: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        'XX-Token': token,
        'XX-Device-Type': 'wxapp',
      },
      success: function (res) {
        console.log(res)
        var goods = [];
        if (res.data.code != 1) {
          // wx.showModal({
          //   title: res.data.msg,
          //   showCancel: false,
          //   content: '',
          // });
          that.setData({
            'noInfo': true,
            'hasInfo': 'none'
          })
          console.log(that.data.noInfo);
        }
        $.each(res.data.data, function (i, d) {
          //console.log(d);
          var data = {
            id: [],
            title: [],
            img: [],
            likenum: [],
            favoritenum: [],
            is_like: [],
            is_favorite: [],
            like_type: [],
            favorite_type: [],
            is_like_icon: [],
            is_favorite_icon: [],
            model: [],
            pro_number: [],
            usage_mode: [],
          };
          var is_like_icon = '';
          var is_favorite_icon = '';
          if (res.data.data[i].is_like == 1) {
            is_like_icon = '../../images/like-fill.png';
          } else {
            is_like_icon = '../../images/like.png';
          }
          if (res.data.data[i].is_favorite == 1) {
            is_favorite_icon = '../../images/shouc-fill.png';
          } else {
            is_favorite_icon = '../../images/shouc.png';
          }
          data.title.push(res.data.data[i].post_title);
          data.id.push(res.data.data[i].id);
          if (res.data.data[i].thumbnail.indexOf("https://") == -1) {
            res.data.data[i].thumbnail = "https://t.ungerms.cn/public/upload/" + res.data.data[i].thumbnail;
          }
          data.img.push(res.data.data[i].thumbnail);
          data.likenum.push(res.data.data[i].post_like);
          data.favoritenum.push(res.data.data[i].post_favorites);
          data.is_like.push(res.data.data[i].is_like);
          data.is_favorite.push(res.data.data[i].is_favorite);
          data.like_type.push(res.data.data[i].is_like);
          data.favorite_type.push(res.data.data[i].is_favorite);
          data.model.push(res.data.data[i].post_model);
          data.pro_number.push(res.data.data[i].pro_number);
          data.usage_mode.push(res.data.data[i].usage_mode);

          data.is_like_icon.push(is_like_icon);
          data.is_favorite_icon.push(is_favorite_icon);
          goods.push(data);
        })
        that.setData({
          'goods': goods
        })
        console.log(goods);
        if (goods.length != 0){
          that.setData({
            'noInfo': false,
            'hasInfo': 'block'
          })
        }else{
          that.setData({
            'noInfo': true,
            'hasInfo': 'none'
          })
        }
        console.log(that.data.noInfo);
        console.log(that.data.goods);
      }
    })
  },
  doLike: function (e) {
    var that = this;
    that.setData({
      'likeActive': true,
      'favoriteActive': false
    });
    var token = (wx.getStorageSync('token'));
    var openId = (wx.getStorageSync('openId'));
    wx.request({
      url: app.globalData.host + '/public/api/portal/products/my?type=2' + '&openid=' + openId,
      header: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        'XX-Token': token,
        'XX-Device-Type': 'wxapp',
      },
      success: function (res) {
        console.log(res)
        var goods = [];
        if (res.data.code != 1){
          wx.showModal({
            title: res.data.msg,
            showCancel: false,
            content: '',
          });
          that.setData({
            'noInfo': true,
            'hasInfo': 'none'
          })
        }
        $.each(res.data.data, function (i, d) {
          //console.log(d);
          var data = {
            id: [],
            title: [],
            img: [],
            likenum: [],
            favoritenum: [],
            is_like: [],
            is_favorite: [],
            like_type: [],
            favorite_type: [],
            is_like_icon: [],
            is_favorite_icon: [],
            model: [],
            pro_number: [],
            usage_mode: [],
          };
          var is_like_icon = '';
          var is_favorite_icon = '';
          if (res.data.data[i].is_like == 1) {
            is_like_icon = '../../images/like-fill.png';
          } else {
            is_like_icon = '../../images/like.png';
          }
          if (res.data.data[i].is_favorite == 1) {
            is_favorite_icon = '../../images/shouc-fill.png';
          } else {
            is_favorite_icon = '../../images/shouc.png';
          }
          data.title.push(res.data.data[i].post_title);
          data.id.push(res.data.data[i].id);
          if (res.data.data[i].thumbnail.indexOf("https://") == -1) {
            res.data.data[i].thumbnail = "https://t.ungerms.cn/public/upload/" + res.data.data[i].thumbnail;
          }
          data.img.push(res.data.data[i].thumbnail);
          data.likenum.push(res.data.data[i].post_like);
          data.favoritenum.push(res.data.data[i].post_favorites);
          data.is_like.push(res.data.data[i].is_like);
          data.is_favorite.push(res.data.data[i].is_favorite);
          data.like_type.push(res.data.data[i].is_like);
          data.favorite_type.push(res.data.data[i].is_favorite);
          data.model.push(res.data.data[i].post_model);
          data.pro_number.push(res.data.data[i].pro_number);
          data.usage_mode.push(res.data.data[i].usage_mode);
          
          data.is_like_icon.push(is_like_icon);
          data.is_favorite_icon.push(is_favorite_icon);
          goods.push(data);
        })
        that.setData({
          'goods': goods
        })
        if (goods.length != 0) {
          that.setData({
            'noInfo': false,
            'hasInfo': 'block'
          })
        } else {
          that.setData({
            'noInfo': true,
            'hasInfo': 'none'
          })
        }
        console.log(that.data.goods);
      }
    })
  },
  userinfo_item: function (e) {
    var index = e.target.dataset.index;
    var app = getApp();
    app.requestId = e.currentTarget.id;
    app.requestIndex = index;
  },
  clickLike: function (e) {
    console.log(e);
    var id_type = e.target.dataset.type;
    var id = e.currentTarget.id;
    var ret = [];
    var error = 0;
    var token = (wx.getStorageSync('token'));
    var openId = (wx.getStorageSync('openId'));
    if (parseInt(id_type) == 0) {
      id_type = 1;
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
            for (var i = 0; i < that.data.goods.length; i++) {
              if (that.data.goods[i].id == id) {
                let islike = "goods[" + i + "].is_like";
                let islike_icon = "goods[" + i + "].is_like_icon";
                let liketype = "goods[" + i + "].like_type";
                let like_num = "goods[" + i + "].likenum";
                that.setData({
                  [islike]: 1,
                  [islike_icon]: '../../images/like-fill.png',
                  [liketype]: 1,
                  [like_num]: parseInt(that.data.goods[i].likenum) + 1
                });
                break;
              }
            }
            console.log(that.data.goods);
          }
        }
      })

    } else {
      id_type = 0;
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
            for (var i = 0; i < that.data.goods.length; i++) {
              if (that.data.goods[i].id == id) {
                let islike = "goods[" + i + "].is_like";
                let islike_icon = "goods[" + i + "].is_like_icon";
                let liketype = "goods[" + i + "].like_type";
                let like_num = "goods[" + i + "].likenum";
                that.setData({
                  [islike]: 0,
                  [islike_icon]: '../../images/like.png',
                  [liketype]: 0,
                  [like_num]: parseInt(that.data.goods[i].likenum) - 1
                });
                break;
              }
            }
            console.log(that.data.goods);
          }
        }
      })

    }

    console.log(this.data.goods);
  },
  clickFavorite: function (e) {
    console.log(e);
    var id_type = e.target.dataset.type;
    var id = e.currentTarget.id;
    var token = (wx.getStorageSync('token'));
    var openId = (wx.getStorageSync('openId'));
    console.log(token);
    if (parseInt(id_type) == 1) {
      id_type = 0;
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
            for (var i = 0; i < that.data.goods.length; i++) {
              if (that.data.goods[i].id == id) {
                that.setData({
                  ['goods[' + i + '].is_favorite']: id_type,
                  ['goods[' + i + '].is_favorite_icon']: '../../images/shouc.png',
                  ['goods[' + i + '].favorite_type']: id_type,
                  ['goods[' + i + '].favoritenum']: parseInt(that.data.goods[i].favoritenum) - 1
                });
                break;
              }
            }
          }
        }
      })
    } else {
      var that = this;
      id_type = 1;
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
            for (var i = 0; i < that.data.goods.length; i++) {
              if (that.data.goods[i].id == id) {
                that.setData({
                  ['goods[' + i + '].is_favorite']: id_type,
                  ['goods[' + i + '].is_favorite_icon']: '../../images/shouc-fill.png',
                  ['goods[' + i + '].favorite_type']: id_type,
                  ['goods[' + i + '].favoritenum']: parseInt(that.data.goods[i].favoritenum) + 1
                });
                break;
              }
            }
          }
        }
      })

    }

    console.log(this.data.goods);
  }
})

