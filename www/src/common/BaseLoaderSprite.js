import ControllLoadCacheUrl from "../view/component/ControllLoadCacheUrl.js";

export default class BaseLoaderSprite extends Phaser.Group {
    constructor(defaultSprite) {
        super(game);

        this.afterCreate(defaultSprite);
    }

    afterCreate(defaultSprite) {
        this.url = "";
        this.ava = new Phaser.Sprite(game, 0, 0, defaultSprite);
        this.addChild(this.ava);
    }

    setSize(_width, height) {
        this.ava.width = width;
        this.ava.height = _height;
    }

    beginLoad(url) {
        this.url = url;
        if (game.cache.checkImageKey(this.url)) {
            this.loadComplete();
        } else {
            ControllLoadCacheUrl.instance().event.load_image_complate.add(this.loadComplete, this);
            ControllLoadCacheUrl.instance().addLoader(url);
        }
    }

    loadStart() {
        LogConsole.log("loadStart");
    }
    loadComplete() {
        ControllLoadCacheUrl.instance().event.load_image_complate.remove(this.loadComplete, this);
        LogConsole.log("loadComplete");
        this.ava.loadTexture(this.url);
    }
}