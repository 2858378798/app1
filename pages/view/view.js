// pages/view/view.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHide: true,
    loadingText: "加载中",
    tel: "暂无",
    wechat: "暂无",
    address: "暂无",
    qrcode:"/image/c3.jpg"
  },

  //http://lbs.qq.com/tool/getpoint/ 坐标拾取器
  click: function (e) {
    wx.openLocation({
      latitude: 40.281150,
      longitude: 111.197160,
      scale: 18,
      name: '斯贝克电子有限公司',
      address: this.data.address
    })
  },
  teltoUs: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.tel 
    })
  },
  onShareAppMessage: function () {
    return {
      title: '斯贝克',
      desc: '',
      path: "pages/view/view",
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({ loadingHide: false });
    setTimeout(function () {
      that.setData({ loadingHide: true });
    }, 1000);
    var url = 'https://wechat.se-audiotechnik.pro/public/api/admin/siteinfo/index/';
    wx.request({
      url: url,
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res);
        if (res.data.code > 0) {
          that.setData({
            'tel': res.data.data.tel,
            'address': res.data.data.address,
            'wechat': res.data.data.wechataccount,
          })
        } else {
          wx.showModal({
            //title:res.data.msg,
            content: res.data.msg,
            showCancel: false,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    app.globalData.requestTitle = '联系我们';
    app.globalData.requestTableName = '';
    app.doView();
  },
})