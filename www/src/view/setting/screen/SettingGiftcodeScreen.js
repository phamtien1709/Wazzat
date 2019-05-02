import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import KeyBoard from "../../component/KeyBoard.js";
import TextBase from "../../component/TextBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import SpriteBase from "../../component/SpriteBase.js";
import ItemGiftcodeClaim from "../items/ItemGiftcodeClaim.js";
import SocketController from "../../../controller/SocketController.js";
import DataCommand from "../../../common/DataCommand.js";
import GiftcodeHandleResponse from "../../../model/giftcode/GiftcodeHandleResponse.js";
import ControllDialog from "../../ControllDialog.js";
import EventGame from "../../../controller/EventGame.js";

export default class SettingGiftCode extends Phaser.Button {
    constructor() {
        super(game, 0, 0, 'bg-playlist');
        this.positionSetting = JSON.parse(game.cache.getText('positionSetting'));
        this.signalInputX = new Phaser.Signal();
        this.afterInit();
    }

    afterInit() {
        this.addEventExtension();
        this.giftcode = {};
        this.isActiveBtnSave = true;
        this.addHeaderTab(this.positionSetting.header);
        //
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
        this.txtSettingHead = new TextBase(this.positionSetting.setting_giftcode.txt_setting_head, this.positionSetting.setting_giftcode.txt_setting_head.text);
        this.txtSettingHead.anchor.set(0.5);
        this.addChild(this.txtSettingHead);
    }

    addBoxText() {
        this.boxText = new ButtonBase(this.positionSetting.setting_giftcode.box_text, this.clickBoxText, this);
        this.boxText.anchor.set(0.5);
        this.addChild(this.boxText)
    }

    addBtnSave() {
        this.btnSave = new ButtonBase(this.positionSetting.setting_giftcode.btn_save, this.clickSave, this);
        this.btnSave.anchor.set(0.5);
        let txtBtn = new TextBase(this.positionSetting.setting_giftcode.txt_btn_save, this.positionSetting.setting_giftcode.txt_btn_save.text);
        txtBtn.anchor.set(0.5);
        this.btnSave.addChild(txtBtn);
        this.addChild(this.btnSave);
    }

    addTick() {
        this.tick = new SpriteBase(this.positionSetting.setting_giftcode.tick);
        this.tick.kill();
        this.boxText.addChild(this.tick);
    }

    clickBoxText() {
        this.tick.kill();
        this.inputKeyboard();
    }


    inputKeyboard() {
        this.isActiveBtnSave = false;
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.boxText.kill();
        let options = {
            maxLength: '',
            showTransparent: true,
            placeholder: "Nhập Giftcode",
            isSearch: false
        };
        KeyBoard.instance().event.cancle.add(this.keyboardClose, this);
        KeyBoard.instance().event.enter.add(this.keyboardDone, this);
        KeyBoard.instance().event.submit.add(this.keyboardDone, this);
        KeyBoard.instance().show(options);
        KeyBoard.instance().setValue(this.codeGift);
    }

    keyboardClose() {
        this.isActiveBtnSave = true;
        KeyBoard.instance().event.cancle.remove(this.keyboardClose, this);
        KeyBoard.instance().event.enter.remove(this.keyboardDone, this);
        KeyBoard.instance().event.submit.remove(this.keyboardDone, this);
        KeyBoard.instance().hide();
        this.boxText.revive();
    }

    keyboardDone() {
        this.codeGift = KeyBoard.instance().getValue();
        LogConsole.log(this.codeGift);
        this.changeTxtBoxText();
        // this.addNewMessage();
        this.keyboardClose();
    }

    changeTxtBoxText() {
        this.txtBoxText.setText(this.codeGift);
    }

    clickSave() {
        if (this.isActiveBtnSave == true) {
            this.sendGiftcode();
        }
        // setTimeout(() => {

        // }, 1000);
    }

    sendGiftcode() {
        let params = new SFS2X.SFSObject();
        params.putUtfString("code", this.codeGift);
        // console.log(this.codeGift);
        SocketController.instance().sendData(DataCommand.GIFT_CODE_CLAIM_REQUEST, params);
    }

    addTxtBoxText() {
        this.txtBoxText = new TextBase(this.positionSetting.setting_giftcode.txt_box_text, 'Giftcode');
        this.txtBoxText.anchor.set(0.5);
        this.boxText.addChild(this.txtBoxText);
    }

    addHeaderTab(configs) {
        this.headerTab = new Phaser.Sprite(game, configs.tab_chonplaylist.x * window.GameConfig.RESIZE, configs.tab_chonplaylist.y * window.GameConfig.RESIZE, configs.tab_chonplaylist.nameAtlas, configs.tab_chonplaylist.nameSprite);
        this.addChild(this.headerTab);
        //
        this.btnBack;
        this.addButtonBack(configs.btn_back);
        this.addTxtSetting(configs.txt_giftcode);
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
        this.txtQuest = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.text, configs.configs);
        this.txtQuest.anchor.set(0.5, 0);
        this.headerTab.addChild(this.txtQuest);
    }

    //
    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
        EventGame.instance().event.backButton.add(this.onBack, this);
    }
    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
        EventGame.instance().event.backButton.remove(this.onBack, this);
    }
    //
    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.GIFT_CODE_CLAIM_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.giftcode = GiftcodeHandleResponse.begin(evtParams.params);
                // console.log("DataCommand.GIFT_CODE_CLAIM_RESPONSE");
                // console.log(this.giftcode);
                let claimGiftcode = new ItemGiftcodeClaim(this.giftcode);
                claimGiftcode.addGift();
                this.addChild(claimGiftcode);
            }
            if (evtParams.params.getUtfString('status') == "WARNING") {
                ControllDialog.instance().addDialog("Giftcode sai hoặc đã được sử dụng.");
            }
        }
    }

    destroy() {
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