class TimberMask extends egret.Sprite {
  constructor() {
    super()
  }
  private ary: TimberMaskSprite[] = []

  public init(skin: number) {
    const randomAry =  [0, 360]
    randomAry.push(Tools.generateRandom(10, 350))
    randomAry.push(Tools.generateRandom(10, 350))
    randomAry.push(Tools.generateRandom(10, 350))
    randomAry.sort((a: number, b: number) => {
      return a - b
    })
    for (let i = 0; i < randomAry.length - 1; i++) {
      const r = 100
      const next = i + 1
      const startAngle = randomAry[i]
      const endAngle = next > randomAry.length ? 360 : randomAry[next]
      const m:TimberMaskSprite = new TimberMaskSprite()
      m.createMask(r, startAngle, endAngle, skin)
      this.addChild(m)
      this.ary.push(m)
    }
  }

  public startAnimation(): void {
    const { stage } = egret.MainContext.instance
    this.ary.forEach((item: TimberMaskSprite) => {
      item.rotation = Tools.generateRandom(30, 90)
      item.x = item.x + Tools.generateRandom(30, 90)
      item.y = item.y + Tools.generateRandom(30, 90)
      egret.Tween.get(item).to({rotation: Tools.generateRandom(30, 90), y: stage.stageHeight, x: Tools.generateRandom(-stage.stageWidth * 2, stage.stageWidth * 2)}, 1000).call(() => {
        item.parent.removeChild(item)
      }, this)
    })
  }
}