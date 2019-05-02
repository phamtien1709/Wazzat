import ControllLoadCacheUrl from "../view/component/ControllLoadCacheUrl.js";

export default class ImageLoader {
    constructor(x, y, defaultSprite, thumb, index) {
        this.thumbUrl = thumb;
        this.index = index;
        this.sprite = game.add.sprite(x, y, 'songDetailSprites', defaultSprite);
        this.event = {
            loadAvaDone: new Phaser.Signal()
        }
        this.loadUrl();
    }

    loadUrl() {
        if (game.cache.checkImageKey(this.thumbUrl)) {
            this.onLoad();
        } else {
            ControllLoadCacheUrl.instance().event.load_image_complate.add(this.onLoad, this);
            ControllLoadCacheUrl.instance().addLoader(this.thumbUrl);
        }
    }

    loadStart() {

    }

    onLoad() {
        ControllLoadCacheUrl.instance().event.load_image_complate.remove(this.onLoad, this);
        setTimeout(() => {
            try {
                if (game.cache.checkImageKey(this.thumbUrl)) {
                    if (this.thumbUrl !== "") {
                        this.sprite.loadTexture(this.thumbUrl);
                    } else {
                        this.sprite.loadTexture('songDetailSprites', 'ava-default');
                    }
                    this.event.loadAvaDone.dispatch(this.thumbUrl);
                } else {
                    this.event.loadAvaDone.dispatch(this.thumbUrl);
                }
            } catch (error) {

            }
        }, 100 * this.index);
    }
}