import TextBase from "../../../../../../view/component/TextBase.js";
import SpriteScale9Base from "../../../../../../view/component/SpriteScale9Base.js";
import ChatScreen from "../screen/ChatScreen.js";
import ImageLoader from "../../../../../../Component/ImageLoader.js";
import ControllScreenDialog from "../../../../../../view/ControllScreenDialog.js";
import BaseGroup from "../../../../../../view/BaseGroup.js";

export default class TheirChat extends BaseGroup {
    constructor(friend, text, beforeType = ChatScreen.YOUR_MESS, timeValue, isLastMess) {
        super(game)
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.friend = friend;
        if ((text == ":)") || (text == "(:")) {
            this.txtMess = "(smile)";
        } else if ((text == ":(") || (text == "):")) {
            this.txtMess = "(sad)";
        } else this.txtMess = text;
        this.beforeType = beforeType;
        this.timeValue = timeValue;
        this.checkShowTime = false;
        this.isLastMess = isLastMess;
        this.index = 0;
        this.event = {
            clickAva: new Phaser.Signal(),
            showTime: new Phaser.Signal(),
            hideTime: new Phaser.Signal()
        }
        // LogConsole.log(this.timeValue);
        this.afterInit();
    }

    afterInit() {
        this.bgText = new Phaser.Group(game)
        this.addChild(this.bgText);
        this.text = new TextBase(this.positionMenuConfig.chat_screen.txt_mess_friend, this.txtMess);
        this.addChild(this.text);
        if (this.beforeType == ChatScreen.YOUR_MESS) {
            this.addAvaCircle();
        }
        //
        var configSpaceBox = 40 * window.GameConfig.RESIZE;
        var configSpaceMess = 35 * window.GameConfig.RESIZE;
        var configWidth = 70 * window.GameConfig.RESIZE;
        this.configHeight = 40 * window.GameConfig.RESIZE;
        var options = {
            "x": 77,
            "y": 22,
            "nameAtlas": "mailSprites",
            "nameSprite": "L_Chat_White",
            "left": 25,
            "right": 25,
            "top": 25,
            "bot": 25,
            "width": 0,
            "height": 0,
            "name": "messageTheir"
        };
        options.width = (this.text.width + configSpaceBox) / window.GameConfig.RESIZE;
        options.height = (this.text.height + configSpaceBox) / window.GameConfig.RESIZE;
        this.bg = new SpriteScale9Base(options);
        this.bgText.addChild(this.bg);
        this.text.x = this.bg.x + configSpaceBox / 2;
        this.text.y = this.bg.y + configSpaceBox / 2;
        //
        this.addTimeSent();
        if (this.isLastMess == true) {
            this.height = this.bg.height + this.configHeight;
        } else {
            this.height = this.bg.height + 3;
        }
        this.width = this.bg.width + configWidth;
        this.bgText.x = configSpaceMess;
        this.text.x += configSpaceMess;
        if (this.ava) {
            this.ava.x += configSpaceMess;
            this.maskAva.x += configSpaceMess;
        }
        //
        this.bg.inputEnabled = true;
        this.bg.events.onInputUp.add(this.showTime, this);
        this.addFrameVip();
    }

    setPosMess(messBefore) {
        if (messBefore !== undefined) {
            if (messBefore.type == ChatScreen.YOUR_MESS) {
                this.height = this.bg.height + this.configHeight;
            }
        } else {
            // console.log(messBefore);
            this.height = this.bg.height + this.configHeight;
        }
    }

    addFrameVip() {
        if (this.friend.vip === true || this.friend.vip === 1) {
            if (this.ava) {
                this.frameVip = new Phaser.Sprite(game, 69, 58, 'vipSource', 'Ava_Nho');
                this.frameVip.anchor.set(0.5);
                this.frameVip.scale.set(1.1);
                this.addChild(this.frameVip);
            }
            this.bgText.x += 15;
            this.text.x += 15;
            this.txtTime.x += 15
        }
    }

    addAvaCircle() {
        this.ava = new ImageLoader(this.positionMenuConfig.chat_screen.ava_friend.x * window.GameConfig.RESIZE, this.positionMenuConfig.chat_screen.ava_friend.y * window.GameConfig.RESIZE, 'ava-default', this.friend.avatar);
        this.ava.sprite.inputEnabled = true;
        this.ava.sprite.events.onInputUp.add(this.clickAva, this);
        this.ava.event.loadAvaDone.add(() => {
            this.ava.sprite.width = 70;
            this.ava.sprite.height = 70;
        }, this);
        this.addChild(this.ava.sprite);
        //
        this.maskAva = new Phaser.Graphics(game, 0, 0);
        this.maskAva.beginFill(0xffffff);
        this.maskAva.drawCircle(35 * window.GameConfig.RESIZE, 55 * window.GameConfig.RESIZE, 69 * window.GameConfig.RESIZE);
        this.maskAva.anchor.set(0.5);
        this.addChild(this.maskAva);
        this.ava.sprite.mask = this.maskAva;
    }

    clickAva() {
        ControllScreenDialog.instance().addUserProfile(this.friend.id);
        this.event.clickAva.dispatch();
    }

    showTime() {
        if (this.checkShowTime == false) {
            this.event.showTime.dispatch(this.index);
            this.txtTime.revive();
            this.checkShowTime = true;
        } else {
            this.event.hideTime.dispatch(this.index);
            this.txtTime.kill();
            this.checkShowTime = false;
        }
    }

    addTimeSent() {
        this.timeValue = this.handleTime();
        this.txtTime = new Phaser.Text(game, this.positionMenuConfig.chat_screen.txt_mess_time_their.x * window.GameConfig.RESIZE, this.bg.height + this.positionMenuConfig.chat_screen.txt_mess_time_their.y * window.GameConfig.RESIZE, `${this.timeValue[1]} - ${this.timeValue[0]}`, this.positionMenuConfig.chat_screen.txt_mess_time_their.style);
        this.addChild(this.txtTime);
        this.txtTime.kill();
    }

    handleTime() {
        let timeValue = new Date(this.timeValue);
        //
        let timeGet = timeValue.toISOString().split('T');
        timeGet[1] = timeGet[1].split('.000Z');
        timeGet[1] = timeGet[1][0];
        let DMY = timeGet[0];
        let HM = timeGet[1];;
        return [DMY, HM];
    }
    //set width and get width
    set width(_width) {
        this._width = _width;
    }

    get width() {
        return this._width;
    }
    set height(_height) {
        this._height = _height;
    }

    get height() {
        return this._height;
    }
}