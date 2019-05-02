import ButtonBase from "../../component/ButtonBase.js";
import TextBase from "../../component/TextBase.js";
import SpriteBase from "../../component/SpriteBase.js";
import MainData from "../../../model/MainData.js";

export default class ShopNewButtonBotMenu extends ButtonBase {
    constructor(objConfig, callback, scope) {

        super(objConfig, callback, scope);

        this.positionShop = MainData.instance().positionShop;
        this.btn = null;
        this.idx = -1;
        this.txtContent = new TextBase(this.positionShop.bot_menu_text_button, "");
        this.txtContent.setTextBounds(0, 0, 160 * MainData.instance().scale, 27 * MainData.instance().scale);
        this.addChild(this.txtContent);

        this.lineDoc = new SpriteBase(this.positionShop.playlist_menu_linedoc);
        this.lineDoc.x = 159 * MainData.instance().scale;
        this.lineDoc.y = 41 * MainData.instance().scale;
        this.addChild(this.lineDoc);
    }

    setButton(data, idx) {
        this.idx = idx;

        this.btn = new SpriteBase(data.obj);
        LogConsole.log("this.width : " + this.width + " this.btn.width " + this.btn.width);
        this.btn.x = (this.width - this.btn.width) / 2; // 43
        this.addChild(this.btn);

        this.txtContent.text = data.content;
        if (idx == 3) {
            this.lineDoc.visible = false;
        }
    }

    getIdx() {
        return this.idx;
    }



    active() {
        this.btn.alpha = 1;
        this.btn.y = 25 * MainData.instance().scale;
        this.txtContent.visible = true;
    }

    deactive() {
        this.btn.alpha = 0.2;
        this.btn.y = 41 * MainData.instance().scale;
        this.txtContent.visible = false;
    }


}