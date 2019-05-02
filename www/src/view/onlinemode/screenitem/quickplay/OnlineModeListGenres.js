import BaseView from "../../../BaseView.js";
import OnlineModeHeaderItem from "../../item/OnlineModeHeaderItem.js";
import OnlineModeMenuGenres from "../../item/OnlineModeMenuGenres.js";
import ScrollView from "../../../component/listview/ScrollView.js";
import SocketController from "../../../../controller/SocketController.js";
import OnlineModeCommand from "../../../../model/onlineMode/dataField/OnlineModeCommand.js";
import GetOnlineModeUseCountBroadCast from "../../../../model/onlineMode/server/getdata/GetOnlineModeUseCountBroadCast.js";
import OnlineModeItemGenres from "../../item/OnlineModeItemGenres.js";
import ControllLoading from "../../../ControllLoading.js";
import IronSource from "../../../../IronSource.js";
import SqlLiteController from "../../../../SqlLiteController.js";
import MainData from "../../../../model/MainData.js";

export default class OnlineModeListGenres extends BaseView {
    constructor() {
        super(game, null);

    }

    afterCreate() {
        ControllLoading.instance().showLoading();
        this.event = {
            back: new Phaser.Signal(),
            next_bet: new Phaser.Signal()
        }
        this.typeMenu = MainData.instance().typeMenuGenes;
        this.arrItem = [];

        this.positionCreateRoom = MainData.instance().positionCreateRoom;

        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);


        this.parenItem = game.add.group();

        let obj = {
            column: 2,
            width: game.width,
            height: game.height - 235 * MainData.instance().scale,
            rowHeight: 160 * MainData.instance().scale,
            leftDistance: 27 * MainData.instance().scale,
            direction: "y",
            distanceBetweenColumns: 36 * MainData.instance().scale,
            distanceBetweenRows: 36 * MainData.instance().scale
        }
        this.scroll = new ScrollView(obj);
        this.scroll.y = 240 * MainData.instance().scale;
        this.addChild(this.scroll);

        this.header = new OnlineModeHeaderItem();
        this.header.event.back.add(this.chooseBack, this);
        this.header.setDiamond();
        this.addChild(this.header);


        this.menu = new OnlineModeMenuGenres();
        this.menu.event.choose.add(this.chooseGenres, this);
        this.menu.y = 100 * MainData.instance().scale;
        this.addChild(this.menu);
        // this.addEvent();

    }

    chooseGenres(type) {
        this.typeMenu = type;
        MainData.instance().typeMenuGenes = this.typeMenu;
        this.buildListGenres();
    }

    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);

        SqlLiteController.instance().getGenresAll();
        SqlLiteController.instance().event.get_data_genres_complete.add(this.getDataGenresComplete, this);

        IronSource.instance().showBanerQuickPlayModeRoomScreen();

    }
    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
    }

    getDataGenresComplete(data) {
        SqlLiteController.instance().event.get_data_genres_complete.remove(this.getDataGenresComplete, this);
        this.dataGenres = data;
        this.buildListGenres();
    }

    getData(data) {
        switch (data.cmd) {
            case OnlineModeCommand.ONLINE_MODE_GENRES_RESPONSE:
                break;
            case OnlineModeCommand.ONLINE_MODE_USER_COUNT_BROADCAST:
                break;
            case OnlineModeCommand.ONLINE_MODE_COUNT_USER_ONLINE_RESPONSE:
                this.dataGenres = GetOnlineModeUseCountBroadCast.begin(this.dataGenres, data.params);
                this.buildListGenresUpdate();
                break;
        }
    }

    buildListGenres() {
        ControllLoading.instance().showLoading();

        this.arrItem = [];
        let idx = -1;

        for (let i = 0; i < this.dataGenres.length; i++) {
            let itemGenes = this.dataGenres[i];
            if (itemGenes.region === this.typeMenu) {
                idx++;
                let item = new OnlineModeItemGenres(itemGenes, idx, this.chooseItem, this);
                this.arrItem.push(item);
            }

        }

        this.scroll.viewList = this.arrItem;

        for (let i = 0; i < this.arrItem.length; i++) {
            let item = this.arrItem[i];
            item.setEffect();
        }
        game.time.events.add(100, this.buildHideLoading, this);
        SocketController.instance().sendData(OnlineModeCommand.ONLINE_MODE_COUNT_USER_ONLINE_REQUEST, null);
    }

    buildHideLoading() {
        ControllLoading.instance().hideLoading();
    }

    buildHideLoading() {
        ControllLoading.instance().hideLoading();
    }

    chooseItem(item) {
        LogConsole.log("chooseItem ------ ");
        let data = item.getData();
        this.event.next_bet.dispatch(data);
    }

    buildListGenresUpdate() {
        console.log(this.dataGenres);
        for (let i = 0; i < this.arrItem.length; i++) {
            let item = this.arrItem[i];
            let dataItem = item.getData();

            for (let j = 0; j < this.dataGenres.length; j++) {
                let dataGen = this.dataGenres[j];
                if (dataGen.id === dataItem.id) {
                    item.setData(dataGen);
                    break;
                }
            }
        }
    }

    chooseBack() {
        this.event.back.dispatch();
    }

    removeAllParentItem() {
        if (this.parenItem.children) {
            while (this.parenItem.children.length > 0) {
                let item = this.parenItem.children[0];
                // LogConsole.log(item);
                this.removeChild(item);
                item.destroy();
                item = null;
            }
        }
    }

    destroy() {
        this.removeEvent();
        this.scroll.destroy();
        this.removeAllParentItem();
        this.removeAllItem();
        IronSource.instance().hideBanner();
        super.destroy();
    }
}