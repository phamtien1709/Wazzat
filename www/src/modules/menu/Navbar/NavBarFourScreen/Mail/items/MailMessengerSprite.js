import SpriteBase from "../../../../../../view/component/SpriteBase.js";
import ControllSoundFx from "../../../../../../controller/ControllSoundFx.js";
import SocketController from "../../../../../../controller/SocketController.js";
import Common from "../../../../../../common/Common.js";
import ControllLoadCacheUrl from "../../../../../../view/component/ControllLoadCacheUrl.js";
import BaseGroup from "../../../../../../view/BaseGroup.js";

export default class MailMessengerSprite extends BaseGroup {
    constructor(messenger, index) {
        super(game)
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.messenger = messenger;
        this.index = index;
        this.event = {
            choosedMessenger: new Phaser.Signal()
        }
        this.afterInit();
    }
    get height() {
        return 142 * window.GameConfig.RESIZE;
    }

    afterInit() {
        // console.log(this.messenger);
        this.btn;
        this.avatar;
        this.userName;
        this.message;
        this.sentTime;
        //
        if (this.messenger.updated !== undefined) {
            this.addAva();
            this.addMaskAva(68);
            this.addUserName();
            this.addMessage();
            this.addSentTime();
            this.beginLoad();
            this.addBtn();
            this.addLineUnder();
        }
    }

    addBtn() {
        this.btn = new Phaser.Button(game, 0, 0, 'otherSprites', () => { }, this, null, 'tab-friend');
        this.btn.alpha = 0;
        this.btn.onInputUp.add(this.choosedMessenger, this);
        this.addChild(this.btn);
    }

    addAva() {
        this.avatar = new Phaser.Sprite(game, this.positionMenuConfig.mail.ava.x * window.GameConfig.RESIZE, this.positionMenuConfig.mail.ava.y * window.GameConfig.RESIZE, this.positionMenuConfig.mail.ava.nameAtlas, this.positionMenuConfig.mail.ava.nameSprite);
        this.avatar.anchor.set(0.5);
        this.addChild(this.avatar);
        if (this.messenger.user.vip === true || this.messenger.user.vip === 1) {
            this.frameVip = new Phaser.Sprite(game, 70, 74, 'vipSource', 'Ava_Opponents_Nho');
            this.frameVip.anchor.set(0.5);
            this.frameVip.scale.set(1.1);
            this.addChild(this.frameVip);
        }
    }

    addMaskAva(size) {
        this.maskAva = new Phaser.Graphics(game, 0, 0);
        this.maskAva.beginFill();
        this.maskAva.drawCircle(this.positionMenuConfig.mail.ava.x * window.GameConfig.RESIZE, this.positionMenuConfig.mail.ava.y * window.GameConfig.RESIZE, size);
        this.maskAva.endFill();
        this.maskAva.anchor.set(0.5);
        this.avatar.mask = this.maskAva;
        this.addChild(this.maskAva);
    }

    addUserName() {
        this.userName = new Phaser.Text(game, this.positionMenuConfig.mail.userName.x * window.GameConfig.RESIZE, this.positionMenuConfig.mail.userName.y * window.GameConfig.RESIZE, Common.formatName(this.messenger.user.user_name, 30), this.positionMenuConfig.mail.userName.configs);
        if (this.messenger.user.user_name == SocketController.instance().dataMySeft.user_name) {
            this.userName.setText(this.messenger.user.user_name)
        }
        if (this.messenger.from == SocketController.instance().socket.mySelf.getVariable('user_id').value) {
            this.userName.addColor('#93909d', 0);
        } else {
            if (this.messenger.is_read == 1) {
                this.userName.addColor('#93909d', 0);
            }
        }
        this.addChild(this.userName);
    }

    addMessage() {
        this.message = new Phaser.Text(game, this.positionMenuConfig.mail.message.x * window.GameConfig.RESIZE, this.positionMenuConfig.mail.message.y * window.GameConfig.RESIZE, this.messenger.message, this.positionMenuConfig.mail.message.configs);
        this.addChild(this.message);
    }

    addSentTime() {
        this.monthAndDate = "";
        let txtDate = new Date(this.messenger.updated)
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

    addLineUnder() {
        let line = new SpriteBase(this.positionMenuConfig.mail.line_under);
        this.addChild(line);
    }

    beginLoad() {
        this.avaUrl = this.messenger.user.avatar;
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
        setTimeout(() => {
            try {
                if (game.cache.checkImageKey(this.avaUrl)) {
                    if (this.avaUrl !== "") {
                        this.avatar.loadTexture(`${this.avaUrl}`);
                    }
                }
                this.avatar.width = 68;
                this.avatar.height = 68;
            } catch (error) {

            }
        }, this.index * 30);
    }

    loadStart() {

    }
}