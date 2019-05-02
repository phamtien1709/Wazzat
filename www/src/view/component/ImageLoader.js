import ControllLoadCacheUrl from "./ControllLoadCacheUrl.js";

export default class ImageLoader extends Phaser.Image {
    constructor(defaultAtlas = "otherSprites", defaultImage = "Nhactre") {
        super(game, 0, 0, defaultAtlas, defaultImage);
        this.defaultImage = defaultImage;
        this.defaultAtlas = defaultAtlas;
        this._width = 0;
        this._height = 0;
        this.countLoad = 0;
        this.isDefault = true;
        this.icon = null;
        this.afterCreate();
    }



    afterCreate() {
        this.url = "";
        this.loader = null;
        this.idTimeOut = null;
    }

    setSize(_width, _height) {
        this._width = _width;
        this._height = _height;

        this.width = _width;
        this.height = _height;
    }

    beginLoad(url, idx) {
        this.url = url;
        this.idx = idx;

        this.clearTimeout();

        if (this.url === "") {
            this.default();
        } else {
            if (game.cache.checkImageKey(this.url)) {
                this.loadImageComplete();
            } else {
                ControllLoadCacheUrl.instance().addLoader(this.url);
                ControllLoadCacheUrl.instance().event.load_image_complate.add(this.loadImageComplete, this);
            }
        }
    }

    default() {
        this.removeImage();
        this.clearTimeout();
        if (this.isDefault === true) {

        } else {
            this.isDefault = true;
            this.width = this._width;
            this.height = this._height;
        }
    }

    loadImageComplete() {
        // LogConsole.log("loadComplete : " + this.url);
        this.clearTimeout();
        if (game.cache.checkImageKey(this.url)) {
            ControllLoadCacheUrl.instance().event.load_image_complate.remove(this.loadImageComplete, this);
            this.idTimeOut = setTimeout(() => {
                this.showImage();
            }, 50 * (this.idx + 1));
        } else {

        }
    }

    clearTimeout() {
        if (this.idTimeOut !== null) {
            clearTimeout(this.idTimeOut);
            this.idTimeOut = null;
        }
    }

    showImage() {
        // LogConsole.log("showImage----- :  " + url);
        if (game.cache.checkImageKey(this.url)) {
            this.isDefault = false;
            this.removeImage();
            this.icon = game.add.image(0, 0, this.url);
            this.addChild(this.icon);
            this.width = this._width;
            this.height = this._height;
        } else {

        }
    }

    removeImage() {
        if (this.icon !== null) {
            this.removeChild(this.icon);
            this.icon.destroy();
            this.icon = null;
        }
    }

    destroy() {


        this.clearTimeout();
        this.removeImage();

        super.destroy();
    }
}