/**
 * 创建不同颜色的button
 */

class Buttons extends egret.Sprite {
  constructor() {
    super()
  }
  
  private img: egret.Bitmap
  private txt: egret.TextField
  public width: number
  public height: number

  public init(type: number = 1, text: string, size: number = 24, width: number = 180, height: number = 64) {
      this.img = new egret.Bitmap()
      this.txt = new egret.TextField()
      this.width = width
      this.height = height
    if (type === 1) {
      this.img.texture = RES.getRes('btn_bg_green_png')
      this.txt.strokeColor = 0x42a605
    } else if (type === 2) {
      this.img.texture = RES.getRes('btn_bg_blue_png')
      this.txt.strokeColor = 0x2582c3
    } else if (type === 3) {
      this.img.texture = RES.getRes('btn_bg_purple_png')
      this.txt.strokeColor = 0x810fb5
    } else if (type === 4) {
      this.img.texture = RES.getRes('btn_bg_pink_png')
      this.txt.strokeColor = 0xc30835
    } else if (type === 5) {
      this.img.texture = RES.getRes('btn_bg_brown_png')
      this.txt.strokeColor = 0x8e4926
    } else {
      this.img.texture = RES.getRes('btn_bg_grey_png')
      this.txt.strokeColor = 0x656565
    }
      this.img.scale9Grid = new egret.Rectangle(10, 10, 14, 103)
      this.img.width = width
      this.img.height = height
      this.addChild(this.img)

      this.txt.size = size
      this.txt.textColor = 0xffffff
      this.txt.text = text
      this.txt.stroke = 1
      this.txt.x = this.img.width / 2 - this.txt.width / 2
      this.txt.y = this.img.height / 2 - this.txt.height / 2
      this.addChild(this.txt)

      this.img.touchEnabled = true
      this.img.addEventListener(egret.TouchEvent.TOUCH_BEGIN, () => {
        this.img.x = this.img.x + 2
        this.img.y = this.img.y + 2
        this.txt.x = this.txt.x + 2
        this.txt.y = this.txt.y + 2
      }, this)
      this.img.addEventListener(egret.TouchEvent.TOUCH_END, () => {
        this.img.x = this.img.x - 2
        this.img.y = this.img.y - 2
        this.txt.x = this.txt.x - 2
        this.txt.y = this.txt.y - 2
      }, this)
      this.img.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, () => {
        this.img.x = this.img.x - 2
        this.img.y = this.img.y - 2
        this.txt.x = this.txt.x - 2
        this.txt.y = this.txt.y - 2
      }, this)
  }
}