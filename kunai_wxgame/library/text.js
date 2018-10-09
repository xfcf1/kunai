const fileutil = require('./file-util');
const path = fileutil.path;
const fs = fileutil.fs;
const WXFS = wx.getFileSystemManager();

/**
 * 重写的文本加载器，代替引擎默认的文本加载器
 * 该代码中包含了大量日志用于辅助开发者调试
 * 正式上线时请开发者手动删除这些注释
 */
class TextProcessor {

    onLoadStart(host, resource) {

        const {
            root,
            url
        } = resource;


        return new Promise((resolve, reject) => {
            let xhrURL = url.indexOf('://') >= 0 ? url : root + url; //获取网络加载url
            if (RES['getVirtualUrl']) {
                xhrURL = RES['getVirtualUrl'](xhrURL);
            }
            if (path.isRemotePath(xhrURL)) { //判断是本地加载还是网络加载
                if (needCache(root, url)) {
                    //通过缓存机制判断是否本地加载
                    const targetFilename = path.getLocalFilePath(xhrURL);
                    if (fs.existsSync(targetFilename)) {
                        //缓存命中
                        // console.log('缓存命中');
                        let data = fs.readSync(targetFilename, 'utf-8');
                        resolve(data);
                    } else {
                        //通过url加载，加载成功后加入本地缓存
                        loadText(xhrURL).then((content) => {
                            const dirname = path.dirname(targetFilename);
                            fs.mkdirsSync(dirname);
                            fs.writeSync(targetFilename, content);
                            resolve(content);
                        }).catch((e) => {
                            reject(e);
                        });
                    }

                } else {
                    //无需缓存，正常url加载
                    loadText(xhrURL).then((content) => {
                        resolve(content);
                    }).catch((e) => {
                        reject(e);
                    })
                }
            } else {
                //本地加载
                const content = WXFS.readFileSync(xhrURL, 'utf-8');
                resolve(content);
            }
        });
    }

    onRemoveStart(host, resource) {
        return Promise.resolve();
    }
}



function loadText(xhrURL) {
    return new Promise((resolve, reject) => {

        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if (xhr.status >= 400) {
                const message = `加载失败:${xhrURL}`;
                console.error(message);
                reject(message);
            } else {
                resolve(xhr.responseText);
            }

        }
        xhr.onerror = (e) => {
            const error = new RES.ResourceManagerError(1001, xhrURL);
            console.error(e);
            reject(error);
        }
        xhr.open("get", xhrURL);
        xhr.send();
    })

}

/**
 * 由于微信小游戏限制只有50M的资源可以本地存储，
 * 所以开发者应根据URL进行判断，将特定资源进行本地缓存
 */
function needCache(root, url) {
    if (root.indexOf("miniGame/resource/") >= 0) {
        return true;
    } else {
        return false;
    }
}


const processor = new TextProcessor();
RES.processor.map("text", processor);