import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import TextBase from "../../component/TextBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import SocketController from "../../../controller/SocketController.js";
import KeyBoard from "../../component/KeyBoard.js";
import AjaxServerMail from "../../../common/AjaxServerMail.js";
import SpriteBase from "../../component/SpriteBase.js";
import EventGame from "../../../controller/EventGame.js";
import ControllDialog from "../../ControllDialog.js";

export default class SettingAccountUserName extends Phaser.Button {
    constructor() {
        super(game, 0, 0, 'bg-playlist')
        this.positionSetting = JSON.parse(game.cache.getText('positionSetting'));
        this.signalInputX = new Phaser.Signal();
        this.afterInit();
    }

    afterInit() {
        if (SocketController.instance().socket.mySelf !== null) {
            this.nameChange = SocketController.instance().dataMySeft.user_name;
        } else {
            this.nameChange = "NameXXX_XXX";
        }
        this.addEventExtension();
        //
        this.addHeaderTab(this.positionSetting.header);
        this.txtSettingHead;
        this.boxText;
        this.txtBoxText;
        this.btnSave;
        this.tick;
        this.addTxtSettingHead();
        this.addBoxText();
        this.addTxtBoxText();
        this.addBtnSave();
        this.addTick();
    }

    addTxtSettingHead() {
        this.txtSettingHead = new TextBase(this.positionSetting.setting_account.txt_setting_head, this.positionSetting.setting_account.txt_setting_head.text);
        this.txtSettingHead.anchor.set(0.5);
        this.addChild(this.txtSettingHead);
    }

    addBoxText() {
        this.boxText = new ButtonBase(this.positionSetting.setting_account.box_text, this.clickBoxText, this);
        this.boxText.anchor.set(0.5);
        this.addChild(this.boxText)
    }

    addTxtBoxText() {
        this.txtBoxText = new TextBase(this.positionSetting.setting_account.txt_box_text, this.nameChange);
        this.txtBoxText.anchor.set(0.5);
        this.boxText.addChild(this.txtBoxText);
    }

    addBtnSave() {
        this.btnSave = new ButtonBase(this.positionSetting.setting_account.btn_save, this.clickSave, this);
        this.btnSave.anchor.set(0.5);
        let txtBtn = new TextBase(this.positionSetting.setting_account.txt_btn_save, this.positionSetting.setting_account.txt_btn_save.text);
        txtBtn.anchor.set(0.5);
        this.btnSave.addChild(txtBtn);
        this.addChild(this.btnSave);
    }

    addTick() {
        this.tick = new SpriteBase(this.positionSetting.setting_account.tick);
        // this.tick.kill();
        this.boxText.addChild(this.tick);
    }

    clickBoxText() {
        this.tick.kill();
        // this.btnSave.kill();
        this.inputKeyboard();
    }


    inputKeyboard() {
        // ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        // this.boxText.kill();
        let options = {
            maxLength: '',
            showTransparent: true,
            placeholder: "Nhập tên thay đổi",
            isSearch: false,
            typeInputText: "input", // chat, search, input
            configText: {
                width: this.boxText.width - 70,
                height: this.boxText.height - 5,
                x: this.boxText.x - this.boxText.width / 2,
                y: this.boxText.y - this.boxText.height / 2
            }
        };
        KeyBoard.instance().event.cancle.add(this.keyboardClose, this);
        KeyBoard.instance().event.enter.add(this.keyboardDone, this);
        KeyBoard.instance().event.submit.add(this.keyboardDone, this);
        KeyBoard.instance().show(options);
        KeyBoard.instance().setValue(this.nameChange);
    }

    keyboardClose() {
        KeyBoard.instance().event.cancle.remove(this.keyboardClose, this);
        KeyBoard.instance().event.enter.remove(this.keyboardDone, this);
        KeyBoard.instance().event.submit.remove(this.keyboardDone, this);
        KeyBoard.instance().hide();
        this.boxText.revive();
        this.btnSave.revive();
    }

    keyboardDone() {
        // this.btnSave.revive();
        if (this.nameChange !== "" && KeyBoard.instance().getValue() == "") {

        } else {
            this.nameChange = KeyBoard.instance().getValue();
            LogConsole.log(this.nameChange);
        }
        this.changeTxtBoxText();
        this.keyboardClose();
    }

    changeTxtBoxText() {
        this.txtBoxText.setText(this.nameChange);
    }

    clickSave() {
        //
        this.keyboardDone();
        if (this.nameChange == SocketController.instance().dataMySeft.user_name) {

        } else {
            this.btnSave.kill();
            AjaxServerMail.instance().settingAccount(
                SocketController.instance().socket.mySelf.getVariable('user_id').value,
                this.nameChange,
                SocketController.instance().socket.mySelf.getVariable('gender').value,
                null);
            AjaxServerMail.instance().sendData(this.onSendSettingDone.bind(this));
        }
    }

    onSendSettingDone(response) {
        LogConsole.log(response);
        this.btnSave.revive();
        if (response.code == "ok") {
            this.tick.revive();
            ControllDialog.instance().addDialog('Đổi tên thành công');
            var userVars = [];
            userVars.push(new SFS2X.SFSUserVariable("user_name", this.nameChange));
            SocketController.instance().socket.send(new SFS2X.SetUserVariablesRequest(userVars));

            SocketController.instance().dataMySeft.setUserName(this.nameChange);
        }
    }

    addHeaderTab(configs) {
        this.headerTab = new Phaser.Sprite(game, configs.tab_chonplaylist.x * window.GameConfig.RESIZE, configs.tab_chonplaylist.y * window.GameConfig.RESIZE, configs.tab_chonplaylist.nameAtlas, configs.tab_chonplaylist.nameSprite);
        this.addChild(this.headerTab);
        //
        this.btnBack;
        this.addButtonBack(configs.btn_back);
        this.addTxtSetting(configs.txt_setting_account_username);
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
        this.txtQuest = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.text, configs.configs);
        this.txtQuest.anchor.set(0.5, 0);
        this.headerTab.addChild(this.txtQuest);
    }

    addEventExtension() {
        // LogConsole.log('QuestAndAchievementScreen');
        EventGame.instance().event.backButton.add(this.onBack, this);
    }

    removeEventExtension() {
        EventGame.instance().event.backButton.remove(this.onBack, this);
    }

    destroy() {
        KeyBoard.instance().hide();
        this.removeEventExtension();
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