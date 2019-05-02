import TextBase from "../component/TextBase.js";
import SpriteBase from "../component/SpriteBase.js";
import SocketController from "../../controller/SocketController.js";
import BaseGroup from "../BaseGroup.js";

export default class LevelExpCurrent extends BaseGroup {
    constructor(current_exp_level, next_exp_level, experience_score) {
        super(game)
        this.positionUserProfile = JSON.parse(game.cache.getText('positionUserProfile'));
        this.current_exp_level = current_exp_level;
        this.next_exp_level = next_exp_level;
        this.percentLevelCurrent = 0;
        if (SocketController.instance().dataMySeft) {
            this.experience_score = experience_score;
        }
        this.afterInit();
    }

    afterInit() {
        this.calCurrentExpLevel = this.experience_score - this.current_exp_level;
        this.calExpLevel = this.next_exp_level - this.current_exp_level;
        //
        this.txt = new TextBase(this.positionUserProfile.profile_exp_current_txt, `Level hiện tại (${this.calCurrentExpLevel}/${this.calExpLevel})`);
        this.txt.anchor.set(0.5);
        //
        this.exp_current;
        this.ext_require;
        this.exp_current = new SpriteBase(this.positionUserProfile.profile_current_level);
        this.exp_current.anchor.set(0, 0.5);
        this.ext_require = new SpriteBase(this.positionUserProfile.profile_require_level);
        this.ext_require.anchor.set(0, 0.5);
        //
        this.calculatePercentLevelCurrent();
        this.addChild(this.txt);
        this.addChild(this.ext_require);
        this.addChild(this.exp_current);
    }

    calculatePercentLevelCurrent() {
        this.percentLevelCurrent = (this.calCurrentExpLevel / this.calExpLevel).toFixed(1);
        this.exp_current.scale.set(this.percentLevelCurrent, 1);
    }
}