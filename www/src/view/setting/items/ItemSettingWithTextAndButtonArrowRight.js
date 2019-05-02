import SpriteBase from "../../component/SpriteBase.js";
import TextBase from "../../component/TextBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import BaseGroup from "../../BaseGroup.js";

export default class ItemSettingWithTextAndButtonArrowRight extends BaseGroup {
    constructor() {
        super(game);
        this.positionSetting = JSON.parse(game.cache.getText('positionSetting'));
        this.event = {
            chooseSetting: new Phaser.Signal()
        };
        this.name;
        this.btn;
        this.txtOnRight;
        this.addLine();
    }

    addLine() {
        let line = new SpriteBase(this.positionSetting.setting_item.line);
        this.addChild(line);
    }

    addTxtOnright(string) {
        this.txtOnRight = new TextBase(this.positionSetting.setting_item.txt_on_right, string);
        this.txtOnRight.anchor.set(1, 0);
        this.addChild(this.txtOnRight);
    }

    static get SETTING_ACCOUNT_VIP() {
        return "setting_account_vip";
    }

    static get SETTING_ACCOUNT_USERNAME() {
        return "setting_account_username";
    }

    static get SETTING_ACCOUNT_EMAIL() {
        return "setting_account_email";
    }

    static get SETTING_ACCOUNT_PASSWORD() {
        return "setting_account_password";
    }

    static get SETTING_ACCOUNT_GENDER() {
        return "setting_account_gender";
    }

    addType(type) {
        this.type = type;
    }

    addNameSetting(name) {
        this.name = new TextBase(this.positionSetting.setting_item.name, name);
        this.addChild(this.name);
    }

    addButtonRight() {
        this.btn = new ButtonBase(this.positionSetting.setting_item.button_right, this.clickButton, this);
        this.btn.anchor.set(0.5);
        this.addChild(this.btn);
    }

    addButtonTop() {

    }

    addButtonBottom() {

    }

    //
    setDisactive() {
        this.alpha = 0.4;
    }

    clickButton() {
        this.event.chooseSetting.dispatch(this.type);
    }

    get height() {
        return 102 * window.GameConfig.RESIZE;
    }
}