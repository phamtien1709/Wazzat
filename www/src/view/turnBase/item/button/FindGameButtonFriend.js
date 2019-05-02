import ControllSoundFx from "../../../../controller/ControllSoundFx.js";
import MainData from "../../../../model/MainData.js";
import Language from "../../../../model/Language.js";

export default class FindGameButtonFriend extends Phaser.Sprite {
    constructor(btnConfigs, configs) {
        super(game, btnConfigs.x * window.GameConfig.RESIZE, (game.height - MainData.instance().STANDARD_HEIGHT + btnConfigs.y) * window.GameConfig.RESIZE, btnConfigs.nameAtlas, btnConfigs.nameSprite);
        this.anchor.set(0.5);
        this.configs = configs;
        this.signalInput = new Phaser.Signal();
        this.inputEnabled = true;
        this.events.onInputUp.add(this.onClickBtn, this);
        // this.update = this.update.bind(this);
    }
    update() {
        // LogConsole.log('sdasd');
    }

    addInput(callback, scope) {
        this.removeEventInput(callback, scope);
        this.addEventInput(callback, scope);
        this.inputEnabled = true;
        this.events.onInputUp.add(this.onClickBtn, this);
    }

    onClickBtn() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.signalInput.dispatch(this.configs);
    }

    addTextInCenter(configs) {
        let txtAdded = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, Language.instance().getData("246"), configs.configs);
        txtAdded.anchor.set(0.5);
        this.addChild(txtAdded);
    }

    addEventInput(callback, scope) {
        // callback();
        this.signalInput.add(callback, scope);
    }
    removeEventInput(callback, scope) {
        this.signalInput.remove(callback, scope);
    }
}