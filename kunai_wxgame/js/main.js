var egret = window.egret;var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var GamePlayingPanel = (function (_super) {
    __extends(GamePlayingPanel, _super);
    function GamePlayingPanel() {
        var _this = _super.call(this) || this;
        _this.rotations = 3;
        _this.isShooting = false;
        _this.insertRotate = [];
        _this.kunaiW = 21;
        _this.kunaiH = 100;
        _this.rate = 35;
        // 关数限定
        _this.kunaiNum = 9;
        _this.level = 1;
        _this.calcCollision = function (rotate) {
            var insertRotate = _this.insertRotate;
            return insertRotate.some(function (item) {
                return (rotate <= item.range[1] && rotate >= item.range[0]);
            });
        };
        _this.initGame();
        return _this;
    }
    GamePlayingPanel.prototype.start = function () {
        this.startAnimation();
    };
    GamePlayingPanel.prototype.end = function () {
        this.resetGame();
    };
    /**
     * 创建场景界面
     * Create scene interface
     */
    GamePlayingPanel.prototype.initGame = function () {
        var stage = egret.MainContext.instance.stage;
        var stageW = stage.stageWidth;
        var stageH = stage.stageHeight;
        this.bgimg = new egret.Bitmap();
        this.bgimg.texture = RES.getRes('4_jpg');
        this.bgimg.x = 0;
        this.bgimg.y = 0;
        this.bgimg.width = stageW;
        this.bgimg.height = stageH;
        this.bgimg.alpha = .4;
        this.addChild(this.bgimg);
        this.timber = this.createBitmapByName('timber_png');
        this.addChild(this.timber);
        this.timber.width = 200;
        this.timber.height = 200;
        this.timber.anchorOffsetX = this.timber.width / 2;
        this.timber.anchorOffsetY = this.timber.height / 2;
        this.timber.x = stageW / 2;
        this.timber.y = 200;
        this.layerNum = this.numChildren;
        this.createText();
        this.createKunai();
        this.createKunaiNum();
        // 创建分享及广告
        this.share();
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    GamePlayingPanel.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    GamePlayingPanel.prototype.startAnimation = function () {
        var _this = this;
        // this.gameover()
        if (this.timberInterval) {
            clearInterval(this.timberInterval);
        }
        this.timber.rotation = 0;
        this.timberInterval = setInterval(function () {
            _this.timber.rotation += _this.rotations;
        }, this.rate);
    };
    /**
     * 点击按钮
     * Click the button
     */
    GamePlayingPanel.prototype.shoot = function (e) {
        var _this = this;
        if (this.isShooting || this.kunaiNum <= 0)
            return;
        this.isShooting = true;
        this.kunaiNum -= 1;
        this.updateKunaiNum();
        var func = function () {
            if (_this.calcCollision(_this.timber.rotation)) {
                // 如坐标集合里面有了，苦无插入重复的位置，弹飞新加的苦无
                _this.flickKunai();
            }
            else {
                // 木屑
                _this.woodBits();
                // 木桩被射中动画
                var timberX = _this.timber.x;
                var timberY = _this.timber.y;
                egret.Tween.get(_this.timber)
                    .to({ x: _this.timber.x - 6, y: _this.timber.y - 7 }, 20, egret.Ease.bounceInOut)
                    .to({ x: timberX, y: timberY }, 20, egret.Ease.bounceInOut);
                _this.createRotateKunai();
                // 判断及动画完成以后进行游戏判断
                if (_this.kunaiNum <= 0) {
                    _this.showNext();
                }
            }
        };
        egret.Tween.get(this.kunai)
            .to({ y: 370 }, 150, egret.Ease.cubicIn)
            .call(func, this);
    };
    // 创建游戏点击区域
    GamePlayingPanel.prototype.createClickable = function () {
        var stage = egret.MainContext.instance.stage;
        var rect = new egret.Shape();
        rect.graphics.beginFill(0x000000, 0);
        rect.graphics.drawRect(0, stage.stageHeight - 200, stage.stageWidth, 300);
        rect.graphics.endFill();
        this.addChild(rect);
        rect.touchEnabled = true;
        rect.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shoot, this);
    };
    GamePlayingPanel.prototype.createKunai = function () {
        var stage = egret.MainContext.instance.stage;
        this.kunai = this.createBitmapByName('kunai_png');
        this.addChild(this.kunai);
        var stageW = stage.stageWidth;
        var stageH = stage.stageHeight;
        this.kunai.width = this.kunaiW;
        this.kunai.height = this.kunaiH;
        this.kunai.x = stageW / 2 - 10;
        this.kunai.y = stageH - 200;
        this.createRandomKunai();
        this.createClickable();
    };
    GamePlayingPanel.prototype.resetKunai = function () {
        var stage = egret.MainContext.instance.stage;
        var stageW = stage.stageWidth;
        var stageH = stage.stageHeight;
        this.kunai.width = 20;
        this.kunai.height = 100;
        this.kunai.rotation = 0;
        this.kunai.x = stageW / 2 - 10;
        this.kunai.y = stageH - 200;
        this.isShooting = false;
    };
    GamePlayingPanel.prototype.createRotateKunai = function (kunaiRotate) {
        var _this = this;
        // 数据存储木桩上的苦无坐标
        // 有kunaiRotate则是随机生成的苦无
        // 如果是用kunaiRotate做判断需要乘以-1
        var stage = egret.MainContext.instance.stage;
        var rotate = kunaiRotate ? kunaiRotate * -1 : this.timber.rotation;
        var range = [];
        range.push(rotate - 10);
        range.push(rotate + 10);
        // 生成木桩上的苦无
        var kunai = this.createBitmapByName('kunai_png');
        kunai.anchorOffsetX = 5;
        kunai.anchorOffsetY = -52;
        kunai.x = stage.stageWidth / 2;
        kunai.y = 200;
        kunai.width = this.kunaiW;
        kunai.height = this.kunaiH;
        kunai.rotation = kunaiRotate ? kunaiRotate : 0;
        this.addChildAt(kunai, this.layerNum - 1);
        setInterval(function () {
            kunai.rotation += _this.rotations;
        }, this.rate);
        var obj = { id: rotate, range: range, kunai: kunai };
        this.insertRotate.push(obj);
        this.resetKunai();
    };
    GamePlayingPanel.prototype.flickKunai = function () {
        var _this = this;
        var stage = egret.MainContext.instance.stage;
        var func = function () {
            setTimeout(function () {
                _this.gameover();
            }, 500);
        };
        egret.Tween.get(this.kunai)
            .to({ x: stage.stageWidth + 100, y: stage.$stageHeight + 100, rotation: 720 }, 700, egret.Ease.bounceOut)
            .call(func, this);
    };
    // 文字提示
    GamePlayingPanel.prototype.createText = function () {
        var stage = egret.MainContext.instance.stage;
        var shape1 = new egret.Shape();
        shape1.graphics.beginFill(0x2f1810, .8);
        shape1.graphics.drawRoundRect(-10, 10, 80, 30, 10);
        shape1.graphics.endFill();
        this.addChild(shape1);
        this.textfield = new egret.TextField();
        this.addChild(this.textfield);
        this.textfield.x = 12;
        this.textfield.y = 17;
        this.textfield.textColor = 0xffffff;
        this.textfield.textAlign = egret.HorizontalAlign.CENTER;
        this.textfield.size = 14;
        this.updateLevel();
        var tips = new egret.TextField();
        this.addChild(tips);
        tips.x = 10;
        tips.y = 50;
        tips.textColor = 0x000000;
        tips.textAlign = egret.HorizontalAlign.CENTER;
        tips.size = 10;
        tips.text = '射中全部苦无过关';
        var kunaiTips = new egret.TextField();
        this.addChild(kunaiTips);
        kunaiTips.x = stage.stageWidth - 120;
        kunaiTips.y = stage.stageHeight - 60;
        kunaiTips.textColor = 0x000000;
        kunaiTips.textAlign = egret.HorizontalAlign.CENTER;
        kunaiTips.size = 10;
        kunaiTips.text = '点击苦无即可发射';
    };
    // 关数显示
    GamePlayingPanel.prototype.updateLevel = function () {
        this.textfield.text = "\u7B2C " + this.level + " \u5173";
    };
    // 绘制剩余苦无
    GamePlayingPanel.prototype.createKunaiNum = function () {
        var stage = egret.MainContext.instance.stage;
        var kunai = this.createBitmapByName('kunai_png');
        kunai.width = 10;
        kunai.height = 50;
        kunai.x = 30;
        kunai.y = stage.stageHeight - 100;
        this.addChild(kunai);
        this.kunaiNumTips = new egret.TextField();
        this.addChild(this.kunaiNumTips);
        this.kunaiNumTips.x = 50;
        this.kunaiNumTips.y = stage.stageHeight - 80;
        this.kunaiNumTips.textColor = 0xFFFFFF;
        this.kunaiNumTips.textAlign = egret.HorizontalAlign.LEFT;
        this.kunaiNumTips.size = 14;
        this.updateKunaiNum();
    };
    // 更新剩余苦无
    GamePlayingPanel.prototype.updateKunaiNum = function () {
        this.kunaiNumTips.text = "x " + this.kunaiNum;
    };
    // 下一关
    GamePlayingPanel.prototype.showNext = function () {
        this.goNext();
    };
    GamePlayingPanel.prototype.goNext = function () {
        this.level += 1;
        this.kunaiNum = 9;
        this.updateKunaiNum();
        this.updateLevel();
        this.cleanBitmap();
        this.createRandomKunai();
        // 重置木桩的角度并开始动画
        this.startAnimation();
    };
    // 随机生成的苦无
    GamePlayingPanel.prototype.createRandomKunai = function () {
        // 每加一关，已插入的苦无多一把
        for (var i = 1; i < this.level; i++) {
            var random = Math.floor(Math.random() * 180);
            random = Math.random() < .5 ? random * -1 : random;
            this.createRotateKunai(random);
        }
    };
    GamePlayingPanel.prototype.gameover = function () {
        var _this = this;
        var stage = egret.MainContext.instance.stage;
        this.dialog = new Dialog();
        this.dialog.init();
        this.addChild(this.dialog);
        this.dialog.x = stage.stageWidth / 2 - this.dialog._width / 2;
        this.dialog.y = stage.stageHeight / 2 - this.dialog._height / 2;
        this.dialog.addEventListener(Dialog.GO_HOME, function () {
            _this.dispatchEventWith(GamePlayingPanel.GAME_END);
        }, this);
        this.dialog.addEventListener(Dialog.RESTART, function () {
            _this.resetGame();
        }, this);
    };
    GamePlayingPanel.prototype.resetGame = function () {
        var _this = this;
        this.level = 1;
        this.kunaiNum = 9;
        this.updateKunaiNum();
        this.updateLevel();
        this.cleanBitmap();
        this.resetKunai();
        this.createRandomKunai();
        // 重置木桩的角度并开始动画
        this.startAnimation();
        this.removeChild(this.dialog);
        this.dialog.removeEventListener(Dialog.GO_HOME, function () {
            _this.dispatchEventWith(GamePlayingPanel.GAME_END);
        }, this);
        this.dialog.removeEventListener(Dialog.RESTART, function () {
            _this.resetGame();
        }, this);
    };
    GamePlayingPanel.prototype.cleanBitmap = function () {
        this.insertRotate.forEach(function (item) {
            item.kunai.parent.removeChild(item.kunai);
        });
        this.insertRotate = [];
    };
    // 木屑
    GamePlayingPanel.prototype.woodBits = function () {
        var _this = this;
        var _a = egret.MainContext.instance.stage, stageWidth = _a.stageWidth, stageHeight = _a.stageHeight;
        var _loop_1 = function (i) {
            var dou = this_1.createBitmapByName('dou_png');
            dou.width = 5;
            dou.height = 5;
            dou.x = stageWidth / 2 - 1;
            dou.y = 290;
            this_1.addChild(dou);
            var random = Math.floor(Math.random() * stageWidth * 2);
            random = Math.random() < .5 ? random * -1 : random;
            egret.Tween.get(dou)
                .to({ x: random, y: stageHeight }, 500, egret.Ease.sineOut)
                .call(function () {
                _this.removeChild(dou);
            });
        };
        var this_1 = this;
        for (var i = 0; i < 4; i++) {
            _loop_1(i);
        }
    };
    GamePlayingPanel.prototype.share = function () {
        var stage = egret.MainContext.instance.stage;
        this.s1 = this.createBitmapByName('s1_png');
        this.s1.width = 118 * .5;
        this.s1.height = 107 * .5;
        this.s1.x = stage.stageWidth - this.s1.width;
        this.s1.y = stage.stageHeight - 330;
        var s1y = this.s1.y;
        this.addChild(this.s1);
        egret.Tween.get(this.s1, { loop: true }).to({ y: this.s1.y + 10 }, 1000).to({ y: s1y }, 1000);
        this.s2 = this.createBitmapByName('s2_png');
        this.s2.width = 119 * .5;
        this.s2.height = 106 * .5;
        this.s2.x = stage.stageWidth - this.s2.width;
        this.s2.y = stage.stageHeight - 250;
        var s2y = this.s2.y;
        this.addChild(this.s2);
        egret.Tween.get(this.s2, { loop: true }).to({ y: this.s2.y - 10 }, 1000).to({ y: s2y }, 1000);
    };
    GamePlayingPanel.GAME_END = 'gameend';
    GamePlayingPanel.GAME_RESTART = 'gamerestart';
    return GamePlayingPanel;
}(egret.Sprite));
__reflect(GamePlayingPanel.prototype, "GamePlayingPanel");
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
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Main.prototype.createChildren = function () {
        console.log(this);
        _super.prototype.createChildren.call(this);
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        this.createGameScene();
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadTheme()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                    case 3:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadTheme = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            var theme = new eui.Theme("resource/default.thm.json", _this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                resolve();
            }, _this);
        });
    };
    /**
     * 创建场景界面
     * Create scene interface
     */
    Main.prototype.createGameScene = function () {
        var stage = this.stage;
        var bg = new egret.Shape();
        bg.graphics.beginGradientFill(egret.GradientType.RADIAL, [0xf6dba4, 0xfcf0d6], [1, 1], [150, 50], new egret.Matrix());
        bg.graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
        bg.graphics.endFill();
        this.addChild(bg);
        this.init();
    };
    Main.prototype.init = function () {
        this.gameStartPanel = new GameStartPanel();
        this.gamePlayingPanel = new GamePlayingPanel();
        this.gameEndPanel = new GameEndPanel();
        this.start();
    };
    Main.prototype.start = function () {
        // const { gameStartPanel, gamePlaying } = this
        this.addChild(this.gameStartPanel);
        this.gameStartPanel.start();
        this.gameStartPanel.addEventListener(GameStartPanel.GAME_START, this.gamePlaying, this);
    };
    Main.prototype.gamePlaying = function () {
        // const { gameStartPanel, gamePlayingPanel, gamePlaying, gameEnd } = this
        this.gameStartPanel.end();
        this.removeChild(this.gameStartPanel);
        this.gameStartPanel.removeEventListener(GameStartPanel.GAME_START, this.gamePlaying, this);
        this.addChild(this.gamePlayingPanel);
        this.gamePlayingPanel.start();
        this.gamePlayingPanel.addEventListener(GamePlayingPanel.GAME_END, this.gameEnd, this);
        this.gamePlayingPanel.addEventListener(GamePlayingPanel.GAME_RESTART, this.gameRestart, this);
    };
    Main.prototype.gameEnd = function () {
        this.gamePlayingPanel.end();
        this.removeChild(this.gamePlayingPanel);
        this.gamePlayingPanel.removeEventListener(GamePlayingPanel.GAME_END, this.gameEnd, this);
        this.gamePlayingPanel.removeEventListener(GamePlayingPanel.GAME_RESTART, this.gameRestart, this);
        this.start();
    };
    Main.prototype.gameRestart = function () {
        // const { gameStartPanel, gameEndPanel, gamePlaying, gameStart } = this
        // this.gameEndPanel.end()
        // this.removeChild(this.gameEndPanel)
        // this.gameEndPanel.removeEventListener(GameEndPanel.GAME_RESTART, this.gameStart, this)
        // this.addChild(this.gameStartPanel)
        // this.gameStartPanel.start()
        // this.gameStartPanel.addEventListener(GameStartPanel.GAME_START, this.gamePlaying, this)
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
/**
 * 创建不同颜色的button
 */
var Buttons = (function (_super) {
    __extends(Buttons, _super);
    function Buttons() {
        return _super.call(this) || this;
    }
    Buttons.prototype.init = function (type, text, size, width, height) {
        var _this = this;
        if (type === void 0) { type = 1; }
        if (size === void 0) { size = 24; }
        if (width === void 0) { width = 180; }
        if (height === void 0) { height = 64; }
        this.img = new egret.Bitmap();
        this.txt = new egret.TextField();
        this.width = width;
        this.height = height;
        if (type === 1) {
            this.img.texture = RES.getRes('btn_bg_green_png');
            this.txt.strokeColor = 0x42a605;
        }
        else if (type === 2) {
            this.img.texture = RES.getRes('btn_bg_blue_png');
            this.txt.strokeColor = 0x2582c3;
        }
        else if (type === 3) {
            this.img.texture = RES.getRes('btn_bg_purple_png');
            this.txt.strokeColor = 0x810fb5;
        }
        else if (type === 4) {
            this.img.texture = RES.getRes('btn_bg_pink_png');
            this.txt.strokeColor = 0xc30835;
        }
        else if (type === 5) {
            this.img.texture = RES.getRes('btn_bg_brown_png');
            this.txt.strokeColor = 0x8e4926;
        }
        else {
            this.img.texture = RES.getRes('btn_bg_grey_png');
            this.txt.strokeColor = 0x656565;
        }
        this.img.scale9Grid = new egret.Rectangle(10, 10, 14, 103);
        this.img.width = width;
        this.img.height = height;
        this.addChild(this.img);
        this.txt.size = size;
        this.txt.textColor = 0xffffff;
        this.txt.text = text;
        this.txt.stroke = 1;
        this.txt.x = this.img.width / 2 - this.txt.width / 2;
        this.txt.y = this.img.height / 2 - this.txt.height / 2;
        this.addChild(this.txt);
        this.img.touchEnabled = true;
        this.img.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            _this.img.x = _this.img.x + 2;
            _this.img.y = _this.img.y + 2;
            _this.txt.x = _this.txt.x + 2;
            _this.txt.y = _this.txt.y + 2;
        }, this);
        this.img.addEventListener(egret.TouchEvent.TOUCH_END, function () {
            _this.img.x = _this.img.x - 2;
            _this.img.y = _this.img.y - 2;
            _this.txt.x = _this.txt.x - 2;
            _this.txt.y = _this.txt.y - 2;
        }, this);
        this.img.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function () {
            _this.img.x = _this.img.x - 2;
            _this.img.y = _this.img.y - 2;
            _this.txt.x = _this.txt.x - 2;
            _this.txt.y = _this.txt.y - 2;
        }, this);
    };
    return Buttons;
}(egret.Sprite));
__reflect(Buttons.prototype, "Buttons");
var Dialog = (function (_super) {
    __extends(Dialog, _super);
    function Dialog() {
        var _this = _super.call(this) || this;
        _this._width = 280;
        _this._height = 400;
        _this.GAME_RESTART = 'gamerestart';
        _this.GAME_SHARE = 'gameshare';
        _this.GAME_AD = 'gamead';
        return _this;
    }
    Dialog.prototype.init = function () {
        var _this = this;
        var _a = this, maskBlack = _a.maskBlack, tip = _a.tip, homeBtn = _a.homeBtn, restartBtn = _a.restartBtn, shareBtn = _a.shareBtn, adBtn = _a.adBtn;
        maskBlack = new egret.Shape();
        maskBlack.graphics.beginFill(0x000000, .8);
        maskBlack.graphics.drawRoundRect(0, 0, this._width, this._height, 10);
        this.addChild(maskBlack);
        tip = new egret.TextField();
        tip.y = 15;
        tip.text = '游戏失败';
        tip.textColor = 0xffffff;
        tip.size = 18;
        tip.x = this._width / 2 - tip.width / 2;
        this.addChild(tip);
        homeBtn = new Buttons();
        homeBtn.init(3, '回到首页');
        homeBtn.scaleX = .5;
        homeBtn.scaleY = .5;
        this.addChild(homeBtn);
        homeBtn.x = 30;
        homeBtn.y = 300;
        homeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.dispatchEventWith(Dialog.GO_HOME);
        }, this);
        restartBtn = new Buttons();
        restartBtn.init(1, '再玩一次');
        this.addChild(restartBtn);
        restartBtn.x = 160;
        restartBtn.y = 300;
        restartBtn.scaleX = .5;
        restartBtn.scaleY = .5;
        restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.dispatchEventWith(Dialog.RESTART);
        }, this);
        shareBtn = new Buttons();
        shareBtn.init(2, '分享复活');
        this.addChild(shareBtn);
        shareBtn.x = 30;
        shareBtn.y = 350;
        shareBtn.scaleX = .5;
        shareBtn.scaleY = .5;
        adBtn = new Buttons();
        adBtn.init(4, '免费复活');
        this.addChild(adBtn);
        adBtn.x = 160;
        adBtn.y = 350;
        adBtn.scaleX = .5;
        adBtn.scaleY = .5;
    };
    Dialog.GO_HOME = 'gohome';
    Dialog.RESTART = 'restart';
    Dialog.SHARE_WX = 'sharewx';
    Dialog.VIEW_AD = 'viewad';
    return Dialog;
}(egret.Sprite));
__reflect(Dialog.prototype, "Dialog");
var GameEndPanel = (function (_super) {
    __extends(GameEndPanel, _super);
    function GameEndPanel() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    GameEndPanel.prototype.start = function () {
        var _a = this, restartBtn = _a.restartBtn, onTouchTap = _a.onTouchTap;
        restartBtn.touchEnabled = true;
        restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchTap, this);
    };
    GameEndPanel.prototype.init = function () {
        this.restartBtn = new egret.TextField();
        this.restartBtn.text = '重新开始';
        this.restartBtn.x = 450 / 2 - this.restartBtn.width;
        this.restartBtn.y = 400;
        this.addChild(this.restartBtn);
    };
    GameEndPanel.prototype.onTouchTap = function () {
        this.dispatchEventWith(GameEndPanel.GAME_RESTART);
    };
    GameEndPanel.prototype.end = function () {
        var _a = this, restartBtn = _a.restartBtn, onTouchTap = _a.onTouchTap;
        restartBtn.$touchEnabled = false;
        if (restartBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            restartBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTouchTap, this);
        }
    };
    GameEndPanel.GAME_RESTART = 'gamerestart';
    return GameEndPanel;
}(egret.Sprite));
__reflect(GameEndPanel.prototype, "GameEndPanel");
/**
 * 首页底部
 */
var Bottom = (function (_super) {
    __extends(Bottom, _super);
    function Bottom() {
        var _this = _super.call(this) || this;
        _this.height = 100;
        _this._width = 1000;
        return _this;
    }
    Bottom.prototype.init = function () {
        var bg = new egret.Shape();
        bg.graphics.beginFill(0x000000, .5);
        bg.graphics.drawRect(0, 0, this._width, this.height);
        bg.graphics.endFill();
        this.bg = bg;
        this.addChild(this.bg);
        var b1 = new egret.Bitmap();
        b1.texture = RES.getRes('b1_png');
        b1.width = 53 * .5;
        b1.height = 52 * .5;
        b1.x = 30;
        b1.y = 20;
        this.addChild(b1);
        var t1 = new egret.TextField();
        t1.text = '好友排行';
        t1.size = 12;
        t1.textColor = 0xffffff;
        t1.x = 20;
        t1.y = 60;
        this.addChild(t1);
        var b2 = new egret.Bitmap();
        b2.texture = RES.getRes('b2_png');
        b2.width = 47 * .5;
        b2.height = 46 * .5;
        b2.x = 130;
        b2.y = 20;
        this.addChild(b2);
        var t2 = new egret.TextField();
        t2.text = '群内排行';
        t2.size = 12;
        t2.textColor = 0xffffff;
        t2.x = 120;
        t2.y = 60;
        this.addChild(t2);
        var b3 = new egret.Bitmap();
        b3.texture = RES.getRes('b3_png');
        b3.width = 51 * .5;
        b3.height = 51 * .5;
        b3.x = 230;
        b3.y = 20;
        this.addChild(b3);
        var t3 = new egret.TextField();
        t3.text = '世界排行';
        t3.size = 12;
        t3.textColor = 0xffffff;
        t3.x = 220;
        t3.y = 60;
        this.addChild(t3);
        var b4 = new egret.Bitmap();
        b4.texture = RES.getRes('b4_png');
        b4.width = 60 * .5;
        b4.height = 58 * .5;
        b4.x = 330;
        b4.y = 20;
        this.addChild(b4);
        var t4 = new egret.TextField();
        t4.text = '皮肤';
        t4.size = 12;
        t4.textColor = 0xffffff;
        t4.x = 333;
        t4.y = 60;
        this.addChild(t4);
    };
    return Bottom;
}(egret.Sprite));
__reflect(Bottom.prototype, "Bottom");
var GameStartPanel = (function (_super) {
    __extends(GameStartPanel, _super);
    function GameStartPanel() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    GameStartPanel.prototype.start = function () {
        var _a = this, stage = _a.stage, startBtn = _a.startBtn, onTouchTap = _a.onTouchTap, startPK = _a.startPK, img = _a.img, logo = _a.logo, PK = _a.PK, bottom = _a.bottom;
        img.width = stage.stageWidth;
        img.height = stage.stageHeight;
        logo.x = stage.stageWidth / 2 - logo.width / 2;
        logo.y = -logo.height;
        egret.Tween.get(logo).to({ y: 60 }, 500, egret.Ease.bounceOut);
        startBtn.x = -startBtn.width;
        startBtn.y = 400;
        startBtn.touchEnabled = true;
        startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchTap, this);
        egret.Tween.get(startBtn).to({ x: stage.stageWidth / 2 - startBtn.width / 2 }, 500, egret.Ease.bounceOut);
        startPK.x = stage.stageWidth;
        startPK.y = 500;
        egret.Tween.get(startPK).to({ x: stage.stageWidth / 2 - startPK.width / 2 }, 500, egret.Ease.bounceOut);
        startPK.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            PK.x = PK.x + 2;
            PK.y = PK.y + 2;
        }, this);
        startPK.addEventListener(egret.TouchEvent.TOUCH_END, function () {
            PK.x = PK.x - 2;
            PK.y = PK.y - 2;
        }, this);
        startPK.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function () {
            PK.x = PK.x - 2;
            PK.y = PK.y - 2;
        }, this);
        PK.x = stage.stageWidth;
        egret.Tween.get(PK).to({ x: 105 }, 500, egret.Ease.bounceOut);
        bottom.y = stage.stageHeight;
        egret.Tween.get(bottom).to({ y: stage.stageHeight - bottom.height }, 500, egret.Ease.bounceOut);
    };
    GameStartPanel.prototype.init = function () {
        var img = new egret.Bitmap();
        img.texture = RES.getRes('1_jpg');
        img.x = 0;
        img.y = 0;
        img.alpha = .6;
        this.img = img;
        this.addChildAt(this.img, 0);
        var logo = new egret.Bitmap();
        logo.texture = RES.getRes('logo_png');
        logo.width = 751 * .4;
        logo.height = 599 * .4;
        this.logo = logo;
        this.addChild(this.logo);
        this.startBtn = new Buttons();
        this.addChild(this.startBtn);
        this.startBtn.init(1, '单人闯关');
        this.startPK = new Buttons();
        this.addChild(this.startPK);
        this.startPK.init(2, '实时对战');
        var pk = new egret.Bitmap();
        pk.texture = RES.getRes('pk_png');
        pk.width = 94 * .5;
        pk.height = 70 * .5;
        pk.y = 486;
        this.PK = pk;
        this.addChild(this.PK);
        // 生成底部
        this.bottom = new Bottom();
        this.addChild(this.bottom);
        this.bottom.init();
    };
    GameStartPanel.prototype.onTouchTap = function () {
        this.dispatchEventWith(GameStartPanel.GAME_START);
    };
    GameStartPanel.prototype.end = function () {
        var _a = this, startBtn = _a.startBtn, onTouchTap = _a.onTouchTap;
        startBtn.$touchEnabled = false;
        if (startBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTouchTap, this);
        }
    };
    GameStartPanel.GAME_START = 'gamestart';
    return GameStartPanel;
}(egret.Sprite));
__reflect(GameStartPanel.prototype, "GameStartPanel");
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
var AssetAdapter = (function () {
    function AssetAdapter() {
    }
    /**
     * @language zh_CN
     * 解析素材
     * @param source 待解析的新素材标识符
     * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
     * @param thisObject callBack的 this 引用
     */
    AssetAdapter.prototype.getAsset = function (source, compFunc, thisObject) {
        function onGetRes(data) {
            compFunc.call(thisObject, data, source);
        }
        if (RES.hasRes(source)) {
            var data = RES.getRes(source);
            if (data) {
                onGetRes(data);
            }
            else {
                RES.getResAsync(source, onGetRes, this);
            }
        }
        else {
            RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
        }
    };
    return AssetAdapter;
}());
__reflect(AssetAdapter.prototype, "AssetAdapter", ["eui.IAssetAdapter"]);
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
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super.call(this) || this;
        _this.createView();
        return _this;
    }
    LoadingUI.prototype.createView = function () {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
    };
    LoadingUI.prototype.onProgress = function (current, total) {
        this.textField.text = "Loading..." + current + "/" + total;
    };
    return LoadingUI;
}(egret.Sprite));
__reflect(LoadingUI.prototype, "LoadingUI", ["RES.PromiseTaskReporter"]);
var DebugPlatform = (function () {
    function DebugPlatform() {
    }
    DebugPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    DebugPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return DebugPlatform;
}());
__reflect(DebugPlatform.prototype, "DebugPlatform", ["Platform"]);
if (!window.platform) {
    window.platform = new DebugPlatform();
}
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
var ThemeAdapter = (function () {
    function ThemeAdapter() {
    }
    /**
     * 解析主题
     * @param url 待解析的主题url
     * @param onSuccess 解析完成回调函数，示例：compFunc(e:egret.Event):void;
     * @param onError 解析失败回调函数，示例：errorFunc():void;
     * @param thisObject 回调的this引用
     */
    ThemeAdapter.prototype.getTheme = function (url, onSuccess, onError, thisObject) {
        var _this = this;
        function onResGet(e) {
            onSuccess.call(thisObject, e);
        }
        function onResError(e) {
            if (e.resItem.url == url) {
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError, null);
                onError.call(thisObject);
            }
        }
        if (typeof generateEUI !== 'undefined') {
            egret.callLater(function () {
                onSuccess.call(thisObject, generateEUI);
            }, this);
        }
        else if (typeof generateEUI2 !== 'undefined') {
            RES.getResByUrl("resource/gameEui.json", function (data, url) {
                window["JSONParseClass"]["setData"](data);
                egret.callLater(function () {
                    onSuccess.call(thisObject, generateEUI2);
                }, _this);
            }, this, RES.ResourceItem.TYPE_JSON);
        }
        else if (typeof generateJSON !== 'undefined') {
            if (url.indexOf(".exml") > -1) {
                var dataPath = url.split("/");
                dataPath.pop();
                var dirPath = dataPath.join("/") + "_EUI.json";
                if (!generateJSON.paths[url]) {
                    RES.getResByUrl(dirPath, function (data) {
                        window["JSONParseClass"]["setData"](data);
                        egret.callLater(function () {
                            onSuccess.call(thisObject, generateJSON.paths[url]);
                        }, _this);
                    }, this, RES.ResourceItem.TYPE_JSON);
                }
                else {
                    egret.callLater(function () {
                        onSuccess.call(thisObject, generateJSON.paths[url]);
                    }, this);
                }
            }
            else {
                egret.callLater(function () {
                    onSuccess.call(thisObject, generateJSON);
                }, this);
            }
        }
        else {
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError, null);
            RES.getResByUrl(url, onResGet, this, RES.ResourceItem.TYPE_TEXT);
        }
    };
    return ThemeAdapter;
}());
__reflect(ThemeAdapter.prototype, "ThemeAdapter", ["eui.IThemeAdapter"]);

;window.Main = Main;