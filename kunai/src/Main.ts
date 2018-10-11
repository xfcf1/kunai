//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {
  protected createChildren(): void {
    super.createChildren();

    egret.lifecycle.addLifecycleListener((context) => {
      // custom lifecycle plugin
    })

    egret.lifecycle.onPause = () => {
      egret.ticker.pause();
    }

    egret.lifecycle.onResume = () => {
      egret.ticker.resume();
    }

    //inject the custom material parser
    //注入自定义的素材解析器
    let assetAdapter = new AssetAdapter();
    egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
    egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


    this.runGame().catch(e => {
      console.log(e);
    })
  }

  private async runGame() {
    await this.loadResource()
    this.createGameScene();
    // const result = await RES.getResAsync("description_json")
    this.startAnimation();
    await platform.login();
    const userInfo = await platform.getUserInfo();
    console.log(userInfo);

  }

  private async loadResource() {
    try {
      const loadingView = new LoadingUI();
      this.stage.addChild(loadingView);
      await RES.loadConfig("resource/default.res.json", "resource/");
      await this.loadTheme();
      await RES.loadGroup("preload", 0, loadingView);
      this.stage.removeChild(loadingView);
    }
    catch (e) {
      console.error(e);
    }
  }

  private loadTheme() {
    return new Promise((resolve, reject) => {
      // load skin theme configuration file, you can manually modify the file. And replace the default skin.
      //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
      let theme = new eui.Theme("resource/default.thm.json", this.stage);
      theme.addEventListener(eui.UIEvent.COMPLETE, () => {
        resolve();
      }, this);

    })
  }

  private textfield: egret.TextField;
  private timber: egret.Bitmap
  private kunai: egret.Bitmap
  private timberInterval: number
  private rotations: number = 3
  private isShooting: boolean = false
  private insertRotate: itemObj[] = []
  protected kunaiW = 21
  protected kunaiH = 100
  protected rate = 35

  // 关数限定
  private kunaiNum: number = 9
  private level: number = 1
  private kunaiNumTips: egret.TextField

	/**
	 * 创建场景界面
	 * Create scene interface
	 */
  protected createGameScene(): void {
    const stageW = this.stage.stageWidth
    const stageH = this.stage.stageHeight
    const bg = new egret.Shape()
    bg.graphics.beginGradientFill(egret.GradientType.RADIAL, [0xf6dba4, 0xfcf0d6], [1, 1], [150, 50], new egret.Matrix())
    // bg.graphics.beginFill(0xFF0000, .5)
    bg.graphics.drawRect(0, 0, stageW, stageH)
    bg.graphics.endFill()
    this.addChild(bg)

    this.timber = this.createBitmapByName('timber_png')
    this.addChild(this.timber)
    this.timber.width = 200
    this.timber.height = 200
    this.timber.anchorOffsetX = this.timber.width / 2
    this.timber.anchorOffsetY = this.timber.height / 2
    this.timber.x = stageW / 2
    this.timber.y = 200

    this.createText()
    this.createKunai()
    this.createKunaiNum()
  }
	/**
	 * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
	 * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
	 */
  private createBitmapByName(name: string): egret.Bitmap {
    let result = new egret.Bitmap();
    let texture: egret.Texture = RES.getRes(name);
    result.texture = texture;
    return result;
  }
	/**
	 * 描述文件加载成功，开始播放动画
	 * Description file loading is successful, start to play the animation
	 */
  private startAnimation(): void {
    if (this.timberInterval) {
      clearInterval(this.timberInterval)
    }
    this.timber.rotation = 0
    this.timberInterval = setInterval(() => {
      this.timber.rotation += this.rotations
    }, this.rate)
  }

	/**
	 * 点击按钮
	 * Click the button
	 */
  private shoot(e: egret.TouchEvent) {
    if (this.isShooting || this.kunaiNum <= 0) return
    this.isShooting = true
    this.kunaiNum -= 1
    this.updateKunaiNum()
    const func = (): void => {
      if (this.calcCollision(this.timber.rotation)) {
        // 如坐标集合里面有了，苦无插入重复的位置，弹飞新加的苦无
        this.flickKunai()

        console.log('重复苦无', this.insertRotate, this.timber.rotation)
      } else {
        // 木桩被射中动画
        const timberX = this.timber.x
        const timberY = this.timber.y
        egret.Tween.get(this.timber)
          .to({ x: this.timber.x - 6, y: this.timber.y - 7 }, 20, egret.Ease.bounceInOut)
          .to({ x: timberX, y: timberY }, 20, egret.Ease.bounceInOut)

        this.createRotateKunai()

        // 判断及动画完成以后进行游戏判断
        if (this.kunaiNum <= 0) {
          this.showNext()
        }
      }
    }
    egret.Tween.get(this.kunai)
      .to({ y: 370 }, 150, egret.Ease.cubicIn)
      .call(func, this)
  }

  // 创建游戏点击区域

  private createClickable() {
    const { stage } = this
    const rect = new egret.Shape()
    rect.graphics.beginFill(0x000000, 0)
    rect.graphics.drawRect(0, stage.stageHeight - 200, stage.stageWidth, 300)
    rect.graphics.endFill()
    this.addChild(rect)
    rect.touchEnabled = true
    rect.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shoot, this)
  }

  private createKunai() {
    this.kunai = this.createBitmapByName('kunai_png')
    this.addChild(this.kunai)
    const stageW = this.stage.stageWidth
    const stageH = this.stage.stageHeight
    this.kunai.width = this.kunaiW
    this.kunai.height = this.kunaiH
    this.kunai.x = stageW / 2 - 10
    this.kunai.y = stageH - 200

    this.createRandomKunai()
    this.createClickable()
  }

  private resetKunai() {
    const stageW = this.stage.stageWidth
    const stageH = this.stage.stageHeight
    this.kunai.width = 20
    this.kunai.height = 100
    this.kunai.rotation = 0
    this.kunai.x = stageW / 2 - 10
    this.kunai.y = stageH - 200

    this.isShooting = false
  }

  private createRotateKunai(kunaiRotate?: number) {
    // 数据存储木桩上的苦无坐标
    // 有kunaiRotate则是随机生成的苦无
    // 如果是用kunaiRotate做判断需要乘以-1
    const rotate = kunaiRotate ? kunaiRotate * -1 : this.timber.rotation
    const range = []
    range.push(rotate - 10)
    range.push(rotate + 10)

    // 生成木桩上的苦无
    const kunai: egret.Bitmap = this.createBitmapByName('kunai_png')
    kunai.anchorOffsetX = 5
    kunai.anchorOffsetY = -52
    kunai.x = this.stage.stageWidth / 2
    kunai.y = 200
    kunai.width = this.kunaiW
    kunai.height = this.kunaiH
    kunai.rotation = kunaiRotate ? kunaiRotate : 0
    this.addChildAt(kunai, 1)
    setInterval(() => {
      kunai.rotation += this.rotations
    }, this.rate)

    const obj = { id: rotate, range, kunai }
    this.insertRotate.push(obj)
    this.resetKunai()

    console.log('所有的苦无', this.insertRotate, rotate)
  }

  private calcCollision = (rotate: number): boolean => {
    const { insertRotate } = this
    return insertRotate.some((item: itemObj): boolean => {
      return (rotate <= item.range[1] && rotate >= item.range[0])
    })
  }

  private flickKunai() {
    const func = (): void => {
      setTimeout(() => {
        this.gameover()
      }, 500)
    }

    egret.Tween.get(this.kunai)
      .to({ x: this.stage.stageWidth + 100, y: this.stage.$stageHeight + 100, rotation: 720 }, 700, egret.Ease.bounceOut)
      .call(func, this)
  }

  // 文字提示
  private createText() {
    const tips = new egret.TextField()
    this.addChild(tips)
    tips.x = 10
    tips.y = 30
    tips.textColor = 0x000000
    tips.textAlign = egret.HorizontalAlign.CENTER
    tips.size = 10
    tips.text = '所有苦无全部射中即可过关'

    const kunaiTips = new egret.TextField()
    this.addChild(kunaiTips)
    kunaiTips.x = this.stage.stageWidth - 120
    kunaiTips.y = this.stage.stageHeight - 60
    kunaiTips.textColor = 0x000000
    kunaiTips.textAlign = egret.HorizontalAlign.CENTER
    kunaiTips.size = 10
    kunaiTips.text = '点击苦无即可发射'

    this.textfield = new egret.TextField()
    this.addChild(this.textfield)
    this.textfield.x = 10
    this.textfield.y = 10
    this.textfield.textColor = 0x000000
    this.textfield.textAlign = egret.HorizontalAlign.CENTER
    this.textfield.size = 16
    this.updateLevel()
  }

  // 关数显示
  private updateLevel() {
    this.textfield.text = `第 ${this.level} 关`
  }

  // 绘制剩余苦无
  private createKunaiNum() {
    const kunai = this.createBitmapByName('kunai_png')
    kunai.width = 10
    kunai.height = 50
    kunai.x = 30
    kunai.y = this.stage.stageHeight - 100
    this.addChild(kunai)

    this.kunaiNumTips = new egret.TextField()
    this.addChild(this.kunaiNumTips)
    this.kunaiNumTips.x = 50
    this.kunaiNumTips.y = this.stage.stageHeight - 80
    this.kunaiNumTips.textColor = 0xFFFFFF
    this.kunaiNumTips.textAlign = egret.HorizontalAlign.LEFT
    this.kunaiNumTips.size = 14
    this.updateKunaiNum()
  }

  // 更新剩余苦无
  private updateKunaiNum() {
    this.kunaiNumTips.text = `x ${this.kunaiNum}`
  }

  // 下一关
  private showNext() {
    const panel = new eui.Panel()
    panel.title = '恭喜过关，点击进入下一关'
    panel.width = 300
    panel.height = 230
    panel.x = this.stage.stageWidth / 2 - 150
    panel.y = this.stage.stageHeight - 320
    panel.addEventListener(eui.UIEvent.CLOSING, this.goNext, this)
    this.addChild(panel)
  }

  private goNext() {
    this.level += 1
    this.kunaiNum = 9
    this.updateKunaiNum()
    this.updateLevel()
    this.cleanBitmap()
    this.createRandomKunai()
    // 重置木桩的角度并开始动画
    this.startAnimation()
  }

  // 随机生成的苦无
  private createRandomKunai() {
    // 每加一关，已插入的苦无多一把
    for (let i = 1; i < this.level; i++) {
      let random = Math.floor(Math.random() * 180)
      random = Math.random() < .5 ? random * -1 : random
      this.createRotateKunai(random)
    }
  }

  private gameover() {
    const panel = new eui.Panel()
    panel.title = '游戏失败，重新开始'
    panel.width = 300
    panel.height = 230
    panel.x = this.stage.stageWidth / 2 - 150
    panel.y = this.stage.stageHeight - 320
    panel.addEventListener(eui.UIEvent.CLOSING, this.resetGame, this)
    this.addChild(panel)
  }

  private resetGame() {
    this.level = 1
    this.kunaiNum = 9
    this.updateKunaiNum()
    this.updateLevel()
    this.cleanBitmap()
    this.resetKunai()
    this.createRandomKunai()
    // 重置木桩的角度并开始动画
    this.startAnimation()
  }

  private cleanBitmap() {
    this.insertRotate.forEach((item: itemObj) => {
      item.kunai.parent.removeChild(item.kunai)
    })
    this.insertRotate = []
  }
}

interface itemObj {
  id: number
  range: number[]
  kunai: egret.Bitmap
}
