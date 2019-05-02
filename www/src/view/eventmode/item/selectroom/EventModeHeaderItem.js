import BaseView from "../../../BaseView.js";
import ButtonBase from "../../../component/ButtonBase.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import SocketController from "../../../../controller/SocketController.js";
import TextBase from "../../../component/TextBase.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import RankingItemHelp from "../../../ranking/item/RankingItemHelp.js";
import MainData from "../../../../model/MainData.js";
import Language from "../../../../model/Language.js";


export default class EventModeHeaderItem extends BaseView {
    constructor() {
        super(game, null);

        this.event = {
            back: new Phaser.Signal()
        }

        this.score = 0;
        this.popupHelp = null;

        this.positionEventMode = MainData.instance().positionEventMode;

        this.bg = new ButtonBase(this.positionEventMode.header_bg);
        this.addChild(this.bg);

        this.btnBack = new ButtonBase(this.positionEventMode.header_buttom_back, this.chooseBack, this);
        this.addChild(this.btnBack);

        this.score = SocketController.instance().dataMySeft.ticket;
        this.btnTicket = new ButtonWithText(this.positionEventMode.header_buttom_ticket, SocketController.instance().dataMySeft.ticket);
        this.addChild(this.btnTicket);

        this.txtTitle = new TextBase(this.positionEventMode.header_text_title, "");
        this.txtTitle.setTextBounds(0, 0, this.bg.width, this.bg.height);
        this.addChild(this.txtTitle);

        this.addEvent();
    }

    addEvent() {
        SocketController.instance().events.onUserVarsUpdate.add(this.userVarsUpdate, this);
    }

    removeEvent() {
        SocketController.instance().events.onUserVarsUpdate.remove(this.userVarsUpdate, this);
    }

    userVarsUpdate() {
        let data = {
            score: this.score
        }

        this.score = SocketController.instance().dataMySeft.ticket;

        let tweenVariable = game.add.tween(data).to({
            score: SocketController.instance().dataMySeft.ticket
        }, 300, "Linear", false);
        tweenVariable.start();
        tweenVariable.onUpdateCallback(() => {
            // LogConsole.log('vao');
            if (this.btnTicket) {
                this.btnTicket.setText(parseInt(data.score));
            }
        }, this);

        //this.btnTicket.setText(SocketController.instance().dataMySeft.ticket);
    }

    setHelp() {
        this.ktAddHelp = false;
        this.popupHelp = null;
        this.btnHelp = new ButtonBase(MainData.instance().positionPopup.header_button_help, this.chooseHelp, this);
        this.addChild(this.btnHelp);
    }

    chooseHelp() {
        console.log("chooseHelp : " + this.ktAddHelp);
        this.ktAddHelp = !this.ktAddHelp;
        if (this.ktAddHelp === true) {
            this.addPopupHelp();
        } else {
            this.removePopupHelp();
        }
    }

    addPopupHelp() {
        this.removePopupHelp();
        this.popupHelp = new RankingItemHelp(Language.instance().getData("25"));
        this.popupHelp.y = 83 * MainData.instance().scale;
        this.popupHelp.x = game.width - this.popupHelp.width - 71 * MainData.instance().scale;
        game.world.add(this.popupHelp);

    }
    removePopupHelp() {
        if (this.popupHelp !== null) {
            game.world.remove(this.popupHelp);
            this.popupHelp.destroy();
            this.popupHelp = null
        }
    }

    setTitle(_content) {
        this.txtTitle.text = _content;
    }

    addSelectRoom() {
        this.countTicket = new ButtonWithText(this.positionEventMode.header_buttom_ticket, SocketController.instance().dataMySeft.ticket);
        this.addChild(this.countTicket);
    }

    chooseBack() {
        this.btnBack.inputEnabled = false;
        this.event.back.dispatch();
    }

    destroy() {
        this.removeEvent();
        this.removePopupHelp();
        ControllScreenDialog.instance().removeAnimClaimReward();
        super.destroy();

    }
}