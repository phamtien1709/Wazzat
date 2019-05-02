import SpriteBase from "../../component/SpriteBase.js";
import TextBase from "../../component/TextBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import ControllLoadCacheUrl from "../../component/ControllLoadCacheUrl.js";
import BaseGroup from "../../BaseGroup.js";

export default class Friend extends BaseGroup {
    constructor(friend, index) {
        super(game);
        this.positionFriendRequestConfig = JSON.parse(game.cache.getText('positionFriendRequestConfig'));
        this.friend = friend;
        this.index = index;
        this.event = {
            chat: new Phaser.Signal(),
            clickAva: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {
        this.ava;
        this.name;
        this.btnAccept;
        this.btnDecline;
        this.dotOnline;
        this.line;
        this.addAva();
        this.addName();
        this.addLineUnder();
        this.addFrameVip();
        this.addChat();
        this.addDotOnline();
        this.loadAva();
    }

    addAva() {
        let maskAva = new Phaser.Graphics(game, 0, 0);
        maskAva.drawCircle(this.positionFriendRequestConfig.request.ava.x * window.GameConfig.RESIZE, this.positionFriendRequestConfig.request.ava.y * window.GameConfig.RESIZE, 68 * window.GameConfig.RESIZE);
        maskAva.anchor.set(0.5);
        this.addChild(maskAva);
        this.ava = new Phaser.Sprite(game, this.positionFriendRequestConfig.request.ava.x * window.GameConfig.RESIZE, this.positionFriendRequestConfig.request.ava.y * window.GameConfig.RESIZE, this.positionFriendRequestConfig.request.ava.nameAtlas, this.positionFriendRequestConfig.request.ava.nameSprite);
        this.ava.anchor.set(0.5);
        this.ava.scale.set(window.GameConfig.SCALE_AVA_FRIEND * window.GameConfig.RESIZE);
        this.ava.inputEnabled = true;
        this.ava.events.onInputUp.add(this.inputAva, this);
        this.ava.mask = maskAva;
        this.addChild(this.ava);
    }

    inputAva() {
        this.event.clickAva.dispatch(this.friend.id);
    }

    loadAva() {
        if (game.cache.checkImageKey(this.friend.avatar)) {
            this.onLoad();
        } else {
            //
            ControllLoadCacheUrl.instance().event.load_image_complate.add(this.onLoad, this);
            ControllLoadCacheUrl.instance().addLoader(this.friend.avatar);
        }
    }

    onLoad() {
        ControllLoadCacheUrl.instance().event.load_image_complate.remove(this.onLoad, this);
        this.timeOnload = game.time.events.add(Phaser.Timer.SECOND * 0.1 * this.index, () => {
            try {
                if (game.cache.checkImageKey(this.friend.avatar)) {
                    this.ava.loadTexture(`${this.friend.avatar}`);
                }
                this.ava.width = 70;
                this.ava.height = 70;
            } catch (error) {

            }
        }, this);
    }

    loadStart() {

    }

    addName() {
        this.name = new TextBase(this.positionFriendRequestConfig.request.name, this.friend.user_name);
        this.name.anchor.set(0, 0.5);
        this.addChild(this.name);
    }

    addLineUnder() {
        this.line = new SpriteBase(this.positionFriendRequestConfig.request.line);
        this.addChild(this.line);
    }

    addFrameVip() {
        if (this.friend.vip === true) {
            this.frameAva = new Phaser.Sprite(game, 71, 60, 'vipSource', 'Ava_Nho');
            this.frameAva.anchor.set(0.5);
            this.frameAva.scale.set(1.1);
            this.addChild(this.frameAva);
        }
    }

    addDotOnline() {
        if (this.friend.is_online == true) {
            this.dotOnline = new SpriteBase(this.positionFriendRequestConfig.request.online_icon);
            this.addChild(this.dotOnline);
        } else {
            this.dotOnline = new SpriteBase(this.positionFriendRequestConfig.request.offline_icon);
            this.addChild(this.dotOnline);
        }
    }

    addChat() {
        this.btnChat = new ButtonBase(this.positionFriendRequestConfig.request.icon_chat, this.onClickChat, this);
        this.btnChat.anchor.set(0.5);
        this.addChild(this.btnChat);
    }

    onClickChat() {
        this.btnChat.inputEnabled = false;
        this.event.chat.dispatch(
            {
                avatar: this.friend.avatar,
                is_online: this.friend.is_online,
                id: this.friend.id,
                user_name: this.friend.user_name,
                vip: this.friend.vip
            });
    }

    get height() {
        return 114 * window.GameConfig.RESIZE;
    }

    destroy() {
        game.time.events.remove(this.timeOnload);
        super.destroy();
    }
}