import BaseView from "../../../BaseView.js";
import SpriteScale9Base from "../../../component/SpriteScale9Base.js";
import PlayingLogic from "../../../../controller/PlayingLogic.js";
import IPA from "../../../../IPA.js";
import IPAIOS from "../../../../IPAIOS.js";
import ShopVipDetailItem from "./ShopVipDetailItem.js";
import ListView from "../../../../../libs/listview/list_view.js";
import ControllLoading from "../../../ControllLoading.js";
import MainData from "../../../../model/MainData.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import Language from "../../../../model/Language.js";

export default class ShopVipDetails extends BaseView {
    constructor(data) {
        super(game);

        this.event = {
            close: new Phaser.Signal()
        }

        this.data = data;

        let arrText = [
            Language.instance().getData("149"),
            Language.instance().getData("150"),
            Language.instance().getData("151"),
            Language.instance().getData("152"),
            Language.instance().getData("153"),
            Language.instance().getData("154"),
            Language.instance().getData("155"),
            Language.instance().getData("156")
        ]

        let bgMask = game.add.button(0, 0, "");
        this.addChild(bgMask);

        let objConfig = {};
        objConfig.x = 0;
        objConfig.y = 0;
        objConfig.name = "bg_detail_vip";
        objConfig.nameAtlas = "shop";
        objConfig.nameSprite = "bg_detail_vip";
        objConfig.left = 284;
        objConfig.right = 284;
        objConfig.top = 310;
        objConfig.bot = 30;
        objConfig.width = 569;
        objConfig.height = 880;
        this.bg = new SpriteScale9Base(objConfig);
        this.addChild(this.bg);

        bgMask.width = this.bg.width;
        bgMask.height = this.bg.height;

        this.titleName = game.add.text(this.bg.width / 2, 257, this.data.getUtfString("name"), {
            fill: "#ffffff",
            fontSize: 20,
            font: "GilroyBold"
        }, this);

        this.titleName.anchor.set(0.5);



        let parentListVip = new Phaser.Group(game, 0, 0, null);
        this.listVip = new ListView(game, parentListVip, new Phaser.Rectangle(0, 0, this.bg.width, 405), {
            direction: 'y',
            padding: 10,
            searchForClicks: false
        });

        parentListVip.x = 0;
        parentListVip.y = 320;
        this.addChild(parentListVip);

        for (let i = 0; i < arrText.length; i++) {
            let item = new ShopVipDetailItem(arrText[i]);
            item.x = (this.bg.width - item.width) / 2;
            this.listVip.add(item);
        }


        this.btnThoat = game.add.button(35, 750, "shop", this.chooseThoat, this, "Button_Thoat", "Button_Thoat", "Button_Thoat", "Button_Thoat");
        this.addChild(this.btnThoat);
        this.txtThoat = game.add.text(this.btnThoat.width / 2, this.btnThoat.height / 2 + 5, Language.instance().getData("157"), {
            fill: "#ffffff",
            font: "GilroyBold",
            fontSize: 32
        }, this);

        this.txtThoat.anchor.set(0.5);
        this.btnThoat.addChild(this.txtThoat);

        this.btnBuy = game.add.button(295, 750, "shop", this.chooseBuy, this, "Button_Tien_Vip_Detail", "Button_Tien_Vip_Detail", "Button_Tien_Vip_Detail", "Button_Tien_Vip_Detail");
        this.addChild(this.btnBuy);

        this.txtPrice = game.add.text(this.btnBuy.width / 2, this.btnBuy.height / 2 + 5, PlayingLogic.instance().format(this.data.getInt("price")) + " " + Language.instance().getData("148"), {
            fill: "#ffffff",
            font: "GilroyBold",
            fontSize: 32
        }, this);
        this.txtPrice.anchor.set(0.5);
        this.btnBuy.addChild(this.txtPrice);
    }

    get width() {
        return this.bg.width;
    }

    get height() {
        return this.bg.height;
    }

    chooseThoat() {
        this.event.close.dispatch();
    }

    chooseBuy() {
        // console.log("clickBuy");
        if (window.cordova && typeof device !== 'undefined') {
            ControllLoading.instance().showLoading();
            if (MainData.instance().platform === "ios") {
                IPAIOS.instance().buyItem(this.data);
            } else {
                IPA.instance().buyItem(this.data);
            }
        } else {
            if (this.data.getUtfString("payment_service") === "FACEBOOK") {
                if (window.RESOURCE.fb_products.hasOwnProperty(this.data.getUtfString("pack_name"))) {
                    let linkProduct = window.RESOURCE.fb_products[this.data.getUtfString("pack_name")];
                    IPA.instance().callToServerFacebook(linkProduct);
                } else {
                    ControllScreenDialog.instance().addDialog(Language.instance().getData("145"));
                }
            }

        }
    }

    destroy() {
        if (this.listVip !== null) {
            this.listVip.removeAll();
            this.listVip.destroy();
            this.listVip = null;
        }

        super.destroy();
    }
}