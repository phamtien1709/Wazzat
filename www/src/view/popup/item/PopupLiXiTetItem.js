import BaseView from "../../BaseView.js";
import SpriteBase from "../../component/SpriteBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import TextBase from "../../component/TextBase.js";
import MainData from "../../../model/MainData.js";
import PlayingLogic from "../../../controller/PlayingLogic.js";

export default class PopupLiXiTetItem extends BaseView {
    constructor() {
        super(game, null);
        this.positionPopup = MainData.instance().positionPopup;
        this.bg = new SpriteBase(this.positionPopup.popup_bg_lixi);
        this.addChild(this.bg);

        this.btnNhanLixi = new ButtonBase(this.positionPopup.popup_button_nhan_lixi, this.chooseNhanLixi, this);
        this.btnNhanLixi.x = (this.bg.width - this.btnNhanLixi.width) / 2;
        this.addChild(this.btnNhanLixi);

        this.txtGold = new TextBase(this.positionPopup.popup_textgold_lixi, "0");
        this.txtGold.setTextBounds(0, 0, 136, 45);
        this.addChild(this.txtGold);

        this.txtSup = new TextBase(this.positionPopup.popup_textsup_lixi, "0");
        this.txtSup.setTextBounds(0, 0, 136, 45);
        this.addChild(this.txtSup);

        this.txtTicket = new TextBase(this.positionPopup.popup_textticket_lixi, "0");
        this.txtTicket.setTextBounds(0, 0, 136, 45);
        this.addChild(this.txtTicket);

        this.firework = new Phaser.Sprite(game, 0, 0, "fireworktet");
        this.firework.x = 40 * MainData.instance().scale;
        this.firework.y = 50 * MainData.instance().scale;

        let anim = this.firework.animations.add('playfireworktet');
        anim.onLoop.add(this.animationLooped, this);
        this.firework.animations.play('playfireworktet', 30, true);

        this.addChild(this.firework);
    }

    animationLooped() {
        this.firework.x = PlayingLogic.instance().randomNumber(20, 90);
        this.firework.y = PlayingLogic.instance().randomNumber(20, 100);
    }

    chooseNhanLixi() {
        console.log("chooseNhanLixi");
    }
}