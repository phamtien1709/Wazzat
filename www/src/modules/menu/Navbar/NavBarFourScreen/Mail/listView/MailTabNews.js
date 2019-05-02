import MailMessengerSprite from "../items/MailMessengerSprite.js";
import AjaxServerMail from "../../../../../../common/AjaxServerMail.js";
import SocketController from "../../../../../../controller/SocketController.js";
import ControllScreenDialog from "../../../../../../view/ControllScreenDialog.js";
import ListView from "../../../../../../../libs/listview/list_view.js";
import EventGame from "../../../../../../controller/EventGame.js";
import MainData from "../../../../../../model/MainData.js";
import AjaxMessages from "../../../../../../common/AjaxMessages.js";
import LoadingAnim from "../../../../../../view/component/LoadingAnim.js";
import BaseGroup from "../../../../../../view/BaseGroup.js";

export default class MailTabNews extends BaseGroup {
    constructor(list) {
        super(game)
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.list = list;
        this.event = {
            countUnread: new Phaser.Signal()
        }
        // LogConsole.log(Date.now());
        this.checkLoad = false;
        this.now = this.getTimeNow();
        // LogConsole.log(this.now);
        this.afterInit();
    }
    getTimeNow() {
        let now = new Date();
        let timeNow = now.toISOString().split('T');
        timeNow[1] = timeNow[1].split('Z');
        timeNow[1] = timeNow[1][0];
        // LogConsole.log(timeNow);
        return timeNow;
    }

    afterInit() {
        this.chatScreen = null;
        // LogConsole.log(this.list);
        this.group = new Phaser.Group(game);
        this.addChild(this.group);
        const bounds = new Phaser.Rectangle(0, 207 * window.GameConfig.RESIZE, game.width, (game.height - 342) * window.GameConfig.RESIZE);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 0,
            searchForClicks: true
        }
        this.listView = new ListView(game, this.group, bounds, options);
        //
        this.loadMessagesDone();
        this.addEventExtension();
    }

    addEventExtension() {
        EventGame.instance().event.backChat.add(this.backChat, this);
        EventGame.instance().event.loadMessagesDone.add(this.loadMessagesDone, this);
        EventGame.instance().event.newMessage.add(this.newMessage, this);
    }

    removeEventExtension() {
        EventGame.instance().event.backChat.remove(this.backChat, this);
        EventGame.instance().event.loadMessagesDone.remove(this.loadMessagesDone, this);
        EventGame.instance().event.newMessage.add(this.newMessage, this);
    }

    newMessage() {
        this.ajaxGetListMail();
    }

    loadMessagesDone() {
        if (this.checkLoad == false) {
            if (MainData.instance().dataMessagesLocal !== null) {
                this.checkLoad = true;
                if (this.loadingAnim !== undefined) {
                    this.loadingAnim.destroy();
                    this.removeChild(this.loadingAnim);
                }
                this.ajaxGetListMail();
            } else {
                this.checkLoad = false;
                this.loadingAnim = new LoadingAnim();
                this.addChild(this.loadingAnim);
            }
        }
    }

    backChat() {
        this.ajaxGetListMail();
    }

    ajaxGetListMail() {
        this.onListMessageCallback(AjaxMessages.instance().listConversation(MainData.instance().dataMessagesLocal))
    }

    onListMessageCallback(response) {
        MainData.instance().messageData = response;
        //
        this.handleResponseListMess(response);
        if (this.listView !== null && this.listView !== undefined) {
            this.listView.removeAll();
            this.addMessenger();
        }
    }

    addMessenger() {
        for (let i = 0; i < this.list.length; i++) {
            let messenger = this.list[i];
            if (messenger.user !== undefined) {
                let messengerSprite = new MailMessengerSprite(messenger, i);
                messengerSprite.event.choosedMessenger.add(this.choosedMessenger, this);
                this.listView.add(messengerSprite);
            }
        }
    }

    choosedMessenger(messenger) {
        this.addChatScreen(messenger);
    }

    addChatScreen(messenger) {
        let friend = {};
        if (messenger.from == SocketController.instance().socket.mySelf.getVariable('user_id').value) {
            friend = {
                id: messenger.to,
                user_name: messenger.user.user_name,
                avatar: messenger.user.avatar,
                vip: messenger.user.vip
            }
        } else {
            friend = {
                id: messenger.from,
                user_name: messenger.user.user_name,
                avatar: messenger.user.avatar,
                vip: messenger.user.vip
            }
        }
        ControllScreenDialog.instance().addChatScreen(friend);
    }

    handleResponseListMess(data) {
        // console.log(data);
        var list = [];
        for (let i = 0; i < data.length; i++) {
            list.push(data[i]);
        }
        this.list = list;
        // this.countUnread(countUnread);
    }

    countUnread(countUnread) {
        this.event.countUnread.dispatch(countUnread);
    }

    destroy() {
        if (this.listView !== null) {
            this.listView.removeAll();
            this.listView.destroy();
            this.listView = null;
        }
        this.removeEventExtension();
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        super.destroy();
    }
}