import SpriteBase from "../../../../../../view/component/SpriteBase.js";
import TextBase from "../../../../../../view/component/TextBase.js";
import ControllSoundFx from "../../../../../../controller/ControllSoundFx.js";
import BaseGroup from "../../../../../../view/BaseGroup.js";

export default class MailButtonHeader extends BaseGroup {
    constructor(x, y, type) {
        super(game);
        this.x = x;
        this.y = y;
        // this.inputEnabled = true;
        // this.anchor.set(0.5);
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.type = type;
        this.event = {
            clickTab: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {
        this.layoutBot = new Phaser.Group(game)
        this.layoutTop = new Phaser.Group(game)
        this.addChild(this.layoutBot);
        this.addChild(this.layoutTop);
        this.bgTab;
        this.txtTab;
        this.lineUnderTab;
        this.addBGTab();
        this.addTxtTab();
        this.addLineUnderTab();
    }

    addBGTab() {
        this.bgTab = new Phaser.Button(game, this.positionMenuConfig.mail.tab_active.x * window.GameConfig.RESIZE, this.positionMenuConfig.mail.tab_active.y * window.GameConfig.RESIZE, this.positionMenuConfig.mail.tab_active.nameAtlas, this.onClickTab, this, null, this.positionMenuConfig.mail.tab_active.nameSprite);
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
        this.event.clickTab.dispatch();
    }

    setActive() {
        this.txtTab.addColor('#ffffff', 0);
        this.bgTab.loadTexture("mailSprites", 'Header_tab_Active');
        this.lineUnderTab.revive();
    }

    setDisActive() {
        this.txtTab.addColor('#93909d', 0);
        this.bgTab.loadTexture("mailSprites", 'Header_tab_disActive');
        this.lineUnderTab.kill();
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
}