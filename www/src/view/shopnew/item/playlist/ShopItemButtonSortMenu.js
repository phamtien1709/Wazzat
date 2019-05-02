import MainData from "../../../../model/MainData.js";
import SpriteBase from "../../../component/SpriteBase.js";
import TextBase from "../../../component/TextBase.js";
import ControllSoundFx from "../../../../controller/ControllSoundFx.js";

export default class ShopItemButtonSortMenu extends Phaser.Button {
    constructor(lbContent, callback, callbackContext) {
        super(game, 0, 0, null, callback, callbackContext);

        this.positionShop = MainData.instance().positionShop;

        /*
        this.bg = new SpriteBase(this.positionShop.sort_play_list_bg_search_menu);
        this.bg.alpha = 0;
        this.bg.width = 360 * MainData.instance().scale;
        this.bg.height = 173 * MainData.instance().scale;
        this.addChild(this.bg);
        */

        this.lineNgang = new SpriteBase(this.positionShop.sort_play_list_icon_active_search_menu);
        this.addChild(this.lineNgang);

        this.lineDoc = new SpriteBase(this.positionShop.sort_play_list_linedoc_search_menu);
        this.addChild(this.lineDoc);

        this.txtContent = new TextBase(this.positionShop.sort_play_list_text_search_menu, lbContent);
        this.txtContent.setTextBounds(0, 0, this.width, this.height);
        this.addChild(this.txtContent);
    }

    get width() {
        return 213 * MainData.instance().scale;
    }

    get height() {
        return 100 * MainData.instance().scale;
    }

    active() {
        this.lineNgang.visible = true;
        this.txtContent.changeStyle({
            fill: "#ffffff"
        })
    }
    deactive() {
        this.lineNgang.visible = false;
        this.txtContent.changeStyle({
            fill: "#695782"
        })
    }

    hideDoc() {
        this.lineDoc.visible = false;
    }

    onInputDownHandler() {
        LogConsole.log("onInputDownHandler------------");
        super.onInputDownHandler();
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
    }

    destroy() {
        if (this.children) {
            while (this.children.length > 0) {
                let item = this.children[0];
                // LogConsole.log(item);
                this.removeChild(item);
                item.destroy();
                item = null;
            }
        }
        super.destroy();
    }
}