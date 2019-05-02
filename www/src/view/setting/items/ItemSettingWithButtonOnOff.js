import SpriteBase from "../../component/SpriteBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import TextBase from "../../component/TextBase.js";
import BaseGroup from "../../BaseGroup.js";

export default class ItemSettingWithButtonOnOff extends BaseGroup {
    constructor() {
        super(game);
        this.positionSetting = JSON.parse(game.cache.getText('positionSetting'));
        this.event = {
            onSetting: new Phaser.Signal(),
            offSetting: new Phaser.Signal()
        };
        this.name;
        this.btnOn;
        this.btnOff;
        this.boolean = false;
        this.addLine();
    }

    addType(type) {
        this.type = type;
    }

    addNameSetting(name) {
        this.name = new TextBase(this.positionSetting.setting_item.name, name);
        this.addChild(this.name);
    }

    addButton(boolean) {
        this.boolean = boolean;
        if (boolean == true) {
            this.addButtonOn(1, 1);
            this.addButtonOff(0, 1);
        } else {
            this.addButtonOn(0, 1);
            this.addButtonOff(1, 1);
        }
        this.txtBtnOn = new TextBase(this.positionSetting.setting_item.txt_button_on, this.positionSetting.setting_item.txt_button_on.text);
        this.txtBtnOn.kill();
        this.txtBtnOff = new TextBase(this.positionSetting.setting_item.txt_button_off, this.positionSetting.setting_item.txt_button_off.text);
        this.txtBtnOff.kill();
        this.addChild(this.txtBtnOn);
        this.addChild(this.txtBtnOff);
        //
        if (this.boolean == true) {
            this.txtBtnOn.revive();
        } else {
            this.txtBtnOff.revive();
        }
    }

    addButtonOn(scaleX, scaleY) {
        this.btnOn = new ButtonBase(this.positionSetting.setting_item.button_on, this.clickOn, this);
        this.btnOn.scale.set(scaleX, scaleY);
        this.addChild(this.btnOn);
    }

    addButtonOff(scaleX, scaleY) {
        this.btnOff = new ButtonBase(this.positionSetting.setting_item.button_off, this.clickOff, this);
        this.btnOff.anchor.set(1, 0);
        this.btnOff.scale.set(scaleX, scaleY);
        this.addChild(this.btnOff);
    }

    clickOn() {
        // LogConsole.log('clickOn');
        this.boolean = false;
        this.event.offSetting.dispatch();
        this.addTweenButton();
    }

    clickOff() {
        // LogConsole.log('clickOff');
        this.boolean = true;
        this.event.onSetting.dispatch();
        this.addTweenButton();
    }

    addTweenButton() {
        // LogConsole.log('addTweenButton');
        //
        if (this.boolean == true) {
            this.txtBtnOn.revive();
            this.txtBtnOff.kill();
            //
            let tweenOn = game.add.tween(this.btnOn.scale).to({ x: 1, y: 1 }, 250, "Linear", false);
            tweenOn.start();
            let tweenOff = game.add.tween(this.btnOff.scale).to({ x: 0, y: 1 }, 250, "Linear", false);
            tweenOff.start();
        } else {
            this.txtBtnOff.revive();
            this.txtBtnOn.kill();
            //
            let tweenOn = game.add.tween(this.btnOff.scale).to({ x: 1, y: 1 }, 250, "Linear", false);
            tweenOn.start();
            let tweenOff = game.add.tween(this.btnOn.scale).to({ x: 0, y: 1 }, 250, "Linear", false);
            tweenOff.start();
        }
        //
    }
    //
    setDisactive() {
        this.alpha = 0.4;
        this.inputEnabled = false;
        this.btnOff.inputEnabled = false;
        this.btnOn.inputEnabled = false;
    }

    static get SOUND_FX() {
        return "setting_game_soundfx";
    }

    static get INVITE_PARTY() {
        return "setting_game_invite_party";
    }

    addLine() {
        let line = new SpriteBase(this.positionSetting.setting_item.line);
        this.addChild(line);
    }

    get height() {
        return 102 * window.GameConfig.RESIZE;
    }
}