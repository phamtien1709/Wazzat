import BaseView from "../../../BaseView.js";
import PopupBg from "../../../popup/item/PopupBg.js";
import TextBase from "../../../component/TextBase.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import SocketController from "../../../../controller/SocketController.js";
import ShopCommand from "../../../../model/shop/datafield/ShopCommand.js";
import SendShopBuySupportItem from "../../../../model/shop/server/senddata/SendShopBuySupportItem.js";
import Language from "../../../../model/Language.js";
import MainData from "../../../../model/MainData.js";

export default class ShopTNPopupConfirmBuyItem extends BaseView {
    constructor(data, iconStr, isSup) {
        super(game, null);

        this.event = {
            exit: new Phaser.Signal()
        }
        this.positionShop = MainData.instance().positionShop;
        this.data = data;

        this.bg = new PopupBg();
        this.bg.y = 96;
        this.addChild(this.bg);

        this.icon = new Phaser.Sprite(game, 0, 0, iconStr);
        this.icon.smoothed = true;
        this.icon.animations.pause = true;
        this.icon.animations.add('shop' + iconStr);
        this.icon.animations.play('shop' + iconStr, 30, true);
        this.icon.width = this.icon.width * 2;
        this.icon.height = this.icon.height * 2;
        this.icon.x = (this.bg.width - this.icon.width) / 2;
        this.icon.y = (200 * MainData.instance().scale - this.icon.height) / 2;
        this.addChild(this.icon);

        this.txtName = new TextBase(this.positionShop.popup_confirm_txt_name, data.getUtfString("name"));
        this.txtName.setTextBounds(0, 0, this.bg.width, 64);
        this.addChild(this.txtName);

        this.txtPrice = new TextBase(this.positionShop.popup_confirm_txt_price, data.getInt("quantity"));
        this.txtPrice.setTextBounds(0, 0, this.bg.width, 48);
        this.addChild(this.txtPrice);

        this.txtDes = new TextBase(this.positionShop.popup_confirm_txt_des, Language.instance().getData("147"));
        this.txtDes.setTextBounds(0, 0, this.bg.width, 91);
        this.addChild(this.txtDes);

        this.btnThoat = new ButtonWithText(this.positionShop.popup_confirm_button_thoat, Language.instance().getData("9"), this.chooseExit, this);
        this.addChild(this.btnThoat);

        if (isSup) {
            this.btnBuy = new ButtonWithText(this.positionShop.popup_confirm_button_mua_diamond, data.getInt("price"), this.chooseBuyDiamond, this);
        } else {
            this.btnBuy = new ButtonWithText(this.positionShop.popup_confirm_button_mua, data.getInt("price") + Language.instance().getData("148"), this.chooseBuy, this);
        }
        this.addChild(this.btnBuy);
        //this.icon = new SpriteBase();
    }

    chooseExit() {
        this.event.exit.dispatch();
    }

    chooseBuyDiamond() {
        this.btnBuy.inputEnabled = false;
        SocketController.instance().sendData(ShopCommand.RESOURCE_BUY_SUPPORT_ITEM_REQUEST, SendShopBuySupportItem.begin(this.data.getInt("id")));
        this.event.exit.dispatch();
    }
}