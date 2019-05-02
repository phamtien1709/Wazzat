import EventGame from "../../../controller/EventGame.js";
import ControllLoadCacheUrl from "../../component/ControllLoadCacheUrl.js";

export default class BigAvatar extends Phaser.Sprite {
    constructor(avaUrl = null) {
        super(game, 0, 0, 'screen-dim2');
        this.avaUrl = avaUrl;
        this.event = {
            back: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {
        this.addEventExtension();
        this.bgBtn;
        this.avatar;
        this.addBgBtn();
        this.addAva();
        this.loadAva();
    }

    addBgBtn() {
        this.bgBtn = new Phaser.Button(game, 0, 0, 'screen-dim2');
        this.bgBtn.width = game.width;
        this.bgBtn.height = game.height;
        this.bgBtn.events.onInputUp.add(this.onClickBg, this);
        this.addChild(this.bgBtn);
    }
    onClickBg() {
        this.event.back.dispatch();
        this.destroy();
    }

    addAva() {
        this.avatar = new Phaser.Button(game, 320, 400, 'otherSprites', () => { }, this, null, 'ava-default');
        this.avatar.anchor.set(0.5);
        this.addChild(this.avatar);
    }

    loadAva() {
        if (this.avaUrl !== null) {
            this.key = this.avaUrl;
            if (game.cache.checkImageKey(this.key)) {
                this.onLoad();
            } else {
                //
                ControllLoadCacheUrl.instance().event.load_image_complate.add(this.onLoad, this);
                ControllLoadCacheUrl.instance().addLoader(this.key);
            }
        }
    }

    addEventExtension() {
        EventGame.instance().event.backButton.add(this.onClickBg, this);
    }

    removeEventExtension() {
        EventGame.instance().event.backButton.remove(this.onClickBg, this);
    }

    onLoad() {
        ControllLoadCacheUrl.instance().event.load_image_complate.remove(this.onLoad, this);
        if (game.cache.checkImageKey(this.key)) {
            if (this !== undefined) {
                this.avatar.loadTexture(this.key);
                this.avatar.width = 300;
                this.avatar.height = 300;
            }
        }
    }

    destroy() {
        this.removeEventExtension();
        super.destroy();
    }
}