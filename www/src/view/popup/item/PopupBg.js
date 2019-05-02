import BaseView from "../../BaseView.js";
import SpriteBase from "../../component/SpriteBase.js";
import SpriteScale9Base from "../../component/SpriteScale9Base.js";
import MainData from "../../../model/MainData.js";


export default class PopupBg extends BaseView {
    constructor() {
        super(game, null);
        this.positionPopup = MainData.instance().positionPopup;
        this.topBg = new SpriteBase(this.positionPopup.popup_confirm_top_bg);
        this.addChild(this.topBg);

        this.bgText = new SpriteScale9Base(this.positionPopup.popup_confirm_bg_text);
        this.addChild(this.bgText);
    }

    setHeight(_height) {
        this.bgText.height = _height;
    }
    setWidth(_width) {
        this.bgText.width = _width;
        this.topBg.width = _width;
    }

    get width() {
        return this.topBg.width;
    }
}