import SpriteBase from "../../component/SpriteBase.js";
import TextBase from "../../component/TextBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import Language from "../../../model/Language.js";
import ControllLoadCacheUrl from "../../component/ControllLoadCacheUrl.js";
import BaseGroup from "../../BaseGroup.js";

export default class Request extends BaseGroup {
    constructor(request, index) {
        super(game);
        this.positionFriendRequestConfig = JSON.parse(game.cache.getText('positionFriendRequestConfig'));
        this.request = request;
        this.index = index;
        console.log('asfasf')
        console.log(request)
        this.event = {
            accept: new Phaser.Signal(),
            decline: new Phaser.Signal(),
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
        this.addBtnAccept();
        this.addBtnDecline();
        this.addDotOnline();
        this.loadAva();
    }

    addAva() {
        let maskAva = new Phaser.Graphics(game, 0, 0);
        // maskAva.beginFill(0xffffff);
        maskAva.drawCircle(this.positionFriendRequestConfig.request.ava.x * window.GameConfig.RESIZE, this.positionFriendRequestConfig.request.ava.y * window.GameConfig.RESIZE, 68 * window.GameConfig.RESIZE);
        maskAva.anchor.set(0.5);
        this.addChild(maskAva);
        this.ava = new Phaser.Sprite(game, this.positionFriendRequestConfig.request.ava.x * window.GameConfig.RESIZE, this.positionFriendRequestConfig.request.ava.y * window.GameConfig.RESIZE, this.positionFriendRequestConfig.request.ava.nameAtlas, this.positionFriendRequestConfig.request.ava.nameSprite);
        this.ava.anchor.set(0.5);
        // this.ava.scale.set(window.GameConfig.SCALE_AVA_FRIEND * window.GameConfig.RESIZE);
        this.ava.inputEnabled = true;
        this.ava.events.onInputUp.add(this.inputAva, this);
        this.ava.mask = maskAva;
        this.addChild(this.ava);
    }

    inputAva() {
        console.log(this.request.friend.user_id);
        this.event.clickAva.dispatch(this.request.friend.user_id);
    }

    loadAva() {
        if (game.cache.checkImageKey(this.request.friend.avatar)) {
            this.onLoad();
        } else {
            //
            ControllLoadCacheUrl.instance().event.load_image_complate.add(this.onLoad, this);
            ControllLoadCacheUrl.instance().addLoader(this.request.friend.avatar);
        }
    }

    onLoad() {
        ControllLoadCacheUrl.instance().event.load_image_complate.remove(this.onLoad, this);
        this.timeOnload = game.time.events.add(Phaser.Timer.SECOND * 0.1 * this.index, () => {
            try {
                if (this.request.friend.avatar !== "") {
                    this.ava.loadTexture(`${this.request.friend.avatar}`);
                }
                this.ava.width = 70;
                this.ava.height = 70;
            } catch (error) {

            }
        }, this);
    }

    loadStart() {
        LogConsole.log("loadStart");
    }

    addName() {
        this.name = new TextBase(this.positionFriendRequestConfig.request.name, this.request.friend.user_name);
        this.name.anchor.set(0, 0.5);
        this.addChild(this.name);
    }

    addLineUnder() {
        this.line = new SpriteBase(this.positionFriendRequestConfig.request.line);
        this.addChild(this.line);
    }

    addFrameVip() {
        if (this.request.vip === true) {
            this.frameAva = new Phaser.Sprite(game, 71, 60, 'vipSource', 'Ava_Nho');
            this.frameAva.anchor.set(0.5);
            this.frameAva.scale.set(1.1);
            this.addChild(this.frameAva);
        }
    }

    addBtnAccept() {
        this.btnAccept = new ButtonBase(this.positionFriendRequestConfig.request.btn_accept, this.onClickAccept, this);
        this.btnAccept.anchor.set(0.5);
        let txt = new TextBase(this.positionFriendRequestConfig.request.txt_accept, Language.instance().getData("313"));
        txt.anchor.set(0.5);
        this.btnAccept.addChild(txt);
        this.addChild(this.btnAccept);
    }

    onClickAccept() {
        this.btnAccept.inputEnabled = false;
        this.event.accept.dispatch(this.request);
    }

    addBtnDecline() {
        this.btnDecline = new ButtonBase(this.positionFriendRequestConfig.request.btn_decline, this.onClickDecline, this);
        this.btnDecline.anchor.set(0.5);
        let txt = new TextBase(this.positionFriendRequestConfig.request.txt_decline, Language.instance().getData("314"));
        txt.anchor.set(0.5);
        this.btnDecline.addChild(txt);
        this.addChild(this.btnDecline);
    }

    onClickDecline() {
        this.event.decline.dispatch(this.request);
    }

    addDotOnline() {
        if (this.request.friend.is_online == true) {
            this.dotOnline = new SpriteBase(this.positionFriendRequestConfig.request.online_icon);
            this.addChild(this.dotOnline);
        } else {
            this.dotOnline = new SpriteBase(this.positionFriendRequestConfig.request.offline_icon);
            this.addChild(this.dotOnline);
        }
    }

    get height() {
        return 114 * window.GameConfig.RESIZE;
    }

    destroy() {
        game.time.events.remove(this.timeOnload);
        super.destroy();
    }
}