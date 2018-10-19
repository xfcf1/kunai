class GameStartPanel extends egret.Sprite {
  public static GAME_START_1: string = 'gamestart1'
  public static GAME_START_2: string = 'gamestart2'
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
    startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      this.onTouchTap(1)
    }, this)
    egret.Tween.get(startBtn).to({ x: stage.stageWidth / 2 - startBtn.width / 2 }, 500, egret.Ease.bounceOut)

    startPK.x = stage.stageWidth
    startPK.y = 500
    startPK.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      this.onTouchTap(2)
    }, this)
    egret.Tween.get(startPK).to({ x: stage.stageWidth / 2 - startPK.width / 2 }, 500, egret.Ease.bounceOut)
    // startPK.addEventListener(egret.TouchEvent.TOUCH_BEGIN, () => {
    //   PK.x = PK.x + 2
    //   PK.y = PK.y + 2
    // }, this)
    // startPK.addEventListener(egret.TouchEvent.TOUCH_END, () => {
    //   PK.x = PK.x - 2
    //   PK.y = PK.y - 2
    // }, this)
    // startPK.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, () => {
    //   PK.x = PK.x - 2
    //   PK.y = PK.y - 2
    // }, this)
    // PK.x = stage.stageWidth
    // egret.Tween.get(PK).to({ x: 105}, 500, egret.Ease.bounceOut)

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
    this.addChild(this.startPK)
    this.startPK.init(4, '疯狂模式')

    // const pk: egret.Bitmap = new egret.Bitmap()
    // pk.texture = RES.getRes('pk_png')
    // pk.width = 94 * .5
    // pk.height = 70 * .5
    // pk.y = 486
    // this.PK = pk
    // this.addChild(this.PK)

    // 生成底部
    this.bottom = new Bottom()
    this.addChild(this.bottom)
    this.bottom.init()
    this.bottom.addEventListener(Bottom.FRIENDS_RANK, this.friendsRank, this)


    this.btnClose = new egret.Shape;
    this.btnClose.graphics.beginFill(0xff0000, 1)
    this.btnClose.graphics.drawCircle(egret.MainContext.instance.stage.stageWidth - 50, 80, 20)
    this.btnClose.graphics.endFill()
    this.btnClose.touchEnabled = true
    this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      this.friendsRank()
      this.removeChild(this.btnClose)
    }, this);
  }

  private onTouchTap(mode: number = 1) {
    // mode1：简单
    // mode2：疯狂
    if (mode === 1) {
      this.dispatchEventWith(GameStartPanel.GAME_START_1)
    } else if (mode === 2) {
      this.dispatchEventWith(GameStartPanel.GAME_START_2)
    }
  }

  public end() {
    const { startBtn, onTouchTap } = this
    startBtn.$touchEnabled = false
    if (startBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
      startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTouchTap, this)
    }
  }

  private bitmap: egret.Bitmap
  private isdisplay = false
  private rankingListMask: egret.Shape
  private btnClose: egret.Shape;

  private friendsRank() {
    let platform: any = window.platform;
    if (this.isdisplay) {
      this.bitmap.parent && this.bitmap.parent.removeChild(this.bitmap);
      this.rankingListMask.parent && this.rankingListMask.parent.removeChild(this.rankingListMask);
      this.isdisplay = false;
      platform.openDataContext.postMessage({
        isDisplay: this.isdisplay,
        text: 'hello',
        year: (new Date()).getFullYear(),
        command: "close"
      });
    } else {
      //处理遮罩，避免开放数据域事件影响主域。
      this.rankingListMask = new egret.Shape();
      this.rankingListMask.graphics.beginFill(0x000000, 1);
      this.rankingListMask.graphics.drawRect(0, 0, this.stage.width, this.stage.height);
      this.rankingListMask.graphics.endFill();
      this.rankingListMask.alpha = 0.5;
      this.rankingListMask.touchEnabled = true;
      this.addChild(this.rankingListMask);

      //主要示例代码开始
      this.bitmap = platform.openDataContext.createDisplayObject(null, this.stage.stageWidth, this.stage.stageHeight);
      this.addChild(this.bitmap);
      //简单实现，打开这关闭使用一个按钮。
      this.addChild(this.btnClose);
      //主域向子域发送自定义消息
      platform.openDataContext.postMessage({
        isDisplay: this.isdisplay,
        text: 'hello',
        year: (new Date()).getFullYear(),
        command: "open"
      });
      //主要示例代码结束            
      this.isdisplay = true;
    }
  }
}