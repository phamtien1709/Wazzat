import BaseView from "../BaseView.js";
import PopupSuggetsRatingItem from "./item/PopupSuggetsRatingItem.js";
import MainData from "../../model/MainData.js";

export default class PopupSuggetsRating extends BaseView {
    constructor() {
        super(game, null);

        this.event = {
            close: new Phaser.Signal()
        }

        this.bg = new Phaser.Button(game, 0, 0, 'screen-dim');
        this.addChild(this.bg);

        this.item = new PopupSuggetsRatingItem();
        this.item.event.close.add(this.chooseClose, this);
        this.item.x = 35 * MainData.instance().scale;
        this.item.y = game.height + 237 * MainData.instance().scale;
        this.addChild(this.item);


        this.tweenItemPopup(this.item, game.height - 850 * MainData.instance().scale);
    }

    chooseClose() {
        this.event.close.dispatch();
    }
}