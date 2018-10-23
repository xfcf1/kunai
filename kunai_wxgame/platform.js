/**
 * 请在白鹭引擎的Main.ts中调用 platform.login() 方法调用至此处。
 */

class WxgamePlatform {

  name = 'wxgame'

  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          resolve(res)
        }
      })
    })
  }

  scopeUserInfo() {
    wx.authorize({ scope: 'scope.userInfo' })
  }

  getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        withCredentials: true,
        success: function(res) {
          var userInfo = res.userInfo
          var nickName = userInfo.nickName
          var avatarUrl = userInfo.avatarUrl
          var gender = userInfo.gender //性别 0：未知、1：男、2：女
          var province = userInfo.province
          var city = userInfo.city
          var country = userInfo.country
          resolve(userInfo);
        }
      })
    })
  }

  setUserCloudStorage(obj) {
    wx.setUserCloudStorage({
      KVDataList: [obj],
      success: function(res) {
        console.log(res)
      }
    })
  }

  removeUserCloudStorage(ary) {
    wx.setUserCloudStorage({
      keyList: ary,
      success: function (res) {
        console.log(res)
      }
    })
  }

  share(func) {
    wx.shareAppMessage()
    return func && func()
  }

  setData(data, func) {
    wx.setStorage({
      key: data.key,
      data: data.value,
      success: function(res) {
        if (func) func()
      }
    })
  }
  getData(key, func) {
    wx.getStorage({
      key: key,
      success: function(res) {
        if (func) func(res)
      },
      fail: function (e) {
        if (func) func('')
      }
    })
  }
  removeData(key, func) {
    wx.removeStorage({
      key: key,
      success: function (res) {
        if (func) func(res)
      }
    })
  }
  clearData(func) {
    wx.removeStorage({
      success: function () {
        if (func) func()
      }
    })
  }
  openMini(obj) {
    wx.navigateToMiniProgram(obj)
  }

  openDataContext = new WxgameOpenDataContext();
}

class WxgameOpenDataContext {

  createDisplayObject(type, width, height) {
    const bitmapdata = new egret.BitmapData(sharedCanvas);
    bitmapdata.$deleteSource = false;
    const texture = new egret.Texture();
    texture._setBitmapData(bitmapdata);
    const bitmap = new egret.Bitmap(texture);
    bitmap.width = width;
    bitmap.height = height;

    if (egret.Capabilities.renderMode == "webgl") {
      const renderContext = egret.wxgame.WebGLRenderContext.getInstance();
      const context = renderContext.context;
      ////需要用到最新的微信版本
      ////调用其接口WebGLRenderingContext.wxBindCanvasTexture(number texture, Canvas canvas)
      ////如果没有该接口，会进行如下处理，保证画面渲染正确，但会占用内存。
      if (!context.wxBindCanvasTexture) {
        egret.startTick((timeStarmp) => {
          egret.WebGLUtils.deleteWebGLTexture(bitmapdata.webGLTexture);
          bitmapdata.webGLTexture = null;
          return false;
        }, this);
      }
    }
    return bitmap;
  }


  postMessage(data) {
    const openDataContext = wx.getOpenDataContext();
    openDataContext.postMessage(data);
  }
}


window.platform = new WxgamePlatform();