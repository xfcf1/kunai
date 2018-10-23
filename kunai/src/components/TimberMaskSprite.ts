class TimberMaskSprite extends egret.Sprite {
  constructor() {
    super()
  }

  public createMask(r: number, startAngle: number, endAngle: number) {
    const t: egret.Bitmap = new egret.Bitmap(RES.getRes('timber_png'))
    t.width = r * 2
    t.height = r * 2
    this.addChild(t)

    const m: egret.Shape = new egret.Shape()
    m.graphics.beginFill(0x000000)
    m.graphics.moveTo(r, r)
    m.graphics.lineTo(r * 2, r)
    m.graphics.drawArc(r , r, r, startAngle * Math.PI / 180, endAngle * Math.PI / 180)
    m.graphics.lineTo(r, r)
    m.graphics.endFill()
    this.addChild(m)
    t.mask = m
  }
}