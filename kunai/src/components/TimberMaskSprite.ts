/**
 * 不同的木桩弧形遮罩
 */
class TimberMaskSprite extends egret.Sprite {
  constructor() {
    super()
  }

  public createMask(r: number, startAngle: number, endAngle: number, skin: number) {
    const img = skin === 1 ? 'timber_png' : 'eye_png'
    const t: egret.Bitmap = new egret.Bitmap(RES.getRes(img))
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