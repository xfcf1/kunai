class Dialog extends egret.Sprite {
  constructor() {
    super()
  }

  public static GO_HOME: string = 'gohome'
  public static RESTART: string = 'restart'
  public static SHARE_WX: string = 'sharewx'
  public static VIEW_AD: string = 'viewad'
  public _width: number = 280
  public _height: number = 400
  private GAME_RESTART: string = 'gamerestart'
  private GAME_SHARE: string  = 'gameshare'
  private GAME_AD: string  = 'gamead'
  private maskBlack: egret.Shape
  private tip: egret.TextField
  private homeBtn: Buttons
  private restartBtn: Buttons
  private shareBtn: Buttons
  private adBtn: Buttons

  public init () {
    let { maskBlack, tip, homeBtn, restartBtn, shareBtn, adBtn } = this
    maskBlack = new egret.Shape()
    maskBlack.graphics.beginFill(0x000000, .8)
    maskBlack.graphics.drawRoundRect(0, 0, this._width, this._height, 10)
    this.addChild(maskBlack)

    tip = new egret.TextField()
    tip.y = 15
    tip.text = '游戏失败'
    tip.textColor = 0xffffff
    tip.size = 18
    tip.x = this._width / 2 - tip.width / 2
    this.addChild(tip)

    homeBtn = new Buttons()
    homeBtn.init(3, '回到首页', 12, 90, 32)
    this.addChild(homeBtn)
    homeBtn.x = 30
    homeBtn.y = 300
    homeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      this.dispatchEventWith(Dialog.GO_HOME)
    }, this)

    restartBtn = new Buttons()
    restartBtn.init(1, '再玩一次', 12, 90, 32)
    this.addChild(restartBtn)
    restartBtn.x = 160
    restartBtn.y = 300
    restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      this.dispatchEventWith(Dialog.RESTART)
    }, this)

    shareBtn = new Buttons()
    shareBtn.init(2, '分享复活', 12, 90, 32)
    this.addChild(shareBtn)
    shareBtn.x = 30
    shareBtn.y = 350

    adBtn = new Buttons()
    adBtn.init(4, '免费复活', 12, 90, 32)
    this.addChild(adBtn)
    adBtn.x = 160
    adBtn.y = 350
  }
}