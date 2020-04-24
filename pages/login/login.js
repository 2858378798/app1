var api = require('../../utils/api.js')
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sectionTwo: true,
    sectionThree: false,
    sectionFour: false,
    triLeft: 0.23,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    profile: '员工',
    title:'用户登陆',
    one_step: true,
    two_step : false,
    phone: '',
    password: '',
    company: '',
    username: '',
    id: '',
    nickname: '',
    head_img: '',
    loginPhone: '',
    loginPassword: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var openId = (wx.getStorageSync('openId'));
    var that = this;
    if (!openId || app.globalData.userInfo == null) {
      that.setData({
        title: '用户登陆',
        one_step: true,
        two_step: false,
      })
    }else{

      that.setData({
        title: '信息完善',
        one_step: false,
        two_step: true,
      })
    }
    if (app.globalData.userInfo != null && openId){
      console.log('通过php获取用户信息');
      console.log(app.globalData.host + '/public/api/wxapp/public/getinfo?openid=' + openId);
      wx.request({
        url: app.globalData.host+'/public/api/wxapp/public/getinfo?openid=' + openId,
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          console.log('通过php获取用户信息结果');
          console.log(res);
          if (res.data.code == 1) {
            app.user_phone = res.data.data.mobile;
            app.user_company = res.data.data.user_company;
            app.user_name = res.data.data.user_name;
            that.setData({
              phone: res.data.data.mobile,
              company: res.data.data.user_company,
              username: res.data.data.user_name
            })
          } 
        }
      })
    };
    app.globalData.requestTitle = '登陆';
    app.globalData.requestTableName = '';
    app.doView();
  },
  handleGetUserInfo(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    var openId = (wx.getStorageSync('openId'));
    var that = this;
    console.log(app.globalData.userInfo);
    console.log(openId);
    if (app.globalData.userInfo != null && openId){
      wx.request({
        url: app.globalData.host+'/public/api/wxapp/public/profile', 
        data: {
          openid: openId,
          phone: app.user_phone,
          company: app.user_company,
          user_name: app.user_name
        },
        method: 'POST',
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 1) {
            wx.showToast({
              title: '更新成功',
              icon: 'success',
              duration: 1000
            });
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/index/index',
                success: res => {
                  getCurrentPages()[0].onPullDownRefresh()
                }
              });
            }, 1500);
          }else{
            wx.showModal({
              title: '更新失败',
              showCancel: false,
              content: '请关闭小程序重新填写信息!',
            });
          }
        }
      })
    }else{
      api.login(e.detail.userInfo);
    }
    
  },
  phoneConfirm: function(e){
    var that = this;
    app.user_phone = e.detail.value;
    that.setData({
      phone: e.detail.value
    })
    console.log(app.user_phone);
  },
  companyConfirm: function (e) {
    var that = this;
    app.user_company = e.detail.value;
    that.setData({
      company: e.detail.value
    })
  },
  usernameConfirm: function (e) {
    var that = this;
    app.user_name = e.detail.value;
    that.setData({
      username: e.detail.value
    })
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
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 登录赋值
  sectionTwoPhone(e) {
    this.setData({
      loginPhone: e.detail.value
    })
  },
  sectionTwoPassword(e) {
    this.setData({
      loginPassword: e.detail.value
    })
  },
  

  // 注册类型选择
  buttonCircleInnerHandle() {
    var that = this;
    if (that.data.profile == '访客') {
      that.setData({
        profile: '员工',
        step: 1,
        phone: '',
        password: '',
        organization: '',
        name: '',
        id: '',
        nickname: '',
        head_img: '',
        loginPhone: '',
        loginPassword: ''
      })
    } else {
      that.setData({
        profile: '访客',
        step: 1,
        phone: '',
        password: '',
        organization: '',
        name: '',
        id: '',
        nickname: '',
        head_img: '',
        loginPhone: '',
        loginPassword: ''
      })
    }
  },
  // 员工下一步
  stepHandle() {
    var that = this;
    //正则手机号
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (that.data.phone.length == 0) {
      wx.showToast({
        title: '手机号有误',
        icon: 'loading',
        duration: 1500
      })
      return false;
    } else if (that.data.phone.length < 11) {
      wx.showToast({
        title: '手机号有误',
        icon: 'loading',
        duration: 1500
      })
      return false;
    } else if (!myreg.test(that.data.phone)) {
      wx.showToast({
        title: '手机号有误',
        icon: 'loading',
        duration: 1500
      })
      return false;
    } else if (that.data.password.length < 6) {
      wx.showToast({
        title: '密码少于6位',
        duration: 1500,
        mask: true
      })
    } else {
      setTimeout(function () {
        that.setData({
          step: 2
        })
      }.bind(that), 1000)
    }
  },
  // 访客注册赋值
  sectionThreeVisitorPhone(e) {
    console.log(e);
    this.setData({
      phone: e.detail.value
    })
  },
  sectionThreeVisitorPassword(e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 员工注册
  registerHandle() {
    var that = this;
    var myname = /^[\x07-\xff]*$/;
    var myid = /^(\d{14}|\d{17})(\d|[xX])$/;
    if (myname.test(that.data.name)) {
      wx.showToast({
        title: '姓名有误',
        icon: 'loading',
        duration: 1500,
        mask: true
      })
      return false;
    }
    //  else if (!myid.test(that.data.id)) {
    //   wx.showToast({
    //     title: '身份证号有误',
    //     icon: 'loading',
    //     duration: 1500,
    //     mask: true
    //   })
    //   return false;
    // } else if (that.data.id.length > 18) {
    //   wx.showToast({
    //     title: '身份证号有误',
    //     icon: 'loading',
    //     duration: 1500,
    //     mask: true
    //   })
    //   return false;
    // } 
    else {
    }
  }
  
})