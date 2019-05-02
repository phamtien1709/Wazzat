import ButtonBase from "../../../component/ButtonBase.js";
import SpriteBase from "../../../component/SpriteBase.js";
import TextBase from "../../../component/TextBase.js";
import SocketController from "../../../../controller/SocketController.js";
import MainData from "../../../../model/MainData.js";
import Language from "../../../../model/Language.js";

export default class EventModeQueueButtonPlay extends ButtonBase {
    constructor(objConfig, callback, scope) {
        super(objConfig, callback, scope);
        this.positionEventMode = MainData.instance().positionEventMode;

        this.iconTicket = new SpriteBase(this.positionEventMode.queueroom_button_play_icon_ticket);
        this.addChild(this.iconTicket);

        this.lbPlay = new TextBase(this.positionEventMode.queueroom_button_play_text_play, Language.instance().getData("24"));
        this.lbPlay.setTextBounds(0, 0, 570 * MainData.instance().scale, 43 * MainData.instance().scale);
        this.addChild(this.lbPlay);

        this.txtCount = new TextBase(this.positionEventMode.queueroom_button_play_count_ticket, "-1(" + SocketController.instance().dataMySeft.ticket + ")");
        this.txtCount.setTextBounds(0, 0, 85 * MainData.instance().scale, 43 * MainData.instance().scale);
        this.addChild(this.txtCount);

        this.addEvent();
    }

    addEvent() {
        SocketController.instance().events.onUserVarsUpdate.add(this.userVarsUpdate, this);
    }

    removeEvent() {
        SocketController.instance().events.onUserVarsUpdate.remove(this.userVarsUpdate, this);
    }

    userVarsUpdate() {
        this.txtCount.text = "-1(" + SocketController.instance().dataMySeft.ticket + ")";
    }

    destroy() {
        this.removeEvent();
        super.destroy();
    }
}