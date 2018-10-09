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
      // egret.ticker.pause();
    }

    egret.lifecycle.onResume = () => {
      // egret.ticker.resume();
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
  private rotations: number = 3
  private isShooting: boolean = false
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
    this.timber.x = stageW/2
    this.timber.y = 200

    // this.kunai = this.createBitmapByName('kunai_png')
    // this.addChild(this.kunai)
    // this.kunai.width = 20
    // this.kunai.height = 100
    // this.kunai.anchorOffsetX = 10
    // this.kunai.anchorOffsetY = -80
    // this.kunai.x = stageW/2
    // this.kunai.y = 200

    this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shoot, this)

    this.textfield = new egret.TextField()
    this.addChild(this.textfield)
    this.textfield.x = 25
    this.textfield.y = 25
    this.textfield.textColor = 0x000000
    this.textfield.textAlign = egret.HorizontalAlign.LEFT
    this.textfield.size = 14

    this.createKunai()
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
    const rotation = 3
    setInterval(() => {
      this.timber.rotation += rotation
      this.textfield.text = `角度：${this.timber.rotation}`
    }, 50)
  }

	/**
	 * 点击按钮
	 * Click the button
	 */
  private shoot(e: egret.TouchEvent) {
    if (this.isShooting) return
    this.isShooting = true
    const func = ():void => {
      this.createRotateKunai()
      this.resetKunai()
      this.isShooting = false
    }
    egret.Tween.get(this.kunai)
      .to({ y: 280 }, 300, egret.Ease.cubicIn)
      .call(func, this)
  }

  private createKunai() {
    this.kunai = this.createBitmapByName('kunai_png')
    this.addChild(this.kunai)
    const stageW = this.stage.stageWidth
    const stageH = this.stage.stageHeight
    this.kunai.width = 20
    this.kunai.height = 100
    this.kunai.x = stageW/2 - 10
    this.kunai.y = stageH - 200
  }

  private resetKunai() {
    const stageW = this.stage.stageWidth
    const stageH = this.stage.stageHeight
    this.kunai.width = 20
    this.kunai.height = 100
    this.kunai.x = stageW/2 - 10
    this.kunai.y = stageH - 200
  }

  private createRotateKunai(){
    const kunai:egret.Bitmap = this.createBitmapByName('kunai_png')
    kunai.anchorOffsetX = 10
    kunai.anchorOffsetY = -80
    kunai.x = this.stage.stageWidth/2
    kunai.y = 200
    kunai.width = 20
    kunai.height = 100
    this.addChildAt(kunai, 1)
    setInterval(() => {
      kunai.rotation += this.rotations
    }, 50)
  }
}
