class GameStartPanel extends egret.Sprite {
  public static GAME_START: string = 'gamestart'
  private bg: egret.Shape
  private img: egret.Bitmap
  private logo: egret.Bitmap
  private startBtn: Buttons
  private startPK: Buttons
  private PK: egret.Bitmap
  private bottom: Bottom

  public constructor() {
    super()
    this.init()
  }

  public start() {
    const { stage, startBtn, onTouchTap, startPK, img, logo, PK, bottom } = this
    img.width = stage.stageWidth
    img.height = stage.stageHeight
    logo.x = stage.stageWidth / 2 - logo.width / 2
    logo.y = - logo.height
    egret.Tween.get(logo).to({ y: 60 }, 500, egret.Ease.bounceOut)
    
    startBtn.x = - startBtn.width
    startBtn.y = 400
    startBtn.touchEnabled = true
    startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchTap, this)
    egret.Tween.get(startBtn).to({ x: stage.stageWidth / 2 - startBtn.width / 2 }, 500, egret.Ease.bounceOut)

    startPK.x = stage.stageWidth
    startPK.y = 500
    egret.Tween.get(startPK).to({ x: stage.stageWidth / 2 - startPK.width / 2}, 500, egret.Ease.bounceOut)
    startPK.addEventListener(egret.TouchEvent.TOUCH_BEGIN, () => {
      PK.x = PK.x + 2
      PK.y = PK.y + 2
    }, this)
    startPK.addEventListener(egret.TouchEvent.TOUCH_END, () => {
      PK.x = PK.x - 2
      PK.y = PK.y - 2
    }, this)
    startPK.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, () => {
      PK.x = PK.x - 2
      PK.y = PK.y - 2
    }, this)
    PK.x = stage.stageWidth
    egret.Tween.get(PK).to({ x: 105}, 500, egret.Ease.bounceOut)

    bottom.y = stage.stageHeight
    egret.Tween.get(bottom).to({ y: stage.stageHeight - bottom.height }, 500, egret.Ease.bounceOut)

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
    this.logo = logo
    this.addChild(this.logo)

    this.startBtn = new Buttons()
    this.addChild(this.startBtn)
    this.startBtn.init(1, '单人闯关')

    this.startPK = new Buttons()
    this.addChild(this.startPK )
    this.startPK .init(2, '实时对战')

    const pk: egret.Bitmap = new egret.Bitmap()
    pk.texture = RES.getRes('pk_png')
    pk.width = 94 * .5
    pk.height = 70 * .5
    pk.y = 486
    this.PK = pk
    this.addChild(this.PK)

    // 生成底部
    this.bottom = new Bottom()
    this.addChild(this.bottom)
    this.bottom.init()
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