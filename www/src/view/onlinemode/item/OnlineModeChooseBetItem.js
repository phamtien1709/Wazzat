import BaseView from "../../BaseView.js";
import SpriteBase from "../../component/SpriteBase.js";
import TextBase from "../../component/TextBase.js";
import ButtonWithText from "../../component/ButtonWithText.js";
import MainData from "../../../model/MainData.js";
import SocketController from "../../../controller/SocketController.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import Language from "../../../model/Language.js";

export default class OnlineModeChooseBetItem extends BaseView {
    constructor() {
        super(game, null);
    }
    afterCreate() {
        this.event = {
            choose_bet: new Phaser.Signal()
        }
        this.data = null;

        this.positionCreateRoom = MainData.instance().positionCreateRoom;

        this.bg = new SpriteBase(this.positionCreateRoom.choose_bet_bg_item_bet);
        this.addChild(this.bg);

        this.iconGem = new SpriteBase(this.positionCreateRoom.choose_bet_icon_gem_item_bet);
        this.addChild(this.iconGem);

        this.txtMoneyBet = new TextBase(this.positionCreateRoom.choose_bet_txtmoney_item_bet, "0");
        this.txtMoneyBet.setTextBounds(0, 0, 104 * MainData.instance().scale, 32 * MainData.instance().scale);
        this.addChild(this.txtMoneyBet);

        this.txtMuccuoc = new TextBase(this.positionCreateRoom.choose_bet_label_mucuoc_item_bet, Language.instance().getData("43"));
        this.txtMuccuoc.setTextBounds(0, 0, 150 * MainData.instance().scale, 35 * MainData.instance().scale);
        this.addChild(this.txtMuccuoc);

        this.btnChoose = new ButtonWithText(this.positionCreateRoom.choose_bet_btnchon_item_bet, Language.instance().getData("44"), this.chooseBet, this);
        this.addChild(this.btnChoose);
    }

    get width() {
        return this.game.width;
    }
    get height() {
        return this.bg.height;
    }

    chooseBet() {
        LogConsole.log("chooseBet-OnlineModeChooseBetItem");
        if (SocketController.instance().dataMySeft.diamond < this.data.bet_place) {
            ControllScreenDialog.instance().addDialog(Language.instance().getData("45"));
        } else {
            this.btnChoose.inputEnabled = false;
            this.event.choose_bet.dispatch(this.data);
        }
    }

    getData() {
        return this.data;
    }
    setData(data, idx) {
        this.data = data;
        this.txtMoneyBet.text = this.data.bet_place;

        this.x = game.width;
        game.add.tween(this).to({
            x: 0
        }, 200, Phaser.Easing.Power1, true, 100 + 50 * (idx + 1));
    }

    destroy() {
        super.destroy();
    }
}