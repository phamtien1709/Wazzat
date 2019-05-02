import BaseView from "../../../BaseView.js";
import SocketController from "../../../../controller/SocketController.js";
import LoadingAnim from "../../../component/LoadingAnim.js";
import SpriteScale9Base from "../../../component/SpriteScale9Base.js";
import EventModeItemChat from "./EventModeItemChat.js";
import ButtonBase from "../../../component/ButtonBase.js";
import DataCommand from "../../../../model/DataCommand.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import KeyBoard from "../../../component/KeyBoard.js";
import MainData from "../../../../model/MainData.js";
import SendEventModeGetLogChat from "../../../../model/eventmode/server/senddata/SendEventModeGetLogChat.js";
import ListView from "../../../../../libs/listview/list_view.js";
import Language from "../../../../model/Language.js";

export default class EventModeChat extends BaseView {
    static get EVENT_JOIN_CHAT() {
        return "EVENT_JOIN_CHAT"
    }
    static get EVENT_USER_LOAD_MESSAGE() {
        return "EVENT_USER_LOAD_MESSAGE";
    }

    static get EVENT_USER_SEND_MESSAGE() {
        return "EVENT_USER_SEND_MESSAGE";
    }

    static get EVENT_CHAT_MESSAGE_BROADCAST() {
        return "EVENT_CHAT_MESSAGE_BROADCAST";
    }

    static get USER_JOIN_CHAT_ROOM_SUCCESS() {
        return "USER_JOIN_CHAT_ROOM_SUCCESS";
    }


    constructor(event_id) {

        super(game, null);
        /*
        let config = {
            debug: true,
            host: "103.9.77.122",
            port: 8098,
            useSSL: false,
            zone: "MusicQuiz"
        }*/

        this.arrChat = [];
        this.ktShowAll = false;
        this.positionEventMode = JSON.parse(game.cache.getText('positionEventMode'));
        this.loading = null;
        this.event_id = event_id;
        this.listChat = null;





        this.config = {
            debug: false,
            host: "yan.gamezoka.com",
            port: 8460,
            useSSL: true,
            zone: "MusicChat"
        }

        if (MainData.instance().response !== null) {
            if (MainData.instance().response.hasOwnProperty("sfs_chat_info")) {
                this.config.debug = MainData.instance().response.sfs_chat_info.sfs_chat_debug;
                this.config.host = MainData.instance().response.sfs_chat_info.sfs_chat_host;
                this.config.port = MainData.instance().response.sfs_chat_info.sfs_chat_port;
                this.config.useSSL = MainData.instance().response.sfs_chat_info.sfs_chat_ssl;
                this.config.zone = MainData.instance().response.sfs_chat_info.sfs_chat_zone;
            }
        }

        this.bg = new SpriteScale9Base(this.positionEventMode.queueroom_bg_chat);
        this.addChild(this.bg);

        this.btnShowChat = new ButtonBase(this.positionEventMode.queueroom_button_showchat, this.chooseShowchat, this);
        this.btnShowChat.anchor.x = 0.5;
        this.btnShowChat.anchor.y = 0.5;
        this.addChild(this.btnShowChat);

        this.buildSortChat();
        //this.buildMaxChat();


        this.btnInputText = new ButtonWithText(this.positionEventMode.queueroom_button_input_chat, Language.instance().getData("5") + "...", this.chooseChat, this);
        this.btnInputText.y = game.height - 226 * MainData.instance().scale;
        this.addChild(this.btnInputText);

        this.btnSend = new ButtonBase(this.positionEventMode.queueroom_button_send_chat, this.chooseSend, this);
        this.btnSend.y = game.height - 226 * MainData.instance().scale;
        this.addChild(this.btnSend);


        this.socket = new SFS2X.SmartFox(this.config);
        this.connect();


    }

    chooseChat() {
        this.addKeyBoard();
    }

    chooseSend() {
        this.onSubmit();
    }

    addKeyBoard() {
        console.log("addKeyBoard--------");
        if (MainData.instance().platform === "web") {
            let typeInputText = "";
            typeInputText = "input";

            // this.btnInputText.visible = false;
            let options = {
                maxLength: '',
                showTransparent: true,
                placeholder: Language.instance().getData("5") + "...",
                isSearch: false,
                typeInputText: typeInputText, // chat, search, input
                configText: {
                    width: this.btnInputText.width,
                    height: this.btnInputText.height,
                    x: this.btnInputText.x,
                    y: this.btnInputText.y
                }
            }

            KeyBoard.instance().show(options);
        } else {
            let typeInputText = "";
            typeInputText = "chat";

            // this.btnInputText.visible = false;
            let options = {
                maxLength: '',
                showTransparent: true,
                placeholder: Language.instance().getData("5") + "...",
                isSearch: false,
                typeInputText: typeInputText, // chat, search, input
                configText: {
                    width: this.btnInputText.width,
                    height: this.btnInputText.height,
                    x: this.btnInputText.x,
                    y: this.btnInputText.y
                }
            }

            KeyBoard.instance().show(options);
        }
    }
    onSubmit() {
        let str = KeyBoard.instance().getValue();
        if (str != "") {

            let dataChat = new SFS2X.SFSObject();
            dataChat.putUtfString("message", str);
            dataChat.putLong("event_id", this.event_id);
            this.sendData(EventModeChat.EVENT_USER_SEND_MESSAGE, dataChat);
        }

        KeyBoard.instance().setValue("");
    }

    onCancel() {
        console.log("onCancel -----------------");
        KeyBoard.instance().hide();
        this.btnInputText.visible = true;
    }

    hideKeyboard() {
        console.log("hideKeyboard ----------------------");
        KeyBoard.instance().hide();
        if (this.ktShowAll) {
            this.buildMaxChat();
        } else {
            this.buildSortChat();
        }
    }



    changeHeightKeyBoard(height) {

        this.removeListView();
        this.btnShowChat.visible = false;

        this.bg.y = 61;
        this.bg.height = game.height - 61;

        this.btnShowChat.scale.y = 1;
        this.btnShowChat.x = this.bg.width / 2;
        this.btnShowChat.y = this.bg.y + 18 * MainData.instance().scale;


        let parentChat = new Phaser.Group(game, 0, 0, null);
        this.listChat = new ListView(game, parentChat, new Phaser.Rectangle(0, 0, game.width, game.height - height - 61), {
            direction: 'y',
            padding: 15 * MainData.instance().scale,
            searchForClicks: true
        });

        parentChat.x = 0;
        parentChat.y = 61;
        this.addChild(parentChat);

        for (let i = 0; i < this.arrChat.length; i++) {
            let item = new EventModeItemChat(this.arrChat[i]);
            item.setData(i);
            this.listChat.add(item);
        }
        if (this.arrChat.length > 4) {
            this.listChat.tweenToItem(this.arrChat.length - 1);
        }
    }

    changeKeyBoard() {

    }

    removeListView() {
        if (this.listChat !== null) {
            this.removeChild(this.listChat);
            this.listChat.removeAll();
            this.listChat.destroy();
            this.listChat = null;
        }
    }
    chooseShowchat() {
        if (this.ktShowAll) {
            this.buildSortChat();
        } else {
            this.buildMaxChat();
        }
    }

    buildSortChat() {

        this.ktShowAll = false;

        this.removeListView();
        this.btnShowChat.visible = true;

        this.bg.y = this.positionEventMode.queueroom_bg_chat.y * MainData.instance().scale;
        this.bg.height = game.height - 535 * MainData.instance().scale;

        this.btnShowChat.scale.y = 1;
        this.btnShowChat.x = this.bg.width / 2;
        this.btnShowChat.y = this.bg.y + 18 * MainData.instance().scale;


        let parentChat = new Phaser.Group(game, 0, 0, null);
        this.listChat = new ListView(game, parentChat, new Phaser.Rectangle(0, 0, game.width, game.height - 822 * MainData.instance().scale), {
            direction: 'y',
            padding: 9 * MainData.instance().scale,
            searchForClicks: true
        });

        parentChat.x = 0;
        parentChat.y = 580 * MainData.instance().scale;
        this.addChild(parentChat);


        for (let i = 0; i < this.arrChat.length; i++) {
            let item = new EventModeItemChat(this.arrChat[i]);
            item.setData(i);
            this.listChat.add(item);
        }
        if (this.arrChat.length > 4) {
            this.listChat.tweenToItem(this.arrChat.length - 1);
        }
    }
    buildMaxChat() {
        this.removeListView();

        this.btnShowChat.visible = true;
        this.ktShowAll = true;

        this.bg.y = 61 * MainData.instance().scale;
        this.bg.height = game.height;

        this.btnShowChat.scale.y = -1;
        this.btnShowChat.x = this.bg.width / 2;
        this.btnShowChat.y = this.bg.y + 18 * MainData.instance().scale;

        let parentChat = new Phaser.Group(game, 0, 0, null);
        this.listChat = new ListView(game, parentChat, new Phaser.Rectangle(0, 0, game.width, (game.height - 365 * MainData.instance().scale)), {
            direction: 'y',
            padding: 18 * MainData.instance().scale,
            searchForClicks: false
        });

        parentChat.x = 0;
        parentChat.y = 120 * MainData.instance().scale;
        this.addChild(parentChat);

        for (let i = 0; i < this.arrChat.length; i++) {
            let item = new EventModeItemChat(this.arrChat[i]);
            item.setData(i);
            this.listChat.add(item);
        }
        if (this.arrChat.length > 9) {
            this.listChat.tweenToItem(this.arrChat.length - 1);
        }
    }

    addLoading() {
        this.removeLoading();
        this.loading = new LoadingAnim();
        this.addChild(this.loading);
    }
    removeLoading() {
        if (this.loading !== null) {
            this.removeChild(this.loading);
            this.loading.destroy();
            this.loading = null;
        }
    }


    connect() {
        this.addLoading();
        this.addEvent();
        this.socket.connect();

    }

    addEvent() {

        this.removeEvent();

        this.socket.addEventListener(SFS2X.SFSEvent.CONNECTION, this.onConnectionCallback, this);
        this.socket.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, this.onConnectionLostCallback, this);
        this.socket.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, this.onExtensionResponseCallback, this);
        this.socket.addEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this.onRoomJoinErrorCallback, this);
        this.socket.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, this.onRoomJoinCallback, this);
        this.socket.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, this.onLoginErrorCallback, this);
        this.socket.addEventListener(SFS2X.SFSEvent.LOGIN, this.onLoginCallback, this);
        this.socket.addEventListener(SFS2X.SFSEvent.PUBLIC_MESSAGE, this.onPublicMessageCallback, this);
        this.socket.addEventListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this.onUserVarsUpdate, this);


        KeyBoard.instance().event.change.add(this.changeKeyBoard, this);
        KeyBoard.instance().event.changeHeight.add(this.changeHeightKeyBoard, this);
        KeyBoard.instance().event.hideKeyboard.add(this.hideKeyboard, this);
        KeyBoard.instance().event.enter.add(this.onSubmit, this);
        KeyBoard.instance().event.submit.add(this.onSubmit, this);
        KeyBoard.instance().event.cancle.add(this.onCancel, this);
    }

    removeEvent() {
        console.log("removeEvent -------");
        this.socket.removeEventListener(SFS2X.SFSEvent.CONNECTION, this.onConnectionCallback, this);
        this.socket.removeEventListener(SFS2X.SFSEvent.CONNECTION_LOST, this.onConnectionLostCallback, this);
        this.socket.removeEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, this.onExtensionResponseCallback, this);
        this.socket.removeEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this.onRoomJoinErrorCallback, this);
        this.socket.removeEventListener(SFS2X.SFSEvent.ROOM_JOIN, this.onRoomJoinCallback, this);
        this.socket.removeEventListener(SFS2X.SFSEvent.LOGIN_ERROR, this.onLoginErrorCallback, this);
        this.socket.removeEventListener(SFS2X.SFSEvent.LOGIN, this.onLoginCallback, this);
        this.socket.removeEventListener(SFS2X.SFSEvent.PUBLIC_MESSAGE, this.onPublicMessageCallback, this);
        this.socket.removeEventListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this.onUserVarsUpdate, this);

        KeyBoard.instance().event.change.remove(this.changeKeyBoard, this);
        KeyBoard.instance().event.changeHeight.remove(this.changeHeightKeyBoard, this);
        KeyBoard.instance().event.hideKeyboard.remove(this.hideKeyboard, this);
        KeyBoard.instance().event.enter.remove(this.onSubmit, this);
        KeyBoard.instance().event.submit.remove(this.onSubmit, this);
        KeyBoard.instance().event.cancle.remove(this.onCancel, this);
    }

    onUserVarsUpdate(event) {

    }

    onPublicMessageCallback(event) {
        LogConsole.log("onPublicMessageCallback");
        LogConsole.log(event);
        let command = event.message;
        if (command === DataCommand.CHAT_EVENT_MODE) {
            let sender = event.sender;
            let isMe = sender.isItMe;
            let room = event.room;
            let user = room._userManager._usersByName.get(sender.name);
            // console.log('HIHIHI');
            // console.log()
            let dataChat = {
                user_id: user.getVariable("user_id").value,
                user_name: user.getVariable("user_name").value,
                avatar: user.getVariable("avatar").value,
                vip: user.getVariable("vip").value,
                message: event.data.getUtfString("message"),
                sent_at: data.getLong("sent_at")
            }
            this.buildItemChat(dataChat);
        }
    }

    buildItemChat(dataChat) {
        this.addItemChat(dataChat);
    }

    buildHistoryChat(messages) {
        let arrHistory = [];

        this.listChat.removeAll();
        this.listChat.reset();
        this.arrChat = [];

        for (let i = 0; i < messages.size(); i++) {
            let data = messages.getSFSObject(i);
            let dataChat = {
                user_id: data.getInt("user_id"),
                user_name: data.getUtfString("user_name"),
                avatar: data.getUtfString("avatar"),
                vip: data.getBool("vip"),
                message: data.getUtfString("message"),
                sent_at: data.getLong("sent_at")
            }

            arrHistory.push(dataChat);
        }

        arrHistory = arrHistory.sort(this.sortChat);
        for (let i = 0; i < arrHistory.length; i++) {
            this.buildItemChat(arrHistory[i]);
        }
        if (this.ktShowAll) {
            if (this.arrChat.length > 9) {
                this.listChat.tweenToItem(this.arrChat.length - 1);
            }
        } else {
            if (this.arrChat.length > 4) {
                this.listChat.tweenToItem(this.arrChat.length - 1);
            }
        }
    }

    sortChat(a1, a2) {
        if (a1.sent_at > a2.sent_at) {
            return 1;
        } else if (a1.sent_at < a2.sent_at) {
            return -1;
        } else {
            return 0;
        }
    }

    addItemChat(dataChat, idx = 0) {
        LogConsole.log("addItemChat----");
        LogConsole.log(dataChat);
        if (this.arrChat.length < 30) {
            let item = new EventModeItemChat(dataChat);
            item.setData(idx);
            this.listChat.add(item);
            this.arrChat.push(dataChat);
        } else {
            this.arrChat.splice(0, 1);
            this.arrChat.push(dataChat);
            for (let i = 0; i < this.listChat.grp.children.length; i++) {
                let item = this.listChat.grp.children[i];
                item.changeData(this.arrChat[i]);
            }
        }
    }

    onExtensionResponseCallback(event) {
        LogConsole.log("onExtensionResponseCallback--------------");
        LogConsole.log("cmd : " + event.cmd);
        LogConsole.log("data : " + event.params.getDump());
        switch (event.cmd) {
            case EventModeChat.EVENT_JOIN_CHAT:
                break;
            case EventModeChat.EVENT_USER_LOAD_MESSAGE:
                this.removeLoading();
                if (event.params.getUtfString("status") === "OK") {
                    this.buildHistoryChat(event.params.getSFSArray("messages"));
                }
                break;
            case EventModeChat.USER_JOIN_CHAT_ROOM_SUCCESS:

                break;
            case EventModeChat.EVENT_CHAT_MESSAGE_BROADCAST:
                let data = event.params;
                // console.log('GUGUGUG')
                // console.log(event.params);
                let dataChat = {
                    user_id: data.getInt("user_id"),
                    user_name: data.getUtfString("user_name"),
                    avatar: data.getUtfString("avatar"),
                    vip: data.getBool("vip"),
                    // vip: true,
                    message: data.getUtfString("message"),
                    sent_at: data.getLong("sent_at")
                }
                this.buildItemChat(dataChat);

                if (this.arrChat.length > 0) {
                    this.listChat.tweenToItem(this.arrChat.length - 1);
                }
                break;

        }
    }

    onLoginCallback(event) {
        LogConsole.log("onLoginCallback");
        LogConsole.log(event);

        var userVars = [];
        userVars.push(new SFS2X.SFSUserVariable("user_id", SocketController.instance().dataMySeft.user_id));
        userVars.push(new SFS2X.SFSUserVariable("user_name", SocketController.instance().dataMySeft.user_name));
        userVars.push(new SFS2X.SFSUserVariable("avatar", SocketController.instance().dataMySeft.avatar));
        userVars.push(new SFS2X.SFSUserVariable("vip", SocketController.instance().dataMySeft.vip));

        this.socket.send(new SFS2X.SetUserVariablesRequest(userVars));

        let params = new SFS2X.SFSObject();
        params.putLong("event_id", this.event_id);
        this.sendData(EventModeChat.EVENT_JOIN_CHAT, params);
    }
    onLoginErrorCallback(event) {
        LogConsole.log("onLoginErrorCallback");
        LogConsole.log(event);
    }

    onRoomJoinCallback(event) {
        LogConsole.log("onRoomJoinCallback");
        LogConsole.log(event);

        this.listChat.removeAll();
        this.listChat.reset();

        this.sendData(EventModeChat.EVENT_USER_LOAD_MESSAGE, SendEventModeGetLogChat.begin(this.event_id, this.getTime()));
    }
    onRoomJoinErrorCallback(event) {
        LogConsole.log("onRoomJoinErrorCallback");
        LogConsole.log(event);
    }

    onConnectionCallback(event) {
        LogConsole.log("onConnectionCallback");
        LogConsole.log(event);
        if (event.success === true) {
            //this.socket.send(new SFS2X.JoinRoomRequest("MusicQuiz"));
            let params = new SFS2X.SFSObject();
            params.putUtfString("token", "heheh");
            this.socket.send(new SFS2X.LoginRequest(SocketController.instance().dataMySeft.user_id + "", "", params, this.config.zone));
        } else {
            LogConsole.log("loi roi");
            //this.removeEvent();
            this.connect();
        }
    }

    onConnectionLostCallback(event) {
        LogConsole.log("onConnectionLostCallback");
        LogConsole.log(event);
        //this.removeEvent();
        if (SocketController.instance().roomLobby !== null) {
            this.connect();
        }
    }

    sendData(type, data) {
        LogConsole.log("sendData");
        LogConsole.log("type : " + type);

        if (data != null) {
            LogConsole.log("data : " + data.getDump());
        }
        this.socket.send(new SFS2X.ExtensionRequest(type, data, this.socket.lastJoinedRoom));
    }

    sendPublicChat(command, dataChat) {
        this.socket.send(new SFS2X.PublicMessageRequest(command, dataChat, this.socket.lastJoinedRoom));
    }

    destroy() {
        this.onCancel();
        this.socket.disconnect();
        this.removeEvent();
        this.removeAllItem();
        this.removeListView();
        super.destroy();
    }
}