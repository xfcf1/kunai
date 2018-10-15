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
    console.log(this)
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

	/**
	 * 创建场景界面
	 * Create scene interface
	 */
  protected createGameScene(): void {
    const { stage } = this
    const bg = new egret.Shape()
    bg.graphics.beginGradientFill(egret.GradientType.RADIAL, [0xf6dba4, 0xfcf0d6], [1, 1], [150, 50], new egret.Matrix())
    bg.graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight)
    bg.graphics.endFill()
    this.addChild(bg)

    this.init()
  }

  private gameStartPanel: GameStartPanel
	private gamePlayingPanel: GamePlayingPanel
	private gameEndPanel: GameEndPanel

	private init() {
		this.gameStartPanel = new GameStartPanel()
		this.gamePlayingPanel = new GamePlayingPanel()
		this.gameEndPanel = new GameEndPanel()
		this.start()
	}

	public start() {
		// const { gameStartPanel, gamePlaying } = this
		this.addChild(this.gameStartPanel)
    this.gameStartPanel.start()
		this.gameStartPanel.addEventListener(GameStartPanel.GAME_START, this.gamePlaying, this)
	}

	private gamePlaying() {
		// const { gameStartPanel, gamePlayingPanel, gamePlaying, gameEnd } = this
		this.gameStartPanel.end()
		this.removeChild(this.gameStartPanel)
		this.gameStartPanel.removeEventListener(GameStartPanel.GAME_START, this.gamePlaying, this)
		this.addChild(this.gamePlayingPanel)
    this.gamePlayingPanel.start()
		this.gamePlayingPanel.addEventListener(GamePlayingPanel.CHANG_EPANEL, this.gameEnd, this)
	}

	private gameEnd() {
		// const { gamePlayingPanel, gameEndPanel, gameEnd, gameStart } = this
		this.gamePlayingPanel.end()
		this.removeChild(this.gamePlayingPanel)
		this.gamePlayingPanel.removeEventListener(GamePlayingPanel.CHANG_EPANEL, this.gameEnd, this)
		this.addChild(this.gameEndPanel)
    this.gameEndPanel.start()
		this.gameEndPanel.addEventListener(GameEndPanel.GAME_RESTART, this.gameStart, this)
	}

	private gameStart() {
		// const { gameStartPanel, gameEndPanel, gamePlaying, gameStart } = this
		this.gameEndPanel.end()
		this.removeChild(this.gameEndPanel)
		this.gameEndPanel.removeEventListener(GameEndPanel.GAME_RESTART, this.gameStart, this)
		this.addChild(this.gameStartPanel)
    this.gameStartPanel.start()
		this.gameStartPanel.addEventListener(GameStartPanel.GAME_START, this.gamePlaying, this)
	}
}

