import SpriteBase from "../../../../../../view/component/SpriteBase.js";
import ButtonBase from "../../../../../../view/component/ButtonBase.js";
import TextBase from "../../../../../../view/component/TextBase.js";
import InforSystemSprite from "../items/InforSystemSprite.js";
import ListView from "../../../../../../../libs/listview/list_view.js";
import MailSystemButtonLink from "../items/MailSystemButtonLink.js";
import EventGame from "../../../../../../controller/EventGame.js";
import MainData from "../../../../../../model/MainData.js";
import AjaxMessages from "../../../../../../common/AjaxMessages.js";
import BaseGroup from "../../../../../../view/BaseGroup.js";

export default class MailSystemScreen extends BaseGroup {
    constructor(messengerId) {
        super(game)
        this.positionLoadConfig = JSON.parse(game.cache.getText('positionLoadConfig'));
        this.messengerId = messengerId;
        this.messenger;
        this.afterInit();
    }

    afterInit() {
        this.bg;
        this.headerTab;
        this.title;
        this.inforSystem;
        this.detail;
        this.addBG();
        this.addHeaderTab();
        this.ajaxGetNotiDetail();
        this.addEventExtension();
    }

    ajaxGetNotiDetail() {
        // LogConsole.log(this.messengerId);
        this.detailMessageCallback(AjaxMessages.instance().seeNoticeSystem(this.messengerId, MainData.instance().systemMessagesLocal.dataMessages))
    }

    detailMessageCallback(response) {
        this.dataControls = [];
        this.messenger = response;
        if (this.messenger.control !== null) {
            let dataControls = JSON.parse(this.messenger.control);
            for (let obj in dataControls) {
                this.dataControls.push(dataControls[obj]);
            }
        }
        // this.messenger = this.positionLoadConfig.system_mess_detail;
        //
        this.addTitle();
        //
        this.addListView();
        this.addInforSystem();
        this.addDetailMessage();
        this.addButtonLink();
        //
        this.markAsRead();
    }

    addBG() {
        this.bg = new Phaser.Button(game, 0, 0, this.positionLoadConfig.mail_system.bg.nameSprite);
        this.addChild(this.bg);
    }

    addHeaderTab() {
        this.headerTab = new SpriteBase(this.positionLoadConfig.mail_system.header.tab);
        this.addChild(this.headerTab);
        this.btnBack;
        this.emailTxt;
        this.btnBack = new ButtonBase(this.positionLoadConfig.mail_system.header.btn_back, this.onClickBack, this);
        this.btnBack.anchor.set(0.5);
        this.addChild(this.btnBack);
        this.emailTxt = new TextBase(this.positionLoadConfig.mail_system.header.txt_email, this.positionLoadConfig.mail_system.header.txt_email.text);
        this.emailTxt.anchor.set(0.5);
        this.addChild(this.emailTxt);

    }
    onClickBack() {
        EventGame.instance().event.backSystemChat.dispatch();
        this.destroy();
    }

    addTitle() {
        this.title = new TextBase(this.positionLoadConfig.mail_system.title, this.messenger.title);
        this.addChild(this.title);
        this.lineUnder;
        this.lineUnder = new SpriteBase(this.positionLoadConfig.mail_system.line_under);
        this.lineUnder.y += this.title.y + this.title.height;
        this.addChild(this.lineUnder);
    }

    addListView() {
        this.group = new Phaser.Group(game);
        this.addChild(this.group);
        const bounds = new Phaser.Rectangle(0, this.lineUnder.y + 2, game.width, (game.height - 253) * window.GameConfig.RESIZE);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 0,
            searchForClicks: true
        }
        this.listView = new ListView(game, this.group, bounds, options);
    }
    addInforSystem() {
        this.inforSystem = new InforSystemSprite(this.messenger);
        this.listView.add(this.inforSystem);
    }
    addDetailMessage() {
        this.detail = new TextBase(this.positionLoadConfig.mail_system.detailMessage, this.messenger.message);
        let line = new Phaser.Sprite(game, 0, this.detail.height + 25, "mailSprites", "line_line");
        this.detail.addChild(line);
        this.listView.add(this.detail);
    }
    addButtonLink() {
        for (let i = 0; i < this.dataControls.length; i++) {
            //
            if (MainData.instance().platform !== "ios") {
                if (this.dataControls[i].link !== undefined) {
                    let buttonLink = new MailSystemButtonLink(this.dataControls[i]);
                    buttonLink.eventClickBtn.add(this.eventClickBtn, this);
                    this.listView.add(buttonLink);
                }
            }
        }
    }

    markAsRead() {
        if (this.messenger.is_read == 0) {
            AjaxMessages.instance().sendSystemMarkAsRead(this.messengerId);
            AjaxMessages.instance().systemMarkAsRead(this.messengerId, MainData.instance().systemMessagesLocal.dataMessages);
        }
    }

    eventClickBtn(data) {
        window.open(data.link, '_blank');
    }

    addEventExtension() {
        EventGame.instance().event.backButton.add(this.onClickBack, this);
    }

    removeEventExtension() {
        EventGame.instance().event.backButton.remove(this.onClickBack, this);
    }

    destroy() {
        this.removeEventExtension();
        if (this.listView !== null) {
            this.listView.removeAll();
            this.listView.destroy();
        }
        if (this.children !== null) {
            while (this.children.length > 0) {
                let item = this.children[0];
                this.removeChild(item);
                item.destroy();
                item = null;
            }
            if (this.parent) {
                this.parent.removeChild(this);
            }
        }
        super.destroy();
    }
}