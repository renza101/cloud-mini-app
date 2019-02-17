//index.js
const db = wx.cloud.database();
const forms = db.collection('forms');


var rule = '\n1、请至少提前两天将申请表及策划电子版，以“协会名称＋［36号楼教室借用］＋日期”的方式命名发送至秘书部公邮mishu@hustau.com审批通过的社团（审批结果将以短信形式通知），使用教室的当天须将申请表打印成纸质版（双面打印）交至36号楼1楼社联值班室，并在教室借用表上进行借用登记;\n2、建议申请前先查询教室是否空闲，查询方式：见华中大会长群;\n3、房间钥匙均插在门上，教室使用结束后请将钥匙插回原位;\n4、普通教室须有活动负责人陪同使用并保证器材设备完好;\n5、活动结束后请将教室清理干净并将桌椅归位，谢谢配合.\n6、若活动结束后未按要求做好清洁或是造成物资缺失及损坏，将予以警告，出现两次（含）以上情况一个月内不得借用36号楼教室。且损坏或丢失物资必须照价赔偿。'
const app = getApp()
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    text: rule,
    showIndex: 0,
    listData: [
      { "code": "", "time": "", "association": "", "responser": "", "tel": "" }],
    date: "2019-01-01",

  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    this.setData({
      listData: [
        { "code": "", "time": "", "association": "", "responser": "", "tel": "" }]
    })
    db.collection('forms').where({
      exam: db.command.eq(3),
      eventDate: this.data.date
    }).get({
      success: res => {
        const length = res.data.length
        for (let i = 0; i <= length; ++i) {
          console.log("第" + (i + 1) + "个活动" + '\t' + "活动名称：" + res.data[i].event.name + '\t' + "协会：" + res.data[i].event.association + '\t' + "活动内容：" + res.data[i].event.content + '\t' + "负责人：" + res.data[i].event.responser),
            this.setData({
              listData: this.data.listData.concat([
                { "code": res.data[i].classroomNumber, "time": res.data[i].eventTime1 + '\t' + "~" + res.data[i].eventTime2, "association": res.data[i].event.association, "responser": res.data[i].event.responser, "tel": res.data[i].event.tel }])
            })
        }
      },
    })
  },


  onLoad: function () {
    this.setData({
      listData: [
        { "code": "", "time": "", "association": "", "responser": "", "tel": "" }]
    })
    db.collection('forms').where({
      exam: db.command.eq(3),
      eventDate: this.data.date
    }).get({
      success: res => {
        const length = res.data.length
        for (let i = 0; i <= length; ++i) {
          console.log("第" + (i + 1) + "个活动" + '\t' + "活动名称：" + res.data[i].event.name + '\t' + "协会：" + res.data[i].event.association + '\t' + "活动内容：" + res.data[i].event.content + '\t' + "负责人：" + res.data[i].event.responser),
            this.setData({
              listData: this.data.listData.concat([
                { "code": res.data[i].classroomNumber, "time": res.data[i].eventTime1 + '\t' + "~" + res.data[i].eventTime2, "association": res.data[i].event.association, "responser": res.data[i].event.responser, "tel": res.data[i].event.tel }])
            })
        }
      },
    })
  },
  panel: function (e) {
    if (e.currentTarget.dataset.index != this.data.showIndex) {
      this.setData({
        showIndex: e.currentTarget.dataset.index
      })
    } else {
      this.setData({
        showIndex: 0  
      })
    }
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  }
})
