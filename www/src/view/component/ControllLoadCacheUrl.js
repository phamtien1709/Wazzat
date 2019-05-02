export default class ControllLoadCacheUrl {
    constructor() {
        this.arrUrl = [];
        this.ktLoad = false;
        this.event = {
            load_image_complate: new Phaser.Signal()
        }
        this.loader = new Phaser.Loader(game);
        this.loader.crossOrigin = 'anonymous';
        this.loader.onLoadStart.add(this.loadStart, this);
        this.loader.onLoadComplete.add(this.loadComplete, this);
    }

    static instance() {
        if (this.controlLoad) {

        } else {
            this.controlLoad = new ControllLoadCacheUrl();
        }
        return this.controlLoad;
    }

    loadStart() {
        console.log("loadStart");
    }
    loadComplete() {
        console.log("loadComplete");
        this.event.load_image_complate.dispatch();
        this.arrUrl.splice(0, 1);
        if (this.arrUrl.length > 0) {
            this.beginLoad();
        } else {
            this.ktLoad = false;
        }
    }

    addLoader(url) {
        this.arrUrl.push(url);

        if (this.ktLoad === false) {
            this.beginLoad();
        }
    }

    beginLoad() {
        this.ktLoad = true;
        if (this.arrUrl.length > 0) {
            let url = this.arrUrl[0];
            if (game.cache.checkImageKey(url)) {
                this.arrUrl.splice(0, 1);
                if (this.arrUrl.length > 0) {
                    this.beginLoad();
                } else {
                    this.ktLoad = false;
                }
            } else {
                this.loader.image(url, url);
                this.loader.start();
            }
        } else {
            this.ktLoad = true;
        }
    }

    resetLoad() {
        this.arrUrl = [];
        this.ktLoad = false;
        this.loader.reset();
        this.loader.removeAll();
    }
}