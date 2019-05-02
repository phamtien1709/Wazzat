import MainData from "../../../../model/MainData.js";
import SpriteScale9Base from "../../../component/SpriteScale9Base.js";
import TextBase from "../../../component/TextBase.js";
import ControllSoundFx from "../../../../controller/ControllSoundFx.js";

export default class ShopItemGennes extends Phaser.Button {
    constructor(callback, scope) {
        super(game, 0, 0, null, callback, scope);
        this.data = null;
        this.idx = 0;
        this.positionShop = MainData.instance().positionShop;

        this.bgGenes = new SpriteScale9Base(this.positionShop.gennes_bg_item);
        this.addChild(this.bgGenes);

        this.bgGenesActive = new SpriteScale9Base(this.positionShop.gennes_bg_item_active);
        this.addChild(this.bgGenesActive);

        this.lbGennes = new TextBase(this.positionShop.gennes_text_item);
        this.addChild(this.lbGennes);

        this.deactive();
    }

    active() {
        this.bgGenesActive.visible = true;
        this.bgGenes.visible = false;
        //this.bgGenes.tint = 0xBD3367;
    }

    deactive() {
        this.bgGenesActive.visible = false;
        this.bgGenes.visible = true;
        //this.bgGenes.tint = 0x665575;
    }

    get width() {
        return this.bgGenes.width;
    }
    get height() {
        return this.bgGenes.height;
    }

    getData() {
        return this.data;
    }
    setData(data, idx) {
        this.data = data;
        this.idx = idx;
        this.lbGennes.text = this.data.genre;
        this.bgGenes.width = this.lbGennes.width + 35 * MainData.instance().scale;
        this.bgGenes.height = 65 * MainData.instance().scale;

        this.bgGenesActive.width = this.lbGennes.width + 35 * MainData.instance().scale;
        this.bgGenesActive.height = 65 * MainData.instance().scale;

        this.lbGennes.x = (this.bgGenes.width - this.lbGennes.width) / 2;
        this.lbGennes.y = (this.bgGenes.height - this.lbGennes.height) / 2;

        LogConsole.log(this.lbGennes.width);
        LogConsole.log(this.bgGenes.width);
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