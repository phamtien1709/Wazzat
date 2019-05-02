import ControllSoundFx from "../../controller/ControllSoundFx.js";
import Language from "../../model/Language.js";

export default class SongDetailButtonShare extends Phaser.Sprite {
    constructor(x, y, configs) {
        super(game, x, y, null);
        this.songDetailScreenConfig = JSON.parse(game.cache.getText('songDetailScreenConfig'));
        this.iconShareActive;
        this.txtShareActive;
        this.btnShareActive;
        this.btnShareDisactive;
        this.txtShareDisactive;
        this.iconShareDisactive;
        this.configsValue = configs;
        this.afterInit();
    }

    afterInit() {
        this.addDisactive(this.songDetailScreenConfig.btn_share.disactive);
        this.addActive(this.songDetailScreenConfig.btn_share.active);
    }

    addDisactive(configs) {
        this.btnShareDisactive = new Phaser.Sprite(game, configs.btn.x * window.GameConfig.RESIZE, configs.btn.y * window.GameConfig.RESIZE, configs.btn.nameAtlas, configs.btn.nameSprite);
        this.btnShareDisactive.inputEnabled = true;
        this.btnShareDisactive.events.onInputUp.addOnce(this.onActive, this);
        this.addChild(this.btnShareDisactive);
        //
        this.iconShareDisactive = new Phaser.Sprite(game, configs.icon.x * window.GameConfig.RESIZE, configs.icon.y * window.GameConfig.RESIZE, configs.icon.nameAtlas, configs.icon.nameSprite);
        this.btnShareDisactive.addChild(this.iconShareDisactive);
        this.txtShareDisactive = new Phaser.Text(game, configs.txt.x * window.GameConfig.RESIZE, configs.txt.y * window.GameConfig.RESIZE, Language.instance().getData("263"), configs.txt.configs);
        this.btnShareDisactive.addChild(this.txtShareDisactive);
    }

    addActive(configs) {
        this.btnShareActive = new Phaser.Sprite(game, configs.btn.x * window.GameConfig.RESIZE, configs.btn.y * window.GameConfig.RESIZE, configs.btn.nameAtlas, configs.btn.nameSprite);
        this.btnShareActive.kill();
        this.addChild(this.btnShareActive);
        //
        this.iconShareActive = new Phaser.Sprite(game, configs.icon.x * window.GameConfig.RESIZE, configs.icon.y * window.GameConfig.RESIZE, configs.icon.nameAtlas, configs.icon.nameSprite);
        this.btnShareActive.addChild(this.iconShareActive);
        this.txtShareActive = new Phaser.Text(game, configs.txt.x * window.GameConfig.RESIZE, configs.txt.y * window.GameConfig.RESIZE, Language.instance().getData("262"), configs.txt.configs);
        this.btnShareActive.addChild(this.txtShareActive);
    }

    onActive() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.btnShareDisactive.destroy();
        this.btnShareActive.revive();
    }
}