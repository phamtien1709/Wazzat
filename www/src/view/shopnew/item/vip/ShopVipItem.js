import BaseView from "../../../BaseView.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import PlayingLogic from "../../../../controller/PlayingLogic.js";
import IPAIOS from "../../../../IPAIOS.js";
import IPA from "../../../../IPA.js";
import ControllLoading from "../../../ControllLoading.js";
import MainData from "../../../../model/MainData.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import AvatarPlayer from "../../../base/AvatarPlayer.js";
import SocketController from "../../../../controller/SocketController.js";
import Language from "../../../../model/Language.js";

export default class ShopVipItem extends BaseView {
    constructor(data = null, isDetail = false) {
        super(game, null);

        this.event = {
            show_details: new Phaser.Signal()
        }
        this.data = data;

        this.bg = this.create(0, 0, "shop", "bg_item_vip");

        this.logoVip = this.create(17, 22, "shop", "bg_vip_mask");

        if (isDetail === false) {
            this.bgTitleVip = this.create(92, 184, "shop", "vip_label_buy");

            /*
            this.title = game.add.text(285, 55, "QUYỀN LỢI", {
                fill: "#ffa140",
                fontSize: 23,
                font: "GilroyBold"
            }, this);
            this.addChild(this.title);

            this.description = game.add.text(285, 90, "Thay đổi avatar, Vip Daily reward, Vip Playlist, Vip Chat Quick", {
                fill: "#ffffff",
                fontSize: 17,
                font: "Gilroy",
                wordWrap: true,
                wordWrapWidth: 225,
                maxLines: 3
            }, this);
            this.addChild(this.description);*/


            this.btnPrice = new ButtonWithText({
                x: 375,
                y: 70,
                nameAtlas: "shop",
                nameSprite: "bg_price_vip",
                configText: {
                    x: 0,
                    y: 0,
                    style: {
                        fontSize: 20,
                        font: "GilroyBold"
                    },
                    paddingTop: 7
                }
            }, PlayingLogic.instance().format(this.data.getInt("price")) + " " + Language.instance().getData("148"), this.clickBuy, this);
            this.addChild(this.btnPrice);

            this.btnDetail = new ButtonWithText({
                x: 375,
                y: 145,
                nameAtlas: "shop",
                nameSprite: "bg_chitiet_vip",
                configText: {
                    x: 0,
                    y: 0,
                    style: {
                        fontSize: 20,
                        font: "GilroyBold"
                    },
                    paddingTop: 7
                }
            }, Language.instance().getData("158"), this.clickDetail, this);
            this.addChild(this.btnDetail);

            this.titleName = game.add.text(139, 200, this.data.getUtfString("name"), {
                fill: "#ffffff",
                fontSize: 15,
                font: "GilroyBold"
            }, this);
            this.titleName.anchor.set(0.5);
            this.addChild(this.titleName);
        } else {

            this.ava = new AvatarPlayer();
            this.ava.x = 70;
            this.ava.y = 65;
            this.ava.setAvatar(SocketController.instance().dataMySeft.avatar, 0);
            this.ava.setSize(140, 140);
            this.addChild(this.ava);
            this.addChild(this.logoVip);
            this.bgTitleVip = this.create(104, 180, "shop", "vip_label_detail_vip");

            this.txtTitle = game.add.text(285, 110, Language.instance().getData("158"), {
                fill: "#ffffff",
                fontSize: 25,
                font: "GilroyBold"
            }, this);
            this.addChild(this.txtTitle);

            console.log("convert time : " + SocketController.instance().dataMySeft.vip_expired);

            let dateFinish = new Date(SocketController.instance().dataMySeft.vip_expired);
            let dayFinish = dateFinish.getDate();
            let monthFinish = dateFinish.getMonth() + 1;
            let yearFinish = dateFinish.getFullYear();
            let hourFinish = dateFinish.getHours();
            let minuteFinish = dateFinish.getMinutes();

            let strMinuteFinish = minuteFinish;
            if (minuteFinish < 10) {
                strMinuteFinish = "0" + minuteFinish;
            }
            let strHourFinish = hourFinish;
            if (hourFinish < 10) {
                strHourFinish = "0" + hourFinish;
            }
            let strYearFinish = yearFinish;
            if (yearFinish < 10) {
                strYearFinish = "0" + yearFinish;
            }
            let strMonthFinish = monthFinish;
            if (monthFinish < 10) {
                strMonthFinish = "0" + monthFinish;
            }
            let strDayFinish = dayFinish;
            if (dayFinish < 10) {
                strDayFinish = "0" + dayFinish;
            }


            this.txtTime = game.add.text(285, 145, strHourFinish + "h" + strMinuteFinish
                + ", Ngày " + strDayFinish + "/" + strMonthFinish + "/" + strYearFinish, {
                    fill: "#ffa33a",
                    fontSize: 20,
                    font: "Gilroy"
                }, this);
            this.addChild(this.txtTime);
        }
    }

    clickBuy() {
        // console.log("clickBuy");
        if (window.cordova && typeof device !== 'undefined') {

            ControllLoading.instance().showLoading();
            if (MainData.instance().platform === "ios") {
                IPAIOS.instance().buyItem(this.data);
            } else {
                IPA.instance().buyItem(this.data);
            }
        } else {
            //ControllScreenDialog.instance().addDialog("comming soon");
            // console.log("this.data.payment_service  : " + this.data.getUtfString("payment_service"));
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

    clickDetail() {
        console.log("clickDetail");
        this.event.show_details.dispatch(this.data);
    }
}