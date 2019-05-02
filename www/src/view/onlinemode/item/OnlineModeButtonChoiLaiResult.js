import SpriteBase from "../../component/SpriteBase.js";
import TextBase from "../../component/TextBase.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import Language from "../../../model/Language.js";

export default class OnlineModeButtonChoiLaiResult extends Phaser.Button {
    constructor(objConfig, contentMoney, callback, scope) {
        super(game, objConfig.x, objConfig.y, objConfig.nameAtlas, callback, scope, null, objConfig.nameSprite);

        this.lbChoiLai = new TextBase(objConfig.button_reset_lb_choilai_player_list_result, Language.instance().getData("41"));
        this.addChild(this.lbChoiLai);

        if (contentMoney != "") {
            this.iconKimCuong = new SpriteBase(objConfig.button_reset_icon_KimCuong_player_list_result);
            this.addChild(this.iconKimCuong);

            this.lbMoney = new TextBase(objConfig.button_reset_lb_money_player_list_result, "-" + contentMoney);
            this.lbMoney.x = this.iconKimCuong.x - this.lbMoney.width - 10;
            this.addChild(this.lbMoney);
        } else {
            this.lbChoiLai.x = (this.width - this.lbChoiLai.width) / 2;
        }
    }

    onInputDownHandler() {
        LogConsole.log("onInputDownHandler------------");
        super.onInputDownHandler();
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
    }

    destroy() {
        if (this.iconKimCuong) {
            this.iconKimCuong.destroy();
        }
        this.lbChoiLai.destroy();
        if (this.lbMoney) {
            this.lbMoney.destroy();
        }
        super.destroy();
    }
}