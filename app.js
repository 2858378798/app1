//app.js
App({
  onLaunch: function () {
    console.log('App Launch')
      //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.getSetting({
        success: res => {
          if (!res.authSetting['scope.userInfo'] || that.globalData.userInfo==null) {
            console.log('未授权')
            //调用登录接口
            wx.login({
              success: function (re) {
                if (re.code) {
                  wx.getUserInfo({
                    success: function (res) {
                      wx.setStorageSync('hasGetUserInfo', '1');
                      that.globalData.userInfo = res.userInfo;
                      typeof cb == "function" && cb(that.globalData.userInfo);
                      wx.request({
                        url: 'https://wechat.se-audiotechnik.pro/public/api/wxapp/public/login',
                        data: {
                          code: re.code,
                          encrypted_data: res.encryptedData,
                          iv: res.iv,
                          raw_data: res.rawData,
                          signature: res.signature,
                        },
                        success: function (data){
                          if (data.code == 1) {
                            this.globalData.user_company = data.data.user.user_company;
                            this.globalData.user_name = data.data.user.user_name;
                            this.globalData.user_phone = data.data.user.mobile;
                            
                            try {
                              wx.setStorageSync('login', '1');
                              wx.setStorageSync('token', data.data.token);
                              wx.setStorageSync('openId', data.data.openid);
                              wx.setStorageSync('user', data.data.user);
                            } catch (e) {
                            }
                            if (this.globalData.user_company == undefined || this.globalData.user_name == undefined || this.globalData.user_phone == undefined || this.globalData.user_company == '' || this.globalData.user_name == '' || this.globalData.user_phone == '') {

                              this.one_step = false;
                              this.two_step = true;
                              wx.navigateTo({
                                url: '/pages/login/login'
                              });
                            } else {
                              // setTimeout(function () {
                              //   wx.switchTab({
                              //     url: '/pages/index/index',
                              //     success: res => {
                                    
                              //     }
                              //   });
                              // }, 1000);
                            }
                          }
                        }
                      })
                    }
                  })
                } else {
                  wx.navigateTo({
                    url: '/pages/login/login'
                  });
                }

              }
            })
          }
        }
      });
      
    }
    
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    userInfo: null,
    requestType:1,
    requestId:0,
    requestTitle: '',
    requestTableName: '',
    likeRet: null,
    favoriteRet: null,
    user_phone: '',
    user_company: '',
    user_name:'',
    one_step: true,
    two_step:false

  },
  doView: function(){
    var that = this;
    var id = this.globalData.requestId;
    var title = this.globalData.requestTitle;
    var table_name = this.globalData.requestTableName;
    console.log(id);
    console.log(title);
    console.log(table_name);
    var url = 'https://wechat.se-audiotechnik.pro/public/api/portal/user/doView?id=' + id + '&title=' + title + '&tablename=' + table_name;
    console.log(url);
    wx.request({
      url: url,
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res);
      }
    })
  },
  collectLike: function(id){
    var that = this;
    wx.request({
      url: 'https://wechat.se-audiotechnik.pro/public/api/portal/products/doLike?id=' + id,
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data);
        that.globalData.likeRet = res.data;
      }
    })
  },
  cancelLike: function (id) {
    var that = this;
    wx.request({
      url: 'https://wechat.se-audiotechnik.pro/public/api/portal/products/cancelLike?id=' + id,
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data);
        that.globalData.likeRet = res.data;
      }
    })
  },

  collectFavorite: function (id) {
    var that = this;
    wx.request({
      url: 'https://wechat.se-audiotechnik.pro/public/api/portal/products/doFavorite?id=' + id,
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res);
        that.globalData.favoriteRet = res.data;
      }
    })
  },

  cancelFavorite: function (id) {
    var that = this;
    wx.request({
      url: 'https://wechat.se-audiotechnik.pro/public/api/portal/products/cancelFavorite?id=' + id,
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res);
        that.globalData.favoriteRet = res.data;
      }
    })
  }
})