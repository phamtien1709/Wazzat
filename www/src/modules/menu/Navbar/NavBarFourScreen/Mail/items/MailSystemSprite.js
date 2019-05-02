import ControllSoundFx from "../../../../../../controller/ControllSoundFx.js";
import Language from "../../../../../../model/Language.js";
import ControllLoadCacheUrl from "../../../../../../view/component/ControllLoadCacheUrl.js";
import BaseGroup from "../../../../../../view/BaseGroup.js";

export default class MailSystemSprite extends BaseGroup {
    constructor(messenger, index) {
        super(game)
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.messenger = messenger;
        this.index = index;
        // this.inputEnabled = true;
        this.event = {
            choosedMessenger: new Phaser.Signal()
        };
        this.afterInit();
    }
    get height() {
        return 142 * window.GameConfig.RESIZE;
    }

    afterInit() {
        this.btn;
        this.avatar;
        this.userName;
        this.message;
        this.sentTime;
        //
        this.addAva();
        this.addMaskAva(68);
        this.addUserName();
        this.addMessage();
        this.addSentTime();
        this.addBtn();
    }

    addBtn() {
        this.btn = new Phaser.Button(game, 0, 0, 'otherSprites', () => { }, this, null, 'tab-friend');
        this.btn.alpha = 0;
        this.btn.onInputUp.add(this.choosedMessenger, this);
        this.addChild(this.btn);
    }

    addAva() {
        this.avatar = new Phaser.Sprite(game, this.positionMenuConfig.mail.ava_system.x * window.GameConfig.RESIZE, this.positionMenuConfig.mail.ava_system.y * window.GameConfig.RESIZE, this.positionMenuConfig.mail.ava_system.nameAtlas, this.positionMenuConfig.mail.ava_system.nameSprite);
        this.avatar.anchor.set(0.5);
        this.addChild(this.avatar);
    }

    addMaskAva(size) {
        this.maskAva = new Phaser.Graphics(game, 0, 0);
        this.maskAva.beginFill();
        this.maskAva.drawCircle(0 * window.GameConfig.RESIZE, 0 * window.GameConfig.RESIZE, size);
        this.maskAva.endFill();
        this.maskAva.anchor.set(0.5);
        this.avatar.mask = this.maskAva;
        this.avatar.addChild(this.maskAva);
    }

    addUserName() {
        this.userName = new Phaser.Text(game, this.positionMenuConfig.mail.userName.x * window.GameConfig.RESIZE, this.positionMenuConfig.mail.userName.y * window.GameConfig.RESIZE, Language.instance().getData("222"), this.positionMenuConfig.mail.userName.configs);
        this.addChild(this.userName);
        if (this.messenger.is_read == 1) {
            this.userName.addColor('#93909d', 0);
        }
    }

    addMessage() {
        this.message = new Phaser.Text(game, this.positionMenuConfig.mail.message.x * window.GameConfig.RESIZE, this.positionMenuConfig.mail.message.y * window.GameConfig.RESIZE, this.messenger.message, this.positionMenuConfig.mail.message.configs);
        this.addChild(this.message);
    }

    addSentTime() {
        let txtDate = new Date(this.messenger.created)
        let DAndT = txtDate.toLocaleDateString('vi-VN');
        this.monthAndDate = DAndT.slice(0, DAndT.length - 5);
        //
        this.sentTime = new Phaser.Text(game, this.positionMenuConfig.mail.sentTime.x * window.GameConfig.RESIZE, this.positionMenuConfig.mail.sentTime.y * window.GameConfig.RESIZE, this.monthAndDate, this.positionMenuConfig.mail.sentTime.configs);
        this.addChild(this.sentTime);
    }

    choosedMessenger() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.event.choosedMessenger.dispatch(this.messenger);
    }

    beginLoad(url) {
        this.avaUrl = url;
        if (game.cache.checkImageKey(this.avaUrl)) {
            this.onLoad();
        } else {
            //
            ControllLoadCacheUrl.instance().event.load_image_complate.add(this.onLoad, this);
            ControllLoadCacheUrl.instance().addLoader(this.avaUrl);
        }
    }

    onLoad() {
        ControllLoadCacheUrl.instance().event.load_image_complate.remove(this.onLoad, this);
        if (game.cache.checkImageKey(this.avaUrl)) {
            setTimeout(() => {
                try {
                    this.avatar.loadTexture(`${this.avaUrl}`);
                } catch (error) {

                }
            }, this.index * 70);
        }
    }

    loadStart() {

    }
}