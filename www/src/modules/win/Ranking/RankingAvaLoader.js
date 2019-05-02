import ControllLoadCacheUrl from "../../../view/component/ControllLoadCacheUrl.js";
import BaseGroup from "../../../view/BaseGroup.js";

export default class RankingAvaLoader extends BaseGroup {
    constructor(url = null, index) {
        super(game)
        this.index = index;
        this.afterCreate(url);
    }

    afterCreate(url) {
        // console.log(url);
        this.key = url;
        //
        this.ava = new Phaser.Sprite(game, 0, 0, 'songDetailSprites', 'ava-default');
        this.ava.anchor.set(0.5);
        this.ava.scale.set(7 / 20 * window.GameConfig.RESIZE);
        this.addChild(this.ava);
        this.maskAva = new Phaser.Graphics(game, 0, 0);
        this.addMaskAva();
        //
        this.beginLoad();
    }

    addMaskAva() {
        this.maskAva.beginFill();
        this.maskAva.drawCircle(0, 0, 200);
        this.maskAva.endFill();
        this.ava.mask = this.maskAva;
        this.ava.addChild(this.maskAva);
    }

    beginLoad() {
        // console.log(this.key);
        if (game.cache.checkImageKey(this.key)) {
            this.onLoad();
        } else {
            //
            ControllLoadCacheUrl.instance().event.load_image_complate.add(this.onLoad, this);
            ControllLoadCacheUrl.instance().addLoader(this.key);
        }
    }

    onLoad() {
        ControllLoadCacheUrl.instance().event.load_image_complate.remove(this.onLoad, this);
        setTimeout(() => {
            try {
                // this.ava.loadTexture(`${this.key}`);
                if (this.key !== "") {
                    this.ava.loadTexture(this.key);
                } else {
                    this.ava.loadTexture('songDetailSprites', 'ava-default');
                }
            } catch (error) {

            }
        }, 50 * this.index);
    }
}