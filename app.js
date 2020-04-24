//app.js
App({
  onLaunch: function () {
    console.log('App Launch')
    
  },
  getUserInfo: function (cb) {
    var that = this;
    var openId = (wx.getStorageSync('openId'));
    if (openId && this.globalData.userInfo != null) {
      typeof cb == "function" && cb(this.globalData.userInfo);
    } else{
      console.log('微信登陆');
      wx.getSetting({
        success: res => {
          console.log(res.authSetting['scope.userInfo']);
          if (!res.authSetting['scope.userInfo'] || !openId) {
            var is_code = 1;
            !res.authSetting['scope.userInfo'] && console.log('未授权');
            if (!openId){
              is_code = 0
              console.log('openid为空');
            }
            //调用登录接口
            wx.login({
              success: function (re) {
                console.log(re);
                if (re.code) {
                  // wx.getUserInfo({
                    // success: function (res) {
                      // console.log(res);
                      // wx.setStorageSync('hasGetUserInfo', '1');
                      // that.globalData.userInfo = res.userInfo;
                      // console.log(that.globalData.userInfo);
                      
                      wx.request({
                        url: that.globalData.host+'/public/api/wxapp/public/login',
                        data: {
                          code: re.code,
                          is_code:1
                          // encrypted_data: res.encryptedData,
                          // iv: res.iv,
                          // raw_data: res.rawData,
                          // signature: res.signature,
                        },
                        success: function (data){
                          console.log('通过code获取用户微信信息');
                          console.log(data);
                          //console.log(data.data.data);
                          if (data.data.code == 1) {
                            that.globalData.user_company = data.data.data.user.user_company;
                            that.globalData.user_name = data.data.data.user.user_name;
                            that.globalData.user_phone = data.data.data.user.mobile;
                            console.log(data.data.token);
                            try {
                              wx.setStorageSync('login', '1');
                              wx.setStorageSync('token', data.data.data.token);
                              wx.setStorageSync('openId', data.data.data.openid);
                              wx.setStorageSync('user', data.data.data.user);
                            } catch (e) {
                            }
                            if (data.data.data.user.id == ''){
                              that.one_step = true;
                              that.two_step = false;
                              wx.navigateTo({
                                url: '/pages/login/login'
                              });
                            }else{
                              let userinfo = new Object();
                              userinfo.avatarUrl = data.data.data.user.avatar;
                              userinfo.nickName = data.data.data.user.user_nickname;
                              userinfo.gender = data.data.data.user.sex;
                              that.globalData.userInfo = userinfo;
                              
                              typeof cb == "function" && cb(that.globalData.userInfo);
                            }
                            if (that.globalData.user_company == undefined || that.globalData.user_name == undefined || that.globalData.user_phone == undefined || that.globalData.user_company == '' || that.globalData.user_name == '' || that.globalData.user_phone == '') {

                              that.one_step = false;
                              that.two_step = true;
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
                    // }
                  // })
                } else {
                  wx.navigateTo({
                    url: '/pages/login/login'
                  });
                }

              }
            })
          } else if (openId){
            console.log('通过openid获取信息：'+openId);
            wx.request({
              url: that.globalData.host + '/public/api/wxapp/public/getinfo',
              data: {
                openid: openId
              },
              success: function (data) {
                console.log('通过openid获取信息结果');
                console.log(data);
                if(data.data.code == 1){
                  let userinfo = new Object();
                  userinfo.avatarUrl = data.data.data.avatar;
                  userinfo.nickName = data.data.data.user_nickname;
                  userinfo.gender = data.data.data.sex;
                  that.globalData.user_company = data.data.data.user_company;
                  that.globalData.user_name = data.data.data.user_name;
                  that.globalData.user_phone = data.data.data.mobile;
                  that.globalData.userInfo = userinfo;
                  console.log(userinfo);
                  typeof cb == "function" && cb(that.globalData.userInfo);
                }else{
                  wx.navigateTo({
                    url: '/pages/login/login'
                  });
                }
              }
            })
          }
          else if (that.globalData.userInfo == null){
            console.log('未获取到用户信息！进入登陆页');
            that.one_step = true;
            that.two_step = false;
            wx.navigateTo({
              url: '/pages/login/login'
            });
          }
          console.log('微信信息获取结束');
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
    two_step:false,
    host: 'https://t.ungerms.cn' //'https://wechat.se-audiotechnik.pro' //
  },
  doView: function(){
    var that = this;
    var id = this.globalData.requestId;
    var title = this.globalData.requestTitle;
    var table_name = this.globalData.requestTableName;
    console.log(id);
    console.log(title);
    console.log(table_name);
    var url = this.globalData.host+'/public/api/portal/user/doView?id=' + id + '&title=' + title + '&tablename=' + table_name;
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
      url: this.globalData.host +'/public/api/portal/products/doLike?id=' + id,
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
      url: this.globalData.host +'/public/api/portal/products/cancelLike?id=' + id,
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
      url: this.globalData.host +'/public/api/portal/products/doFavorite?id=' + id,
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
      url: this.globalData.host +'/public/api/portal/products/cancelFavorite?id=' + id,
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