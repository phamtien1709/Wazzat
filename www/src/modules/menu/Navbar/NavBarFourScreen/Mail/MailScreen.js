import MailButtonHeader from "./items/MailButtonHeader.js";
import MailTabNews from "./listView/MailTabNews.js";
import SpriteBase from "../../../../../view/component/SpriteBase.js";
import TextBase from "../../../../../view/component/TextBase.js";
import MailTabSystem from "./listView/MailTabSystem.js";
import ControllSoundFx from "../../../../../controller/ControllSoundFx.js";
import FaceBookCheckingTools from "../../../../../FaceBookCheckingTools.js";
import EventGame from "../../../../../controller/EventGame.js";
import AjaxMessages from "../../../../../common/AjaxMessages.js";
import MainData from "../../../../../model/MainData.js";
import ControllLoading from "../../../../../view/ControllLoading.js";
import Language from "../../../../../model/Language.js";
import BaseGroup from "../../../../../view/BaseGroup.js";

export default class MailScreen extends BaseGroup {
    constructor() {
        super(game)
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.getData();
        this.setData();
    }

    getData() {
        this.listMailResponse = [];
    }

    setData() {
        this.afterInit();
    }

    afterInit() {
        //
        this.addLayerTopBottom();
        this.bg;
        this.searchTab;
        this.newsTab;
        this.systemTab;
        this.friendsTab;
        //
        this.listViewNewsTab = null;
        this.listViewSystemTab = null;
        this.listViewFriendsTab = null;
        this.typeOfTab = null;
        //
        this.addBG();
        this.addSearchTab();
        this.addNewsTab();
        this.addSystemTab();
        this.showTab(1);
        this.loadSystemMessagesDone();
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Mail);
        this.addEventExtension();
        //
    }

    addLayerTopBottom() {
        this.layerBot = new Phaser.Group(game);
        this.addChild(this.layerBot);
        this.layerTop = new Phaser.Group(game);
        this.addChild(this.layerTop);
    }
    countUnreadSystem(countUnread) {
        this.systemTab.addCountUnread(countUnread);
    }

    addBG() {
        this.bg = new Phaser.Button(game, 0, 0, 'bg-playlist');
        this.layerBot.addChild(this.bg);
    }

    addSearchTab() {
        this.searchTab = new Phaser.Sprite(game, 0, 0, null);//FIXED
        this.searchTab.inputEnabled = true;
        var searchBg = new SpriteBase(this.positionMenuConfig.mail.search_bg);
        var txtSearch = new TextBase(this.positionMenuConfig.mail.txt_search, Language.instance().getData("220"));
        txtSearch.anchor.set(0.5, 0);
        searchBg.addChild(txtSearch);
        //
        this.searchTab.addChild(searchBg);
        this.searchTab.events.onInputUp.add(this.onSearchTabInput, this);
        this.layerBot.addChild(this.searchTab);
    }

    onSearchTabInput() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.searchTab.inputEnabled = false;
    }

    addNewsTab() {
        this.newsTab = new MailButtonHeader(160 * window.GameConfig.RESIZE, 153 * window.GameConfig.RESIZE, Language.instance().getData("221"));
        this.newsTab.event.clickTab.add(this.onNewsTabInput, this);
        this.layerTop.addChild(this.newsTab);
    }
    onNewsTabInput() {
        if (this.typeOfTab == 1) {

        } else {
            ControllLoading.instance().showLoading();
            this.typeOfTab = 1;
            this.showTab(1);
        }
    }

    addSystemTab() {
        this.systemTab = new MailButtonHeader(480 * window.GameConfig.RESIZE, 153 * window.GameConfig.RESIZE, Language.instance().getData("222"));
        this.systemTab.event.clickTab.add(this.onSystemTabInput, this);
        this.layerTop.addChild(this.systemTab);
    }
    onSystemTabInput() {
        if (this.typeOfTab == 2) {

        } else {
            ControllLoading.instance().showLoading();
            this.typeOfTab = 2;
            this.showTab(2);
        }
    }

    showTab(type) {
        this.typeOfTab = type;
        if (type == 1) {
            this.newsTab.setActive();
            this.systemTab.setDisActive();
            this.addMailTabNews();
            this.removeMailTabSystem();
        } else if (type == 2) {
            this.newsTab.setDisActive();
            this.systemTab.setActive();
            this.removeMailTabNews();
            this.addMailTabSystem();
        }
    }

    addMailTabNews() {
        this.removeMailTabNews();
        this.listViewNewsTab = new MailTabNews(this.listMailResponse);
        // this.listViewNewsTab.event.countUnread.add(this.countUnread, this);
        this.loadMessagesDone();
        //
        this.timeoutLoading = setTimeout(() => {
            ControllLoading.instance().hideLoading();
        }, 1000);
        this.layerBot.addChild(this.listViewNewsTab);
    }
    removeMailTabNews() {
        if (this.listViewNewsTab !== null) {
            this.layerBot.removeChild(this.listViewNewsTab);
            this.listViewNewsTab.destroy();
            this.listViewNewsTab = null;
        }
    }
    countUnread(countUnread) {
        this.newsTab.addCountUnread(countUnread);
    }

    addMailTabSystem() {
        this.removeMailTabSystem();
        this.listViewSystemTab = new MailTabSystem();
        //
        this.timeoutLoading = setTimeout(() => {
            ControllLoading.instance().hideLoading();
        }, 1000);
        this.layerBot.addChild(this.listViewSystemTab);
    }
    removeMailTabSystem() {
        if (this.listViewSystemTab !== null) {
            this.layerBot.removeChild(this.listViewSystemTab);
            this.listViewSystemTab.destroy();
            this.listViewSystemTab = null;
        }
    }

    addMailTabFriends() {
        this.removeMailTabFriends();
    }
    removeMailTabFriends() {
        if (this.listViewFriendsTab !== null) {
            this.removeChild(this.listViewFriendsTab);
            this.listViewFriendsTab.destroy();
            this.listViewFriendsTab = null;
        }
    }

    addEventExtension() {
        EventGame.instance().event.backSystemChat.add(this.backSystemChat, this);
        EventGame.instance().event.loadMessagesDone.add(this.loadMessagesDone, this);
        EventGame.instance().event.loadSystemMessagesDone.add(this.loadSystemMessagesDone, this);
        EventGame.instance().event.backChat.add(this.backChat, this);
    }

    removeEventExtension() {
        EventGame.instance().event.backSystemChat.remove(this.backSystemChat, this);
        EventGame.instance().event.loadMessagesDone.remove(this.loadMessagesDone, this);
        EventGame.instance().event.loadSystemMessagesDone.remove(this.loadSystemMessagesDone, this);
        EventGame.instance().event.backChat.remove(this.backChat, this);
    }

    loadMessagesDone() {
        if (MainData.instance().dataMessagesLocal !== null) {
            this.countUnread(AjaxMessages.instance().countNewMessages(MainData.instance().dataMessagesLocal.dataMessages));
        }
    }

    loadSystemMessagesDone() {
        if (MainData.instance().systemMessagesLocal !== null) {
            this.countUnreadSystem(AjaxMessages.instance().countSystemMessages(MainData.instance().systemMessagesLocal.dataMessages));
        }
    }

    backChat() {
        this.countUnread(AjaxMessages.instance().countNewMessages(MainData.instance().dataMessagesLocal.dataMessages))
        this.showTab(1);
    }

    backSystemChat() {
        this.countUnreadSystem(AjaxMessages.instance().countSystemMessages(MainData.instance().systemMessagesLocal.dataMessages));
        this.showTab(2);
    }

    destroy() {
        clearTimeout(this.timeoutLoading);
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