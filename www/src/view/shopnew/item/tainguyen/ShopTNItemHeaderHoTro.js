import BaseView from "../../../BaseView.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import SocketController from "../../../../controller/SocketController.js";
import SpriteBase from "../../../component/SpriteBase.js";
import ButtonBase from "../../../component/ButtonBase.js";
import EventGame from "../../../../controller/EventGame.js";
import MainData from "../../../../model/MainData.js";

export default class ShopTNItemHeaderHoTro extends BaseView {
    constructor() {
        super(game, null);

        this.event = {
            back: new Phaser.Signal()
        }

        this.positionShop = MainData.instance().positionShop;
        this.bg = new SpriteBase(this.positionShop.sort_play_list_bg_top_menu);
        this.addChild(this.bg);

        this.btnBack = new ButtonBase(this.positionShop.sort_play_list_bg_back_top_menu, this.chooseBack, this);
        this.addChild(this.btnBack);

        this.score = SocketController.instance().dataMySeft.support_item;
        this.btnMic = new ButtonWithText(this.positionShop.tn_header_item_mic, SocketController.instance().dataMySeft.support_item);
        this.addChild(this.btnMic);

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

    onUserVarsUpdate() {

        let data = {
            score: this.score
        }

        this.score = SocketController.instance().dataMySeft.support_item;

        let tweenVariable = game.add.tween(data).to({
            score: SocketController.instance().dataMySeft.support_item
        }, 500, "Linear", true, 1500);
        tweenVariable.start();
        tweenVariable.onUpdateCallback(() => {
            // LogConsole.log('vao');
            if (this.btnMic) {
                this.btnMic.setText(parseInt(data.score));
            }
        }, this);
        tweenVariable.onComplete.add(() => {
            if (this.btnMic) {
                this.btnMic.setText(parseInt(this.score));
            }
        }, this);

        /*
        if (this.btnMic !== null) {
            this.btnMic.setText(SocketController.instance().dataMySeft.support_item);
        }*/
    }

    destroy() {
        this.removeEvent();
        game.tweens.removeFrom(this.btnMic);
        super.destroy();
    }

}