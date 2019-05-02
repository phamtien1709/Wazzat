import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import ItemSettingWithButtonOnOff from "../items/ItemSettingWithButtonOnOff.js";
import ListView from "../../../../libs/listview/list_view.js";
import EventGame from "../../../controller/EventGame.js";
import Language from "../../../model/Language.js";


export default class SettingGameScreen extends Phaser.Button {
    constructor() {
        super(game, 0, 0, "bg-playlist");
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
        this.addTxtSetting(configs.txt_setting_game);
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
        tween.onComplete.add(() => {
            this.destroy();
        }, this);
    }

    addTxtSetting(configs) {
        this.txtQuest = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, Language.instance().getData("291"), configs.configs);
        this.txtQuest.anchor.set(0.5, 0);
        this.headerTab.addChild(this.txtQuest);
    }

    addListSetting() {
        var gr = new Phaser.Group(game, this);
        gr.x = 0;
        gr.y = 109 * window.GameConfig.RESIZE;
        this.addChild(gr);
        const bounds = new Phaser.Rectangle(0 * window.GameConfig.RESIZE, 0, 640 * window.GameConfig.RESIZE, 885 * window.GameConfig.RESIZE);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 0,
            searchForClicks: true
        }
        this.listView = new ListView(game, gr, bounds, options);
        //
        this.settingSoundFx;
        this.settingInviteParty;
        //
        this.addSettingSoundFx();
        this.addSettingInviteParty();
    }

    addSettingSoundFx() {
        this.settingSoundFx = new ItemSettingWithButtonOnOff();
        this.settingSoundFx.event.onSetting.add(this.onSettingSoundFX, this);
        this.settingSoundFx.event.offSetting.add(this.offSettingSoundFX, this);
        this.settingSoundFx.addType(ItemSettingWithButtonOnOff.SOUND_FX);
        this.settingSoundFx.addNameSetting(Language.instance().getData("289"));
        this.settingSoundFx.addButton(window.GameConfig.SOUND_FX);
        this.listView.add(this.settingSoundFx);
    }
    onSettingSoundFX() {
        window.GameConfig.SOUND_FX = true;
    }
    offSettingSoundFX() {
        window.GameConfig.SOUND_FX = false;
    }

    addSettingInviteParty() {
        this.settingInviteParty = new ItemSettingWithButtonOnOff();
        this.settingInviteParty.addType(ItemSettingWithButtonOnOff.INVITE_PARTY);
        this.settingInviteParty.addNameSetting(Language.instance().getData("290"));
        this.settingInviteParty.addButton(true);
        this.settingInviteParty.setDisactive();
        this.listView.add(this.settingInviteParty);
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
        this.listView.removeAll();
        this.listView.destroy();
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