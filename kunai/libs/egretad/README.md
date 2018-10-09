# 白鹭广告 SDK 接入说明

### 广告样式
**1）横幅广告**。

这中形式不需要接入 SDK，只要把开放平台提供的 js 代码贴到 html 网页里即可使用

**2）插屏广告**。

这种形式需要使用 SDK，通过调用代码来显示广告。比如游戏里要使用复活道具的时候，可以询问玩家是否可以看个广告免费复活。这样处理起来更灵活，用户接受度更高。

### 下载 SDK
[SDK链接](./egretad) 

[示例 DEMO 源码](./egretadDemo) 


### 广告接入：白鹭引擎制作的游戏
1）创建广告对象，其中的 id 是从开放平台获取的。此外必须加载到舞台以后才可以调用

```
//初始化广告
var ad = new egretad.AD(id,this);
```
注意，5.0.4之后的引擎不需要传 this 进去。
this 是一个已经添加到舞台的对象。

2）监听广告创建完成的事件

```
ad.addEventListener(egretad.AD.CREATED, () => {
    console.log('广告创建完成，可以播放');
})
```

3）展示广告

```
ad.show()
```

SDK的更多功能和详细的使用方法，请参考示例 demo 的源码。


### 广告接入：非白鹭引擎制作的应用
如果你的游戏不是使用白鹭引擎制作的，也可以接入广告SDK。
注意，你游戏的 div 样式里一定要设定```position:absolute```,否则广告无法正常显示

1）在 html 页面中引入广告 SDK 的 js
```<script src="egretad.min.js"></script>```

2）创建广告对象，其中的 id 是从开放平台获取的。
```
var ad = new egretad.AD(id);
```

3）监听广告创建完成的事件

```
ad.addEventListener(egretad.AD.CREATED, () => {
    console.log('广告创建完成，可以播放');
})
```

4）展示广告

```
ad.show()
```

SDK的更多功能和详细的使用方法，请参考示例 demo 的源码。

[示例 DEMO 源码（非白鹭引擎制作的游戏）](./egretadDemo3rd) 
### 注意事项
1）本地测试，可以把ip地址改为 localhost，这样可以在本地电脑上显示广告。否则无法显示，会报错：
```
AdError 1009: The VAST response document is empty.
```

2）最好将展示广告的代码```ad.show()```放在点击事件里调用。

因为我们的广告后台会随机推送视频广告和图文广告，而视频广告在手机上必须通过点击事件才能正产显示。所以为了增加广告的成功率，请把展示代码放在点击事件里。

3）我们的部分广告来自海外，因为众所周知的原因，如果出现下面的错误，不影响广告的展示和收益

```
VM3377 www-widgetapi.js:121 Failed to execute 
'postMessage' on 'DOMWindow': The target origin 
provided ('https://www.youtube.com') does not match 
the recipient window's origin ('http://imasdk.googleapis.com').
```
```
Uncaught TypeError: Cannot read property 'apply' of undefined
```


