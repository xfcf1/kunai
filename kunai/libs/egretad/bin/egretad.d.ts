declare namespace egretad {
    class AD {
        /**广告SDK版本 */
        static VERSION: string;
        /**广告创建完成，可以播放 */
        static CREATED: string;
        /**广告开始加载 */
        static LOADED: string;
        /**广告开始播放 */
        static START: string;
        /**广告播放结束 */
        static END: string;
        /**广告播放出现错误 */
        static ERROR: string;
        /**被点击了 */
        static CLICK: string;
        /**广告对象 */
        private ad;
        /**
         * @param id 从开放平台获取的广告ID
         * @param target 添加到舞台的对象
         */
        constructor(id: string, target?: any);
        /**
         * 增加广告事件监听
         * @param event 事件名称 egretad.AD.事件
         * @param callback 回调方法
         */
        addEventListener(event: string, callback: Function): void;
        /**显示广告 */
        show(): void;
    }
}
