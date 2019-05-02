import TextBase from "../../component/TextBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import SpriteBase from "../../component/SpriteBase.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import MainData from "../../../model/MainData.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class ItemSettingMain extends BaseGroup {
    constructor() {
        super(game);
        this.positionSetting = JSON.parse(game.cache.getText('positionSetting'));
        this.event = {
            chooseSetting: new Phaser.Signal()
        };
        this.name;
        this.btn;
        this.addLine();
    }

    addLine() {
        let line = new SpriteBase(this.positionSetting.setting_item.line);
        this.addChild(line);
    }

    addLanguage() {
        this.txtLanguage = new TextBase(this.positionSetting.setting_item.config_language, Language.instance().getData("304"));
        this.addChild(this.txtLanguage);
    }

    addVersion() {
        if (MainData.instance().platform == "and") {
            this.txtVersion = new TextBase(this.positionSetting.setting_item.config_version, `${MainData.instance().platform.toUpperCase()} ${this.positionSetting.setting_item.config_version.text} ${MainData.VERSION_AND}`);
            this.txtVersion.anchor.set(1, 0);
            this.addChild(this.txtVersion);
        } else {
            this.txtVersion = new TextBase(this.positionSetting.setting_item.config_version, `${MainData.instance().platform.toUpperCase()} ${this.positionSetting.setting_item.config_version.text} ${MainData.VERSION_IOS}`);
            this.txtVersion.anchor.set(1, 0);
            this.addChild(this.txtVersion);
        }
    }

    static get SETTING_GAME() {
        return "setting_game";
    }

    static get SETTING_ACCOUNT() {
        return "setting_account";
    }

    static get SETTING_PROFILE() {
        return "setting_profile";
    }

    static get SETTING_NOTI() {
        return "setting_noti";
    }

    static get SETTING_SECRET() {
        return "setting_secret";
    }

    static get SETTING_LANGUAGE() {
        return "setting_language";
    }

    static get SETTING_TERMS() {
        return "setting_terms";
    }

    static get SETTING_FOLLOW() {
        return "setting_follow";
    }

    static get GIFT_CODE() {
        return "gift_code";
    }

    static get REPORT_BUG() {
        return "report_bug";
    }

    static get SYNS_FB() {
        return "syns_fb";
    }

    static get VERSION_PLATFORM() {
        return "version_platform";
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

    addFacebookIcon() {
        this.fbIcon = new SpriteBase(this.positionSetting.setting_item.fb_icon);
        this.addChild(this.fbIcon);
        this.fbIcon.inputEnabled = true;
        this.fbIcon.events.onInputUp.add(this.clickFBIcon, this);
    }
    clickFBIcon() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        //
        window.open('https://www.facebook.com/wazzat.sotaiamnhac', '_system');
    }

    addInstagramIcon() {
        this.instaIcon = new SpriteBase(this.positionSetting.setting_item.insta_icon);
        this.addChild(this.instaIcon);
        this.instaIcon.inputEnabled = true;
        this.instaIcon.events.onInputUp.add(this.clickInstaIcon, this);
    }
    clickInstaIcon() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        //
        window.open('https://www.instagram.com/wazzat.sotaiamnhac', '_system');
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