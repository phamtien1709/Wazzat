import BaseView from "../../../BaseView.js";
import EventModePopupDoneItem from "./EventModePopupDoneItem.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import SocketController from "../../../../controller/SocketController.js";
import MainData from "../../../../model/MainData.js";
import ControllSoundFx from "../../../../controller/ControllSoundFx.js";
import EventModeClockItem from "../selectroom/EventModeClockItem.js";

export default class EventModePopupDone extends BaseView {
    constructor(dataEvent) {
        super(game, null);
        this.event = {
            exit: new Phaser.Signal()
        }

        this.positionPopup = MainData.instance().positionPopup;

        this.bg = new Phaser.Button(game, 0, 0, 'screen-dim');
        this.addChild(this.bg);

        this.popupWin = new EventModePopupDoneItem();
        this.popupWin.event.exit.add(this.chooseExit, this);
        this.popupWin.x = 35 * MainData.instance().scale;
        this.popupWin.y = game.height - 853 * MainData.instance().scale;
        this.addChild(this.popupWin);

        this.time = new EventModeClockItem();
        this.time.setTimer(dataEvent.finish_at);
        this.time.x = 266 * MainData.instance().scale;
        this.time.y = 118 * MainData.instance().scale;
        this.addChild(this.time);

        this.countTicket = new ButtonWithText(this.positionPopup.popup_win_event_count_ticket, SocketController.instance().dataMySeft.ticket);
        this.addChild(this.countTicket)

        ControllSoundFx.instance().playSound(ControllSoundFx.popupeventmodeend);
    }

    chooseExit() {
        this.event.exit.dispatch();

        ControllSoundFx.instance().removeSound();
    }
}