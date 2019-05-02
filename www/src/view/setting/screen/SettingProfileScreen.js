import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import SettingProfileAvatar from "../items/SettingProfileAvatar.js";
import ButtonBase from "../../component/ButtonBase.js";
import TextBase from "../../component/TextBase.js";
import EventGame from "../../../controller/EventGame.js";
import Language from "../../../model/Language.js";

export default class SettingProfileScreen extends Phaser.Button {
    constructor() {
        super(game, 0, 0, 'bg-playlist');
        this.positionSetting = JSON.parse(game.cache.getText('positionSetting'));
        this.signalInputX = new Phaser.Signal();
        this.afterInit();
    }

    afterInit() {
        this.addEventExtension();
        this.addHeaderTab(this.positionSetting.header);
        this.addListSetting();
    }

    addHeaderTab(configs) {
        this.headerTab = new Phaser.Sprite(game, configs.tab_chonplaylist.x * window.GameConfig.RESIZE, configs.tab_chonplaylist.y * window.GameConfig.RESIZE, configs.tab_chonplaylist.nameAtlas, configs.tab_chonplaylist.nameSprite);
        this.addChild(this.headerTab);
        //
        this.btnBack;
        this.addButtonBack(configs.btn_back);
        this.addTxtSetting(configs.txt_setting_profile);
    }

    addButtonBack(configs) {
        this.btnBack = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.btnBack.anchor.set(0.5);
        this.btnBack.inputEnabled = true;
        this.btnBack.events.onInputUp.add(this.onBack, this);
        this.headerTab.addChild(this.btnBack);
    }

    onBack() {
        //console.log('HERE HERE HERE');
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.signalInputX.dispatch();
        let tween = game.add.tween(this).to({
            x: 640 * window.GameConfig.RESIZE
        }, 200, "Linear", false);
        tween.start();
        if (this.ava) {
            this.ava.closeDOM();
        }
        tween.onComplete.add(() => {
            this.destroy();
        }, this);
    }

    addTxtSetting(configs) {
        this.txtQuest = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, Language.instance().getData('299'), configs.configs);
        this.txtQuest.anchor.set(0.5, 0);
        this.headerTab.addChild(this.txtQuest);
    }

    addListSetting() {
        this.ava;
        this.location;
        this.description;
        this.name;
        //
        this.addAva();
        // this.addBtnSave();
    }

    addAva() {
        this.ava = new SettingProfileAvatar();
        this.ava.event.reloadScreen.add(this.reloadScreen, this);
        this.addChild(this.ava);
    }

    reloadScreen() {
        this.ava.destroy();
        // this.timeAddAva = game.time.events.add(Phaser.Timer.SECOND * 100, this.addAva, this);
        this.addAva();
    }

    addBtnSave() {
        this.btnSave = new ButtonBase(this.positionSetting.setting_profile.btn_save, this.clickSave, this);
        this.btnSave.anchor.set(0.5);
        let txtBtn = new TextBase(this.positionSetting.setting_profile.txt_btn_save, this.positionSetting.setting_profile.txt_btn_save.text);
        txtBtn.anchor.set(0.5);
        this.btnSave.addChild(txtBtn);
        this.addChild(this.btnSave);
    }

    clickSave() {

    }

    addEventExtension() {
        // LogConsole.log('QuestAndAchievementScreen');
        EventGame.instance().event.backButton.add(this.onBack, this);
    }

    removeEventExtension() {
        EventGame.instance().event.backButton.remove(this.onBack, this);
    }


    destroy() {
        this.removeEventExtension();
        if (this.ava) {
            this.ava.closeDOM();
        }
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}