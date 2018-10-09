const fileutil = require('./file-util');
const path = fileutil.path;
const fs = fileutil.fs;
const WXFS = wx.getFileSystemManager();


/**
 * 重写的图片加载器，代替引擎默认的图片加载器
 * 该代码中包含了大量日志用于辅助开发者调试
 * 正式上线时请开发者手动删除这些注释
 */
class ImageProcessor {



    onLoadStart(host, resource) {
        let scale9Grid;
        const {
            root,
            url,
            scale9grid

        } = resource;

        if (scale9grid) {
            const list = resource.scale9grid.split(",");
            scale9Grid = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
        }

        let imageSrc = root + url;
        if (RES['getVirtualUrl']) {
            imageSrc = RES['getVirtualUrl'](imageSrc);
        }
        if (path.isRemotePath(imageSrc)) { //判断是本地加载还是网络加载
            if (!needCache(root, url)) {
                //无需缓存加载
                return loadImage(imageSrc, scale9Grid);
            } else {
                //通过缓存机制加载
                const fullname = path.getLocalFilePath(imageSrc);
                if (fs.existsSync(fullname)) {
                    // console.log('缓存命中:', url, target)
                    return loadImage(path.getWxUserPath(fullname), scale9Grid);
                } else {
                    return download(imageSrc, fullname).then(
                        (filePath) => {
                            fs.setFsCache(fullname, 1);
                            return loadImage(filePath, scale9Grid);
                        },

                        (error) => {
                            console.error(error);
                            return;
                        });
                }
            }
        } else {
            //正常本地加载
            return loadImage(imageSrc, scale9Grid);
        }
    }

    onRemoveStart(host, resource) {
        let texture = host.get(resource);
        texture.dispose();
        return Promise.resolve();
    }
}



function loadImage(imageURL, scale9grid) {
    return new Promise((resolve, reject) => {
        const image = wx.createImage();


        image.onload = () => {
            const bitmapdata = new egret.BitmapData(image);
            const texture = new egret.Texture();
            texture._setBitmapData(bitmapdata);
            if (scale9grid) {
                texture["scale9Grid"] = scale9grid;
            }
            setTimeout(() => {
                resolve(texture);
            }, 0);

        }
        image.onerror = (e) => {
            console.error(e);
            const error = new RES.ResourceManagerError(1001, imageURL);
            reject(error);
        }
        image.src = imageURL;
    })
}


function download(url, target) {

    return new Promise((resolve, reject) => {

        const dirname = path.dirname(target);
        fs.mkdirsSync(dirname);
        const file_target = path.getWxUserPath(target);
        wx.downloadFile({
            url: url,
            filePath: file_target,
            success: (v) => {
                if (v.statusCode >= 400) {
                    try {
                        WXFS.accessSync(file_target);
                        WXFS.unlinkSync(file_target);
                    } catch (e) {

                    }
                    const message = `加载失败:${url}`;
                    reject(message);
                } else {
                    resolve(file_target);
                }
            },
            fail: (e) => {
                const error = new RES.ResourceManagerError(1001, url);
                reject(error);
            }
        })
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


const processor = new ImageProcessor();
RES.processor.map("image", processor);