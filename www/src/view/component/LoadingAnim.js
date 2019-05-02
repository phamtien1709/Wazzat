import Language from "../../model/Language.js";
import BaseView from "../BaseView.js";

export default class LoadingAnim extends BaseView {
    constructor() {
        super(game)
        this.positionPlayConfig = JSON.parse(game.cache.getText('positionPlayConfig'));
        this.afterInit();
    }

    afterInit() {
        this.addAnim();
        this.addTextLoading();
    }

    addTextLoading() {
        this.txtLoading = new Phaser.Text(game, this.positionPlayConfig.txtLoading.x * window.GameConfig.RESIZE, this.positionPlayConfig.txtLoading.y * window.GameConfig.RESIZE, Language.instance().getData(185), this.positionPlayConfig.txtLoading.configs);
        this.txtLoading.anchor.set(0.5);
        this.addChild(this.txtLoading);
    }

    addAnim() {
        this.animLoad = new Phaser.Sprite(game, 320 * window.GameConfig.RESIZE, 600 * window.GameConfig.RESIZE, 'loadingPlay');
        let runAnimLoad = this.animLoad.animations.add('run_anim_load');
        this.animLoad.anchor.set(0.5);
        this.animLoad.animations.play('run_anim_load', 32, true);
        this.addChild(this.animLoad);
    }

    moveTxtLoading() {
        this.txtLoading.y = -200 * window.GameConfig.RESIZE;
    }
    kill() {
        this.callAll("kill");
    }
    revive() {
        this.callAll("revive");
    }
}