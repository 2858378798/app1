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
    qrcode:"/image/c3.jpg",
    sellerTeam: [
      
      { 'tel': '+86 18668119080', 'name': '方超(销售经理)' , 'area':'华北地区（北京 天津 河北 内蒙古）'},
      { 'tel': '+86 18606608456', 'name': '陈常(品牌代表)', 'area': '华北地区（除内蒙古） 东北地区'},
      { 'tel': '+86 13666681515', 'name': '王响(品牌代表)', 'area': '华东地区（浙江 福建）'},
      { 'tel': '+86 13911390749', 'name': '陈云云(销售经理)', 'area': '华北地区（山西） 华东地区（山东）'},
      { 'tel': '+86 13600555152', 'name': '朱韩煜琦(销售代表)', 'area': '华中地区（湖南 湖北 江西 河南）' },
      { 'tel': '+86 13666741055', 'name': '关朝涛(销售经理)', 'area': '西南地区（四川 重庆 云南 贵州 西藏）' },
      { 'tel': '+86 13646737483', 'name': '吴可嘉(销售代表)', 'area': '华东地区（安徽 江苏） 华南地区（广东 广西 海南）'  },
    ],
    showTeam: false,
    textTeam: '点击查看'
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
  teltoUs: function (e) {
    console.log(e);
    var tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  onShareAppMessage: function () {
    return {
      title: 'SE Audiotechnik',
      desc: '',
      path: "pages/view/view",
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.sellerTeam);
    var that = this;
    that.setData({ loadingHide: false });
    setTimeout(function () {
      that.setData({ loadingHide: true });
    }, 1000);
    var url = app.globalData.host+'/public/api/admin/siteinfo/index/';
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
  showTeam:function(){
    var showTeam = this.data.showTeam;
    var textTeam = this.data.textTeam;
    if (textTeam == '点击查看'){
      textTeam = '点击收起';
    }else{
      textTeam = '点击查看';
    }
    this.setData({
      showTeam: !showTeam,
      textTeam: textTeam
    })
  }
})