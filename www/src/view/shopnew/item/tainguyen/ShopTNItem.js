import SpriteBase from "../../../component/SpriteBase.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import TextBase from "../../../component/TextBase.js";
import MainData from "../../../../model/MainData.js";
import BaseView from "../../../BaseView.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import IPA from "../../../../IPA.js";
import IronSource from "../../../../IronSource.js";
import PlayingLogic from "../../../../controller/PlayingLogic.js";
import ControllLoading from "../../../ControllLoading.js";
import SocketController from "../../../../controller/SocketController.js";
import ShopCommand from "../../../../model/shop/datafield/ShopCommand.js";
import SendShopWatchAds from "../../../../model/shop/server/senddata/SendShopWatchAds.js";
import IPAIOS from "../../../../IPAIOS.js";
import Language from "../../../../model/Language.js";
export default class ShopTNItem extends BaseView {
    constructor(data, iconStr, isSup) {
        super(game, null);
        this.positionShop = MainData.instance().positionShop;
        this.data = data;
        this.iconStr = iconStr;
        this.isSup = isSup;
        this.timeWait = 0;
        this.timerToCountTime = null;

        this.totalVideo = null;

        this.bg = new SpriteBase(this.positionShop.tn_item_bg);
        this.addChild(this.bg);

        this.btnNamePackage = new ButtonWithText(this.positionShop.tn_item_package_name, data.getUtfString("name"));
        this.addChild(this.btnNamePackage);

        this.txtPrice = new TextBase(this.positionShop.tn_item_price, PlayingLogic.instance().format(data.getInt("quantity")));
        this.txtPrice.setTextBounds(0, 0, 200 * MainData.instance().scale, 52 * MainData.instance().scale);
        this.addChild(this.txtPrice);

        this.icon = new Phaser.Sprite(game, 0, 0, iconStr);
        this.icon.smoothed = true;
        this.icon.animations.pause = true;
        this.icon.animations.add('shop' + iconStr);
        this.icon.x = (this.bg.width - this.icon.width) / 2;
        this.icon.y = 90 * MainData.instance().scale + (60 * MainData.instance().scale - this.icon.height) / 2;
        this.icon.animations.play('shop' + iconStr, 30, true);
        this.addChild(this.icon);

        if (isSup) {
            if (data.getUtfString("price_type") === "ADS") {
                this.checkShowTotalVideo();
            } else {
                this.buyItem = new ButtonWithText(this.positionShop.tn_item_total_support, PlayingLogic.instance().format(data.getInt("price")), this.buyDiamond, this);
                this.addChild(this.buyItem);
            }
        } else {
            if (data.getUtfString("price_type") === "ADS") {
                this.checkShowTotalVideo();
            } else {
                this.totalMoney = new ButtonWithText(this.positionShop.tn_item_total_money, PlayingLogic.instance().format(data.getInt("price")) + Language.instance().getData("148"), this.chooseBuy, this);
                this.addChild(this.totalMoney)
            }
        }
    }

    addEvent() {
        IronSource.instance().event.rewardedVideoRewardReceived.add(this.rewardedVideoRewardReceived, this);
        IronSource.instance().event.rewardedVideoFailed.add(this.rewardedVideoFailed, this);
        IronSource.instance().event.rewardedVideoClosed.add(this.rewardedVideoClosed, this);

        if (MainData.instance().platform === "ios") {
            IPAIOS.instance().event.buy_complete.add(this.removeLoading, this);
            IPAIOS.instance().event.buy_error.add(this.removeLoading, this);
        } else {
            IPA.instance().event.buy_complete.add(this.removeLoading, this);
            IPA.instance().event.buy_error.add(this.removeLoading, this);
        }
    }


    removeEvent() {
        IronSource.instance().event.rewardedVideoRewardReceived.remove(this.rewardedVideoRewardReceived, this);
        IronSource.instance().event.rewardedVideoFailed.remove(this.rewardedVideoFailed, this);
        IronSource.instance().event.rewardedVideoClosed.remove(this.rewardedVideoClosed, this);

        if (MainData.instance().platform === "ios") {
            IPAIOS.instance().event.buy_complete.remove(this.removeLoading, this);
            IPAIOS.instance().event.buy_error.remove(this.removeLoadingError, this);
        } else {
            IPA.instance().event.buy_complete.remove(this.removeLoading, this);
            IPA.instance().event.buy_error.remove(this.removeLoadingError, this);
        }
    }

    rewardedVideoClosed() {
        ControllLoading.instance().hideLoading();
    }

    rewardedVideoFailed() {
        ControllLoading.instance().hideLoading();
        ControllScreenDialog.instance().addDialog(Language.instance().getData("144"));
    }

    rewardedVideoRewardReceived() {
        ControllLoading.instance().hideLoading();
        SocketController.instance().sendData(
            ShopCommand.RESOURCE_PACKAGE_WATCHED_ADS_CLAIM_REQUEST,
            SendShopWatchAds.begin(
                this.data.getInt("id"),
                this.data.getInt("quantity"),
                this.data.getUtfString("resource_type")
            )
        );
    }

    checkShowTotalVideo() {
        this.removeTotalVideo();

        if (this.data.getBool("isAllowWatch") === true) {
            this.totalVideo = new ButtonWithText(this.positionShop.tn_item_total_video, "1x", this.chooseBuyVideo, this);
            this.addEvent();
        } else {
            this.timeWait = parseInt((this.data.getLong("next_watched_at") - this.getTime()) / 1000);
            if (this.timeWait > 0) {
                this.totalVideo = new ButtonWithText(this.positionShop.tn_item_total_video_wait, "");
                this.stopCountTime();
                this.timerToCountTime = this.game.time.create(true);
                this.timerToCountTime.loop(1000, this.onTimerToCountTime, this);
                this.timerToCountTime.start();
                this.setTextTimer();
            } else {
                this.totalVideo = new ButtonWithText(this.positionShop.tn_item_total_video, "1x", this.chooseBuyVideo, this);
                this.addEvent();
            }
        }

        this.addChild(this.totalVideo);
    }

    onTimerToCountTime() {
        this.timeWait = this.timeWait - 1;
        if (this.timeWait < 0) {
            this.timeWait = 0;
        }
        if (this.timeWait === 0) {
            this.stopCountTime();
            //this.data.getBool("isAllowWatch") = true;
            //this.checkShowTotalVideo();
            ControllLoading.instance().showLoading();
            MainData.instance().dataPackage = null;
            if (MainData.instance().platform === "ios") {
                IPAIOS.instance().getDataInapp();
            } else {
                IPA.instance().getDataInapp();
            }
        } else {
            this.setTextTimer();
        }
    }
    setTextTimer() {
        let strTime = "";

        let strH = ""
        let strM = "";
        let strS = "";

        let timeH = parseInt(this.timeWait / 3600);
        let timeM = 0;
        let timeS = 0;

        if (timeH > 0) {
            if (timeH > 9) {
                strH = timeH + ":";
            } else {
                strH = "0" + timeH + ":";
            }
            timeM = parseInt((this.timeWait % 3600) / 60);
            timeS = this.timeWait - (timeH * 3600 + timeM * 60);
        } else {
            timeM = parseInt(this.timeWait / 60);
            timeS = this.timeWait % 60;
        }

        if (timeM > 9) {
            strM = timeM + ":";
        } else {
            strM = "0" + timeM + ":";
        }

        if (timeS > 9) {
            strS = timeS + "";
        } else {
            strS = "0" + timeS;
        }

        strTime = strH + strM + strS;

        this.totalVideo.setText(strTime);
    }

    stopCountTime() {
        if (this.timerToCountTime !== null) {
            this.timerToCountTime.stop();
            this.timerToCountTime.destroy();
            this.timerToCountTime = null;
        }
    }

    removeTotalVideo() {
        if (this.totalVideo !== null) {
            this.removeChild(this.totalVideo);
            this.totalVideo.destroy();
            this.totalVideo = null;
        }
    }

    buyDiamond() {
        LogConsole.log("buyDiamond");
        ControllScreenDialog.instance().addPopupConfirmBuyItemShop(this.data, this.iconStr, this.isSup);
    }

    chooseBuy() {
        LogConsole.log("chooseBuy");
        //ControllScreenDialog.instance().addDialog("comming soon");    
        if (window.cordova && typeof device !== 'undefined') {

            ControllLoading.instance().showLoading();
            if (MainData.instance().platform === "ios") {
                IPAIOS.instance().buyItem(this.data);
            } else {
                IPA.instance().buyItem(this.data);
            }
            this.removeIdLoading();
            this.idRemoveLoading = game.time.events.add(Phaser.Timer.SECOND * 10, this.removeLoading, this);
        } else {
            //ControllScreenDialog.instance().addDialog("comming soon");
            console.log("this.data.payment_service  : " + this.data.getUtfString("payment_service"));
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

    removeLoadingError(str) {
        this.removeLoading();
        if (str !== "") {
            ControllScreenDialog.instance().addDialog(str);
        }
    }

    removeLoading() {
        this.removeIdLoading();
        ControllLoading.instance().hideLoading();
    }
    removeIdLoading() {
        if (this.idRemoveLoading !== null) {
            game.time.events.remove(this.idRemoveLoading);
        }
    }

    chooseBuyVideo() {
        LogConsole.log("chooseBuyVideo");
        if (window.cordova && typeof device !== 'undefined') {
            ControllLoading.instance().showLoading();
            IronSource.instance().showRewardVideoInappPurchase(this.data.getUtfString("resource_type"));
        } else {
            ControllScreenDialog.instance().addDialog(Language.instance().getData("146"));
        }
    }

    get width() {
        return 213 * MainData.instance().scale;
    }
    get height() {
        return 324 * MainData.instance().scale;
    }

    destroy() {
        this.stopCountTime();
        this.removeEvent();
        super.destroy();
    }
}