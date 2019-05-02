import BaseView from "../../../BaseView.js";
import SpriteScale9Base from "../../../component/SpriteScale9Base.js";
import TextBase from "../../../component/TextBase.js";
import SpriteBase from "../../../component/SpriteBase.js";
import MainData from "../../../../model/MainData.js";

export default class EventModeRoomWinItem extends BaseView {
    constructor(data, isBig = false) {
        super(game, null);
        this.positionEventMode = JSON.parse(game.cache.getText('positionEventMode'));

        this.bg = new SpriteScale9Base(this.positionEventMode.queueroom_bg_win_item);
        this.addChild(this.bg);

        if (isBig) {
            this.bg.height = 50;
        }

        let width = 12 * MainData.instance().scale;
        LogConsole.log("---------------------------------");
        if (data.diamond > 0) {
            this.txtDiamond = new TextBase(this.positionEventMode.queueroom_txt_win, data.diamond);
            if (isBig) {
                this.txtDiamond.changeStyle({ fontSize: 24 });
            }
            this.txtDiamond.x = width;
            this.txtDiamond.y = (this.bg.height - this.txtDiamond.height) / 2 + 3 * MainData.instance().scale;
            this.addChild(this.txtDiamond);

            this.iconDiamon = new SpriteBase(this.positionEventMode.queueroom_icon_win_diamond);
            this.iconDiamon.x = this.txtDiamond.x + this.txtDiamond.width + 3 * MainData.instance().scale;
            this.iconDiamon.y = (this.bg.height - this.iconDiamon.height) / 2;
            this.addChild(this.iconDiamon);
            width = this.iconDiamon.x + this.iconDiamon.width + 12 * MainData.instance().scale;
        }

        if (data.ticket > 0) {
            this.txtTicket = new TextBase(this.positionEventMode.queueroom_txt_win, data.ticket);
            if (isBig) {
                this.txtTicket.changeStyle({ fontSize: 24 });
            }

            this.txtTicket.x = width;
            this.txtTicket.y = (this.bg.height - this.txtTicket.height) / 2 + 3 * MainData.instance().scale;
            this.addChild(this.txtTicket);


            this.iconTicket = new SpriteBase(this.positionEventMode.queueroom_icon_win_ticket);
            this.iconTicket.x = this.txtTicket.x + this.txtTicket.width + 3 * MainData.instance().scale;
            this.iconTicket.y = (this.bg.height - this.iconTicket.height) / 2;
            width = this.iconTicket.x + this.iconTicket.width + 12 * MainData.instance().scale;
            this.addChild(this.iconTicket);
        }

        if (data.support_item > 0) {
            this.txtSup = new TextBase(this.positionEventMode.queueroom_txt_win, data.support_item);
            if (isBig) {
                this.txtSup.changeStyle({ fontSize: 24 });
            }
            this.txtSup.x = width;
            this.txtSup.y = (this.bg.height - this.txtSup.height) / 2 + 3 * MainData.instance().scale;
            this.addChild(this.txtSup);
            this.iconSup = new SpriteBase(this.positionEventMode.queueroom_icon_win_mic);
            this.iconSup.x = this.txtSup.x + this.txtSup.width + 3 * MainData.instance().scale;
            this.iconSup.y = (this.bg.height - this.iconSup.height) / 2;
            this.addChild(this.iconSup);
            width = this.iconSup.x + this.iconSup.width + 12 * MainData.instance().scale;
        }
        LogConsole.log("end ---------------------------------")
        this.bg.width = width;
    }

    hideBg() {
        this.bg.visible = false;
    }
    get width() {
        return this.bg.width;
    }
    get height() {
        return this.bg.height;
    }
}