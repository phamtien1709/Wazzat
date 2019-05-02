
import EventModePopupTop100Item from "./EventModePopupTop100Item.js";
import MainData from "../../../../model/MainData.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import SocketController from "../../../../controller/SocketController.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import ConfigScreenName from "../../../../config/ConfigScreenName.js";
import BaseLoadAsset from "../../../BaseLoadAsset.js";

export default class EventModePopupTop100 extends BaseLoadAsset {
    constructor(data) {
        super(game, null);
        this.data = data;
        this.event = {
            accept_gift: new Phaser.Signal(),
            view_result: new Phaser.Signal(),
            exit: new Phaser.Signal()
        }
        this.idxGet = 0;
        this.idShowResult = null;
        this.positionPopup = MainData.instance().positionPopup;

        this.bg = new Phaser.Button(game, 0, 0, 'screen-dim');
        this.addChild(this.bg);

        this.arrResource = [
            {
                type: "spritesheet",
                link: "img/atlas/IconEventModeWin.png",
                key: "iconpopupwinevent",
                width: 400,
                height: 243,
                countFrame: 23
            }
        ];

        this.loadResource();
    }

    loadFileComplete() {
        super.loadFileComplete();

        this.popupWin = new EventModePopupTop100Item(this.data);
        this.popupWin.event.exit.add(this.chooseExit, this);
        this.popupWin.event.accept_gift.add(this.chooseAceptGift, this);
        this.popupWin.event.view_result.add(this.chooseViewResult, this);
        this.popupWin.x = 35 * MainData.instance().scale;
        this.popupWin.y = game.height - 964 * MainData.instance().scale;
        this.addChild(this.popupWin);

        this.scoreDiamond = SocketController.instance().dataMySeft.diamond;
        this.btnDiamond = new ButtonWithText(this.positionPopup.tn_header_item_gem, this.scoreDiamond);
        this.addChild(this.btnDiamond);

        this.scoreTicket = SocketController.instance().dataMySeft.ticket;
        this.btnTicket = new ButtonWithText(this.positionPopup.tn_header_item_ticket, this.scoreTicket);
        this.addChild(this.btnTicket);

        this.scoreSupportItem = SocketController.instance().dataMySeft.support_item;
        this.btnSupportItem = new ButtonWithText(this.positionPopup.tn_header_item_mic, this.scoreSupportItem);
        this.addChild(this.btnSupportItem);


        /*
        this.countTicket = new ButtonWithText(this.positionPopup.popup_win_event_count_ticket, SocketController.instance().dataMySeft.ticket);
        this.addChild(this.countTicket)*/
        this.addEvent();
    }

    addEvent() {
        SocketController.instance().events.onUserVarsUpdate.add(this.onUserVarsUpdate, this);
    }
    removeEvent() {
        SocketController.instance().events.onUserVarsUpdate.remove(this.onUserVarsUpdate, this);
    }

    onUserVarsUpdate() {
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
            }, 500, "Linear", true, 1000);
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

            this.addCheckTweenMoney();
        } else {

            if (this.scoreTicket < SocketController.instance().dataMySeft.ticket) {
                game.tweens.removeFrom(this.btnTicket);
                data.score = this.scoreTicket;
                this.scoreTicket = SocketController.instance().dataMySeft.ticket;
                console.log("scoreTicket : " + this.scoreTicket);
                tweenVariable = game.add.tween(data).to({
                    score: SocketController.instance().dataMySeft.ticket
                }, 500, "Linear", true, 1000);
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

                this.addCheckTweenMoney();
            } else {

                if (this.scoreSupportItem < SocketController.instance().dataMySeft.support_item) {
                    game.tweens.removeFrom(this.btnSupportItem);
                    data.score = this.scoreSupportItem;
                    this.scoreSupportItem = SocketController.instance().dataMySeft.support_item;
                    console.log("scoreSupportItem : " + this.scoreSupportItem);
                    tweenVariable = game.add.tween(data).to({
                        score: SocketController.instance().dataMySeft.support_item
                    }, 500, "Linear", true, 1000);
                    tweenVariable.start();
                    tweenVariable.onUpdateCallback(() => {
                        if (this.btnSupportItem) {
                            this.btnSupportItem.setText(parseInt(data.score));
                        }
                    }, this);
                    tweenVariable.onComplete.add(() => {
                        if (this.btnSupportItem) {
                            this.btnSupportItem.setText(parseInt(this.scoreSupportItem));
                        }
                    }, this);
                }
            }
        }
    }

    chooseExit() {
        this.event.exit.dispatch();
        ControllScreenDialog.instance().removeAnimClaimReward();
        this.removeShowResult();
        this.removeCheckTweenMoney();
    }

    chooseAceptGift() {
        this.idxGet++;
        let data = {
            resourceType: "SUPPORT_ITEM",
            reward: 0
        }

        if (this.idxGet === 1) {
            if (this.data.event_reward.diamond > 0) {
                data.resourceType = "DIAMOND";
                data.reward = this.data.event_reward.diamond;
                this.showGetMoney(data);
            } else {
                this.chooseAceptGift();
            }
        } else if (this.idxGet === 2) {
            if (this.data.event_reward.ticket > 0) {
                data.resourceType = "TICKET";
                data.reward = this.data.event_reward.ticket;
                this.showGetMoney(data);
            } else {
                this.chooseAceptGift();
            }
        } else if (this.idxGet === 3) {
            if (this.data.event_reward.support_item > 0) {
                data.resourceType = "SUPPORT_ITEM";
                data.reward = this.data.event_reward.support_item;
                this.showGetMoney(data);
            } else {
                this.chooseAceptGift();
            }
        } else {
            this.chooseExit();
        }

    }

    showGetMoney(data) {
        let vx = 470 * MainData.instance().scale;
        let vy = 45 * MainData.instance().scale;
        let type = "SUPPORT_ITEM";
        if (data.resourceType === "DIAMOND") {
            type = "DIAMOND";
            vx = 110 * MainData.instance().scale;
            vy = 45 * MainData.instance().scale;
        } else if (data.resourceType === "TICKET") {
            type = "TICKET";
            vx = 286 * MainData.instance().scale;
            vy = 45 * MainData.instance().scale;
        } else if (data.resourceType === "SUPPORT_ITEM") {
            type = "SUPPORT_ITEM";
            vx = 500 * MainData.instance().scale;
            vy = 45 * MainData.instance().scale;
        }

        let dataObj = {
            type: type,
            reward: data.reward,
            finishPoint: {
                x: vx,
                y: vy
            }
        }
        ControllScreenDialog.instance().changeScreen(ConfigScreenName.ANIM_CLAIM_REWARD, dataObj);

        this.removeShowResult();
        this.idShowResult = game.time.events.add(Phaser.Timer.SECOND * 2, this.chooseAceptGift, this);
    }

    removeShowResult() {
        if (this.idShowResult !== null) {
            game.time.events.remove(this.idShowResult);
            this.idShowResult = null;
        }
    }

    addCheckTweenMoney() {
        this.removeCheckTweenMoney();
        this.idTweenMoney = game.time.events.add(Phaser.Timer.SECOND * 2, this.onUserVarsUpdate, this);
    }

    removeCheckTweenMoney() {
        if (this.idTweenMoney !== null) {
            game.time.events.remove(this.idTweenMoney);
            this.idTweenMoney = null;
        }
    }

    chooseViewResult(id) {
        this.event.view_result.dispatch(id);
        ControllScreenDialog.instance().removeAnimClaimReward();
        this.removeShowResult();
        this.removeCheckTweenMoney();
    }

    destroy() {
        this.removeEvent();
        this.removeShowResult();
        this.removeCheckTweenMoney();
        ControllScreenDialog.instance().removeAnimClaimReward();
        super.destroy();
    }
}