import BaseView from "../../BaseView.js";
import EventModeCommand from "../../../model/eventmode/datafield/EventModeCommand.js";
import SendEventModeRanking from "../../../model/eventmode/server/senddata/SendEventModeRanking.js";
import SocketController from "../../../controller/SocketController.js";
import GetEventModeRanking from "../../../model/eventmode/server/getdata/GetEventModeRanking.js";
import EventModeRankingItem from "../item/ranking/EventModeRankingItem.js";
import EventModeHeaderItem from "../item/selectroom/EventModeHeaderItem.js";
import SpriteBase from "../../component/SpriteBase.js";
import TextBase from "../../component/TextBase.js";
import EventModeTitleRanking from "../item/ranking/EventModeTitleRanking.js";
import ListView from "../../../../libs/listview/list_view.js";
import ControllLoading from "../../ControllLoading.js";
import EventGame from "../../../controller/EventGame.js";
import Language from "../../../model/Language.js";
import ControllLoadCacheUrl from "../../component/ControllLoadCacheUrl.js";
import MainData from "../../../model/MainData.js";

export default class EventModeRankingScreen extends BaseView {
    constructor(event_id) {
        super(game, null);

        this.positionEventMode = MainData.instance().positionEventMode;
        ControllLoading.instance().showLoading();

        this.event_id = event_id;
        this.event = {
            back: new Phaser.Signal()
        }
        this.idxItem = 1;
        this.arrRanking = [];
        this.objRankMe = null;
        this.arrReward = null;
        this.ktLoad = false;
        this.ktLoadMore = false;

        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);



        let parentRanking = new Phaser.Group(game, 0, 0, null);
        this.listRanking = new ListView(game, parentRanking, new Phaser.Rectangle(0, 0, game.width, game.height - 212 * MainData.instance().scale), {
            direction: 'y',
            padding: 0,
            searchForClicks: true
        });
        this.listRanking.events.changeIndex.add(this.changeIndex, this);
        this.listRanking.scroller.events.onInputUp.add(this.checkLoadMore, this);

        parentRanking.x = 0;
        parentRanking.y = 102 * MainData.instance().scale;
        this.addChild(parentRanking);

        this.bgMe = new SpriteBase(this.positionEventMode.ranking_bg_me);
        this.bgMe.y = game.height - 108 * MainData.instance().scale;
        this.addChild(this.bgMe);


        this.txtError = new TextBase(this.positionEventMode.item_ranking_txt_error, Language.instance().getData("28"));
        this.txtError.setTextBounds(0, 0, game.width, 38 * MainData.instance().scale);
        this.txtError.y = game.height - 76 * MainData.instance().scale;
        this.addChild(this.txtError);
        this.txtError.visible = false;

        this.rankMe = null;

        this.header = new EventModeHeaderItem();
        this.header.setHelp();
        this.header.event.back.add(this.chooseBack, this);
        this.addChild(this.header);
        //this.addEvent();
    }

    changeIndex() {
        let idx = this.listRanking.getIdx();
        if (idx + 1 === this.listRanking.grp.children.length) {
            this.ktLoadMore = true;
            //this.sendLoadDataFromServer();
        }
    }

    checkLoadMore() {
        if (this.ktLoadMore === true) {
            this.ktLoadMore = false;
            this.sendLoadDataFromServer();
        } else {
            ControllLoading.instance().hideLoading();
        }
    }

    addEvent() {
        EventGame.instance().event.backButton.add(this.chooseBack, this);
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        if (this.event_id > 0) {
            this.sendLoadDataFromServer();
        } else {
            ControllLoading.instance().hideLoading();
            this.chooseBack();
        }
    }

    sendLoadDataFromServer() {
        if (this.idxItem < 100 && this.ktLoad === false) {
            this.ktLoad = true;
            ControllLoading.instance().showLoading();
            let min = this.idxItem;
            let max = this.idxItem + 9;
            if (max > 100) {
                max = 100;
            }
            SocketController.instance().sendData(EventModeCommand.EVENT_MODE_RANKING_REQUEST,
                SendEventModeRanking.begin(this.event_id, min, max));
        }
    }

    removeEvent() {
        EventGame.instance().event.backButton.remove(this.chooseBack, this);
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
    }

    getData(data) {
        switch (data.cmd) {
            case EventModeCommand.EVENT_MODE_RANKING_RESPONSE:
                this.ktLoad = false;
                let objData = GetEventModeRanking.begin(data.params);
                for (let i = 0; i < objData.arrRanking.length; i++) {
                    this.arrRanking.push(objData.arrRanking[i]);
                }
                this.idxItem = this.arrRanking.length + 1;

                if (this.objRankMe === null) {
                    this.objRankMe = objData.rankMe;
                }
                if (this.arrReward === null) {
                    this.arrReward = objData.arrReward;
                }
                this.buildRanking();
                break;
        }
    }

    removeRankMe() {
        if (this.rankMe !== null) {
            this.removeChild(this.rankMe);
            this.rankMe.destroy();
            this.rankMe = null;
        }
    }

    buildRanking() {
        this.listRanking.removeAll();
        let maxTop3 = 3;
        let idx = 0;
        if (this.arrRanking.length < 3) {
            maxTop3 = this.arrRanking.length;
        }
        for (let i = 0; i < maxTop3; i++) {
            let item;
            if (this.arrReward[i]) {
                item = new EventModeRankingItem(this.arrRanking[i], i, this.arrReward[i]);
            } else {
                item = new EventModeRankingItem(this.arrRanking[i], i);
            }

            item.beginTween(idx);
            this.listRanking.add(item);
            if (i == maxTop3 - 1) {
                item.hideLine();
            }

            idx++;
        }


        let titleTop410;
        if (this.arrReward[3]) {
            titleTop410 = new EventModeTitleRanking("4-10", this.arrReward[3]);
        } else {
            titleTop410 = new EventModeTitleRanking("4-10");
        }

        this.listRanking.add(titleTop410);
        if (this.arrRanking.length > 3) {
            let min = 3;
            let max = 10;
            if (this.arrRanking.length < 10) {
                max = this.arrRanking.length;
            }
            for (let i = min; i < max; i++) {
                let item = new EventModeRankingItem(this.arrRanking[i], i);
                item.beginTween(idx);
                this.listRanking.add(item);
                if (i == max - 1) {
                    item.hideLine();
                }
                idx++;
            }

        }

        let titleTop1150;
        if (this.arrReward[4]) {
            titleTop1150 = new EventModeTitleRanking("11-50", this.arrReward[4]);
        } else {
            titleTop1150 = new EventModeTitleRanking("11-50");
        }
        this.listRanking.add(titleTop1150);

        if (this.arrRanking.length > 10) {
            let min = 10;
            let max = 50;
            if (this.arrRanking.length < 50) {
                max = this.arrRanking.length;
            }
            for (let i = min; i < max; i++) {
                let item = new EventModeRankingItem(this.arrRanking[i], i);
                item.beginTween(idx);
                this.listRanking.add(item);
                if (i == max - 1) {
                    item.hideLine();
                }
                idx++;
            }
        }

        let titleTop51100;
        if (this.arrReward[5]) {
            titleTop51100 = new EventModeTitleRanking("51-100", this.arrReward[5]);
        } else {
            titleTop51100 = new EventModeTitleRanking("51-100");
        }
        this.listRanking.add(titleTop51100);

        if (this.arrRanking.length > 50) {
            let min = 50;
            let max = 100;
            if (this.arrRanking.length < 100) {
                max = this.arrRanking.length;
            }
            for (let i = min; i < max; i++) {
                let item = new EventModeRankingItem(this.arrRanking[i], i);
                item.beginTween();
                this.listRanking.add(item);
                if (i == max - 1) {
                    item.hideLine();
                }
            }
        }

        if (this.objRankMe.position > 0) {
            if (this.rankMe === null) {
                this.removeRankMe();
                this.objRankMe.user_name = SocketController.instance().dataMySeft.user_name;
                this.objRankMe.avatar = SocketController.instance().dataMySeft.avatar;
                if (this.objRankMe.position < 4) {
                    if (this.arrReward[this.objRankMe.position - 1]) {
                        this.rankMe = new EventModeRankingItem(this.objRankMe, this.objRankMe.position - 1, this.arrReward[this.objRankMe.position - 1], true);
                    } else {
                        this.rankMe = new EventModeRankingItem(this.objRankMe, this.objRankMe.position - 1, null, true);
                    }

                } else {
                    this.rankMe = new EventModeRankingItem(this.objRankMe, this.objRankMe.position - 1, null, true);
                }
                this.rankMe.x = 0;
                this.rankMe.y = game.height - 112 * MainData.instance().scale;
                this.addChild(this.rankMe);
            }
            this.txtError.visible = false;
        } else {
            this.txtError.visible = true;
        }

        game.time.events.add(1000, this.buildHideLoading, this);
    }

    buildHideLoading() {
        ControllLoading.instance().hideLoading();
    }

    chooseBack() {
        //console.log('HERE HERE HERE');
        this.event.back.dispatch();
    }

    destroy() {
        ControllLoadCacheUrl.instance().resetLoad();
        this.listRanking.removeAll();
        this.listRanking.destroy();
        this.removeEvent();
        super.destroy();
    }
}