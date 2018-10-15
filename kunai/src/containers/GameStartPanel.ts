class GameStartPanel extends egret.Sprite {
  public static GAME_START: string = 'gamestart'
  private bg: egret.Shape
  private img: egret.Bitmap
  private logo: egret.Bitmap
  private startBtn: egret.Bitmap
  private startPK: egret.Bitmap

  public constructor() {
    super()
    this.init()
  }

  public start() {
    const { stage, startBtn, onTouchTap, startPK, img } = this
    this.logo.x = stage.stageWidth / 2 - this.logo.width / 2
    
    startBtn.x = stage.stageWidth / 2 - startBtn.width / 2
    startBtn.touchEnabled = true
    startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchTap, this)

    startPK.x = stage.stageWidth / 2 - startPK.width / 2 - 5

    img.width = stage.stageWidth
    img.height = stage.stageHeight
  }

  private init() {
    const img = new egret.Bitmap()
    img.texture = RES.getRes('1_jpg')
    img.x = 0
    img.y = 0
    img.alpha = .6
    this.img = img
    this.addChildAt(this.img, 0)

    const logo = new egret.Bitmap()
    logo.texture = RES.getRes('logo_png')
    logo.width = 751 * .4
    logo.height = 599 * .4
    logo.y = 60
    this.logo = logo
    this.addChild(this.logo)

    const startBtn = new egret.Bitmap()
    startBtn.texture = RES.getRes('btn1_png')
    startBtn.width = 360 * .5
    startBtn.height = 128 * .5
    startBtn.y = 400
    this.startBtn = startBtn
    this.addChild(startBtn)

    const startPK = new egret.Bitmap()
    startPK.texture = RES.getRes('btn2_png')
    startPK.width = 381 * .5
    startPK.height = 147 * .5
    startPK.y = 500
    this.startPK = startPK
    this.addChild(startPK)
  }

  private onTouchTap() {
    this.dispatchEventWith(GameStartPanel.GAME_START)
  }

  public end() {
    const { startBtn, onTouchTap } = this
    startBtn.$touchEnabled = false
    if (startBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
      startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTouchTap, this)
    }
  }
}