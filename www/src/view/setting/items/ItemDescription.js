import TextBase from "../../component/TextBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import SpriteBase from "../../component/SpriteBase.js";
import SocketController from "../../../controller/SocketController.js";
import KeyBoard from "../../component/KeyBoard.js";
import AjaxServerMail from "../../../common/AjaxServerMail.js";
import EventGame from "../../../controller/EventGame.js";
import MainData from "../../../model/MainData.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class ItemDescription extends BaseGroup {
    constructor() {
        super(game);
        this.positionSetting = JSON.parse(game.cache.getText('positionSetting'));
        this.description = MainData.instance().userDescription;
        this.event = {
            changeDes: new Phaser.Signal()
        };
        this.afterInit();
    }

    afterInit() {
        this.lbl;
        this.box;
        this.addLabel();
        this.addBox();
    }

    addLabel() {
        this.lbl = new TextBase(this.positionSetting.setting_profile.lbl_des, Language.instance().getData("302"));
        this.addChild(this.lbl);
    }

    addBox() {
        this.box = new ButtonBase(this.positionSetting.setting_profile.box_des, this.onClickBox, this);
        let icon = new SpriteBase(this.positionSetting.setting_profile.icon_edit);
        this.box.addChild(icon);
        this.desText = new TextBase(this.positionSetting.setting_profile.txt_des, this.description);
        this.tick = new SpriteBase(this.positionSetting.setting_profile.tick_des);
        this.box.addChild(this.tick);
        this.box.addChild(this.desText);
        this.addChild(this.box);
    }

    onClickBox() {
        this.inputKeyboard();
        this.tick.kill();
    }


    inputKeyboard() {
        // ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        // this.box.kill();
        let options = {
            maxLength: '',
            showTransparent: true,
            placeholder: "Nhập trạng thái",
            isSearch: false,
            typeInputText: "input", // chat, search, input
            configText: {
                width: this.box.width - 70,
                height: this.box.height - 5,
                x: this.box.x,
                y: this.box.y
            }
        };
        KeyBoard.instance().event.cancle.add(this.keyboardClose, this);
        KeyBoard.instance().event.enter.add(this.keyboardDone, this);
        KeyBoard.instance().event.submit.add(this.keyboardDone, this);
        KeyBoard.instance().show(options);
        KeyBoard.instance().setValue(this.description);
    }

    keyboardClose() {
        KeyBoard.instance().event.cancle.remove(this.keyboardClose, this);
        KeyBoard.instance().event.enter.remove(this.keyboardDone, this);
        KeyBoard.instance().event.submit.remove(this.keyboardDone, this);
        KeyBoard.instance().hide();
        this.box.revive();
    }

    keyboardDone() {
        this.description = KeyBoard.instance().getValue();
        // LogConsole.log(this.description);
        this.changeTxtBoxText();
        // this.addNewMessage();
        this.sendDes();
        this.keyboardClose();
    }

    sendDes() {
        //
        AjaxServerMail.instance().settingAccount(
            SocketController.instance().socket.mySelf.getVariable('user_id').value,
            SocketController.instance().dataMySeft.user_name,
            SocketController.instance().socket.mySelf.getVariable('gender').value,
            null, this.description);
        AjaxServerMail.instance().sendData(this.onSendSettingDone.bind(this));
    }

    onSendSettingDone(response) {
        if (response.code == "ok") {
            EventGame.instance().event.updateDescription.dispatch(response.data.description);
            // this.event.changeDes.dispatch();
            this.description = response.data.description;
            this.desText.setText(this.description);
            this.tick.revive();
            //
            var userVars = [];
            userVars.push(new SFS2X.SFSUserVariable("description", response.data.description));
            SocketController.instance().socket.send(new SFS2X.SetUserVariablesRequest(userVars));
            SocketController.instance().dataMySeft.setDescription(response.data.description);
        }
    }

    changeTxtBoxText() {
        this.desText.setText(this.description);
    }

    destroy() {
        KeyBoard.instance().hide();
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        super.destroy();
    }
}