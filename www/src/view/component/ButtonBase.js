import MainData from "../../model/MainData.js";
import ControllSoundFx from "../../controller/ControllSoundFx.js";
export default class ButtonBase extends Phaser.Button {
    constructor(objConfig, callback, scope) {
        super(game, objConfig.x * MainData.instance().scale, objConfig.y * MainData.instance().scale, objConfig.nameAtlas, callback, scope, null, objConfig.nameSprite);
    }

    onInputDownHandler() {
        LogConsole.log("onInputDownHandler------------");
        super.onInputDownHandler();
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
    }
}