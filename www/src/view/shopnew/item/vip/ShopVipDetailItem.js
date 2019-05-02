import BaseView from "../../../BaseView.js";

export default class ShopVipDetailItem extends BaseView {
    constructor(data, colorText = null, alignText = null) {
        super(game);
        this.icon = this.create(0, 0, "shop", "icon_star_detail_vip");
        this.icon.y = 6;
        let corlor = "#333333";
        if (colorText !== null) {
            corlor = colorText;
        }

        let align = "center";
        if (alignText !== null) {
            align = alignText;
        }

        this.txtDes = game.add.text(this.icon.x + this.icon.width + 7, 0, data, {
            fill: corlor,
            font: "GilroyMedium",
            fontSize: 24,
            "align": align,
            "wordWrap": true,
            "wordWrapWidth": 455
        }, this);
        this.txtDes.lineSpacing = -3;
    }
}