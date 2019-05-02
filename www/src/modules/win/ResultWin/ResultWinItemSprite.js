import ControllSound from "../../../controller/ControllSound.js";
import ControllLoadCacheUrl from "../../../view/component/ControllLoadCacheUrl.js";

export default class ResultWinItemSprite extends Phaser.Sprite {
    constructor(x, y, configValues) {
        super(game, x, y, 'songDetailSprites', 'Ava_Playlist');
        this.anchor.set(0.5);
        this.scale.set(65 / 165 * window.GameConfig.RESIZE);
        this.positionWinConfig = JSON.parse(game.cache.getText('positionWinConfig'));
        this.configValues = configValues;
        this.ktPlay = false;
        this.ktPause = false;
        this.afterInit();
    }

    afterInit() {
        // this.
        this.key = '';
        this.btn;
        this.addUnBtn(this.positionWinConfig.songDetail_btn_pause);
        this.addBtn(this.positionWinConfig.songDetail_btn_play);
    }

    loadAva(url, index) {
        if (url) {
            this.key = url;
        } else {
            this.key = '';
        }
        this.idx = index;
        this.beginLoad();
    }

    addBtn(configs) {
        this.btn = new Phaser.Sprite(game, configs.x, configs.y, configs.nameAtlas, configs.nameSprite);
        this.btn.scale.set(80 / 65 * window.GameConfig.RESIZE);
        this.addChild(this.btn);
    }

    addUnBtn(configs) {
        this.unBtn = new Phaser.Sprite(game, configs.x, configs.y, configs.nameAtlas, configs.nameSprite);
        this.unBtn.scale.set(80 / 65 * window.GameConfig.RESIZE);
        this.unBtn.kill();
        this.addChild(this.unBtn);
    }

    beginLoad() {
        if (game.cache.checkImageKey(this.key)) {
            this.onLoad();
        } else {
            //
            ControllLoadCacheUrl.instance().event.load_image_complate.add(this.onLoad, this);
            ControllLoadCacheUrl.instance().addLoader(this.key);
        }
    }

    playsound() {
        this.btn.kill();
        this.unBtn.revive();
    }

    stopSound() {
        this.btn.revive();
        this.unBtn.kill();
    }

    onLoad() {
        ControllLoadCacheUrl.instance().event.load_image_complate.remove(this.onLoad, this);
        setTimeout(() => {
            if (game.cache.checkImageKey(this.key)) {
                this.loadTexture(this.key);
            }
        }, this.idx * 100);
    }

    get width() {
        return 65;
    }

    get height() {
        return 65;
    }
}