//index.js
//var cityData = require('../../js/city.js');
var $ = require('../../js/util.js');
//获取应用实例

var app = getApp()
Page( {
  data: {
    //向模板传入数据
    // 轮播
    index_index_scroll_tmpl: {
      images: [],
      indicatorDots: true,
      vertical: false,
      autoplay: true,
      interval: 3000,
      duration: 1200,
    },
    room: "分类",
    area: "面积",
    place: "场所",
    cate: "类别",
    rooms:[],
    rooms_index:0,
    areas:[],
    areas_index:0,
    places: [],
    places_index:0,
    cates: [],
    cates_index:0,
    goods:null,
    list:[],
  },
  onLaunch: function () {
  },
  onLoad: function() {
    if(this.goods == null){
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
    }
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo( function( userInfo ) {
      //更新数据
      that.setData( {
        userInfo: userInfo
      })
    });
    wx.request({
      url: 'https://wechat.se-audiotechnik.pro/public/api/home/slides/read?id=1',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        that.setData({
          'index_index_scroll_tmpl.images': res.data.data
        })
      }
    })
    this.getList();
    
  },
  onReady: function () {
    //初始化数据
    this.getRoom();
  },
  onShow: function (){
    this.getList();
    app.globalData.requestTitle = '首页';
    app.globalData.requestTableName = '';
    app.doView();
  },
  /* === 分类外选择器 start === */
  getRoom: function () {//获取是内外数据
    var that = this;
    wx.request({
      url: 'https://wechat.se-audiotechnik.pro/public/api/portal/categories?parent_id=1', //仅为示例，并非真实的接口地址
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        var data = {
          id: [],
          txt: []
        }
        $.each(res.data.data, function (i, d) {
          data.txt.push(res.data.data[i].name);
          data.id.push(res.data.data[i].id);
          
        })
        that.setData({
          'rooms': data
        })
        //console.log(that.data.rooms);
      }
    })
  },
  judgeRoom: function(){
    if (this.rooms_index == ''){
      wx.showModal({
        title: '请先选择分类',
      })
    }
  },
  rChange: function (e) {//分类选择
    var id = this.data.rooms.id[e.detail.value];
    var name = this.data.rooms.txt[e.detail.value];
    this.setData({
      'rooms_index': id,
      'room': '分类：' + name
    });
    this.getArea();
    this.getPlace();
    this.getCate();
    //console.log(this.data.rooms_index);
  },
  /* === 面积选择器 start === */
  getArea: function () {//获取面积数据
    var that = this
    var id = this.data.rooms_index;
    wx.request({
      url: 'https://wechat.se-audiotechnik.pro/public/api/portal/categories?pid=1&parent_id='+id, //仅为示例，并非真实的接口地址
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        var data = {
          id: [],
          txt: []
        }
        $.each(res.data.data, function (i, d) {
          data.txt.push(res.data.data[i].name);
          data.id.push(res.data.data[i].id);

        })
        that.setData({
          'areas': data
        })
        //console.log(that.data.areas);
      }
    })
  },
  cChange: function (e) {// 面积选择
    
    var id = this.data.areas.id[e.detail.value];
    var name = this.data.areas.txt[e.detail.value];
    this.setData({
      'areas_index': id,
      'area': '面积：' + name
    });
    //console.log(this.data.persons_index);
  },

  /* === 场所选择器 start === */
  getPlace: function () {//获取是场所数据
    var that = this
    var id = this.data.rooms_index;
    
    wx.request({
      url: 'https://wechat.se-audiotechnik.pro/public/api/portal/categories?pid=2&parent_id=' + id, 
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        var data = {
          id: [],
          txt: []
        }
        $.each(res.data.data, function (i, d) {
          data.txt.push(res.data.data[i].name);
          data.id.push(res.data.data[i].id);

        })
        that.setData({
          'places': data
        })
        //console.log(that.data.places);
      }
    })
  },
  pChange: function (e) {// 场所选择
    var id = this.data.places.id[e.detail.value];
    var name = this.data.places.txt[e.detail.value];
    this.setData({
      'places_index': id,
      'place': '场所：' + name
    });
    //console.log(this.data.places_index);
  },

  /* === 类别选择器 start === */
  getCate: function () {//获取是类别数据
    var that = this;
    var id = this.data.rooms_index;
    wx.request({
      url: 'https://wechat.se-audiotechnik.pro/public/api/portal/categories?pid=3&parent_id=' + id, 
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        var data = {
          id: [],
          txt: []
        }
        $.each(res.data.data, function (i, d) {
          data.txt.push(res.data.data[i].name);
          data.id.push(res.data.data[i].id);

        })
        that.setData({
          'cates': data
        })
        //console.log(that.data.cates);
      }
    })
  },
  caChange: function (e) {// 类别选择
    var id = this.data.cates.id[e.detail.value];
    var name = this.data.cates.txt[e.detail.value];
    this.setData({
      'cates_index': id,
      'cate': '类别：' + name
    });
    //console.log(this.data.cates_index);
  },
  /* === 选择器 end === */
  getList: function(){
    var that = this;
    var token = (wx.getStorageSync('token'));
    wx.request({
      url: 'https://wechat.se-audiotechnik.pro/public/api/portal/products/index', 
      header: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        'XX-Token': token,
        'XX-Device-Type': 'wxapp',
      },
      success: function (res) {
        console.log(res)
        var goods = [];
        $.each(res.data.data, function (i, d) {
          //console.log(d);
          var data = {
            id: [],
            title: [],
            img: [],
            likenum: [],
            favoritenum: [],
            is_like: [],
            is_favorite : [],
            is_like_icon: [],
            is_favorite_icon: [],
            like_type: [],
            favorite_type:[],
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
        console.log(that.data.goods);
      }
    })
  },
  searchSubmit: function () {
    var places_index = this.data.places_index;
    var areas_index = this.data.areas_index;
    var rooms_index = this.data.rooms_index;
    var cates_index = this.data.cates_index;
    var token = (wx.getStorageSync('token'));
    var that = this
    var url = 'https://wechat.se-audiotechnik.pro/public/api/portal/products/search?place=' + places_index + '&area=' + areas_index + '&room=' + rooms_index + '&cate=' + cates_index;
    wx.request({
      url: url,
      header: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        'XX-Token': token,
        'XX-Device-Type': 'wxapp',
      },
      success: function (res) {
        console.log(res)
        var goods = [];
        if(res.data.code>0){
          $.each(res.data.data, function (i, d) {
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
            }
            var is_like_icon = '';
            var is_favorite_icon = '';
            if (res.data.data[i].is_like == 1){
              is_like_icon = '../../images/like-fill.png';
            }else{
              is_like_icon = '../../images/like.png';
            }
            if (res.data.data[i].is_favorite == 1){
              is_favorite_icon = '../../images/shouc-fill.png';
            }else{
              is_favorite_icon = '../../images/shouc.png';
            }
            data.title.push(res.data.data[i].post_title);
            data.id.push(res.data.data[i].id);
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
          console.log(that.data.goods);
        }else{
          wx.showModal({
            //title:res.data.msg,
            content: res.data.msg,
            showCancel: false,
            //icon: 'success',
            //duration: 1500,
            //mask: false
          })
        }
      }
    })
  },
  userinfo_item: function (e) {
    var index = e.target.dataset.index;
    var app = getApp();
    app.requestId = e.currentTarget.id;
    app.requestIndex = index;
  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: '18888888888',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '斯贝克',
      desc: '',
      path: 'pages/index/index'
    }
  },
  clickLike: function(e){
    console.log(e);
    var id_type = e.target.dataset.type;
    var id = e.currentTarget.id;
    var ret = [];
    var error = 0;
    var token = (wx.getStorageSync('token'));
    if(parseInt(id_type) == 0){
      id_type = 1;
      var that = this;
      wx.request({
        url: 'https://wechat.se-audiotechnik.pro/public/api/portal/products/doLike?id=' + id,
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
      
    }else{
      id_type = 0;
      var that = this;
      wx.request({
        url: 'https://wechat.se-audiotechnik.pro/public/api/portal/products/cancelLike?id=' + id,
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
  clickFavorite: function(e){
    console.log(e);
    var id_type = e.target.dataset.type;
    var id = e.currentTarget.id;
    var token = (wx.getStorageSync('token'));
    if (parseInt(id_type) == 1) {
      id_type = 0;
      var that = this;
      wx.request({
        url: 'https://wechat.se-audiotechnik.pro/public/api/portal/products/cancelFavorite?id=' + id,
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
        url: 'https://wechat.se-audiotechnik.pro/public/api/portal/products/doFavorite?id=' + id,
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