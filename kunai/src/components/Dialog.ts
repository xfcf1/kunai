class Dialog extends egret.Sprite {
  constructor() {
    super()
  }

  public _width: number = 300
  public _height: number = 400
  private GAME_RESTART: string = 'gamerestart'
  private GAME_SHARE: string  = 'gameshare'
  private GAME_AD: string  = 'gamead'
  private maskBlack: egret.Shape
  private tip: egret.TextField
  private restartBtn: egret.Shape
  private restartTxt: egret.TextField
  private shareBtn: egret.Shape
  private shareTxt: egret.TextField
  private adBtn: egret.Shape
  private adTxt: egret.TextField

  public init () {
    let { maskBlack, tip, restartBtn, restartTxt, shareBtn, shareTxt, adBtn, adTxt } = this
    maskBlack = new egret.Shape()
    maskBlack.graphics.beginFill(0x000000, .6)
    maskBlack.graphics.drawRoundRect(0, 0, this._width, this._height, 10)
    this.addChild(maskBlack)

    tip = new egret.TextField()
    tip.y = 15
    tip.text = '游戏失败'
    tip.textColor = 0xffffff
    tip.size = 18
    tip.x = this._width / 2 - tip.width / 2
    this.addChild(tip)

    restartBtn = new egret.Shape()
    restartBtn.graphics.beginGradientFill(egret.GradientType.LINEAR, [0x15c30c, 0x82ee5b], [1, 1], [150, 220])
    restartBtn.graphics.drawRoundRect(0, 250, 220, 40, 10)
    restartBtn.x = this._width / 2 - restartBtn.width / 2
    this.addChild(restartBtn)
    restartBtn.touchEnabled = true
    restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      this.dispatchEventWith(this.GAME_RESTART)
    }, this)

    restartTxt = new egret.TextField
    restartTxt.textColor = 0xffffff
    restartTxt.size = 16
    restartTxt.text = '重 新 开 始'
    restartTxt.x = this._width / 2 - restartTxt.width / 2
    restartTxt.y = 265
    restartTxt.filters = [new egret.DropShadowFilter(1, 45, 0x000000, .9)]
    this.addChild(restartTxt)

    shareBtn = new egret.Shape()
    shareBtn.graphics.beginGradientFill(egret.GradientType.LINEAR, [0x4292e9, 0x85bcf9], [1, 1], [150, 220])
    shareBtn.graphics.drawRoundRect(40, 320, 100, 40, 10)
    this.addChild(shareBtn)
    shareBtn.touchEnabled = true
    shareBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      this.dispatchEventWith(this.GAME_SHARE)
    }, this)

    shareTxt = new egret.TextField
    shareTxt.textColor = 0xffffff
    shareTxt.size = 16
    shareTxt.text = '分享复活'
    shareTxt.x = 60
    shareTxt.y = 335
    this.addChild(shareTxt)

    adBtn = new egret.Shape()
    adBtn.graphics.beginGradientFill(egret.GradientType.LINEAR, [0xf1bf4e, 0xfcdb69], [1, 1], [150, 220])
    adBtn.graphics.drawRoundRect(160, 320, 100, 40, 10)
    this.addChild(adBtn)
    adBtn.touchEnabled = true
    adBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      this.dispatchEventWith(this.GAME_AD)
    }, this)

    adTxt = new egret.TextField
    adTxt.textColor = 0xffffff
    adTxt.size = 16
    adTxt.text = '看广告复活'
    adTxt.x = 170
    adTxt.y = 335
    this.addChild(adTxt)
  }
}