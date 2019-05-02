import BaseView from "../../BaseView.js";
import TextBase from "../../component/TextBase.js";
import SpriteBase from "../../component/SpriteBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import MainData from "../../../model/MainData.js";

export default class PopupItemChatOnline extends BaseView {
    constructor(objData) {
        super(game, null);
        this.event = {
            choose_item: new Phaser.Signal()
        }
        this.objData = objData;
        let objLine = {
            x: 0,
            y: 69,
            nameAtlas: "popup",
            nameSprite: "Line"
        }

        this.bg = new ButtonBase(objLine, this.chooseItem, this);
        this.bg.x = 0;
        this.bg.y = 0;
        this.bg.alpha = 0;
        this.bg.width = this.width;
        this.bg.height = this.height;
        this.addChild(this.bg);

        let objText = {
            x: 0,
            y: 0,
            style: {
                fontSize: 23,
                fill: "#000000"
            }
        }
        this.txtContent = new TextBase(objText, objData.label);
        this.txtContent.y = (this.height - this.txtContent.height) / 2;
        this.addChild(this.txtContent);

        let objSprite = {
            x: 0,
            y: 0,
            nameAtlas: "popup",
            nameSprite: objData.sprite
        }
        this.icon = new SpriteBase(objSprite);
        this.icon.y = (this.height - this.icon.height) / 2;
        this.addChild(this.icon);
        let kc = 17 * MainData.instance().scale;
        this.txtContent.x = (this.width - (this.txtContent.width + this.icon.width + kc)) / 2;
        this.icon.x = this.txtContent.x + this.txtContent.width + kc;

        this.line = new SpriteBase(objLine);
        this.addChild(this.line);
    }

    chooseItem() {
        LogConsole.log("chooseItem");
        this.event.choose_item.dispatch(this.objData);
    }

    hideLine() {
        this.line.visible = false;
    }

    get width() {
        return 570 * MainData.instance().scale;
    }
    get height() {
        return 71 * MainData.instance().scale;
    }
}