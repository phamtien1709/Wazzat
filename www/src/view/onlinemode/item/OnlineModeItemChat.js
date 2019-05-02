import BaseView from "../../BaseView.js";
import SpriteScale9Base from "../../component/SpriteScale9Base.js";
import TextBase from "../../component/TextBase.js";
import SpriteBase from "../../component/SpriteBase.js";
import MainData from "../../../model/MainData.js";

export default class OnlineModeItemChat extends BaseView {
    constructor(isMe, isLeft, objData) {
        super(game, null);
        this.event = {
            destroy: new Phaser.Signal()
        }
        this.objData = objData;
        this.iconArrow = null;
        // LogConsole.log(objData);
        let color = "#000000";
        this.positionCreateRoom = MainData.instance().positionCreateRoom;

        if (this.objData.hasOwnProperty("atlas")) {
            if (this.objData.vip === true) {
                this.bg = new SpriteScale9Base(this.positionCreateRoom.chat_waitting_bg_chat_vip);
                this.bg.width = 250;
                this.bg.height = 85;
            } else {
                this.bg = new SpriteScale9Base(this.positionCreateRoom.chat_waitting_bg_chat);
                this.bg.width = 250;
                this.bg.height = 85;
            }
        } else {
            if (isMe) {
                color = "#ffffff";
                if (isLeft) {
                    this.bg = new SpriteScale9Base(this.positionCreateRoom.chat_me_left);
                } else {
                    this.bg = new SpriteScale9Base(this.positionCreateRoom.chat_me_right);
                }
            } else {
                if (isLeft) {
                    this.bg = new SpriteScale9Base(this.positionCreateRoom.chat_user_left);
                } else {
                    this.bg = new SpriteScale9Base(this.positionCreateRoom.chat_user_right);
                }
            }
        }

        this.addChild(this.bg);

        let objText = {
            x: 0,
            y: 0,
            style: {
                fontSize: 20,
                fill: color
            }
        }
        if (this.objData.vip === true) {
            objText.style.fill = "#ffffff";
        } else {
            objText.style.fill = "#333333";
        }

        this.txtContent = new TextBase(objText, objData.label);
        this.txtContent.y = (this.height - this.txtContent.height) / 2;
        this.addChild(this.txtContent);

        let atlas = "popup";

        if (this.objData.hasOwnProperty("atlas")) {
            atlas = this.objData.atlas;

            if (atlas === "") {
                atlas = "popup"
            }
        }

        let objSprite = {
            x: 0,
            y: 0,
            nameAtlas: atlas,
            nameSprite: objData.sprite
        }
        this.icon = new SpriteBase(objSprite);
        this.addChild(this.icon);

        if (this.objData.hasOwnProperty("atlas")) {
            this.txtContent.x = (250 - (this.txtContent.width + 10 + this.icon.width)) / 2;
            this.txtContent.y = 30;
            this.icon.x = this.txtContent.x + this.txtContent.width + 10;
            this.icon.y = 15;

            if (this.objData.vip === true) {
                this.iconArrow = new SpriteBase(this.positionCreateRoom.chat_waitting_icon_arrow_vip);
                this.iconArrow.x = (this.bg.width - this.iconArrow.width) / 2 + 5;
                this.iconArrow.y = this.bg.height;
                this.addChild(this.iconArrow);
            } else {
                this.iconArrow = new SpriteBase(this.positionCreateRoom.chat_waitting_icon_arrow);
                this.iconArrow.x = (this.bg.width - this.iconArrow.width) / 2 + 5;
                this.iconArrow.y = this.bg.height;
                this.addChild(this.iconArrow);
            }
        } else {
            let kc = 18 * MainData.instance().scale;
            this.txtContent.x = kc;
            this.icon.x = this.txtContent.x + this.txtContent.width + kc;
            this.icon.y = (this.height - this.icon.height) / 2;
            this.bg.width = this.txtContent.x + this.txtContent.width + kc + this.icon.width + kc;
        }
        this.idtimeout = setTimeout(() => {
            this.event.destroy.dispatch(this.objData.id);
        }, 3500);
    }

    get width() {
        return this.bg.width;
    }

    get height() {
        if (this.objData.hasOwnProperty("atlas")) {
            return 100;
        } else {
            return 51 * MainData.instance().scale;
        }
    }

    destroy() {
        clearTimeout(this.idtimeout);
        super.destroy();
    }
}