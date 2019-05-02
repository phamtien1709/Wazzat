import ControllSoundFx from "../../controller/ControllSoundFx.js";
import Language from "../../model/Language.js";

export default class SongDetailButtonLike extends Phaser.Sprite {
    constructor(x, y, configs) {
        super(game, x, y, null);
        this.songDetailScreenConfig = JSON.parse(game.cache.getText('songDetailScreenConfig'));
        this.iconLikeActive;
        this.txtLikeActive;
        this.btnLikeActive;
        this.btnLikeDisactive;
        this.txtLikeDisactive;
        this.iconLikeDisactive;
        this.configsValue = configs;
        this.afterInit();
    }

    afterInit() {
        this.addDisactive(this.songDetailScreenConfig.btn_like.disactive);
        this.addActive(this.songDetailScreenConfig.btn_like.active);
    }

    addDisactive(configs) {
        this.btnLikeDisactive = new Phaser.Sprite(game, configs.btn.x * window.GameConfig.RESIZE, configs.btn.y * window.GameConfig.RESIZE, configs.btn.nameAtlas, configs.btn.nameSprite);
        this.btnLikeDisactive.inputEnabled = true;
        this.btnLikeDisactive.events.onInputUp.addOnce(this.onActive, this);
        this.addChild(this.btnLikeDisactive);
        //
        this.iconLikeDisactive = new Phaser.Sprite(game, configs.icon.x * window.GameConfig.RESIZE, configs.icon.y * window.GameConfig.RESIZE, configs.icon.nameAtlas, configs.icon.nameSprite);
        this.btnLikeDisactive.addChild(this.iconLikeDisactive);
        this.txtLikeDisactive = new Phaser.Text(game, configs.txt.x * window.GameConfig.RESIZE, configs.txt.y * window.GameConfig.RESIZE, Language.instance().getData("265"), configs.txt.configs);
        this.btnLikeDisactive.addChild(this.txtLikeDisactive);
    }

    addActive(configs) {
        this.btnLikeActive = new Phaser.Sprite(game, configs.btn.x * window.GameConfig.RESIZE, configs.btn.y * window.GameConfig.RESIZE, configs.btn.nameAtlas, configs.btn.nameSprite);
        this.btnLikeActive.kill();
        this.addChild(this.btnLikeActive);
        //
        this.iconLikeActive = new Phaser.Sprite(game, configs.icon.x * window.GameConfig.RESIZE, configs.icon.y * window.GameConfig.RESIZE, configs.icon.nameAtlas, configs.icon.nameSprite);
        this.btnLikeActive.addChild(this.iconLikeActive);
        this.txtLikeActive = new Phaser.Text(game, configs.txt.x * window.GameConfig.RESIZE, configs.txt.y * window.GameConfig.RESIZE, Language.instance().getData("264"), configs.txt.configs);
        this.btnLikeActive.addChild(this.txtLikeActive);
    }

    onActive() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.btnLikeDisactive.destroy();
        this.btnLikeActive.revive();
    }
}