import BaseView from "../../../BaseView.js";
import SpriteBase from "../../../component/SpriteBase.js";
import ButtonBase from "../../../component/ButtonBase.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import SocketController from "../../../../controller/SocketController.js";
import EventGame from "../../../../controller/EventGame.js";
import MainData from "../../../../model/MainData.js";

export default class ShopTNItemHeader extends BaseView {
    constructor() {
        super(game, null);
        this.event = {
            back: new Phaser.Signal()
        }

        this.positionShop = MainData.instance().positionShop;
        this.bg = new SpriteBase(this.positionShop.sort_play_list_bg_top_menu);
        this.addChild(this.bg);

        this.scoreDiamond = 0;
        this.scoreTicket = 0;
        this.scoreHeart = 0;

        this.btnBack = new ButtonBase(this.positionShop.sort_play_list_bg_back_top_menu, this.chooseBack, this);
        this.addChild(this.btnBack);

        this.scoreDiamond = SocketController.instance().dataMySeft.diamond;
        this.btnDiamond = new ButtonWithText(this.positionShop.tn_header_item_gem, this.scoreDiamond);
        this.addChild(this.btnDiamond);

        this.scoreTicket = SocketController.instance().dataMySeft.ticket;
        this.btnTicket = new ButtonWithText(this.positionShop.tn_header_item_ticket, this.scoreTicket);
        this.addChild(this.btnTicket);

        this.scoreHeart = SocketController.instance().dataMySeft.heart;
        this.btnHeart = new ButtonWithText(this.positionShop.tn_header_item_heart, this.scoreHeart);
        this.addChild(this.btnHeart);

        this.addEvent();

    }

    chooseBack() {
        //console.log('HERE HERE HERE');
        this.event.back.dispatch();
    }


    addEvent() {
        EventGame.instance().event.backButton.add(this.chooseBack, this);
        SocketController.instance().events.onUserVarsUpdate.add(this.onUserVarsUpdate, this);
    }
    removeEvent() {

        EventGame.instance().event.backButton.remove(this.chooseBack, this);
        SocketController.instance().events.onUserVarsUpdate.remove(this.onUserVarsUpdate, this);
    }

    onUserVarsUpdate(evt) {
        let data = {
            score: 0
        }
        let tweenVariable;

        if (this.scoreDiamond < SocketController.instance().dataMySeft.diamond) {
            game.tweens.removeFrom(this.btnDiamond);
            data.score = this.scoreDiamond;
            this.scoreDiamond = SocketController.instance().dataMySeft.diamond;
            console.log("scoreDiamond : " + this.scoreDiamond);
            tweenVariable = game.add.tween(data).to({
                score: SocketController.instance().dataMySeft.diamond
            }, 500, "Linear", true, 1500);
            tweenVariable.start();
            tweenVariable.onUpdateCallback(() => {
                if (this.btnDiamond) {
                    this.btnDiamond.setText(parseInt(data.score));
                }
            }, this);
            tweenVariable.onComplete.add(() => {
                if (this.btnDiamond) {
                    this.btnDiamond.setText(parseInt(this.scoreDiamond));
                }
            }, this);
        } else {
            this.btnDiamond.setText(SocketController.instance().dataMySeft.diamond);
        }

        if (this.scoreHeart < SocketController.instance().dataMySeft.heart) {
            game.tweens.removeFrom(this.btnHeart);
            data.score = this.scoreHeart;
            this.scoreHeart = SocketController.instance().dataMySeft.heart;
            console.log("scoreHeart : " + this.scoreHeart);
            tweenVariable = game.add.tween(data).to({
                score: SocketController.instance().dataMySeft.heart
            }, 500, "Linear", true, 1500);
            tweenVariable.start();
            tweenVariable.onUpdateCallback(() => {
                if (this.btnHeart) {
                    this.btnHeart.setText(parseInt(data.score));
                }
            }, this);
            tweenVariable.onComplete.add(() => {
                if (this.btnHeart) {
                    this.btnHeart.setText(parseInt(this.scoreHeart));
                }
            }, this);
        }

        if (this.scoreTicket < SocketController.instance().dataMySeft.ticket) {
            game.tweens.removeFrom(this.btnTicket);
            data.score = this.scoreTicket;
            this.scoreTicket = SocketController.instance().dataMySeft.ticket;
            console.log("scoreTicket : " + this.scoreTicket);
            tweenVariable = game.add.tween(data).to({
                score: SocketController.instance().dataMySeft.ticket
            }, 500, "Linear", true, 1500);
            tweenVariable.start();
            tweenVariable.onUpdateCallback(() => {
                if (this.btnTicket) {
                    this.btnTicket.setText(parseInt(data.score));
                }
            }, this);
            tweenVariable.onComplete.add(() => {
                if (this.btnTicket) {
                    this.btnTicket.setText(parseInt(this.scoreTicket));
                }
            }, this);
        }


        /*
        if (this.btnDiamond !== null) {
            this.btnDiamond.setText(SocketController.instance().dataMySeft.diamond);
        }
        if (this.btnTicket !== null) {
            this.btnTicket.setText(SocketController.instance().dataMySeft.ticket);
        }
        if (this.btnHeart !== null) {
            this.btnHeart.setText(SocketController.instance().dataMySeft.heart);
        }*/
    }

    removeTween() {
        game.tweens.removeFrom(this.btnDiamond);
        game.tweens.removeFrom(this.btnTicket);
        game.tweens.removeFrom(this.btnHeart);
    }
    destroy() {
        console.log("destroy header");
        this.removeEvent();
        this.removeTween();
        super.destroy();
    }

}