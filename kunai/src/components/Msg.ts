/**
 * 统一提示
 */
class Msg extends egret.Sprite {
  constructor() {
    super()
  }
  public init(txt: string) {
    const { stage } = egret.MainContext.instance
    const shape: egret.Shape = new egret.Shape()
    shape.graphics.beginFill(0x000000, .6)
    shape.graphics.drawRect(0, -100, stage.stageWidth, 100)
    shape.graphics.endFill()
    this.addChild(shape)
    egret.Tween.get(shape).to({ y: 100 }, 100, egret.Ease.bounceOut).call(() => {
      setTimeout(() => {
        this.removeChild(shape)
      }, 3000)
    }, this)

    const text: egret.TextField = new egret.TextField()
    text.size = 14
    text.textColor = 0xffffff
    text.text = txt
    text.x = stage.stageWidth / 2 - text.width / 2
    text.y = -100 / 2 - text.height / 2
    this.addChild(text)
    egret.Tween.get(text).to({ y: 100 / 2 - text.height / 2 }, 100, egret.Ease.bounceOut).call(() => {
      setTimeout(() => {
        this.removeChild(text)
      }, 3000)
    }, this)
  }
}