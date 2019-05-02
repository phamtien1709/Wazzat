import BaseView from "../BaseView.js";
import PopupLiXiTetItem from "./item/PopupLiXiTetItem.js";
import MainData from "../../model/MainData.js";
import ButtonWithText from "../component/ButtonWithText.js";

export default class PopupLiXiTet extends BaseView {
    constructor() {
        super(game, null);

        this.positionPopup = MainData.instance().positionPopup;

        this.bg = new Phaser.Button(game, 0, 0, 'screen-dim');
        this.addChild(this.bg);

        this.popup = new PopupLiXiTetItem();
        this.popup.x = 35 * MainData.instance().scale;
        this.popup.y = 325 * MainData.instance().scale;
        this.addChild(this.popup);

        this.popup.y = game.height + 237 * MainData.instance().scale;
        this.tweenItemPopup(this.popup, game.height - 900 * MainData.instance().scale);


        // this.scoreDiamond = SocketController.instance().dataMySeft.diamond;
        this.scoreDiamond = 100;
        this.btnDiamond = new ButtonWithText(this.positionPopup.tn_header_item_gem, this.scoreDiamond);
        this.addChild(this.btnDiamond);

        // this.scoreTicket = SocketController.instance().dataMySeft.ticket;
        this.scoreTicket = 200;
        this.btnTicket = new ButtonWithText(this.positionPopup.tn_header_item_ticket, this.scoreTicket);
        this.addChild(this.btnTicket);

        //this.scoreSupportItem = SocketController.instance().dataMySeft.support_item;
        this.scoreSupportItem = 200;
        this.btnSupportItem = new ButtonWithText(this.positionPopup.tn_header_item_mic, this.scoreSupportItem);
        this.addChild(this.btnSupportItem);

    }
}