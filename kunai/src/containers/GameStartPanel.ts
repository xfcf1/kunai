class GameStartPanel extends egret.Sprite {
  public static GAME_START: string = 'gamestart'
  private bg: egret.Shape
  private startBtn: egret.TextField

  public constructor() {
    super()
    this.init()
  }

  public start() {
    const { startBtn, onTouchTap } = this
    startBtn.touchEnabled = true
    startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchTap, this)
  }

  private init() {
    this.startBtn = new egret.TextField()
    this.startBtn.text = '开始游戏'
    this.startBtn.x = 450 / 2 - this.startBtn.width
    this.startBtn.y = 400
    this.addChild(this.startBtn)
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