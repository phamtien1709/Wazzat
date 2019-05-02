import BaseView from "../../../BaseView.js";
import ListView from "../../../../../libs/listview/list_view.js";
import SocketController from "../../../../controller/SocketController.js";
import OnlineModeCommand from "../../../../model/onlineMode/dataField/OnlineModeCommand.js";
import OnlineModeChooseBetItem from "../../item/OnlineModeChooseBetItem.js";
import OnlineModeTreeTabMenu from "../../item/OnlineModeTreeTabMenu.js";
import DataConst from "../../../../model/DataConst.js";

import OnlineModeHeaderItem from "../../item/OnlineModeHeaderItem.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import ControllLoading from "../../../ControllLoading.js";
import IronSource from "../../../../IronSource.js";
import DataUser from "../../../../model/user/DataUser.js";
import Language from "../../../../model/Language.js";
import MainData from "../../../../model/MainData.js";


export default class OnlineModeListBet extends BaseView {
    constructor(dataGennes) {
        super(game, null);
        ControllLoading.instance().showLoading();
        this.dataGennes = dataGennes;
        this.event = {
            back: new Phaser.Signal(),
            backGenres: new Phaser.Signal(),
            choose_bet: new Phaser.Signal()
        }

        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);


        this.tabTree = new OnlineModeTreeTabMenu(OnlineModeTreeTabMenu.TREE_BET,
            DataConst.getNameRegion(this.dataGennes.region),
            this.dataGennes.genre
        );
        this.tabTree.event.backGenres.add(this.chooseBackToGenres, this);
        this.tabTree.y = 100 * MainData.instance().scale;
        this.addChild(this.tabTree);


        let parentBet = new Phaser.Group(game, 0, 0, null);
        this.listBet = new ListView(game, parentBet, new Phaser.Rectangle(0, 0, game.width, game.height - 270 * MainData.instance().scale), {
            direction: 'y',
            padding: 18 * MainData.instance().scale,
            searchForClicks: true
        });

        parentBet.x = 0;
        parentBet.y = 270 * MainData.instance().scale;
        this.addChild(parentBet);


        this.header = new OnlineModeHeaderItem();
        this.header.event.back.add(this.chooseBack, this);
        this.header.setDiamond();
        this.addChild(this.header);

        //this.addEvent();
    }

    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        DataUser.instance().event.load_online_mode_bet_complete.add(this.buildDataRoomBet, this);
        //SocketController.instance().sendData(OnlineModeCommand.ONLINE_MODE_BETS_REQUEST, SendOnlineModeBets.begin(this.dataGennes.id));
        if (DataUser.instance().ktLoadOnlineModeBet === true) {
            this.buildDataRoomBet();
        } else {
            DataUser.instance().sendGetOnlineModeBet();
        }
        IronSource.instance().showBanerChooseBettingQuickPlayScreen();
    }

    buildDataRoomBet() {
        this.buidlListBet();
    }

    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
        DataUser.instance().event.load_online_mode_bet_complete.remove(this.buildDataRoomBet, this);
    }
    getData(data) {
        switch (data.cmd) {
            case OnlineModeCommand.ONLINE_MODE_BETS_RESPONSE:
                //this.buidlListBet(GetOnlineModeMoreBets.begin(data.params));
                //ControllLoading.instance().hideLoading();
                break;
        }
    }
    buidlListBet() {
        let arrBets = DataUser.instance().quickplay_bet_setting;
        for (let i = 0; i < arrBets.length; i++) {
            if (SocketController.instance().dataMySeft.level >= arrBets[i].user_level_required) {
                let item = new OnlineModeChooseBetItem();
                item.event.choose_bet.add(this.chooseBet, this);
                arrBets[i].genre = this.dataGennes.genre;
                item.setData(arrBets[i], i);
                this.listBet.add(item);
            }
        }

        game.time.events.add(100, this.buildHideLoading, this);
    }

    buildHideLoading() {
        ControllLoading.instance().hideLoading();
    }

    chooseBet(data) {
        LogConsole.log("choose_bet");

        data.dataGennes = this.dataGennes;
        MainData.instance().dataPlayOnlineMode.bet_place = data.bet_place;

        if (SocketController.instance().dataMySeft.diamond < data.bet_place) {
            ControllScreenDialog.instance().addDialogConfirnMoney(Language.instance().getData("100"));
        } else {
            this.event.choose_bet.dispatch(data);
        }
    }

    chooseBackToGenres() {
        this.event.backGenres.dispatch();
    }
    chooseBack() {
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