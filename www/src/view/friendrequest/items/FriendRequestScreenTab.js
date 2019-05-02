import SpriteBase from "../../component/SpriteBase.js";
import TextBase from "../../component/TextBase.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";

export default class FriendRequestScreenTab extends Phaser.Sprite {
    constructor(x, y, type) {
        super(game, x, y, null);
        this.inputEnabled = true;
        this.anchor.set(0.5);
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.positionFriendRequestConfig = JSON.parse(game.cache.getText('positionFriendRequestConfig'));
        this.type = type;
        this.event = {
            clickTab: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {
        this.layoutBot = new Phaser.Sprite(game, 0, 0, null);
        this.layoutTop = new Phaser.Sprite(game, 0, 0, null);
        this.addChild(this.layoutBot);
        this.addChild(this.layoutTop);
        this.bgTab;
        this.txtTab;
        this.lineUnderTab;
        this.addBGTab();
        this.addTxtTab();
        this.addLineUnderTab();
        this.addLineDoc();
    }

    addBGTab() {
        this.bgTab = new Phaser.Button(game, this.positionFriendRequestConfig.tab_active.x * window.GameConfig.RESIZE, this.positionFriendRequestConfig.tab_active.y * window.GameConfig.RESIZE, this.positionFriendRequestConfig.tab_active.nameAtlas, this.onClickTab, this, null, this.positionFriendRequestConfig.tab_active.nameSprite);
        this.bgTab.anchor.set(0.5);
        this.layoutBot.addChild(this.bgTab);
    }

    addTxtTab() {
        this.txtTab = new Phaser.Text(game, this.positionMenuConfig.mail.txt_tab.x * window.GameConfig.RESIZE, this.positionMenuConfig.mail.txt_tab.y * window.GameConfig.RESIZE, this.type, this.positionMenuConfig.mail.txt_tab.style);
        this.txtTab.anchor.set(0.5);
        this.layoutBot.addChild(this.txtTab);
    }

    addLineUnderTab() {
        this.lineUnderTab = new SpriteBase(this.positionMenuConfig.mail.line_gradient);
        this.lineUnderTab.anchor.set(0.5);
        this.layoutBot.addChild(this.lineUnderTab);
    }

    onClickTab() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.event.clickTab.dispatch(this.type);
    }

    setActive() {
        this.txtTab.addColor('#ffffff', 0);
        this.lineUnderTab.revive();
    }

    setDisActive() {
        this.txtTab.addColor('#93909d', 0);
        this.lineUnderTab.kill();
    }

    addLineDoc() {
        let lineDoc = new Phaser.Sprite(game, this.positionFriendRequestConfig.line_doc.x, this.positionFriendRequestConfig.line_doc.y, this.positionFriendRequestConfig.line_doc.nameAtlas, this.positionFriendRequestConfig.line_doc.nameSprite);
        lineDoc.anchor.set(0.5);
        lineDoc.scale.set(3, 1);
        this.layoutTop.addChild(lineDoc);
    }

    addCountUnread(countUnread) {
        // LogConsole.log(countUnread);
        if (this.noti == undefined) {
            this.noti = new SpriteBase(this.positionMenuConfig.count_unread);
            this.noti.kill();
            this.noti.anchor.set(0.5);
            this.countUnread = new TextBase(this.positionMenuConfig.txt_count_unread, this.positionMenuConfig.txt_count_unread.text);
            this.countUnread.anchor.set(0.5);
            this.noti.addChild(this.countUnread);
            this.layoutTop.addChild(this.noti);
        }
        if (countUnread > 0) {
            this.noti.revive();
            this.countUnread.setText(countUnread);
        } else {
            this.noti.kill();
        }
    }

    addCountFriend(count) {
        this.txtTab.setText(`${this.type} (${count})`);
    }
}