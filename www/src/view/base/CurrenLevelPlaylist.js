import BaseView from "../BaseView.js";
import SpriteBase from "../component/SpriteBase.js";
import MainData from "../../model/MainData.js";

export default class CurrenLevelPlaylist extends BaseView {
    constructor(tint) {
        super(game, null);

        this.positionShop = MainData.instance().positionDefaultSource;

        this.loaderPerc = 0;
        this.beginLoad = false;
        this.maxLoading = 0;

        if (tint) {
            this.bg = new SpriteBase(this.positionShop.gennes_current_level_deactive1);
        } else {
            this.bg = new SpriteBase(this.positionShop.gennes_current_level_deactive);
        }
        this.addChild(this.bg);

        if (tint) {
            this.bgLoading = new SpriteBase(this.positionShop.gennes_current_level_active1);
        } else {
            this.bgLoading = new SpriteBase(this.positionShop.gennes_current_level_active);
        }
        this.addChild(this.bgLoading);

        this.maskLoading = new Phaser.Graphics(game, this.bgLoading.width / 2, this.bgLoading.height / 2);
        this.maskLoading.anchor.setTo(0.5, 0.5);
        this.addChild(this.maskLoading);
        this.bgLoading.mask = this.maskLoading;

        this.drawMask();
    }

    drawMask() {
        if (this.maxLoading < 100 && this.maxLoading > 0) {
            this.loaderPerc = this.maxLoading;

            this.maskLoading.clear();
            this.maskLoading.beginFill(0xffffff);
            this.maskLoading.arc(0, 0, this.bgLoading.width / 2, this.game.math.degToRad(-220), this.game.math.degToRad(-220 + (this.loaderPerc * 3.6)));
            this.maskLoading.endFill();
        } else { }
    }
    get width() {
        return this.bgLoading.width;
    }
    setMaxLoading(max) {
        this.maxLoading = ((max * 80) / 100);
        if (this.maxLoading === 0) {
            this.maxLoading = 1;
        }
        this.drawMask();
    }
}