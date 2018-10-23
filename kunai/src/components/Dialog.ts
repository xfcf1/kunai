class Dialog extends egret.Sprite {
  constructor() {
    super()
    this.init()
  }

  public static GO_HOME: string = 'gohome'
  public static RESTART: string = 'restart'
  public static SHARE_WX: string = 'sharewx'
  public static VIEW_AD: string = 'viewad'
  public static REBIRTH: string = 'rebirth'
  public static NOCHANCE: string = 'nochance'
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
  private scores: egret.TextField

  private async init () {
    let { maskBlack, tip, homeBtn, restartBtn, shareBtn, adBtn } = this
    maskBlack = new egret.Shape()
    maskBlack.graphics.beginFill(0x000000, .8)
    maskBlack.graphics.drawRoundRect(0, 0, this._width, this._height, 10)
    this.addChild(maskBlack)

    tip = new egret.TextField()
    tip.y = 15
    tip.text = '本次得分'
    tip.textColor = 0xffffff
    tip.size = 18
    tip.x = this._width / 2 - tip.width / 2
    this.addChild(tip)

    homeBtn = new Buttons()
    homeBtn.init(3, '回到首页')
    homeBtn.scaleX = .5
    homeBtn.scaleY = .5
    this.addChild(homeBtn)
    homeBtn.x = 30
    homeBtn.y = 300
    homeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      this.dispatchEventWith(Dialog.GO_HOME)
    }, this)

    restartBtn = new Buttons()
    restartBtn.init(1, '再玩一次')
    this.addChild(restartBtn)
    restartBtn.x = 160
    restartBtn.y = 300
    restartBtn.scaleX = .5
    restartBtn.scaleY = .5
    restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      this.dispatchEventWith(Dialog.RESTART)
    }, this)

    shareBtn = new Buttons()
    shareBtn.init(2, '炫耀战绩')
    this.addChild(shareBtn)
    shareBtn.x = 30
    shareBtn.y = 350
    shareBtn.scaleX = .5
    shareBtn.scaleY = .5
    shareBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      platform.share()
    }, this)

    adBtn = new Buttons()
    adBtn.init(4, '免费复活')
    this.addChild(adBtn)
    adBtn.x = 160
    adBtn.y = 350
    adBtn.scaleX = .5
    adBtn.scaleY = .5
    adBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      const date = new Date()
      const key = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`
      const that = this
      platform.getData(key, function(res) {
        if (!res || !res.data) {
          that.dispatchEventWith(Dialog.REBIRTH)
          platform.setData({ key, value: 1 })
        } else if (res.data) {
          let num = res.data
          num += 1
          if (num <= 3) {
            that.dispatchEventWith(Dialog.REBIRTH)
            platform.setData({ key, value: num })
          } else {
            that.dispatchEventWith(Dialog.NOCHANCE)
          }
        }
      })
    }, this)

    this.scores = new egret.TextField()
    this.scores.text = '0'
    this.scores.textAlign = egret.HorizontalAlign.CENTER
    this.scores.size = 22
    this.scores.textColor = 0xffffff
    this.scores.y = 40
    this.scores.x = this._width / 2 -this.scores.width / 2
    this.addChild(this.scores)
    const data = await platform.getUserInfo()
    console.log(111, data)
    const that = this
    const url = data.avatarUrl
    const imgLoader = new egret.ImageLoader()
    imgLoader.crossOrigin = ''
    imgLoader.load(url)
    imgLoader.once(egret.Event.COMPLETE, (e: egret.Event) => {
      if (e.currentTarget.data) {
        const texture = new egret.Texture()
        texture.bitmapData = e.currentTarget.data
        const img = new egret.Bitmap(texture)
        img.width = 100
        img.height = 100
        that.addChild(img)
        img.x = that._width / 2 - img.width / 2
        img.y = 100
      }
    }, this)
    const nickname: egret.TextField = new egret.TextField()
    nickname.size = 14
    nickname.textColor = 0xffffff
    nickname.text = data.nickName
    nickname.x = this._width / 2 - nickname.width /2
    nickname.y = 220
    this.addChild(nickname)

  }

  public setScores(text: string) {
    this.scores.text = `${text}`
    this.scores.x = this._width / 2 -this.scores.width / 2
  }
}