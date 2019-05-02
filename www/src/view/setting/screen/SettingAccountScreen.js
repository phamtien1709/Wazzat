import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import ListView from "../../../../libs/listview/list_view.js";
import ItemSettingWithTextAndButtonArrowRight from "../items/ItemSettingWithTextAndButtonArrowRight.js";
import SocketController from "../../../controller/SocketController.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import SettingChooseGender from "../items/SettingChooseGender.js";
import AjaxServerMail from "../../../common/AjaxServerMail.js";
import EventGame from "../../../controller/EventGame.js";
import Language from "../../../model/Language.js";

export default class SettingAccountScreen extends Phaser.Button {
    constructor() {
        super(game, 0, 0, 'bg-playlist');
        this.positionSetting = JSON.parse(game.cache.getText('positionSetting'));
        this.signalInputX = new Phaser.Signal();
        this.afterInit();
    }

    afterInit() {
        this.settingGender = null;
        this.addHeaderTab(this.positionSetting.header);
        this.addListSetting();
    }
    //
    addEventExtension() {
        SocketController.instance().events.onUserVarsUpdate.add(this.onUpdateUserVars, this);
        EventGame.instance().event.backButton.add(this.onBack, this);
    }
    removeEventExtension() {
        SocketController.instance().events.onUserVarsUpdate.remove(this.onUpdateUserVars, this);
        EventGame.instance().event.backButton.remove(this.onBack, this);
    }

    onUpdateUserVars() {
        this.userName.txtOnRight.setText(SocketController.instance().dataMySeft.user_name);
        this.gender.txtOnRight.setText(SocketController.instance().dataMySeft.gender);
    }

    addHeaderTab(configs) {
        this.headerTab = new Phaser.Sprite(game, configs.tab_chonplaylist.x * window.GameConfig.RESIZE, configs.tab_chonplaylist.y * window.GameConfig.RESIZE, configs.tab_chonplaylist.nameAtlas, configs.tab_chonplaylist.nameSprite);
        this.addChild(this.headerTab);
        //
        this.btnBack;
        this.addButtonBack(configs.btn_back);
        this.addTxtSetting(configs.txt_setting_account);
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
        let tween = game.add.tween(this).to({ x: 640 * window.GameConfig.RESIZE }, 200, "Linear", false);
        tween.start();
        tween.onComplete.add(() => {
            this.destroy();
        }, this);
    }

    addTxtSetting(configs) {
        this.txtQuest = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, Language.instance().getData("297"), configs.configs);
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
        this.vip;
        this.userName;
        this.gender;
        this.email;
        this.password;
        //
        this.addVip();
        this.addUserName();
        this.addGender();
        this.addEmail();
        this.addPassword();
        this.addEventExtension();
    }

    addVip() {
        this.vip = new ItemSettingWithTextAndButtonArrowRight();
        this.vip.addNameSetting(Language.instance().getData("292"));
        this.vip.addType(ItemSettingWithTextAndButtonArrowRight.SETTING_ACCOUNT_VIP);
        // this.vip.addButtonRight();
        this.vip.addTxtOnright(Language.instance().getData("298"));
        this.vip.event.chooseSetting.add(this.chooseSetting, this);
        this.listView.add(this.vip);
    }

    addGender() {
        this.gender = new ItemSettingWithTextAndButtonArrowRight();
        this.gender.addNameSetting(Language.instance().getData("294"));
        this.gender.addType(ItemSettingWithTextAndButtonArrowRight.SETTING_ACCOUNT_GENDER);
        this.gender.addButtonRight();
        if (SocketController.instance().socket.mySelf !== null) {
            this.gender.addTxtOnright(SocketController.instance().dataMySeft.gender);
        } else {
            this.gender.addTxtOnright(Language.instance().getData("298"));
        }
        this.gender.event.chooseSetting.add(this.chooseSetting, this);
        this.listView.add(this.gender);
    }

    addUserName() {
        this.userName = new ItemSettingWithTextAndButtonArrowRight();
        this.userName.addNameSetting(Language.instance().getData("293"));
        this.userName.addType(ItemSettingWithTextAndButtonArrowRight.SETTING_ACCOUNT_USERNAME);
        this.userName.addButtonRight();
        if (SocketController.instance().socket.mySelf !== null) {
            this.userName.addTxtOnright(SocketController.instance().dataMySeft.user_name);
        } else {
            this.userName.addTxtOnright(Language.instance().getData("298"));
        }
        this.userName.event.chooseSetting.add(this.chooseSetting, this);
        this.listView.add(this.userName);
    }

    addEmail() {
        this.email = new ItemSettingWithTextAndButtonArrowRight();
        this.email.addNameSetting(Language.instance().getData("295"));
        this.email.addType(ItemSettingWithTextAndButtonArrowRight.SETTING_ACCOUNT_EMAIL);
        this.email.addButtonRight();
        this.email.addTxtOnright("anh******@gmail.com");
        this.email.event.chooseSetting.add(this.chooseSetting, this);
        this.email.setDisactive();
        this.listView.add(this.email);
    }

    addPassword() {
        this.password = new ItemSettingWithTextAndButtonArrowRight();
        this.password.addNameSetting(Language.instance().getData("296"));
        this.password.addType(ItemSettingWithTextAndButtonArrowRight.SETTING_ACCOUNT_PASSWORD);
        this.password.addButtonRight();
        this.password.addTxtOnright("*********");
        this.password.event.chooseSetting.add(this.chooseSetting, this);
        this.password.setDisactive();
        this.listView.add(this.password);
    }

    chooseSetting(type) {
        // console.log(type);
        switch (type) {
            case ItemSettingWithTextAndButtonArrowRight.SETTING_ACCOUNT_USERNAME:
                ControllScreenDialog.instance().addSettingAccountUserNameScreen();
                break;
            case ItemSettingWithTextAndButtonArrowRight.SETTING_ACCOUNT_GENDER:
                this.addSettingGender();
                break;
        }
    }

    addSettingGender() {
        this.removeSettingGender();
        this.settingGender = new SettingChooseGender();
        this.settingGender.x = 430;
        this.settingGender.y = 360;
        this.settingGender.event.choose_gender.add(this.choosedGender, this);
        this.addChild(this.settingGender);
    }

    removeSettingGender() {
        if (this.settingGender !== null) {
            this.removeChild(this.settingGender);
            this.settingGender.destroy();
            this.settingGender = null;
        }
    }

    choosedGender(type, gender) {
        this.settingGender.destroy();
        AjaxServerMail.instance().settingAccount(
            SocketController.instance().socket.mySelf.getVariable('user_id').value,
            SocketController.instance().dataMySeft.user_name,
            gender,
            null
        );
        AjaxServerMail.instance().sendData(this.onChangeGender.bind(this));
        // console.log(gender);
    }

    onChangeGender(response) {
        // console.log(response);
        if (response.code == "ok") {
            var userVars = [];
            userVars.push(new SFS2X.SFSUserVariable("gender", response.data.gender));
            SocketController.instance().socket.send(new SFS2X.SetUserVariablesRequest(userVars));

            SocketController.instance().dataMySeft.setGender(response.data.gender);
        }
    }

    destroy() {
        this.listView.removeAll();
        this.removeEventExtension();
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