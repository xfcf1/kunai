class GameEndPanel extends egret.Sprite {
  public static GAME_RESTART: string = 'gamerestart'
  private bg: egret.Shape
  private restartBtn: egret.TextField

  public constructor() {
    super()
    this.init()
  }

  public start() {
    const { restartBtn, onTouchTap } = this
    restartBtn.touchEnabled = true
    restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchTap, this)
  }

  private init() {
    this.restartBtn = new egret.TextField()
    this.restartBtn.text = '重新开始'
    this.restartBtn.x = 450 / 2 - this.restartBtn.width
    this.restartBtn.y = 400
    this.addChild(this.restartBtn)
  }

  private onTouchTap() {
    this.dispatchEventWith(GameEndPanel.GAME_RESTART)
  }

  public end() {
    const { restartBtn, onTouchTap } = this
    restartBtn.$touchEnabled = false
    if (restartBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
      restartBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTouchTap, this)
    }
  }
}