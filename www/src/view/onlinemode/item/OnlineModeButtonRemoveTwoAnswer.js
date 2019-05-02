import ButtonBase from "../../component/ButtonBase.js";
import MainData from "../../../model/MainData.js";
import ButtonWithText from "../../component/ButtonWithText.js";
import SpriteBase from "../../component/SpriteBase.js";
import TextBase from "../../component/TextBase.js";
import SocketController from "../../../controller/SocketController.js";
import Language from "../../../model/Language.js";

export default class OnlineModeButtonRemoveTwoAnswer extends ButtonBase {
    constructor(objData, callback, scope) {
        super(objData, callback, scope);

        this.positionCreateRoom = MainData.instance().positionCreateRoom;

        this.countTicket = new ButtonWithText(this.positionCreateRoom.question_button_bodapan_count_mic, SocketController.instance().dataMySeft.support_item);
        this.addChild(this.countTicket);

        this.iconMic = new SpriteBase(this.positionCreateRoom.question_button_bodapan_mic);
        this.addChild(this.iconMic);

        this.labelMoney = new TextBase(this.positionCreateRoom.question_button_bodapan_txt_money, "-1");
        this.labelMoney.setTextBounds(0, 0, 100 * MainData.instance().scale, 40 * MainData.instance().scale);
        this.addChild(this.labelMoney);

        this.lbBo2dapan = new TextBase(this.positionCreateRoom.question_button_bodapan_txt_bo2dapan, Language.instance().getData("42"));
        this.lbBo2dapan.setTextBounds(0, 0, 205 * MainData.instance().scale, 46 * MainData.instance().scale);
        this.addChild(this.lbBo2dapan);

        this.addEvent();
    }

    addEvent() {
        SocketController.instance().events.onUserVarsUpdate.add(this.userVarsUpdate, this);
    }
    removeEvent() {
        SocketController.instance().events.onUserVarsUpdate.remove(this.userVarsUpdate, this);
    }

    userVarsUpdate() {
        this.countTicket.setText(SocketController.instance().dataMySeft.support_item);
    }

    destroy() {
        this.removeEvent();
        super.destroy();
    }
}