/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface Platform {
  scopeUserInfo(): Promise<any>
  getUserInfo(): Promise<any>
  login(): Promise<any>
  setUserCloudStorage(obj: any): Promise<any>
  removeUserCloudStorage(ary: string[]): Promise<any>
  share(func?: any): Promise<any>
  setData(data: any, func?: any): Promise<any>
  getData(key: any, func?: any): Promise<any>
  removeData(key: any, func?: any): Promise<any>
  clearData(func?: any): Promise<any>
  openMini(obj: any): Promise<any>
  openDataContext
}

class DebugPlatform implements Platform {
  async scopeUserInfo() {}
  async getUserInfo() {
    return {
      nickName: '悠悠丶',
      avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEKT3CKZgvyic14bBOYKpbaS2PvaS7t1ar4295xuV4w8xArEF8kuxWpzFicgADibw2c2XdWjasfzvDib5Q/132'
    }
  }
  async login() {}
  async setUserCloudStorage(obj: any) {}
  async removeUserCloudStorage(ary: string[]) {}
  async share(func?: any) {
    return func && func()
  }
  async setData(data: any, func: any) {
    window.localStorage.setItem(data.key, data.value)
    return func && func()
  }
  async getData(key: any, func: any) {
    const data = window.localStorage.getItem(key)
    return func ? func(data) : data
  }
  async removeData(key: any, func: any) {
    window.localStorage.removeItem(key)
    return func && func()
  }
  async clearData(func: any) {
    return func && func()
  }
  openDataContext
  async openMini(obj: any) {}
}


if (!window.platform) {
  window.platform = new DebugPlatform();
}



declare let platform: Platform;

declare interface Window {

  platform: Platform
}





