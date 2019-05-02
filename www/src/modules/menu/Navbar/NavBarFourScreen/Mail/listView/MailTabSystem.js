import MailSystemSprite from "../items/MailSystemSprite.js";
import ListView from "../../../../../../../libs/listview/list_view.js";
import ControllScreenDialog from "../../../../../../view/ControllScreenDialog.js";
import EventGame from "../../../../../../controller/EventGame.js";
import MainData from "../../../../../../model/MainData.js";
import AjaxMessages from "../../../../../../common/AjaxMessages.js";
import LoadingAnim from "../../../../../../view/component/LoadingAnim.js";
import BaseGroup from "../../../../../../view/BaseGroup.js";

export default class MailTabSystem extends BaseGroup {
    constructor() {
        super(game)
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.positionLoadConfig = JSON.parse(game.cache.getText('positionLoadConfig'));
        // this.list = list;
        this.checkLoad = false;
        this.afterInit();
    }

    afterInit() {
        // this.mailSystemScreen = null;
        this.isSeeMail = false;
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
        // // }
        // this.listDemo = this.positionLoadConfig.demoMessengerSystem.data;
        // for (let i = 0; i < this.listDemo.length; i++) {
        //     let messenger = this.listDemo[i];
        //     // LogConsole.log(messenger);
        //     let messengerSprite = new MailSystemSprite(messenger, i);
        //     messengerSprite.event.choosedMessenger.add(this.choosedMessenger, this);
        //     this.listView.add(messengerSprite);
        // }
        //
        // this.ajaxGetListMail();
        this.loadSystemMessagesDone();
        this.addEventExtension();
    }

    addEventExtension() {
        EventGame.instance().event.backChat.add(this.backChat, this);
        EventGame.instance().event.loadSystemMessagesDone.add(this.loadSystemMessagesDone, this);
    }

    removeEventExtension() {
        EventGame.instance().event.backChat.remove(this.backChat, this);
        EventGame.instance().event.loadSystemMessagesDone.remove(this.loadSystemMessagesDone, this);
    }

    backChat() {
        this.ajaxGetListMail();
    }

    loadSystemMessagesDone() {
        if (this.checkLoad == false) {
            if (MainData.instance().systemMessagesLocal !== null) {
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

    ajaxGetListMail() {
        this.onListSystemCallback(AjaxMessages.instance().getNotiSystem(MainData.instance().systemMessagesLocal.dataMessages))
    }

    onListSystemCallback(response) {
        MainData.instance().mailData = response;
        // if (response.code == "ok") {
        if (this.listView !== null && this.listView !== undefined) {
            this.listView.removeAll();
            this.handleResponseListSystem(response);
            this.addListSystem();
        }
        // }
    }

    addListSystem() {
        for (let i = 0; i < this.list.length; i++) {
            let messenger = this.list[i];
            // LogConsole.log(messenger);
            let messengerSprite = new MailSystemSprite(messenger, i);
            messengerSprite.event.choosedMessenger.add(this.choosedMessenger, this);
            this.listView.add(messengerSprite);
        }
    }

    choosedMessenger(messenger) {
        // LogConsole.log(messenger);
        ControllScreenDialog.instance().addMailSystemScreen(messenger);
        this.isSeeMail = true;
    }

    handleResponseListSystem(data) {
        var list = [];
        for (let i = 0; i < data.length; i++) {
            list.push(data[i]);
        }
        this.list = list;
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