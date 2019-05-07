import BaseView from "../../../BaseView.js";
import ListView from "../../../../../libs/listview/list_view.js";
import OnlineModeCRDataCommand from "../../../../model/onlinemodecreatroom/datafield/OnlineModeCRDataCommand.js";
import SocketController from "../../../../controller/SocketController.js";
import OnlineModeHeaderItem from "../../item/OnlineModeHeaderItem.js";
import TextBase from "../../../component/TextBase.js";
import MainData from "../../../../model/MainData.js";
import OnlineModeChooseBetItem from "../../item/OnlineModeChooseBetItem.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import ControllLoading from "../../../ControllLoading.js";
import IronSource from "../../../../IronSource.js";
import EventGame from "../../../../controller/EventGame.js";
import DataUser from "../../../../model/user/DataUser.js";
import Language from "../../../../model/Language.js";


export default class OnlineModeChooseBetScreen extends BaseView {
    constructor() {
        super(game, null);
    }
    afterCreate() {
        this.event = {
            back: new Phaser.Signal(),
            choose_bet: new Phaser.Signal()
        }
        ControllLoading.instance().showLoading();
        this.arrBet = [];

        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);



        this.txtChonMucCuoc = new TextBase(MainData.instance().positionCreateRoom.choose_bet_label_chonmucuoc, Language.instance().getData("70"));
        this.txtChonMucCuoc.setTextBounds(0, 0, game.width, 72 * MainData.instance().scale);
        this.addChild(this.txtChonMucCuoc)


        let parentBet = new Phaser.Group(game, 0, 0, null);
        this.listBet = new ListView(game, parentBet, new Phaser.Rectangle(0, 0, game.width, game.height - 235 * MainData.instance().scale), {
            direction: 'y',
            padding: 15 * MainData.instance().scale,
            searchForClicks: true
        });

        parentBet.x = 0;
        parentBet.y = 230 * MainData.instance().scale;
        this.addChild(parentBet);


        this.header = new OnlineModeHeaderItem();
        this.header.setDiamond();
        this.header.event.back.add(this.chooseBack, this);
        this.addChild(this.header);

    }

    addEvent() {

        EventGame.instance().event.backButton.add(this.chooseBack, this);
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        DataUser.instance().event.load_online_mode_room_bet_complete.add(this.buildDataRoomBet, this);
        if (DataUser.instance().ktLoadOnlineModeRoomBet === true) {
            this.buildDataRoomBet();
        } else {
            DataUser.instance().sendGetOnlineModeRoomBet();
        }

        IronSource.instance().showBanerChooseBettingCreateRoomScreen();
    }

    removeEvent() {
        EventGame.instance().event.backButton.remove(this.chooseBack, this);
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
        DataUser.instance().event.load_online_mode_room_bet_complete.remove(this.buildDataRoomBet, this);
    }

    buildDataRoomBet() {

        this.arrBet = DataUser.instance().createroom_bet_setting;
        this.addListBet();

        game.time.events.add(100, this.buildHideLoading, this);
    }

    buildHideLoading() {
        ControllLoading.instance().hideLoading();
    }

    getData(event) {
        switch (event.cmd) {
            case OnlineModeCRDataCommand.ONLINE_MODE_ROOM_LOAD_BET_RESPONSE:
                break;
        }
    }

    addListBet() {
        this.listBet.removeAll();
        this.listBet.reset();

        for (let i = 0; i < this.arrBet.length; i++) {
            let item = new OnlineModeChooseBetItem();
            item.event.choose_bet.add(this.chooseBet, this);
            item.setData(this.arrBet[i], i);
            this.listBet.add(item);
        }

    }

    chooseBet(data) {
        LogConsole.log("choose_bet");
        if (SocketController.instance().dataMySeft.diamond < this.betMoney) {
            ControllScreenDialog.instance().addDialogConfirnMoney(Language.instance().getData("71"));
        } else {
            this.event.choose_bet.dispatch(data.id, data.bet_place);
        }
    }

    chooseBack() {
        //console.log('HERE HERE HERE');
        this.event.back.dispatch();
    }

    destroy() {
        this.removeEvent();
        this.listBet.removeAll();
        this.listBet.destroy();
        IronSource.instance().hideBanner();
        super.destroy();
    }
}