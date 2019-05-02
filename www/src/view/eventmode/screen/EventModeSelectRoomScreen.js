import BaseView from "../../BaseView.js";
import SocketController from "../../../controller/SocketController.js";
import EventModeRoomItem from "../item/selectroom/EventModeRoomItem.js";
import EventModeCommand from "../../../model/eventmode/datafield/EventModeCommand.js";
import EventModeHeaderItem from "../item/selectroom/EventModeHeaderItem.js";
import EventGameRoomMode from "../item/selectroom/EventGameRoomMode.js";
import MainData from "../../../model/MainData.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import ListView from "../../../../libs/listview/list_view.js";
import ControllLoading from "../../ControllLoading.js";
import IronSource from "../../../IronSource.js";
import EventGame from "../../../controller/EventGame.js";
import DataUser from "../../../model/user/DataUser.js";
import Language from "../../../model/Language.js";
import ControllLoadCacheUrl from "../../component/ControllLoadCacheUrl.js";


export default class EventModeSelectRoomScreen extends BaseView {
    constructor() {
        super(game, null);
        ControllLoading.instance().showLoading();
        this.event = {
            back: new Phaser.Signal(),
            choose_event: new Phaser.Signal(),
            view_history: new Phaser.Signal()
        }

        this.objStart = {};

        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);



        let parentRoom = new Phaser.Group(game, 0, 0, null);
        this.listRoom = new ListView(game, parentRoom, new Phaser.Rectangle(0, 0, game.width, game.height - 142 * MainData.instance().scale), {
            direction: 'y',
            padding: 38 * MainData.instance().scale,
            searchForClicks: true
        });


        parentRoom.x = 0;
        parentRoom.y = 142 * MainData.instance().scale;
        this.addChild(parentRoom);


        this.header = new EventModeHeaderItem();
        this.header.event.back.add(this.chooseBack, this);
        this.addChild(this.header);

        // this.addEvent();

        // this.addListRoom();


        //this.win = new EventModePopupWin();
        //this.addChild(this.win);

        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Event_mode);

        IronSource.instance().showBanerEventRoomScreen();
    }

    addEvent() {
        EventGame.instance().event.backButton.add(this.chooseBack, this);
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        DataUser.instance().event.event_update.add(this.addListRoom, this);
        DataUser.instance().event.load_event_list_complete.add(this.buildDataRoomEvent, this);

        if (DataUser.instance().ktLoadEventList === true) {
            this.buildDataRoomEvent();
        } else {
            DataUser.instance().sendGetEventList();
        }
    }

    buildDataRoomEvent() {
        this.addListRoom();
        SocketController.instance().sendData(EventModeCommand.EVENT_MODE_LOAD_REQUEST, null)
        ControllLoading.instance().hideLoading();
    }

    removeEvent() {
        EventGame.instance().event.backButton.remove(this.chooseBack, this);
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
        DataUser.instance().event.event_update.remove(this.addListRoom, this);
        DataUser.instance().event.load_event_list_complete.remove(this.buildDataRoomEvent, this);
    }

    getData(data) {
        switch (data.cmd) {
            case EventModeCommand.EVENT_MODE_LOAD_LIST_RESPONSE:
                break;
            case EventModeCommand.EVENT_MODE_LOAD_RESPONSE:
                if (data.params.getUtfString("status") === "OK") {
                    let event_ccu = data.params.getSFSArray("event_ccu");
                    for (let i = 0; i < event_ccu.size(); i++) {
                        let ccu = event_ccu.getSFSObject(i);
                        if (this.objStart[ccu.getLong("event_id")]) {
                            this.objStart[ccu.getLong("event_id")].setCuu(ccu.getInt("number_user"));
                        }
                    }
                }

                break;
        }
    }

    addListRoom() {
        this.listRoom.removeAll();
        this.listRoom.reset();
        let i = 0;
        let idx = -1;
        this.objStart = {};
        let isStart = new EventGameRoomMode(Language.instance().getData("29"));
        this.listRoom.add(isStart);

        let isStartRoom = DataUser.instance().roomEvent.getStartRoom();

        for (i = 0; i < isStartRoom.length; i++) {
            idx++;
            let item = new EventModeRoomItem(isStartRoom[i], idx);
            item.event.choose_item.add(this.chooseItem, this);
            item.x = 35 * MainData.instance().scale;
            this.listRoom.add(item);
            this.objStart[isStartRoom[i].id] = item;

        }
        isStart.setCount(isStartRoom.length);


        let isWaitting = new EventGameRoomMode(Language.instance().getData("30"));
        this.listRoom.add(isWaitting);

        let isWaittingRoom = DataUser.instance().roomEvent.getWaittingRoom();

        for (i = 0; i < isWaittingRoom.length; i++) {
            idx++;
            let item = new EventModeRoomItem(isWaittingRoom[i], idx);
            item.event.choose_item.add(this.chooseItem, this);
            item.x = 35 * MainData.instance().scale;
            this.listRoom.add(item);

        }
        isWaitting.setCount(isWaittingRoom.length);


        let isEnd = new EventGameRoomMode(Language.instance().getData("31"));
        this.listRoom.add(isEnd);

        let isEndRoom = DataUser.instance().roomEvent.getEndRoom();
        for (i = 0; i < isEndRoom.length; i++) {
            idx++;
            let item = new EventModeRoomItem(isEndRoom[i], idx);
            item.event.choose_item.add(this.chooseItem, this);
            item.event.view_history.add(this.viewHistory, this);
            item.x = 35 * MainData.instance().scale;
            this.listRoom.add(item);
        }
        isEnd.setCount(isEndRoom.length);

    }
    viewHistory(id) {
        this.event.view_history.dispatch(id);
    }

    chooseItem(data) {
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Event_mode_join_room_button);
        this.event.choose_event.dispatch(data);
    }

    chooseBack() {
        //console.log('HERE HERE HERE');
        this.event.back.dispatch();
    }

    destroy() {
        this.removeEvent();
        ControllLoadCacheUrl.instance().resetLoad();
        this.listRoom.removeAll();
        this.listRoom.destroy();
        IronSource.instance().hideBanner();
        super.destroy();
    }
}