/**
 * 首页底部
 */

class Bottom extends egret.Sprite {
  constructor() {
    super()
  }

  public static FRIENDS_RANK = 'friendsrank'
  public static GROUP_RANK = 'grouprank'
  public static WORLD_RANK = 'worldrank'
  public static SKIN = 'skin'
  public static ZAN = 'ZAN'
  public height: number = 100
  private _width: number = 1000
  private bg: egret.Shape

  public init() {
    const bg: egret.Shape = new egret.Shape()
    bg.graphics.beginFill(0x000000, .5)
    bg.graphics.drawRect(0, 0, this._width, this.height)
    bg.graphics.endFill()
    this.bg = bg
    this.addChild(this.bg)

    const b1: egret.Bitmap = new egret.Bitmap()
    b1.texture = RES.getRes('b1_png')
    b1.width = 53 * .5
    b1.height = 52 * .5
    b1.x = 30
    b1.y = 20
    this.addChild(b1)
    b1.touchEnabled = true
    b1.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      this.dispatchEventWith(Bottom.FRIENDS_RANK)
    }, this)

    const t1: egret.TextField = new egret.TextField()
    t1.text = '好友排行'
    t1.size = 12
    t1.textColor = 0xffffff
    t1.x = 20
    t1.y = 60
    this.addChild(t1)
    t1.touchEnabled = true
    t1.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      this.dispatchEventWith(Bottom.FRIENDS_RANK)
    }, this)

    const b2: egret.Bitmap = new egret.Bitmap()
    b2.texture = RES.getRes('b2_png')
    b2.width = 47 * .5
    b2.height = 46 * .5
    b2.x = 130
    b2.y = 20
    this.addChild(b2)

    const t2: egret.TextField = new egret.TextField()
    t2.text = '群内排行'
    t2.size = 12
    t2.textColor = 0xffffff
    t2.x = 120
    t2.y = 60
    this.addChild(t2)

    const b3: egret.Bitmap = new egret.Bitmap()
    b3.texture = RES.getRes('b4_png')
    b3.width = 51 * .5
    b3.height = 51 * .5
    b3.x = 230
    b3.y = 20
    this.addChild(b3)

    const t3: egret.TextField = new egret.TextField()
    t3.text = '皮肤'
    t3.size = 12
    t3.textColor = 0xffffff
    t3.x = 232
    t3.y = 60
    this.addChild(t3)

    const miniObj = {
      appId: 'wx9042a3fe52d33aba',
      path: 'pages/apps/largess/detail?id=waQKNtmC5mk%3D'
    }
    const b4: egret.Bitmap = new egret.Bitmap()
    b4.texture = RES.getRes('like_png')
    b4.width = 60 * .5
    b4.height = 58 * .5
    b4.x = 330
    b4.y = 20
    this.addChild(b4)
    b4.touchEnabled = true
    b4.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      this.dispatchEventWith(Bottom.ZAN)
      platform.openMini(miniObj)
    }, this)

    const t4: egret.TextField = new egret.TextField()
    t4.text = '给攒'
    t4.size = 12
    t4.textColor = 0xffffff
    t4.x = 333
    t4.y = 60
    this.addChild(t4)
    t4.touchEnabled = true
    t4.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      this.dispatchEventWith(Bottom.ZAN)
      platform.openMini(miniObj)
    }, this)

  }
}