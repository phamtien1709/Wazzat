import BaseView from "../../BaseView.js";
import SpriteScale9Base from "../../component/SpriteScale9Base.js";
import ListView from "../../../../libs/listview/list_view.js";
import MainData from "../../../model/MainData.js";
import OnlineModeItemPlayerListResult from "./OnlineModeItemPlayerListResult.js";
import ButtonBase from "../../component/ButtonBase.js";
import OnlineModeButtonChoiLaiResult from "./OnlineModeButtonChoiLaiResult.js";
import SocketController from "../../../controller/SocketController.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import Language from "../../../model/Language.js";

export default class OnlineModeResultListSong extends BaseView {
    constructor(arrQuestion, roomBet) {
        super(game, null);
        this.roomBet = roomBet;
        this.event = {
            replay: new Phaser.Signal(),
            close: new Phaser.Signal(),
            exit: new Phaser.Signal()
        }

        this.tween = null;
        this.ktReplay = false;

        this.positionOnlineMode = MainData.instance().positionCreateRoom;

        this.bgPlayerList = new SpriteScale9Base(this.positionOnlineMode.bg_player_list_result);
        this.bgPlayerList.x = 35 * MainData.instance().scale;
        this.bgPlayerList.y = 620 * MainData.instance().scale;
        this.bgPlayerList.width = 570 * MainData.instance().scale;
        this.bgPlayerList.height = 485 * MainData.instance().scale;
        this.addChild(this.bgPlayerList);

        let parentPlayerList = new Phaser.Group(game, 0, 0, null);
        this.listPlayer = new ListView(game, parentPlayerList, new Phaser.Rectangle(0, 0, this.bgPlayerList.width, this.bgPlayerList.height - 100 * MainData.instance().scale), {
            direction: 'y',
            padding: 5 * MainData.instance().scale,
            searchForClicks: true
        });

        this.bgPlayerList.addChild(parentPlayerList);

        //LogConsole.log("this.arrQuestion : " + JSON.stringify(this.arrQuestion));
        for (let i = 0; i < arrQuestion.length; i++) {
            let itemPlayerList = new OnlineModeItemPlayerListResult(arrQuestion[i], i);
            itemPlayerList.event.play.add(this.playSound, this);
            this.listPlayer.add(itemPlayerList);
        }

        this.btnHome = new ButtonBase(this.positionOnlineMode.button_home_player_list_result, this.chooseExit, this);
        this.btnHome.x = 35 * MainData.instance().scale;
        this.btnHome.y = 400 * MainData.instance().scale;
        this.addChild(this.btnHome);

        this.btnChoiLai = new OnlineModeButtonChoiLaiResult(
            this.positionOnlineMode.button_reset_bg_player_list_result,
            this.roomBet,
            this.chooseChoiLai,
            this
        );
        this.btnChoiLai.x = 140 * MainData.instance().scale;
        this.btnChoiLai.y = 400 * MainData.instance().scale;
        this.addChild(this.btnChoiLai);


        this.tween = game.add.tween(this.bgPlayerList).to({
            y: 0
        }, 500, Phaser.Easing.Power1, true, 300);

    }

    playSound(id) {
        for (let i = 0; i < this.listPlayer.grp.children.length; i++) {
            let itemCheck = this.listPlayer.grp.children[i];
            if (itemCheck.data.song.id !== id) {
                itemCheck.pauseSoundOut();
            } else {
                itemCheck.playSound();
            }
        }
    }

    tweenHide() {
        this.tween = game.add.tween(this).to({
            y: game.height + 100 * MainData.instance().scale
        }, 500, Phaser.Easing.Power1, true);

        this.tween.onComplete.add(this.handleComplete, this);
    }

    handleComplete() {
        this.event.close.dispatch();
    }

    chooseExit() {
        LogConsole.log("chooseExit");
        this.btnHome.inputEnabled = false;
        this.event.exit.dispatch();

    }

    chooseChoiLai() {
        LogConsole.log("chooseChoiLai : " + this.ktReplay);

        if (this.ktReplay === true) {
            LogConsole.log("SocketController.instance().dataMySeft.diamond : " + SocketController.instance().dataMySeft.diamond);
            LogConsole.log("roomBet : " + this.roomBet);
            if (SocketController.instance().dataMySeft.diamond < this.roomBet) {
                this.event.exit.dispatch();
                ControllScreenDialog.instance().addDialog(Language.instance().getData("52"));
            } else {
                this.btnHome.inputEnabled = false;
                this.tweenHide();
                this.event.replay.dispatch();
            }
        }
    }

    destroy() {
        this.listPlayer.removeAll();
        this.listPlayer.destroy();
        if (this.tween !== null) {
            this.tween.stop();
            game.tweens.remove(this.tween);
            this.tween = null;
        }
        super.destroy();
    }
}