import MainData from "../../../../model/MainData.js";
import SpriteBase from "../../../component/SpriteBase.js";
import TextBase from "../../../component/TextBase.js";
import ControllSoundFx from "../../../../controller/ControllSoundFx.js";

export default class ShopItemButtonMenu extends Phaser.Button {
    constructor(lbContent, callback, callbackContext) {
        super(game, 0, 0, null, callback, callbackContext);

        this.positionShop = MainData.instance().positionShop;

        this.lineNgang = new SpriteBase(this.positionShop.playlist_menu_linengang);
        this.lineNgang.width = 224;
        this.addChild(this.lineNgang);

        this.lineDoc = new SpriteBase(this.positionShop.playlist_menu_linedoc);
        this.addChild(this.lineDoc);

        this.txtContent = new TextBase(this.positionShop.playlist_menu_textcontent, lbContent);
        this.txtContent.setTextBounds(0, 0, this.width, this.height);
        this.addChild(this.txtContent);
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

    get width() {
        return 225 * MainData.instance().scale;
    }

    get height() {
        return 87 * MainData.instance().scale
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